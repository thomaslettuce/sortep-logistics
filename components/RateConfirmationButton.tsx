"use client";

import { useState } from "react";
import { getRateConfirmationUrl } from "@/app/admin/loads/document-actions";

export function RateConfirmationButton({
  path,
}: {
  path: string | null | undefined;
}) {
  const [loading, setLoading] = useState(false);

  if (!path) {
    return (
      <span className="text-xs text-slate-400">No rate confirmation</span>
    );
  }

  async function handleOpen() {
    setLoading(true);
    try {
      const url = await getRateConfirmationUrl(path!);
      if (!url) {
        alert("Could not open document");
        return;
      }
      window.open(url, "_blank", "noopener,noreferrer");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleOpen}
      disabled={loading}
      className="text-xs font-medium text-blue-600 hover:underline disabled:opacity-50"
    >
      {loading ? "Opening…" : "View / Download rate confirmation"}
    </button>
  );
}