# Hero Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an animated hero section with wordmark entrance, stacked property cards with parallax, meta card, and tagline — matching the design reference exactly.

**Architecture:** Single Hero component using GSAP + ScrollTrigger for all animations. Lenis handles smooth scrolling globally. Component accepts optional photos prop for future F-010 integration.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, GSAP 3, ScrollTrigger, Lenis

---

## File Structure

```
src/
├── app/
│   ├── layout.tsx          # Modify: Add Lenis provider
│   └── page.tsx            # Modify: Render Hero
├── components/
│   └── Hero.tsx            # Create: Main hero component
└── lib/
    └── animations/
        └── hero.ts         # Create: Animation config & timeline
```

---

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install GSAP and Lenis packages**

```bash
npm install gsap lenis
```

- [ ] **Step 2: Verify installation**

Run: `npm ls gsap lenis`
Expected: Both packages listed with versions

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add gsap and lenis dependencies"
```

---

### Task 2: Create Lenis Smooth Scroll Provider

**Files:**
- Create: `src/lib/smooth-scroll.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create Lenis provider component**

Create `src/lib/smooth-scroll.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
```

- [ ] **Step 2: Wrap layout with SmoothScrollProvider**

Modify `src/app/layout.tsx`. Import and wrap the body content:

```tsx
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { Playfair_Display } from 'next/font/google';
import { SmoothScrollProvider } from '@/lib/smooth-scroll';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Aresphi Property - Partner Terpercaya untuk Properti Anda',
  description: 'Aresphi Property menyediakan layanan jual-beli, sewa, konsultasi, pemasaran, dan pendampingan transaksi properti.',
  keywords: ['properti', 'broker', 'jual beli', 'sewa', 'investasi properti', 'Aresphi'],
  authors: [{ name: 'Aresphi Property' }],
  openGraph: {
    title: 'Aresphi Property - Partner Terpercaya untuk Properti Anda',
    description: 'Aresphi Property menyediakan layanan jual-beli, sewa, konsultasi, pemasaran, dan pendampingan transaksi properti.',
    type: 'website',
    locale: 'id_ID',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${geistSans.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900 font-sans">
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify smooth scroll works**

Run: `npm run dev`
Open browser at http://localhost:3000
Scroll the page — should feel smooth, not jumpy

- [ ] **Step 4: Commit**

```bash
git add src/lib/smooth-scroll.tsx src/app/layout.tsx
git commit -m "feat: add Lenis smooth scroll provider"
```

---

### Task 3: Create Hero Animation Config

**Files:**
- Create: `src/lib/animations/hero.ts`

- [ ] **Step 1: Create animation configuration module**

Create `src/lib/animations/hero.ts`:

```typescript
import { gsap } from "gsap";

export const heroAnimationConfig = {
  wordmark: {
    duration: 0.8,
    ease: "power3.out",
    from: { opacity: 0, scale: 0.9, y: 30 },
    to: { opacity: 1, scale: 1, y: 0 },
  },
  cards: {
    duration: 0.6,
    stagger: 0.1,
    ease: "power2.out",
    from: { opacity: 0, y: 60, rotate: -3 },
    to: { opacity: 1, y: 0, rotate: 0 },
  },
  meta: {
    duration: 0.4,
    ease: "power2.out",
    from: { opacity: 0, x: 20 },
    to: { opacity: 1, x: 0 },
  },
  tagline: {
    duration: 0.4,
    ease: "power2.out",
    from: { opacity: 0, y: 10 },
    to: { opacity: 1, y: 0 },
  },
  parallax: {
    intensity: 0.3,
  },
} as const;

