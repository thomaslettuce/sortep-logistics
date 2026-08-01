import Link from "next/link";

export default function CareersPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 py-14 md:py-20">
          <p className="text-blue-400 text-sm font-semibold tracking-wide uppercase mb-3">
            Drive With Us
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-4">
            Drive Sortep trucks
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl mb-8">
            Company equipment, transparent percentage-of-gross pay, weekly
            paychecks, and a real path to ownership for drivers who perform
            well.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mb-8">
            <div className="rounded-xl bg-slate-800 border border-slate-700 p-4">
              <p className="text-lg font-bold text-white">Company trucks</p>
              <p className="text-xs text-slate-400 mt-1">
                No truck required to start
              </p>
            </div>
            <div className="rounded-xl bg-slate-800 border border-slate-700 p-4">
              <p className="text-lg font-bold text-white">Weekly pay</p>
              <p className="text-xs text-slate-400 mt-1">
                % of gross · transparent
              </p>
            </div>
            <div className="rounded-xl bg-slate-800 border border-slate-700 p-4">
              <p className="text-lg font-bold text-white">Lease-purchase</p>
              <p className="text-xs text-slate-400 mt-1">
                After 6 months · interest-free
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/apply"
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-lg transition"
            >
              Apply to drive
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
        {/* Lease-purchase featured */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Lease-purchase program
          </h2>
          <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
            <p className="text-slate-700 mb-5">
              Drive our company trucks first. After{" "}
              <strong>6 months</strong> of{" "}
              <strong>satisfactory performance</strong>, you may qualify to buy
              the truck and move toward ownership.
            </p>
            <ul className="space-y-3 text-slate-700 mb-5">
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold shrink-0">✓</span>
                Interest-free payments toward the truck
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold shrink-0">✓</span>
                Continue driving with Sortep while you pay it off
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold shrink-0">✓</span>
                Built for company drivers—not the owner-operator lease-on
                program
              </li>
            </ul>
            <p className="text-sm text-slate-500">
              Qualification depends on safety, reliability, and overall
              performance. Terms are confirmed in writing before you start the
              purchase path.
            </p>
          </div>
        </section>

        {/* Role */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Company driver role
          </h2>
          <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
            <p className="text-slate-700 mb-5">
              You drive Sortep equipment. We handle the truck, authority, and
              coordination. You focus on safe, on-time delivery.
            </p>
            <ul className="space-y-3 text-slate-700">
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold shrink-0">✓</span>
                Company trucks — you don’t need to own a tractor to start
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold shrink-0">✓</span>
                Paid a <strong>percentage of gross</strong> revenue
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold shrink-0">✓</span>
                <strong>Weekly pay</strong> on a steady schedule
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold shrink-0">✓</span>
                Transparent settlements so you can see how pay is calculated
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold shrink-0">✓</span>
                Respectful dispatch and clear communication
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold shrink-0">✓</span>
                Safety-first culture
              </li>
            </ul>
          </div>
        </section>

        {/* Who it's for */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Who this is for
          </h2>
          <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
            <ul className="space-y-3 text-slate-700">
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold shrink-0">✓</span>
                Professional drivers who want company equipment
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold shrink-0">✓</span>
                Drivers who care about safety, communication, and reliability
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold shrink-0">✓</span>
                People who want transparent pay—not mystery deductions
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold shrink-0">✓</span>
                Drivers interested in a longer-term path toward truck ownership
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
                body: "Submit a short application with your experience and contact info.",
              },
              {
                step: "2",
                title: "Review",
                body: "We review your application and follow up if it’s a potential fit.",
              },
              {
                step: "3",
                title: "Onboard",
                body: "Complete required paperwork and get set up on company equipment.",
              },
              {
                step: "4",
                title: "Drive & grow",
                body: "Run loads with clear weekly pay—and work toward lease-purchase if you qualify.",
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

        {/* Expectations */}
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
                Safety-minded record and reliable communication
              </li>
              <li className="flex gap-3">
                <span className="text-slate-400 shrink-0">•</span>
                Willingness to represent Sortep professionally with brokers and
                receivers
              </li>
              <li className="flex gap-3">
                <span className="text-slate-400 shrink-0">•</span>
                Ability to complete required onboarding and compliance paperwork
              </li>
            </ul>
            <p className="mt-5 text-sm text-slate-500">
              Hiring depends on a review of your application and qualifications.
              Lease-purchase eligibility is separate and based on performance
              after you start.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">FAQ</h2>
          <div className="space-y-3">
            <details className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm group">
              <summary className="font-semibold text-slate-900 cursor-pointer list-none flex justify-between gap-4">
                Do I need my own truck?
                <span className="text-slate-400 group-open:rotate-45 transition">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                No. Company drivers operate Sortep trucks. You don’t need to
                bring your own tractor to get started.
              </p>
            </details>

            <details className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm group">
              <summary className="font-semibold text-slate-900 cursor-pointer list-none flex justify-between gap-4">
                How does pay work?
                <span className="text-slate-400 group-open:rotate-45 transition">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Company drivers are paid a <strong>percentage of gross</strong>{" "}
                revenue on a <strong>weekly</strong> schedule. Settlements are
                set up so you can see how pay is calculated—no mystery math.
              </p>
            </details>

            <details className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm group">
              <summary className="font-semibold text-slate-900 cursor-pointer list-none flex justify-between gap-4">
                What is the lease-purchase program?
                <span className="text-slate-400 group-open:rotate-45 transition">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                After 6 months of satisfactory performance driving our company
                trucks, you may qualify to purchase the truck with interest-free
                payments while continuing with Sortep until it’s paid off.
              </p>
            </details>

            <details className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm group">
              <summary className="font-semibold text-slate-900 cursor-pointer list-none flex justify-between gap-4">
                Is this the same as leasing onto your authority?
                <span className="text-slate-400 group-open:rotate-45 transition">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                No. This page is for company drivers. If you already have your
                own truck and want to lease onto our authority, see the{" "}
                <Link href="/lease-on" className="text-blue-600 hover:underline">
                  Owner Operators
                </Link>{" "}
                page.
              </p>
            </details>

            <details className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm group">
              <summary className="font-semibold text-slate-900 cursor-pointer list-none flex justify-between gap-4">
                How do I apply?
                <span className="text-slate-400 group-open:rotate-45 transition">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Use the apply form or contact us. We’ll review your information
                and follow up if it looks like a fit.
              </p>
            </details>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-slate-900 text-white rounded-2xl p-8 md:p-10">
          <h2 className="text-2xl font-bold mb-3">Ready to drive with us?</h2>
          <p className="text-slate-300 mb-8 max-w-xl">
            Company trucks. Weekly pay. Transparent percentage of gross. A path
            to ownership for drivers who earn it.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/apply"
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-lg transition"
            >
              Apply to drive
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
          Already have your own truck?{" "}
          <Link href="/lease-on" className="text-blue-600 hover:underline">
            See Owner Operators
          </Link>{" "}
          — lease onto Sortep authority with factoring included.
        </p>
      </div>
    </div>
  );
}