-- 0001_init.sql — HITL gate event log baseline schema.
--
-- This replaces the per-request `CREATE TABLE IF NOT EXISTS` that the Worker
-- used to run on every read/write. Apply with:
--   wrangler d1 migrations apply quirgs-hitl-db --remote   (production)
--   wrangler d1 migrations apply quirgs-hitl-db            (local)
--
-- Safe to run against the existing production DB: the table already exists, so
-- the guarded statements below are no-ops there.

CREATE TABLE IF NOT EXISTS events (
  id         TEXT    PRIMARY KEY,
  type       TEXT    NOT NULL,
  payload    TEXT    NOT NULL,
  status     TEXT    NOT NULL DEFAULT 'pending',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- The list query filters on status and orders/paginates on created_at.
CREATE INDEX IF NOT EXISTS idx_events_status_created
  ON events (status, created_at DESC);

-- The scheduled TTL sweep selects non-archived rows by created_at.
CREATE INDEX IF NOT EXISTS idx_events_created
  ON events (created_at);
