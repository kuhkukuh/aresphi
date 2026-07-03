import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import DetailClient from './DetailClient';
import Footer from '@/components/Footer';
import FlashlightCard from '@/components/FlashlightCard';
import PropertyMap from '@/components/PropertyMap';
import {
  getAllPropertySlugs,
  getPropertyBySlug,
  getRandomProperties,
  getSocials,
} from '@/lib/data';

// On-demand ISR: pages are cached indefinitely until admin makes changes
// Revalidation happens via revalidateTag() in admin API routes

// Generate static params for all properties at build time
export async function generateStaticParams() {
  return getAllPropertySlugs();
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

  const [suggestedProperties, social] = await Promise.all([
    getRandomProperties(property.id, 5),
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

            {/* Map */}
            <div className="mt-12">
              <div className="eyebrow">
                <span className="eyebrow-left"><span className="text-stone-500">—</span> Lokasi</span>
                <span className="eyebrow-right">[ 02 ]</span>
              </div>
              <PropertyMap
                latitude={property.latitude}
                longitude={property.longitude}
                location={property.location}
                propertyName={property.name}
              />
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

      {/* Suggested Properties */}
      {suggestedProperties.length > 0 && (
        <section className="py-24 relative overflow-hidden bg-white w-full">
          <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12">
            <div className="eyebrow">
              <span className="eyebrow-left"><span className="text-stone-500">—</span> Properti Lainnya</span>
              <span className="eyebrow-right">[ 05 ]</span>
            </div>
            <h2 className="mt-6 text-4xl font-medium leading-[1.02] sm:text-5xl text-stone-900" style={{ letterSpacing: '-.055em' }}>
              Mungkin Anda<br /><span className="font-playfair italic font-normal text-stone-500/80">juga tertarik</span>
            </h2>
          </div>

          <div className="h-[55vh] flex items-center w-full relative overflow-x-auto no-scrollbar">
            <div className="flex gap-6 px-6 md:px-12 w-max h-[80%] items-center">
              {suggestedProperties.map((suggested) => (
                <a
                  key={suggested.id}
                  href={`/properti/${suggested.slug}`}
                  className="similar-card relative w-[300px] md:w-[360px] h-full rounded-2xl overflow-hidden group shadow-xl shrink-0"
                >
                  {suggested.photos[0] ? (
                    <img
                      src={suggested.photos[0].url}
                      alt={suggested.photos[0].alt || suggested.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out filter grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-stone-200" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                    <div className="bg-white/20 backdrop-blur-md rounded-full px-4 py-2 text-sm font-medium mb-4 inline-block">
                      {suggested.price}
                    </div>
                    <h3 className="font-playfair text-2xl italic">{suggested.name}</h3>
                    <p className="text-white/70 text-sm">{suggested.location}</p>
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
