# PROGRESS
**Goal:** MuseOne immersive scroll agency site   **Done-condition:** see PLAN.md Task Card
**Status:** 🟠 v1 built and running locally; user wants a redesign toward illoca.unseen.co (real 3D world). Waiting on user's clarifications   **Last updated:** 2026-11-19

## Done (verified)
- [x] #1 Scaffold: Vite + React + vite-react-ssg prerender. Build ✅ typecheck ✅. Prerendered dist/index.html contains title, description, OG, JSON-LD and all section text.
- [x] #2 Dive: pinned push-in, panels thrown off, canvas speed lines (12fps), paper→ink, impact frame. Screens: qa/03–05.
- [x] #3 Hero + timesheet loader (real progress: fonts + DOM ready, 2.5s failsafe). Loader ~1.4–2.3s in dev.
- [x] #4 Five Worlds: pinned sideways track ≥900px, vertical stack on mobile, code-drawn mockups. qa/06, qa/12
- [x] #5 Production line: film strip, anime.js line drawing started by ScrollTrigger. qa/10
- [x] #6 Episodes: 3 honest "next episode" slots (no case-study pages yet)
- [x] #7 Crew: 3 character sheets with placeholder names/silhouettes. qa/08
- [x] #8 Contact: validation (client + server), honeypot, rate limit, Resend via api/contact.ts. Tests 4/4 ✅. Client validation verified in browser.
- [x] #9 Nav: topbar, chapter rail + frame counter, full-screen menu with focus trap/Esc
- Reduced motion verified: no loader, no pins, all content readable (qa/14). Mobile 375: no horizontal overflow.
- tastemaker motion audit: 0 HIGH. anti-slop: 0 HIGH.

## Direction change (2026-11-19)
- User feedback: v1 design not impressive enough; keep the anime theme. Reference: https://illoca.unseen.co/
- Studied it: notes in .tastemaker/reference-board.md, screenshots in qa/ref/
- User decision: **Real 3D world** (Three.js, cel shading, ink outlines, paper grain, scroll-driven camera)
- Open questions (user asked to clarify before answering): which world the camera travels through (storyboard → anime city / floating island / animator's desk), and the 3D asset source (CC0 kits + code / code only / user supplies models)
- 3D previews built for the user to choose from: http://localhost:5173/preview.html (?v=a|b|c, ?p=0..1 freezes the camera for review)
  - Shared system: two-pass cel shader (colour pass + light pass, thresholded to two tones), ink edge lines, silhouette hulls, paper grain, scroll-driven CatmullRom camera, site copy/fonts, speed lines, impact frames, katakana SFX stamps
  - A dusk city (peach/indigo), B floating island (sky/cobalt), C night desk (navy/warm lamp). All shapes built in code, no downloaded models.
  - Screens: qa/pv/. Camera clipping fixed in B (web apps, SEO) and C (phone, SEO). Mobile: picker uses short labels, wider FOV on portrait.
  - Not measured: real frame rate (the automation browser throttles rAF to ~2fps even on the plain v1 site)
- Also done since last update: ending headline capped at 2 lines; chapter rail now tracks scroll position (commit ac7c0ac)

## Deployed (2026-11-19)
- GitHub: https://github.com/MasterOogway0220/museone (branch master), Vercel project adi0820s-projects/museone, auto-deploys on push
- Live: https://museone.vercel.app and https://museone.vercel.app/preview (3D world previews, Play tour + arrow keys)
- Contact API live but RESEND_API_KEY / CONTACT_TO / CONTACT_FROM not set in Vercel yet, so messages are not delivered
- Voting for partners: not built (user interrupted the choice)

## New request (2026-11-19, awaiting answers)
- User wants a site "like illoca.unseen.co" for real estate & architecture. Plan: same DNA (one 3D world, scroll camera, illustrated two-tone render, framed viewport, restrained UI), original scene/copy/brand, not a clone. Asked: who it's for, where it lives, which story.

## Not done / next
- Real email send untested (needs RESEND_API_KEY, CONTACT_TO, CONTACT_FROM on Vercel; `vite` dev does not serve /api, so the form shows "did not send" locally)
- #10: Lighthouse run, OG image, sitemap + canonical (need the domain)
- #11: /code-review, /ponytail-review, better-accessibility, gate 7b design critique, perf trace on a mid-range phone
- Content from user: real crew names/roles/portraits, case studies, social links, domain

## Known issues (non-blocking)
- JS bundle 147 KB gzip (React + GSAP + Lenis + anime.js)
- Chapter rail can overlap content edges on 1100–1300px widths (labels now hover-only)
