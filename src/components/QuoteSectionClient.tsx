"use client";

import { useState, useEffect } from "react";

type Testimonial = {
  id: number;
  quote: string;
  name: string;
  title: string;
};

export default function QuoteSectionClient({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
        setIsAnimating(false);
      }, 400);
    }, 6000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const activeTestimonial = testimonials[activeIndex];

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="relative h-[50vh] md:h-[65vh] lg:h-[80vh] overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/quote-section.webp"
          alt="Property"
          className="w-full h-full object-cover bg-stone-800"
          onError={(e) => {
            e.currentTarget.style.visibility = "hidden";
          }}
        />
      </div>

      {/* Dark Scrim Overlay */}
      <div className="absolute inset-0 bg-stone-900/55" />

      {/* Quote Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <div
          className={`transition-all duration-400 ${
            isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
          }`}
        >
          {activeTestimonial && (
            <>
              <p className="text-3xl sm:text-4xl md:text-5xl leading-snug font-normal tracking-tighter text-white whitespace-pre-line">
                "{activeTestimonial.quote}"
              </p>
              <p className="text-sm font-medium mt-8 text-white">
                {activeTestimonial.name}
              </p>
              <p className="text-xs tracking-[0.2em] text-white/40 mt-1">
                {activeTestimonial.title}
              </p>
            </>
          )}
        </div>

        {testimonials.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === activeIndex ? "bg-white w-6" : "bg-white/40"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
