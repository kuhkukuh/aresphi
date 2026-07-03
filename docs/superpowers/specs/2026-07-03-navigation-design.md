# Navigation Component Design

## Overview

Floating pill-shaped navbar dengan glassmorphism blur effect. Matches `aresphi-preview.html` exactly.

## Component Structure

```
src/components/Navigation.tsx
```

Single client component with:
- Logo (wordmark link to top)
- Desktop links container (hidden on mobile)
- "Hubungi Kami" CTA button (hidden on mobile)
- Mobile hamburger button (hidden on desktop)
- Mobile drawer (rendered when open)

## Visual Design

### Container
- Position: `fixed left-1/2 top-5 z-[100]`
- Transform: `-translate-x-1/2`
- Shape: `rounded-full`
- Background: `bg-black/50 backdrop-blur-2xl`
- Border: `border border-white/10`
- Padding: `px-4 py-3 sm:px-5 md:px-6`
- Shadow: `shadow-[0_24px_90px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.16)]`

### Animation States

**Initial (page load):**
- `opacity: 0`
- `transform: translate(-50%, -20px) scale(0.96)`
- `max-width: 800px`

**After page ready (~100ms):**
- `opacity: 1`
- `transform: translate(-50%, 0) scale(1)`

**After scrolling past hero (scrollY > 2000px):**
- `max-width: 1152px` (expands width)

Transition duration: `0.8s cubic-bezier(0.16, 1, 0.3, 1)` for transform/opacity, `0.4s ease` for max-width

### Logo
- Font: Playfair Display, italic, `text-2xl`
- Content: `Aresphi®` registered symbol in orange
- No hover effect beyond inherited

### Desktop Links Container
- Wrapper: `rounded-full border border-white/10 bg-white/[0.04] px-2 py-2`
- Display: `hidden md:flex`
- Gap: `gap-2`

### Link Items (text links)
- Style: `rounded-full px-4 py-2 text-sm font-medium text-white/80`
- Hover: `hover:bg-white/10 hover:text-white`
- Transition: `transition-colors`
- Links: `#properti`, `#layanan`, `#tentang`

### Contact Button (in links container)
- Style: `rounded-full bg-white px-4 py-2 text-sm font-semibold text-black shadow-sm`
- Link: `#kontak`

### Hubungi Kami Button (standalone)
- Display: `hidden md:inline-flex`
- Style: `rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]`
- Hover: `hover:border-white/40 hover:bg-white/20`
- Transition: `transition-all duration-300`
- Link: `#kontak`

### Mobile Hamburger Button
- Display: `flex md:hidden`
- Size: `h-11 w-11`
- Shape: `rounded-full`
- Background: `border border-white/15 bg-white/10 backdrop-blur-xl`
- Icon: 3 horizontal lines (Lucide Menu or custom SVG)
- Color: `text-white`
- aria-label: "Open menu"

## Mobile Drawer

Triggered by hamburger button click.

### Overlay
- Position: `fixed inset-0 z-[90]`
- Background: `bg-black/60 backdrop-blur-sm`
- Animation: fade in/out

### Drawer Panel
- Position: `fixed top-0 right-0 z-[95]`
- Size: `w-[280px] h-full`
- Background: `bg-stone-900`
- Animation: slide in from right (x: 100% → 0)
- Padding: `pt-20 px-6`

### Drawer Links
- Layout: `flex flex-col gap-2`
- Style: `text-white text-lg font-medium py-3 border-b border-white/10`
- Links: Properti, Layanan, Tentang, Kontak
- Close on click

### Close Button
- Position: `absolute top-5 right-5`
- Style: same as hamburger button
- Icon: X icon (Lucide X)

## Animation Implementation

1. Use `useState` for `isReady` and `hasScrolled` states
2. Use `useEffect` with scroll listener for `hasScrolled`
3. Apply CSS classes conditionally:
   - `page-ready` → animate in from hidden state
   - `has-scrolled` → expand max-width
4. Mobile drawer uses Framer Motion `AnimatePresence` for enter/exit animations

## Accessibility

- `aria-label` on nav element: "Main navigation"
- `aria-label` on logo link: "Aresphi home"
- `aria-label` on links container: "Primary links"
- `aria-label` on hamburger button: "Open menu" / "Close menu"
- `aria-expanded` on hamburger button when drawer is open
- Focus trap in mobile drawer
- ESC key closes drawer

## Out of Scope

- Active section highlighting (AC5) — not in preview design
- Search functionality
- User authentication
- Dropdown submenus

## Files to Create/Modify

1. `src/components/Navigation.tsx` — new component
2. `src/app/layout.tsx` — import and add Navigation component

## Notes

- Match preview exactly: no underline on links, no bold on active, no visual active state
- Width breakpoint at scrollY > 2000px (after hero pin animation completes)
- Reduced motion: skip all animations, show navbar immediately at full width
