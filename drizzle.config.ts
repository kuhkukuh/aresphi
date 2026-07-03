import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

// Use DATABASE_UNPOOLED_URL for migrations (direct connection)
// Use DATABASE_URL for runtime connections (pooled)
const migrationUrl = process.env.DATABASE_UNPOOLED_URL || process.env.DATABASE_URL!;

export default defineConfig({
  schema: './src/infrastructure/database/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: migrationUrl,
  },
});
