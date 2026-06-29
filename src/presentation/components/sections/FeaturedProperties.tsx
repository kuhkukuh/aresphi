'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView, useMotionValue, useMotionTemplate } from 'framer-motion';
import { Container } from '@/presentation/components/ui';
import { propertyInquiryLink } from '@/infrastructure/external/whatsapp';

const featuredProperties = [
  {
    id: '1',
    title: 'Rumah Modern di Pondok Indah',
    price: 2500000000,
    city: 'Jakarta Selatan',
    images: [],
    type: 'sale' as const,
    area: 200,
    bedrooms: 4,
    bathrooms: 3,
  },
  {
    id: '2',
    title: 'Apartemen Mewah Sudirman',
    price: 35000000,
    city: 'Jakarta Pusat',
    images: [],
    type: 'rent' as const,
    area: 85,
    bedrooms: 2,
    bathrooms: 1,
  },
  {
    id: '3',
    title: 'Villa Eksklusif BSD',
    price: 4500000000,
    city: 'Tangerang',
    images: [],
    type: 'sale' as const,
    area: 350,
    bedrooms: 5,
    bathrooms: 4,
  },
];

const formatPrice = (price: number, type: 'sale' | 'rent'): string => {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return type === 'rent' ? `${formatter.format(price)}/bulan` : formatter.format(price);
};

function PropertyCard({ property, index }: { property: typeof featuredProperties[0]; index: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });

  const whatsappUrl = propertyInquiryLink(
    property.title,
    `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/properti/${property.id}`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200/50"
    >
      {/* Flashlight glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(230, 126, 34, 0.1),
              transparent 40%
            )
          `,
        }}
      />

      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-stone-100">
        {property.images[0] ? (
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300 grayscale-[30%] group-hover:grayscale-0 transition-all">
            No image
          </div>
        )}
        
        {/* Type badge */}
        <span
          className={`absolute top-4 left-4 px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-md ${
            property.type === 'sale'
              ? 'bg-orange-400/90 text-white'
              : 'bg-stone-800/90 text-white'
          }`}
        >
          {property.type === 'sale' ? 'Dijual' : 'Disewa'}
        </span>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-heading text-xl font-medium text-stone-900 mb-1 group-hover:text-orange-600 transition-colors">
          {property.title}
        </h3>
        <p className="text-sm text-stone-500 mb-4">{property.city}</p>
        
        <p className="text-xl font-semibold text-orange-500 mb-4">
          {formatPrice(property.price, property.type)}
        </p>

        {property.area && (
          <div className="flex gap-6 text-sm text-stone-500 mb-6">
            {property.area && <span>{property.area} m²</span>}
            {property.bedrooms && <span>{property.bedrooms} KT</span>}
            {property.bathrooms && <span>{property.bathrooms} KM</span>}
          </div>
        )}

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center py-3 bg-stone-800 text-beige-200 rounded-xl hover:bg-stone-900 transition-colors text-sm font-medium"
        >
          Tanyakan Properti
        </a>
      </div>
    </motion.div>
  );
}

export function FeaturedProperties() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section className="py-24" ref={containerRef}>
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6"
        >
          <div>
            <span className="text-xs text-stone-400 uppercase tracking-widest mb-4 block">
              / 02 Properti Pilihan
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-medium text-stone-900 tracking-tight">
              Temukan
              <br />
              <span className="text-stone-400">Properti Anda</span>
            </h2>
          </div>
          <Link
            href="/katalog"
            className="group inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors"
          >
            <span className="text-sm font-medium">Lihat Semua</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </motion.div>

        {/* Property grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((property, index) => (
            <PropertyCard key={property.id} property={property} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}
