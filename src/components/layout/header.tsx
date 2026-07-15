"use client"

import Link from "next/link"
import { Sun, Moon, Sparkles } from "lucide-react"
import { useThemeContext } from "@/lib/theme-provider"
import { Button } from "@/components/ui/button"

export default function Header() {
  const { theme, toggle } = useThemeContext()

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/60 bg-white/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
            BrandScore
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </Button>
        </nav>
      </div>
    </header>
  )
}
