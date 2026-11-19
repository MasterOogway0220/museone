import * as THREE from 'three'
import { animSheet, billboard, dashboard, facade, phoneScreen, searchSheet, storyboard, stripes, type Pal } from './textures'
import { INK, overlayOnly, rng, toon } from './toon'

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z)
const box = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d)
const cyl = (rt: number, rb: number, h: number, s = 20) => new THREE.CylinderGeometry(rt, rb, h, s)
const at = <T extends THREE.Object3D>(o: T, v: THREE.Vector3) => { o.position.copy(v); return o }
const smooth = (a: number, b: number, x: number) => THREE.MathUtils.smoothstep(x, a, b)

export type Beat = { from: number; to: number; kind: 'intro' | 'service' | 'end'; i?: number; sfx?: string }
export type Built = {
  scene: THREE.Scene
  path: THREE.Vector3[]
  look: THREE.Vector3[]
  update: (p: number, t: number) => void
  bg: (p: number) => THREE.Color
  shade: (p: number) => THREE.Color
  /** scroll range where the camera free-falls (drives the speed lines) */
  dive?: [number, number]
}
export type WorldDef = { id: 'a' | 'b' | 'c'; name: string; blurb: string; pal: Pal; ui: { page: string; ink: string }; beats: Beat[]; build: () => Built }

function rig(scene: THREE.Scene, dir: THREE.Vector3, span = 22) {
  scene.add(new THREE.AmbientLight('#ffffff', 0.55))
  const sun = new THREE.DirectionalLight('#ffffff', 2.8)
  sun.castShadow = true
  sun.shadow.mapSize.set(2048, 2048)
  Object.assign(sun.shadow.camera, { left: -span, right: span, top: span, bottom: -span, near: 1, far: 120 })
  sun.shadow.bias = -0.0006
  sun.shadow.normalBias = 0.03
  scene.add(sun, sun.target)
  const d = dir.clone().normalize()
  return (focus: THREE.Vector3) => {
    sun.target.position.copy(focus)
    sun.position.copy(focus).addScaledVector(d, 50)
  }
}

function heart(color: string) {
  const g = new THREE.Group()
  const s = new THREE.SphereGeometry(0.62, 18, 14)
  const a = toon(s, color, { edges: 0, hull: 0.05 }); a.position.set(-0.45, 0.3, 0)
  const b = toon(s, color, { edges: 0, hull: 0.05 }); b.position.set(0.45, 0.3, 0)
  const c = toon(new THREE.ConeGeometry(0.95, 1.4, 18), color, { edges: 0, hull: 0.05 }); c.rotation.z = Math.PI; c.position.y = -0.55
  g.add(a, b, c)
  return g
}

function lighthouse(p: Pal, h: number) {
  const g = new THREE.Group()
  const body = toon(cyl(h * 0.1, h * 0.15, h), p.paper, { edges: 0, hull: 0.04 }); body.position.y = h / 2
  g.add(body)
  for (let i = 0; i < 3; i++) {
    const band = toon(cyl(h * 0.112 + i * 0.012, h * 0.118 + i * 0.012, h * 0.08), p.accent, { edges: 0 })
    band.position.y = h * (0.25 + i * 0.22)
    g.add(band)
  }
  const room = toon(cyl(h * 0.12, h * 0.12, h * 0.12), '#fff6dd', { edges: 0, hull: 0.03, glow: true }); room.position.y = h * 1.06
  const roof = toon(new THREE.ConeGeometry(h * 0.15, h * 0.16, 20), p.accent, { edges: 0, hull: 0.03 }); roof.position.y = h * 1.2
  const beam = new THREE.Mesh(new THREE.ConeGeometry(h * 0.35, h * 2.2, 24, 1, true), new THREE.MeshBasicMaterial({ color: '#fff6dd', transparent: true, opacity: 0.28, side: THREE.DoubleSide, depthWrite: false }))
  beam.rotation.z = Math.PI / 2
  beam.position.x = h * 1.1
  const pivot = new THREE.Group()
  pivot.position.y = h * 1.06
  pivot.add(overlayOnly(beam))
  g.add(room, roof, pivot)
  g.userData.pivot = pivot
  return g
}

