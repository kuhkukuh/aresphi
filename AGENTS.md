<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:drizzle-migration-rules -->
# Database Migrations with Drizzle

- **Always** modify `src/infrastructure/database/schema.ts` first, then run `npm run db:generate`
- **Never** edit migration SQL files after they've been applied to any database
- **Never** use `db:push` in production - use `db:generate` + `db:migrate`
- Use `DATABASE_UNPOOLED_URL` for migrations (Neon requires direct connections for DDL)
- Read `docs/MIGRATION.md` for complete migration workflow and rules
<!-- END:drizzle-migration-rules -->
