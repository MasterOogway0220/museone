import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/motion'

const FRAMES = 24

/** An animator's timesheet that fills with real load progress (fonts + DOM ready), then flips away. */
export default function Loader({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const root = ref.current!
    const cells = Array.from(root.querySelectorAll<HTMLElement>('.sheet-cell'))
    const counter = root.querySelector('.sheet-count')!
    const finish = () => {
      setGone(true)
      onDone()
    }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return finish()

    let shown = 0
    let target = 0
    const setTarget = (p: number) => { target = Math.max(target, Math.round(p * FRAMES)) }
    const step = setInterval(() => {
      if (shown < target) {
        shown += Math.max(1, Math.round((target - shown) / 4)) // catch up fast, never skip the last frames
        shown = Math.min(shown, FRAMES)
        cells.slice(0, shown).forEach((c) => c.classList.add('is-on'))
        counter.textContent = String(shown).padStart(2, '0')
        root.setAttribute('aria-valuenow', String(shown))
      }
      if (shown >= FRAMES) {
        clearInterval(step)
        gsap.timeline({ onComplete: finish })
          .to(root.querySelector('.sheet'), { scaleY: 0, ease: 'steps(4)', duration: 0.33, transformOrigin: 'top' })
          .to(root, { autoAlpha: 0, duration: 0.15, ease: 'steps(2)' })
      }
    }, 1000 / 24)

    setTarget(0.15)
    const start = performance.now()
    const ready = Promise.all([
      document.fonts.ready.then(() => setTarget(0.6)),
      document.readyState !== 'loading' ? Promise.resolve() : new Promise((r) => addEventListener('DOMContentLoaded', r, { once: true })),
    ])
    ready.then(() => setTimeout(() => setTarget(1), Math.max(0, 700 - (performance.now() - start))))
    const failsafe = setTimeout(() => setTarget(1), 2500) // never hold the page hostage
    return () => {
      clearInterval(step)
      clearTimeout(failsafe)
    }
  }, [onDone])

  if (gone) return null
  return (
    <div ref={ref} className="loader" role="progressbar" aria-label="Loading MuseOne" aria-valuemin={0} aria-valuemax={FRAMES}>
      <div className="sheet">
        <div className="sheet-head mono"><span>MUSEONE</span><span>TIMESHEET · EP.00</span></div>
        <div className="sheet-grid">
          {Array.from({ length: FRAMES }, (_, i) => (
            <span key={i} className="sheet-cell mono">{String(i + 1).padStart(2, '0')}</span>
          ))}
        </div>
        <div className="sheet-foot mono"><span>FRAME</span><span className="sheet-count">00</span><span>/ 24</span></div>
      </div>
    </div>
  )
}
