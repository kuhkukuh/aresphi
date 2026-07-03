# Quote Section Design

## Overview

Full-width hero image section with centered quote about home buying philosophy. Minimal, pure presentation without structural chrome (no eyebrow labels).

## Component

**File:** `src/components/QuoteSection.tsx`

### Props

```typescript
type QuoteSectionProps = {
  image: string;           // Background image URL
  quoteText: string;       // Main quote text (white)
  quoteEmphasis: string;   // Emphasized portion (white/40)
  authorName: string;      // Attribution name
  authorTitle: string;     // Attribution title (uppercase, tracked)
};
```

### Default Values

```typescript
const defaultProps: QuoteSectionProps = {
  image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1800&q=80",
  quoteText: "We believe a home isn't just a transaction —",
  quoteEmphasis: "it's a life-changing experience.",
  authorName: "Ahmad Wijaya",
  authorTitle: "FOUNDING PARTNER"
};
```

## Visual Specifications

| Element | Tailwind Classes |
|---------|-----------------|
| Container | `relative h-[80vh] overflow-hidden flex items-center justify-center` |
| Background image | `absolute inset-0 w-full h-full object-cover` |
| Scrim overlay | `absolute inset-0 bg-stone-900/55` |
| Content wrapper | `relative z-10 max-w-3xl mx-auto px-6 text-center` |
| Quote text | `text-2xl sm:text-3xl md:text-4xl leading-snug font-medium tracking-tight text-white` |
| Emphasis span | `text-white/40` |
| Author name | `text-sm font-medium mt-8 text-white` |
| Author title | `text-xs tracking-[0.2em] text-white/40 mt-1` |

## Integration

- Import in `src/app/page.tsx`
- Place between `PropertyShowcase` and `Footer`

```tsx
<PropertyShowcase />
<QuoteSection {...quoteData} />
<Footer />
```

## Acceptance Criteria Mapping

- **AC1** — Full-width background image covers entire section viewport → `h-[80vh]` with `absolute inset-0` image
- **AC2** — Quote text centered dan readable dengan overlay scrim → `flex items-center justify-center`, `bg-stone-900/55` scrim
- **AC3** — Text responsive -> `text-2xl sm:text-3xl md:text-4xl` responsive sizing

## Out of Scope

- Quote management via admin
- Multiple quotes rotation
- GSAP animations (static section)
