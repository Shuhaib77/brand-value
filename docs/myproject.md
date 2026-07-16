# Brand Value Generator (BrandScore) — Current Setup Documentation

> **Version:** 0.1.0
> **Last updated:** July 2026
> **Status:** Fully functional MVP on free tiers

---

## 1. Project Overview

### What it does
The **Brand Value Generator** (branded as **BrandScore** in the UI) is a free, AI-powered web application that evaluates any company's brand strength automatically. Users enter a company URL, optionally answer 12 brand questions, and within ~15–30 seconds receive a comprehensive brand report.

### Problem it solves
Traditional brand valuation costs **$5,000–$50,000** and takes weeks from a consultant. This tool makes brand intelligence **free**, **instant**, and **consistent** — accessible to the 99% of businesses that cannot afford traditional audits.

### Target users
- **SMBs & Startups** — free brand audit
- **Marketing agencies** — client pitches and competitive analysis
- **Founders & CEOs** — track brand health over time
- **Investors** — due diligence on portfolio companies
- **Brand managers** — identify gaps and prioritize improvements

### Output delivered
- Brand Score (0–100) with letter grade
- 10 category scores with evidence-based reasoning
- SWOT analysis (Strengths, Weaknesses, Risks, Opportunities)
- Top 10 prioritized recommendations
- 30/90/365-day action plans
- Executive summary with final verdict
- Company details (founder, CEO, leadership team, employee count, funding)
- Digital footprint audit (social media, reviews, press)
- Professional PDF report download

---

## 2. Tech Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Framework** | Next.js (App Router) | 16.2.10 | React meta-framework, API routes, SSR |
| **Language** | TypeScript | ^5 | Type safety |
| **Styling** | Tailwind CSS | ^4 (CSS-first) | Utility-first CSS |
| **Font** | Geist (next/font) | — | Vercel's modern sans-serif |
| **AI Inference** | Groq SDK | ^1.3.0 | Brand evaluation via Llama models |
| **AI Models** | Llama 3.3 70B / Llama 4 Scout 17B / Llama 3.1 8B | — | Three-tier fallback chain |
| **Alternative AI** | Google Generative AI | ^0.24.1 | Gemini SDK (installed, not wired) |
| **Web Search** | Tavily Core | ^0.7.6 | Company social/reviews/news discovery |
| **Web Scraper** | Cheerio + Axios | ^1.1.0 / ^1.18.1 | Static site content extraction |
| **Charts** | Recharts | ^3.9.2 | Radar/spider chart for category scores |
| **PDF** | jsPDF + jspdf-autotable | ^4.2.1 / ^5.0.8 | Programmatic PDF report generation |
| **UI Icons** | Lucide React | ^1.24.0 | Icon library throughout the UI |
| **Utilities** | clsx + tailwind-merge + CVA | — | CSS class merging, component variants |
| **Runtime** | Node.js | >=20.9.0 | Required by Next.js 16 |
| **Package Manager** | npm | 10.x | — |

### Key package.json dependencies
```
@google/generative-ai, @tavily/core, axios, cheerio, class-variance-authority,
clsx, groq-sdk, html2canvas, jspdf, jspdf-autotable, lucide-react,
next, react, react-dom, recharts, tailwind-merge
```

### Dev dependencies
```
@tailwindcss/postcss, @types/node, @types/react, @types/react-dom,
eslint, eslint-config-next, patch-package, tailwindcss, typescript
```

---

## 3. File Structure

