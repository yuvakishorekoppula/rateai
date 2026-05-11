/**
 * RATEAI — Full Integration Test Suite
 * 
 * Run with: node scratch/test-integration.js
 * 
 * Tests:
 *  1. Lead submission → Supabase 'leads' table
 *  2. Audit save → Supabase 'public_audits' table
 *  3. Audit retrieval → /audit/[id] data fetch
 *  4. Email flow → Resend API
 */

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// ── CONFIG ────────────────────────────────────────────────
const SUPABASE_URL = 'https://oewfpwogtmxyaifjoiij.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ld2Zwd29ndG14eWFpZmpvaWlqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODExODk3OCwiZXhwIjoyMDkzNjk0OTc4fQ.ZnQrlPHdUtkPIsp0KsF2X8koBAsBEEjS1QJG4DwSQDA';
const RESEND_KEY = 're_g7ArtAfK_EzjTpo93HC5En6ozH9YDcv2Q';
const TEST_EMAIL = 'yuvakishorekoppula@gmail.com';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const resend = new Resend(RESEND_KEY);

// ── MOCK DATA ─────────────────────────────────────────────
const mockResults = [
  {
    currentTool: 'ChatGPT',
    currentPlan: 'Pro',
    finalRecommendation: 'Downgrade to Plus',
    savings: { monthly: 180, yearly: 2160 },
    confidenceScore: 92,
    fitResult: { reasoning: ['Most required features are included in Plus.'] }
  },
  {
    currentTool: 'GitHub Copilot',
    currentPlan: 'Business',
    finalRecommendation: 'Reduce seats to active users only',
    savings: { monthly: 120, yearly: 1440 },
    confidenceScore: 85,
    fitResult: { reasoning: ['Seat count exceeds reported active usage.'] }
  }
];
const TOTAL_MONTHLY = 300;
const TOTAL_ANNUAL = 3600;

// ── HELPERS ───────────────────────────────────────────────
const pass = (msg) => console.log(`  ✅ PASS: ${msg}`);
const fail = (msg, err) => console.error(`  ❌ FAIL: ${msg}`, err?.message || err || '');
const section = (title) => console.log(`\n━━━ ${title} ━━━`);

// ── TEST 1: LEAD SUBMISSION ────────────────────────────────
async function testLeadSubmission() {
  section('TEST 1: Lead Submission → Supabase leads table');
  
  const { data, error } = await supabase
    .from('leads')
    .upsert([{
      email: TEST_EMAIL,
      name: 'Yuva Kishore',
      company: 'TestCo',
      role: 'CTO',
      potential_monthly_savings: TOTAL_MONTHLY,
      potential_annual_savings: TOTAL_ANNUAL,
      audit_payload: mockResults,
      updated_at: new Date().toISOString()
    }], { onConflict: 'email' })
    .select()
    .single();

  if (error) {
    fail('Could not upsert lead', error);
    console.log('    → Make sure you ran the schema.sql in Supabase SQL Editor.');
    return null;
  }

  pass(`Lead saved/updated. ID: ${data.id}`);
  pass(`Email: ${data.email} | Savings: $${data.potential_monthly_savings}/mo`);
  return data;
}

// ── TEST 2: CHECK LEAD ROWS ────────────────────────────────
async function testLeadTableRows() {
  section('TEST 2: Verify rows in leads table');

  const { data, error } = await supabase
    .from('leads')
    .select('id, email, company, potential_monthly_savings')
    .limit(5);

  if (error) {
    fail('Could not read leads table', error);
    return;
  }

  pass(`Found ${data.length} lead(s) in table:`);
  data.forEach(row => {
    console.log(`    → ${row.email} | ${row.company} | $${row.potential_monthly_savings}/mo`);
  });
}

// ── TEST 3: AUDIT SAVE ─────────────────────────────────────
async function testAuditSave() {
  section('TEST 3: Audit Save → public_audits table');

  const { data, error } = await supabase
    .from('public_audits')
    .insert([{
      total_monthly_savings: TOTAL_MONTHLY,
      total_annual_savings: TOTAL_ANNUAL,
      results: mockResults,
      company: 'TestCo',
      is_public: true
    }])
    .select('id')
    .single();

  if (error) {
    fail('Could not save public audit', error);
    console.log('    → Make sure public_audits table exists (run schema.sql).');
    return null;
  }

  pass(`Public audit saved. Shareable ID: ${data.id}`);
  pass(`Visit: http://localhost:3000/audit/${data.id}`);
  return data.id;
}

