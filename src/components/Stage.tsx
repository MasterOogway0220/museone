import { useEffect, useRef, useState } from 'react'

/** Fixed, framed 3D studio behind the page. Loaded only in the browser; the page reads fine without it. */
export default function Stage() {
  const ref = useRef<HTMLCanvasElement>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading')

  useEffect(() => {
    let alive = true
    let dispose = () => {}
    import('../three/studio')
      .then(({ mountStudio }) => mountStudio(ref.current!))
      .then((d) => {
        if (!alive) return d()
        dispose = d
        setState('ready')
      })
      .catch((e) => {
        console.error('3D studio failed to start', e)
        if (alive) setState('failed')
      })
    return () => {
      alive = false
      dispose()
    }
  }, [])

  return (
    <div className={`stage is-${state}`} aria-hidden="true">
      <canvas ref={ref} />
      <span className="stage-label mono">MUSEONE STUDIO · LIVE</span>
    </div>
  )
}
