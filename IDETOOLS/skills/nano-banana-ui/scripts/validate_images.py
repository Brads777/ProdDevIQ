#!/usr/bin/env python3
"""Validate that generated image assets exist, aren't corrupted, and check dimensions.

Usage:
    python scripts/validate_images.py --dir public/images
    python scripts/validate_images.py --dir public/images --manifest manifest.json
"""

import argparse
import json
import struct
import sys
import zlib
from pathlib import Path

IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".svg"}
MIN_SIZE_BYTES = 1000  # Images under 1KB are likely corrupt or placeholder


def get_png_dimensions(filepath: Path) -> tuple:
    """Read PNG dimensions from file header without external dependencies."""
    with open(filepath, "rb") as f:
        header = f.read(24)
        if header[:8] == b"\x89PNG\r\n\x1a\n":
            width = struct.unpack(">I", header[16:20])[0]
            height = struct.unpack(">I", header[20:24])[0]
            return width, height
    return None, None


def get_jpg_dimensions(filepath: Path) -> tuple:
    """Read JPEG dimensions from file header without external dependencies."""
    with open(filepath, "rb") as f:
        f.read(2)  # Skip SOI marker
        while True:
            marker = f.read(2)
            if len(marker) < 2:
                break
            if marker[0] != 0xFF:
                break
            if marker[1] == 0xD9:  # EOI
                break
            if marker[1] == 0xDA:  # SOS — no more headers
                break
            length = struct.unpack(">H", f.read(2))[0]
            if marker[1] in (0xC0, 0xC1, 0xC2):  # SOF markers
                f.read(1)  # precision
                height = struct.unpack(">H", f.read(2))[0]
                width = struct.unpack(">H", f.read(2))[0]
                return width, height
            f.read(length - 2)
    return None, None


def get_dimensions(filepath: Path) -> tuple:
    """Get image dimensions without any external dependencies."""
    suffix = filepath.suffix.lower()
    if suffix == ".png":
        return get_png_dimensions(filepath)
    elif suffix in (".jpg", ".jpeg"):
        return get_jpg_dimensions(filepath)
    return None, None


def validate_images(directory: str, manifest_path: str = None):
    """Check all images in directory. Optionally verify against a manifest."""
    path = Path(directory)

    if not path.exists():
        print(json.dumps({
            "status": "error",
            "message": f"Directory '{directory}' does not exist. Create it and add images first."
        }))
        sys.exit(1)

    # Find all images
    images = [f for f in path.iterdir() if f.suffix.lower() in IMAGE_EXTENSIONS]

    if not images:
        print(json.dumps({
            "status": "error",
            "message": f"No images found in '{directory}'. Expected .png, .jpg, .webp, or .svg files."
        }))
        sys.exit(1)

    # Validate each image
    results = []
    for img in sorted(images):
        size = img.stat().st_size
        width, height = get_dimensions(img)
        valid = size >= MIN_SIZE_BYTES
        issues = []

        if not valid:
            issues.append(f"File too small ({size} bytes) — likely corrupt or empty")

        result = {
            "file": img.name,
            "path": str(img.resolve()),
            "size_bytes": size,
            "valid": valid,
            "issues": issues,
        }

        if width and height:
            result["width"] = width
            result["height"] = height
            result["aspect_ratio"] = f"{width}:{height}"

        results.append(result)

    # Check against manifest if provided
    missing = []
    dimension_warnings = []
    if manifest_path:
        manifest_file = Path(manifest_path)
        if manifest_file.exists():
            manifest = json.loads(manifest_file.read_text())
            expected_files = {item["file"] for item in manifest}
            found_files = {r["file"] for r in results}
            missing = list(expected_files - found_files)

            # Check dimensions against manifest expectations
            for item in manifest:
                if "width" in item and "height" in item:
                    for r in results:
                        if r["file"] == item["file"] and "width" in r:
                            expected_w, expected_h = item["width"], item["height"]
                            actual_w, actual_h = r["width"], r["height"]
                            if actual_w != expected_w or actual_h != expected_h:
                                dimension_warnings.append({
                                    "file": item["file"],
                                    "expected": f"{expected_w}x{expected_h}",
                                    "actual": f"{actual_w}x{actual_h}",
                                    "fix": "Handle in CSS with object-fit: cover and the expected aspect ratio. Do NOT re-compress the image."
                                })

    all_valid = all(r["valid"] for r in results)
    has_missing = len(missing) > 0

    status = "success"
    if not all_valid or has_missing:
        status = "error"

    output = {
        "status": status,
        "image_count": len(results),
        "all_valid": all_valid,
        "images": results,
    }

    if missing:
        output["missing_from_manifest"] = missing

    if dimension_warnings:
        output["dimension_warnings"] = dimension_warnings
        output["dimension_note"] = "Nano Banana does not reliably follow exact pixel dimensions. Handle sizing in CSS (object-fit, background-size, aspect-ratio) rather than re-generating or compressing. Never resize the source image."

    if status == "success":
        msg = f"All {len(results)} images validated."
        if dimension_warnings:
            msg += f" {len(dimension_warnings)} dimension mismatches — handle in CSS, do not resize source images."
        msg += " Ready to build."
        output["message"] = msg
    else:
        issues = [r for r in results if not r["valid"]]
        output["message"] = f"{len(issues)} invalid images, {len(missing)} missing. Fix before building."

    print(json.dumps(output, indent=2))

    if status == "error":
        sys.exit(1)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Validate generated image assets")
    parser.add_argument("--dir", required=True, help="Directory containing images")
    parser.add_argument("--manifest", default=None, help="Optional manifest JSON to check against")
    args = parser.parse_args()
    validate_images(args.dir, args.manifest)
