"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Send, SkipForward, Sparkles, Search, BarChart3, Loader2 } from "lucide-react"
import { defaultQuestions } from "@/lib/questionnaire"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Props {
  url: string
}

const CACHE_PREFIX = "brandCache:"
const CACHE_TTL = 24 * 60 * 60 * 1000
const CACHE_VERSION = 2

function cacheKey(url: string): string {
  return `${CACHE_PREFIX}v${CACHE_VERSION}-${url.trim().toLowerCase()}`
}

function getCachedResult(url: string): unknown {
  try {
    const key = cacheKey(url)
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const { data, timestamp } = JSON.parse(raw)
    if (Date.now() - timestamp > CACHE_TTL) {
      localStorage.removeItem(key)
      return null
    }
    return data
  } catch {
    return null
  }
}

function setCachedResult(url: string, data: unknown): void {
  try {
    const key = cacheKey(url)
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }))
  } catch {
    // localStorage full or unavailable
  }
}

export default function QuestionnaireForm({ url }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  function setAnswer(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  async function handleSubmit(skip: boolean) {
    setLoading(true)
    setError("")

    try {
      const cached = getCachedResult(url)
      if (cached) {
        sessionStorage.setItem("brandResult", JSON.stringify(cached))
        router.push("/results")
        return
      }

      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, answers: skip ? {} : answers }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Evaluation failed")
      }

      setCachedResult(url, data)
      sessionStorage.setItem("brandResult", JSON.stringify(data))
      router.push("/results")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong"
      setError(message)
      setLoading(false)
    }
  }

  const answered = Object.keys(answers).filter((k) => answers[k].trim()).length

  return (
    <div>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">
            {answered} of {defaultQuestions.length} answered
          </span>
          <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
            {Math.round((answered / defaultQuestions.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-500 to-cyan-400 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(answered / defaultQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {defaultQuestions.map((q, i) => (
          <Card key={q.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <span className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                {q.category}
              </span>
              <p className="text-gray-900 dark:text-gray-100 font-medium mb-3">
                <span className="text-purple-500 font-bold mr-1">{i + 1}.</span>
                {q.question}
              </p>
              <textarea
                value={answers[q.id] || ""}
                onChange={(e) => setAnswer(q.id, e.target.value)}
                placeholder={q.placeholder}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 outline-none transition-all resize-none text-sm dark:text-gray-200"
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <Button
          onClick={() => handleSubmit(false)}
          disabled={loading}
          variant="primary"
          size="lg"
          className="flex-1"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing Brand...
            </span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit & Get Brand Score
            </>
          )}
        </Button>
        <Button
          onClick={() => handleSubmit(true)}
          disabled={loading}
          variant="outline"
          size="lg"
        >
          <SkipForward className="w-4 h-4" />
          Skip Questionnaire
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <Card variant="glass" className="mt-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              {[
                { icon: Search, text: "Scraping website content...", color: "text-purple-600" },
                { icon: Sparkles, text: "Searching the web for brand presence...", color: "text-cyan-600" },
                { icon: BarChart3, text: "AI is evaluating your brand...", color: "text-purple-600" },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse-dot" style={{ animationDelay: `${i * 0.2}s` }} />
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse-dot" style={{ animationDelay: `${i * 0.2 + 0.2}s` }} />
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse-dot" style={{ animationDelay: `${i * 0.2 + 0.4}s` }} />
                  </div>
                  <step.icon className={`w-4 h-4 ${step.color}`} />
                  <span className={`text-sm font-medium ${step.color}`}>{step.text}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
