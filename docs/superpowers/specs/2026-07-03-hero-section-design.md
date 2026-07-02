# Hero Section Design Spec

> F-001: Animated hero with wordmark, stacked property cards, and scroll-triggered parallax

## Overview

A full-viewport hero section featuring the Aresphi wordmark with entrance animation, three stacked property cards with parallax scroll effects, a meta card displaying brand info, and a tagline with CTA.

## Component Structure

```
src/
├── app/
│   └── page.tsx              # Imports and renders Hero
└── components/
    └── Hero.tsx              # Single hero component with all elements
```

**Hero.tsx responsibilities:**
- Renders wordmark, stacked cards, meta card, tagline
- Contains GSAP timeline for entrance + scroll animations
- Accepts optional `photos` prop for the 3 card images (defaults to design reference images)
- Uses `useGSAP` hook from `@gsap/react` for React integration

## Dependencies

Packages to install:
- `gsap` — animation engine with ScrollTrigger
- `@gsap/react` — React integration (useGSAP hook)
- `lenis` — smooth scrolling (formerly @studio-freight/lenis)

**Note:** Lenis is a global scroll library. It will be initialized in `layout.tsx` or a dedicated provider, not inside Hero. Hero only depends on ScrollTrigger for parallax effects.

## Animation Sequence

### Entrance (page load)
1. Wordmark fades + scales in from center (0.8s ease-out)
2. Stacked cards stagger in from below with slight rotation (0.6s each, 0.1s stagger)
3. Meta card and tagline fade in (0.4s)

### Scroll Parallax
1. Wordmark moves up faster than scroll (translateY parallax, z-index behind)
2. Card stack moves up slower, creating depth (translateY parallax, z-index in front)
3. Cards fan out slightly on scroll — center card stays, side cards translateX outward
4. Lenis smooth scroll enabled globally

### Reduced Motion
Check `prefers-reduced-motion`. If true, skip all animations and show final state immediately.

### Animation Config

```typescript
const heroAnimationConfig = {
  wordmark: { duration: 0.8, ease: "power3.out" },
  cards: { duration: 0.6, stagger: 0.1, ease: "power2.out" },
  parallax: { intensity: 0.3 },
};
```

## Data Model

### Photo Data Shape

```typescript
type HeroPhoto = {
  id: string;
  src: string;
  alt: string;
};

type HeroProps = {
  photos?: [HeroPhoto, HeroPhoto, HeroPhoto]; // Exactly 3
};
```

### Default Mock Data

```typescript
const defaultHeroPhotos: [HeroPhoto, HeroPhoto, HeroPhoto] = [
  { id: "1", src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80", alt: "Modern home exterior" },
  { id: "2", src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80", alt: "Luxury interior" },
  { id: "3", src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80", alt: "Contemporary living space" },
];
```

### F-010 Integration (Future)

- F-010 adds `heroSlotOrder: number | null` to a `property_photos` table
- Admin assigns photos to slots 1, 2, 3
- Page fetches hero photos from DB, passes to Hero component
- No changes needed to Hero.tsx when F-010 is implemented

### Static Content (Hardcoded)

- Brand name: "Aresphi"
- Founded year: "EST. 2020"
- Tagline: "Full-service property partner for sales, rental, and consultation across Indonesia."
- CTA: Not in hero scope (Navigation handles contact links)

### Meta Card Design

The design reference shows a meta card with property thumbnail and name. This spec simplifies it to show only brand info:

**Design Reference Meta Card:**
- Thumbnail image
- "EST. 2020"
- "Rumah Modern — Jakarta" (property name)

**This Spec Meta Card:**
- No thumbnail (removed)
- "EST. 2020"
- "Aresphi" (brand name)

This simplifies the admin workflow — no need to select a featured property for the meta card.

## Responsive Behavior

| Element | Mobile | sm (640px+) | md (768px+) | lg (1024px+) |
|---------|--------|-------------|-------------|--------------|
| Wordmark | 17vw | 17vw | 17vw | 17vw |
| Card width | 72% | 55% | 44% | 44% |
| Card height | 44vh | 52vh | 52vh | 52vh |
| Meta card | hidden | hidden | visible | visible |
| Tagline | visible | visible | visible | visible |

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Missing/broken image | Fallback to gray placeholder block |
| Missing photos prop | Use default mock data |
| GSAP fails to init | Log warning, show static hero |

## Testing

- **Visual:** Compare rendered hero to design reference (`docs/aresphi-preview.html`)
- **Animation:** Manual browser testing (entrance timing, scroll parallax)
- **Reduced motion:** Test with `prefers-reduced-motion: reduce` in DevTools
- **Responsive:** Test at 375px, 768px, 1024px, 1440px

## Acceptance Criteria Mapping

| AC | Implementation |
|----|----------------|
| AC1: Wordmark entrance animation | GSAP timeline entrance step 1 |
| AC2: Stacked cards parallax | GSAP ScrollTrigger with translateY |
| AC3: Meta card info | Static brand name + EST. 2020 |
| AC4: Tagline visible | Fixed positioning, bottom-left |
| AC5: Admin photo selection | Data prop + F-010 integration later |
