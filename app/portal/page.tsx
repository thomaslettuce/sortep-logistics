import { PortalPayoutsTable } from "@/components/PortalPayoutsTable";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";

export default async function PortalPage() {
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData?.user) {
    redirect("/auth/login");
  }

  const user = authData.user;

  const { data: driver } = await supabase
    .from("drivers")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!driver || driver.status === "pending") {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-white border border-slate-200 rounded-xl p-10 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 mb-3">
            Account Pending Approval
          </h1>
          <p className="text-slate-600 mb-6">
            Thank you for signing up. Your account is currently under review.
            You will be able to access the Driver Portal once an administrator
            approves your account.
          </p>
          <p className="text-sm text-slate-500 mb-8">
            Logged in as: {user.email}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <LogoutButton />
            <Link
              href="/"
              className="inline-flex items-center justify-center border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium px-5 py-2.5 rounded-lg transition"
            >
              Back to Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (driver.status === "rejected") {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-white border border-slate-200 rounded-xl p-10 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 mb-3">
            Account Not Approved
          </h1>
          <p className="text-slate-600 mb-8">
            Your account was not approved. Please contact SORTEP LOGISTICS if
            you believe this is an error.
          </p>
          <LogoutButton />
        </div>
      </div>
    );
  }

  // Admins and dispatchers use the admin shell, not the driver portal
  if (driver.role === "admin" || driver.role === "dispatcher") {
    redirect("/admin");
  }

  const { data: loads } = await supabase
    .from("loads")
    .select(
      `
      *,
      trucks (unit_number)
    `
    )
    .eq("driver_id", driver.id)
    .order("created_at", { ascending: false });

  const { data: driverExpenses } = await supabase
    .from("expenses")
    .select("*")
    .eq("driver_id", driver.id)
    .order("expense_date", { ascending: false });

  const { data: payouts } = await supabase
    .from("payouts")
    .select(
      `
      *,
      pay_periods (start_date, end_date, status),
      payout_loads (
        loads (
          load_number,
          origin,
          destination,
          rate,
          pickup_date,
          status
        )
      )
    `
    )
    .eq("driver_id", driver.id)
    .order("created_at", { ascending: false });

  const employmentType = driver.employment_type || "company_driver";

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Driver Portal</h1>
          <p className="text-slate-600 mt-1">
            Welcome back, {driver.full_name || user.email}
          </p>
          <p className="text-sm text-slate-500 mt-1 capitalize">
            {employmentType.replaceAll("_", " ")}
          </p>
        </div>
      </div>

      {/* My Profile (read-only for now) */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          My Profile
        </h2>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-slate-500">Full Name</div>
              <div className="font-medium text-slate-900 mt-0.5">
                {driver.full_name || "—"}
              </div>
            </div>

            <div>
              <div className="text-slate-500">Email</div>
              <div className="font-medium text-slate-900 mt-0.5">
                {driver.email || user.email || "—"}
              </div>
            </div>

            <div>
              <div className="text-slate-500">Phone</div>
              <div className="font-medium text-slate-900 mt-0.5">
                {driver.phone || "—"}
              </div>
            </div>

            <div>
              <div className="text-slate-500">Driver ID</div>
              <div className="font-medium text-slate-900 mt-0.5">
                {driver.driver_id || "—"}
              </div>
            </div>

            <div>
              <div className="text-slate-500">Employment Type</div>
              <div className="font-medium text-slate-900 mt-0.5 capitalize">
                {(driver.employment_type || "company_driver").replaceAll(
                  "_",
                  " "
                )}
              </div>
            </div>

            <div>
              <div className="text-slate-500">Start Date</div>
              <div className="font-medium text-slate-900 mt-0.5">
                {driver.start_date
                  ? new Date(driver.start_date).toLocaleDateString()
                  : "—"}
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-4">
            Profile details are managed by SORTEP LOGISTICS. Contact your
            administrator if something needs to be updated.
          </p>
        </div>
      </section>

      {/* My Expenses — only for lease-on / independent contractors */}
      {employmentType !== "company_driver" && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            My Expenses
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            Expenses processed through SORTEP (fuel, insurance, etc.) that may
            be deducted on your payouts.
          </p>

          {driverExpenses && driverExpenses.length > 0 ? (
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
                    <th className="text-right px-5 py-3 font-medium text-slate-600">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {driverExpenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4 text-slate-700">
                        {new Date(expense.expense_date).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4 capitalize text-slate-700">
                        {expense.category}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {expense.description || "—"}
                      </td>
                      <td className="px-5 py-4 text-right font-medium text-slate-900">
                        ${Number(expense.amount).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
              No expenses assigned to you yet.
            </div>
          )}
        </section>
      )}

      {/* My Payouts */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          My Payouts
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          Pay-period totals based on your loads and applicable deductions.
          Expand a row to see the loads included.
        </p>

        <PortalPayoutsTable payouts={(payouts as any) || []} />
      </section>

      {/* Loads */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">My Loads</h2>

        {loads && loads.length > 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto -mx-1 px-1">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left px-5 py-3 font-medium text-slate-600">
                    Load #
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-slate-600">
                    Route
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-slate-600">
                    Truck
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-slate-600">
                    Pickup
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-slate-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loads.map((load) => (
                  <tr key={load.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-medium text-slate-900">
                      {load.load_number}
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {load.origin || "—"} → {load.destination || "—"}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {load.trucks?.unit_number
                        ? `Unit ${load.trucks.unit_number}`
                        : "—"}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {load.pickup_date
                        ? new Date(load.pickup_date).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {load.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
            No loads assigned yet.
          </div>
        )}
      </section>

      <div className="text-center">
        <Link href="/" className="text-blue-600 hover:underline text-sm">
          ← Back to website
        </Link>
      </div>
    </div>
  );
}