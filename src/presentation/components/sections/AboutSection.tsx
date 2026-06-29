'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Container } from '@/presentation/components/ui';

export function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section className="py-32 bg-bg-primary" ref={containerRef}>
      <Container>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6"
        >
          <div>
            <span className="text-xs text-stone-400 uppercase tracking-widest mb-4 block">
              / 01 Mengapa Aresphi
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-medium text-stone-900 tracking-tight">
              Kepercayaan
              <br />
              <span className="text-stone-400">yang Terbukti</span>
            </h2>
          </div>
          <p className="text-stone-500 max-w-sm text-sm leading-relaxed">
            Kami berkomitmen memberikan layanan terbaik dengan integritas dan profesionalisme.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:h-[500px]">
          {/* Large card - spans 2 cols, full height */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-2 md:row-span-2 flashlight-card group cursor-pointer"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
              e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
            }}
          >
            <div className="flashlight-card-content p-8 flex flex-col justify-between h-full min-h-[300px] md:min-h-0">
              <div>
                <span className="px-3 py-1 bg-orange-100 text-orange-600 text-xs font-semibold uppercase tracking-wider rounded mb-6 inline-block">
                  Unggulan
                </span>
                <h3 className="text-3xl md:text-4xl font-heading font-medium text-stone-900 mb-4">
                  Tim Profesional
                </h3>
                <p className="text-stone-500 text-base leading-relaxed max-w-sm">
                  Tim kami terdiri dari profesional bersertifikat dengan pengalaman bertahun-tahun di industri properti Indonesia.
                </p>
              </div>
              <div className="flex justify-between items-end mt-8">
                <span className="text-5xl">👥</span>
                <div className="relative text-orange-400">
                  <span className="text-2xl">✦</span>
                  <span className="sonar-ring" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Medium card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flashlight-card group cursor-pointer"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
              e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
            }}
          >
            <div className="flashlight-card-content p-6 flex flex-col justify-between h-full min-h-[200px]">
              <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center text-2xl mb-4">
                🏠
              </div>
              <div>
                <h4 className="text-lg font-heading font-medium text-stone-900">Layanan Lengkap</h4>
                <p className="text-stone-500 text-sm mt-1">Konsultasi hingga pendampingan</p>
              </div>
            </div>
          </motion.div>

          {/* Medium card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flashlight-card group cursor-pointer"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
              e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
            }}
          >
            <div className="flashlight-card-content p-6 flex flex-col justify-between h-full min-h-[200px]">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-2xl mb-4">
                🌐
              </div>
              <div>
                <h4 className="text-lg font-heading font-medium text-stone-900">Jaringan Luas</h4>
                <p className="text-stone-500 text-sm mt-1">Properti eksklusif</p>
              </div>
            </div>
          </motion.div>

          {/* Wide card - spans 2 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="md:col-span-2 bg-stone-800 rounded-2xl p-8 flex items-center justify-between text-white relative overflow-hidden group"
          >
            <div className="relative z-10">
              <h4 className="text-2xl font-heading font-medium mb-2">Transparansi Total</h4>
              <p className="text-white/60 text-sm mb-6 max-w-xs">
                Informasi jujur dan proses yang mudah dipahami. Tanpa biaya tersembunyi.
              </p>
              <div className="flex items-center gap-1 text-orange-400">
                <span className="text-xl">✓</span>
                <span className="text-sm font-medium">Dijamin Aman</span>
              </div>
            </div>
            <div className="w-20 h-20 rounded-full border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <span className="text-lg font-medium">100%</span>
            </div>
            {/* Ambient glow */}
            <div className="absolute right-0 bottom-0 h-full w-1/3 bg-gradient-to-l from-orange-900/20 to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
