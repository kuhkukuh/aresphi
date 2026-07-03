# Partner Logos Marquee Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a self-contained partner logos marquee component with infinite scroll, greyscale treatment, pause-on-hover, and reduced motion support.

**Architecture:** Pure CSS animation using existing marquee utilities from globals.css. Single component with duplicated logo row for seamless loop. Static data for 9 bank partner logos.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4

---

## File Structure

```
src/
├── components/
│   └── PartnerLogos.tsx       # Main component (new)
├── app/
│   └── page.tsx               # Import component (modify when ready to display)
public/
└── partners/                  # Logo assets (new directory)
    ├── bni.svg
    ├── bjb.svg
    ├── btn.svg
    ├── bri.svg
    ├── bca.svg
    ├── bpr.svg
    ├── bpr-hik.svg
    ├── bws.svg
    └── sampoerna.svg
```

---

### Task 1: Create Partners Directory and Source Logos

**Files:**
- Create: `public/partners/` directory
- Create: 9 logo files (SVG preferred, PNG fallback)

- [ ] **Step 1: Create partners directory**

```bash
mkdir -p public/partners
```

- [ ] **Step 2: Download BNI logo**

```bash
 curl -L "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/BNI_logo.svg/200px-BNI_logo.svg.png" -o public/partners/bni.svg 2>/dev/null || echo "BNI: will use placeholder"
```

Note: If official SVGs aren't available, we'll create simple placeholder components.

- [ ] **Step 3: Create placeholder logo files for all 9 banks**

Since bank logos may have usage restrictions, create simple SVG placeholders:

```bash
cat > public/partners/bni.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" width="200" height="60">
  <text x="100" y="40" font-family="system-ui, sans-serif" font-size="24" font-weight="700" fill="#78716C" text-anchor="middle">BNI</text>
</svg>
EOF

cat > public/partners/bjb.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" width="200" height="60">
  <text x="100" y="40" font-family="system-ui, sans-serif" font-size="24" font-weight="700" fill="#78716C" text-anchor="middle">BJB</text>
</svg>
EOF

cat > public/partners/btn.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" width="200" height="60">
  <text x="100" y="40" font-family="system-ui, sans-serif" font-size="24" font-weight="700" fill="#78716C" text-anchor="middle">BTN</text>
</svg>
EOF

cat > public/partners/bri.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" width="200" height="60">
  <text x="100" y="40" font-family="system-ui, sans-serif" font-size="24" font-weight="700" fill="#78716C" text-anchor="middle">BRI</text>
</svg>
EOF

cat > public/partners/bca.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" width="200" height="60">
  <text x="100" y="40" font-family="system-ui, sans-serif" font-size="24" font-weight="700" fill="#78716C" text-anchor="middle">BCA</text>
</svg>
EOF

cat > public/partners/bpr.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" width="200" height="60">
  <text x="100" y="40" font-family="system-ui, sans-serif" font-size="24" font-weight="700" fill="#78716C" text-anchor="middle">BPR</text>
</svg>
EOF

cat > public/partners/bpr-hik.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" width="200" height="60">
  <text x="100" y="40" font-family="system-ui, sans-serif" font-size="20" font-weight="700" fill="#78716C" text-anchor="middle">BPR HIK</text>
</svg>
EOF

cat > public/partners/bws.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" width="200" height="60">
  <text x="100" y="40" font-family="system-ui, sans-serif" font-size="24" font-weight="700" fill="#78716C" text-anchor="middle">BWS</text>
</svg>
EOF

cat > public/partners/sampoerna.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" width="200" height="60">
  <text x="100" y="40" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="#78716C" text-anchor="middle">Bank Sampoerna</text>
</svg>
EOF
```

- [ ] **Step 4: Verify files created**

```bash
ls -la public/partners/
```

Expected: 9 SVG files listed

- [ ] **Step 5: Commit**

```bash
git add public/partners/
git commit -m "feat: add partner logo placeholders"
```

---

### Task 2: Create PartnerLogos Component

**Files:**
- Create: `src/components/PartnerLogos.tsx`

- [ ] **Step 1: Create components directory**

```bash
mkdir -p src/components
```

