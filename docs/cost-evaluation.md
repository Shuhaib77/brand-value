# Brand Value Evaluator — Cost Evaluation & AI Provider Comparison

> **Date:** July 2026
> **Current Setup:** Groq (free) + Tavily (free) + Wikipedia (free) + Web Scrapers (free) → **$0 / evaluation**

---

## 1. Current Architecture Overview

```
User submits URL
    │
    ├── Scraper ────────────── Free (no API cost)
    ├── Tavily Search ──────── Free (1,000 credits/month)
    ├── Wikipedia API ──────── Free (unlimited)
    └── AI Pipeline (3 calls):
         ├── Extraction ────── Groq (free)
         ├── Evaluation ────── Groq (free)
         └── Action Plan ───── Groq (free)
    │
    └── Result → Display + PDF
```

### Token Usage Per Evaluation (Estimated)

| Step | System Prompt | User Input | Output | Total Tokens |
|------|:------------:|:----------:|:------:|:------------:|
| **Extraction** | ~1,040 | ~8,750 | ~350 | ~10,140 |
| **Evaluation** | ~2,000 | ~7,500 | ~900 | ~10,400 |
| **Action Plan** | ~90 | ~2,000 | ~450 | ~2,540 |
| **Total** | ~3,130 | ~18,250 | ~1,700 | **~23,080** |

**Tavily:** 1 search per evaluation (1 credit)

**Total per evaluation:** ~23K tokens + 1 Tavily credit

---

## 2. Current Cost: $0 / Evaluation (Free Tier)

| Service | Free Tier Limit | Usage Per Eval | Max Evals Before Hit |
|---------|:----------------:|:--------------:|:--------------------:|
| Groq API | 30 req/min, 6K tok/min, 14.4K req/day | 3 requests | ~4,800 evals/day (req limit) |
| Tavily | 1,000 credits/month | 1 credit | 1,000 evals/month |
| Wikipedia | Unlimited (rate-limited per IP) | 1 request | Unlimited |
| Scraping | Unlimited (no API key needed) | 1 site | Unlimited |

**Key constraint:** Tavily's 1,000 free credits/month limits you to **~33 evaluations/day** on free tier. Groq's 6K tok/min limits throughput on large prompts.

---

## 3. AI Provider Pricing Table (per 1M tokens, USD)

All prices are **standard on-demand rates** as of July 2026. Batch/cached pricing noted separately.

| Provider | Model | Input $/1M tok | Output $/1M tok | Context | Speed | Quality |
|----------|-------|:--------------:|:---------------:|:-------:|:-----:|:-------:|
| **Groq** 🟢 (current) | Llama-3.3-70B | $0.59 | $0.79 | 128K | ⚡ Fast | ⭐⭐⭐ |
| | Llama-4-Scout-17B | $0.15 | $0.20 | 16K | ⚡ Very Fast | ⭐⭐ |
| | Llama-3.1-8B | $0.05 | $0.08 | 128K | ⚡ Fastest | ⭐ |
| **Google Gemini** 🟢 (partial) | Gemini 2.5 Pro | $1.25 | $10.00 | 2M | 🐢 Slower | ⭐⭐⭐⭐⭐ |
| | Gemini 2.5 Flash | $0.30 | $2.50 | 1M | ⚡ Fast | ⭐⭐⭐⭐ |
| | Gemini 2.5 Flash-Lite | $0.10 | $0.40 | 1M | ⚡ Fast | ⭐⭐⭐ |
| **OpenAI** | GPT-4o (legacy) | $2.50 | $10.00 | 128K | ⚡ Fast | ⭐⭐⭐⭐⭐ |
| | GPT-4o Mini | $0.15 | $0.60 | 128K | ⚡ Fast | ⭐⭐⭐⭐ |
| | GPT-4.1 (new) | $5.00 | $15.00 | 1M | ⚡ Fast | ⭐⭐⭐⭐⭐ |
| | GPT-4.1 Mini | $0.40 | $1.60 | 1M | ⚡ Fast | ⭐⭐⭐⭐ |
| **Anthropic** | Claude 3.5 Sonnet | $3.00 | $15.00 | 200K | ⚡ Medium | ⭐⭐⭐⭐⭐ |
| | Claude 3.5 Haiku | $0.80 | $4.00 | 200K | ⚡ Fast | ⭐⭐⭐⭐ |
| **Mistral** | Mistral Large 3 | $2.00 | $6.00 | 262K | ⚡ Fast | ⭐⭐⭐⭐ |
| | Mistral Small 4 | $0.10 | $0.30 | 128K | ⚡ Very Fast | ⭐⭐⭐ |
| **DeepSeek** | DeepSeek V4 Pro | $0.44 | $0.87 | 512K | ⚡ Medium | ⭐⭐⭐⭐ |
| | DeepSeek V4 Flash | $0.14 | $0.28 | 512K | ⚡ Fast | ⭐⭐⭐ |
| **Together AI** | Llama-3.3-70B Turbo | $1.04 | $1.04 | 131K | ⚡ Fast | ⭐⭐⭐ |
| | Qwen 2.5 7B | $0.30 | $0.30 | 32K | ⚡ Very Fast | ⭐⭐ |

