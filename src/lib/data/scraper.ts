import axios from "axios"
import * as cheerio from "cheerio"

export interface ExternalReview {
  source: string
  rating: number | null
  reviewCount: number | null
  snippet: string
}

export interface TeamMember {
  name: string
  title: string
  bio: string | null
}

export interface TechnicalChecks {
  hasTitle: boolean
  hasMetaDescription: boolean
  hasH1: boolean
  hasH2Count: number
  imageAltCount: number
  imageTotalCount: number
  hasOGTags: boolean
  hasTwitterTags: boolean
  hasCanonical: boolean
  hasSchemaMarkup: boolean
  hasPrivacyPage: boolean
  hasTermsPage: boolean
  hasRefundPolicy: boolean
  hasTestimonialsSection: boolean
  hasTeamPage: boolean
  hasContactInfo: boolean
  hasPhysicalAddress: boolean
  hasEmailLink: boolean
  hasPhoneNumber: boolean
  hasCookieConsent: boolean
  hasAnalytics: boolean
  hasRobotsTxt: boolean
  hasSitemapXml: boolean
  pageSize: string
}

export interface ScrapedContent {
  url: string
  title: string
  description: string
  text: string
  meta: { title: string; description: string; ogImage: string | null }
  pages: { slug: string; text: string }[]
  socialLinks: { platform: string; url: string }[]
  externalReviews: ExternalReview[]
  extracted: {
    testimonials: string[]
    teamMembers: TeamMember[]
    prices: string[]
    blogTopics: string[]
    trustSignals: string[]
  }
  technicalChecks: TechnicalChecks
}

async function fetchPage(url: string): Promise<string | null> {
  try {
    const { data: html } = await axios.get(url, {
      timeout: 8000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    })
    const $ = cheerio.load(html)
    $("script, style, nav, footer, iframe, noscript, header, .sidebar, .menu, .cookie").remove()
    return $("body").text().replace(/\s+/g, " ").trim().slice(0, 8000)
  } catch {
    return null
  }
}

const SOCIAL_DOMAINS: Record<string, string[]> = {
  linkedin: ["linkedin.com/company", "linkedin.com/in"],
  twitter: ["twitter.com", "x.com"],
  instagram: ["instagram.com"],
  facebook: ["facebook.com", "fb.com"],
  youtube: ["youtube.com", "youtube.com/@", "youtube.com/channel"],
  tiktok: ["tiktok.com", "tiktok.com/@"],
  github: ["github.com"],
  crunchbase: ["crunchbase.com"],
}

function extractSocialLinks($: cheerio.CheerioAPI, base: string): { platform: string; url: string }[] {
  const found = new Set<string>()
  const links: { platform: string; url: string }[] = []

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") || ""
    let fullUrl = href.startsWith("http") ? href : href.startsWith("/") ? `${base}${href}` : null
    if (!fullUrl) return

    const lower = fullUrl.toLowerCase()
    for (const [platform, domains] of Object.entries(SOCIAL_DOMAINS)) {
      if (domains.some((d) => lower.includes(d))) {
        const key = `${platform}:${fullUrl}`
        if (!found.has(key)) {
          found.add(key)
          links.push({ platform: platform.charAt(0).toUpperCase() + platform.slice(1), url: fullUrl! })
        }
        break
      }
    }
  })

  return links
}

function discoverPageLinks($: cheerio.CheerioAPI, base: string): string[] {
  const slugs = new Set<string>()
  const priority = ["about", "team", "company", "careers", "products", "pricing", "blog", "press", "contact", "faq", "testimonials", "customers", "partners", "investors", "news"]

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") || ""
    let fullUrl = href.startsWith("http") ? href : href.startsWith("/") ? `${base}${href}` : null
    if (!fullUrl) return

    try {
      const parsed = new URL(fullUrl)
      if (parsed.hostname !== new URL(base).hostname) return
      const path = parsed.pathname.replace(/\/$/, "").split("/").filter(Boolean)
      const slug = path[0] || ""
      if (slug && slug.length > 1 && slug.length < 30 && /^[a-z0-9-]+$/.test(slug)) {
        slugs.add(slug)
      }
    } catch {
      // skip
    }
  })

  const ordered = priority.filter((p) => slugs.has(p))
  ordered.push(...[...slugs].filter((s) => !priority.includes(s)))
  return ordered.slice(0, 20)
}

