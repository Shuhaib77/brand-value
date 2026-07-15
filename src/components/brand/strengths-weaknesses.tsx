import { ThumbsUp, ThumbsDown, AlertTriangle, TrendingUp, Plus, Minus, AlertCircle, ArrowRight } from "lucide-react"

interface Props {
  strengths: string[]
  weaknesses: string[]
  risks: string[]
  opportunities: string[]
}

const quadrants = [
  {
    key: "strengths",
    icon: ThumbsUp,
    label: "Strengths",
    bg: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/30",
    textColor: "text-emerald-800 dark:text-emerald-200",
    iconBg: "bg-emerald-200 dark:bg-emerald-700",
    iconColor: "text-emerald-700 dark:text-emerald-300",
    bulletIcon: Plus,
    bulletColor: "text-emerald-500",
    bulletTextColor: "text-emerald-900 dark:text-emerald-100",
  },
  {
    key: "weaknesses",
    icon: ThumbsDown,
    label: "Weaknesses",
    bg: "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/30",
    textColor: "text-red-800 dark:text-red-200",
    iconBg: "bg-red-200 dark:bg-red-700",
    iconColor: "text-red-700 dark:text-red-300",
    bulletIcon: Minus,
    bulletColor: "text-red-500",
    bulletTextColor: "text-red-900 dark:text-red-100",
  },
  {
    key: "risks",
    icon: AlertTriangle,
    label: "Risks",
    bg: "bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800/30",
    textColor: "text-orange-800 dark:text-orange-200",
    iconBg: "bg-orange-200 dark:bg-orange-700",
    iconColor: "text-orange-700 dark:text-orange-300",
    bulletIcon: AlertCircle,
    bulletColor: "text-orange-500",
    bulletTextColor: "text-orange-900 dark:text-orange-100",
  },
  {
    key: "opportunities",
    icon: TrendingUp,
    label: "Opportunities",
    bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/30",
    textColor: "text-blue-800 dark:text-blue-200",
    iconBg: "bg-blue-200 dark:bg-blue-700",
    iconColor: "text-blue-700 dark:text-blue-300",
    bulletIcon: ArrowRight,
    bulletColor: "text-blue-500",
    bulletTextColor: "text-blue-900 dark:text-blue-100",
  },
]

export default function StrengthsWeaknesses({ strengths, weaknesses, risks, opportunities }: Props) {
  const data = { strengths, weaknesses, risks, opportunities }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {quadrants.map((q) => {
        const Icon = q.icon
        const BulletIcon = q.bulletIcon
        const items = data[q.key as keyof typeof data]
        return (
          <div key={q.key} className={`rounded-xl p-5 border ${q.bg}`}>
            <h3 className={`font-semibold ${q.textColor} mb-3 flex items-center gap-2`}>
              <span className={`w-7 h-7 rounded-full ${q.iconBg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${q.iconColor}`} />
              </span>
              {q.label}
            </h3>
            <ul className="space-y-2">
              {items.map((item, i) => (
                <li key={i} className={`text-sm ${q.bulletTextColor} flex gap-2`}>
                  <BulletIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${q.bulletColor}`} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
