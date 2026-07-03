# Partner Logos Marquee - Design Spec

**Date:** 2026-07-03
**Feature:** F-002

## Overview

Marquee-style scrolling bank partner logos with infinite horizontal scroll, greyscale treatment, pause-on-hover, and reduced motion support.

## Architecture

**Component:** `src/components/PartnerLogos.tsx`

Self-contained component that can be dropped anywhere on the page.

**Structure:**
```
PartnerLogos/
├── Container (overflow hidden + fade mask)
├── Inner wrapper (animated, duplicated content)
│   ├── Logo row (9 logos)
│   └── Logo row duplicate (for seamless loop)
└── Hover listener to pause animation
```

**Dependencies:**
- Tailwind CSS utilities
- Existing `animate-marquee` and `marquee-mask` from globals.css
- No external libraries

## Visual Specification

**Layout:**
- Single horizontal row, no wrapping
- Logo height: 64px
- Gap between logos: 32px
- Vertical padding: 24px top/bottom
- Fade mask on left/right edges

**Color treatment:**
- Greyscale filter (`grayscale(100%)`) applied to all logos
- On hover: individual logo reveals original colors (`grayscale(0%)`)
- Supports both brand consistency and interactivity

**Responsive:**
- Same height across breakpoints
- Gap remains consistent (may adjust to 24px on mobile if needed)

## Animation

**Behavior:**
- Infinite horizontal scroll to left
- Duration: 30s per full cycle
- Timing: linear (no easing, constant speed)
- Pause on hover (entire marquee stops)

**Implementation:**
- Uses existing `animate-marquee` keyframes from globals.css
- Content duplicated once to create seamless loop
- `animation-play-state: paused` on container hover

**Reduced motion:**
- Media query `prefers-reduced-motion: reduce`
- Animation disabled, logos display static in centered row

## Data

**Static logo list:**
```ts
const PARTNER_LOGOS = [
  { name: 'BNI', src: '/partners/bni.svg' },
  { name: 'BJB', src: '/partners/bjb.svg' },
  { name: 'BTN', src: '/partners/btn.svg' },
  { name: 'BRI', src: '/partners/bri.svg' },
  { name: 'BCA', src: '/partners/bca.svg' },
  { name: 'BPR', src: '/partners/bpr.svg' },
  { name: 'BPR HIK', src: '/partners/bpr-hik.svg' },
  { name: 'BWS', src: '/partners/bws.svg' },
  { name: 'Bank Sampoerna', src: '/partners/sampoerna.svg' },
];
```

**Storage:** `public/partners/` directory

**Logo sourcing priority:**
1. Official brand SVGs from bank websites
2. Wikipedia/Wikimedia Commons (public domain)
3. Placeholder with bank name if unavailable

## Error Handling

- **Missing logo file:** Fallback to text-based placeholder
- **Image load failure:** Graceful degradation to alt text
- **Reduced motion preference:** Static display, no animation

## Testing

- [ ] Visual: All 9 logos display in greyscale
- [ ] Animation: Infinite scroll at consistent speed
- [ ] Interaction: Pause on hover works
- [ ] Accessibility: Reduced motion honored
- [ ] Cross-browser: Chrome, Firefox, Safari

## Placement

Component placed below hero section when hero is ready. Until then, developed as standalone component ready for integration.

## Acceptance Criteria Mapping

| AC | Implementation |
|----|----------------|
| AC1: 9 logos in greyscale | CSS grayscale filter on all images |
| AC2: Infinite scroll left | CSS marquee animation with duplicated content |
| AC3: Pause on hover | animation-play-state: paused on hover |
| AC4: Reduced motion support | @media (prefers-reduced-motion) disables animation |
