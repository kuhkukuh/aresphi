# Stats Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dark stats section with database-backed values and admin CRUD functionality.

**Architecture:** Single `stats` table, public GET API, authenticated PUT API, StatsSection React component matching preview design exactly, admin page with simple form.

**Tech Stack:** Next.js 16, Drizzle ORM, Neon PostgreSQL, Tailwind CSS, React 19

---

## File Structure

```
src/
├── infrastructure/
│   └── database/
│       └── schema.ts           # Add stats table to schema
├── app/
│   ├── api/
│   │   └── admin/
│   │       └── stats/
│   │           └── route.ts    # GET/PUT stats API
│   └── admin/
│       └── stats/
│           └── page.tsx        # Admin CRUD page
├── components/
│   └── StatsSection.tsx        # Dark stats section component
└── lib/
    └── auth.ts                 # Simple admin auth utilities
```

---

### Task 1: Create Database Schema

**Files:**
- Create: `src/infrastructure/database/schema.ts`

- [ ] **Step 1: Create the stats table schema**

```typescript
import { integer, pgTable, text } from 'drizzle-orm/pg-core';

export const stats = pgTable('stats', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  key: text('key').notNull().unique(),
  value: integer('value').notNull(),
  suffix: text('suffix').notNull().default('+'),
  label: text('label').notNull(),
  displayOrder: integer('display_order').notNull().default(0),
});

export type Stat = typeof stats.$inferSelect;
export type NewStat = typeof stats.$inferInsert;
```

- [ ] **Step 2: Generate and push the migration**

Run: `npm run db:generate`
Expected: New migration file in `drizzle/` directory

Run: `npm run db:push`
Expected: Table created in database

- [ ] **Step 3: Commit schema**

```bash
git add src/infrastructure/database/schema.ts drizzle/
git commit -m "feat(db): add stats table schema"
```

---

### Task 2: Create Database Connection and Seed Stats

**Files:**
- Create: `src/infrastructure/database/index.ts`
- Create: `src/infrastructure/database/seed.ts`

- [ ] **Step 1: Create database connection**

```typescript
// src/infrastructure/database/index.ts
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import * as schema from './schema';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });
```

- [ ] **Step 2: Create seed script for initial stats**

```typescript
// src/infrastructure/database/seed.ts
import { db } from './index';
import { stats } from './schema';

const defaultStats = [
  { key: 'properties_sold', value: 150, suffix: '+', label: 'Properti Terjual', displayOrder: 1 },
  { key: 'happy_clients', value: 200, suffix: '+', label: 'Klien Puas', displayOrder: 2 },
  { key: 'years_experience', value: 5, suffix: '+', label: 'Tahun Pengalaman', displayOrder: 3 },
  { key: 'success_rate', value: 98, suffix: '%', label: 'Keberhasilan', displayOrder: 4 },
];

async function seed() {
  console.log('Seeding stats...');
  await db.insert(stats).values(defaultStats).onConflictDoNothing();
  console.log('Stats seeded successfully');
}

seed();
```

- [ ] **Step 3: Run seed script**

Run: `npx tsx src/infrastructure/database/seed.ts`
Expected: "Stats seeded successfully"

- [ ] **Step 4: Commit database utilities**

```bash
git add src/infrastructure/database/
git commit -m "feat(db): add database connection and seed script"
```

---

### Task 3: Create Auth Utilities

**Files:**
- Create: `src/lib/auth.ts`

- [ ] **Step 1: Create admin auth utilities**

```typescript
// src/lib/auth.ts
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
  process.env.ADMIN_SECRET || 'dev-secret-change-in-production'
);

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, SECRET_KEY);
    return true;
  } catch {
    return false;
  }
}

export async function createAdminToken(): Promise<string> {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(SECRET_KEY);
}

export async function getAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}

export async function setAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = await createAdminToken();
  cookieStore.set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
}

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  const validUsername = process.env.ADMIN_USERNAME;
  const validPassword = process.env.ADMIN_PASSWORD;
  
  if (!validUsername || !validPassword) {
    console.error('Admin credentials not configured in environment');
    return false;
  }
  
  return username === validUsername && password === validPassword;
}
```

- [ ] **Step 2: Install jose for JWT**

Run: `npm install jose`
Expected: Package installed successfully

- [ ] **Step 3: Update .env.example**

