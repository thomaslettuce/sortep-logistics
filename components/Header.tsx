"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LogoutButton } from "@/components/logout-button";

export default function Header() {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setEmail(null);
        setRole(null);
        setStatus(null);
        setLoading(false);
        return;
      }

      setEmail(user.email ?? null);

      const { data: driver } = await supabase
        .from("drivers")
        .select("role, status")
        .eq("user_id", user.id)
        .single();

      setRole(driver?.role ?? null);
      setStatus(driver?.status ?? null);
      setLoading(false);
    };

    loadUser();
  }, [pathname]);

  // Admin has its own shell — do not show public header there
  if (isAdminRoute) {
    return null;
  }

  const isLoggedIn = !!email;
  const isAdmin = role === "admin";
  const isApproved = status === "approved";

  return (
    <header className="bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="font-bold tracking-tight text-lg">
          SORTEP <span className="text-blue-400">LOGISTICS</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="hover:text-blue-400 transition">
            Home
          </Link>
          <Link href="/about" className="hover:text-blue-400 transition">
            About
          </Link>
          <Link href="/careers" className="hover:text-blue-400 transition">
            Careers
          </Link>
          <Link href="/contact" className="hover:text-blue-400 transition">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-9 w-20 rounded-md bg-slate-700/50" />
          ) : isLoggedIn ? (
            <>
              {isAdmin ? (
                <Link
                  href="/admin"
                  className="bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-md text-sm transition"
                >
                  Admin
                </Link>
              ) : isApproved && !pathname.startsWith("/portal") ? (
                <Link
                  href="/portal"
                  className="bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded-md text-sm transition"
                >
                  Portal
                </Link>
              ) : null}
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/auth/login"
              className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md text-sm transition"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}