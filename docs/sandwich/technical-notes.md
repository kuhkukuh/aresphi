# Technical Notes — Aresphi Property

## Tech Lead's Architecture Notes

### Tech Stack: LOCKED

| Layer | Technology | Notes |
|-------|------------|-------|
| Framework | Next.js 14+ (App Router) | `[confirmed]` |
| Language | TypeScript | Strict mode enabled |
| Styling | Tailwind CSS | Fast development |
| ORM | Drizzle ORM | `[confirmed]` |
| Database | Neon (PostgreSQL) | `[confirmed]` |
| State Management | TanStack Query v5 | `[stated]` - server state |
| Rich Text | TipTap | `[confirmed]` |
| Auth | HTTPS cookie-only | `[stated]` - secure session |
| Image Storage | Vercel Blob | `[stated]` |
| Image Optimization | Sharp / next/image | `[stated]` - compression |
| Hosting | Vercel | Free tier sufficient for MVP |
| Maps | Google Maps API | For property location |
| Animations | Framer Motion or GSAP | `[stated]` - subtle, elegant animations |

---

### Design Implementation `[stated]`

**Design References:** 4 HTML templates in `docs/design-inpirations/`

#### Typography System

```typescript
// tailwind.config.ts
const fontFamily = {
  heading: ['Playfair Display', 'Newsreader', 'serif'],
  body: ['Geist', 'Plus Jakarta Sans', 'Manrope', 'sans-serif'],
  mono: ['Geist Mono', 'monospace'],
};
```

**Usage:**
- Headings (H1-H6): `font-heading` - serif, elegant
- Body text: `font-body` - clean, readable
- Labels/UI: `font-body` with `font-medium` or `font-semibold`

#### Color System

```typescript
// tailwind.config.ts - Custom colors
const colors = {
  // Brand
  orange: {
    DEFAULT: '#E67E22', // Primary brand color
    50: '#FEF3E2',
    100: '#FDEBD0',
    // ... shades
    600: '#D35400',
    700: '#A04000',
  },
  
  // Warm neutrals (inspired by design references)
  stone: {
    50: '#FAF9F7',  // Lightest background
    100: '#F5F3EF',
    200: '#E8E4DC',
    300: '#D4CFC3',
    400: '#A8A29E',
    500: '#78716C',
    600: '#57534E',
    700: '#44403C',
    800: '#2C2824', // Dark sections
    900: '#1C1917',
    950: '#0C0A09',
  },
  
  // Accent colors
  accent: {
    green: '#D4E8B0', // From design-3
    gold: '#D4F268',  // From design-4
  },
};
```

#### Animation Patterns

**1. Scroll-triggered reveal (inspired by design-3):**
```typescript
// Fade in on scroll
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  },
};

// Usage
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-100px" }}
  variants={fadeInUp}
>
  <PropertyCard />
</motion.div>
```

