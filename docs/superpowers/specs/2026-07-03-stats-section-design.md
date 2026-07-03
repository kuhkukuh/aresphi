# Stats Section Design

## Overview
Full-width dark background section displaying company achievements (150+ Properti Terjual, 200+ Klien Puas, 5+ Tahun Pengalaman, 98% Keberhasilan) with admin CRUD capability.

## Architecture

### Component Structure
```
src/
├── components/
│   └── StatsSection.tsx        # Dark stats section, matches preview exactly
├── app/
│   ├── admin/
│   │   └── stats/
│   │       └── page.tsx        # Admin CRUD page for stats
│   └── api/
│       └── admin/
│           └── stats/
│               └── route.ts    # GET/PUT stats API
└── infrastructure/
    └── database/
        └── schema.ts           # Drizzle schema including stats table
```

### Data Model
```typescript
// stats table
{
  id: integer (primary key)
  key: text (unique) - "properties_sold", "happy_clients", "years_experience", "success_rate"
  value: integer - the numeric value (150, 200, 5, 98)
  suffix: text - the display suffix ("+", "+", "+", "%")
  label: text - Indonesian label ("Properti Terjual", "Klien Puas", etc.)
  display_order: integer - for ordering (1, 2, 3, 4)
}
```

### API Design
- `GET /api/admin/stats` - Returns all stats ordered by display_order
- `PUT /api/admin/stats` - Update all stats (requires auth)
- Auth: Compare `Authorization: Bearer <token>` against `ADMIN_TOKEN` env var

### Admin Page
- Simple form at `/admin/stats` with 4 stat inputs
- Login via `ADMIN_USERNAME` and `ADMIN_PASSWORD` env vars
- Session via signed cookie (not JWT, keep it simple)

## Component Design

### StatsSection.tsx
Matches preview HTML exactly:
- Section: `bg-stone-850 py-32 overflow-hidden relative`
- Watermark: "STATS" at 18vw, white, 0.03 opacity
- Gradient overlay: `from-amber/10 to-transparent blur-3xl`
- Header: Eyebrow "/ 02 Pencapaian", title "Angka Berbicara" with italic Playfair
- Stats grid: `grid sm:grid-cols-2 lg:grid-cols-4 gap-12`
- Each stat: Large number (5xl/7xl), orange suffix, uppercase label

### Data Flow
1. StatsSection fetches from `/api/admin/stats` (public GET)
2. Admin page fetches same, renders editable form
3. Form submits to `PUT /api/admin/stats` with auth token
4. Database updated, page revalidates

## Error Handling
- If stats fetch fails, show hardcoded fallback values
- Admin auth failure returns 401
- Invalid input returns 400 with error message

## Testing Considerations
- Verify stats display matches preview design
- Test admin CRUD flow
- Test auth rejection without valid token
- Test fallback when API unavailable
