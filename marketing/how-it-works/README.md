# ACRYL AXI — how a review round works (HyperFrames)

A 49.5-second product film of **one real review round**, built from the actual
screenshots of the running `acrylaxi` CLI rather than re-drawn UI. 1920×1080,
30 fps, silent, embedded on https://acryl.dev/acrylaxi beside the explainer.

## Deliverables (`../renders/`)

| File | What it is |
| --- | --- |
| `acrylaxi-how-it-works.mp4` | H.264 master, 1920×1080, 30 fps, `+faststart` |
| `acrylaxi-how-it-works.webm` | VP9 fallback |
| `acrylaxi-how-it-works.gif` | 960 px wide, 10 fps |
| `acrylaxi-how-it-works-poster.jpg` | 1920×1080 poster (annotation close-up, t=8.5 s) |

## Re-render

```bash
cd marketing/how-it-works
npx -y hyperframes@0.9.102 check --json        # lint + runtime + layout + contrast gate
npx -y hyperframes@0.9.102 render --quality delivery -o ../renders/acrylaxi-how-it-works.mp4
bash scripts/build-derivatives.sh              # webm + gif + poster
```

`npm run render` / `npm run derivatives` do the same. The master takes about a
minute (1485 frames, 5 capture workers). No network is needed: fonts and GSAP are
local files.

## The seven beats

| Scene | Time | What it shows |
| --- | --- | --- |
| `h1-open.html` | 0–5.5 | `acrylaxi examples/acrylaxi-demo.html` types in a terminal; the review window lands with a "Checking layout" gate that clears |
| `h2-annotate.html` | 5.5–15.5 | cursor → paragraph → the annotation card zooms in, the note types itself into the real textarea → Queue → camera to the Conversation → the prompt bubble slides in → Send to Agent |
| `h3-poll.html` | 15.5–25 | `acrylaxi poll plan.html` typed in a terminal, the TOON result streams in; receipts light in order (seen · working · done); the agent's reply lands |
| `h4-reload.html` | 25–32.5 | the real HTML edit as a diff, a reload flash, and the Revisions legend with r2 marked |
| `h5-whiteboard.html` | 32.5–39 | the Mermaid diagram opened as an Excalidraw whiteboard: pick a node, Queue feedback |
| `h6-also.html` | 39–44 | + layout issues (real drawer), + publish to ht-ml.app (real dialog), + your phone (real phone sheet) |
| `h7-lockup.html` | 44–49.5 | mark, ACRYL AXI, acryl.dev/acrylaxi, install line, credit |

## How the real screenshots are used

`assets/media/` holds the product captures (`review.png`, `revisions.png`,
`whiteboard.png`, `inbox.png`, `share.png`, `mobile.png`). They are never
redrawn or restyled:

- The window in h1/h2 is the full `review.png` at 1440×900 surface pixels, moved
  by one GSAP transform on `.stage` (camera).
- Re-render cues are compositing, not invented UI: the annotation text is the real
  pixel text revealed by a `clip-path` wipe over a flat fill of the textarea colour;
  the prompt bubble and the agent reply are clipped copies of the same screenshot
  (background-image layers, so no duplicate media nodes) that slide in over a patch
  of the panel colour.
- Panels that come from a crop (conversation, revisions, whiteboard, phone) are
  positioned with plain `<img>` offsets inside an `overflow:hidden` card.
- The only drawn UI is the film's own chrome: terminal cards, the diff card, the
  cursor, rings and caption band.

## Assets

```
assets/brand.css              site tokens (oklch), Manrope + DM Mono, film chrome
assets/fonts/                 Manrope variable, DM Mono 400/500 (woff2)
assets/vendor/gsap.min.js     GSAP 3.13.0, pinned
assets/media/*.png            the real product screenshots
assets/acrylaxi-mark.png      ACRYL AXI mark
```

## Credits

Product screenshots: ACRYL AXI's own review surface. Film extended from Lavish
Editor / `lavish-axi` by Kun Chen (https://github.com/kunchenguid/lavish-axi), MIT —
credited on screen: "Extended from Lavish Editor by Kun Chen · MIT".
