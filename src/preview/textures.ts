import { canvasTex, INK, rng } from './toon'

const DELA = '"Dela Gothic One", sans-serif'
const MONO = '"JetBrains Mono", monospace'

export type Pal = { paper: string; accent: string; cel: string; soft: string }

function sketchLine(g: CanvasRenderingContext2D, pts: [number, number][], r: () => number, jitter = 2) {
  g.beginPath()
  pts.forEach(([x, y], i) => (i ? g.lineTo(x + (r() - .5) * jitter, y + (r() - .5) * jitter) : g.moveTo(x, y)))
  g.stroke()
}

function tone(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, step = 9, rad = 1.6) {
  g.save()
  g.beginPath()
  g.rect(x, y, w, h)
  g.clip()
  for (let yy = y; yy < y + h; yy += step) for (let xx = x + ((yy / step) % 2) * step / 2; xx < x + w; xx += step) {
    g.beginPath()
    g.arc(xx, yy, rad, 0, Math.PI * 2)
    g.fill()
  }
  g.restore()
}

/** A storyboard sheet: six pencil panels that preview the world below it. */
export const storyboard = (p: Pal) => canvasTex(1536, 1024, (g, w, h) => {
  const r = rng(7)
  g.fillStyle = p.paper
  g.fillRect(0, 0, w, h)
  g.fillStyle = INK
  g.font = `34px ${MONO}`
  g.fillText('MUSEONE · STORYBOARD · EP.01', 60, 66)
  g.fillStyle = p.accent
  g.font = `44px ${DELA}`
  g.fillText('作画', w - 170, 70)
  const cols = 3, rows = 2, pad = 40, top = 100
  const pw = (w - pad * (cols + 1)) / cols, ph = (h - top - pad * (rows + 1)) / rows
  g.lineWidth = 6
  g.strokeStyle = INK
  for (let i = 0; i < 6; i++) {
    const x = pad + (i % cols) * (pw + pad), y = top + pad + Math.floor(i / cols) * (ph + pad)
    g.strokeRect(x, y, pw, ph)
    g.save()
    g.translate(x, y)
    g.lineWidth = 3
    g.strokeStyle = '#4a4652'
    g.fillStyle = '#4a4652'
    if (i === 0) { // skyline
      for (let b = 0; b < 9; b++) { const bx = 20 + b * 50, bh = 60 + r() * 180; sketchLine(g, [[bx, ph - 20], [bx, ph - 20 - bh], [bx + 40, ph - 20 - bh], [bx + 40, ph - 20]], r) }
    } else if (i === 1) { // speed lines into a sun
      for (let k = 0; k < 40; k++) { const a = r() * Math.PI * 2; sketchLine(g, [[pw / 2 + Math.cos(a) * 60, ph / 2 + Math.sin(a) * 60], [pw / 2 + Math.cos(a) * 400, ph / 2 + Math.sin(a) * 400]], r, 0) }
      g.beginPath(); g.arc(pw / 2, ph / 2, 50, 0, 7); g.stroke()
    } else if (i === 2) { // phone
      g.strokeRect(pw / 2 - 60, 40, 120, ph - 80); tone(g, pw / 2 - 50, 70, 100, 90)
    } else if (i === 3) { // lighthouse
      sketchLine(g, [[pw / 2 - 40, ph - 20], [pw / 2 - 25, 80], [pw / 2 + 25, 80], [pw / 2 + 40, ph - 20]], r)
      sketchLine(g, [[pw / 2 + 25, 90], [pw - 20, 50]], r); sketchLine(g, [[pw / 2 + 25, 110], [pw - 20, 170]], r)
    } else if (i === 4) { // crowd
      for (let k = 0; k < 14; k++) { g.beginPath(); g.arc(30 + r() * (pw - 60), ph - 40 - r() * 120, 14, 0, 7); g.stroke() }
    } else {
      g.fillStyle = INK; g.font = `86px ${DELA}`; g.fillText('ドン!', 60, ph / 2 + 30)
    }
    g.restore()
  }
})

export const facade = (base: string) => canvasTex(128, 256, (g, w, h) => {
  g.fillStyle = base
  g.fillRect(0, 0, w, h)
  g.fillStyle = INK
  for (let y = 14; y < h - 10; y += 26) for (let x = 12; x < w - 10; x += 28) g.fillRect(x, y, 14, 14)
})

export const billboard = (p: Pal, jp: string, en: string) => canvasTex(1024, 512, (g, w, h) => {
  g.fillStyle = p.paper
  g.fillRect(0, 0, w, h)
  g.fillStyle = p.accent
  g.fillRect(0, 0, w, 90)
  g.fillStyle = p.paper
  g.font = `48px ${MONO}`
  g.fillText('yourbrand.com', 40, 62)
  g.fillStyle = INK
  g.font = `120px ${DELA}`
  g.fillText(en, 40, 250)
  g.font = `70px ${DELA}`
  g.fillStyle = p.cel
  g.fillText(jp, 40, 360)
  g.fillStyle = INK
  tone(g, w - 330, 140, 280, 320, 12, 3)
  g.lineWidth = 8
  g.strokeRect(w - 330, 140, 280, 320)
})

