"use client";

import { updateLoadStatus } from "@/app/admin/loads/actions";

interface LoadStatusFormProps {
  loadId: string;
  currentStatus: string;
}

export function LoadStatusForm({ loadId, currentStatus }: LoadStatusFormProps) {
  const normalizedStatus =
    currentStatus === "delivered" ? "delivered" : "in_transit";

  return (
    <form
      action={updateLoadStatus}
      onSubmit={(e) => {
        const form = e.currentTarget;
        const select = form.elements.namedItem("status") as HTMLSelectElement;
        const newStatus = select.value;

        if (newStatus === normalizedStatus) {
          e.preventDefault();
          return;
        }

        const confirmed = window.confirm(
          `Are you sure you want to change the status to "${newStatus.replace("_", " ")}"?`
        );

        if (!confirmed) {
          e.preventDefault();
        }
      }}
      className="flex items-center gap-2"
    >
      <input type="hidden" name="loadId" value={loadId} />
      <select
        name="status"
        defaultValue={normalizedStatus}
        className="text-xs border border-slate-300 rounded-md px-2 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none"
      >
        <option value="in_transit">In Transit</option>
        <option value="delivered">Delivered</option>
      </select>
      <button
        type="submit"
        className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1.5 rounded-md transition"
      >
        Update
      </button>
    </form>
  );
}