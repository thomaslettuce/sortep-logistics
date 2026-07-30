import Link from "next/link";

export default function CareersPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Drive for SORTEP
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          We’re hiring professional company drivers for our trucks. Steady
          freight, clear communication, and a real path toward truck ownership
          for drivers who perform well.
        </p>
      </div>

      <section className="mb-12">
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">
            Company driver position
          </h2>
          <p className="text-slate-600 mb-6">
            Drive our company equipment. You focus on safe, on-time delivery—we
            handle the truck, authority, and coordination.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-600 mb-8">
            <li>Company trucks — you are not required to own equipment</li>
            <li>Competitive percentage-of-gross pay</li>
            <li>Respectful dispatch and transparent settlements</li>
            <li>Safety-first culture</li>
          </ul>
          <Link
            href="/apply"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-lg transition"
          >
            Apply to drive
          </Link>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Benefits of driving with us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-2">
              Lease-purchase program
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              After <strong>6 months</strong> of driving our company trucks with{" "}
              <strong>satisfactory performance</strong>, you may qualify to buy
              the truck. Make interest-free payments while you continue working
              with SORTEP until the truck is paid off.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-2">
              Clear pay structure
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Company drivers are paid a percentage of gross revenue. No games—
              you can see how settlements are calculated.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-2">
              Company equipment
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Drive maintained company trucks. You don’t need to bring your own
              tractor to get started.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-2">
              Professional operations
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Safety, communication, and reliability matter here. We look for
              drivers who take pride in the work.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 text-white rounded-xl p-8">
        <h2 className="text-xl font-bold mb-2">Ready to apply?</h2>
        <p className="text-slate-300 mb-6">
          Submit a short application and we’ll follow up if it’s a fit.
        </p>
        <Link
          href="/apply"
          className="inline-flex items-center bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-lg transition"
        >
          Apply now
        </Link>
      </section>

      <p className="mt-10 text-sm text-slate-500">
        Already have your own truck and want to lease onto our authority?{" "}
        <Link href="/lease-on" className="text-blue-600 hover:underline">
          See our lease-on program
        </Link>
        .
      </p>
    </div>
  );
}