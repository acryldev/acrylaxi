# Screenshots

Real captures of the running `acrylaxi` review surface, not mockups. Every image was taken from the
CLI serving `examples/acrylaxi-demo.html` (plus one deliberately broken copy for the layout inbox),
driven with a headless browser at 1440×900, macOS Chrome, dark review chrome over the light artifact.

| File        | Size     | What it shows                                                                                                                       |
| ----------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `review.png`    | 1440×900 | Full review window: artifact on the left, Conversation on the right, an annotation card open on the lede, history with 👀/🛠️/✅ receipts and an agent reply. |
| `annotate.png`  | 780×570  | Close crop of the annotation card: the highlighted paragraph, the typed note, Attach image, Cancel/Queue.                            |
| `conversation.png` | 820×780 | Transcript crop: two user bubbles with all three delivery receipts lit, plus the agent's reply bubble.                            |
| `whiteboard.png` | 1040×494 | A Mermaid diagram opened as an embedded Excalidraw whiteboard, with Queue feedback and Fullscreen.                                 |
| `revisions.png`  | 620×430  | Revisions drawer: two declared rounds, a colour/pattern swatch, summary, and Reveal per round.                                       |
| `inbox.png`      | 1100×462 | Layout issues drawer: one severe finding (`Page scrolls sideways`, 1344px wider than the 1080px viewport), lifecycle chips, queue controls. |
| `share.png`      | 960×680  | Publish dialog: the third-party ht-ml.app warning, public/private password choice, Publish.                                          |
| `mobile.png`     | 820×640  | Phone review at 390×844 with the Conversation bottom sheet raised, receipts and composer visible, on a light canvas.                 |

## How to recapture

Prerequisites: `pnpm install && pnpm run build`, a Chrome the `agent-browser` CLI can drive, and two
minutes of patience. Use an isolated state directory and a non-default port so a real session is never
touched.

```sh
cd acrylaxi
pnpm run build

# One review session for the demo artifact
ACRYLAXI_PORT=4499 ACRYLAXI_STATE_DIR=/tmp/acrylaxi-shots \
ACRYLAXI_NO_OPEN=1 node dist/cli.mjs --no-open examples/acrylaxi-demo.html
# → prints http://127.0.0.1:4499/session/<key>
```

Then, with `agent-browser` (viewport 1440×900):

1. `agent-browser open <url>` and wait ~5s for the open-time layout gate to reveal the artifact.
2. **review / annotate** — click a paragraph in the artifact (annotation mode is on), type a note, and
   screenshot. The card lives inside the sandboxed iframe, so click by coordinate; the card is the
   `acrylaxi-annotation-card` shadow-DOM node.
3. **conversation** — press Enter to queue the note, type a composer message, click `#send`, then run
   the agent side:
   ```sh
   # consumes the queued prompts and prints them as TOON
   ACRYLAXI_PORT=4499 ACRYLAXI_STATE_DIR=/tmp/acrylaxi-shots node dist/cli.mjs poll examples/acrylaxi-demo.html
   touch examples/acrylaxi-demo.html   # lights 🛠️ Working
   ACRYLAXI_PORT=4499 ACRYLAXI_STATE_DIR=/tmp/acrylaxi-shots \
     node dist/cli.mjs reply examples/acrylaxi-demo.html --agent-reply "Tightened the opening…"
   ```
   Reload, then screenshot the panel with all three receipts lit and the reply bubble present.
4. **whiteboard** — leave annotate mode (`#annotation`), scroll the artifact to the diagram, click the
   canvas once to unlock it, screenshot with the Excalidraw toolbar visible.
5. **revisions / share** — click `#revisionsButton`, and for publish open `#moreButton` →
   `#shareArtifact`. Both drawers are chrome-level, so they screenshot cleanly.
6. **mobile** — `agent-browser set viewport 390 844`, reload, click the bottom Conversation dock, screenshot.

For **inbox**, open a second session on a deliberately broken copy of the demo. Append this before
`</main>` and save it as a temp file (it is not committed, because it is intentionally broken):

```html
<section style="width: 2400px">
  <p class="eyebrow">06 · appendix</p>
  <h2 style="white-space: nowrap">Roadmap appendix copied in from a wider canvas, so it pushes past the artifact viewport instead of reflowing inside it.</h2>
</section>
```

Open it the same way, wait ~8s for the passive layout check, click `#warningsButton`, and crop the
drawer with the artifact headline still visible.

## Cropping

Crops were made with ImageMagick so each image sits at 1× or downscales when the site shows it:

```sh
magick cap.png -crop 1100x462+24+0 +repage -strip inbox.png   # drawer + artifact headline
magick cap.png -crop 620x430+820+0 +repage -strip revisions.png
magick cap.png -crop 960x680+240+80 +repage -strip share.png
```

`review.png` stays full-window at 1440×900; `mobile.png` is the 390×844 phone capture centred on an
820×640 light canvas so the gallery tile keeps a readable aspect ratio.
