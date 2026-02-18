# Nano Banana Prompting Rules

These rules come from tested failures and successes. Every rule exists because the opposite was tried and produced bad output.

## The Rules

### Rule 1: Know What You're Building
- **App** = lock the structure (layout is fixed), free the styling (colors, typography, texture)
- **Landing page** = free the structure AND styling (layout IS the creative decision)

Failing to decide this upfront means Nano Banana doesn't know what constraints to respect.

### Rule 2: Lock Style, Then Vary
Never ask for "completely different" designs. It forces the model to maximize difference, not quality. 2 out of 3 will be unusable.

Instead:
1. Generate one round freely
2. Pick the direction you like
3. Lock that aesthetic
4. Ask for variations WITHIN that direction

Prompt pattern: "All variations should be modern, premium, professional. Vary the color palette, typography, layout. DON'T vary the quality level."

### Rule 3: "Screenshot of a Real Website"
Always include: "This should look like an actual screenshot of a live website, not a poster or marketing material."

Without this, Nano Banana treats the request as graphic design composition — you get posters, not websites.

### Rule 4: Hex Codes, Not Adjectives
- "#00ff88" not "teal"
- "#1a1a2e" not "dark blue"
- "#f5f0eb" not "warm beige"

Adjectives are ambiguous. Hex codes are exact.

### Rule 5: Double-Quote Exact Text
Any text that must appear exactly as written goes in double quotes within the prompt.

"AI Labs" not AI Labs. 99% accuracy with quotes, ~60% without.

### Rule 6: Edit, Don't Regenerate
If the output is 80% right, adjust the prompt for the remaining 20%. Don't start over.

"Keep everything the same but change the header font to serif" is better than regenerating from scratch.

### Rule 7: Capitalize Constraints
"NO gradients" hits harder than "no gradients."
"MUST include navigation bar" is more reliable than "include a navigation bar."

Caps signal priority to the model.

### Rule 8: Negative Constraints Matter
Specify what NOT to include. This is as important as what to include.

"NO generic stock photo people. NO purple gradients. NO rounded blob shapes."

### Rule 9: Markdown Structure in Prompts
Nano Banana is trained on code repos. It reads structured markdown better than prose.

Instead of:
> I want a landing page with a dark background and a hero section that has a big headline and a crystal 3D element floating to the right, with a call to action button below

Write:
```
## Landing Page - Hero Section
- Background: dark (#0a0a0f)
- Layout: headline left, 3D crystal element right
- Headline: large, serif font, white
- CTA button: below headline, accent color (#00ff88)
- 3D element: glass crystal cluster, floating, subtle glow
- Style: "screenshot of a real website"
- NO: gradients, stock photos, generic blobs
```

### Rule 10: All Images Come Out Square
Nano Banana ONLY generates square images. Do not request specific dimensions or aspect ratios in prompts — you will always get a square.

For images that need to be landscape or portrait (like hero backgrounds), crop AFTER generation using `scripts/crop_image.py`. See the cropping rules below.

### Rule 11: Cropping Rules (Square → Other Ratios)

**Safe to crop** — backgrounds, textures, gradients, scenes with spread-out content:
- Hero backgrounds → crop to 16:9 (removes top/bottom edges, content is spread across the image so nothing important is lost)
- Card backgrounds → crop to 3:2 or 4:3
- Banner images → crop to any wide ratio

**Do NOT crop** — standalone objects, elements with a centered subject:
- Orbs, crystals, glass elements → keep square, position with CSS
- Icons, logos → keep square
- Illustrations with a subject that fills the frame → keep square

**When in doubt**: if the visual subject is centered and surrounded by atmosphere/empty space, cropping edges is safe. If the subject extends to the edges, keep square.

Crop command (always preview first):
```bash
python scripts/crop_image.py --input public/images/hero-bg.png --ratio 16:9 --preview
python scripts/crop_image.py --input public/images/hero-bg.png --ratio 16:9 --apply --output public/images/hero-bg-cropped.png
```

### Rule 12: Be Explicit About What Varies
When asking for multiple variations, specify what changes and what stays fixed.

"Vary the: layout, typography, color palette. DON'T vary the: quality, professionalism, overall aesthetic direction."

### Rule 13: Background Matching — The #1 Integration Killer
Every standalone element (orbs, crystals, 3D objects) MUST specify the page background color in the prompt. If your page background is warm brown (#1a0f0a), the orb prompt must say `Background: #1a0f0a`. If you don't, Nano Banana defaults to black — and a black-background square on a colored page looks pasted on.

**This applies to ALL non-background images.** Background/texture images define the page color. Standalone elements must match it.

Bad: "Generate a glass orb with golden glow" → orb on black background → black square visible on page
Good: "Generate a glass orb with golden glow. Background: warm dark (#1a0f0a), matching the page" → orb blends seamlessly

Decide the page palette in Step 1 BEFORE writing any image prompts. Then use those exact hex codes in every prompt's background field.

## Prompt Template

Use this as a starting point for any asset:

```
## [Asset Type] — [Name]
- Subject: [what it shows]
- Background: [exact hex code from page palette — REQUIRED for standalone elements, see Rule 13]
- Style: [aesthetic direction, reference existing design if iterating]
- Colors: [hex codes]
- Text: "[exact text in double quotes]" (if any)
- Mood: [one word — premium, playful, clinical, warm]
- MUST include: [required elements]
- NO: [excluded elements]
- "Screenshot of a real website" (for UI mockups only)
```

Note: Do NOT specify dimensions or aspect ratio in the prompt. All Nano Banana images are square. Crop to target ratio after generation using `scripts/crop_image.py`.
