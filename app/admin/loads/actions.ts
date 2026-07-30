"use server";

/**
 * =============================================================================
 * LOADS SERVER ACTIONS — SORTEP LOGISTICS
 * =============================================================================
 *
 * PURPOSE
 * -------
 * Server-side mutations for the Admin/Dispatcher Loads UI:
 *   - Create a load (ops + revenue fields)
 *   - Update a load (including payment tracking for admins)
 *   - Upload / replace rate confirmation documents in Supabase Storage
 *
 * RELATED UI
 * ----------
 * - app/admin/loads/page.tsx          → "Add New Load" form
 * - components/AdminLoadsTable.tsx    → expandable row edit form
 * - components/RateConfirmationButton.tsx → View/Download signed URL
 * - app/admin/loads/document-actions.ts   → createSignedUrl helper
 *
 * DATA MODEL (public.loads) — key columns
 * ---------------------------------------
 * - load_number, customer, origin, destination
 * - pickup_date, delivery_date
 * - linehaul          → broker linehaul / base rate (dollars)
 * - accessorials      → detention, FSC, etc. rolled into one field
 * - rate              → GROSS used by payouts = linehaul + accessorials
 * - status            → 'in_transit' | 'delivered'  (ops status)
 * - payment_status    → 'unbilled' | 'factored' | 'paid'  (company AR)
 * - payment_date, factoring_ref
 * - rate_confirmation_path → Storage object path (private bucket)
 * - driver_id, truck_id, notes
 *
 * STORAGE
 * -------
 * Bucket: load-documents (PRIVATE)
 * Path pattern: {loadId}/{LoadNumber}_rateconfirmation.{ext}
 * Example:  b0af4d28-.../LD-1001_rateconfirmation.pdf
 *
 * RLS / PERMISSIONS
 * -----------------
 * - Admins + dispatchers can insert/update loads and upload docs
 *   (see is_dispatcher_or_admin() + storage.objects policies)
 * - payment_status fields are shown only to admins in the UI
 * - Drivers never hit these actions
 *
 * PAYOUTS INTEGRATION
 * -------------------
 * Payout generation reads loads.rate (gross) for loads in a pay-period
 * date range. Changing rate/accessorials on a load will affect future
 * "Generate / Refresh Payouts" runs. Prefer not to change gross after
 * a period is closed.
 *
 * NEXT.CONFIG
 * -----------
 * Server Actions body size is raised (e.g. 10mb) so PDF rate cons
 * can be uploaded. See next.config.ts → serverActions.bodySizeLimit.
 * =============================================================================
 */

import { logActivity } from "@/lib/activity-log";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * uploadRateConfirmation
 * ----------------------
 * Uploads a rate confirmation file to Supabase Storage and returns the
 * object path to store on loads.rate_confirmation_path.
 *
 * @param supabase   Server Supabase client (user session / RLS applies)
 * @param loadId     UUID of the load (used as folder name for isolation)
 * @param loadNumber Human load # — used in the filename for easy search
 * @param file       File from FormData, or null/empty if user skipped upload
 * @returns          Storage path string, or null if no file was provided
 *
 * MAINTENANCE NOTES
 * - Bucket name must stay "load-documents" unless you update policies too
 * - upsert: true replaces the file at the same path on re-upload
 * - If load_number changes on edit, a NEW path is written; old file may
 *   remain orphaned in Storage (optional cleanup job later)
 * - MIME defaults to application/pdf when the browser omits type
 */
