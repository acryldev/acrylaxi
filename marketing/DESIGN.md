# ACRYL AXI — design system for the explainer film

The film is built on ACRYL's visual language, not on a generic "SaaS video" look.
Every value below is the normative source; `assets/brand.css` implements it.

## Ground

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#ffffff` | canvas (scenes 1, 2, 5, 6, 7) |
| `--panel` | `#f4f4f2` | muted panels, capability montage ground |
| `--ink` | `#171717` | type |
| `--ink-2` | `#3b3b38` | body in mock product surfaces |
| `--ink-3` | `#63635e` | secondary body copy |
| `--ink-4` | `#6b6b65` | mono micro-labels (≥ 4.5:1 on both grounds) |
| `--hair` | `#ddddda` | 1px hairline borders |
| `--hair-soft` | `#ecebe7` | grid-surface lines |
| dark variant | `#171717` ground / `#1d1d1b` panel / `#2f2f2c` hair | the loop scenes only (3, 4) |

Grid surface: 96px × 96px, 1px lines, no vignette. Generous whitespace; content
sits inside a 120px margin (90 % action-safe) and the end lockup inside 80 %.

## Type

- **Space Grotesk** (shipped as a variable woff2 in `assets/fonts/`) — display,
  headings, body. Tight tracking: `-0.03em` to `-0.05em` on display sizes.
- **JetBrains Mono** (400/500/700, local) — eyebrows, commands, selectors,
  labels. Uppercase eyebrows at `letter-spacing: 0.18em`.
- Scale at 1080p: display 66–108 px, section headings 62–66 px, body 24–29 px,
  mono labels 15–24 px. Mock product UI inside an artifact page runs 12–24 px:
  it is a photograph of a real page, not the film's own copy.
- No font weights below 400, no italic, no outlined type, no blur on text.

## Shape

- Sharp square corners everywhere. No rounded cards, no pills, no circles
  except the one cursor click ripple.
- Borders are 1px hairlines; the only heavy stroke is the 2px whiteboard node
  border, which reads as a marker edge.
- Panels are flat: `--panel` fill or a hairline outline, never both plus shadow.
  Mock windows carry one soft shadow to lift them off the page.

## Accent

The mark's rainbow gradient (`--grad`) is rationed:

1. a 3px underline that draws under a heading,
2. the hairline rule under the URL,
3. the export seal,
4. the "queued" rule in the feedback rail,
5. one soft glow behind the end lockup.

Never gradient type, never a rainbow wash, never two gradient elements in one
beat (the s5 column underlines are staggered 1.5 s apart for that reason).

## Motion

- GSAP timelines, paused, registered per composition; every value a function of
  timeline time (seek-safe).
- Entrances settle from an offset (y 14–34 px, scale 0.98) rather than fading up
  from nothing, so no cut lands on an empty frame.
- Eases: `power3.out` for arrivals, `power2.inOut` for moves and draws,
  `back.out(2)` only for a badge landing. No bounce, elastic, or float loops.
- Cuts are deliberate: hard cuts between montage beats, one continuous slow push
  from the artifact into the loop.
- Every scene changes for its whole length; no still frame lasts 3 s.

## Sound

Silent. No licensed bed was available, and a synthesised one would have been
worse than none (see README for how to add one).
