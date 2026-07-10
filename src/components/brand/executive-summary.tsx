interface Props {
  summary: string
  verdict: string
  confidenceNote: string | null
}

export default function ExecutiveSummary({ summary, verdict, confidenceNote }: Props) {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-purple-50 to-cyan-50 rounded-2xl p-6 border border-purple-100">
        <h3 className="text-sm font-semibold text-purple-700 uppercase tracking-wider mb-3">
          Executive Summary
        </h3>
        <p className="text-gray-800 leading-relaxed">{summary}</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Final Verdict
        </h3>
        <p className="text-gray-800 leading-relaxed">{verdict}</p>
      </div>

      {confidenceNote && (
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
          <p className="text-sm text-yellow-800">
            <span className="font-semibold">Note: </span>
            {confidenceNote}
          </p>
        </div>
      )}
    </div>
  )
}
