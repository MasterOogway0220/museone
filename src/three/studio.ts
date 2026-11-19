import * as THREE from 'three'
import { crew, steps } from '../content'
import { dashboardScreen, feed, nameTent, PAL, phoneApp, polaroid, searchSheet, sketch, skyline, stepCard, tabletApp, websiteScreen } from './textures'
import { INK, overlayOnly, ToonRenderer, toon } from './toon'

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z)
const box = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d)
const cyl = (rt: number, rb: number, h: number, s = 20) => new THREE.CylinderGeometry(rt, rb, h, s)
const at = <T extends THREE.Object3D>(o: T, x: number, y: number, z: number) => { o.position.set(x, y, z); return o }
const plane = (w: number, h: number, map: THREE.Texture, glow = true) => toon(new THREE.PlaneGeometry(w, h), '#fff', { map, glow, edges: 0, shadow: false })

const DESK_Y = 1.04

/** Camera framing for each section id (data-shot in the DOM). */
const SHOTS: Record<string, { pos: THREE.Vector3; look: THREE.Vector3 }> = {
  hero: { pos: V(6.8, 4.1, 7.8), look: V(-0.6, 1.5, -2.4) },
  web: { pos: V(0, 1.82, -0.75), look: V(0, 1.74, -3.1) },
  apps: { pos: V(3, 1.82, -0.8), look: V(3, 1.74, -3.1) },
  native: { pos: V(-2.2, 1.85, -0.55), look: V(-3.05, 1.25, -2.65) },
  seo: { pos: V(2.2, 3.15, -1.1), look: V(2.3, 3.2, -4.9) },
  social: { pos: V(1.3, 2.75, -1.2), look: V(1.3, DESK_Y, -1.95) },
  process: { pos: V(0, 3.9, -0.4), look: V(0, DESK_Y, -1.95) },
  team: { pos: V(0.4, 2.3, 3.4), look: V(0, 1.15, -1.6) },
  contact: { pos: V(-4.2, 2.6, 1.2), look: V(-12, 2.7, -0.4) },
}

