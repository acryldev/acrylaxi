#!/usr/bin/env bash
# Build the web derivatives from the rendered master.
# Usage: bash scripts/build-derivatives.sh
set -euo pipefail

cd "$(dirname "$0")/.."

MP4="renders/acrylaxi-explainer.mp4"
WEBM="renders/acrylaxi-explainer.webm"
GIF="renders/acrylaxi-explainer.gif"
POSTER="renders/acrylaxi-explainer-poster.jpg"

[ -f "$MP4" ] || { echo "missing $MP4 — run: npx -y hyperframes@0.9.102 render --quality delivery -o $MP4"; exit 1; }

# WebM (VP9) fallback, no audio track, targeted well under 20 MB.
ffmpeg -hide_banner -loglevel warning -y -i "$MP4" \
  -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 -cpu-used 2 \
  -pix_fmt yuv420p -an "$WEBM"

# 960px README hero GIF: 10 fps, 64-colour diff palette — 3.75 MB for 72 s.
ffmpeg -hide_banner -loglevel warning -y -i "$MP4" \
  -vf "fps=10,scale=960:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=64:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle" \
  -loop 0 "$GIF"

# Poster frame: the end lockup (change -ss to pick another moment).
ffmpeg -hide_banner -loglevel warning -y -ss 67.0 -i "$MP4" -frames:v 1 -update 1 -q:v 2 "$POSTER"

ls -l "$MP4" "$WEBM" "$GIF" "$POSTER"