/* ------------------------------------------------------------------ A */
const palA: Pal = { paper: '#F7E9D7', accent: '#E2462C', cel: '#3B2C8F', soft: '#F3B98F' }
const worldA: WorldDef = {
  id: 'a',
  name: 'A · Storyboard → anime city',
  blurb: 'Dive through a storyboard panel into a cel-shaded city at dusk. Each service is a landmark.',
  pal: palA,
  ui: { page: '#F3E3CF', ink: INK },
  beats: [
    { from: 0, to: 0.1, kind: 'intro' },
    { from: 0.29, to: 0.38, kind: 'service', i: 0, sfx: 'ドン' },
    { from: 0.42, to: 0.52, kind: 'service', i: 1, sfx: 'バン' },
    { from: 0.55, to: 0.63, kind: 'service', i: 2, sfx: 'ズン' },
    { from: 0.65, to: 0.75, kind: 'service', i: 3, sfx: 'ピン' },
    { from: 0.79, to: 0.88, kind: 'service', i: 4, sfx: 'ポン' },
    { from: 0.93, to: 1.01, kind: 'end' },
  ],
  build() {
    const p = palA
    const scene = new THREE.Scene()
    const desk = new THREE.Group()
    desk.add(at(toon(box(16, 0.8, 10), '#D9C7AE'), V(0, -0.4, 0)))
    const sheetMat = new THREE.MeshBasicMaterial({ map: storyboard(p), transparent: true })
    const sheet = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 4.27), sheetMat)
    sheet.rotation.x = -Math.PI / 2
    sheet.position.y = 0.02
    sheet.receiveShadow = true
    desk.add(sheet)
    const pencil = toon(cyl(0.09, 0.09, 3.2, 6), p.accent); pencil.rotation.set(0, 0.5, Math.PI / 2); pencil.position.set(4.3, 0.1, 2.3)
    const mug = toon(cyl(0.6, 0.55, 1.3), p.paper, { edges: 0, hull: 0.03 }); mug.position.set(-5.2, 0.65, -2.4)
    const loose = toon(box(3, 0.02, 2), '#FBF4EA'); loose.rotation.y = -0.3; loose.position.set(5.4, 0.01, -2.6)
    desk.add(pencil, mug, loose)
    scene.add(desk)

    // the city, far below the sheet
    const Y = -60
    const city = new THREE.Group()
    city.position.y = Y
    city.add(at(toon(box(140, 1, 140), '#E9D9C4', { edges: 0 }), V(0, -0.5, -30)))
    const r = rng(42)
    const spots: [number, number][] = [[-8, -8], [8, -18], [-8, -28], [10, -38], [0, -50]]
    const tex = [facade('#F7E9D7'), facade('#EAD5BD'), facade('#F3B98F')]
    for (let x = -30; x <= 30; x += 5) for (let z = 10; z >= -70; z -= 5) {
      if (spots.some(([sx, sz]) => Math.hypot(sx - x, sz - z) < 6.5)) continue
      if (Math.abs(x) < 3 && z < 0 && z > -46) continue // flight corridor
      const h = 2 + r() * (Math.abs(x) > 14 ? 10 : 6)
      const b = toon(box(3.4, h, 3.4), '#fff', { map: tex[Math.floor(r() * 3)] })
      b.position.set(x, h / 2, z)
      city.add(b)
    }
    // 1 websites: billboard building
    const bb = toon(box(5, 7, 5), '#fff', { map: tex[0] }); bb.position.set(-8, 3.5, -8)
    const board = toon(box(7.4, 3.8, 0.25), '#fff', { map: billboard(p, 'ウェブ', 'Websites'), glow: true }); board.position.set(-8, 9.6, -7); board.rotation.y = 0.35
    city.add(bb, board)
    // 2 web apps: control room with a big screen
    const cr = toon(box(7, 5, 6), p.paper); cr.position.set(8, 2.5, -18)
    const scr = toon(box(5.6, 3.4, 0.15), '#fff', { map: dashboard(p), glow: true }); scr.position.set(8, 3, -14.9)
    city.add(cr, scr)
    // 3 mobile & desktop: phone tower
    const tw = toon(box(3.4, 15, 1.4), INK); tw.position.set(-8, 7.5, -28)
    const tws = toon(box(3, 13.4, 0.1), '#fff', { map: phoneScreen(p), glow: true }); tws.position.set(-8, 7.6, -27.25)
    const ant = toon(cyl(0.06, 0.06, 4, 6), INK); ant.position.set(-8, 17, -28)
    const tip = toon(new THREE.SphereGeometry(0.35, 12, 10), p.accent, { edges: 0, glow: true }); tip.position.set(-8, 19, -28)
    city.add(tw, tws, ant, tip)
    // 4 seo: lighthouse
    const lh = lighthouse(p, 9); lh.position.set(10, 0, -38)
    city.add(lh)
    // 5 social: plaza + crowd + heart balloon
    const plaza = toon(cyl(7, 7, 0.3, 40), '#F3E3CF', { edges: 0 }); plaza.position.set(0, 0.15, -50)
    city.add(plaza)
    const crowdCols = [p.paper, p.accent, p.cel, '#D9C7AE']
    for (let i = 0; i < 34; i++) {
      const a = r() * Math.PI * 2, d = 1.5 + r() * 4.8
      const c = toon(new THREE.CapsuleGeometry(0.28, 0.6, 4, 8), crowdCols[i % 4], { edges: 0, hull: 0.03 })
      c.position.set(Math.cos(a) * d, 0.75, -50 + Math.sin(a) * d)
      city.add(c)
    }
    const balloon = heart(p.accent); balloon.position.set(0, 8, -50)
    city.add(balloon)
    // sun
    const sunDisc = overlayOnly(new THREE.Mesh(new THREE.CircleGeometry(16, 48), new THREE.MeshBasicMaterial({ color: '#F06A3B' })))
    sunDisc.position.set(0, 6, -150)
    city.add(sunDisc)
    scene.add(city)

    const follow = rig(scene, V(0.35, 0.55, -0.8))
    const roomBg = new THREE.Color('#E8D9C6'), sky = new THREE.Color('#F3B98F')
    const look = [V(0, 0, 0), V(0, 0, 0.3), V(0, 0, 0), V(0, Y, -6), V(-8, Y + 9, -8), V(8, Y + 4, -18), V(8, Y + 3, -16), V(-8, Y + 10, -28), V(10, Y + 7, -38), V(10, Y + 9, -38), V(0, Y + 3, -50), V(0, Y + 4, -52), V(0, Y + 5, -100)]
    return {
      scene,
      dive: [0.15, 0.27],
      path: [V(0, 10, 9), V(0, 6.5, 4), V(0.2, 2.2, 0.6), V(0, -30, 0.5), V(-2, Y + 11, 0), V(1, Y + 10, -8), V(2, Y + 6, -11), V(-1, Y + 12, -20), V(3, Y + 10, -29), V(4, Y + 9, -33), V(2, Y + 10, -42), V(0, Y + 16, -36), V(0, Y + 24, -26)],
      look,
      update(pr, t) {
        const fade = 1 - smooth(0.155, 0.185, pr)
        sheetMat.opacity = fade
        sheet.layers.set(fade < 1 ? 1 : 0)
        desk.visible = pr < 0.19
        city.visible = pr > 0.12
        lh.userData.pivot.rotation.y = t * 0.8
        balloon.position.y = 8 + Math.sin(t * 1.5) * 0.4
        follow(pr < 0.19 ? V(0, 0, 0) : V(0, Y, -28 + 0 * pr))
      },
      bg: (pr) => roomBg.clone().lerp(sky, smooth(0.16, 0.22, pr)),
      shade: () => new THREE.Color(p.cel),
    }
  },
}

