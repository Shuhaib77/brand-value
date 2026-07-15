import { tavily } from "@tavily/core"

export interface SearchResult {
  companyName: string
  socialMedia: { platform: string; url: string | null }[]
  reviews: { source: string; snippet: string }[]
  news: { title: string; url: string; date: string | null }[]
  rawResults: string
  rawReviewResults: string
}

export async function searchTeam(companyName: string): Promise<string> {
  const apiKey = process.env.TAVILY_API_KEY
  if (!apiKey || apiKey === "your_tavily_api_key_here") return ""

  const client = tavily({ apiKey })

  const queries = [
    `${companyName} founder CEO co-founder leadership`,
    `${companyName} about us team founders`,
    `${companyName} management team bios`,
  ]

  // Build keywords from the company name to filter out unrelated results
  const nameLower = companyName.toLowerCase().trim()
  const clean = nameLower.replace(/\b(llp|ltd|inc|corp|llc|gmbh|pty)\b/gi, "").trim()
  const words = clean.split(/\s+/).filter(Boolean)
  const searchKeywords: string[] = [nameLower]
  if (words.length >= 2) {
    searchKeywords.push(words.slice(0, 2).join(" ")) // "phew interactive"
  }
  searchKeywords.push(nameLower.replace(/\s+/g, "")) // "phewinteractivellp"
  if (words.length >= 2) {
    searchKeywords.push(words.slice(0, 2).join(""))  // "phewinteractive"
  }

  const allResults: string[] = []

  for (const query of queries) {
    try {
      const response = await client.search(query, {
        searchDepth: "advanced",
        maxResults: 6,
        includeAnswer: true,
      })
      for (const r of response.results) {
        if (!r.content) continue
        const text = ((r.title || "") + " " + (r.content || "")).toLowerCase()
        const mentionsCompany = searchKeywords.some(kw => kw.length > 3 && text.includes(kw))
        if (!mentionsCompany) continue
        allResults.push(`[${r.title}](${r.url})\n${r.content.slice(0, 1000)}`)
      }
    } catch {
      // skip
    }
  }

  return allResults.join("\n\n---\n\n").slice(0, 6000)
}

