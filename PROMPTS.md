# PROMPTS.md

# LLM Prompt Design

This document contains:
- the main prompts used in the audit engine
- why they were written this way
- prompt engineering decisions
- failed prompt experiments
- lessons learned during iteration

The prompts were designed for:
```text
structured outputs
low hallucination risk
fast inference
consistent scoring
actionable business insights
```

---

# 1. Main Audit Prompt

## Purpose

Generate:
- trust analysis
- review sentiment summary
- fake review indicators
- pricing observations
- actionable recommendations

---

# Full Prompt

```text
You are an ecommerce trust and conversion analyst.

Your job is to analyze product reviews and pricing information and generate a concise audit report.

Focus on:
- customer trust
- fake review signals
- repeated complaints
- pricing competitiveness
- purchase hesitation factors
- conversion risks

Return your response in valid JSON only.

Required JSON schema:
{
  "trust_score": number,
  "sentiment_summary": string,
  "fake_review_signals": [string],
  "top_customer_complaints": [string],
  "pricing_analysis": string,
  "recommendations": [string]
}

Rules:
- trust_score must be between 0 and 100
- recommendations must be actionable
- do not invent data
- use only provided inputs
- keep summaries concise
- avoid marketing language

Input Reviews:
{{REVIEWS}}

Competitor Pricing:
{{PRICING_DATA}}
```

---

# Why This Prompt Worked

## Structured JSON Output

The biggest improvement came from:
```text
forcing strict JSON responses
```

Without this:
- outputs became inconsistent
- parsing failed frequently
- frontend rendering broke

---

## Narrow Task Framing

Instead of:
```text
“Analyze this product”
```

the model is explicitly told:
```text
act like an ecommerce trust analyst
```

This improved:
- specificity
- practical insights
- conversion-focused recommendations

---

## Hard Constraints

The following instruction reduced hallucinations significantly:

```text
“use only provided inputs”
```

Without this, the model sometimes:
- invented competitor context
- fabricated customer complaints
- assumed missing pricing data

---

# 2. Fake Review Detection Prompt

## Purpose

Identify suspicious review behavior.

---

# Full Prompt

```text
Analyze the following product reviews for suspicious patterns.

Look for:
- repeated wording
- unnatural enthusiasm
- generic language
- burst posting behavior
- duplicated phrases
- suspicious repetition

Return JSON only.

Schema:
{
  "suspicious_reviews": [string],
  "risk_level": "low" | "medium" | "high",
  "explanation": string
}

Reviews:
{{REVIEWS}}
```

---

# Why This Prompt Worked

The model performed better when:
```text
specific review fraud signals
were listed explicitly.
```

General prompts produced:
- vague answers
- inconsistent fraud detection
- weak explanations

---

# 3. Sentiment Aggregation Prompt

## Purpose

Summarize customer sentiment trends.

---

# Full Prompt

```text
You are analyzing ecommerce product reviews.

Identify:
- positive sentiment themes
- negative sentiment themes
- repeated customer frustrations
- product strengths

Return concise JSON only.

Schema:
{
  "positive_themes": [string],
  "negative_themes": [string],
  "overall_sentiment": "positive" | "neutral" | "negative"
}

Reviews:
{{REVIEWS}}
```

---

# Why This Prompt Worked

Separating sentiment analysis from:
- fake review detection
- pricing analysis

improved consistency dramatically.

Initially everything was combined into one giant prompt.
Results became:
```text
messy
expensive
hard to parse
less accurate
```

Breaking prompts into focused tasks improved reliability.

---

# 4. Pricing Analysis Prompt

## Purpose

Compare product pricing against competitors.

---

# Full Prompt

```text
You are an ecommerce pricing analyst.

Compare the product pricing against competitor pricing data.

Determine:
- if the product is overpriced
- if the product is underpriced
- potential pricing risks
- possible conversion impact

Return JSON only.

Schema:
{
  "pricing_position": string,
  "pricing_risk": string,
  "recommendation": string
}

Product Price:
{{PRODUCT_PRICE}}

Competitor Prices:
{{COMPETITOR_PRICES}}
```

---

# Why This Prompt Worked

The model performed better when:
```text
the role was specialized.
```

Using:
```text
“pricing analyst”
```

generated more actionable outputs than generic assistant prompts.

---

# 5. Audit Recommendation Prompt

## Purpose

Generate actionable founder-facing recommendations.

---

# Full Prompt

```text
You are advising a Shopify founder.

Based on the audit findings, provide practical recommendations that could improve:
- customer trust
- conversion rate
- review quality
- pricing perception

Recommendations must:
- be concise
- be actionable
- avoid generic startup advice
- prioritize highest-impact changes first

Return JSON only.

Audit Findings:
{{AUDIT_DATA}}
```

---

# What Didn’t Work

# Failed Prompt Strategy #1

## Giant All-in-One Prompt

### Attempt

Originally:
```text
everything was handled in one prompt.
```

Including:
- sentiment
- fraud detection
- pricing
- recommendations
- scoring

---

## Problems

```text
- inconsistent JSON
- hallucinated insights
- token-heavy responses
- unstable outputs
- difficult debugging
```

---

# Failed Prompt Strategy #2

## Extremely Short Prompts

### Example

```text
Analyze these reviews.
```

---

## Problems

Outputs became:
```text
- generic
- repetitive
- low signal
- lacking business insight
```

The model needed:
```text
role framing + constraints + schema guidance
```

---

# Failed Prompt Strategy #3

## Asking for “Human-Like” Tone

### Example

```text
Write naturally and conversationally.
```

---

## Problems

The model:
- added fluff
- produced marketing language
- became less structured
- made parsing unreliable

For backend systems:
```text
structured > conversational
```

---

# Key Prompt Engineering Lessons

# What Improved Reliability Most

## 1. JSON Schemas

Strong schemas reduced:
- hallucinations
- formatting issues
- frontend parsing bugs

---

## 2. Task Separation

Splitting prompts into:
- sentiment
- pricing
- fraud
- recommendations

improved:
```text
accuracy
debuggability
cost efficiency
```

---

## 3. Explicit Constraints

The best instruction was:

```text
“Do not invent data.”
```

This reduced fabricated insights significantly.

---

## 4. Role-Based Framing

Prompts improved when the model was assigned a role like:
```text
- ecommerce analyst
- pricing analyst
- trust analyst
```

This created:
- sharper outputs
- domain-specific language
- more actionable recommendations

---

# Final Prompt Design Philosophy

The final architecture optimized for:

```text id="4chp7w"
✔ structured outputs
✔ predictable parsing
✔ low hallucination risk
✔ actionable recommendations
✔ modular prompt design
✔ low token cost
✔ scalable audit generation
```

---

# Future Prompt Improvements

## Planned Enhancements

```text id="fcdf9t"
- few-shot examples
- confidence scoring
- retrieval-augmented prompting
- dynamic prompt compression
- fine-tuned fraud classification
- benchmark-based scoring prompts
```

---

# Final Takeaway

The biggest lesson was:

```text
LLMs perform far better
when treated like structured systems
instead of creative chatbots.
```

The final prompts intentionally prioritize:
- precision
- consistency
- parseability
- operational reliability

over:
- conversational style
- verbose explanations
- “human-like” writing
```