import { useGSAP } from '@gsap/react'
import { useRef, useState, type FormEvent } from 'react'
import { crew, serviceOptions } from '../content'
import type { SakugaButtonEl, SakugaToastEl } from '../custom-elements'
import { MOTION_OK, gsap, impact } from '../lib/motion'
import { Logo } from '../components/Logo'

type Errors = Partial<Record<'name' | 'email' | 'message', string>>
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Scene 06: contact form, then an ending-credits footer. */
export default function Ending() {
  const root = useRef<HTMLElement>(null)
  const btn = useRef<SakugaButtonEl>(null)
  const toast = useRef<SakugaToastEl>(null)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle')

  useGSAP(() => {
    gsap.matchMedia().add(MOTION_OK, () => {
      gsap.fromTo('.credits-roll', { yPercent: 30 }, {
        yPercent: -20, ease: 'none',
        scrollTrigger: { trigger: '.credits', start: 'top bottom', end: 'bottom bottom', scrub: true },
      })
    })
  }, { scope: root })

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'sending') return
    const form = e.currentTarget
    const data = new FormData(form)
    const body = {
      name: String(data.get('name') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      message: String(data.get('message') ?? '').trim(),
      services: data.getAll('services').map(String),
      website: String(data.get('website') ?? ''), // honeypot
    }
    const next: Errors = {}
    if (!body.name) next.name = 'Tell us your name.'
    if (!EMAIL.test(body.email)) next.email = 'We need an email address we can reply to.'
    if (body.message.length < 10) next.message = 'A sentence or two about the project, please.'
    setErrors(next)
    if (Object.keys(next).length) {
      form.querySelector<HTMLElement>('[aria-invalid="true"], [name="' + Object.keys(next)[0] + '"]')?.focus()
      return
    }

    setStatus('sending')
    if (btn.current) btn.current.disabled = true
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error(String(res.status))
      setStatus('sent')
      form.reset()
      btn.current?.done()
      toast.current?.show('Message sent!')
      impact('ドン')
    } catch {
      setStatus('failed')
    } finally {
      if (btn.current) btn.current.disabled = false
    }
  }

  const field = (name: keyof Errors) => ({
    name,
    id: `f-${name}`,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `e-${name}` : undefined,
  })

  return (
    <section id="ending" ref={root} className="scene-ending" aria-labelledby="ending-title">
      <div className="ending-inner">
        <header className="section-head">
          <p className="mono kicker">CHAPTER 06 · 最終回</p>
          <h2 id="ending-title">Final chapter: your project.</h2>
          <p className="lede">Tell us what you want to make. A real person from the crew reads every message and replies.</p>
        </header>

        <form className="contact" noValidate onSubmit={submit}>
          <div className="field">
            <label htmlFor="f-name">Your name</label>
            <input {...field('name')} type="text" autoComplete="name" maxLength={100} />
            {errors.name && <p id="e-name" className="field-error">{errors.name}</p>}
          </div>
          <div className="field">
            <label htmlFor="f-email">Email</label>
            <input {...field('email')} type="email" autoComplete="email" inputMode="email" maxLength={200} spellCheck={false} />
            {errors.email && <p id="e-email" className="field-error">{errors.email}</p>}
          </div>
          <fieldset className="field field-wide">
            <legend>What do you need? <span className="optional">(pick any)</span></legend>
            <div className="chips">
              {serviceOptions.map((s) => (
                <label key={s} className="chip"><input type="checkbox" name="services" value={s} /><span>{s}</span></label>
              ))}
            </div>
          </fieldset>
          <div className="field field-wide">
            <label htmlFor="f-message">About the project</label>
            <textarea {...field('message')} rows={5} maxLength={5000} placeholder="What it is, who it is for, and when you would like it live." />
            {errors.message && <p id="e-message" className="field-error">{errors.message}</p>}
          </div>
          {/* honeypot: real people never see or fill this */}
          <div className="hp" aria-hidden="true">
            <label htmlFor="f-website">Website</label>
            <input id="f-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>
          <div className="form-foot field-wide">
            <sakuga-button ref={btn} type="submit">{status === 'sending' ? 'Sending…' : 'Send it'}</sakuga-button>
            <p className="form-status" role="status">
              {status === 'sent' && 'Got it. We will reply by email.'}
              {status === 'failed' && 'That did not send. Please try again in a minute.'}
            </p>
          </div>
        </form>
      </div>

      <footer className="credits" aria-label="Credits">
        <div className="credits-roll">
          <Logo />
          <dl>
            <div><dt className="mono">CREW</dt>{crew.map((c) => <dd key={c.sheet}>{c.name} · {c.role}</dd>)}</div>
            <div><dt className="mono">SERVICES</dt>{serviceOptions.map((s) => <dd key={s}>{s}</dd>)}</div>
            <div><dt className="mono">BUILT WITH</dt><dd>Vite, React, GSAP, Lenis, anime.js</dd><dd>Buttons and toasts by sakuga-vfx (MIT)</dd></div>
          </dl>
          <p className="mono credits-end">© {new Date().getFullYear()} MUSEONE · 終</p>
        </div>
      </footer>
      <sakuga-toast ref={toast} className="toast-slot" />
    </section>
  )
}
