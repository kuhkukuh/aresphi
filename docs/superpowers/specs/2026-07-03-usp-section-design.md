# USP Section Design

> Feature: F-003 · Created: 2026-07-03

## Overview

Bento grid section displaying 5 USP items (testimonial + 2 flashlight cards + dark stats card) with asymmetric layout and interactive cursor spotlight effect.

## Component

**File:** `/src/components/USPSection.tsx`

**Type:** Client component (flashlight effect requires mouse event handlers)

## Structure

```
<section> py-32 px-6 md:px-12
  └─ <div> max-w-7xl mx-auto
       ├─ Header (eyebrow + headline)
       └─ Grid (4-column, asymmetric)
            ├─ Testimonial Card (2×2)
            ├─ Flashlight Card 01 (1×1)
            ├─ Flashlight Card 02 (1×1)
            └─ Dark Stats Card (2×1)
```

## Cards

### 1. Testimonial Card
- **Layout:** `md:col-span-2 md:row-span-2`, 300px min-height
- **Background:** Image with gradient overlay (dark to transparent)
- **Content:**
  - Quote: "Tim profesional yang sangat membantu."
  - Client photo: 40×40px rounded-full with border
  - Name: Ahmad Wijaya
  - Location: Jakarta

### 2. Flashlight Card 01
- **Label:** "01" (Playfair italic, 120px, 30% opacity)
- **Title:** Layanan Lengkap
- **Subtitle:** Konsultasi hingga transaksi

### 3. Flashlight Card 02
- **Label:** "02"
- **Title:** Jaringan Luas
- **Subtitle:** Akses properti eksklusif

### 4. Dark Stats Card
- **Layout:** `md:col-span-2`, 160px min-height
- **Background:** sage (#2C3E35)
- **Label:** "03" (white 30% opacity)
- **Indicator:** Orange pulse dot + "TRANSPARANSI TOTAL"
- **Stat:** "100%"
- **Description:** Informasi jujur. Tanpa biaya tersembunyi.

## Flashlight Effect

Desktop-only cursor spotlight on cards 2 and 3.

**Implementation:**
- `onMouseMove` handler updates CSS variables `--mouse-x` and `--mouse-y`
- `::before` pseudo-element with radial gradient (600px circle, white at 80% opacity, fades to transparent)
- Effect activates on hover via CSS `opacity` transition

**CSS:**
```css
.flashlight-card::before {
  background: radial-gradient(
    600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(255, 255, 255, 0.8),
    transparent 40%
  );
}
```

## Styling

**Eyebrow:**
- Flex row with border-bottom
- Left: orange uppercase label (11px, tracking 0.15em)
- Right: monospace section number (11px)

**Headline:**
- "Kepercayaan" — regular weight
- "yang Terbukti" — Playfair italic, stone-500/80

**Grid:**
- Mobile: single column
- Desktop (md+): 4 columns, 500px height

## Images

Use external URLs from design reference:
- Testimonial background: `photo-1600607687939-ce8a6c25118c`
- Client photo: `photo-1472099645785-5658abf4ff4e`

Use standard `<img>` tags with `onError` fallback (matches Hero component pattern).

## Accessibility

- Semantic `<section>` with id="tentang"
- Images include descriptive alt text
- Sufficient color contrast maintained

## Out of Scope

- Dynamic USP configuration
- Testimonial data management
- Entrance animations (no GSAP for this section)
