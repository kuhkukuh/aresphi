# Property Catalog Page Design Spec

> Feature: F-013 | Module: property | Date: 2026-07-03

## Overview

Static HTML design mockup for the property catalog/listing page, extending the visual language established in `docs/aresphi-preview.html` (the homepage design reference). Sidebar filters next to a full-width, row-based property list (not a card grid — deliberately avoids an e-commerce feel in favor of the site's editorial tone). This is a design-phase deliverable: a self-contained static HTML file for visual review, not a React implementation. React componentization is a follow-up task.

## File

**Location:** `docs/aresphi-catalog.html`

Self-contained, mirroring `docs/aresphi-preview.html`: own `<head>` with the same Tailwind CDN config (fonts, colors), same `<style>` block (eyebrow, flashlight-card, floating-nav, etc.), same GSAP/Lenis includes. Reuses the exact nav and footer markup from the preview file so the pages read as one site. Uses mock property data with Unsplash placeholder images, consistent with the homepage's convention.

## Layout Structure

```
<nav> -- reused floating nav, "Properti" link marked active
<section id="catalog-header">
  <eyebrow> "/ Properti"
  <h1> "Koleksi" / "Properti Unggulan" (font-playfair italic, matches homepage H2 pattern)
  <p> short supporting copy
</section>
<section id="catalog-body">
  <aside id="filters"> -- sticky sidebar, ~280px
    <filter-group: Tipe Properti>  -- checkboxes: Rumah, Apartemen, Villa, Ruko
    <filter-group: Rentang Harga>  -- min/max inputs
    <filter-group: Lokasi>         -- checkboxes: Jakarta Selatan, Jakarta Pusat, Tangerang, Bandung, ...
    <filter-group: Status>         -- pills: Dijual, Disewa
    <reset-link>
  </aside>
  <main id="property-rows">
    <property-row-1> ... <property-row-n>
    <load-more-button>
  </main>
</section>
<footer> -- reused from preview
```

## Styling Specification

### Header band
- Padding: `py-24 md:py-32 px-6 md:px-12`
- Follows the same `eyebrow` + heading pattern as homepage sections (`eyebrow-left`/`eyebrow-right` divider row, then `text-4xl ... lg:text-[4.6rem]` heading mixing regular weight and `font-playfair italic text-stone-500/80`)

### Sidebar filters
- Width: `w-full lg:w-[280px] shrink-0`, `sticky top-32` on desktop, static stacked block above the list on mobile
- Container: white panel, `rounded-2xl border border-stone-200/60 bg-white/60 backdrop-blur-sm p-6`, consistent with `flashlight-card` surface treatment (no flashlight JS effect needed here, just the visual surface)
- Each filter group: label in `eyebrow-left` styling (11px, uppercase, orange, tracking-wide), options below with `text-sm text-stone-600`
- Checkboxes: custom-styled square, checked state fills with `bg-orange`
- Status pills: `Dijual`/`Disewa` as rounded-full toggle buttons, active state `bg-stone-900 text-white`, inactive `border border-stone-300 text-stone-600`
- Reset link: `text-xs text-stone-400 hover:text-orange underline underline-offset-2`

### Property rows
- Container per row: `bg-white rounded-3xl border border-stone-100 shadow-sm hover:shadow-lg transition-shadow` (same recipe as the homepage Process Steps cards)
- Layout: `flex flex-col md:flex-row gap-6 p-4 md:p-6` — image left, content right on desktop; image stacks above content on mobile
- Image: `w-full md:w-[38%] aspect-[4/3] rounded-2xl overflow-hidden shrink-0`, `<img>` with `grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700` (exact treatment reused from `PropertyShowcaseClient` cards)
- Content column: `flex-1 flex flex-col justify-center gap-3 py-2`
  - Top row: status pill (`Tersedia`/`Disewa`/`Terjual`, small rounded-full badge, color-coded: available = `bg-sage/10 text-sage`, sold = `bg-stone-200 text-stone-500`, rented = `bg-orange/10 text-orange`) + property type tag (`text-xs uppercase tracking-wide text-stone-400`)
  - Name: `font-playfair italic text-2xl md:text-3xl text-stone-900`
  - Location: `text-sm text-stone-500 flex items-center gap-1.5` with a small pin icon (inline SVG, `stroke-current`, 14px)
  - Specs row: `flex items-center gap-4 text-sm text-stone-500`, each item is an icon (bed/bath/area, inline SVG 16px) + label, separated by `•` or a thin vertical divider
  - Description: `text-sm text-stone-500 line-clamp-2 max-w-md`
- Price + CTA block: `flex md:flex-col items-center md:items-end justify-between md:justify-center gap-4 md:pl-6 md:border-l md:border-stone-100 shrink-0`
  - Price: `text-xl md:text-2xl font-semibold text-stone-900`, with the orange accent on the numeric portion (e.g. `Rp <span class="text-orange">2.5 M</span>` — matches the `150<span class="text-orange">+</span>` stat pattern)
  - CTA: circular button, `w-11 h-11 bg-orange rounded-full flex items-center justify-center hover:bg-stone-900 transition-colors text-white text-sm font-bold`, arrow glyph `→`, links to `aresphi-detail.html`
- Vertical rhythm: rows wrapped in `flex flex-col gap-6` (visible gap between each row card, not touching), full width of the `<main>` column

### Load more
- `Muat Lebih Banyak` pill button, same style as homepage's "Lihat Semua" (`border border-stone-300 rounded-full px-6 py-3 hover:bg-stone-900 hover:text-white`), centered below the last row

## Interactions

- Filter checkboxes/pills are static in this design pass (no live filtering logic — that's a future engineering task); visual states (checked/active) are demonstrated via a couple of pre-checked example filters
- Row hover: shadow lift on the row container, grayscale→color + scale on the image (CSS only, matches homepage card hover, no JS needed)
- Reduced motion: image scale/grayscale transitions respect `prefers-reduced-motion` the same way the homepage does

## Responsive Behavior

| Breakpoint | Filters | Row layout |
|---|---|---|
| Mobile (<768px) | Full-width block above list, not sticky | Image stacked above content, price/CTA row below description |
| Desktop (≥1024px) | Sticky sidebar, 280px | Image left (~38%), content right, price/CTA column on far right |

## Accessibility

- Filter checkboxes are real `<input type="checkbox">`/labelled controls, keyboard operable
- Each row's CTA arrow button has `aria-label="Lihat detail properti"`
- Images have descriptive `alt` text (property name + location)
- Status pills convey state via text, not color alone

## Data Contract (design-time mock)

Mock property objects include fields beyond what `schema.ts` currently stores, to make the design read as a real listing:

```
{
  name, location, price, status: 'available'|'sold'|'rented',
  type: 'Rumah'|'Apartemen'|'Villa'|'Ruko',
  bedrooms, bathrooms, landArea, buildingArea, description, images: []
}
```

`type`, `bedrooms`, `bathrooms`, `landArea`, `buildingArea`, `description` do not exist in `properties` yet — schema + migration work needed before this can be wired to real data. That's out of scope for this design pass.

## Out of Scope

- Live filtering logic / query params
- Pagination logic (load-more is visual only)
- React componentization (follow-up implementation task)
- Schema/migration changes for new fields
- Map integration (catalog page has no map; that's on the detail page)

## Files to Create/Modify

| File | Action |
|---|---|
| `docs/aresphi-catalog.html` | Create |

## Acceptance Criteria Mapping (F-013)

| AC | Design coverage |
|---|---|
| AC1: All properties displayed in grid layout | Row-based list (deliberate deviation from "grid" per user preference — same coverage goal, editorial layout instead) |
| AC2: Filters available for property type, price range, location | Sidebar with Tipe Properti, Rentang Harga, Lokasi, plus Status |
| AC3: Click on property navigates to detail page | Row CTA arrow links to `aresphi-detail.html` |
