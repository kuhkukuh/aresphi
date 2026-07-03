'use client';

import Image from 'next/image';

const PARTNER_LOGOS = [
  { name: 'BCA', src: '/partners/bca.png' },
  { name: 'BNI', src: '/partners/bni.png' },
  { name: 'Mandiri', src: '/partners/mandiri.png' },
  { name: 'BJB', src: '/partners/bjb.png' },
  { name: 'BTN', src: '/partners/btn.png' },
  { name: 'BSI', src: '/partners/bsi.png' },
  { name: 'CIMB Niaga', src: '/partners/cimb.png' },
];

/**
 * PartnerLogos - Marquee scroll of bank partner logos
 *
 * Usage: Import and place below hero section
 * import PartnerLogos from '@/components/PartnerLogos';
 *
 * Features:
 * - Infinite horizontal scroll (30s cycle)
 * - Reduced motion support
 */
export default function PartnerLogos() {
  return (
    <section className="relative z-10 border-y border-stone-400/10 bg-white">
      <div className="overflow-hidden">
        <div
          className="flex items-center gap-8 md:gap-16 lg:gap-24 animate-marquee will-change-transform"
          style={{
            width: 'fit-content',
          }}
        >
          {/* First set */}
          {PARTNER_LOGOS.map((logo) => (
            <div
              key={logo.name}
              className="flex-shrink-0 px-6 md:px-12 lg:px-20"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                width={360}
                height={144}
                className="h-24 md:h-36 w-auto object-contain transition-all duration-300"
                style={{ width: 'auto' }}
              />
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {PARTNER_LOGOS.map((logo) => (
            <div
              key={`${logo.name}-dup`}
              className="flex-shrink-0 px-6 md:px-12 lg:px-20"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                width={360}
                height={144}
                className="h-24 md:h-36 w-auto object-contain transition-all duration-300"
                style={{ width: 'auto' }}
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 30s linear infinite;
        }


      `}</style>
    </section>
  );
}
