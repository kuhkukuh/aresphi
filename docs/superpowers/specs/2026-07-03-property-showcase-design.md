# Property Showcase Design Spec

> Feature: F-006 | Module: property | Date: 2026-07-03

## Overview

Horizontal scrolling gallery displaying featured properties with grayscale-to-color hover effect. Built with hardcoded data initially, designed to accept dynamic data from F-010 Property Management Admin when ready.

## Component Architecture

### PropertyShowcase Component

**Location:** `src/components/PropertyShowcase.tsx`

**Props:**
```typescript
type PropertyShowcaseProps = {
  properties: Property[];
};

type Property = {
  id: string;
  name: string;          // "Rumah Modern Pondok Indah"
  location: string;      // "Jakarta Selatan"
  price: string;         // "Rp 2.5 M" or "Rp 35 jt/bln"
  image: string;         // URL to property photo
};
```

**Default Data:** 4 hardcoded properties matching the design reference, passed as default prop.

### Layout Structure

```
<section id="properti">
  <header> -- eyebrow, title, "Lihat Semua" link
  <scroll-container>
    <property-card-1> -- height: 80%
    <property-card-2> -- height: 90%
    <property-card-3> -- height: 75%
    <property-card-4> -- height: 85%
  </scroll-container>
  <arrow-buttons> -- desktop only
</section>
```

## Styling Specification

### Container
- Background: `bg-beige-dark` (matches design)
- Padding: `py-24` vertical, `px-6 md:px-12` horizontal
- Scroll behavior: `overflow-x-auto`, `no-scrollbar` class
- Height: `h-[65vh]` for scroll container

### Property Cards
- Width: `w-[320px] md:w-[400px]`
- Height: Varies per card (75%, 80%, 85%, 90% of container height)
- Border radius: `rounded-2xl`
- Shadow: `shadow-xl`
- Shrink: `shrink-0` (prevents compression)

### Image Treatment
- Default: `grayscale-[30%]`
- Hover: `grayscale-0`
- Scale: group-hover:scale-105
- Transition: `duration-700` for all effects

### Overlay
- Gradient: `bg-gradient-to-t from-black/80 via-black/20 to-transparent`
- Position: Absolute, inset-0

### Price Badge
- Style: `bg-white/20 backdrop-blur-md rounded-full px-4 py-2`
- Typography: `text-sm font-medium text-white`

### Text Content
- Property name: `font-playfair text-2xl italic text-white`
- Location: `text-white/70 text-sm`

### Arrow Buttons
- Position: Absolute, left/right of scroll container
- Size: `w-12 h-12`
- Style: Rounded-full, white background, shadow
- Visibility: Hidden on mobile (`hidden md:flex`)
- Behavior: Scrolls container by card width on click

## Interactions

### Scroll Behavior
- Native horizontal scroll via browser (touch swipe, trackpad, mouse wheel)
- Hidden scrollbar via `.no-scrollbar` utility class
- Smooth scroll via CSS `scroll-behavior: smooth`

### Hover Effects (CSS Transitions)
1. **Image**: Grayscale 30% → 0%, scale 1 → 1.05 over 700ms
2. **Arrow button**: Background white → orange on hover

### Arrow Navigation
- Left arrow: Scrolls container left by 400px
- Right arrow: Scrolls container right by 400px
- Uses `element.scrollBy()` for smooth native scrolling

## Responsive Behavior

| Breakpoint | Card Width | Arrows | Scroll Hint |
|------------|------------|--------|-------------|
| Mobile (<768px) | 320px | Hidden | Swipe gesture |
| Desktop (≥768px) | 400px | Visible | Arrow buttons |

## Accessibility

- Section labeled with `id="properti"` for anchor navigation
- Arrow buttons have `aria-label` for screen readers
- Images have descriptive `alt` text (property name)
- Reduced motion: Transitions disabled via `prefers-reduced-motion` media query

## Data Contract

### Current: Hardcoded
Default prop with 4 properties using Unsplash images from design reference.

### Future: F-010 Integration
Component already accepts `properties` prop. When F-010 is implemented:
1. Admin selects featured properties via dashboard
2. Properties stored in database with `isFeatured` flag
3. Page fetches featured properties and passes to component
4. No component changes needed

## Out of Scope

- Property detail page navigation (F-012)
- Property catalog page (F-013)
- Filtering within showcase
- Dynamic card count from admin
- Image lazy loading (can be added later if needed)

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/components/PropertyShowcase.tsx` | Create |
| `src/app/page.tsx` | Import and render component |

## Acceptance Criteria Mapping

| AC | Implementation |
|----|----------------|
| AC1: Horizontal scroll gallery dengan smooth scroll behavior | Native scroll container with `overflow-x-auto`, `scroll-behavior: smooth` |
| AC2: Property cards transition dari grayscale ke color on hover | CSS filter `grayscale-[30%]` → `grayscale-0` with 700ms transition |
| AC3: Price badge tampil dengan format yang jelas | Glassmorphism pill badge with price string from data |
| AC4: Property name dan location readable sebagai overlay | Absolute positioned text over gradient overlay |
| AC5: Admin dapat memilih properti featured via dashboard | Deferred to F-010; component accepts `properties` prop for future integration |
