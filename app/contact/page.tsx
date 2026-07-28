export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
        Contact Us
      </h1>
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-4">
        <p className="text-slate-600">
          Have a question or want to get in touch? Reach out to us anytime.
        </p>
        <div className="space-y-2 text-slate-700">
          <p>
            <span className="font-medium">Location:</span> Atlanta, Georgia
          </p>
          <p>
            <span className="font-medium">Email:</span>{" "}
            <a
              href="mailto:info@sorteplogistics.com"
              className="text-blue-600 hover:underline"
            >
              info@sorteplogistics.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}