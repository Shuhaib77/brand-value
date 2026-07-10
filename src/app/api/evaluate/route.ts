import { NextRequest, NextResponse } from "next/server"
import { extractCompanyInfo, evaluateBrand, generateActions } from "@/lib/ai/groq"
import { scrapeWebsite } from "@/lib/data/scraper"
import { searchCompany, searchTeam } from "@/lib/data/web-search"
import { fetchWikipedia } from "@/lib/data/wikipedia"

export async function POST(req: NextRequest) {
  try {
    const { url, answers } = await req.json()
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Valid URL is required" }, { status: 400 })
    }

    const normalizedUrl = url.startsWith("http") ? url : `https://${url}`

    let scraped = { url: "", title: "", description: "", text: "", pages: [] as any[], extracted: {} as any, socialLinks: [] as any[], externalReviews: [] as any[], technicalChecks: {} as any }
    let searchData = { companyName: "", socialMedia: [] as any[], reviews: [] as any[], news: [] as any[], rawResults: "", rawReviewResults: "" }
    let wikipedia: { companyName: string | null; founderName: string | null; foundedYear: string | null; employeeCount: string | null; revenue: string | null; headquarters: string | null; industry: string | null; ceoName: string | null; fullExtract: string | null } = { companyName: null, founderName: null, foundedYear: null, employeeCount: null, revenue: null, headquarters: null, industry: null, ceoName: null, fullExtract: null }

    const results = await Promise.all([
      scrapeWebsite(normalizedUrl),
      searchCompany(normalizedUrl),
    ])
    scraped = results[0]
    searchData = results[1]
    const companyName = searchData.companyName || new URL(normalizedUrl).hostname.replace("www.", "").split(".")[0]
    wikipedia = await fetchWikipedia(companyName)

    const teamSearchResults = await searchTeam(companyName)

    const questionnaireContext = answers && Object.keys(answers).length > 0
      ? `\n## Questionnaire Answers\n${JSON.stringify(answers, null, 2)}`
      : ""

    const extractionInput = [
      `## Website URL\n${scraped.url}`,
      `## Page Title\n${scraped.title}`,
      `## Meta Description\n${scraped.description}`,
      `## Page Content\n${scraped.text}`,
      scraped.pages.length > 0 ? `## Subpages\n${scraped.pages.map((p) => `[${p.slug}]\n${p.text.slice(0, 4000)}`).join("\n\n")}` : "",
      scraped.extracted.testimonials.length > 0 ? `\n## Testimonials Found\n${scraped.extracted.testimonials.join("\n")}` : "",
      scraped.extracted.teamMembers.length > 0 ? `\n## Team Members Found\n${scraped.extracted.teamMembers.map((t: { name: string; title: string; bio?: string | null }) => `${t.name} — ${t.title}${t.bio ? `: ${t.bio}` : ""}`).join("\n")}` : "",
      scraped.extracted.prices.length > 0 ? `\n## Pricing Found\n${scraped.extracted.prices.join(", ")}` : "",
      scraped.extracted.trustSignals.length > 0 ? `\n## Trust Signals\n${scraped.extracted.trustSignals.join(", ")}` : "",
      scraped.socialLinks.length > 0 ? `\n## Social Media Links Found\n${scraped.socialLinks.map((s) => `${s.platform}: ${s.url}`).join("\n")}` : "",
      scraped.externalReviews.length > 0 ? `\n## External Reviews (Scraped)\n${scraped.externalReviews.map((r) => `${r.source}: ${r.snippet}`).join("\n")}` : "",
      `\n## Wikipedia Data\n${JSON.stringify(wikipedia, null, 2)}`,
      searchData.socialMedia.length > 0 ? `\n## Social Media (Search)\n${searchData.socialMedia.map((s) => `${s.platform}: ${s.url}`).join("\n")}` : "",
      searchData.reviews.length > 0 ? `\n## Customer Reviews (Search)\n${searchData.reviews.map((r) => `${r.source}: ${r.snippet}`).join("\n")}` : "",
      searchData.news.length > 0 ? `\n## News/Press Mentions\n${searchData.news.map((n) => `${n.title} (${n.url})`).join("\n")}` : "",
      searchData.rawReviewResults ? `\n## Dedicated Review Search Results\n${searchData.rawReviewResults.slice(0, 5000)}` : "",
      searchData.rawResults ? `\n## Web Search Results\n${searchData.rawResults}` : "",
      teamSearchResults ? `\n## Team Search Results\n${teamSearchResults}` : "",
      questionnaireContext,
    ].filter(Boolean).join("\n\n").slice(0, 35000)

    const extracted = await extractCompanyInfo(extractionInput)

    const evaluationInput = [
      `## Extracted Company Data\n${JSON.stringify(extracted, null, 2)}`,
      scraped.extracted.testimonials.length > 0 ? `\n## Testimonials from Website\n${scraped.extracted.testimonials.join("\n")}` : "",
      scraped.extracted.teamMembers.length > 0 ? `\n## Team\n${scraped.extracted.teamMembers.map((t: { name: string; title: string; bio?: string | null }) => `${t.name} — ${t.title}${t.bio ? `: ${t.bio}` : ""}`).join("\n")}` : "",
      scraped.extracted.prices.length > 0 ? `\n## Pricing\n${scraped.extracted.prices.join(", ")}` : "",
      scraped.extracted.blogTopics.length > 0 ? `\n## Blog Topics\n${scraped.extracted.blogTopics.join(", ")}` : "",
      scraped.socialLinks.length > 0 ? `\n## Social Media\n${scraped.socialLinks.map((s) => `${s.platform}: ${s.url}`).join(", ")}` : "",
      scraped.externalReviews.length > 0 ? `\n## External Reviews (Scraped from Trustpilot)\n${scraped.externalReviews.map((r) => r.snippet).join("\n")}` : "",
      searchData.reviews.length > 0 ? `\n## Customer Reviews from Search\n${searchData.reviews.map((r) => `${r.source}: ${r.snippet}`).join("\n")}` : "",
      searchData.rawReviewResults ? `\n## Raw Review Search Results\n${searchData.rawReviewResults.slice(0, 3000)}` : "",
      searchData.news.length > 0 ? `\n## News/Press\n${searchData.news.map((n) => n.title).join(", ")}` : "",
      wikipedia.fullExtract ? `\n## Wikipedia Extract\n${wikipedia.fullExtract}` : "",
      scraped.text ? `\n## Website Raw Text\n${scraped.text.slice(0, 6000)}` : "",
      searchData.rawResults ? `\n## Web Search Results\n${searchData.rawResults.slice(0, 4000)}` : "",
      teamSearchResults ? `\n## Team Search Results\n${teamSearchResults.slice(0, 3000)}` : "",
      questionnaireContext,
      scraped.technicalChecks && Object.keys(scraped.technicalChecks).length > 0 ? `\n## Technical Checks Data\n${JSON.stringify(scraped.technicalChecks, null, 2)}` : "",
    ].filter(Boolean).join("\n\n").slice(0, 30000)

    const evaluation = await evaluateBrand(evaluationInput)

    const actionInput = JSON.stringify({ ...extracted, ...evaluation }, null, 2).slice(0, 8000)
    const actions = await generateActions(actionInput)

    const result = {
      extractedCompanyInfo: {
        ...extracted,
        wikipediaVerified: {
          founderName: wikipedia.founderName !== null,
          foundedYear: wikipedia.foundedYear !== null,
          employeeCount: wikipedia.employeeCount !== null,
          revenue: wikipedia.revenue !== null,
          headquarters: wikipedia.headquarters !== null,
          industry: wikipedia.industry !== null,
          ceoName: wikipedia.ceoName !== null,
        },
      },
      ...evaluation,
      ...actions,
    }

    return NextResponse.json(result)
  } catch (error: unknown) {
    console.error("Evaluation error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    if (message.includes("rate_limit_exceeded") || message.includes("429") || message.includes("all models exhausted")) {
      return NextResponse.json(
        { error: "AI service is currently overloaded. Please wait a few minutes and try again." },
        { status: 429 }
      )
    }
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
