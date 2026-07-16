export interface LeadershipMember {
  name: string
  title: string
  bio?: string | null
  linkedInUrl?: string | null
  yearsAtCompany?: string | null
}

export interface WikipediaVerified {
  founderName: boolean
  foundedYear: boolean
  employeeCount: boolean
  revenue: boolean
  headquarters: boolean
  industry: boolean
  ceoName: boolean
}

export interface CompanyDetails {
  founderName: string | null
  founderBackground: string | null
  founderLinkedInUrl?: string | null
  ceoName: string | null
  ceoLinkedInUrl?: string | null
  ownerName?: string | null
  ownerBackground?: string | null
  ownerLinkedInUrl?: string | null
  leadershipTeam: LeadershipMember[]
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

export interface CompanyInfo {
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
  wikipediaVerified?: WikipediaVerified
  companyDetails?: {
    founderName: string | null
    founderBackground: string | null
    ceoName: string | null
    ownerName?: string | null
    ownerBackground?: string | null
  }
}

export interface DigitalFootprint {
  socialMediaPresence: { platform: string; handleOrUrl: string; followerCount: number | null; activityLevel: string }[]
  customerReviews: { source: string; rating: number | null; reviewCountApprox: number | null; sentimentSummary: string }[]
  newsOrPressMentions: { source: string; summary: string; date: string | null }[]
  searchVisibility: string | null
  confirmedCompetitors: string[]
}

export interface DataConfidence {
  employeeCount: "found" | "estimated" | "missing"
  estimatedRevenue: "found" | "estimated" | "missing"
  foundedYear: "found" | "estimated" | "missing"
  headquarters: "found" | "estimated" | "missing"
  founderName: "found" | "estimated" | "missing"
  ceoName: "found" | "estimated" | "missing"
  industry: "found" | "estimated" | "missing"
}

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
    wikipediaVerified?: WikipediaVerified
    companyDetails?: CompanyDetails
    digitalFootprint?: DigitalFootprint
    dataConfidence?: DataConfidence
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