```
/
├── docs/
│   ├── myproject.md                    ← This file
│   ├── ai-tiers-comparison.md          Best/Medium/Low AI model comparison
│   ├── cost-evaluation.md              Free tier limits, provider pricing
│   ├── improvement-roadmap.md          Phased improvement plan
│   ├── project-documentation.md        Business-oriented project overview
│   └── tech-documentation.md           Technical architecture deep-dive
│
├── patches/
│   └── html2canvas+1.4.1.patch        Safari oklab() color support patch
│
├── public/                             Static assets (SVGs, favicon)
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── evaluate/route.ts       Main pipeline (390 lines)
│   │   │   └── web-search/route.ts     Standalone Tavily endpoint
│   │   ├── globals.css                 Tailwind v4 theme + animations
│   │   ├── layout.tsx                  Root layout: fonts, Header/Footer
│   │   ├── page.tsx                    Homepage: hero, URL input, feature grid
│   │   ├── questionnaire/page.tsx      12-question form with Suspense wrapper
│   │   └── results/page.tsx            Results dashboard + PDF download
│   │
│   ├── components/
│   │   ├── brand/                      (10 components)
│   │   │   ├── action-plans.tsx        30/90/365-day tabbed plans
│   │   │   ├── brand-score.tsx         Animated SVG circular gauge
│   │   │   ├── category-details.tsx    Expandable accordion with score bars
│   │   │   ├── company-details.tsx     Leadership, workforce, funding sections
│   │   │   ├── company-info.tsx        Key-value company profile list
│   │   │   ├── executive-summary.tsx   Summary + verdict + confidence note
│   │   │   ├── founder-owners.tsx      Founder/Co-founder/CEO/Owner cards
│   │   │   ├── recommendations.tsx     Numbered recommendation cards
│   │   │   ├── score-radar.tsx         Recharts RadarChart
│   │   │   └── strengths-weaknesses.tsx SWOT 4-quadrant grid
│   │   ├── forms/
│   │   │   ├── questionnaire-form.tsx  12 textareas + progress bar + cache
│   │   │   └── url-input.tsx           URL input with validation
│   │   ├── layout/
│   │   │   ├── footer.tsx             3-column footer
│   │   │   └── header.tsx             Sticky header with theme toggle
│   │   └── ui/                         (6 reusable components)
│   │       ├── badge.tsx, button.tsx, card.tsx, count-up.tsx, skeleton.tsx, tabs.tsx
│   │
│   ├── hooks/
│   │   └── use-theme.ts               Light/dark theme + localStorage
│   │
│   ├── lib/
│   │   ├── ai/
│   │   │   └── groq.ts                 AI client: 3 prompts, retry, fallback chain
│   │   ├── data/
│   │   │   ├── scraper.ts              Website scraper (axios + cheerio)
│   │   │   ├── web-search.ts           Tavily multi-query search
│   │   │   └── wikipedia.ts            Wikipedia API + regex extraction
│   │   ├── pdf/
│   │   │   ├── brand-report.ts         Full PDF generator (19 sections)
│   │   │   ├── colors.ts              PDF color constants
│   │   │   └── helpers.ts             PDF layout helpers
│   │   ├── constants.ts               Grade map, category weights, labels
│   │   ├── questionnaire.ts           12 brand assessment questions
│   │   ├── theme-provider.tsx         React Context for theme
│   │   └── utils.ts                   cn() helper (clsx + tailwind-merge)
│   │
│   ├── types/
│   │   └── brand.ts                   All TypeScript interfaces
│   │
│   └── utils/
│       └── formatting.ts              formatDate helper
│
├── .env.local                         API keys (gitignored)
├── next.config.ts                     serverExternalPackages: ["cheerio"]
├── tailwind.config.ts (v4 via CSS)    Theme tokens in globals.css
├── tsconfig.json                      Path alias @/ → ./src/*
└── package.json
```

---

## 4. AI Pipeline (3-Step)

All AI calls go through Groq with a deterministic (temperature = 0) JSON mode configuration.

### Model fallback chain

| Priority | Model ID | Free TPM | Role |
|----------|----------|:--------:|------|
| Primary | `llama-3.3-70b-versatile` | 6K TPM | High-quality extraction/evaluation |
| Fallback 1 | `meta-llama/llama-4-scout-17b-16e-instruct` | 200K TPM | Mid-tier fallback |
| Fallback 2 | `llama-3.1-8b-instant` | 200K TPM | Last resort (always available) |

### Pipeline steps

```
User submits URL
    │
    ├── Parallel: Scraper + Tavily Search + Wikipedia
    │
    ├── Step 1: extractCompanyInfo (system prompt ~1,040 tokens)
    │   → companyDetails, companyInfo, digitalFootprint, dataConfidence
    │
    ├── Regex fallback: extractPeopleFromText (7 patterns)
    │   → supplements AI output with regex-found people
    │
    ├── Step 2: evaluateBrand (system prompt ~2,000 tokens)
    │   → categoryScores, SWOT, executiveSummary
    │
    ├── Step 3: generateActions (system prompt ~90 tokens)
    │   → recommendations, actionPlans, finalVerdict
    │
    └── Response → Frontend tabs dashboard
```

