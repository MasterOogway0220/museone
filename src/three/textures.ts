import * as THREE from 'three'
import { canvasTex, INK } from './toon'

export const PAL = { paper: '#F1ECE1', paper2: '#E4DCCB', hi: '#FBF8F1', ink: INK, cobalt: '#2346C8', accent: '#E2462C', grey: '#8E8A86' }
const DISPLAY = '"Bricolage Grotesque", sans-serif'
const MONO = '"JetBrains Mono", monospace'
const HAND = '"Caveat", cursive'

/** A canvas texture that can be redrawn with a progress value (screens that build themselves). */
export function liveTex(w: number, h: number, draw: (g: CanvasRenderingContext2D, w: number, h: number, k: number) => void) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const g = c.getContext('2d')!
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.NoColorSpace
  tex.anisotropy = 4
  let last = -1
  return {
    tex,
    set(k: number) {
      const q = Math.round(Math.min(1, Math.max(0, k)) * 40) / 40 // redraw only on visible steps
      if (q === last) return
      last = q
      g.clearRect(0, 0, w, h)
      draw(g, w, h, q)
      tex.needsUpdate = true
    },
  }
}

const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3)
const seg = (k: number, a: number, b: number) => ease((k - a) / (b - a))

/** The client website, assembling itself block by block as k goes 0 → 1. */
export const websiteScreen = () => liveTex(1280, 800, (g, w, h, k) => {
  g.fillStyle = PAL.hi
  g.fillRect(0, 0, w, h)
  g.fillStyle = PAL.paper2
  g.fillRect(0, 0, w, 56)
  ;[30, 56, 82].forEach((x) => { g.beginPath(); g.arc(x, 28, 8, 0, 7); g.fillStyle = PAL.grey; g.fill() })
  g.fillStyle = PAL.hi
  g.fillRect(120, 14, 420, 28)
  g.fillStyle = PAL.ink
  g.font = `20px ${MONO}`
  g.fillText('yourbrand.com', 136, 35)
  const a = seg(k, 0, 0.3)
  g.globalAlpha = a
  g.font = `600 30px ${DISPLAY}`
  g.fillText('Yourbrand', 60, 120)
  g.font = `20px ${MONO}`
  ;['Work', 'About', 'Contact'].forEach((t, i) => g.fillText(t, w - 380 + i * 110, 120))
  g.globalAlpha = seg(k, 0.15, 0.45)
  g.font = `700 92px ${DISPLAY}`
  g.fillText('Made to be', 60, 270)
  g.fillText('remembered.', 60, 370)
  g.globalAlpha = seg(k, 0.35, 0.55)
  g.fillStyle = PAL.accent
  g.fillRect(60, 420, 230, 64)
  g.fillStyle = PAL.hi
  g.font = `600 26px ${DISPLAY}`
  g.fillText('Book a call', 92, 462)
  const img = seg(k, 0.3, 0.7)
  g.globalAlpha = 1
  g.fillStyle = PAL.cobalt
  g.fillRect(720, 170, 500 * img, 330)
  g.fillStyle = PAL.paper
  for (let i = 0; i < 4; i++) {
    const t = seg(k, 0.6 + i * 0.08, 0.8 + i * 0.05)
    g.globalAlpha = t
    g.fillRect(60 + i * 295, 560 + (1 - t) * 40, 270, 190)
    g.fillStyle = PAL.ink
    g.fillRect(84 + i * 295, 590 + (1 - t) * 40, 150, 16)
    g.fillStyle = PAL.paper
  }
  g.globalAlpha = 1
})

