"use client";

import { RateConfirmationButton } from "@/components/RateConfirmationButton";
import { Fragment, useState } from "react";
import { updateLoad } from "@/app/admin/loads/actions";

type DriverOption = {
  id: string;
  full_name: string | null;
  email: string | null;
};
type TruckOption = { id: string; unit_number: string | null };

type LoadRow = {
  id: string;
  load_number: string | null;
  customer: string | null;
  origin: string | null;
  destination: string | null;
  pickup_date: string | null;
  delivery_date: string | null;
  rate: number | null;
  accessorials: number | null;
  linehaul: number | null;
  notes: string | null;
  status: string;
  driver_id: string | null;
  truck_id: string | null;
  payment_status?: string | null;
  payment_date?: string | null;
  factoring_ref?: string | null;
  rate_confirmation_path?: string | null;
  drivers?: { full_name: string | null; email: string | null } | null;
  trucks?: { unit_number: string | null } | null;
};

export function AdminLoadsTable({
  loads,
  drivers,
  trucks,
  isAdmin = false,
}: {
  loads: LoadRow[];
  drivers: DriverOption[];
  trucks: TruckOption[];
  isAdmin?: boolean;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (!loads.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-slate-500">
        No loads found for the selected filters.
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b">
          <tr>
            <th className="text-left px-4 py-3 font-medium text-slate-600 w-8"></th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">
              Load #
            </th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">
              Route
            </th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">
              Driver
            </th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">
              Truck
            </th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">
              Gross
            </th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {loads.map((load) => {
            const isOpen = openId === load.id;
            const rateOnly = Number(load.linehaul ?? load.rate ?? 0);
            const accessorials = Number(load.accessorials ?? 0);
            const gross = Number(load.rate ?? 0);

            return (
              <Fragment key={load.id}>
                <tr
                  className="hover:bg-slate-50 cursor-pointer"
                  onClick={() => setOpenId(isOpen ? null : load.id)}
                >
                  <td className="px-4 py-3 text-slate-500">
                    {isOpen ? "▾" : "▸"}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {load.load_number}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {load.origin || "—"} → {load.destination || "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {load.drivers?.full_name || load.drivers?.email || "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {load.trucks?.unit_number
                      ? `Unit ${load.trucks.unit_number}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {gross ? `$${gross.toLocaleString()}` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          load.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {(load.status || "in_transit").replace("_", " ")}
                      </span>
                      {isAdmin && (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                            load.payment_status === "paid"
                              ? "bg-emerald-100 text-emerald-800"
                              : load.payment_status === "factored"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {(load.payment_status || "unbilled").replace(
                            "_",
                            " "
                          )}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>

                {isOpen && (
                  <tr>
                    <td colSpan={7} className="bg-slate-50 px-4 py-4">
                      <form
                        action={updateLoad}
                        className="grid grid-cols-1 md:grid-cols-3 gap-3"
                      >
                        <input type="hidden" name="loadId" value={load.id} />

                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Load Number *
                          </label>
                          <input
                            name="load_number"
                            required
                            defaultValue={load.load_number || ""}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Customer *
                          </label>
                          <input
                            name="customer"
                            required
                            defaultValue={load.customer || ""}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Rate ($) *
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            name="rate"
                            required
                            defaultValue={rateOnly}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Accessorials ($)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            name="accessorials"
                            defaultValue={accessorials}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Origin *
                          </label>
                          <input
                            name="origin"
                            required
                            defaultValue={load.origin || ""}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Destination *
                          </label>
                          <input
                            name="destination"
                            required
                            defaultValue={load.destination || ""}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Pickup Date *
                          </label>
                          <input
                            type="date"
                            name="pickup_date"
                            required
                            defaultValue={load.pickup_date || ""}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Delivery Date *
                          </label>
                          <input
                            type="date"
                            name="delivery_date"
                            required
                            defaultValue={load.delivery_date || ""}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Status *
                          </label>
                          <select
                            name="status"
                            required
                            defaultValue={
                              load.status === "delivered"
                                ? "delivered"
                                : "in_transit"
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          >
                            <option value="in_transit">In Transit</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </div>

                        {isAdmin && (
                          <>
                            <div>
                              <label className="block text-xs font-medium text-slate-600 mb-1">
                                Payment Status
                              </label>
                              <select
                                name="payment_status"
                                defaultValue={load.payment_status || "unbilled"}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                              >
                                <option value="unbilled">Unbilled</option>
                                <option value="factored">Factored</option>
                                <option value="paid">Paid</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-slate-600 mb-1">
                                Payment Date
                              </label>
                              <input
                                type="date"
                                name="payment_date"
                                defaultValue={load.payment_date || ""}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-slate-600 mb-1">
                                Factoring Ref
                              </label>
                              <input
                                name="factoring_ref"
                                defaultValue={load.factoring_ref || ""}
                                placeholder="Invoice / factor ref"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                              />
                            </div>
                          </>
                        )}

                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Driver *
                          </label>
                          <select
                            name="driver_id"
                            required
                            defaultValue={load.driver_id || ""}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          >
                            <option value="">— Select Driver —</option>
                            {drivers.map((d) => (
                              <option key={d.id} value={d.id}>
                                {d.full_name || d.email}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Truck *
                          </label>
                          <select
                            name="truck_id"
                            required
                            defaultValue={load.truck_id || ""}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          >
                            <option value="">— Select Truck —</option>
                            {trucks.map((t) => (
                              <option key={t.id} value={t.id}>
                                Unit {t.unit_number}
                              </option>
                            ))}
                          </select>
                        </div>

                                                <div className="md:col-span-3">
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Notes
                          </label>
                          <textarea
                            name="notes"
                            rows={3}
                            defaultValue={load.notes || ""}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm resize-none"
                          />
                        </div>

                        <div className="md:col-span-3">
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Rate Confirmation
                          </label>
                          <div className="mb-2">
                            <RateConfirmationButton
                              path={load.rate_confirmation_path}
                            />
                          </div>
                          <input
                            type="file"
                            name="rate_confirmation"
                            accept=".pdf,.png,.jpg,.jpeg,.webp"
                            className="w-full text-sm text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-white file:text-slate-800"
                          />
                          {load.rate_confirmation_path && (
                            <p className="text-xs text-slate-500 mt-1">
                              Upload a new file to replace the existing one.
                            </p>
                          )}
                        </div>

                        <div className="md:col-span-3">
                          <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg"
                          >
                            Save Changes
                          </button>
                        </div>
                      </form>
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