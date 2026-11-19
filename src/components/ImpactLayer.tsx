/** Target of impact(): an invert flash with a burst and a katakana sound effect. */
export default function ImpactLayer() {
  return (
    <div id="impact" className="impact" aria-hidden="true">
      <svg className="impact-burst" viewBox="-100 -100 200 200" preserveAspectRatio="xMidYMid slice">
        {Array.from({ length: 36 }, (_, i) => {
          const a = (i / 36) * Math.PI * 2
          const r1 = 18 + (i % 3) * 9
          const s = 0.05
          return (
            <polygon
              key={i}
              points={`${Math.cos(a) * r1},${Math.sin(a) * r1} ${Math.cos(a - s) * 160},${Math.sin(a - s) * 160} ${Math.cos(a + s) * 160},${Math.sin(a + s) * 160}`}
            />
          )
        })}
      </svg>
      <span className="impact-word">ドン</span>
    </div>
  )
}
