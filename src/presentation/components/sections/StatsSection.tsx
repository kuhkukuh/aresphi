'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Container } from '@/presentation/components/ui';

const stats = [
  { label: 'Properti Terjual', value: 150, suffix: '+' },
  { label: 'Klien Puas', value: 200, suffix: '+' },
  { label: 'Tahun Pengalaman', value: 5, suffix: '+' },
  { label: 'Listing Aktif', value: 50, suffix: '+' },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    const stepValue = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref} className="text-5xl md:text-6xl font-heading font-normal text-white">
      {count}{suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="relative bg-stone-850 py-32 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-2/3 bg-gradient-to-b from-orange-900/10 to-transparent blur-3xl pointer-events-none" />
      
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span className="font-heading font-bold text-white/[0.03] text-[18vw] leading-none">
          STATS
        </span>
      </div>

      <Container className="relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <p className="mt-3 text-stone-400 text-sm uppercase tracking-widest">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Progress bars */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-stone-400 text-sm">Tingkat Keberhasilan</span>
              <span className="text-orange-400 font-medium">98%</span>
            </div>
            <div className="w-full h-2 bg-stone-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-orange-400"
                initial={{ width: 0 }}
                whileInView={{ width: '98%' }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-stone-400 text-sm">Kepuasan Klien</span>
              <span className="text-orange-400 font-medium">95%</span>
            </div>
            <div className="w-full h-2 bg-stone-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-orange-400"
                initial={{ width: 0 }}
                whileInView={{ width: '95%' }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.6 }}
              />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-stone-400 text-sm">Respon Cepat</span>
              <span className="text-orange-400 font-medium">24jam</span>
            </div>
            <div className="w-full h-2 bg-stone-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-orange-400"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.7 }}
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
