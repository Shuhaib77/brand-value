"use client"

import { useEffect, useState, Suspense, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { FileText, ArrowLeft, LayoutDashboard, BarChart3, Target, Search, TrendingUp, Lightbulb, Users, Building2, Star, FileDown } from "lucide-react"
import BrandScore from "@/components/brand/brand-score"
import ScoreRadar from "@/components/brand/score-radar"
import CategoryDetails from "@/components/brand/category-details"
import StrengthsWeaknesses from "@/components/brand/strengths-weaknesses"
import Recommendations from "@/components/brand/recommendations"
import ActionPlans from "@/components/brand/action-plans"
import CompanyInfo from "@/components/brand/company-info"
import CompanyDetailsCard from "@/components/brand/company-details"
import FounderOwners from "@/components/brand/founder-owners"
import ExecutiveSummary from "@/components/brand/executive-summary"
import Tabs from "@/components/ui/tabs"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { BrandResult, LeadershipMember } from "@/types/brand"
import { generateBrandReport } from "@/lib/pdf/brand-report"

const tabs = [
  { key: "overview", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
  { key: "scores", label: "Scores", icon: <BarChart3 className="w-4 h-4" /> },
  { key: "analysis", label: "SWOT", icon: <Target className="w-4 h-4" /> },
  { key: "deep", label: "Deep Analysis", icon: <Search className="w-4 h-4" /> },
  { key: "improvements", label: "Improvements", icon: <TrendingUp className="w-4 h-4" /> },
  { key: "founders", label: "Founders", icon: <Users className="w-4 h-4" /> },
  { key: "recommendations", label: "Actions", icon: <Lightbulb className="w-4 h-4" /> },
  { key: "action", label: "Timeline", icon: <Star className="w-4 h-4" /> },
  { key: "company", label: "Company", icon: <Building2 className="w-4 h-4" /> },
  { key: "team", label: "Team", icon: <Users className="w-4 h-4" /> },
]

const fallbackDetails = {
  founderName: null, founderBackground: null, ceoName: null,
  ownerName: null, ownerBackground: null, founderLinkedInUrl: null,
  ceoLinkedInUrl: null, ownerLinkedInUrl: null,
  leadershipTeam: [] as LeadershipMember[],
  employeeCount: null, foundedYear: null, fundingStage: null,
  investors: [] as string[], estimatedRevenue: null,
  awards: undefined as string[] | undefined,
  certifications: undefined as string[] | undefined,
  partnerships: undefined as string[] | undefined,
  companyCulture: undefined as string | undefined,
}

function ResultsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [result, setResult] = useState<BrandResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem("brandResult")
    if (!stored) {
      router.push("/")
      return
    }
    try {
      const parsed = JSON.parse(stored)
      if (parsed.error) {
        router.push(`/?error=${encodeURIComponent(parsed.error)}`)
        return
      }
      setResult(parsed)
    } catch {
      router.push("/")
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleDownloadPDF = useCallback(async () => {
    const r = result
    if (!r) return
    setGenerating(true)
    try {
      const info = r.extractedCompanyInfo
      const d = await generateBrandReport(r)
      d.save(`${info.companyName || "brand"}-Brand-Report.pdf`)
    } catch (err) {
      console.error("PDF generation error:", err)
    } finally {
      setGenerating(false)
    }
  }, [result])

  if (loading) {
    return (
      <div className="flex-1 px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <Skeleton variant="rect" className="h-8 w-48 mb-4" />
          <Skeleton variant="rect" className="h-6 w-72 mb-8" />
          <div className="flex gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} variant="rect" className="h-10 w-24 rounded-lg" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Skeleton variant="card" />
            <Skeleton variant="card" />
          </div>
          <Skeleton variant="card" className="h-40" />
        </div>
      </div>
    )
  }

  if (!result) return null

  const url = searchParams?.get("url")

  return (
    <div className="flex-1 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
              <ArrowLeft className="w-4 h-4" />
              New Evaluation
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadPDF} disabled={generating}>
              <FileText className="w-4 h-4" />
              {generating ? "Generating..." : "Download PDF"}
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Brand Value Report</h1>
          {url && <p className="text-sm text-gray-400 mt-1">{decodeURIComponent(url)}</p>}
        </div>

        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mt-8 animate-slide-up">
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <BrandScore score={result.brandScore} grade={result.brandGrade} />
                <ScoreRadar categories={result.categoryScores} />
              </div>
              <ExecutiveSummary
                summary={result.executiveSummary}
                verdict={result.finalVerdict}
                confidenceNote={result.confidenceNote}
              />
            </div>
          )}

          {activeTab === "scores" && <CategoryDetails categories={result.categoryScores} />}

          {activeTab === "analysis" && (
            <StrengthsWeaknesses
              strengths={result.strengths}
              weaknesses={result.weaknesses}
              risks={result.risks}
              opportunities={result.opportunities}
            />
          )}

          {activeTab === "deep" && (
            <div className="space-y-6">
              {[
                { title: "Brand Identity Analysis", content: result.brandIdentityAnalysis },
                { title: "Website UX Analysis", content: result.websiteUXAnalysis },
                { title: "Trust & Credibility Analysis", content: result.trustAnalysis },
                { title: "SEO & Visibility Analysis", content: result.seoAnalysis },
                { title: "Content Quality Analysis", content: result.contentAnalysis },
                { title: "Customer Reputation Analysis", content: result.reputationAnalysis },
                { title: "Technical Quality Analysis", content: result.technicalAnalysis },
              ].filter((s) => s.content).map((section) => (
                <Card key={section.title}>
                  <CardHeader gradient>
                    <h3 className="font-semibold text-gray-900 text-sm">{section.title}</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{section.content}</p>
                  </CardContent>
                </Card>
              ))}
              {!result.brandIdentityAnalysis && !result.trustAnalysis && (
                <Card>
                  <CardContent>
                    <div className="text-center py-6 text-gray-400 text-sm">No deep analysis available.</div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === "improvements" && (
            <div className="space-y-6">
              <Card>
                <CardHeader gradient>
                  <h3 className="font-semibold text-gray-900 text-sm">Top Priority Improvements</h3>
                </CardHeader>
                <CardContent>
                  {result.topImprovements && result.topImprovements.length > 0 ? (
                    <div className="space-y-3">
                      {result.topImprovements.map((imp, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                            {i + 1}
                          </span>
                          <p className="text-sm text-gray-700 dark:text-gray-300 pt-0.5">{imp}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">No improvement suggestions available.</p>
                  )}
                </CardContent>
              </Card>

              {result.expectedScoreAfterImprovements != null && (
                <div className="p-6 sm:p-8 rounded-xl bg-gradient-to-br from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20 border border-purple-100 dark:border-purple-800/30">
                  <h3 className="text-sm font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wider mb-3">
                    Expected Score After Improvements
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold gradient-text">{result.expectedScoreAfterImprovements}</span>
                    <span className="text-lg text-gray-400">/100</span>
                    <span className="ml-2 text-sm text-purple-600 dark:text-purple-400 font-medium">
                      (+{result.expectedScoreAfterImprovements - result.brandScore} points)
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Implementing the top 10 improvements could raise the brand score from{" "}
                    <strong className="text-gray-700 dark:text-gray-200">{result.brandScore}/100</strong> to{" "}
                    <strong className="text-gray-700 dark:text-gray-200">{result.expectedScoreAfterImprovements}/100</strong>.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "recommendations" && <Recommendations recommendations={result.top10Recommendations} />}
          {activeTab === "action" && (
            <ActionPlans
              plan30Day={result.actionPlan30Day}
              plan90Day={result.actionPlan90Day}
              plan1Year={result.brandGrowthStrategy1Year}
            />
          )}
          {activeTab === "company" && <CompanyInfo info={result.extractedCompanyInfo} />}
          {activeTab === "team" && (
            <CompanyDetailsCard
              details={result.extractedCompanyInfo.companyDetails || fallbackDetails}
              wikiVerified={result.extractedCompanyInfo.wikipediaVerified}
            />
          )}
          {activeTab === "founders" && (
            <FounderOwners
              details={result.extractedCompanyInfo.companyDetails || fallbackDetails}
              wikiVerified={result.extractedCompanyInfo.wikipediaVerified}
            />
          )}
        </div>
      </div>

      {/* Floating PDF button */}
      <button
        onClick={handleDownloadPDF}
        disabled={generating}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        title="Download PDF"
      >
        <FileDown className="w-5 h-5" />
      </button>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse-dot" />
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse-dot" />
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse-dot" />
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  )
}
