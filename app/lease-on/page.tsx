import Link from "next/link";

export default function LeaseOnPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 py-14 md:py-20">
          <p className="text-blue-400 text-sm font-semibold tracking-wide uppercase mb-3">
            Owner Operators
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-4">
            Lease onto Sortep authority
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl mb-8">
            A clean lease-on structure for owner-operators: run under our
            authority with factoring included, weekly payouts, and optional
            dispatch only if you want it.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mb-8">
            <div className="rounded-xl bg-slate-800 border border-slate-700 p-4">
              <p className="text-2xl font-bold text-white">10%</p>
              <p className="text-xs text-slate-400 mt-1">
                Lease-on · factoring included
              </p>
            </div>
            <div className="rounded-xl bg-slate-800 border border-slate-700 p-4">
              <p className="text-2xl font-bold text-white">+5%</p>
              <p className="text-xs text-slate-400 mt-1">
                Optional dispatch
              </p>
            </div>
            <div className="rounded-xl bg-slate-800 border border-slate-700 p-4">
              <p className="text-2xl font-bold text-white">Weekly</p>
              <p className="text-xs text-slate-400 mt-1">
                Payout schedule
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/apply"
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-lg transition"
            >
              Apply to lease on
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border border-slate-600 hover:border-slate-400 text-white font-medium px-6 py-3 rounded-lg transition"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16 space-y-12">
        {/* Who it's for */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Who this is for
          </h2>
          <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
            <ul className="space-y-3 text-slate-700">
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold shrink-0">✓</span>
                Owner-operators with their own truck who want to run under a
                carrier authority
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold shrink-0">✓</span>
                Drivers who want factoring included—not stacked as a surprise
                extra fee
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold shrink-0">✓</span>
                Operators who prefer steady{" "}
                <strong>weekly payouts</strong> and clear settlement breakdowns
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold shrink-0">✓</span>
                Operators who may want optional dispatch without being forced
                into it
              </li>
            </ul>
          </div>
        </section>

        {/* The package */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            The lease-on package
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <p className="text-sm font-semibold text-blue-600 mb-2">
                Included
              </p>
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                10% of gross
              </h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>Operate under Sortep Logistics authority</li>
                <li>Factoring included in the 10%</li>
                <li>No separate factoring percentage on top</li>
                <li>Weekly payouts</li>
                <li>Transparent settlement breakdown</li>
              </ul>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <p className="text-sm font-semibold text-blue-600 mb-2">
                Optional
              </p>
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Dispatch +5%
              </h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>Help finding and coordinating freight</li>
                <li>Only if you want it—not required</li>
                <li>Total with dispatch: 15% of gross</li>
                <li>You choose whether to use it</li>
              </ul>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
            <p className="font-semibold text-slate-900 mb-1">Fee example</p>
            <p>
              On a <strong>$3,000</strong> load: 10% lease-on ={" "}
              <strong>$300</strong>. With optional dispatch, total fees ={" "}
              <strong>15% ($450)</strong>. Remaining revenue is yours after
              agreed expenses and deductions, paid on a weekly schedule.
            </p>
          </div>
        </section>

        {/* Payouts highlight */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Weekly payouts
          </h2>
          <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
            <p className="text-slate-700 mb-4">
              Sortep runs on a <strong>weekly payout</strong> schedule so you’re
              not waiting on long, unclear payment cycles. You’ll see how fees
              and deductions are applied on each settlement.
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold shrink-0">✓</span>
                Weekly payment cadence
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold shrink-0">✓</span>
                Factoring included in the lease-on fee
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold shrink-0">✓</span>
                Clear breakdown of gross, fees, and net
              </li>
            </ul>
          </div>
        </section>

        {/* How it works */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                step: "1",
                title: "Apply",
                body: "Tell us about your experience, equipment, and whether you want dispatch.",
              },
              {
                step: "2",
                title: "Quick review",
                body: "We review your application and follow up if it’s a potential fit.",
              },
              {
                step: "3",
                title: "Setup",
                body: "Complete onboarding docs and get set up under our authority.",
              },
              {
                step: "4",
                title: "Haul & get paid",
                body: "Run loads with clear fees and weekly payouts.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm"
              >
                <p className="text-blue-600 font-bold text-sm mb-1">
                  Step {item.step}
                </p>
                <h3 className="font-semibold text-slate-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Requirements */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Basic expectations
          </h2>
          <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
            <ul className="space-y-3 text-slate-700 text-sm md:text-base">
              <li className="flex gap-3">
                <span className="text-slate-400 shrink-0">•</span>
                Valid CDL and professional driving experience
              </li>
              <li className="flex gap-3">
                <span className="text-slate-400 shrink-0">•</span>
                Reliable equipment that meets our operating standards
              </li>
              <li className="flex gap-3">
                <span className="text-slate-400 shrink-0">•</span>
                Safety-minded record and professional communication with brokers
                and receivers
              </li>
              <li className="flex gap-3">
                <span className="text-slate-400 shrink-0">•</span>
                Ability to complete required onboarding and compliance paperwork
              </li>
            </ul>
            <p className="mt-5 text-sm text-slate-500">
              Final acceptance depends on a review of your application and
              qualifications. Terms are confirmed in writing before you start.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">FAQ</h2>
          <div className="space-y-3">
            <details className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm group">
              <summary className="font-semibold text-slate-900 cursor-pointer list-none flex justify-between gap-4">
                What’s included in the 10%?
                <span className="text-slate-400 group-open:rotate-45 transition">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                The 10% lease-on fee covers running under Sortep authority and
                includes factoring. You are not charged a separate factoring
                percentage on top of the 10%.
              </p>
            </details>

            <details className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm group">
              <summary className="font-semibold text-slate-900 cursor-pointer list-none flex justify-between gap-4">
                How often do I get paid?
                <span className="text-slate-400 group-open:rotate-45 transition">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Owner-operators on our lease-on program are on a{" "}
                <strong>weekly payout</strong> schedule, with a clear breakdown
                of gross, fees, and net.
              </p>
            </details>

            <details className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm group">
              <summary className="font-semibold text-slate-900 cursor-pointer list-none flex justify-between gap-4">
                Do I have to use dispatch?
                <span className="text-slate-400 group-open:rotate-45 transition">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                No. Dispatch is optional for an additional 5% of gross if you
                want help finding and coordinating freight.
              </p>
            </details>

            <details className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm group">
              <summary className="font-semibold text-slate-900 cursor-pointer list-none flex justify-between gap-4">
                Is this the same as the company driver lease-purchase program?
                <span className="text-slate-400 group-open:rotate-45 transition">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                No. Lease-purchase is for company drivers who operate Sortep
                trucks. This page is for owner-operators leasing onto our
                authority with their own equipment.
              </p>
            </details>

            <details className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm group">
              <summary className="font-semibold text-slate-900 cursor-pointer list-none flex justify-between gap-4">
                How do I get started?
                <span className="text-slate-400 group-open:rotate-45 transition">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Submit an application or contact us. We’ll review your
                information and follow up if it looks like a fit.
              </p>
            </details>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-slate-900 text-white rounded-2xl p-8 md:p-10">
          <h2 className="text-2xl font-bold mb-3">Ready to lease on?</h2>
          <p className="text-slate-300 mb-8 max-w-xl">
            Tell us about your truck, experience, and whether you want optional
            dispatch. Weekly payouts. Clear fees. Straightforward setup.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/apply"
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-lg transition"
            >
              Apply to lease on
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border border-slate-600 hover:border-slate-400 text-white font-medium px-6 py-3 rounded-lg transition"
            >
              Contact us
            </Link>
          </div>
        </section>

        <p className="text-sm text-slate-500 text-center">
          Looking to drive a company truck instead?{" "}
          <Link href="/careers" className="text-blue-600 hover:underline">
            See Drive With Us
          </Link>{" "}
          — including our lease-purchase path for company drivers.
        </p>
      </div>
    </div>
  );
}