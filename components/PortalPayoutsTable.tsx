"use client";

import { Fragment, useState } from "react";

type LoadInfo = {
  load_number: string | null;
  origin: string | null;
  destination: string | null;
  rate: number | null;
  pickup_date: string | null;
  status: string | null;
};

type PayoutRow = {
  id: string;
  status: string | null;
  gross_amount: number | null;
  driver_pay_amount: number | null;
  driver_pay_pct: number | null;
  lease_on_fee_amount: number | null;
  lease_on_fee_pct: number | null;
  factoring_fee_amount: number | null;
  factoring_fee_pct: number | null;
  expense_total: number | null;
  net_amount: number | null;
  pay_periods: {
    start_date: string | null;
    end_date: string | null;
  } | null;
  payout_loads:
    | {
        loads: LoadInfo | null;
      }[]
    | null;
};

export function PortalPayoutsTable({ payouts }: { payouts: PayoutRow[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (!payouts.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
        No payouts available yet.
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto -mx-1 px-1">
      <table className="w-full text-sm min-w-[520px]">
        <thead className="bg-slate-50 border-b">
          <tr>
            <th className="text-left px-4 py-3 font-medium text-slate-600 w-10"></th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">
              Pay Period
            </th>
            <th className="text-right px-4 py-3 font-medium text-slate-600">
              Gross
            </th>
            <th className="text-right px-4 py-3 font-medium text-slate-600">
              Net
            </th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {payouts.map((p) => {
            const start = p.pay_periods?.start_date;
            const end = p.pay_periods?.end_date;
            const periodLabel =
              start && end
                ? `${new Date(start + "T12:00:00").toLocaleDateString()} – ${new Date(end + "T12:00:00").toLocaleDateString()}`
                : "Pay Period";

            const gross = Number(p.gross_amount || 0);
            const net = Number(p.net_amount || 0);
            const isOpen = openId === p.id;

            const loads =
              p.payout_loads
                ?.map((pl) => pl.loads)
                .filter((l): l is LoadInfo => !!l) || [];

            return (
              <Fragment key={p.id}>
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : p.id)}
                      className="text-slate-500 hover:text-slate-800 text-sm"
                      aria-label={isOpen ? "Hide loads" : "Show loads"}
                    >
                      {isOpen ? "▾" : "▸"}
                    </button>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {periodLabel}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-700">
                    ${gross.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-900">
                    ${net.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        p.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : p.status === "approved"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {p.status || "draft"}
                    </span>
                  </td>
                </tr>

                {isOpen && (
                  <tr key={`${p.id}-detail`}>
                    <td colSpan={5} className="bg-slate-50 px-4 py-4">
                      <div className="text-xs font-medium text-slate-600 mb-2">
                        Loads in this period
                      </div>

                      {loads.length > 0 ? (
                        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                          <table className="w-full text-xs">
                            <thead className="bg-slate-100 border-b">
                              <tr>
                                <th className="text-left px-3 py-2 font-medium text-slate-600">
                                  Load #
                                </th>
                                <th className="text-left px-3 py-2 font-medium text-slate-600">
                                  Route
                                </th>
                                <th className="text-left px-3 py-2 font-medium text-slate-600">
                                  Pickup
                                </th>
                                <th className="text-right px-3 py-2 font-medium text-slate-600">
                                  Rate
                                </th>
                                <th className="text-left px-3 py-2 font-medium text-slate-600">
                                  Status
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {loads.map((load, idx) => (
                                <tr key={`${p.id}-load-${idx}`}>
                                  <td className="px-3 py-2 font-medium text-slate-900">
                                    {load.load_number || "—"}
                                  </td>
                                  <td className="px-3 py-2 text-slate-700">
                                    {load.origin || "—"} →{" "}
                                    {load.destination || "—"}
                                  </td>
                                  <td className="px-3 py-2 text-slate-600">
                                    {load.pickup_date
                                      ? new Date(
                                          load.pickup_date + "T12:00:00"
                                        ).toLocaleDateString()
                                      : "—"}
                                  </td>
                                  <td className="px-3 py-2 text-right text-slate-900">
                                    {load.rate != null
                                      ? `$${Number(load.rate).toLocaleString()}`
                                      : "—"}
                                  </td>
                                  <td className="px-3 py-2 capitalize text-slate-600">
                                    {load.status || "—"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-500">
                          No loads linked to this payout.
                        </div>
                      )}

                      {/* Optional fee breakdown */}
                      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600">
                        {Number(p.driver_pay_amount) > 0 && (
                          <div>
                            Driver Pay
                            {p.driver_pay_pct != null
                              ? ` (${p.driver_pay_pct}%)`
                              : ""}
                            :{" "}
                            <span className="font-medium text-slate-900">
                              ${Number(p.driver_pay_amount).toLocaleString()}
                            </span>
                          </div>
                        )}
                        {Number(p.lease_on_fee_amount) > 0 && (
                          <div>
                            Lease-on:{" "}
                            <span className="font-medium text-slate-900">
                              ${Number(p.lease_on_fee_amount).toLocaleString()}
                            </span>
                          </div>
                        )}
                        {Number(p.factoring_fee_amount) > 0 && (
                          <div>
                            Factoring:{" "}
                            <span className="font-medium text-slate-900">
                              $
                              {Number(p.factoring_fee_amount).toLocaleString()}
                            </span>
                          </div>
                        )}
                        {Number(p.expense_total) > 0 && (
                          <div>
                            Expenses:{" "}
                            <span className="font-medium text-slate-900">
                              ${Number(p.expense_total).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}