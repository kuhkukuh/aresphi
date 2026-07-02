# Property Management Admin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build admin dashboard for managing property listings with photo uploads and section assignment.

**Architecture:** Single-page admin with 3 tabs (Properties, Hero, Stats). Properties have inline photo management. Hero photos are managed separately. Uses existing auth pattern.

**Tech Stack:** Next.js 16, Drizzle ORM, Vercel Blob, TypeScript

---

## File Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── page.tsx                    — Main admin page with tabs
│   │   └── stats/
│   │       └── page.tsx                — DELETE (migrate to tab)
│   ├── api/
│   │   └── admin/
│   │       ├── properties/
│   │       │   ├── route.ts            — GET list, POST create
│   │       │   └── [id]/
│   │       │       └── route.ts        — PUT update, DELETE
│   │       ├── photos/
│   │       │   └── route.ts            — POST upload to Vercel Blob
│   │       └── hero/
│   │           └── route.ts            — GET/PUT hero photos
│   └── page.tsx                        — MODIFY: fetch from API
├── components/
│   ├── admin/
│   │   ├── PropertiesTab.tsx           — Property list/editor
│   │   ├── PropertyEditor.tsx          — Single property form
│   │   ├── PhotoUploader.tsx           — Drag & drop upload
│   │   ├── HeroTab.tsx                 — Hero photo management
│   │   └── StatsTab.tsx                — Stats editor (migrated)
│   ├── Hero.tsx                        — MODIFY: fetch from API
│   └── PropertyShowcase.tsx            — MODIFY: fetch from API
├── infrastructure/
│   └── database/
│       └── schema.ts                   — MODIFY: add tables
└── lib/
    └── auth.ts                         — Existing (reuse)
```

---

## Task 1: Database Schema

**Files:**
- Modify: `src/infrastructure/database/schema.ts`

- [ ] **Step 1: Add properties table to schema**

```typescript
// Add to src/infrastructure/database/schema.ts

export const properties = pgTable('properties', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
  location: text('location').notNull(),
  price: text('price').notNull(),
  status: text('status', { enum: ['available', 'sold', 'rented'] }).notNull().default('available'),
  showInShowcase: integer('show_in_showcase', { mode: 'boolean' }).notNull().default(false),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().defaultNow(),
});

export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;
```

- [ ] **Step 2: Add property_photos table to schema**

```typescript
// Add to src/infrastructure/database/schema.ts

export const propertyPhotos = pgTable('property_photos', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  propertyId: integer('property_id').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  alt: text('alt').notNull().default(''),
  displayOrder: integer('display_order').notNull().default(0),
});

export type PropertyPhoto = typeof propertyPhotos.$inferSelect;
export type NewPropertyPhoto = typeof propertyPhotos.$inferInsert;
```

- [ ] **Step 3: Add hero_photos table to schema**

```typescript
// Add to src/infrastructure/database/schema.ts

export const heroPhotos = pgTable('hero_photos', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  url: text('url').notNull(),
  alt: text('alt').notNull().default(''),
  position: integer('position').notNull().unique(), // 1, 2, or 3
});

export type HeroPhoto = typeof heroPhotos.$inferSelect;
export type NewHeroPhoto = typeof heroPhotos.$inferInsert;
```

- [ ] **Step 4: Generate and push migration**

Run:
```bash
npm run db:generate
npm run db:push
```

Expected: Migration files created, tables created in database

- [ ] **Step 5: Commit**

```bash
git add src/infrastructure/database/schema.ts drizzle/
git commit -m "feat(db): add properties, property_photos, hero_photos tables"
```

---

## Task 2: Properties API - List and Create

**Files:**
- Create: `src/app/api/admin/properties/route.ts`

- [ ] **Step 1: Create GET handler for listing properties**

```typescript
// src/app/api/admin/properties/route.ts

