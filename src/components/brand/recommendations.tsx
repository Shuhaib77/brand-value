import { Lightbulb } from "lucide-react"

interface Props {
  recommendations: string[]
}

export default function Recommendations({ recommendations }: Props) {
  return (
    <div className="space-y-3">
      {recommendations.map((rec, i) => (
        <div
          key={i}
          className="flex items-start gap-4 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
        >
          <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-400 text-white flex items-center justify-center text-sm font-bold shadow-sm">
            {i + 1}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-gray-700 dark:text-gray-300 pt-1">{rec}</p>
          </div>
          <Lightbulb className="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0 mt-2" />
        </div>
      ))}
    </div>
  )
}
