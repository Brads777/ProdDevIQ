---
name: ui-design-master
description: >
  Comprehensive UI/UX design guide covering design systems, Tailwind CSS,
  component libraries, accessibility, responsive design, and design review
  checklists. Consolidates 7 UI/design skills.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Task, AskUserQuestion
context: fork
---

# ©2026 Brad Scheller

# UI Design Master

A comprehensive guide for creating exceptional user interfaces with design systems, Tailwind CSS, component patterns, accessibility, and UX best practices.

## 1. When to Use This Skill

Invoke this skill when you need to:

- **Design UI components** — buttons, forms, cards, modals, navigation
- **Review existing UI** — user requests "review my UI", "improve this design", "check accessibility"
- **Build design systems** — tokens, themes, component libraries, style guides
- **Implement responsive layouts** — mobile-first design, breakpoints, grid systems
- **Apply Tailwind CSS** — utility classes, custom config, dark mode
- **Ensure accessibility** — WCAG compliance, keyboard navigation, screen readers
- **Create animations** — micro-interactions, transitions, loading states
- **Audit design quality** — consistency, spacing, typography, color contrast

**Triggers:**
- "review this UI"
- "create a design system"
- "make this accessible"
- "improve the styling"
- "add dark mode"
- "check color contrast"

## 2. Design System Foundations

### Design Tokens

Design tokens are the atomic values that define your visual language:

**Color Tokens:**
```js
// colors.js
export const colors = {
  // Brand
  brand: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    500: '#0ea5e9',  // primary
    600: '#0284c7',
    900: '#0c4a6e',
  },

  // Semantic
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',

  // Neutral
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    500: '#6b7280',
    900: '#111827',
  },
}
```

**Spacing Scale:**
```js
// spacing.js - Use consistent 4px or 8px base unit
export const spacing = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  24: '6rem',    // 96px
}
```

**Typography Scale:**
```js
// typography.js
export const fontSize = {
  xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
  sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
  base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
  lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
  xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
  '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
}

export const fontWeight = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
}
```

**Naming Conventions:**
- Use semantic names (`primary`, `success`, `danger`) over literal (`blue`, `green`, `red`)
- Include numeric scales (50-900) for color variants
- Group related tokens (`text.heading`, `text.body`, `text.caption`)
- Use T-shirt sizes for abstract scales (`xs`, `sm`, `md`, `lg`, `xl`)

### Theme Structure

```js
// theme.js
export const theme = {
  colors: { /* ... */ },
  spacing: { /* ... */ },
  fontSize: { /* ... */ },

  // Shadows
  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },

  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    DEFAULT: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },

  // Transitions
  transitionDuration: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
  },
}
```

## 3. Tailwind CSS Best Practices

### Utility-First Approach

**DO:**
```jsx
// Compose utilities directly in markup
<button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600
                   transition-colors duration-200 focus:outline-none focus:ring-2
                   focus:ring-blue-500 focus:ring-offset-2">
  Click me
</button>
```

**DON'T:**
```jsx
// Avoid custom CSS when utilities exist
<button className="custom-button">Click me</button>
<style>
  .custom-button {
    padding: 0.5rem 1rem;
    background: blue;
    /* ... */
  }
</style>
```

### Custom Configuration

```js
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],

  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          900: '#0c4a6e',
        },
      },

      // Custom spacing values
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },

      // Custom animations
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },

  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
  ],
}
```

### Component Extraction

**When to extract:**
- Pattern repeats 3+ times
- Complex variant combinations
- Need consistent behavior across app

```jsx
// Button.jsx - Extracted component with variants
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // Base classes
  'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
        destructive: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
        ghost: 'hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500',
        link: 'underline-offset-4 hover:underline text-blue-600',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export function Button({ className, variant, size, ...props }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
```

### @apply Usage

**Appropriate @apply usage:**
```css
/* Base layer - semantic utility groups */
@layer base {
  h1 {
    @apply text-4xl font-bold text-gray-900;
  }

  h2 {
    @apply text-3xl font-semibold text-gray-800;
  }
}

/* Components layer - reusable patterns */
@layer components {
  .card {
    @apply bg-white rounded-lg shadow-md p-6;
  }

  .input-field {
    @apply w-full px-3 py-2 border border-gray-300 rounded-md
           focus:outline-none focus:ring-2 focus:ring-blue-500;
  }
}
```

**Avoid @apply for:**
- One-off styles (use utilities directly)
- Complex component variants (use CVA or component props)

### Dark Mode

