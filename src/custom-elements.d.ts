import type { DetailedHTMLProps, HTMLAttributes } from 'react'

type El<T = object> = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & T

// sakuga-vfx web components (public/sakuga-vfx, MIT)
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'sakuga-button': El<{ type?: 'submit' | 'button'; variant?: 'secondary'; disabled?: boolean }>
      'sakuga-toast': El<{ duration?: string }>
    }
  }
}

export interface SakugaButtonEl extends HTMLElement { done(ms?: number): void; disabled: boolean }
export interface SakugaToastEl extends HTMLElement { show(msg?: string): void; hide(): void }
