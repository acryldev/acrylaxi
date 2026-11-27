#!/usr/bin/env bash
# Derivatives for the "how it works" film, built from the rendered master.
set -euo pipefail
cd "$(dirname "$0")/.."

MP4="../renders/acrylaxi-how-it-works.mp4"
WEBM="../renders/acrylaxi-how-it-works.webm"
GIF="../renders/acrylaxi-how-it-works.gif"
POSTER="../renders/acrylaxi-how-it-works-poster.jpg"

[ -f "$MP4" ] || { echo "missing $MP4 — render first"; exit 1; }

ffmpeg -hide_banner -loglevel warning -y -i "$MP4" \
  -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 -cpu-used 2 \
  -pix_fmt yuv420p -an "$WEBM"

# real screenshots are heavy: 5 fps + a 32-colour diff palette + transparency diff
# keeps the whole 49.5 s film at 960 px under 4 MB.
ffmpeg -hide_banner -loglevel warning -y -i "$MP4" \
  -vf "fps=5,scale=960:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=32:stats_mode=diff[p];[b][p]paletteuse=dither=none:diff_mode=rectangle" \
  -gifflags +transdiff -loop 0 "$GIF"

ffmpeg -hide_banner -loglevel warning -y -ss 8.5 -i "$MP4" -frames:v 1 -update 1 -q:v 2 "$POSTER"

ls -l "$MP4" "$WEBM" "$GIF" "$POSTER"
