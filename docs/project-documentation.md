# Brand Value Generator — Project Documentation

> **Version:** 1.0.0  
> **Last Updated:** July 2026  
> **Type:** AI-Powered Brand Assessment Tool

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Why This Project](#2-why-this-project)
3. [Merits & Demerits](#3-merits--demerits)
4. [AI Tool Comparison](#4-ai-tool-comparison)
5. [Project Cost Analysis](#5-project-cost-analysis)
6. [High-Level Build Guide](#6-high-level-build-guide)
7. [Brand Evaluation Methodology](#7-brand-evaluation-methodology)
8. [Use Cases](#8-use-cases)
9. [New Features & Future Roadmap](#9-new-features--future-roadmap)

---

## 1. Project Overview

### What is Brand Value Generator?

The **Brand Value Generator** is a FREE AI-powered web application that evaluates any company's brand automatically — just enter a URL. It analyzes website content, digital footprint (social media, reviews, news), and optional questionnaire answers to produce:

- **Overall brand score** (0-100) with letter-grade (Exceptional → Poor)
- **10 category scores** with detailed reasoning
- **SWOT analysis** (Strengths, Weaknesses, Risks, Opportunities)
- **Top 10 recommendations** prioritized by impact
- **30/90/365-day action plans**
- **Company details** (founder, CEO, team, funding, investors)
- **Digital footprint audit** (social media, reviews, press)
- **Professional PDF report** — ready to share

### Who It's For

| Audience | How They Use It |
|---|---|
| **SMBs & Startups** | Free brand audit to understand market position |
| **Marketing Agencies** | Quick baseline assessment for client pitches |
| **Founders & CEOs** | Track brand health over time |
| **Investors** | Due diligence on portfolio companies |
| **Brand Managers** | Identify gaps and prioritize initiatives |
| **Students & Researchers** | Study brand valuation methodologies |

---

## 2. Why This Project

### The Brand Value Gap

Traditional brand valuation is:
- **Expensive:** $5,000 – $50,000+ for a professional brand audit
- **Slow:** Takes weeks to complete
- **Inaccessible:** Only large corporations can afford regular audits
- **Subjective:** Results vary wildly between agencies

The Brand Value Generator solves all of this:
- **$0 per evaluation** (free tier)
- **<30 seconds** from URL to results
- **Anyone can use it** — no brand expertise needed
- **Consistent methodology** — same AI evaluates every brand the same way

### The Problem It Solves

Most small-to-medium businesses have **no quantified understanding of their brand strength**. They guess. They rely on gut feeling. Meanwhile, competitors with stronger brands capture more market share, charge higher prices, and attract better talent.

This tool turns brand from an abstract concept into a **measurable, actionable asset**.

### Market Context (2026)

| Trend | Impact on Brand Value |
|---|---|
| AI-powered brand analytics growing 28% CAGR | Automated tools becoming standard |
| Remote/hybrid work — brand is digital-first | Website = primary brand touchpoint |
| Social commerce explosion | Digital presence directly drives revenue |
| Investor focus on brand equity | Brand value = company valuation |
| SMB digital transformation | 60%+ of SMBs still lack brand strategy |

---

## 3. Merits & Demerits

### Merits (Pros)

| Merit | Details |
|---|---|
| **Completely free to run** | Groq + Tavily free tiers handle thousands of evaluations/month |
| **No infrastructure needed** | No database, no server, no auth — just a URL and API keys |
| **Fully automated** | Enter URL → get full brand report in <30 seconds |
| **10-category granularity** | Much more detailed than a single score |
| **Professional PDF export** | Ready-to-share report with proper layout |
| **Custom questionnaire** | Can add brand-specific context for better accuracy |
| **SWOT + Action Plans** | Not just scores — actionable next steps |
| **Company details extraction** | Automatically discovers founder, team, funding, investors |
| **Digital footprint audit** | Social media, reviews, news, competitors — all automated |
| **Fast iteration** | Run multiple evaluations to track changes |
| **Open source (by design)** | Can self-host, customize, extend |

### Demerits (Cons)

| Demerit | Impact | Mitigation |
|---|---|---|
| **Dependent on website quality** | Poor websites → poor evaluation | Use questionnaire to supplement |
| **No JavaScript rendering** | SPAs (React/Angular/Vue) may yield little data | Not a full technical SEO audit |
| **AI hallucination risk** | Unknown brands may get incorrect data | Wikipedia verification flags |
| **No persistent storage** | Results lost on refresh/tab close | Download PDF to save |
| **Grading is AI-subjective** | Not a statistically validated instrument | Consistent methodology, but not academic |
| **No multi-language support** | Non-English sites may score poorly | English-only prompts currently |
| **Node.js 20+ required** | Older systems need nvm/path update | One-time setup |
| **Rate limits on free tier** | ~200K TPM shared across evaluations | Stagger usage or upgrade |
| **No user accounts** | Cannot save history or compare across time | Potential future feature |
| **Trust signals limited** | SSL/GDPR detection is basic regex | Not a comprehensive security audit |

---

## 4. AI Tool Comparison

### For Brand Evaluation & Extraction

| Tool | Model | Cost | Speed | Quality | Best For |
|---|---|---|---|---|---|
| **Groq** | Llama 4 Scout 17B | Free (200K TPM) | Fastest (~3-5s) | Good | Primary choice — speed + cost |
| **Groq** | Llama 3.3 70B | Free (6K TPM) | Moderate (~8-12s) | Very Good | Deeper reasoning when needed |
| **Groq** | Llama 3.1 8B | Free (30K TPM) | Very Fast (~2-3s) | Fair | Fallback when others rate-limited |
| **Gemini** | Gemini 2.0 Flash | Free (60 req/min) | Fast (~4-6s) | Excellent | JSON compliance, structured output |
| **OpenAI** | GPT-4o Mini | ~$0.002/eval | Fast (~5s) | Very Good | When budget allows |
| **OpenAI** | GPT-4o | ~$0.15/eval | Slow (~15s) | Best | High-stakes evaluations |

### For Web Search (Company Discovery)

| Tool | Cost | Quality | Notes |
|---|---|---|---|
| **Tavily** | 1000 free/mo, then $0.005/req | Very Good | Purpose-built for AI agents |
| **SerpAPI** | 100 free/mo, then $0.01/req | Excellent | Google SERP quality |
| **Google Custom Search** | 100 free/day, then $5/1K queries | Good | Requires API key + CX setup |
| **Bing Search** | 1000 free/mo | Good | Lower coverage than Google |

### For Website Scraping

| Tool | Cost | Quality | Notes |
|---|---|---|---|
| **Cheerio + Axios** | Free | Good for static sites | No JS, fast, light |
| **Puppeteer / Playwright** | Free | Excellent for all sites | Full browser, heavy, slower |
| **Firecrawl** | 500 free/mo | Excellent | Managed scraping, JS rendering |
| **Apify** | $5/mo starter | Very Good | Ready-made scrapers |

### Recommendation

**Current stack is optimal for 90% of use cases:**

```
AI Inference:     Groq (Llama 4 Scout) — fastest free option
Search:           Tavily — purpose-built for AI, generous free tier
Scraping:         Cheerio — fast and sufficient for static/MVC sites

Upgrade path:
  Need better JSON?        → Add Gemini as fallback
  Need JS rendering?       → Add Puppeteer or Firecrawl
  Need higher quality?     → Upgrade to GPT-4o Mini ($0.002/eval)
  Need more searches?      → Tavily paid ($0.005/req)
```

---

## 5. Project Cost Analysis

### Free Tier Setup ($0/month)

| Component | Free Tier Limit | Evaluations/Month |
|---|---|---|
| Groq API (Llama 4 Scout) | 200K TPM | Unlimited (thousands) |
| Tavily API | 1,000 requests | ~1,000 evaluations |
| Vercel Hosting | 100GB bandwidth | Unlimited |
| **Total** | **$0/month** | **~1,000 free evaluations** |

### Per-Evaluation Cost Breakdown

| Component | Free Tier Cost | Paid Tier Cost |
|---|---|---|
| AI Extraction | $0.0000 | $0.0005-0.002 (Llama 3.3 70B) |
| AI Evaluation | $0.0000 | $0.0005-0.002 (Llama 3.3 70B) |
| AI Actions | $0.0000 | $0.0003-0.001 (Llama 3.3 70B) |
| Web Search (3-8 queries) | $0.0000 | $0.015-0.04 (beyond free tier) |
| Hosting | $0.0000 | ~$0.0001/eval |
| **Total (free tier)** | **$0.0000** | **—** |
| **Total (paid tier)** | **—** | **~$0.016-0.045/eval** |

### Upgrade Options

| Plan | Cost | What You Get |
|---|---|---|
| **Free** | $0/mo | ~1,000 evals/mo, Groq + Tavily free tiers |
| **Casual** | ~$5/mo | 5,000+ evals/mo, Tavily paid plan |
| **Professional** | ~$25/mo | 50,000+ evals/mo, Groq paid + Tavily paid |
| **Enterprise** | Custom | GPT-4o, dedicated hosting, custom pipeline |

### Cost Comparison: Traditional vs Automated

| Method | Cost | Time | Depth |
|---|---|---|---|
| Traditional brand audit agency | $5,000 – $50,000 | 2-6 weeks | Very deep |
| DIY brand assessment tools | $200 – $500 | 1-2 days | Medium |
| **Brand Value Generator** | **$0 – $0.05** | **<30 seconds** | **Comprehensive** |

**Bottom line:** This tool makes brand valuation 100,000x cheaper and 1,000x faster than traditional methods.

---

## 6. High-Level Build Guide

### Phase 1: Project Scaffold
**Goal:** Basic Next.js app with Tailwind ready to go.

```
npx create-next-app@latest automated-brand-value-generator --typescript --tailwind
# Add dependencies:
npm install groq-sdk @tavily/core cheerio axios recharts jspdf jspdf-autotable
```

**Deliverables:**
- `app/page.tsx` — landing page
- `app/layout.tsx` — root layout with Geist fonts
- `app/globals.css` — Tailwind v4 theme with custom brand colors
- `tsconfig.json`, `next.config.ts`, `postcss.config.mjs` configured

### Phase 2: URL Input & Validation
**Goal:** User can enter a URL, validation works, navigates to questionnaire.

**Key decisions:**
- Use client-side `new URL()` for validation
- Store URL in search params: `/questionnaire?url=...`
- Gradient hero section with purple accent (#7c3aed)

**Files created:**
- `components/url-input.tsx`
- `app/page.tsx` (updated)

### Phase 3: Questionnaire Flow
**Goal:** Optional 12-question form with progress tracking.

**Key decisions:**
- All questions optional — skip button available
- Progress bar shows completion %
- Textareas with placeholder hints per category

**Files created:**
- `lib/questionnaire.ts` — 12 questions schema
- `components/questionnaire-form.tsx`
- `app/questionnaire/page.tsx`

### Phase 4: Website Scraper
**Goal:** Extract content from any company website without JS.

**Key decisions:**
- Cheerio for parsing (fast, no browser)
- Axios for HTTP (simple, widely used)
- Batch 3 subpages at a time (no rate-limit)
- Extract: text, testimonials, team, pricing, trust signals, social links

**Files created:**
- `lib/scraper.ts`

**Challenges solved:**
- Links with relative paths (resolve against base URL)
- Subpage duplicate detection (case-insensitive, path-only)
- Testimonial extraction (quote patterns + positive keyword scoring)
- Large page truncation (8KB per page)

### Phase 5: Web Search Integration
**Goal:** Discover company digital footprint via search.

**Key decisions:**
- Tavily for search (AI-friendly, structured results)
- 8 queries per evaluation (6 general + 2 review-focused)
- Dedup by URL, classify into social/reviews/news
- Fall back gracefully if API key missing

**Files created:**
- `lib/web-search.ts`
- `app/api/web-search/route.ts`

### Phase 6: Wikipedia Integration
**Goal:** Verify company details against Wikipedia.

**Key decisions:**
- REST API for direct page lookup (fast)
- Action API fallback for fuzzy search (reliable)
- Regex extraction for 8 fields (founder, CEO, revenue, etc.)
- Return verification booleans per field

**Files created:**
- `lib/wikipedia.ts`

### Phase 7: AI Pipeline — Extraction
**Goal:** Extract structured company data from raw scraped content.

**Key decisions:**
- Groq as primary (fastest, free)
- Gemini as alternative (better JSON)
- Llama 4 Scout 17B for first attempt, fallback to Llama 3.3 70B, then 3.1 8B
- Prompt truncation at ~25KB to avoid 413 errors
- Retry logic on 429 (rate limit)

**Files created:**
- `lib/groq.ts` — system prompt EXTRACT_PROMPT
- `lib/gemini.ts` — alternative implementation

### Phase 8: AI Pipeline — Evaluation & Actions
**Goal:** Score brand across 10 categories, generate SWOT and recommendations.

**Key decisions:**
- Separate prompts for evaluation and actions (better focus)
- EVALUATE_PROMPT: 10 categories, each scored 0-10 with reasoning
- ACTION_PROMPT: recommendations, 3 time-bucketed action plans
- Grade mapping: 90+ Exceptional, 80+ Excellent, 70+ Strong, 60+ Good, etc.

**Files extended:**
- `lib/groq.ts` — added EVALUATE_PROMPT, ACTION_PROMPT
- `lib/gemini.ts` — same

### Phase 9: API Route — `/api/evaluate`
**Goal:** End-to-end pipeline: URL → scrape → search → Wikipedia → extract → evaluate → respond.

**Key decisions:**
- Run scrape/search/Wikipedia in parallel (Promise.all)
- Truncate prompts to avoid 413 errors
- Merge extraction + evaluation + actions into single response
- Add wikipediaVerified flags to response

**Files created:**
- `app/api/evaluate/route.ts`

### Phase 10: Results Dashboard (UI)
**Goal:** 7-tab results page with all the data.

**Key decisions:**
- Read from `sessionStorage` (no backend calls for results)
- 7 tabs: Overview, Scores, SWOT, Recommendations, Action Plans, Company Info, Team
- Recharts for radar chart, inline SVG for score gauge
- Responsive grid layout

**Files created:**
- `components/brand-score.tsx` — animated SVG circular gauge
- `components/score-radar.tsx` — Recharts RadarChart
- `components/category-details.tsx` — accordion with bars
- `components/strengths-weaknesses.tsx` — 2x2 SWOT grid
- `components/recommendations.tsx` — numbered cards
- `components/action-plans.tsx` — tabbed panels
- `components/company-info.tsx` — key-value + wiki badges
- `components/company-details.tsx` — leadership/funding cards
- `components/executive-summary.tsx` — gradient card
- `app/results/page.tsx` — main results page

### Phase 11: PDF Report Export
**Goal:** Professional PDF download with all data.

**Key decisions:**
- jsPDF + jspdf-autotable (no html2canvas — Safari issues)
- Full programmatic layout: cover page, headers, footers, sections
- Score ring SVG approximation with line segments
- Company info label/value pairs, SWOT with colored accent bars
- autoTable for category scores

**Files extended:**
- `app/results/page.tsx` — `handleDownloadPDF()` function

### Phase 12: Error Handling & Polish
**Goal:** Handle edge cases gracefully.

**Key decisions:**
- Loading states with animated dots (3 phases)
- Error redirect with URL-encoded message
- Rate limit (429) vs failed evaluation distinction
- Empty data fallbacks (no team, no social, no reviews)
- Confidence note for low-quality evaluations

**Files affected:**
- All components — conditional rendering for empty states
- API route — structured error responses

---

## 7. Brand Evaluation Methodology

### The 10 Scoring Categories

| # | Category | What It Measures | Weight |
|---|---|---|---|
| 1 | **Brand Identity** | Clarity of mission, vision, values, personality | High |
| 2 | **Website Experience** | Design quality, UX, mobile responsiveness | High |
| 3 | **Customer Trust** | Social proof, reviews, security signals, transparency | High |
| 4 | **Brand Consistency** | Uniform messaging across all channels | Medium |
| 5 | **Digital Presence** | Social media activity, SEO, content marketing | Medium |
| 6 | **Marketing Maturity** | Channel diversity, campaign sophistication | Medium |
| 7 | **Competitive Position** | Market differentiation, USP strength | Medium |
| 8 | **Customer Experience** | Support, feedback loops, user journey | Medium |
| 9 | **Innovation** | Product evolution, industry thought leadership | Low |
| 10 | **Growth Potential** | Scalability, market opportunity, expansion readiness | Low |

### Grade Scale

| Score Range | Grade | Color | Meaning |
|---|---|---|---|
| 90-100 | **Exceptional** | Emerald | World-class brand — benchmark for others |
| 80-89 | **Excellent** | Green | Strong brand with minor improvement areas |
| 70-79 | **Strong** | Blue | Well-established brand with clear strategy |
| 60-69 | **Good** | Purple | Solid foundation but significant gaps |
| 50-59 | **Average** | Yellow | Functional but undifferentiated |
| 30-49 | **Weak** | Orange | Significant brand problems |
| 0-29 | **Poor** | Red | Brand is absent or severely damaged |

### How Each Category Is Scored

The AI evaluates each category based on:

1. **Brand Identity:** Does the website clearly communicate mission, vision, values? Is there a distinct brand personality? Is the brand positioning clear?

2. **Website Experience:** Is the design modern and professional? Is it mobile-responsive? Are navigation and CTAs intuitive? Is the site fast?

3. **Customer Trust:** Are there customer testimonials, reviews, case studies? Are trust signals present (SSL, privacy policy, guarantees)? Is there transparency about the company?

4. **Brand Consistency:** Is the same messaging used across website, social media, and reviews? Is the visual identity consistent (logo, colors, fonts)?

5. **Digital Presence:** Is there active social media? Does the company appear in search results? Is there content marketing (blog, resources)?

6. **Marketing Maturity:** Are there multiple marketing channels? Is there sophisticated CTA strategy? Is there evidence of campaigns or lead generation?

7. **Competitive Position:** Is the USP clear? Does the brand differentiate from competitors? Is there a defensible market position?

8. **Customer Experience:** Is there evidence of customer support? Are there feedback mechanisms? Is the user journey smooth?

9. **Innovation:** Does the company seem innovative (blog topics, product updates, industry mentions)? Is there thought leadership?

10. **Growth Potential:** Is the company in a growing market? Are there expansion signals? Is the business model scalable?

### AI Hard Rules

The AI prompt enforces these rules to prevent grade inflation:

- Must provide 3+ sentences of reasoning per category
- Weak websites (unprofessional, no content, no social) get **Poor** grade
- Average websites with basic information get **Average** grade
- Only truly excellent websites with clear strategy get **Exceptional**
- Scores are based on evidence from scraped content, not assumptions
- If data is insufficient, the AI is instructed to score conservatively

---

## 8. Use Cases

### 1. Brand Audit for SMBs
A local business owner enters their website URL and gets a full brand assessment in 30 seconds. They discover their digital presence is weak (scoring 45/100) and get specific recommendations to improve social media, website UX, and customer reviews.

### 2. Competitive Analysis
A marketing agency evaluates 10 competitor brands in their client's market. They build a competitive matrix showing each brand's strengths and weaknesses, then develop positioning strategy for their client.

### 3. Agency Pitching
An agency includes a brand value report in their pitch deck. The PDF report shows the prospect's current brand score alongside projected scores after agency engagement. Quantified ROI pitch.

### 4. Investor Due Diligence
An angel investor evaluates a startup's brand strength before investing. The report reveals strong product positioning (8/10) but weak digital presence (4/10), prompting a discussion about marketing investment in term sheets.

### 5. Marketing Strategy Planning
A brand manager runs quarterly evaluations to track brand health trends. 6-month report shows brand score improved from 62 to 78 — validating their content marketing and social media initiatives.

### 6. Educational Tool
A university marketing professor uses the tool in class. Students evaluate real brands and compare results, learning about brand valuation methodology and digital footprint analysis.

---

## 9. New Features & Future Roadmap

### Priority: High (Next Release)

| Feature | Description | Impact |
|---|---|---|
| **User Accounts & History** | Save evaluation history, compare scores over time | Track brand health trends |
| **Multi-Language Support** | Translate prompts and UI for top 10 languages | Global market reach |
| **Batch Evaluation** | Upload CSV of URLs, get bulk report | Agency/enterprise use case |
| **Shareable Report Links** | Generate public/private links to results | Easy sharing with stakeholders |
| **Brand Score Over Time** | Re-evaluate and show score trendline | Measure improvement |

### Priority: Medium

| Feature | Description | Impact |
|---|---|---|
| **Competitor Comparison Mode** | Evaluate multiple brands side-by-side | Competitive analysis |
| **Custom Scoring Weights** | Let users adjust category importance | Tailored evaluations |
| **AI Confidence Meter** | Per-score confidence indicator (High/Medium/Low) | Trust in results |
| **Interactive PDF** | Clickable table of contents in PDF | Better report UX |
| **Data Export (CSV/JSON)** | Raw data export for analysis | Advanced users |
| **Email Report Delivery** | Send PDF to email on completion | Convenience |
| **Custom Branding (White-Label)** | Remove Brand Value Generator branding | Agency use |
| **Dark Mode** | Dark theme for the app UI | User preference |

### Priority: Low (Nice to Have)

| Feature | Description |
|---|---|
| **Google Search Console Integration** | Pull real search performance data |
| **Social Media API Integration** | Real follower counts, engagement metrics |
| **LinkedIn Company API** | Verified company details from LinkedIn |
| **Mobile App (React Native)** | Native mobile experience |
| **Chrome Extension** | Quick evaluate any site while browsing |
| **API for External Consumers** | Expose evaluation as a public API |
| **Custom Question Builder** | Users create their own questionnaire |
| **Industry Benchmarking** | Compare score against industry averages |
| **AI Reasoning Transparency** | Show which source data influenced each score |
| **Scheduled Evaluations** | Weekly/monthly automatic re-evaluations |

### Wild Ideas (Long-Term)

| Idea | Description |
|---|---|
| **Brand Value in $** | Estimate brand monetary value using revenue multiple |
| **Voice of Customer Analysis** | NLP on customer reviews for sentiment trends |
| **Visual Brand Audit** | Screenshot analysis for color/logo consistency |
| **AI Brand Strategist Chat** | Chat with AI about your brand results |
| **Multi-User Workspace** | Team collaboration on brand projects |
| **Integration Hub** | Connect to HubSpot, Salesforce, WordPress |
| **Brand Risk Score** | Predict brand crisis risk based on weaknesses |
| **Acquisition Brand Audit** | Evaluate brand as part of M&A due diligence |
| **Personal Brand Evaluator** | LinkedIn/X profile evaluation for individuals |

---

## Quick Reference Card

```
Purpose:     AI-powered brand evaluation from any company URL
Cost:        $0/month (free tier) — ~1,000 evaluations
Time:        ~30 seconds per evaluation
Output:      10 category scores, SWOT, action plans, PDF report
Best for:    SMBs, agencies, investors, brand managers
Stack:       Next.js 16 + TypeScript + Tailwind v4 + Groq + Tavily
Live demo:   http://localhost:3000 (self-hosted)
```
