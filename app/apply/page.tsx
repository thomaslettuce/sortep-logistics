import { submitApplication } from "./actions";

export default function ApplyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
          Driver Application
        </h1>
        <p className="text-slate-600">
          Interested in driving with SORTEP LOGISTICS? Fill out the form below
          and we’ll get back to you.
        </p>
      </div>

      <form
        action={submitApplication}
        className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-6"
      >
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1.5">
            Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            required
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="John Doe"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="john@example.com"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="(555) 123-4567"
          />
        </div>

        {/* CDL Info */}
        <div>
          <label htmlFor="cdl" className="block text-sm font-medium text-slate-700 mb-1.5">
            CDL Class & Endorsements
          </label>
          <input
            type="text"
            id="cdl"
            name="cdl"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Class A, Hazmat, etc."
          />
        </div>

        {/* Years of Experience */}
        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-slate-700 mb-1.5">
            Years of Experience
          </label>
          <input
            type="text"
            id="experience"
            name="experience"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="e.g. 5 years"
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1.5">
            Additional Information
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
            placeholder="Tell us anything else you'd like us to know..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-6 rounded-lg transition"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
}