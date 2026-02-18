---
trigger: always_on
---

# Frontend Development Guidelines

Follow these guidelines when working on frontend code, UI components, and user interfaces.

## Accessibility (WCAG Compliance)

### Required Standards
- Meet WCAG 2.1 Level AA compliance minimum
- All interactive elements must be keyboard accessible
- Color contrast ratio: 4.5:1 for normal text, 3:1 for large text
- All images must have meaningful alt text
- Form inputs must have associated labels
- Focus indicators must be visible

### Semantic HTML
- Use semantic elements: `<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`
- Use heading hierarchy correctly (h1 > h2 > h3, no skipping levels)
- Use `<button>` for actions, `<a>` for navigation
- Use lists (`<ul>`, `<ol>`) for list content
- Use `<table>` only for tabular data

### ARIA When Needed
- Use native HTML elements before ARIA
- Add aria-label for icon-only buttons
- Use aria-live for dynamic content updates
- Implement aria-expanded for collapsible sections
- Add role attributes only when semantic HTML isn't sufficient

## Responsive Design

### Mobile-First Approach
- Design for mobile screens first
- Use relative units (rem, em, %) over fixed pixels
- Implement breakpoints consistently
- Ensure touch targets are at least 44x44px
- Test on real devices, not just emulators

### Layout
- Use CSS Grid for page layouts
- Use Flexbox for component layouts
- Avoid fixed widths that break on small screens
- Ensure content is readable without horizontal scrolling

## Performance

### Loading Optimization
- Lazy load images and heavy components
- Optimize and compress images
- Minimize bundle size (code splitting)
- Preload critical resources
- Use appropriate image formats (WebP, AVIF)

### Runtime Performance
- Avoid layout thrashing (batch DOM reads/writes)
- Debounce scroll and resize handlers
- Use CSS animations over JavaScript when possible
- Memoize expensive computations
- Clean up event listeners and subscriptions

## Component Design

### Principles
- Build reusable, composable components
- Keep components focused (single responsibility)
- Props down, events up for data flow
- Use consistent naming conventions
- Document component APIs

### State Management
- Keep state as local as possible
- Lift state only when needed for sharing
- Use appropriate state management for complexity level
- Avoid prop drilling through context or state management

## User Experience

### Feedback
- Show loading states for async operations
- Provide clear error messages
- Confirm destructive actions
- Use skeleton screens for content loading
- Indicate form validation in real-time

### Forms
- Use appropriate input types (email, tel, number)
- Implement client-side validation
- Show validation errors inline near inputs
- Preserve form data on errors
- Disable submit during processing
