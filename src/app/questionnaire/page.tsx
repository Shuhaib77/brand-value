"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { ArrowLeft, Link } from "lucide-react"
import QuestionnaireForm from "@/components/forms/questionnaire-form"
import { Button } from "@/components/ui/button"

function QuestionnaireContent() {
  const searchParams = useSearchParams()
  const url = searchParams.get("url")

  if (!url) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Link className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No URL Provided</h2>
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
    <div className="flex-1 px-4 py-8 sm:py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()} className="mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Brand Assessment Questionnaire
          </h1>
          <p className="text-gray-500 mt-2">
            Help us understand your brand better. Answer as many questions as you like, or skip to get an instant evaluation.
          </p>
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
            <Link className="w-4 h-4" />
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
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse-dot" />
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse-dot" />
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse-dot" />
          </div>
        </div>
      }
    >
      <QuestionnaireContent />
    </Suspense>
  )
}
