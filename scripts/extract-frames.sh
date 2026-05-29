#!/usr/bin/env bash
# ---------------------------------------------------------------
# extract-frames.sh
# Turns the stitched cinematic video into a JPG frame sequence
# for the scroll-driven canvas player.
#
# Usage:
#   ./scripts/extract-frames.sh <input-video> [fps] [width]
#
# Examples:
#   ./scripts/extract-frames.sh raw/final.mp4
#   ./scripts/extract-frames.sh raw/final.mp4 24 1920
#
# Output:
#   public/frames/frame-0001.jpg ... frame-NNNN.jpg
#   content/frames-manifest.json
# ---------------------------------------------------------------

set -euo pipefail

INPUT="${1:?Usage: $0 <input-video> [fps] [width]}"
FPS="${2:-24}"
WIDTH="${3:-1920}"

OUT_DIR="public/frames"
mkdir -p "$OUT_DIR"
rm -f "$OUT_DIR"/frame-*.jpg

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "✗ ffmpeg not found. Install it:"
  echo "  macOS: brew install ffmpeg"
  echo "  Windows (chocolatey): choco install ffmpeg"
  echo "  Linux: sudo apt install ffmpeg"
  exit 1
fi

echo "→ Extracting at ${FPS}fps, width ${WIDTH}px from $INPUT"

ffmpeg -hide_banner -loglevel warning \
  -i "$INPUT" \
  -vf "fps=${FPS},scale=${WIDTH}:-2:flags=lanczos" \
  -q:v 3 \
  "$OUT_DIR/frame-%04d.jpg"

COUNT=$(find "$OUT_DIR" -name 'frame-*.jpg' | wc -l | tr -d ' ')
echo "✓ Wrote ${COUNT} frames to ${OUT_DIR}"

mkdir -p content
cat > "content/frames-manifest.json" <<EOF
{
  "frameCount": ${COUNT},
  "frameDir": "/frames",
  "fps": ${FPS},
  "width": ${WIDTH}
}
EOF
echo "✓ Wrote content/frames-manifest.json"

TOTAL_SIZE=$(du -sh "$OUT_DIR" | cut -f1)
echo "✓ Total size: ${TOTAL_SIZE}"

if [[ "$TOTAL_SIZE" == *"M"* ]]; then
  SIZE_NUM=$(echo "$TOTAL_SIZE" | sed 's/M//')
  if (( $(echo "$SIZE_NUM > 50" | bc -l 2>/dev/null || echo 0) )); then
    echo ""
    echo "⚠ Frame sequence is over 50MB. For production, consider:"
    echo "  1. Lower quality: rerun with '-q:v 5' in this script"
    echo "  2. Lower resolution: bash scripts/extract-frames.sh $INPUT $FPS 1280"
    echo "  3. Fewer frames: ./scripts/extract-frames.sh $INPUT 20 $WIDTH"
  fi
fi
