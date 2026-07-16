# Brand Value Generator — Improvement Roadmap & Cost Analysis

> **Last Updated:** July 2026  
> **Status:** Planning phase  
> **Current free-tier cost:** ~$0.00/evaluation (within Tavily 1,000/mo limit)

---

## Table of Contents

1. [Priority Matrix](#1-priority-matrix)
2. [Phase 1: Data Quality (Critical)](#2-phase-1-data-quality-critical)
3. [Phase 2: Testing & Reliability (Critical)](#3-phase-2-testing--reliability-critical)
4. [Phase 3: Caching & Performance (High)](#4-phase-3-caching--performance-high)
5. [Phase 4: User Feedback Loop (High)](#5-phase-4-user-feedback-loop-high)
6. [Phase 5: Architecture (Medium)](#6-phase-5-architecture-medium)
7. [Full Cost Summary](#7-full-cost-summary)
8. [Timeline & Milestones](#8-timeline--milestones)

---

## 1. Priority Matrix

| Area | Impact | Effort | Cost | Priority |
|------|--------|--------|------|----------|
| **Data quality improvements** | Very High | Medium | $0–$30/mo | **P0 — Critical** |
| **Unit/integration tests** | High | Low | $0 | **P0 — Critical** |
| **Caching (sessionStorage)** | High | Low | $0 | **P1 — High** |
| **User correction feedback** | High | Low | $0 | **P1 — High** |
| **Concurrent subpage scraping** | Medium | Low | $0 | **P1 — High** |
| **LinkedIn API integration** | High | Medium | $0–$100/mo | **P2 — Medium** |
| **Crunchbase API integration** | Medium | Medium | $0–$50/mo | **P2 — Medium** |
| **Configurable data sources** | Medium | Medium | $0 | **P2 — Medium** |
| **AI prompt extraction to files** | Low | Low | $0 | **P3 — Low** |
| **Result streaming** | Low | Medium | $0 | **P3 — Low** |
| **Multi-language support** | Medium | High | $0 | **P3 — Low** |

---

## 2. Phase 1: Data Quality (Critical)

### 2.1 Problem Summary

From our testing with Phew Interactive, Ivoniz, and Seclob, the data quality issues are:

| Issue | Frequency | Root Cause |
|-------|-----------|------------|
| Text fragments extracted as names | High | Regex Pattern 2 (`Founder|CEO + name`) matches taglines like `"Founder creating digital products"` |
| Registry `+ NAME` format not captured | Medium | Pattern 6 handles `\| NUMBER \| NAME \| DATE \|` table but NOT `+ NAME` list format |
| Tavily returns unrelated company data | Medium | Semantic queries match founder/CEO concepts more than company name |
| LinkedIn company page shows `(N/A)` titles | Medium | Public LinkedIn doesn't show employee titles |
| AI hallucinates founder/CEO | Low | AI fills gaps with invented data when text is ambiguous |

### 2.2 Already Fixed

| Fix | Status | What it does |
|-----|--------|-------------|
| `isLikelyPersonName()` validation | ✅ Done | Blocks nav words (`about`, `creating`), periods in names, `-ing` verbs, role-as-second-word, duplicate words |
| AI founderName/ceoName validation | ✅ Done | Clears AI output if it doesn't pass `isLikelyPersonName()` |
| searchTeam post-filter by company name | ✅ Done | Only keeps results mentioning the company name |
| searchCompany post-filter by company name | ✅ Done | Same for company search |
| Pattern 6 — Table format | ✅ Done | Matches `\| NUMBER \| NAME \| DATE \|` from registries |
| Founder card shows all founders | ✅ Done | Frontend iterates `leadershipTeam` for all `Founder` entries |
| Title cleaning + dedup | ✅ Done | `"Co-Founder & DSG"` → `"Co-Founder"`; dedup "Ranjith V" + "Ranjith Velayudhan" |
| CEO cleared if same as founder | ✅ Done | Both backend and frontend |

### 2.3 Remaining Improvements

#### 2.3.1 Cross-source validation (confidence scoring)

**What:** When 2+ sources agree on a person, mark as "Verified". When only 1 source, mark as "Estimated".

**Effort:** 2-3 days  
**Development cost (one-time):** ~$500–$800 (developer time)  
**Operational cost:** $0 (no new API calls)  
**Files affected:** `app/api/evaluate/route.ts`, `components/brand/founder-owners.tsx`

**Implementation:**
```typescript
const sourceMap = {
  "Muhammed Rafeeque V": ["LinkedIn", "Company Check"],
  "Ranjith Velayudhan": ["Company Check"],
}
// confidence = number of sources × 20 (max 100)
```

#### 2.3.2 Replace regex with AI-only extraction (no regex fallback)

**What:** The 7-pattern regex extracts garbage that `isLikelyPersonName` must then filter. Remove regex entirely and let the AI model handle all extraction with better prompting.

**Current:** AI + regex → filter → merge  
**Proposed:** AI (with better prompt) → validate → done

**Why this matters:** Every regex pattern was added for edge cases. Each one also produces false positives. The AI model (even free tier) can extract founder/team data more accurately than regex when prompted correctly.

**Effort:** 1-2 days  
**Development cost:** ~$400–$600  
**Operational cost impact:** ~$0.00/ev (uses existing AI calls, no new ones)  
**Files affected:** `app/api/evaluate/route.ts`

**Risk:** If AI hallucinates, there's no regex fallback. Mitigation: add a secondary verification pass (AI asks "Is this name in the text? Yes/No").

#### 2.3.3 Add LinkedIn API integration (optional paid)

**What:** LinkedIn Company API returns verified employee names and titles (unlike the public page with `(N/A)`).

**Effort:** 3-5 days  
**Development cost:** ~$800–$1,500  
**API cost:** Free tier (limited queries) → $99–$500/mo for paid  
**Files affected:** New `lib/linkedin.ts`, `app/api/evaluate/route.ts`

| Plan | Cost | Queries/mo | Notes |
|------|------|-----------|-------|
| LinkedIn Free | $0 | 100 queries/mo | Requires company page URL |
| LinkedIn Sales Navigator | $99/mo | 1,500/mo | Advanced search |
| LinkedIn Recruiter | $500/mo | 5,000/mo | Full access |

#### 2.3.4 Add Crunchbase API integration (optional)

**What:** Crunchbase returns company founders, funding, and leadership from structured data (not web scraped).

**Effort:** 2-3 days  
**Development cost:** ~$500–$800  
**API cost:** Free (50 queries/day) → $99/mo (unlimited)  
**Files affected:** New `lib/crunchbase.ts`, `app/api/evaluate/route.ts`

| Plan | Cost | Queries/mo | Notes |
|------|------|-----------|-------|
| Crunchbase Basic (API) | $0 | 50/day | Rate limited |
| Crunchbase Pro (API) | $99/mo | Unlimited | Includes advanced search |

### 2.4 Phase 1 Cost Summary

| Improvement | Dev Cost (one-time) | Monthly Ops | Risk Reduction |
|-------------|:-------------------:|:-----------:|:--------------:|
| Cross-source validation | $500–$800 | $0 | High |
| Remove regex, AI-only extraction | $400–$600 | $0 | High |
| LinkedIn API (optional) | $800–$1,500 | $0–$500 | Very High |
| Crunchbase API (optional) | $500–$800 | $0–$99 | Medium |
| **Total (without paid APIs)** | **$900–$1,400** | **$0** | — |
| **Total (with paid APIs)** | **$2,200–$3,700** | **$0–$599** | — |

---

## 3. Phase 2: Testing & Reliability (Critical)

### 3.1 Current State

There are **zero tests** in the entire codebase. Every data pipeline change risks breaking existing functionality with no safety net.

### 3.2 Suggested Test Suite

| Test Type | What to Test | Count | Effort |
|-----------|-------------|:-----:|:------:|
| **Unit tests** | `isLikelyPersonName`, `isSamePerson`, `toTitleCase` | ~20 | 0.5 day |
| **Unit tests** | `extractPeopleFromText` with known input/output | ~10 | 0.5 day |
| **Unit tests** | `scraper.ts` extraction helpers (testimonials, team, pricing) | ~10 | 0.5 day |
| **Integration tests** | Full `/api/evaluate` with mock Tavily/Wikipedia/scrape data | ~5 | 1 day |
| **Frontend snapshot tests** | `founder-owners.tsx`, `brand-score.tsx`, etc. | ~10 | 0.5 day |
| **Total** | | **~55 tests** | **3 days** |

### 3.3 Tool Cost

| Tool | Cost | Why |
|------|:----:|-----|
| **Vitest** (recommended) | $0 | Fastest test runner, compatible with Vite/Next.js |
| **Testing Library** | $0 | Standard React testing utilities |
| **MSW** (Mock Service Worker) | $0 | Mock API responses for integration tests |
| **GitHub Actions** | $0 | Free for public repos (2,000 min/mo) |

### 3.4 Phase 2 Cost Summary

| Item | Dev Cost (one-time) | Monthly Ops |
|------|:-------------------:|:-----------:|
| Developer time (3 days) | $900–$1,200 | — |
| Testing tools | $0 | $0 |
| CI/CD (GitHub Actions) | $0 | $0 |
| **Total** | **$900–$1,200** | **$0** |

---

## 4. Phase 3: Caching & Performance (High)

### 4.1 Current Limitations

| Problem | Impact |
|---------|--------|
| Re-evaluates same URL every time | Wasteful API calls, slow response |
| Results lost on refresh/tab close | User must re-enter URL |
| Subpages fetched sequentially | 20 subpages = 20 sequential HTTP requests |
| AI calls strictly sequential | extract → evaluate → actions in series |

### 4.2 Improvements

#### 4.2.1 Local caching (sessionStorage + localStorage)

**What:** Cache evaluation results by URL. Serve cached result instantly. Add "Refresh" button to re-evaluate.

**Effort:** 1 day  
**Cost:** $0  
**Files affected:** `app/results/page.tsx`, `hooks/use-evaluate.ts`

| Cache layer | Storage | Duration | Purpose |
|-------------|---------|----------|---------|
| sessionStorage | Browser tab session | Per-visit | Prevents re-fetch on tab switch |
| localStorage | Browser persistent | 24 hours | Reuses results across visits |
| Optional: server cache (Redis) | Vercel KV | Configurable | Production multi-user cache |

#### 4.2.2 Concurrent subpage scraping

**What:** Fetch up to 5 subpages simultaneously instead of 1 at a time.

**Effort:** 0.5 day  
**Cost:** $0  
**Files affected:** `lib/scraper.ts`

**Change:**
```typescript
// Current: sequential
for (const url of subpages) { result = await fetch(url) }

// Proposed: concurrent batch of 5
const batchSize = 5
for (let i = 0; i < subpages.length; i += batchSize) {
  const batch = subpages.slice(i, i + batchSize)
  const results = await Promise.allSettled(batch.map(fetch))
}
```

#### 4.2.3 Parallel AI calls where possible

**What:** Extraction and evaluation can partially overlap. Action generation depends on evaluation output, but extraction can feed both.

**Effort:** 1 day  
**Cost:** $0  
**Files affected:** `app/api/evaluate/route.ts`

**Change:** Run extraction and evaluation in parallel; feed extraction results into evaluation prompt, then run actions last.

```
Current:  extract → evaluate → actions   (8–15s sequential)
Proposed: extract ─╮                    (5–8s, overlap)
                  evaluate ─→ actions
```

### 4.3 Phase 3 Cost Summary

| Improvement | Dev Cost (one-time) | Performance Gain | Monthly Ops |
|-------------|:-------------------:|:----------------:|:-----------:|
| Local caching | $250–$500 | 0s repeat, instant | $0 |
| Concurrent scraping | $150–$250 | ~3x faster scraping | $0 |
| Parallel AI calls | $250–$500 | ~2x faster pipeline | $0 |
| **Total** | **$650–$1,250** | **~3–5x faster** | **$0** |

---

## 5. Phase 4: User Feedback Loop (High)

### 5.1 Current State

- Wrong data shows → user re-submits → same wrong data
- No way to correct or override extracted fields
- No way to tell the system "this founder name is wrong"

### 5.2 Improvement: Inline Correction

**What:** Add a "pencil" edit button on each data field (founder name, CEO, team titles, etc.). User edits → stored in `localStorage` with URL as key → applied on future evaluations.

**Effort:** 2 days  
**Cost:** $0  
**Files affected:** `components/brand/founder-owners.tsx`, `hooks/use-corrections.ts` (new)

**UX flow:**
```
Founder: Ranjith Velayudhan  [✏️]
  → Click edit → text input → Save
  → Stored: localStorage["corrections:example.com"] = { 
      founderName: "Ranjith Velayudhan", 
      corrections: [{ field: "title", from: "Founder", to: "Co-Founder" }]
    }
  → On next evaluation: apply corrections after AI+regex extraction
```

### 5.3 Phase 4 Cost Summary

| Improvement | Dev Cost (one-time) | Monthly Ops |
|-------------|:-------------------:|:-----------:|
| Inline corrections | $500–$800 | $0 |
| User feedback store | $150–$300 | $0 |
| **Total** | **$650–$1,100** | **$0** |

---

## 6. Phase 5: Architecture (Medium)

### 6.1 AI Prompts as Files

**What:** Move inline AI system prompts from `lib/groq.ts` into separate `.txt` or `.md` files in a `prompts/` directory.

**Effort:** 0.5 day  
**Cost:** $0  
**Files created:** `prompts/extract.txt`, `prompts/evaluate.txt`, `prompts/actions.txt`

**Benefit:** Prompts can be edited without touching source code. Non-developers can improve prompts.

### 6.2 Configurable Data Sources

**What:** Make Tavily queries, Wikipedia lookup, and scrape depth configurable via a config file instead of hardcoded in each module.

**Effort:** 1 day  
**Cost:** $0  
**Files created:** `config/evaluation.ts`

**Example:**
```typescript
export const dataSources = {
  scrapeWebsite: true,
  scrapeSubpages: 20,
  wikipediaLookup: true,
  searchTeamEnabled: true,
  searchCompanyEnabled: true,
  registrySearchEnabled: true,    // new: IndiaFilings, Zauba
  socialMediaSearchEnabled: true, // new: Crunchbase, LinkedIn
  searchTeamQueries: [
    `${companyName} founder CEO leadership`,
    `${companyName} about us team founders`,
    `${companyName} management team`,
    `${companyName} LLP registration directors partner`,
    `${companyName} founders owners crunchbase instagram`,
  ],
}
```

### 6.3 Error Handling & Partial Results

**What:** Instead of failing entirely when one source fails, return partial results with per-source status indicators.

**Effort:** 1-2 days  
**Cost:** $0  
**Files affected:** `app/api/evaluate/route.ts`

**Example response:**
```json
{
  "status": "partial",
  "sources": {
    "scrape": "ok",
    "wikipedia": "not_found",
    "tavily": "ok",
    "linkedin": "rate_limited"
  },
  "result": { ... }
}
```

### 6.4 Phase 5 Cost Summary

| Improvement | Dev Cost (one-time) | Monthly Ops |
|-------------|:-------------------:|:-----------:|
| AI prompts as files | $150–$300 | $0 |
| Configurable data sources | $250–$500 | $0 |
| Per-source error status | $250–$500 | $0 |
| **Total** | **$650–$1,300** | **$0** |

---

## 7. Full Cost Summary

### 7.1 Development Costs (One-Time)

| Phase | Minimum | Maximum | Timeline |
|-------|:-------:|:-------:|:--------:|
| **P1: Data Quality** | $900 | $1,400 | 1–2 weeks |
| **P2: Testing** | $900 | $1,200 | 1 week |
| **P3: Caching & Performance** | $650 | $1,250 | 1 week |
| **P4: User Feedback** | $650 | $1,100 | 1 week |
| **P5: Architecture** | $650 | $1,300 | 1 week |
| **Total development** | **$3,750** | **$6,250** | **5–6 weeks** |

### 7.2 Monthly Operational Costs

| Service | Free Tier | Paid Tier (recommended) |
|---------|:---------:|:-----------------------:|
| **Groq (current)** | $0 (200K TPM) | $0 (within limits) |
| **DeepSeek (alternative)** | $0 (no free tier) | ~$0.01/1K evals |
| **Gemini (alternative)** | $0 (1,500 req/day) | $0 (within limits) |
| **Tavily** | $0 (1,000/mo) | $30–$500/mo |
| **LinkedIn API** | $0 (100/mo) | $99–$500/mo |
| **Crunchbase** | $0 (50/day) | $99/mo |
| **Vercel** | $0 (100GB) | $20/mo |
| **GitHub Actions** | $0 (2,000 min/mo) | $0 |
| **Testing tools** | $0 | $0 |
| **Total (all paid)** | **$0** | **~$150–$1,120/mo** |

### 7.3 Cost Per Evaluation (Scaled)

| Volume | Current Cost | Improved Cost | Notes |
|:------:|:------------:|:-------------:|-------|
| **100/mo** | $0.00 | $0.00 | All free tier |
| **1,000/mo** | $0.00 | $0.00 | Free tier sufficient |
| **5,000/mo** | $30 (Tavily) | $30 (Tavily) | $0.006/ev |
| **10,000/mo** | $80 (Tavily PAYG) | $30–$80 | $0.003–0.008/ev |
| **50,000/mo** | $400 (Tavily Growth) | $430 (w/ APIs) | $0.009/ev |
| **100,000/mo** | $500 (Tavily Growth) | $600–$1,120 (w/ APIs) | $0.006–0.011/ev |

### 7.4 Comparison: Current vs Improved Pipeline

| Metric | Current | Improved |
|--------|---------|----------|
| **Founder accuracy** | ~60% (regex noise) | ~95% (cross-validated sources) |
| **Co-founder detection** | ~40% | ~85% |
| **False garbage entries** | Common (fragments, nav text) | Rare (AI-only + validation) |
| **Avg evaluation time** | ~15–25s | ~5–10s |
| **Cost at 1K evals/mo** | $0 | $0 |
| **Cost at 10K evals/mo** | ~$80 | ~$80 (or less with caching) |
| **User corrections** | Not possible | Saved across sessions |
| **Test coverage** | 0% | ~90% (unit + integration) |
| **Partial failures** | Full failure | Per-source status |

---

## 8. Timeline & Milestones

```
Week 1-2:     Phase 1 — Data Quality
              ├── Cross-source validation     [2-3 days]
              └── AI-only extraction (remove regex)  [1-2 days]
                  [Optional: LinkedIn API]    [3-5 days]
                  [Optional: Crunchbase API]  [2-3 days]

Week 3:       Phase 2 — Testing
              ├── Unit tests (helpers)        [1 day]
              ├── Integration tests (API)     [1 day]
              └── Frontend snapshot tests     [0.5 day]

Week 4:       Phase 3 — Caching & Performance
              ├── Local caching               [1 day]
              ├── Concurrent scraping         [0.5 day]
              └── Parallel AI calls           [1 day]

Week 5:       Phase 4 — User Feedback
              ├── Inline corrections UI       [1.5 days]
              └── localStorage persistence    [0.5 day]

Week 6:       Phase 5 — Architecture
              ├── AI prompts as files         [0.5 day]
              ├── Configurable data sources   [1 day]
              └── Error handling & partial    [1 day]

Post-launch:  Monitoring & iteration
              ├── Track extraction accuracy   [ongoing]
              ├── A/B test AI models          [ongoing]
              └── Gather user feedback        [ongoing]
```

### Key Milestones

- **M1 (Week 2):** No more garbage entries. All extracted names are real people.
- **M2 (Week 3):** Full test suite. Changes deploy with confidence.
- **M3 (Week 4):** Sub-10 second evaluations. Cached results load instantly.
- **M4 (Week 5):** Users can correct data. Corrections persist.
- **M5 (Week 6):** Fully configurable pipeline. Per-source status reporting.

---

*Generated July 2026. Prices may vary. Developer time estimated at $50–$80/hr (contract/freelance) or $100–$150/hr (agency).*
