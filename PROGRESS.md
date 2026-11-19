# PROGRESS
**Goal:** MuseOne immersive scroll agency site   **Done-condition:** see PLAN.md Task Card
**Status:** 🟡 First full build running locally, items 1–9 built, item 10 partly, item 11 partly   **Last updated:** 2026-11-19

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

## Not done / next
- Real email send untested (needs RESEND_API_KEY, CONTACT_TO, CONTACT_FROM on Vercel; `vite` dev does not serve /api, so the form shows "did not send" locally)
- #10: Lighthouse run, OG image, sitemap + canonical (need the domain)
- #11: /code-review, /ponytail-review, better-accessibility, gate 7b design critique, perf trace on a mid-range phone
- Content from user: real crew names/roles/portraits, case studies, social links, domain

## Known issues (non-blocking)
- JS bundle 147 KB gzip (React + GSAP + Lenis + anime.js)
- Chapter rail can overlap content edges on 1100–1300px widths (labels now hover-only)
