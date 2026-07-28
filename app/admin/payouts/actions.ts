"use server";

import { logActivity } from "@/lib/activity-log";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPayPeriod(formData: FormData) {
  const supabase = await createClient();

  const start_date = formData.get("start_date") as string;
  const end_date = formData.get("end_date") as string;
  const notes = (formData.get("notes") as string) || null;

  if (!start_date || !end_date) {
    throw new Error("Start and end dates are required");
  }

  const name = `${start_date} to ${end_date}`;

  const { data, error } = await supabase
    .from("pay_periods")
    .insert({
      name,
      start_date,
      end_date,
      status: "open",
      notes,
    })
    .select("id")
    .single();

  if (error) {
    console.error(error);
    throw new Error("Failed to create pay period");
  }

  await logActivity({
    action: "create",
    entityType: "pay_period",
    entityId: data.id,
    summary: `Created pay period ${name}`,
  });

  revalidatePath("/admin/payouts");
  redirect(`/admin/payouts/${data.id}`);
}

export async function generatePayouts(formData: FormData) {
  const supabase = await createClient();
  const payPeriodId = formData.get("pay_period_id") as string;

  const { data: period } = await supabase
    .from("pay_periods")
    .select("*")
    .eq("id", payPeriodId)
    .single();

  if (!period) throw new Error("Pay period not found");
  if (period.status === "closed") throw new Error("Pay period is closed");

  const { data: settings } = await supabase
    .from("company_settings")
    .select("*")
    .eq("id", 1)
    .single();

  const defaultDriverPay = Number(settings?.driver_pay_pct ?? 25);
  const defaultLeaseOn = Number(settings?.lease_on_fee_pct ?? 10);
  const defaultFactoring = Number(settings?.factoring_fee_pct ?? 2);

  // Drivers who had loads in this period
  const { data: loads } = await supabase
    .from("loads")
    .select("id, driver_id, rate, pickup_date")
    .not("driver_id", "is", null)
    .neq("status", "cancelled")
    .gte("pickup_date", period.start_date)
    .lte("pickup_date", period.end_date);

  const driverIds = Array.from(
    new Set((loads || []).map((l) => l.driver_id).filter(Boolean))
  ) as string[];

  if (driverIds.length === 0) {
    throw new Error("No loads with assigned drivers found in this period");
  }

  const { data: drivers } = await supabase
    .from("drivers")
    .select("id, employment_type, driver_pay_pct, full_name, email")
    .in("id", driverIds)
    .neq("role", "admin");

  for (const driver of drivers || []) {
    const driverLoads = (loads || []).filter((l) => l.driver_id === driver.id);
    const loadIds = driverLoads.map((l) => l.id);
    const gross = driverLoads.reduce(
      (sum, l) => sum + Number(l.rate || 0),
      0
    );

    const { data: expenses } = await supabase
      .from("expenses")
      .select("id, amount")
      .eq("driver_id", driver.id)
      .gte("expense_date", period.start_date)
      .lte("expense_date", period.end_date);

    const expenseIds = (expenses || []).map((e) => e.id);
    const expenseTotal = (expenses || []).reduce(
      (sum, e) => sum + Number(e.amount || 0),
      0
    );

    const employmentType = driver.employment_type || "company_driver";

    let driver_pay_pct: number | null = null;
    let driver_pay_amount = 0;
    let lease_on_fee_pct: number | null = null;
    let lease_on_fee_amount = 0;
    let factoring_fee_pct: number | null = null;
    let factoring_fee_amount = 0;
    let net_amount = 0;

    if (employmentType === "company_driver") {
      // Company drivers get % of gross only.
      // Fuel/insurance/lease-on/factoring are company costs, not driver deductions.
      driver_pay_pct =
        driver.driver_pay_pct != null
          ? Number(driver.driver_pay_pct)
          : defaultDriverPay;

      driver_pay_amount = Number(
        (gross * (driver_pay_pct / 100)).toFixed(2)
      );

      lease_on_fee_pct = null;
      lease_on_fee_amount = 0;
      factoring_fee_pct = null;
      factoring_fee_amount = 0;

      // Do not deduct expenses from company drivers
      net_amount = driver_pay_amount;
    } else {
      lease_on_fee_pct = defaultLeaseOn;
      factoring_fee_pct = defaultFactoring;

      lease_on_fee_amount = Number((gross * (lease_on_fee_pct / 100)).toFixed(2));
      factoring_fee_amount = Number(
        (gross * (factoring_fee_pct / 100)).toFixed(2)
      );
      net_amount = Number(
        (
          gross -
          lease_on_fee_amount -
          factoring_fee_amount -
          expenseTotal
        ).toFixed(2)
      );
    }

    // Upsert payout for this driver/period
    const { data: payout, error: payoutError } = await supabase
      .from("payouts")
      .upsert(
        {
          pay_period_id: payPeriodId,
          driver_id: driver.id,
          gross_amount: gross,
          driver_pay_pct,
          driver_pay_amount,
          lease_on_fee_pct,
          lease_on_fee_amount,
          factoring_fee_pct,
          factoring_fee_amount,
          expense_total:
            employmentType === "company_driver" ? 0 : expenseTotal,
          other_deductions: 0,
          net_amount,
          status: "draft",
        },
        { onConflict: "pay_period_id,driver_id" }
      )
      .select("id")
      .single();

    if (payoutError || !payout) {
      console.error(payoutError);
      continue;
    }

    // Refresh links
    await supabase.from("payout_loads").delete().eq("payout_id", payout.id);
    await supabase.from("payout_expenses").delete().eq("payout_id", payout.id);

    if (loadIds.length > 0) {
      await supabase.from("payout_loads").insert(
        loadIds.map((load_id) => ({
          payout_id: payout.id,
          load_id,
        }))
      );
    }

    if (
      employmentType !== "company_driver" &&
      expenseIds.length > 0
    ) {
      await supabase.from("payout_expenses").insert(
        expenseIds.map((expense_id) => ({
          payout_id: payout.id,
          expense_id,
        }))
      );
    }
  }

  await logActivity({
    action: "create",
    entityType: "payout",
    entityId: payPeriodId,
    summary: `Generated payouts for period ${period.name}`,
  });

  revalidatePath(`/admin/payouts/${payPeriodId}`);
  redirect(`/admin/payouts/${payPeriodId}`);
}

