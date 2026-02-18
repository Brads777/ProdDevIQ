---
name: frontend-enhancer
description: This skill enhances the visual design and aesthetics of web applications. It provides modern UI patterns, design principles, color palettes, animations, and layout templates. Use this skill for improving styling, creating responsive designs, implementing modern UI patterns, adding animations, selecting color schemes, or building visually appealing frontend interfaces. Includes React/TypeScript component examples that can be adapted to any framework.
---
# ©2026 Brad Scheller

# Frontend Enhancer

## Overview

The Frontend Enhancer skill transforms web applications into visually polished, modern experiences. It provides design guidelines, curated color palettes, animation patterns, and example components that can be adapted to any frontend framework or vanilla HTML/CSS.

## When to Use This Skill

Invoke this skill when:
- Improving the visual appearance of an existing application
- Creating new UI components with modern styling
- Selecting color schemes and design themes
- Adding animations and transitions
- Building responsive layouts for different screen sizes
- Implementing hero sections, feature grids, or landing pages
- Enhancing user experience with better visual hierarchy
- Applying consistent design patterns across an application

## Core Capabilities

### 1. Design System Guidelines

Reference comprehensive design principles for consistent, professional interfaces.

**Design Principles** (`references/design_principles.md`):
- Visual hierarchy best practices
- Spacing and rhythm guidelines
- Typography recommendations
- Color theory and usage
- Consistency standards
- Responsiveness strategies
- Accessibility guidelines (WCAG AA/AAA)
- Common layout patterns

**When to reference:**
- Starting a new design
- Making decisions about visual hierarchy
- Ensuring accessibility compliance
- Establishing consistency across the app
- Reviewing design quality

### 2. Color Palettes

Access professionally curated color schemes optimized for modern web applications.

**Available Palettes** (`references/color_palettes.md`):
1. **Corporate Blue** - Professional, trustworthy (business apps, SaaS)
2. **Vibrant Purple** - Creative, modern (creative tools, portfolios)
3. **Minimalist Gray** - Clean, sophisticated (minimalist designs)
4. **Warm Sunset** - Energetic, friendly (consumer apps, e-commerce)
5. **Ocean Fresh** - Calm, professional (health, finance apps)
6. **Dark Mode** - Modern, eye-friendly (developer tools, dashboards)

Each palette includes:
- Primary and secondary colors
- Accent colors
- Background and surface colors
- Text colors (primary and secondary)
- Semantic colors (success, warning, error)
- Border colors

**Implementation options:**

CSS Custom Properties (any framework):
```css
:root {
  --color-primary: #2563eb;
  --color-secondary: #64748b;
  --color-accent: #f59e0b;
  --color-background: #ffffff;
  --color-text: #1e293b;
}
```

Tailwind CSS:
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#64748b',
      }
    }
  }
}
```

Sass/SCSS:
```scss
$color-primary: #2563eb;
$color-secondary: #64748b;
```

### 3. Component Examples

The `assets/` folder contains React/TypeScript component examples demonstrating modern patterns. These serve as references that can be adapted to any framework.

**Button Component** (`assets/button-variants.tsx`):
- Variants: primary, secondary, outline, ghost, danger
- Sizes: sm, md, lg
- Loading states with animated spinner
- Accessibility features built-in

**Card Component** (`assets/card-variants.tsx`):
- Variants: default, bordered, elevated, interactive
- Subcomponents: Header, Title, Description, Content, Footer
- Hover effects and transitions

**Input Components** (`assets/input-variants.tsx`):
- Text inputs with validation states
- Textarea component
- Icon support
- Error and helper text display

**Adapting to Other Frameworks:**

Vue.js:
```vue
<template>
  <button :class="buttonClasses" :disabled="loading">
    <span v-if="loading" class="spinner"></span>
    <slot></slot>
  </button>
