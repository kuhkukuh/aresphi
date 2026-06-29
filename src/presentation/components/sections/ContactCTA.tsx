'use client';

import { motion } from 'framer-motion';
import { Container } from '@/presentation/components/ui';
import { defaultGreetingLink } from '@/infrastructure/external/whatsapp';

export function ContactCTA() {
  const whatsappUrl = defaultGreetingLink();

  return (
    <section className="relative bg-stone-850 py-32 overflow-hidden">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span className="font-heading font-bold text-white/[0.03] text-[18vw] leading-none">
          ARESPHI
        </span>
      </div>

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-2/3 bg-gradient-to-b from-orange-900/10 to-transparent blur-3xl pointer-events-none" />

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 mb-8">
            <div className="relative text-orange-400">
              <span className="text-3xl">✦</span>
              <span className="sonar-ring" />
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-heading font-medium text-white tracking-tight mb-6">
            Siap Membantu Anda
          </h2>
          <p className="text-lg text-stone-400 mb-10 max-w-md mx-auto">
            Konsultasikan kebutuhan properti Anda dengan tim kami. Gratis dan tanpa komitmen.
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 bg-orange-400 text-stone-900 px-10 py-5 rounded-full text-lg font-medium hover:bg-orange-300 transition-all shadow-xl shadow-orange-900/20"
          >
            Hubungi via WhatsApp
            <motion.span
              className="w-10 h-10 rounded-full bg-stone-900 text-orange-400 flex items-center justify-center"
              whileHover={{ rotate: 45 }}
              transition={{ duration: 0.3 }}
            >
              →
            </motion.span>
          </a>

          <p className="text-stone-500 text-sm mt-8">
            Respon cepat dalam 24 jam
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
