---
name: nano-banana-ui
description: >-
  Generates images using Nano Banana (Gemini Image API) and builds production
  frontend interfaces incorporating those images. Use when user asks to "build
  a landing page", "design a website", "create a dashboard", "make a portfolio
  site", "build an app UI", or mentions "Nano Banana", "AI images", or
  "generated assets". Also triggers on design-quality requests like "make it
  look premium", "visually striking", or "not generic". Supports two modes -
  free (Anti-Gravity) and automated (Gemini API). Do NOT use for simple bug
  fixes, backend code, API endpoints, database work, or CLI tools with no
  visual component.
license: MIT
---
# ©2026 Brad Scheller


# Nano Banana UI

Generate images with Nano Banana and build production frontend interfaces around them. One skill, two modes.

## Critical

- Do NOT skip Step 3 (validation). Building UI around missing or corrupt images wastes time and produces broken output.
- Do NOT write image prompts without reading `references/prompting-rules.md` first. Every rule exists because the wrong approach was tested and failed.
- Take your time with each step. Quality matters more than speed — a cohesive result requires careful prompt writing, honest evaluation, and willingness to re-generate.

## Before Starting

If the user explicitly asked for Nano Banana or AI-generated images, skip to Choose Your Mode.

If the user asked for a general design task (e.g., "build me a landing page"), first ask: "Would you like AI-generated image assets (hero images, textures, 3D elements) to make this visually distinctive? I can generate them for free via Anti-Gravity or automatically via the Gemini API."

If they say no, build with code only using the principles in `references/frontend-aesthetics.md` — the design rules still apply even without generated images.

If they say yes, continue below.

## Choose Your Mode

Ask the user which mode they want:

### Mode 1: Anti-Gravity (Free)
- Anti-Gravity is a desktop app for building sites with AI — it has a built-in Nano Banana image generation agent
- This skill generates the exact prompts for the user to give to the Anti-Gravity agent
- User opens Anti-Gravity, creates a project, and tells the agent to generate each image
- User then exports/downloads the generated images and places them in this project's `public/images/` folder
- Then this skill builds the UI around those images

### Mode 2: API (Automated)
- Requires `GEMINI_API_KEY` environment variable
- Run `python scripts/generate_image.py --prompt "..." --output path/to/image.png`
- Images generated and saved automatically
- Then this skill builds the UI around those images

If the user has no preference, check for `GEMINI_API_KEY`. If set, default to API mode. If not, use Anti-Gravity mode.

## Workflow

### Step 0: Scaffold the Project

Before anything else, create the project if it doesn't already exist.

- **Next.js**: `npx create-next-app@latest project-name --typescript --tailwind --app` (or `pnpm create next-app@latest` if user prefers pnpm)
- **React (Vite)**: `npm create vite@latest project-name -- --template react-ts`
- **Vanilla**: Create `index.html`, `style.css`, `script.js`

Ask the user their preferred package manager (npm, pnpm, yarn, bun) and use it consistently.

Create a `public/images/` directory for generated assets:
```bash
mkdir -p public/images
```

Do NOT proceed to image generation until the project is scaffolded and the images directory exists.

### Step 1: Understand What They're Building

Before generating anything, determine:

1. **App or landing page?**
   - App = lock the structure, free the styling
   - Landing page = free the structure AND styling

