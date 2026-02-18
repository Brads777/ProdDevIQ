# Design Patterns — Image vs Code Split

## The Core Decision

Every element in a UI is either:
1. **Generated as an image** (Nano Banana) — things CSS/code cannot create
2. **Built with code** — things that should be responsive, interactive, or text-based

Getting this split wrong wastes image generation on things code handles better, or tries to code things that need to be visual assets.

## What Must Be Images

These elements require image generation because code cannot reproduce them convincingly:

| Element | Why It Needs to Be an Image |
|---------|---------------------------|
| 3D objects (crystals, glass cubes, spheres) | CSS 3D is flat and unconvincing |
| Organic shapes with depth | Real depth, lighting, shadows |
| Bokeh / depth-of-field effects | Complex blur and light interactions |
| Photorealistic textures | Wood grain, marble, fabric |
| Illustrations with artistic style | Hand-drawn, watercolor, sketch |
| Complex gradients with noise/grain | Beyond CSS gradient capabilities |
| Hero images with scene composition | Full scenes with multiple elements |

## What Should Be Code

These elements are better as code because they need to be responsive, interactive, accessible, or dynamic:

| Element | Implementation |
|---------|---------------|
| Navigation bars | HTML + CSS (flexbox/grid) |
| Headlines and body text | CSS typography |
| Buttons and CTAs | Tailwind/CSS components |
| Cards and containers | CSS with backdrop-filter for glassmorphism |
| Layout and spacing | Grid/Flexbox |
| Icons | Lucide React, Heroicons, or SVG |
| Simple animations | CSS transitions, Framer Motion |
| Responsive behavior | Media queries, container queries |
| Form elements | Native HTML with CSS styling |
| Hover/interaction states | CSS :hover, :focus, :active |

## Three Use Cases for Image Generation

### 1. UI Mockups (Generate Design First, Then Code)
Generate the full page design as an image FIRST, then hand it to code.
- Landing pages: free the layout + aesthetic
- Apps: lock the layout, free the styling
- Generate 3 variations, pick the best, then build in code

### 2. Hero Images (Standalone Visual Assets)
Standalone images placed into a coded layout.
- Specify: composition, lighting, aspect ratio (16:9), exact text in double quotes
- Use film terminology for camera/lighting
- Save to `/public/images/hero.png`

### 3. Site Assets (Textures, Patterns, Decorative Elements)
Background textures, decorative elements, patterns.
- Write "strict palette" + hex codes to prevent color drift
- Batch generate in one session for consistency
- Specify if patterns need to tile: "seamless tileable, 512x512"

## CSS Integration Techniques for Standalone Elements

Standalone elements (orbs, crystals, 3D objects) are square images placed on the page. Without CSS integration, they look like squares pasted on a background. These techniques eliminate visible boundaries:

### `mix-blend-mode: screen` (Best for glowing elements on dark backgrounds)
Makes dark pixels transparent, keeps bright pixels. Perfect for orbs, glows, light effects.
```css
.hero-orb {
  mix-blend-mode: screen;
}
```
**Limitation**: Only works if the image background is near-black. If the image background is dark brown or dark blue, you'll still see faint edges.

### Radial gradient mask (Best for any standalone element)
Fades the image edges to transparent, regardless of background color. Works universally.
```css
.hero-element {
  mask-image: radial-gradient(circle, black 50%, transparent 80%);
  -webkit-mask-image: radial-gradient(circle, black 50%, transparent 80%);
}
```
Adjust the percentages: `black 50%` = how much of the center stays fully visible. `transparent 80%` = where the fade completes. Tighter values (40%, 70%) for small elements, wider (60%, 90%) for large ones.

### Combine both for maximum blending
```css
.hero-orb {
  mix-blend-mode: screen;
  mask-image: radial-gradient(circle, black 50%, transparent 80%);
  -webkit-mask-image: radial-gradient(circle, black 50%, transparent 80%);
}
```

### When to use what
| Situation | Technique |
|-----------|-----------|
| Glowing element on dark page | `mix-blend-mode: screen` |
| Any element, any background | Radial gradient mask |
| Element with dark-but-not-black BG | Both combined |
| Full-bleed background image | Neither — use `object-fit: cover` and `width: 100%` |

## Design Consistency Rules

When building code around generated images:
- **READ every generated image** before writing any CSS. Extract the actual dominant colors (3-5 hex codes) and use those exact values as CSS variables. The code palette comes FROM the images.
- **Match the typography mood** — look at the images, decide if they're warm organic, cold minimal, editorial, playful, or premium. Then pick fonts from the mood-matching table in `references/frontend-aesthetics.md`. Never pick fonts independently of the images.
- **Respect the visual weight** — if images are bold and heavy, code elements should have presence too
- **Transitions between image and code areas** should be seamless — use matching backgrounds, blend modes, radial masks, or subtle gradients to blend. Never leave a visible rectangular boundary.
