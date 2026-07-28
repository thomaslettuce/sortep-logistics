import { createClient } from "@/lib/supabase/server";
import { addSettlement } from "./actions";
import { SettlementActions } from "@/components/SettlementActions";
import Link from "next/link";

interface SearchParams {
  from?: string;
  to?: string;
  driver?: string;
  status?: string;
  created?: string;
}

export default async function SettlementsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("settlements")
    .select(
      `
      *,
      drivers (full_name, email),
      loads (load_number, rate)
    `
    )
    .order("settlement_date", { ascending: false });

  if (params.from) query = query.gte("settlement_date", params.from);
  if (params.to) query = query.lte("settlement_date", params.to);
  if (params.driver) query = query.eq("driver_id", params.driver);
  if (params.status) query = query.eq("status", params.status);

  const { data: settlements } = await query;

const { data: drivers } = await supabase
  .from("drivers")
  .select("id, full_name, email, role, employment_type")
  .eq("status", "approved")
  .neq("role", "admin")
  .order("full_name");

  const { data: loads } = await supabase
    .from("loads")
    .select("id, load_number, rate")
    .order("created_at", { ascending: false })
    .limit(100);

  const { data: settings } = await supabase
    .from("company_settings")
    .select("*")
    .eq("id", 1)
    .single();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Settlements</h1>
        <p className="text-slate-600 mt-1">
          Create settlements with transparent rate breakdown. Uses driver
          overrides when set, otherwise Company Settings defaults.
        </p>
      </div>

      {params.created === "1" && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Settlement created with calculated breakdown.
        </div>
      )}

      <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
        Company defaults: Driver pay{" "}
        <strong>{Number(settings?.driver_pay_pct ?? 25)}%</strong> · Lease-on{" "}
        <strong>{Number(settings?.lease_on_fee_pct ?? 10)}%</strong> · Factoring{" "}
        <strong>{Number(settings?.factoring_fee_pct ?? 2)}%</strong>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm mb-8">
        <form className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              name="from"
              defaultValue={params.from || ""}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              name="to"
              defaultValue={params.to || ""}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Driver
            </label>
            <select
              name="driver"
              defaultValue={params.driver || ""}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">All Drivers</option>
              {drivers?.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.full_name || d.email}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Status
            </label>
            <select
              name="status"
              defaultValue={params.status || ""}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              Filter
            </button>
            <Link
              href="/admin/settlements"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              Clear
            </Link>
          </div>
        </form>
      </div>

      {/* Create Settlement */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-10">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Create Settlement
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          Select a driver and load. Gross Revenue defaults to the load rate.
          You can also enter Gross manually if needed. Rates are applied
          automatically.
        </p>

        <form
          action={addSettlement}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Driver *
            </label>
            <select
              name="driver_id"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">— Select Driver —</option>
              {drivers?.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.full_name || d.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Related Load
            </label>
            <select
              name="load_id"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">— None —</option>
              {loads?.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.load_number}
                  {l.rate ? ` ($${Number(l.rate).toLocaleString()})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Settlement Date *
            </label>
            <input
              type="date"
              name="settlement_date"
              required
              defaultValue={new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Gross Revenue override ($)
            </label>
            <input
              type="number"
              step="0.01"
              name="gross_amount"
              placeholder="Uses load rate if blank"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Other Deductions ($)
            </label>
            <input
              type="number"
              step="0.01"
              name="other_deductions"
              defaultValue="0"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Status
            </label>
            <select
              name="status"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Optional notes..."
            />
          </div>

          <div className="md:col-span-3">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
            >
              Create Settlement
            </button>
          </div>
        </form>
      </div>

      {/* Settlements list with breakdown */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-slate-600">
                Date / Driver
              </th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">
                Load
              </th>
              <th className="text-right px-4 py-3 font-medium text-slate-600">
                Gross
              </th>
              <th className="text-right px-4 py-3 font-medium text-slate-600">
                Driver Pay
              </th>
              <th className="text-right px-4 py-3 font-medium text-slate-600">
                Fees
              </th>
              <th className="text-right px-4 py-3 font-medium text-slate-600">
                Net to Driver
              </th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {settlements && settlements.length > 0 ? (
              settlements.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 align-top">
                  <td className="px-4 py-4">
                    <div className="font-medium text-slate-900">
                      {new Date(s.settlement_date).toLocaleDateString()}
                    </div>
                    <div className="text-slate-700">
                      {s.drivers?.full_name || "—"}
                    </div>
                    <div className="text-xs text-slate-500">
                      {s.drivers?.email}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {s.loads?.load_number || "—"}
                  </td>
                  <td className="px-4 py-4 text-right text-slate-900 font-medium">
                    $
                    {Number(s.gross_amount || s.amount || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-right text-slate-700">
                    <div>
                      $
                      {Number(s.driver_pay_amount || 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-500">
                      {s.driver_pay_pct != null
                        ? `${Number(s.driver_pay_pct)}%`
                        : "—"}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right text-slate-700">
                    <div className="text-xs">
                      Lease-on: $
                      {Number(s.lease_on_fee_amount || 0).toLocaleString()}{" "}
                      ({s.lease_on_fee_pct != null
                        ? `${Number(s.lease_on_fee_pct)}%`
                        : "—"}
                      )
                    </div>
                    <div className="text-xs">
                      Factoring: $
                      {Number(s.factoring_fee_amount || 0).toLocaleString()}{" "}
                      ({s.factoring_fee_pct != null
                        ? `${Number(s.factoring_fee_pct)}%`
                        : "—"}
                      )
                    </div>
                    <div className="text-xs text-slate-500">
                      Other: $
                      {Number(s.other_deductions || s.deductions || 0).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right font-semibold text-slate-900">
                    $
                    {Number(
                      s.net_to_driver ?? s.net_amount ?? 0
                    ).toLocaleString()}
                  </td>
                  <td className="px-4 py-4">
                    <SettlementActions
                      settlementId={s.id}
                      currentStatus={s.status || "pending"}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-slate-500"
                >
                  No settlements found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}