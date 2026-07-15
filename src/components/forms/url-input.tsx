"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Link, ArrowRight } from "lucide-react"

export default function UrlInput() {
  const [url, setUrl] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  function validateUrl(value: string): boolean {
    if (!value.trim()) {
      setError("Please enter a website URL")
      return false
    }
    try {
      const u = value.startsWith("http") ? value : `https://${value}`
      new URL(u)
      setError("")
      return true
    } catch {
      setError("Please enter a valid URL")
      return false
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (validateUrl(url)) {
      const encoded = encodeURIComponent(url.startsWith("http") ? url : `https://${url}`)
      router.push(`/questionnaire?url=${encoded}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Link className={`w-5 h-5 transition-colors ${error ? "text-red-400" : "text-gray-400 group-focus-within:text-purple-500"}`} />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError("") }}
            placeholder="Enter company website URL..."
            className={`w-full pl-12 pr-4 py-4 text-base border-2 rounded-xl outline-none transition-all bg-white dark:bg-gray-800 ${
              error
                ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800"
            }`}
          />
        </div>
        <button
          type="submit"
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-cyan-600 transition-all duration-200 shadow-lg shadow-purple-200 dark:shadow-purple-900/30 hover:shadow-xl whitespace-nowrap flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          Start Evaluation
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      {error && (
        <div className="flex items-center gap-2 mt-2 ml-1">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}
    </form>
  )
}
