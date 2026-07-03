import { db } from '@/infrastructure/database';
import { socials } from '@/infrastructure/database/schema';
import { desc } from 'drizzle-orm';

type Socials = {
  phone: string | null;
  email: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  instagram: string | null;
  linkedin: string | null;
};

async function getSocials(): Promise<Socials> {
  try {
    const result = await db.select().from(socials).orderBy(desc(socials.id)).limit(1);
    if (result.length === 0) {
      return { phone: null, email: null, addressLine1: null, addressLine2: null, instagram: null, linkedin: null };
    }
    return result[0];
  } catch {
    return { phone: null, email: null, addressLine1: null, addressLine2: null, instagram: null, linkedin: null };
  }
}

export default async function Footer() {
  const socials = await getSocials();
  
  // Generate WhatsApp link (remove all non-digits from phone)
  const whatsappLink = socials.phone ? `https://wa.me/${socials.phone.replace(/\D/g, '')}` : null;
  
  return (
    <footer className="relative bg-stone-900 pt-16 md:pt-20 lg:pt-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Band */}
        <div className="flex justify-between text-xs tracking-[0.2em] text-white/40 border-b border-white/10 pb-8">
          <span>EST. 2020</span>
          <span className="hidden sm:block">
            KUALITAS // KEPERCAYAAN // TRANSPARANSI
          </span>
          <a
              href="/admin"
              className="hover:text-white transition-colors"
              aria-label="Admin login"
            >
              ADMIN
            </a>
        </div>

        {/* Contact Links */}
        <div id="kontak" className="text-center py-12 md:py-16 lg:py-20 space-y-2">
          {/* Phone */}
          {socials.phone ? (
            <>
              <a
                href={`tel:${socials.phone}`}
                className="inline-block text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white
                  bg-gradient-to-r from-white to-white bg-[length:0%_2px] bg-no-repeat bg-[position:left_bottom]
                  hover:bg-[length:100%_2px] transition-all duration-300 pb-1"
                aria-label="Call Aresphi Property"
              >
                {socials.phone}
              </a>
              <br />
            </>
          ) : null}
          {/* Email */}
          {socials.email ? (
            <a
              href={`mailto:${socials.email}`}
              className="inline-block text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-orange
                bg-gradient-to-r from-orange to-orange bg-[length:0%_2px] bg-no-repeat bg-[position:left_bottom]
                hover:bg-[length:100%_2px] transition-all duration-300 pb-1"
              aria-label="Email Aresphi Property"
            >
              {socials.email}
            </a>
          ) : null}
          {/* Fallback if no contact info */}
          {!socials.phone && !socials.email && (
            <p className="text-xl text-white/40">Kontak belum dikonfigurasi</p>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid sm:grid-cols-3 gap-8 text-xs text-white/40 pb-8 md:pb-12 lg:pb-16 text-center sm:text-left">
          <div>
            <p>HAK CIPTA DILINDUNGI.</p>
            <p className="mt-1">©2025 ARESPHI</p>
          </div>
          <div className="text-center">
            {socials.addressLine1 && <p>{socials.addressLine1.toUpperCase()}</p>}
            {socials.addressLine2 && <p className="mt-1">{socials.addressLine2.toUpperCase()}</p>}
            {!socials.addressLine1 && !socials.addressLine2 && (
              <p className="text-white/30">Alamat belum dikonfigurasi</p>
            )}
          </div>
          <div className="lg:text-right space-x-4">
            {socials.instagram ? (
              <a
                href={socials.instagram}
                className="hover:text-white transition-colors"
                aria-label="Follow us on Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                INSTAGRAM
              </a>
            ) : null}
            {socials.linkedin ? (
              <a
                href={socials.linkedin}
                className="hover:text-white transition-colors"
                aria-label="Connect with us on LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                LINKEDIN
              </a>
            ) : null}
          </div>
        </div>
      </div>

      {/* Watermark */}
      <p className="select-none text-[24vw] leading-[0.75] text-white/[0.04] text-center -mb-[4vw] font-bold tracking-tight pointer-events-none">
        ARESPHI
      </p>
    </footer>
  );
}
