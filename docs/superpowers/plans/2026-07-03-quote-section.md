# Quote Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-width quote section with centered text, background image, and dark scrim overlay.

**Architecture:** Single React component with TypeScript props. Renders a static visual section matching the preview design exactly. Placed between PropertyShowcase and Footer.

**Tech Stack:** React, TypeScript, Tailwind CSS, Next.js

---

### Task 1: Create QuoteSection Component

**Files:**
- Create: `src/components/QuoteSection.tsx`

- [ ] **Step 1: Create the component with props interface**

```tsx
export type QuoteSectionProps = {
  image: string;
  quoteText: string;
  quoteEmphasis: string;
  authorName: string;
  authorTitle: string;
};

const defaultProps: QuoteSectionProps = {
  image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1800&q=80",
  quoteText: "We believe a home isn't just a transaction —",
  quoteEmphasis: "it's a life-changing experience.",
  authorName: "Ahmad Wijaya",
  authorTitle: "FOUNDING PARTNER",
};

export default function QuoteSection(props: Partial<QuoteSectionProps> = {}) {
  const { image, quoteText, quoteEmphasis, authorName, authorTitle } = {
    ...defaultProps,
    ...props,
  };

  return (
    <section className="relative h-[80vh] overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt="Property"
          className="w-full h-full object-cover bg-stone-800"
          onError={(e) => {
            e.currentTarget.style.visibility = "hidden";
          }}
        />
      </div>

      {/* Dark Scrim Overlay */}
      <div className="absolute inset-0 bg-stone-900/55" />

      {/* Quote Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <p className="text-2xl sm:text-3xl md:text-4xl leading-snug font-medium tracking-tight text-white">
          {quoteText}{" "}
          <span className="text-white/40">{quoteEmphasis}</span>
        </p>
        <p className="text-sm font-medium mt-8 text-white">{authorName}</p>
        <p className="text-xs tracking-[0.2em] text-white/40 mt-1">{authorTitle}</p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit the component**

```bash
git add src/components/QuoteSection.tsx
git commit -m "feat: add QuoteSection component"
```

---

### Task 2: Integrate QuoteSection into Home Page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Import QuoteSection and add to page layout**

Update imports and add QuoteSection between PropertyShowcase and Footer:

```tsx
import Hero from "@/components/Hero";
import PartnerLogos from "@/components/PartnerLogos";
import USPSection from "@/components/USPSection";
import StatsSection from "@/components/StatsSection";
import ProcessSection from "@/components/ProcessSection";
import PropertyShowcase from "@/components/PropertyShowcase";
import QuoteSection from "@/components/QuoteSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <PartnerLogos />
      <USPSection />
      <StatsSection />
      <ProcessSection />
      <PropertyShowcase />
      <QuoteSection />
      <Footer />
    </main>
  );
}
```

- [ ] **Step 2: Verify the dev server builds without errors**

```bash
npm run dev
```

Expected: Server starts without compilation errors, QuoteSection renders below PropertyShowcase.

- [ ] **Step 3: Commit the integration**

```bash
git add src/app/page.tsx
git commit -m "feat: integrate QuoteSection into home page"
```

---

## Acceptance Criteria Verification

After implementation:

- **AC1** — Full-width background image covers entire section viewport
  - Verify: `h-[80vh]` with `absolute inset-0` image

- **AC2** — Quote text centered and readable with overlay scrim
  - Verify: `flex items-center justify-center`, `bg-stone-900/55` scrim

- **AC3** — Text responsive on mobile and desktop
  - Verify: `text-2xl sm:text-3xl md:text-4xl` responsive sizing works at 375px and 1440px viewports
