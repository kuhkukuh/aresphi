'use client';

import { motion } from 'framer-motion';
import { Container } from '@/presentation/components/ui';
import { defaultGreetingLink } from '@/infrastructure/external/whatsapp';

export function HeroSection() {
  const whatsappUrl = defaultGreetingLink();

  return (
    <section className="relative min-h-screen flex items-end pb-24 pt-32 overflow-hidden">
      {/* Background watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="font-heading font-bold text-stone-900/[0.03] text-[20vw] leading-none translate-y-[15%]">
          ARESPHI
        </span>
      </div>

      {/* Decorative vertical lines */}
      <div className="fixed inset-0 pointer-events-none z-50 flex justify-center w-full opacity-[0.04]">
        <div className="w-full max-w-7xl h-full flex justify-between px-6 lg:px-12">
          <div className="w-px h-full bg-stone-800" />
          <div className="w-px h-full bg-stone-800 hidden md:block" />
          <div className="w-px h-full bg-stone-800 hidden lg:block" />
          <div className="w-px h-full bg-stone-800" />
        </div>
      </div>

      <Container className="relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-end">
          {/* Left: Typography */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-stone-400/30 backdrop-blur-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-stone-600 font-medium tracking-wide">
                Partner Terpercaya untuk Properti Anda
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-heading font-medium tracking-tight text-stone-900 leading-[0.95] mb-8">
              Temukan
              <br />
              <span className="text-stone-400">Properti</span>
              <br />
              Impian
            </h1>

            {/* Subhead */}
            <p className="text-lg md:text-xl text-stone-500 max-w-md leading-relaxed mb-12 border-l-2 border-orange-400 pl-6">
              Jual-beli, sewa, dan konsultasi properti dengan layanan profesional dan transparan.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 bg-stone-800 text-beige-200 px-8 py-4 rounded-full text-base font-medium hover:bg-stone-900 transition-all shadow-xl shadow-stone-900/10"
              >
                Konsultasi Gratis
                <motion.span
                  className="w-8 h-8 rounded-full bg-beige-200 text-stone-900 flex items-center justify-center"
                  whileHover={{ rotate: 45 }}
                  transition={{ duration: 0.3 }}
                >
                  →
                </motion.span>
              </a>
              <a
                href="/katalog"
                className="inline-flex items-center gap-3 px-8 py-4 border border-stone-400/30 text-stone-700 rounded-full text-base font-medium hover:border-stone-400 transition-colors"
              >
                Lihat Properti
              </a>
            </div>
          </motion.div>

          {/* Right: Hero Image with floating elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            {/* Main arched image */}
            <div className="relative w-full aspect-[4/5]">
              <div className="absolute inset-0 rounded-t-[10rem] rounded-b-3xl overflow-hidden shadow-2xl shadow-stone-900/20 group">
                <div className="w-full h-full bg-gradient-to-br from-orange-200 to-stone-300 flex items-center justify-center">
                  <span className="text-stone-400 text-lg">Hero Image</span>
                </div>
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />
                
                {/* Bottom badge */}
                <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between text-white">
                  <div>
                    <p className="text-sm font-medium opacity-80 mb-1">Properti Unggulan</p>
                    <p className="text-2xl font-heading">Jakarta Selatan</p>
                  </div>
                  <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors">
                    →
                  </button>
                </div>
              </div>

              {/* Floating accent card */}
              <div className="absolute -bottom-8 -left-8 w-64 bg-stone-800 rounded-2xl p-6 shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative text-orange-400">
                    <span className="text-2xl">✦</span>
                    <span className="sonar-ring" />
                  </div>
                  <span className="text-beige-200 text-sm font-medium">Terpercaya</span>
                </div>
                <p className="text-beige-200/70 text-sm">
                  &ldquo;Proses cepat dan profesional. Sangat direkomendasikan!&rdquo;
                </p>
                <p className="text-beige-200/50 text-xs mt-2">— Klien Jakarta</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom stats bar */}
        <div className="mt-20 pt-8 border-t border-stone-400/10">
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center md:text-left">
              <span className="text-xs text-stone-400 uppercase tracking-widest">01</span>
              <p className="text-sm text-stone-600 mt-1">Jual Beli Properti</p>
            </div>
            <div className="text-center">
              <span className="text-xs text-stone-400 uppercase tracking-widest">02</span>
              <p className="text-sm text-stone-600 mt-1">Sewa & Investasi</p>
            </div>
            <div className="text-center md:text-right">
              <span className="text-xs text-stone-400 uppercase tracking-widest">03</span>
              <p className="text-sm text-stone-600 mt-1">Konsultasi Gratis</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
