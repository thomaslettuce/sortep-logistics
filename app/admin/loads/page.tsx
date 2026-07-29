import { AdminLoadsTable } from "@/components/AdminLoadsTable";
import { createClient } from "@/lib/supabase/server";
import { addLoad } from "./actions";
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

  const { data: authData } = await supabase.auth.getUser();
  const { data: currentDriver } = authData?.user
    ? await supabase
        .from("drivers")
        .select("role")
        .eq("user_id", authData.user.id)
        .single()
    : { data: null };

  const isAdmin = currentDriver?.role === "admin";

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
    .eq("role", "driver")
    .order("full_name");

  const { data: trucks } = await supabase
    .from("trucks")
    .select("id, unit_number")
    .order("unit_number");

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Loads</h1>
        <p className="text-slate-600 mt-1">
          Create and manage loads. Gross = rate + accessorials. New loads
          default to In Transit.
        </p>
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
              Customer / Broker *
            </label>
            <input
              type="text"
              name="customer"
              required
              placeholder="Customer name"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Rate ($) *
            </label>
            <input
              type="number"
              step="0.01"
              name="rate"
              required
              placeholder="2500.00"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Accessorials ($)
            </label>
            <input
              type="number"
              step="0.01"
              name="accessorials"
              placeholder="Detention, FSC, etc."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Origin *
            </label>
            <input
              type="text"
              name="origin"
              required
              placeholder="City, State"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Destination *
            </label>
            <input
              type="text"
              name="destination"
              required
              placeholder="City, State"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Pickup Date *
            </label>
            <input
              type="date"
              name="pickup_date"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Delivery Date *
            </label>
            <input
              type="date"
              name="delivery_date"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Assign Driver *
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
              Assign Truck *
            </label>
            <select
              name="truck_id"
              required
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
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              rows={3}
              placeholder="Arrival window, detention details, broker instructions..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Rate Confirmation
            </label>
            <input
              type="file"
              name="rate_confirmation"
              required
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              className="w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-slate-100 file:text-slate-800"
            />
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

      <AdminLoadsTable
        loads={(loads as any) || []}
        drivers={drivers || []}
        trucks={trucks || []}
        isAdmin={isAdmin}
      />
    </div>
  );
}