'use client';

import Image from 'next/image';
import { motion, useMotionValue, useMotionTemplate, HTMLMotionProps } from 'framer-motion';
import { propertyInquiryLink } from '@/infrastructure/external/whatsapp';

interface PropertyData {
  id: string;
  title: string;
  price: number;
  city: string;
  images: string[];
  type: 'sale' | 'rent';
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
}

interface PropertyCardProps extends Omit<HTMLMotionProps<'div'>, 'children' | 'property'> {
  property: PropertyData;
}

const formatPrice = (price: number, type: 'sale' | 'rent'): string => {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return type === 'rent' ? `${formatter.format(price)}/bulan` : formatter.format(price);
};

export function PropertyCard({ property, className = '', ...props }: PropertyCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const whatsappUrl = propertyInquiryLink(
    property.title,
    `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/properti/${property.id}`
  );

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      className={`group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 ${className}`}
      {...props}
    >
      {/* Glow effect */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              300px circle at ${mouseX}px ${mouseY}px,
              rgba(230, 126, 34, 0.15),
              transparent 40%
            )
          `,
        }}
      />

      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-stone-200">
        {property.images[0] ? (
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-400">
            No image
          </div>
        )}
        <span
          className={`absolute top-3 left-3 px-3 py-1 text-xs font-medium rounded-full ${
            property.type === 'sale'
              ? 'bg-orange-400 text-white'
              : 'bg-stone-700 text-white'
          }`}
        >
          {property.type === 'sale' ? 'Dijual' : 'Disewa'}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-heading text-lg font-semibold text-stone-900 line-clamp-1">
          {property.title}
        </h3>
        <p className="text-sm text-stone-500 mt-1">{property.city}</p>
        <p className="text-orange-500 font-semibold mt-2">
          {formatPrice(property.price, property.type)}
        </p>

        {property.area && (
          <div className="flex gap-4 mt-3 text-sm text-stone-600">
            {property.area && <span>{property.area} m²</span>}
            {property.bedrooms && <span>{property.bedrooms} KT</span>}
            {property.bathrooms && <span>{property.bathrooms} KM</span>}
          </div>
        )}

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block w-full text-center py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors text-sm font-medium"
        >
          Tanyakan Properti
        </a>
      </div>
    </motion.div>
  );
}
