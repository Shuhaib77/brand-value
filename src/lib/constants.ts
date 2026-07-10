export const gradeMap: Record<string, { min: number; color: string; bg: string }> = {
  A_PLUS: { min: 90, color: "from-emerald-500 to-green-600", bg: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  A: { min: 80, color: "from-green-500 to-emerald-500", bg: "bg-green-50 border-green-200 text-green-700" },
  B: { min: 70, color: "from-blue-500 to-cyan-500", bg: "bg-blue-50 border-blue-200 text-blue-700" },
  C: { min: 60, color: "from-yellow-500 to-orange-500", bg: "bg-yellow-50 border-yellow-200 text-yellow-700" },
  D: { min: 40, color: "from-orange-500 to-red-500", bg: "bg-orange-50 border-orange-200 text-orange-700" },
  F: { min: 0, color: "from-red-500 to-rose-600", bg: "bg-red-50 border-red-200 text-red-700" },
}

export function computeGrade(score100: number): string {
  const sorted = Object.entries(gradeMap).sort((a, b) => b[1].min - a[1].min)
  for (const [grade, cfg] of sorted) {
    if (score100 >= cfg.min) return grade === "A_PLUS" ? "A+" : grade
  }
  return "F"
}

export function computeGradeLabel(grade: string): string {
  const labels: Record<string, string> = {
    A_PLUS: "Exceptional",
    A: "Strong",
    B: "Good",
    C: "Average",
    D: "Weak",
    F: "Poor",
  }
  return labels[grade] || grade
}

export const categoryWeights: Record<string, number> = {
  brandIdentity: 14,
  websiteExperience: 14,
  trustCredibility: 14,
  seoVisibility: 14,
  contentQuality: 9,
  socialMediaPresence: 9,
  customerReputation: 9,
  performanceAccessibility: 9,
  technicalQuality: 9,
}

export const TOTAL_WEIGHT = Object.values(categoryWeights).reduce((a, b) => a + b, 0)

export function computeWeightedScore(categoryScores: Record<string, { score: number }>): number {
  let total = 0
  for (const [key, cat] of Object.entries(categoryScores)) {
    const weight = categoryWeights[key] || 10
    total += (cat.score / 10) * weight
  }
  return Math.round((total / TOTAL_WEIGHT) * 100)
}

export const categoryLabels: Record<string, string> = {
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

export const categoryLabelsWithIcons: Record<string, { label: string; icon: string }> = {
  brandIdentity: { label: "Brand Identity", icon: "🎯" },
  websiteExperience: { label: "Website Experience", icon: "🌐" },
  trustCredibility: { label: "Trust & Credibility", icon: "🛡️" },
  seoVisibility: { label: "SEO & Visibility", icon: "🔍" },
  contentQuality: { label: "Content Quality", icon: "📝" },
  socialMediaPresence: { label: "Social Media", icon: "📱" },
  customerReputation: { label: "Customer Reputation", icon: "⭐" },
  performanceAccessibility: { label: "Performance & Accessibility", icon: "⚡" },
  technicalQuality: { label: "Technical Quality", icon: "⚙️" },
}