function buildStudio() {
  const scene = new THREE.Scene()
  const live = { web: websiteScreen(), apps: dashboardScreen() }

  // room
  scene.add(at(toon(box(18, 0.2, 14), '#D9D2C2', { edges: 0 }), 0, -0.1, 0.5))
  scene.add(at(toon(box(16, 6.5, 0.3), PAL.paper), 0, 3.25, -5.15))
  // left wall with a big window opening (z -4..3, y 1.2..4.4)
  const wx = -8
  scene.add(at(toon(box(0.3, 1.2, 12), PAL.paper), wx, 0.6, 0.5))
  scene.add(at(toon(box(0.3, 2.1, 12), PAL.paper), wx, 5.45, 0.5))
  scene.add(at(toon(box(0.3, 3.2, 1.2), PAL.paper), wx, 2.8, -4.6))
  scene.add(at(toon(box(0.3, 3.2, 3.5), PAL.paper), wx, 2.8, 4.75))
  for (const z of [-1.7, 0.6]) scene.add(at(toon(box(0.18, 3.2, 0.12), INK), wx, 2.8, z))
  scene.add(at(toon(box(0.18, 0.1, 7), INK), wx, 3.1, -0.5))
  const sky = plane(30, 11.25, skyline())
  sky.rotation.y = Math.PI / 2
  scene.add(overlayOnly(at(sky, -20, 3.6, -0.5)))

  // shared desk for three
  const desk = toon(box(9.4, 0.08, 2.3), '#CDB89A')
  scene.add(at(desk, 0, DESK_Y - 0.04, -2.55))
  for (const x of [-4.5, 4.5]) for (const z of [-3.55, -1.55]) scene.add(at(toon(box(0.08, DESK_Y - 0.08, 0.08), INK), x, (DESK_Y - 0.08) / 2, z))

  const monitor = (x: number, tex: THREE.Texture) => {
    const g = new THREE.Group()
    g.add(at(toon(box(2.2, 1.3, 0.08), INK), 0, 0, 0))
    g.add(at(plane(2.08, 1.3 - 0.12, tex), 0, 0, 0.045))
    g.add(at(toon(box(0.12, 0.5, 0.08), INK), 0, -0.75, -0.06))
    g.add(at(toon(box(0.6, 0.04, 0.4), INK), 0, -0.98, 0))
    return at(g, x, DESK_Y + 0.98 - 0.28, -3.15)
  }
  scene.add(monitor(0, live.web.tex), monitor(3, live.apps.tex))
  // keyboards
  for (const x of [0, 3]) scene.add(at(toon(box(1.1, 0.04, 0.36), PAL.hi), x, DESK_Y + 0.02, -2.3))

  // mobile & desktop station: laptop + tablet + phone stand
  const laptop = new THREE.Group()
  laptop.add(toon(box(1.4, 0.05, 0.95), '#B8B4C8'))
  const lid = new THREE.Group()
  lid.add(at(toon(box(1.4, 0.92, 0.04), '#B8B4C8'), 0, 0.46, 0))
  lid.add(at(plane(1.3, 0.82, tabletApp()), 0, 0.46, 0.025))
  lid.position.set(0, 0.025, -0.47)
  lid.rotation.x = -0.25
  laptop.add(lid)
  scene.add(at(laptop, -3.3, DESK_Y + 0.025, -2.6))
  laptop.rotation.y = 0.25
  const phone = new THREE.Group()
  phone.add(toon(box(0.42, 0.84, 0.05), INK))
  phone.add(at(plane(0.38, 0.78, phoneApp()), 0, 0, 0.03))
  phone.rotation.set(-0.3, 0.35, 0)
  scene.add(at(phone, -2.45, DESK_Y + 0.42, -2.75))

  // social: a phone lying flat showing the feed
  const flat = new THREE.Group()
  flat.add(toon(box(0.44, 0.04, 0.88), INK))
  const f = plane(0.4, 0.82, feed())
  f.rotation.x = -Math.PI / 2
  flat.add(at(f, 0, 0.025, 0))
  flat.rotation.y = -0.2
  scene.add(at(flat, 1.3, DESK_Y + 0.02, -1.95))

  // process: five step cards across the front of the desk
  steps.forEach((s, i) => {
    const c = plane(0.62, 0.41, stepCard(i + 1, s.title), false)
    c.rotation.set(-Math.PI / 2, 0, (i - 2) * 0.05)
    c.receiveShadow = true
    scene.add(at(c, -1.45 + i * 0.72, DESK_Y + 0.006, -1.78))
  })

  // team: name tents in front of each station, one chair each
  ;[-3, 0, 3].forEach((x, i) => {
    const tent = plane(0.7, 0.27, nameTent(crew[i].name, crew[i].role), false)
    tent.rotation.x = -0.35
    scene.add(at(tent, x + 1.05, DESK_Y + 0.13, -2.75))
    const chair = new THREE.Group()
    chair.add(at(toon(box(0.75, 0.1, 0.7), PAL.cobalt), 0, 0.72, 0))
    chair.add(at(toon(box(0.75, 0.8, 0.08), PAL.cobalt), 0, 1.15, 0.35))
    chair.add(at(toon(cyl(0.05, 0.05, 0.6, 8), INK), 0, 0.4, 0))
    chair.add(at(toon(cyl(0.38, 0.38, 0.05, 5), INK), 0, 0.08, 0))
    chair.rotation.y = (i - 1) * -0.25
    scene.add(at(chair, x, 0, -0.9))
  })

  // pinboard on the back wall: SEO results, sketches, social polaroids
  scene.add(at(toon(box(4, 2, 0.06), '#C9A982'), 2.2, 3.35, -4.97))
  const pins: [THREE.Object3D, number, number, number][] = [
    [plane(0.95, 1.27, searchSheet(), false), 2.3, 3.25, 0.04],
    [plane(0.9, 0.67, sketch('home page'), false), 0.9, 3.75, -0.06],
    [plane(0.9, 0.67, sketch('checkout'), false), 0.95, 2.95, 0.05],
    [plane(0.45, 0.53, polaroid(PAL.cobalt), false), 3.45, 3.85, 0.08],
    [plane(0.45, 0.53, polaroid(PAL.accent), false), 3.75, 3.2, -0.07],
    [plane(0.45, 0.53, polaroid(PAL.ink), false), 3.3, 2.75, 0.05],
  ]
  for (const [m, x, y, r] of pins) {
    m.rotation.z = r
    scene.add(at(m, x, y, -4.92))
    scene.add(at(toon(new THREE.SphereGeometry(0.035, 8, 6), PAL.accent, { edges: 0 }), x, y + 0.28, -4.88))
  }

  // shelf, books, plants, lamp, mugs, rug
  scene.add(at(toon(box(2.6, 0.06, 0.4), '#CDB89A'), -3.2, 3.1, -4.8))
  const books = ['#2346C8', '#E2462C', '#16161D', '#E4DCCB', '#2346C8', '#8E8A86']
  books.forEach((c, i) => scene.add(at(toon(box(0.12, 0.42 + (i % 3) * 0.08, 0.3), c), -4.2 + i * 0.16, 3.33 + (i % 3) * 0.04, -4.8)))
  const potPlant = (x: number, z: number, s: number) => {
    const g = new THREE.Group()
    g.add(at(toon(cyl(0.32, 0.25, 0.6), PAL.hi, { edges: 0, hull: 0.02 }), 0, 0.3, 0))
    for (let i = 0; i < 7; i++) {
      const leaf = toon(new THREE.SphereGeometry(0.42, 8, 6), '#7FA27C', { edges: 0, hull: 0.02 })
      leaf.scale.set(0.35, 1, 0.12)
      leaf.position.set(Math.cos(i) * 0.18, 0.95 + (i % 3) * 0.15, Math.sin(i) * 0.18)
      leaf.rotation.set(Math.sin(i) * 0.6, i, Math.cos(i) * 0.5)
      g.add(leaf)
    }
    g.scale.setScalar(s)
    return at(g, x, 0, z)
  }
  scene.add(potPlant(6.2, -4.3, 1.6), potPlant(-6.8, -4.4, 1.3))
  scene.add(at(toon(cyl(0.4, 0.4, 0.04, 6), INK), -1.5, DESK_Y + 0.02, -3.2))
  const lampArm = at(toon(cyl(0.03, 0.03, 1.1, 8), INK), -1.35, DESK_Y + 0.55, -3.2)
  lampArm.rotation.z = -0.3
  scene.add(lampArm)
  const shade = at(toon(new THREE.ConeGeometry(0.28, 0.32, 20, 1, true), PAL.accent, { edges: 0, hull: 0.015 }), -1.05, DESK_Y + 1.05, -3.1)
  shade.rotation.z = -0.9
  scene.add(shade)
  for (const [x, z] of [[-0.9, -2.0], [2.1, -2.2], [4.0, -2.0]]) scene.add(at(toon(cyl(0.11, 0.1, 0.24), PAL.hi, { edges: 0, hull: 0.012 }), x, DESK_Y + 0.12, z))
  scene.add(at(toon(box(7, 0.02, 4.5), '#E4DCCB', { edges: 0 }), 0, 0.01, 0.2))

  return {
    scene,
    update(shotPos: Record<string, number>, f: number) {
      // screens build themselves as their shot approaches
      live.web.set(1 - Math.abs(f - shotPos.web) * 1.1 + 0.6)
      live.apps.set(1 - Math.abs(f - shotPos.apps) * 1.1 + 0.6)
    },
  }
}

