# Database Migration Guide

This document defines the rules and workflows for database migrations in the AresPhi project.

## Overview

- **ORM**: Drizzle ORM
- **Dialect**: PostgreSQL (Neon serverless)
- **Schema**: `src/infrastructure/database/schema.ts`
- **Migrations folder**: `drizzle/`

## Database Connections

This project uses Neon PostgreSQL with two connection URLs:

| Variable | Purpose | When to use |
|----------|---------|-------------|
| `DATABASE_URL` | Pooled connection | Runtime queries in the app |
| `DATABASE_UNPOOLED_URL` | Direct connection | Migrations, schema changes |

**Why?** Neon requires a direct (unpooled) connection for DDL operations like creating tables, altering columns, etc. The pooled connection is optimized for runtime queries but cannot run migrations reliably.

```bash
# .env configuration
DATABASE_URL="postgresql://...?sslmode=require"           # Pooled
DATABASE_UNPOOLED_URL="postgresql://...?sslmode=require"  # Direct
```

## Available Commands

```bash
# Generate migration from schema changes
npm run db:generate

# Apply pending migrations to database
npm run db:migrate

# Push schema directly (bypasses migrations - use with caution)
npm run db:push

# Open Drizzle Studio (database GUI)
npm run db:studio

# Seed database with initial data
npm run db:seed
```

---

## Migration Workflow Rules

### Rule 1: Always Modify Schema First

Migrations are generated FROM the schema, not the other way around.

```
1. Edit src/infrastructure/database/schema.ts
2. Run npm run db:generate
3. Review the generated SQL in drizzle/
4. Run npm run db:migrate
```

**Never** manually edit migration files before generating them. The migration is a reflection of schema changes.

### Rule 2: Review Generated SQL Before Applying

Always inspect the generated migration SQL before running `db:migrate`:

```bash
# After db:generate, check the new file
cat drizzle/000X_migration_name.sql
```

Look for:
- Unintended `DROP COLUMN` statements
- Missing constraints or indexes
- Data loss risks (column type changes, not null additions)

### Rule 3: Use db:push Only in Development

| Command | Development | Production |
|---------|-------------|------------|
| `db:generate` + `db:migrate` | ✅ Preferred | ✅ Required |
| `db:push` | ⚠️ Quick prototyping only | ❌ Never |

`db:push` bypasses the migration history and directly syncs the schema. This is useful for rapid iteration but:
- Does not create migration files
- Can cause drift between local and production databases
- Not reproducible

### Rule 4: Non-Destructive Column Changes

When modifying existing columns, follow these patterns:

#### Adding a column with NOT NULL
```typescript
// Bad: Will fail if table has existing rows
price: integer('price').notNull()

// Good: Add nullable first, backfill, then alter
// Migration 1: Add nullable
price: integer('price')

// After backfilling data:
// Migration 2: Alter to not null
```

#### Changing column types
```typescript
// Risky: May lose data if types are incompatible
// Generate migration and review SQL carefully
```

#### Removing columns
```typescript
// Create a backup migration first if data is valuable
// Consider soft-delete patterns instead
```

### Rule 5: Index Before Data, Constraints After

When creating tables with constraints:

```typescript
// Schema definition order matters for readability:
export const properties = pgTable('properties', {
  // 1. Primary key
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  
  // 2. Core columns
  name: text('name').notNull(),
  
  // 3. Foreign keys (after referenced tables exist)
  categoryId: integer('category_id').references(() => categories.id),
  
  // 4. Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
```

### Rule 6: Foreign Key Safety

```typescript
// Always define ON DELETE behavior explicitly
propertyId: integer('property_id')
  .notNull()
  .references(() => properties.id, { 
    onDelete: 'cascade'  // or 'restrict', 'set null', 'no action'
  }),
```

Options:
- `cascade` - Delete child rows when parent is deleted
- `restrict` - Prevent parent deletion if children exist (safest)
- `set null` - Set foreign key to null on parent delete
- `no action` - Same as restrict but checked at end of statement

### Rule 7: Test Migrations Locally First

```bash
# 1. Generate migration
npm run db:generate

# 2. Review SQL
cat drizzle/000X_new_migration.sql

# 3. Test on local/dev database
npm run db:migrate

# 4. Verify app works
npm run dev

# 5. Check Drizzle Studio
npm run db:studio
```

### Rule 8: Handle Migration Conflicts

If multiple developers generate migrations simultaneously:

1. **Pull latest migrations** from the branch
2. **Regenerate** your migration: `npm run db:generate`
3. The new migration will be numbered correctly

If numbers conflict:
```bash
# Drizzle tracks migrations in drizzle/meta/_journal.json
# Check the journal to see the correct sequence
```

### Rule 9: Never Modify Applied Migrations

Once a migration has been applied to any database (local, staging, production):

- ❌ Do NOT edit the SQL file
- ❌ Do NOT delete the migration file
- ❌ Do NOT rename the migration