```js
// tailwind.config.js
module.exports = {
  darkMode: 'class', // or 'media' for system preference
  // ...
}
```

```jsx
// Component with dark mode support
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  <h1 className="text-gray-900 dark:text-white">Welcome</h1>
  <p className="text-gray-600 dark:text-gray-400">Supporting dark mode</p>
</div>

// Dark mode toggle
function ThemeToggle() {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  )
}
```

## 4. Component Library Patterns

### Button Patterns

```jsx
// Comprehensive button component
import { forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import { Slot } from '@radix-ui/react-slot'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

const Button = forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
```

### Input Patterns

```jsx
// Input with label, error, hint
export function InputField({
  label,
  error,
  hint,
  id,
  required,
  className,
  ...props
}) {
  const inputId = id || useId()

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <input
        id={inputId}
        className={cn(
          'w-full px-3 py-2 border rounded-md shadow-sm',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'disabled:bg-gray-100 disabled:cursor-not-allowed',
          error && 'border-red-500 focus:ring-red-500',
          !error && 'border-gray-300',
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />

      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-sm text-gray-500">
          {hint}
        </p>
      )}

      {error && (
        <p id={`${inputId}-error`} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
```

### Card Patterns

```jsx
// Compound component pattern
export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm',
        className
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }) {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  )
}

export function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn('font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
}

export function CardDescription({ className, ...props }) {
  return (
    <p
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

export function CardContent({ className, ...props }) {
  return <div className={cn('p-6 pt-0', className)} {...props} />
}

export function CardFooter({ className, ...props }) {
  return (
    <div
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  )
}

// Usage
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Modal Patterns

```jsx
// Accessible modal with Radix UI
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

export function Modal({ open, onOpenChange, title, description, children }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 animate-fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 w-full max-w-md max-h-[85vh] overflow-y-auto animate-slide-up">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </Dialog.Title>
              {description && (
                <Dialog.Description className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {description}
                </Dialog.Description>
              )}
            </div>
            <Dialog.Close className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
              <X size={20} />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
```

## 5. Layout & Responsive Design

### Mobile-First Approach

```jsx
// Start with mobile styles, add breakpoints upward
<div className="
  px-4 py-6           // mobile: 16px padding, 24px vertical
  sm:px-6 sm:py-8     // tablet: 24px padding, 32px vertical
  lg:px-8 lg:py-12    // desktop: 32px padding, 48px vertical
  xl:px-12            // large: 48px padding
">
  <h1 className="
    text-2xl          // mobile: 24px
    sm:text-3xl       // tablet: 30px
    lg:text-4xl       // desktop: 36px
  ">
    Responsive Heading
  </h1>
</div>
```

### Breakpoints

```js
// Tailwind default breakpoints
const breakpoints = {
  sm: '640px',   // tablet
  md: '768px',   // small laptop
  lg: '1024px',  // desktop
  xl: '1280px',  // large desktop
  '2xl': '1536px', // extra large
}
```

### Grid Systems

```jsx
// Responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {items.map(item => (
    <div key={item.id} className="bg-white rounded-lg shadow p-6">
      {item.content}
    </div>
  ))}
</div>

// Auto-fit grid (no breakpoints needed)
<div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
  {/* Cards auto-wrap based on container width */}
</div>

// Sidebar layout
<div className="grid lg:grid-cols-[250px_1fr] gap-6">
  <aside className="hidden lg:block">Sidebar</aside>
  <main>Main content</main>
</div>
```

### Container Queries

```jsx
// Install @tailwindcss/container-queries
// Use @container for component-based responsive design

<div className="@container">
  <div className="grid @sm:grid-cols-2 @lg:grid-cols-3 gap-4">
    {/* Responds to container width, not viewport */}
  </div>
</div>
```

## 6. Typography & Color

### Type Scale

```jsx
// Consistent type scale
const typography = {
  display: 'text-5xl sm:text-6xl font-bold',      // Hero headlines
  h1: 'text-4xl font-bold',                        // Page titles
  h2: 'text-3xl font-semibold',                    // Section headers
  h3: 'text-2xl font-semibold',                    // Subsections
  h4: 'text-xl font-medium',                       // Card titles
  body: 'text-base',                                // Default text
  small: 'text-sm',                                 // Captions, labels
  xs: 'text-xs',                                    // Footnotes
}

