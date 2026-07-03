# Process Section Design (F-005)

> Design document for the 3-step client journey section

## Overview

Staggered cards section showing the client journey: Konsultasi Awal → Kurasi Properti → Pendampingan Transaksi. Features a sticky heading with CTA on the left and visually staggered step cards on the right.

## Component

**File:** `src/components/ProcessSection.tsx`

**Usage:** Import and render after USPSection in `src/app/page.tsx`

## Layout

Two-column grid on `lg:` breakpoint (1024px+):

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  ┌─────────────────┐    ┌─────────────────────────────────┐ │
│  │                 │    │  ┌──────────────────┐           │ │
│  │  Sticky         │    │  │ 01 Konsultasi    │  ml-auto  │ │
│  │  Heading        │    │  │    Awal          │   70%     │ │
│  │  + CTA          │    │  └──────────────────┘           │ │
│  │                 │    │                                 │ │
│  │                 │    │┌──────────────────┐             │ │
│  │                 │    ││ 02 Kurasi        │  no margin  │ │
│  │                 │    ││    Properti      │   70%      │ │
│  │                 │    │└──────────────────┘             │ │
│  │                 │    │                                 │ │
│  │                 │    │  ┌──────────────────┐           │ │
│  │                 │    │  │ 03 Pendampingan  │  ml-auto  │ │
│  │                 │    │  │    Transaksi     │   70%     │ │
│  └─────────────────┘    │  └──────────────────┘           │ │
│                          └─────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

## Left Column — Sticky Heading

### Structure

```tsx
<div className="flex flex-col justify-center sticky top-32 h-fit">
  {/* Eyebrow */}
  <div className="eyebrow">
    <span className="eyebrow-left">/ 03 Proses Kami</span>
    <span className="eyebrow-right">[ 03 ]</span>
  </div>

  {/* Title */}
  <h2 className="mt-8 text-4xl font-medium leading-[1.02] sm:text-5xl md:text-6xl lg:text-[4.6rem] text-stone-900 mb-8">
    Perjalanan<br />
    <span className="font-playfair italic font-normal text-stone-500/80">
      properti Anda
    </span>
  </h2>

  {/* CTA */}
  <a href="#kontak" className="inline-flex items-center gap-2 border border-stone-300 rounded-full px-6 py-3 w-max hover:bg-stone-900 hover:text-white transition-colors text-base font-medium">
    Mulai Proses
  </a>
</div>
```

### Styling

- `sticky top-32` — sticks 8rem from viewport top
- `h-fit` — height fits content
- Eyebrow reuse existing CSS classes (defined in globals.css)

## Right Column — Staggered Cards

### Card Structure

```tsx
<div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 w-[85%] md:w-[70%] ml-auto group hover:shadow-lg transition-shadow">
  {/* Step number */}
  <div className="text-orange font-medium mb-4 text-lg">01</div>

  {/* Image */}
  <div className="w-full h-40 rounded-2xl overflow-hidden mb-6">
    <img
      src="..."
      alt="..."
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    />
  </div>

  {/* Title */}
  <h3 className="font-playfair text-4xl italic">Konsultasi Awal</h3>

  {/* Description */}
  <p className="text-stone-500">Memahami visi dan kebutuhan Anda melalui sesi mendalam.</p>
</div>
```

### Staggering Pattern

| Card | Step | Width | Margin | Alignment |
|------|------|-------|--------|-----------|
| 1 | Konsultasi Awal | `w-[85%] md:w-[70%]` | `ml-auto` | Right-aligned |
| 2 | Kurasi Properti | `w-[85%] md:w-[70%]` | none | Left-aligned |
| 3 | Pendampingan Transaksi | `w-[85%] md:w-[70%]` | `ml-auto` | Right-aligned |

### Step Data

```typescript
const steps = [
  {
    number: "01",
    title: "Konsultasi Awal",
    description: "Memahami visi dan kebutuhan Anda melalui sesi mendalam.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80"
  },
  {
    number: "02",
    title: "Kurasi Properti",
    description: "Menyajikan properti sesuai kriteria dari jaringan kami.",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80"
  },
  {
    number: "03",
    title: "Pendampingan Transaksi",
    description: "Mendampingi setiap langkah hingga kunci di tangan.",
    image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600&q=80"
  }
];
```

## Decorative SVG

Orange curved line behind cards:

```tsx
<svg className="absolute inset-0 w-full h-full -z-10 pointer-events-none" preserveAspectRatio="none">
  <path
    d="M 50,0 C 100,200 -50,400 150,800"
    stroke="#f97316"
    strokeWidth="2"
    fill="none"
    opacity="0.3"
  />
</svg>
```

## Animation

### Entrance Animation

Using GSAP ScrollTrigger for staggered reveal:

```typescript
// Cards start hidden
gsap.set(cards, { y: 40, opacity: 0 });

// Scroll-triggered stagger
gsap.to(cards, {
  y: 0,
  opacity: 1,
  duration: 0.8,
  stagger: 0.15,
  ease: "power3.out",
  scrollTrigger: {
    trigger: sectionRef.current,
    start: "top 80%",
    once: true
  }
});
```

### Reduced Motion

Check `prefers-reduced-motion` and skip animations if user prefers:

```typescript
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
```

## Responsive Behavior

### Mobile (< 1024px)

- Single column layout
- Heading block at top (not sticky)
- Cards full width (`w-full`)
- Remove staggering alignment (all left-aligned)
- Maintain hover effects

### Breakpoint Classes

```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
```

## Section Container

```tsx
<section className="py-32 px-6 md:px-12" id="layanan">
  <div className="max-w-7xl mx-auto">
    {/* Grid layout here */}
  </div>
</section>
```

## Acceptance Criteria Mapping

| AC | Implementation |
|----|----------------|
| AC1 | Staggered cards with `ml-auto` alternating alignment, 70% width |
| AC2 | Step number (orange), Playfair title, stone-500 description |
| AC3 | Sticky heading with "Mulai Proses" CTA button |
| AC4 | GSAP ScrollTrigger staggered entrance animation |

## Dependencies

- `gsap` — already installed
- `@gsap/react` — already installed
- Existing CSS classes: `eyebrow`, `eyebrow-left`, `eyebrow-right`

## File Changes

| File | Change |
|------|--------|
| `src/components/ProcessSection.tsx` | Create new component |
| `src/app/page.tsx` | Import and add after USPSection |
