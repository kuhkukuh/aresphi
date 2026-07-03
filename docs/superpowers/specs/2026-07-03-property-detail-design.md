# Property Detail Page Design Spec

> Feature: F-012 | Module: property | Date: 2026-07-03

## Overview

Static HTML design mockup for an individual property listing page, extending `docs/aresphi-preview.html`'s visual language. Big hero photo + thumbnail row with a fullscreen lightbox, a two-column info layout (details left, sticky contact card right), and a "Similar Properties" strip reusing the homepage showcase pattern. Design-phase deliverable — a self-contained static HTML file, not a React implementation.

## File

**Location:** `docs/aresphi-detail.html`

Self-contained like `aresphi-catalog.html`: same `<head>` config, same reused nav/footer, mock data with Unsplash placeholders. Links back to `aresphi-catalog.html` via breadcrumb and nav.

## Layout Structure

```
<nav> -- reused floating nav
<section id="breadcrumb">
  Properti / <Tipe> / <Nama Properti>
</section>
<section id="gallery">
  <hero-photo>
  <thumbnail-row> -- click opens lightbox
  <lightbox> -- fullscreen overlay, hidden by default, prev/next/close
</section>
<section id="detail-body">
  <main id="info"> -- ~65%
    <title-block> -- name, location, price, status pill
    <specs-row> -- bedrooms, bathrooms, land area, building area, type
    <description>
    <map-block>
  </main>
  <aside id="contact-card"> -- ~35%, sticky
    WhatsApp / Call / Email CTAs
  </aside>
</section>
<section id="similar-properties">
  -- reuses homepage PropertyShowcase horizontal-scroll pattern, 3-4 cards
</section>
<footer> -- reused from preview
```

## Styling Specification

### Breadcrumb
- `text-xs tracking-wide text-stone-400 px-6 md:px-12 pt-28 pb-4`, `/` separators, current page in `text-stone-600`

