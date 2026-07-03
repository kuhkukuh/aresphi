import { db } from '@/infrastructure/database';
import { properties, propertyPhotos, socials } from '@/infrastructure/database/schema';
import { eq, and, ne, asc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import DetailClient from './DetailClient';
import Footer from '@/components/Footer';
import FlashlightCard from '@/components/FlashlightCard';

export const revalidate = 60; // ISR: regenerate every 60 seconds

// Generate static params for all properties at build time
export async function generateStaticParams() {
  try {
    const allProperties = await db
      .select({ slug: properties.slug })
      .from(properties);

    return allProperties.map((property) => ({
      slug: property.slug,
    }));
  } catch {
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return {
      title: 'Properti Tidak Ditemukan | Aresphi Property',
    };
  }

  return {
    title: `${property.name} | Aresphi Property`,
    description: property.description?.replace(/<[^>]*>/g, '').slice(0, 160) || `${property.name} - ${property.location}`,
    openGraph: {
      title: `${property.name} | Aresphi Property`,
      description: property.description?.replace(/<[^>]*>/g, '').slice(0, 160) || undefined,
      images: property.photos[0] ? [property.photos[0].url] : [],
    },
  };
}

async function getPropertyBySlug(slug: string) {
  try {
    const [property] = await db
      .select()
      .from(properties)
      .where(eq(properties.slug, slug));

    if (!property) return null;

    const photos = await db
      .select()
      .from(propertyPhotos)
      .where(eq(propertyPhotos.propertyId, property.id))
      .orderBy(asc(propertyPhotos.displayOrder));

    return {
      ...property,
      photos,
    };
  } catch {
    return null;
  }
}

async function getSimilarProperties(propertyId: number, propertyType: string) {
  try {
    const similar = await db
      .select()
      .from(properties)
      .where(
        and(
          eq(properties.propertyType, propertyType as 'rumah' | 'apartemen' | 'villa' | 'ruko'),
          ne(properties.id, propertyId)
        )
      )
      .limit(3);

    const withPhotos = await Promise.all(
      similar.map(async (prop) => {
        const photos = await db
          .select()
          .from(propertyPhotos)
          .where(eq(propertyPhotos.propertyId, prop.id))
          .orderBy(asc(propertyPhotos.displayOrder));
        return {
          ...prop,
          photos,
        };
      })
    );

    return withPhotos;
  } catch {
    return [];
  }
}

async function getSocials() {
  try {
    const [social] = await db.select().from(socials);
    return social || { phone: '', email: '' };
  } catch {
    return { phone: '', email: '' };
  }
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const [similarProperties, social] = await Promise.all([
    getSimilarProperties(property.id, property.propertyType),
    getSocials(),
  ]);

  // Format property type for display
  const propertyTypeLabel = {
    rumah: 'Rumah',
    apartemen: 'Apartemen',
    villa: 'Villa',
    ruko: 'Ruko',
  }[property.propertyType];

  return (
    <>
      {/* Breadcrumb */}
      <nav className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-40 pb-8 text-xs tracking-[0.2em] text-stone-400" aria-label="Breadcrumb">
        <a href="/properti" className="hover:text-orange transition-colors">Properti</a>
        <span className="mx-2">—</span>
        <a href={`/properti?tipe=${property.propertyType}`} className="hover:text-orange transition-colors">
          {propertyTypeLabel}
        </a>
        <span className="mx-2">—</span>
        <span className="text-stone-600">{property.name}</span>
      </nav>

      {/* Gallery */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-12">
        <DetailClient photos={property.photos.map(p => ({ url: p.url, alt: p.alt || property.name }))} />
      </section>

      {/* Detail Body */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-24">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Info */}
          <main className="flex-1 lg:w-[65%]">
            <h1 className="font-playfair italic text-4xl md:text-5xl text-stone-900">{property.name}</h1>
            <p className="text-stone-500 flex items-center gap-1.5 mt-3">
              <i className="ph ph-map-pin text-base"></i>
              {property.location}
            </p>
            <p className="text-lg font-normal mt-4 text-stone-900">Rp <span className="text-orange">{property.price.replace('Rp ', '')}</span></p>

            {/* Specs */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-8 border-y border-stone-200/60 my-8">
              {property.landArea && (
                <div className="text-center md:text-left">
                  <i className="ph ph-ruler text-orange text-xl mb-2 inline-block"></i>
                  <p className="text-xl font-semibold text-stone-900">{property.landArea} m²</p>
                  <p className="text-xs uppercase tracking-[.24em] text-stone-400">Luas Tanah</p>
                </div>
              )}
              {property.buildingArea && (
                <div className="text-center md:text-left">
                  <i className="ph ph-square text-orange text-xl mb-2 inline-block"></i>
                  <p className="text-xl font-semibold text-stone-900">{property.buildingArea} m²</p>
                  <p className="text-xs uppercase tracking-[.24em] text-stone-400">Luas Bangunan</p>
                </div>
              )}
              <div className="text-center md:text-left">
                <i className="ph ph-house-line text-orange text-xl mb-2 inline-block"></i>
                <p className="text-xl font-semibold text-stone-900">{propertyTypeLabel}</p>
                <p className="text-xs uppercase tracking-[.24em] text-stone-400">Tipe Properti</p>
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div>
                <div className="eyebrow">
                  <span className="eyebrow-left"><span className="text-stone-500">—</span> Deskripsi</span>
                  <span className="eyebrow-right">[ 01 ]</span>
                </div>
                <div
                  className="text-stone-600 leading-relaxed max-w-2xl prose prose-stone prose-sm"
                  dangerouslySetInnerHTML={{ __html: property.description }}
                />
              </div>
            )}

            {/* Map Placeholder */}
            <div className="mt-12">
              <div className="eyebrow">
                <span className="eyebrow-left"><span className="text-stone-500">—</span> Lokasi</span>
                <span className="eyebrow-right">[ 02 ]</span>
              </div>
              <div className="rounded-2xl overflow-hidden aspect-[16/7] bg-stone-200 relative flex items-center justify-center">
                <i className="ph-fill ph-map-pin text-orange text-4xl" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}></i>
                <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-md rounded-full px-4 py-2 text-sm text-stone-700">
                  {property.location}
                </div>
              </div>
            </div>
          </main>

          {/* Contact Card */}
          <aside className="lg:w-[35%]">
            <FlashlightCard className="lg:sticky lg:top-32">
              <div className="p-8 text-center">
                <h3 className="font-playfair italic text-2xl text-stone-900 leading-tight">
                  Tertarik dengan<br />properti ini?
                </h3>
                <p className="text-sm text-stone-500 mt-3 max-w-[220px] mx-auto">
                  Hubungi tim kami untuk jadwal survei atau informasi lebih lanjut.
                </p>

                {social.phone && (
                  <a
                    href={`https://wa.me/${social.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 flex items-center justify-center gap-2 border border-stone-300 rounded-full px-6 py-3 hover:bg-stone-900 hover:text-white transition-colors text-sm font-medium"
                  >
                    Chat via WhatsApp
                  </a>
                )}

                <div className="mt-8 pt-6 border-t border-stone-300/40 space-y-2">
                  {social.phone && (
                    <a href={`tel:${social.phone}`} className="block text-lg font-medium text-stone-900 hover:text-stone-600 transition-colors">
                      {social.phone}
                    </a>
                  )}
                  {social.email && (
                    <a href={`mailto:${social.email}`} className="block text-lg font-medium text-orange hover:text-orange/80 transition-colors">
                      {social.email}
                    </a>
                  )}
                </div>
              </div>
            </FlashlightCard>
          </aside>
        </div>
      </section>

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <section className="py-24 relative overflow-hidden bg-white/30 w-full">
          <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12">
            <div className="eyebrow">
              <span className="eyebrow-left"><span className="text-stone-500">—</span> Properti Serupa</span>
              <span className="eyebrow-right">[ 05 ]</span>
            </div>
            <h2 className="mt-6 text-4xl font-medium leading-[1.02] sm:text-5xl text-stone-900" style={{ letterSpacing: '-.055em' }}>
              Mungkin Anda<br /><span className="font-playfair italic font-normal text-stone-500/80">juga tertarik</span>
            </h2>
          </div>

          <div className="h-[55vh] flex items-center w-full relative overflow-x-auto no-scrollbar">
            <div className="flex gap-6 px-6 md:px-12 w-max h-[80%] items-center">
              {similarProperties.map((similar) => (
                <a
                  key={similar.id}
                  href={`/properti/${similar.slug}`}
                  className="similar-card relative w-[300px] md:w-[360px] h-full rounded-2xl overflow-hidden group shadow-xl shrink-0"
                >
                  {similar.photos[0] ? (
                    <img
                      src={similar.photos[0].url}
                      alt={similar.photos[0].alt || similar.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out filter grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-stone-200" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                    <div className="bg-white/20 backdrop-blur-md rounded-full px-4 py-2 text-sm font-medium mb-4 inline-block">
                      {similar.price}
                    </div>
                    <h3 className="font-playfair text-2xl italic">{similar.name}</h3>
                    <p className="text-white/70 text-sm">{similar.location}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}
