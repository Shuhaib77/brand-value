import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" })

const FAST_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct"
const REASONING_MODEL = "llama-3.3-70b-versatile"
const FALLBACK_FOR_REASONING = [FAST_MODEL, "llama-3.1-8b-instant"]

const JSON_REINFORCEMENT = "\n\nIMPORTANT: Return ONLY valid JSON. Double-check all brackets, commas, and quotes. Every opening brace must have a matching closing brace."

function isLongRateLimit(msg: string): boolean {
  const match = msg.match(/try again in (?:(\d+)h)?(?:(\d+)m)?/)
  if (!match) return msg.includes("tokens per day") || msg.includes("TPD")
  const h = Number(match[1] || 0)
  const m = Number(match[2] || 0)
  return h > 0 || m > 1
}

async function callGroq(
  systemPrompt: string,
  userContent: string,
  maxTokens = 2000,
  model = FAST_MODEL,
  maxRetries = 3,
  fallbackModels: string[] = []
) {
  const modelsToTry = [model, ...fallbackModels]

  for (const currentModel of modelsToTry) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const temp = attempt > 0 ? 0.1 : 0.2
        const content = attempt > 0 ? userContent + JSON_REINFORCEMENT : userContent

        const response = await groq.chat.completions.create({
          model: currentModel,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content },
          ],
          response_format: { type: "json_object" },
          temperature: temp,
          max_tokens: maxTokens,
        })

        const text = response.choices[0]?.message?.content
        if (!text) throw new Error("Groq returned empty response")
        return JSON.parse(text)
      } catch (error: unknown) {
        const err = error as { status?: number; message?: string; code?: string; error?: { code?: string } }
        const errMsg = err?.message ?? ""
        const status = err?.status ?? (err as any)?.error?.status
        const code = err?.code ?? (err as any)?.error?.code
        const isQuota = status === 429 || errMsg.includes("429")
        const isLongWait = isQuota && isLongRateLimit(errMsg)
        const isInvalidJSON = status === 400 && (code === "json_validate_failed" || errMsg.includes("json_validate_failed"))

        if (isLongWait) {
          console.warn(`Groq daily TPD limit on ${currentModel}. Trying next model...`)
          break
        }

        if (isQuota && attempt < maxRetries) {
          const delay = (attempt + 1) * 15000
          console.warn(`Groq 429 on ${currentModel} (attempt ${attempt + 1}/${maxRetries}). Retrying in ${delay}ms...`)
          await new Promise(r => setTimeout(r, delay))
          continue
        }

        if (isInvalidJSON && attempt < maxRetries) {
          console.warn(`Groq JSON validation failed on ${currentModel} (attempt ${attempt + 1}/${maxRetries}). Retrying...`)
          await new Promise(r => setTimeout(r, 1000))
          continue
        }

        if (currentModel === modelsToTry[modelsToTry.length - 1] && attempt === maxRetries) {
          throw error
        }
      }
    }
  }

  throw new Error("All Groq models exhausted. Please wait a few minutes and try again.")
}

const EXTRACT_PROMPT = `You are a data extraction specialist. Extract structured company data from the provided website content, Wikipedia data, and web search results.

Rules:
- Use Wikipedia data as the primary source for company details (founding year, founder, employees, revenue, CEO, headquarters, industry)
- Use website content for brand-specific fields (mission, values, products, USP, brand personality)
- Never invent data. If a field cannot be determined, set it to null. Do NOT guess or hallucinate numbers.
- For leadershipTeam, extract actual names, titles, and bios from team/about pages. Look for biographical text near each team member name — often it appears in a sentence or paragraph right after the name and title.
- For bio extraction: scan the text around each team member for descriptive sentences about their background, education, previous roles, or accomplishments.
- Extract owner and co-founder information from About page, team page, and website content. The owner may be listed alongside the founder or separately.
- For employeeCount, scan ALL provided text for phrases like "we have X employees", "team of X people", "over X staff", "X+ employees", "employs X people" — not just Wikipedia. If multiple sources differ, use the most specific one.
- For digitalFootprint, use only what's found in web search results.
- For companyDetails fields like awards, certifications, partnerships — look for these in the website content (often in "About", "Press", or footer sections).
- Always include actual numbers you find (team size, prices, followers, review counts) — do not make up approximate values.
- Prefer exact data from website/Wikipedia. If estimatedRevenue or employeeCount is not found, set to null.
- Extract LinkedIn URLs for the founder, owner, and CEO from the website's Team/About page or web search results.
- For the dataConfidence section: mark each field as "found" (exact data from source), "estimated" (inferred from context), or "missing" (no data available). Be honest — only mark "found" if you have explicit evidence.

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
    "founderLinkedInUrl": "string|null",
    "ceoName": "string|null",
    "ceoLinkedInUrl": "string|null",
    "ownerName": "string|null",
    "ownerBackground": "string|null",
    "ownerLinkedInUrl": "string|null",
    "leadershipTeam": [{"name":"string","title":"string","bio":"string|null","linkedInUrl":"string|null","yearsAtCompany":"string|null"}],
    "employeeCount": "string|null",
    "foundedYear": "string|null",
    "fundingStage": "string|null",
    "investors": ["string"],
    "estimatedRevenue": "string|null",
    "awards": ["string"],
    "certifications": ["string"],
    "partnerships": ["string"],
    "companyCulture": "string|null"
  },
  "digitalFootprint": {
    "socialMediaPresence": [{"platform":"string","handleOrUrl":"string","followerCount":0,"activityLevel":"string"}],
    "customerReviews": [{"source":"string","rating":0,"reviewCountApprox":0,"sentimentSummary":"string"}],
    "newsOrPressMentions": [{"source":"string","summary":"string","date":"string|null"}],
    "searchVisibility": "string|null",
    "confirmedCompetitors": ["string"]
  },
  "dataConfidence": {
    "employeeCount": "found|estimated|missing",
    "estimatedRevenue": "found|estimated|missing",
    "foundedYear": "found|estimated|missing",
    "headquarters": "found|estimated|missing",
    "founderName": "found|estimated|missing",
    "ceoName": "found|estimated|missing",
    "industry": "found|estimated|missing"
  }
}`

