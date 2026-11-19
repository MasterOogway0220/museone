# PLAN — MuseOne agency site

## Task Card
**Goal (one sentence):** An immersive, scroll-driven agency site for MuseOne where scrolling feels like diving from the surface of a manga page down into an animated world, and every layer of the dive sells one thing the studio does.
**Why it matters / who uses it:** Founders, startups and small brands looking to hire a studio for websites, custom web apps, mobile/desktop apps, SEO and social media marketing. The site *is* the portfolio: if it moves like this, the visitor believes MuseOne can build theirs.
**Done-condition (checkable):**
- `npm run build` exits 0, typecheck + lint clean
- All 7 scenes render and scrub at 60fps on a mid-range laptop (Chrome perf trace, no long tasks > 50ms during scrub)
- Lighthouse mobile: Performance ≥ 85, Accessibility ≥ 95, SEO = 100, Best Practices ≥ 95
- `prefers-reduced-motion` renders a complete, readable static page (no pinned scrub, final states)
- Contact form submits and the message reaches the team inbox (verified with a real send)
- Playwright journey: load → scroll to bottom → open a case study → submit contact form, screenshots at 375 / 768 / 1440
**In scope:** one long-scroll home page (7 scenes), `/work/[slug]` case study template, contact form with real delivery, SEO/meta/OG, page transitions, mobile version of the dive.
**Out of scope (now):** CMS, blog, multi-language, client portal, pricing page, booking/calendar integration.
**Constraints:** public brand surface → design originality beats least-code (ponytail **lite** here). No invented metrics, clients or testimonials. No em dashes in shipped copy. Must be SEO-strong (MuseOne sells SEO, so its own site has to score).
**Unknowns / assumptions (stack: Vite + React + prerender, per user 2026-11-19):**
- ASK: real case studies / past projects we can show (names, screenshots, links)
- ASK: team names, roles, photos or avatar preference
- ASK: art source for anime illustration (see §Assets)
- ASSUME: Vite + React prerendered, static on Vercel, Resend for email, English only, dark-dominant site
**Risk level:** LOW (greenfield, nothing to break)
**Harness size:** STANDARD with a design evaluator pass per scene (the dive scene is at the edge: evaluate every slice)

## Ground truth
Empty folder, not a git repo. Tooling present: Node, Python 3.12, git, uv.
Reference studied: `finktheartist/sakuga-vfx` (MIT). 12 vanilla web-component controls (button, toggle, slider, checkbox, radio, input, tabs, progress, rating, toast, tooltip) that react like anime: spring squash/overshoot, one-frame invert on release, smear streaks, drawn bursts/crescents/clouds on a shared canvas, katakana SFX lettering (ドン!, カチッ, ズザッ). Themeable via `--sk-*` CSS vars, installable via `npx shadcn add finktheartist/sakuga-vfx/<name>`.

## The concept: "From the page to the world"
Sakuga (作画) means "drawing": the frames where an anime suddenly comes alive. That's the metaphor for the whole studio: **we turn a still page into something that moves.**
The scroll is a literal descent through **three depths**:
1. **Paper** (surface): a printed manga page. Cream paper, black ink, screentone, panel borders. Calm, static, readable.
2. **Linework** (mid-depth): the page tears into motion. Speed lines, smears, impact frames, panels flying past like keyframes on a lightbox.
3. **Ink** (the world): deep ink-black space, cel-shaded light, colour arrives. This is where the work lives.

The background literally transitions paper → ink as you scroll. One idea, carried by one variable (`--depth`, 0→1) that drives colour, grain, line density and speed.

