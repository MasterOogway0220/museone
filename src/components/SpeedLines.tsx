import { useEffect, useRef } from 'react'
import { speed } from '../lib/motion'

const FPS = 12 // drawn "on twos": the anime cadence, not the browser's 60

/** Full-screen radial speed lines. White on a difference blend, so they invert whatever is under them. */
export default function SpeedLines() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const g = canvas.getContext('2d')!
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    let last = 0
    let w = 0
    let h = 0
    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 1.5)
      w = innerWidth
      h = innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      g.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    addEventListener('resize', resize)

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw)
      if (document.hidden || t - last < 1000 / FPS) return
      last = t
      speed.velocity *= 0.8
      const power = Math.min(1, Math.max(speed.dive, speed.velocity))
      g.clearRect(0, 0, w, h)
      if (power < 0.02) return
      const cx = w / 2
      const cy = h / 2
      const diag = Math.hypot(w, h) / 2
      const count = Math.round(40 + power * 90)
      g.fillStyle = '#fff'
      g.globalAlpha = Math.min(1, power * 1.4)
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2
        const inner = diag * (0.95 - power * 0.6 + Math.random() * 0.35)
        const outer = diag * 1.15
        const half = (0.002 + Math.random() * 0.006) * (0.5 + power)
        g.beginPath()
        g.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner)
        g.lineTo(cx + Math.cos(a - half) * outer, cy + Math.sin(a - half) * outer)
        g.lineTo(cx + Math.cos(a + half) * outer, cy + Math.sin(a + half) * outer)
        g.fill()
      }
    }
    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} className="speedlines" aria-hidden="true" />
}
