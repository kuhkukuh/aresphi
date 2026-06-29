'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Container } from '@/presentation/components/ui';

const testimonials = [
  {
    id: 1,
    name: 'Budi Santoso',
    role: 'Pembeli Rumah',
    location: 'Jakarta',
    content: 'Aresphi membantu saya menemukan rumah impian dengan sangat profesional. Proses yang mudah dan transparan. Sangat direkomendasikan!',
  },
  {
    id: 2,
    name: 'Siti Rahayu',
    role: 'Investor Properti',
    location: 'Bandung',
    content: 'Tim Aresphi sangat memahami kebutuhan investor. Mereka memberikan rekomendasi properti yang tepat untuk investasi saya.',
  },
  {
    id: 3,
    name: 'Ahmad Fauzi',
    role: 'Penjual Properti',
    location: 'Tangerang',
    content: 'Properti saya terjual dalam waktu singkat dengan harga terbaik. Terima kasih Aresphi!',
  },
];

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollTo = (index: number) => {
    setActiveIndex(index);
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.scrollWidth / testimonials.length;
      sliderRef.current.scrollTo({
        left: scrollAmount * index,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-24" ref={containerRef}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-stone-850 rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden"
        >
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <span className="font-heading font-bold text-white/[0.03] text-[14vw] leading-none">
              TESTIMONI
            </span>
          </div>

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6 relative z-10">
            <div>
              <span className="text-xs text-stone-400 uppercase tracking-widest mb-4 block">
                / 03 Testimoni
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-medium text-white tracking-tight">
                Ap Kata Mereka?
              </h2>
            </div>
            
            {/* Navigation */}
            <div className="flex gap-2">
              <button
                onClick={() => scrollTo((activeIndex - 1 + testimonials.length) % testimonials.length)}
                className="w-12 h-12 rounded-full border border-stone-700 flex items-center justify-center hover:bg-stone-700 transition-colors text-stone-300"
              >
                ←
              </button>
              <button
                onClick={() => scrollTo((activeIndex + 1) % testimonials.length)}
                className="w-12 h-12 rounded-full border border-stone-700 flex items-center justify-center hover:bg-stone-700 transition-colors text-stone-300"
              >
                →
              </button>
            </div>
          </div>

          {/* Slider */}
          <div
            ref={sliderRef}
            className="flex overflow-x-auto gap-6 snap-x hide-scrollbar scroll-smooth pb-4"
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="min-w-[100%] md:min-w-[80%] lg:min-w-[70%] snap-center"
              >
                <div className="bg-stone-800/50 rounded-3xl p-8 md:p-12 backdrop-blur-sm border border-stone-700/50">
                  <span className="text-5xl text-orange-400/30 mb-6 block">&ldquo;</span>
                  <p className="text-xl md:text-2xl text-white leading-relaxed mb-8 font-light">
                    {testimonial.content}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-stone-700 flex items-center justify-center text-beige-200 font-heading text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-orange-400 font-medium">{testimonial.name}</div>
                      <div className="text-stone-500 text-sm">{testimonial.role} • {testimonial.location}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, dotIndex) => (
              <button
                key={dotIndex}
                onClick={() => scrollTo(dotIndex)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  dotIndex === activeIndex ? 'bg-orange-400' : 'bg-stone-600'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
