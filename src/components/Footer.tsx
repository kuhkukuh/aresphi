export default function Footer() {
  return (
    <footer className="relative bg-stone-900 pt-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Band */}
        <div className="flex justify-between text-xs tracking-[0.2em] text-white/40 border-b border-white/10 pb-8">
          <span>EST. 2020</span>
          <span className="hidden sm:block">
            QUALITY // TRUST // TRANSPARENCY
          </span>
          <span>MENU</span>
        </div>

        {/* Contact Links */}
        <div className="text-center py-20">
          <a
            href="tel:+6281234567890"
            className="block text-3xl sm:text-4xl md:text-5xl hover:text-white/70 transition-colors font-medium tracking-tight text-white"
            aria-label="Call Aresphi Property"
          >
            +62 812 3456 7890
          </a>
          <a
            href="mailto:info@aresphi.com"
            className="block text-3xl sm:text-4xl md:text-5xl text-orange mt-2 hover:text-orange/80 transition-colors font-medium tracking-tight"
            aria-label="Email Aresphi Property"
          >
            info@aresphi.com
          </a>
        </div>

        {/* Info Grid */}
        <div className="grid sm:grid-cols-3 gap-8 text-xs text-white/40 pb-16">
          <div>
            <p>ALL RIGHTS RESERVED.</p>
            <p className="mt-1">©2025 ARESPHI</p>
          </div>
          <div className="sm:text-center">
            <p>JL. SUDIRMAN NO. 123</p>
            <p className="mt-1">JAKARTA SELATAN, 12190</p>
          </div>
          <div className="sm:text-right space-x-4">
            <a
              href="#"
              className="hover:text-white transition-colors"
              aria-label="Follow us on Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              INSTAGRAM
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors"
              aria-label="Connect with us on LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              LINKEDIN
            </a>
          </div>
        </div>
      </div>

      {/* Watermark */}
      <p className="select-none text-[24vw] leading-[0.75] text-white/[0.04] text-center -mb-[4vw] font-bold tracking-tight pointer-events-none">
        ARESPHI
      </p>
    </footer>
  );
}