</template>
```

Svelte:
```svelte
<button class={buttonClasses} disabled={loading}>
  {#if loading}<span class="spinner"></span>{/if}
  <slot></slot>
</button>
```

Vanilla HTML/CSS:
```html
<button class="btn btn-primary btn-md">
  Click me
</button>
```

### 4. Layout Templates

Pre-designed, responsive layout patterns for common page sections.

**Hero Section** (`assets/layout-hero-section.tsx`):
- Centered, split, and minimal variants
- CTA buttons support
- Background gradients
- Built-in animations

**Feature Grid** (`assets/layout-feature-grid.tsx`):
- Configurable columns (2, 3, or 4)
- Icon integration
- Staggered animations
- Fully responsive

**CSS Grid Layout Example:**
```css
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

@media (min-width: 768px) {
  .feature-grid { grid-template-columns: repeat(3, 1fr); }
}
```

### 5. Animations and Transitions

Professional animations using CSS classes and keyframes.

**Animation Library** (`assets/animations.css`):
- Fade animations (fadeIn, fadeOut, fadeInUp, fadeInDown)
- Slide animations (slideInLeft, slideInRight)
- Scale animations (scaleIn, scaleOut)
- Utility animations (bounce, pulse, spin)
- Skeleton loading (shimmer effect)
- Hover effects (lift, glow, scale)
- Stagger delays for list animations

**Accessibility:**
All animations respect `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Usage (any framework):**
```html
<div class="animate-fade-in-up">Content appears with animation</div>
<button class="hover-lift">Lifts on hover</button>
```

---

## Enhancement Workflow

Follow this systematic approach when enhancing a frontend application:

### Step 1: Assess Current State
- Identify areas lacking visual polish
- Note inconsistent styling patterns
- Check responsive behavior
- Review accessibility issues
- Evaluate color scheme and typography

### Step 2: Select Design Direction
- Choose a color palette from `references/color_palettes.md`
- Review design principles in `references/design_principles.md`
- Decide on component variants and styles
- Plan layout improvements

### Step 3: Implement Foundation
- Set up color system (CSS variables, Tailwind, Sass, etc.)
- Add animation CSS to global styles
- Establish consistent spacing scale
- Configure typography

### Step 4: Apply Enhancements
- Update components with consistent styling
- Implement layout patterns for key pages
- Apply animations and transitions
- Add responsive adjustments

### Step 5: Refine and Polish
- Test responsiveness across device sizes
- Verify accessibility (keyboard navigation, contrast, screen readers)
- Ensure consistent hover/focus states
- Test with `prefers-reduced-motion`

### Step 6: Final Review
- Check visual hierarchy on all pages
- Verify color consistency
- Test all interactive states
- Validate responsive breakpoints
- Review accessibility compliance

---

## Responsive Design Strategy

All components and layouts should follow a mobile-first approach:

1. **Base styles** - Optimized for mobile (320px+)
2. **sm breakpoint** - Small tablets (640px+)
3. **md breakpoint** - Tablets (768px+)
4. **lg breakpoint** - Desktops (1024px+)
5. **xl breakpoint** - Large desktops (1280px+)

**CSS Custom Properties Approach:**
```css
:root {
  --spacing-unit: 0.5rem;
  --container-width: 100%;
}

@media (min-width: 768px) {
  :root {
    --spacing-unit: 1rem;
    --container-width: 720px;
  }
}
```

---

## Accessibility Checklist

Ensure all enhanced interfaces meet these standards:

- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible and clear
- [ ] Semantic HTML is used (nav, main, article, etc.)
- [ ] Images have alt text
- [ ] Forms have proper labels
- [ ] Animations respect prefers-reduced-motion
- [ ] Touch targets are at least 44x44px

---

## Customization Guide

To adapt components and templates to your brand:

1. **Colors**: Update color values in your chosen system (CSS vars, Tailwind, Sass)
2. **Typography**: Adjust font sizes, weights, and families
3. **Spacing**: Modify padding and margin values
4. **Border Radius**: Change rounded corners to match brand
5. **Shadows**: Adjust shadow intensity for depth
6. **Animations**: Modify duration and easing functions

---

## Resources Summary

### references/
- `color_palettes.md` - Six professionally designed color schemes with implementation examples
- `design_principles.md` - Comprehensive design guidelines covering visual hierarchy, typography, accessibility, and common patterns

### assets/
- `button-variants.tsx` - React button component with 5 variants and 3 sizes (adapt pattern to any framework)
- `card-variants.tsx` - React card component with subcomponents (adapt pattern to any framework)
- `input-variants.tsx` - React input components with validation states (adapt pattern to any framework)
- `layout-hero-section.tsx` - Hero section with 3 layout variants
- `layout-feature-grid.tsx` - Responsive feature grid with configurable columns
- `animations.css` - Complete animation library with accessibility support (framework-agnostic)
- `utils-cn.ts` - Utility function for class name merging (React/Tailwind specific)

---

## Tips for Success

1. **Start with a plan**: Review design principles before making changes
2. **Choose one palette**: Stick to a single color scheme for consistency
3. **Test on real devices**: Emulators don't always show true responsive behavior
4. **Keep it simple**: Modern design favors simplicity over complexity
5. **Prioritize accessibility**: Design for all users from the start
6. **Iterate based on feedback**: Show designs to users and refine
7. **Maintain consistency**: Use the same patterns throughout your application
8. **Performance matters**: Keep animations smooth (60fps) and optimize images

---

## Common Use Cases

### Enhancing an Existing App
1. Select a color palette and implement it
2. Replace basic elements with styled components
3. Add subtle animations to improve feedback
4. Review and improve spacing consistency
5. Ensure responsive behavior across devices

### Building a Landing Page
1. Use hero section layout as the focal point
2. Add feature grid to showcase key features
3. Implement consistent button styles for CTAs
4. Add staggered animations for visual interest
5. Test responsiveness thoroughly

### Creating a Dashboard
1. Use card components for data sections
2. Implement consistent spacing and hierarchy
3. Choose a professional color palette
4. Add skeleton loaders for data fetching
5. Ensure touch-friendly controls on mobile

### Redesigning Forms
1. Apply consistent input styling
2. Add clear error and validation states
3. Ensure proper label associations
4. Implement loading states for submission
5. Test keyboard navigation flow
