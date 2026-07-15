# Stability & Consistency Fixes

> **Why scores changed between runs, why data was missing, and how we fixed it.**

---

## Root Cause Analysis

### 1. Model Fallback Chain (Determinism)

**Problem:** `lib/ai/groq.ts` tried 3 different models in sequence:
```
llama-3.3-70b-versatile → meta-llama/llama-4-scout-17b-16e-instruct → llama-3.1-8b-instant
```

When the 70B model hit a rate limit (429), it silently downgraded to 17B or 8B. Each model produces different scores for the same input. Two users evaluating the same URL minutes apart could get results from completely different models.

**Fix:**
- Removed all model fallback logic. Use only `llama-3.3-70b-versatile`.
- On 429 rate limit, retry with exponential backoff (15s → 30s → 45s).
- On daily TPD limit, throw a clear error instead of downgrading.
- Logged warnings so you know when rate limiting is active.

**Files changed:** `src/lib/ai/groq.ts`

---

### 2. Temperature > 0 (Non-Deterministic Output)

**Problem:** Temperature was set to `0.2` (first attempt) and `0.1` (retry). Non-zero temperature means the same input can produce different output — the AI introduces small random variations each time.

**Fix:**
- Set `temperature: 0` on all calls. Temperature 0 makes the model always pick the highest-probability token, producing identical output for identical input.
- This is the single biggest fix for score stability.

**Files changed:** `src/lib/ai/groq.ts:42`

---

### 3. No JSON Schema Validation (Silent Data Loss)

**Problem:** The AI response was accepted with just `JSON.parse(text)` — no check that the structure was correct. If the AI returned:
- Missing `categoryScores` → JavaScript reads `undefined`, component shows blank
- Missing `strengths`/`weaknesses` → arrays are `undefined`, map() crashes silently
- Partial `companyDetails` → some fields show null, others are missing

These went undetected and reached the user as "missing data."

**Fix:**
- Added 3 schema validators: `validateExtractShape()`, `validateEvaluateShape()`, `validateActionsShape()`.
- Each checks all required fields exist with correct types.
- On validation failure, retry with a specific hint about what was missing.
- Up to 3 validation retries per AI call.

**Files changed:** `src/lib/ai/groq.ts` (added validators + `callGroqWithValidation()`)

---

### 4. AI Computed Its Own Score (Score Mismatch)

**Problem:** The AI was asked to compute `brandScore` (0-100 weighted) from the category scores. But `src/lib/constants.ts` already had `computeWeightedScore()` — a deterministic formula:

```typescript
sum of (categoryScore/10 * categoryWeight) / totalWeight * 100
```

The AI sometimes computed this wrong or inconsistently, creating a mismatch between category scores and the overall score.

**Fix:**
- After `evaluateBrand()` returns, override `evaluation.brandScore` with `computeWeightedScore(evaluation.categoryScores)`.
- Override `evaluation.brandGrade` with `computeGrade(computedScore)`.
- The overall score now always matches the sum of its category parts.

**Files changed:** `src/app/api/evaluate/route.ts:91-93`

---

### 5. Context Truncation: Least Important Data First

**Problem:** The context passed to the AI was truncated to 35K chars. The data was ordered with subpages and reviews first, and the main website text last. When truncation happened, the most important data (main page content) was cut off first.

**Fix:**
- Reordered context so the most impactful data appears first:
  1. Main website text (most important)
  2. Wikipedia data
  3. Web search results
  4. Technical checks / trust signals
  5. Extracted team members and testimonials
  6. Subpage content (least important)
  7. Questionnaire answers
- Truncation now removes subpages and reviews first, preserving core content.

**Files changed:** `src/app/api/evaluate/route.ts` (reordered `extractionInput` and `evaluationInput`)

---

### 6. Scraping Timeouts & Failures (Incomplete Data)

**Problem:** Subpages were fetched with an 8-second timeout and no retry. Many sites take >8s to respond, so subpages silently failed. With no subpage data, the AI had less context and produced lower-quality evaluations.

**Fix:**
- Increased subpage timeout: 8s → 15s.
- Added 1 automatic retry with 500ms delay before giving up.
- Reduced `robots.txt`/`sitemap.xml` timeout: 2s → 1s so they don't block the pipeline.

**Files changed:** `src/lib/data/scraper.ts` (`fetchPage()` and `robots.txt`/`sitemap.xml` timeouts)

---

### 7. No Caching (Fresh Results Every Time)

**Problem:** Every evaluation started from scratch. Even evaluating the same URL 1 minute apart would produce different results because:
- Web search results change slightly
- Scraping may succeed or fail differently
- Rate limits may or may not be active

**Fix:**
- Added an in-memory cache (`Map<string, { result, timestamp }>`) keyed by URL hash.
- TTL: 15 minutes — same URL within 15 minutes returns the cached result.
- Cache eviction: max 100 entries, oldest removed first.
- Logged when cache is hit so you can see it working.

**Files changed:** `src/app/api/evaluate/route.ts` (added `cache`, `getCached()`, `setCached()`)

---

## Summary of Changes

| File | What Changed | Impact |
|---|---|---|
| `src/lib/ai/groq.ts` | Single model, temp=0, schema validation, retry with hints | Same URL = same score; missing fields retried |
| `src/app/api/evaluate/route.ts` | Server-side brandScore, context reordered, caching | Score matches categories; important data preserved; same URL cached 15min |
| `src/lib/data/scraper.ts` | 8s→15s timeout, 1 retry per subpage, 2s→1s robots timeout | More subpages load; less pipeline blocking |
| `FIXES.md` | This file | — |

---

## What You Should Expect Now

1. **Same URL → Same score** (within 15 minutes): Caching ensures identical results.
2. **Same URL → Similar score** (after 15 minutes): Temperature 0 + single model means scores should be within 1-2 points, not 10-20 points apart.
3. **More data populated**: Schema validation catches missing fields and retries; scraping is more resilient.
4. **Scores match category breakdown**: The `brandScore` is now computed deterministically from category scores.
5. **Better error messages**: Daily TPD limit gives a clear error instead of silently switching to a worse model.
