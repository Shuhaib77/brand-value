import { Card, CardContent } from "@/components/ui/card"
import { FileText, Shield } from "lucide-react"

interface Props {
  summary: string
  verdict: string
  confidenceNote: string | null
}

export default function ExecutiveSummary({ summary, verdict, confidenceNote }: Props) {
  return (
    <div className="space-y-4">
      <Card variant="glass">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-purple-700 uppercase tracking-wider">Executive Summary</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{summary}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Final Verdict</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{verdict}</p>
        </CardContent>
      </Card>

      {confidenceNote && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800/30">
          <CardContent className="p-4">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <span className="font-semibold">Note: </span>
              {confidenceNote}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
