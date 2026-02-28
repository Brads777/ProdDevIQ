---
name: ui-design-review
description: Comprehensive UI/UX design review and critique for existing interfaces. Analyzes visual design, usability, accessibility, and user experience to provide specific improvement recommendations. Use when reviewing existing designs, getting feedback on UI work, identifying design problems, or improving overall design quality.
---

# UI Design Review Skill

This skill provides expert-level design critique and actionable feedback for user interfaces. It evaluates designs against modern UI/UX principles and provides specific, implementable recommendations.

## When to Use This Skill

- Reviewing an existing UI design (code, mockup, or screenshot)
- Getting design feedback before development
- Identifying usability issues
- Improving visual design quality
- Ensuring consistency across an interface

## Design Review Framework

### 1. VISUAL HIERARCHY ASSESSMENT

Visual hierarchy guides users through the interface in order of importance.

**Evaluation Criteria:**
- [ ] Is the most important element the most prominent?
- [ ] Is there a clear primary, secondary, tertiary hierarchy?
- [ ] Does size, color, and position indicate importance?
- [ ] Can users find what they need without hunting?

**Common Problems:**
- Everything looks equally important (no hierarchy)
- Important elements are buried or undersized
- Decorative elements compete with functional ones
- Inconsistent sizing creating false hierarchy

**Scoring:**
- 🟢 **Strong**: Clear path for user attention, primary actions obvious
- 🟡 **Needs Work**: Hierarchy exists but unclear in places
- 🔴 **Weak**: Flat design with no clear importance signals

### 2. TYPOGRAPHY EVALUATION

Typography affects readability, personality, and hierarchy.

**Checklist:**
- [ ] **Font Selection**: Appropriate for brand/context, not generic
- [ ] **Font Pairing**: Display + body fonts complement each other
- [ ] **Size Scale**: Consistent, logical type scale (e.g., 1.25x ratio)
- [ ] **Line Height**: 1.4-1.6 for body text, tighter for headings
- [ ] **Line Length**: 45-75 characters per line for readability
- [ ] **Contrast**: Meets WCAG AA (4.5:1 for body, 3:1 for large text)
- [ ] **Weight Variation**: Used purposefully, not excessively

**Red Flags:**
- More than 2-3 font families
- Inconsistent sizes (not following a scale)
- Line length too long (>80 characters) or too short (<30)
- Low contrast text (especially gray on white)
- Generic system fonts (Arial, Times New Roman)
- Overuse of bold/caps for emphasis

**Recommendations Format:**
```
TYPOGRAPHY ISSUE: [Specific problem]
IMPACT: [How it affects UX]
FIX: [Specific solution with values]
EXAMPLE: Current: font-size: 14px → Recommended: font-size: 16px
```

### 3. COLOR SYSTEM ANALYSIS

Color creates emotion, hierarchy, and brand recognition.

**Evaluate:**
- [ ] **Palette Cohesion**: Colors work together harmoniously
- [ ] **Semantic Usage**: Color meanings are consistent (red=error, green=success)
- [ ] **Accessibility**: Color is not the only indicator (add icons/text)
- [ ] **Contrast Ratios**: Meet WCAG standards
- [ ] **Accent Usage**: Primary accent used sparingly for impact
- [ ] **Dark/Light Balance**: Appropriate for context

**Common Issues:**
- Too many competing colors (palette bloat)
- Accent color overused (loses impact)
- Inconsistent color meanings
- Poor contrast (especially in forms/inputs)
- "Rainbow syndrome" - uncoordinated color choices

**Color Harmony Patterns:**
- Monochromatic: Safe, professional, can be boring
- Complementary: High contrast, energetic
- Analogous: Harmonious, natural feeling
- Split-Complementary: Balanced contrast

### 4. SPACING & LAYOUT

Consistent spacing creates visual rhythm and clarity.

**Spacing Audit:**
- [ ] **Consistent System**: Using 4px/8px base unit
- [ ] **Whitespace**: Adequate breathing room
- [ ] **Grouping**: Related items close together (Gestalt proximity)
- [ ] **Grid Alignment**: Elements align to invisible grid
- [ ] **Responsive Behavior**: Spacing scales appropriately

**Common Problems:**
- Inconsistent margins/padding throughout
- Elements too cramped or too spread out
- Poor grouping (unrelated items appear connected)
- Misaligned elements (looks "off" but hard to pinpoint)

**Spacing Scale Recommendation:**
```
--space-xs: 4px    --space-sm: 8px
--space-md: 16px   --space-lg: 24px
--space-xl: 32px   --space-2xl: 48px
```

### 5. COMPONENT CONSISTENCY

UI components should be predictable and reusable.

**Evaluate:**
- [ ] **Button Styles**: Primary, secondary, tertiary hierarchy
- [ ] **Input Fields**: Consistent styling, clear states
- [ ] **Cards/Containers**: Unified shadow, border, radius treatment
- [ ] **Icons**: Consistent style, size, and weight
- [ ] **States**: Hover, active, disabled, focus, error states defined

