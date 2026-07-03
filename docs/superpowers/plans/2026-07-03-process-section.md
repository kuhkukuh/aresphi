# Process Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the 3-step client journey section with staggered cards, sticky heading, and entrance animations.

**Architecture:** Two-column layout with sticky heading on left, staggered step cards on right. GSAP ScrollTrigger for staggered entrance animation. Client component with reduced-motion support.

**Tech Stack:** React, TypeScript, Tailwind CSS, GSAP, @gsap/react

---

## File Structure

| File | Purpose |
|------|---------|
| `src/components/ProcessSection.tsx` | Main component (create) |
| `src/app/page.tsx` | Import and render component (modify) |

---

### Task 1: Create ProcessSection Component Structure

**Files:**
- Create: `src/components/ProcessSection.tsx`

- [ ] **Step 1: Create component file with base structure**

```tsx
"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const steps = [
  {
    number: "01",
    title: "Konsultasi Awal",
    description: "Memahami visi dan kebutuhan Anda melalui sesi mendalam.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
    alt: "Konsultasi Awal",
  },
  {
    number: "02",
    title: "Kurasi Properti",
    description: "Menyajikan properti sesuai kriteria dari jaringan kami.",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80",
    alt: "Kurasi Properti",
  },
  {
    number: "03",
    title: "Pendampingan Transaksi",
    description: "Mendampingi setiap langkah hingga kunci di tangan.",
    image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600&q=80",
    alt: "Pendampingan Transaksi",
  },
];

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useGSAP(
    () => {
      if (prefersReducedMotion) return;
      if (!sectionRef.current) return;

      const validCards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
      if (validCards.length === 0) return;

      // Initial state
      gsap.set(validCards, { y: 40, opacity: 0 });

      // Staggered entrance animation
      gsap.to(validCards, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="layanan"
      className="py-32 px-6 md:px-12"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left Column - Sticky Heading */}
          <div className="flex flex-col justify-center sticky top-32 h-fit">
            <div className="eyebrow">
              <span className="eyebrow-left">/ 03 Proses Kami</span>
              <span className="eyebrow-right">[ 03 ]</span>
            </div>
            <h2
              className="mt-8 text-4xl font-medium leading-[1.02] sm:text-5xl md:text-6xl lg:text-[4.6rem] text-stone-900 mb-8"
              style={{ letterSpacing: "-0.055em" }}
            >
              Perjalanan
              <br />
              <span className="font-playfair italic font-normal text-stone-500/80">
                properti Anda
              </span>
            </h2>
            <a
              href="#kontak"
              className="inline-flex items-center gap-2 border border-stone-300 rounded-full px-6 py-3 w-max hover:bg-stone-900 hover:text-white transition-colors text-base font-medium"
            >
              Mulai Proses
            </a>
          </div>

          {/* Right Column - Staggered Cards */}
          <div className="relative w-full">
            {/* Decorative SVG */}
            <svg
              className="absolute inset-0 w-full h-full -z-10 pointer-events-none"
              preserveAspectRatio="none"
            >
              <path
                d="M 50,0 C 100,200 -50,400 150,800"
                stroke="#f97316"
                strokeWidth="2"
                fill="none"
                opacity="0.3"
              />
            </svg>

            <div className="grid gap-12 md:gap-16 relative z-10">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  ref={(el) => {
                    cardsRef.current[index] = el;
                  }}
                  className={`bg-white rounded-3xl p-6 shadow-sm border border-stone-100 w-[85%] md:w-[70%] group hover:shadow-lg transition-shadow ${
                    index % 2 === 0 ? "ml-auto" : ""
                  }`}
                  style={{ opacity: prefersReducedMotion ? 1 : 0 }}
                >
                  <div className="text-orange font-medium mb-4 text-lg">
                    {step.number}
                  </div>
                  <div className="w-full h-40 rounded-2xl overflow-hidden mb-6">
                    <img
                      src={step.image}
                      alt={step.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.style.visibility = "hidden";
                      }}
                    />
                  </div>
                  <h3 className="font-playfair text-4xl italic">{step.title}</h3>
                  <p className="text-stone-500">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify component compiles**

Run: `npx tsc --noEmit`
Expected: No errors

---

### Task 2: Integrate ProcessSection into Page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add import and render ProcessSection**

```tsx
import Hero from "@/components/Hero";
import PartnerLogos from "@/components/PartnerLogos";
import USPSection from "@/components/USPSection";
import ProcessSection from "@/components/ProcessSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <PartnerLogos />
      <USPSection />
      <ProcessSection />
      <Footer />
    </main>
  );
}
```

- [ ] **Step 2: Verify build succeeds**

Run: `npm run build`
Expected: Build successful without errors

---

### Task 3: Verify Acceptance Criteria

- [ ] **Step 1: Start dev server and visually verify**

Run: `npm run dev`

Verify:
- AC1: 3 step cards in staggered layout (alternating right/left alignment)
- AC2: Each step has number (orange), title (Playfair italic), description (stone-500)
- AC3: Sticky heading with "Mulai Proses" CTA visible on desktop
- AC4: Staggered entrance animation when scrolling into view

- [ ] **Step 2: Test reduced motion**

1. Open browser DevTools
2. Open Rendering panel
3. Enable "Emulate CSS media feature: prefers-reduced-motion: reduce"
4. Reload page
5. Verify: Cards appear immediately without animation

- [ ] **Step 3: Test responsive behavior**

1. Resize browser to mobile width (<1024px)
2. Verify: Single column layout
3. Verify: Heading not sticky on mobile
4. Verify: Cards full width

---

### Task 4: Commit Changes

- [ ] **Step 1: Stage and commit**

```bash
git add src/components/ProcessSection.tsx src/app/page.tsx docs/superpowers/specs/2026-07-03-process-section-design.md
git commit -m "feat: add ProcessSection component with staggered cards and sticky heading (F-005)"
```
