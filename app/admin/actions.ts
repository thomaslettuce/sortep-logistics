/**
"use server";

import { logActivity } from "@/lib/activity-log";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function approveDriver(formData: FormData) {
  const driverId = formData.get("driverId") as string;
  const supabase = await createClient();

  await supabase
    .from("drivers")
    .update({ status: "approved" })
    .eq("id", driverId);

  await logActivity({
    action: "approve",
    entityType: "driver",
    entityId: driverId,
    summary: `Approved driver ${driverId}`,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/drivers");
  revalidatePath("/admin/activity");
}

export async function rejectDriver(formData: FormData) {
  const driverId = formData.get("driverId") as string;
  const supabase = await createClient();

  await supabase
    .from("drivers")
    .update({ status: "rejected" })
    .eq("id", driverId);

  await logActivity({
    action: "reject",
    entityType: "driver",
    entityId: driverId,
    summary: `Rejected driver ${driverId}`,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/drivers");
  revalidatePath("/admin/activity");
}
**/