import { NextResponse } from 'next/server';
import { db } from '@/infrastructure/database';
import { properties, propertyPhotos } from '@/infrastructure/database/schema';
import { getAdminSession } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function GET() {
  const isAuth = await getAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const allProperties = await db
    .select()
    .from(properties)
    .orderBy(properties.displayOrder);

  // Get photos for each property
  const propertiesWithPhotos = await Promise.all(
    allProperties.map(async (property) => {
      const photos = await db
        .select()
        .from(propertyPhotos)
        .where(eq(propertyPhotos.propertyId, property.id))
        .orderBy(propertyPhotos.displayOrder);
      return { ...property, photos };
    })
  );

  return NextResponse.json(propertiesWithPhotos);
}
```

- [ ] **Step 2: Create POST handler for creating property**

```typescript
// Add to src/app/api/admin/properties/route.ts

export async function POST(request: Request) {
  const isAuth = await getAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, location, price, status, showInShowcase } = body;

    if (!name || !location || !price) {
      return NextResponse.json(
        { error: 'Name, location, and price are required' },
        { status: 400 }
      );
    }

    const [property] = await db
      .insert(properties)
      .values({
        name,
        location,
        price,
        status: status || 'available',
        showInShowcase: showInShowcase || false,
      })
      .returning();

    return NextResponse.json({ ...property, photos: [] }, { status: 201 });
  } catch (error) {
    console.error('Create property error:', error);
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/admin/properties/route.ts
git commit -m "feat(api): add GET/POST /api/admin/properties"
```

---

## Task 3: Properties API - Update and Delete

**Files:**
- Create: `src/app/api/admin/properties/[id]/route.ts`

- [ ] **Step 1: Create PUT handler for updating property**

```typescript
// src/app/api/admin/properties/[id]/route.ts

import { NextResponse } from 'next/server';
import { db } from '@/infrastructure/database';
import { properties, propertyPhotos } from '@/infrastructure/database/schema';
import { getAdminSession } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await getAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { name, location, price, status, showInShowcase, displayOrder } = body;

    const [updated] = await db
      .update(properties)
      .set({
        ...(name !== undefined && { name }),
        ...(location !== undefined && { location }),
        ...(price !== undefined && { price }),
        ...(status !== undefined && { status }),
        ...(showInShowcase !== undefined && { showInShowcase }),
        ...(displayOrder !== undefined && { displayOrder }),
        updatedAt: new Date(),
      })
      .where(eq(properties.id, parseInt(id)))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    const photos = await db
      .select()
      .from(propertyPhotos)
      .where(eq(propertyPhotos.propertyId, updated.id))
      .orderBy(propertyPhotos.displayOrder);

    return NextResponse.json({ ...updated, photos });
  } catch (error) {
    console.error('Update property error:', error);
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 });
  }
}
```

- [ ] **Step 2: Create DELETE handler for deleting property**

```typescript
// Add to src/app/api/admin/properties/[id]/route.ts

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await getAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    const [deleted] = await db
      .delete(properties)
      .where(eq(properties.id, parseInt(id)))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete property error:', error);
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/admin/properties/[id]/route.ts
git commit -m "feat(api): add PUT/DELETE /api/admin/properties/[id]"
```

---

## Task 4: Photo Upload API

**Files:**
- Create: `src/app/api/admin/photos/route.ts`

- [ ] **Step 1: Install Vercel Blob package**

Run:
```bash
npm install @vercel/blob
```

- [ ] **Step 2: Create POST handler for photo upload**

```typescript
// src/app/api/admin/photos/route.ts

import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getAdminSession } from '@/lib/auth';

