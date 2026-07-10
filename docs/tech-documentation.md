# Brand Value Generator — Tech Documentation

> **Version:** 1.0.0  
> **Last Updated:** July 2026  
> **Stack:** Next.js 16 + TypeScript + Tailwind CSS v4 + Groq AI + Tavily Search + Cheerio

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Project Structure](#2-project-structure)
3. [Architecture & Data Flow](#3-architecture--data-flow)
4. [Technology Stack](#4-technology-stack)
5. [Setup Workflow](#5-setup-workflow)
6. [API Reference](#6-api-reference)
7. [Library Modules](#7-library-modules)
8. [Component Hierarchy](#8-component-hierarchy)
9. [Deployment](#9-deployment)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Project Overview

The **Brand Value Generator** is an AI-powered web application built with Next.js 16 (App Router) that evaluates a company's brand automatically by analyzing its website, digital footprint, and optional questionnaire answers.

### Core Capabilities

- Enter any company URL → automatic website scraping
- Optional 12-question brand assessment questionnaire
- Web search integration (social media, reviews, news, competitors)
- AI-powered extraction of company details (founder, CEO, team, funding, employees)
- 10-category brand evaluation with individual scores and reasoning
- SWOT analysis (strengths, weaknesses, risks, opportunities)
- Top 10 prioritized recommendations
- 30-day, 90-day, and 1-year action plans
- Executive summary with final verdict
- Interactive radar chart and animated score gauge
- Professional PDF report download (jsPDF)

### Key Technical Decisions

| Decision | Rationale |
|---|---|
| **No database** | Results stored in sessionStorage — zero ops, no user auth needed |
| **Serverless APIs** | All AI calls happen in Next.js API routes, deployable on Vercel |
| **jsPDF over html2canvas** | Safari incompatibility with `oklab()` CSS colors; text-based PDF is faster and lighter |
| **Cheerio over Puppeteer** | No browser overhead, sufficient for static/MVC sites |

---

## 2. Project Structure

```
automated-brand-value-generator/
│
├── .env.local                              # API keys (GITIGNORED — never commit)
├── .gitignore                              # Standard Next.js gitignore
├── package.json                            # Dependencies & scripts
├── tsconfig.json                           # TypeScript config (ES2017, bundler mode)
├── next.config.ts                          # Next.js config (serverExternalPackages: cheerio)
├── postcss.config.mjs                      # PostCSS with @tailwindcss/postcss
├── eslint.config.mjs                       # ESLint v9 flat config (Next.js core-web-vitals + TS)
├── next-env.d.ts                           # Next.js TypeScript declarations
├── README.md                               # Default Next.js readme
├── DOCUMENTATION.md                        # Full project documentation (1033 lines)
│
├── app/                                    # Next.js App Router
│   ├── layout.tsx                          # Root layout — Geist fonts, HTML shell, metadata
│   ├── page.tsx                            # Homepage — hero, badge, URL input, footer
│   ├── globals.css                         # Tailwind v4 imports, custom theme, animations
│   ├── favicon.ico
│   │
│   ├── api/
│   │   ├── evaluate/
│   │   │   └── route.ts                    # POST — main evaluation pipeline
│   │   └── web-search/
│   │       └── route.ts                    # POST — standalone web search endpoint
│   │
│   ├── questionnaire/
│   │   └── page.tsx                        # 12-question form, submits to /api/evaluate
│   │
│   └── results/
│       ├── page.tsx                        # Results dashboard + PDF generation
│       └── page.tsx.bak                    # Backup (previous html2canvas approach)
│
├── components/                             # React components
│   ├── url-input.tsx                       # URL text input with validation
│   ├── questionnaire-form.tsx              # Multi-step questionnaire with progress bar
│   ├── brand-score.tsx                     # Animated SVG circular score gauge
│   ├── score-radar.tsx                     # Recharts RadarChart (10 categories)
│   ├── category-details.tsx                # Expandable accordion for category scores
│   ├── strengths-weaknesses.tsx            # 4-quadrant SWOT grid
│   ├── recommendations.tsx                 # Numbered recommendation cards (1-10)
│   ├── action-plans.tsx                    # Tabbed 30/90/365 day plans
│   ├── company-info.tsx                    # Company profile key-value list
│   ├── company-details.tsx                 # Leadership, workforce, funding sections
│   └── executive-summary.tsx               # Summary card + verdict + confidence note
│
├── lib/                                    # Core logic / library modules
│   ├── groq.ts                             # Primary AI client (Groq + Llama models)
│   ├── gemini.ts                           # Alternative AI client (Gemini 2.0 Flash)
│   ├── scraper.ts                          # Website scraper (axios + cheerio)
│   ├── web-search.ts                       # Tavily web search client
│   ├── wikipedia.ts                        # Wikipedia API fetcher
│   └── questionnaire.ts                    # 12 default brand questions
│
├── patches/
│   └── html2canvas+1.4.1.patch             # Patch for Safari oklab() color support (legacy)
│
├── public/                                 # Static assets
│   ├── file.svg, globe.svg, next.svg, vercel.svg, window.svg
│
└── docs/                                   # Documentation (this file)
    ├── tech-documentation.md
    └── project-documentation.md
```

### File-by-File Purpose

| File | Role |
|---|---|
| `app/page.tsx` | Landing page — gradient hero, URL input form |
| `app/layout.tsx` | Root HTML layout, Geist font loading, `<title>` + `<meta>` |
| `app/globals.css` | Tailwind v4 `@theme` (~90 color tokens), keyframes, `.gradient-text` |
| `app/questionnaire/page.tsx` | Reads `?url=` param, renders `<QuestionnaireForm>`, Suspense wrapper |
| `app/results/page.tsx` | Tabbed results UI (7 tabs) + full `handleDownloadPDF()` with jsPDF |
| `app/api/evaluate/route.ts` | Main pipeline: scrape → search → Wikipedia → extract → evaluate → actions |
| `app/api/web-search/route.ts` | Standalone web search for debugging/standalone use |
| `components/questionnaire-form.tsx` | 12 textareas, progress bar, skip button, submit to `/api/evaluate` |
| `components/brand-score.tsx` | SVG circle gauge with gradient stroke, animated on mount |
| `components/score-radar.tsx` | Recharts `<RadarChart>` — 10 axes, purple fill, tooltips |
| `components/category-details.tsx` | Accordion with color-coded score bars and reasoning |
| `components/strengths-weaknesses.tsx` | 2x2 grid with colored quadrants and letter badges |
| `components/company-info.tsx` | Key-value display with Wikipedia verification badges |
| `components/company-details.tsx` | Leadership team avatars, funding stage tags, investor pills |
| `lib/groq.ts` | `callGroq()` helper, retry/fallback, 3 system prompts, model chain |
| `lib/gemini.ts` | Google AI SDK client with JSON mode, 3 prompt exports |
| `lib/scraper.ts` | Axios GET + Cheerio parse, subpage discovery, testimonial/team/price extraction |
| `lib/web-search.ts` | Tavily client, 8 queries, dedup, classify into social/reviews/news |
| `lib/wikipedia.ts` | REST API + action API fallback, regex extraction for 8 fields |

---

## 3. Architecture & Data Flow

### 3.1 User Flow

```
User enters URL → /questionnaire?url=... (optional)
                            │
                      [Skip] │ [Submit]
                            ▼
                    POST /api/evaluate
                            │
                    ┌───────┼───────┐
                    ▼       ▼       ▼
              scrapeWebsite  searchCompany  fetchWikipedia
                    │       │       │
                    └───────┼───────┘
                            ▼
                    groq.extractCompanyInfo()
                            │
                            ▼
                    groq.evaluateBrand()
                            │
                            ▼
                    groq.generateActions()
                            │
                            ▼
                    Response stored in sessionStorage
                            │
                            ▼
                    Navigate to /results
                            │
                    ┌───────┼───────┐
                    │               │
               7-tab UI        Download PDF
```

### 3.2 API Pipeline (POST /api/evaluate)

```
Request: { url: string, answers?: Record<string, string> }
                          │
                          ▼
  ┌─────────────────────────────────────┐
  │ Step 1: Scrape Website (parallel)  │
  │ lib/scraper.ts                      │
  │ ├─ Main page title, description     │
  │ ├─ OG image, text (~8KB)           │
  │ ├─ Subpages (up to 20, batch 3)    │
  │ │  ├─ about, team, company, careers │
  │ │  └─ contact, blog, faq, pricing   │
  │ ├─ Testimonials (quoted text)       │
  │ ├─ Team members (name + title)      │
  │ ├─ Pricing patterns ($/€/£)        │
  │ ├─ Trust signals (SSL, GDPR, etc.)  │
  │ └─ Social links (Twitter, LinkedIn…)│
  └──────────────┬──────────────────────┘
                 │
  ┌─────────────────────────────────────┐
  │ Step 2: Web Search (parallel)       │
  │ lib/web-search.ts (Tavily)          │
  │ ├─ 6 general queries (company info) │
  │ ├─ 2 review queries (Trustpilot…)  │
  │ ├─ Dedup (24 general + 16 review)  │
  │ └─ Classify: social/reviews/news   │
  └──────────────┬──────────────────────┘
                 │
  ┌─────────────────────────────────────┐
  │ Step 3: Wikipedia (parallel)        │
  │ lib/wikipedia.ts                    │
  │ ├─ Search company name              │
  │ ├─ Fetch page summary               │
  │ └─ Regex extract: founder, CEO,     │
  │    revenue, employees, HQ, industry │
  └──────────────┬──────────────────────┘
                 │
                 ▼
  ┌─────────────────────────────────────┐
  │ Step 4: Build extraction prompt     │
  │ (~25KB max)                         │
  │ ├─ Scraped content                  │
  │ ├─ Web search results               │
  │ ├─ Wikipedia data                   │
  │ ├─ Social links, reviews            │
  │ ├─ Team, pricing, trust signals     │
  │ └─ Questionnaire answers (if any)   │
  └──────────────┬──────────────────────┘
                 │
                 ▼
  ┌─────────────────────────────────────┐
  │ Step 5: groq.extractCompanyInfo()   │
  │ ├─ Company name, industry, desc     │
  │ ├─ Products/services, target aud.   │
  │ ├─ Mission, vision, core values     │
  │ ├─ USP, HQ, years, personality      │
  │ ├─ Competitors, CTA                 │
  │ ├─ Founder/CEO/team/employees       │
  │ ├─ Funding stage, investors, rev    │
  │ ├─ Social media presence            │
  │ ├─ Customer reviews                 │
  │ ├─ News/press mentions              │
  │ └─ Search visibility, competitors   │
  └──────────────┬──────────────────────┘
                 │
                 ▼
  ┌─────────────────────────────────────┐
  │ Step 6: Build evaluation prompt     │
  │ (~15KB max)                         │
  │ ├─ Extracted company data            │
  │ ├─ Testimonials, team, pricing      │
  │ ├─ Reviews, news, Wikipedia         │
  │ └─ Brand personality, values        │
  └──────────────┬──────────────────────┘
                 │
                 ▼
  ┌─────────────────────────────────────┐
  │ Step 7: groq.evaluateBrand()        │
  │ ├─ 10 category scores (0-10 each)  │
  │ ├─ Overall brand score (0-100)     │
  │ ├─ Brand grade (Exceptional→Poor)  │
  │ ├─ Executive summary               │
  │ ├─ Strengths, weaknesses           │
  │ └─ Risks, opportunities            │
  └──────────────┬──────────────────────┘
                 │
                 ▼
  ┌─────────────────────────────────────┐
  │ Step 8: groq.generateActions()      │
  │ ├─ Top 10 recommendations           │
  │ ├─ 30-day action plan               │
  │ ├─ 90-day action plan               │
  │ ├─ 1-year brand strategy            │
  │ ├─ Final verdict                    │
  │ └─ Confidence note                  │
  └──────────────┬──────────────────────┘
                 │
                 ▼
  ┌─────────────────────────────────────┐
  │ Step 9: Merge & respond             │
  │ ├─ Add wikipediaVerified flags      │
  │ └─ Return full BrandResult JSON     │
  └─────────────────────────────────────┘
```

### 3.3 PDF Generation Flow

```
User clicks "Download PDF"
         │
         ▼
handleDownloadPDF() in app/results/page.tsx
         │
         ├─ Cover page (purple header, score ring, grade badge)
         ├─ Executive Summary
         ├─ Category Scores (autoTable)
         ├─ SWOT Analysis (colored accent bars)
         ├─ Recommendations & Action Plans (bullet lists)
         ├─ Final Verdict
         ├─ Company Information (label/value pairs)
         ├─ Company Details (leadership, investors)
         └─ Digital Footprint (social, reviews, news, competitors)
         │
         ▼
         doc.save("Company-Brand-Report.pdf")
```

---

## 4. Technology Stack

| Category | Technology | Version | Purpose | Why This Choice |
|---|---|---|---|---|
| **Framework** | Next.js | 16.2.10 (App Router) | React meta-framework with API routes and file-based routing | Best-in-class SSR/SSG, Vercel-native, large ecosystem |
| **Language** | TypeScript | 5.x | Type safety and developer experience | Catches errors at compile time, better IDE support |
| **Styling** | Tailwind CSS | 4.x (CSS-first config) | Utility-first CSS | Rapid UI development, zero runtime CSS, small bundle |
| **Font** | Geist (next/font) | — | Modern sans-serif typeface by Vercel | Matches Next.js aesthetic, self-hosted, no layout shift |
| **AI Inference** | Groq SDK | 1.3.0 | Brand evaluation via Llama models | Free tier, fastest inference, OpenAI-compatible SDK |
| **AI Model (primary)** | Llama 4 Scout 17B | — | Fast extraction & evaluation | 200K TPM free — avoids rate limits |
| **AI Model (fallback)** | Llama 3.3 70B | — | Deeper reasoning when needed | Higher quality but lower rate limits |
| **AI Model (last resort)** | Llama 3.1 8B | — | Minimal viable inference | Always available, lowest cost |
| **Alternative AI** | Gemini 2.0 Flash | @google/generative-ai 0.24 | JSON-mode extraction | Better JSON compliance than Groq |
| **Web Search** | Tavily | @tavily/core 0.7 | Company discovery (social, reviews, news) | Built for AI agents, structured responses, 1000 free/mo |
| **Web Scraper** | Cheerio + Axios | cheerio 1.x, axios 1.x | Website content extraction | Fast, light, no browser overhead |
| **Charts** | Recharts | 3.9.2 | Radar chart for category scores | React-native, composable, tree-shakeable |
| **PDF** | jsPDF + jspdf-autotable | 4.2.1, 5.0.8 | Programmatic PDF generation | Works in all browsers, no canvas rendering issues |
| **Runtime** | Node.js | >=20.9.0 | Server-side JavaScript | Required by Next.js 16 |
| **Package Manager** | npm | 10.x | Dependency management | Bundled with Node.js |

---

## 5. Setup Workflow

### Prerequisites

- **Node.js** >= 20.9.0 (required by Next.js 16)
- **npm** (comes with Node.js)
- **API Keys** (see steps below)

### Step 1: Get API Keys

#### Primary Setup (Groq + Tavily — $0/mo)

```
Groq API Key:  https://console.groq.com/keys  →  Create free account → Copy key
Tavily API Key: https://app.tavily.com/home   →  Sign up free → Copy key (1000 requests/mo free)
```

#### Alternative AI Providers

```
Gemini API Key: https://aistudio.google.com/app/apikey → Free tier (60 req/min)
OpenAI API Key: https://platform.openai.com/api-keys   → Paid (~$0.15/eval)
```

### Step 2: Clone & Install

```bash
git clone <repository-url>
cd automated-brand-value-generator
npm install
```

### Step 3: Configure Environment

Create `.env.local` in the project root:

```env
# Required: Choose ONE AI provider
GROQ_API_KEY=gsk_your_groq_key_here

# Optional: Alternative AI providers
# GEMINI_API_KEY=AIza_your_gemini_key_here
# OPENAI_API_KEY=sk-your_openai_key_here

# Required:
TAVILY_API_KEY=tvly-your_tavily_key_here
```

### Step 4: Choose AI Provider

The app uses Groq by default. To switch to Gemini, edit `app/api/evaluate/route.ts`:

```typescript
// Change this:
// import { extractCompanyInfo, evaluateBrand, generateActions } from "@/lib/gemini"
// Keep this:
import { extractCompanyInfo, evaluateBrand, generateActions } from "@/lib/groq"
```

### Step 5: Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Step 6: Test the Flow

1. Enter a company URL (e.g., `https://example.com`)
2. Click "Start Evaluation"
3. Optionally fill the questionnaire or skip
4. View results in 7-tab dashboard
5. Click "Download PDF" to export

### Quick Start (One-Liner)

```bash
git clone <repo> && cd automated-brand-value-generator && npm install && echo "GROQ_API_KEY=gsk_xxx\nTAVILY_API_KEY=tvly_xxx" > .env.local && npm run dev
```

---

## 6. API Reference

### 6.1 POST /api/evaluate

Main evaluation pipeline — returns full brand analysis.

**Request:**

```json
{
  "url": "https://example.com",
  "answers": {
    "brand_identity_1": "We are a premium brand...",
    "competitive_1": "Our main competitors are..."
  }
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `url` | string | Yes | Company website URL (will auto-prepend `https://` if missing) |
| `answers` | object | No | Questionnaire answers keyed by question ID |

**Response (200):**

```json
{
  "extractedCompanyInfo": {
    "companyName": "Example Corp",
    "industry": "Technology",
    "productsOrServices": ["SaaS platform", "API tools"],
    "businessDescription": "Example Corp provides...",
    "targetAudience": "Mid-market enterprises",
    "brandMission": "Empower businesses...",
    "brandVision": "A world where...",
    "coreValues": ["Innovation", "Customer-first"],
    "usp": "Fastest API in the market",
    "headquarters": "San Francisco, CA",
    "yearsInBusiness": "5 years",
    "brandPersonality": "Innovative, professional",
    "mainCompetitors": ["Competitor A", "Competitor B"],
    "primaryCallToAction": "Get Started Free",
    "websiteQuality": "Modern, responsive, fast-loading",
    "overallProfessionalism": "High — polished design with clear messaging",
    "wikipediaVerified": {
      "founderName": true, "foundedYear": true, "employeeCount": false,
      "revenue": false, "headquarters": true, "industry": true, "ceoName": false
    },
    "companyDetails": {
      "founderName": "Jane Doe",
      "founderBackground": "Ex-Google engineer",
      "ceoName": "Jane Doe",
      "leadershipTeam": [
        { "name": "John Smith", "title": "CTO" },
        { "name": "Alice Lee", "title": "CMO" }
      ],
      "employeeCount": "50-200",
      "foundedYear": "2019",
      "fundingStage": "Series A",
      "investors": ["VC Firm A", "Angel Investor B"],
      "estimatedRevenue": "$5M-$10M"
    },
    "digitalFootprint": {
      "socialMediaPresence": [
        { "platform": "LinkedIn", "handleOrUrl": "linkedin.com/company/example", "followerCount": 5000, "activityLevel": "Weekly" }
      ],
      "customerReviews": [
        { "source": "Trustpilot", "rating": 4.5, "reviewCountApprox": 120, "sentimentSummary": "Mostly positive..." }
      ],
      "newsOrPressMentions": [
        { "source": "TechCrunch", "summary": "Example Corp raises $10M Series A", "date": "2025-06-01" }
      ],
      "searchVisibility": "Strong — appears on first page for brand terms",
      "confirmedCompetitors": ["Competitor A", "Competitor B"]
    }
  },
  "categoryScores": {
    "brandIdentity": { "score": 8, "reasoning": "Clear brand identity with consistent messaging..." },
    "websiteExperience": { "score": 7, "reasoning": "Modern design but could improve mobile UX..." }
  },
  "brandScore": 72,
  "brandGrade": "Good",
  "executiveSummary": "Example Corp demonstrates a solid brand foundation...",
  "strengths": ["Strong brand identity", "Clear value proposition"],
  "weaknesses": ["Limited social media presence"],
  "risks": ["Heavy reliance on a single revenue stream"],
  "opportunities": ["Expanding into adjacent markets"],
  "top10Recommendations": ["1. Strengthen social media strategy..."],
  "actionPlan30Day": ["Audit current brand assets..."],
  "actionPlan90Day": ["Launch content marketing initiative..."],
  "brandGrowthStrategy1Year": ["Expand product line..."],
  "finalVerdict": "Example Corp is well-positioned but needs to invest in digital presence.",
  "confidenceNote": null
}
```

**Response (400):**

```json
{
  "error": "URL is required"
}
```

**Response (429):**

```json
{
  "error": "Rate limit exceeded. Please try again in a moment."
}
```

**Response (500):**

```json
{
  "error": "Failed to analyze brand"
}
```

### 6.2 POST /api/web-search

Standalone web search endpoint — useful for debugging or independent search.

**Request:**

```json
{
  "url": "https://example.com"
}
```

**Response (200):**

```json
{
  "socialMedia": ["https://linkedin.com/company/example"],
  "reviews": ["Trustpilot with rating 4.5"],
  "news": ["TechCrunch article about funding"],
  "rawResults": "..."
}
```

### 6.3 Error Codes

| Code | Meaning | Common Cause | Solution |
|---|---|---|---|
| 400 | Bad Request | Missing URL parameter | Ensure `url` is provided in request body |
| 429 | Rate Limit | Groq/API quota exceeded | Wait 30s and retry, or upgrade API tier |
| 413 | Request Too Large | Extraction prompt >30KB | Website with too many subpages; reduces automatically |
| 500 | Internal Error | Scraper failure, AI parse failure | Check console logs, verify URL is accessible |

---

## 7. Library Modules

### 7.1 `lib/groq.ts` — Primary AI Client

**Role:** Handles all AI inference via Groq's API with Llama models.

**Key Features:**
- Uses `groq-sdk` with configurable API key from `GROQ_API_KEY` env var
- `callGroq()` helper with:
  - Retry logic (up to 3 attempts on failure)
  - Fallback model chain: Llama 4 Scout → Llama 3.3 70B → Llama 3.1 8B
  - Rate-limit handling (429 → wait 30s → retry)
  - JSON validation with error recovery
- Three system prompts (each ~1500 tokens):
  - **EXTRACT_PROMPT:** Company data extraction from scraped/search content
  - **EVALUATE_PROMPT:** 10-category brand scoring with reasoning
  - **ACTION_PROMPT:** Recommendations, action plans, final verdict

**Exports:**
```typescript
extractCompanyInfo(extractionInput: string): Promise<CompanyExtraction>
evaluateBrand(evaluationInput: string): Promise<BrandEvaluation>
generateActions(actionInput: string): Promise<BrandActions>
```

### 7.2 `lib/gemini.ts` — Alternative AI Client

**Role:** Drop-in replacement for Groq using Google's Gemini 2.0 Flash.

**Key Differences from Groq:**
- Uses `@google/generative-ai` SDK with `responseMimeType: "application/json"`
- Model: `gemini-2.0-flash`
- Better JSON compliance but slightly slower
- Same three prompts and exports as `groq.ts`
- Retry on 429 with 30s delay

### 7.3 `lib/scraper.ts` — Website Scraper

**Role:** Extracts content from the target website without JavaScript rendering.

**How It Works:**
1. Fetch main page via Axios GET
2. Parse with Cheerio: extract `<title>`, `<meta name="description">`, `<meta property="og:image">`, visible text (~8KB max)
3. Discover subpage links from `<a>` tags (up to 20 URLs from about, team, company, careers, contact, blog, faq, pricing, press, newsletter, culture, testimonials, investors, partners, shop, product, services pages)
4. Fetch subpages in batches of 3 (each up to 8KB)
5. Extract from text:
   - **Testimonials:** Quoted/pull-quote text with positive keywords (love, great, amazing, recommend, best, excellent)
   - **Team members:** Name + Title patterns (Founder, CEO, CTO, etc.)
   - **Pricing:** Dollar/Euro/Pound patterns near price-related words
   - **Blog topics:** Headlines from /blog/ pages
   - **Trust signals:** Keywords like SSL, encryption, GDPR, SOC2, ISO
6. Extract social media links from hrefs (LinkedIn, Twitter, Instagram, Facebook, YouTube, TikTok, GitHub, Crunchbase)
7. Attempt to fetch Trustpilot reviews via `trustpilot.com/review/{domain}`

**Limitations:**
- Cannot render JavaScript — SPAs may yield little content
- Single-threaded fetch, no concurrency control beyond batch 3
- No cookie/session handling

### 7.4 `lib/web-search.ts` — Tavily Web Search

**Role:** Discovers company digital footprint via web search.

**How It Works:**
1. Extract domain name from URL
2. Run 6 general search queries:
   - `{company} about us`
   - `{company} social media`
   - `{company} reviews`
   - `{company} news 2025`
   - `{company} team founders`
   - `{company} competitors`
3. Run 2 review-focused queries:
   - `site:trustpilot.com {company}`
   - `{company} reviews rating`
4. All queries use `searchDepth: "advanced"` for better results
5. Deduplicate by URL (max 24 unique general results, 16 review results)
6. Classify each result by URL pattern:
   - Social media (linkedin, twitter, facebook, instagram, youtube, tiktok)
   - Reviews (trustpilot, g2, glassdoor, yelp, indeed, gartner, capterra, g2crowd)
   - News (news, article, blog, press, medium, techcrunch, forbes, bloomberg)

### 7.5 `lib/wikipedia.ts` — Wikipedia Fetcher

**Role:** Retrieves verified company data from Wikipedia.

**How It Works:**
1. Extract company name from URL or search result
2. Try Wikipedia REST API: `/page/summary/{encoded_name}`
3. If 404, fall back to action API search: `list=search&srsearch={name}`
4. Extract up to 3KB of page extract text
5. Regex extraction for:
   - `founderName` — near "founder" or "founded by"
   - `foundedYear` — 4-digit year near "founded" or "established"
   - `ceoName` — near "CEO" or "chief executive"
   - `employeeCount` — number near "employees" or "staff"
   - `revenue` — dollar amount near "revenue" or "income"
   - `headquarters` — location after "headquarters" or "hq"
   - `industry` — industry/category terms
   - `stockSymbol`, `parentOrg`
6. Returns `{field: boolean}` — whether each field was verified by Wikipedia

### 7.6 `lib/questionnaire.ts` — Brand Questions

**Role:** Provides the 12 questions for the optional brand assessment.

**Structure:**
```typescript
const defaultQuestions = [
  {
    id: "brand_identity_1",
    question: "Describe your brand's mission and core values...",
    placeholder: "Our mission is to...",
    required: false,
    category: "Brand Identity"
  },
  // ... 11 more questions
]
```

| Category | Count | Questions |
|---|---|---|
| Brand Identity | 4 | Mission, values, personality, positioning |
| Competitive Position | 2 | Main competitors, differentiation |
| Marketing Maturity | 1 | Current marketing channels |
| Customer Experience | 1 | Customer feedback approach |
| Growth Potential | 2 | Growth goals, expansion plans |
| Brand Consistency | 1 | Brand guidelines across channels |
| Innovation | 1 | Recent innovations |

---

## 8. Component Hierarchy

### 8.1 Page Components

```
app/layout.tsx (root)
└── app/page.tsx
    └── <UrlInput />

app/layout.tsx (root)
└── app/questionnaire/page.tsx
    └── <QuestionnaireForm url={url} />

app/layout.tsx (root)
└── app/results/page.tsx (ResultsContent)
    ├── Tab Navigation (7 tabs)
    ├── Tab: Overview
    │   ├── <BrandScore score grade />
    │   └── <ScoreRadar categories />
    │   └── <ExecutiveSummary summary verdict confidenceNote />
    ├── Tab: Category Scores
    │   └── <CategoryDetails categories />
    ├── Tab: SWOT Analysis
    │   └── <StrengthsWeaknesses strengths weaknesses risks opportunities />
    ├── Tab: Recommendations
    │   └── <Recommendations recommendations />
    ├── Tab: Action Plans
    │   └── <ActionPlans plan30Day plan90Day plan1Year />
    ├── Tab: Company Info
    │   └── <CompanyInfo info />
    └── Tab: Team & Company
        └── <CompanyDetailsCard details wikiVerified />
```

### 8.2 Component Props

| Component | Props | Description |
|---|---|---|
| `UrlInput` | (none) | URL input, validation, navigation |
| `QuestionnaireForm` | `url: string` | 12 questions, progress, submit |
| `BrandScore` | `score: number, grade: string` | SVG gauge 0-100 |
| `ScoreRadar` | `categories: Record<string, {score: number}>` | 10-axis radar chart |
| `CategoryDetails` | `categories: Record<string, {score: number, reasoning: string}>` | Accordion with bars |
| `StrengthsWeaknesses` | `strengths/weaknesses/risks/opportunities: string[]` | 4-quadrant grid |
| `Recommendations` | `recommendations: string[]` | Numbered cards 1-10 |
| `ActionPlans` | `plan30Day/plan90Day/plan1Year: string[]` | Tabbed panels |
| `CompanyInfo` | `info: ExtractedCompanyInfo` | Key-value list |
| `CompanyDetailsCard` | `details: CompanyDetails, wikiVerified?: object` | Leadership/funding cards |
| `ExecutiveSummary` | `summary: string, verdict: string, confidenceNote: string|null` | Gradient card |

---

## 9. Deployment

### 9.1 Vercel (Recommended, Free)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables
vercel env add GROQ_API_KEY
vercel env add TAVILY_API_KEY

# Deploy to production
vercel --prod
```

**Important:** Add `serverExternalPackages: ["cheerio"]` to `next.config.ts` (already configured).

### 9.2 Manual Build

```bash
npm run build
npm start
```

Runs on `http://localhost:3000`.

### 9.3 Docker (Optional)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t brand-value-generator .
docker run -p 3000:3000 brand-value-generator
```

### 9.4 Environment Variables Reference

| Variable | Required | Description | Example |
|---|---|---|---|
| `GROQ_API_KEY` | Yes (or GEMINI) | Groq API key for AI inference | `gsk_abc123...` |
| `GEMINI_API_KEY` | Yes (or GROQ) | Google AI API key | `AIza_...` |
| `TAVILY_API_KEY` | Yes | Tavily search API key | `tvly-...` |
| `OPENAI_API_KEY` | No | OpenAI API key (unused currently) | `sk-...` |

---

## 10. Troubleshooting

### Common Errors & Fixes

| Error | Cause | Solution |
|---|---|---|
| `Node.js version >=20.9.0 is required` | Node.js too old | `nvm install 20 && nvm use 20` |
| `doc.autoTable is not a function` | Wrong jspdf-autotable import | Use `import { autoTable } from "jspdf-autotable"` |
| `GROQ_API_KEY is not configured` | Missing env variable | Add `GROQ_API_KEY` to `.env.local` |
| `TAVILY_API_KEY is not configured` | Missing env variable | Add `TAVILY_API_KEY` to `.env.local` |
| `413 Request Too Large` | Extraction prompt >30KB | Website had many subpages; retry may succeed |
| `429 Rate Limit` | Groq TPM exceeded | Wait 30s, or use Llama 3.1 8B (higher limits) |
| `Scraper returned no content` | JS-heavy SPA or blocked | Try a different (more static) URL |
| Build error: `Type 'number[]' is not assignable` | Tuple type mismatch | Cast as `[number, number, number]` |
| `html2canvas` Safari issue | Safari returns `oklab()` in getComputedStyle | Switched to jsPDF text-based PDF (present in code) |
| `cheerio` not found in Vercel | Serverless bundle missing | `serverExternalPackages: ["cheerio"]` in next.config.ts |

### Groq-Specific Issues

**413 — Request Too Large:**
The extraction prompt exceeds Groq's context window. The code automatically truncates prompts to ~25KB for extraction and ~15KB for evaluation. If the error persists, the website has too many large subpages.

**429 — Rate Limit Exceeded:**
Free Groq tier has 200K TPM for Llama 4 Scout, 6K TPM for Llama 3.3 70B. The code retries with a smaller model on 429. If all models fail, wait 30-60 seconds.

### Scraper-Specific Issues

**No content returned:**
- The website may be a JavaScript SPA (React/Angular/Vue)
- The website may block bots (Cloudflare, bot detection)
- The website may be down or slow
- Try a different URL (subpage, about page)

**Partial content:**
- The scraper fetches up to 8KB per page
- Subpages are limited to 20 URLs fetched in batches of 3
- Large pages are truncated

---

## Quick Reference Card

```bash
# Development
npm run dev           # Start dev server on :3000

# Build & Test
npm run build         # Production build with type checking
npm start             # Run production build
npm run lint          # ESLint check

# Dependencies
npm install           # Install all dependencies
npm update            # Update packages

# API Keys (add to .env.local)
# GROQ_API_KEY=gsk_xxx
# TAVILY_API_KEY=tvly_xxx
```