const EVALUATE_PROMPT = `You are a senior Brand Strategy Consultant with deep industry expertise. Evaluate the company's brand using the extracted data AND raw source data below.

## Honesty & Evidence Rules — READ CAREFULLY

1. **Every score MUST cite specific evidence.** Each reasoning field must reference actual data points from the provided data. Format: "Evidence: [specific data point]. Assessment: [your analysis based on that data]."
2. **If a field is null/missing in the Extracted Company Data, that means NO data was found.** Score accordingly — missing data is a weakness, score low (1-3).
3. **Do NOT invent or imply data that isn't present.** If available data is thin, say so explicitly: "Limited data available for this category. Score reflects lack of clear signals."
4. **Be genuinely critical.** Average companies get 5-6, not 8-9. A score of 7+ requires clear, intentional brand execution with visible evidence.
5. **Distinguish between "negative signals" and "no signals".** No social media presence is a weakness. Having poor social media is a different weakness. Score them accordingly.
6. **Cross-reference data sources.** If Wikipedia data contradicts website claims (e.g., different employee count), flag the discrepancy in your reasoning.
7. **Use the Technical Checks data** provided below (SEO, trust signals, performance hints) as objective evidence. If a check returns false, that is a real weakness.

## Scoring Guidelines (0-10 per category, weighted to 100 overall)

| Score | Meaning |
|---|---|
| 9-10 | Best in class — clear, intentional, well-executed with strong evidence |
| 7-8 | Strong — above average, some standout elements with supporting data |
| 5-6 | Average — functional but not distinctive; adequate evidence |
| 3-4 | Weak — unclear, inconsistent, or poor execution; weak or missing evidence |
| 1-2 | Very poor — missing or damaging to brand; no evidence found |

## Weight Reference (each category contributes to final 0-100 score)

| Category | Weight |
|---|---|
| Brand Identity | 14 |
| Website Experience | 14 |
| Trust & Credibility | 14 |
| SEO & Visibility | 14 |
| Content Quality | 9 |
| Social Media Presence | 9 |
| Customer Reputation | 9 |
| Performance & Accessibility | 9 |
| Technical Quality | 9 |

## Categories to Score — Be thorough, check EVERY item listed

### 1. Brand Identity (14%)
Check each item and cite what you observe:
- Professional logo visible on the site
- Brand colors are consistent (header, buttons, links)
- Typography consistent across pages
- Clear tagline or value proposition in hero section
- Homepage immediately explains what the company does
- Mission/vision statement present
- Brand personality clear from tone of voice and imagery
- USP / differentiation clear

### 2. Website Experience (14%)
- Responsive design (check page content structure for mobile)
- Navigation is clear and intuitive
- Call-to-action buttons visible and compelling
- Contact information easy to find
- Modern UI design
- Good spacing, readable text
- No excessive clutter or too much text
- Forms are simple and working
- Footer complete with links

### 3. Trust & Credibility (14%)
- HTTPS enabled
- Privacy Policy page exists
- Terms & Conditions page exists
- Refund/Return Policy
- Company registration or legal info
- Testimonials or client logos present
- Team page with real people
- Physical address listed
- Email contact available
- Phone number available
- Case studies or portfolio (bonus)
- Awards or certifications (bonus)
- Google Reviews or third-party trust signals

### 4. SEO & Visibility (14%)
Use the Technical Checks data:
- Page has a title tag
- Meta description present and well-written
- H1 tag present
- H2 tags used for structure
- Images have alt text (altCount/total ratio)
- Open Graph tags present
- Twitter Card tags present
- Canonical URL set
- robots.txt exists
- sitemap.xml exists
- Structured data / schema markup present
- Internal links between pages
- Keyword optimization in headings and content

### 5. Content Quality (9%)
- Blog or articles section exists
- FAQ page with useful questions
- Service/product pages informative
- Grammar and spelling (scan text for errors)
- Readability (not too technical or jargon-heavy)
- Content feels unique, not generic
- Content is helpful and relevant to audience
- Content appears fresh/updated (dates on blog posts)
- No signs of AI-generated spam or thin content

### 6. Social Media Presence (9%)
- LinkedIn profile exists and active
- Instagram account (if relevant)
- Facebook page
- Twitter/X profile
- YouTube channel (if relevant)
- Social links present on website
- Posting consistency (check dates if available)
- Follower engagement signals
- Brand messaging consistent across platforms

### 7. Customer Reputation (9%)
Check all sources:
- Google Reviews — average rating, count
- Trustpilot — rating and review volume
- Glassdoor — employer reputation
- Clutch or G2 — B2B reviews
- Reddit discussions or social mentions
- Testimonials on website
- Average ratings across platforms
- Sentiment: note positive and negative mentions
- Overall customer sentiment summary

### 8. Performance & Accessibility (9%)
Use Technical Checks data:
- Page load speed estimate (page size KB)
- Images have alt text for accessibility
- Color contrast (general impression from content)
- Keyboard navigation support (check for focusable elements)
- ARIA labels or accessibility hints in HTML
- Lazy loading or image optimization signals
- Modern responsive design

### 9. Technical Quality (9%)
- HTTPS / SSL enabled
- Schema markup / structured data found
- Analytics present (Google Analytics, etc.)
- Cookie consent notice displayed
- Custom 404 page (check if "not found" text appears)
- Compression / CDN hints (page source inspection)
- Modern framework signals (React, Next.js, etc. in HTML)
- Clean URL structure
- Canonical URLs set
- robots.txt and sitemap.xml accessible

## Output Format

Return this exact JSON:
{
  "categoryScores": {
    "brandIdentity": {"score":0,"reasoning":"Evidence: ... Assessment: ..."},
    "websiteExperience": {"score":0,"reasoning":"Evidence: ... Assessment: ..."},
    "trustCredibility": {"score":0,"reasoning":"Evidence: ... Assessment: ..."},
    "seoVisibility": {"score":0,"reasoning":"Evidence: ... Assessment: ..."},
    "contentQuality": {"score":0,"reasoning":"Evidence: ... Assessment: ..."},
    "socialMediaPresence": {"score":0,"reasoning":"Evidence: ... Assessment: ..."},
    "customerReputation": {"score":0,"reasoning":"Evidence: ... Assessment: ..."},
    "performanceAccessibility": {"score":0,"reasoning":"Evidence: ... Assessment: ..."},
    "technicalQuality": {"score":0,"reasoning":"Evidence: ... Assessment: ..."}
  },
  "brandScore": 0 (0-100 weighted score, compute as: sum of (categoryScore/10 * categoryWeight) / totalWeight * 100),
  "brandGrade": "string (A+ for 90+, A for 80+, B for 70+, C for 60+, D for 40+, F for <40)",
  "executiveSummary": "string (3-5 sentences summarizing key findings, referencing specific data)",
  "strengths": ["string"],
  "weaknesses": ["string"],
  "risks": ["string"],
  "opportunities": ["string"],
  "trustAnalysis": "string (detailed analysis of trust signals and credibility, 3-5 sentences)",
  "brandIdentityAnalysis": "string (detailed analysis of brand identity strength, 3-5 sentences)",
  "websiteUXAnalysis": "string (detailed analysis of website user experience, 3-5 sentences)",
  "seoAnalysis": "string (detailed analysis of SEO and visibility, 3-5 sentences)",
  "contentAnalysis": "string (detailed analysis of content quality, 3-5 sentences)",
  "reputationAnalysis": "string (detailed analysis of customer reputation and reviews, 3-5 sentences)",
  "technicalAnalysis": "string (detailed analysis of technical quality, 3-5 sentences)",
  "topImprovements": ["string (top 10 specific, actionable improvements)"],
  "expectedScoreAfterImprovements": 0 (0-100, what the score could be if top improvements are implemented)
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
  return callGroq(EXTRACT_PROMPT, userPrompt, 3000, FAST_MODEL)
}

export async function evaluateBrand(userPrompt: string) {
  return callGroq(EVALUATE_PROMPT, userPrompt, 6000, REASONING_MODEL, 3, FALLBACK_FOR_REASONING)
}

export async function generateActions(userPrompt: string) {
  return callGroq(ACTION_PROMPT, userPrompt, 4000, REASONING_MODEL, 2, FALLBACK_FOR_REASONING)
}
