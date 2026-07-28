import { createClient } from "@/lib/supabase/server";
import { generatePayouts, updatePayoutStatus, closePayPeriod } from "../actions";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PayPeriodDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; count?: string; closed?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const supabase = await createClient();

  const { data: period } = await supabase
    .from("pay_periods")
    .select("*")
    .eq("id", id)
    .single();

  if (!period) notFound();

  const { data: payouts } = await supabase
    .from("payouts")
    .select(
      `
      *,
      drivers (full_name, email, employment_type)
    `
    )
    .eq("pay_period_id", id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/payouts"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to periods
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{period.name}</h1>
        <p className="text-slate-600 mt-1">
          {new Date(period.start_date).toLocaleDateString()} –{" "}
          {new Date(period.end_date).toLocaleDateString()} ·{" "}
          <span className="capitalize">{period.status}</span>
        </p>
      </div>

      {query.error === "unpaid" && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Cannot close this period until all payouts are marked{" "}
          <strong>Paid</strong>
          {query.count ? ` (${query.count} remaining)` : ""}.
        </div>
      )}

      {query.error === "no_payouts" && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Generate payouts before closing this period.
        </div>
      )}

      {query.closed === "1" && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Pay period closed successfully.
        </div>
      )}

      <div className="mb-8 flex flex-wrap gap-3 items-center">
        {period.status === "open" ? (
          <>
            <form action={generatePayouts}>
              <input type="hidden" name="pay_period_id" value={period.id} />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
              >
                Generate / Refresh Payouts
              </button>
            </form>

            <form action={closePayPeriod}>
              <input type="hidden" name="pay_period_id" value={period.id} />
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
              >
                Close Period
              </button>
            </form>

            <p className="w-full text-xs text-slate-500">
              Pulls loads and driver expenses in this date range, then calculates
              net payout by employment type.
            </p>
          </>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            This period is closed. Payouts are locked.
          </div>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-slate-600">
                Driver
              </th>
              <th className="text-right px-4 py-3 font-medium text-slate-600">
                Gross
              </th>
              <th className="text-right px-4 py-3 font-medium text-slate-600">
                Fees
              </th>
              <th className="text-right px-4 py-3 font-medium text-slate-600">
                Expenses
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
            {payouts && payouts.length > 0 ? (
              payouts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 align-top">
                  <td className="px-4 py-4">
                    <div className="font-medium text-slate-900">
                      {p.drivers?.full_name || "—"}
                    </div>
                    <div className="text-xs text-slate-500">
                      {p.drivers?.email}
                    </div>
                    <div className="text-xs text-slate-400 capitalize">
                      {(p.drivers?.employment_type || "").replaceAll("_", " ")}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right text-slate-900">
                    ${Number(p.gross_amount).toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-right text-slate-700 text-xs">
                    {Number(p.driver_pay_amount) > 0 && (
                      <div>
                        Pay: ${Number(p.driver_pay_amount).toLocaleString()}
                      </div>
                    )}
                    {Number(p.lease_on_fee_amount) > 0 && (
                      <div>
                        Lease-on: $
                        {Number(p.lease_on_fee_amount).toLocaleString()}
                      </div>
                    )}
                    {Number(p.factoring_fee_amount) > 0 && (
                      <div>
                        Factoring: $
                        {Number(p.factoring_fee_amount).toLocaleString()}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right text-slate-700">
                    ${Number(p.expense_total).toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-right font-semibold text-slate-900">
                    ${Number(p.net_amount).toLocaleString()}
                  </td>
                  <td className="px-4 py-4">
                    {period.status === "open" ? (
                      <form
                        action={updatePayoutStatus}
                        className="flex gap-2 items-center"
                      >
                        <input type="hidden" name="payout_id" value={p.id} />
                        <input
                          type="hidden"
                          name="pay_period_id"
                          value={period.id}
                        />
                        <select
                          name="status"
                          defaultValue={p.status}
                          className="text-xs border border-slate-300 rounded-md px-2 py-1.5"
                        >
                          <option value="draft">Draft</option>
                          <option value="approved">Approved</option>
                          <option value="paid">Paid</option>
                        </select>
                        <button
                          type="submit"
                          className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1.5 rounded-md"
                        >
                          Save
                        </button>
                      </form>
                    ) : (
                      <span className="text-xs capitalize text-slate-600">
                        {p.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-slate-500"
                >
                  No payouts generated yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}