"use server";

import { logActivity } from "@/lib/activity-log";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function approveDriver(formData: FormData) {
  const supabase = await createClient();
  const driverId = formData.get("driverId") as string;

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

  revalidatePath("/admin/drivers");
}

export async function rejectDriver(formData: FormData) {
  const supabase = await createClient();
  const driverId = formData.get("driverId") as string;

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

  revalidatePath("/admin/drivers");
}

export async function updateDriverCompensation(formData: FormData) {
  const supabase = await createClient();

  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) redirect("/auth/login");

  const { data: adminDriver } = await supabase
    .from("drivers")
    .select("role")
    .eq("user_id", authData.user.id)
    .single();

  if (!adminDriver || adminDriver.role !== "admin") {
    redirect("/portal");
  }

  const driverId = formData.get("driverId") as string;
  const fullName = (formData.get("full_name") as string) || null;
  const phone = (formData.get("phone") as string) || null;
  const driverIdCode = (formData.get("driver_id_code") as string) || null;
  const employmentType =
    (formData.get("employment_type") as string) || "company_driver";
  const startDate = (formData.get("start_date") as string) || null;
  const role = (formData.get("role") as string) || "driver";

  const driverPayRaw = formData.get("driver_pay_pct") as string;

  // Only company drivers can have a pay % override.
  // Lease-on and factoring are always global from Company Settings.
  const driver_pay_pct =
    employmentType === "company_driver"
      ? driverPayRaw === "" || driverPayRaw == null
        ? null
        : parseFloat(driverPayRaw)
      : null;

  const lease_on_fee_pct = null;
  const factoring_fee_pct = null;

  const { error } = await supabase
    .from("drivers")
    .update({
      full_name: fullName,
      phone,
      driver_id: driverIdCode,
      employment_type: employmentType,
      start_date: startDate,
      role,
      driver_pay_pct,
      lease_on_fee_pct,
      factoring_fee_pct,
    })
    .eq("id", driverId);

  if (error) {
    console.error("Failed to update driver compensation:", error);
    throw new Error("Failed to update driver");
  }

  await logActivity({
    action: "update",
    entityType: "driver",
    entityId: driverId,
    summary: `Updated driver settings for ${fullName || driverId}`,
  });

  revalidatePath("/admin/drivers");
  redirect("/admin/drivers?updated=1");
}