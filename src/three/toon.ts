import * as THREE from 'three'

// Raw hex in, raw hex out: no colour management, so palette values render exactly.
THREE.ColorManagement.enabled = false

export const INK = '#14121A'
const LINE_LAYER = 1
const inkLine = new THREE.LineBasicMaterial({ color: INK })

function hull(th: number) {
  const m = new THREE.MeshBasicMaterial({ color: INK, side: THREE.BackSide })
  m.onBeforeCompile = (s) => {
    s.vertexShader = s.vertexShader.replace('#include <begin_vertex>', `vec3 transformed = position + normal * ${th.toFixed(4)};`)
  }
  return m
}

type ToonOpts = { edges?: number; hull?: number; map?: THREE.Texture; glow?: boolean; shadow?: boolean }

/** A cel-shaded mesh: flat albedo + ink edge lines (+ optional silhouette hull). Lighting happens in the light pass. */
export function toon(geo: THREE.BufferGeometry, color: string, o: ToonOpts = {}) {
  const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: o.map ? '#ffffff' : color, map: o.map ?? null, transparent: false }))
  mesh.castShadow = o.shadow !== false
  mesh.receiveShadow = true
  mesh.userData.glow = !!o.glow
  if (o.edges !== 0) {
    const e = new THREE.LineSegments(new THREE.EdgesGeometry(geo, o.edges ?? 25), inkLine)
    e.layers.set(LINE_LAYER)
    mesh.add(e)
  }
  if (o.hull) {
    const h = new THREE.Mesh(geo, hull(o.hull))
    h.layers.set(LINE_LAYER)
    mesh.add(h)
  }
  return mesh
}

/** Something only the colour pass sees (light beams, sun discs, fading sheets). */
export function overlayOnly(obj: THREE.Object3D) {
  obj.traverse((c) => c.layers.set(LINE_LAYER))
  return obj
}

export function canvasTex(w: number, h: number, draw: (g: CanvasRenderingContext2D, w: number, h: number) => void) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  draw(c.getContext('2d')!, w, h)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.NoColorSpace
  t.anisotropy = 4
  return t
}

const post = {
  vert: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }',
  frag: /* glsl */ `
    uniform sampler2D tA; uniform sampler2D tL; uniform vec3 shade; uniform float time; uniform vec2 res;
    varying vec2 vUv;
    float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    void main(){
      vec3 a = texture2D(tA, vUv).rgb;
      float L = texture2D(tL, vUv).r;
      float lit = smoothstep(.36, .46, L);
      vec3 sh = mix(shade, a * shade * 1.6, .32);     // shadows go to the cel colour, tinted by the surface
      vec3 col = mix(sh, a, lit);
      float ink = step(dot(a, vec3(.333)), .1);        // ink lines stay ink
      col = mix(col, a, ink);
      float g = h(floor(vUv * res) + fract(time) * 91.7) - .5;
      col += g * .075;                                 // paper grain
      gl_FragColor = vec4(col, 1.);
    }`,
}

/**
 * Two passes per frame: colour (flat albedo, lines, glows) and light (white Lambert + shadow maps).
 * A post shader thresholds the light into two tones, which is what makes it read as cel animation.
 */
export class ToonRenderer {
  renderer: THREE.WebGLRenderer
  private rtA: THREE.WebGLRenderTarget
  private rtL: THREE.WebGLRenderTarget
  private lightMat = new THREE.MeshLambertMaterial({ color: '#ffffff' })
  private glowMat = new THREE.MeshBasicMaterial({ color: '#ffffff' })
  private white = new THREE.Color('#ffffff')
  private quadScene = new THREE.Scene()
  private quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  uniforms = {
    tA: { value: null as THREE.Texture | null },
    tL: { value: null as THREE.Texture | null },
    shade: { value: new THREE.Color('#2B4BD9') },
    time: { value: 0 },
    res: { value: new THREE.Vector2(1, 1) },
  }

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' })
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFShadowMap
    this.rtA = new THREE.WebGLRenderTarget(1, 1, { samples: 4 })
    this.rtL = new THREE.WebGLRenderTarget(1, 1, { samples: 2 })
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ uniforms: this.uniforms, vertexShader: post.vert, fragmentShader: post.frag, depthTest: false }))
    this.quadScene.add(quad)
  }

  setSize(w: number, h: number) {
    const dpr = Math.min(devicePixelRatio, 1.5)
    this.renderer.setPixelRatio(dpr)
    this.renderer.setSize(w, h, false)
    this.rtA.setSize(w * dpr, h * dpr)
    this.rtL.setSize(w * dpr, h * dpr)
    this.uniforms.res.value.set(w * dpr, h * dpr)
  }

  render(scene: THREE.Scene, cam: THREE.Camera, bg: THREE.Color, shade: THREE.Color, t: number) {
    const r = this.renderer
    // colour pass
    cam.layers.enableAll()
    scene.background = bg
    r.setRenderTarget(this.rtA)
    r.render(scene, cam)
    // light pass: swap materials, hide lines/overlays
    cam.layers.set(0)
    scene.background = this.white
    const swapped: [THREE.Mesh, THREE.Material | THREE.Material[]][] = []
    scene.traverse((o) => {
      const m = o as THREE.Mesh
      if (m.isMesh && m.layers.isEnabled(0)) {
        swapped.push([m, m.material])
        m.material = m.userData.glow ? this.glowMat : this.lightMat
      }
    })
    r.setRenderTarget(this.rtL)
    r.render(scene, cam)
    for (const [m, mat] of swapped) m.material = mat
    cam.layers.enableAll()
    // composite
    this.uniforms.tA.value = this.rtA.texture
    this.uniforms.tL.value = this.rtL.texture
    this.uniforms.shade.value.copy(shade)
    this.uniforms.time.value = t
    r.setRenderTarget(null)
    r.render(this.quadScene, this.quadCam)
  }

  dispose() {
    this.rtA.dispose()
    this.rtL.dispose()
    this.renderer.dispose()
  }
}

/** Deterministic random so every reload builds the same world. */
export function rng(seed: number) {
  let s = seed
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646
}
