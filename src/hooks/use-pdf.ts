"use client"

import { useState, useCallback } from "react"
import { BrandResult } from "@/types/brand"
import { generateBrandReport } from "@/lib/pdf/brand-report"

export function usePDF() {
  const [generating, setGenerating] = useState(false)

  const downloadPDF = useCallback(async (result: BrandResult) => {
    if (!result) return
    setGenerating(true)
    try {
      const info = result.extractedCompanyInfo
      const d = await generateBrandReport(result)
      d.save(`${info.companyName || "brand"}-Brand-Report.pdf`)
    } catch (err) {
      console.error("PDF generation error:", err)
    } finally {
      setGenerating(false)
    }
  }, [])

  return { downloadPDF, generating }
}
