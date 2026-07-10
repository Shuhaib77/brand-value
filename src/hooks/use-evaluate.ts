"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { BrandResult } from "@/types/brand"

export function useEvaluate() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const evaluate = useCallback(async (url: string, answers?: Record<string, string>) => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, answers: answers || {} }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Evaluation failed")
      sessionStorage.setItem("brandResult", JSON.stringify(data))
      router.push("/results")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong"
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [router])

  return { evaluate, loading, error }
}

export function useBrandResult() {
  const [result, setResult] = useState<BrandResult | null>(null)
  const [loading, setLoading] = useState(true)

  const loadResult = useCallback(() => {
    setLoading(true)
    try {
      const stored = sessionStorage.getItem("brandResult")
      if (!stored) return null
      const parsed = JSON.parse(stored)
      if (parsed.error) return { error: parsed.error }
      setResult(parsed)
      return parsed
    } catch {
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { result, loading, loadResult }
}