export const dashboardScreen = () => liveTex(1280, 800, (g, w, h, k) => {
  g.fillStyle = PAL.hi
  g.fillRect(0, 0, w, h)
  g.fillStyle = PAL.ink
  g.fillRect(0, 0, 220, h)
  g.fillStyle = PAL.accent
  g.fillRect(36, 120, 148, 22)
  g.fillStyle = '#4a4652'
  for (let i = 0; i < 6; i++) g.fillRect(36, 180 + i * 52, 148, 16)
  g.fillStyle = PAL.ink
  g.font = `700 46px ${DISPLAY}`
  g.fillText('Orders this week', 270, 90)
  for (let i = 0; i < 3; i++) {
    g.strokeStyle = PAL.ink
    g.lineWidth = 4
    g.strokeRect(270 + i * 320, 130, 290, 120)
    g.fillStyle = i === 1 ? PAL.cobalt : PAL.ink
    g.fillRect(296 + i * 320, 160, 120 * seg(k, i * 0.1, 0.5 + i * 0.1), 26)
    g.fillStyle = PAL.grey
    g.fillRect(296 + i * 320, 206, 200, 12)
  }
  const bars = [0.35, 0.55, 0.42, 0.7, 0.5, 0.86, 0.66, 0.95, 0.78]
  bars.forEach((b, i) => {
    const t = seg(k, 0.15 + i * 0.05, 0.55 + i * 0.05)
    g.fillStyle = i === 7 ? PAL.accent : PAL.ink
    g.fillRect(290 + i * 102, h - 70 - b * 400 * t, 66, b * 400 * t)
  })
  g.fillStyle = PAL.ink
  g.fillRect(270, h - 66, 960, 4)
})

export const phoneApp = () => canvasTex(360, 740, (g, w, h) => {
  g.fillStyle = PAL.hi
  g.fillRect(0, 0, w, h)
  g.fillStyle = PAL.ink
  g.font = `700 40px ${DISPLAY}`
  g.fillText('Today', 28, 96)
  for (let i = 0; i < 5; i++) {
    g.strokeStyle = PAL.ink
    g.lineWidth = 4
    g.strokeRect(24, 130 + i * 110, w - 48, 92)
    g.fillStyle = i === 0 ? PAL.accent : PAL.cobalt
    g.beginPath(); g.arc(70, 176 + i * 110, 22, 0, 7); g.fill()
    g.fillStyle = PAL.ink
    g.fillRect(110, 160 + i * 110, 170, 14)
    g.fillStyle = PAL.grey
    g.fillRect(110, 186 + i * 110, 110, 10)
  }
})

export const tabletApp = () => canvasTex(1024, 720, (g, w, h) => {
  g.fillStyle = PAL.hi
  g.fillRect(0, 0, w, h)
  g.fillStyle = PAL.paper2
  g.fillRect(0, 0, 300, h)
  g.fillStyle = PAL.ink
  g.font = `700 44px ${DISPLAY}`
  g.fillText('Projects', 340, 90)
  for (let i = 0; i < 6; i++) {
    g.fillStyle = i === 1 ? PAL.cobalt : PAL.ink
    g.fillRect(36, 120 + i * 80, 220, 18)
    g.strokeStyle = PAL.ink
    g.lineWidth = 4
    g.strokeRect(340 + (i % 3) * 220, 140 + Math.floor(i / 3) * 260, 190, 220)
    g.fillStyle = [PAL.accent, PAL.cobalt, PAL.paper2][i % 3]
    g.fillRect(352 + (i % 3) * 220, 152 + Math.floor(i / 3) * 260, 166, 120)
  }
})

export const feed = () => canvasTex(360, 740, (g, w, h) => {
  g.fillStyle = PAL.hi
  g.fillRect(0, 0, w, h)
  g.fillStyle = PAL.ink
  g.font = `700 34px ${DISPLAY}`
  g.fillText('yourbrand', 24, 70)
  const cols = [PAL.cobalt, PAL.accent, PAL.ink, PAL.paper2]
  for (let i = 0; i < 12; i++) {
    g.fillStyle = cols[(i * 7) % 4]
    g.fillRect(12 + (i % 3) * 114, 110 + Math.floor(i / 3) * 114, 108, 108)
  }
  g.fillStyle = PAL.accent
  g.font = `120px ${DISPLAY}`
  g.fillText('♥', 220, 700)
})

