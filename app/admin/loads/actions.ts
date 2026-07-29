"use server";

import { logActivity } from "@/lib/activity-log";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function uploadRateConfirmation(
  supabase: Awaited<ReturnType<typeof createClient>>,
  loadId: string,
  loadNumber: string,
  file: File | null
) {
  if (!file || file.size === 0) return null;

  const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
  const safeLoadNumber = (loadNumber || "load")
    .replace(/[^a-zA-Z0-9-_]/g, "_")
    .slice(0, 40);
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

export async function addLoad(formData: FormData) {
  const supabase = await createClient();

  const load_number = formData.get("load_number") as string;
  const customer = formData.get("customer") as string;
  const origin = formData.get("origin") as string;
  const destination = formData.get("destination") as string;
  const pickup_date = formData.get("pickup_date") as string;
  const delivery_date = formData.get("delivery_date") as string;
  const driver_id = formData.get("driver_id") as string;
  const truck_id = formData.get("truck_id") as string;
  const notes = (formData.get("notes") as string) || null;

  const rate = parseFloat((formData.get("rate") as string) || "0") || 0;
  const accessorials =
    parseFloat((formData.get("accessorials") as string) || "0") || 0;

  const gross = Number((rate + accessorials).toFixed(2));

  const { data: created, error } = await supabase
    .from("loads")
    .insert({
      load_number,
      customer: customer || null,
      origin: origin || null,
      destination: destination || null,
      pickup_date: pickup_date || null,
      delivery_date: delivery_date || null,
      linehaul: rate,
      detention: 0,
      accessorials,
      fuel_surcharge: 0,
      rate: gross,
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

  const file = formData.get("rate_confirmation") as File | null;
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

  revalidatePath("/admin/loads");
}

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
  const payment_status =
    (formData.get("payment_status") as string) || "unbilled";
  const payment_date = (formData.get("payment_date") as string) || null;
  const factoring_ref = (formData.get("factoring_ref") as string) || null;

    const rate = parseFloat((formData.get("rate") as string) || "0") || 0;

  const accessorials =
    parseFloat((formData.get("accessorials") as string) || "0") || 0;
  const gross = Number((rate + accessorials).toFixed(2));

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
      ...(path ? { rate_confirmation_path: path } : {}),
    })
    .eq("id", loadId);

  if (error) {
    console.error(error);
    throw new Error("Failed to update load");
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