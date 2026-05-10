# TESTS.md

# Automated Test Coverage

This document lists all automated tests written for the audit engine.

The tests are focused on validating:
- audit scoring logic
- fake review detection
- sentiment analysis
- pricing comparison
- API response handling
- edge-case behavior

All tests are executable and designed to run using Jest.

---

# Test Framework

```bash
Jest
```

---

# Run All Tests

```bash
npm test
```

---

# Run Specific Test File

```bash
npm test tests/auditEngine.test.js
```

---

# Test Directory Structure

```text
tests/
│
├── auditEngine.test.js
├── sentimentAnalysis.test.js
├── fakeReviewDetection.test.js
├── pricingAnalysis.test.js
├── auditApi.test.js
└── edgeCases.test.js
```

---

# 1. auditEngine.test.js

## What It Covers

Core audit scoring engine logic.

Tests:
- final trust score generation
- weighted score calculations
- negative review impact
- score normalization
- audit result formatting

---

## Example Assertions

```text
✔ returns valid trust score
✔ score stays between 0–100
✔ negative reviews reduce score
✔ high sentiment improves score
✔ audit object contains required fields
```

---

## Run

```bash
npm test tests/auditEngine.test.js
```

---

# 2. sentimentAnalysis.test.js

## What It Covers

Sentiment analysis pipeline.

Tests:
- positive review classification
- negative review classification
- neutral review handling
- sentiment aggregation
- mixed-review scoring

---

## Example Assertions

```text
✔ positive review returns positive sentiment
✔ negative review reduces sentiment score
✔ neutral review handled correctly
✔ average sentiment calculated accurately
```

---

## Run

```bash
npm test tests/sentimentAnalysis.test.js
```

---

# 3. fakeReviewDetection.test.js

## What It Covers

Fake/spam review detection system.

Tests:
- duplicate review detection
- suspicious keyword patterns
- review burst detection
- repeated phrase detection
- trust penalty calculation

---

## Example Assertions

```text
✔ duplicate reviews flagged
✔ suspicious reviews lower trust score
✔ burst activity detected correctly
✔ spam phrases identified
```

---

## Run

```bash
npm test tests/fakeReviewDetection.test.js
```

---

# 4. pricingAnalysis.test.js

## What It Covers

Competitor pricing comparison logic.

Tests:
- pricing difference calculations
- underpriced product detection
- overpriced product detection
- competitor average computation
- recommendation generation

---

## Example Assertions

```text
✔ calculates competitor average price
✔ identifies overpriced products
✔ identifies underpriced products
✔ returns pricing recommendation
```

---

## Run

```bash
npm test tests/pricingAnalysis.test.js
```

---

# 5. auditApi.test.js

## What It Covers

Audit API endpoint behavior.

Tests:
- successful audit response
- invalid request handling
- missing field validation
- API status codes
- response structure validation

---

## Example Assertions

```text
✔ returns HTTP 200 for valid request
✔ returns HTTP 400 for bad input
✔ response contains audit score
✔ response contains recommendations
```

---

## Run

```bash
npm test tests/auditApi.test.js
```

---

# 6. edgeCases.test.js

## What It Covers

Edge-case and failure handling.

Tests:
- empty reviews
- malformed data
- extremely large review datasets
- API timeout simulation
- null value handling

---

## Example Assertions

```text
✔ empty review arrays handled safely
✔ malformed input does not crash engine
✔ timeout errors handled gracefully
✔ null values sanitized correctly
```

---

## Run

```bash
npm test tests/edgeCases.test.js
```

---

# Example Test Command Output

```bash
PASS  tests/auditEngine.test.js
PASS  tests/sentimentAnalysis.test.js
PASS  tests/fakeReviewDetection.test.js
PASS  tests/pricingAnalysis.test.js
PASS  tests/auditApi.test.js
PASS  tests/edgeCases.test.js

Test Suites: 6 passed, 6 total
Tests:       32 passed, 32 total
Snapshots:   0 total
Time:        2.31s
```

---

# Why These Tests Matter

The audit engine directly affects:
- trust scoring
- AI recommendations
- conversion insights
- financing qualification signals

Testing ensures:
```text
- scoring consistency
- API reliability
- stable audit generation
- safe handling of malformed inputs
- trustworthy analytics output
```

---

# Future Testing Improvements

```text
- load testing with k6
- AI response snapshot testing
- integration testing with Supabase
- end-to-end Playwright tests
- queue/worker stress testing
- caching layer validation
```