import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Reliable Freight.
              <br />
              <span className="text-blue-400">Professional Logistics.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-2xl">
              SORTEP LOGISTICS delivers dependable trucking solutions across the country.
              Safety, on-time performance, and driver-focused operations.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/careers"
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-medium px-8 py-3.5 rounded-lg transition"
              >
                Drive With Us
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center border border-slate-600 hover:border-slate-400 text-white font-medium px-8 py-3.5 rounded-lg transition"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Safety First</h3>
              <p className="text-slate-600 leading-relaxed">
                We prioritize safety in every load and every mile. Our drivers and equipment meet the highest standards.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-3">On-Time Delivery</h3>
              <p className="text-slate-600 leading-relaxed">
                Reliable scheduling and professional dispatching to keep freight moving efficiently.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Driver Focused</h3>
              <p className="text-slate-600 leading-relaxed">
                We treat our drivers with respect and provide clear, transparent information about their work.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}