export function createHeroTimeline(
  wordmark: Element,
  cards: Element[],
  metaCard: Element,
  tagline: Element
) {
  const tl = gsap.timeline({
    defaults: { ease: "power2.out" },
  });

  // Wordmark entrance
  tl.fromTo(wordmark, heroAnimationConfig.wordmark.from, heroAnimationConfig.wordmark.to, 0);

  // Cards stagger in
  tl.fromTo(
    cards,
    heroAnimationConfig.cards.from,
    heroAnimationConfig.cards.to,
    0.2
  );

  // Meta card
  tl.fromTo(metaCard, heroAnimationConfig.meta.from, heroAnimationConfig.meta.to, 0.6);

  // Tagline
  tl.fromTo(tagline, heroAnimationConfig.tagline.from, heroAnimationConfig.tagline.to, 0.7);

  return tl;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/animations/hero.ts
git commit -m "feat: add hero animation config and timeline factory"
```

---

### Task 4: Create Hero Component Structure

**Files:**
- Create: `src/components/Hero.tsx`

- [ ] **Step 1: Create Hero component with static structure**

Create `src/components/Hero.tsx`:

```tsx
"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { createHeroTimeline, heroAnimationConfig } from "@/lib/animations/hero";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type HeroPhoto = {
  id: string;
  src: string;
  alt: string;
};

export type HeroProps = {
  photos?: [HeroPhoto, HeroPhoto, HeroPhoto];
};

const defaultHeroPhotos: [HeroPhoto, HeroPhoto, HeroPhoto] = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    alt: "Modern home exterior",
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    alt: "Luxury interior",
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    alt: "Contemporary living space",
  },
];

