import { NextRequest, NextResponse } from "next/server"
import { searchCompany } from "@/lib/data/web-search"

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }
    const data = await searchCompany(url)
    return NextResponse.json(data)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