### Token usage per evaluation

| Step | Input | Output | Total |
|------|:-----:|:------:|:-----:|
| Extraction | ~9,790 | ~350 | ~10,140 |
| Evaluation | ~9,500 | ~900 | ~10,400 |
| Action Plan | ~2,090 | ~450 | ~2,540 |
| **Total** | **~21,380** | **~1,700** | **~23,080** |

### Retry strategy
- Up to **5 attempts** per model
- 429 (Rate Limit): Exponential backoff 3s → 9s → 27s → 45s
- TPD limit: Breaks to next model immediately
- JSON validation: Up to 4 additional retries with strict hint
- Max total: 15 attempts (5 × 3 models)

---

## 5. Data Sources

### 5.1 Tavily Web Search (`src/lib/data/web-search.ts`)

**Search depth:** `advanced` for all queries

| Function | Queries | Max Results |
|----------|---------|:-----------:|
| `searchCompany` | 6 general (brand, founder, reviews, competitors, funding, social) | 8 each |
| `searchCompany` | 2 review-specific (app store, Reddit, ProductHunt) | 10 each |
| `searchTeam` | 3 team-specific (founder/CEO, about us, management) | 6 each |
| **Total** | **11 queries per evaluation** | **1 Tavily credit** |

**Post-filtering:** Only keeps results mentioning the company name in content.

### 5.2 Website Scraper (`src/lib/data/scraper.ts`)

| Feature | Detail |
|---------|--------|
| **Main page** | Title, meta description, OG image, body text (up to 8,000 chars) |
| **Subpages** | Up to 20 pages, batched in groups of 10, 8s timeout each |
| **Priority paths** | about, team, company, careers, products, pricing, blog, press, contact, faq, testimonials, customers, partners, investors, news |
| **Social links** | LinkedIn, Twitter/X, Instagram, Facebook, YouTube, TikTok, GitHub, Crunchbase |
| **Testimonials** | Quoted text with positive keywords (up to 10, 250 chars each) |
| **Team members** | Regex name+title extraction (up to 20 with bios) |
| **Pricing** | $/€/£ patterns (up to 8 items) |
| **Trust signals** | 19 keywords: trust, secure, ssl, guarantee, warranty, certified, award, accredited, verified, bbb, norton, mcafee, encryption, privacy, compliance, gdpr, soc2, hipaa, pci |
| **Technical checks** | 24 checks: title, meta description, H1, H2 count, image alt ratio, OG tags, Twitter cards, canonical, schema markup, privacy/terms/refund pages, cookie consent, analytics, sitemap, robots.txt, etc. |

### 5.3 Wikipedia (`src/lib/data/wikipedia.ts`)

| Field | Patterns |
|-------|----------|
| founderName | 6 regex patterns |
| foundedYear | 5 regex patterns |
| ceoName | 2 regex patterns |
| employeeCount | 4 regex patterns |
| revenue | 4 regex patterns |
| headquarters | 2 regex patterns |
| industry | 1 broad pattern |
| stockSymbol | 2 regex patterns |

**API strategy:** REST API → Action API fallback on 404, 5s timeout.

### 5.4 Questionnaire (12 optional questions)

Users can optionally answer 12 questions about their brand before evaluation. Answers are injected into the AI extraction prompt as additional context. Cached in localStorage for 24 hours (URL-keyed, `CACHE_VERSION = 2`).

---

## 6. Frontend Components

### Pages (3 routes)

| Route | File | Purpose |
|-------|------|---------|
| `/` | `page.tsx` | Landing page: gradient hero, animated stats, 6 feature cards, CTA |
| `/questionnaire?url=` | `questionnaire/page.tsx` | 12-question form with cache/validation |
| `/results` | `results/page.tsx` | 10-tab results dashboard + PDF download |

### API Routes (2)

| Route | Purpose |
|-------|---------|
| `POST /api/evaluate` | Main pipeline: scrape → search → Wikipedia → AI (3 steps) → response |
| `POST /api/web-search` | Standalone Tavily search |

### Brand result components (10)

