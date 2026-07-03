# Mobile Navigation Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor navigation to separate mobile/desktop with an expanding floating pill pattern for mobile.

**Architecture:** Split Navigation.tsx into orchestration layer + DesktopNav + MobileNav. Mobile nav expands the floating container downward with spring animations instead of a side drawer.

**Tech Stack:** React, Framer Motion, Tailwind CSS

---

## File Structure

```
src/components/
├── Navigation.tsx      # Orchestrator (scroll state, section observer)
├── DesktopNav.tsx      # Desktop nav links + button (presentational)
└── MobileNav.tsx       # Mobile expanding nav (client, animations)
```

---

### Task 1: Create shared navigation configuration

**Files:**
- Create: `src/components/Navigation.tsx` (modify existing, extract config)

- [ ] **Step 1: Extract navLinks and navStyles to top of Navigation.tsx**

At the top of `Navigation.tsx`, before the component, add the shared configuration:

```typescript
const navLinks = [
  { href: "#tentang", label: "Tentang", id: "tentang" },
  { href: "#layanan", label: "Layanan", id: "layanan" },
  { href: "#properti", label: "Properti", id: "properti" },
  { href: "#kontak", label: "Kontak", id: "kontak" },
];

const navStyles = {
  container: {
    base: "fixed left-1/2 top-5 z-[100] flex items-center",
    floating: "border border-white/10 bg-black/50 backdrop-blur-2xl",
    shadow: "shadow-[0_24px_90px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.16)]",
  },
  link: {
    base: "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
    inactive: "text-white/80 hover:bg-white/10 hover:text-white",
    active: "text-black",
  },
  button: {
    primary: "rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] transition-all duration-300 hover:border-white/40 hover:bg-white/20",
  },
};
```

The `navLinks` array already exists - just ensure it's at module level for sharing. The `navStyles` object is new.

- [ ] **Step 2: Verify the file still works**

Run: `npm run build`
Expected: Build succeeds with no errors

---

### Task 2: Create DesktopNav component

**Files:**
- Create: `src/components/DesktopNav.tsx`

- [ ] **Step 1: Create DesktopNav.tsx with nav links and button**

```typescript
"use client";

import { motion } from "framer-motion";
import { navLinks, navStyles } from "./Navigation";

interface DesktopNavProps {
  activeSection: string | null;
}

export default function DesktopNav({ activeSection }: DesktopNavProps) {
  return (
    <>
      {/* Desktop Links Container */}
      <div
        className="absolute left-1/2 -translate-x-1/2 hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-2 py-2 md:flex"
        aria-label="Primary links"
      >
        {navLinks.map((link) => {
          const isActive = activeSection === link.id;
          return (
            <a
              key={link.href}
              href={link.href}
              className={`${navStyles.link.base} ${
                isActive ? navStyles.link.active : navStyles.link.inactive
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="nav-active-pill"
                  className="absolute inset-0 rounded-full bg-white"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative">{link.label}</span>
            </a>
          );
        })}
      </div>

      {/* Hubungi Kami Button */}
      <a
        href="#kontak"
        className={`ml-auto hidden md:inline-flex ${navStyles.button.primary}`}
      >
        Hubungi Kami
      </a>
    </>
  );
}
```

- [ ] **Step 2: Verify build succeeds**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/components/DesktopNav.tsx
git commit -m "feat: add DesktopNav component"
```

---

### Task 3: Create MobileNav component

**Files:**
- Create: `src/components/MobileNav.tsx`

- [ ] **Step 1: Create MobileNav.tsx with expanding floating pill**

```typescript
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks, navStyles } from "./Navigation";

interface MobileNavProps {
  activeSection: string | null;
}

export default function MobileNav({ activeSection }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close menu when clicking a link
  const handleLinkClick = () => setIsOpen(false);

  // Animation variants
  const containerVariants = {
    collapsed: {
      borderRadius: 9999,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    expanded: {
      borderRadius: 24,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  const menuVariants = {
    collapsed: {
      height: 0,
      opacity: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    expanded: {
      height: "auto",
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30, staggerChildren: 0.05, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    collapsed: { opacity: 0, y: -10 },
    expanded: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
  };

  return (
    <div className="md:hidden">
      {/* Floating Pill Container */}
      <motion.div
        className={`${navStyles.container.floating} ${navStyles.container.shadow} overflow-hidden`}
        variants={containerVariants}
        initial="collapsed"
        animate={isOpen ? "expanded" : "collapsed"}
      >
        {/* Header Row - Always Visible */}
        <div className="flex w-full items-center justify-between px-4 py-3">
          {/* Logo */}
          <a href="#" className="font-playfair text-2xl italic tracking-tight text-white">
            Aresphi<span className="text-orange">®</span>
          </a>

          {/* Hamburger / Close Button */}
          <button
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-xl"
            type="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            )}
          </button>
        </div>

        {/* Expandable Menu Content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={menuVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              className="overflow-hidden"
            >
              <motion.div className="flex flex-col gap-1 px-4 pb-4">
                {/* Nav Links */}
                {navLinks.map((link) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    variants={itemVariants}
                    className={`py-3 text-lg font-medium transition-colors ${
                      activeSection === link.id ? "text-orange" : "text-white"
                    }`}
                    onClick={handleLinkClick}
                  >
                    {link.label}
                  </motion.a>
                ))}

                {/* Hubungi Kami Button */}
                <motion.a
                  href="#kontak"
                  variants={itemVariants}
                  className={`mt-2 inline-flex justify-center ${navStyles.button.primary}`}
                  onClick={handleLinkClick}
                >
                  Hubungi Kami
                </motion.a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Overlay when expanded */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[-1] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Verify build succeeds**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/components/MobileNav.tsx
git commit -m "feat: add MobileNav component with expanding floating pill"
```

