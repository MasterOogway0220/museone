import type { WorldKind } from '../content'

/** Code-drawn mockups, one per service. Final state is the static state; .is-live plays the build-up. */
export default function WorldVisual({ kind }: { kind: WorldKind }) {
  switch (kind) {
    case 'web':
      return (
        <div className="mock mock-browser">
          <div className="mock-bar"><i /><i /><i /><span className="mock-url mono">yourbrand.com</span></div>
          <div className="mock-page">
            <span className="a blk blk-hero" />
            <span className="a blk blk-line w70" />
            <span className="a blk blk-line w45" />
            <span className="a blk blk-btn" />
            <span className="a blk blk-img tone" />
            <div className="blk-row"><span className="a blk" /><span className="a blk" /><span className="a blk" /></div>
          </div>
        </div>
      )
    case 'app':
      return (
        <div className="mock mock-dash">
          <div className="dash-side">{[0, 1, 2, 3, 4].map((i) => <span key={i} className={`a ${i === 1 ? 'on' : ''}`} />)}</div>
          <div className="dash-main">
            <div className="dash-tiles">{[0, 1, 2].map((i) => <span key={i} className="a tile"><b /><i /></span>)}</div>
            <div className="dash-chart">
              {[38, 62, 45, 80, 56, 92, 70, 100].map((h, i) => <span key={i} className="a bar" style={{ height: `${h}%` }} />)}
            </div>
            <div className="dash-rows">{[0, 1, 2].map((i) => <span key={i} className="a row" />)}</div>
          </div>
        </div>
      )
    case 'native':
      return (
        <div className="mock mock-devices">
          <div className="device-desk">
            <div className="mock-bar"><i /><i /><i /></div>
            <div className="desk-body">
              <div className="desk-side">{[0, 1, 2, 3].map((i) => <span key={i} className="a" />)}</div>
              <div className="desk-list">{[0, 1, 2, 3].map((i) => <span key={i} className="a item"><i /><b /></span>)}</div>
            </div>
          </div>
          <div className="device-phone">
            <span className="notch" />
            {[0, 1, 2, 3].map((i) => <span key={i} className="a item"><i /><b /></span>)}
            <span className="a fab" />
          </div>
        </div>
      )
    case 'seo':
      return (
        <figure className="mock mock-serp">
          <div className="serp-search mono">your service in your city<span className="caret" /></div>
          <ol className="serp-list">
            <li className="serp-you a"><span className="mono">yourbrand.com</span><b>Your brand, the answer they were looking for</b><i /></li>
            <li><span className="mono">competitor.com</span><b /><i /></li>
            <li><span className="mono">directory.com</span><b /><i /></li>
            <li><span className="mono">another-site.com</span><b /><i /></li>
          </ol>
          <figcaption className="mono">Illustration, not a ranking promise</figcaption>
        </figure>
      )
    case 'social':
      return (
        <div className="mock mock-grid">
          {Array.from({ length: 9 }, (_, i) => (
            <span key={i} className={`a post post-${i % 4}`}>{i === 4 && <span className="play" />}</span>
          ))}
          <span className="heart">♥</span>
        </div>
      )
  }
}