### Gallery
- Hero photo: `rounded-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9]` full width within `max-w-7xl` container, `shadow-xl ring-1 ring-black/5` (echoes the homepage hero card's shadow/ring treatment)
- Thumbnail row: `flex gap-3 mt-3 overflow-x-auto no-scrollbar`, each thumb `w-24 h-16 rounded-lg overflow-hidden shrink-0 cursor-pointer`, active/hovered thumb gets `ring-2 ring-orange`
- Lightbox: `fixed inset-0 z-[200] bg-stone-900/95 backdrop-blur-sm`, centered image `max-h-[85vh] rounded-xl`, close button top-right (`✕`, same circular button treatment as elsewhere), prev/next arrow buttons left/right (reuse the homepage showcase's circular arrow button style), counter text (`3 / 8`) bottom-center
- Lightbox opens/closes via a simple class toggle + fade/scale transition; no external lightbox library, consistent with the homepage's hand-rolled GSAP approach

### Title block (main column)
- Status pill: same color-coded pill as catalog rows (`Tersedia`/`Disewa`/`Terjual`)
- Name: `font-playfair italic text-4xl md:text-5xl text-stone-900`
- Location: `text-stone-500 flex items-center gap-1.5` with pin icon
- Price: `text-3xl md:text-4xl font-semibold mt-2`, orange accent on the numeric portion (matches catalog row and homepage stats pattern)

### Specs row
- `grid grid-cols-2 md:grid-cols-5 gap-4 py-8 border-y border-stone-200/60 my-8`
- Each stat: icon (inline SVG, 20px, `text-orange`) above value above label, echoes the Stats section's number-over-label structure but compact: `text-xl font-semibold text-stone-900` value, `text-xs uppercase tracking-wide text-stone-400` label
- Items: Kamar Tidur, Kamar Mandi, Luas Tanah (m²), Luas Bangunan (m²), Tipe Properti

### Description
- `eyebrow` header ("/ Deskripsi") + `text-stone-600 leading-relaxed max-w-2xl`

### Map block
- `rounded-2xl overflow-hidden aspect-[16/7] bg-stone-100 relative`, placeholder static image or muted map-style background, centered pin marker icon (`text-orange`, drop shadow) + address label overlay bottom-left in a small glass pill (`bg-white/80 backdrop-blur-md rounded-full px-4 py-2 text-sm`)
- Note: real implementation will need a Google Maps embed or static maps API key; this design pass uses a static placeholder

### Contact card (sticky aside)
- Container: `sticky top-32 rounded-2xl border border-stone-200/60 bg-white p-6 shadow-sm`, same surface language as the catalog filter panel
- Heading: `font-playfair italic text-xl` "Tertarik dengan properti ini?"
- Three CTA buttons stacked (`flex flex-col gap-3`):
  - WhatsApp: `bg-sage text-white rounded-full px-6 py-3 flex items-center justify-center gap-2 font-medium hover:bg-sage/90` (sage reused from the USP dark card, keeps orange reserved as the single primary accent elsewhere)
  - Telepon: `border border-stone-300 rounded-full px-6 py-3 hover:bg-stone-900 hover:text-white transition-colors`
  - Email: same style as Telepon
- Satisfies F-012 AC3 (contact CTA visible on page) without a full agent-profile card, per the scoping decision made during design review

### Similar Properties
- Reuses the homepage's `#properti` section structure verbatim (eyebrow "/ Properti Serupa", horizontal scroll, grayscale-hover cards, price badge) with 3-4 mock related properties

## Interactions

- Thumbnail click → swaps hero photo (or opens lightbox directly at that index — design uses direct lightbox-open on thumbnail click for simplicity)
- Lightbox: prev/next cycles through all photos, `Escape` key and click-outside close it, focus trapped while open
- Reduced motion: lightbox fade/scale transition disabled, snaps to open/closed state

## Responsive Behavior

| Breakpoint | Gallery | Body columns |
|---|---|---|
| Mobile (<768px) | Hero `aspect-[16/9]`, thumbnails scroll horizontally | Single column: info stacked above contact card (contact card not sticky) |
| Desktop (≥1024px) | Hero `aspect-[21/9]` | Two columns: `main` ~65% / `aside` ~35%, aside sticky |

## Accessibility

- Lightbox is a modal: `role="dialog"`, `aria-modal="true"`, focus returns to trigger thumbnail on close
- Prev/next/close buttons have `aria-label`s
- Map block includes a text address alternative (not conveyed by the pin icon alone)
- All CTA buttons are real `<a href="tel:...">` / `<a href="mailto:...">` / WhatsApp `https://wa.me/...` links, not JS-only handlers

## Data Contract (design-time mock)

Same shape as the catalog spec's mock object, plus a `photos: string[]` array (multiple images, matching the real `propertyPhotos` table shape already in `schema.ts`) and a `mapAddress` string for the placeholder map label.

`type`, `bedrooms`, `bathrooms`, `landArea`, `buildingArea`, `description` still require schema/migration work before real data can back this page — same caveat as the catalog spec.

## Out of Scope

- Booking/scheduling functionality (explicitly out per F-012 scope)
- Mortgage calculator (explicitly out per F-012 scope)
- Real map embed / API integration
- React componentization (follow-up implementation task)
- Agent profile card (scoped down to a lighter contact CTA card per design review)

## Files to Create/Modify

| File | Action |
|---|---|
| `docs/aresphi-detail.html` | Create |

## Acceptance Criteria Mapping (F-012)

| AC | Design coverage |
|---|---|
| AC1: Property detail page shows all property information | Title block, specs row, description, map |
| AC2: Photo gallery displays all property photos | Hero + thumbnail row + fullscreen lightbox covering full `photos[]` array |
| AC3: Contact CTA visible on page | Sticky contact card with WhatsApp/Call/Email actions |
