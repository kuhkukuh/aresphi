# Footer Component Design

> F-008: Footer — Contact information, social links, and large watermark

## Overview

Site-wide footer component matching the aresphi-preview.html design. Contains contact information with clickable links, address display, social media links, and a large watermark background effect.

## Component Structure

```
Footer (section)
├── Container (max-w-7xl)
│   ├── Top Band (border-b)
│   │   ├── EST. 2020 (left)
│   │   ├── Tagline (center, hidden on mobile)
│   │   └── MENU (right, static text)
│   ├── Contact Links (centered)
│   │   ├── Phone (tel: link, white)
│   │   └── Email (mailto: link, orange)
│   └── Info Grid (3-column)
│       ├── Copyright (left)
│       ├── Address (center)
│       └── Social Links (right)
└── Watermark (large ARESPHI text)
```

## Technical Details

### Component Location
`src/components/Footer.tsx`

### Styling

**Container:**
- `relative bg-stone-900 pt-28 overflow-hidden`

**Top Band:**
- `flex justify-between text-xs tracking-[0.2em] text-white/40 border-b border-white/10 pb-8`
- Center tagline: `hidden sm:block`

**Contact Links:**
- Phone: `text-3xl sm:text-4xl md:text-5xl text-white` with `hover:text-white/70`
- Email: `text-3xl sm:text-4xl md:text-5xl text-orange` with `hover:text-orange/80`
- Container: `text-center py-20`

**Info Grid:**
- `grid sm:grid-cols-3 gap-8 text-xs text-white/40 pb-16`
- Left: Copyright text
- Center: Address with `sm:text-center`
- Right: Social links with `sm:text-right space-x-4`

**Watermark:**
- `text-[24vw] leading-[0.75] text-white/[0.04] text-center -mb-[4vw]`
- `select-none font-bold tracking-tight`

### Links

| Link | URL | Behavior |
|------|-----|----------|
| Phone | `tel:+6281234567890` | Opens phone dialer |
| Email | `mailto:info@aresphi.com` | Opens email client |
| Instagram | Placeholder `#` | New tab, external |
| LinkedIn | Placeholder `#` | New tab, external |

**Note:** Social media URLs to be provided by client. Using `#` placeholder with `target="_blank"` and `rel="noopener noreferrer"`.

### Accessibility

- Phone and email links have descriptive aria-labels
- Social links include `aria-label` for screen readers
- Sufficient color contrast on dark background (white/40 for secondary text, white for primary)

### Responsive Behavior

- **Mobile (< 640px):** Single column layout, tagline hidden
- **Desktop (≥ 640px):** Three-column grid, all elements visible

## Acceptance Criteria Mapping

| AC | Implementation |
|----|----------------|
| AC1 | Phone link with `tel:+6281234567890` href |
| AC2 | Email link with `mailto:info@aresphi.com` href |
| AC3 | Instagram and LinkedIn links in info grid |
| AC4 | Address displayed in center column with clear formatting |
| AC5 | Large ARESPHI watermark at bottom with low opacity |

## Integration

Add to `src/app/page.tsx`:

```tsx
import Footer from "@/components/Footer";
// ...
return (
  <main>
    <Hero />
    <PartnerLogos />
    <USPSection />
    <Footer />
  </main>
);
```

## Out of Scope

- Newsletter subscription
- Dynamic contact info via admin
- Privacy policy link (not in spec)
- Functional MENU link (static text per preview)
