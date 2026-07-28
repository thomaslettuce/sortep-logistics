"use client";

import { updateSettlementStatus, deleteSettlement } from "@/app/admin/settlements/actions";

interface SettlementActionsProps {
  settlementId: string;
  currentStatus: string;
}

export function SettlementActions({
  settlementId,
  currentStatus,
}: SettlementActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Status Update */}
      <form
        action={updateSettlementStatus}
        onSubmit={(e) => {
          const form = e.currentTarget;
          const select = form.elements.namedItem("status") as HTMLSelectElement;
          if (select.value === currentStatus) {
            e.preventDefault();
            return;
          }
          const confirmed = window.confirm(
            `Change status to "${select.value}"?`
          );
          if (!confirmed) e.preventDefault();
        }}
        className="flex items-center gap-1.5"
      >
        <input type="hidden" name="settlementId" value={settlementId} />
        <select
          name="status"
          defaultValue={currentStatus}
          className="text-xs border border-slate-300 rounded-md px-2 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
        </select>
        <button
          type="submit"
          className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-2 py-1.5 rounded-md"
        >
          Update
        </button>
      </form>

      {/* Delete */}
      <form
        action={deleteSettlement}
        onSubmit={(e) => {
          const confirmed = window.confirm(
            "Are you sure you want to delete this settlement? This cannot be undone."
          );
          if (!confirmed) e.preventDefault();
        }}
      >
        <input type="hidden" name="settlementId" value={settlementId} />
        <button
          type="submit"
          className="text-xs bg-red-600 hover:bg-red-500 text-white px-2 py-1.5 rounded-md"
        >
          Delete
        </button>
      </form>
    </div>
  );
}