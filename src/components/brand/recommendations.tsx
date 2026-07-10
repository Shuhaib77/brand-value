interface Props {
  recommendations: string[]
}

export default function Recommendations({ recommendations }: Props) {
  return (
    <div className="space-y-3">
      {recommendations.map((rec, i) => (
        <div
          key={i}
          className="flex items-start gap-4 bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-400 text-white flex items-center justify-center text-sm font-bold">
            {i + 1}
          </span>
          <p className="text-gray-700 pt-1">{rec}</p>
        </div>
      ))}
    </div>
  )
}
