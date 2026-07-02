# Property Management Admin Design

> Feature: F-010 | Date: 2026-07-03

## Overview

Admin dashboard for managing property inventory with CRUD operations, image upload to Vercel Blob, and photo section assignment. Uses existing static auth pattern.

## Architecture

### Page Structure

Single page at `/admin` with 3 tabs:

1. **Properties** — CRUD for property listings with inline photo management
2. **Hero** — Manage 3 hero photos (stacked cards animation)
3. **Stats** — Existing stats editor (migrated from `/admin/stats`)

### Tab Details

**Properties Tab:**
- List view showing all properties with status badges (available/sold/rented)
- Click property row to expand into edit mode
- Inline photo upload via drag & drop
- Toggle "Show in Showcase" per property
- Reorder properties for showcase display order

**Hero Tab:**
- Exactly 3 photos for the stacked Hero cards
- Position 1 = front card, Position 2 = middle, Position 3 = back
- Upload/replace photos individually

**Stats Tab:**
- Migrate existing `/admin/stats` functionality
- Edit value, suffix, label for each stat

## Database Schema

### properties

```sql
CREATE TABLE properties (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  price TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available', -- available | sold | rented
  show_in_showcase BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### property_photos

```sql
CREATE TABLE property_photos (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0
);
```

### hero_photos

```sql
CREATE TABLE hero_photos (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  url TEXT NOT NULL,
  alt TEXT NOT NULL DEFAULT '',
  position INTEGER NOT NULL UNIQUE -- 1, 2, or 3
);
```

## API Routes

### Properties

- `GET /api/admin/properties` — List all properties with photos
- `POST /api/admin/properties` — Create property
- `PUT /api/admin/properties/:id` — Update property
- `DELETE /api/admin/properties/:id` — Delete property (cascades to photos)

### Photos

- `POST /api/admin/photos/upload` — Upload to Vercel Blob, returns URL
- `POST /api/admin/properties/:id/photos` — Add photo to property
- `DELETE /api/admin/photos/:id` — Delete photo from property and blob

### Hero

- `GET /api/admin/hero` — Get all 3 hero photos
- `PUT /api/admin/hero/:position` — Update hero photo at position (1-3)

### Stats (existing)

- `GET /api/admin/stats` — Already exists
- `PUT /api/admin/stats` — Already exists

## Image Upload Flow

1. Admin drops image or clicks upload button
2. Client sends `multipart/form-data` to `/api/admin/photos/upload`
3. Server uploads to Vercel Blob via `@vercel/blob` package
4. Server returns `{ url: "https://..." }`
5. Client associates URL with property via separate API call

## Frontend Components

```
src/app/admin/page.tsx          — Main admin page with tabs
src/components/admin/
  ├── PropertiesTab.tsx         — Property list and editor
  ├── PropertyEditor.tsx        — Single property edit form
  ├── PhotoUploader.tsx         — Drag & drop upload component
  ├── HeroTab.tsx               — Hero photo management
  └── StatsTab.tsx              — Stats editor (migrated)
```

## Acceptance Criteria Mapping

| AC | Implementation |
|----|----------------|
| AC1 | Properties tab: Create form with name, location, price, status fields |
| AC2 | PhotoUploader component + `/api/admin/photos/upload` route |
| AC3 | Status dropdown in PropertyEditor (available/sold/rented) |
| AC4 | Hero tab: position-based photo assignment |
| AC5 | Properties tab: `showInShowcase` toggle + `displayOrder` reordering |
| AC6 | Already implemented — reuse existing auth from `/admin/stats` |

## Dependencies

- `@vercel/blob` — for image upload
- Existing: `jose`, `drizzle-orm`, `@neondatabase/serverless`

## Out of Scope

- OAuth authentication
- Multiple user accounts
- Role-based permissions
- Property detail pages (public-facing)
