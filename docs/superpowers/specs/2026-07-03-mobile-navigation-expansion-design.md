# Mobile Navigation Expansion Design

**Date:** 2026-07-03
**Status:** Approved

## Overview

Refactor the floating navigation to separate mobile and desktop implementations. Mobile navigation uses an expanding floating pill pattern instead of a side drawer.

## Goals

- Separate mobile and desktop navigation components while sharing styling
- Implement expanding floating pill for mobile (expands downward on hamburger click)
- Smooth spring-based animations using framer-motion
- Maintain current desktop behavior

## Component Structure

```
src/components/
├── Navigation.tsx      # Main orchestrator (client component)
├── DesktopNav.tsx      # Desktop nav links + button
└── MobileNav.tsx       # Mobile expanding nav
```

## Visual Specifications

### Mobile - Collapsed State
- Floating pill centered at top
- Logo left-aligned, hamburger right-aligned
- `justify-between` spacing
- `rounded-full` border radius

### Mobile - Expanded State
- Container expands downward to reveal menu
- Logo stays top-left, close button (X) top-right
- Menu items listed vertically below
- "Hubungi Kami" button at bottom
- Border-radius animates to `rounded-3xl`

### Mobile Menu Items
- Tentang
- Layanan
- Properti
- Kontak
- Hubungi Kami (button style)

## Animation Specifications

| Property | Collapsed | Expanded | Easing |
|----------|-----------|----------|--------|
| Height | auto (56px) | auto (content) | spring |
| Border-radius | 9999px | 24px | spring |
| Children opacity | 0 | 1 | stagger |
| Children y | -10px | 0 | stagger |

- Use `framer-motion` `AnimatePresence` for enter/exit
- Spring config: `stiffness: 300, damping: 30`
- Stagger delay: 50ms per item

## Shared Styling

```typescript
const navStyles = {
  container: {
    base: "fixed left-1/2 top-5 z-[100] flex items-center",
    floating: "border border-white/10 bg-black/50 backdrop-blur-2xl",
    shadow: "shadow-[0_24px_90px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.16)]",
  },
  link: {
    base: "rounded-full px-4 py-2 text-sm font-medium transition-colors",
    inactive: "text-white/80 hover:bg-white/10 hover:text-white",
    active: "text-black bg-white",
  },
  button: {
    primary: "rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] transition-all hover:border-white/40 hover:bg-white/20",
  },
};
```

## Desktop Behavior (Unchanged)

- Centered nav links pill inside main container
- Width expands from 800px to 1152px after scrolling past hero (2000px)
- Active section highlighting with animated pill

## Implementation Notes

1. Keep `Navigation.tsx` as the orchestrator with scroll state logic
2. `DesktopNav.tsx` - presentational, receives `activeSection` and nav links
3. `MobileNav.tsx` - client component with open/close state and animations
4. Share `navLinks` data and `navStyles` object
