import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const { count: pendingDrivers } = await supabase
    .from("drivers")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  const { count: approvedDrivers } = await supabase
    .from("drivers")
    .select("*", { count: "exact", head: true })
    .eq("status", "approved")
    .neq("role", "admin");

  const { count: truckCount } = await supabase
    .from("trucks")
    .select("*", { count: "exact", head: true });

  const { count: openLoads } = await supabase
    .from("loads")
    .select("*", { count: "exact", head: true })
    .in("status", ["booked", "in_transit"]);

  const { count: deliveredLoads } = await supabase
    .from("loads")
    .select("*", { count: "exact", head: true })
    .eq("status", "delivered");

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0];

  const { data: expenseRows } = await supabase
    .from("expenses")
    .select("amount")
    .gte("expense_date", monthStart)
    .lte("expense_date", monthEnd);

  const expenseTotal =
    expenseRows?.reduce((sum, row) => sum + Number(row.amount || 0), 0) || 0;

  const cards = [
    {
      label: "Pending Drivers",
      value: pendingDrivers || 0,
      href: "/admin/drivers",
      linkLabel: "Review",
    },
    {
      label: "Approved Drivers",
      value: approvedDrivers || 0,
      href: "/admin/drivers",
      linkLabel: "Manage",
    },
    {
      label: "Trucks",
      value: truckCount || 0,
      href: "/admin/trucks",
      linkLabel: "Manage",
    },
    {
      label: "Open Loads",
      value: openLoads || 0,
      href: "/admin/loads?status=booked",
      linkLabel: "View",
    },
    {
      label: "Delivered Loads",
      value: deliveredLoads || 0,
      href: "/admin/loads?status=delivered",
      linkLabel: "View",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">
          Overview of SORTEP LOGISTICS operations
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm"
          >
            <div className="text-sm text-slate-500">{card.label}</div>
            <div className="text-3xl font-bold text-slate-900 mt-1">
              {card.value}
            </div>
            <Link
              href={card.href}
              className="text-sm text-blue-600 hover:underline mt-3 inline-block"
            >
              {card.linkLabel} →
            </Link>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="text-sm text-slate-500">Expenses (This Month)</div>
          <div className="text-3xl font-bold text-slate-900 mt-1">
            $
            {expenseTotal.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </div>
          <Link
            href="/admin/expenses"
            className="text-sm text-blue-600 hover:underline mt-3 inline-block"
          >
            View expenses →
          </Link>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/drivers"
            className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
          >
            Manage Drivers
          </Link>
          <Link
            href="/admin/loads"
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
          >
            Add / View Loads
          </Link>
          <Link
            href="/admin/expenses"
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-medium px-4 py-2.5 rounded-lg transition"
          >
            Expenses
          </Link>
          <Link
            href="/admin/activity"
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-medium px-4 py-2.5 rounded-lg transition"
          >
            Activity Log
          </Link>
        </div>
      </div>
    </div>
  );
}