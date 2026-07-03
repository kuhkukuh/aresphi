"use client";

import { useState, useEffect } from "react";

type Testimonial = {
  id: number;
  quote: string;
  name: string;
  title: string;
};

export default function USPSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then(setTestimonials)
      .catch(() => {
        setTestimonials([
          { id: 1, quote: "Tim profesional yang sangat membantu.", name: "Ahmad Wijaya", title: "Jakarta" },
        ]);
      });
  }, []);

  useEffect(() => {
    if (testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
        setIsAnimating(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleFlashlightMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  const activeTestimonial = testimonials[activeIndex];

  return (
    <section id="tentang" className="py-16 md:py-24 lg:py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 md:mb-16 gap-6">
          <div>
            <div className="eyebrow">
              <span className="eyebrow-left">
                / 01 Mengapa Aresphi
              </span>
              <span className="eyebrow-right">
                [ 01 ]
              </span>
            </div>
            <h2 className="mt-8 text-4xl font-medium leading-[1.1] sm:text-5xl md:text-6xl text-stone-900 tracking-[-0.055em]">
              Kepercayaan
              <br />
              <span className="font-playfair italic font-normal text-stone-500/80">
                yang Terbukti
              </span>
            </h2>
          </div>
          <p className="text-stone-500 max-w-sm text-sm">
            Kami berkomitmen memberikan layanan terbaik dengan profesionalisme tinggi.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:h-[500px]">
          {/* Testimonial Card */}
          <div className="sm:col-span-2 lg:col-span-2 lg:row-span-2 relative group overflow-hidden rounded-2xl min-h-[300px]">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
              alt="Interior"
              className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105 bg-stone-200"
              onError={(e) => {
                e.currentTarget.style.visibility = "hidden";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
              <div
                className={`transition-opacity duration-300 ${
                  isAnimating ? "opacity-0" : "opacity-100"
                }`}
              >
                {activeTestimonial && (
                  <>
                    <p className="text-white/80 text-xl font-light leading-snug mb-4 tracking-tighter">
                      "{activeTestimonial.quote}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-sm font-medium">
                        {activeTestimonial.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{activeTestimonial.name}</p>
                        <p className="text-white/60 text-xs">{activeTestimonial.title}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
              {testimonials.length > 1 && (
                <div className="flex gap-2 mt-4">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === activeIndex ? "bg-white w-4" : "bg-white/40"
                      }`}
                      aria-label={`Go to testimonial ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Flashlight Card 01 */}
          <div
            className="flashlight-card overflow-hidden relative rounded-xl bg-white/60 backdrop-blur-xl border border-black/5 cursor-pointer"
            onMouseMove={handleFlashlightMove}
          >
            <span className="absolute -top-2 -right-1 font-playfair text-[120px] italic tracking-tighter text-stone-900/30 leading-none select-none pointer-events-none">
              01
            </span>
            <div className="relative z-10 p-6 h-full flex flex-col justify-end min-h-[160px] sm:min-h-[180px]">
              <h4 className="font-playfair text-2xl italic text-stone-900 mb-1">
                Layanan Lengkap
              </h4>
              <p className="text-stone-500 text-sm">
                Konsultasi hingga transaksi
              </p>
            </div>
          </div>

          {/* Flashlight Card 02 */}
          <div
            className="flashlight-card overflow-hidden relative rounded-xl bg-white/60 backdrop-blur-xl border border-black/5 cursor-pointer"
            onMouseMove={handleFlashlightMove}
          >
            <span className="absolute -top-2 -right-1 font-playfair text-[120px] italic tracking-tighter text-stone-900/30 leading-none select-none pointer-events-none">
              02
            </span>
            <div className="relative z-10 p-6 h-full flex flex-col justify-end min-h-[160px] sm:min-h-[180px]">
              <h4 className="font-playfair text-2xl italic text-stone-900 mb-1">
                Jaringan Luas
              </h4>
              <p className="text-stone-500 text-sm">
                Akses properti eksklusif
              </p>
            </div>
          </div>

          {/* Dark Stats Card */}
          <div className="sm:col-span-2 lg:col-span-2 bg-[#0a0d1f] rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden text-white min-h-[160px]">
            <span className="absolute -top-2 -right-1 font-playfair text-[120px] italic tracking-tighter text-white/30 leading-none select-none pointer-events-none">
              03
            </span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange rounded-full animate-pulse" />
              <span className="text-xs uppercase tracking-wide opacity-80">
                Transparansi Total
              </span>
            </div>
            <div>
              <h3 className="text-3xl tracking-tight mb-2">100%</h3>
              <p className="text-white/60 text-sm">
                Informasi jujur. Tanpa biaya tersembunyi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
