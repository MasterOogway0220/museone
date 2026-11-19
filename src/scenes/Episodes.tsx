import type { MouseEvent } from 'react'
import { scrollToId } from '../lib/motion'

// Honest placeholders until real case studies exist. Replace with real projects, never invented ones.
const slots = ['01', '02', '03']

export default function Episodes() {
  const go = (e: MouseEvent) => { e.preventDefault(); scrollToId('ending') }
  return (
    <section id="episodes" className="scene-episodes" aria-labelledby="episodes-title">
      <header className="section-head">
        <p className="mono kicker">CHAPTER 04 · 作品</p>
        <h2 id="episodes-title">Episodes</h2>
        <p className="lede">Our case studies. The first ones are being written up now, and these slots are open.</p>
      </header>
      <ul className="episodes">
        {slots.map((no) => (
          <li key={no} className="episode">
            <a href="#ending" onClick={go}>
              <span className="episode-card">
                <span className="mono episode-no">EP.{no}</span>
                <span className="episode-jp" aria-hidden="true">次回予告</span>
                <span className="episode-title">Next episode</span>
                <span className="episode-body">This one could be yours. Tell us about your project →</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
