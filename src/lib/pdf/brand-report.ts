import { jsPDF } from "jspdf"
import { autoTable } from "jspdf-autotable"
import { BrandResult } from "@/types/brand"
import { PW, PH, TM, BM, LM, CW, LH, P_DARK, P, CY, TD, TMU, TLBL, TLIT, HDR, BLP, BDLP, BLC, BDLC, BCHIP, BDCH, CBD, CBDD, CLBL, WB, WBD, WT } from "./colors"
import { lnCt, bt, wr, np, slbl, stitle, sh, bl, ch, ir, eb, ablock } from "./helpers"
import { formatDate } from "@/utils/formatting"

let _co = ""
let _tot = 0

const categoryLabels: Record<string, string> = {
  brandIdentity: "Brand Identity",
  websiteExperience: "Website Experience",
  trustCredibility: "Trust & Credibility",
  seoVisibility: "SEO & Visibility",
  contentQuality: "Content Quality",
  socialMediaPresence: "Social Media Presence",
  customerReputation: "Customer Reputation",
  performanceAccessibility: "Performance & Accessibility",
  technicalQuality: "Technical Quality",
}

export async function generateBrandReport(result: BrandResult): Promise<jsPDF> {
  const info = result.extractedCompanyInfo
  _co = info.companyName || "Company"
  const d = new jsPDF("p", "mm", "letter")
  const ds = formatDate(new Date())

  // ═══════════════════════════════════════
  // COVER PAGE
  // ═══════════════════════════════════════
  const bn = 20
  for (let i = 0; i < bn; i++) {
    const t = i / (bn - 1)
    d.setFillColor(
      Math.round(P_DARK[0] + (CY[0] - P_DARK[0]) * t),
      Math.round(P_DARK[1] + (CY[1] - P_DARK[1]) * t),
      Math.round(P_DARK[2] + (CY[2] - P_DARK[2]) * t)
    )
    d.rect(0, i * PH / bn, PW, PH / bn + 1, "F")
  }
  d.setFillColor(255, 255, 255); d.setDrawColor(255, 255, 255)
  d.setGState(new (d as any).GState({ opacity: 0.1 }))
  d.roundedRect(18.5, 23.8, 12.2, 12.2, 3.2, 3.2, "F")
  d.setGState(new (d as any).GState({ opacity: 0.35 })); d.setLineWidth(0.2)
  d.roundedRect(18.5, 23.8, 12.2, 12.2, 3.2, 3.2, "S")
  d.setGState(new (d as any).GState({ opacity: 1 }))
  d.setFontSize(16); d.setFont("helvetica", "bold"); d.setTextColor(255, 255, 255)
  d.text("B", 18.5 + 6.1, 33.2, { align: "center" })
  d.setFontSize(10.5); d.setFont("helvetica", "bold"); d.setGState(new (d as any).GState({ opacity: 0.85 }))
  d.setTextColor(255, 255, 255)
  d.text("AI-GENERATED BRAND INTELLIGENCE", 18.5, 55)
  d.setGState(new (d as any).GState({ opacity: 1 }))
  d.setFontSize(40); d.setFont("helvetica", "bold"); d.setTextColor(255, 255, 255)
  d.text("Brand Value", 18.5, 69)
  d.text("Report", 18.5, 86)
  d.setFontSize(13); d.setFont("helvetica", "normal"); d.setTextColor(220, 215, 250)
  d.text(_co, 18.5, 99)
  // Score & Grade badge
  const gradeTxt = `${result.brandScore}/100 — Grade ${result.brandGrade || "—"}`
  d.setFontSize(14); d.setFont("helvetica", "bold"); d.setTextColor(255, 215, 0)
  d.text(gradeTxt, 18.5, 110)
  const tl = info.businessDescription ? info.businessDescription.split(". ")[0] + "." : null
  if (tl && tl.length < 120) {
    d.setDrawColor(255, 255, 255); d.setGState(new (d as any).GState({ opacity: 0.5 })); d.setLineWidth(1.5)
    d.line(18.5, 118, 18.5, 128)
    d.setGState(new (d as any).GState({ opacity: 0.85 }))
    d.setFontSize(11); d.setFont("helvetica", "italic"); d.setTextColor(255, 255, 255)
    d.text(`\u201c${tl}\u201d`, 18.5 + 6, 125)
  }
  d.setGState(new (d as any).GState({ opacity: 1 }))
  d.setDrawColor(255, 255, 255); d.setGState(new (d as any).GState({ opacity: 0.3 })); d.setLineWidth(0.25)
  d.line(18.5, PH - 42, PW - 18.5, PH - 42)
  d.setGState(new (d as any).GState({ opacity: 1 }))
  const fw = (PW - 37 - 20) / 3
  const ff: [string, string][] = [["Industry", info.industry || "\u2014"], ["Headquarters", info.headquarters || "\u2014"], ["Generated", ds]]
  for (let i = 0; i < ff.length; i++) {
    const fx = 18.5 + i * (fw + 10)
    d.setFontSize(8); d.setFont("helvetica", "bold"); d.setGState(new (d as any).GState({ opacity: 0.75 }))
    d.setTextColor(255, 255, 255); d.text(ff[i][0].toUpperCase(), fx, PH - 33)
    d.setGState(new (d as any).GState({ opacity: 1 }))
    d.setFontSize(10.5); d.setFont("helvetica", "normal"); d.text(ff[i][1], fx, PH - 22)
  }

  // ═══════════════════════════════════════
  // CONTENT PAGES
  // ═══════════════════════════════════════
  d.addPage()
  let y = TM + 2
  const wv = info.wikipediaVerified

  // ── 1. Executive Summary ──
  y = sh(d, "Overview", "Executive Summary", y)
  y = eb(d, result.executiveSummary, y)
  if (result.confidenceNote) {
    y = np(d, y, 8)
    d.setFontSize(8); d.setFont("helvetica", "italic"); d.setTextColor(TMU[0], TMU[1], TMU[2])
    y = bt(d, `Note: ${result.confidenceNote}`, LM, y, CW - 6)
    y += 5
  }
  y += 6

  // ── 2. Target Audience ──
  if (info.targetAudience) {
    y = sh(d, "Audience", "Target Audience", y)
    d.setFontSize(9.5); d.setFont("helvetica", "normal"); d.setTextColor(TMU[0], TMU[1], TMU[2])
    y = bt(d, info.targetAudience, LM, y, CW)
    y += 6
  }

  // ── 3. Category Scores ──
  y = sh(d, "Assessment", "Category Scores", y)
  y = np(d, y, 50)
  const td = Object.entries(result.categoryScores).map(([k, c]) => [categoryLabels[k] || k, `${c.score}/10`, c.reasoning])
  autoTable(d, {
    startY: y, margin: { left: LM, top: TM, bottom: BM }, tableWidth: CW,
    head: [["Category", "Score", "Reasoning"]], body: td, theme: "grid",
    headStyles: { fillColor: [P[0], P[1], P[2]], textColor: 255, fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8, textColor: TD }, alternateRowStyles: { fillColor: BLP },
    columnStyles: { 0: { cellWidth: 32, cellPadding: 1.5 }, 1: { cellWidth: 14, halign: "center", cellPadding: 1.5 }, 2: { cellWidth: "auto", cellPadding: 1.5 } },
  })
  y = (d as any).lastAutoTable.finalY + 8

  // ── 4. SWOT Analysis ──
  y = sh(d, "Analysis", "SWOT Analysis", y)
  for (const [lb, its] of [["Strengths", result.strengths], ["Weaknesses", result.weaknesses], ["Risks", result.risks], ["Opportunities", result.opportunities]] as [string, string[]][]) {
    y = np(d, y, 10)
    d.setFontSize(9); d.setFont("helvetica", "bold"); d.setTextColor(TD[0], TD[1], TD[2])
    d.text(lb, LM, y); y += 5; y = bl(d, its, y); y += 7
  }

  // ── 5. Recommendations & Action Plans ──
  y += 4; y = sh(d, "Strategy", "Top 10 Recommendations", y); y = bl(d, result.top10Recommendations, y)
  y += 2; y = sh(d, "Strategy", "30-Day Action Plan", y); y = bl(d, result.actionPlan30Day, y)
  y += 2; y = sh(d, "Strategy", "90-Day Action Plan", y); y = bl(d, result.actionPlan90Day, y)
  y += 2; y = sh(d, "Strategy", "1-Year Brand Growth Strategy", y); y = bl(d, result.brandGrowthStrategy1Year, y)
  y += 6

  // ── 6. Final Verdict ──
  y = sh(d, "Conclusion", "Final Verdict", y)
  d.setFontSize(9.5); d.setFont("helvetica", "italic"); d.setTextColor(TMU[0], TMU[1], TMU[2])
  y = bt(d, result.finalVerdict, LM, y, CW); y += 6

  // ── 7. Deep Analysis ──
  const analysisSections: [string, string | undefined][] = [
    ["Brand Identity Analysis", result.brandIdentityAnalysis],
    ["Website UX Analysis", result.websiteUXAnalysis],
    ["Trust & Credibility Analysis", result.trustAnalysis],
    ["SEO & Visibility Analysis", result.seoAnalysis],
    ["Content Quality Analysis", result.contentAnalysis],
    ["Customer Reputation Analysis", result.reputationAnalysis],
    ["Technical Quality Analysis", result.technicalAnalysis],
  ]
  for (const [title, content] of analysisSections) {
    if (!content) continue
    y = sh(d, "Analysis", title, y)
    d.setFontSize(9.5); d.setFont("helvetica", "normal"); d.setTextColor(TMU[0], TMU[1], TMU[2])
    y = bt(d, content, LM, y, CW); y += 6
  }

  // ── 8. Top Improvements ──
  if (result.topImprovements?.length) {
    y += 4; y = sh(d, "Action", "Top Priority Improvements", y)
    for (const [i, imp] of result.topImprovements.entries()) {
      y = np(d, y, 8)
      d.setFontSize(9); d.setFont("helvetica", "bold"); d.setTextColor(TD[0], TD[1], TD[2])
      d.text(`${i + 1}.`, LM, y)
      d.setFontSize(9.5); d.setFont("helvetica", "normal"); d.setTextColor(TD[0], TD[1], TD[2])
      y = bt(d, imp, LM + 8, y, CW - 12); y += 4
    }
    if (result.expectedScoreAfterImprovements != null) {
      y = np(d, y, 10)
      d.setFontSize(9); d.setFont("helvetica", "bold"); d.setTextColor(P[0], P[1], P[2])
      d.text(`Expected Score After Improvements: ${result.expectedScoreAfterImprovements}/100 (+${result.expectedScoreAfterImprovements - result.brandScore} points)`, LM, y)
      y += 6
    }
  }

  // ── 9. Company Profile ──
  y = sh(d, "Data Points", "Company Profile", y)
  for (const [lb, val, wiki] of [
    ["Company Name", info.companyName], ["Industry", info.industry, wv?.industry],
    ["Description", info.businessDescription], ["Target Audience", info.targetAudience],
    ["Headquarters", info.headquarters, wv?.headquarters], ["Years in Business", info.yearsInBusiness],
    ["Brand Personality", info.brandPersonality], ["Website Quality", info.websiteQuality],
    ["Overall Professionalism", info.overallProfessionalism],
  ] as [string, string | null, boolean?][]) {
    if (!val) continue; y = ir(d, lb, val, y, wiki)
  }
  y += 6

  // ── 10. Products & Services ──
  if (info.productsOrServices?.length) {
    y = sh(d, "Offerings", "Products & Services", y); y += 4; let cx = LM
    for (const p of info.productsOrServices) { cx = ch(d, p, cx, y, BCHIP, BDCH, P); if (cx > PW - LM - 30) { cx = LM; y += 13 } }
    y += 8
  }

  // ── 11. Brand Mission & Vision ──
  if (info.brandMission || info.brandVision) {
    y = np(d, y, 30); y = sh(d, "Identity", "Brand Mission & Vision", y)
    const h2 = (y as number)
    const c2 = (CW - 8) / 2
    d.setDrawColor(CBDD[0], CBDD[1], CBDD[2]); d.setFillColor(CBD[0], CBD[1], CBD[2]); d.setLineWidth(0.15)
    const mh = Math.max(
      lnCt(d, info.brandMission || "\u2014", c2 - 14) * LH + 18,
      lnCt(d, info.brandVision || "\u2014", c2 - 14) * LH + 18, 24
    )
    d.roundedRect(LM, h2, c2, mh, 6, 6, "FD"); d.roundedRect(LM + c2 + 8, h2, c2, mh, 6, 6, "FD")
    d.setFontSize(8); d.setFont("helvetica", "bold"); d.setTextColor(CLBL[0], CLBL[1], CLBL[2])
    d.text("MISSION", LM + 8, h2 + 6); d.text("VISION", LM + c2 + 16, h2 + 6)
    d.setFontSize(9); d.setFont("helvetica", "normal"); d.setTextColor(TD[0], TD[1], TD[2])
    let my = h2 + 10; my = bt(d, info.brandMission || "\u2014", LM + 8, my, c2 - 16)
    let vy = h2 + 10; vy = bt(d, info.brandVision || "\u2014", LM + c2 + 16, vy, c2 - 16)
    y = h2 + mh + 10
  }

  // ── 12. Core Values ──
  if (info.coreValues?.length) {
    y = sh(d, "Identity", "Core Values", y)
    for (const v of info.coreValues) {
      y = np(d, y, 8)
      d.setFillColor(P[0], P[1], P[2]); d.circle(LM + 4, y + 1.5, 2, "F")
      d.setFontSize(9.5); d.setFont("helvetica", "normal"); d.setTextColor(TD[0], TD[1], TD[2])
      y = bt(d, v, LM + 12, y, CW - 16); y += 2
    }
    y += 6
  }

  // ── 13. Brand Personality ──
  y += 6
  if (info.brandPersonality) {
    y = sh(d, "Identity", "Brand Personality", y)
    d.setFontSize(9.5); d.setFont("helvetica", "normal"); d.setTextColor(TMU[0], TMU[1], TMU[2])
    y = bt(d, info.brandPersonality, LM, y, CW); y += 6
  }

  // ── 14. USP Box ──
  if (info.usp) {
    y = np(d, y, 16); const ulc = lnCt(d, info.usp, CW - 20); const uh = ulc * LH + 14
    d.setFillColor(BCHIP[0], BCHIP[1], BCHIP[2]); d.setDrawColor(BDCH[0], BDCH[1], BDCH[2]); d.setLineWidth(0.15)
    d.roundedRect(LM, y, CW, uh, 5, 5, "FD")
    d.setFontSize(8); d.setFont("helvetica", "bold"); d.setTextColor(P[0], P[1], P[2])
    d.text("UNIQUE SELLING PROPOSITION", LM + 10, y + 5)
    d.setFontSize(9.5); d.setFont("helvetica", "normal"); d.setTextColor(TD[0], TD[1], TD[2])
    y = bt(d, info.usp, LM + 10, y + 11, CW - 20); y += 6
  }

  // ── 15. Main Competitors ──
  if (info.mainCompetitors?.length) {
    y = sh(d, "Landscape", "Main Competitors", y); y += 4; let cx = LM
    for (const c of info.mainCompetitors) { cx = ch(d, c, cx, y, BLC, BDLC, CY); if (cx > PW - LM - 30) { cx = LM; y += 13 } }
    y += 8
  }

  // ── 16. Website & Professionalism ──
  if (info.websiteQuality || info.overallProfessionalism) {
    y = sh(d, "Assessment", "Website & Professionalism", y)
    if (info.websiteQuality) y = ablock(d, "Website Quality", info.websiteQuality, y, P)
    if (info.overallProfessionalism) y = ablock(d, "Overall Professionalism", info.overallProfessionalism, y, CY)
  }

  // ── 17. Primary CTA ──
  y += 6
  if (info.primaryCallToAction) {
    y = sh(d, "Conversion", "Primary Call to Action", y)
    y = np(d, y, 12)
    const bw = d.getTextWidth(info.primaryCallToAction) + 14
    d.setFillColor(P[0], P[1], P[2]); d.roundedRect(LM, y, bw, 8, 5, 5, "F")
    d.setFillColor(CY[0], CY[1], CY[2]); d.roundedRect(LM + bw * 0.6, y, bw * 0.4, 8, 5, 5, "F")
    d.setFontSize(9); d.setFont("helvetica", "bold"); d.setTextColor(255, 255, 255)
    d.text(info.primaryCallToAction, LM + bw / 2, y + 5.5, { align: "center" })
    y += 6
  }

  // ── 18. Company Details ──
  const dt = info.companyDetails
  if (dt) {
    y = sh(d, "Data Points", "Company Details", y)
    for (const [lb, val, wiki] of [
      ["Founder", dt.founderName, wv?.founderName], ["Founder Background", dt.founderBackground],
      ["CEO", dt.ceoName, wv?.ceoName], ["Employee Count", dt.employeeCount, wv?.employeeCount],
      ["Founded Year", dt.foundedYear, wv?.foundedYear], ["Funding Stage", dt.fundingStage],
      ["Estimated Revenue", dt.estimatedRevenue, wv?.revenue],
    ] as [string, string | null, boolean?][]) { if (!val) continue; y = ir(d, lb, val, y, wiki) }
    if (dt.leadershipTeam?.length) {
      y = sh(d, "Team", "Leadership", y)
      for (const m of dt.leadershipTeam) {
        y = np(d, y, 6)
        d.setFontSize(9); d.setFont("helvetica", "bold"); d.setTextColor(TD[0], TD[1], TD[2])
        d.text(`\u2022 ${m.name} \u2014 ${m.title}`, LM + 4, y); y += 5
        if (m.bio) { d.setFontSize(7.5); d.setFont("helvetica", "normal"); d.setTextColor(TMU[0], TMU[1], TMU[2]); y = bt(d, m.bio, LM + 10, y, CW - 16); y += 1 }
        y += 3
      }
    }
    if (dt.investors?.length) {
      y = sh(d, "Funding", "Investors", y); let cx = LM
      for (const inv of dt.investors) { cx = ch(d, inv, cx, y, BCHIP, BDCH, P); if (cx > PW - LM - 30) { cx = LM; y += 13 } }
      y += 6
    }
  }

  // ── 19. Digital Footprint ──
  y += 6
  const df = info.digitalFootprint
  if (df) {
    y = sh(d, "Digital", "Digital Footprint", y)
    if (df.searchVisibility) {
      y = np(d, y, 8); d.setFontSize(9); d.setFont("helvetica", "bold"); d.setTextColor(TD[0], TD[1], TD[2])
      d.text("Search Visibility", LM, y); y += 3
      d.setFont("helvetica", "normal"); d.setTextColor(TMU[0], TMU[1], TMU[2])
      y = bt(d, df.searchVisibility, LM + 3, y, CW - 6); y += 4
    }
    if (df.socialMediaPresence?.length) {
      y = np(d, y, 8); d.setFontSize(9); d.setFont("helvetica", "bold"); d.setTextColor(TD[0], TD[1], TD[2])
      d.text("Social Media Presence", LM, y); y += 4
      for (const s of df.socialMediaPresence) {
        y = np(d, y, 8); d.setFontSize(9); d.setFont("helvetica", "normal"); d.setTextColor(TD[0], TD[1], TD[2])
        const ff = s.followerCount ? ` (${s.followerCount.toLocaleString()} followers)` : ""
        d.text(`${s.platform}: ${s.handleOrUrl}${ff}`, LM + 4, y); y += 4
        if (s.activityLevel) { d.setFontSize(7); d.setTextColor(TMU[0], TMU[1], TMU[2]); d.text(`Activity: ${s.activityLevel}`, LM + 8, y); y += 3 }
      }
    }
    if (df.customerReviews?.length) {
      y = np(d, y, 8); d.setFontSize(9); d.setFont("helvetica", "bold"); d.setTextColor(TD[0], TD[1], TD[2])
      d.text("Customer Reviews", LM, y); y += 4
      for (const rv of df.customerReviews) {
        y = np(d, y, 8); d.setFontSize(8.5); d.setFont("helvetica", "normal"); d.setTextColor(TD[0], TD[1], TD[2])
        const rt = rv.rating ? `Rating: ${rv.rating}/5` : ""; const ct = rv.reviewCountApprox ? ` (${rv.reviewCountApprox.toLocaleString()} reviews)` : ""
        d.text([rv.source, rt, ct].filter(Boolean).join(" \u2022 "), LM + 4, y); y += 4
        if (rv.sentimentSummary) { d.setFontSize(7); d.setTextColor(TMU[0], TMU[1], TMU[2]); y = bt(d, rv.sentimentSummary, LM + 8, y, CW - 16); y += 2 }
      }
    }
    if (df.confirmedCompetitors?.length) {
      y = np(d, y, 8); d.setFontSize(9); d.setFont("helvetica", "bold"); d.setTextColor(TD[0], TD[1], TD[2])
      d.text("Confirmed Competitors", LM, y); y += 3; let cx = LM
      for (const c of df.confirmedCompetitors) { cx = ch(d, c, cx, y, BLC, BDLC, CY); if (cx > PW - LM - 30) { cx = LM; y += 13 } }
      y += 6
    }
    if (df.newsOrPressMentions?.length) {
      y = np(d, y, 8); d.setFontSize(9); d.setFont("helvetica", "bold"); d.setTextColor(TD[0], TD[1], TD[2])
      d.text("News / Press Mentions", LM, y); y += 4
      for (const n of df.newsOrPressMentions) {
        y = np(d, y, 14)
        d.setDrawColor(BDLP[0], BDLP[1], BDLP[2]); d.setFillColor(CBD[0], CBD[1], CBD[2])
        d.roundedRect(LM, y - 3, CW, 1, 3, 3, "FD")
        d.setFontSize(9); d.setFont("helvetica", "bold"); d.setTextColor(TD[0], TD[1], TD[2])
        d.text(n.source || "Source", LM + 4, y)
        if (n.date) { d.setFontSize(6.5); d.setFont("helvetica", "normal"); d.setTextColor(TMU[0], TMU[1], TMU[2]); d.text(n.date, LM + 4, y + 3.5) }
        y += 2
        if (n.summary) { d.setFontSize(7.5); d.setFont("helvetica", "normal"); d.setTextColor(TMU[0], TMU[1], TMU[2]); y = bt(d, n.summary, LM + 4, y + 2, CW - 8); y += 3 }
      }
    }
  }

  // ═══════════════════════════════════════
  // POST-PROCESS: Headers & Footers
  // ═══════════════════════════════════════
  _tot = d.getNumberOfPages()
  for (let i = 2; i <= _tot; i++) {
    d.setPage(i)
    d.setFontSize(8); d.setFont("helvetica", "bold"); d.setTextColor(HDR[0], HDR[1], HDR[2])
    d.text("BRAND VALUE REPORT", LM, 10)
    d.setFont("helvetica", "normal"); d.setTextColor(TMU[0], TMU[1], TMU[2])
    d.text(_co, PW - LM, 10, { align: "right" })
    d.setDrawColor(BDLP[0], BDLP[1], BDLP[2]); d.setLineWidth(0.2)
    d.line(LM, 12, PW - LM, 12)
    d.setFontSize(7.5); d.setFont("helvetica", "normal"); d.setTextColor(TLIT[0], TLIT[1], TLIT[2])
    d.text(`Generated ${ds}`, LM, PH - 8)
    d.text(`Page ${i} of ${_tot}`, PW - LM, PH - 8, { align: "right" })
  }

  return d
}
