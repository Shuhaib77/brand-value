"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"

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
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError("") }}
            placeholder="Enter company website URL..."
            className="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all bg-white"
          />
        </div>
        <button
          type="submit"
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-cyan-600 transition-all shadow-lg shadow-purple-200 hover:shadow-xl whitespace-nowrap"
        >
          Start Evaluation
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-2 ml-1">{error}</p>}
    </form>
  )
}
