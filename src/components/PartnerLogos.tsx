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
    <section className="py-6 overflow-hidden bg-stone-50 dark:bg-stone-900">
      <div className="relative marquee-mask">
        <div
          className="flex gap-8 animate-marquee hover:[animation-play-state:paused]"
          style={{ width: 'fit-content' }}
        >
          {/* First set */}
          {PARTNER_LOGOS.map((logo) => (
            <div
              key={logo.name}
              className="flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300"
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
              className="flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300"
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
