# Review — ACRYL AXI "how a review round works"

Gate: `hyperframes check` → **0 errors** across lint, runtime, layout, motion and
contrast. Remaining craft warnings only: `film_silent` (no audio by design) and
`text_below_floor` on the product's own UI text inside the real screenshots
(the film's own copy is 15–92 px; the mock UI is a picture of a running product).

## Material
All eight screenshots supplied in `acryldev.github.io/public/acrylaxi/media/` are
used (review, revisions, whiteboard, inbox, share, mobile); `annotate.png` and
`conversation.png` were folded into the same review.png pixel space instead of
being shown as separate crops.

## Verified frames (from the delivered MP4, 100 %)
`2.5, 8.0, 10.5, 17.0, 22.5, 26.5, 31.0, 35.0, 41.5, 47.0` — plus every scene
boundary (`0, 5.55, 14.55, 24.05, 32.55, 38.55, 44.05`) to catch blank cuts.

## Fixed after looking
- **Blank first frames** at 0 s and at the h4/h6 cuts — every scene now enters
  from an offset with opacity 1, and the opening terminal already carries six
  typed characters at frame 0.
- **"Checking layout" gate** sat on the artifact/conversation seam; it is now
  centred on the artifact area of the real window.
- **Revisions popover** was cropped through the page margin (a light strip and a
  stray white sliver at the card edges). It is now cropped to the popover body
  with the R2 row ringed, and the card height lands on the panel's bottom border.
- **Whiteboard sheet overflowed its card** and painted over the film's top line —
  the card now clips, and the crop is tighter so the diagram reads at 1×.
- **GIF was 8.1 MB** at 10 fps/64 colours (photographic UI compresses badly);
  it now runs 5 fps / 32-colour diff palette at 3.5 MB.
- **Poster** switches to the annotation close-up (t=8.5 s) where the caption and
  the real card both read at small sizes.

## Known limitations
- The annotation card is already open in `review.png`, so the film shows the note
  typing into it rather than the card popping in; hiding the baked card would
  have meant painting over the page and its shadow.
- Silent, matching the explainer.
- 5 fps GIF: the whole 49.5 s film under 4 MB is the constraint.
