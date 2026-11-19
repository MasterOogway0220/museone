import type { VercelRequest, VercelResponse } from '@vercel/node'

const SERVICES = ['Websites', 'Web apps', 'Mobile & desktop apps', 'SEO', 'Social media']
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type Contact = { name: string; email: string; message: string; services: string[] }

/** Validate untrusted form input. Returns the clean message or a list of problems. */
export function validate(input: unknown): { ok: true; value: Contact } | { ok: false; errors: string[] } {
  const b = (typeof input === 'object' && input) || {}
  const str = (k: string) => (typeof (b as Record<string, unknown>)[k] === 'string' ? ((b as Record<string, string>)[k]).trim() : '')
  const name = str('name').replace(/[\r\n]+/g, ' ')
  const email = str('email')
  const message = str('message')
  const raw = (b as Record<string, unknown>).services
  const services = Array.isArray(raw) ? raw.filter((s): s is string => typeof s === 'string' && SERVICES.includes(s)) : []
  const errors: string[] = []
  if (str('website')) errors.push('spam')
  if (!name || name.length > 100) errors.push('name')
  if (!EMAIL.test(email) || email.length > 200) errors.push('email')
  if (message.length < 10 || message.length > 5000) errors.push('message')
  return errors.length ? { ok: false, errors } : { ok: true, value: { name, email, message, services: [...new Set(services)] } }
}

// shortcut: in-memory rate limit is per function instance, so it resets on cold starts; move to Vercel KV/Upstash if spam shows up.
const hits = new Map<string, number[]>()
function limited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > 5
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' })
  const ip = String(req.headers['x-forwarded-for'] ?? '').split(',')[0] || 'unknown'
  if (limited(ip)) return res.status(429).json({ error: 'slow down' })

  const result = validate(req.body)
  if (!result.ok) {
    // Pretend success to bots so they don't retry; real users are validated client-side first.
    if (result.errors.includes('spam')) return res.status(200).json({ ok: true })
    return res.status(400).json({ error: result.errors })
  }

  const { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM } = process.env
  if (!RESEND_API_KEY || !CONTACT_TO || !CONTACT_FROM) return res.status(503).json({ error: 'email not configured' })

  const { name, email, message, services } = result.value
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: CONTACT_FROM,
      to: [CONTACT_TO],
      reply_to: email,
      subject: `New project enquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nServices: ${services.join(', ') || 'not specified'}\n\n${message}`,
    }),
  })
  if (!r.ok) {
    console.error('resend failed', r.status, await r.text())
    return res.status(502).json({ error: 'send failed' })
  }
  return res.status(200).json({ ok: true })
}