| Component | Purpose |
|-----------|---------|
| `brand-score.tsx` | Animated SVG circular gauge (0–100) with grade badge |
| `score-radar.tsx` | Recharts RadarChart with 9 category axes |
| `category-details.tsx` | Expandable accordion with color-coded score bars |
| `strengths-weaknesses.tsx` | 2×2 SWOT grid with colored quadrants |
| `recommendations.tsx` | Numbered Top 10 recommendation cards |
| `action-plans.tsx` | Tabbed 30/90/365-day plan views |
| `company-info.tsx` | Key-value company profile with verification badges |
| `company-details.tsx` | Leadership team grid, workforce, funding, achievements |
| `executive-summary.tsx` | Summary card + verdict + confidence note |
| `founder-owners.tsx` | Founder/Co-founder/CEO/Owner cards with avatars/LinkedIn |

### UI components (6 reusable)

`badge`, `button`, `card`, `count-up` (animated counter), `skeleton` (loading states), `tabs`

---

## 7. Data Flow Diagram

```
User submits URL
    │
    ▼
URL Input Validation (url-input.tsx)
    │
    ├── Optional: Questionnaire (12 questions, localStorage cached)
    │
    ▼
POST /api/evaluate
    │
    ├── Promise.all ────────────────────────────────────────────────────────┐
    │   ├── scrapeWebsite(url)                                              │
    │   │   ├── Main page (title, meta, text, techChecks)                   │
    │   │   ├── Subpages (up to 20, batch of 10)                            │
    │   │   └── Social links, testimonials, team, pricing, trust signals    │
    │   │                                                                   │
    │   ├── searchCompany(url)                                              │
    │   │   ├── 6 general queries (brand, founder, reviews, etc.)           │
    │   │   ├── 2 review queries (app store, Reddit, etc.)                  │
    │   │   └── Classification + deduplication                              │
    │   │                                                                   │
    │   └── fetchWikipedia(companyName)                                     │
    │       └── REST API → Action API fallback                              │
    │                                                                       │
    ├── searchTeam(companyName) (sequential, after company search)          │
    │   └── 3 team-specific queries                                         │
    │                                                                       │
    ├── Step 1: extractCompanyInfo (Groq)                                   │
    │   ├── Validation: isLikelyPersonName on founderName/ceoName           │
    │   ├── Split multi-founder founderName by comma/and                    │
    │   ├── Retry if people missing + signals exist                         │
    │   └── Re-validate after retry                                         │
    │                                                                       │
    ├── Regex fallback: extractPeopleFromText (7 patterns)                  │
    │   ├── Filters through isLikelyPersonName                             │
    │   ├── Supplements AI's founderName and leadershipTeam                │
    │   └── Merges with Wikipedia founder data                              │
    │                                                                       │
    ├── Step 2: evaluateBrand (Groq)                                        │
    │   ├── Category scores (9 weighted categories)                         │
    │   ├── ComputeWeightedScore → brandScore                               │
    │   └── computeGrade → brandGrade                                       │
    │                                                                       │
    ├── Step 3: generateActions (Groq)                                      │
    │   └── Recommendations, action plans, final verdict                    │
    │                                                                       │
    ▼
Response JSON → results/page.tsx
    │
    ├── Tab 1: Brand Score + Radar Chart
    ├── Tab 2: Category Details
    ├── Tab 3: SWOT Analysis
    ├── Tab 4: Company Info
    ├── Tab 5: Company Details
    ├── Tab 6: Founders & Owners
    ├── Tab 7: Recommendations
    ├── Tab 8: Action Plans
    ├── Tab 9: Executive Summary
    └── Tab 10: Download PDF Report
```

---

## 8. Current Costs & Limits

### Free tier — $0 per evaluation

| Service | Free Tier Limit | Usage/Eval | Max Evals Before Hit |
|---------|:----------------:|:----------:|:--------------------:|
| Groq (Llama-3.3-70B) | 30 req/min, 6K tok/min, 14.4K req/day | 3 requests | ~4,800/day (req limit) |
| Tavily | 1,000 credits/month | 1 credit | **1,000/month** ⚠️ bottleneck |
| Wikipedia | Unlimited (IP rate-limited) | 1 request | Unlimited |
| Scraping | Unlimited | 1 site | Unlimited |
| Vercel (recommended) | 100 hrs/mo, 100GB bandwidth | ~5s compute | ~72,000 evals/mo |
| **Total** | — | — | **~1,000 evals/month** |

### Key constraint
**Tavily's 1,000 free credits/month is the hard limit.** At 33 evals/day, you exhaust it in a month. Groq's 6K tokens/min limits throughput on large prompts.

