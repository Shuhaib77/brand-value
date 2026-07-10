"use client"

import { Suspense } from "react"
import UrlInput from "@/components/forms/url-input"

function HomeContent() {
  return (
    <main className="flex-1">
      <section className="min-h-[90vh] flex flex-col items-center justify-center px-4 py-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-50 border border-purple-200 rounded-full text-sm text-purple-700 font-medium mb-8">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            AI-Powered Brand Assessment
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
            Know Your{" "}
            <span className="gradient-text">Brand Value</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 max-w-xl mx-auto leading-relaxed">
            Enter your company website to get a comprehensive AI-driven brand valuation with actionable recommendations.
          </p>
        </div>

        <UrlInput />

        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 max-w-2xl">
          {[
            { label: "Website Scraping", desc: "Extract brand data" },
            { label: "Web Search", desc: "Market intelligence" },
            { label: "Wikipedia", desc: "Company verification" },
            { label: "Action Plan", desc: "Growth roadmap" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-2xl font-bold gradient-text">{item.label.split(" ")[0]}</div>
              <div className="text-xs text-gray-400 mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8 px-4">
        <p className="text-center text-sm text-gray-400">
          Brand Value Generator &mdash; AI-powered brand evaluation
        </p>
      </footer>
    </main>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>}>
      <HomeContent />
    </Suspense>
  )
}