/* ------------------------------------------------------------------ B */
const palB: Pal = { paper: '#F4F1E6', accent: '#FF5A3C', cel: '#2F55D4', soft: '#9CC3F0' }
const worldB: WorldDef = {
  id: 'b',
  name: 'B · Floating island',
  blurb: 'Descend through the clouds to a floating island in an anime sky. The camera orbits one structure per service.',
  pal: palB,
  ui: { page: '#DCE7F5', ink: INK },
  beats: [
    { from: 0, to: 0.12, kind: 'intro' },
    { from: 0.24, to: 0.36, kind: 'service', i: 0, sfx: 'ドン' },
    { from: 0.4, to: 0.52, kind: 'service', i: 1, sfx: 'バン' },
    { from: 0.55, to: 0.63, kind: 'service', i: 2, sfx: 'ズン' },
    { from: 0.65, to: 0.77, kind: 'service', i: 3, sfx: 'ピン' },
    { from: 0.8, to: 0.9, kind: 'service', i: 4, sfx: 'ポン' },
    { from: 0.94, to: 1.01, kind: 'end' },
  ],
  build() {
    const p = palB
    const scene = new THREE.Scene()
    const island = new THREE.Group()
    island.add(at(toon(cyl(10, 10, 1, 11), '#DDE5C4'), V(0, -0.5, 0)))
    const rock = toon(new THREE.ConeGeometry(10, 13, 11), '#D8CDBB'); rock.rotation.x = Math.PI; rock.position.y = -7.5
    island.add(rock)
    // 1 websites: easel screen
    const easel = new THREE.Group()
    easel.add(at(toon(box(0.15, 3.4, 0.15), INK), V(-1.5, 1.7, 0)), at(toon(box(0.15, 3.4, 0.15), INK), V(1.5, 1.7, 0)))
    easel.add(at(toon(box(3.6, 2.2, 0.12), '#fff', { map: billboard(p, 'ウェブ', 'Websites'), glow: true }), V(0, 2.4, 0.1)))
    easel.position.set(-5, 0, 1); easel.rotation.y = 0.35
    // 2 web apps: observatory
    const obs = new THREE.Group()
    obs.add(at(toon(cyl(1.7, 1.7, 2.2), p.paper, { edges: 0, hull: 0.03 }), V(0, 1.1, 0)))
    obs.add(at(toon(new THREE.SphereGeometry(1.75, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), p.cel, { edges: 0, hull: 0.03 }), V(0, 2.2, 0)))
    obs.add(at(toon(box(2.6, 1.6, 0.1), '#fff', { map: dashboard(p), glow: true }), V(0, 1.3, 1.75)))
    obs.position.set(4, 0, -4); obs.rotation.y = -0.5
    // 3 mobile: phone monolith
    const mono = new THREE.Group()
    mono.add(at(toon(box(1.6, 3.6, 0.4), INK), V(0, 1.8, 0)))
    mono.add(at(toon(box(1.4, 3.2, 0.05), '#fff', { map: phoneScreen(p), glow: true }), V(0, 1.8, 0.21)))
    mono.position.set(6, 0, 3); mono.rotation.y = -0.6
    // 4 seo: lighthouse on the edge
    const lh = lighthouse(p, 5); lh.position.set(-7, 0, -5)
    // 5 social: lanterns + heart
    const plaza = new THREE.Group()
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2
      const post = toon(cyl(0.07, 0.07, 1.6, 6), INK); post.position.set(Math.cos(a) * 2.2, 0.8, Math.sin(a) * 2.2)
      const lan = toon(cyl(0.28, 0.28, 0.5, 10), p.accent, { edges: 0, hull: 0.02, glow: true }); lan.position.set(Math.cos(a) * 2.2, 1.8, Math.sin(a) * 2.2)
      plaza.add(post, lan)
    }
    const balloon = heart(p.accent); balloon.position.y = 4.5; balloon.scale.setScalar(0.8)
    plaza.add(balloon)
    plaza.position.set(0, 0, 5.5)
    island.add(easel, obs, mono, lh, plaza)
    // trees
    const r = rng(9)
    for (let i = 0; i < 16; i++) {
      const a = r() * Math.PI * 2, d = 3 + r() * 6
      const x = Math.cos(a) * d, z = Math.sin(a) * d
      if ([[-5, 1], [4, -4], [6, 3], [-7, -5], [0, 5.5]].some(([sx, sz]) => Math.hypot(sx - x, sz - z) < 2.6)) continue
      const tr = toon(new THREE.ConeGeometry(0.7, 1.8, 7), '#9DB98A', { hull: 0.03 }); tr.position.set(x, 1.1, z)
      island.add(tr)
    }
    // waterfall
    const fall = toon(new THREE.PlaneGeometry(2, 16), '#fff', { map: stripes('#EAF2FB', '#BCD3EF'), edges: 0, shadow: false }); fall.position.set(9.9, -7.5, 1.5); fall.rotation.y = Math.PI / 2
    island.add(fall)
    scene.add(island)
    // clouds + floating rocks
    const cloudGeo = new THREE.SphereGeometry(1, 16, 12)
    for (let i = 0; i < 26; i++) {
      const c = new THREE.Group()
      const a = r() * Math.PI * 2, d = 15 + r() * 22
      for (let k = 0; k < 4; k++) {
        const s = toon(cloudGeo, '#FFFDF7', { edges: 0, hull: 0.05, shadow: false })
        s.scale.setScalar(1.4 + r() * 1.6); s.position.set(k * 1.8 - 2.7, r() * 0.8, r() * 1.2)
        c.add(s)
      }
      c.position.set(Math.cos(a) * d, -14 + r() * 26, Math.sin(a) * d)
      scene.add(c)
    }
    for (let i = 0; i < 6; i++) {
      const fr = toon(new THREE.ConeGeometry(1 + r() * 1.4, 2.5 + r() * 2, 7), '#D8CDBB'); fr.rotation.x = Math.PI
      const a = r() * Math.PI * 2; fr.position.set(Math.cos(a) * 15, -3 + r() * 6, Math.sin(a) * 15)
      scene.add(fr)
    }
    const sunDisc = overlayOnly(new THREE.Mesh(new THREE.CircleGeometry(14, 48), new THREE.MeshBasicMaterial({ color: '#FFE7B0' })))
    sunDisc.position.set(-40, 20, -120)
    scene.add(sunDisc)

    const follow = rig(scene, V(0.6, 0.8, 0.3), 16)
    const sky = new THREE.Color('#A9C8F0'), dusk = new THREE.Color('#F6C3A6')
    return {
      scene,
      dive: [0.02, 0.18],
      path: [V(0, 28, 44), V(16, 16, 30), V(18, 5, 16), V(2, 3.5, 9), V(-1, 3, 6), V(1, 4, 1.5), V(3.5, 3.5, 1.8), V(10, 3, 6), V(-1, 5.5, 1), V(-12, 6.5, 3), V(-4, 3.5, 12), V(6, 2, 16), V(0, 4, 30)],
      look: [V(0, 0, 0), V(0, -2, 0), V(0, 0, 0), V(-5, 1.5, 1), V(-5, 1.6, 1), V(4, 1.6, -4), V(4, 1.4, -4), V(6, 1.8, 3), V(-7, 3, -5), V(-7, 3, -5), V(0, 2, 5.5), V(0, 2.5, 5.5), V(0, 1, 0)],
      update(_pr, t) {
        lh.userData.pivot.rotation.y = t * 0.9
        balloon.position.y = 4.5 + Math.sin(t * 1.4) * 0.3
        island.position.y = Math.sin(t * 0.5) * 0.15
        follow(V(0, 0, 0))
      },
      bg: (pr) => sky.clone().lerp(dusk, smooth(0.86, 1, pr)),
      shade: () => new THREE.Color(p.cel),
    }
  },
}

