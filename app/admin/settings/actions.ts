"use server";

import { logActivity } from "@/lib/activity-log";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateCompanySettings(formData: FormData) {
  const supabase = await createClient();

  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) {
    redirect("/auth/login");
  }

  const { data: driver } = await supabase
    .from("drivers")
    .select("role")
    .eq("user_id", authData.user.id)
    .single();

  if (!driver || driver.role !== "admin") {
    redirect("/portal");
  }

  const driverPayPct = parseFloat(formData.get("driver_pay_pct") as string);
  const leaseOnFeePct = parseFloat(formData.get("lease_on_fee_pct") as string);
  const factoringFeePct = parseFloat(
    formData.get("factoring_fee_pct") as string
  );

  if (
    Number.isNaN(driverPayPct) ||
    Number.isNaN(leaseOnFeePct) ||
    Number.isNaN(factoringFeePct)
  ) {
    throw new Error("All percentages must be valid numbers");
  }

  const { error } = await supabase
    .from("company_settings")
    .update({
      driver_pay_pct: driverPayPct,
      lease_on_fee_pct: leaseOnFeePct,
      factoring_fee_pct: factoringFeePct,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) {
    console.error("Failed to update company settings:", error);
    throw new Error("Failed to update company settings");
  }

  await logActivity({
    action: "update",
    entityType: "settings",
    summary: `Updated company settings (driver ${driverPayPct}%, lease-on ${leaseOnFeePct}%, factoring ${factoringFeePct}%)`,
  });

  revalidatePath("/admin/settings");
  redirect("/admin/settings?saved=1");
}