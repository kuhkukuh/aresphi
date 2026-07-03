'use client';

import Image from 'next/image';

const PARTNER_LOGOS = [
  { name: 'BNI', src: '/partners/bni.svg' },
  { name: 'BJB', src: '/partners/bjb.svg' },
  { name: 'BTN', src: '/partners/btn.svg' },
  { name: 'BRI', src: '/partners/bri.svg' },
  { name: 'BCA', src: '/partners/bca.svg' },
  { name: 'BPR', src: '/partners/bpr.svg' },
  { name: 'BPR HIK', src: '/partners/bpr-hik.svg' },
  { name: 'BWS', src: '/partners/bws.svg' },
  { name: 'Bank Sampoerna', src: '/partners/sampoerna.svg' },
];

/**
 * PartnerLogos - Marquee scroll of bank partner logos
 *
 * Usage: Import and place below hero section
 * import PartnerLogos from '@/components/PartnerLogos';
 *
 * Features:
 * - Infinite horizontal scroll (30s cycle)
 * - Pause on hover
 * - Greyscale with color reveal on hover
 * - Reduced motion support
 */
export default function PartnerLogos() {
  return (
    <section className="py-16 border-y border-stone-400/10 overflow-hidden bg-white/30">
      <div className="marquee-mask">
        <div
          className="flex items-center gap-20 animate-marquee hover:[animation-play-state:paused]"
          style={{ width: 'fit-content' }}
        >
          {/* First set */}
          {PARTNER_LOGOS.map((logo) => (
            <div
              key={logo.name}
              className="flex-shrink-0 px-10 text-stone-400 font-semibold text-lg tracking-wider opacity-40 hover:opacity-80 transition-all"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                width={160}
                height={64}
                className="h-16 w-auto object-contain"
              />
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {PARTNER_LOGOS.map((logo) => (
            <div
              key={`${logo.name}-dup`}
              className="flex-shrink-0 px-10 text-stone-400 font-semibold text-lg tracking-wider opacity-40 hover:opacity-80 transition-all"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                width={160}
                height={64}
                className="h-16 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