export async function searchCompany(url: string): Promise<SearchResult> {
  const apiKey = process.env.TAVILY_API_KEY
  if (!apiKey || apiKey === "your_tavily_api_key_here") {
    return {
      companyName: "",
      socialMedia: [],
      reviews: [],
      news: [],
      rawResults: "Tavily API key not configured",
      rawReviewResults: "",
    }
  }

  const client = tavily({ apiKey })
  const domain = new URL(url.startsWith("http") ? url : `https://${url}`).hostname.replace("www.", "")
  const companyName = domain.split(".")[0]

  const queries = [
    `"${companyName}" ${domain} brand products mission values`,
    `"${companyName}" founder CEO leadership team executives`,
    `"${companyName}" reviews ratings customers trustpilot g2 capterra`,
    `"${companyName}" competitors market industry`,
    `"${companyName}" funding investment revenue investors`,
    `"${companyName}" social media twitter linkedin instagram followers`,
  ]

  const reviewQueries = [
    `"${companyName}" customer reviews ratings glassdoor indeed sitejabber`,
    `"${companyName}" reviews app store play store reddit producthunt`,
  ]

  const allResults: { title: string; url: string; content: string }[] = []
  const allReviewResults: { title: string; url: string; content: string }[] = []

  for (const query of queries) {
    try {
      const response = await client.search(query, {
        searchDepth: "advanced",
        maxResults: 8,
        includeAnswer: true,
      })
      allResults.push(...response.results)
    } catch {
      // skip
    }
  }

  for (const query of reviewQueries) {
    try {
      const response = await client.search(query, {
        searchDepth: "advanced",
        maxResults: 10,
        includeAnswer: true,
      })
      allReviewResults.push(...response.results)
    } catch {
      // skip
    }
  }

  const companyLower = companyName.toLowerCase().trim()

  const seen = new Set<string>()
  const uniqueResults = allResults
    .filter((r) => {
      if (seen.has(r.url)) return false
      seen.add(r.url)
      const text = ((r.title || "") + " " + (r.content || "")).toLowerCase()
      return text.includes(companyLower)
    })
    .slice(0, 24)

  const reviewSeen = new Set<string>()
  const uniqueReviewResults = allReviewResults
    .filter((r) => {
      if (reviewSeen.has(r.url)) return false
      reviewSeen.add(r.url)
      const text = ((r.title || "") + " " + (r.content || "")).toLowerCase()
      return text.includes(companyLower)
    })
    .slice(0, 16)

  const rawResults = uniqueResults
    .map((r) => `[${r.title}](${r.url}) - ${(r.content || "").slice(0, 500)}`)
    .join("\n\n")

  const rawReviewResults = uniqueReviewResults
    .map((r) => `[${r.title}](${r.url})\nRating/Content: ${(r.content || "").slice(0, 800)}`)
    .join("\n\n---\n\n")

  const socialMedia: { platform: string; url: string | null }[] = []
  const reviews: { source: string; snippet: string }[] = []
  const news: { title: string; url: string; date: string | null }[] = []

  const classifyResult = (result: { title: string; url: string; content: string }) => {
    const urlLower = result.url?.toLowerCase() || ""
    const content = result.content || ""

    if (urlLower.includes("linkedin.com")) {
      socialMedia.push({ platform: "LinkedIn", url: result.url })
    } else if (urlLower.includes("twitter.com") || urlLower.includes("x.com")) {
      socialMedia.push({ platform: "X/Twitter", url: result.url })
    } else if (urlLower.includes("instagram.com")) {
      socialMedia.push({ platform: "Instagram", url: result.url })
    } else if (urlLower.includes("facebook.com")) {
      socialMedia.push({ platform: "Facebook", url: result.url })
    } else if (urlLower.includes("youtube.com")) {
      socialMedia.push({ platform: "YouTube", url: result.url })
    } else if (urlLower.includes("tiktok.com")) {
      socialMedia.push({ platform: "TikTok", url: result.url })
    } else if (urlLower.includes("github.com")) {
      socialMedia.push({ platform: "GitHub", url: result.url })
    } else if (
      urlLower.includes("trustpilot") ||
      urlLower.includes("g2.com") ||
      urlLower.includes("capterra") ||
      urlLower.includes("google.com/maps") ||
      urlLower.includes("yelp") ||
      urlLower.includes("glassdoor") ||
      urlLower.includes("gartner") ||
      urlLower.includes("forrester") ||
      urlLower.includes("sitejabber") ||
      urlLower.includes("indeed") ||
      urlLower.includes("producthunt") ||
      urlLower.includes("bbb") ||
      urlLower.includes("consumeraffairs") ||
      urlLower.includes("appstore") ||
      urlLower.includes("apps.apple") ||
      urlLower.includes("play.google")
    ) {
      reviews.push({ source: result.url || "Unknown", snippet: content.slice(0, 800) })
    } else if (
      urlLower.includes("news") ||
      urlLower.includes("techcrunch") ||
      urlLower.includes("forbes") ||
      urlLower.includes("crunchbase") ||
      urlLower.includes("bloomberg") ||
      urlLower.includes("reuters") ||
      urlLower.includes("wsj") ||
      urlLower.includes("wired") ||
      urlLower.includes("businessinsider") ||
      urlLower.includes("venturebeat") ||
      urlLower.includes("prnewswire") ||
      urlLower.includes("businesswire")
    ) {
      news.push({ title: result.title || "Untitled", url: result.url || "", date: null })
    }
  }

  for (const result of uniqueResults) classifyResult(result)
  for (const result of uniqueReviewResults) classifyResult(result)

  return {
    companyName,
    socialMedia,
    reviews,
    news,
    rawResults,
    rawReviewResults,
  }
}
