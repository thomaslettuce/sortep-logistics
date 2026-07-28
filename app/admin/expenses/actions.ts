"use server";

import { logActivity } from "@/lib/activity-log";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addExpense(formData: FormData) {
  const supabase = await createClient();

  const expense_date = formData.get("expense_date") as string;
  const category = formData.get("category") as string;
  const amount = formData.get("amount") as string;
  const truck_id = formData.get("truck_id") as string;
  const driver_id = formData.get("driver_id") as string;
  const description = formData.get("description") as string;

  await supabase.from("expenses").insert({
    expense_date,
    category,
    amount: parseFloat(amount),
    truck_id: truck_id || null,
    driver_id: driver_id || null,
    description: description || null,
  });

  await logActivity({
    action: "create",
    entityType: "expense",
    summary: `Added ${category} expense for $${amount}`,
  });

  revalidatePath("/admin/expenses");
}

export async function deleteExpense(formData: FormData) {
  const supabase = await createClient();
  const expenseId = formData.get("expenseId") as string;

  await supabase.from("expenses").delete().eq("id", expenseId);

  await logActivity({
    action: "delete",
    entityType: "expense",
    entityId: expenseId,
    summary: `Deleted expense ${expenseId}`,
  });

  revalidatePath("/admin/expenses");
  redirect("/admin/expenses");
}