export async function updatePayoutStatus(formData: FormData) {
  const supabase = await createClient();
  const payoutId = formData.get("payout_id") as string;
  const status = formData.get("status") as string;
  const payPeriodId = formData.get("pay_period_id") as string;

  const { error } = await supabase
    .from("payouts")
    .update({ status })
    .eq("id", payoutId);

  if (error) {
    console.error("Failed to update payout status:", error);
    throw new Error("Failed to update payout status");
  }

  await logActivity({
    action: "update",
    entityType: "payout",
    entityId: payoutId,
    summary: `Updated payout status to ${status}`,
  });

  revalidatePath("/admin/payouts");
  if (payPeriodId) {
    revalidatePath(`/admin/payouts/${payPeriodId}`);
    redirect(`/admin/payouts/${payPeriodId}`);
  }
}

export async function closePayPeriod(formData: FormData) {
  const supabase = await createClient();
  const payPeriodId = formData.get("pay_period_id") as string;

  const { data: payouts, error: payoutsError } = await supabase
    .from("payouts")
    .select("id, status")
    .eq("pay_period_id", payPeriodId);

  if (payoutsError) {
    console.error(payoutsError);
    throw new Error("Failed to check payout statuses");
  }

  if (!payouts || payouts.length === 0) {
    throw new Error("Generate payouts before closing this period");
  }

  const unpaid = payouts.filter((p) => p.status !== "paid");
  if (unpaid.length > 0) {
    throw new Error(
      `Cannot close period: ${unpaid.length} payout(s) are not marked Paid`
    );
  }

  const { error } = await supabase
    .from("pay_periods")
    .update({ status: "closed" })
    .eq("id", payPeriodId);

  if (error) {
    console.error(error);
    throw new Error("Failed to close pay period");
  }

  await logActivity({
    action: "update",
    entityType: "pay_period",
    entityId: payPeriodId,
    summary: `Closed pay period ${payPeriodId}`,
  });

  revalidatePath("/admin/payouts");
  revalidatePath(`/admin/payouts/${payPeriodId}`);
  redirect(`/admin/payouts/${payPeriodId}`);
}