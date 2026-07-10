"use client"

import { useState } from "react"
import { CategoryScore } from "@/types/brand"
import { categoryLabelsWithIcons } from "@/lib/constants"

interface Props {
  categories: Record<string, CategoryScore>
}

function getScoreColor(score: number): string {
  if (score >= 8) return "text-green-600"
  if (score >= 6) return "text-blue-600"
  if (score >= 4) return "text-yellow-600"
  return "text-red-600"
}

function getScoreBarColor(score: number): string {
  if (score >= 8) return "bg-green-500"
  if (score >= 6) return "bg-blue-500"
  if (score >= 4) return "bg-yellow-500"
  return "bg-red-500"
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
            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-all"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
            >
              <span className="text-xl">{info.icon}</span>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{info.label}</span>
                  <span className={`text-lg font-bold ${getScoreColor(cat.score)}`}>
                    {cat.score}/10
                  </span>
                </div>
                <div className="mt-1.5 w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${getScoreBarColor(cat.score)}`}
                    style={{ width: `${cat.score * 10}%` }}
                  />
                </div>
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isOpen && (
              <div className="px-5 pb-4 pt-0 text-sm text-gray-600 leading-relaxed border-t border-gray-50">
                {cat.reasoning || "No detailed reasoning provided."}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
