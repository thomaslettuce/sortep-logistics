import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* Hero — shorter */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-blue-400 text-sm font-semibold tracking-wide uppercase mb-3">
                Sortep Logistics
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                Freight that moves.
                <span className="block text-blue-400">Partners who stay.</span>
              </h1>
              <p className="mt-4 text-slate-300 text-base md:text-lg max-w-lg">
                Georgia-based trucking for company drivers and owner-operators.
                Clear fees, professional ops, and real paths to grow with us.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/careers"
                  className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition"
                >
                  Company drivers
                </Link>
                <Link
                  href="/lease-on"
                  className="inline-flex items-center justify-center border border-slate-500 hover:border-slate-300 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition"
                >
                  Lease-on authority
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center text-slate-300 hover:text-white font-medium px-2 py-2.5 text-sm transition"
                >
                  Contact →
                </Link>
              </div>
            </div>

            {/* Quick stats / promises */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-800/80 border border-slate-700 p-4">
                <p className="text-2xl font-bold text-white">10%</p>
                <p className="text-xs text-slate-400 mt-1">
                  Lease-on fee · factoring included
                </p>
              </div>
              <div className="rounded-xl bg-slate-800/80 border border-slate-700 p-4">
                <p className="text-2xl font-bold text-white">+5%</p>
                <p className="text-xs text-slate-400 mt-1">
                  Optional dispatch add-on
                </p>
              </div>
              <div className="rounded-xl bg-slate-800/80 border border-slate-700 p-4">
                <p className="text-2xl font-bold text-white">6 mo</p>
                <p className="text-xs text-slate-400 mt-1">
                  Lease-purchase path for company drivers
                </p>
              </div>
              <div className="rounded-xl bg-slate-800/80 border border-slate-700 p-4">
                <p className="text-2xl font-bold text-white">0%</p>
                <p className="text-xs text-slate-400 mt-1">
                  Interest on truck purchase payments
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All services */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                What we offer
              </h2>
              <p className="text-slate-600 mt-1 text-sm md:text-base">
                Two ways to work with Sortep—pick the path that fits you.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Company drivers */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Company drivers
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Drive our trucks
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Run company equipment with transparent percentage pay. Focus on
                safe, on-time loads—we handle the truck and authority.
              </p>
              <ul className="space-y-2 text-sm text-slate-700 mb-6">
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  Company trucks provided
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  Clear percentage-of-gross pay
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  Lease-purchase after 6 months of solid performance
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  Interest-free payments toward owning the truck
                </li>
              </ul>
              <Link
                href="/careers"
                className="inline-flex w-full items-center justify-center bg-slate-900 hover:bg-slate-800 text-white font-medium px-4 py-2.5 rounded-lg text-sm transition"
              >
                View driving opportunities
              </Link>
            </div>

            {/* Owner-operators */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wide text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                  Owner-operators
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Lease onto our authority
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Bring your truck and run under Sortep authority with a simple
                fee structure—factoring included.
              </p>
              <ul className="space-y-2 text-sm text-slate-700 mb-6">
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <strong>10%</strong> lease-on fee (factoring included)
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  Optional dispatch for an extra <strong>5%</strong>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  Transparent settlements
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  Built for operators who want clean numbers
                </li>
              </ul>
              <Link
                href="/lease-on"
                className="inline-flex w-full items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2.5 rounded-lg text-sm transition"
              >
                Explore lease-on
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Sortep — compact */}
      <section className="border-t border-slate-200 bg-slate-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Why operators choose Sortep
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl bg-white border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900 mb-1">Safety first</h3>
              <p className="text-sm text-slate-600">
                Professional standards on every load and every mile.
              </p>
            </div>
            <div className="rounded-xl bg-white border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900 mb-1">
                Clear money
              </h3>
              <p className="text-sm text-slate-600">
                Published fees and transparent settlements—no mystery cuts.
              </p>
            </div>
            <div className="rounded-xl bg-white border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900 mb-1">
                Room to grow
              </h3>
              <p className="text-sm text-slate-600">
                From company driver to ownership, or lease-on with optional
                dispatch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl bg-slate-900 text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <h2 className="text-xl font-bold">Ready to get started?</h2>
              <p className="text-slate-300 text-sm mt-1">
                Apply to drive a company truck, or reach out about leasing onto
                our authority.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link
                href="/apply"
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition"
              >
                Apply now
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center border border-slate-600 hover:border-slate-400 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}