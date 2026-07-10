interface Props {
  strengths: string[]
  weaknesses: string[]
  risks: string[]
  opportunities: string[]
}

export default function StrengthsWeaknesses({ strengths, weaknesses, risks, opportunities }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-green-50 rounded-xl p-5 border border-green-100">
        <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center text-xs font-bold text-green-700">S</span>
          Strengths
        </h3>
        <ul className="space-y-2">
          {strengths.map((s, i) => (
            <li key={i} className="text-sm text-green-900 flex gap-2">
              <span className="text-green-500 mt-0.5">+</span>
              {s}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-red-50 rounded-xl p-5 border border-red-100">
        <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-red-200 flex items-center justify-center text-xs font-bold text-red-700">W</span>
          Weaknesses
        </h3>
        <ul className="space-y-2">
          {weaknesses.map((w, i) => (
            <li key={i} className="text-sm text-red-900 flex gap-2">
              <span className="text-red-500 mt-0.5">-</span>
              {w}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-orange-50 rounded-xl p-5 border border-orange-100">
        <h3 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-orange-200 flex items-center justify-center text-xs font-bold text-orange-700">R</span>
          Risks
        </h3>
        <ul className="space-y-2">
          {risks.map((r, i) => (
            <li key={i} className="text-sm text-orange-900 flex gap-2">
              <span className="text-orange-500 mt-0.5">!</span>
              {r}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-xs font-bold text-blue-700">O</span>
          Opportunities
        </h3>
        <ul className="space-y-2">
          {opportunities.map((o, i) => (
            <li key={i} className="text-sm text-blue-900 flex gap-2">
              <span className="text-blue-500 mt-0.5">&rarr;</span>
              {o}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