**2. Hover effects on cards (inspired by design-1):**
```typescript
// Flashlight/glow effect on hover
const CardWithGlow = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }}
      style={{
        '--mouse-x': `${mousePos.x}px`,
        '--mouse-y': `${mousePos.y}px`,
      } as React.CSSProperties}
    >
      {/* Glow effect */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(230, 126, 34, 0.15), transparent 40%)`,
        }}
      />
      <PropertyCard />
    </div>
  );
};
```

**3. Letter animation for hero (inspired by design-1):**
```typescript
// Staggered letter reveal
const AnimatedTitle = ({ text }: { text: string }) => {
  const words = text.split(' ');
  
  return (
    <h1 className="text-6xl md:text-8xl font-heading">
      {words.map((word, wordIdx) => (
        <span key={wordIdx} className="inline-flex overflow-hidden mr-4">
          {word.split('').map((letter, letterIdx) => (
            <motion.span
              key={letterIdx}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: wordIdx * 0.1 + letterIdx * 0.05,
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-block"
            >
              {letter}
            </motion.span>
          ))}
        </span>
      ))}
    </h1>
  );
};
```

#### Component Patterns

**1. Property Card (inspired by all 4 designs):**

```typescript
interface PropertyCardProps {
  property: Property;
  variant?: 'default' | 'featured' | 'compact';
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, variant = 'default' }) => {
  return (
    <div className="group cursor-pointer">
      {/* Image */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
        <Image
          src={property.images[0]}
          alt={property.title}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          fill
        />
        
        {/* Badge */}
        <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur text-xs font-semibold rounded-full">
          {property.type === 'sale' ? 'Dijual' : 'Disewa'}
        </div>
        
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      {/* Content */}
      <div className="space-y-2">
        <h3 className="text-xl font-heading font-medium group-hover:text-orange-600 transition-colors">
          {property.title}
        </h3>
        <p className="text-stone-500 text-sm">{property.city}</p>
        <p className="text-2xl font-light font-heading">
          Rp {formatPrice(property.price)}
        </p>
      </div>
    </div>
  );
};
```

**2. Floating WhatsApp Button:**

```typescript
const FloatingWhatsApp = () => {
  return (
    <motion.a
      href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/25"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: 'spring' }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon icon="logos:whatsapp-icon" className="w-7 h-7" />
      
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping" />
    </motion.a>
  );
};
```

**3. Stats/Credibility Section (inspired by design-3):**

```typescript
const StatsSection = () => {
  const stats = [
    { value: 500, suffix: '+', label: 'Properti Terjual' },
    { value: 1200, suffix: '+', label: 'Klien Puas' },
    { value: 15, suffix: '+', label: 'Tahun Pengalaman' },
    { value: 98, suffix: '%', label: 'Tingkat Kepuasan' },
  ];
  
  return (
    <section className="bg-stone-800 text-stone-50 py-24">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="text-center"
          >
            <div className="text-5xl md:text-6xl font-heading font-light text-orange-400">
              <CountUp end={stat.value} duration={2} />
              {stat.suffix}
            </div>
            <p className="text-stone-400 mt-2">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
```

---

### Architecture: Clean Architecture `[stated]`

**Principle:** Separation of concerns with clear boundaries between layers.

```
src/
├── domain/                    # Enterprise business rules
│   ├── entities/
│   │   ├── property.ts        # Property entity with business rules
│   │   ├── article.ts
│   │   └── admin.ts
│   ├── value-objects/
│   │   ├── price.ts
│   │   ├── location.ts
│   │   └── slug.ts
│   └── repositories/
│       ├── property.repository.interface.ts
│       ├── article.repository.interface.ts
│       └── admin.repository.interface.ts
│
├── application/               # Application business rules (use cases)
│   ├── use-cases/
│   │   ├── property/
│   │   │   ├── create-property.use-case.ts
│   │   │   ├── update-property.use-case.ts
│   │   │   ├── get-property.use-case.ts
│   │   │   ├── list-properties.use-case.ts
│   │   │   └── delete-property.use-case.ts
│   │   ├── article/
│   │   └── auth/
│   ├── dto/
│   │   ├── property.dto.ts
│   │   └── article.dto.ts
│   └── services/
│       └── whatsapp.service.ts
│
├── infrastructure/            # Frameworks, DB, external services
│   ├── database/
│   │   ├── drizzle-client.ts
│   │   ├── schema.ts
│   │   └── migrations/
│   ├── repositories/
│   │   ├── drizzle-property.repository.ts
│   │   ├── drizzle-article.repository.ts
│   │   └── drizzle-admin.repository.ts
│   ├── auth/
│   │   ├── cookie-session.ts
│   │   └── password.ts
│   ├── storage/
│   │   ├── vercel-blob.client.ts
│   │   └── image-compressor.ts
│   └── external/
│       └── google-maps.ts
│
└── presentation/              # UI layer (Next.js)
    ├── app/                   # Next.js App Router
    │   ├── (public)/
    │   ├── (admin)/
    │   └── api/
    ├── components/
    │   ├── ui/               # Generic UI (button, input, etc)
    │   ├── editor/           # TipTap editor components
    │   ├── layout/           # Header, Footer, Navigation
    │   └── features/         # Feature-specific components
    ├── hooks/                # TanStack Query hooks
    │   ├── use-properties.ts
    │   ├── use-property.ts
    │   ├── use-articles.ts
    │   └── use-auth.ts
    └── lib/
        ├── queries/          # TanStack Query query definitions
        └── mutations/        # TanStack Query mutation definitions
```

---

### Auth: HTTPS Cookie-Only Session `[stated]`

**Why cookie-only:**
- More secure than localStorage (XSS resistant)
- Automatic send with requests
- HttpOnly flag prevents JS access
- SameSite=Strict for CSRF protection

**Implementation:**

```typescript
// infrastructure/auth/cookie-session.ts
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET!);

export async function createSession(adminId: string) {
  const token = await new SignJWT({ sub: adminId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(SECRET);

  (await cookies()).set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function getSession() {
  const token = (await cookies()).get('session')?.value;
  if (!token) return null;
  
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch {
    return null;
  }
}

export async function clearSession() {
  (await cookies()).delete('session');
}
```

---

### State Management: TanStack Query `[stated]`

**Why TanStack Query:**
- Purpose-built for server state
- Automatic caching, refetching, stale-time
- No need for global state library (Redux, Zustand)
- Complements Clean Architecture (queries call use cases)

**Setup:**

```typescript
// presentation/lib/query-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});
```

---

### Rendering: ISG (Incremental Static Generation) `[stated]`

**Why ISG:**
- Best SEO (pre-rendered HTML)
- Fast TTFB (cached at edge)
- Auto-revalidate on demand

**Implementation:**

```typescript
// app/(public)/properti/page.tsx
export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
  const properties = await getAllPropertySlugs();
  return properties.map((p) => ({ slug: p.slug }));
}

// app/(public)/properti/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const property = await getProperty(params.slug);
  return {
    title: `${property.title} | Aresphi Property`,
    description: property.excerpt,
    openGraph: {
      title: property.title,
      description: property.excerpt,
      images: property.images[0],
    },
  };
}
```

---

### Image Storage & Compression `[stated]`

**Vercel Blob Setup:**

```typescript
// infrastructure/storage/vercel-blob.client.ts
import { put, del } from '@vercel/blob';

export async function uploadImage(file: File, filename: string) {
  const blob = await put(`properties/${filename}`, file, {
    access: 'public',
    addRandomSuffix: true,
  });
  return blob.url;
}

export async function deleteImage(url: string) {
  await del(url);
}
```

**Image Compression (before upload):**

```typescript
// infrastructure/storage/image-compressor.ts
import sharp from 'sharp';

interface CompressionOptions {
  maxWidth: number;
  maxHeight: number;
  quality: number;
  format: 'jpeg' | 'webp' | 'png';
}

export async function compressImage(
  buffer: Buffer,
  options: CompressionOptions
): Promise<Buffer> {
  return sharp(buffer)
    .resize(options.maxWidth, options.maxHeight, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: options.quality })
    .toBuffer();
}

export const DEFAULT_IMAGE_OPTIONS: CompressionOptions = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 80,
  format: 'webp',
};
```

---

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# App
NEXT_PUBLIC_SITE_URL="https://aresphi.com"
NEXT_PUBLIC_WHATSAPP_NUMBER="62XXXXXXXXXX"

# Auth
AUTH_SECRET="..."

# Blob Storage
BLOB_READ_WRITE_TOKEN="..."

# Revalidation
REVALIDATE_SECRET="..."

# Maps (optional)
NEXT_PUBLIC_GOOGLE_MAPS_KEY="..."
```

---

### Performance Targets

| Metric | Target |
|--------|--------|
| Lighthouse Performance | > 90 |
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Cumulative Layout Shift | < 0.1 |
| Image compression ratio | > 60% reduction |
| ISG Revalidation | 1 hour |

---

### Development Phases

**Phase 1: Foundation**
- Clean Architecture setup
- Database schema & migrations
- TanStack Query setup
- Auth (cookie-only session)
- Design system & component library

**Phase 2: Core Public Pages**
- Homepage (company profile) dengan animations
- Katalog Properti (ISG)
- Layanan page
- Kontak page
- WhatsApp integration
- SEO setup (meta, sitemap, structured data)

**Phase 3: Admin Dashboard**
- Property CRUD dengan TipTap
- Image upload + compression
- Blog CRUD

**Phase 4: Polish**
- Animations & micro-interactions
- Analytics (GA4)
- Performance optimization
- Final testing
