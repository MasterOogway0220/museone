import { useEffect, type MouseEvent } from 'react'
import { Head } from 'vite-react-ssg'
import ContactForm from './components/ContactForm'
import { Logo } from './components/Logo'
import Stage from './components/Stage'
import { crew, nav, services, steps } from './content'
import { scrollToId, startSmoothScroll } from './lib/motion'

const TITLE = 'MuseOne | Websites, apps, SEO and social media marketing'
const DESCRIPTION = 'MuseOne is a three-person studio that designs and builds websites, web apps, and mobile and desktop apps, then runs the SEO and social media marketing that bring people to them.'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'MuseOne',
  description: DESCRIPTION,
  makesOffer: services.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.title } })),
}

const go = (id: string) => (e: MouseEvent) => {
  e.preventDefault()
  scrollToId(id)
}

export default function Home() {
  useEffect(() => startSmoothScroll(), [])

  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Head>
      <a className="skip" href="#services">Skip to services</a>

      <header className="topbar">
        <a href="#top" onClick={go('top')} aria-label="MuseOne, back to the top"><Logo /></a>
        <nav aria-label="Main">
          <ul>
            {nav.map((n) => <li key={n.id}><a href={`#${n.id}`} onClick={go(n.id)}>{n.label}</a></li>)}
          </ul>
        </nav>
        <a className="btn btn-small" href="#contact" onClick={go('contact')}>Start a project</a>
      </header>

      <Stage />

      <main>
        <section id="top" className="shot shot-hero" data-shot="hero" aria-labelledby="hero-title">
          <div className="card card-hero">
            <p className="kicker mono">Design · Development · Marketing</p>
            <h1 id="hero-title">Still pages get scrolled past.</h1>
            <p className="lede">MuseOne is a three-person studio. We design and build websites, web apps, and mobile and desktop apps, then run the SEO and social that bring people to them.</p>
            <div className="actions">
              <a className="btn" href="#contact" onClick={go('contact')}>Start a project</a>
              <a className="btn btn-ghost" href="#services" onClick={go('services')}>See what we do</a>
            </div>
            <p className="note hand">this is our desk. scroll to look around ↘</p>
          </div>
        </section>

        <div id="services">
          {services.map((s, i) => (
            <section key={s.id} className="shot" data-shot={s.id} aria-labelledby={`svc-${s.id}`}>
              <div className="card">
                <p className="kicker mono">{String(i + 1).padStart(2, '0')} / 05 · Service</p>
                <h2 id={`svc-${s.id}`}>{s.title}</h2>
                <p>{s.body}</p>
                <ul className="tags">{s.tags.map((t) => <li key={t} className="mono">{t}</li>)}</ul>
                <p className="note hand">{s.note}</p>
              </div>
            </section>
          ))}
        </div>

        <section id="process" className="shot" data-shot="process" aria-labelledby="process-title">
          <div className="card card-wide">
            <p className="kicker mono">How a project runs</p>
            <h2 id="process-title">Five steps, one team, no hand-offs.</h2>
            <ol className="steps">
              {steps.map((s, i) => (
                <li key={s.title}>
                  <span className="mono">0{i + 1}</span>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="team" className="shot" data-shot="team" aria-labelledby="team-title">
          <div className="card">
            <p className="kicker mono">The team</p>
            <h2 id="team-title">Three people. No account managers in between.</h2>
            <p>You talk to the people who design, build and market your project.</p>
            <ul className="crew">
              {crew.map((c) => <li key={c.name}><strong>{c.name}</strong><span className="mono">{c.role}</span></li>)}
            </ul>
            <p className="note hand">three chairs, three people</p>
          </div>
        </section>

        <section id="contact" className="shot shot-contact" data-shot="contact" aria-labelledby="contact-title">
          <div className="card card-contact">
            <p className="kicker mono">Contact</p>
            <h2 id="contact-title">Tell us what you want to build.</h2>
            <p>A real person from the team reads every message and replies.</p>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="footer">
        <Logo />
        <p className="mono">Websites · Web apps · Mobile & desktop apps · SEO · Social media marketing</p>
        <p className="mono">© {new Date().getFullYear()} MuseOne</p>
      </footer>
    </>
  )
}
