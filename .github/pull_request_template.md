## Description

Brief description of changes.

## Type of Change

- [ ] 🐛 Bug fix
- [ ] ✨ New feature
- [ ] 📝 Content update
- [ ] 🎨 UI/UX improvement
- [ ] 🔧 Refactoring
- [ ] 🗃️ Database migration

## Database Migration Checklist

**If this PR includes database schema changes:**

- [ ] Schema modified in `src/infrastructure/database/schema.ts`
- [ ] Migration generated with `npm run db:generate`
- [ ] Migration SQL reviewed and tested locally
- [ ] Migration file committed (not just schema)
- [ ] No destructive changes (or documented below)

**Destructive Changes** (if any):
> List any `DROP TABLE`, `DROP COLUMN`, or data-altering changes here.

## Testing

- [ ] Tested locally with `npm run dev`
- [ ] Build passes: `npm run build`
- [ ] Type check passes: `npx tsc --noEmit`

## Screenshots

(If applicable)

## Additional Notes

Any other context for reviewers.
