# Style lock — MuseOne
Locked: 2026-11-19 (cold start, no profile, no prior builds)
Source: hand-directed from brief ("anime / sakuga, Awwwards scroll, dive into the world") + sakuga-vfx study. Generator runs (playful/dark seeds 11, 23) were rejected: lavender/purple too close to both AI-default gradients and the reference's own palette.

## Direction contract
- Thesis: a still manga page becomes a moving world as you scroll. The studio turns static into alive.
- First viewport: printed manga spread on cream paper, one speech-balloon headline, one red CTA.
- System: custom aesthetic lane; sakuga-vfx web components for form controls, restyled via --sk-* vars.
- Risk: heavy motion costs usability points; every scene must read fine with reduced motion.
- Aesthetic mode: none.

## Color contract (two depths, one --depth variable interpolates between them)
Paper: text #14121A · bg #F2ECDF · surface #E6DECD · primary #D7331F · on-primary #FFF8EC · accent #2B4BD9 · border #14121A
Ink:   text #F2ECDF · bg #09080F · surface #14121D · primary #FF4A2E · on-primary #09080F · accent #7FA8FF · border #2A2735

Paper text-safe: text/bg, text/surface, primary/on-primary (button), accent/bg, accent/surface
Paper UI-safe only: primary on bg (3.87–4.07) -> red is for large display, impact, icons; NOT body links
Ink text-safe: text/bg, text/surface, primary/bg, accent/bg, accent/surface, primary/on-primary
Ink decorative only: border vs bg (1.37) -> hairlines are decorative; state borders use accent
Mid-dive (interpolated) text must be re-checked at depth 0.5 or text swaps at a threshold, never sits on a mid-grey.

## Type
Display: Dela Gothic One (Latin + katakana SFX) · Body: Zen Kaku Gothic New · Data: JetBrains Mono
Scale (fluid): 14 / 16 / 20 / 28 / 44 / 72 / clamp(64px, 12vw, 200px) for scene titles

## Density & spacing
4px base. Tokens 4 8 12 16 24 32 48 64 96 128 192. Card padding >= 24. Pivotal scenes 128–192 vertical; connective 64–96.

## Shape
Hard ink borders 2–3px, near-zero radius (0–4px) for panels; speech balloons are the only round shapes. No soft shadows: depth = offset ink shadow (4px 4px 0 border colour) or screentone.

## Motion
Camera: Lenis + ScrollTrigger scrub (smooth). Characters/SFX: steps() "on twos". Impact frame <= 120ms, max one per viewport. UI hover/press: 120–200ms, ease-out, pointer-gated. Reduced motion: final states, no pins.

## Assets
Illustration: code-native SVG linework + screentone first; commissioned or generated art swapped in per scene later (pending user decision). Icons: Iconify, one set. Logo: to build (hanko seal + speed-line M).