/** Mount the studio into a canvas. Camera follows the [data-shot] sections in DOM order. Returns cleanup. */
export async function mountStudio(canvas: HTMLCanvasElement) {
  const fonts = ['600 40px "Bricolage Grotesque"', '700 40px "Bricolage Grotesque"', '20px "JetBrains Mono"', '40px "Caveat"']
  await Promise.race([Promise.all(fonts.map((f) => document.fonts.load(f))), new Promise((r) => setTimeout(r, 2500))])

  const tr = new ToonRenderer(canvas)
  const { scene, update } = buildStudio()
  const light = { amb: new THREE.AmbientLight('#ffffff', 0.55), sun: new THREE.DirectionalLight('#ffffff', 2.9) }
  light.sun.castShadow = true
  light.sun.shadow.mapSize.set(2048, 2048)
  Object.assign(light.sun.shadow.camera, { left: -11, right: 11, top: 9, bottom: -9, near: 1, far: 60 })
  light.sun.shadow.bias = -0.0005
  light.sun.shadow.normalBias = 0.02
  light.sun.position.copy(V(-1, 0.5, 0.75).normalize().multiplyScalar(30))
  light.sun.target.position.set(0, 1, -1)
  scene.add(light.amb, light.sun, light.sun.target)

  const cam = new THREE.PerspectiveCamera(38, 1, 0.05, 200)
  const bg = new THREE.Color(PAL.paper)
  const shade = new THREE.Color(PAL.cobalt)
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

  let ids: string[] = []
  let centers: number[] = []
  let pathPos = new THREE.CatmullRomCurve3([V(0, 0, 0), V(0, 0, 1)])
  let pathLook = pathPos
  const shotPos: Record<string, number> = {}
  const measure = () => {
    const els = [...document.querySelectorAll<HTMLElement>('[data-shot]')].filter((el) => SHOTS[el.dataset.shot!])
    ids = els.map((el) => el.dataset.shot!)
    centers = els.map((el) => el.getBoundingClientRect().top + scrollY + el.offsetHeight / 2)
    ids.forEach((id, i) => (shotPos[id] = i))
    pathPos = new THREE.CatmullRomCurve3(ids.map((id) => SHOTS[id].pos), false, 'centripetal')
    pathLook = new THREE.CatmullRomCurve3(ids.map((id) => SHOTS[id].look), false, 'centripetal')
    const r = canvas.getBoundingClientRect()
    tr.setSize(r.width, r.height)
    cam.aspect = r.width / r.height
    cam.fov = cam.aspect < 1 ? 58 : 38
    cam.updateProjectionMatrix()
  }
  measure()
  const ro = new ResizeObserver(measure)
  ro.observe(document.body)

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
  const onMove = (e: PointerEvent) => { pointer.tx = e.clientX / innerWidth - 0.5; pointer.ty = e.clientY / innerHeight - 0.5 }
  addEventListener('pointermove', onMove, { passive: true })

  const smootherstep = (x: number) => x * x * x * (x * (x * 6 - 15) + 10)
  let fs = 0
  let raf = 0
  let visible = true
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
  io.observe(canvas)
  const t0 = performance.now()
  const frame = () => {
    raf = requestAnimationFrame(frame)
    if (!visible || document.hidden || ids.length < 2) return
    const y = scrollY + innerHeight / 2
    let f = 0
    if (y >= centers[centers.length - 1]) f = centers.length - 1
    else if (y > centers[0]) {
      const i = centers.findIndex((c, k) => y >= c && y < centers[k + 1])
      f = i + (y - centers[i]) / (centers[i + 1] - centers[i])
    }
    fs = reduce ? f : fs + (f - fs) * 0.08
    const i = Math.min(Math.floor(fs), ids.length - 2)
    const k = smootherstep(Math.min(1, fs - i)) // dwell on each shot, glide between them
    const t = (i + k) / (ids.length - 1)
    const intro = reduce ? 0 : Math.max(0, 1 - (performance.now() - t0) / 2600)
    pointer.x += (pointer.tx - pointer.x) * 0.05
    pointer.y += (pointer.ty - pointer.y) * 0.05
    cam.position.copy(pathPos.getPoint(t))
    cam.position.x += pointer.x * 0.25 + intro * intro * 3
    cam.position.y += -pointer.y * 0.12 + intro * intro * 2
    cam.position.z += intro * intro * 4
    cam.lookAt(pathLook.getPoint(t))
    update(shotPos, fs)
    tr.render(scene, cam, bg, shade, (performance.now() - t0) / 1000)
  }
  frame()

  return () => {
    cancelAnimationFrame(raf)
    ro.disconnect()
    io.disconnect()
    removeEventListener('pointermove', onMove)
    tr.dispose()
  }
}
