# AI Provider Comparison — Best / Medium / Low Tiers

> All costs are **per evaluation** (~23K tokens: 20K input + 1.7K output) unless noted.
> Current setup: **Groq (free) + Tavily (free) → $0/eval** within free limits.

---

## Tier 1: Best Quality (⭐⭐⭐⭐⭐)

Highest accuracy for brand evaluation. Use when data quality is critical.

| Provider | Model | Quality | Per-Eval Cost | 1K Evals/Mo | Data Perfect? |
|----------|-------|:-------:|:-------------:|:-----------:|:-------------:|
| **Anthropic** | Claude 3.5 Sonnet | ⭐⭐⭐⭐⭐ | **$0.000086** | $0.09 | ✅ Best analysis |
| **OpenAI** | GPT-4.1 | ⭐⭐⭐⭐⭐ | $0.000120 | $0.12 | ✅ Best JSON |
| **OpenAI** | GPT-4o (legacy) | ⭐⭐⭐⭐⭐ | $0.000067 | $0.07 | ✅ Reliable |
| **Google** | Gemini 2.5 Pro | ⭐⭐⭐⭐⭐ | $0.000042 | $0.04 | ✅ Long context |

**Best for:** Premium evaluations, complex brand analysis, when garbage data is unacceptable.

**Exact costs per eval (AI only):**
- Claude Sonnet: 20K × $3.00/1M + 1.7K × $15.00/1M = $0.060 + $0.026 = **$0.000086**
- GPT-4.1: 20K × $5.00/1M + 1.7K × $15.00/1M = $0.100 + $0.026 = **$0.000120**
- GPT-4o: 20K × $2.50/1M + 1.7K × $10.00/1M = $0.050 + $0.017 = **$0.000067**
- Gemini 2.5 Pro: 20K × $1.25/1M + 1.7K × $10.00/1M = $0.025 + $0.017 = **$0.000042**

---

## Tier 2: Medium Quality (⭐⭐⭐⭐)

Good quality at reasonable cost. Best price-to-performance ratio.

| Provider | Model | Quality | Per-Eval Cost | 1K Evals/Mo | Data Perfect? |
|----------|-------|:-------:|:-------------:|:-----------:|:-------------:|
| **OpenAI** | GPT-4o Mini | ⭐⭐⭐⭐ | **$0.000004** | $0.00 | ✅ Very reliable |
| **OpenAI** | GPT-4.1 Mini | ⭐⭐⭐⭐ | $0.000011 | $0.01 | ✅ Reliable |
| **Google** | Gemini 2.5 Flash | ⭐⭐⭐⭐ | $0.000010 | $0.01 | ✅ Native JSON |
| **Anthropic** | Claude 3.5 Haiku | ⭐⭐⭐⭐ | $0.000023 | $0.02 | ✅ Good |
| **Mistral** | Mistral Large 3 | ⭐⭐⭐⭐ | $0.000050 | $0.05 | ✅ Good |
| **DeepSeek** | DeepSeek V4 Pro | ⭐⭐⭐⭐ | $0.000010 | $0.01 | ✅ Good |

**Best for:** Volume evaluations where quality matters but cost must stay low.

**Exact costs per eval (AI only):**
- GPT-4o Mini: 20K × $0.15/1M + 1.7K × $0.60/1M = $0.003 + $0.001 = **$0.000004**
- Gemini 2.5 Flash: 20K × $0.30/1M + 1.7K × $2.50/1M = $0.006 + $0.004 = **$0.000010**
- DeepSeek V4 Pro: 20K × $0.44/1M + 1.7K × $0.87/1M = $0.009 + $0.001 = **$0.000010**
- Claude Haiku: 20K × $0.80/1M + 1.7K × $4.00/1M = $0.016 + $0.007 = **$0.000023**
- Mistral Large 3: 20K × $2.00/1M + 1.7K × $6.00/1M = $0.040 + $0.010 = **$0.000050**

---

## Tier 3: Low Cost (⭐⭐⭐)

Cheapest options. Good for extraction and simple tasks. May produce more garbage.