### Paid costs (if exceeding free tiers)

| Model | Per-Eval Cost | 1K Evals |
|-------|:-------------:|:--------:|
| Groq Llama-3.3-70B | $0.000013 | $0.01 |
| DeepSeek V4 Flash | $0.000004 | $0.00 |
| GPT-4o Mini | $0.000004 | $0.00 |
| Gemini 2.5 Flash | $0.000010 | $0.01 |
| Tavily (Project plan) | $0.008 | $8.00 |

### Grade scale

| Score Range | Grade |
|:-----------:|-------|
| 90–100 | Exceptional |
| 80–89 | Strong |
| 70–79 | Good |
| 60–69 | Average |
| 40–59 | Weak |
| 0–39 | Poor |

---

## 9. Hosting & Deployment

### Current environment
- **Local development only** — no production deployment active
- API keys stored in `.env.local` (gitignored)
- Requires Node.js >=20.9.0

### Vercel deployment (recommended)

```bash
npm install -g vercel
vercel
vercel env add GROQ_API_KEY
vercel env add TAVILY_API_KEY
vercel --prod
```

### Configuration
- `next.config.ts` requires `serverExternalPackages: ["cheerio"]` for Vercel serverless
- No Dockerfile, no `vercel.json` (uses defaults)
- Tailwind CSS v4 configured via CSS (`globals.css`) — no `tailwind.config.ts`
- TypeScript strict mode enabled
- Path alias `@/*` → `./src/*`

### Environment variables

| Variable | Required | Purpose |
|----------|:--------:|---------|
| `GROQ_API_KEY` | ✅ Yes | Groq AI inference |
| `TAVILY_API_KEY` | ✅ Yes | Tavily web search |
| `GEMINI_API_KEY` | ❌ Optional | Gemini SDK (installed, not wired) |

### Security notes
- No authentication/authorization
- No database
- No user accounts or sessions
- API is fully open (anyone can call POST /api/evaluate)
- API keys stored server-side only (not exposed to client)

---

## 10. Known Gaps & Limitations

| Area | Issue | Impact | Priority |
|------|-------|--------|:--------:|
| **Testing** | 0 tests (unit, integration, or E2E) | Regressions undetected, breaks go unnoticed | 🔴 Critical |
| **Auth** | No authentication or rate limiting | API is openly accessible, no abuse protection | 🔴 High |
| **Data quality** | AI still produces occasional garbage names | Degraded user experience | 🟡 Medium |
| **PDF** | jsPDF-based (not HTML-to-PDF) | Limited styling, no real-time preview | 🟡 Medium |
| **Caching** | Only browser localStorage (24h) | No server-side caching, repeated evals of same URL re-run pipeline | 🟡 Medium |
| **Gemini** | SDK installed, not wired into pipeline | Tool installed but no code to use it | 🟢 Low |
| **Scaling** | Free tier bottlenecks at ~1K evals/mo | Cannot support growth without paid plans | 🟢 Low |
| **Mobile** | Tailwind responsive but not optimized | Small UI issues on phone screens | 🟢 Low |

---

## 11. Key Files Reference

| File | Lines | Purpose |
|------|:-----:|---------|
| `src/app/api/evaluate/route.ts` | 390 | Main pipeline: all AI calls, validation, merging logic |
| `src/lib/ai/groq.ts` | 426 | AI client: 3 prompts, retry, fallback chain, schema validation |
| `src/lib/data/web-search.ts` | 221 | Tavily multi-query search + classification |
| `src/lib/data/scraper.ts` | 356 | Website scraper with subpages, tech checks |
| `src/lib/data/wikipedia.ts` | 133 | Wikipedia fetcher + regex field extraction |
| `src/lib/pdf/brand-report.ts` | ~400 | Full PDF report generator (19 sections) |
| `src/types/brand.ts` | ~120 | All TypeScript type definitions |
| `src/components/brand/founder-owners.tsx` | ~150 | Founder/CEO/Owner cards frontend |
| `src/components/forms/questionnaire-form.tsx` | ~200 | 12-question form with localStorage cache |

---

*Generated July 2026. For pricing updates and AI provider comparisons, see `docs/ai-tiers-comparison.md` and `docs/cost-evaluation.md`.*
