"use server";

import { logActivity } from "@/lib/activity-log";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

  await supabase.from("loads").insert({
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
  });

  await logActivity({
    action: "create",
    entityType: "load",
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