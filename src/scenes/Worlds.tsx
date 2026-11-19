import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import { worlds } from '../content'
import { DESKTOP, MOTION_OK, ScrollTrigger, gsap, speed } from '../lib/motion'
import WorldVisual from './WorldVisual'

/** Scene 02: one world per service. Desktop: pinned sideways track. Mobile and reduced motion: a vertical stack. */
export default function Worlds() {
  const root = useRef<HTMLElement>(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    const items = gsap.utils.toArray<HTMLElement>('.world')
    const stamp = (el: HTMLElement) => {
      el.classList.add('is-live')
      gsap.fromTo(el.querySelector('.world-sfx'), { scale: 2.6, rotation: -18, autoAlpha: 0 }, { scale: 1, rotation: -8, autoAlpha: 1, duration: 0.3, ease: 'steps(3)' })
    }

    mm.add(`${MOTION_OK} and ${DESKTOP}`, () => {
      const track = root.current!.querySelector<HTMLElement>('.worlds-track')!
      const distance = () => track.scrollWidth - innerWidth
      const slide = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: '.worlds-pin',
          pin: true,
          start: 'top top',
          end: () => `+=${distance()}`,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => { speed.velocity = Math.max(speed.velocity, Math.min(0.55, Math.abs(self.getVelocity()) / 5000)) },
        },
      })
      items.forEach((el) => {
        ScrollTrigger.create({ trigger: el, containerAnimation: slide, start: 'left 60%', once: true, onEnter: () => stamp(el) })
      })
    })

    mm.add(`${MOTION_OK} and (max-width: 899px)`, () => {
      items.forEach((el) => ScrollTrigger.create({ trigger: el, start: 'top 70%', once: true, onEnter: () => stamp(el) }))
    })
  }, { scope: root })

  return (
    <section id="worlds" ref={root} className="scene-worlds" aria-labelledby="worlds-title">
      <div className="worlds-pin">
        <div className="worlds-track">
          <header className="worlds-head">
            <p className="mono kicker">CHAPTER 02 · 五つの世界</p>
            <h2 id="worlds-title">Five worlds.<br />One crew.</h2>
            <p className="lede">Everything a brand needs to exist online, made by the same three people so it all looks and works like one thing.</p>
            <p className="mono hint" aria-hidden="true">KEEP SCROLLING →</p>
          </header>
          {worlds.map((w, i) => (
            <article key={w.kind} className={`world world-${w.kind}`} aria-labelledby={`world-${w.kind}`}>
              <div className="world-text">
                <p className="world-no mono">{String(i + 1).padStart(2, '0')} / 05</p>
                <p className="world-jp" aria-hidden="true">{w.jp}</p>
                <h3 id={`world-${w.kind}`}>{w.title}</h3>
                <p>{w.body}</p>
                <ul className="world-tags">{w.tags.map((t) => <li key={t} className="mono">{t}</li>)}</ul>
              </div>
              <div className="world-visual" aria-hidden={w.kind !== 'seo'}>
                <WorldVisual kind={w.kind} />
              </div>
              <span className="world-sfx" aria-hidden="true">{w.sfx}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
