-- ============================================================
-- AMPLE.AI — Supabase Database Schema
-- Run this in the Supabase SQL Editor to create all tables
-- ============================================================

-- Trial Signups Table
CREATE TABLE IF NOT EXISTS trial_signups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT NOT NULL,
    industry TEXT NOT NULL,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feedback (NPS) Table
CREATE TABLE IF NOT EXISTS feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    score INTEGER NOT NULL CHECK (score >= 1 AND score <= 10),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Test Agent Requests Table
CREATE TABLE IF NOT EXISTS test_agent_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact Requests Table
CREATE TABLE IF NOT EXISTS contact_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE trial_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_agent_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Policies: Allow inserts from authenticated and anonymous users (service key bypass)
-- The backend uses the SERVICE_ROLE key which bypasses RLS.
-- These policies allow the anon key to insert for direct frontend submissions if needed.
CREATE POLICY "Allow anonymous inserts" ON trial_signups FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anonymous inserts" ON feedback FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anonymous inserts" ON test_agent_requests FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anonymous inserts" ON contact_requests FOR INSERT TO anon WITH CHECK (true);
