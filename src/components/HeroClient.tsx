"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { createHeroTimeline } from "@/lib/animations/hero";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type HeroPhoto = {
  id: string;
  src: string;
  alt: string;
};

export type HeroProps = {
  photos: [HeroPhoto, HeroPhoto, HeroPhoto];
};

export default function HeroClient({ photos }: HeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const cardStackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const metaCardRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useGSAP(
    () => {
      if (prefersReducedMotion) return;
      if (!wordmarkRef.current || !cardStackRef.current || !metaCardRef.current || !taglineRef.current) return;

      const validCards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
      if (validCards.length === 0) return;

      createHeroTimeline(
        wordmarkRef.current,
        validCards,
        cardStackRef.current,
        metaCardRef.current,
        taglineRef.current
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex flex-col justify-center md:justify-end overflow-hidden pt-24 pb-8 md:pb-0"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0d1f] via-[#0e1228] to-[#0a0d1f]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <h1
          ref={wordmarkRef}
          className="select-none text-[24vw] sm:text-[20vw] md:text-[17vw] leading-[0.85] text-center will-change-transform font-playfair italic tracking-tighter text-white"
          style={{ opacity: prefersReducedMotion ? 1 : 0 }}
        >
          Aresphi<span className="text-orange">®</span>
        </h1>
      </div>

      <div
        ref={cardStackRef}
        className="relative z-20 max-w-7xl mx-auto px-6 w-full pb-16 -mt-[6vw] will-change-transform"
      >
        <div className="relative h-[44vh] sm:h-[52vh]">
          {[0, 1, 2].map((idx) => (
            <div
              key={idx}
              ref={(el) => { cardsRef.current[idx] = el; }}
              className={`hero-card absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-black/60 ring-1 ring-white/10 will-change-transform ${
                idx === 0 ? 'w-[72%] sm:w-[55%] md:w-[44%] z-30' : 
                idx === 1 ? 'w-[58%] sm:w-[42%] md:w-[32%] z-20' : 
                'w-[58%] sm:w-[42%] md:w-[32%] z-10'
              }`}
              style={{ opacity: prefersReducedMotion ? 1 : 0 }}
            >
              <img
                src={photos[idx].src}
                alt={photos[idx].alt}
                className="w-full h-full object-cover bg-stone-800"
                onError={(e) => {
                  e.currentTarget.style.visibility = "hidden";
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div
        ref={metaCardRef}
        className="absolute bottom-8 right-6 z-30 hidden md:flex items-center gap-4 rounded-xl bg-white/5 backdrop-blur-xl ring-1 ring-white/10 p-4 will-change-transform"
        style={{ opacity: prefersReducedMotion ? 1 : 0 }}
      >
        <div className="w-14 h-14 rounded-lg bg-white/10 ring-1 ring-white/10 flex items-center justify-center">
          <span className="text-2xl font-playfair italic text-white/60">A</span>
        </div>
        <div>
          <p className="text-xs tracking-[0.25em] text-white/40">EST. 2020</p>
          <p className="text-sm font-medium mt-1 text-white">Aresphi</p>
        </div>
      </div>

      <div
        ref={taglineRef}
        className="absolute bottom-8 left-6 z-30 max-w-xs will-change-transform"
        style={{ opacity: prefersReducedMotion ? 1 : 0 }}
      >
        <p className="text-sm text-white/50 leading-relaxed">
          Mitra properti lengkap untuk jual-beli, sewa, dan konsultasi di seluruh Indonesia.
        </p>
      </div>
    </section>
  );
}
