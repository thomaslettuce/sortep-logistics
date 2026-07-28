import { createClient } from "@/lib/supabase/server";
import { addExpense } from "./actions";
import { ExpenseActions } from "@/components/ExpenseActions";
import Link from "next/link";

interface SearchParams {
  from?: string;
  to?: string;
  category?: string;
  truck?: string;
  driver?: string;
}

function toDateInput(d: Date) {
  return d.toISOString().split("T")[0];
}

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const now = new Date();
  const defaultFrom = toDateInput(new Date(now.getFullYear(), now.getMonth(), 1));
  const defaultTo = toDateInput(now);

  const from = params.from || defaultFrom;
  const to = params.to || defaultTo;

  // Quick period presets
  const last30From = toDateInput(new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000));
  const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
  const quarterFrom = toDateInput(new Date(now.getFullYear(), quarterMonth, 1));
  const ytdFrom = toDateInput(new Date(now.getFullYear(), 0, 1));

  let query = supabase
    .from("expenses")
    .select(
      `
      *,
      trucks (unit_number),
      drivers (full_name, email)
    `
    )
    .order("expense_date", { ascending: false });

  if (from) query = query.gte("expense_date", from);
  if (to) query = query.lte("expense_date", to);
  if (params.category) query = query.eq("category", params.category);
  if (params.truck) query = query.eq("truck_id", params.truck);
  if (params.driver) query = query.eq("driver_id", params.driver);

  const { data: expenses } = await query;

  const { data: trucks } = await supabase
    .from("trucks")
    .select("id, unit_number")
    .order("unit_number");

  const { data: drivers } = await supabase
    .from("drivers")
    .select("id, full_name, email")
    .eq("status", "approved")
    .neq("role", "admin")
    .order("full_name");

  const total =
    expenses?.reduce((sum, e) => sum + Number(e.amount || 0), 0) || 0;

  const periodLabel =
    from === defaultFrom && to === defaultTo
      ? "This Month"
      : from === last30From && to === defaultTo
        ? "Last 30 Days"
        : from === quarterFrom && to === defaultTo
          ? "This Quarter"
          : from === ytdFrom && to === defaultTo
            ? "Year to Date"
            : "Selected Period";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Expenses</h1>
        <p className="text-slate-600 mt-1">
          Track and filter company expenses by period
        </p>
      </div>

      {/* Quick period buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Link
          href={`/admin/expenses?from=${defaultFrom}&to=${defaultTo}`}
          className="text-sm px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50"
        >
          This Month
        </Link>
        <Link
          href={`/admin/expenses?from=${last30From}&to=${defaultTo}`}
          className="text-sm px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50"
        >
          Last 30 Days
        </Link>
        <Link
          href={`/admin/expenses?from=${quarterFrom}&to=${defaultTo}`}
          className="text-sm px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50"
        >
          This Quarter
        </Link>
        <Link
          href={`/admin/expenses?from=${ytdFrom}&to=${defaultTo}`}
          className="text-sm px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50"
        >
          YTD
        </Link>
        <Link
          href="/admin/expenses?from=2000-01-01&to=2100-12-31"
          className="text-sm px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50"
        >
          All Time
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm mb-6">
        <form className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              From
            </label>
            <input
              type="date"
              name="from"
              defaultValue={from}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              To
            </label>
            <input
              type="date"
              name="to"
              defaultValue={to}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Category
            </label>
            <select
              name="category"
              defaultValue={params.category || ""}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">All Categories</option>
              <option value="fuel">Fuel</option>
              <option value="maintenance">Maintenance</option>
              <option value="repairs">Repairs</option>
              <option value="insurance">Insurance</option>
              <option value="tolls">Tolls</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Truck
            </label>
            <select
              name="truck"
              defaultValue={params.truck || ""}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">All Trucks</option>
              {trucks?.map((t) => (
                <option key={t.id} value={t.id}>
                  Unit {t.unit_number}
                </option>
              ))}
            </select>
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

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              Filter
            </button>
            <Link
              href={`/admin/expenses?from=${defaultFrom}&to=${defaultTo}`}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              Reset
            </Link>
          </div>
        </form>
      </div>

      {/* Filtered total */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm mb-8">
        <div className="text-sm text-slate-500">{periodLabel} Total</div>
        <div className="text-2xl font-bold text-slate-900">
          $
          {total.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </div>
        <div className="text-xs text-slate-400 mt-1">
          {expenses?.length || 0} expense
          {(expenses?.length || 0) !== 1 ? "s" : ""} · {from} to {to}
        </div>
      </div>

      {/* Add Expense Form */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-10">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Add Expense
        </h2>

        <form
          action={addExpense}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              name="expense_date"
              required
              defaultValue={toDateInput(now)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Category *
            </label>
            <select
              name="category"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="fuel">Fuel</option>
              <option value="maintenance">Maintenance</option>
              <option value="repairs">Repairs</option>
              <option value="insurance">Insurance</option>
              <option value="tolls">Tolls</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Amount ($) *
            </label>
            <input
              type="number"
              step="0.01"
              name="amount"
              required
              placeholder="0.00"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Truck (optional)
            </label>
            <select
              name="truck_id"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">— None —</option>
              {trucks?.map((t) => (
                <option key={t.id} value={t.id}>
                  Unit {t.unit_number}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Driver (optional)
            </label>
            <select
              name="driver_id"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">— None —</option>
              {drivers?.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.full_name || d.email}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <input
              type="text"
              name="description"
              placeholder="Optional notes..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
            >
              Add Expense
            </button>
          </div>
        </form>
      </div>

      {/* Expenses Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left px-5 py-3 font-medium text-slate-600">
                Date
              </th>
              <th className="text-left px-5 py-3 font-medium text-slate-600">
                Category
              </th>
              <th className="text-left px-5 py-3 font-medium text-slate-600">
                Description
              </th>
              <th className="text-left px-5 py-3 font-medium text-slate-600">
                Truck
              </th>
              <th className="text-left px-5 py-3 font-medium text-slate-600">
                Driver
              </th>
              <th className="text-right px-5 py-3 font-medium text-slate-600">
                Amount
              </th>
              <th className="text-right px-5 py-3 font-medium text-slate-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expenses && expenses.length > 0 ? (
              expenses.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 text-slate-700">
                    {new Date(e.expense_date).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 capitalize">
                      {e.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {e.description || "—"}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {e.trucks?.unit_number
                      ? `Unit ${e.trucks.unit_number}`
                      : "—"}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {e.drivers?.full_name || e.drivers?.email || "—"}
                  </td>
                  <td className="px-5 py-4 text-right font-medium text-slate-900">
                    ${Number(e.amount).toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <ExpenseActions expenseId={e.id} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-10 text-center text-slate-500"
                >
                  No expenses found for the selected period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}