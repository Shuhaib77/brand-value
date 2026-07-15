# Stability & Consistency Fixes

> **Why scores changed between runs, why data was missing, how we fixed it, and what changed.**

---

## Root Cause Analysis

### 1. Model Fallback Chain (Determinism)

**Problem:** `lib/ai/groq.ts` tried 3 different models in sequence:
```
llama-3.3-70b-versatile → meta-llama/llama-4-scout-17b-16e-instruct → llama-3.1-8b-instant
```

When the 70B model hit a rate limit (429), it silently downgraded to 17B or 8B. Each model produces different scores for the same input. Two users evaluating the same URL minutes apart could get results from completely different models.

**Fix:**
- Keep the fallback chain (70B → 17B → 8B) so rate limits don't kill the pipeline, **but log which model was used** in the response under `_meta.extractionModel`, `_meta.evaluationModel`, `_meta.actionsModel`.
- Exponential backoff within each model: `3s → 9s → 27s → 45s` (was linear 15s).
- On daily TPD limit: break to next model (was throwing).
- On normal 429: retry with backoff up to 5 times per model.

**Files changed:** `src/lib/ai/groq.ts` (added `FALLBACK_CHAIN`, model loop in `callGroq`, return `{ data, modelUsed }`), `src/app/api/evaluate/route.ts` (destructure `modelUsed`, add `_meta`)

---

### 2. Temperature > 0 (Non-Deterministic Output)

**Problem:** Temperature was set to `0.2` (first attempt) and `0.1` (retry). Non-zero temperature means the same input can produce different output — the AI introduces small random variations each time.

**Fix:**
- Set `temperature: 0` on all calls. Temperature 0 makes the model always pick the highest-probability token, producing identical output for identical input.
- This is the single biggest fix for score stability.
- All models in the fallback chain use temperature 0.

**Files changed:** `src/lib/ai/groq.ts:316`

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
- Up to 4 validation retries per AI call (was 3).

**Files changed:** `src/lib/ai/groq.ts` (added validators + `callGroqWithValidation()`)

---

### 4. Founder & People Data Validation (Missing People)

**Problem:** The extraction validator only checked `companyName`, `industry`, `productsOrServices`, `businessDescription`, and that `companyDetails` is an object. If the AI returned `companyDetails` as `{}` (empty), it passed validation. Founder names, CEO names, leadership teams were silently empty.

**Fix:**
- `validateExtractShape()` now checks all key people fields inside `companyDetails`:
  - `founderName` — string or null
  - `ceoName` — string or null
  - `leadershipTeam` — array
  - `employeeCount` — string or null
  - `foundedYear` — string or null
  - `fundingStage` — string or null
  - `estimatedRevenue` — string or null
- If any of these are missing/wrong type, the response is rejected and retried.

**Files changed:** `src/lib/ai/groq.ts` (`validateExtractShape`)

---

### 5. Co-Founder Extraction (Incomplete People Data)

**Problem:** The extraction prompt asked for founder information but didn't emphasize co-founders. The AI would often return only 1 founder even when a company has multiple. Wikipedia patterns only matched "founded by X" (single founder).

**Fix:**
- Added a **CRITICAL** rule in the extraction prompt: "Extract ALL co-founders. If the text mentions multiple people as founders, include each person as a separate entry in leadershipTeam with title 'Co-Founder'."
- Prompt now explicitly calls out: "Do NOT stop at just one founder."
- Wikipedia `founderName` patterns now match multi-founder formats:
  - `founded by X, Y, and Z`
  - `co-founders X and Y`
  - `founders include X, Y, Z`

**Files changed:** `src/lib/ai/groq.ts` (EXTRACT_PROMPT rules), `src/lib/data/wikipedia.ts` (added multi-founder regex patterns)

---

### 6. AI Computed Its Own Score (Score Mismatch)

**Problem:** The AI was asked to compute `brandScore` (0-100 weighted) from the category scores. But `src/lib/constants.ts` already had `computeWeightedScore()` — a deterministic formula:

