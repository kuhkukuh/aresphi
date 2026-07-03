"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const steps = [
  {
    number: "01",
    title: "Konsultasi Awal",
    description: "Memahami visi dan kebutuhan Anda melalui sesi mendalam.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
    alt: "Konsultasi Awal",
  },
  {
    number: "02",
    title: "Kurasi Properti",
    description: "Menyajikan properti sesuai kriteria dari jaringan kami.",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80",
    alt: "Kurasi Properti",
  },
  {
    number: "03",
    title: "Pendampingan Transaksi",
    description: "Mendampingi setiap langkah hingga kunci di tangan.",
    image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600&q=80",
    alt: "Pendampingan Transaksi",
  },
];

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useGSAP(
    () => {
      if (prefersReducedMotion) return;
      if (!sectionRef.current) return;

      const validCards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
      if (validCards.length === 0) return;

      // Initial state
      gsap.set(validCards, { y: 40, opacity: 0 });

      // Staggered entrance animation
      gsap.to(validCards, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="layanan"
      className="py-32 px-6 md:px-12"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left Column - Sticky Heading */}
          <div className="flex flex-col justify-center sticky top-32 h-fit">
            <div className="eyebrow">
              <span className="eyebrow-left">/ 03 Proses Kami</span>
              <span className="eyebrow-right">[ 03 ]</span>
            </div>
            <h2
              className="mt-8 text-4xl font-medium leading-[1.02] sm:text-5xl md:text-6xl lg:text-[4.6rem] text-stone-900 mb-8"
              style={{ letterSpacing: "-0.055em" }}
            >
              Perjalanan
              <br />
              <span className="font-playfair italic font-normal text-stone-500/80">
                properti Anda
              </span>
            </h2>
            <a
              href="#kontak"
              className="inline-flex items-center gap-2 border border-stone-300 rounded-full px-6 py-3 w-max hover:bg-stone-900 hover:text-white transition-colors text-base font-medium"
            >
              Mulai Proses
            </a>
          </div>

          {/* Right Column - Cards */}
          <div className="relative w-full">
            <div className="grid gap-12 md:gap-16">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  ref={(el) => {
                    cardsRef.current[index] = el;
                  }}
                  className={`relative rounded-2xl overflow-hidden w-[85%] md:w-[70%] group shadow-xl ${
                    index % 2 === 0 ? "ml-auto" : ""
                  }`}
                  style={{ opacity: prefersReducedMotion ? 1 : 0 }}
                >
                  <img
                    src={step.image}
                    alt={step.alt}
                    className="w-full h-64 md:h-80 object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    onError={(e) => {
                      e.currentTarget.style.visibility = "hidden";
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                    <div className="bg-white/20 backdrop-blur-md rounded-full px-4 py-2 text-sm font-medium mb-4 inline-block">
                      {step.number}
                    </div>
                    <h3 className="font-playfair text-2xl italic">
                      {step.title}
                    </h3>
                    <p className="text-white/70 text-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
