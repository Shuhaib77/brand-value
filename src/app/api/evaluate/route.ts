import { NextRequest, NextResponse } from "next/server"
import { extractCompanyInfo, evaluateBrand, generateActions } from "@/lib/ai/groq"
import { scrapeWebsite, type ScrapedContent } from "@/lib/data/scraper"
import { searchCompany, searchTeam, type SearchResult } from "@/lib/data/web-search"
import { fetchWikipedia } from "@/lib/data/wikipedia"
import { computeWeightedScore, computeGrade } from "@/lib/constants"

function toTitleCase(s: string): string {
  if (s.length > 2 && s === s.toUpperCase()) {
    return s.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ")
  }
  return s
}

function isLikelyPersonName(name: string): boolean {
  const raw = name.split(/\s+/).filter(Boolean)
  const words = raw.map(w => w.replace(/[.,;:!?"'()\[\]{}<>/\\|@#$%^&*+=~`´‘’“”«»—–-]+$/g, '').replace(/^[.,;:!?"'()\[\]{}<>/\\|@#$%^&*+=~`´‘’“”«»—–-]+/g, '')).filter(Boolean)
  if (words.length < 2 || words.length > 6) return false
  const joined = words.join(' ')
  if (/\b(Llp|Ltd|Inc|Corp|Co(?![a-z])|Company|Group|Technologies?|Enterprises?|Foundation|Platform|Studio|Studios|Agency|Consulting|Capital|Ventures|Lab|Labs)\s*$/i.test(joined)) return false
  if (/^(of|at|in|on|by|for|to|the|a|an|and|or|about|creating|building|developing|leading|managing|contact|services|solutions|team|home|design|marketing|branding|strategy|technology|consulting|leadership|workforce|projects|happy|los|top|your|their|our|this|that|these|those|why|how|what|which|welcome|featured|com|md|ceo|founder|owner|null)\s/i.test(joined)) return false
  for (const w of words) {
    if (/^(as|of|in|on|at|by|for|to|the|a|an|and|or|with|about|our|your|team|their|who|can|do|back|this|that|these|those|its|his|her|what|which|where|when|how|will|would|has|have|been|being|was|were|are|is|does|did|done|los|delivered|clients|success|projects|happy|top|why|all|any|some|each|every|both|few|many|much|no|not|only|own|same|so|such|than|too|very|just|also|even|still|already|yet|almost|nearly|really|quite|actually|currently|previously|typically|usually|often|always|never|sometimes|eventually|formerly|originally|initially|welcome|featured|within|without|through|during|before|after|above|below|between|under|over|out|off|up|down|into|upon|about|ve|re|ll|don|didn|won|couldn|shouldn|hasn|haven|isn|aren|wasn|weren|doesn|com|md|ceo|founder|owner|null|nul)$/i.test(w)) return false
    if (w.includes('.') && !w.includes('.com')) return false
  }
  const gerundExclude = /^(king|wing|ring|sing|ping|thing|going|morning|evening)$/i
  if (words.some(w => w.length > 4 && /[a-z]{3,}ing$/.test(w) && !gerundExclude.test(w))) return false
  const pastExclude = /^(united|unified|advanced|related|included|limited|named|skilled|renowned|experienced|established)$/i
  if (words.some(w => w.length > 5 && /[a-z]{3,}ed$/.test(w) && !pastExclude.test(w))) return false
  if (words.length === 2 && /^(Partner|Director|Manager|Lead|Head|Chief|Member|Advisor|Consultant|Specialist|Delivered|Clients|Success)$/i.test(words[1])) return false
  if (words.length === 2 && words[0] === words[1]) return false
  const titleCount = words.filter(w => /^(Chief|Executive|Officer|Manager|Director|Head|Lead|Senior|Junior|Assistant|Associate)$/i.test(w)).length
  if (titleCount >= Math.ceil(words.length / 2)) return false
  const funcCount = words.filter(w => /^(as|of|in|on|at|by|for|to|the|a|an|and|or|with|about|our|your|team|their|who|can|do|back|this|that|these|those|its|his|her|what|which|where|when|how|will|would|has|have|been|being|was|were|are|is|does|did|done|los|all|any|some|each|every|both|few|many|much|no|not|only|own|same|so|such|than|too|very|just|also|even|still|already|yet|almost|nearly|really|quite|actually|currently|previously|typically|usually|often|always|never|sometimes|eventually|formerly|originally|initially|within|without|through|during|before|after|above|below|between|under|over|out|off|up|down|into|upon|ve|re|ll|don|didn|won|couldn|shouldn|hasn|haven|isn|aren|wasn|weren|doesn|com|md|ceo|founder|owner|null)$/i.test(w)).length
  if (funcCount >= Math.ceil(words.length / 2)) return false
  return true
}

function extractPeopleFromText(text: string): { name: string; title: string }[] {
  const people: { name: string; title: string }[] = []
  const seen = new Set<string>()

  const patterns: { regex: RegExp; title: (match: RegExpExecArray, groupIndex: number) => string }[] = [
    {
      regex: /([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z'.]*){0,3})\s*[–\-—|,:]\s*[^.!?]{0,100}?(?:(?:Co-)?Founder|CEO|Owner|Partner|Managing\s*Director|Director)(?:\s+&\s+(?:Co-)?Founder)?/gi,
      title: (m) => { const t = m[0].toLowerCase(); if (t.includes("co-founder")) return "Co-Founder"; if (t.includes("founder")) return "Founder"; if (t.includes("ceo")) return "CEO"; if (t.includes("owner")) return "Owner"; if (t.includes("partner")) return "Founder"; if (/managing\s*director/.test(t)) return "Managing Director"; return "Staff" },
    },
    {
      regex: /(?:Co-founder|Co-Founder|Founder|CEO|Owner)\s+(?:and\s+)?([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z'.]*){0,3})/gi,
      title: (m) => /^Co-?founder/i.test(m[0]) ? "Co-Founder" : "Founder",
    },
    {
      regex: /founded\s+by\s+([A-Z][a-zA-Z'.]+(?:\s+[A-Z][a-zA-Z'.]*){0,3})(?:(?:\s*,\s*|\s+and\s+)([A-Z][a-zA-Z'.]+(?:\s+[A-Z][a-zA-Z'.]*){0,3}))?/gi,
      title: (m, i) => (m[2] !== undefined && m[2] !== "") ? (i === 1 ? "Founder" : "Co-Founder") : "Founder",
    },
    {
      regex: /([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z'.]*){0,3})\s+is\s+(?:the\s+)?(?:(?:co-)?founder|CEO|owner)/gi,
      title: (m) => /co-?founder/i.test(m[0]) ? "Co-Founder" : /ceo/i.test(m[0]) ? "CEO" : "Founder",
    },
    {
      regex: /([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z'.]*){0,3})\s*\(.*?(?:(?:Co-)?Founder|CEO|Owner|Partner|Managing\s*Director|Director)/gi,
      title: (m) => { const t = m[0].toLowerCase(); if (t.includes("co-founder")) return "Co-Founder"; if (t.includes("founder")) return "Founder"; if (t.includes("ceo")) return "CEO"; if (t.includes("owner")) return "Owner"; if (t.includes("partner")) return "Founder"; if (/managing\s*director/.test(t)) return "Managing Director"; return "Staff" },
    },
    {
      regex: /\|\s*\d+\s*\|\s*([A-Z][A-Z]+(?:\s+[A-Z][A-Z]+){1,3})\s*\|\s*\d{2}-\d{2}-\d{4}\s*\|/gi,
      title: () => "Founder",
    },
    {
      regex: /^\+\s*([A-Z][A-Z]+(?:\s+[A-Z][A-Z]+){1,3})\s*$/gim,
      title: () => "Founder",
    },
  ]

  for (const { regex, title: getTitle } of patterns) {
    let match
    while ((match = regex.exec(text)) !== null) {
      for (let i = 1; i <= 2; i++) {
        const raw = match[i]
        if (!raw || typeof raw !== "string") continue
        const name = toTitleCase(raw.trim())
        if (name && name.length > 1 && name.length < 50 && !seen.has(name.toLowerCase())) {
          seen.add(name.toLowerCase())
          people.push({ name, title: getTitle(match, i) })
        }
      }
    }
  }

  return people
}

function isSamePerson(a: string, b: string): boolean {
  const an = a.toLowerCase().trim()
  const bn = b.toLowerCase().trim()
  if (an === bn) return true
  const aParts = an.split(/\s+/).filter(Boolean)
  const bParts = bn.split(/\s+/).filter(Boolean)
  if (aParts.length === 0 || bParts.length === 0) return false
  if (aParts[0] !== bParts[0]) return false
  const aLast = aParts[aParts.length - 1]
  const bLast = bParts[bParts.length - 1]
  return aLast[0] === bLast[0]
}

export async function POST(req: NextRequest) {
  try {
    const { url, answers } = await req.json()
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Valid URL is required" }, { status: 400 })
    }

    const normalizedUrl = url.startsWith("http") ? url : `https://${url}`

    const [scraped, searchData]: [ScrapedContent, SearchResult] = await Promise.all([
      scrapeWebsite(normalizedUrl),
      searchCompany(normalizedUrl),
    ])
    const urlName = new URL(normalizedUrl).hostname.replace("www.", "").split(".")[0]
    const titleName = scraped.title?.trim() || null
    const companyName = titleName || searchData.companyName || urlName
    const wikipedia = await fetchWikipedia(companyName)

    const teamSearchResults = await searchTeam(companyName)

    const questionnaireContext = answers && Object.keys(answers).length > 0
      ? `\n## Questionnaire Answers\n${JSON.stringify(answers, null, 2)}`
      : ""

    const extractionInput = [
      `## Website URL\n${scraped.url}`,
      `## Page Title\n${scraped.title}`,
      `## Meta Description\n${scraped.description}`,
      `## Page Content\n${scraped.text}`,
      `\n## Wikipedia Data\n${JSON.stringify(wikipedia, null, 2)}`,
      searchData.rawResults ? `\n## Web Search Results\n${searchData.rawResults}` : "",
      searchData.rawReviewResults ? `\n## Dedicated Review Search Results\n${searchData.rawReviewResults.slice(0, 5000)}` : "",
      teamSearchResults ? `\n## Team Search Results\n${teamSearchResults}` : "",
      scraped.extracted.trustSignals.length > 0 ? `\n## Trust Signals\n${scraped.extracted.trustSignals.join(", ")}` : "",
      scraped.extracted.testimonials.length > 0 ? `\n## Testimonials Found\n${scraped.extracted.testimonials.join("\n")}` : "",
      scraped.extracted.teamMembers.length > 0 ? `\n## Team Members Found\n${scraped.extracted.teamMembers.map((t: { name: string; title: string; bio?: string | null }) => `${t.name} — ${t.title}${t.bio ? `: ${t.bio}` : ""}`).join("\n")}` : "",
      scraped.extracted.prices.length > 0 ? `\n## Pricing Found\n${scraped.extracted.prices.join(", ")}` : "",
      scraped.socialLinks.length > 0 ? `\n## Social Media Links Found\n${scraped.socialLinks.map((s) => `${s.platform}: ${s.url}`).join("\n")}` : "",
      scraped.externalReviews.length > 0 ? `\n## External Reviews (Scraped)\n${scraped.externalReviews.map((r) => `${r.source}: ${r.snippet}`).join("\n")}` : "",
      searchData.socialMedia.length > 0 ? `\n## Social Media (Search)\n${searchData.socialMedia.map((s) => `${s.platform}: ${s.url}`).join("\n")}` : "",
      searchData.reviews.length > 0 ? `\n## Customer Reviews (Search)\n${searchData.reviews.map((r) => `${r.source}: ${r.snippet}`).join("\n")}` : "",
      searchData.news.length > 0 ? `\n## News/Press Mentions\n${searchData.news.map((n) => `${n.title} (${n.url})`).join("\n")}` : "",
      scraped.pages.length > 0 ? `\n## Subpages\n${scraped.pages.map((p) => `[${p.slug}]\n${p.text.slice(0, 4000)}`).join("\n\n")}` : "",
      questionnaireContext,
    ].filter(Boolean).join("\n\n").slice(0, 35000)

    const { data: extracted, modelUsed: extractModel } = await extractCompanyInfo(extractionInput)
    const extractedCd = extracted.companyDetails as Record<string, unknown> | undefined

    if (extractedCd?.founderName && !isLikelyPersonName(extractedCd.founderName as string)) {
      extractedCd.founderName = null
    }
    if (extractedCd?.ceoName && !isLikelyPersonName(extractedCd.ceoName as string)) {
      extractedCd.ceoName = null
    }

    const founderStr = extractedCd?.founderName
    if (founderStr && typeof founderStr === "string") {
      const parts = (founderStr as string).split(/,\s*|\s+and\s+/i).map((s: string) => s.trim()).filter(Boolean)
      const validParts = parts.filter(p => isLikelyPersonName(p))
      if (validParts.length > 0 && extractedCd) {
        extractedCd.founderName = validParts[0]
        const team = (extractedCd.leadershipTeam as { name: string; title?: string; bio?: string | null; linkedInUrl?: string | null; yearsAtCompany?: string | null }[]) || []
        for (let i = 1; i < validParts.length; i++) {
          if (!team.some((m) => m.name === validParts[i])) {
            team.push({ name: validParts[i], title: "Co-Founder", bio: null, linkedInUrl: null, yearsAtCompany: null })
          }
        }
        extractedCd.leadershipTeam = team
      }
    }

    const peopleMissing = !extractedCd?.founderName && (!Array.isArray(extractedCd?.leadershipTeam) || (extractedCd?.leadershipTeam as unknown[]).length === 0)
    const peopleSignals = !!wikipedia.founderName || scraped.extracted.teamMembers.length > 0 || teamSearchResults.length > 200
    if (peopleMissing && peopleSignals && extractedCd) {
      try {
        const retryResp = await extractCompanyInfo(
          extractionInput + "\n\n--- CRITICAL: Previous extraction returned NO founder or team data. The text above contains names of company leaders. Extract them NOW. founderName, ceoName, ownerName, and leadershipTeam MUST contain real data from the text. Do NOT return null for people fields. ---"
        )
        const retryData = retryResp.data as Record<string, unknown> | undefined
        const retryCd = retryData?.companyDetails as Record<string, unknown> | undefined
        if (retryCd) {
          if (retryCd.founderName) extractedCd.founderName = retryCd.founderName
          if (retryCd.founderBackground) extractedCd.founderBackground = retryCd.founderBackground
          if (retryCd.founderLinkedInUrl) extractedCd.founderLinkedInUrl = retryCd.founderLinkedInUrl
          if (retryCd.ceoName) extractedCd.ceoName = retryCd.ceoName
          if (retryCd.ceoLinkedInUrl) extractedCd.ceoLinkedInUrl = retryCd.ceoLinkedInUrl
          if (retryCd.ownerName) extractedCd.ownerName = retryCd.ownerName
          if (retryCd.ownerBackground) extractedCd.ownerBackground = retryCd.ownerBackground
          const retryTeam = (retryCd.leadershipTeam as unknown as { name: string }[]) || []
          const existingTeam = (extractedCd.leadershipTeam as unknown as { name: string }[]) || []
          for (const m of retryTeam) {
            if (!existingTeam.some((e) => e.name === m.name)) {
              existingTeam.push(m)
            }
          }
          extractedCd.leadershipTeam = existingTeam
        }
      } catch {
        // Silently continue with original extraction data
      }
    }

    // Re-validate after retry — retry bypasses isLikelyPersonName checks
    if (extractedCd) {
      if (extractedCd.founderName && !isLikelyPersonName(extractedCd.founderName as string)) {
        extractedCd.founderName = null
      }
      if (extractedCd.ceoName && !isLikelyPersonName(extractedCd.ceoName as string)) {
        extractedCd.ceoName = null
      }
      if (extractedCd.ownerName && !isLikelyPersonName(extractedCd.ownerName as string)) {
        extractedCd.ownerName = null
      }
    }

    // Regex fallback: always runs, supplements AI output with regex-found people
    if (extractedCd) {
      const sourceText = [
        scraped.text,
        ...scraped.pages.map(p => p.text),
        wikipedia.fullExtract || "",
        searchData.rawResults || "",
        teamSearchResults || "",
        wikipedia.founderName ? `\nfounded by ${wikipedia.founderName}` : "",
      ].filter(Boolean).join("\n")

      const regexPeople = extractPeopleFromText(sourceText).filter(p => isLikelyPersonName(p.name))
      const existingTeam = (extractedCd.leadershipTeam as { name: string; title?: string }[]) || []

      // If regex found "Founder"-titled people, use the most authoritative one (LinkedIn/Pattern 1)
      const regexFounders = regexPeople.filter(p => p.title === "Founder")
      if (regexFounders.length > 0) {
        const aiMatchesPrimary = extractedCd.founderName && isSamePerson(extractedCd.founderName as string, regexFounders[0].name)
        if (!extractedCd.founderName || !aiMatchesPrimary) {
          extractedCd.founderName = regexFounders[0].name
        }
      }

      if (!extractedCd.ceoName) {
        const ceo = regexPeople.find(p => p.title === "CEO") || scraped.extracted.teamMembers.find(t => /ceo/i.test(t.title))
        if (ceo && ceo.name.length > 1 && isLikelyPersonName(ceo.name)) {
          extractedCd.ceoName = ceo.name
        }
      }

      for (const p of regexPeople) {
        const idx = existingTeam.findIndex(e => isSamePerson((e as { name: string }).name, p.name))
        if (idx >= 0) {
          if (p.title === "Founder" && existingTeam[idx].title !== "Founder") {
            existingTeam[idx] = { ...existingTeam[idx], name: p.name, title: p.title }
          }
        } else {
          existingTeam.push(p)
        }
      }

      for (const tm of scraped.extracted.teamMembers) {
        if (!existingTeam.some(e => isSamePerson((e as { name: string }).name, tm.name))) {
          existingTeam.push(tm as { name: string; title: string })
        }
      }

      if (wikipedia.founderName) {
        const wikiNames = wikipedia.founderName.split(/,\s*|\s+and\s+/i).map(s => s.trim()).filter(Boolean)
        for (let wi = 0; wi < wikiNames.length; wi++) {
          if (!existingTeam.some(e => isSamePerson((e as { name: string }).name, wikiNames[wi]))) {
            existingTeam.push({ name: wikiNames[wi], title: wi === 0 ? "Founder" : "Co-Founder" })
          }
        }
        if (wikiNames.length > 0 && !extractedCd.founderName) {
          extractedCd.founderName = wikiNames[0]
        }
      }

      extractedCd.leadershipTeam = existingTeam
    }

    // Remove non-person names (company names, text fragments) from leadershipTeam
    if (extractedCd?.leadershipTeam) {
      extractedCd.leadershipTeam = (extractedCd.leadershipTeam as { name: string }[]).filter(
        m => isLikelyPersonName(m.name)
      )
    }

    // Only keep people with founder/co-founder titles in leadershipTeam
    if (extractedCd?.leadershipTeam) {
      let team = (extractedCd.leadershipTeam as { name: string; title: string }[]).filter(
        (m) => m.title?.toLowerCase().includes("founder")
      )
      // Clean titles: strip extra descriptors like "Co-Founder & DSG" → "Co-Founder"
      team = team.map(m => ({
        ...m,
        title: m.title.toLowerCase().includes("co-founder") ? "Co-Founder" : "Founder",
      }))
      // Dedup: merge same-person entries (keep longer name, prefer Founder over Co-Founder)
      const deduped: { name: string; title: string }[] = []
      for (const m of team) {
        const existing = deduped.findIndex(d => isSamePerson(d.name, m.name))
        if (existing >= 0) {
          if (m.title === "Founder" && deduped[existing].title !== "Founder") {
            deduped[existing] = { name: m.name.length > deduped[existing].name.length ? m.name : deduped[existing].name, title: "Founder" }
          } else if (m.name.length > deduped[existing].name.length) {
            deduped[existing] = { ...deduped[existing], name: m.name }
          }
        } else {
          deduped.push(m)
        }
      }
      extractedCd.leadershipTeam = deduped
      // Clear CEO if it matches any founder or co-founder in the team
      if (extractedCd.ceoName && deduped.some(m => isSamePerson(m.name, extractedCd.ceoName as string))) {
        extractedCd.ceoName = null
      }
    }

    const evaluationInput = [
      `## Website Raw Text\n${scraped.text ? scraped.text.slice(0, 6000) : ""}`,
      wikipedia.fullExtract ? `\n## Wikipedia Extract\n${wikipedia.fullExtract}` : "",
      `## Extracted Company Data\n${JSON.stringify(extracted, null, 2)}`,
      searchData.rawResults ? `\n## Web Search Results\n${searchData.rawResults.slice(0, 4000)}` : "",
      scraped.technicalChecks && Object.keys(scraped.technicalChecks).length > 0 ? `\n## Technical Checks Data\n${JSON.stringify(scraped.technicalChecks, null, 2)}` : "",
      teamSearchResults ? `\n## Team Search Results\n${teamSearchResults.slice(0, 3000)}` : "",
      scraped.extracted.trustSignals.length > 0 ? `\n## Trust Signals\n${scraped.extracted.trustSignals.join(", ")}` : "",
      scraped.extracted.testimonials.length > 0 ? `\n## Testimonials from Website\n${scraped.extracted.testimonials.join("\n")}` : "",
      scraped.extracted.teamMembers.length > 0 ? `\n## Team\n${scraped.extracted.teamMembers.map((t: { name: string; title: string; bio?: string | null }) => `${t.name} — ${t.title}${t.bio ? `: ${t.bio}` : ""}`).join("\n")}` : "",
      scraped.extracted.prices.length > 0 ? `\n## Pricing\n${scraped.extracted.prices.join(", ")}` : "",
      scraped.extracted.blogTopics.length > 0 ? `\n## Blog Topics\n${scraped.extracted.blogTopics.join(", ")}` : "",
      scraped.socialLinks.length > 0 ? `\n## Social Media\n${scraped.socialLinks.map((s) => `${s.platform}: ${s.url}`).join(", ")}` : "",
      scraped.externalReviews.length > 0 ? `\n## External Reviews (Scraped from Trustpilot)\n${scraped.externalReviews.map((r) => r.snippet).join("\n")}` : "",
      searchData.reviews.length > 0 ? `\n## Customer Reviews from Search\n${searchData.reviews.map((r) => `${r.source}: ${r.snippet}`).join("\n")}` : "",
      searchData.rawReviewResults ? `\n## Raw Review Search Results\n${searchData.rawReviewResults.slice(0, 3000)}` : "",
      searchData.news.length > 0 ? `\n## News/Press\n${searchData.news.map((n) => n.title).join(", ")}` : "",
      scraped.pages.length > 0 ? `\n## Subpages\n${scraped.pages.map((p) => `[${p.slug}]\n${p.text.slice(0, 3000)}`).join("\n\n")}` : "",
      questionnaireContext,
    ].filter(Boolean).join("\n\n").slice(0, 30000)

    const { data: evaluationData, modelUsed: evalModel } = await evaluateBrand(evaluationInput)

    const categoryScores = evaluationData.categoryScores as Record<string, { score: number }> | undefined
    const computedScore = categoryScores ? computeWeightedScore(categoryScores) : 0
    evaluationData.brandScore = computedScore
    evaluationData.brandGrade = computeGrade(computedScore)

    const actionInput = JSON.stringify({ ...extracted, ...evaluationData }, null, 2).slice(0, 8000)
    const { data: actionsData, modelUsed: actionsModel } = await generateActions(actionInput)

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
      ...evaluationData,
      ...actionsData,
      _meta: {
        extractionModel: extractModel,
        evaluationModel: evalModel,
        actionsModel: actionsModel,
      },
      _evaluatedAt: new Date().toISOString(),
      _url: normalizedUrl,
    }

    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    })
  } catch (error: unknown) {
    console.error("Evaluation error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    if (message.includes("rate_limit_exceeded") || message.includes("429") || message.includes("all models exhausted")) {
      return NextResponse.json(
        { error: "AI service is currently overloaded. Please wait a few minutes and try again." },
        { status: 429, headers: { "Cache-Control": "no-store, max-age=0" } }
      )
    }
    return NextResponse.json({ error: message }, { status: 500, headers: { "Cache-Control": "no-store, max-age=0" } })
  }
}