If you need to fix something:
1. Create a **new migration** that reverses or fixes the issue
2. Apply it normally via `db:migrate`

### Rule 10: Seed Data Separately

Seed data should be idempotent and handle existing records:

```typescript
// src/infrastructure/database/seed.ts
// Use INSERT ... ON CONFLICT DO NOTHING for initial data
// Or use upsert patterns for updating seed data
```

Seed data is NOT migration data. Migrations define structure; seeds define content.

---

## Common Patterns

### Adding a new table

```typescript
// 1. Add to schema.ts
export const newTable = pgTable('new_table', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
});

// 2. Generate migration
// npm run db:generate

// 3. Verify the generated SQL creates the table correctly
// 4. Apply migration
// npm run db:migrate
```

### Adding a foreign key column

```typescript
// 1. Add nullable column first (safer)
authorId: integer('author_id').references(() => authors.id),

// 2. Generate and apply migration

// 3. Backfill data if needed

// 4. If required, create second migration to add .notNull()
```

### Adding an index

```typescript
// In schema.ts
import { index } from 'drizzle-orm/pg-core';

export const properties = pgTable('properties', {
  // ... columns
}, (table) => ({
  locationIdx: index('properties_location_idx').on(table.location),
}));
```

### Dropping a table

```typescript
// 1. Remove from schema.ts
// 2. Generate migration (will create DROP TABLE)
// 3. REVIEW CAREFULLY - this deletes all data
// 4. Apply migration
```

---

## Troubleshooting

### "Migration failed" error

1. Check if the SQL is valid for your PostgreSQL version
2. Look for constraint violations (FK references, unique constraints)
3. Manually fix the database state, then mark migration as applied:
   ```sql
   INSERT INTO drizzle.__drizzle_migrations (hash, created_at) 
   VALUES ('migration_hash', NOW());
   ```

### Schema drift detection

If `db:generate` produces unexpected changes:

```bash
# Check current database state
npm run db:studio

# Compare with schema
# If in doubt, use db:push to sync (development only!)
```

### Neon connection errors

Ensure you're using the correct URL:
- `DATABASE_URL` - for queries (pooled, `...neon.tech:5432/...`)
- `DATABASE_UNPOOLED_URL` - for migrations (`...neon.tech:5432/...` without pooling params)

---

## Quick Reference

| Action | Command | Notes |
|--------|---------|-------|
| Create migration | `npm run db:generate` | After changing schema |
| Apply migrations | `npm run db:migrate` | Uses unpooled URL |
| Quick sync (dev) | `npm run db:push` | No migration file |
| View database | `npm run db:studio` | Opens browser GUI |
| Seed data | `npm run db:seed` | Initial/reference data |

---

## Checklist: Before Deploying to Production

- [ ] All migrations generated and committed
- [ ] Migration SQL reviewed
- [ ] Migrations tested on local/staging
- [ ] `db:migrate` runs without errors
- [ ] App starts and functions correctly
- [ ] Seed data applied if needed
- [ ] Drizzle Studio check completed

---

## CI/CD Integration

### Automated Workflows

This project uses GitHub Actions for automated migration handling:

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `ci.yml` | Push/PR to main | Lint, type-check, build |
| `migrate.yml` | Push to main + migration changes | Auto-apply migrations |

### CI Pipeline (ci.yml)

Runs on every push and pull request to `main`:

1. **Lint** - ESLint checks
2. **Type Check** - TypeScript validation
3. **Build** - Next.js production build
4. **Migration Detection** - Alerts if migrations are pending

### Auto-Migration (migrate.yml)

When migrations are merged to `main`:

1. Detects changes to `drizzle/*.sql` or `schema.ts`
2. Runs `npm run db:migrate` against production database
3. Creates a GitHub issue on failure for visibility

> ⚠️ **Requires**: `DATABASE_UNPOOLED_URL` secret in repository settings

### Setting Up Environment Secrets

This workflow uses a **`production` environment** for security:

1. Go to **Settings > Environments > New environment**
2. Name it `production`
3. Add secret: `DATABASE_UNPOOLED_URL` = your Neon direct connection string
4. (Optional) Add protection rules:
   - Required reviewers for deployments
   - Limit to specific branches (e.g., `main`)

**Why environment secrets?**
- Can require approval before running
- Can restrict which branches can access
- Better auditability for production DB access

### Local Migration Check

Before creating a PR, check for pending migrations:

```bash
./scripts/check-migrations.sh
```

This compares your branch against main and shows any migration changes.

### Manual Migration Trigger

If needed, you can manually trigger the migration workflow:

1. Go to **Actions > Apply Migrations**
2. Click **Run workflow**

### Failure Handling

If migration fails:

1. A GitHub issue is automatically created
2. Check the workflow logs for SQL errors
3. Fix the issue and re-run manually
4. Do NOT modify applied migrations - create a new fix migration instead