async function fetchTrustpilotReviews(domain: string): Promise<ExternalReview[]> {
  try {
    const { data: html } = await axios.get(`https://www.trustpilot.com/review/${domain}`, {
      timeout: 8000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    })
    const $ = cheerio.load(html)

    const ratingText = $('[data-rating-typography="true"]').first().text().trim()
    const countText = $('[data-reviews-count-typography="true"]').first().text().trim()
    const rating = ratingText ? parseFloat(ratingText) : null
    const countMatch = countText ? countText.match(/([\d,]+)/) : null
    const reviewCount = countMatch ? parseInt(countMatch[1].replace(/,/g, "")) : null

    const snippets: string[] = []
    $('[data-service-review-text-typography="true"]').each((_, el) => {
      const t = $(el).text().trim()
      if (t && t.length > 30) snippets.push(t.slice(0, 400))
    })

    if (!rating && snippets.length === 0) return []

    return [{
      source: "Trustpilot",
      rating,
      reviewCount,
      snippet: snippets.length > 0
        ? `Rating: ${rating}/5 (${reviewCount} reviews). Sample reviews: ${snippets.slice(0, 5).join(" | ")}`
        : `Rating: ${rating}/5 (${reviewCount} reviews)`,
    }]
  } catch {
    return []
  }
}

