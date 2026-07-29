import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { acceptApplication, rejectApplication } from "./actions";

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ accepted?: string; error?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) redirect("/auth/login");

  const { data: currentDriver } = await supabase
    .from("drivers")
    .select("role")
    .eq("user_id", authData.user.id)
    .single();

  if (!currentDriver || currentDriver.role !== "admin") {
    redirect("/admin");
  }

  const { data: pending } = await supabase
    .from("applications")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  const { data: reviewed } = await supabase
    .from("applications")
    .select("*")
    .neq("status", "pending")
    .order("reviewed_at", { ascending: false })
    .limit(50);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Applications</h1>
        <p className="text-slate-600 mt-1">
          Review driver applications. Accepting creates an approved driver
          account.
        </p>
      </div>

      {params.accepted === "1" && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Application accepted. Driver account created — give them the temporary
          password you set.
        </div>
      )}

      {params.error === "already_accepted" && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          That application was already accepted.
        </div>
      )}

      <section className="mb-12">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Pending ({pending?.length || 0})
        </h2>

        {pending && pending.length > 0 ? (
          <div className="space-y-4">
            {pending.map((app) => (
              <div
                key={app.id}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {app.full_name || "—"}
                    </h3>
                    <p className="text-sm text-slate-600">{app.email}</p>
                    <p className="text-sm text-slate-600">
                      {app.phone || "No phone"}
                    </p>
                  </div>
                  <div className="text-xs text-slate-500">
                    Applied{" "}
                    {app.created_at
                      ? new Date(app.created_at).toLocaleString()
                      : "—"}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-4">
                  <div>
                    <span className="text-slate-500">CDL</span>
                    <div className="font-medium text-slate-900">
                      {app.cdl || "—"}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Experience</span>
                    <div className="font-medium text-slate-900">
                      {app.experience || "—"}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-slate-500">Message</span>
                    <div className="font-medium text-slate-900 whitespace-pre-wrap">
                      {app.message || "—"}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
                  <form
                    action={acceptApplication}
                    className="flex flex-col sm:flex-row gap-2 sm:items-end flex-1"
                  >
                    <input type="hidden" name="applicationId" value={app.id} />
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Temp password for their login *
                      </label>
                      <input
                        type="text"
                        name="temp_password"
                        required
                        minLength={6}
                        placeholder="Min 6 characters"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-500 text-white text-sm font-medium px-4 py-2 rounded-lg"
                    >
                      Accept & Create Driver
                    </button>
                  </form>

                  <form action={rejectApplication}>
                    <input type="hidden" name="applicationId" value={app.id} />
                    <button
                      type="submit"
                      className="bg-red-600 hover:bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-lg"
                    >
                      Reject
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
            No pending applications.
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Recently Reviewed
        </h2>
        {reviewed && reviewed.length > 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left px-5 py-3 font-medium text-slate-600">
                    Name
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-slate-600">
                    Email
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-slate-600">
                    Status
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-slate-600">
                    Reviewed
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reviewed.map((app) => (
                  <tr key={app.id}>
                    <td className="px-5 py-3 font-medium text-slate-900">
                      {app.full_name || "—"}
                    </td>
                    <td className="px-5 py-3 text-slate-600">{app.email}</td>
                    <td className="px-5 py-3 capitalize text-slate-700">
                      {app.status}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {app.reviewed_at
                        ? new Date(app.reviewed_at).toLocaleString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-sm text-slate-500">No reviewed applications yet.</div>
        )}
      </section>
    </div>
  );
}