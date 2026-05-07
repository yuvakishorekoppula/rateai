-- ============================================================
-- RATEAI DATABASE SCHEMA
-- Run this SQL in: Supabase Dashboard → SQL Editor
-- ============================================================

-- --------------------------------
-- TABLE: leads
-- Stores lead capture form submissions
-- --------------------------------
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  company TEXT,
  role TEXT,
  potential_monthly_savings NUMERIC DEFAULT 0,
  potential_annual_savings NUMERIC DEFAULT 0,
  audit_payload JSONB DEFAULT '[]'
);

-- --------------------------------
-- TABLE: public_audits
-- Stores shareable, public audit result snapshots
-- --------------------------------
CREATE TABLE IF NOT EXISTS public_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  total_monthly_savings NUMERIC DEFAULT 0,
  total_annual_savings NUMERIC DEFAULT 0,
  results JSONB NOT NULL DEFAULT '[]',
  company TEXT,
  is_public BOOLEAN DEFAULT TRUE
);

-- --------------------------------
-- INDEXES: For performance on common queries
-- --------------------------------
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads (email);
CREATE INDEX IF NOT EXISTS idx_public_audits_id ON public_audits (id);
CREATE INDEX IF NOT EXISTS idx_public_audits_is_public ON public_audits (is_public);

-- --------------------------------
-- ROW LEVEL SECURITY (RLS)
-- Public audits are readable by anyone.
-- Leads are writable only via service_role.
-- --------------------------------
ALTER TABLE public_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow public read of public audits (for shareable pages)
CREATE POLICY "Public audits are viewable by everyone"
  ON public_audits FOR SELECT
  USING (is_public = TRUE);

-- NOTE: All writes use the service_role key server-side,
-- which bypasses RLS entirely. No INSERT policy needed.
