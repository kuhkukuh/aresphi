# Admin Dashboard Design (Redesign Pass)

> Module: admin | Date: 2026-07-03 | Supersedes visual design of F-010

## Overview

Static HTML design mockup for a redesigned admin dashboard, extending the visual language established in `docs/aresphi-preview.html`, `docs/aresphi-catalog.html`, and `docs/aresphi-detail.html`. The current React admin (`src/app/admin`) is functional but visually generic (plain white cards on beige, default form controls) and only covers 3 sections (Properties, Hero, Stats). This pass redesigns the dashboard's look and information architecture to match the marketing site's aesthetic, and expands the IA to cover the other content areas that are currently hardcoded in components (`Footer.tsx`, `QuoteSection.tsx`, `PartnerLogos.tsx`).

This is a design-phase deliverable: a self-contained static HTML file for visual review, not a React implementation. React componentization, new DB fields/tables, and wiring for the newly-designed sections (Featured Property, Testimonial, Socials) are follow-up engineering tasks.

> **Revision note:** After initial review, the category-grouped nav (Listings / Site Content) was dropped in favor of a single flat tab row — the grouping added a click without earning it for only 6 tabs. Partners was cut entirely (not needed). Testimonial changed from a single record with a configurable background photo to a repeatable list of quote/author entries — the background photo is one static image set in code, not admin-configurable. Socials dropped the privacy-link and copyright-text fields (unnecessary).

## File

**Location:** `docs/aresphi-admin.html`

Self-contained, mirroring the other mockup files: own `<head>` with the same Tailwind CDN config (fonts, colors), same `<style>` block conventions (`eyebrow`, `flashlight-card`, font faces), Phosphor icons via CDN (as used in catalog/detail). No GSAP/Lenis scroll rig needed (admin is a utility screen, not a scroll narrative) — only small vanilla JS for tab/category switching and a couple of hover/toggle states, same pattern as the `status-pill` JS in `aresphi-catalog.html`.

Does **not** reuse the public floating nav or footer — the admin dashboard is an authenticated app screen, not a marketing page, so it gets its own minimal topbar (see below) and no footer.

## Screens

The mockup renders both states in one file (simplest way to review both), separated by a full-width `<hr>`-style divider labeled "Login State" / "Dashboard State" in an HTML comment so it's clear these are two separate views, not stacked UI.

### 1. Login Screen

- Full-bleed dark gradient background matching the Hero section (`from-[#0a0d1f] via-[#0e1228] to-[#0a0d1f]`)
- Centered `flashlight-card` panel (`max-w-sm`, white/6% on dark — i.e. a dark-mode variant: `bg-white/[0.04] backdrop-blur-2xl border border-white/10`)
- `Aresphi<span class="text-orange">®</span>` wordmark (Playfair italic, `text-3xl`) centered at the top of the card
- Username + password inputs restyled: dark inputs (`bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-orange`), rounded-xl
- Submit button: solid white pill (`bg-white text-black`) to mirror the "Kontak" CTA treatment from the public nav
- Error state shown as a small red-tinted inline message above the fields (static example, not live)

### 2. Dashboard Shell

```
<div id="admin-shell">
  <header id="admin-topbar">
    Aresphi® wordmark (small, Playfair italic) + "Admin" label -- left
    Logout link -- right
  </header>

  <nav id="tabs">
    <!-- single flat row, underline-tab visual language -->
  </nav>

  <main id="tab-panel">
    <!-- flashlight-card surface containing the active tab's content -->
  </main>
</div>
```

- Topbar: `bg-white/60 backdrop-blur-sm border-b border-stone-200/60`, sits on the page's `bg-beige`, NOT a floating pill nav (per approved shell decision) — a plain sticky bar, `px-6 md:px-12 py-4`
- Tabs: a single flat row of underline tabs (no category grouping — dropped per revision note above), active state `border-b-2 border-orange text-stone-900 font-semibold`, inactive `text-stone-500`
- Content panel: `flashlight-card` surface (`bg-white/60 backdrop-blur-md border border-stone-200/60 rounded-2xl p-6 md:p-8`)