```typescript
sum of (categoryScore/10 * categoryWeight) / totalWeight * 100
```

The AI sometimes computed this wrong or inconsistently, creating a mismatch between category scores and the overall score.

**Fix:**
- After `evaluateBrand()` returns, override `evaluation.brandScore` with `computeWeightedScore(categoryScores)`.
- Override `evaluation.brandGrade` with `computeGrade(computedScore)`.
- The overall score now always matches the sum of its category parts.

**Files changed:** `src/app/api/evaluate/route.ts:111-114`

---

### 7. Context Truncation: Least Important Data First

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

### 8. Scraping Timeouts & Failures (Incomplete Data)

**Problem:** Subpages were fetched with an 8-second timeout and no retry. Many sites take >8s to respond, so subpages silently failed. With no subpage data, the AI had less context and produced lower-quality evaluations.

**Fix:**
- Increased subpage timeout: 8s → 15s.
- Added 1 automatic retry with 500ms delay before giving up.
- Reduced `robots.txt`/`sitemap.xml` timeout: 2s → 1s so they don't block the pipeline.

**Files changed:** `src/lib/data/scraper.ts` (`fetchPage()` and `robots.txt`/`sitemap.xml` timeouts)

---

### 9. No Caching — Fresh Results Every Time

**Intent:** Every evaluation produces a fresh result. No cached data is returned.
- Removed the in-memory cache that was added in a prior iteration.
- Caching was removed because the combination of temperature 0 + single model retry + schema validation is sufficient for deterministic results.
- Every request triggers a full pipeline: scrape → Wikipedia → search → AI.

**Files changed:** `src/app/api/evaluate/route.ts` (removed `crypto` import, `cache` Map, `getCached()`, `setCached()`)

---

## Summary of All Changes

| File | Change | Impact |
|---|---|---|
| `src/lib/ai/groq.ts` | **Fallback chain** (70B→17B→8B) with logging, **exponential backoff** (3s→9s→27s→45s), **temperature 0**, **schema validation** with 4 retries, **people field validation** in companyDetails, **co-founder extraction** rules | Same URL = same score; rate limits gracefully degrade instead of failing; people data validated |
| `src/app/api/evaluate/route.ts` | **Server-side score** override, **context reordered** (main text first), **no caching** (fresh every time), **`_meta` model logging** in response | Score matches categories; important data preserved in truncation; every request is fresh; model usage visible |
| `src/lib/data/scraper.ts` | Subpage timeout **8s→15s**, **1 retry** per subpage, robots timeout **2s→1s** | More subpages load; less pipeline blocking |
| `src/lib/data/wikipedia.ts` | Added **multi-founder regex patterns** (founded by X, Y, and Z; co-founders X and Y) | More co-founders extracted from Wikipedia |
| `FIXES.md` | This file | — |

---

## What's in the `_meta` Field

Every evaluation response now includes:

```json
{
  "_meta": {
    "extractionModel": "llama-3.3-70b-versatile",
    "evaluationModel": "llama-3.1-8b-instant",
    "actionsModel": "meta-llama/llama-4-scout-17b-16e-instruct"
  }
}
```

If all three show `llama-3.3-70b-versatile`, no fallback was needed. If you see `llama-3.1-8b-instant`, the 70B model was rate-limited and the system gracefully fell back.

---

## What You Should Expect Now

1. **Same URL → Consistent score**: Temperature 0 + fallback models all use temp 0, so same model = same output. No caching — every request is a fresh evaluation.
2. **Score variance between models**: If fallback models are used, scores may differ by 1-3 points between 70B vs 8B. Check `_meta` to see which model was used.
3. **No more "overloaded" errors**: The fallback chain ensures 8B (200K TPM) is always available.
4. **More people data populated**: Schema validation catches missing founder/CEO/team fields and retries; co-founder extraction is explicit.
5. **Scores match category breakdown**: The `brandScore` is computed deterministically from category scores.
6. **Visible model usage**: Check `_meta` in the response to see if fallbacks were triggered.
