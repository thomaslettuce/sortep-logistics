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
  const [menuOpen, setMenuOpen] = useState(false);

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

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (isAdminRoute) {
    return null;
  }

  const isLoggedIn = !!email;
  const isAdmin = role === "admin";
  const isApproved = status === "approved";

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/lease-on", label: "Owner Operators" },
    { href: "/careers", label: "Drive With Us" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="bg-slate-900 text-white relative z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="font-bold tracking-tight text-lg">
          SORTEP <span className="text-blue-400">LOGISTICS</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-blue-400 transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Desktop auth buttons */}
          <div className="hidden md:flex items-center gap-3">
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

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-slate-200 hover:text-white hover:bg-slate-800 transition"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              // X icon
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // Hamburger icon
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-700 bg-slate-900">
          <nav className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-3 rounded-lg text-base font-medium text-slate-100 hover:bg-slate-800 hover:text-white transition"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-3 pt-3 border-t border-slate-700 flex flex-col gap-2">
              {loading ? null : isLoggedIn ? (
                <>
                  {isAdmin ? (
                    <Link
                      href="/admin"
                      className="px-3 py-3 rounded-lg text-center bg-slate-700 hover:bg-slate-600 text-sm font-medium transition"
                      onClick={() => setMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  ) : isApproved && !pathname.startsWith("/portal") ? (
                    <Link
                      href="/portal"
                      className="px-3 py-3 rounded-lg text-center bg-blue-600 hover:bg-blue-500 text-sm font-medium transition"
                      onClick={() => setMenuOpen(false)}
                    >
                      Portal
                    </Link>
                  ) : null}
                  <div className="px-3 py-2">
                    <LogoutButton />
                  </div>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className="px-3 py-3 rounded-lg text-center bg-blue-600 hover:bg-blue-500 text-sm font-medium transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}