import Lenis from 'lenis'

let lenis: Lenis | null = null

/** Lenis smooth scroll. Skipped for reduced motion. Returns cleanup. */
export function startSmoothScroll() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}
  lenis = new Lenis({ autoRaf: true })
  return () => {
    lenis?.destroy()
    lenis = null
  }
}

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { duration: 1.8 })
  else el.scrollIntoView()
}
