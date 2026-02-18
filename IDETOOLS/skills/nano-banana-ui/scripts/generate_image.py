#!/usr/bin/env python3
"""Generate images using Nano Banana (Gemini Image API).

Usage:
    python scripts/generate_image.py --prompt "A 3D glass crystal on dark background" --output public/images/crystal.png
    python scripts/generate_image.py --prompt "..." --output hero.png --model gemini-3-pro-image-preview
"""

import argparse
import json
import os
import sys
from pathlib import Path


def generate_image(prompt: str, output_path: str, model: str = "gemini-2.5-flash-image"):
    """Generate an image using the Gemini API and save it to disk."""
    try:
        from google import genai
    except ImportError:
        print(json.dumps({
            "status": "error",
            "message": "google-genai package not installed. Run: pip install google-genai"
        }))
        sys.exit(1)

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print(json.dumps({
            "status": "error",
            "message": "GEMINI_API_KEY not set. Get one at https://aistudio.google.com/app/apikey"
        }))
        sys.exit(1)

    client = genai.Client(api_key=api_key)

    response = client.models.generate_content(
        model=model,
        contents=prompt,
        config=genai.types.GenerateContentConfig(
            response_modalities=["image", "text"],
        ),
    )

    # Extract image from response
    if response.candidates and response.candidates[0].content.parts:
        for part in response.candidates[0].content.parts:
            if part.inline_data and part.inline_data.mime_type.startswith("image/"):
                image_data = part.inline_data.data
                output = Path(output_path)
                output.parent.mkdir(parents=True, exist_ok=True)
                output.write_bytes(image_data)
                print(json.dumps({
                    "status": "success",
                    "path": str(output.resolve()),
                    "size_bytes": len(image_data),
                    "model": model
                }))
                return

    print(json.dumps({
        "status": "error",
        "message": "No image in API response. Prompt may have triggered safety filters — simplify it."
    }))
    sys.exit(1)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate images with Nano Banana")
    parser.add_argument("--prompt", required=True, help="Image generation prompt")
    parser.add_argument("--output", required=True, help="Output file path (e.g., public/images/hero.png)")
    parser.add_argument(
        "--model",
        default="gemini-2.5-flash-image",
        choices=["gemini-2.5-flash-image", "gemini-3-pro-image-preview"],
        help="Model: gemini-2.5-flash-image ($0.039/img) or gemini-3-pro-image-preview ($0.13/img)"
    )
    args = parser.parse_args()
    generate_image(args.prompt, args.output, args.model)
