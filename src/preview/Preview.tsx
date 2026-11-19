import { useEffect, useRef, useState, type CSSProperties } from 'react'
import * as THREE from 'three'
import ImpactLayer from '../components/ImpactLayer'
import SpeedLines from '../components/SpeedLines'
import { worlds as services } from '../content'
import { impact, speed, startSmoothScroll } from '../lib/motion'
import { ToonRenderer } from './toon'
import { WORLDS, type Beat } from './worlds'

// shortcut: throwaway prototype for picking a direction; scenes are rebuilt on switch without disposing geometry.
type Id = 'a' | 'b' | 'c'
const SHORT: Record<Id, string> = { a: 'A · City', b: 'B · Island', c: 'C · Desk' }
const params = new URLSearchParams(location.search)
const initial = params.get('v') as Id | null
const forcedP = params.has('p') ? Number(params.get('p')) : null // review aid: freeze the camera at a scroll position

export default function Preview() {
  const [id, setId] = useState<Id>(WORLDS.some((w) => w.id === initial) ? initial! : 'a')
  const [beat, setBeat] = useState<Beat | null>(null)
  const [ready, setReady] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const def = WORLDS.find((w) => w.id === id)!

  useEffect(() => startSmoothScroll(), [])

  useEffect(() => {
    Promise.all([document.fonts.load('40px "Dela Gothic One"'), document.fonts.load('20px "JetBrains Mono"')]).then(() => setReady(true))
  }, [])

  useEffect(() => {
    if (!ready) return
    const canvas = canvasRef.current!
    const tr = new ToonRenderer(canvas)
    const world = def.build()
    const cam = new THREE.PerspectiveCamera(42, 1, 0.1, 400)
    const path = new THREE.CatmullRomCurve3(world.path, false, 'catmullrom', 0.5)
    const look = new THREE.CatmullRomCurve3(world.look, false, 'catmullrom', 0.5)
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      tr.setSize(r.width, r.height)
      cam.aspect = r.width / r.height
      cam.fov = cam.aspect < 1 ? 62 : 42 // portrait screens need a wider lens to keep the subject in frame
      cam.updateProjectionMatrix()
    }
    resize()
    addEventListener('resize', resize)

    let raf = 0
    let p = 0
    let last: Beat | null = null
    const t0 = performance.now()
    const frame = () => {
      raf = requestAnimationFrame(frame)
      const max = document.documentElement.scrollHeight - innerHeight
      const target = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0
      p = forcedP ?? p + (target - p) * 0.12 // a little camera inertia on top of Lenis
      const t = (performance.now() - t0) / 1000
      cam.position.copy(path.getPoint(p))
      cam.lookAt(look.getPoint(p))
      world.update(p, t)
      if (world.dive) {
        const [a, b] = world.dive
        speed.dive = p > a && p < b ? Math.sin(((p - a) / (b - a)) * Math.PI) : 0
      }
      const now = def.beats.find((bt) => p >= bt.from && p < bt.to) ?? null
      if (now !== last) {
        if (now?.kind === 'service' && now.sfx) {
          impact(now.sfx)
          speed.velocity = 0.9
        }
        last = now
        setBeat(now)
      }
      tr.render(world.scene, cam, world.bg(p), world.shade(p), t)
    }
    frame()
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('resize', resize)
      tr.dispose()
      speed.dive = 0
    }
  }, [ready, def])

  const pick = (next: Id) => {
    history.replaceState(null, '', `?v=${next}`)
    scrollTo(0, 0)
    setId(next)
  }

  const svc = beat?.kind === 'service' ? services[beat.i!] : null
  const vars = { '--pv-page': def.ui.page, '--pv-ink': def.ui.ink, '--pv-accent': def.pal.accent, '--pv-cel': def.pal.cel } as CSSProperties

  return (
    <div className={`pv pv-${id}`} style={vars}>
      <div className="pv-picker" role="tablist" aria-label="World previews">
        {WORLDS.map((w) => (
          <button key={w.id} role="tab" aria-selected={w.id === id} onClick={() => pick(w.id)}>
            <span className="pv-full">{w.name}</span>
            <span className="pv-short">{SHORT[w.id]}</span>
          </button>
        ))}
      </div>
      <p className="pv-blurb mono">{def.blurb} Scroll to travel.</p>

      <div className="pv-frame">
        <canvas ref={canvasRef} className="pv-canvas" />
        <div className="pv-hud mono" aria-hidden="true"><span>MUSEONE</span><span>EP.01 · {def.name.split('·')[1]}</span></div>

        {beat?.kind === 'intro' && (
          <div className="pv-cap pv-intro" key="intro">
            <p className="mono pv-k">EP.00 · 作画 · A STUDIO OF THREE</p>
            <h1>Still pages get scrolled past.</h1>
            <p>MuseOne is a three-person studio. We design and build websites, web apps, and mobile and desktop apps, then run the SEO and social that bring people to them.</p>
            <p className="mono pv-scroll">SCROLL TO DIVE ↓</p>
          </div>
        )}
        {svc && (
          <>
            <div className="pv-cap pv-service" key={svc.kind}>
              <p className="mono pv-k">{String(beat!.i! + 1).padStart(2, '0')} / 05 · {svc.jp}</p>
              <h2>{svc.title}</h2>
              <p>{svc.body}</p>
              <ul>{svc.tags.map((t) => <li key={t} className="mono">{t}</li>)}</ul>
            </div>
            <span className="pv-sfx" key={`sfx-${svc.kind}`} aria-hidden="true">{beat!.sfx}</span>
          </>
        )}
        {beat?.kind === 'end' && (
          <div className="pv-cap pv-end" key="end">
            <p className="mono pv-k">CHAPTER 06 · 最終回</p>
            <h2>Final chapter: your project.</h2>
            <sakuga-button onClick={() => { location.href = '/#ending' }}>Start a project</sakuga-button>
          </div>
        )}
      </div>

      <div className="pv-track" aria-hidden="true" />
      <SpeedLines />
      <ImpactLayer />
    </div>
  )
}