export async function POST(request: Request) {
  const isAuth = await getAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob
    const blob = await put(`properties/${Date.now()}-${file.name}`, file, {
      access: 'public',
    });

    return NextResponse.json({ url: blob.url }, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json src/app/api/admin/photos/route.ts
git commit -m "feat(api): add photo upload to Vercel Blob"
```

---

## Task 5: Property Photos API

**Files:**
- Modify: `src/app/api/admin/properties/[id]/route.ts`
- Create: `src/app/api/admin/properties/[id]/photos/route.ts`
- Create: `src/app/api/admin/photos/[id]/route.ts`

- [ ] **Step 1: Create POST handler to add photo to property**

```typescript
// src/app/api/admin/properties/[id]/photos/route.ts

import { NextResponse } from 'next/server';
import { db } from '@/infrastructure/database';
import { propertyPhotos } from '@/infrastructure/database/schema';
import { getAdminSession } from '@/lib/auth';
import { eq, sql } from 'drizzle-orm';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await getAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { url, alt } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Get max display order for this property
    const [maxOrder] = await db
      .select({ max: sql<number>`COALESCE(MAX(display_order), -1)` })
      .from(propertyPhotos)
      .where(eq(propertyPhotos.propertyId, parseInt(id)));

    const [photo] = await db
      .insert(propertyPhotos)
      .values({
        propertyId: parseInt(id),
        url,
        alt: alt || '',
        displayOrder: (maxOrder?.max ?? -1) + 1,
      })
      .returning();

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error('Add photo error:', error);
    return NextResponse.json({ error: 'Failed to add photo' }, { status: 500 });
  }
}
```

- [ ] **Step 2: Create DELETE handler to remove photo**

```typescript
// src/app/api/admin/photos/[id]/route.ts

import { NextResponse } from 'next/server';
import { db } from '@/infrastructure/database';
import { propertyPhotos } from '@/infrastructure/database/schema';
import { getAdminSession } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { del } from '@vercel/blob';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await getAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Get photo URL before deleting
    const [photo] = await db
      .select()
      .from(propertyPhotos)
      .where(eq(propertyPhotos.id, parseInt(id)))
      .limit(1);

    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    // Delete from database
    await db.delete(propertyPhotos).where(eq(propertyPhotos.id, parseInt(id)));

    // Delete from Vercel Blob
    try {
      await del(photo.url);
    } catch {
      // Blob deletion failed, but DB record is gone
      console.warn('Failed to delete blob:', photo.url);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete photo error:', error);
    return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 });
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/admin/
git commit -m "feat(api): add property photo management endpoints"
```

---

## Task 6: Hero Photos API

**Files:**
- Create: `src/app/api/admin/hero/route.ts`

- [ ] **Step 1: Create GET handler for hero photos**

```typescript
// src/app/api/admin/hero/route.ts

import { NextResponse } from 'next/server';
import { db } from '@/infrastructure/database';
import { heroPhotos } from '@/infrastructure/database/schema';
import { getAdminSession } from '@/lib/auth';
import { isNull } from 'drizzle-orm';

// Public endpoint - no auth required for GET
export async function GET() {
  const photos = await db
    .select()
    .from(heroPhotos)
    .orderBy(heroPhotos.position);

  // Return in expected format for Hero component
  const result = [1, 2, 3].map((pos) => {
    const photo = photos.find((p) => p.position === pos);
    return photo
      ? { id: String(photo.id), src: photo.url, alt: photo.alt }
      : null;
  });

  // Filter out nulls for admin, but for public we need all 3
  return NextResponse.json(result);
}
```

- [ ] **Step 2: Create PUT handler for updating hero photo**

```typescript
// Add to src/app/api/admin/hero/route.ts

