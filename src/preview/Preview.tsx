import { useEffect, useRef, useState, type CSSProperties } from 'react'
import * as THREE from 'three'
import ImpactLayer from '../components/ImpactLayer'
import SpeedLines from '../components/SpeedLines'
import { worlds as services } from '../content'
import { impact, scrollToY, speed, startSmoothScroll } from '../lib/motion'
import { ToonRenderer } from './toon'
import { WORLDS, type Beat } from './worlds'

// shortcut: throwaway prototype for picking a direction; scenes are rebuilt on switch without disposing geometry.
type Id = 'a' | 'b' | 'c'
const SHORT: Record<Id, string> = { a: 'A · City', b: 'B · Island', c: 'C · Desk' }
const params = new URLSearchParams(location.search)
const initial = params.get('v') as Id | null
const forcedP = params.has('p') ? Number(params.get('p')) : null // review aid: freeze the camera at a scroll position

const maxScroll = () => Math.max(1, document.documentElement.scrollHeight - innerHeight)

function webglOk() {
  try {
    return !!document.createElement('canvas').getContext('webgl2')
  } catch {
    return false
  }
}

export default function Preview() {
  const [id, setId] = useState<Id>(WORLDS.some((w) => w.id === initial) ? initial! : 'a')
  const [beat, setBeat] = useState<Beat | null>(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(webglOk() ? null : 'This browser has WebGL 2 turned off or unavailable.')
  const [playing, setPlaying] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const pRef = useRef(0)
  const def = WORLDS.find((w) => w.id === id)!
  // where Prev/Next/Play stop: the start, then the middle of every beat
  const stops = [0, ...def.beats.filter((b) => b.kind !== 'intro').map((b) => Math.min(1, (b.from + b.to) / 2))]

  useEffect(() => startSmoothScroll(), [])

  useEffect(() => {
    const done = () => setReady(true)
    Promise.all([document.fonts.load('40px "Dela Gothic One"'), document.fonts.load('20px "JetBrains Mono"')]).then(done, done)
    const failsafe = setTimeout(done, 3000) // never wait forever on fonts
    return () => clearTimeout(failsafe)
  }, [])

  useEffect(() => {
    if (!ready || error) return
    const canvas = canvasRef.current!
    let tr: ToonRenderer
    let world: ReturnType<typeof def.build>
    try {
      tr = new ToonRenderer(canvas)
      world = def.build()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
      return
    }
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
      try {
        const target = Math.min(1, Math.max(0, scrollY / maxScroll()))
        p = forcedP ?? p + (target - p) * 0.12 // a little camera inertia on top of Lenis
        pRef.current = p
        if (barRef.current) barRef.current.style.transform = `scaleX(${p})`
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
      } catch (e) {
        cancelAnimationFrame(raf)
        setError(e instanceof Error ? e.message : String(e))
      }
    }
    frame()
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('resize', resize)
      tr.dispose()
      speed.dive = 0
    }
  }, [ready, def, error])

  const go = (dir: 1 | -1) => {
    const p = pRef.current
    const next = dir > 0 ? stops.find((s) => s > p + 0.015) : [...stops].reverse().find((s) => s < p - 0.015)
    if (next === undefined) return false
    scrollToY(next * maxScroll(), 2.2)
    return true
  }

  // keyboard: arrows step between scenes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1) }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) }
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  })

  // tour: fly to the next scene every few seconds; any wheel/touch stops it
  useEffect(() => {
    if (!playing) return
    if (!go(1)) { setPlaying(false); return }
    const timer = setInterval(() => { if (!go(1)) setPlaying(false) }, 4200)
    const stop = () => setPlaying(false)
    addEventListener('wheel', stop, { passive: true })
    addEventListener('touchstart', stop, { passive: true })
    return () => {
      clearInterval(timer)
      removeEventListener('wheel', stop)
      removeEventListener('touchstart', stop)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing])

  const pick = (next: Id) => {
    history.replaceState(null, '', `?v=${next}`)
    setPlaying(false)
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
      <p className="pv-blurb mono">{def.blurb}</p>

      <div className="pv-frame">
        <canvas ref={canvasRef} className="pv-canvas" />
        <div className="pv-progress" aria-hidden="true"><div ref={barRef} /></div>
        <div className="pv-hud mono" aria-hidden="true"><span>MUSEONE</span><span>EP.01 · {def.name.split('·')[1]}</span></div>

        {error && (
          <div className="pv-cap pv-error" role="alert">
            <p className="mono pv-k">3D VIEW COULD NOT START</p>
            <h2>Something blocked the 3D scene.</h2>
            <p>Error: <code>{error}</code></p>
            <p>Try Chrome or Edge with hardware acceleration on, then reload. Send me this error text if it stays.</p>
          </div>
        )}

        {!error && beat?.kind === 'intro' && (
          <div className="pv-cap pv-intro" key="intro">
            <p className="mono pv-k">EP.00 · 作画 · A STUDIO OF THREE</p>
            <h1>Still pages get scrolled past.</h1>
            <p>MuseOne is a three-person studio. We design and build websites, web apps, and mobile and desktop apps, then run the SEO and social that bring people to them.</p>
            <p className="mono pv-scroll">SCROLL, USE ← → KEYS, OR PRESS PLAY TOUR</p>
          </div>
        )}
        {!error && svc && (
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
        {!error && beat?.kind === 'end' && (
          <div className="pv-cap pv-end" key="end">
            <p className="mono pv-k">CHAPTER 06 · 最終回</p>
            <h2>Final chapter: your project.</h2>
            <sakuga-button onClick={() => { location.href = '/#ending' }}>Start a project</sakuga-button>
          </div>
        )}

        <div className="pv-controls">
          <button onClick={() => { setPlaying(false); go(-1) }} aria-label="Previous scene">◀</button>
          <button className="pv-play" onClick={() => setPlaying((v) => !v)} aria-pressed={playing}>
            {playing ? 'Stop tour' : 'Play tour ▶'}
          </button>
          <button onClick={() => { setPlaying(false); go(1) }} aria-label="Next scene">▶</button>
        </div>
      </div>

      <div className="pv-track" aria-hidden="true" />
      <SpeedLines />
      <ImpactLayer />
    </div>
  )
}
