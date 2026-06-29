'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Container } from '@/presentation/components/ui';

const team = [
  {
    name: 'Ahmad Rizki',
    role: 'Founder & CEO',
  },
  {
    name: 'Dewi Kusuma',
    role: 'Senior Property Consultant',
  },
  {
    name: 'Budi Pratama',
    role: 'Property Consultant',
  },
];

export function TeamSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section className="py-24" ref={containerRef}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs text-stone-400 uppercase tracking-widest mb-4 block">
            / 04 Tim Kami
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-medium text-stone-900 tracking-tight">
            Profesional <span className="text-stone-400">Berpengalaman</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20, rotate: 0 }}
              animate={isInView ? { opacity: 1, y: 0, rotate: index % 2 === 0 ? -1 : 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ rotate: 0, y: -8 }}
              className="flashlight-card text-center group cursor-pointer"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
              }}
            >
              <div className="flashlight-card-content p-8">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-orange-200 to-stone-200 flex items-center justify-center text-stone-500 text-2xl font-heading mb-6 group-hover:scale-110 transition-transform">
                  {member.name.charAt(0)}
                </div>
                <h3 className="font-heading text-xl font-medium text-stone-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-stone-500 text-sm">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
