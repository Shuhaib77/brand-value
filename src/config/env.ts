const REQUIRED_VARS = ["TAVILY_API_KEY", "GROQ_API_KEY"] as const

export function validateEnv(): string[] {
  const missing: string[] = []
  for (const key of REQUIRED_VARS) {
    if (!process.env[key] || process.env[key] === `your_${key.toLowerCase()}_here`) {
      missing.push(key)
    }
  }
  return missing
}

export function getEnvWarning(): string | null {
  const missing = validateEnv()
  if (missing.length === 0) return null
  return `Missing required environment variables: ${missing.join(", ")}`
}
