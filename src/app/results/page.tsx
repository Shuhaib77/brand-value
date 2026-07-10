"use client"

import { useEffect, useState, Suspense, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
import { BrandResult } from "@/types/brand"
import { generateBrandReport } from "@/lib/pdf/brand-report"

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
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="flex gap-2 justify-center mb-4">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse-dot" />
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse-dot" />
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse-dot" />
          </div>
          <p className="text-gray-500">Loading your results...</p>
        </div>
      </div>
    )
  }

  if (!result) return null

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "scores", label: "Category Scores" },
    { key: "analysis", label: "SWOT Analysis" },
    { key: "deep", label: "Deep Analysis" },
    { key: "improvements", label: "Improvements" },
    { key: "founders", label: "Founders & Owners" },
    { key: "recommendations", label: "Recommendations" },
    { key: "action", label: "Action Plans" },
    { key: "company", label: "Company Info" },
    { key: "team", label: "Team & Company" },
  ]

  const url = searchParams?.get("url")

  return (
    <div className="flex-1 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <a href="/" className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              New Evaluation
            </a>
            <button
              onClick={handleDownloadPDF}
              disabled={generating}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {generating ? "Generating PDF..." : "Download PDF"}
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Brand Value Report</h1>
          {url && <p className="text-sm text-gray-400 mt-1">{decodeURIComponent(url)}</p>}
        </div>

        <div className="flex gap-1 mb-8 overflow-x-auto pb-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === t.key
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="animate-slide-up">
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

          {activeTab === "scores" && (
            <CategoryDetails categories={result.categoryScores} />
          )}

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
                <div key={section.title} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-3 bg-gradient-to-r from-purple-50 to-cyan-50 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 text-sm">{section.title}</h3>
                  </div>
                  <div className="p-5 text-sm text-gray-700 leading-relaxed">{section.content}</div>
                </div>
              ))}
              {!result.brandIdentityAnalysis && !result.trustAnalysis && (
                <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-400 text-sm">
                  No deep analysis available. Re-run evaluation with the latest version.
                </div>
              )}
            </div>
          )}

          {activeTab === "improvements" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3 bg-gradient-to-r from-purple-50 to-cyan-50 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900 text-sm">Top Priority Improvements</h3>
                </div>
                <div className="p-5">
                  {result.topImprovements && result.topImprovements.length > 0 ? (
                    <div className="space-y-3">
                      {result.topImprovements.map((imp, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">
                            {i + 1}
                          </span>
                          <p className="text-sm text-gray-700 pt-0.5">{imp}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">No improvement suggestions available.</p>
                  )}
                </div>
              </div>

              {result.expectedScoreAfterImprovements != null && (
                <div className="bg-gradient-to-br from-purple-50 to-cyan-50 rounded-xl p-6 border border-purple-100">
                  <h3 className="text-sm font-semibold text-purple-700 uppercase tracking-wider mb-2">
                    Expected Score After Improvements
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold gradient-text">{result.expectedScoreAfterImprovements}</span>
                    <span className="text-lg text-gray-400">/100</span>
                    <span className="ml-2 text-sm text-purple-600 font-medium">
                      (+{result.expectedScoreAfterImprovements - result.brandScore} points)
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Implementing the top 10 improvements above could raise the brand score from{" "}
                    <strong>{result.brandScore}/100</strong> to{" "}
                    <strong>{result.expectedScoreAfterImprovements}/100</strong>.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "recommendations" && (
            <Recommendations recommendations={result.top10Recommendations} />
          )}

          {activeTab === "action" && (
            <ActionPlans
              plan30Day={result.actionPlan30Day}
              plan90Day={result.actionPlan90Day}
              plan1Year={result.brandGrowthStrategy1Year}
            />
          )}

          {activeTab === "company" && (
            <CompanyInfo info={result.extractedCompanyInfo} />
          )}

          {activeTab === "team" && (
            <CompanyDetailsCard
              details={result.extractedCompanyInfo.companyDetails || {
                founderName: null,
                founderBackground: null,
                ceoName: null,
                ownerName: null,
                ownerBackground: null,
                founderLinkedInUrl: null,
                ceoLinkedInUrl: null,
                ownerLinkedInUrl: null,
                leadershipTeam: [],
                employeeCount: null,
                foundedYear: null,
                fundingStage: null,
                investors: [],
                estimatedRevenue: null,
                awards: undefined,
                certifications: undefined,
                partnerships: undefined,
                companyCulture: undefined,
              }}
              wikiVerified={result.extractedCompanyInfo.wikipediaVerified}
            />
          )}

          {activeTab === "founders" && (
            <FounderOwners
              details={result.extractedCompanyInfo.companyDetails || {
                founderName: null,
                founderBackground: null,
                ceoName: null,
                ownerName: null,
                ownerBackground: null,
                founderLinkedInUrl: null,
                ceoLinkedInUrl: null,
                ownerLinkedInUrl: null,
                leadershipTeam: [],
                employeeCount: null,
                foundedYear: null,
                fundingStage: null,
                investors: [],
                estimatedRevenue: null,
                awards: undefined,
                certifications: undefined,
                partnerships: undefined,
                companyCulture: undefined,
              }}
              wikiVerified={result.extractedCompanyInfo.wikipediaVerified}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse-dot" />
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse-dot" />
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse-dot" />
          </div>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  )
}
