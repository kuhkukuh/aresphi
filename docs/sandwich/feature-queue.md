# Feature Queue — Aresphi Property

**Generated:** 2026-06-29  
**Project:** Aresphi Property  
**Primary Goal:** Lead Generation  
**Design Style:** Elegant, warm, professional

---

## Priority 1 (Recommended)

### F-001: Project Setup & Infrastructure
- **Priority Score:** 40
- **Impact:** 10/10 | **Effort:** 3/10 | **Risk:** 2/10 | **Urgency:** 1.5x
- **Confidence:** stated
- **Module:** Infrastructure
- **Unblocks:** F-002, F-003, F-006, F-007, F-014
- **Source:** technical-notes.md L1-50

> Initialize Next.js 14+ with TypeScript, Tailwind CSS, Drizzle ORM, Neon database, and Clean Architecture structure.

---

### F-011: WhatsApp Integration
- **Priority Score:** 45
- **Impact:** 10/10 | **Effort:** 3/10 | **Risk:** 1/10 | **Urgency:** 1.5x
- **Confidence:** stated
- **Module:** Lead Generation
- **Unblocks:** F-008
- **Source:** prd.md L74-84

> PRIMARY GOAL: Pre-filled WhatsApp message with floating button. Direct conversion mechanism.

---

### F-014: Design System & Component Library
- **Priority Score:** 24
- **Impact:** 9/10 | **Effort:** 5/10 | **Risk:** 2/10 | **Urgency:** 1.5x
- **Confidence:** stated
- **Module:** Infrastructure
- **Depends on:** F-001
- **Unblocks:** F-006, F-007
- **Source:** technical-notes.md L20-200

> Typography (Playfair/Geist), color palette, UI components, Framer Motion animations, property card with glow effect.

---

### F-002: Database Schema & Migrations
- **Priority Score:** 24
- **Impact:** 9/10 | **Effort:** 4/10 | **Risk:** 3/10 | **Urgency:** 1.5x
- **Confidence:** stated
- **Module:** Infrastructure
- **Depends on:** F-001
- **Unblocks:** F-003, F-004, F-007, F-013
- **Source:** technical-notes.md L40-100

> Drizzle schema for properties, articles, admins. Migration scripts and seed data.

---

## Priority 2

### F-009: Services Page
- **Priority Score:** 27
- **Impact:** 6/10 | **Effort:** 2/10 | **Risk:** 1/10 | **Urgency:** 1.0x
- **Confidence:** stated
- **Module:** Layanan
- **Depends on:** F-001, F-014
- **Source:** prd.md L60-72

---

### F-010: Contact Page
- **Priority Score:** 22
- **Impact:** 5/10 | **Effort:** 2/10 | **Risk:** 1/10 | **Urgency:** 1.0x
- **Confidence:** inferred
- **Module:** Kontak
- **Depends on:** F-001
- **Source:** prd.md L85-97

---

### F-003: Admin Authentication
- **Priority Score:** 17
- **Impact:** 8/10 | **Effort:** 4/10 | **Risk:** 3/10 | **Urgency:** 1.2x
- **Confidence:** stated
- **Module:** Admin Dashboard
- **Depends on:** F-001, F-002
- **Unblocks:** F-004, F-005, F-013
- **Source:** prd.md L118-120

---

### F-006: Homepage - Company Profile
- **Priority Score:** 15
- **Impact:** 8/10 | **Effort:** 5/10 | **Risk:** 2/10 | **Urgency:** 1.2x
- **Confidence:** stated
- **Module:** Company Profile
- **Depends on:** F-001, F-014
- **Source:** prd.md L27-42

---

### F-015: SEO & ISG Setup
- **Priority Score:** 14
- **Impact:** 7/10 | **Effort:** 4/10 | **Risk:** 2/10 | **Urgency:** 1.0x
- **Confidence:** stated
- **Module:** SEO
- **Depends on:** F-001, F-002
- **Source:** prd.md L127-140

---

### F-007: Property Listing Catalog
- **Priority Score:** 16
- **Impact:** 9/10 | **Effort:** 5/10 | **Risk:** 3/10 | **Urgency:** 1.5x
- **Confidence:** stated
- **Module:** Katalog Properti
- **Depends on:** F-001, F-002, F-004, F-014
- **Unblocks:** F-008
- **Source:** prd.md L44-58

