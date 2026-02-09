---
name: prd-presentation-skill
description: Generate polished PowerPoint presentations for MKT2700 semester project deliverables using the 7-phase product pipeline (Strategic Foundation, Rubric Creation, Concept Discovery, Deep Research, Concept Evaluation, Refinement & Specification, PRD Generation). Use when students or teams need to create a branded slide deck covering their product development journey. Triggers on requests to "create my project presentation," "build our team deck," "make our deliverable slides," "generate our milestone presentation," "present our pipeline results," or any mention of presenting Week 5 / semester project results. Applies MKT2700 brand guidelines (navy #1B365D, gold #C4A35A, cream #F5F3EE, Georgia/Arial typography).
---

# ©2026 Brad Scheller

# PRD Presentation Skill

Generate a branded MKT2700 PowerPoint deck for student team semester project deliverables.

## Overview

Create a 18–22 slide presentation covering the 7-phase product development pipeline. The deck uses MKT2700 brand colors and typography, with varied slide layouts to keep the presentation visually engaging.

## Content Collection

Before generating slides, collect content for each phase. Ask the team one section at a time:

### Required Content

1. **Team Info**: Team name, company/brand name, product concept (1-line), team member names and roles
2. **Phase 1: Strategic Foundation**: Industry selected, PESTEL highlights (2–3 key forces), competitive landscape overview, team's unfair advantage
3. **Phase 2: Rubric Creation**: Evaluation criteria (5–10), weights, scoring scale (1–5 or 1–10), rationale for weights
4. **Phase 3: Concept Discovery**: How many concepts explored (target 30+), discovery methods used (Jobs-to-be-Done, NotebookLM brainstorming), key insights from NotebookLM
5. **Phase 4: Deep Research**: TAM/SAM/SOM for top concepts, competitive analysis, customer evidence (surveys, interviews, reviews), market sizing assumptions
6. **Phase 5: Concept Evaluation**: Scoring results, Claude vs Gemini comparison, LLM Council divergences and reconciliation, winning concept and why
7. **Phase 6: Refinement & Specification**: SCAMPER refinement highlights, KANO classification (Must-Be, Performance, Excitement features), Jobs-to-be-Done framework application
8. **Phase 7: PRD Summary**: Problem statement, solution overview, target user persona, key features (3–5), success metrics, implementation roadmap
9. **Video Slideshow**: Include key data visualizations and evidence highlights that support the narrative

If the team has pipeline artifacts (strategic-brief.md, evaluation-rubric.md, concept-candidates.md, research-repository.md, evaluation-results.md, refined-concept.md, product-requirements-document.md), extract content from those directly.

## Slide Architecture

Generate slides in this order with these layouts:

| # | Slide | Layout |
|---|-------|--------|
| 1 | Title | Dark navy background, centered team/product name |
| 2 | Agenda | 7-phase pipeline overview with numbered circles |
| 3 | Team & Domain Expertise | Two-column: roles left, unfair advantage right |
| 4 | Strategic Foundation | Gold accent callout with PESTEL highlights |
| 5 | Market Forces | Icon + text rows (2–3 key PESTEL factors) |
| 6 | Competitive Landscape | Table or positioning map |
| 7 | Evaluation Rubric | Table with criteria, weights, scale |
| 8 | Rubric Rationale | Two-column explaining weight decisions |
| 9 | Concept Discovery | Big stat callout (volume explored, methods used) |
| 10 | Top Concepts | Grid of shortlisted concepts (5–8 cards) |
| 11 | Deep Research Highlights | Big stat callouts (TAM/SAM/SOM) |
| 12 | Customer Evidence | Icon + text rows (survey insights, interviews) |
| 13 | Concept Evaluation | Scoring comparison table |
| 14 | LLM Council Insights | Two-column: Claude left, Gemini right, reconciliation below |
| 15 | Winning Concept | Hero slide with concept name + key differentiators |
| 16 | SCAMPER Refinements | Visual showing key refinements applied |
| 17 | KANO Classification | Feature categories with KANO badges |
| 18 | Must-Be & Performance Features | Icon + description rows |
| 19 | Excitement Features | Gold-accented feature cards |
| 20 | Problem & Solution | Two-column: problem left, solution right |
| 21 | Target User | Persona card layout |
| 22 | Success Metrics | Big number callouts |
| 23 | Implementation Roadmap | Sprint timeline or phased plan |
| 24 | Key Takeaways | 3 insight cards |
| 25 | Q&A | Minimal closing slide |

Adjust slide count based on available content — skip slides for sections without data, add slides for sections with rich content. Typical decks are 18–22 slides.

## Generation Process

1. Install pptxgenjs: `npm install pptxgenjs`
2. Collect all content from pipeline artifacts:
   - strategic-brief.md (Phase 1)
   - evaluation-rubric.md (Phase 2)
   - concept-candidates.md (Phase 3)
   - research-repository.md (Phase 4)
   - evaluation-results.md (Phase 5)
   - refined-concept.md (Phase 6)
   - product-requirements-document.md (Phase 7)
3. Generate the presentation JavaScript using the brand constants and slide templates below
4. Run with Node.js: `node generate-presentation.js`
5. Visual QA: open the generated .pptx and verify slide layouts
6. Fix any issues and regenerate

## Brand Constants

```javascript
// MKT2700 Colors (no # prefix)
const NAVY = "1B365D";
const GOLD = "C4A35A";
const CREAM = "F5F3EE";
const WHITE = "FFFFFF";
const GRAY = "5A5A5A";
const DARK_NAVY = "0F1F38";
const LIGHT_GOLD = "F5F0E4";

// Typography
const HEADER_FONT = "Georgia";
const BODY_FONT = "Arial";

// Footer text
const FOOTER = "MKT2700 Product Design & Development • Northeastern University • Spring 2026";
```

## Slide Template Patterns

### Title Slide (Dark Background)

```javascript
let slide = pres.addSlide();
slide.background = { color: NAVY };

// Title
slide.addText(teamProduct, {
  x: 0.8, y: 1.2, w: 8.4, h: 1.5,
  fontSize: 44, fontFace: HEADER_FONT, color: WHITE,
  bold: true, align: "left"
});

// Subtitle
slide.addText(teamName, {
  x: 0.8, y: 2.8, w: 8.4, h: 0.8,
  fontSize: 24, fontFace: HEADER_FONT, color: GOLD,
  italic: true
});

// Gold accent bar
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0.8, y: 2.6, w: 2.0, h: 0.06, fill: { color: GOLD }
});

// Course info
slide.addText(FOOTER, {
  x: 0.8, y: 4.8, w: 8.4, h: 0.4,
  fontSize: 11, fontFace: BODY_FONT, color: WHITE, transparency: 40
});
```

### Content Slide with Phase Number

```javascript
let slide = pres.addSlide();
slide.background = { color: CREAM };

// Phase number circle
slide.addShape(pres.shapes.OVAL, {
  x: 0.6, y: 0.35, w: 0.55, h: 0.55, fill: { color: GOLD }
});
slide.addText(phaseNum, {
  x: 0.6, y: 0.35, w: 0.55, h: 0.55,
  fontSize: 20, fontFace: BODY_FONT, color: NAVY,
  bold: true, align: "center", valign: "middle"
});

// Title
slide.addText(title, {
  x: 1.3, y: 0.3, w: 8.2, h: 0.65,
  fontSize: 32, fontFace: HEADER_FONT, color: NAVY, bold: true, margin: 0
});

// Footer
slide.addText(FOOTER, {
  x: 0.6, y: 5.15, w: 8.8, h: 0.3,
  fontSize: 9, fontFace: BODY_FONT, color: GRAY
});
```

### Big Stat Callouts

```javascript
// For market data, metrics, etc.
const stats = [
  { value: "$4.2B", label: "Market Size" },
  { value: "12%", label: "Annual Growth" },
  { value: "3.2M", label: "Target Users" }
];

stats.forEach((stat, i) => {
  const xPos = 0.6 + (i * 3.1);
  // White card
  slide.addShape(pres.shapes.RECTANGLE, {
    x: xPos, y: 1.4, w: 2.8, h: 2.2, fill: { color: WHITE },
    shadow: { type: "outer", blur: 4, offset: 2, angle: 135, color: "000000", opacity: 0.08 }
  });
  // Gold top bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: xPos, y: 1.4, w: 2.8, h: 0.06, fill: { color: GOLD }
  });
  // Big number
  slide.addText(stat.value, {
    x: xPos, y: 1.7, w: 2.8, h: 1.0,
    fontSize: 40, fontFace: HEADER_FONT, color: NAVY,
    bold: true, align: "center", valign: "middle"
  });
  // Label
  slide.addText(stat.label, {
    x: xPos, y: 2.7, w: 2.8, h: 0.6,
    fontSize: 14, fontFace: BODY_FONT, color: GRAY,
    align: "center", valign: "top"
  });
});
```

### Icon + Text Rows (Pain Points, Features)

```javascript
items.forEach((item, i) => {
  const yPos = 1.3 + (i * 0.95);
  // Gold circle
  slide.addShape(pres.shapes.OVAL, {
    x: 0.8, y: yPos + 0.1, w: 0.4, h: 0.4, fill: { color: GOLD }
  });
  // Number in circle
  slide.addText(String(i + 1), {
    x: 0.8, y: yPos + 0.1, w: 0.4, h: 0.4,
    fontSize: 14, fontFace: BODY_FONT, color: NAVY,
    bold: true, align: "center", valign: "middle"
  });
  // Title
  slide.addText(item.title, {
    x: 1.4, y: yPos, w: 7.8, h: 0.35,
    fontSize: 16, fontFace: BODY_FONT, color: NAVY, bold: true, margin: 0
  });
  // Description
  slide.addText(item.description, {
    x: 1.4, y: yPos + 0.35, w: 7.8, h: 0.45,
    fontSize: 13, fontFace: BODY_FONT, color: GRAY, margin: 0
  });
});
```

### Evaluation Matrix Table

```javascript
const headerRow = [
  { text: "Criteria", options: { bold: true, color: WHITE, fill: { color: NAVY }, fontSize: 12 } },
  { text: "Weight", options: { bold: true, color: WHITE, fill: { color: NAVY }, fontSize: 12 } },
  // ... concept columns
];

const dataRows = criteria.map(c => [
  { text: c.name, options: { fontSize: 11, color: NAVY } },
  { text: c.weight, options: { fontSize: 11, color: NAVY, align: "center" } },
  // ... scores with conditional coloring
]);

slide.addTable([headerRow, ...dataRows], {
  x: 0.6, y: 1.3, w: 8.8,
  border: { pt: 0.5, color: "D0D0D0" },
  colW: [2.5, 0.8, ...conceptWidths],
  rowH: [0.4, ...Array(criteria.length).fill(0.35)],
  autoPage: false
});
```

### Transition / Section Divider

```javascript
let slide = pres.addSlide();
slide.background = { color: NAVY };

slide.addShape(pres.shapes.RECTANGLE, {
  x: 0.8, y: 2.4, w: 2.5, h: 0.06, fill: { color: GOLD }
});

slide.addText(sectionTitle, {
  x: 0.8, y: 2.6, w: 8.4, h: 1.2,
  fontSize: 36, fontFace: HEADER_FONT, color: WHITE, bold: true
});

slide.addText(sectionSubtitle, {
  x: 0.8, y: 3.8, w: 8.4, h: 0.6,
  fontSize: 16, fontFace: BODY_FONT, color: GOLD, italic: true
});
```

## Key Reminders

- Never use `#` prefix on hex colors
- Use `breakLine: true` between array items
- Create fresh option objects for each shadow (never reuse)
- Use `bullet: true` not unicode bullets
- Set `margin: 0` when aligning text with shapes
- Keep text minimal — presentations are visual, not documents
- Vary layouts across slides — never repeat the same layout consecutively
- Every slide must have a visual element (shape, chart, icon, or table)
- Maximum 4–5 bullet points per slide
- Run QA after generation: convert to images and visually inspect
