import { createClient } from "@/lib/supabase/server";

export default async function ActivityLogPage() {
  const supabase = await createClient();

  const { data: logs } = await supabase
    .from("activity_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Activity Log</h1>
        <p className="text-slate-600 mt-1">
          Recent admin changes across the system
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left px-5 py-3 font-medium text-slate-600">
                When
              </th>
              <th className="text-left px-5 py-3 font-medium text-slate-600">
                Who
              </th>
              <th className="text-left px-5 py-3 font-medium text-slate-600">
                Action
              </th>
              <th className="text-left px-5 py-3 font-medium text-slate-600">
                Section
              </th>
              <th className="text-left px-5 py-3 font-medium text-slate-600">
                Summary
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs && logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3 text-slate-600 whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-slate-700">
                    {log.actor_email || "—"}
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 capitalize">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-600 capitalize">
                    {log.entity_type}
                  </td>
                  <td className="px-5 py-3 text-slate-900">{log.summary}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-10 text-center text-slate-500"
                >
                  No activity logged yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}