export const dashboard = (p: Pal) => canvasTex(1024, 640, (g, w, h) => {
  g.fillStyle = p.paper
  g.fillRect(0, 0, w, h)
  g.fillStyle = INK
  g.fillRect(0, 0, 170, h)
  g.fillStyle = p.accent
  g.fillRect(30, 120, 110, 22)
  for (let i = 0; i < 5; i++) { g.fillStyle = '#4a4652'; g.fillRect(30, 180 + i * 50, 110, 16) }
  const bars = [.35, .6, .45, .8, .55, .9, .7, 1]
  bars.forEach((b, i) => { g.fillStyle = i === 5 ? p.accent : INK; g.fillRect(230 + i * 95, h - 60 - b * 380, 60, b * 380) })
  g.font = `56px ${DELA}`
  g.fillStyle = INK
  g.fillText('Web apps', 230, 100)
})

export const phoneScreen = (p: Pal, social = false) => canvasTex(360, 720, (g, w, h) => {
  g.fillStyle = p.paper
  g.fillRect(0, 0, w, h)
  g.fillStyle = INK
  g.fillRect(w / 2 - 50, 18, 100, 18)
  if (social) {
    const colors = [INK, p.accent, p.cel, p.soft]
    for (let i = 0; i < 9; i++) { g.fillStyle = colors[i % 4]; g.fillRect(20 + (i % 3) * 110, 120 + Math.floor(i / 3) * 110, 100, 100) }
    g.fillStyle = p.accent
    g.font = `120px ${DELA}`
    g.fillText('♥', 110, 560)
  } else {
    for (let i = 0; i < 6; i++) {
      g.strokeStyle = INK; g.lineWidth = 5; g.strokeRect(24, 80 + i * 100, w - 48, 80)
      g.fillStyle = i === 1 ? p.accent : p.cel; g.beginPath(); g.arc(70, 120 + i * 100, 22, 0, 7); g.fill()
      g.fillStyle = INK; g.fillRect(110, 110 + i * 100, 180, 16)
    }
  }
})

export const searchSheet = (p: Pal) => canvasTex(768, 1024, (g, w) => {
  g.fillStyle = p.paper
  g.fillRect(0, 0, w, 1024)
  g.strokeStyle = INK
  g.lineWidth = 8
  g.beginPath()
  g.roundRect(40, 60, w - 80, 100, 50)
  g.stroke()
  g.fillStyle = INK
  g.font = `36px ${MONO}`
  g.fillText('your service, your city', 80, 124)
  for (let i = 0; i < 5; i++) {
    const y = 220 + i * 150
    g.fillStyle = i === 0 ? INK : p.paper
    g.fillRect(40, y, w - 80, 120)
    g.strokeRect(40, y, w - 80, 120)
    g.fillStyle = i === 0 ? p.paper : '#4a4652'
    g.font = i === 0 ? `40px ${DELA}` : `28px ${MONO}`
    g.fillText(i === 0 ? 'Your brand. #1' : 'another-site.com', 70, y + 72)
  }
})

/** Onion-skin animation sheets: a ball-and-streak run cycle drawn in pencil. */
export const animSheet = (p: Pal, frame: number) => canvasTex(768, 560, (g, w, h) => {
  g.fillStyle = p.paper
  g.fillRect(0, 0, w, h)
  g.strokeStyle = '#4a4652'
  g.lineWidth = 4
  const x = 160 + frame * 180, y = 330 - Math.sin(frame * 1.2) * 140
  g.beginPath(); g.arc(x, y, 60, 0, 7); g.stroke()
  for (let k = 0; k < 6; k++) { g.beginPath(); g.moveTo(x - 90 - k * 10, y - 40 + k * 16); g.lineTo(x - 260, y - 40 + k * 16); g.stroke() }
  g.fillStyle = INK
  g.font = `30px ${MONO}`
  g.fillText(`KEY ${String(frame + 1).padStart(2, '0')}`, 30, 50)
  g.fillStyle = p.accent
  g.font = `64px ${DELA}`
  g.fillText(['シュッ', 'バッ', 'ドン'][frame], w - 260, h - 40)
})

export const stripes = (a: string, b: string) => canvasTex(64, 256, (g, w, h) => {
  for (let y = 0; y < h; y += 16) { g.fillStyle = (y / 16) % 2 ? a : b; g.fillRect(0, y, w, 16) }
})
