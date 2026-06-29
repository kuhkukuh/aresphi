'use client';

import { motion } from 'framer-motion';

const partners = [
  { name: 'Bank BCA', icon: '🏦' },
  { name: 'Bank Mandiri', icon: '🏦' },
  { name: 'BNI', icon: '🏦' },
  { name: 'BRI', icon: '🏦' },
  { name: 'CIMB Niaga', icon: '🏦' },
  { name: 'BTN', icon: '🏦' },
  { name: 'Bank Danamon', icon: '🏦' },
  { name: 'OCBC NISP', icon: '🏦' },
];

export function PartnerLogos() {
  return (
    <section className="py-16 border-y border-stone-400/10 bg-white/30 backdrop-blur-sm overflow-hidden">
      <div className="marquee-mask">
        <motion.div
          className="flex items-center gap-16 animate-marquee"
        >
          {/* Duplicate for seamless loop */}
          {[...partners, ...partners].map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="flex items-center gap-3 text-stone-400 opacity-40 hover:opacity-80 transition-opacity cursor-pointer grayscale hover:grayscale-0"
            >
              <span className="text-3xl">{partner.icon}</span>
              <span className="text-sm font-medium tracking-wide">{partner.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
