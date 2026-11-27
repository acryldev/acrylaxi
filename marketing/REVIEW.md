# Review — ACRYL AXI explainer

Gate status: `hyperframes check` → 0 errors across lint / runtime / layout / motion /
contrast. Remaining: 2 lint warnings (`timeline_track_too_dense` in s4 and s6,
deliberate: both are single coherent scenes with 4 timed beats each) and 9 craft
warnings (`text_below_floor` on mock product UI — it is a picture of a real page,
the film's own copy is 24–108 px; `film_silent` — no audio track by choice;
one `line_unread` on the s5 column group, which is three separate elements).

## What was checked

`hyperframes snapshot` at 27 timestamps across all seven scenes + every scene
boundary (`9.52, 19.02, 28.52, 38.52, 49.02, 52.12, 55.22, 58.32, 61.52`) to catch
blank frames on a cut. Then 10 frames decoded from the delivered MP4 with ffmpeg
(`1.0, 10.5, 17.0, 25.0, 32.0, 41.0, 48.0, 54.0, 62.0, 70.5`) and read back at 100 %.

## Fixed after looking at frames

- **Blank frame at 0 s** — scene 1's wall faded up from nothing; frame 0 is the
  social thumbnail, so the wall is now already on screen and only the trailing
  half of the prose streams in.
- **Every scene cut landed on an empty frame** — all seven scenes now settle from
  an offset with opacity 1 (no fade-from-zero at a boundary), verified at all nine
  scene/beat boundaries above.
- **s2 table clipped** — the artifact window was 600 px tall and the last table row
  was cut off; stage raised to 642 px at top 390, lede shortened to one line.
- **s3 annotation badges collided with copy** — removed the four floating numbers
  (the rail keeps the numbering); dashed outline + selection highlight + toast
  carry the state instead. Also filled the window's dead bottom-left with a
  `state · ~/.acrylaxi/…` line and shortened the lede to one line.
- **s4 window looked unfinished** after the reload — added the footer bar
  (`state · ~/.acrylaxi/` / `live reload` → `review context kept`) and made the
  "fix applied" block arrive with the fix instead of before it.
- **s4 loop stage opened on an empty dark frame** — title and eyebrow now settle in
  from the first frame of the stage; arc endpoint moved under step 01.
- **s5 `#pricing-card` wrapped mid-token**, and the three columns' visuals did not
  align; chip widened, body copy given a fixed min-height, mono labels raised to
  the 15 px floor.
- **s6 phone screen was half empty / badge floated outside the frame** — added the
  layout toast and the 2-prompt feedback block to the screen, badge moved into the
  selected card, drag cursor moved onto the node it drags.
- **s6 revision marks were rainbow slivers** — 3 px gradient bars read as noise;
  marks and legend chips are now ink / hairline, keeping the accent for the end card.
- **GIF was 4.9 MB** — now 10 fps, 64-colour diff palette: 3.75 MB, still legible at
  960 px, verified frame-by-frame on a dark and a light scene.
- **CDN GSAP** — the framework's CDN script tag was replaced with a pinned
  `assets/vendor/gsap.min.js` (3.13.0) so a re-render needs no network and the
  animation version cannot drift. Re-rendered; frames are byte-identical.

## Known limitations

- Silent by design (no licensed bed available; a synthesised one would be worse).
- The artifact copy ("Onboarding, restructured", the diff, the prompts) is
  illustrative product content, not ACRYL documentation.
- 1080p master is encoded at ~670 kbps (H.264 CRF, delivery quality) because the
  film is flat graphics; text measured crisp at 100 % zoom.
