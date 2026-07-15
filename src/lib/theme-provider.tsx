"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useTheme } from "@/hooks/use-theme"

interface ThemeContextType {
  theme: "light" | "dark"
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextType>({ theme: "light", toggle: () => {} })

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme, toggle } = useTheme()
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useThemeContext = () => useContext(ThemeContext)
