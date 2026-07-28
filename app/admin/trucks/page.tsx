import { TruckActions } from "@/components/TruckActions";
import { createClient } from "@/lib/supabase/server";
import { addTruck } from "./actions";

export default async function TrucksPage() {
  const supabase = await createClient();

  const { data: trucks } = await supabase
    .from("trucks")
    .select("*")
    .order("unit_number", { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Trucks</h1>
          <p className="text-slate-600 mt-1">
            Manage your truck / equipment registry
          </p>
        </div>
      </div>

      {/* Add Truck Form */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-10">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Add New Truck
        </h2>

        <form action={addTruck} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Unit Number *
            </label>
            <input
              type="text"
              name="unit_number"
              required
              placeholder="e.g. 101"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Make
            </label>
            <input
              type="text"
              name="make"
              placeholder="e.g. Freightliner"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Model
            </label>
            <input
              type="text"
              name="model"
              placeholder="e.g. Cascadia"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Year
            </label>
            <input
              type="number"
              name="year"
              placeholder="2022"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              VIN
            </label>
            <input
              type="text"
              name="vin"
              placeholder="Vehicle Identification Number"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              License Plate
            </label>
            <input
              type="text"
              name="license_plate"
              placeholder="ABC-1234"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
            >
              Add Truck
            </button>
          </div>
        </form>
      </div>

      {/* Trucks List */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 font-medium text-slate-600">Unit #</th>
              <th className="text-left px-6 py-3 font-medium text-slate-600">Vehicle</th>
              <th className="text-left px-6 py-3 font-medium text-slate-600">VIN</th>
              <th className="text-left px-6 py-3 font-medium text-slate-600">Plate</th>
              <th className="text-left px-6 py-3 font-medium text-slate-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {trucks && trucks.length > 0 ? (
              trucks.map((truck) => (
                <tr key={truck.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {truck.unit_number}
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    {truck.year} {truck.make} {truck.model}
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-mono text-xs">
                    {truck.vin || "—"}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {truck.license_plate || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <TruckActions
                      truckId={truck.id}
                      currentStatus={truck.status || "active"}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                  No trucks added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}