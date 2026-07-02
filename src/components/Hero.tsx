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
  photos?: [HeroPhoto, HeroPhoto, HeroPhoto];
};

const defaultHeroPhotos: [HeroPhoto, HeroPhoto, HeroPhoto] = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    alt: "Modern home exterior",
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    alt: "Luxury interior",
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    alt: "Contemporary living space",
  },
];

export default function Hero({ photos = defaultHeroPhotos }: HeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const cardStackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const metaCardRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useGSAP(
    () => {
      if (prefersReducedMotion) return;
      if (!wordmarkRef.current || !metaCardRef.current || !taglineRef.current) return;

      const validCards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
      if (validCards.length === 0) return;

      // Entrance timeline
      createHeroTimeline(
        wordmarkRef.current,
        validCards,
        metaCardRef.current,
        taglineRef.current
      );

      // Scroll-triggered parallax
      if (containerRef.current && wordmarkRef.current && cardStackRef.current) {
        gsap.to(wordmarkRef.current, {
          y: -150,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.to(cardStackRef.current, {
          y: -50,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex flex-col justify-end overflow-hidden pt-24"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0d1f] via-[#0e1228] to-[#0a0d1f]" />

      {/* Wordmark */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <h1
          ref={wordmarkRef}
          className="select-none text-[17vw] leading-[0.85] text-center will-change-transform font-playfair italic tracking-tighter text-white"
          style={{ opacity: prefersReducedMotion ? 1 : 0 }}
        >
          Aresphi<span className="text-orange">®</span>
        </h1>
      </div>

      {/* Stacked Cards */}
      <div
        ref={cardStackRef}
        className="relative z-20 max-w-7xl mx-auto px-6 w-full pb-16 -mt-[6vw] will-change-transform"
      >
        <div className="relative h-[44vh] sm:h-[52vh]">
          {/* Card 1 - Front/Center */}
          <div
            ref={(el) => { cardsRef.current[0] = el; }}
            className="hero-card absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[72%] sm:w-[55%] md:w-[44%] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-black/60 ring-1 ring-white/10 will-change-transform z-30"
            style={{ opacity: prefersReducedMotion ? 1 : 0 }}
          >
            <img
              src={photos[0].src}
              alt={photos[0].alt}
              className="w-full h-full object-cover bg-stone-800"
              onError={(e) => {
                e.currentTarget.style.visibility = "hidden";
              }}
            />
          </div>

          {/* Card 2 - Middle/Left */}
          <div
            ref={(el) => { cardsRef.current[1] = el; }}
            className="hero-card absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[58%] sm:w-[42%] md:w-[32%] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-black/60 ring-1 ring-white/10 will-change-transform z-20"
            style={{ opacity: prefersReducedMotion ? 1 : 0 }}
          >
            <img
              src={photos[1].src}
              alt={photos[1].alt}
              className="w-full h-full object-cover bg-stone-800"
              onError={(e) => {
                e.currentTarget.style.visibility = "hidden";
              }}
            />
          </div>

          {/* Card 3 - Back/Right */}
          <div
            ref={(el) => { cardsRef.current[2] = el; }}
            className="hero-card absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[58%] sm:w-[42%] md:w-[32%] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-black/60 ring-1 ring-white/10 will-change-transform z-10"
            style={{ opacity: prefersReducedMotion ? 1 : 0 }}
          >
            <img
              src={photos[2].src}
              alt={photos[2].alt}
              className="w-full h-full object-cover bg-stone-800"
              onError={(e) => {
                e.currentTarget.style.visibility = "hidden";
              }}
            />
          </div>
        </div>
      </div>

      {/* Meta Card - Brand Info */}
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

      {/* Tagline */}
      <div
        ref={taglineRef}
        className="absolute bottom-8 left-6 z-30 max-w-xs will-change-transform"
        style={{ opacity: prefersReducedMotion ? 1 : 0 }}
      >
        <p className="text-sm text-white/50 leading-relaxed">
          Full-service property partner for sales, rental, and consultation across Indonesia.
        </p>
      </div>
    </section>
  );
}
