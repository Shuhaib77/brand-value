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
    <div className="w-full aspect-square max-w-lg mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="#e5e7eb" />
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
            }}
          />
          <Radar
            name="Brand Score"
            dataKey="score"
            stroke="#7c3aed"
            fill="#7c3aed"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
