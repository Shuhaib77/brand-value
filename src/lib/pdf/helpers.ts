import { jsPDF } from "jspdf"
import { PH, BM, TM, LM, CW, LH, P, CY, TD, TMU, TLBL, BLP, BDLP, BLC, BDLC, BCHIP, BDCH, CBD, CBDD, CLBL, WB, WBD, WT } from "./colors"

export function lnCt(d: jsPDF, t: string, mw: number): number {
  const ws = t.split(" "); let ln = "", c = 1
  for (const w of ws) { const n = ln ? `${ln} ${w}` : w; if (d.getTextWidth(n) > mw && ln) { c++; ln = w } else ln = n }
  return c
}

export function wr(d: jsPDF, t: string, x: number, y: number, mw: number): number {
  const ws = t.split(" "); const ls: string[] = []; let l = ""
  for (const w of ws) { const n = l ? `${l} ${w}` : w; if (d.getTextWidth(n) > mw && l) { ls.push(l); l = w } else l = n }
  if (l) ls.push(l)
  for (const ln of ls) { if (y + LH > PH - BM - 2) return y; d.text(ln, x, y); y += LH }
  return y
}

export function np(d: jsPDF, y: number, n: number): number {
  if (y + n > PH - BM - 4) { d.addPage(); y = TM + 2 }
  return y
}

export function bt(d: jsPDF, t: string, x: number, y: number, mw: number): number { return wr(d, t, x, y, mw) }

export function slbl(d: jsPDF, t: string, y: number): number {
  y = np(d, y, 8)
  d.setFontSize(9); d.setFont("helvetica", "bold"); d.setTextColor(P[0], P[1], P[2])
  d.text(t.toUpperCase(), LM, y)
  return y + 10
}

export function stitle(d: jsPDF, t: string, y: number): number {
  y = np(d, y, 14)
  d.setFontSize(17); d.setFont("helvetica", "bold"); d.setTextColor(32, 26, 51)
  d.text(t, LM, y)
  const sy = y + 2.5
  d.setFillColor(P[0], P[1], P[2]); d.roundedRect(LM, sy, 30, 0.8, 0.4, 0.4, "F")
  d.setFillColor(CY[0], CY[1], CY[2]); d.roundedRect(LM + 30, sy, 7, 0.8, 0.4, 0.4, "F")
  return y + 9
}

export function sh(d: jsPDF, l: string, t: string, y: number): number { y = slbl(d, l, y); y = stitle(d, t, y); return y }

export function bl(d: jsPDF, items: string[], y: number): number {
  for (const it of items) {
    y = np(d, y, 8)
    d.setFontSize(7); d.setFont("helvetica", "normal"); d.setTextColor(TD[0], TD[1], TD[2])
    d.text("•", LM, y)
    d.setFontSize(9.5)
    y = bt(d, it, LM + 4.5, y, CW - 9)
    y += 4
  }
  return y
}

export function ch(d: jsPDF, t: string, x: number, y: number, bg: [number, number, number], bd: [number, number, number], tx: [number, number, number]): number {
  const w = d.getTextWidth(t) + 14
  d.setFillColor(bg[0], bg[1], bg[2]); d.setDrawColor(bd[0], bd[1], bd[2]); d.setLineWidth(0.15)
  d.roundedRect(x, y - 4.5, w, 9, 6, 6, "FD")
  d.setFontSize(9); d.setFont("helvetica", "bold"); d.setTextColor(tx[0], tx[1], tx[2])
  d.text(t, x + 7, y - 0.5)
  return x + w + 12
}

export function ir(d: jsPDF, l: string, v: string, y: number, wiki?: boolean): number {
  y = np(d, y, 11)
  d.setDrawColor(240, 237, 247); d.setLineWidth(0.15); d.line(LM, y + 5, LM + CW, y + 5)
  d.setFontSize(8); d.setFont("helvetica", "bold"); d.setTextColor(TLBL[0], TLBL[1], TLBL[2])
  d.text(l.toUpperCase(), LM, y + 1)
  const vx = LM + 40
  d.setFontSize(9); d.setFont("helvetica", "normal"); d.setTextColor(TD[0], TD[1], TD[2])
  y = bt(d, v, vx, y + 1, CW - 40 - (wiki ? 20 : 0))
  if (wiki) {
    const tw = d.getTextWidth("✓ WIKI") + 8
    d.setFontSize(6.5); d.setFont("helvetica", "bold"); d.setTextColor(WT[0], WT[1], WT[2])
    d.setFillColor(WB[0], WB[1], WB[2]); d.setDrawColor(WBD[0], WBD[1], WBD[2]); d.setLineWidth(0.15)
    d.roundedRect(vx, y - 10, tw, 6.5, 2, 2, "FD")
    d.text("✓ WIKI", vx + 4, y - 5.5)
  }
  return y + 5
}

export function eb(d: jsPDF, t: string, y: number): number {
  y = np(d, y, 20)
  const lc = lnCt(d, t, CW - 16)
  const bh = lc * LH + 6
  d.setFillColor(BLP[0], BLP[1], BLP[2]); d.setDrawColor(BDLP[0], BDLP[1], BDLP[2]); d.setLineWidth(0.15)
  d.roundedRect(LM, y - 2, CW, bh, 4, 4, "FD")
  d.setFillColor(P[0], P[1], P[2])
  d.rect(LM, y - 2, 3.5, bh, "F")
  d.setFontSize(9.5); d.setFont("helvetica", "normal"); d.setTextColor(TD[0], TD[1], TD[2])
  y = bt(d, t, LM + 10, y + 3, CW - 16)
  d.setDrawColor(BDLP[0], BDLP[1], BDLP[2]); d.setLineWidth(0.15)
  d.rect(LM, y + 2, 3.5, 0.1, "F")
  return y + 6
}

export function ablock(d: jsPDF, title: string, text: string, y: number, dotClr: [number, number, number]): number {
  y = np(d, y, 12)
  d.setFillColor(dotClr[0], dotClr[1], dotClr[2]); d.circle(LM + 4, y + 1, 3.5, "F")
  d.setFontSize(9.5); d.setFont("helvetica", "bold"); d.setTextColor(32, 26, 51)
  d.text(title, LM + 11, y + 1)
  y += 4
  d.setFontSize(9.5); d.setFont("helvetica", "normal"); d.setTextColor(TMU[0], TMU[1], TMU[2])
  y = bt(d, text, LM + 11, y, CW - 15)
  return y + 4
}