### Discounts

| Discount Type | Typical Savings |
|--------------|:---------------:|
| Prompt caching (cached input) | 50–90% off input |
| Batch API | 50% off standard rates |
| Groq Developer tier (add card) | 25% off + 10× rate limits |

---

## 4. Per-Evaluation Cost Comparison

Using ~20K input + ~1.7K output tokens per eval (from Section 1):

| Provider | Model | Input Cost | Output Cost | **Total Per Eval** |
|----------|-------|:----------:|:-----------:|:------------------:|
| **Groq** | Llama-3.3-70B | $0.000012 | $0.000001 | **$0.000013** |
| **Groq** (dev tier -25%) | Llama-3.3-70B | $0.000009 | $0.000001 | **$0.000010** |
| **Gemini** | 2.5 Flash | $0.000006 | $0.000004 | **$0.000010** |
| **Gemini** | 2.5 Pro | $0.000025 | $0.000017 | **$0.000042** |
| **DeepSeek** | V4 Flash | $0.000003 | $0.0000005 | **$0.000004** |
| **DeepSeek** | V4 Pro | $0.000009 | $0.000001 | **$0.000010** |
| **Mistral** | Small 4 | $0.000002 | $0.0000005 | **$0.000003** |
| **Mistral** | Large 3 | $0.000040 | $0.000010 | **$0.000050** |
| **OpenAI** | GPT-4o Mini | $0.000003 | $0.000001 | **$0.000004** |
| **OpenAI** | GPT-4o (legacy) | $0.000050 | $0.000017 | **$0.000067** |
| **OpenAI** | GPT-4.1 Mini | $0.000008 | $0.000003 | **$0.000011** |
| **Anthropic** | Claude Haiku | $0.000016 | $0.000007 | **$0.000023** |
| **Anthropic** | Claude Sonnet | $0.000060 | $0.000026 | **$0.000086** |
| **Together AI** | Llama-3.3-70B | $0.000021 | $0.000002 | **$0.000023** |

> **Note:** These are per-evaluation costs **after** the free tier is exhausted. On free tier, all costs are $0 (within rate limits).

### Tavily Costs

| Plan | Price | Credits | Cost Per Search | Evals Included |
|------|:----:|:-------:|:---------------:|:--------------:|
| Free | $0 | 1,000/mo | Free | 1,000/mo |
| Project | $30/mo | 4,000 | $0.008 | 4,000/mo |
| Bootstrap | $100/mo | 15,000 | $0.007 | 15,000/mo |
| Growth | $500/mo | 100,000 | $0.005 | 100,000/mo |

---

## 5. Monthly Cost Projections (Including Tavily)

