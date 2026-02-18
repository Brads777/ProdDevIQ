#!/usr/bin/env python3
"""Center-crop a square Nano Banana image to a target aspect ratio.

Nano Banana only generates square images. This script crops them
to landscape or portrait by removing edges from center.

Two modes:
  --preview  Shows what will be cut without saving (default)
  --apply    Actually performs the crop

Always preview first. Never crop blind.

Usage:
    python scripts/crop_image.py --input public/images/hero-bg.png --ratio 16:9 --preview
    python scripts/crop_image.py --input public/images/hero-bg.png --ratio 16:9 --apply --output public/images/hero-bg-cropped.png
"""

import argparse
import json
import sys
from pathlib import Path


def crop_center(input_path: str, ratio: str, output_path: str = None, preview: bool = True):
    """Crop a square image to target aspect ratio from center."""
    try:
        from PIL import Image
    except ImportError:
        print(json.dumps({
            "status": "error",
            "message": "Pillow not installed. Run: pip install Pillow"
        }))
        sys.exit(1)

    inp = Path(input_path)
    if not inp.exists():
        print(json.dumps({
            "status": "error",
            "message": f"Input file '{input_path}' not found."
        }))
        sys.exit(1)

    # Parse ratio
    try:
        w_ratio, h_ratio = map(int, ratio.split(":"))
    except ValueError:
        print(json.dumps({
            "status": "error",
            "message": f"Invalid ratio '{ratio}'. Use format like 16:9, 3:2, 4:3"
        }))
        sys.exit(1)

    img = Image.open(inp)
    orig_w, orig_h = img.size

    # Calculate crop dimensions
    target_ratio = w_ratio / h_ratio

    if target_ratio > 1:
        # Landscape: keep full width, crop top and bottom
        new_w = orig_w
        new_h = int(orig_w / target_ratio)
    elif target_ratio < 1:
        # Portrait: keep full height, crop left and right
        new_h = orig_h
        new_w = int(orig_h * target_ratio)
    else:
        # Square: no crop needed
        new_w, new_h = orig_w, orig_h

    # Center crop coordinates
    left = (orig_w - new_w) // 2
    top = (orig_h - new_h) // 2
    right = left + new_w
    bottom = top + new_h

    pixels_removed = {
        "top": top,
        "bottom": orig_h - bottom,
        "left": left,
        "right": orig_w - right
    }

    total_removed = sum(pixels_removed.values())
    percent_removed = round((1 - (new_w * new_h) / (orig_w * orig_h)) * 100, 1)

    if preview:
        print(json.dumps({
            "status": "preview",
            "input": str(inp.resolve()),
            "original_size": f"{orig_w}x{orig_h}",
            "cropped_size": f"{new_w}x{new_h}",
            "ratio": ratio,
            "percent_removed": f"{percent_removed}%",
            "pixels_removed": pixels_removed,
            "message": f"Will remove {pixels_removed['top']}px from top, {pixels_removed['bottom']}px from bottom, {pixels_removed['left']}px from left, {pixels_removed['right']}px from right. That's {percent_removed}% of the image. Review the original image and decide if the edges are safe to lose. Run with --apply to crop."
        }, indent=2))
        return

    # Apply the crop
    if not output_path:
        print(json.dumps({
            "status": "error",
            "message": "--output is required when using --apply"
        }))
        sys.exit(1)

    cropped = img.crop((left, top, right, bottom))

    out = Path(output_path)
    out.parent.mkdir(parents=True, exist_ok=True)
    cropped.save(out, quality=95)

    print(json.dumps({
        "status": "success",
        "input": str(inp.resolve()),
        "output": str(out.resolve()),
        "original_size": f"{orig_w}x{orig_h}",
        "cropped_size": f"{new_w}x{new_h}",
        "ratio": ratio,
        "percent_removed": f"{percent_removed}%",
        "pixels_removed": pixels_removed
    }, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Center-crop square Nano Banana images to target aspect ratio")
    parser.add_argument("--input", required=True, help="Input image path")
    parser.add_argument("--ratio", required=True, help="Target aspect ratio (e.g., 16:9, 3:2, 4:3)")
    parser.add_argument("--output", help="Output image path (required with --apply)")

    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--preview", action="store_true", default=True, help="Preview what will be cut (default)")
    mode.add_argument("--apply", action="store_true", help="Actually perform the crop")

    args = parser.parse_args()
    crop_center(args.input, args.ratio, args.output, preview=not args.apply)
