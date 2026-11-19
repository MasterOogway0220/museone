/** MuseOne mark: an M drawn as one folded line inside a square, with a single accent dot. */
export function Mark({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <rect x="1.5" y="1.5" width="37" height="37" rx="3" fill="var(--cobalt)" />
      <path d="M9 30V11l11 12 11-12v19" fill="none" stroke="var(--paper-hi)" strokeWidth="3.4" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx="31" cy="31" r="2.6" fill="var(--accent)" />
    </svg>
  )
}

export function Logo() {
  return (
    <span className="logo">
      <Mark className="logo-mark" />
      <span className="logo-word">MuseOne</span>
    </span>
  )
}