2. **Decide the page color palette FIRST.**
   Before thinking about images, lock 3-5 hex codes for the page: primary background, secondary background, accent, text, and highlight. Every image prompt will use these exact hex codes so generated assets blend seamlessly with the page. If the page has a warm dark background (#1a0f0a), every image must be generated ON that same background color — not black, not transparent, not white.

3. **What image assets are needed?**
   Split everything into two categories:
   - **Must be images** (Nano Banana): 3D elements, organic shapes, bokeh effects, hero images, textures, patterns, illustrations, complex gradients
   - **Built with code**: Navigation, text, buttons, cards, layout, icons (Lucide/Heroicons), CSS animations, glassmorphism, grid/flex

4. **Create an asset manifest** listing every image needed:
   - File name (kebab-case, e.g., `hero-crystal.png`)
   - Description of what it shows
   - Where it goes in the UI
   - **Background color**: The exact hex code this image sits on (from the page palette above)
   - **Crop after?** Yes (background/texture → specify target ratio like 16:9) or No (standalone object → keep square)

### Step 2: Generate Image Prompts

For each asset in the manifest, write a Nano Banana prompt following the rules in `references/prompting-rules.md`.

**Critical**: Read `references/prompting-rules.md` before writing any prompts. The rules are based on tested failures and successes — skipping them produces generic AI slop.

#### Anti-Gravity Mode
Output all prompts in a numbered list the user can paste directly into Anti-Gravity. Include:
- The exact prompt text
- Expected file name to save as
- Where to place it (e.g., `public/images/hero-crystal.png`)

Tell the user: "Open Anti-Gravity in this project folder and give the agent the prompt below."

Every Anti-Gravity prompt MUST start with this preamble:
```
You are ONLY generating images. Do NOT write any code. Do NOT create any files other than images. Do NOT build a website. Do NOT modify any existing files. Your ONLY job is to generate the images listed below using the image tool. Pass each prompt to the image tool EXACTLY as written — do not rewrite, summarize, or modify the prompts.

CRITICAL: Do NOT resize, compress, convert, or post-process any generated images. Save them EXACTLY as the image tool outputs them — no dimension changes, no format conversion, no optimization. If an image comes out at a different resolution than requested, that is fine. Save it as-is. Do NOT attempt to fix dimensions.

Save all generated images to public/images/ with the exact file names specified.
```

List each image prompt with its file name. All images will be generated as squares — that's a Nano Banana constraint. Format:

```
Image 1: [file-name.png]
[The full Nano Banana prompt]

Image 2: [file-name.png]
[The full Nano Banana prompt]
```

This gives the user one complete prompt to paste into Anti-Gravity — preamble + all image prompts in one go.

#### API Mode
For each asset, run:
```bash
python scripts/generate_image.py --prompt "THE PROMPT" --output public/images/FILENAME.png
```

Use `--model gemini-2.5-flash-image` for speed/cost or `--model gemini-3-pro-image-preview` for quality.

### Step 3: Validate Assets

Two checks — technical first, then visual.

**3a. Technical validation.** Run:
```bash
python scripts/validate_images.py --dir public/images
```

Expected output: JSON with `"status": "success"` and `"all_valid": true`. Each image listed with file name, size, dimensions. If any image is under 1KB, it's flagged as corrupt.

**If technical validation fails:**
- **Missing images**: Re-generate only the missing ones (don't redo successful images)
- **Corrupt images** (too small): Re-run the prompt for that specific asset
- **API mode partial failure**: The script exits with status. Re-run only failed prompts — successful images are already saved
- **AG mode partial failure**: Give the user only the prompts that need re-doing, not the full list

**3b. Visual review.** After technical validation passes, READ every generated image. You can see images — use this. For each image, check:

1. **Does it match the prompt?** If you asked for a glass orb with golden glow on a warm background, is that what you got? Or did it generate something generic?
2. **Background color** — does the image background match the page palette from Step 1? A black background when the page is warm brown = will look pasted on later.
3. **AI artifacts** — weird text, distorted shapes, extra fingers on illustrations, smudged edges, unnatural repetition.
4. **Style consistency** — do all the images feel like they belong to the same project? One photorealistic orb and one cartoon illustration = broken cohesion.
5. **Quality** — is it sharp and detailed, or muddy and generic?

For each image, give a verdict: **pass** or **fail + reason**.

**If any image fails visual review:**
1. Delete the failed image from `public/images/`
2. Write a **new corrected prompt** — not the same prompt again. Fix what caused the failure. If the background was black, add the correct hex code. If it was generic, add more specific constraints. If the style was wrong, lock the aesthetic direction harder.
3. **API mode**: Re-generate with the corrected prompt
4. **AG mode**: Give the user a new prompt to paste into Anti-Gravity. Format it as:
   ```
   The previous image [filename] was deleted because: [specific reason from visual review].
   Generate a replacement using the corrected prompt below. Do NOT resize, compress, or post-process. Save as [same filename].

   [The full corrected Nano Banana prompt — not the old prompt]
   ```
   This tells Anti-Gravity what went wrong AND gives it the fixed prompt in one message.
5. Re-run visual review on the replacement

Do NOT proceed to cropping or building until ALL images pass both technical and visual validation.

**All Nano Banana images are square.** This is expected — not a bug, not a limitation. Square images that need other aspect ratios get cropped in Step 3.5. Do NOT try to regenerate for different dimensions.

### Step 3.5: Crop Where Needed

All Nano Banana images are square. Some need cropping to fit their layout role. Check `references/prompting-rules.md` Rule 11 for what's safe to crop vs what stays square.

For images that need landscape/portrait cropping, ALWAYS preview first:
```bash
python scripts/crop_image.py --input public/images/hero-bg.png --ratio 16:9 --preview
```

Expected output: JSON with `"status": "preview"`, original size, cropped size, pixels removed from each edge, and percentage of image lost. Read the original image and the preview output. Only crop if the edges being removed don't contain important content.

If the preview looks safe, apply:
```bash
python scripts/crop_image.py --input public/images/hero-bg.png --ratio 16:9 --apply --output public/images/hero-bg-cropped.png
```

Expected output: JSON with `"status": "success"` and the saved output path.

**Safe to crop**: backgrounds, textures, gradients, scenes (content is spread out — edges are expendable)
**Keep square**: orbs, crystals, icons, standalone objects (subject fills the frame — cropping cuts the subject)
**When in doubt**: preview, look at the image, ask the user. Don't crop blind.

**If cropping reveals a problem** (important content at the edges, composition doesn't work at the new ratio):
Don't force it. Keep the image square and position it with CSS instead. Or go back to Step 3b — delete, reprompt with a composition that works better for the target ratio, regenerate.

### Step 3.75: Extract Colors from Images

**Before writing any code**, READ every generated image. You can see images — use this.

For each image:
1. Identify the 3-5 dominant colors (backgrounds, glows, highlights, shadows)
2. Write down the approximate hex codes you see
3. These become your CSS variables — the page palette comes FROM the images, not the other way around

Define CSS variables from what you actually see:
```css
:root {
  --bg-primary: #0f0a06;      /* darkest area of hero background */
  --bg-secondary: #1a0f0a;    /* warm mid-tone from bokeh */
  --accent: #d4845a;          /* dominant glow color from orb */
  --highlight: #f5c89a;       /* brightest point in the image */
  --text-primary: #f5f0eb;    /* light enough to read on --bg-primary */
}
```

The page palette in Step 1 was a starting guess. Now you have the real images — update the palette to match what was actually generated. The code must serve the images, not the other way around.

### Step 4: Build the UI

Now build the frontend with the images integrated.

**Before writing any code**, read `references/frontend-aesthetics.md` for design principles and `references/design-patterns.md` for what to build as code vs images.

Rules:
- Commit to a BOLD aesthetic direction that matches the generated images — read the Design Thinking section in `references/frontend-aesthetics.md`
- Reference images by their actual file paths
- Build everything that CAN be code as code (don't use images for things CSS can handle)
- Use real framework patterns (Next.js, React, vanilla — match what the user's project uses)
- **Pick fonts from the mood-matching table** in `references/frontend-aesthetics.md`. Look at the images, decide the mood (warm organic? cold minimal? editorial?), then use the exact font pairing from that row. NEVER pick fonts without consulting the table. NEVER use Inter, Roboto, Arial, or system fonts.
- Use the CSS variables from Step 3.75 — every color in your code must trace back to a color you saw in the images
- Typography, spacing, and animation energy must match the image aesthetic — mismatched code kills the cohesion
- **Standalone elements on dark backgrounds**: Use `mix-blend-mode: screen` to make dark backgrounds transparent (keeps only the bright parts). If the element has a non-pure-black background, use a CSS radial gradient mask to fade the edges: `mask-image: radial-gradient(circle, black 50%, transparent 80%)`. These techniques eliminate the "pasted-on square" problem.
- Let images integrate with code elements (overlap, bleed, shared backgrounds) — don't just drop them in boxes
- **All source images are square.** Backgrounds and textures should already be cropped in Step 3.5. Standalone elements (orbs, crystals) stay square — position them with CSS (`object-fit`, `position: absolute`, blend modes, masks). NEVER stretch or compress images to force a fit

### Step 5: Visual Verification (Screenshot Review)

You cannot see the running site directly. Ask the user: **"Please take a screenshot of the page in the browser and share it so I can verify the design."**

When you receive the screenshot, check these specific things in order:

1. **Background bleed**: Does any image show a visible rectangular boundary against the page? A black or miscolored square around an orb, crystal, or 3D element = instant fail. Fix with `mix-blend-mode: screen`, a radial mask, or regenerate the image with the correct background color.
2. **Color cohesion**: Do the CSS colors (backgrounds, text, buttons, accents) actually match what's in the images? Compare the hex codes you extracted in Step 3.75 against what you see on screen. If the page feels like "two different designs glued together," the colors drifted.
3. **Font appropriateness**: Does the font match the mood of the images? Warm organic images with a cold geometric font = wrong. Check against the mood-matching table in `references/frontend-aesthetics.md`. If the font feels off, swap it — fonts are cheap to change.
4. **Image integration**: Do images feel part of the page or dropped on top? Look for: hard edges where images meet code, images trapped in boxes instead of bleeding/overlapping, mismatched visual weight between image areas and code areas.
5. **Overall "screenshot test"**: If someone saw this screenshot with no context, would they think it's a real shipped website? Or would they think "AI demo project"?

**After reviewing**, tell the user exactly what you found and what you'll fix. Don't just say "looks good" — be specific about what works and what doesn't.

If images need adjustment:
- **API mode**: Re-generate with adjusted prompt (edit, don't start over — see prompting rules)
- **AG mode**: Give the user the adjusted prompt to re-generate
- **CSS-only fixes** (blend modes, masks, color tweaks, font swaps): Just do them directly — no regeneration needed

Repeat Steps 4-5 until the result is cohesive.

**When to stop iterating:**
- No image shows a visible rectangular boundary against the page
- Colors across images and code feel like one palette (extracted hex codes match what's on screen)
- Font mood matches the image aesthetic
- No image looks "pasted on" — all integrate via blend modes, masks, or matching backgrounds
- The design passes the "screenshot test" — would look real if posted on Twitter
- Maximum 3 refinement cycles. If it's not cohesive after 3 rounds, the original aesthetic direction needs rethinking, not more iteration.

## Examples

### Example 1: Landing Page with Hero Image

User says: "Build me a landing page for my AI startup with generated hero images"

Actions:
1. Scaffold Next.js project
2. Determine: landing page (free structure + styling)
3. Asset manifest: hero-scene.png (square, crop to 16:9 after), bg-texture.png (square, keep square — tileable)
4. Generate prompts using markdown structure, hex codes, "screenshot of a real website"
5. User generates in AG or script runs via API
6. Validate images — all square as expected
7. Crop hero-scene.png to 16:9 (preview first, then apply)
8. Build Next.js landing page — distinctive typography, colors extracted from hero
9. Ask user for screenshot, verify: background bleed, color cohesion, font match, image integration

Result: Complete landing page with integrated AI-generated assets, production-ready code.

### Example 2: App Dashboard with Custom Assets

User says: "Design app screens for a finance dashboard with generated background textures"

Actions:
1. Scaffold React project
2. Determine: app (lock structure, free styling)
3. Asset manifest: bg-gradient.png (square, crop to 16:9 for dashboard bg), accent-orb.png (square, keep square — standalone element), card-texture.png (square, keep square — tileable)
4. Generate prompts — hex codes for brand colors, "strict palette"
5. Generate via chosen mode
6. Validate — all square
7. Crop bg-gradient.png to 16:9 (preview first). Keep orb and texture square.
8. Build React dashboard — glassmorphism cards over generated backgrounds, monospace fonts for data
9. Ask user for screenshot, verify: background bleed on orb, color cohesion, texture integration

Result: Dashboard with custom visual identity, not generic template aesthetics.

### Example 3: Portfolio Site with Generated Illustrations

User says: "Create a portfolio site with AI-generated illustrations for each section"

Actions:
1. Scaffold project
2. Determine: landing page (free structure)
3. Asset manifest: 4-5 section illustrations (square, keep square — illustrations have centered subjects)
4. Generate prompts — lock style after first success (Rule 2), batch in one session for consistency
5. Generate, validate — all square
6. No cropping needed — illustrations stay square, position with CSS
7. Build with editorial typography, generous whitespace, images bleeding into layout
8. Ask user for screenshot, verify: illustration backgrounds match page, consistent style across all 4-5 images, no "floating on top" effect

Result: Portfolio with cohesive illustration style throughout, not stock-art-on-template.

## Troubleshooting

### API mode: "GEMINI_API_KEY not set"
User needs a key from https://aistudio.google.com/app/apikey — requires billing enabled for image generation.

### API mode: "No image in response"
The prompt may have triggered safety filters. Simplify the prompt and remove any potentially flagged content.

### Images look like posters, not websites
The prompt is missing the "screenshot of a real website" constraint. See prompting rules.

### Images all look the same
The prompt is over-constraining. Lock the quality level but free the aesthetics. See Rule 2 in prompting rules.

### Anti-Gravity rewrites your prompts
AG's agent modifies prompts before passing to Nano Banana. Tell the user to instruct AG: "Pass this prompt to the image tool exactly as written, do not modify it."