export const searchSheet = () => canvasTex(720, 960, (g, w, h) => {
  g.fillStyle = PAL.hi
  g.fillRect(0, 0, w, h)
  g.strokeStyle = PAL.ink
  g.lineWidth = 6
  g.beginPath()
  g.roundRect(40, 50, w - 80, 90, 45)
  g.stroke()
  g.fillStyle = PAL.ink
  g.font = `30px ${MONO}`
  g.fillText('web design studio near me', 80, 106)
  for (let i = 0; i < 5; i++) {
    const y = 190 + i * 145
    if (i === 0) { g.fillStyle = PAL.cobalt; g.fillRect(40, y, w - 80, 120) }
    g.fillStyle = i === 0 ? PAL.hi : PAL.ink
    g.font = i === 0 ? `700 38px ${DISPLAY}` : `28px ${MONO}`
    g.fillText(i === 0 ? 'Yourbrand · Position 1' : 'another-site.com', 70, y + 55)
    g.fillStyle = i === 0 ? '#b8c6f3' : PAL.grey
    g.fillRect(70, y + 78, 380, 12)
  }
  g.fillStyle = PAL.accent
  g.font = `52px ${HAND}`
  g.fillText('← us!', 470, 250)
  g.strokeStyle = PAL.accent
  g.lineWidth = 5
  g.strokeRect(30, 180, w - 60, 140)
})

export const sketch = (label: string) => canvasTex(512, 380, (g, w, h) => {
  g.fillStyle = PAL.hi
  g.fillRect(0, 0, w, h)
  g.strokeStyle = '#4a4652'
  g.lineWidth = 4
  g.strokeRect(40, 40, w - 80, 70)
  g.strokeRect(40, 140, 200, 180)
  for (let i = 0; i < 4; i++) g.fillRect(270, 150 + i * 40, 180 - i * 30, 10)
  g.fillStyle = PAL.ink
  g.font = `44px ${HAND}`
  g.fillText(label, 60, 92)
})

export const polaroid = (color: string) => canvasTex(256, 300, (g, w, h) => {
  g.fillStyle = PAL.hi
  g.fillRect(0, 0, w, h)
  g.fillStyle = color
  g.fillRect(18, 18, w - 36, w - 36)
})

export const stepCard = (n: number, title: string) => canvasTex(480, 320, (g, w, h) => {
  g.fillStyle = PAL.hi
  g.fillRect(0, 0, w, h)
  g.fillStyle = PAL.cobalt
  g.fillRect(0, 0, w, 10)
  g.fillStyle = PAL.ink
  g.font = `26px ${MONO}`
  g.fillText(`STEP 0${n}`, 34, 70)
  g.font = `700 76px ${DISPLAY}`
  g.fillText(title, 34, 180)
  g.fillStyle = PAL.grey
  g.fillRect(34, 220, 300, 12)
  g.fillRect(34, 250, 220, 12)
})

export const nameTent = (name: string, role: string) => canvasTex(512, 200, (g, w, h) => {
  g.fillStyle = PAL.hi
  g.fillRect(0, 0, w, h)
  g.fillStyle = PAL.ink
  g.font = `700 60px ${DISPLAY}`
  g.fillText(name, 30, 90)
  g.fillStyle = PAL.cobalt
  g.font = `26px ${MONO}`
  g.fillText(role.toUpperCase().slice(0, 28), 30, 150)
})

export const skyline = () => canvasTex(2048, 768, (g, w, h) => {
  const grd = g.createLinearGradient(0, 0, 0, h)
  grd.addColorStop(0, '#F6D7B8')
  grd.addColorStop(1, '#F1ECE1')
  g.fillStyle = grd
  g.fillRect(0, 0, w, h)
  g.fillStyle = PAL.accent
  g.beginPath(); g.arc(1300, 330, 110, 0, 7); g.fill()
  let x = 0, s = 3
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647)
  while (x < w) {
    const bw = 70 + r() * 140, bh = 120 + r() * 360
    g.fillStyle = r() > 0.5 ? PAL.cobalt : '#3554D0'
    g.fillRect(x, h - bh, bw, bh)
    g.fillStyle = '#9fb0ea'
    for (let yy = h - bh + 24; yy < h - 20; yy += 34) for (let xx = x + 14; xx < x + bw - 14; xx += 26) if (r() > 0.55) g.fillRect(xx, yy, 10, 14)
    x += bw + 6
  }
})
