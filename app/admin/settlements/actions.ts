"use server";

import { logActivity } from "@/lib/activity-log";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addSettlement(formData: FormData) {
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

  const driver_id = formData.get("driver_id") as string;
  const load_id = (formData.get("load_id") as string) || "";
  const settlement_date = formData.get("settlement_date") as string;
  const other_deductions =
    parseFloat((formData.get("other_deductions") as string) || "0") || 0;
  const status = (formData.get("status") as string) || "pending";
  const notes = (formData.get("notes") as string) || null;
  const manualGrossRaw = formData.get("gross_amount") as string;

  if (!driver_id) {
    throw new Error("Driver is required");
  }

  // Gross Revenue: load rate first, then manual override
  let gross = 0;
  if (load_id) {
    const { data: load } = await supabase
      .from("loads")
      .select("rate")
      .eq("id", load_id)
      .single();
    gross = Number(load?.rate || 0);
  }
  if (manualGrossRaw) {
    const manualGross = parseFloat(manualGrossRaw);
    if (!Number.isNaN(manualGross) && manualGross > 0) {
      gross = manualGross;
    }
  }

  if (gross <= 0) {
    throw new Error("Gross revenue must be greater than 0");
  }

  const { data: driver } = await supabase
    .from("drivers")
    .select("employment_type, driver_pay_pct")
    .eq("id", driver_id)
    .single();

  if (!driver) {
    throw new Error("Driver not found");
  }

  const { data: settings } = await supabase
    .from("company_settings")
    .select("driver_pay_pct, lease_on_fee_pct, factoring_fee_pct")
    .eq("id", 1)
    .single();

  const employmentType = driver.employment_type || "company_driver";

  const driverPayPctDefault = Number(settings?.driver_pay_pct ?? 25);
  const leaseOnPctDefault = Number(settings?.lease_on_fee_pct ?? 10);
  const factoringPctDefault = Number(settings?.factoring_fee_pct ?? 2);

  // Driver pay can be overridden for company drivers only.
  // Lease-on and factoring are always global from Company Settings.
  const driverPayPct =
    employmentType === "company_driver" && driver.driver_pay_pct != null
      ? Number(driver.driver_pay_pct)
      : driverPayPctDefault;

  const leaseOnPct = leaseOnPctDefault;
  const factoringPct = factoringPctDefault;

  let driver_pay_amount = 0;
  let lease_on_fee_amount = 0;
  let factoring_fee_amount = 0;
  let net_to_driver = 0;
  let company_residual = 0;
  let storedDriverPayPct: number | null = null;
  let storedLeaseOnPct: number | null = null;
  let storedFactoringPct: number | null = null;

  if (employmentType === "company_driver") {
    storedDriverPayPct = driverPayPct;
    storedFactoringPct = factoringPct;
    storedLeaseOnPct = null;

    driver_pay_amount = Number((gross * (driverPayPct / 100)).toFixed(2));
    factoring_fee_amount = Number((gross * (factoringPct / 100)).toFixed(2));
    lease_on_fee_amount = 0;

    net_to_driver = Number((driver_pay_amount - other_deductions).toFixed(2));
    company_residual = Number(
      (gross - driver_pay_amount - factoring_fee_amount).toFixed(2)
    );
  } else {
    storedDriverPayPct = null;
    storedLeaseOnPct = leaseOnPct;
    storedFactoringPct = factoringPct;

    driver_pay_amount = 0;
    lease_on_fee_amount = Number((gross * (leaseOnPct / 100)).toFixed(2));
    factoring_fee_amount = Number((gross * (factoringPct / 100)).toFixed(2));

    net_to_driver = Number(
      (
        gross -
        lease_on_fee_amount -
        factoring_fee_amount -
        other_deductions
      ).toFixed(2)
    );
    company_residual = Number(
      (lease_on_fee_amount + factoring_fee_amount).toFixed(2)
    );
  }

  const { error } = await supabase.from("settlements").insert({
    driver_id,
    load_id: load_id || null,
    settlement_date,
    gross_amount: gross,
    amount: gross,
    deductions: other_deductions,
    other_deductions,
    driver_pay_pct: storedDriverPayPct,
    driver_pay_amount,
    lease_on_fee_pct: storedLeaseOnPct,
    lease_on_fee_amount,
    factoring_fee_pct: storedFactoringPct,
    factoring_fee_amount,
    net_to_driver,
    company_residual,
    status,
    notes,
  });

  if (error) {
    console.error("Failed to create settlement:", error);
    throw new Error("Failed to create settlement");
  }

  await logActivity({
    action: "create",
    entityType: "settlement",
    summary: `Created settlement for driver ${driver_id} (gross $${gross})`,
  });

  revalidatePath("/admin/settlements");
  revalidatePath("/portal");
  redirect("/admin/settlements?created=1");
}

export async function updateSettlementStatus(formData: FormData) {
  const supabase = await createClient();
  const settlementId = formData.get("settlementId") as string;
  const status = formData.get("status") as string;

  await supabase
    .from("settlements")
    .update({ status })
    .eq("id", settlementId);

  await logActivity({
    action: "update",
    entityType: "settlement",
    entityId: settlementId,
    summary: `Updated settlement status to ${status}`,
  });

  revalidatePath("/admin/settlements");
  redirect("/admin/settlements");
}

export async function deleteSettlement(formData: FormData) {
  const supabase = await createClient();
  const settlementId = formData.get("settlementId") as string;

  await supabase.from("settlements").delete().eq("id", settlementId);

  await logActivity({
    action: "delete",
    entityType: "settlement",
    entityId: settlementId,
    summary: `Deleted settlement ${settlementId}`,
  });

  revalidatePath("/admin/settlements");
  redirect("/admin/settlements");
}