---

### F-008: Property Detail Page
- **Priority Score:** 16
- **Impact:** 9/10 | **Effort:** 5/10 | **Risk:** 3/10 | **Urgency:** 1.5x
- **Confidence:** stated
- **Module:** Katalog Properti
- **Depends on:** F-002, F-004, F-005, F-007, F-011
- **Source:** prd.md L49-56

---

## Priority 3 (Lower Priority)

### F-005: Image Upload with Compression
- **Priority Score:** 12
- **Impact:** 7/10 | **Effort:** 4/10 | **Risk:** 3/10 | **Urgency:** 1.0x
- **Confidence:** stated
- **Module:** Admin Dashboard
- **Depends on:** F-003, F-004
- **Source:** prd.md L124

---

### F-004: Admin Property CRUD with TipTap
- **Priority Score:** 11
- **Impact:** 9/10 | **Effort:** 6/10 | **Risk:** 4/10 | **Urgency:** 1.2x
- **Confidence:** stated
- **Module:** Admin Dashboard
- **Depends on:** F-002, F-003
- **Unblocks:** F-007, F-008
- **Source:** prd.md L121-123

---

### F-012: Blog List & Detail Pages
- **Priority Score:** 8
- **Impact:** 5/10 | **Effort:** 4/10 | **Risk:** 2/10 | **Urgency:** 0.8x
- **Confidence:** inferred
- **Module:** Blog
- **Depends on:** F-002, F-013
- **Source:** prd.md L99-109

---

### F-013: Admin Blog CRUD
- **Priority Score:** 6
- **Impact:** 6/10 | **Effort:** 5/10 | **Risk:** 3/10 | **Urgency:** 0.8x
- **Confidence:** inferred
- **Module:** Admin Dashboard
- **Depends on:** F-002, F-003
- **Unblocks:** F-012
- **Source:** prd.md L125

---

## Dependency Graph

```
F-001 (Setup)
├── F-014 (Design System) ──┬─ F-006 (Homepage)
│                           └─ F-007 (Catalog) ─── F-008 (Detail)
├── F-002 (Database) ─┬─ F-003 (Auth) ─┬─ F-004 (Property CRUD) ─── F-005 (Image Upload)
│                     │                 └─ F-013 (Blog CRUD) ─────── F-012 (Blog Pages)
│                     └─ F-015 (SEO)
├── F-011 (WhatsApp) ────── F-008 (Detail)
├── F-009 (Services)
└── F-010 (Contact)
```

---

## Design Reference Summary

| Design | Style | Key Patterns Applied |
|--------|-------|---------------------|
| design-1 (Aura) | Luxury furniture | Serif+sans fonts, flashlight card glow, hero split |
| design-2 (ArchDigest) | Architecture | Dark/light contrast, carousel, grid/list toggle |
| design-3 (Serene) | Wellness | Bento grid, testimonial slider, animated counters |
| design-4 (Museum) | Cultural | Floating cards, newsletter section, pricing tiers |

---

## Validation

| Metric | Value |
|--------|-------|
| Total Features | 15 |
| Average Confidence | 0.87 |
| Stated Features | 13 |
| Inferred Features | 2 |
| Assumed Features | 0 |

---

## Recommendation

**Start with F-001 (Project Setup).** All features depend on this foundation. Low effort (3), low risk (2), unblocks 5 critical features.

**Then F-011 (WhatsApp Integration) in parallel with F-014 (Design System).**
- F-011 is the **primary business goal** with maximum impact (10) and minimal effort (3).
- F-014 enables all UI-heavy features (Homepage, Catalog).

**Then F-002 (Database) + F-003 (Auth).** Enables admin panel for content management.

---

## Reconciliation Log

**Mode:** reconcile (brief changed)

| Action | Count |
|--------|-------|
| Added | 2 (F-014, F-015) |
| Removed | 0 |
| Reconciled | 13 |
| Needs Reanalysis | 0 |

**Brief hashes updated:** All 4 artifacts changed (design direction + technical implementation details added)