export async function PUT(request: Request) {
  const isAuth = await getAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { position, url, alt } = body;

    if (!position || !url) {
      return NextResponse.json(
        { error: 'Position and URL are required' },
        { status: 400 }
      );
    }

    if (![1, 2, 3].includes(position)) {
      return NextResponse.json(
        { error: 'Position must be 1, 2, or 3' },
        { status: 400 }
      );
    }

    // Upsert the hero photo
    const [existing] = await db
      .select()
      .from(heroPhotos)
      .where(isNull(heroPhotos.id)) // placeholder, we'll use raw upsert

    // Check if position exists, update or insert
    const [photo] = await db
      .insert(heroPhotos)
      .values({ position, url, alt: alt || '' })
      .onConflictDoUpdate({
        target: heroPhotos.position,
        set: { url, alt: alt || '' },
      })
      .returning();

    return NextResponse.json(photo);
  } catch (error) {
    console.error('Update hero photo error:', error);
    return NextResponse.json({ error: 'Failed to update hero photo' }, { status: 500 });
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/admin/hero/route.ts
git commit -m "feat(api): add hero photos management endpoint"
```

---

## Task 7: Admin Page Shell with Tabs

**Files:**
- Create: `src/app/admin/page.tsx`

- [ ] **Step 1: Create main admin page with tab navigation**

```typescript
'use client';

import { useState, useEffect } from 'react';
import PropertiesTab from '@/components/admin/PropertiesTab';
import HeroTab from '@/components/admin/HeroTab';
import StatsTab from '@/components/admin/StatsTab';

type Tab = 'properties' | 'hero' | 'stats';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('properties');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Check auth status on mount
  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setIsAuthenticated(true);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm),
    });

    if (res.ok) {
      setIsAuthenticated(true);
    } else {
      setLoginError('Invalid credentials');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beige">
        <p className="text-stone-500">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beige">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
          <h1 className="text-2xl font-playfair italic mb-6 text-center">Admin Login</h1>
          {loginError && (
            <p className="text-red-600 text-sm mb-4 text-center">{loginError}</p>
          )}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={loginForm.username}
              onChange={(e) => setLoginForm((f) => ({ ...f, username: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange"
              required
            />
            <button
              type="submit"
              className="w-full bg-stone-900 text-white py-3 rounded-lg font-medium hover:bg-stone-800 transition-colors"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige">
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-playfair italic">Admin Dashboard</h1>
          <button
            onClick={() => {
              fetch('/api/admin/login', { method: 'DELETE' });
              setIsAuthenticated(false);
            }}
            className="text-stone-500 hover:text-stone-900 text-sm"
          >
            Logout
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 border-b border-stone-200">
          {(['properties', 'hero', 'stats'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-white text-stone-900 border-b-2 border-orange'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {activeTab === 'properties' && <PropertiesTab />}
          {activeTab === 'hero' && <HeroTab />}
          {activeTab === 'stats' && <StatsTab />}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/page.tsx
git commit -m "feat(admin): create main admin page with tabs"
```

---

## Task 8: Properties Tab Component

**Files:**
- Create: `src/components/admin/PropertiesTab.tsx`
- Create: `src/components/admin/PropertyEditor.tsx`

- [ ] **Step 1: Create PropertiesTab component**

```typescript
// src/components/admin/PropertiesTab.tsx

'use client';

import { useState, useEffect } from 'react';
import PropertyEditor from './PropertyEditor';

type Property = {
  id: number;
  name: string;
  location: string;
  price: string;
  status: 'available' | 'sold' | 'rented';
  showInShowcase: boolean;
  displayOrder: number;
  photos: { id: number; url: string; alt: string }[];
};

export default function PropertiesTab() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setIsLoading(true);
    const res = await fetch('/api/admin/properties');
    const data = await res.json();
    setProperties(data);
    setIsLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this property?')) return;
    await fetch(`/api/admin/properties/${id}`, { method: 'DELETE' });
    setProperties((p) => p.filter((prop) => prop.id !== id));
  };

  const handleSave = (property: Property) => {
    setProperties((p) => {
      const exists = p.find((prop) => prop.id === property.id);
      if (exists) {
        return p.map((prop) => (prop.id === property.id ? property : prop));
      }
      return [...p, property];
    });
    setEditingId(null);
    setIsCreating(false);
  };

  if (isLoading) {
    return <p className="text-stone-500">Loading properties...</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Property Listings</h2>
        <button
          onClick={() => {
            setIsCreating(true);
            setEditingId(null);
          }}
          className="bg-orange text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors"
        >
          + Add Property
        </button>
      </div>

      {isCreating && (
        <PropertyEditor
          property={null}
          onSave={handleSave}
          onCancel={() => setIsCreating(false)}
        />
      )}

      <div className="space-y-4">
        {properties.map((property) => (
          <div key={property.id}>
            {editingId === property.id ? (
              <PropertyEditor
                property={property}
                onSave={handleSave}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div className="flex items-center justify-between p-4 bg-stone-50 rounded-lg">
                <div className="flex items-center gap-4">
                  {property.photos[0] && (
                    <img
                      src={property.photos[0].url}
                      alt={property.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h3 className="font-medium">{property.name}</h3>
                    <p className="text-sm text-stone-500">{property.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      property.status === 'available'
                        ? 'bg-green-100 text-green-700'
                        : property.status === 'sold'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {property.status}
                  </span>
                  {property.showInShowcase && (
                    <span className="px-2 py-1 bg-stone-200 text-stone-600 rounded text-xs">
                      Showcase
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setEditingId(property.id);
                      setIsCreating(false);
                    }}
                    className="text-stone-500 hover:text-stone-900 px-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(property.id)}
                    className="text-red-500 hover:text-red-700 px-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {properties.length === 0 && !isCreating && (
          <p className="text-center text-stone-400 py-8">No properties yet. Add your first one!</p>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create PropertyEditor component**

```typescript
// src/components/admin/PropertyEditor.tsx

'use client';

import { useState } from 'react';
import PhotoUploader from './PhotoUploader';

type Property = {
  id: number;
  name: string;
  location: string;
  price: string;
  status: 'available' | 'sold' | 'rented';
  showInShowcase: boolean;
  displayOrder: number;
  photos: { id: number; url: string; alt: string }[];
};

type Props = {
  property: Property | null;
  onSave: (property: Property) => void;
  onCancel: () => void;
};

export default function PropertyEditor({ property, onSave, onCancel }: Props) {
  const [formData, setFormData] = useState({
    name: property?.name || '',
    location: property?.location || '',
    price: property?.price || '',
    status: property?.status || 'available' as const,
    showInShowcase: property?.showInShowcase || false,
  });
  const [photos, setPhotos] = useState(property?.photos || []);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = property
        ? `/api/admin/properties/${property.id}`
        : '/api/admin/properties';
      const method = property ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const savedProperty = await res.json();

      // Upload new photos if any
      // (photos are managed via PhotoUploader, which handles upload on its own)

      onSave(savedProperty);
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save property');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-xl p-6 mb-4">
      <h3 className="text-lg font-medium mb-4">
        {property ? 'Edit Property' : 'New Property'}
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
            className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData((f) => ({ ...f, location: e.target.value }))}
            className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Price</label>
          <input
            type="text"
            value={formData.price}
            onChange={(e) => setFormData((f) => ({ ...f, price: e.target.value }))}
            placeholder="Rp 2.5 M"
            className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData((f) => ({ ...f, status: e.target.value as Property['status'] }))}
            className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
          >
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.showInShowcase}
            onChange={(e) => setFormData((f) => ({ ...f, showInShowcase: e.target.checked }))}
            className="w-4 h-4 text-orange focus:ring-orange border-stone-300 rounded"
          />
          <span className="text-sm font-medium text-stone-600">Show in Showcase carousel</span>
        </label>
      </div>

      {property && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-stone-600 mb-2">Photos</label>
          <PhotoUploader propertyId={property.id} photos={photos} onPhotosChange={setPhotos} />
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-stone-600 hover:text-stone-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="bg-orange text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/PropertiesTab.tsx src/components/admin/PropertyEditor.tsx
git commit -m "feat(admin): add PropertiesTab and PropertyEditor components"
```

---

## Task 9: Photo Uploader Component

**Files:**
- Create: `src/components/admin/PhotoUploader.tsx`

- [ ] **Step 1: Create PhotoUploader component**

```typescript
// src/components/admin/PhotoUploader.tsx

'use client';

import { useState, useRef } from 'react';

type Props = {
  propertyId: number;
  photos: { id: number; url: string; alt: string }[];
  onPhotosChange: (photos: { id: number; url: string; alt: string }[]) => void;
};

export default function PhotoUploader({ propertyId, photos, onPhotosChange }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);

        // Upload to Vercel Blob
        const uploadRes = await fetch('/api/admin/photos', {
          method: 'POST',
          body: formData,
        });
        const { url } = await uploadRes.json();

        // Associate with property
        const photoRes = await fetch(`/api/admin/properties/${propertyId}/photos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url, alt: '' }),
        });
        const newPhoto = await photoRes.json();
        onPhotosChange([...photos, newPhoto]);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload photo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (photoId: number) => {
    if (!confirm('Delete this photo?')) return;
    await fetch(`/api/admin/photos/${photoId}`, { method: 'DELETE' });
    onPhotosChange(photos.filter((p) => p.id !== photoId));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleUpload(e.dataTransfer.files);
  };

  return (
    <div>
      {/* Upload Area */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${dragActive ? 'border-orange bg-orange/5' : 'border-stone-200 hover:border-stone-400'}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
n          onChange={(e) => handleUpload(e.target.files)}
          className="hidden"
        />
        {isUploading ? (
          <p className="text-stone-500">Uploading...</p>
        ) : (
          <div>
            <p className="text-stone-500 mb-1">Drop images here or click to upload</p>
            <p className="text-xs text-stone-400">JPEG, PNG, WebP</p>
          </div>
        )}
      </div>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mt-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <img
                src={photo.url}
                alt={photo.alt}
                className="w-full aspect-square object-cover rounded-lg"
              />
              <button
                onClick={() => handleDelete(photo.id)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/admin/PhotoUploader.tsx
git commit -m "feat(admin): add PhotoUploader component with drag & drop"
```

---

## Task 10: Hero Tab Component

**Files:**
- Create: `src/components/admin/HeroTab.tsx`

- [ ] **Step 1: Create HeroTab component**

```typescript
// src/components/admin/HeroTab.tsx

'use client';

import { useState, useEffect, useRef } from 'react';

type HeroPhoto = {
  id: string;
  src: string;
  alt: string;
} | null;

export default function HeroTab() {
  const [photos, setPhotos] = useState<[HeroPhoto, HeroPhoto, HeroPhoto]>([null, null, null]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingPosition, setUploadingPosition] = useState<number | null>(null);

  useEffect(() => {
    loadHeroPhotos();
  }, []);

  const loadHeroPhotos = async () => {
    setIsLoading(true);
    const res = await fetch('/api/admin/hero');
    const data = await res.json();
    setPhotos(data);
    setIsLoading(false);
  };

  const handleUpload = async (position: number, file: File) => {
    setUploadingPosition(position);

    try {
      // Upload to Vercel Blob
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await fetch('/api/admin/photos', {
        method: 'POST',
        body: formData,
      });
      const { url } = await uploadRes.json();

      // Update hero photo
      await fetch('/api/admin/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position, url, alt: '' }),
      });

      await loadHeroPhotos();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload hero photo');
    } finally {
      setUploadingPosition(null);
    }
  };

  if (isLoading) {
    return <p className="text-stone-500">Loading hero photos...</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-medium mb-6">Hero Photos</h2>
      <p className="text-sm text-stone-500 mb-6">
        These photos appear in the stacked card animation on the homepage.
        Position 1 is the front card, 3 is the back.
      </p>

      <div className="grid grid-cols-3 gap-6">
        {[1, 2, 3].map((position) => {
          const photo = photos[position - 1];
          const isUploading = uploadingPosition === position;

          return (
            <div key={position} className="relative">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                {photo ? (
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-stone-400">
                    No photo
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <p className="text-white">Uploading...</p>
                  </div>
                )}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-medium">Position {position}</span>
                <label className="cursor-pointer text-sm text-orange hover:text-orange-600">
                  Change
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(position, file);
                    }}
                  />
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/admin/HeroTab.tsx
git commit -m "feat(admin): add HeroTab component for hero photo management"
```

---

## Task 11: Stats Tab Component (Migration)

**Files:**
- Create: `src/components/admin/StatsTab.tsx`
- Delete: `src/app/admin/stats/page.tsx`

- [ ] **Step 1: Create StatsTab component (extract from existing page)**

```typescript
// src/components/admin/StatsTab.tsx

'use client';

import { useState, useEffect } from 'react';

interface Stat {
  id: number;
  key: string;
  value: number;
  suffix: string;
  label: string;
  displayOrder: number;
}

export default function StatsTab() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setStats(data);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    setSaveMessage('');
    const res = await fetch('/api/admin/stats', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stats }),
    });

    if (res.ok) {
      setSaveMessage('Stats saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } else {
      setSaveMessage('Failed to save stats');
    }
  };

  if (isLoading) {
    return <p className="text-stone-500">Loading stats...</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Company Stats</h2>
        <button
          onClick={handleSave}
          className="bg-orange text-white px-6 py-2 rounded-full font-medium hover:bg-orange-600 transition-colors"
        >
          Save Changes
        </button>
      </div>

      {saveMessage && (
        <p className="text-green-600 mb-4">{saveMessage}</p>
      )}

      <div className="space-y-6">
        {stats.map((stat, index) => (
          <div key={stat.id} className="bg-stone-50 p-6 rounded-xl">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-stone-500 uppercase tracking-wider">Value</label>
                <input
                  type="number"
                  value={stat.value}
                  onChange={(e) => {
                    const newStats = [...stats];
                    newStats[index].value = parseInt(e.target.value) || 0;
                    setStats(newStats);
                  }}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange"
                />
              </div>
              <div>
                <label className="text-xs text-stone-500 uppercase tracking-wider">Suffix</label>
                <input
                  type="text"
                  value={stat.suffix}
                  onChange={(e) => {
                    const newStats = [...stats];
                    newStats[index].suffix = e.target.value;
                    setStats(newStats);
                  }}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange"
                />
              </div>
              <div>
                <label className="text-xs text-stone-500 uppercase tracking-wider">Label</label>
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => {
                    const newStats = [...stats];
                    newStats[index].label = e.target.value;
                    setStats(newStats);
                  }}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Delete old stats page**

```bash
rm src/app/admin/stats/page.tsx
```

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/StatsTab.tsx
git rm src/app/admin/stats/page.tsx
git commit -m "refactor(admin): migrate stats editor to tab component"
```

---

## Task 12: Update Hero Component to Fetch from API

**Files:**
- Modify: `src/components/Hero.tsx`

- [ ] **Step 1: Add server-side data fetching to Hero**

```typescript
// Modify src/components/Hero.tsx
// Add at top:

import { db } from '@/infrastructure/database';
import { heroPhotos } from '@/infrastructure/database/schema';

// Add server function before component:

async function getHeroPhotos(): Promise<[HeroPhoto, HeroPhoto, HeroPhoto]> {
  try {
    const photos = await db.select().from(heroPhotos).orderBy(heroPhotos.position);
    
    const result: [HeroPhoto, HeroPhoto, HeroPhoto] = [null, null, null];
    [1, 2, 3].forEach((pos, idx) => {
      const photo = photos.find((p) => p.position === pos);
      if (photo) {
        result[idx] = { id: String(photo.id), src: photo.url, alt: photo.alt };
      }
    });
    
    // Return if all 3 are set, otherwise fallback to defaults
    if (result.every(Boolean)) {
      return result as [HeroPhoto, HeroPhoto, HeroPhoto];
    }
    return defaultHeroPhotos;
  } catch {
    return defaultHeroPhotos;
  }
}

// Change component signature to async:
export default async function Hero() {
  const photos = await getHeroPhotos();
  // ... rest of component
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Hero.tsx
git commit -m "feat(hero): fetch hero photos from database"
```

---

## Task 13: Update PropertyShowcase to Fetch from API

**Files:**
- Modify: `src/components/PropertyShowcase.tsx`

- [ ] **Step 1: Add server-side data fetching to PropertyShowcase**

```typescript
// Modify src/components/PropertyShowcase.tsx
// Add at top:

import { db } from '@/infrastructure/database';
import { properties, propertyPhotos } from '@/infrastructure/database/schema';
import { eq } from 'drizzle-orm';

// Add server function before component:

async function getShowcaseProperties(): Promise<Property[]> {
  try {
    const showcaseProperties = await db
      .select()
      .from(properties)
      .where(eq(properties.showInShowcase, true))
      .orderBy(properties.displayOrder);
    
    const withPhotos = await Promise.all(
      showcaseProperties.map(async (prop) => {
        const photos = await db
          .select()
          .from(propertyPhotos)
          .where(eq(propertyPhotos.propertyId, prop.id))
          .orderBy(propertyPhotos.displayOrder);
        return {
          id: String(prop.id),
          name: prop.name,
          location: prop.location,
          price: prop.price,
          image: photos[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
        };
      })
    );
    
    return withPhotos.length > 0 ? withPhotos : defaultProperties;
  } catch {
    return defaultProperties;
  }
}

// Change component signature to async:
export default async function PropertyShowcase() {
  const properties = await getShowcaseProperties();
  // ... rest of component (remove props parameter)
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PropertyShowcase.tsx
git commit -m "feat(showcase): fetch properties from database"
```

---

## Task 14: Seed Initial Data

**Files:**
- Modify: `src/infrastructure/database/seed.ts`

- [ ] **Step 1: Add seed data for hero photos and sample properties**

```typescript
// Add to src/infrastructure/database/seed.ts

import { db } from './index';
import { stats, properties, propertyPhotos, heroPhotos } from './schema';

async function seed() {
  // Existing stats seed...
  
  // Seed hero photos
  const existingHero = await db.select().from(heroPhotos);
  if (existingHero.length === 0) {
    await db.insert(heroPhotos).values([
      { position: 1, url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', alt: 'Modern home exterior' },
      { position: 2, url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', alt: 'Luxury interior' },
      { position: 3, url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', alt: 'Contemporary living space' },
    ]);
    console.log('Seeded hero photos');
  }
  
  // Seed sample properties
  const existingProps = await db.select().from(properties);
  if (existingProps.length === 0) {
    const [prop1] = await db.insert(properties).values({
      name: 'Rumah Modern Pondok Indah',
      location: 'Jakarta Selatan',
      price: 'Rp 2.5 M',
      status: 'available',
      showInShowcase: true,
      displayOrder: 0,
    }).returning();
    
    await db.insert(propertyPhotos).values({
      propertyId: prop1.id,
      url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    });
    
    console.log('Seeded sample properties');
  }
}

seed().catch(console.error);
```

- [ ] **Step 2: Run seed**

```bash
npx tsx src/infrastructure/database/seed.ts
```

- [ ] **Step 3: Commit**

```bash
git add src/infrastructure/database/seed.ts
git commit -m "feat(db): add seed data for hero photos and properties"
```

---

## Task 15: Final Testing and Verification

- [ ] **Step 1: Test admin login**
  - Navigate to `/admin`
  - Login with env credentials
  - Verify tabs work: Properties, Hero, Stats

- [ ] **Step 2: Test property CRUD**
  - Create new property
  - Upload photos
  - Update property status and showcase toggle
  - Delete property

- [ ] **Step 3: Test hero photos**
  - Upload/change hero photos
  - Verify homepage shows updated photos

- [ ] **Step 4: Test showcase**
  - Toggle `showInShowcase` on properties
  - Verify PropertyShowcase displays selected properties

- [ ] **Step 5: Build and verify no errors**

```bash
npm run build
```

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat: complete F-010 Property Management Admin"
```