| Provider | Model | Quality | Per-Eval Cost | 1K Evals/Mo | Data Perfect? |
|----------|-------|:-------:|:-------------:|:-----------:|:-------------:|
| **Groq** | Llama-3.3-70B (free) | ⭐⭐⭐ | **$0.000000** | $0.00 | ⚠️ Occasional |
| **Groq** | Llama-3.3-70B (paid) | ⭐⭐⭐ | $0.000013 | $0.01 | ⚠️ Occasional |
| **DeepSeek** | V4 Flash | ⭐⭐⭐ | $0.000004 | $0.00 | ⚠️ Good for price |
| **Mistral** | Small 4 | ⭐⭐⭐ | $0.000003 | $0.00 | ⚠️ Basic |
| **Groq** | Llama-4-Scout-17B | ⭐⭐ | $0.000004 | $0.00 | ❌ Lower |
| **Groq** | Llama-3.1-8B | ⭐ | $0.000002 | $0.00 | ❌ Weak |

**Best for:** High-volume extraction, action plan generation, free tier usage.

**Exact costs per eval (AI only):**
- DeepSeek V4 Flash: 20K × $0.14/1M + 1.7K × $0.28/1M = $0.003 + $0.0005 = **$0.000004**
- Mistral Small 4: 20K × $0.10/1M + 1.7K × $0.30/1M = $0.002 + $0.0005 = **$0.000003**

---

## Monthly Cost Projections (AI + Tavily)

| Volume | Best Tier | Cost/Mo | Medium Tier | Cost/Mo | Low Tier | Cost/Mo |
|:------:|-----------|:-------:|-------------|:-------:|----------|:-------:|
| **100** | GPT-4o | $0.01 | GPT-4o Mini | $0.00 | Groq (free) | **$0** |
| **500** | Claude Sonnet | $0.05 | GPT-4o Mini | $0.00 | Groq (free) | **$0** |
| **1,000** | Gemini 2.5 Pro | $0.04 | GPT-4o Mini | $0.00 | Groq (free) | **$0** |
| **5,000** | GPT-4.1 Mini | $0.06 | Gemini Flash | $0.05 | DeepSeek Flash | $0.02 |
| **10,000** | GPT-4.1 Mini | $0.11 | Gemini Flash | $0.10 | DeepSeek Flash | $0.04 |
| **50,000** | GPT-4.1 Mini | $0.55 | Gemini Flash | $0.50 | DeepSeek Flash | $0.20 |

> Tavily costs add $0 (free up to 1K/mo), $30 (Project, 4K), $100 (Bootstrap, 15K), or $500 (Growth, 100K).

---

## Hybrid Strategy — Best Data Quality Per Dollar

Use different models per pipeline step to maximize data quality while minimizing cost:

| Step | Recommended Model | Tier | Per-Eval Cost | Why |
|------|------------------|:----:|:-------------:|-----|
| **Extraction** | DeepSeek V4 Flash | Low | $0.000004 | Cheap, good at structured extraction |
| **Evaluation** | Gemini 2.5 Flash | Medium | $0.000010 | Best quality-to-price for analysis |
| **Action Plan** | Groq Llama-3.3-70B | Low | $0.000000 (free) | Simple generation, free tier enough |
| **Web Search** | Tavily (free/paid) | — | $0 or $0.005 | Scales with volume |

**Hybrid cost:** $0.000014/eval (AI only), plus Tavily costs when exceeding free tier.

To make **all AI produce perfect data** (no garbage):
1. Use Tier 1 (Sonnet/4.1) for final evaluation when quality is critical
2. Use Tier 2 (Mini/Flash) for daily volume — nearly as good at 10-20x less cost
3. Run all outputs through `isLikelyPersonName` validation (already implemented)
4. Apply retry logic when confidence is low (already implemented)

---

## Summary: Quality vs Cost

| Quality Tier | Per-Eval Cost | Monthly (1K evals) | Best Model |
|:------------:|:-------------:|:------------------:|------------|
| **Best** | $0.00004–0.00012 | $0.04–$0.12 | Claude Sonnet / GPT-4.1 |
| **Medium** | $0.000004–0.00005 | $0.00–$0.05 | GPT-4o Mini / Gemini Flash |
| **Low** | $0.000000–0.00001 | $0.00–$0.01 | DeepSeek Flash / Groq free |

---

*Costs calculated using ~23K tokens/eval. Actual costs vary with prompt length. See `cost-evaluation.md` for full breakdown.*
