import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { chapters } from '../content'
import { lockScroll, scrollToId } from '../lib/motion'
import { Logo } from './Logo'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('page')
  const menuRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const frameRef = useRef<HTMLSpanElement>(null)

  // Which chapter is on screen + the frame counter. Measured on scroll/resize so it can't go stale after a refresh.
  useEffect(() => {
    let raf = 0
    const update = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        if (frameRef.current) frameRef.current.textContent = String(Math.round(scrollY / 6)).padStart(4, '0')
        let current: string = chapters[0].id
        for (const c of chapters) {
          const el = document.getElementById(c.id)
          if (el && el.getBoundingClientRect().top <= innerHeight / 2) current = c.id
        }
        setActive(current)
      })
    }
    update()
    addEventListener('scroll', update, { passive: true })
    addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('scroll', update)
      removeEventListener('resize', update)
    }
  }, [])

  // Menu: lock scroll, focus first link, Esc closes, Tab stays inside
  useEffect(() => {
    if (!open) return
    lockScroll(true)
    const menu = menuRef.current!
    const links = menu.querySelectorAll<HTMLElement>('a, button')
    links[0]?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
      if (e.key === 'Tab') {
        const first = links[0]
        const last = links[links.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    addEventListener('keydown', onKey)
    return () => {
      removeEventListener('keydown', onKey)
      lockScroll(false)
      toggleRef.current?.focus()
    }
  }, [open])

  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    // wait a frame so the unlock happens before the scroll
    requestAnimationFrame(() => scrollToId(id))
  }

  return (
    <>
      <header className="topbar">
        <a href="#page" onClick={go('page')} aria-label="MuseOne, back to the start"><Logo /></a>
        <div className="topbar-right">
          <a className="topbar-cta" href="#ending" onClick={go('ending')}>Start a project</a>
          <button ref={toggleRef} className="menu-toggle" aria-expanded={open} aria-controls="menu" onClick={() => setOpen((o) => !o)}>
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </header>

      <nav className="rail" aria-label="Chapters">
        <ol>
          {chapters.map((c) => (
            <li key={c.id}>
              <a href={`#${c.id}`} onClick={go(c.id)} aria-current={active === c.id ? 'true' : undefined}>
                <span className="rail-no">{c.no}</span>
                <span className="rail-label">{c.label}</span>
              </a>
            </li>
          ))}
        </ol>
        <p className="rail-frame mono" aria-hidden="true">FR <span ref={frameRef}>0000</span></p>
      </nav>

      <div ref={menuRef} id="menu" className={`menu${open ? ' is-open' : ''}`} hidden={!open}>
        <p className="mono menu-kicker">CONTENTS · 目次</p>
        <ol className="menu-list">
          {chapters.map((c) => (
            <li key={c.id}>
              <a href={`#${c.id}`} onClick={go(c.id)}>
                <span className="mono">{c.no}</span> {c.label}
              </a>
            </li>
          ))}
        </ol>
        <button className="menu-close mono" onClick={() => setOpen(false)}>Close ✕</button>
      </div>
    </>
  )
}
