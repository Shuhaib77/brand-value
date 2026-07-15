"use client"

import { cn } from "@/lib/utils"
import { type ReactNode } from "react"

interface Tab {
  key: string
  label: string
  icon?: ReactNode
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (key: string) => void
  className?: string
}

export default function Tabs({ tabs, activeTab, onTabChange, className }: TabsProps) {
  return (
    <div className={cn("flex gap-1 overflow-x-auto pb-2", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={cn(
              "relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200",
              isActive
                ? "text-purple-700"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            )}
          >
            {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
            {tab.label}
            {isActive && (
              <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full" />
            )}
          </button>
        )
      })}
    </div>
  )
}
