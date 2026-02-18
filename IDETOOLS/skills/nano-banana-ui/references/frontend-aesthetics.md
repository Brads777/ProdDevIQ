# Frontend Aesthetics — Design Principles

## The Convergence Problem

You tend to converge toward generic, "on distribution" outputs. In frontend design, this creates what users call the "AI slop" aesthetic. You MUST fight this tendency on every project.

Known convergence traps you fall into:
- **Space Grotesk** — your go-to "distinctive" font. It's not distinctive anymore because you pick it every time.
- **Purple/violet gradients** — your default accent color
- **Centered hero + card grid below** — your default layout
- **Inter with one accent font** — your "safe pair"
- **Same 3 hover animations** — scale, opacity, translateY

Every project must feel genuinely different. Not "different font, same structure" — different structure, different rhythm, different personality. Draw inspiration from IDE themes, cultural aesthetics, magazine layouts, film posters, album covers, architectural styles. Not from other websites.

## Design Thinking (Before Writing Any Code)

Before coding, commit to a BOLD aesthetic direction:

- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme — brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian. Use these for inspiration but design one true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work — the key is intentionality, not intensity. Make unexpected choices that feel genuinely designed for the context.

## Typography

- Choose fonts that are beautiful, unique, and interesting — not "safe distinctive"
- NEVER use: Arial, Inter, Roboto, system fonts, Space Grotesk (your known convergence trap)
- Pair a distinctive display font with a refined body font
- Typography should match the mood of the generated images
- **Think outside the box.** If you've used a font recently, don't use it again. Explore Google Fonts beyond page 1.

### Font Pairing Examples by Mood
These are starting points, NOT the only options. Use these to understand the logic, then find your own pairings:

| Mood | Display (examples) | Body (examples) |
|------|---------|------|
| Warm organic | Gloock, Lora, Cormorant Garamond | Instrument Sans, Work Sans, Karla |
| Cold minimal | Outfit, Jura, Syne | IBM Plex Mono, DM Mono, JetBrains Mono |
| Editorial | Crimson Pro, Libre Baskerville, Playfair Display | Instrument Sans, Source Sans 3 |
| Playful | Boldonse, Pixelify Sans, Righteous | Red Hat Mono, Nunito |
| Premium | Young Serif, Italiana, Fraunces | Geist Mono, Plus Jakarta Sans |
| Brutalist | Anton, Bebas Neue, Oswald | Space Mono, Courier Prime |
| Retro | Abril Fatface, Lobster Two, Pacifico | Merriweather, Old Standard TT |

## Color & Theme

- Commit to a cohesive aesthetic via CSS variables
- Dominant colors with sharp accents outperform timid, evenly-distributed palettes
- Extract hex codes from generated images and use those exact values in code — the code palette comes FROM the images (see Step 3.75 in SKILL.md)
- If images use warm tones, code must use warm tones — mismatched palettes break cohesion
- Draw from IDE themes (Dracula, Solarized, Catppuccin, Gruvbox) and cultural aesthetics (wabi-sabi, maximalism, Bauhaus, Art Nouveau) for unexpected palettes

## Motion & Animation

- Animations for high-impact moments, not scattered everywhere
- One well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions
- CSS-only for HTML projects, Motion library for React when available
- Scroll-triggering and surprise hover states
- Match animation energy to the design tone — minimal designs get subtle ease, bold designs get dramatic movement

## Spatial Composition

- Unexpected layouts: asymmetry, overlap, diagonal flow, grid-breaking elements
- Generous negative space OR controlled density — pick one and commit
- Images and code elements should share the same spatial rhythm
- Don't isolate images in boxes — let them bleed, overlap, or integrate with code elements

## Backgrounds & Visual Details

- Create atmosphere and depth — never default to solid white/black
- Layer CSS gradients, geometric patterns, contextual effects that match the overall aesthetic
- Dramatic shadows, decorative borders, grain overlays, noise textures
- These details bridge the gap between generated images and coded elements

## Banned: Generic AI Aesthetics

NEVER produce these — they signal "AI made this" and kill credibility:

- Inter, Roboto, Arial, system fonts, Space Grotesk
- Purple/violet gradients on white backgrounds
- Predictable symmetric layouts
- Cookie-cutter card grids with rounded corners
- Generic hero sections with centered text and a gradient
- Stock-photo-style imagery with generic overlay text
- The same hover animation on every interactive element

Every design must be different. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common safe choices across projects. If a choice feels "safe" or "default," it's wrong.

## Matching Code to Images

The most common failure is generating beautiful images and then wrapping them in generic code. The code must serve the same aesthetic:

| Image Style | Code Should Match With |
|-------------|----------------------|
| Warm, organic, soft | Serif fonts (Cormorant, Lora), rounded but not generic, warm CSS colors, subtle shadows |
| Cold, geometric, sharp | Monospace/geometric sans (Syne, JetBrains Mono), hard edges, cool CSS colors, sharp borders |
| Maximalist, bold | Large type (Anton, Bebas Neue), overlapping elements, bold colors, dramatic animations |
| Minimal, refined | Precise spacing, restrained palette, subtle motion, lots of white space |
| Retro, vintage | Period-appropriate fonts (Abril Fatface), muted colors, texture overlays, aged effects |
| Dark, moody, premium | Display serif (Fraunces, Italiana), deep backgrounds, selective glow accents, minimal text |