| Evals/Month | Provider | AI Cost | Tavily Cost | **Total/Month** |
|:-----------:|----------|:-------:|:-----------:|:----------------:|
| **100** | Groq (free) | $0.00 | $0.00 | **$0.00** |
| | GPT-4o Mini | $0.0004 | $0.00 | **$0.00** (free Tavily) |
| | Claude Sonnet | $0.0086 | $0.00 | **$0.01** |
| | DeepSeek V4 Flash | $0.0004 | $0.00 | **$0.00** |
| **500** | Groq (free) | $0.00 | $0.00 | **$0.00** (free Tavily) |
| | Groq (paid) | $0.005 | $0.00 | **$0.01** |
| | GPT-4o Mini | $0.002 | $0.00 | **$0.00** |
| | Gemini 2.5 Flash | $0.005 | $0.00 | **$0.01** |
| **1,000** | Groq (free) | $0.00 | $0.00 | **$0.00** |
| | DeepSeek V4 Flash | $0.004 | $0.00 | **$0.00** |
| | GPT-4o Mini | $0.004 | $8.00 (PAYG) | **$8.00** |
| | Gemini 2.5 Flash | $0.01 | $8.00 (PAYG) | **$8.01** |
| **10,000** | DeepSeek V4 Flash | $0.04 | $80.00 (PAYG) | **$80.04** |
| | GPT-4o Mini | $0.04 | $80.00 | **$80.04** |
| | Gemini 2.5 Flash | $0.10 | $80.00 | **$80.10** |
| | Groq Llama-3.3-70B (dev tier) | $0.10 | $80.00 | **$80.10** |
| | Gemini 2.5 Pro | $0.42 | $80.00 | **$80.42** |
| **50,000** | DeepSeek V4 Flash | $0.20 | $400 (Growth) | **$400.20** |
| | GPT-4o Mini | $0.20 | $400 | **$400.20** |
| | Mistral Small 4 | $0.15 | $400 | **$400.15** |
| | Claude Sonnet | $4.30 | $400 | **$404.30** |

---

## 6. Feature & Quality Comparison

| Factor | Groq (current) | Gemini Flash | GPT-4o Mini | Claude Sonnet | DeepSeek V4 Flash |
|--------|:--------------:|:------------:|:-----------:|:-------------:|:-----------------:|
| **Quality (1-10)** | 6 | 7 | 8 | 9 | 7 |
| **Speed** | ⚡⚡⚡⚡⚡ | ⚡⚡⚡⚡ | ⚡⚡⚡⚡ | ⚡⚡⚡ | ⚡⚡⚡ |
| **JSON reliability** | ✅ Good | ✅ Native | ✅ Excellent | ✅ Excellent | ✅ Good |
| **Rate limits** | 30 req/min free | 1,500 req/day free | 500 req/min (T1) | 1,000 req/min | 500 req/min |
| **Context window** | 128K | 1M | 128K | 200K | 512K |
| **Free tier** | ✅ Generous | ✅ 1500 req/day | ✅ $5 free credit | ✅ $5 free credit | ❌ None |
| **Multimodal** | ❌ Text only | ✅ Image/Video | ✅ Image/Audio | ✅ Image | ❌ Text only |

### Quality Observations

- **Groq (Llama-3.3-70B):** Good for extraction and simple tasks. Can struggle with nuanced evaluation. Fastest inference.
- **Gemini 2.5 Flash:** Excellent quality-to-price ratio. Native JSON output. Handles long context well. Already partially integrated.
- **GPT-4o Mini:** Strong all-rounder. Best JSON compliance. Very reliable structured output.
- **Claude 3.5 Sonnet:** Best evaluation quality. Most thoughtful analysis. Slower but worth it for high-value evaluations.
- **DeepSeek V4 Flash:** Cheapest frontier-class model. Surprising quality for the price. Good for high-volume extraction.

---

## 7. Hybrid Strategy (Recommended)

A **hybrid approach** gives the best balance of cost and quality:

| Step | Recommended Model | Rationale |
|------|------------------|-----------|
| **Extraction** | DeepSeek V4 Flash ($0.000004/ev) | Cheap, good at structured extraction |
| **Evaluation** | GPT-4o Mini or Gemini 2.5 Flash ($0.00001/ev) | Best quality-to-price for analysis |
| **Action Plan** | Groq Llama-3.3-70B (free) | Simple generation, free tier sufficient |
| **Web Search** | Tavily free (1,000/mo) or Project ($30/mo) | Scales with volume |

