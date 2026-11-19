import { useEffect, useRef, type ReactElement } from 'react'
import { animate, stagger, svg } from 'animejs'
import { ScrollTrigger } from '../lib/motion'
import { steps } from '../content'

// One line drawing per production stage. Plain strokes so anime.js can draw them on.
const art: Record<string, ReactElement> = {
  '01': (<><rect x="8" y="14" width="30" height="22" /><rect x="44" y="14" width="30" height="22" /><rect x="8" y="44" width="66" height="26" /><path d="M14 30 q6 -10 12 0 t12 0" /><path d="M16 60 l14 -8 l12 6 l18 -10" /></>),
  '02': (<><circle cx="40" cy="34" r="18" /><path d="M28 30 q4 -4 8 0 M44 30 q4 -4 8 0" /><path d="M32 44 q8 6 16 0" /><path d="M22 70 q18 -18 36 0" /><path d="M62 10 l10 10 l-24 24 l-12 2 l2 -12 z" /></>),
  '03': (<><circle cx="20" cy="40" r="10" /><circle cx="34" cy="40" r="10" strokeDasharray="3 3" /><circle cx="48" cy="40" r="10" strokeDasharray="3 3" /><circle cx="62" cy="40" r="10" /><path d="M10 62 h62 M10 66 h62" /></>),
  '04': (<><path d="M40 10 l30 14 l-30 14 l-30 -14 z" /><path d="M10 38 l30 14 l30 -14" /><path d="M10 52 l30 14 l30 -14" /></>),
  '05': (<><path d="M40 70 v-30" /><circle cx="40" cy="34" r="5" /><path d="M28 22 q-8 12 0 24 M52 22 q8 12 0 24" /><path d="M18 12 q-16 22 0 44 M62 12 q16 22 0 44" /><path d="M28 70 h24" /></>),
}

/** Scene 03: the process as an anime production pipeline, on a strip of film. */
export default function Production() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const frames = root.current!.querySelectorAll<HTMLElement>('.frame')
    const anims = Array.from(frames, (frame) =>
      animate(svg.createDrawable(frame.querySelectorAll('.frame-art *')), {
        draw: ['0 0', '0 1'],
        duration: 1100,
        delay: stagger(90),
        ease: 'inOut(3)',
        autoplay: false,
      }),
    )
    // ScrollTrigger owns "when" (it is synced with Lenis); anime.js owns the line drawing
    const triggers = Array.from(frames, (frame, i) =>
      ScrollTrigger.create({ trigger: frame, start: 'top 85%', once: true, onEnter: () => anims[i].play() }),
    )
    return () => {
      triggers.forEach((t) => t.kill())
      anims.forEach((a) => a.revert())
    }
  }, [])

  return (
    <section id="production" ref={root} className="scene-production" aria-labelledby="production-title">
      <header className="section-head">
        <p className="mono kicker">CHAPTER 03 · 制作工程</p>
        <h2 id="production-title">The production line</h2>
        <p className="lede">How a project gets made, in the same order an anime studio makes an episode.</p>
      </header>
      <ol className="filmstrip">
        {steps.map((s) => (
          <li key={s.cut} className="frame">
            <p className="mono frame-cut">CUT {s.cut}</p>
            <svg className="frame-art" viewBox="0 0 80 80" aria-hidden="true">{art[s.cut]}</svg>
            <h3>{s.title}</h3>
            <p className="mono frame-phase">{s.phase}</p>
            <p>{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