// Line height ratios
const lineHeight = {
  tight: '1.25',    // headings
  normal: '1.5',    // body text
  relaxed: '1.75',  // long-form content
}
```

### Font Pairing

**Safe combinations:**
- **Serif + Sans:** Georgia/Inter, Merriweather/Open Sans
- **Sans + Mono:** Inter/JetBrains Mono, Roboto/Fira Code
- **Display + Body:** Poppins/Inter, Montserrat/Lato

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
}
```

### Color Palette Generation

**Tools:**
- [Realtime Colors](https://realtimecolors.com) — preview entire UI
- [Coolors](https://coolors.co) — palette generator
- [Palettte](https://palettte.app) — shade generator from single color
- [Adobe Color](https://color.adobe.com) — color wheel, rules

**Color harmony rules:**
- **Monochromatic:** Shades of single hue
- **Analogous:** Adjacent colors on wheel (blue, teal, green)
- **Complementary:** Opposite colors (blue/orange)
- **Triadic:** Three evenly spaced colors

### Contrast Ratios

**WCAG 2.1 requirements:**
- **AA (minimum):** 4.5:1 for normal text, 3:1 for large text (18px+)
- **AAA (enhanced):** 7:1 for normal text, 4.5:1 for large text

**Tools:**
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Colorable](https://colorable.jxnblk.com/)

```jsx
// Good contrast examples
<p className="text-gray-900 bg-white">        // 21:1 ratio
<p className="text-gray-700 bg-gray-50">      // 10.8:1 ratio
<p className="text-blue-600 bg-blue-50">      // 7.9:1 ratio

// Poor contrast (avoid)
<p className="text-gray-400 bg-white">        // 2.8:1 ❌
<p className="text-yellow-500 bg-white">      // 1.9:1 ❌
```

## 7. Accessibility (a11y)

### WCAG 2.1 Essentials

**Perceivable:**
- Provide text alternatives for non-text content
- Ensure sufficient color contrast (4.5:1 minimum)
- Don't rely on color alone to convey information
- Make text resizable without loss of functionality

**Operable:**
- All functionality available via keyboard
- Provide skip links for navigation
- No timing constraints (or allow extension)
- Avoid flashing content (seizure risk)

**Understandable:**
- Use clear, simple language
- Labels and instructions for inputs
- Consistent navigation and identification
- Error messages provide suggestions

**Robust:**
- Valid HTML with semantic elements
- ARIA attributes when needed
- Compatible with assistive technologies

### Keyboard Navigation

```jsx
// Ensure all interactive elements are keyboard accessible
<button
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }}
>
  Click me
</button>

// Skip to main content link
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
             bg-white px-4 py-2 rounded shadow-lg focus:outline-none focus:ring-2"
>
  Skip to main content
</a>

<main id="main-content">
  {/* content */}
</main>

// Focus trap in modals
import { useFocusTrap } from '@/hooks/useFocusTrap'

function Modal({ isOpen, onClose, children }) {
  const modalRef = useFocusTrap(isOpen)

  return (
    <div ref={modalRef} role="dialog" aria-modal="true">
      {children}
    </div>
  )
}
```

### ARIA Attributes

```jsx
// Buttons that don't look like buttons
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={handleKeyDown}
  aria-label="Close dialog"
>
  <X />
</div>

// Form inputs
<label htmlFor="email">Email address</label>
<input
  id="email"
  type="email"
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby={hasError ? 'email-error' : 'email-hint'}
/>
{hasError && (
  <p id="email-error" role="alert">Please enter a valid email</p>
)}

// Loading states
<button aria-busy={isLoading} disabled={isLoading}>
  {isLoading ? 'Loading...' : 'Submit'}
</button>

// Expandable sections
<button
  aria-expanded={isOpen}
  aria-controls="section-content"
  onClick={() => setIsOpen(!isOpen)}
>
  {isOpen ? 'Collapse' : 'Expand'}
</button>
<div id="section-content" hidden={!isOpen}>
  Content here
</div>
```

### Screen Reader Support

```jsx
// Visually hidden but available to screen readers
<span className="sr-only">
  This text is only for screen readers
</span>

// CSS for .sr-only
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only.focus\:not-sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}

// Icon buttons with accessible labels
<button aria-label="Delete item">
  <TrashIcon aria-hidden="true" />
</button>

// Live regions for dynamic updates
<div aria-live="polite" aria-atomic="true">
  {notification}
</div>
```

### Focus Management

```jsx
// Visible focus indicators
.focus-visible:focus {
  @apply outline-none ring-2 ring-blue-500 ring-offset-2;
}

// Return focus after modal close
function Modal({ isOpen, onClose }) {
  const triggerRef = useRef()

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement
    } else if (triggerRef.current) {
      triggerRef.current.focus()
    }
  }, [isOpen])

  // ...
}

// Focus first input on mount
function Form() {
  const firstInputRef = useRef()

  useEffect(() => {
    firstInputRef.current?.focus()
  }, [])

  return (
    <form>
      <input ref={firstInputRef} type="text" />
    </form>
  )
}
```

## 8. Animation & Micro-interactions

### Framer Motion Basics

```jsx
import { motion } from 'framer-motion'

// Fade in
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>

// Slide up
<motion.div
  initial={{ y: 20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.3, ease: 'easeOut' }}
>
  Content
</motion.div>

// Stagger children
<motion.ul
  variants={{
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }}
  initial="hidden"
  animate="visible"
>
  {items.map(item => (
    <motion.li
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      {item.name}
    </motion.li>
  ))}
</motion.ul>

// Exit animations
import { AnimatePresence } from 'framer-motion'

<AnimatePresence>
  {isVisible && (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      Content
    </motion.div>
  )}
</AnimatePresence>
```

### Transitions

```jsx
// CSS transitions via Tailwind
<button className="transition-all duration-200 ease-in-out
                   bg-blue-500 hover:bg-blue-600
                   transform hover:scale-105">
  Hover me
</button>

// Transform on hover
<div className="transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
  Card
</div>

// Multiple properties
<div className="transition-[background-color,transform] duration-200
                hover:bg-gray-100 hover:scale-105">
  Multi-transition
</div>
```

### Loading States

```jsx
// Spinner
<svg
  className="animate-spin h-5 w-5 text-blue-500"
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
>
  <circle
    className="opacity-25"
    cx="12"
    cy="12"
    r="10"
    stroke="currentColor"
    strokeWidth="4"
  />
  <path
    className="opacity-75"
    fill="currentColor"
    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
  />
</svg>

// Pulsing dots
<div className="flex space-x-2">
  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
</div>

// Progress bar
<div className="w-full bg-gray-200 rounded-full h-2">
  <div
    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
    style={{ width: `${progress}%` }}
  />
</div>
```

### Skeleton Screens

```jsx
// Skeleton component
export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-gray-200 dark:bg-gray-700', className)}
      {...props}
    />
  )
}

// Usage
<div className="space-y-4">
  <Skeleton className="h-12 w-full" />
  <Skeleton className="h-4 w-3/4" />
  <Skeleton className="h-4 w-1/2" />
</div>

// Card skeleton
<div className="border rounded-lg p-6 space-y-4">
  <Skeleton className="h-6 w-1/3" />
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-5/6" />
  <div className="flex space-x-2">
    <Skeleton className="h-10 w-24" />
    <Skeleton className="h-10 w-24" />
  </div>
</div>
```

## 9. Design Review Checklist

Use this 20-item checklist when reviewing UI designs:

### Visual Consistency
- [ ] **Colors** — All colors from design system palette, no arbitrary hex values
- [ ] **Spacing** — Consistent spacing scale (4px/8px base), no random margins
- [ ] **Typography** — Limited font families (2-3 max), consistent type scale
- [ ] **Border radius** — Consistent rounding (same radius for similar elements)
- [ ] **Shadows** — Elevation system with 3-4 shadow levels max

### Layout & Alignment
- [ ] **Alignment** — Elements aligned to grid, no pixel-off misalignments
- [ ] **Whitespace** — Sufficient breathing room around elements
- [ ] **Hierarchy** — Clear visual hierarchy (size, weight, color, spacing)
- [ ] **Balance** — Visual weight distributed evenly
- [ ] **Responsive** — Design works on mobile, tablet, desktop

### Accessibility
- [ ] **Contrast** — Text meets WCAG AA (4.5:1) or AAA (7:1) ratios
- [ ] **Touch targets** — Interactive elements minimum 44x44px on mobile
- [ ] **Focus indicators** — Visible focus states for keyboard navigation
- [ ] **Labels** — All inputs have associated labels
- [ ] **ARIA** — Proper ARIA attributes for non-semantic elements

### Interaction
- [ ] **Hover states** — All interactive elements have hover feedback
- [ ] **Loading states** — Spinners/skeletons for async operations
- [ ] **Error states** — Clear error messages with recovery suggestions
- [ ] **Disabled states** — Visually distinct disabled appearance
- [ ] **Animations** — Smooth transitions (200-300ms), respectful of prefers-reduced-motion

## 10. Anti-Patterns to Avoid

### Inconsistent Spacing
**Problem:**
```jsx
// Random spacing values
<div className="mt-3 mb-7 px-5 py-9">
```

**Solution:**
```jsx
// Use spacing scale
<div className="mt-4 mb-8 px-6 py-10">
```

### Too Many Fonts
**Problem:**
```jsx
// Different fonts everywhere
<h1 className="font-poppins">Title</h1>
<p className="font-roboto">Body</p>
<span className="font-open-sans">Caption</span>
```

**Solution:**
```jsx
// Limit to 2-3 font families
<h1 className="font-display">Title</h1>
<p className="font-sans">Body</p>
<code className="font-mono">Code</code>
```

### Low Contrast
**Problem:**
```jsx
// Light gray on white (fails WCAG)
<p className="text-gray-300 bg-white">Hard to read</p>
```

**Solution:**
```jsx
// Sufficient contrast
<p className="text-gray-700 bg-white">Easy to read</p>
```

### Missing Focus States
**Problem:**
```jsx
// No visible focus indicator
<button className="focus:outline-none">Click</button>
```

**Solution:**
```jsx
// Clear focus ring
<button className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
  Click
</button>
```

### Inaccessible Modals
**Problem:**
```jsx
// No focus trap, no ARIA, no keyboard support
<div className="modal" onClick={onClose}>
  <div className="content">{children}</div>
</div>
```

**Solution:**
```jsx
// Proper modal with accessibility
<Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 bg-black/50" />
    <Dialog.Content
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      aria-describedby={description}
    >
      <Dialog.Title>{title}</Dialog.Title>
      {children}
      <Dialog.Close>Close</Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

### Over-Animation
**Problem:**
```jsx
// Too many animations, too slow
<div className="transition-all duration-1000 animate-bounce hover:animate-spin">
  Distracting
</div>
```

**Solution:**
```jsx
// Subtle, purposeful animation
<div className="transition-transform duration-200 hover:scale-105">
  Smooth
</div>
```

### Ignoring Mobile
**Problem:**
```jsx
// Desktop-only design
<div className="grid grid-cols-4 gap-20 px-32">
```

**Solution:**
```jsx
// Mobile-first responsive
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-6 lg:px-8">
```

### Color-Only Indicators
**Problem:**
```jsx
// Red/green without icons or labels
<span className="text-red-500">Error</span>
<span className="text-green-500">Success</span>
```

**Solution:**
```jsx
// Color + icon + text
<span className="text-red-500 flex items-center gap-2">
  <XCircle /> Error: Invalid input
</span>
<span className="text-green-500 flex items-center gap-2">
  <CheckCircle /> Success!
</span>
```

### Tiny Touch Targets
**Problem:**
```jsx
// Too small for mobile (24x24px)
<button className="w-6 h-6 p-0">×</button>
```

**Solution:**
```jsx
// Minimum 44x44px
<button className="w-11 h-11 flex items-center justify-center">×</button>
```

### Unclear Error Messages
**Problem:**
```jsx
// Vague error
{error && <p className="text-red-500">Error</p>}
```

**Solution:**
```jsx
// Specific, actionable error
{error && (
  <p className="text-red-600" role="alert">
    <strong>Email invalid:</strong> Please enter a valid email address (e.g., user@example.com)
  </p>
)}
```

---

## Process: Applying This Skill

1. **Review existing design** — check against the 20-item checklist
2. **Identify issues** — note anti-patterns, accessibility gaps, inconsistencies
3. **Apply design tokens** — ensure colors, spacing, typography from system
4. **Check responsive behavior** — test mobile, tablet, desktop breakpoints
5. **Audit accessibility** — keyboard nav, ARIA, contrast, focus states
6. **Refine animations** — smooth transitions, loading/skeleton states
7. **Document decisions** — note any custom tokens or deviations from system

When building new UI:
1. Start with design tokens (colors, spacing, typography)
2. Use mobile-first responsive approach
3. Extract reusable components with variants (CVA)
4. Add accessibility from the start (ARIA, keyboard, focus)
5. Include loading, error, disabled states
6. Test with keyboard-only and screen reader

## Resources

- **Tailwind CSS Docs:** https://tailwindcss.com/docs
- **Radix UI:** https://radix-ui.com (accessible primitives)
- **shadcn/ui:** https://ui.shadcn.com (Tailwind + Radix components)
- **Framer Motion:** https://framer.com/motion
- **WCAG 2.1 Quick Reference:** https://webaim.org/resources/quickref/
- **Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **Color Palette Tools:** https://realtimecolors.com, https://coolors.co