---

### Task 4: Refactor Navigation.tsx to orchestrate both components

**Files:**
- Modify: `src/components/Navigation.tsx`

- [ ] **Step 1: Replace the existing Navigation.tsx with the orchestrated version**

```typescript
"use client";

import { useState, useEffect } from "react";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

const navLinks = [
  { href: "#tentang", label: "Tentang", id: "tentang" },
  { href: "#layanan", label: "Layanan", id: "layanan" },
  { href: "#properti", label: "Properti", id: "properti" },
  { href: "#kontak", label: "Kontak", id: "kontak" },
];

const navStyles = {
  container: {
    base: "fixed left-1/2 top-5 z-[100] flex items-center",
    floating: "border border-white/10 bg-black/50 backdrop-blur-2xl",
    shadow: "shadow-[0_24px_90px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.16)]",
  },
  link: {
    base: "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
    inactive: "text-white/80 hover:bg-white/10 hover:text-white",
    active: "text-black",
  },
  button: {
    primary: "rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] transition-all duration-300 hover:border-white/40 hover:bg-white/20",
  },
};

export { navLinks, navStyles };

export default function Navigation() {
  const [isReady, setIsReady] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Animation state management
  useEffect(() => {
    const readyTimer = setTimeout(() => setIsReady(true), 100);

    const handleScroll = () => {
      setHasScrolled(window.scrollY > 2000);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(readyTimer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Track active section
  useEffect(() => {
    const sections = navLinks
      .map((link) => document.getElementById(link.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Mobile Navigation */}
      <div
        className="md:hidden"
        style={{
          position: "fixed",
          left: "50%",
          top: 20,
          zIndex: 100,
          width: "calc(100% - 32px)",
          transform: isReady ? "translate(-50%, 0)" : "translate(-50%, -20px)",
          opacity: isReady ? 1 : 0,
          transition: isReady ? "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease" : "none",
        }}
      >
        <MobileNav activeSection={activeSection} />
      </div>

      {/* Desktop Navigation */}
      <nav
        className={`${navStyles.container.base} ${navStyles.container.floating} ${navStyles.container.shadow} w-[calc(100%-32px)] px-4 py-3 sm:px-5 md:px-6 ${
          isReady ? "opacity-100" : "opacity-0"
        } ${hasScrolled ? "max-w-[1152px]" : "max-w-[800px]"} hidden md:flex`}
        style={{
          transition: isReady
            ? "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease, max-width 0.4s ease"
            : "none",
          transform: isReady ? "translate(-50%, 0) scale(1)" : "translate(-50%, -20px) scale(0.96)",
        }}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <a href="#" className="group flex items-center gap-3 text-white" aria-label="Aresphi home">
          <span className="font-playfair text-2xl italic tracking-tight">
            Aresphi<span className="text-orange">®</span>
          </span>
        </a>

        <DesktopNav activeSection={activeSection} />
      </nav>
    </>
  );
}
```

- [ ] **Step 2: Verify build succeeds**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Test in browser**

Run: `npm run dev`
Expected:
- Desktop: Shows floating nav with centered links, expands width after scrolling
- Mobile: Shows floating pill with hamburger, expands downward on tap

- [ ] **Step 4: Commit**

```bash
git add src/components/Navigation.tsx
git commit -m "refactor: Navigation orchestrates separate MobileNav and DesktopNav"
```

---

### Task 5: Final verification and cleanup

- [ ] **Step 1: Run full build and type check**

Run: `npm run build`
Expected: No errors, build succeeds

- [ ] **Step 2: Test responsive behavior**

Test manually:
1. Desktop view (≥768px): Shows desktop nav, no hamburger
2. Mobile view (<768px): Shows mobile nav with hamburger
3. Mobile expanded: Pill expands downward with rounded corners
4. Animation: Smooth spring-based expansion

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete mobile navigation expansion refactor"
```