- [ ] **Step 2: Write PartnerLogos component**

```tsx
'use client';

import Image from 'next/image';

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

export default function PartnerLogos() {
  return (
    <section className="py-6 overflow-hidden bg-stone-50 dark:bg-stone-900">
      <div className="relative marquee-mask">
        <div
          className="flex gap-8 animate-marquee hover:[animation-play-state:paused]"
          style={{ width: 'fit-content' }}
        >
          {/* First set */}
          {PARTNER_LOGOS.map((logo) => (
            <div
              key={logo.name}
              className="flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                width={160}
                height={64}
                className="h-16 w-auto object-contain"
              />
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {PARTNER_LOGOS.map((logo) => (
            <div
              key={`${logo.name}-dup`}
              className="flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                width={160}
                height={64}
                className="h-16 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/PartnerLogos.tsx
git commit -m "feat: add PartnerLogos marquee component"
```

---

### Task 3: Add Reduced Motion Support to globals.css

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add reduced motion media query**

Add to end of `src/app/globals.css`:

```css
/* Reduced motion: disable marquee animation */
@media (prefers-reduced-motion: reduce) {
  .animate-marquee {
    animation: none;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add reduced motion support for marquee"
```

---

### Task 4: Update Next.js Config for Image Domains (if needed)

**Files:**
- Modify: `next.config.ts` (if external images used)

- [ ] **Step 1: Skip if using local images only**

Since we're using local SVG files in `public/partners/`, no config changes needed. Next.js automatically serves files from `public/`.

---

### Task 5: Verify Component in Isolation

**Files:**
- Modify: `src/app/page.tsx` (temporarily, for testing)

- [ ] **Step 1: Test component in page**

Temporarily add to `src/app/page.tsx`:

```tsx
import PartnerLogos from '@/components/PartnerLogos';

export default function Home() {
  return (
    <main>
      <PartnerLogos />
    </main>
  );
}
```

- [ ] **Step 2: Run dev server and verify**

```bash
npm run dev
```

Open http://localhost:3000 and verify:
- All 9 logos appear in a row
- Marquee scrolls left smoothly
- Hovering pauses the animation
- Logos transition from greyscale to color on hover

- [ ] **Step 3: Test reduced motion**

1. Open DevTools
2. Open Command Menu (Cmd+Shift+P)
3. Search "prefers-reduced-motion"
4. Select "Emulate CSS media feature prefers-reduced-motion: reduce"
5. Verify animation stops

- [ ] **Step 4: Revert page.tsx if hero not ready**

If hero is still being worked on, revert page.tsx to empty or remove the temporary import:

```tsx
// Empty for now - component ready for integration
```

- [ ] **Step 5: Commit verification**

```bash
git add src/app/page.tsx
git commit -m "test: verify PartnerLogos component works"
```

---

### Task 6: Final Cleanup and Integration Prep

- [ ] **Step 1: Ensure component is exportable**

Verify `src/components/PartnerLogos.tsx` has `export default function PartnerLogos()`.

- [ ] **Step 2: Document usage**

Add a brief comment at top of component file:

```tsx
/**
 * PartnerLogos - Marquee scroll of bank partner logos
 *
 * Usage: Import and place below hero section
 * import PartnerLogos from '@/components/PartnerLogos';
 *
 * Features:
 * - Infinite horizontal scroll (30s cycle)
 * - Pause on hover
 * - Greyscale with color reveal on hover
 * - Reduced motion support
 */
```

- [ ] **Step 3: Final commit**

```bash
git add .
git commit -m "feat: complete PartnerLogos component (F-002)"
```

---

## Acceptance Criteria Verification

| AC | Task | How to Verify |
|----|------|---------------|
| AC1: 9 logos in greyscale | Task 2 | Visual check in browser |
| AC2: Infinite scroll left | Task 2 | Watch animation for 30+ seconds |
| AC3: Pause on hover | Task 2 | Hover over marquee, verify stop |
| AC4: Reduced motion | Task 3 | DevTools emulation |

---

## Notes

- Component is ready to drop below hero when F-001 is complete
- Replace placeholder SVGs with real logos when client provides them
- Animation speed can be adjusted via CSS animation-duration if needed
