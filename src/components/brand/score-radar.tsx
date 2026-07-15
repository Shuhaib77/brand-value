"use client"

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { CategoryScore } from "@/types/brand"
import { categoryLabels } from "@/lib/constants"

interface Props {
  categories: Record<string, CategoryScore>
}

export default function ScoreRadar({ categories }: Props) {
  const data = Object.entries(categories).map(([key, val]) => ({
    category: categoryLabels[key] || key,
    score: val.score,
    fullMark: 10,
  }))

  return (
    <div className="rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-white/20 dark:border-gray-700/30 shadow-lg p-4">
      <div className="w-full aspect-square max-w-lg mx-auto">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="#e5e7eb" strokeOpacity={0.5} />
            <PolarAngleAxis
              dataKey="category"
              tick={{ fontSize: 11, fill: "#6b7280" }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 10]}
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              tickCount={6}
            />
            <Tooltip
              formatter={(value) => [`${value}/10`, "Score"]}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                background: "rgba(255,255,255,0.95)",
              }}
            />
            <defs>
              <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.15} />
              </linearGradient>
            </defs>
            <Radar
              name="Brand Score"
              dataKey="score"
              stroke="#7c3aed"
              fill="url(#radarGradient)"
              strokeWidth={2}
              dot={{ r: 3, fill: "#7c3aed", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#7c3aed" }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
