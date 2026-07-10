"use client"

import { useState } from "react"

interface Props {
  plan30Day: string[]
  plan90Day: string[]
  plan1Year: string[]
}

type Tab = "30" | "90" | "1y"

export default function ActionPlans({ plan30Day, plan90Day, plan1Year }: Props) {
  const [tab, setTab] = useState<Tab>("30")

  const tabs: { key: Tab; label: string; count: number; icon: string }[] = [
    { key: "30", label: "30 Days", count: plan30Day.length, icon: "⚡" },
    { key: "90", label: "90 Days", count: plan90Day.length, icon: "🚀" },
    { key: "1y", label: "1 Year Strategy", count: plan1Year.length, icon: "🎯" },
  ]

  const activePlan = tab === "30" ? plan30Day : tab === "90" ? plan90Day : plan1Year

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              tab === t.key
                ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg"
                : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            <span className="mr-1">{t.icon}</span>
            {t.label}
            <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
              tab === t.key ? "bg-white/20" : "bg-gray-100"
            }`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {activePlan.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-100"
          >
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500">
              {i + 1}
            </span>
            <p className="text-sm text-gray-700 pt-0.5">{item}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