Add to `.env.example`:
```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=changeme
ADMIN_SECRET=your-random-secret-key
```

- [ ] **Step 4: Commit auth utilities**

```bash
git add src/lib/auth.ts .env.example package.json package-lock.json
git commit -m "feat(auth): add admin authentication utilities"
```

---

### Task 4: Create Stats API

**Files:**
- Create: `src/app/api/admin/stats/route.ts`

- [ ] **Step 1: Create GET endpoint for stats**

```typescript
// src/app/api/admin/stats/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/infrastructure/database';
import { stats } from '@/infrastructure/database/schema';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const allStats = await db.select().from(stats).orderBy(stats.displayOrder);
    return NextResponse.json(allStats);
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Add PUT endpoint for updating stats**

Append to `src/app/api/admin/stats/route.ts`:

```typescript
export async function PUT(request: Request) {
  try {
    const isAuthenticated = await getAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { stats: updatedStats } = body;

    if (!Array.isArray(updatedStats)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    // Update each stat
    for (const stat of updatedStats) {
      await db
        .update(stats)
        .set({ value: stat.value, label: stat.label, suffix: stat.suffix })
        .where(stats.key.eq ? stats.key : null as any);
    }

    // Fetch and return updated stats
    const allStats = await db.select().from(stats).orderBy(stats.displayOrder);
    return NextResponse.json(allStats);
  } catch (error) {
    console.error('Failed to update stats:', error);
    return NextResponse.json(
      { error: 'Failed to update stats' },
      { status: 500 }
    );
  }
}
```

Wait, the update logic needs fixing. Let me rewrite the full file:

```typescript
// src/app/api/admin/stats/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/infrastructure/database';
import { stats } from '@/infrastructure/database/schema';
import { eq } from 'drizzle-orm';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const allStats = await db.select().from(stats).orderBy(stats.displayOrder);
    return NextResponse.json(allStats);
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const isAuthenticated = await getAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { stats: updatedStats } = body;

    if (!Array.isArray(updatedStats)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    // Update each stat
    for (const stat of updatedStats) {
      await db
        .update(stats)
        .set({ value: stat.value, label: stat.label, suffix: stat.suffix })
        .where(eq(stats.key, stat.key));
    }

    // Fetch and return updated stats
    const allStats = await db.select().from(stats).orderBy(stats.displayOrder);
    return NextResponse.json(allStats);
  } catch (error) {
    console.error('Failed to update stats:', error);
    return NextResponse.json(
      { error: 'Failed to update stats' },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 3: Commit API route**

```bash
git add src/app/api/admin/stats/route.ts
git commit -m "feat(api): add stats GET/PUT endpoints"
```

---

### Task 5: Admin Login and Stats Page

**Files:**
- Create: `src/app/admin/stats/page.tsx`

- [ ] **Step 1: Create admin stats page with login**

```typescript
// src/app/admin/stats/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Stat {
  id: number;
  key: string;
  value: number;
  suffix: string;
  label: string;
  displayOrder: number;
}

export default function AdminStatsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Stat[]>([]);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  // Check auth status on mount
  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setIsAuthenticated(true);
          setStats(data);
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
      const statsRes = await fetch('/api/admin/stats');
      const data = await statsRes.json();
      setStats(data);
    } else {
      setLoginError('Invalid credentials');
    }
  };

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
              onChange={e => setLoginForm(f => ({ ...f, username: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
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
    <div className="min-h-screen bg-beige p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-playfair italic">Manage Stats</h1>
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
            <div key={stat.id} className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-stone-500 uppercase tracking-wider">Value</label>
                  <input
                    type="number"
                    value={stat.value}
                    onChange={e => {
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
                    onChange={e => {
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
                    onChange={e => {
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
    </div>
  );
}
```

- [ ] **Step 2: Create admin login API**

Create `src/app/api/admin/login/route.ts`:

```typescript
// src/app/api/admin/login/route.ts
import { NextResponse } from 'next/server';
import { verifyCredentials, setAdminSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password required' },
        { status: 400 }
      );
    }

    const isValid = await verifyCredentials(username, password);
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    await setAdminSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 3: Commit admin page and login API**

```bash
git add src/app/admin/stats/page.tsx src/app/api/admin/login/route.ts
git commit -m "feat(admin): add stats management page with login"
```

---

### Task 6: Create StatsSection Component

**Files:**
- Create: `src/components/StatsSection.tsx`

- [ ] **Step 1: Create StatsSection component matching preview**

```typescript
// src/components/StatsSection.tsx
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

// Fallback stats for when API is unavailable
const fallbackStats: Stat[] = [
  { id: 1, key: 'properties_sold', value: 150, suffix: '+', label: 'Properti Terjual', displayOrder: 1 },
  { id: 2, key: 'happy_clients', value: 200, suffix: '+', label: 'Klien Puas', displayOrder: 2 },
  { id: 3, key: 'years_experience', value: 5, suffix: '+', label: 'Tahun Pengalaman', displayOrder: 3 },
  { id: 4, key: 'success_rate', value: 98, suffix: '%', label: 'Keberhasilan', displayOrder: 4 },
];

export default function StatsSection() {
  const [stats, setStats] = useState<Stat[]>(fallbackStats);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setStats(data);
        }
      })
      .catch(() => {
        // Use fallback stats on error
      });
  }, []);

  return (
    <section className="relative bg-stone-850 py-32 overflow-hidden">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="font-bold text-white watermark text-[18vw] leading-[0.85] opacity-[0.03] select-none">
          STATS
        </span>
      </div>
      
      {/* Gradient overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-2/3 bg-gradient-to-b from-amber-500/10 to-transparent blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="mb-16">
          <div className="flex justify-between items-baseline mb-4 pb-4 border-b border-stone-700/40">
            <span className="text-xs font-semibold text-orange uppercase tracking-[0.15em]">
              / 02 Pencapaian
            </span>
            <span className="text-xs text-stone-500 font-mono">
              [ 02 ]
            </span>
          </div>
          <h2 className="mt-8 text-4xl font-medium leading-[1.02] sm:text-5xl md:text-6xl lg:text-[4.6rem] text-white" style={{ letterSpacing: '-0.055em' }}>
            Angka <span className="font-playfair italic font-normal text-white/90">Berbicara</span>
          </h2>
        </div>
        
        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {stats.map((stat) => (
            <div key={stat.id} className="text-center md:text-left">
              <div className="text-5xl md:text-7xl font-semibold text-white mb-2" style={{ letterSpacing: '-0.02em' }}>
                {stat.value}<span className="text-orange">{stat.suffix}</span>
              </div>
              <p className="text-xs font-bold uppercase text-white/50" style={{ letterSpacing: '0.24em' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit StatsSection component**

```bash
git add src/components/StatsSection.tsx
git commit -m "feat(components): add StatsSection component matching preview design"
```

---

### Task 7: Integrate StatsSection into Homepage

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add StatsSection to page**

```typescript
// src/app/page.tsx
import Hero from "@/components/Hero";
import PartnerLogos from "@/components/PartnerLogos";
import USPSection from "@/components/USPSection";
import StatsSection from "@/components/StatsSection";
import ProcessSection from "@/components/ProcessSection";
import PropertyShowcase from "@/components/PropertyShowcase";
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
      <Footer />
    </main>
  );
}
```

- [ ] **Step 2: Verify the build works**

Run: `npm run build`
Expected: Build succeeds without errors

- [ ] **Step 3: Commit integration**

```bash
git add src/app/page.tsx
git commit -m "feat(page): add StatsSection to homepage between USP and Process sections"
```

---

### Task 8: Verify Implementation

- [ ] **Step 1: Start development server**

Run: `npm run dev`
Expected: Server starts at localhost:3000

- [ ] **Step 2: Verify stats section renders**

Open browser to `http://localhost:3000`
Verify: Stats section appears between USPSection and ProcessSection with dark background

- [ ] **Step 3: Verify admin page works**

Open browser to `http://localhost:3000/admin/stats`
Verify: Login form appears, can log in with env credentials, can edit and save stats

- [ ] **Step 4: Run production build**

Run: `npm run build`
Expected: Build succeeds

---

## Acceptance Criteria Checklist

- [ ] **AC1** — 4 stat items tampil dengan dark background dan white text ✓ (Task 6)
- [ ] **AC2** — Stats values loaded from database, not hardcoded ✓ (Tasks 1-3, 6)
- [ ] **AC3** — Admin dapat update semua stats values via dashboard ✓ (Tasks 4, 5)
- [ ] **AC4** — Stats show appropriate formatting (150+, 98%, etc) ✓ (Tasks 1, 6)
