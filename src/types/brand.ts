export interface CategoryScore {
  score: number
  reasoning: string
}

export interface BrandResult {
  extractedCompanyInfo: {
    companyName: string | null
    industry: string | null
    productsOrServices: string[]
    businessDescription: string | null
    targetAudience: string | null
    brandMission: string | null
    brandVision: string | null
    coreValues: string[]
    usp: string | null
    headquarters: string | null
    yearsInBusiness: string | null
    brandPersonality: string | null
    mainCompetitors: string[]
    primaryCallToAction: string | null
    websiteQuality: string | null
    overallProfessionalism: string | null
    wikipediaVerified?: {
      founderName: boolean
      foundedYear: boolean
      employeeCount: boolean
      revenue: boolean
      headquarters: boolean
      industry: boolean
      ceoName: boolean
    }
    companyDetails?: {
      founderName: string | null
      founderBackground: string | null
      ceoName: string | null
      ownerName?: string | null
      ownerBackground?: string | null
      founderLinkedInUrl?: string | null
      ceoLinkedInUrl?: string | null
      ownerLinkedInUrl?: string | null
      leadershipTeam: { name: string; title: string; bio?: string | null; linkedInUrl?: string | null; yearsAtCompany?: string | null }[]
      employeeCount: string | null
      foundedYear: string | null
      fundingStage: string | null
      investors: string[]
      estimatedRevenue: string | null
      awards?: string[]
      certifications?: string[]
      partnerships?: string[]
      companyCulture?: string | null
    }
    digitalFootprint?: {
      socialMediaPresence: { platform: string; handleOrUrl: string; followerCount: number | null; activityLevel: string }[]
      customerReviews: { source: string; rating: number | null; reviewCountApprox: number | null; sentimentSummary: string }[]
      newsOrPressMentions: { source: string; summary: string; date: string | null }[]
      searchVisibility: string | null
      confirmedCompetitors: string[]
    }
    dataConfidence?: {
      employeeCount: "found" | "estimated" | "missing"
      estimatedRevenue: "found" | "estimated" | "missing"
      foundedYear: "found" | "estimated" | "missing"
      headquarters: "found" | "estimated" | "missing"
      founderName: "found" | "estimated" | "missing"
      ceoName: "found" | "estimated" | "missing"
      industry: "found" | "estimated" | "missing"
    }
  }
  categoryScores: Record<string, CategoryScore>
  brandScore: number
  brandGrade: string
  executiveSummary: string
  strengths: string[]
  weaknesses: string[]
  risks: string[]
  opportunities: string[]
  top10Recommendations: string[]
  actionPlan30Day: string[]
  actionPlan90Day: string[]
  brandGrowthStrategy1Year: string[]
  finalVerdict: string
  confidenceNote: string | null
  trustAnalysis?: string
  brandIdentityAnalysis?: string
  websiteUXAnalysis?: string
  seoAnalysis?: string
  contentAnalysis?: string
  reputationAnalysis?: string
  technicalAnalysis?: string
  topImprovements?: string[]
  expectedScoreAfterImprovements?: number
  error?: string
}
