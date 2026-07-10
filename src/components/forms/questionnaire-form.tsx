"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { defaultQuestions } from "@/lib/questionnaire"

interface Props {
  url: string
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
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, answers: skip ? {} : answers }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Evaluation failed")
      }

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
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">
            {answered} of {defaultQuestions.length} answered
          </span>
          <span className="text-sm font-medium text-purple-600">
            {Math.round((answered / defaultQuestions.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-cyan-400 h-2 rounded-full transition-all"
            style={{ width: `${(answered / defaultQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-6">
        {defaultQuestions.map((q, i) => (
          <div key={q.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <label className="block text-sm font-medium text-gray-500 mb-1">
              {q.category}
            </label>
            <p className="text-gray-900 font-medium mb-2">
              {i + 1}. {q.question}
            </p>
            <textarea
              value={answers[q.id] || ""}
              onChange={(e) => setAnswer(q.id, e.target.value)}
              placeholder={q.placeholder}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all resize-none text-sm"
            />
          </div>
        ))}
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => handleSubmit(false)}
          disabled={loading}
          className="flex-1 px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-cyan-600 transition-all shadow-lg disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analyzing Brand...
            </span>
          ) : (
            "Submit & Get Brand Score"
          )}
        </button>
        <button
          onClick={() => handleSubmit(true)}
          disabled={loading}
          className="px-6 py-4 bg-white border-2 border-gray-200 text-gray-600 font-medium rounded-xl hover:border-gray-300 transition-all disabled:opacity-50"
        >
          Skip Questionnaire
        </button>
      </div>

      {loading && (
        <div className="mt-8 p-6 bg-purple-50 rounded-2xl border border-purple-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse-dot" />
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse-dot" />
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse-dot" />
            </div>
            <span className="text-sm font-medium text-purple-700">
              Scraping website content...
            </span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse-dot" />
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse-dot" />
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse-dot" />
            </div>
            <span className="text-sm font-medium text-cyan-700">
              Searching the web for brand presence...
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse-dot" />
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse-dot" />
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse-dot" />
            </div>
            <span className="text-sm font-medium text-purple-700">
              AI is evaluating your brand...
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
