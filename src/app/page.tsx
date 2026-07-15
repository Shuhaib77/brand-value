"use client"

import { Suspense } from "react"
import Link from "next/link"
import { Sparkles, Search, Globe, FileText, TrendingUp, ChevronRight, Shield, Zap, BarChart3 } from "lucide-react"
import UrlInput from "@/components/forms/url-input"
import CountUp from "@/components/ui/count-up"

function HomeContent() {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-cyan-500/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 pt-20 pb-16 sm:pt-28 sm:pb-20">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-50 border border-purple-200 rounded-full text-sm text-purple-700 font-medium mb-8 animate-fade-in">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              AI-Powered Brand Assessment
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
              Know Your{" "}
              <span className="gradient-text">Brand&apos;s True Value</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-500 max-w-xl mx-auto leading-relaxed mb-10">
              Enter your company website to get a comprehensive AI-driven brand valuation across 9 weighted categories with evidence-based insights.
            </p>

            <UrlInput />
          </div>

          {/* Stats Row */}
          <div className="mt-16 sm:mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { icon: Search, value: 9, suffix: "+", label: "Categories Scored" },
              { icon: Globe, value: 24, suffix: "", label: "Technical Checks", prefix: "" },
              { icon: FileText, value: 100, suffix: "%", label: "Data-Driven", prefix: "" },
              { icon: TrendingUp, value: 10, suffix: "+", label: "Action Items", prefix: "" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-100/60">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-cyan-100 flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold gradient-text">
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-white/40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-500 max-w-lg mx-auto">A multi-source analysis pipeline that gives you a complete brand picture.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "Website Analysis",
                desc: "Deep scrape your website for SEO tags, schema markup, social links, testimonials, team data, and technical quality signals.",
                color: "from-purple-500 to-purple-600",
              },
              {
                icon: Search,
                title: "Web Intelligence",
                desc: "Tavily web search gathers customer reviews, news mentions, and brand sentiment from across the internet.",
                color: "from-cyan-500 to-teal-500",
              },
              {
                icon: Globe,
                title: "Wikipedia Verification",
                desc: "Cross-reference company facts against Wikipedia for accurate founding year, founder, revenue, and employee data.",
                color: "from-amber-500 to-orange-500",
              },
              {
                icon: BarChart3,
                title: "AI Evaluation",
                desc: "Groq-powered AI scores 9 weighted categories with specific evidence and reasoning for every score.",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: Shield,
                title: "Technical Audit",
                desc: "24 automated checks — HTTPS, robots.txt, sitemap, schema, analytics, alt text ratio, and more.",
                color: "from-emerald-500 to-green-500",
              },
              {
                icon: TrendingUp,
                title: "Action Plan",
                desc: "Get a prioritized 30/90/365-day roadmap with specific improvements and expected score uplift.",
                color: "from-blue-500 to-indigo-500",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <Sparkles className="w-8 h-8 mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Know Your Brand Score?</h2>
            <p className="text-purple-100 mb-8 max-w-md mx-auto">
              Get a complete brand evaluation with detailed analysis, competitor insights, and a professional PDF report.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-700 rounded-xl font-medium hover:bg-purple-50 transition-colors shadow-lg"
            >
              Start Evaluation <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse-dot" />
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse-dot" />
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse-dot" />
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}
