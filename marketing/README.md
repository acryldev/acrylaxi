# ACRYL AXI — explainer film (HyperFrames)

72-second product explainer for **ACRYL AXI** (`acrylaxi`), embedded on
https://acryl.dev/acrylaxi. 1920×1080, 30 fps, no voiceover, silent (see below).

## Deliverables (`renders/`)

| File | What it is |
| --- | --- |
| `acrylaxi-explainer.mp4` | H.264 master, 1920×1080, 30 fps, `+faststart` |
| `acrylaxi-explainer.webm` | VP9 fallback |
| `acrylaxi-explainer.gif` | 960 px wide README hero, 10 fps, 64-colour diff palette |
| `acrylaxi-explainer-poster.jpg` | 1920×1080 poster (end lockup, t=67 s) |

## Re-render

```bash
cd marketing
npx -y hyperframes@0.9.102 check --json          # lint + runtime + layout + contrast gate
npx -y hyperframes@0.9.102 render --quality delivery -o renders/acrylaxi-explainer.mp4
bash scripts/build-derivatives.sh                # webm + gif + poster from the master
```

`npm run render` / `npm run derivatives` do the same. Rendering the master takes
about a minute (2160 frames, 5 capture workers); the derivatives add under a minute.
The master is ~5.8 MB (H.264 High, 1920×1080, 30 fps, `+faststart`), the WebM ~2.8 MB
(VP9), the GIF ~3.7 MB and the poster ~100 KB.

## Project layout

```
index.html                    root composition: 7 scene hosts, 72 s at 1920×1080
compositions/
  s1-problem.html             0–9.5 s   the wall of prose + screenshot replies
  s2-turn.html                9.5–19   "HTML is the new markdown." + the artifact
  s3-loop.html                19–28.5  the review surface, four annotations, one rail
  s4-regenerate.html          28.5–38.5 poll → diff → live reload → the loop, named
  s5-why.html                 38.5–49  three reasons
  s6-capabilities.html        49–61.5  phone · revisions · export · whiteboard
  s7-close.html               61.5–72  lockup, install line, credit
assets/
  brand.css                   fonts + ACRYL tokens (colour, type, grid)
  fonts/                      Space Grotesk + JetBrains Mono (woff2, local)
  img/acrylaxi-mark.png       ACRYL AXI mark (transparent PNG)
  vendor/gsap.min.js          GSAP 3.13.0, pinned locally (no CDN at render)
scripts/build-derivatives.sh  webm / gif / poster
DESIGN.md                     the visual system this film was built against
```

Each scene is a sub-composition: one paused GSAP timeline registered under its own
`data-composition-id`, styles and script inside `<template>`, all motion seek-safe
(no clocks, no network, no random). `assets/brand.css` is linked once from
`index.html`; scene styles only position that scene's own elements. GSAP itself is
vendored in `assets/vendor/` so a re-render needs no network at all.

## Editing notes

- **Copy and commands** live in the scene markup. The install line and the credit
  line are in `compositions/s7-close.html`; the CLI commands in `s3`/`s4`.
- **Timing** is the root `data-duration` (72 s) plus each host's `data-start` /
  `data-duration`. Scene-internal timing is local seconds from 0.
- **Type scale** (1080p): display 66–108 px, body 24–29 px, mono labels 15–24 px.
  Mock product UI inside the artifact pages is deliberately smaller (12–24 px) —
  it is a picture of a real page, not the film's copy.
- **Accent** is the mark's rainbow gradient, used only as: one hairline rule, one
  underline, the export seal, and one glow behind the end lockup.
- **Silent on purpose**: no licensed music source was available in this session, so
  the film ships without an audio track rather than with a dubious bed. Adding a
  bed later is a single `<audio>` in `index.html` with `data-start="0"`,
  `data-duration="72"`, `data-volume`, `data-fade-out`.
- The artifact copy in s1–s4 (an "Onboarding, restructured" plan) is **illustrative
  product content**, not a claim about ACRYL AXI.

## Credits

Logo: ACRYL AXI mark. Film extended from Lavish Editor / `lavish-axi` by Kun Chen
(https://github.com/kunchenguid/lavish-axi), MIT — credited on screen in the end card:
"Extended from Lavish Editor by Kun Chen · MIT".