// ── TEST 4: AUDIT RETRIEVAL ────────────────────────────────
async function testAuditRetrieval(auditId) {
  section('TEST 4: Audit Retrieval → fetch by ID');

  if (!auditId) {
    fail('Skipped — no audit ID from previous test.');
    return;
  }

  const { data, error } = await supabase
    .from('public_audits')
    .select('*')
    .eq('id', auditId)
    .eq('is_public', true)
    .single();

  if (error) {
    fail('Could not retrieve audit', error);
    return;
  }

  pass(`Audit retrieved successfully.`);
  pass(`Savings: $${data.total_monthly_savings}/mo · Tools: ${data.results.length}`);
  console.log(`    → Share URL: http://localhost:3000/audit/${data.id}`);
}

// ── TEST 5: EMAIL FLOW ─────────────────────────────────────
async function testEmailFlow() {
  section('TEST 5: Email Flow → Resend delivery');

  const { data, error } = await resend.emails.send({
    from: 'RateAI Audit <onboarding@resend.dev>',
    to: TEST_EMAIL,
    subject: '[TEST] RateAI Integration Test — Audit Results',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 16px;">
        <h1 style="color: #2563eb; font-size: 24px; font-weight: 800; margin: 0 0 8px 0;">RateAI</h1>
        <p style="color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 24px 0;">Integration Test Email</p>
        
        <h2 style="font-size: 18px; font-weight: 700;">Test Audit Summary for TestCo</h2>
        <div style="background: #f9fafb; padding: 16px; border-radius: 12px; margin: 16px 0; border: 1px solid #f3f4f6;">
          <p style="font-style: italic; color: #374151; margin: 0;">
            "This audit identified $${TOTAL_MONTHLY}/month in savings by downgrading ChatGPT Pro 
            to Plus and reducing unused GitHub Copilot seats."
          </p>
        </div>
        
        <div style="display: flex; gap: 12px; margin: 24px 0;">
          <div style="flex: 1; background: #eff6ff; padding: 16px; border-radius: 12px; text-align: center;">
            <p style="font-size: 11px; font-weight: 800; color: #1d4ed8; text-transform: uppercase; margin: 0 0 4px 0;">Monthly Savings</p>
            <p style="font-size: 28px; font-weight: 800; color: #1e40af; margin: 0;">$${TOTAL_MONTHLY}</p>
          </div>
          <div style="flex: 1; background: #f0fdf4; padding: 16px; border-radius: 12px; text-align: center;">
            <p style="font-size: 11px; font-weight: 800; color: #15803d; text-transform: uppercase; margin: 0 0 4px 0;">Annual Savings</p>
            <p style="font-size: 28px; font-weight: 800; color: #166534; margin: 0;">$${TOTAL_ANNUAL}</p>
          </div>
        </div>

        <div style="text-align: center; margin-top: 24px;">
          <a href="http://localhost:3000" style="background: #2563eb; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px;">
            View Full Report →
          </a>
        </div>
        
        <p style="font-size: 11px; color: #9ca3af; text-align: center; margin-top: 24px;">
          This is an automated integration test. © 2026 RateAI
        </p>
      </div>
    `
  });

  if (error) {
    fail('Email delivery failed', error);
    return;
  }

  pass(`Email delivered. Message ID: ${data.id}`);
  pass(`Check inbox: ${TEST_EMAIL}`);
}

// ── RUNNER ─────────────────────────────────────────────────
async function runAllTests() {
  console.log('\n🔬 RATEAI INTEGRATION TEST SUITE');
  console.log('══════════════════════════════════════════');

  await testLeadSubmission();
  await testLeadTableRows();
  const auditId = await testAuditSave();
  await testAuditRetrieval(auditId);
  await testEmailFlow();

  console.log('\n══════════════════════════════════════════');
  console.log('🎯 All tests complete. Review results above.\n');
}

runAllTests();
