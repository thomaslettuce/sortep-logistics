import Link from "next/link";

export default function ApplySuccessPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <div className="bg-white border border-slate-200 rounded-xl p-10 shadow-sm">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
          Application Submitted
        </h1>
        <p className="text-slate-600 mb-8">
          Thank you for applying to SORTEP LOGISTICS. We have received your
          application and will review it shortly.
        </p>
        <Link
          href="/"
          className="inline-flex items-center bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-lg transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}