## Design direction
**Mood:** playful-meets-editorial. Manga energy, studio restraint. Loud only at impact moments; quiet everywhere else.
**Palette (contrast-verified, see `.tastemaker/style-lock.md`):**
| Role | Paper (surface) | Ink (the world) |
|---|---|---|
| bg | `#F2ECDF` paper | `#09080F` ink |
| surface | `#E6DECD` | `#14121D` |
| text | `#14121A` | `#F2ECDF` |
| primary (impact / seal red) | `#D7331F` | `#FF4A2E` |
| accent (cel-shade blue) | `#2B4BD9` | `#7FA8FF` |
Two-colour discipline (ink + paper) with red reserved for impact frames and the one primary CTA. Blue is the "light" of the world, used sparingly.
**Type:**
- Display: **Dela Gothic One** (heavy, has real Japanese glyphs, so katakana SFX and Latin share one face)
- Body: **Zen Kaku Gothic New** (clean, Japanese-designed grotesk; not a framework default)
- Data/labels: **JetBrains Mono** for frame counters, timesheet numbers, episode codes
**Texture:** screentone halftone (CSS radial-gradient / SVG pattern), paper grain (tiny noise PNG), hand-feel ink borders (SVG with slight wobble). No glassmorphism, no purple gradients, no glow.
**Motion language (named, so every scene agrees):**
- **Hold frames:** UI motion runs "on twos": GSAP `steps()` easing for character-like elements (12fps feel), smooth easing only for camera/scroll. This is the signature that makes it feel animated, not "web-animated".
- **Impact frame:** 2–3 frame flash (invert + radial speed lines + SFX lettering) on key moments: dive start, each service arrival, CTA submit. Max one per viewport.
- **Smear:** fast elements stretch along their motion vector for one frame.
- **Camera:** Lenis smooth scroll + ScrollTrigger scrub = the camera. Pins are "shots".
- Reduced motion: no pins, no flashes, no smears. Final states, readable top to bottom.
**References for direction (ideas only, never layouts/copy/motion):** sakuga-vfx (component feel), Awwwards SOTD notes in `~/.claude/references/awwwards-notes.md` (scroll as main interaction, designed loader, two-colour palettes, page transitions). Gate: `audit-reference-originality` before ship.

## Structure (tastemaker Step 2.5)
**Macrostructure:** #4 Long-Scroll Narrative (the dive *is* the story). First build for this user, nothing to rotate against yet.
**Arc → scenes:**
| # | Scene | Beat | What happens on scroll |
|---|---|---|---|
| 0 | **Loader: Timesheet** | — | An animator's timesheet (X-sheet) fills frame numbers 01→24 as assets load; the last frame "flips" like a flipbook into the page. Real load progress, not a fake timer. |
| 1 | **The Page** (hero) | Hook | A manga spread. One headline in a speech balloon, one CTA. Panels sit still. Scroll = camera pushes into the centre panel. |
| 2 | **The Dive** | Problem | Pinned shot: the panel fills the screen, paper tears, speed lines rush past, `--depth` goes 0→1, paper becomes ink. Copy beat: static brands get scrolled past. Impact frame on arrival. |
| 3 | **Five Worlds** (services) | Solution | Pinned horizontal track, one "world" per service: Websites, Web Apps, Mobile & Desktop Apps, SEO, Social. Each world arrives with its own impact frame and a *visual* (UI mockup, ranking chart, phone/desktop frame, post grid), not a paragraph. |
| 4 | **The Production Line** (process) | How it works | Our process as an anime production pipeline: Storyboard (discovery) → Key frames (design) → In-betweens (build) → Compositing (QA/launch) → Broadcast (SEO + growth). A film strip scrubs past; each frame draws itself (anime.js SVG line draw). |
| 5 | **Episodes** (work) | Proof | Case studies as episodes: `EP.01`, title card, still frame, one real outcome. Hover = smear preview. Click → `/work/[slug]`. Honest placeholder slots if we have fewer than 3. |
| 6 | **The Crew** | Proof | The three of us as anime character sheets (front view, name, role, "special move" = skill). Three people is a strength; we say so. |
| 7 | **Ending** (contact + footer) | Close | Deepest point of the dive. Contact form built from sakuga-vfx input/button/toast; submit fires a ドン! impact. Footer is an anime ending-credits roll (crew, stack, socials). |
**Nav:** fixed "chapter index" (01–07) as a thin vertical timeline with a frame counter showing current depth; menu opens as a full-screen manga page of chapters.

