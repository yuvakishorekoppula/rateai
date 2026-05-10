

# Pricing Sources & Verification Log

All pricing data used in the audit engine, infrastructure estimates, and economic modeling is sourced directly from official vendor pricing pages whenever possible.

Verification date:
```text
2026-05-10
```

---

# AI & API Costs

## [OpenAI API Pricing](https://openai.com/api/pricing/?utm_source=chatgpt.com)

### GPT-5.5
```text
Input:
$5.00 / 1M tokens

Output:
$30.00 / 1M tokens
```

Verified:
```text
2026-05-10
```

Source: :contentReference[oaicite:1]{index=1}

---

### GPT-5.4 Mini
```text
Input:
$0.75 / 1M tokens

Output:
$4.50 / 1M tokens
```

Verified:
```text
2026-05-10
```

Source: :contentReference[oaicite:2]{index=2}

---

### Web Search Tool
```text
$10.00 / 1K calls
```

Verified:
```text
2026-05-10
```

Source: :contentReference[oaicite:3]{index=3}

---

# IDE & Development Tooling

## [Cursor Pricing](https://cursor.com/pricing?utm_source=chatgpt.com)

### Pro Plan
```text
$20/user/month
```

Verified:
```text
2026-05-10
```

Source: :contentReference[oaicite:5]{index=5}

---

### Teams Plan
```text
$40/user/month
```

Verified:
```text
2026-05-10
```

Source: :contentReference[oaicite:6]{index=6}

---

### Pro+ Plan
```text
$60/user/month
```

Verified:
```text
2026-05-10
```

Source: :contentReference[oaicite:7]{index=7}

---

# Hosting & Deployment

## [Vercel Pricing](https://vercel.com/pricing?utm_source=chatgpt.com)

### Hobby Plan
```text
Free
```

Verified:
```text
2026-05-10
```

---

### Pro Plan
```text
$20/user/month
```

Verified:
```text
2026-05-10
```

---

### Enterprise
```text
Custom Pricing
```

Verified:
```text
2026-05-10
```

---

# Database & Backend Infrastructure

## [Supabase Pricing](https://supabase.com/pricing?utm_source=chatgpt.com)

### Free Plan
```text
$0/month
```

Verified:
```text
2026-05-10
```

---

### Pro Plan
```text
$25/month
```

Verified:
```text
2026-05-10
```

---

### Team Plan
```text
Custom Pricing
```

Verified:
```text
2026-05-10
```

---

# Redis / Queue Infrastructure

## [Redis Cloud Pricing](https://redis.io/pricing/?utm_source=chatgpt.com)

### Free Tier
```text
Free
```

Verified:
```text
2026-05-10
```

---

### Fixed Plan
```text
Starts around $5–$15/month depending on usage
```

Verified:
```text
2026-05-10
```

---

# Monitoring & Observability

## [Sentry Pricing](https://sentry.io/pricing/?utm_source=chatgpt.com)

### Developer Plan
```text
Free
```

Verified:
```text
2026-05-10
```

---

### Team Plan
```text
Starts at $26/month
```

Verified:
```text
2026-05-10
```

---

# Queue / Worker Infrastructure

## [Upstash Pricing](https://upstash.com/pricing?utm_source=chatgpt.com)

### Free Tier
```text
Free
```

Verified:
```text
2026-05-10
```

---

### Pay-As-You-Go
```text
Usage-based pricing
```

Verified:
```text
2026-05-10
```

---

# Estimated Monthly Infrastructure Costs (MVP Stage)

| Service | Estimated Monthly Cost |
|---|---|
| OpenAI API | $1,500–2,000 |
| Supabase | $25 |
| Vercel | $20 |
| Redis / Upstash | $10 |
| Monitoring Tools | $26 |
| Misc APIs | $50 |

---

# Estimated Total

```text
≈ $1,600–2,200/month
```

---

# Notes

## Why This Matters

Every economic assumption in:
- ARR calculations
- audit cost projections
- CAC modeling
- scaling analysis

must map to:
```text
real vendor pricing
instead of guessed infrastructure costs.
```

---

# Pricing Risks

## Main Cost Drivers

```text
- OpenAI token usage
- heavy audit traffic
- repeated AI inference
- large review datasets
- real-time processing
```

---

# Future Cost Optimizations

```text
- caching AI responses
- batch processing
- smaller AI models
- embeddings-based retrieval
- asynchronous workers
- audit deduplication
```

---

# Final Verification Summary

| Vendor | Pricing Verified |
|---|---|
| OpenAI | Yes |
| Cursor | Yes |
| Vercel | Yes |
| Supabase | Yes |
| Redis | Yes |
| Sentry | Yes |
| Upstash | Yes |

All pricing links verified on:
```text
2026-05-10
```
