import { gradeMap, computeGrade } from "@/lib/constants"

interface Props {
  score: number
  grade: string
}

export default function BrandScore({ score, grade: _grade }: Props) {
  const grade = computeGrade(score)
  const color = gradeMap[grade === "A+" ? "A_PLUS" : grade]?.color || "from-gray-500 to-gray-600"
  const bg = gradeMap[grade === "A+" ? "A_PLUS" : grade]?.bg || "bg-gray-50 border-gray-200 text-gray-700"

  function circlePath(cx: number, cy: number, r: number, percent: number) {
    const circumference = 2 * Math.PI * r
    const offset = circumference * (1 - percent / 100)
    return { circumference, offset }
  }

  const { circumference, offset } = circlePath(120, 120, 100, score)

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-60 h-60">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 240 240">
          <circle
            cx="120" cy="120" r="100"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="12"
          />
          <circle
            cx="120" cy="120" r="100"
            fill="none"
            stroke={`url(#scoreGradient)`}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold gradient-text">{score}</span>
          <span className="text-sm text-gray-400 mt-1">out of 100</span>
        </div>
      </div>
      <span className={`mt-4 px-5 py-2 rounded-full border text-sm font-semibold ${bg}`}>
        {grade}
      </span>
    </div>
  )
}