## Stack (decided, see DECISIONS.md)
- **Vite + React 18 + TypeScript strict + Tailwind CSS v4**, routing via React Router, **prerendered at build time with `vite-react-ssg`** so every route ships real HTML + meta tags (search engines and social link previews read it without running JS). Hosted on **Vercel** as static files.
- Meta/OG per route via vite-react-ssg `<Head>` (prerendered into the HTML). OG image: not made yet.
- **Lenis** (smooth scroll) + **GSAP 3 + ScrollTrigger + @gsap/react** (camera, pins, scrub, timelines) + **anime.js v4** (SVG line drawing, small SFX pops). One engine per property, versions per `~/.claude/references/motion-stack.md`
- **sakuga-vfx** web components (MIT) for Button, Input, Tabs, Toast, Tooltip, restyled through `--sk-*` vars. Skip Toggle (500 KB sprite).
- **Canvas 2D** for speed lines and impact frames (cheap, no WebGL needed). **Optional later:** one WebGL shader for the paper→ink tear (OGL or plain Three, lazy-loaded, desktop only). Start without it; add only if the 2D version scores below the design bar.
- **MDX** (`@mdx-js/rollup`) for case studies (no CMS until there are > ~8 of them)
- Contact: one **Vercel serverless function** (`/api/contact`) → **Resend** email, with server-side validation, honeypot and rate limit. No other backend.

## Assets
- **Anime illustration (the hard part):** the site needs original art: hero manga spread, 5 world scenes, 3 character sheets. Options: (a) commission an illustrator (best, slowest), (b) AI image generation via the connected Higgsfield/Canva tools, then traced/cleaned to match line weight (fast, costs credits, needs a human eye), (c) code-native: SVG linework + screentone + type-as-image, with the UI mockups as the visuals. **Plan:** ship (c) first so nothing blocks, swap in (a)/(b) art per scene as it arrives. Never imitate a specific existing anime's characters or style.
- **SFX lettering:** Dela Gothic One katakana set in SVG with stroke + offset fill; sakuga-vfx's traced lettering only inside its own components.
- **Icons:** Iconify (one set, tinted to tokens). **Photos:** team photos if provided; otherwise character-sheet illustrations.
- **Logo:** none exists. Build a geometric mark: an "M" formed by two speed-line wedges inside a hanko seal circle (red), plus Dela Gothic wordmark. Favicons via `export_favicons.py`.

## Work items (ordered: riskiest early)
| # | Item | Depends | Risk | Verify by |
|---|---|---|---|---|
| 1 | Scaffold: Vite + React + vite-react-ssg prerender (verify built HTML contains content + meta) + Tailwind tokens + fonts + Lenis/GSAP provider + `--depth` variable + reduced-motion switch + git baseline | — | L | build/typecheck/lint green, page renders, Vercel preview URL |
| 2 | **The Dive spike** (scene 1 → 2): pinned push-in, paper tear, canvas speed lines, paper→ink, impact frame | 1 | **H** | 60fps perf trace on desktop + mid Android; design evaluator screenshots; reduced-motion static version |
| 3 | Hero "The Page" final (headline, CTA, balloons, screentone, intro timeline) + Loader timesheet | 2 | M | LCP < 2.5s mobile; loader tied to real asset progress; no layout shift (CLS < 0.05) |
| 4 | Five Worlds pinned horizontal track with per-service visuals | 2 | M | each world shows a visual not a paragraph; keyboard/scroll both reach all 5; mobile = vertical stack |
| 5 | Production Line (process film strip, SVG line draw) | 1 | L | scrub draws/undraws cleanly both directions |
| 6 | Episodes grid + `/work/[slug]` MDX template + page transition | 1 | M | 3 case pages build statically; transition does not break back button or focus |
| 7 | Crew character sheets | 1 | L | real names/roles; alt text; screen-reader order |
| 8 | Contact + Ending credits (sakuga-vfx form, server validation, Resend, honeypot, rate limit, toast) | 1 | M | real email received; invalid input shows inline error; double-submit blocked |
| 9 | Nav: chapter index + full-screen menu + depth counter | 2–8 | L | keyboard nav, focus trap in menu, current chapter correct |
| 10 | SEO + perf + a11y pass: metadata, OG images, sitemap, robots, JSON-LD (Organization + Service), font subsetting, lazy scenes | all | M | Lighthouse thresholds in Done-condition |
| 11 | Review gates: /code-review, /ponytail-review, better-accessibility, gate 7b design critique, Playwright journey | all | — | all gates pass, evidence pasted in PROGRESS.md |

## Backlog (not now)
- WebGL ink-tear shader (only if item 2's canvas version falls short)
- Blog / SEO articles (good for a SEO agency, after launch)
- Sound design toggle (whoosh + impact SFX, off by default)
- Case-study CMS, Japanese language version, Cal.com booking