async function uploadRateConfirmation(
  supabase: Awaited<ReturnType<typeof createClient>>,
  loadId: string,
  loadNumber: string,
  file: File | null
) {
  // No file chosen (edit form allows optional replace)
  if (!file || file.size === 0) return null;

  const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";

  // Sanitize load number so it is safe as a storage object key segment
  const safeLoadNumber = (loadNumber || "load")
    .replace(/[^a-zA-Z0-9-_]/g, "_")
    .slice(0, 40);

  // Folder per load keeps documents grouped and avoids name collisions
  const path = `${loadId}/${safeLoadNumber}_rateconfirmation.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from("load-documents")
    .upload(path, buffer, {
      contentType: file.type || "application/pdf",
      upsert: true,
    });

  if (error) {
    console.error("rate confirmation upload error:", error);
    throw new Error(error.message || "Failed to upload rate confirmation");
  }

  return path;
}

/**
 * addLoad
 * -------
 * Creates a new load from the "Add New Load" form.
 *
 * Business rules encoded here:
 * - New loads always start as status = 'in_transit'
 * - gross (rate column) = linehaul + accessorials
 * - Rate confirmation is expected from the UI (required attribute);
 *   still allow null path if upload is skipped/fails after insert
 * - payment_status defaults to 'unbilled' at the DB level
 *
 * Form field names (must match the page form):
 * load_number, customer, origin, destination, pickup_date, delivery_date,
 * rate, accessorials, driver_id, truck_id, notes, rate_confirmation (file)
 */
export async function addLoad(formData: FormData) {
  const supabase = await createClient();

  // --- Parse text / select fields ---
  const load_number = formData.get("load_number") as string;
  const customer = formData.get("customer") as string;
  const origin = formData.get("origin") as string;
  const destination = formData.get("destination") as string;
  const pickup_date = formData.get("pickup_date") as string;
  const delivery_date = formData.get("delivery_date") as string;
  const driver_id = formData.get("driver_id") as string;
  const truck_id = formData.get("truck_id") as string;
  const notes = (formData.get("notes") as string) || null;

  // --- Money fields ---
  // "rate" on the form = linehaul only. "rate" in DB = gross for payouts.
  const rate = parseFloat((formData.get("rate") as string) || "0") || 0;
  const accessorials =
    parseFloat((formData.get("accessorials") as string) || "0") || 0;
  const gross = Number((rate + accessorials).toFixed(2));

  // Optional hard require (UI also has required on the file input)
  const file = formData.get("rate_confirmation") as File | null;
  if (!file || file.size === 0) {
    throw new Error("Rate confirmation document is required");
  }

  // Insert first so we have a load UUID for the storage folder
  const { data: created, error } = await supabase
    .from("loads")
    .insert({
      load_number,
      customer: customer || null,
      origin: origin || null,
      destination: destination || null,
      pickup_date: pickup_date || null,
      delivery_date: delivery_date || null,
      linehaul: rate, // base rate
      detention: 0, // legacy columns kept at 0; use accessorials instead
      accessorials,
      fuel_surcharge: 0,
      rate: gross, // IMPORTANT: payouts use this column as gross revenue
      notes,
      status: "in_transit",
      driver_id: driver_id || null,
      truck_id: truck_id || null,
    })
    .select("id")
    .single();

  if (error || !created) {
    console.error("addLoad insert error:", error);
    throw new Error(
      error?.message || error?.details || "Failed to create load"
    );
  }

  // Upload document and attach path on the load row
  const path = await uploadRateConfirmation(
    supabase,
    created.id,
    load_number,
    file
  );

  if (path) {
    await supabase
      .from("loads")
      .update({ rate_confirmation_path: path })
      .eq("id", created.id);
  }

  await logActivity({
    action: "create",
    entityType: "load",
    entityId: created.id,
    summary: `Created load ${load_number} (gross $${gross})`,
  });

  // Refresh the loads list UI
  revalidatePath("/admin/loads");
}

/**
 * updateLoad
 * ----------
 * Updates an existing load from the expandable edit form.
 *
 * Notes for maintainers:
 * - payment_* fields are submitted only when the admin UI shows them.
 *   Dispatchers won't send them; defaults below avoid wiping values only
 *   if the form always posts those inputs. Prefer isAdmin-only fields
 *   that still post hidden defaults, or split update permissions later.
 * - rate_confirmation_path is only overwritten when a new file is uploaded
 * - status is limited to in_transit | delivered in the UI
 * - redirect forces a full refresh so table badges show new values
 */
export async function updateLoad(formData: FormData) {
  const supabase = await createClient();

  const loadId = formData.get("loadId") as string;
  const load_number = formData.get("load_number") as string;
  const customer = formData.get("customer") as string;
  const origin = formData.get("origin") as string;
  const destination = formData.get("destination") as string;
  const pickup_date = formData.get("pickup_date") as string;
  const delivery_date = formData.get("delivery_date") as string;
  const driver_id = formData.get("driver_id") as string;
  const truck_id = formData.get("truck_id") as string;

  const notes = (formData.get("notes") as string) || null;
  const status = (formData.get("status") as string) || "in_transit";

  // Admin AR / factoring fields (see AdminLoadsTable isAdmin section)
  const payment_status =
    (formData.get("payment_status") as string) || "unbilled";
  const payment_date = (formData.get("payment_date") as string) || null;
  const factoring_ref = (formData.get("factoring_ref") as string) || null;

  const rate = parseFloat((formData.get("rate") as string) || "0") || 0;
  const accessorials =
    parseFloat((formData.get("accessorials") as string) || "0") || 0;
  const gross = Number((rate + accessorials).toFixed(2));

  // Optional file replace — null path means keep existing attachment
  const file = formData.get("rate_confirmation") as File | null;
  const path = await uploadRateConfirmation(
    supabase,
    loadId,
    load_number,
    file
  );

  const { error } = await supabase
    .from("loads")
    .update({
      load_number,
      customer: customer || null,
      origin: origin || null,
      destination: destination || null,
      pickup_date: pickup_date || null,
      delivery_date: delivery_date || null,
      linehaul: rate,
      accessorials,
      rate: gross,
      notes,
      status,
      payment_status,
      payment_date,
      factoring_ref,
      driver_id: driver_id || null,
      truck_id: truck_id || null,
      // Only set path when a new file was uploaded
      ...(path ? { rate_confirmation_path: path } : {}),
    })
    .eq("id", loadId);

  if (error) {
    console.error("updateLoad error:", error);
    throw new Error(error.message || "Failed to update load");
  }

  await logActivity({
    action: "update",
    entityType: "load",
    entityId: loadId,
    summary: `Updated load ${load_number}`,
  });

  revalidatePath("/admin/loads");
  redirect("/admin/loads");
}