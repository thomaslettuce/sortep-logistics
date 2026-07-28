"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { logActivity } from "@/lib/activity-log";

export async function addTruck(formData: FormData) {
  const supabase = await createClient();

  const unit_number = formData.get("unit_number") as string;
  const make = formData.get("make") as string;
  const model = formData.get("model") as string;
  const year = formData.get("year") as string;
  const vin = formData.get("vin") as string;
  const license_plate = formData.get("license_plate") as string;

  await supabase.from("trucks").insert({
    unit_number,
    make: make || null,
    model: model || null,
    year: year ? parseInt(year) : null,
    vin: vin || null,
    license_plate: license_plate || null,
  });

  await logActivity({
    action: "create",
    entityType: "truck",
    summary: `Added truck unit ${unit_number}`,
  });

  revalidatePath("/admin/trucks");
}

export async function updateTruckStatus(formData: FormData) {
  const supabase = await createClient();

  const truckId = formData.get("truckId") as string;
  const status = formData.get("status") as string;

  await supabase.from("trucks").update({ status }).eq("id", truckId);

  await logActivity({
    action: "update",
    entityType: "truck",
    entityId: truckId,
    summary: `Updated truck status to ${status}`,
  });

  revalidatePath("/admin/trucks");
  redirect("/admin/trucks");
}

export async function deleteTruck(formData: FormData) {
  const supabase = await createClient();

  const truckId = formData.get("truckId") as string;

  await supabase.from("trucks").delete().eq("id", truckId);

  await logActivity({
    action: "delete",
    entityType: "truck",
    entityId: truckId,
    summary: `Deleted truck ${truckId}`,
  });

  revalidatePath("/admin/trucks");
  redirect("/admin/trucks");
}