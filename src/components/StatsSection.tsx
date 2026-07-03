'use client';

import { useState, useEffect } from 'react';

interface Stat {
  id: number;
  key: string;
  value: number;
  suffix: string;
  label: string;
  displayOrder: number;
}

// Fallback stats for when API is unavailable
const fallbackStats: Stat[] = [
  { id: 1, key: 'properties_sold', value: 150, suffix: '+', label: 'Properti Terjual', displayOrder: 1 },
  { id: 2, key: 'happy_clients', value: 200, suffix: '+', label: 'Klien Puas', displayOrder: 2 },
  { id: 3, key: 'years_experience', value: 5, suffix: '+', label: 'Tahun Pengalaman', displayOrder: 3 },
  { id: 4, key: 'success_rate', value: 98, suffix: '%', label: 'Keberhasilan', displayOrder: 4 },
];

export default function StatsSection() {
  const [stats, setStats] = useState<Stat[]>(fallbackStats);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setStats(data);
        }
      })
      .catch(() => {
        // Use fallback stats on error
      });
  }, []);

  return (
    <section className="relative bg-stone-850 py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="font-bold text-white text-[18vw] leading-[0.85] opacity-[0.03] select-none">
          DATA
        </span>
      </div>
      
      {/* Gradient overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-2/3 bg-gradient-to-b from-amber-500/10 to-transparent blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <div className="eyebrow">
            <span className="eyebrow-left">/ 02 Pencapaian</span>
            <span className="eyebrow-right">[ 02 ]</span>
          </div>
          <h2 className="mt-6 md:mt-8 text-4xl font-medium leading-[1.1] sm:text-5xl md:text-6xl text-white tracking-[-0.055em]">
            Angka <span className="font-playfair italic font-normal text-white/90">Berbicara</span>
          </h2>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat) => (
            <div key={stat.id} className="text-center md:text-left">
              <div className="text-5xl md:text-7xl font-semibold text-white mb-2" style={{ letterSpacing: '-0.02em' }}>
                {stat.value}<span className="text-orange">{stat.suffix}</span>
              </div>
              <p className="text-xs font-bold uppercase text-white/50" style={{ letterSpacing: '0.24em' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
