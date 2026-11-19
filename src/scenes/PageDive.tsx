import { useGSAP } from '@gsap/react'
import { useRef, type MouseEvent } from 'react'
import { DESKTOP, MOTION_OK, ScrollTrigger, gsap, impact, scrollToId, speed } from '../lib/motion'

/**
 * Scene 01: a still manga page. Scrolling pushes the camera into the centre panel,
 * the other panels are thrown off, paper turns to ink, and we land in the world.
 */
export default function PageDive({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)

  // Intro: panels stamp in on twos once the loader is gone
  useGSAP(() => {
    if (!ready) return
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      gsap.timeline()
        .from('.panel', { autoAlpha: 0, y: 40, rotation: (i) => (i % 2 ? 4 : -4), stagger: 0.12, duration: 0.42, ease: 'steps(4)' })
        .from('.balloon', { scale: 0.6, autoAlpha: 0, duration: 0.3, ease: 'steps(3)' }, '-=0.2')
        .from('.hero-actions > *', { autoAlpha: 0, y: 12, stagger: 0.08, duration: 0.25, ease: 'steps(3)' }, '-=0.1')
    })
  }, { scope: root, dependencies: [ready] })

  // The dive
  useGSAP(() => {
    const mm = gsap.matchMedia()
    const html = document.documentElement

    mm.add({ motion: MOTION_OK, reduce: '(prefers-reduced-motion: reduce)', desktop: DESKTOP }, (ctx) => {
      if (!ctx.conditions?.motion) {
        // Reduced motion: no pin. Just flip the header colours once the paper is behind us.
        ScrollTrigger.create({ trigger: '.spread', start: 'bottom 40%', onToggle: (s) => html.classList.toggle('is-deep', s.isActive), end: 'max' })
        return
      }
      html.classList.add('motion-ok')
      const win = root.current!.querySelector<HTMLElement>('.panel-window')!
      // Layout geometry (ignores transforms), measured while pinned at the top of the viewport
      const cover = () => {
        const r = { left: win.offsetLeft, top: win.offsetTop, width: win.offsetWidth, height: win.offsetHeight }
        return { r, s: Math.max(innerWidth / r.width, innerHeight / r.height) * 1.15 }
      }

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: '.dive-pin',
          pin: true,
          start: 'top top',
          end: ctx.conditions.desktop ? '+=240%' : '+=170%',
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => html.classList.toggle('is-deep', self.progress > 0.38),
          onLeaveBack: () => html.classList.remove('is-deep'),
        },
      })

      tl.to(speed, { dive: 1, duration: 0.45 }, 0.05)
        .to('.panel-a', { xPercent: -130, yPercent: 10, rotation: -9, skewX: 8, duration: 0.4 }, 0.05)
        .to('.panel-b', { yPercent: -160, rotation: 7, skewY: -6, duration: 0.4 }, 0.08)
        .to('.panel-d', { yPercent: 260, rotation: -4, duration: 0.4 }, 0.06)
        .to(win, {
          x: () => { const { r } = cover(); return innerWidth / 2 - (r.left + r.width / 2) },
          y: () => { const { r } = cover(); return innerHeight / 2 - (r.top + r.height / 2) },
          scale: () => cover().s,
          rotation: 0,
          duration: 0.45,
          ease: 'power2.in',
        }, 0.05)
        .to('.paper-bg', { autoAlpha: 0, duration: 0.2 }, 0.3)
        .call(() => impact('ドン'), [], 0.5)
        .to('.window-inner', { autoAlpha: 0, duration: 0.08 }, 0.5)
        .to(speed, { dive: 0.15, duration: 0.3 }, 0.55)
        .fromTo('.dive-copy .dive-line', { autoAlpha: 0, y: 60, scale: 1.3 }, { autoAlpha: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.18, ease: 'steps(4)' }, 0.56)
        .to({}, { duration: 0.25 }) // hold the shot before unpinning
        .to(speed, { dive: 0, duration: 0.1 })

      return () => {
        html.classList.remove('motion-ok', 'is-deep')
        speed.dive = 0
      }
    })
  }, { scope: root })

  const go = (id: string) => (e: MouseEvent) => { e.preventDefault(); scrollToId(id) }

  return (
    <section id="page" ref={root} className="scene-page" aria-labelledby="hero-title">
      <div className="dive-pin">
        <div className="paper-bg" aria-hidden="true" />
        <div className="spread">
          <div className="panel panel-a">
            <p className="mono panel-caption">EP.00 · 作画 · A STUDIO OF THREE</p>
            <div className="balloon">
              <h1 id="hero-title">Still pages get scrolled past.</h1>
            </div>
            <p className="hero-sub">
              MuseOne is a three-person studio. We design and build websites, web apps, and mobile and desktop apps, then run the SEO and social that bring people to them.
            </p>
            <div className="hero-actions">
              <a className="btn-seal" href="#ending" onClick={go('ending')}>Start a project</a>
              <a className="btn-line" href="#worlds" onClick={go('worlds')}>Dive in ↓</a>
            </div>
          </div>
          <div className="panel panel-b" aria-hidden="true">
            <span className="sfx-big">ゴゴゴ</span>
            <span className="tone-fade" />
          </div>
          <div className="panel panel-window" aria-hidden="true">
            <div className="window-inner">
              <span className="window-stars" />
              <span className="mono window-label">↓ 次へ · NEXT</span>
            </div>
          </div>
          <div className="panel panel-d" aria-hidden="true">
            <span className="mono">SCROLL TO TURN THE PAGE</span>
            <span className="scroll-arrow">↓</span>
          </div>
        </div>
        <div className="dive-copy">
          <p className="dive-line dive-big">So we draw every frame.</p>
          <p className="dive-line dive-small">Design, code and motion from the same three people, from the first sketch to launch day.</p>
        </div>
      </div>
    </section>
  )
}
