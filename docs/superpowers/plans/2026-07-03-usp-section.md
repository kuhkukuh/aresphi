# USP Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the USP Bento grid section with testimonial card, two flashlight effect cards, and a dark stats card.

**Architecture:** Single client component with inline flashlight effect handlers. Uses Tailwind CSS for styling, standard `<img>` tags for images (matching Hero component pattern). No GSAP animations.

**Tech Stack:** Next.js, React, Tailwind CSS, GSAP (already in project, not used for this component)

---

### Task 1: Create USPSection component shell with section header

**Files:**
- Create: `/src/components/USPSection.tsx`

- [ ] **Step 1: Create the component file with header structure**

```tsx
"use client";

export default function USPSection() {
  return (
    <section id="tentang" className="py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <div className="flex justify-between items-baseline mb-4 pb-4 border-b border-stone-400/20">
              <span className="text-xs font-semibold text-orange uppercase tracking-[0.15em]">
                / 01 Mengapa Aresphi
              </span>
              <span className="text-xs text-stone-400 font-mono">
                [ 01 ]
              </span>
            </div>
            <h2 className="mt-8 text-4xl font-medium leading-tight sm:text-5xl md:text-6xl lg:text-[4.6rem] tracking-[-0.055em] text-stone-900">
              Kepercayaan
              <br />
              <span className="font-playfair italic font-normal text-stone-500/80">
                yang Terbukti
              </span>
            </h2>
          </div>
          <p className="text-stone-500 max-w-sm text-sm">
            Kami berkomitmen memberikan layanan terbaik dengan profesionalisme tinggi.
          </p>
        </div>

        {/* Grid placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:h-[500px]">
          {/* Cards will go here */}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify component compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/USPSection.tsx
git commit -m "feat: add USPSection component shell with header"
```

---

### Task 2: Add testimonial card

**Files:**
- Modify: `/src/components/USPSection.tsx`

- [ ] **Step 1: Add testimonial card to the grid**

Replace the grid placeholder with:

```tsx
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:h-[500px]">
          {/* Testimonial Card */}
          <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-2xl min-h-[300px]">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
              alt="Interior"
              className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105 bg-stone-200"
              onError={(e) => {
                e.currentTarget.style.visibility = "hidden";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
              <p className="text-white/80 text-lg font-light leading-snug mb-4">
                "Tim profesional yang sangat membantu."
              </p>
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80"
                  alt="Ahmad Wijaya"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/30 bg-stone-600"
                  onError={(e) => {
                    e.currentTarget.style.visibility = "hidden";
                  }}
                />
                <div>
                  <p className="font-medium">Ahmad Wijaya</p>
                  <p className="text-white/60 text-xs">Jakarta</p>
                </div>
              </div>
            </div>
          </div>
        </div>
```

- [ ] **Step 2: Verify component compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/USPSection.tsx
git commit -m "feat: add testimonial card to USPSection"
```

---

### Task 3: Add flashlight cards

**Files:**
- Modify: `/src/components/USPSection.tsx`

- [ ] **Step 1: Add flashlight card styles and handlers**

Add at the top of the component, before the return statement:

```tsx
const handleFlashlightMove = (e: React.MouseEvent<HTMLDivElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
};
```

- [ ] **Step 2: Add flashlight cards to the grid**

Add after the testimonial card `</div>`:

```tsx

          {/* Flashlight Card 01 */}
          <div
            className="flashlight-card overflow-hidden relative rounded-xl bg-white/60 backdrop-blur-xl border border-black/5 cursor-pointer"
            onMouseMove={handleFlashlightMove}
          >
            <span className="absolute -top-2 -right-1 font-playfair text-[120px] italic tracking-tighter text-stone-900/30 leading-none select-none pointer-events-none">
              01
            </span>
            <div className="relative z-10 p-6 h-full flex flex-col justify-end min-h-[180px]">
              <h4 className="text-xl tracking-tight text-stone-900 mb-1">
                Layanan Lengkap
              </h4>
              <p className="text-stone-500 text-sm">
                Konsultasi hingga transaksi
              </p>
            </div>
          </div>

          {/* Flashlight Card 02 */}
          <div
            className="flashlight-card overflow-hidden relative rounded-xl bg-white/60 backdrop-blur-xl border border-black/5 cursor-pointer"
            onMouseMove={handleFlashlightMove}
          >
            <span className="absolute -top-2 -right-1 font-playfair text-[120px] italic tracking-tighter text-stone-900/30 leading-none select-none pointer-events-none">
              02
            </span>
            <div className="relative z-10 p-6 h-full flex flex-col justify-end min-h-[180px]">
              <h4 className="text-xl tracking-tight text-stone-900 mb-1">
                Jaringan Luas
              </h4>
              <p className="text-stone-500 text-sm">
                Akses properti eksklusif
              </p>
            </div>
          </div>
```

- [ ] **Step 3: Add flashlight CSS to global styles or check if it exists**

Check if flashlight styles exist in the design reference. They're defined in the HTML `<style>` tag. Since this is a Next.js project with Tailwind, we'll add these styles to a CSS file.

Create or modify: `/src/app/globals.css` — add the flashlight effect:

```css
/* Flashlight card effect */
.flashlight-card {
  position: relative;
}

.flashlight-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(255, 255, 255, 0.8),
    transparent 40%
  );
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
  z-index: 0;
}

.flashlight-card:hover::before {
  opacity: 1;
}
```

- [ ] **Step 4: Verify component compiles and styles apply**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add src/components/USPSection.tsx src/app/globals.css
git commit -m "feat: add flashlight cards with cursor spotlight effect"
```

---

### Task 4: Add dark stats card

**Files:**
- Modify: `/src/components/USPSection.tsx`

- [ ] **Step 1: Add dark stats card to the grid**

Add after flashlight card 02 `</div>`:

```tsx

          {/* Dark Stats Card */}
          <div className="md:col-span-2 bg-[#2C3E35] rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden text-white min-h-[160px]">
            <span className="absolute -top-2 -right-1 font-playfair text-[120px] italic tracking-tighter text-white/30 leading-none select-none pointer-events-none">
              03
            </span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange rounded-full animate-pulse" />
              <span className="text-xs uppercase tracking-wide opacity-80">
                Transparansi Total
              </span>
            </div>
            <div>
              <h3 className="text-3xl tracking-tight mb-2">100%</h3>
              <p className="text-white/60 text-sm">
                Informasi jujur. Tanpa biaya tersembunyi.
              </p>
            </div>
          </div>
```

- [ ] **Step 2: Verify component compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/USPSection.tsx
git commit -m "feat: add dark stats card to USPSection"
```

---

### Task 5: Integrate USPSection into home page

**Files:**
- Modify: `/src/app/page.tsx`

- [ ] **Step 1: Import and add USPSection below PartnerLogos**

```tsx
import Hero from "@/components/Hero";
import PartnerLogos from "@/components/PartnerLogos";
import USPSection from "@/components/USPSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <PartnerLogos />
      <USPSection />
    </main>
  );
}
```

- [ ] **Step 2: Verify the app builds and runs**

Run: `npm run build`
Expected: Build succeeds without errors

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: integrate USPSection into home page"
```

---

## Verification Checklist

After all tasks complete, verify:

- [ ] USP section appears below PartnerLogos on home page
- [ ] Testimonial card displays with image, quote, and client info
- [ ] Flashlight effect works on cards 01 and 02 (desktop only)
- [ ] Dark stats card shows "100% Transparansi Total"
- [ ] Layout is responsive (single column on mobile, grid on desktop)
- [ ] Images load correctly or gracefully degrade
