import { crew } from '../content'

/** Scene 05: the three of us as character sheets. Silhouettes until the real portraits are in. */
export default function Crew() {
  return (
    <section id="crew" className="scene-crew" aria-labelledby="crew-title">
      <header className="section-head">
        <p className="mono kicker">CHAPTER 05 · 登場人物</p>
        <h2 id="crew-title">The crew</h2>
        <p className="lede">Three people. No account managers in between. You talk to the people who make the work.</p>
      </header>
      <ul className="crew">
        {crew.map((c) => (
          <li key={c.sheet} className="sheet-card">
            <p className="mono sheet-label">CHARACTER SHEET {c.sheet}</p>
            <svg className="silhouette" viewBox="0 0 120 120" role="img" aria-label={`Portrait of ${c.name} coming soon`}>
              <defs>
                <pattern id={`tone-${c.sheet}`} width="5" height="5" patternUnits="userSpaceOnUse">
                  <circle cx="2.5" cy="2.5" r="1.1" fill="currentColor" />
                </pattern>
              </defs>
              <path d="M60 18c-17 0-28 13-28 30 0 11 5 20 12 25-17 5-30 18-34 37h100c-4-19-17-32-34-37 7-5 12-14 12-25 0-17-11-30-28-30z" fill={`url(#tone-${c.sheet})`} stroke="currentColor" strokeWidth="2.5" />
            </svg>
            <h3>{c.name}</h3>
            <p className="sheet-role">{c.role}</p>
            <div className="move">
              <p className="mono move-label">SPECIAL MOVE</p>
              <p className="move-name">{c.move}</p>
              <p>{c.moveBody}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