/* ------------------------------------------------------------------ C */
const palC: Pal = { paper: '#F4E3C3', accent: '#E8402A', cel: '#1E1B3A', soft: '#7FA8FF' }
const worldC: WorldDef = {
  id: 'c',
  name: "C · Animator's night desk",
  blurb: 'Everything happens on one desk at night: pencil sheets become key frames, then screens light up with the work.',
  pal: palC,
  ui: { page: '#15132A', ink: '#F4E3C3' },
  beats: [
    { from: 0, to: 0.1, kind: 'intro' },
    { from: 0.3, to: 0.4, kind: 'service', i: 0, sfx: 'ドン' },
    { from: 0.45, to: 0.53, kind: 'service', i: 1, sfx: 'バン' },
    { from: 0.56, to: 0.63, kind: 'service', i: 2, sfx: 'ズン' },
    { from: 0.65, to: 0.77, kind: 'service', i: 3, sfx: 'ピン' },
    { from: 0.8, to: 0.88, kind: 'service', i: 4, sfx: 'ポン' },
    { from: 0.94, to: 1.01, kind: 'end' },
  ],
  build() {
    const p = palC
    const scene = new THREE.Scene()
    scene.add(at(toon(box(40, 0.2, 30), '#3A3456', { edges: 0 }), V(0, -4, 0)))
    scene.add(at(toon(box(40, 20, 0.2), '#4B4470', { edges: 0 }), V(0, 5, -6.2)))
    const win = overlayOnly(new THREE.Mesh(new THREE.PlaneGeometry(6, 4), new THREE.MeshBasicMaterial({ color: '#7FA8FF' })))
    win.position.set(-8, 6, -6.05)
    scene.add(win)
    scene.add(at(toon(box(15, 0.8, 8.5), '#C9A982'), V(0, -0.4, -1.5)))
    // light table + onion-skin sheets
    const table = new THREE.Group()
    table.add(toon(box(6, 0.3, 4.6), '#E9DCC3'))
    const disc = toon(cyl(2, 2, 0.06, 40), '#FFF8E8', { edges: 0, glow: true }); disc.position.y = 0.17
    const peg = toon(box(3.6, 0.12, 0.3), INK); peg.position.set(0, 0.25, -1.9)
    table.add(disc, peg)
    table.position.set(-2, 0.45, -0.8); table.rotation.x = 0.32
    scene.add(table)
    const sheets = [0, 1, 2].map((i) => {
      const s = toon(new THREE.PlaneGeometry(3.6, 2.6), '#fff', { map: animSheet(p, i), glow: true, shadow: false })
      scene.add(s)
      return s
    })
    // laptop, phone, lamp, cup, wall sheet
    const laptop = new THREE.Group()
    laptop.add(toon(box(3.4, 0.14, 2.3), '#9C98B8'))
    const lid = new THREE.Group()
    lid.add(at(toon(box(3.4, 2.2, 0.1), '#9C98B8'), V(0, 1.1, 0)))
    const lapScreen = toon(new THREE.PlaneGeometry(3.1, 1.95), '#fff', { map: billboard(p, 'ウェブ', 'Websites'), glow: true, edges: 0 })
    lapScreen.position.set(0, 1.1, 0.06)
    lid.add(lapScreen)
    lid.position.set(0, 0.07, -1.1); lid.rotation.x = -0.22
    laptop.add(lid)
    laptop.position.set(4.6, 0.07, 0.2); laptop.rotation.y = -0.35
    scene.add(laptop)
    const siteTex = billboard(p, 'ウェブ', 'Websites'), dashTex = dashboard(p)
    const phone = new THREE.Group()
    phone.add(toon(box(1, 1.95, 0.12), INK))
    const phScreen = toon(new THREE.PlaneGeometry(0.88, 1.8), '#fff', { map: phoneScreen(p), glow: true, edges: 0 }); phScreen.position.z = 0.065
    phone.add(phScreen)
    phone.position.set(7.2, 1, -1.6); phone.rotation.set(-0.25, -0.5, 0)
    scene.add(phone)
    const appTex = phoneScreen(p), socialTex = phoneScreen(p, true)
    const lamp = new THREE.Group()
    lamp.add(toon(cyl(0.7, 0.8, 0.25), INK))
    const arm1 = toon(cyl(0.07, 0.07, 3.4, 8), INK); arm1.position.set(0.6, 1.6, 0); arm1.rotation.z = -0.35
    const shadeCone = toon(new THREE.ConeGeometry(0.9, 1.1, 20, 1, true), p.accent, { edges: 0, hull: 0.03 }); shadeCone.position.set(1.6, 3.2, 0.3); shadeCone.rotation.z = -0.9
    const bulb = toon(new THREE.SphereGeometry(0.3, 12, 10), '#FFF3D0', { edges: 0, glow: true }); bulb.position.set(1.8, 2.9, 0.3)
    lamp.add(arm1, shadeCone, bulb)
    lamp.position.set(-6.4, 0, -3.4)
    scene.add(lamp)
    const cup = toon(cyl(0.5, 0.45, 1.1), p.cel, { edges: 0, hull: 0.03 }); cup.position.set(1.6, 0.55, -3.6)
    scene.add(cup)
    for (let i = 0; i < 4; i++) { const pc = toon(cyl(0.05, 0.05, 2, 6), [p.accent, '#F4E3C3', '#7FA8FF', p.accent][i]); pc.position.set(1.5 + (i - 1.5) * 0.15, 1.6, -3.6); pc.rotation.z = (i - 1.5) * 0.15; scene.add(pc) }
    const wallSheet = toon(new THREE.PlaneGeometry(2.4, 3.2), '#fff', { map: searchSheet(p), glow: true, edges: 0 }); wallSheet.position.set(2, 3.2, -6.05)
    const pin = toon(new THREE.SphereGeometry(0.12, 8, 6), p.accent, { edges: 0 }); pin.position.set(2, 4.7, -6)
    scene.add(wallSheet, pin)

    // the lamp is the key light: warm pool from upper left
    const follow = rig(scene, V(-0.6, 0.9, 0.35), 12)
    const night = new THREE.Color('#15132A')
    const flat = [V(-2.2, 0.85, -0.6), V(-2, 0.88, -0.75), V(-1.8, 0.91, -0.9)]
    const stand = [V(-5.6, 1.9, -3), V(-3.2, 1.9, -3.2), V(-0.8, 1.9, -3)]
    const q0 = new THREE.Euler(-Math.PI / 2 + 0.32, 0, 0), q1 = new THREE.Euler(0, 0, 0)
    return {
      scene,
      path: [V(0, 7, 12), V(-1, 5, 6), V(-1.6, 3.4, 2.2), V(-1.2, 3.2, 5.5), V(2.6, 2.6, 4.2), V(4.2, 2, 3.2), V(4, 1.8, 2.8), V(8.8, 1.9, 1.2), V(3.4, 3.4, 0.6), V(2.4, 3.2, -2.2), V(8.6, 1.7, 0.9), V(0, 5, 6), V(0, 10, 2.5)],
      look: [V(0, 1, -1), V(-2, 0.6, -0.8), V(-2, 0.6, -0.8), V(-2, 1.8, -3), V(4.6, 1.2, -0.6), V(4.6, 1.2, -0.6), V(4.6, 1.2, -0.6), V(7.2, 1, -1.6), V(2, 3.1, -6), V(2, 3.2, -6), V(7.2, 1, -1.6), V(0, 0.5, -1.5), V(0, 0, -1.4)],
      update(pr, t) {
        const k = smooth(0.18, 0.28, pr)
        sheets.forEach((s, i) => {
          s.position.lerpVectors(flat[i], stand[i], k)
          s.rotation.set(THREE.MathUtils.lerp(q0.x, q1.x, k), 0, THREE.MathUtils.lerp(0, (i - 1) * 0.18, k))
          s.position.y += Math.sin(t * 2 + i) * 0.03 * k
        })
        ;(lapScreen.material as THREE.MeshBasicMaterial).map = pr < 0.44 ? siteTex : dashTex
        ;(phScreen.material as THREE.MeshBasicMaterial).map = pr < 0.78 ? appTex : socialTex
        follow(V(0, 0, -1))
      },
      bg: () => night,
      shade: () => new THREE.Color(p.cel),
    }
  },
}

export const WORLDS = [worldA, worldB, worldC]