export default function Hero({ photos = defaultHeroPhotos }: HeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const cardStackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const metaCardRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useGSAP(
    () => {
      if (prefersReducedMotion) return;
      if (!wordmarkRef.current || !metaCardRef.current || !taglineRef.current) return;

      const validCards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
      if (validCards.length === 0) return;

      // Entrance timeline
      createHeroTimeline(
        wordmarkRef.current,
        validCards,
        metaCardRef.current,
        taglineRef.current
      );

      // Scroll-triggered parallax
      if (containerRef.current && wordmarkRef.current && cardStackRef.current) {
        gsap.to(wordmarkRef.current, {
          y: -150,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.to(cardStackRef.current, {
          y: -50,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex flex-col justify-end overflow-hidden pt-24"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0d1f] via-[#0e1228] to-[#0a0d1f]" />

      {/* Wordmark */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <h1
          ref={wordmarkRef}
          className="select-none text-[17vw] leading-[0.85] text-center will-change-transform font-playfair italic tracking-tighter"
          style={{ opacity: prefersReducedMotion ? 1 : 0 }}
        >
          Aresphi<span className="text-orange">®</span>
        </h1>
      </div>

      {/* Stacked Cards */}
      <div
        ref={cardStackRef}
        className="relative z-20 max-w-7xl mx-auto px-6 w-full pb-16 -mt-[6vw] will-change-transform"
      >
        <div className="relative h-[44vh] sm:h-[52vh]">
          {/* Card 1 - Front/Center */}
          <div
            ref={(el) => { cardsRef.current[0] = el; }}
            className="hero-card absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[72%] sm:w-[55%] md:w-[44%] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-black/60 ring-1 ring-white/10 will-change-transform z-30"
            style={{ opacity: prefersReducedMotion ? 1 : 0 }}
          >
            <img
              src={photos[0].src}
              alt={photos[0].alt}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Card 2 - Middle/Left */}
          <div
            ref={(el) => { cardsRef.current[1] = el; }}
            className="hero-card absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[58%] sm:w-[42%] md:w-[32%] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-black/60 ring-1 ring-white/10 will-change-transform z-20"
            style={{ opacity: prefersReducedMotion ? 1 : 0 }}
          >
            <img
              src={photos[1].src}
              alt={photos[1].alt}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Card 3 - Back/Right */}
          <div
            ref={(el) => { cardsRef.current[2] = el; }}
            className="hero-card absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[58%] sm:w-[42%] md:w-[32%] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-black/60 ring-1 ring-white/10 will-change-transform z-10"
            style={{ opacity: prefersReducedMotion ? 1 : 0 }}
          >
            <img
              src={photos[2].src}
              alt={photos[2].alt}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Meta Card - Brand Info */}
      <div
        ref={metaCardRef}
        className="absolute bottom-8 right-6 z-30 hidden md:flex items-center gap-4 rounded-xl bg-white/5 backdrop-blur-xl ring-1 ring-white/10 p-4 will-change-transform"
        style={{ opacity: prefersReducedMotion ? 1 : 0 }}
      >
        <div>
          <p className="text-xs tracking-[0.25em] text-white/40">EST. 2020</p>
          <p className="text-sm font-medium mt-1 text-white">Aresphi</p>
        </div>
      </div>

      {/* Tagline */}
      <div
        ref={taglineRef}
        className="absolute bottom-8 left-6 z-30 max-w-xs will-change-transform"
        style={{ opacity: prefersReducedMotion ? 1 : 0 }}
      >
        <p className="text-sm text-white/50 leading-relaxed">
          Full-service property partner for sales, rental, and consultation across Indonesia.
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Hero.tsx
git commit -m "feat: create Hero component with GSAP animations"
```

---

### Task 5: Integrate Hero into Home Page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Render Hero component in page**

Modify `src/app/page.tsx`:

```tsx
import Hero from "@/components/Hero";

export default function Home() {
  return <Hero />;
}
```

- [ ] **Step 2: Verify hero renders**

Run: `npm run dev`
Open http://localhost:3000
Expected: Hero section visible with wordmark, stacked cards, meta card, tagline

- [ ] **Step 3: Verify entrance animations**

On page load, observe:
- Wordmark fades and scales in
- Cards stagger up from below
- Meta card and tagline fade in

- [ ] **Step 4: Verify scroll parallax**

Scroll down the page:
- Wordmark should move up faster
- Cards should move up slower

- [ ] **Step 5: Verify reduced motion**

In Chrome DevTools:
1. Open Rendering panel (Cmd+Shift+P → "Rendering")
2. Check "Emulate CSS media feature prefers-reduced-motion: reduce"
3. Refresh page
Expected: All elements visible immediately, no animations

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: integrate Hero component into home page"
```

---

### Task 6: Visual Validation Against Design Reference

**Files:**
- N/A (manual testing)

- [ ] **Step 1: Open design reference**

Open `docs/aresphi-preview.html` in browser

- [ ] **Step 2: Compare hero sections side-by-side**

Open http://localhost:3000 alongside the design reference.

Check:
- [ ] Wordmark font matches (Playfair Display, italic, 17vw)
- [ ] Card sizes and positions match (44%/55%/72% widths at breakpoints)
- [ ] Card shadows match (shadow-2xl shadow-black/60 ring-1 ring-white/10)
- [ ] Meta card matches design (position, colors, blur effect)
- [ ] Tagline matches (position, text, color)
- [ ] Background gradient matches (#0a0d1f → #0e1228 → #0a0d1f)

- [ ] **Step 3: Test responsive breakpoints**

Resize browser and check:
- [ ] Mobile (< 640px): Cards at 72%, meta card hidden
- [ ] sm (640px+): Cards at 55%, card height 52vh
- [ ] md (768px+): Cards at 44%, meta card visible
- [ ] lg (1024px+): Same as md

- [ ] **Step 4: Document any visual differences**

If any differences found, note them in a comment for review.

---

### Task 7: Final Commit and Summary

**Files:**
- N/A

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Expected: Build succeeds without errors

- [ ] **Step 2: Test production build locally**

```bash
npm run start
```

Open http://localhost:3000 and verify hero works correctly.

- [ ] **Step 3: Verify all acceptance criteria**

| AC | Status |
|----|--------|
| AC1 — Wordmark entrance animation | ✅ Task 4, Task 5 |
| AC2 — Stacked cards parallax | ✅ Task 4 |
| AC3 — Meta card shows brand info | ✅ Task 4 |
| AC4 — Tagline visible | ✅ Task 4 |
| AC5 — Admin photo selection (future) | ✅ Data prop ready for F-010 |

- [ ] **Step 4: Mark feature as complete**

Feature F-001 is ready for merge/review.
