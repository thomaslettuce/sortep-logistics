"use client";

import { deleteExpense } from "@/app/admin/expenses/actions";

interface ExpenseActionsProps {
  expenseId: string;
}

export function ExpenseActions({ expenseId }: ExpenseActionsProps) {
  return (
    <form
      action={deleteExpense}
      onSubmit={(e) => {
        const confirmed = window.confirm(
          "Are you sure you want to delete this expense? This cannot be undone."
        );
        if (!confirmed) e.preventDefault();
      }}
    >
      <input type="hidden" name="expenseId" value={expenseId} />
      <button
        type="submit"
        className="text-xs bg-red-600 hover:bg-red-500 text-white px-2.5 py-1.5 rounded-md transition"
      >
        Delete
      </button>
    </form>
  );
}