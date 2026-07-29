import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) {
    redirect("/auth/login");
  }

  const { data: driver } = await supabase
    .from("drivers")
    .select("role, full_name, email")
    .eq("user_id", authData.user.id)
    .single();

  if (!driver || (driver.role !== "admin" && driver.role !== "dispatcher")) {
    redirect("/portal");
  }

  const isAdmin = driver.role === "admin";

  const navItems = isAdmin
    ? [
        { href: "/admin", label: "Dashboard" },
        { href: "/admin/applications", label: "Applications" },
        { href: "/admin/drivers", label: "Drivers" },
        { href: "/admin/trucks", label: "Trucks" },
        { href: "/admin/loads", label: "Loads" },
        { href: "/admin/expenses", label: "Expenses" },
        { href: "/admin/payouts", label: "Payouts" },
        { href: "/admin/settings", label: "Company Settings" },
        { href: "/admin/activity", label: "Activity Log" },
      ]
    : [
        { href: "/admin", label: "Dashboard" },
        { href: "/admin/drivers", label: "Drivers" },
        { href: "/admin/trucks", label: "Trucks" },
        { href: "/admin/loads", label: "Loads" },
        { href: "/admin/expenses", label: "Expenses" },
      ];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-slate-700">
          <div className="text-lg font-bold tracking-tight">
            SORTEP{" "}
            <span className="text-blue-400">
              {isAdmin ? "ADMIN" : "DISPATCH"}
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-1 truncate">
            {driver.email}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}