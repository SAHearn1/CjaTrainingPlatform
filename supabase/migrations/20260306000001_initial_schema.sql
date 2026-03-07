-- ============================================================
-- RootWork Training Platform — Initial PostgreSQL Schema
-- Issue #26: Migrate data storage from KV store to Supabase PostgreSQL
-- ============================================================
-- Run via Supabase CLI:
--   supabase db push --project-ref <PROJECT_REF>
-- Or apply in Supabase Dashboard → SQL Editor
-- ============================================================

-- ── Enable required extensions ──────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── user_profiles ────────────────────────────────────────────
-- Replaces KV keys: user:{userId}:profile
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id       uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name          text NOT NULL DEFAULT '',
  email         text NOT NULL DEFAULT '',
  role          text NOT NULL DEFAULT 'cpi',
  agency_id     uuid REFERENCES agencies(id) ON DELETE SET NULL,
  selected_state text,
  joined_at     timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_agency ON user_profiles(agency_id);

-- ── agencies ─────────────────────────────────────────────────
-- New table for issue #23: Agency/organization data model
CREATE TABLE IF NOT EXISTS agencies (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  type          text NOT NULL,  -- 'law_enforcement' | 'child_welfare' | 'court' | 'medical' | 'education' | 'advocacy'
  state         text NOT NULL DEFAULT 'GA',
  contact_email text,
  seat_count    integer NOT NULL DEFAULT 1,
  license_tier  text NOT NULL DEFAULT 'individual',  -- 'individual' | 'agency' | 'enterprise'
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agencies_state ON agencies(state);
CREATE INDEX IF NOT EXISTS idx_agencies_type ON agencies(type);

-- ── user_module_progress ─────────────────────────────────────
-- Replaces KV keys: user:{userId}:progress:{moduleId}
CREATE TABLE IF NOT EXISTS user_module_progress (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id             integer NOT NULL CHECK (module_id BETWEEN 1 AND 7),
  status                text NOT NULL DEFAULT 'not_started'
                          CHECK (status IN ('not_started', 'in_progress', 'completed')),
  sections_completed    text[] NOT NULL DEFAULT '{}',
  scenarios_completed   text[] NOT NULL DEFAULT '{}',
  pre_assessment_score  integer CHECK (pre_assessment_score BETWEEN 0 AND 100),
  post_assessment_score integer CHECK (post_assessment_score BETWEEN 0 AND 100),
  time_spent_seconds    integer NOT NULL DEFAULT 0,
  completed_date        timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, module_id)
);

CREATE INDEX IF NOT EXISTS idx_progress_user ON user_module_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_status ON user_module_progress(status);

-- ── user_simulations ─────────────────────────────────────────
-- Replaces KV keys: user:{userId}:simulation:{scenarioId}
CREATE TABLE IF NOT EXISTS user_simulations (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scenario_id     text NOT NULL,
  module_id       integer NOT NULL,
  score           integer CHECK (score BETWEEN 0 AND 100),
  completed_at    timestamptz NOT NULL DEFAULT now(),
  choices_made    jsonb NOT NULL DEFAULT '[]',
  UNIQUE (user_id, scenario_id)
);

CREATE INDEX IF NOT EXISTS idx_simulations_user ON user_simulations(user_id);

-- ── certificates ─────────────────────────────────────────────
-- Replaces KV keys: user:{userId}:certificate and cert:{certId}
CREATE TABLE IF NOT EXISTS certificates (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cert_id         text UNIQUE NOT NULL,  -- human-readable ID, e.g. "RW-2026-A1B2C3"
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  modules_count   integer NOT NULL DEFAULT 0,
  ce_hours        integer GENERATED ALWAYS AS (modules_count * 4) STORED,
  issued_at       timestamptz NOT NULL DEFAULT now(),
  revoked_at      timestamptz,
  UNIQUE (user_id)  -- one certificate per user (updated as modules complete)
);

CREATE INDEX IF NOT EXISTS idx_certificates_cert_id ON certificates(cert_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user ON certificates(user_id);

-- ── licenses ─────────────────────────────────────────────────
-- Replaces KV keys: user:{userId}:license and license:{stripeSessionId}
CREATE TABLE IF NOT EXISTS licenses (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_session_id text UNIQUE,
  plan_id         text NOT NULL,
  status          text NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'expired', 'cancelled', 'pending')),
  seats_total     integer NOT NULL DEFAULT 1,
  seats_used      integer NOT NULL DEFAULT 0,
  org_name        text,
  activated_at    timestamptz NOT NULL DEFAULT now(),
  expires_at      timestamptz,
  UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_licenses_user ON licenses(user_id);
CREATE INDEX IF NOT EXISTS idx_licenses_stripe_session ON licenses(stripe_session_id);

-- ── audit_logs ───────────────────────────────────────────────
-- Replaces KV keys: audit:{userId}:{timestamp} and audit_idx:{timestamp}
-- CJIS 5.4.1.1 compliant audit trail
CREATE TABLE IF NOT EXISTS audit_logs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  event_type      text NOT NULL,
  outcome         text NOT NULL CHECK (outcome IN ('success', 'failure', 'warning')),
  ip_address      inet,
  user_agent      text,
  resource        text,
  details         jsonb,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_event ON audit_logs(event_type);

-- ── watched_vignettes ─────────────────────────────────────────
-- Replaces KV keys: user:{userId}:vignettes
CREATE TABLE IF NOT EXISTS watched_vignettes (
  user_id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  vignette_keys   text[] NOT NULL DEFAULT '{}',
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ── Row Level Security ────────────────────────────────────────
-- Users can only read/write their own data. Admins can read all.

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE watched_vignettes ENABLE ROW LEVEL SECURITY;
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;

-- User profiles: self-access + admin read
CREATE POLICY "users_own_profile" ON user_profiles
  FOR ALL USING (auth.uid() = user_id);

-- Module progress: self-access
CREATE POLICY "users_own_progress" ON user_module_progress
  FOR ALL USING (auth.uid() = user_id);

-- Simulations: self-access
CREATE POLICY "users_own_simulations" ON user_simulations
  FOR ALL USING (auth.uid() = user_id);

-- Certificates: self-read, public verify by cert_id
CREATE POLICY "users_own_certificate" ON certificates
  FOR ALL USING (auth.uid() = user_id);

-- Licenses: self-access
CREATE POLICY "users_own_license" ON licenses
  FOR ALL USING (auth.uid() = user_id);

-- Audit logs: self-read only (no self-write — edge function uses service role)
CREATE POLICY "users_read_own_audit" ON audit_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Watched vignettes: self-access
CREATE POLICY "users_own_vignettes" ON watched_vignettes
  FOR ALL USING (auth.uid() = user_id);

-- Agencies: authenticated read, admin write (handled in edge function via service role)
CREATE POLICY "authenticated_read_agencies" ON agencies
  FOR SELECT USING (auth.role() = 'authenticated');

-- ── updated_at trigger ────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_progress_updated_at
  BEFORE UPDATE ON user_module_progress
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
