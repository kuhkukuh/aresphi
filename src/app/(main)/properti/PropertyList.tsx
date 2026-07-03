import Link from 'next/link';
import { stripHtml } from '@/lib/utils';

interface Property {
  id: number;
  name: string;
  slug: string;
  location: string;
  price: string;
  propertyType: 'rumah' | 'apartemen' | 'villa' | 'ruko';
  landArea: number | null;
  buildingArea: number | null;
  description: string | null;
  photos: { url: string; alt: string }[];
}

interface PropertyListProps {
  properties: Property[];
}

export default function PropertyList({ properties }: PropertyListProps) {
  if (properties.length === 0) {
    return (
      <main className="flex-1 flex flex-col border-t border-stone-300/40">
        <div className="py-16 text-center">
          <p className="text-stone-500">Tidak ada properti yang ditemukan.</p>
          <p className="text-sm text-stone-400 mt-2">Coba ubah filter Anda.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col border-t border-stone-300/40">
      {properties.map((property) => (
        <Link
          key={property.id}
          href={`/properti/${property.slug}`}
          className="property-row group block py-8 px-6 border-b border-stone-300/40 hover:bg-white/40 transition-colors"
        >
          <div className="flex flex-col md:flex-row gap-6">
            {/* Property Image */}
            <div className="row-img w-full md:w-[38%] aspect-[4/3] rounded-2xl shrink-0 overflow-hidden">
              {property.photos[0] ? (
                <img
                  src={property.photos[0].url}
                  alt={property.photos[0].alt || property.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out filter grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-stone-200 flex items-center justify-center">
                  <span className="text-stone-400 text-sm">No photo</span>
                </div>
              )}
            </div>

            {/* Property Info */}
            <div className="flex-1 flex flex-col justify-center gap-3 py-2">
              {/* Type Badge */}
              <div className="flex items-center gap-3">
                <span
                  className="text-xs uppercase tracking-[0.2em] text-stone-400"
                  style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}
                >
                  {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
                </span>
              </div>

              {/* Name */}
              <h3 className="font-playfair italic text-2xl md:text-3xl text-stone-900">
                {property.name}
              </h3>

              {/* Price */}
              <p className="text-sm font-normal text-stone-900">
                Rp <span className="text-orange">{property.price.replace('Rp ', '')}</span>
              </p>

              {/* Location */}
              <p className="text-sm text-stone-500 flex items-center gap-1.5">
                <i className="ph ph-map-pin text-sm"></i>
                {property.location}
              </p>

              {/* Specs */}
              <div className="flex items-center gap-4 text-sm text-stone-500">
                {property.landArea && (
                  <>
                    <span className="flex items-center gap-1.5">
                      <i className="ph ph-ruler text-base"></i>
                      Luas Tanah {property.landArea} m²
                    </span>
                    <span className="text-stone-300">•</span>
                  </>
                )}
                {property.buildingArea && (
                  <span className="flex items-center gap-1.5">
                    <i className="ph ph-square text-base"></i>
                    Luas Bangunan {property.buildingArea} m²
                  </span>
                )}
              </div>

              {/* Description */}
              {property.description && (
                <p className="text-sm text-stone-500 line-clamp-2 max-w-md">
                  {stripHtml(property.description)}
                </p>
              )}
            </div>
          </div>
        </Link>
      ))}

      {/* Load More Button (placeholder) */}
      <div className="pt-4 text-center">
        <button
          type="button"
          className="inline-flex items-center gap-2 border border-stone-300 rounded-full px-6 py-3 hover:bg-stone-900 hover:text-white transition-colors text-base font-medium"
          disabled
        >
          Muat Lebih Banyak
        </button>
      </div>
    </main>
  );
}
