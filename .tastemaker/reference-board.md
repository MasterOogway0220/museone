# Reference board — MuseOne

## Study: illoca.unseen.co (studied 2026-11-19, live site, 14 screenshots in qa/ref/)
DNA only. Do not copy its scene, layout, nav pill, copy, fonts or signature camera moves.

### What it is, technically
- One WebGL2 canvas (real-time 3D), Lenis smooth scroll, virtual scroll (document height = 1 viewport).
- Commercial fonts (Graphik, F37 Analog, Architect Pro handwriting, Geist Mono). Not usable by us.

### Why it feels premium (the DNA)
1. **One world, one camera.** The whole page is a single rendered scene. Scrolling moves a camera through it:
   wide room → over the shoulder → top-down on the drawing → the sketch rises into a 3D building.
   The story is told by where the camera goes, not by stacking sections.
2. **Illustration-grade 3D.** Two-tone cel shading (one ink colour + warm grey), thin ink outlines, film grain.
   It looks drawn, not rendered. Limited palette = instant identity.
3. **Restraint around the scene.** Tiny UI: small centred nav, a corner email link, mono labels, handwritten notes.
   Text appears only at story beats, in a side column, while the scene frame shrinks to make room, then goes full again.
4. **Framed viewport on paper.** Scene is inset with a margin on a graph-paper ground, so it reads like a drawing on a desk.
5. **Story = the product's own transformation.** Sketch → plan → massing → building. The scroll *is* the demo.

### Why our v1 falls short against it
- v1 is a stack of sections with flat CSS mockups. Each section restarts; there is no single world.
- The "dive" is the only cinematic moment; after it the page becomes a normal website.
- Visuals are UI boxes, not illustration. Nothing is drawn with the care of a frame of animation.
- Too much chrome competing: rail, frame counter, SFX words, chips, tags.

### Translation for MuseOne (keep the anime theme, adopt the DNA)
- Cel shading *is* anime. A toon-shaded 3D world with ink outlines + paper grain is the natural bridge between illoca's craft and our sakuga theme.
- Our own transformation story: a storyboard sketch on a desk → it becomes key frames → a living anime world where each service is a place the camera visits → back to the desk for contact.
- Keep palette: paper, print ink, seal red; add one cel-shadow colour for two-tone shading.
