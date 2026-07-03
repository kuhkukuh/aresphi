# Catalog & Detail Pages Design

## Overview

Implement property catalog and detail pages with ISR for SEO, using exact designs from `aresphi-catalog.html` and `aresphi-detail.html`.

---

## 1. Database Changes

### Schema Update

Add `slug` column to `properties` table:

```sql
ALTER TABLE properties ADD COLUMN slug TEXT UNIQUE NOT NULL;
```

### Migration Strategy

- Generate migration via `npm run db:generate`
- Existing properties need slugs populated (run seed or manual update)
- Slug format: lowercase, spaces → dashes, remove special chars

---

## 2. Catalog Page (`/properti`)

### Route Structure

```
src/app/(main)/properti/
  page.tsx              # Server component, ISR
  PropertyFilters.tsx   # Client component for filter UI
  PropertyList.tsx      # Server component for property rows
```

### ISR Configuration

```tsx
export const revalidate = 60; // Regenerate every 60 seconds
```

### URL-Based Filtering (SEO-Friendly)

- `/properti` - all properties
- `/properti?tipe=rumah` - filter by type
- `/properti?lokasi=jakarta-selatan` - filter by location
- `/properti?tipe=rumah&lokasi=bandung` - combined filters

### Filter Behavior

- **Property Type**: checkboxes (multi-select)
  - Options: Rumah, Apartemen, Villa, Ruko
- **Location**: checkboxes (multi-select)
  - Options: populated dynamically from distinct DB values
- Filters update URL query params
- Server re-renders with filtered data

### UI (Matches `aresphi-catalog.html` Exactly)

- Header with eyebrow + title
- Filter sidebar (sticky on desktop)
- Property rows with:
  - Image left (38% width, 4:3 aspect)
  - Info right (name, price, location, areas, description)
  - Hover: grayscale → color, slight scale
- "Muat Lebih Banyak" button (placeholder for pagination)
- Footer (reuse existing Footer component)

### Data Query

```tsx
async function getProperties(filters: { types?: string[], locations?: string[] }) {
  // Query properties with optional type/location filters
  // Join with property_photos for first image
  // Order by displayOrder
}
```

---

## 3. Detail Page (`/properti/[slug]`)

### Route Structure

```
src/app/(main)/properti/[slug]/
  page.tsx           # Server component, ISR + static params
  GalleryClient.tsx  # Client component for lightbox
```

### ISR Configuration

```tsx
export const revalidate = 60;

export async function generateStaticParams() {
  const props = await db.select({ slug: properties.slug }).from(properties);
  return props.map((p) => ({ slug: p.slug }));
}
// fallback: 'blocking' for new properties
```

### UI (Matches `aresphi-detail.html` Exactly)

**Breadcrumb:**
- Properti — [Type] — [Name]

**Gallery:**
- Hero image (16:9 / 21:9 aspect)
- Thumbnail strip (scrollable)
- Lightbox on click with prev/next navigation

**Main Info:**
- Name (Playfair italic)
- Location with map-pin icon
- Price (orange highlight)

**Specs Grid:**
- Luas Tanah
- Luas Bangunan
- Tipe Properti

**Description:**
- Eyebrow header
- Full description text

**Location Section:**
- Placeholder map with pin icon
- Address overlay

**Contact Card (sticky sidebar):**
- "Tertarik dengan properti ini?"
- WhatsApp link
- Phone/email links

**Similar Properties:**
- Horizontal scroll carousel
- Same property type, different ID
- Limit 3

### Data Query

```tsx
async function getPropertyBySlug(slug: string) {
  // Query property by slug
  // Query all photos for property
  // Return null if not found (404)
}

async function getSimilarProperties(propertyId: number, type: string) {
  // Query properties with same type, different ID
  // Limit 3
}
```

---

## 4. Admin Property Form Update

### Location

`src/components/admin/PropertiesTab.tsx`

### Slug Field

**UI:**
- Add below name field
- Label: "Slug (URL)"
- Helper text: "URL-friendly identifier for this property"

**Behavior:**
- Auto-generate from name as user types
- Transform: lowercase, spaces → dashes, remove special chars
- Allow manual editing
- Validate uniqueness on blur
- Show error if duplicate slug exists

**Example:**
- Name: "Rumah Modern Pondok Indah"
- Auto-slug: `rumah-modern-pondok-indah`

### API Update

- `POST /api/admin/properties` - include slug in body, validate uniqueness
- `PUT /api/admin/properties/[id]` - include slug in body, validate uniqueness (excluding current ID)

---

## 5. Implementation Order

1. **Database migration** - add slug column
2. **Update schema.ts** - add slug field to drizzle schema
3. **Update seed.ts** - generate slugs for seed data
4. **Run migration** - apply to database
5. **Update admin API** - handle slug CRUD
6. **Update PropertiesTab** - add slug field UI
7. **Create catalog page** - `/properti` with filters
8. **Create detail page** - `/properti/[slug]` with gallery
9. **Update Navigation** - "Properti" link points to `/properti`
10. **Test SEO** - verify meta tags, ISR regeneration

---

## 6. Files to Create/Modify

### New Files

- `src/app/(main)/properti/page.tsx`
- `src/app/(main)/properti/PropertyFilters.tsx`
- `src/app/(main)/properti/PropertyList.tsx`
- `src/app/(main)/properti/[slug]/page.tsx`
- `src/app/(main)/properti/[slug]/GalleryClient.tsx`

### Modified Files

- `src/infrastructure/database/schema.ts` - add slug
- `src/infrastructure/database/seed.ts` - generate slugs
- `src/components/admin/PropertiesTab.tsx` - add slug field
- `src/app/api/admin/properties/route.ts` - handle slug
- `src/app/api/admin/properties/[id]/route.ts` - handle slug
- `src/components/Navigation.tsx` - update "Properti" link

---

## 7. Edge Cases

- **Slug collision**: Return validation error, prevent save
- **Missing slug (old data)**: Generate from name on read, or migration script
- **Invalid slug format**: Sanitize on save
- **Property not found**: Show 404 page
- **No similar properties**: Hide section or show message
