import { createClient } from "@/lib/supabase/server";
import { createPayPeriod } from "./actions";
import Link from "next/link";

export default async function PayoutsPage() {
  const supabase = await createClient();

  const { data: periods } = await supabase
    .from("pay_periods")
    .select("*")
    .order("start_date", { ascending: false });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Payouts</h1>
        <p className="text-slate-600 mt-1">
          Create biweekly pay periods and generate driver payouts
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-10">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Create Pay Period
        </h2>
        <form
          action={createPayPeriod}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Start Date *
            </label>
            <input
              type="date"
              name="start_date"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              End Date *
            </label>
            <input
              type="date"
              name="end_date"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Notes
            </label>
            <input
              type="text"
              name="notes"
              placeholder="Optional"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="md:col-span-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
            >
              Create Period
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left px-5 py-3 font-medium text-slate-600">
                Period
              </th>
              <th className="text-left px-5 py-3 font-medium text-slate-600">
                Dates
              </th>
              <th className="text-left px-5 py-3 font-medium text-slate-600">
                Status
              </th>
              <th className="text-right px-5 py-3 font-medium text-slate-600">
                Open
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {periods && periods.length > 0 ? (
              periods.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-medium text-slate-900">
                    {p.name}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {new Date(p.start_date).toLocaleDateString()} –{" "}
                    {new Date(p.end_date).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 capitalize text-slate-700">
                    {p.status}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/payouts/${p.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-10 text-center text-slate-500"
                >
                  No pay periods yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}