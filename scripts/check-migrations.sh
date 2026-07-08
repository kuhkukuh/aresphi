#!/bin/bash

# Check for pending migrations
# Usage: ./scripts/check-migrations.sh [base_branch]

set -e

BASE_BRANCH="${1:-main}"
CURRENT_BRANCH=$(git branch --show-current)

echo "🔍 Checking for pending migrations..."
echo "   Current branch: $CURRENT_BRANCH"
echo "   Base branch: $BASE_BRANCH"
echo ""

# Check if there are migration files changed
MIGRATION_CHANGES=$(git diff --name-only "origin/$BASE_BRANCH...HEAD" -- 'drizzle/*.sql' 2>/dev/null || echo "")

if [ -n "$MIGRATION_CHANGES" ]; then
  echo "📋 Migration files changed:"
  echo "$MIGRATION_CHANGES" | while read -r file; do
    echo "   - $file"
  done
  echo ""
  echo "⚠️  These migrations will be applied automatically when merged to $BASE_BRANCH"
  echo ""

  # Check if schema was also modified
  SCHEMA_CHANGES=$(git diff --name-only "origin/$BASE_BRANCH...HEAD" -- 'src/infrastructure/database/schema.ts' 2>/dev/null || echo "")
  if [ -n "$SCHEMA_CHANGES" ]; then
    echo "✅ Schema file was also modified"
  else
    echo "⚠️  Note: No schema changes detected, but migrations were added"
  fi
else
  echo "✅ No pending migrations"
fi

echo ""
echo "---"
echo "To apply migrations locally: npm run db:migrate"
echo "To generate new migration:    npm run db:generate"
