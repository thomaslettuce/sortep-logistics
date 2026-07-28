import Link from "next/link";

export default function CareersPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
        Drive With Us
      </h1>
      <p className="text-lg text-slate-600 mb-10">
        We’re looking for professional drivers who value safety, clear
        communication, and fair treatment.
      </p>

      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 mb-3">
          Current Opportunities
        </h2>
        <p className="text-slate-600 mb-6">
          We are actively looking for qualified drivers. If you’re interested in
          joining the SORTEP LOGISTICS team, please apply below.
        </p>
        <Link
          href="/apply"
          className="inline-flex items-center bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-lg transition"
        >
          Apply Now
        </Link>
      </div>
    </div>
  );
}