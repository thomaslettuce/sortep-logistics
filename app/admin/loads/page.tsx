import { createClient } from "@/lib/supabase/server";
import { addLoad } from "./actions";
import { LoadStatusForm } from "@/components/LoadStatusForm";
import { LoadsFilterForm } from "@/components/LoadsFilterForm";

interface SearchParams {
  from?: string;
  to?: string;
  driver?: string;
  truck?: string;
  status?: string;
  q?: string;
}

export default async function LoadsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("loads")
    .select(
      `
      *,
      drivers (full_name, email),
      trucks (unit_number)
    `
    )
    .order("created_at", { ascending: false });

  if (params.from) query = query.gte("pickup_date", params.from);
  if (params.to) query = query.lte("pickup_date", params.to);
  if (params.driver) query = query.eq("driver_id", params.driver);
  if (params.truck) query = query.eq("truck_id", params.truck);
  if (params.status) query = query.eq("status", params.status);
  if (params.q) query = query.ilike("load_number", `%${params.q}%`);

  const { data: loads } = await query;

  const { data: filterLoads } = await supabase
    .from("loads")
    .select(
      `
      id,
      load_number,
      pickup_date,
      status,
      driver_id,
      truck_id,
      drivers (id, full_name, email),
      trucks (id, unit_number)
    `
    )
    .order("created_at", { ascending: false });

  const { data: drivers } = await supabase
    .from("drivers")
    .select("id, full_name, email")
    .eq("status", "approved")
    .neq("role", "admin")
    .order("full_name");

  const { data: trucks } = await supabase
    .from("trucks")
    .select("id, unit_number")
    .order("unit_number");

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Loads</h1>
        <p className="text-slate-600 mt-1">Create and manage loads</p>
      </div>

      <LoadsFilterForm
        loads={(filterLoads as any) || []}
        initial={{
          from: params.from,
          to: params.to,
          driver: params.driver,
          truck: params.truck,
          status: params.status,
          q: params.q,
        }}
      />

      {/* Add Load Form */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-10">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Add New Load
        </h2>

        <form
          action={addLoad}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Load Number *
            </label>
            <input
              type="text"
              name="load_number"
              required
              placeholder="e.g. LD-1001"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Customer / Broker
            </label>
            <input
              type="text"
              name="customer"
              placeholder="Customer name"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Rate ($)
            </label>
            <input
              type="number"
              step="0.01"
              name="rate"
              placeholder="2500.00"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Origin
            </label>
            <input
              type="text"
              name="origin"
              placeholder="City, State"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Destination
            </label>
            <input
              type="text"
              name="destination"
              placeholder="City, State"
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
              <option value="booked">Booked</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="paid">Paid</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Pickup Date
            </label>
            <input
              type="date"
              name="pickup_date"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Delivery Date
            </label>
            <input
              type="date"
              name="delivery_date"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Assign Driver
            </label>
            <select
              name="driver_id"
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
              Assign Truck
            </label>
            <select
              name="truck_id"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">— Select Truck —</option>
              {trucks?.map((t) => (
                <option key={t.id} value={t.id}>
                  Unit {t.unit_number}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
            >
              Add Load
            </button>
          </div>
        </form>
      </div>

      {/* Loads Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left px-5 py-3 font-medium text-slate-600">
                Load #
              </th>
              <th className="text-left px-5 py-3 font-medium text-slate-600">
                Route
              </th>
              <th className="text-left px-5 py-3 font-medium text-slate-600">
                Driver
              </th>
              <th className="text-left px-5 py-3 font-medium text-slate-600">
                Truck
              </th>
              <th className="text-left px-5 py-3 font-medium text-slate-600">
                Rate
              </th>
              <th className="text-left px-5 py-3 font-medium text-slate-600">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loads && loads.length > 0 ? (
              loads.map((load) => (
                <tr key={load.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-medium text-slate-900">
                    {load.load_number}
                  </td>
                  <td className="px-5 py-4 text-slate-700">
                    {load.origin || "—"} → {load.destination || "—"}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {load.drivers?.full_name || load.drivers?.email || "—"}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {load.trucks?.unit_number
                      ? `Unit ${load.trucks.unit_number}`
                      : "—"}
                  </td>
                  <td className="px-5 py-4 text-slate-700">
                    {load.rate
                      ? `$${Number(load.rate).toLocaleString()}`
                      : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <LoadStatusForm
                      loadId={load.id}
                      currentStatus={load.status}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-slate-500"
                >
                  No loads found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}