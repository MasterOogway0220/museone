/** Hanko seal with an M cut from two speed-line wedges. */
export function Seal({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="29" fill="var(--seal)" />
      <circle cx="32" cy="32" r="24" fill="none" stroke="var(--paper)" strokeWidth="2.5" />
      <path d="M16 46 L24 18 L32 36 L40 18 L48 46 L42 46 L39 33 L32 48 L25 33 L22 46 Z" fill="var(--paper)" />
    </svg>
  )
}

export function Logo() {
  return (
    <span className="logo">
      <Seal className="logo-seal" />
      <span className="logo-word">MuseOne</span>
    </span>
  )
}
