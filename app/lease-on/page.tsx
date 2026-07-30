import Link from "next/link";

export default function LeaseOnPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Lease onto SORTEP authority
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          For owner-operators who want to run under our authority with a simple
          fee structure and optional dispatch support.
        </p>
      </div>

      <section className="mb-14">
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Authority lease-on — 10%
          </h2>
          <p className="text-slate-600 mb-6">
            Lease onto SORTEP LOGISTICS authority for{" "}
            <strong>10% of gross revenue</strong>. Factoring is included in that
            fee—there is no separate factoring percentage on top.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-600">
            <li>Operate under our MC / authority</li>
            <li>Factoring included in the 10%</li>
            <li>Transparent settlements</li>
          </ul>
        </div>
      </section>

      <section id="dispatch" className="mb-14 scroll-mt-24">
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Optional dispatch — +5%
          </h2>
          <p className="text-slate-600 mb-6">
            Want help booking and coordinating freight? Add dispatch for an
            additional <strong>5% of gross</strong>.
          </p>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <p className="font-medium text-slate-900 mb-1">Example</p>
            <p>
              $3,000 load → 10% lease-on = $300. With dispatch, total fees = 15%
              ($450).
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 text-white rounded-xl p-8 md:p-10 mb-10">
        <h2 className="text-2xl font-bold mb-3">Interested in leasing on?</h2>
        <p className="text-slate-300 mb-8 max-w-xl">
          Reach out and tell us about your equipment and experience.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-lg transition"
          >
            Contact us
          </Link>
          <Link
            href="/apply"
            className="inline-flex items-center justify-center border border-slate-600 hover:border-slate-400 text-white font-medium px-6 py-3 rounded-lg transition"
          >
            Submit an application
          </Link>
        </div>
      </section>

      <p className="text-sm text-slate-500">
        Looking to drive a company truck instead?{" "}
        <Link href="/careers" className="text-blue-600 hover:underline">
          See company driver opportunities
        </Link>
        , including our lease-purchase program.
      </p>
    </div>
  );
}