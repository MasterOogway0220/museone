import { useState, type FormEvent } from 'react'
import { services } from '../content'

type Errors = Partial<Record<'name' | 'email' | 'message', string>>
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ContactForm() {
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle')

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
    const first = Object.keys(next)[0]
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error(String(res.status))
      setStatus('sent')
      form.reset()
    } catch {
      setStatus('failed')
    }
  }

  const field = (name: keyof Errors) => ({
    name,
    id: `f-${name}`,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `e-${name}` : undefined,
  })

  return (
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
        <legend>What do you need?</legend>
        <div className="chips">
          {services.map((s) => (
            <label key={s.id} className="chip"><input type="checkbox" name="services" value={s.title} /><span>{s.title}</span></label>
          ))}
        </div>
      </fieldset>
      <div className="field field-wide">
        <label htmlFor="f-message">About the project</label>
        <textarea {...field('message')} rows={4} maxLength={5000} placeholder="What it is, who it is for, and when you would like it live." />
        {errors.message && <p id="e-message" className="field-error">{errors.message}</p>}
      </div>
      <div className="hp" aria-hidden="true">
        <label htmlFor="f-website">Website</label>
        <input id="f-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="form-foot field-wide">
        <button className="btn" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send message'}</button>
        <p className="form-status" role="status">
          {status === 'sent' && 'Got it. We will reply by email.'}
          {status === 'failed' && 'That did not send. Please try again in a minute.'}
        </p>
      </div>
    </form>
  )
}
