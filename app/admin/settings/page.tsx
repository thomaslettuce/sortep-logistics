import { createAdminUser } from "./create-admin-action";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { updateCompanySettings } from "./actions";

export default async function CompanySettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; admin_created?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) {
    redirect("/auth/login");
  }

  const { data: driver } = await supabase
    .from("drivers")
    .select("role")
    .eq("user_id", authData.user.id)
    .single();

  if (!driver || driver.role !== "admin") {
    redirect("/portal");
  }

  const { data: settings } = await supabase
    .from("company_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (!settings) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          Company Settings
        </h1>
        <p className="text-red-600">
          Company settings row not found. Please run the company_settings SQL setup.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Company Settings</h1>
        <p className="text-slate-600 mt-1">
          Global compensation and fee defaults. These can be overridden per driver later.
          Tenure tiers stay manual.
        </p>
      </div>

      {params.saved === "1" && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Settings saved successfully.
        </div>
      )}

      {params.admin_created === "1" && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Admin user created successfully. They can log in immediately.
        </div>
      )}

      <form
        action={updateCompanySettings}
        className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6"
      >
        <div>
          <label
            htmlFor="driver_pay_pct"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Default Driver Pay (%)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            id="driver_pay_pct"
            name="driver_pay_pct"
            required
            defaultValue={Number(settings.driver_pay_pct)}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
          <p className="mt-1.5 text-xs text-slate-500">
            Default share of Gross Revenue paid to the driver. Currently planned default: 25%.
          </p>
        </div>

        <div>
          <label
            htmlFor="lease_on_fee_pct"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Default Lease-On Fee (%)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            id="lease_on_fee_pct"
            name="lease_on_fee_pct"
            required
            defaultValue={Number(settings.lease_on_fee_pct)}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
          <p className="mt-1.5 text-xs text-slate-500">
            Default lease-on fee taken from Gross Revenue. Currently planned default: 10%.
          </p>
        </div>

        <div>
          <label
            htmlFor="factoring_fee_pct"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Default Factoring Fee (%)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            id="factoring_fee_pct"
            name="factoring_fee_pct"
            required
            defaultValue={Number(settings.factoring_fee_pct)}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
          <p className="mt-1.5 text-xs text-slate-500">
            Default factoring fee taken from Gross Revenue. Currently planned default: 2%.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <p className="font-medium text-slate-800 mb-1">How these will be used</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>These are global defaults only.</li>
            <li>Per-driver overrides will be added on the Drivers page later.</li>
            <li>Tenure-based pay changes stay manual, as requested.</li>
            <li>Future settlements will store a full calculation breakdown for transparency.</li>
          </ul>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-6 rounded-lg transition"
        >
          Save Settings
        </button>
      </form>

      <div className="mt-10 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">
          Create Admin User
        </h2>
        <p className="text-sm text-slate-600 mb-4">
          Creates an approved admin account immediately. No driver approval step.
        </p>

        <form action={createAdminUser} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              placeholder="Admin name"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="admin@company.com"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Temporary Password *
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              placeholder="Min 6 characters"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
            >
              Create Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}