**Inconsistency Indicators:**
- Same component looks different in different places
- Similar actions styled differently
- Mixing icon styles (outlined + filled)
- Inconsistent border-radius values
- Shadow depth varies without reason

### 6. INTERACTION & STATE DESIGN

Interactive elements need clear feedback.

**Required States:**
- [ ] **Default**: Base appearance
- [ ] **Hover**: Visual change on mouse-over
- [ ] **Active/Pressed**: Feedback during click
- [ ] **Focus**: Keyboard navigation indicator
- [ ] **Disabled**: Clear but unobtrusive
- [ ] **Loading**: Progress indication
- [ ] **Error**: Clear error state with message

**Missing States Impact:**
- No hover: Page feels "dead" or broken
- No focus: Keyboard users can't navigate
- No loading: Users think system is frozen
- No error state: Users don't know what went wrong

### 7. ACCESSIBILITY AUDIT

Design must work for all users.

**Quick Checks:**
- [ ] Color contrast meets WCAG AA (4.5:1 normal, 3:1 large text)
- [ ] Interactive elements are 44px minimum touch target
- [ ] Color is not the only way to convey information
- [ ] Focus indicators are visible
- [ ] Text can be resized without breaking layout
- [ ] Motion can be reduced for vestibular sensitivity

**Tools to Verify:**
- Contrast: WebAIM Contrast Checker
- Overall: WAVE, axe DevTools
- Color blindness: Coblis simulator

### 8. MOBILE & RESPONSIVE DESIGN

**Evaluate:**
- [ ] Touch targets 44px minimum
- [ ] Content prioritization changes appropriately
- [ ] Navigation adapts (hamburger menu, etc.)
- [ ] Text readable without zooming (16px minimum)
- [ ] Forms are usable (appropriate keyboards, no tiny fields)
- [ ] No horizontal scrolling

---

## Output Format

### 🎨 UI DESIGN REVIEW REPORT

**Overall Design Quality: [X/100]**

| Category | Score | Issues Found |
|----------|-------|--------------|
| Visual Hierarchy | X/10 | X issues |
| Typography | X/10 | X issues |
| Color System | X/10 | X issues |
| Spacing & Layout | X/10 | X issues |
| Component Consistency | X/10 | X issues |
| Interaction Design | X/10 | X issues |
| Accessibility | X/10 | X issues |
| Responsive Design | X/10 | X issues |

### 🔴 Critical Design Issues
[Problems that significantly harm usability or aesthetics]

### 🟡 Design Improvements
[Changes that would notably improve quality]

### 🟢 Polish Opportunities
[Fine-tuning for professional finish]

### 📐 Specific Recommendations

For each issue:
```
ISSUE: [Description]
LOCATION: [Where in the UI]
CURRENT: [What it is now]
RECOMMENDED: [Specific fix with values]
RATIONALE: [Why this matters]
```

### 🎯 Design System Recommendations
[Suggestions for creating consistency]

### 📱 Responsive Considerations
[Mobile-specific observations]

---

## Design Quality Indicators

### Signs of Professional Design:
✅ Consistent spacing rhythm throughout
✅ Limited, purposeful color palette
✅ Clear visual hierarchy
✅ Thoughtful typography with proper scale
✅ Smooth, meaningful animations
✅ Attention to edge cases and states
✅ Accessible by default

### Signs of Amateur Design:
❌ Inconsistent spacing (mixing arbitrary values)
❌ Too many fonts or colors
❌ Everything fights for attention
❌ Generic, template-like appearance
❌ Missing interaction states
❌ Ignoring accessibility
❌ "Designed on desktop, breaks on mobile"

---

## Review Approach

1. **First Impression** (5 seconds): What stands out? What's confusing?
2. **Structure Scan**: Check grid, alignment, spacing consistency
3. **Component Audit**: Review each UI element for consistency
4. **Typography Check**: Evaluate font choices, sizes, hierarchy
5. **Color Analysis**: Assess palette, contrast, semantic usage
6. **Interaction Review**: Test all states and feedback
7. **Accessibility Sweep**: Check contrast, targets, keyboard nav
8. **Mobile Test**: Verify responsive behavior
9. **Synthesis**: Prioritize findings by impact

---

## Industry-Specific Considerations

### Healthcare/Medical (VoicesIQ Context)
- Professional, trustworthy appearance is paramount
- Blue/green palettes convey trust and health
- Clear, readable typography (users may be stressed)
- HIPAA compliance indicators visible
- Calm, not flashy aesthetic
- High contrast for accessibility (older users)

### SaaS/Tech Products
- Modern, clean aesthetics expected
- Dark mode option increasingly expected
- Dashboard density balance
- Data visualization clarity
- Onboarding flow smoothness

### E-commerce
- Product imagery dominance
- Cart/checkout visibility
- Trust signals prominent
- Mobile-first critical
- Speed/performance visible
