export function formatNumber(n: number): string {
  return n.toLocaleString()
}

export function formatScore(score: number): string {
  return `${Math.round(score * 10)}`
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}
