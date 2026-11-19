import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

export const MOTION_OK = '(prefers-reduced-motion: no-preference)'
export const DESKTOP = '(min-width: 900px)'

let lenis: Lenis | null = null

/** Lenis smooth scroll driven by GSAP's ticker so ScrollTrigger stays in sync. Returns cleanup. */
export function startSmoothScroll() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}
  lenis = new Lenis()
  lenis.on('scroll', ScrollTrigger.update)
  const tick = (time: number) => lenis?.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  return () => {
    gsap.ticker.remove(tick)
    lenis?.destroy()
    lenis = null
  }
}

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el)
  else el.scrollIntoView({ behavior: 'auto' })
}

/** Smoothly scroll to an absolute Y, through Lenis when it is running. */
export function scrollToY(y: number, duration = 1.6) {
  if (lenis) lenis.scrollTo(y, { duration })
  else window.scrollTo({ top: y, behavior: 'smooth' })
}

export function lockScroll(locked: boolean) {
  if (locked) lenis?.stop()
  else lenis?.start()
  document.documentElement.classList.toggle('scroll-locked', locked)
}

/** Shared state for the speed-line canvas. `dive` is set by the dive timeline, `velocity` by fast scrolling. */
export const speed = { dive: 0, velocity: 0 }

let lastImpact = 0
/** One impact frame: a 2-frame invert + burst. Throttled so it never strobes. */
export function impact(word = 'ドン') {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const now = performance.now()
  if (now - lastImpact < 700) return
  lastImpact = now
  const el = document.getElementById('impact')
  if (!el) return
  el.querySelector('.impact-word')!.textContent = word
  el.classList.remove('is-on')
  void el.offsetWidth // restart the CSS animation
  el.classList.add('is-on')
}
