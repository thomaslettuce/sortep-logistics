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
  const rate = formData.get("rate") as string;
  const status = formData.get("status") as string;
  const driver_id = formData.get("driver_id") as string;
  const truck_id = formData.get("truck_id") as string;

  await supabase.from("loads").insert({
    load_number,
    customer: customer || null,
    origin: origin || null,
    destination: destination || null,
    pickup_date: pickup_date || null,
    delivery_date: delivery_date || null,
    rate: rate ? parseFloat(rate) : null,
    status: status || "booked",
    driver_id: driver_id || null,
    truck_id: truck_id || null,
  });

  await logActivity({
    action: "create",
    entityType: "load",
    summary: `Created load ${load_number}`,
  });

  revalidatePath("/admin/loads");
}

export async function updateLoadStatus(formData: FormData) {
  const supabase = await createClient();

  const loadId = formData.get("loadId") as string;
  const status = formData.get("status") as string;

  await supabase.from("loads").update({ status }).eq("id", loadId);

  await logActivity({
    action: "update",
    entityType: "load",
    entityId: loadId,
    summary: `Updated load status to ${status}`,
  });

  revalidatePath("/admin/loads");
  redirect("/admin/loads");
}