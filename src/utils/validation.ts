export function isValidUrl(value: string): boolean {
  if (!value.trim()) return false
  try {
    const u = value.startsWith("http") ? value : `https://${value}`
    new URL(u)
    return true
  } catch {
    return false
  }
}

export function normalizeUrl(value: string): string {
  return value.startsWith("http") ? value : `https://${value}`
}
