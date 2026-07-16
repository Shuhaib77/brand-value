export function formatDate(date: Date | string): string {
  const d = new Date(date)
  const pad = (n: number) => n.toString().padStart(2, "0")
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}`
}
