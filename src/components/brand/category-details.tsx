"use client"

import { useState, type ReactNode } from "react"
import { CategoryScore } from "@/types/brand"
import { categoryLabelsWithIcons } from "@/lib/constants"
import { Target, Globe, Shield, Search, FileText, Smartphone, Star, Zap, Settings2, ChevronDown } from "lucide-react"

const iconMap: Record<string, ReactNode> = {
  brandIdentity: <Target className="w-5 h-5" />,
  websiteExperience: <Globe className="w-5 h-5" />,
  trustCredibility: <Shield className="w-5 h-5" />,
  seoVisibility: <Search className="w-5 h-5" />,
  contentQuality: <FileText className="w-5 h-5" />,
  socialMediaPresence: <Smartphone className="w-5 h-5" />,
  customerReputation: <Star className="w-5 h-5" />,
  performanceAccessibility: <Zap className="w-5 h-5" />,
  technicalQuality: <Settings2 className="w-5 h-5" />,
}

function getScoreColor(score: number): string {
  if (score >= 8) return "text-emerald-600 dark:text-emerald-400"
  if (score >= 6) return "text-blue-600 dark:text-blue-400"
  if (score >= 4) return "text-amber-600 dark:text-amber-400"
  return "text-red-600 dark:text-red-400"
}

function getScoreBarColor(score: number): string {
  if (score >= 8) return "bg-emerald-500"
  if (score >= 6) return "bg-blue-500"
  if (score >= 4) return "bg-amber-500"
  return "bg-red-500"
}

interface Props {
  categories: Record<string, CategoryScore>
}

export default function CategoryDetails({ categories }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const entries = Object.entries(categories)

  return (
    <div className="space-y-3">
      {entries.map(([key, cat], i) => {
        const info = categoryLabelsWithIcons[key] || { label: key, icon: "📋" }
        const isOpen = openIndex === i

        return (
          <div
            key={key}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden transition-all"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full px-5 py-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                cat.score >= 7 ? "bg-emerald-100 text-emerald-600" :
                cat.score >= 5 ? "bg-blue-100 text-blue-600" :
                cat.score >= 3 ? "bg-amber-100 text-amber-600" :
                "bg-red-100 text-red-600"
              }`}>
                {iconMap[key] || <Target className="w-5 h-5" />}
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-gray-100">{info.label}</span>
                  <span className={`text-lg font-bold ${getScoreColor(cat.score)}`}>
                    {cat.score}/10
                  </span>
                </div>
                <div className="mt-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${getScoreBarColor(cat.score)}`}
                    style={{ width: `${cat.score * 10}%` }}
                  />
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && (
              <div className="px-5 pb-4 pt-0 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-50 dark:border-gray-700">
                {cat.reasoning || "No detailed reasoning provided."}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
