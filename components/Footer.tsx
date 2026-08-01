import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">
              SORTEP <span className="text-blue-400">LOGISTICS</span>
            </h3>
            <p className="text-sm leading-relaxed">
              Professional freight transportation and logistics services.
              Reliable. Efficient. Trusted.
            </p>
          </div>

                    {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-blue-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-400 transition">
                  About
                </Link>
              </li>
              <li>
                <Link href="/lease-on" className="hover:text-blue-400 transition">
                  Owner Operators
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-blue-400 transition">
                  Drive With Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>Atlanta, Georgia</li>
              <li>
                <a
                  href="mailto:info@sorteplogistics.com"
                  className="hover:text-blue-400 transition"
                >
                  info@sorteplogistics.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 text-center text-sm">
          © 2026 SORTEP LOGISTICS LLC. All rights reserved.
        </div>
      </div>
    </footer>
  );
}