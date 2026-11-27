# Social card

`acrylaxi-og.png` is the 1200×630 Open Graph / Twitter card used by
<https://acryl.dev/acrylaxi> (copied to the site as `public/acrylaxi/media/og.png`).

`og-card.html` is the source. Rasterise it at exactly 1200×630 with any headless browser:

```sh
npx -y playwright screenshot --viewport-size=1200,630 og-card.html acrylaxi-og.png
# or open it in a browser and capture the viewport
```

It expects `../../../assets/img/acrylaxi-mark.png` locally and fetches the review screenshot from
`https://acryl.dev/acrylaxi/media/review.png` (or swap in a local copy of `review.png`).
Fonts are Manrope + DM Mono from Google Fonts; without network the card falls back to system fonts.