export async function scrapeWebsite(url: string): Promise<ScrapedContent> {
  const parsed = new URL(url)
  const base = `${parsed.protocol}//${parsed.hostname}`

  const { data: html } = await axios.get(url, {
    timeout: 40000,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  })

  const $ = cheerio.load(html)
  $("script, style, nav, footer, iframe, noscript, header, .sidebar, .menu, .cookie").remove()

  const title = $("title").text().trim() || $('meta[property="og:title"]').attr("content") || ""
  const description = $('meta[name="description"]').attr("content") || $('meta[property="og:description"]').attr("content") || ""
  const ogImage = $('meta[property="og:image"]').attr("content") || null

  const mainText = $("body").text().replace(/\s+/g, " ").trim().slice(0, 8000)
  const socialLinks = extractSocialLinks($, base)

  const discoveredSlugs = discoverPageLinks($, base)
  const slugs = discoveredSlugs.length >= 3 ? discoveredSlugs : ["about", "team", "company", "careers", "products", "pricing", "blog", "press", "contact", "faq", "testimonials", "customers", "partners", "investors", "news"]

  const externalReviews = await fetchTrustpilotReviews(parsed.hostname.replace("www.", ""))

  const pages: { slug: string; text: string }[] = []

  const batchSize = 3
  for (let i = 0; i < slugs.length; i += batchSize) {
    const batch = slugs.slice(i, i + batchSize)
    const results = await Promise.all(batch.map((slug) => fetchPage(`${base}/${slug}`)))
    batch.forEach((slug, idx) => {
      if (results[idx]) pages.push({ slug, text: results[idx]! })
    })
  }

  const testimonials: string[] = []
  const teamMembers: TeamMember[] = []
  const prices: string[] = []
  const blogTopics: string[] = []
  const trustSignals: string[] = []

  const allText = [mainText, ...pages.map((p) => p.text)].join(" ")

  const quoteRegex = /["""]((?:[^"""]|\.){10,300})["""]/g
  let qMatch
  while ((qMatch = quoteRegex.exec(allText)) !== null) {
    const q = qMatch[1].trim()
    if (q.length > 20 && /good|great|best|love|recommend|amazing|excellent|help|fantastic|outstanding|perfect|wonderful|impressive|awesome|incredible/i.test(q)) {
      testimonials.push(q.slice(0, 250))
      if (testimonials.length >= 10) break
    }
  }

  const titleSuffixes = "Officer|Director|Manager|Lead|Head|Founder|Co-Founder|Owner|CEO|CTO|CFO|COO|President|VP|SVP|EVP|Engineer|Designer|Developer|Architect|Advisor|Evangelist|Partner|Consultant|Specialist|Coordinator|Analyst|Executive|Administrator|Supervisor|Assistant|Associate|Scientist|Researcher|Editor|Producer|Strategist|Planner|Buyer|Representative"
  const nameTitleRegex = new RegExp(`([A-Z][a-zA-Z]+(?:\\s+[A-Z][a-zA-Z'.]+){1,3})\\s*[–\\-—|,:]\\s*([A-Za-z\\s/()]+(?:${titleSuffixes}))`, "g")
  let ntMatch
  while ((ntMatch = nameTitleRegex.exec(allText)) !== null) {
    const title = ntMatch[2].trim()
    const bioStart = allText.slice(ntMatch.index + ntMatch[0].length, ntMatch.index + ntMatch[0].length + 300)
    const bioMatch = bioStart.match(/\.\s*([A-Z][^.]+\.)/)
    const bio = bioMatch ? bioMatch[1].trim() : null
    teamMembers.push({ name: ntMatch[1].trim(), title, bio })
    if (teamMembers.length >= 20) break
  }

  const priceRegex = /[\$€£¥]\s*\d+[\d,\.]*(?:\s*\/\s*(?:mo|month|year|yr|user|seat|license))?/g
  let pMatch
  while ((pMatch = priceRegex.exec(allText)) !== null) {
    prices.push(pMatch[0])
    if (prices.length >= 8) break
  }

  const blogPage = pages.find((p) => p.slug === "blog")
  if (blogPage) {
    const blogTitleRegex = /(?:<h[23]>|<a[^>]*>)([A-Z][A-Za-z\s:!?]{10,120})/g
    let bMatch
    while ((bMatch = blogTitleRegex.exec(blogPage.text)) !== null) {
      blogTopics.push(bMatch[1].trim())
      if (blogTopics.length >= 8) break
    }
    if (blogTopics.length === 0) {
      const words = blogPage.text.split(/\s+/)
      for (let wi = 0; wi < words.length - 5; wi++) {
        if (/[A-Z]/.test(words[wi]) && words[wi].length > 3) {
          blogTopics.push(words.slice(wi, wi + 6).join(" "))
          if (blogTopics.length >= 5) break
        }
      }
    }
  }

  const trustKeywords = ["trust", "secure", "ssl", "guarantee", "warranty", "certified", "award", "accredited", "verified", "bbb", "norton", "mcafee", "encryption", "privacy", "compliance", "gdpr", "soc2", "hipaa", "pci"]
  for (const kw of trustKeywords) {
    if (new RegExp(kw, "i").test(allText)) {
      trustSignals.push(kw.charAt(0).toUpperCase() + kw.slice(1))
    }
  }

  // ── Technical Checks ──
  const raw$ = cheerio.load(html)

  const hasTitle = !!raw$("title").text().trim()
  const hasMetaDescription = !!raw$('meta[name="description"]').attr("content")
  const hasH1 = raw$("h1").length > 0
  const hasH2Count = raw$("h2").length

  let imageAltCount = 0
  let imageTotalCount = 0
  raw$("img").each((_, el) => {
    imageTotalCount++
    if (raw$(el).attr("alt")) imageAltCount++
  })

  const hasOGTags = raw$('meta[property^="og:"]').length > 0
  const hasTwitterTags = raw$('meta[name^="twitter:"]').length > 0
  const hasCanonical = !!raw$('link[rel="canonical"]').attr("href")
  const hasSchemaMarkup = raw$('script[type="application/ld+json"]').length > 0
  const hasAnalytics = /(gtag|google-analytics|ga\s*\(|gtm\.start|f\x61\x76ico|clarity|hotjar|mixpanel|segment|amplitude)/i.test(html)
  const hasCookieConsent = /(cookie|cookieconsent|gdpr|ccpa|rgpd)/i.test(html) && /(consent|banner|notice|policy)/i.test(html)

  const pageSize = `${(new TextEncoder().encode(html).length / 1024).toFixed(1)} KB`

  const pageLinksText = pages.map((p) => p.text).join(" ").toLowerCase()
  const hasPrivacyPage = /privacy/.test(pageLinksText)
  const hasTermsPage = /terms/.test(pageLinksText)
  const hasRefundPolicy = /refund/.test(pageLinksText)
  const hasTestimonialsSection = /testimonial/.test(pageLinksText)
  const hasTeamPage = /team/.test(pageLinksText) || /leadership/.test(pageLinksText)
  const hasContactInfo = pages.some((p) => p.slug === "contact")
  const hasPhysicalAddress = /\d+\s+[a-z]+\s+(street|road|avenue|blvd|boulevard|drive|lane|way|suite|floor)/i.test(allText)
  const hasEmailLink = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(allText)
  const hasPhoneNumber = /(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/.test(allText)

  let hasRobotsTxt = false
  let hasSitemapXml = false
  try {
    const robotsRes = await axios.get(`${base}/robots.txt`, { timeout: 2000, validateStatus: (s) => s < 400 })
    hasRobotsTxt = robotsRes.status === 200
    if (hasRobotsTxt) {
      const sitemapRes = await axios.get(`${base}/sitemap.xml`, { timeout: 2000, validateStatus: (s) => s < 400 })
      hasSitemapXml = sitemapRes.status === 200
    }
  } catch {
    // robots/sitemap not accessible
  }

  const technicalChecks: TechnicalChecks = {
    hasTitle, hasMetaDescription, hasH1, hasH2Count,
    imageAltCount, imageTotalCount, hasOGTags, hasTwitterTags, hasCanonical,
    hasSchemaMarkup, hasPrivacyPage, hasTermsPage, hasRefundPolicy,
    hasTestimonialsSection, hasTeamPage, hasContactInfo, hasPhysicalAddress,
    hasEmailLink, hasPhoneNumber, hasCookieConsent, hasAnalytics,
    hasRobotsTxt, hasSitemapXml, pageSize,
  }

  return {
    url,
    title,
    description,
    text: mainText,
    meta: { title, description, ogImage },
    pages,
    socialLinks,
    externalReviews,
    extracted: { testimonials, teamMembers, prices, blogTopics, trustSignals },
    technicalChecks,
  }
}