**Tabs:** Properties, Hero Photos, Featured Property, Stats, Testimonial, Socials

Mockup ships with **Properties** as the visibly-active tab by default; the other 5 tabs are fully built out in the markup but can be toggled via the JS (all present in the DOM, hidden/shown — not lazily rendered, since there's no backend here).

## Tab Content Specifications

### Properties

- Row-based list, same recipe as `aresphi-catalog.html` property rows but denser (admin context, not marketing): thumbnail (`w-20 h-20 rounded-xl shrink-0`), name (`font-playfair italic text-lg`), location, price, status badge, showcase toggle switch, edit (pencil icon) + delete (trash icon) buttons, all in a single flex row per property, divided by `border-b border-stone-200/60`
- Status badge color coding (reused from catalog spec): available = `bg-sage/10 text-sage`, sold = `bg-stone-200 text-stone-500`, rented = `bg-orange/10 text-orange`
- Toggle switch: custom CSS pill toggle (`bg-stone-200` off / `bg-orange` on with sliding white circle), labeled "Showcase"
- Header row above the list: "+ Tambah Properti" button (`bg-stone-900 text-white rounded-full px-6 py-3`, dark pill matching homepage CTA)
- One property shown in an **expanded edit state** (slide-over panel, `fixed right-0 inset-y-0 w-full md:w-[480px] bg-white shadow-2xl`, static/always-visible-in-markup for the mockup rather than JS-triggered) containing: name/location/price text inputs, status `<select>`, showcase toggle, and a photo grid (`grid grid-cols-3 gap-3` of `thumb`-style tiles reused from the detail page gallery, each with a remove ✕ overlay, plus a dashed-border "+ Add Photo" tile)

### Hero Photos

- 3 tiles arranged to mirror the actual hero card stack: center tile larger (`w-[44%]`), two side tiles smaller (`w-[32%]`), using the same relative sizing as `.hero-card` in `aresphi-preview.html`, laid flat left-to-right here (not overlapping/rotated — this is a management view, not the animated stack)
- Each tile: image fills, hover overlay (`bg-black/50` fade-in) with a centered "Ganti Foto" (Replace Photo) button
- Small caption under each tile: "Posisi 1 (Depan)" / "Posisi 2 (Tengah)" / "Posisi 3 (Belakang)"

### Featured Property

- Card grid (`grid grid-cols-2 lg:grid-cols-3 gap-6`), each card reusing the `PropertyShowcaseClient` visual treatment: image with grayscale→color hover, gradient scrim, price pill, name, location
- Each card gets a top-right circular toggle (star icon, filled orange when featured / outline stone when not) instead of the arrow CTA — this is a curation view, clicking the star toggles inclusion in the public Property Showcase section
- A small drag-handle icon (`⋮⋮`, `ph-dots-six-vertical`) in the top-left of each card for reordering
- Visually distinct from Properties tab: no status badges, no edit/delete — purely "is this featured, in what order"

### Stats

- 4-column grid (`grid sm:grid-cols-2 lg:grid-cols-4 gap-6`) styled like the actual homepage stats block: large serif-adjacent number (`text-5xl font-semibold`) with orange `+`/`%` suffix, uppercase tracked label underneath
- Each stat card is `bg-white/60 rounded-2xl p-6 border border-stone-200/60`; clicking (visually, a pencil icon in the corner) reveals inline-editable value/suffix/label — mockup shows one card in the "editing" state (three small inputs replacing the static display) to demonstrate the interaction, others shown in static/display state
- "Simpan Perubahan" save button top-right of the panel, dark pill

### Testimonial

- Repeatable list, not a single record — the site can show more than one testimonial. Header row has "+ Tambah Testimonial" pill button (same recipe as Properties' "+ Tambah Properti")
- No background-photo field: the testimonial section uses one static photo set in code, not per-testimonial — so each entry is text-only: Kutipan `<textarea>`, Penekanan `<textarea>`, Nama input, Jabatan input, laid out as `grid md:grid-cols-2 gap-3` for the name/title pair below the two textareas
- Each testimonial is its own card (`bg-white/60 rounded-2xl border border-stone-200/60 p-6`), with a trash icon top-right to remove it
- No live preview column — removing the photo made per-testimonial preview less meaningful, and it added a UI cost this pass doesn't need

### Socials

- Two-column form (`grid md:grid-cols-2 gap-6`): Telepon, Email, Alamat (2 lines), Instagram URL, LinkedIn URL — each a labeled text input using the same input styling as the catalog filter sidebar (`rounded-lg border border-stone-300 bg-white/70 px-3 py-2 text-sm focus:border-orange`)
- Link Privasi and Teks Copyright dropped (unnecessary — not something admin needs to change)
- "Simpan Perubahan" save button, same dark pill pattern as Stats

## Interactions (mockup-level, no backend)

- Tab click → shows/hides the corresponding panel within `#tab-panel` (vanilla JS show/hide, same pattern as catalog's `status-pill` toggle script)
- All uploads, saves, drag-reorder, and toggles are **visual states only** — no live logic. Where an interaction needs to show state (toggle on/off, one stat in edit mode, one property in slide-over edit), the mockup hardcodes that state on a representative example rather than wiring real toggling for every control set.
- Reduced motion: any hover transitions (image grayscale, overlay fade) respect `prefers-reduced-motion`, consistent with the other mockups

## Data Contract (design-time mock)

Mock data extends beyond current `schema.ts` for the newly-designed sections, same convention as the catalog page's mock contract:

```
property:      { name, location, price, status, showInShowcase, photos: [] }   // matches schema.ts today
heroPhoto:      { url, alt, position }                                          // matches schema.ts today
featuredProperty: reuses property + showInShowcase + displayOrder               // matches schema.ts today
stat:          { value, suffix, label }                                        // matches schema.ts today
testimonial:   { quoteText, quoteEmphasis, authorName, authorTitle, displayOrder } // NEW — no table yet (QuoteSection props today are hardcoded defaults, single record); note: no `image` field — background photo stays a static asset in code, not per-record
socials:       { phone, email, addressLine1, addressLine2, instagramUrl, linkedinUrl } // NEW — no table yet (hardcoded in Footer.tsx today)
```

`testimonial` and `socials` do not exist in `schema.ts` yet — schema + migration + API route work needed before this can be wired to real data. That's out of scope for this design pass, same as the catalog page's deferred fields.

## Out of Scope

- Live upload/save/toggle/reorder logic (visual states only)
- Schema/migration changes for `testimonial` and `socials` tables
- API routes for the new sections
- React componentization (follow-up implementation task, would replace/extend `src/app/admin` and `src/components/admin`)
- Auth changes (login screen is a visual redesign only, same static-credential flow as today)
- Partner logos management (cut from scope — partners are not admin-managed)

## Files to Create/Modify

| File | Action |
|---|---|
| `docs/aresphi-admin.html` | Create |

## Acceptance Criteria Mapping (F-010 visual refresh)

| AC (original F-010) | Design coverage |
|---|---|
| AC1: Create property with required fields | Properties tab "+ Tambah Properti" + slide-over edit panel |
| AC2: Upload property photos | Photo grid in slide-over panel (visual only in this pass) |
| AC3: Set property status | Status `<select>` in slide-over panel |
| AC4: Designate Hero photo | Hero Photos tab, 3 positioned tiles |
| AC5: Designate Showcase properties | Split into two views: Properties tab toggle (quick) + dedicated Featured Property tab (curation/reorder) |
| AC6: Static login | Redesigned login screen, same auth flow |
