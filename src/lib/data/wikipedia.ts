export interface WikipediaData {
  companyName: string | null
  founderName: string | null
  foundedYear: string | null
  ceoName: string | null
  employeeCount: string | null
  revenue: string | null
  headquarters: string | null
  industry: string | null
  products: string[]
  description: string | null
  stockSymbol: string | null
  parentOrg: string | null
  website: string | null
  pageUrl: string | null
  fullExtract: string | null
}

export async function fetchWikipedia(companyName: string): Promise<WikipediaData> {
  const result: WikipediaData = {
    companyName: null, founderName: null, foundedYear: null,
    ceoName: null, employeeCount: null, revenue: null,
    headquarters: null, industry: null, products: [],
    description: null, stockSymbol: null, parentOrg: null,
    website: null, pageUrl: null, fullExtract: null,
  }

  const query = companyName.replace(/[^a-zA-Z0-9 ]/g, "").trim()
  if (!query) return result

  try {
    const searchRes = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`,
      { signal: AbortSignal.timeout(5000) }
    )

    let pageData: any
    let pageTitle: string

    if (!searchRes.ok) {
      const altRes = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query + " company")}&format=json&origin=*&srlimit=1`,
        { signal: AbortSignal.timeout(5000) }
      )
      const altData = await altRes.json()
      pageTitle = altData?.query?.search?.[0]?.title
      if (!pageTitle) return result

      const pageRes = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`,
        { signal: AbortSignal.timeout(5000) }
      )
      if (!pageRes.ok) return result
      pageData = await pageRes.json()
    } else {
      pageData = await searchRes.json()
      pageTitle = pageData.title
    }

    const extract = pageData?.extract || ""
    result.fullExtract = extract.slice(0, 3000)

    result.companyName = pageTitle || null
    result.description = extract.slice(0, 500) || null
    result.pageUrl = pageData?.content_urls?.desktop?.page || null
    result.website = pageData?.content_urls?.desktop?.page || null

    // Pattern-based extraction
    const patterns: Record<string, RegExp[]> = {
      founderName: [
        /founded by\s+([^,\.]+)/i,
        /founded\s+(?:in\s+\d{4}\s+)?by\s+([^,\.]+)/i,
        /(?:co-)?founders?\s+(?:are\s+|include\s+)?([^,\.]+)/i,
        /founded by\s+(?:brothers?\s+)?([^,\.]+)\s+and\s+([^,\.]+)/i,
      ],
      foundedYear: [
        /founded\s+in\s+(\d{4})/i,
        /established\s+in\s+(\d{4})/i,
        /incorporated\s+in\s+(\d{4})/i,
        /was\s+founded\s+(\d{4})/i,
        /since\s+(\d{4})/i,
      ],
      ceoName: [
        /(?:current\s+)?CEO\s+(?:is\s+)?([^,\.]+)/i,
        /chief executive\s+(?:officer\s+)?(?:is\s+)?([^,\.]+)/i,
      ],
      employeeCount: [
        /(\d{1,3}(?:,\d{3})*)\s*(?:employees|people|staff)/i,
        /(\d{1,3}(?:,\d{3})*)\s*employees/i,
        /employs\s+(?:over\s+|more\s+than\s+)?(\d{1,3}(?:,\d{3})*)/i,
        /(\d[\d,]*)\s*employees/i,
      ],
      revenue: [
        /revenue\s+(?:of\s+)?(?:US\s+)?[\$€£¥]?\s*([\d,\.]+\s*(?:billion|million|trillion|B|M))/i,
        /revenue\s+(?:of\s+)?[\$€£¥]\s*([\d,\.]+\s*(?:B|M))/i,
        /(?:US\s+)?[\$€£¥]\s*([\d,\.]+\s*(?:billion|million|trillion)).*?(?:revenue)/i,
        /anual\s+revenue\s+(?:of\s+)?[\$€£¥]\s*([\d,\.]+\s*(?:billion|million|trillion))/i,
      ],
      headquarters: [
        /headquartered\s+in\s+([^,\.]+(?:,\s*[A-Z]{2})?)/i,
        /(?:based|located)\s+in\s+([^,\.]+(?:,\s*[A-Z]{2})?)/i,
      ],
      industry: [
        /is\s+an?\s+(?:American|British|German|global|multinational|international|Indian|Chinese|Japanese|Canadian|French|Australian)?\s*([^,\.]+?\s+(?:company|corporation|corp|inc|group|llc|startup|platform|service|bank|firm|agency|studio|network|provider|developer))/i,
      ],
      stockSymbol: [
        /traded\s+(?:as|on)\s+(?:NASDAQ|NYSE|LSE|TSE)\s*[:\s]*([A-Z]+)/i,
        /stock\s+(?:symbol|ticker)\s+(?:is\s+)?([A-Z]+)/i,
      ],
    }

    for (const [key, regexes] of Object.entries(patterns)) {
      for (const regex of regexes) {
        const match = extract.match(regex)
        if (match) {
          (result as any)[key] = match[1].trim()
          break
        }
      }
    }

    return result
  } catch {
    return result
  }
}
