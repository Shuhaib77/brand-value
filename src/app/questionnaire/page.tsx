"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import QuestionnaireForm from "@/components/forms/questionnaire-form"

function QuestionnaireContent() {
  const searchParams = useSearchParams()
  const url = searchParams.get("url")

  if (!url) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔗</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No URL Provided</h2>
          <p className="text-gray-500 mb-6">Please start by entering a company website URL.</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold rounded-xl"
          >
            Go Home
          </a>
        </div>
      </div>
    )
  }

  const decodedUrl = decodeURIComponent(url)

  return (
    <div className="flex-1 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <a href="/" className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1 mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </a>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Brand Assessment Questionnaire
          </h1>
          <p className="text-gray-500 mt-2">
            Help us understand your brand better. Answer as many questions as you like, or skip to get an instant evaluation.
          </p>
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            {decodedUrl}
          </div>
        </div>

        <QuestionnaireForm url={decodedUrl} />
      </div>
    </div>
  )
}

export default function QuestionnairePage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse-dot" />
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse-dot" />
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse-dot" />
          </div>
        </div>
      }
    >
      <QuestionnaireContent />
    </Suspense>
  )
}
