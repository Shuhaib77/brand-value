"use client"

import { useState } from "react"
import { Zap, Rocket, Target } from "lucide-react"

interface Props {
  plan30Day: string[]
  plan90Day: string[]
  plan1Year: string[]
}

type Tab = "30" | "90" | "1y"

const tabConfig: { key: Tab; label: string; icon: typeof Zap }[] = [
  { key: "30", label: "30 Days", icon: Zap },
  { key: "90", label: "90 Days", icon: Rocket },
  { key: "1y", label: "1 Year Strategy", icon: Target },
]

export default function ActionPlans({ plan30Day, plan90Day, plan1Year }: Props) {
  const [tab, setTab] = useState<Tab>("30")
  const activePlan = tab === "30" ? plan30Day : tab === "90" ? plan90Day : plan1Year

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {tabConfig.map((t) => {
          const Icon = t.icon
          const isActive = tab === t.key
          const count = (tab === t.key ? activePlan : tab === "30" ? plan30Day : tab === "90" ? plan90Day : plan1Year).length
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5 ${
                isActive
                  ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg"
                  : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-400"}`} />
              {t.label}
              <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                isActive ? "bg-white/20" : "bg-gray-100 dark:bg-gray-700"
              }`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      <div className="space-y-3">
        {activePlan.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-3 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-700 transition-colors"
          >
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-purple-100 to-cyan-100 dark:from-purple-800 dark:to-cyan-800 flex items-center justify-center text-xs font-medium text-purple-700 dark:text-purple-300">
              {i + 1}
            </span>
            <p className="text-sm text-gray-700 dark:text-gray-300 pt-0.5">{item}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
