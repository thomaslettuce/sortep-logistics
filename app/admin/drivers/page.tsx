import { createClient } from "@/lib/supabase/server";
import {
  approveDriver,
  rejectDriver,
  updateDriverCompensation,
} from "./actions";

export default async function DriversPage({
  searchParams,
}: {
  searchParams: Promise<{ updated?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("company_settings")
    .select("*")
    .eq("id", 1)
    .single();

  const defaultDriverPay = Number(settings?.driver_pay_pct ?? 25);
  const defaultLeaseOn = Number(settings?.lease_on_fee_pct ?? 10);
  const defaultFactoring = Number(settings?.factoring_fee_pct ?? 2);

  const { data: pendingDrivers } = await supabase
    .from("drivers")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  const { data: approvedDrivers } = await supabase
    .from("drivers")
    .select("*")
    .eq("status", "approved")
    .neq("role", "admin")
    .order("full_name", { ascending: true });

  const { data: adminUsers } = await supabase
    .from("drivers")
    .select("*")
    .eq("status", "approved")
    .eq("role", "admin")
    .order("full_name", { ascending: true });

  const { data: rejectedDrivers } = await supabase
    .from("drivers")
    .select("*")
    .eq("status", "rejected")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Drivers</h1>
        <p className="text-slate-600 mt-1">
          Approve drivers and manage compensation overrides. Leave % fields
          blank to use Company Settings defaults.
        </p>
      </div>

      {params.updated === "1" && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Driver updated successfully.
        </div>
      )}

      <div className="mb-8 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
        <p className="font-medium text-slate-900 mb-1">Company defaults</p>
        <p>
          Driver pay: <strong>{defaultDriverPay}%</strong> · Lease-on:{" "}
          <strong>{defaultLeaseOn}%</strong> · Factoring:{" "}
          <strong>{defaultFactoring}%</strong>
        </p>
      </div>

      {/* Pending */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Pending Approval ({pendingDrivers?.length || 0})
        </h2>

        {pendingDrivers && pendingDrivers.length > 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-slate-600">
                    Driver
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-slate-600">
                    Signed Up
                  </th>
                  <th className="text-right px-6 py-3 font-medium text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingDrivers.map((driverRow) => (
                  <tr key={driverRow.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">
                        {driverRow.full_name || "—"}
                      </div>
                      <div className="text-slate-500">{driverRow.email}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(driverRow.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <form action={approveDriver} className="inline">
                        <input
                          type="hidden"
                          name="driverId"
                          value={driverRow.id}
                        />
                        <button
                          type="submit"
                          className="bg-green-600 hover:bg-green-500 text-white text-xs font-medium px-3 py-1.5 rounded-md"
                        >
                          Approve
                        </button>
                      </form>
                      <form action={rejectDriver} className="inline">
                        <input
                          type="hidden"
                          name="driverId"
                          value={driverRow.id}
                        />
                        <button
                          type="submit"
                          className="bg-red-600 hover:bg-red-500 text-white text-xs font-medium px-3 py-1.5 rounded-md"
                        >
                          Reject
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
            No drivers waiting for approval.
          </div>
        )}
      </section>

      {/* Approved drivers + overrides */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Approved Drivers ({approvedDrivers?.length || 0})
        </h2>

        {approvedDrivers && approvedDrivers.length > 0 ? (
          <div className="space-y-6">
            {approvedDrivers.map((driverRow) => (
              <form
                key={driverRow.id}
                action={updateDriverCompensation}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4"
              >
                <input type="hidden" name="driverId" value={driverRow.id} />

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {driverRow.full_name || driverRow.email}
                    </h3>
                    <p className="text-sm text-slate-500">{driverRow.email}</p>
                  </div>
                  <div className="text-xs text-slate-500">
                    Defaults: Pay {defaultDriverPay}% · Lease-on{" "}
                    {defaultLeaseOn}% · Factoring {defaultFactoring}%
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      defaultValue={driverRow.full_name || ""}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      defaultValue={driverRow.phone || ""}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Driver ID
                    </label>
                    <input
                      type="text"
                      name="driver_id_code"
                      defaultValue={driverRow.driver_id || ""}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Employment Type
                    </label>
                    <select
                      name="employment_type"
                      defaultValue={
                        driverRow.employment_type || "company_driver"
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="company_driver">Company Driver</option>
                      <option value="lease_on">Lease-On</option>
                      <option value="independent_contractor">
                        Independent Contractor
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="start_date"
                      defaultValue={driverRow.start_date || ""}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Role
                    </label>
                    <select
                      name="role"
                      defaultValue={driverRow.role || "driver"}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="driver">Driver</option>
                      <option value="dispatcher">Dispatcher</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  {driverRow.employment_type === "company_driver" ||
                    !driverRow.employment_type ? (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Driver Pay % override
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        name="driver_pay_pct"
                        defaultValue={
                          driverRow.driver_pay_pct === null ||
                            driverRow.driver_pay_pct === undefined
                            ? ""
                            : Number(driverRow.driver_pay_pct)
                        }
                        placeholder={`Default ${defaultDriverPay}`}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Leave blank to use company default ({defaultDriverPay}%).
                      </p>
                    </div>
                  ) : (
                    <div className="md:col-span-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                      Lease-on and independent contractors use global Lease-On
                      and Factoring fees from Company Settings. No per-driver
                      percentage overrides.
                    </div>
                  )}




                </div>

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
                >
                  Save Driver Settings
                </button>
              </form>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
            No approved drivers yet.
          </div>
        )}
      </section>

      {/* Admin Users */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Admin Users ({adminUsers?.length || 0})
        </h2>

        {adminUsers && adminUsers.length > 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-slate-600">
                    Name
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-slate-600">
                    Email
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-slate-600">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {adminUsers.map((admin) => (
                  <tr key={admin.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {admin.full_name || "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {admin.email}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {admin.created_at
                        ? new Date(admin.created_at).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
            No admin users yet.
          </div>
        )}
      </section>

      {rejectedDrivers && rejectedDrivers.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Rejected ({rejectedDrivers.length})
          </h2>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <ul className="space-y-2 text-sm text-slate-600">
              {rejectedDrivers.map((driverRow) => (
                <li key={driverRow.id}>
                  {driverRow.full_name || driverRow.email} —{" "}
                  {new Date(driverRow.created_at).toLocaleDateString()}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}