### Hybrid Cost Per Eval:
- **Up to 1,000 evals/month:** $0.00001 (most free tier)
- **10,000 evals/month:** ~$0.08 (Tavily: $80/10K + AI: $0.10/10K = $80.10)
- **100,000 evals/month:** ~$480 (Tavily Growth: $500 + AI: $1 = $501)

---

## 8. Recommendations

| Volume | Recommended Setup | Monthly Cost | Notes |
|:------:|------------------|:------------:|-------|
| **<1K evals/mo** | Groq (free) + Tavily (free) | **$0** | Current setup is ideal. No changes needed. |
| **1K–5K evals/mo** | DeepSeek V4 Flash + Tavily Project | **$30–$80** | ~$0.02/ev. Switch to cheap paid AI when Tavily free runs out. |
| **5K–20K evals/mo** | Gemini 2.5 Flash + Tavily Bootstrap | **$100–$200** | ~$0.01/ev. Gemini is already partially integrated. |
| **20K–100K evals/mo** | Hybrid: DeepSeek extract + Gemini eval + Tavily Growth | **$350–$500** | ~$0.005/ev. Optimize with prompt caching. |
| **100K+ evals/mo** | DeepSeek V4 Flash + Tavily custom + Batch API | **$500–$800** | Negligible per-eval cost with batch + caching. |

### Quick Wins (No Code Changes Needed)

1. **Switch extraction to DeepSeek V4 Flash** — $0.000004/ev, better than Llama for structured output
2. **Keep Groq for action plans** — free tier handles this easily
3. **Add Gemini 2.5 Flash as evaluation fallback** — already have `gemini.ts`, just wire it in

---

## 9. Provider Comparison Summary

```
Cost per 1K evals (AI only, no Tavily):

  Groq (free)       │ $0.00  ████████████████████████████
  Groq (paid)       │ $0.01  ████
  DeepSeek V4 Flash │ $0.00  ████████████████████████████
  Mistral Small 4   │ $0.00  ████████████████████████████
  GPT-4o Mini       │ $0.00  ████████████████████████████
  Gemini Flash      │ $0.01  ████████████████████████████
  GPT-4o (legacy)   │ $0.07  ██████████
  Claude Sonnet     │ $0.09  ████████
  Gemini Pro        │ $0.04  ██████████████████

          Cost ───────────────────────────────► Quality
```

---

## 10. Tech Integration Effort

| Provider | Integration Status | Effort to Add |
|----------|:-----------------:|:-------------:|
| **Groq** | ✅ Fully integrated | — |
| **Gemini** | ✅ `gemini.ts` exists, not wired in pipeline | Low (hours) |
| **OpenAI** | ❌ Not present | Medium (days) |
| **Anthropic** | ❌ Not present | Medium (days) |
| **Mistral** | ❌ Not present | Medium (days) |
| **DeepSeek** | ❌ Not present | Medium (days) |
| **Together AI** | ❌ Not present | Medium (days) |

---

## Appendix: Free Tier Limits Detailed

| Provider | Free Tier | Limits |
|----------|-----------|--------|
| **Groq** | All models, no card needed | 30 req/min, 6K tok/min, 14.4K req/day |
| **Google Gemini** | 1,500 requests/day (Flash) | 30 req/min (Flash), no card needed for free tier |
| **OpenAI** | $5 free credit (new accounts) | Expires after 3 months |
| **Anthropic** | $5 free credit (new accounts) | Expires after 3 months |
| **Tavily** | 1,000 credits/month | No card needed |
| **Wikipedia** | Unlimited | Rate-limited per IP (~200 req/min) |
| **DeepSeek** | None | Pay-as-you-go only ($0.14/M input min) |

---

*Generated July 2026. Prices may change — verify at each provider's pricing page before making decisions.*
