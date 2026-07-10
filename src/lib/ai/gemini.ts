import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

async function callGemini(systemPrompt: string, userContent: string, maxTokens = 2000, maxRetries = 3) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: maxTokens,
      responseMimeType: "application/json",
    },
  })

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemPrompt}\n\n${userContent}` }],
          },
        ],
      })

      const text = result.response.text()
      if (!text) throw new Error("Gemini returned empty response")
      return JSON.parse(text)
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string }
      const isQuota = err?.message?.includes("429") || err?.status === 429
      if (isQuota && attempt < maxRetries) {
        const delay = (attempt + 1) * 15000
        console.warn(`Gemini 429 (attempt ${attempt + 1}/${maxRetries}). Retrying in ${delay}ms...`)
        await new Promise(r => setTimeout(r, delay))
        continue
      }
      throw error
    }
  }
}

const EXTRACT_PROMPT = `You are a data extraction specialist. Extract structured company data from the provided website content, Wikipedia data, and web search results.

Rules:
- Use Wikipedia data as the primary source for company details (founding year, founder, employees, revenue, CEO, headquarters, industry)
- Use website content for brand-specific fields (mission, values, products, USP, brand personality)
- Never invent data. If a field cannot be determined, set it to null.
- For leadershipTeam, extract actual names and titles from team/about pages.
- For digitalFootprint, use only what's found in web search results.

Return this exact JSON:
{
  "companyName": "string|null",
  "industry": "string|null",
  "productsOrServices": ["string"],
  "businessDescription": "string|null",
  "targetAudience": "string|null",
  "brandMission": "string|null",
  "brandVision": "string|null",
  "coreValues": ["string"],
  "usp": "string|null",
  "headquarters": "string|null",
  "yearsInBusiness": "string|null",
  "brandPersonality": "string|null",
  "mainCompetitors": ["string"],
  "primaryCallToAction": "string|null",
  "websiteQuality": "string|null",
  "overallProfessionalism": "string|null",
  "companyDetails": {
    "founderName": "string|null",
    "founderBackground": "string|null",
    "ceoName": "string|null",
    "leadershipTeam": [{"name":"string","title":"string"}],
    "employeeCount": "string|null",
    "foundedYear": "string|null",
    "fundingStage": "string|null",
    "investors": ["string"],
    "estimatedRevenue": "string|null"
  },
  "digitalFootprint": {
    "socialMediaPresence": [{"platform":"string","handleOrUrl":"string","followerCount":0,"activityLevel":"string"}],
    "customerReviews": [{"source":"string","rating":0,"reviewCountApprox":0,"sentimentSummary":"string"}],
    "newsOrPressMentions": [{"source":"string","summary":"string","date":"string|null"}],
    "searchVisibility": "string|null",
    "confirmedCompetitors": ["string"]
  }
}`

const EVALUATE_PROMPT = `You are a senior Brand Strategy Consultant with deep industry expertise. Evaluate the company's brand using the extracted data below.

## Scoring Guidelines (0-10 scale)

Be CRITICAL — do not inflate scores. Each score must be justified with specific evidence from the data.

| Score | Meaning |
|---|---|
| 9-10 | Best in class — clear, intentional, well-executed |
| 7-8 | Strong — above average, some standout elements |
| 5-6 | Average — functional but not distinctive |
| 3-4 | Weak — unclear, inconsistent, or poor execution |
| 1-2 | Very poor — missing or damaging to brand |

## Categories to Score

1. Brand Identity — Are mission, vision, values, personality clear and compelling?
2. Website Experience — Is the website professional, clear, navigable?
3. Customer Trust — What trust signals, reviews, testimonials, security exist?
4. Brand Consistency — Is messaging uniform across website, social, search?
5. Digital Presence — Social media activity, SEO visibility, content freshness
6. Marketing Maturity — Channel diversity, content strategy, sophistication
7. Competitive Position — Differentiation, USP clarity, market positioning
8. Customer Experience — Support accessibility, feedback channels, UX
9. Innovation — Product/service innovation, modern approach, R&D signals
10. Growth Potential — Market opportunity, scalability indicators, expansion signs

## Output Format

Return this exact JSON:
{
  "categoryScores": {
    "brandIdentity": {"score":0,"reasoning":"2-4 sentences with specific evidence"},
    "websiteExperience": {"score":0,"reasoning":"2-4 sentences with specific evidence"},
    "customerTrust": {"score":0,"reasoning":"2-4 sentences with specific evidence"},
    "brandConsistency": {"score":0,"reasoning":"2-4 sentences with specific evidence"},
    "digitalPresence": {"score":0,"reasoning":"2-4 sentences with specific evidence"},
    "marketingMaturity": {"score":0,"reasoning":"2-4 sentences with specific evidence"},
    "competitivePosition": {"score":0,"reasoning":"2-4 sentences with specific evidence"},
    "customerExperience": {"score":0,"reasoning":"2-4 sentences with specific evidence"},
    "innovation": {"score":0,"reasoning":"2-4 sentences with specific evidence"},
    "growthPotential": {"score":0,"reasoning":"2-4 sentences with specific evidence"}
  },
  "brandScore": 0,
  "brandGrade": "Exceptional|Excellent|Strong|Good|Average|Weak|Poor",
  "executiveSummary": "string",
  "strengths": ["string"],
  "weaknesses": ["string"],
  "risks": ["string"],
  "opportunities": ["string"]
}`

const ACTION_PROMPT = `You are a brand strategy consultant. Based on the evaluation below, create specific, actionable recommendations.

Format: Return exact JSON:
{
  "top10Recommendations": ["string"],
  "actionPlan30Day": ["string"],
  "actionPlan90Day": ["string"],
  "brandGrowthStrategy1Year": ["string"],
  "finalVerdict": "string",
  "confidenceNote": "string|null"
}`

export async function extractCompanyInfo(userPrompt: string) {
  return callGemini(EXTRACT_PROMPT, userPrompt, 2000)
}

export async function evaluateBrand(userPrompt: string) {
  return callGemini(EVALUATE_PROMPT, userPrompt, 3000)
}

export async function generateActions(userPrompt: string) {
  return callGemini(ACTION_PROMPT, userPrompt, 2000)
}
