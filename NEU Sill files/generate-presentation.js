#!/usr/bin/env node
/**
 * MKT2700 PRD Presentation Generator
 * Generates a branded PowerPoint deck for student team semester project deliverables.
 * 
 * Usage: node generate-presentation.js [output-path]
 * 
 * Content is populated from the DATA object below.
 * Students replace placeholder content with their actual project data.
 */

const pptxgen = require("pptxgenjs");

// ============================================================
// MKT2700 BRAND CONSTANTS
// ============================================================
const NAVY = "1B365D";
const GOLD = "C4A35A";
const CREAM = "F5F3EE";
const WHITE = "FFFFFF";
const GRAY = "5A5A5A";
const DARK_NAVY = "0F1F38";
const LIGHT_GOLD = "F5F0E4";
const LIGHT_GRAY = "E8E6E1";
const SUCCESS = "2D8B4E";
const CAUTION = "D4772C";
const DANGER = "B04040";

const HEADER_FONT = "Georgia";
const BODY_FONT = "Arial";
const FOOTER = "MKT2700 Product Design & Development \u2022 Northeastern University \u2022 Spring 2026";

// Shadow factory (fresh object each call to avoid PptxGenJS mutation bug)
const cardShadow = () => ({ type: "outer", blur: 4, offset: 2, angle: 135, color: "000000", opacity: 0.08 });

// ============================================================
// TEAM DATA — Replace with actual project content
// ============================================================
const DATA = {
  // --- Team Info ---
  teamName: "Team Alpha",
  companyName: "NovaPet",
  productConcept: "AI-Powered Pet Wellness Platform",
  members: [
    { name: "Alex Chen", role: "Project Lead" },
    { name: "Jordan Lee", role: "Market Research" },
    { name: "Sam Patel", role: "Technical Analysis" },
    { name: "Morgan Davis", role: "UX & Design" },
    { name: "Riley Kim", role: "Financial Analysis" }
  ],

  // --- Step 1: Team Communication ---
  communication: {
    tools: "Slack (daily), Zoom (weekly sync), Google Drive (shared docs)",
    meetingCadence: "Tuesdays & Thursdays 6–7 PM, Sunday async check-in",
    decisionProcess: "Majority vote with project lead tie-breaker",
    roles: "Rotating meeting facilitator, shared note-taking in Google Docs"
  },

  // --- Step 2: Interest Discovery ---
  interestDiscovery: {
    segmentsExplored: [
      { name: "Pet Tech & Wellness", reason: "Growing market, personal interest across team" },
      { name: "EdTech for K-12", reason: "Large addressable market, AI transformation" },
      { name: "Sustainable Packaging", reason: "Regulatory tailwinds, B2B opportunity" }
    ],
    selectedSegment: "Pet Tech & Wellness",
    selectionRationale: "Fastest-growing consumer segment with clear pain points, team domain expertise, and strong AI application potential."
  },

  // --- Step 3: Segment Research ---
  segmentResearch: {
    marketSize: "$320B",
    growthRate: "7.2%",
    targetUsers: "48M",
    marketSizeLabel: "Global Pet Care Market",
    growthLabel: "Annual CAGR (2024-2030)",
    targetLabel: "US Pet-Owning Households",
    trends: [
      "Humanization of pets driving premium product demand",
      "Telehealth and remote monitoring adoption accelerating",
      "AI/ML integration in diagnostics and preventive care",
      "Subscription-based wellness plans replacing episodic vet visits"
    ],
    painPoints: [
      { title: "Reactive Healthcare", description: "Pet owners only visit vets when symptoms appear, missing early warning signs" },
      { title: "Fragmented Records", description: "Health data scattered across vets, apps, and paper files with no unified view" },
      { title: "Cost Anxiety", description: "Unexpected vet bills averaging $800-1500 create financial stress and delayed care" },
      { title: "Information Overload", description: "Conflicting online advice leads to confusion about pet nutrition and wellness" }
    ],
    competitors: [
      { name: "Petcube", strength: "Hardware + monitoring", weakness: "No health analytics" },
      { name: "Whistle", strength: "GPS + activity tracking", weakness: "Limited AI insights" },
      { name: "PetDesk", strength: "Vet appointment booking", weakness: "No preventive tools" },
      { name: "Pawp", strength: "24/7 vet telehealth", weakness: "No data integration" }
    ]
  },

  // --- Step 4: Pugh Rubric ---
  rubric: {
    criteria: [
      { name: "Market Demand Evidence", weight: "20%", description: "Quantifiable demand signals from research" },
      { name: "Competitive Differentiation", weight: "18%", description: "Uniqueness vs existing solutions" },
      { name: "Technical Feasibility", weight: "15%", description: "Can be built with available technology" },
      { name: "Revenue Potential", weight: "15%", description: "Clear path to sustainable revenue" },
      { name: "User Pain Severity", weight: "12%", description: "How acute is the problem for users" },
      { name: "Scalability", weight: "10%", description: "Growth potential beyond initial market" },
      { name: "Team Capability Fit", weight: "10%", description: "Alignment with team skills and resources" }
    ],
    scoringScale: "0 = No evidence, 1 = Weak, 2 = Moderate, 3 = Strong, 4 = Exceptional",
    threshold: ">95% Continue, 90-95% Revise, <90% Kill"
  },

  // --- Step 5: SCAMPER ---
  scamper: {
    highlights: [
      { prompt: "Substitute", idea: "Replace vet visits with AI-powered symptom triage" },
      { prompt: "Combine", idea: "Merge activity tracking + health records + telehealth into one platform" },
      { prompt: "Adapt", idea: "Apply human wearable health algorithms to pet biometrics" },
      { prompt: "Modify", idea: "Scale wellness plans by breed, age, and pre-existing conditions" },
      { prompt: "Put to Other Uses", idea: "Use aggregated anonymized data for veterinary research" },
      { prompt: "Eliminate", idea: "Remove need for manual health logging with automated tracking" },
      { prompt: "Reverse", idea: "Let vets proactively reach out when AI detects anomalies" }
    ],
    totalGenerated: 23
  },

  // --- Step 6: Pugh Matrix ---
  pughMatrix: {
    concepts: [
      { name: "AI Wellness Hub", scores: [4, 4, 3, 4, 4, 3, 3], total: "92.4%" },
      { name: "Smart Collar+App", scores: [3, 3, 2, 3, 3, 3, 4], total: "84.2%" },
      { name: "Vet Network Platform", scores: [3, 2, 3, 3, 3, 4, 2], total: "81.0%" },
      { name: "Pet Food AI Coach", scores: [2, 3, 4, 2, 3, 2, 3], total: "77.5%" }
    ],
    winner: "AI Wellness Hub",
    winnerRationale: "Highest weighted score across all criteria, strongest market demand evidence and competitive differentiation."
  },

  // --- Step 7: Specifications ---
  specifications: {
    mustHave: [
      { name: "Health Dashboard", description: "Unified view of pet health metrics, history, and alerts" },
      { name: "Symptom Checker AI", description: "Natural language symptom input with triage recommendations" },
      { name: "Vet Record Integration", description: "Import and sync records from participating veterinarians" }
    ],
    performance: [
      { name: "Activity Monitoring", description: "Daily activity, sleep, and behavior pattern tracking" },
      { name: "Personalized Plans", description: "Breed/age-specific wellness and nutrition recommendations" }
    ],
    excitement: [
      { name: "Predictive Health Alerts", description: "AI detects early warning signs before symptoms appear" },
      { name: "Vet Video Consults", description: "On-demand telehealth with AI-prepared case summary" }
    ]
  },

  // --- Step 8: PRD Summary ---
  prd: {
    problem: "Pet owners lack proactive, unified health management tools, leading to reactive care, fragmented records, and unexpected costs.",
    solution: "An AI-powered pet wellness platform that consolidates health data, provides predictive insights, and connects owners with veterinary care proactively.",
    targetUser: "Tech-savvy pet owners (25-45) with dogs/cats, willing to invest in preventive pet health",
    keyFeatures: [
      "AI symptom triage and health scoring",
      "Unified pet health record dashboard",
      "Predictive wellness alerts based on behavior patterns",
      "Integrated telehealth with vet network",
      "Personalized nutrition and exercise plans"
    ],
    successMetrics: [
      { metric: "50K", label: "Active Users (Year 1)" },
      { metric: "4.5+", label: "App Store Rating" },
      { metric: "35%", label: "Vet Visit Reduction" },
      { metric: "72%", label: "Monthly Retention" }
    ]
  }
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function addFooter(slide) {
  slide.addText(FOOTER, {
    x: 0.6, y: 5.15, w: 8.8, h: 0.3,
    fontSize: 9, fontFace: BODY_FONT, color: GRAY
  });
}

function addSectionHeader(slide, stepNum, title) {
  // Gold circle with step number
  slide.addShape(slide._slideLayout ? slide._slideLayout : undefined);
  // We need pres reference — passed via closure
}

// ============================================================
// SLIDE GENERATION
// ============================================================

function generatePresentation() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = DATA.teamName;
  pres.title = `${DATA.companyName} - ${DATA.productConcept}`;

  // --------------------------------------------------------
  // SLIDE 1: Title
  // --------------------------------------------------------
  let s1 = pres.addSlide();
  s1.background = { color: NAVY };

  // Gold accent bar
  s1.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 1.0, w: 2.2, h: 0.06, fill: { color: GOLD }
  });

  // Product concept title
  s1.addText(DATA.productConcept, {
    x: 0.8, y: 1.2, w: 8.4, h: 1.6,
    fontSize: 42, fontFace: HEADER_FONT, color: WHITE, bold: true, margin: 0
  });

  // Company name
  s1.addText(DATA.companyName, {
    x: 0.8, y: 2.9, w: 8.4, h: 0.7,
    fontSize: 24, fontFace: HEADER_FONT, color: GOLD, italic: true, margin: 0
  });

  // Team name
  s1.addText(DATA.teamName, {
    x: 0.8, y: 3.6, w: 5, h: 0.5,
    fontSize: 16, fontFace: BODY_FONT, color: WHITE, transparency: 30, margin: 0
  });

  // Team members row
  const memberText = DATA.members.map(m => m.name).join("  \u2022  ");
  s1.addText(memberText, {
    x: 0.8, y: 4.2, w: 8.4, h: 0.4,
    fontSize: 11, fontFace: BODY_FONT, color: WHITE, transparency: 40, margin: 0
  });

  // Course footer
  s1.addText(FOOTER, {
    x: 0.8, y: 4.9, w: 8.4, h: 0.35,
    fontSize: 10, fontFace: BODY_FONT, color: WHITE, transparency: 50, margin: 0
  });

  // --------------------------------------------------------
  // SLIDE 2: Agenda / 8-Step Process
  // --------------------------------------------------------
  let s2 = pres.addSlide();
  s2.background = { color: CREAM };

  s2.addText("Our 8-Step Process", {
    x: 0.6, y: 0.3, w: 8.8, h: 0.7,
    fontSize: 32, fontFace: HEADER_FONT, color: NAVY, bold: true, margin: 0
  });

  const steps = [
    "Team Communication", "Interest Discovery", "Segment Research", "Create Pugh Rubric",
    "SCAMPER Process", "Pugh Matrix Selection", "Define Specifications", "Product Requirements Doc"
  ];

  steps.forEach((step, i) => {
    const col = i < 4 ? 0 : 1;
    const row = i % 4;
    const xBase = 0.6 + (col * 4.6);
    const yBase = 1.2 + (row * 1.0);

    // Gold circle
    s2.addShape(pres.shapes.OVAL, {
      x: xBase, y: yBase + 0.05, w: 0.5, h: 0.5, fill: { color: GOLD }
    });
    // Number
    s2.addText(String(i + 1), {
      x: xBase, y: yBase + 0.05, w: 0.5, h: 0.5,
      fontSize: 18, fontFace: BODY_FONT, color: NAVY,
      bold: true, align: "center", valign: "middle"
    });
    // Step name
    s2.addText(step, {
      x: xBase + 0.65, y: yBase, w: 3.6, h: 0.6,
      fontSize: 16, fontFace: BODY_FONT, color: NAVY, bold: true,
      valign: "middle", margin: 0
    });
  });

  addFooter(s2);

  // --------------------------------------------------------
  // SLIDE 3: Team Communication
  // --------------------------------------------------------
  let s3 = pres.addSlide();
  s3.background = { color: CREAM };

  // Step indicator
  s3.addShape(pres.shapes.OVAL, { x: 0.6, y: 0.3, w: 0.5, h: 0.5, fill: { color: GOLD } });
  s3.addText("1", { x: 0.6, y: 0.3, w: 0.5, h: 0.5, fontSize: 18, fontFace: BODY_FONT, color: NAVY, bold: true, align: "center", valign: "middle" });
  s3.addText("Team Communication", { x: 1.25, y: 0.3, w: 8.2, h: 0.55, fontSize: 30, fontFace: HEADER_FONT, color: NAVY, bold: true, margin: 0 });

  // Left column: Team structure
  s3.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 1.1, w: 4.2, h: 3.6, fill: { color: WHITE },
    shadow: cardShadow()
  });
  s3.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 1.1, w: 4.2, h: 0.06, fill: { color: GOLD }
  });
  s3.addText("Team Structure & Roles", {
    x: 0.9, y: 1.3, w: 3.6, h: 0.4,
    fontSize: 16, fontFace: BODY_FONT, color: NAVY, bold: true, margin: 0
  });

  DATA.members.forEach((m, i) => {
    s3.addText([
      { text: m.name, options: { bold: true, fontSize: 13, color: NAVY } },
      { text: `  —  ${m.role}`, options: { fontSize: 13, color: GRAY } }
    ], {
      x: 0.9, y: 1.85 + (i * 0.48), w: 3.6, h: 0.4, margin: 0
    });
  });

  // Right column: Communication details
  s3.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 1.1, w: 4.2, h: 3.6, fill: { color: WHITE },
    shadow: cardShadow()
  });
  s3.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 1.1, w: 4.2, h: 0.06, fill: { color: GOLD }
  });
  s3.addText("How We Work", {
    x: 5.5, y: 1.3, w: 3.6, h: 0.4,
    fontSize: 16, fontFace: BODY_FONT, color: NAVY, bold: true, margin: 0
  });

  const commItems = [
    { label: "Tools", value: DATA.communication.tools },
    { label: "Cadence", value: DATA.communication.meetingCadence },
    { label: "Decisions", value: DATA.communication.decisionProcess },
    { label: "Norms", value: DATA.communication.roles }
  ];

  commItems.forEach((item, i) => {
    s3.addText([
      { text: item.label.toUpperCase(), options: { bold: true, fontSize: 10, color: GOLD, breakLine: true } },
      { text: item.value, options: { fontSize: 12, color: NAVY } }
    ], {
      x: 5.5, y: 1.85 + (i * 0.75), w: 3.6, h: 0.7, margin: 0
    });
  });

  addFooter(s3);

  // --------------------------------------------------------
  // SLIDE 4: Interest Discovery
  // --------------------------------------------------------
  let s4 = pres.addSlide();
  s4.background = { color: CREAM };

  s4.addShape(pres.shapes.OVAL, { x: 0.6, y: 0.3, w: 0.5, h: 0.5, fill: { color: GOLD } });
  s4.addText("2", { x: 0.6, y: 0.3, w: 0.5, h: 0.5, fontSize: 18, fontFace: BODY_FONT, color: NAVY, bold: true, align: "center", valign: "middle" });
  s4.addText("Interest Discovery", { x: 1.25, y: 0.3, w: 8.2, h: 0.55, fontSize: 30, fontFace: HEADER_FONT, color: NAVY, bold: true, margin: 0 });

  // Three segment cards
  DATA.interestDiscovery.segmentsExplored.forEach((seg, i) => {
    const xPos = 0.6 + (i * 3.1);
    const isSelected = seg.name === DATA.interestDiscovery.selectedSegment;

    s4.addShape(pres.shapes.RECTANGLE, {
      x: xPos, y: 1.2, w: 2.8, h: 2.4,
      fill: { color: isSelected ? NAVY : WHITE },
      shadow: cardShadow()
    });

    if (isSelected) {
      // Gold badge
      s4.addShape(pres.shapes.RECTANGLE, {
        x: xPos, y: 1.2, w: 2.8, h: 0.35, fill: { color: GOLD }
      });
      s4.addText("SELECTED", {
        x: xPos, y: 1.2, w: 2.8, h: 0.35,
        fontSize: 10, fontFace: BODY_FONT, color: NAVY,
        bold: true, align: "center", valign: "middle"
      });
    }

    s4.addText(seg.name, {
      x: xPos + 0.25, y: isSelected ? 1.7 : 1.4, w: 2.3, h: 0.7,
      fontSize: 16, fontFace: HEADER_FONT, color: isSelected ? WHITE : NAVY,
      bold: true, valign: "middle", margin: 0
    });

    s4.addText(seg.reason, {
      x: xPos + 0.25, y: isSelected ? 2.5 : 2.2, w: 2.3, h: 0.9,
      fontSize: 12, fontFace: BODY_FONT, color: isSelected ? LIGHT_GRAY : GRAY,
      margin: 0
    });
  });

  // Selection rationale callout
  s4.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 3.85, w: 8.8, h: 0.9, fill: { color: LIGHT_GOLD }
  });
  s4.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 3.85, w: 0.08, h: 0.9, fill: { color: GOLD }
  });
  s4.addText([
    { text: "WHY THIS SEGMENT  ", options: { bold: true, fontSize: 11, color: GOLD } },
    { text: DATA.interestDiscovery.selectionRationale, options: { fontSize: 13, color: NAVY } }
  ], {
    x: 1.0, y: 3.85, w: 8.2, h: 0.9, valign: "middle", margin: 0
  });

  addFooter(s4);

  // --------------------------------------------------------
  // SLIDE 5: Section Divider — Market Research
  // --------------------------------------------------------
  let s5 = pres.addSlide();
  s5.background = { color: NAVY };

  s5.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 2.0, w: 2.2, h: 0.06, fill: { color: GOLD }
  });
  s5.addText("Segment Research", {
    x: 0.8, y: 2.2, w: 8.4, h: 1.0,
    fontSize: 38, fontFace: HEADER_FONT, color: WHITE, bold: true, margin: 0
  });
  s5.addText("Deep dive into our chosen market", {
    x: 0.8, y: 3.2, w: 8.4, h: 0.5,
    fontSize: 16, fontFace: BODY_FONT, color: GOLD, italic: true, margin: 0
  });
  s5.addText("Step 3", {
    x: 0.8, y: 4.0, w: 2, h: 0.4,
    fontSize: 12, fontFace: BODY_FONT, color: WHITE, transparency: 40, margin: 0
  });

  // --------------------------------------------------------
  // SLIDE 6: Market Overview — Big Stats
  // --------------------------------------------------------
  let s6 = pres.addSlide();
  s6.background = { color: CREAM };

  s6.addText("Market at a Glance", {
    x: 0.6, y: 0.3, w: 8.8, h: 0.65,
    fontSize: 30, fontFace: HEADER_FONT, color: NAVY, bold: true, margin: 0
  });

  const stats = [
    { value: DATA.segmentResearch.marketSize, label: DATA.segmentResearch.marketSizeLabel },
    { value: DATA.segmentResearch.growthRate, label: DATA.segmentResearch.growthLabel },
    { value: DATA.segmentResearch.targetUsers, label: DATA.segmentResearch.targetLabel }
  ];

  stats.forEach((stat, i) => {
    const xPos = 0.6 + (i * 3.1);
    // White card
    s6.addShape(pres.shapes.RECTANGLE, {
      x: xPos, y: 1.2, w: 2.8, h: 2.4, fill: { color: WHITE },
      shadow: cardShadow()
    });
    // Gold top bar
    s6.addShape(pres.shapes.RECTANGLE, {
      x: xPos, y: 1.2, w: 2.8, h: 0.06, fill: { color: GOLD }
    });
    // Big number
    s6.addText(stat.value, {
      x: xPos, y: 1.5, w: 2.8, h: 1.2,
      fontSize: 44, fontFace: HEADER_FONT, color: NAVY,
      bold: true, align: "center", valign: "middle"
    });
    // Label
    s6.addText(stat.label, {
      x: xPos + 0.2, y: 2.7, w: 2.4, h: 0.7,
      fontSize: 13, fontFace: BODY_FONT, color: GRAY,
      align: "center", valign: "top"
    });
  });

  // Key trends
  s6.addText("KEY TRENDS", {
    x: 0.6, y: 3.85, w: 2, h: 0.35,
    fontSize: 10, fontFace: BODY_FONT, color: GOLD, bold: true, margin: 0
  });

  DATA.segmentResearch.trends.forEach((trend, i) => {
    const col = i < 2 ? 0 : 1;
    const row = i % 2;
    s6.addText(`\u2022  ${trend}`, {
      x: 0.6 + (col * 4.6), y: 4.2 + (row * 0.4), w: 4.4, h: 0.35,
      fontSize: 11, fontFace: BODY_FONT, color: NAVY, margin: 0
    });
  });

  addFooter(s6);

  // --------------------------------------------------------
  // SLIDE 7: Customer Pain Points
  // --------------------------------------------------------
  let s7 = pres.addSlide();
  s7.background = { color: CREAM };

  s7.addText("Customer Pain Points", {
    x: 0.6, y: 0.3, w: 8.8, h: 0.65,
    fontSize: 30, fontFace: HEADER_FONT, color: NAVY, bold: true, margin: 0
  });

  DATA.segmentResearch.painPoints.forEach((pp, i) => {
    const yPos = 1.2 + (i * 1.0);

    // Gold numbered circle
    s7.addShape(pres.shapes.OVAL, {
      x: 0.6, y: yPos + 0.12, w: 0.45, h: 0.45, fill: { color: GOLD }
    });
    s7.addText(String(i + 1), {
      x: 0.6, y: yPos + 0.12, w: 0.45, h: 0.45,
      fontSize: 16, fontFace: BODY_FONT, color: NAVY,
      bold: true, align: "center", valign: "middle"
    });
    // Title
    s7.addText(pp.title, {
      x: 1.3, y: yPos, w: 8.0, h: 0.35,
      fontSize: 17, fontFace: BODY_FONT, color: NAVY, bold: true, margin: 0
    });
    // Description
    s7.addText(pp.description, {
      x: 1.3, y: yPos + 0.38, w: 8.0, h: 0.45,
      fontSize: 13, fontFace: BODY_FONT, color: GRAY, margin: 0
    });
  });

  addFooter(s7);

  // --------------------------------------------------------
  // SLIDE 8: Competitive Landscape
  // --------------------------------------------------------
  let s8 = pres.addSlide();
  s8.background = { color: CREAM };

  s8.addText("Competitive Landscape", {
    x: 0.6, y: 0.3, w: 8.8, h: 0.65,
    fontSize: 30, fontFace: HEADER_FONT, color: NAVY, bold: true, margin: 0
  });

  // Table header
  const compHeaderRow = [
    { text: "Competitor", options: { bold: true, color: WHITE, fill: { color: NAVY }, fontSize: 13, fontFace: BODY_FONT } },
    { text: "Strength", options: { bold: true, color: WHITE, fill: { color: NAVY }, fontSize: 13, fontFace: BODY_FONT } },
    { text: "Weakness", options: { bold: true, color: WHITE, fill: { color: NAVY }, fontSize: 13, fontFace: BODY_FONT } }
  ];

  const compRows = DATA.segmentResearch.competitors.map((c, i) => [
    { text: c.name, options: { bold: true, fontSize: 12, color: NAVY, fontFace: BODY_FONT, fill: { color: i % 2 === 0 ? WHITE : LIGHT_GRAY } } },
    { text: c.strength, options: { fontSize: 12, color: NAVY, fontFace: BODY_FONT, fill: { color: i % 2 === 0 ? WHITE : LIGHT_GRAY } } },
    { text: c.weakness, options: { fontSize: 12, color: DANGER, fontFace: BODY_FONT, fill: { color: i % 2 === 0 ? WHITE : LIGHT_GRAY } } }
  ]);

  s8.addTable([compHeaderRow, ...compRows], {
    x: 0.6, y: 1.2, w: 8.8,
    border: { pt: 0.5, color: LIGHT_GRAY },
    colW: [2.2, 3.3, 3.3],
    rowH: [0.5, 0.5, 0.5, 0.5, 0.5]
  });

  // Opportunity callout
  s8.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 3.9, w: 8.8, h: 0.85, fill: { color: LIGHT_GOLD }
  });
  s8.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 3.9, w: 0.08, h: 0.85, fill: { color: GOLD }
  });
  s8.addText([
    { text: "OPPORTUNITY GAP  ", options: { bold: true, fontSize: 11, color: GOLD } },
    { text: "No competitor offers a unified AI-powered platform combining health records, predictive analytics, and telehealth in one experience.", options: { fontSize: 13, color: NAVY } }
  ], {
    x: 1.0, y: 3.9, w: 8.2, h: 0.85, valign: "middle", margin: 0
  });

  addFooter(s8);

  // --------------------------------------------------------
  // SLIDE 9: Pugh Rubric
  // --------------------------------------------------------
  let s9 = pres.addSlide();
  s9.background = { color: CREAM };

  s9.addShape(pres.shapes.OVAL, { x: 0.6, y: 0.3, w: 0.5, h: 0.5, fill: { color: GOLD } });
  s9.addText("4", { x: 0.6, y: 0.3, w: 0.5, h: 0.5, fontSize: 18, fontFace: BODY_FONT, color: NAVY, bold: true, align: "center", valign: "middle" });
  s9.addText("Evaluation Rubric", { x: 1.25, y: 0.3, w: 8.2, h: 0.55, fontSize: 30, fontFace: HEADER_FONT, color: NAVY, bold: true, margin: 0 });

  // Criteria table
  const rubricHeader = [
    { text: "Criteria", options: { bold: true, color: WHITE, fill: { color: NAVY }, fontSize: 12, fontFace: BODY_FONT } },
    { text: "Weight", options: { bold: true, color: WHITE, fill: { color: NAVY }, fontSize: 12, fontFace: BODY_FONT, align: "center" } },
    { text: "What We Measure", options: { bold: true, color: WHITE, fill: { color: NAVY }, fontSize: 12, fontFace: BODY_FONT } }
  ];

  const rubricRows = DATA.rubric.criteria.map((c, i) => [
    { text: c.name, options: { bold: true, fontSize: 11, color: NAVY, fontFace: BODY_FONT, fill: { color: i % 2 === 0 ? WHITE : LIGHT_GRAY } } },
    { text: c.weight, options: { fontSize: 12, color: GOLD, fontFace: BODY_FONT, bold: true, align: "center", fill: { color: i % 2 === 0 ? WHITE : LIGHT_GRAY } } },
    { text: c.description, options: { fontSize: 11, color: GRAY, fontFace: BODY_FONT, fill: { color: i % 2 === 0 ? WHITE : LIGHT_GRAY } } }
  ]);

  s9.addTable([rubricHeader, ...rubricRows], {
    x: 0.6, y: 1.1, w: 8.8,
    border: { pt: 0.5, color: LIGHT_GRAY },
    colW: [2.8, 1.0, 5.0],
    rowH: [0.42, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4]
  });

  // Scoring scale + thresholds
  s9.addText([
    { text: "SCORING: ", options: { bold: true, fontSize: 10, color: GOLD } },
    { text: DATA.rubric.scoringScale, options: { fontSize: 10, color: GRAY } },
    { text: "     |     ", options: { fontSize: 10, color: LIGHT_GRAY } },
    { text: "THRESHOLDS: ", options: { bold: true, fontSize: 10, color: GOLD } },
    { text: DATA.rubric.threshold, options: { fontSize: 10, color: GRAY } }
  ], {
    x: 0.6, y: 4.8, w: 8.8, h: 0.3, margin: 0
  });

  addFooter(s9);

  // --------------------------------------------------------
  // SLIDE 10: SCAMPER Process
  // --------------------------------------------------------
  let s10 = pres.addSlide();
  s10.background = { color: CREAM };

  s10.addShape(pres.shapes.OVAL, { x: 0.6, y: 0.3, w: 0.5, h: 0.5, fill: { color: GOLD } });
  s10.addText("5", { x: 0.6, y: 0.3, w: 0.5, h: 0.5, fontSize: 18, fontFace: BODY_FONT, color: NAVY, bold: true, align: "center", valign: "middle" });
  s10.addText("SCAMPER Ideation", { x: 1.25, y: 0.3, w: 7, h: 0.55, fontSize: 30, fontFace: HEADER_FONT, color: NAVY, bold: true, margin: 0 });
  s10.addText(`${DATA.scamper.totalGenerated} concepts generated`, {
    x: 7.5, y: 0.35, w: 2.0, h: 0.45,
    fontSize: 13, fontFace: BODY_FONT, color: GOLD, italic: true, align: "right", margin: 0
  });

  // SCAMPER cards - 4 left, 3 right
  DATA.scamper.highlights.forEach((item, i) => {
    const col = i < 4 ? 0 : 1;
    const row = i < 4 ? i : i - 4;
    const xPos = 0.6 + (col * 4.7);
    const yPos = 1.1 + (row * 1.05);

    // Card background
    s10.addShape(pres.shapes.RECTANGLE, {
      x: xPos, y: yPos, w: 4.4, h: 0.9, fill: { color: WHITE },
      shadow: cardShadow()
    });
    // Gold left accent
    s10.addShape(pres.shapes.RECTANGLE, {
      x: xPos, y: yPos, w: 0.07, h: 0.9, fill: { color: GOLD }
    });
    // Prompt label
    s10.addText(item.prompt.toUpperCase(), {
      x: xPos + 0.25, y: yPos + 0.08, w: 4.0, h: 0.28,
      fontSize: 9, fontFace: BODY_FONT, color: GOLD, bold: true, margin: 0
    });
    // Idea
    s10.addText(item.idea, {
      x: xPos + 0.25, y: yPos + 0.38, w: 4.0, h: 0.45,
      fontSize: 12, fontFace: BODY_FONT, color: NAVY, margin: 0
    });
  });

  addFooter(s10);

  // --------------------------------------------------------
  // SLIDE 11: Pugh Matrix
  // --------------------------------------------------------
  let s11 = pres.addSlide();
  s11.background = { color: CREAM };

  s11.addShape(pres.shapes.OVAL, { x: 0.6, y: 0.3, w: 0.5, h: 0.5, fill: { color: GOLD } });
  s11.addText("6", { x: 0.6, y: 0.3, w: 0.5, h: 0.5, fontSize: 18, fontFace: BODY_FONT, color: NAVY, bold: true, align: "center", valign: "middle" });
  s11.addText("Pugh Matrix Selection", { x: 1.25, y: 0.3, w: 8.2, h: 0.55, fontSize: 30, fontFace: HEADER_FONT, color: NAVY, bold: true, margin: 0 });

  // Matrix table header
  const pughHeader = [
    { text: "Criteria", options: { bold: true, color: WHITE, fill: { color: NAVY }, fontSize: 11, fontFace: BODY_FONT } },
    { text: "Wt", options: { bold: true, color: WHITE, fill: { color: NAVY }, fontSize: 11, fontFace: BODY_FONT, align: "center" } },
    ...DATA.pughMatrix.concepts.map(c => ({
      text: c.name, options: {
        bold: true, color: WHITE,
        fill: { color: c.name === DATA.pughMatrix.winner ? GOLD : NAVY },
        fontSize: 10, fontFace: BODY_FONT, align: "center"
      }
    }))
  ];

  const pughRows = DATA.rubric.criteria.map((crit, i) => {
    const row = [
      { text: crit.name, options: { fontSize: 10, color: NAVY, fontFace: BODY_FONT, fill: { color: i % 2 === 0 ? WHITE : LIGHT_GRAY } } },
      { text: crit.weight, options: { fontSize: 10, color: GRAY, fontFace: BODY_FONT, align: "center", fill: { color: i % 2 === 0 ? WHITE : LIGHT_GRAY } } }
    ];

    DATA.pughMatrix.concepts.forEach(concept => {
      const score = concept.scores[i];
      const scoreColor = score >= 4 ? SUCCESS : score >= 3 ? NAVY : score >= 2 ? CAUTION : DANGER;
      row.push({
        text: String(score), options: {
          fontSize: 11, color: scoreColor, fontFace: BODY_FONT,
          bold: score >= 4, align: "center",
          fill: { color: i % 2 === 0 ? WHITE : LIGHT_GRAY }
        }
      });
    });
    return row;
  });

  // Total row
  const totalRow = [
    { text: "WEIGHTED SCORE", options: { bold: true, fontSize: 11, color: WHITE, fill: { color: NAVY }, fontFace: BODY_FONT } },
    { text: "", options: { fill: { color: NAVY } } },
    ...DATA.pughMatrix.concepts.map(c => ({
      text: c.total, options: {
        bold: true, fontSize: 12,
        color: c.name === DATA.pughMatrix.winner ? NAVY : WHITE,
        fill: { color: c.name === DATA.pughMatrix.winner ? GOLD : NAVY },
        fontFace: BODY_FONT, align: "center"
      }
    }))
  ];

  const conceptColW = DATA.pughMatrix.concepts.length <= 4
    ? Array(DATA.pughMatrix.concepts.length).fill((8.8 - 2.6 - 0.7) / DATA.pughMatrix.concepts.length)
    : Array(DATA.pughMatrix.concepts.length).fill(1.2);

  s11.addTable([pughHeader, ...pughRows, totalRow], {
    x: 0.6, y: 1.0, w: 8.8,
    border: { pt: 0.5, color: LIGHT_GRAY },
    colW: [2.6, 0.7, ...conceptColW],
    rowH: [0.4, ...Array(DATA.rubric.criteria.length).fill(0.38), 0.45]
  });

  addFooter(s11);

  // --------------------------------------------------------
  // SLIDE 12: Winning Concept Hero
  // --------------------------------------------------------
  let s12 = pres.addSlide();
  s12.background = { color: NAVY };

  s12.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 1.3, w: 2.2, h: 0.06, fill: { color: GOLD }
  });

  s12.addText("Winning Concept", {
    x: 0.8, y: 1.5, w: 8.4, h: 0.6,
    fontSize: 18, fontFace: BODY_FONT, color: GOLD, bold: true, margin: 0
  });

  s12.addText(DATA.pughMatrix.winner, {
    x: 0.8, y: 2.1, w: 8.4, h: 1.0,
    fontSize: 40, fontFace: HEADER_FONT, color: WHITE, bold: true, margin: 0
  });

  s12.addText(DATA.pughMatrix.winnerRationale, {
    x: 0.8, y: 3.2, w: 7, h: 0.8,
    fontSize: 15, fontFace: BODY_FONT, color: WHITE, transparency: 20, margin: 0
  });

  // Score badge
  const winnerData = DATA.pughMatrix.concepts.find(c => c.name === DATA.pughMatrix.winner);
  if (winnerData) {
    s12.addShape(pres.shapes.RECTANGLE, {
      x: 0.8, y: 4.2, w: 1.6, h: 0.65, fill: { color: GOLD }
    });
    s12.addText(winnerData.total, {
      x: 0.8, y: 4.2, w: 1.6, h: 0.65,
      fontSize: 22, fontFace: HEADER_FONT, color: NAVY,
      bold: true, align: "center", valign: "middle"
    });
    s12.addText("Weighted Score", {
      x: 2.6, y: 4.2, w: 2, h: 0.65,
      fontSize: 12, fontFace: BODY_FONT, color: WHITE, transparency: 30,
      valign: "middle", margin: 0
    });
  }

  // --------------------------------------------------------
  // SLIDE 13: Specifications — Must-Have
  // --------------------------------------------------------
  let s13 = pres.addSlide();
  s13.background = { color: CREAM };

  s13.addShape(pres.shapes.OVAL, { x: 0.6, y: 0.3, w: 0.5, h: 0.5, fill: { color: GOLD } });
  s13.addText("7", { x: 0.6, y: 0.3, w: 0.5, h: 0.5, fontSize: 18, fontFace: BODY_FONT, color: NAVY, bold: true, align: "center", valign: "middle" });
  s13.addText("Product Specifications", { x: 1.25, y: 0.3, w: 8.2, h: 0.55, fontSize: 30, fontFace: HEADER_FONT, color: NAVY, bold: true, margin: 0 });

  // Must-Have section
  s13.addText("MUST-HAVE FEATURES", {
    x: 0.6, y: 1.05, w: 4, h: 0.3,
    fontSize: 10, fontFace: BODY_FONT, color: GOLD, bold: true, margin: 0
  });

  DATA.specifications.mustHave.forEach((feat, i) => {
    const yPos = 1.4 + (i * 0.75);
    s13.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: yPos, w: 4.2, h: 0.65, fill: { color: WHITE },
      shadow: cardShadow()
    });
    s13.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: yPos, w: 0.06, h: 0.65, fill: { color: NAVY }
    });
    s13.addText(feat.name, {
      x: 0.85, y: yPos + 0.05, w: 3.8, h: 0.25,
      fontSize: 13, fontFace: BODY_FONT, color: NAVY, bold: true, margin: 0
    });
    s13.addText(feat.description, {
      x: 0.85, y: yPos + 0.32, w: 3.8, h: 0.28,
      fontSize: 11, fontFace: BODY_FONT, color: GRAY, margin: 0
    });
  });

  // Excitement section
  s13.addText("EXCITEMENT FEATURES", {
    x: 5.2, y: 1.05, w: 4, h: 0.3,
    fontSize: 10, fontFace: BODY_FONT, color: GOLD, bold: true, margin: 0
  });

  DATA.specifications.excitement.forEach((feat, i) => {
    const yPos = 1.4 + (i * 0.75);
    s13.addShape(pres.shapes.RECTANGLE, {
      x: 5.2, y: yPos, w: 4.2, h: 0.65, fill: { color: WHITE },
      shadow: cardShadow()
    });
    s13.addShape(pres.shapes.RECTANGLE, {
      x: 5.2, y: yPos, w: 0.06, h: 0.65, fill: { color: GOLD }
    });
    s13.addText(feat.name, {
      x: 5.45, y: yPos + 0.05, w: 3.8, h: 0.25,
      fontSize: 13, fontFace: BODY_FONT, color: NAVY, bold: true, margin: 0
    });
    s13.addText(feat.description, {
      x: 5.45, y: yPos + 0.32, w: 3.8, h: 0.28,
      fontSize: 11, fontFace: BODY_FONT, color: GRAY, margin: 0
    });
  });

  // Performance features
  s13.addText("PERFORMANCE FEATURES", {
    x: 0.6, y: 3.65, w: 4, h: 0.3,
    fontSize: 10, fontFace: BODY_FONT, color: GOLD, bold: true, margin: 0
  });

  DATA.specifications.performance.forEach((feat, i) => {
    const xPos = 0.6 + (i * 4.6);
    s13.addShape(pres.shapes.RECTANGLE, {
      x: xPos, y: 3.95, w: 4.2, h: 0.65, fill: { color: WHITE },
      shadow: cardShadow()
    });
    s13.addShape(pres.shapes.RECTANGLE, {
      x: xPos, y: 3.95, w: 0.06, h: 0.65, fill: { color: CAUTION } }
    );
    s13.addText(feat.name, {
      x: xPos + 0.25, y: 4.0, w: 3.8, h: 0.25,
      fontSize: 13, fontFace: BODY_FONT, color: NAVY, bold: true, margin: 0
    });
    s13.addText(feat.description, {
      x: xPos + 0.25, y: 4.27, w: 3.8, h: 0.28,
      fontSize: 11, fontFace: BODY_FONT, color: GRAY, margin: 0
    });
  });

  addFooter(s13);

  // --------------------------------------------------------
  // SLIDE 14: Section Divider — PRD
  // --------------------------------------------------------
  let s14 = pres.addSlide();
  s14.background = { color: NAVY };

  s14.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 2.0, w: 2.2, h: 0.06, fill: { color: GOLD }
  });
  s14.addText("Product Requirements", {
    x: 0.8, y: 2.2, w: 8.4, h: 1.0,
    fontSize: 38, fontFace: HEADER_FONT, color: WHITE, bold: true, margin: 0
  });
  s14.addText("Our initial PRD for the selected concept", {
    x: 0.8, y: 3.2, w: 8.4, h: 0.5,
    fontSize: 16, fontFace: BODY_FONT, color: GOLD, italic: true, margin: 0
  });
  s14.addText("Step 8", {
    x: 0.8, y: 4.0, w: 2, h: 0.4,
    fontSize: 12, fontFace: BODY_FONT, color: WHITE, transparency: 40, margin: 0
  });

  // --------------------------------------------------------
  // SLIDE 15: Problem & Solution
  // --------------------------------------------------------
  let s15 = pres.addSlide();
  s15.background = { color: CREAM };

  s15.addText("Problem & Solution", {
    x: 0.6, y: 0.3, w: 8.8, h: 0.65,
    fontSize: 30, fontFace: HEADER_FONT, color: NAVY, bold: true, margin: 0
  });

  // Problem card
  s15.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 1.2, w: 4.2, h: 2.8, fill: { color: WHITE },
    shadow: cardShadow()
  });
  s15.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 1.2, w: 4.2, h: 0.5, fill: { color: DANGER }
  });
  s15.addText("THE PROBLEM", {
    x: 0.6, y: 1.2, w: 4.2, h: 0.5,
    fontSize: 13, fontFace: BODY_FONT, color: WHITE, bold: true,
    align: "center", valign: "middle"
  });
  s15.addText(DATA.prd.problem, {
    x: 0.9, y: 1.9, w: 3.6, h: 1.8,
    fontSize: 14, fontFace: BODY_FONT, color: NAVY, valign: "top", margin: 0
  });

  // Solution card
  s15.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 1.2, w: 4.2, h: 2.8, fill: { color: WHITE },
    shadow: cardShadow()
  });
  s15.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 1.2, w: 4.2, h: 0.5, fill: { color: SUCCESS }
  });
  s15.addText("OUR SOLUTION", {
    x: 5.2, y: 1.2, w: 4.2, h: 0.5,
    fontSize: 13, fontFace: BODY_FONT, color: WHITE, bold: true,
    align: "center", valign: "middle"
  });
  s15.addText(DATA.prd.solution, {
    x: 5.5, y: 1.9, w: 3.6, h: 1.8,
    fontSize: 14, fontFace: BODY_FONT, color: NAVY, valign: "top", margin: 0
  });

  // Target user bar
  s15.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 4.2, w: 8.8, h: 0.65, fill: { color: LIGHT_GOLD }
  });
  s15.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 4.2, w: 0.08, h: 0.65, fill: { color: GOLD }
  });
  s15.addText([
    { text: "TARGET USER  ", options: { bold: true, fontSize: 11, color: GOLD } },
    { text: DATA.prd.targetUser, options: { fontSize: 13, color: NAVY } }
  ], {
    x: 1.0, y: 4.2, w: 8.2, h: 0.65, valign: "middle", margin: 0
  });

  addFooter(s15);

  // --------------------------------------------------------
  // SLIDE 16: Key Features
  // --------------------------------------------------------
  let s16 = pres.addSlide();
  s16.background = { color: CREAM };

  s16.addText("Key Features", {
    x: 0.6, y: 0.3, w: 8.8, h: 0.65,
    fontSize: 30, fontFace: HEADER_FONT, color: NAVY, bold: true, margin: 0
  });

  DATA.prd.keyFeatures.forEach((feat, i) => {
    const yPos = 1.15 + (i * 0.82);

    s16.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: yPos, w: 8.8, h: 0.7, fill: { color: WHITE },
      shadow: cardShadow()
    });
    s16.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: yPos, w: 0.06, h: 0.7, fill: { color: GOLD }
    });

    // Number
    s16.addShape(pres.shapes.OVAL, {
      x: 0.85, y: yPos + 0.15, w: 0.4, h: 0.4, fill: { color: GOLD }
    });
    s16.addText(String(i + 1), {
      x: 0.85, y: yPos + 0.15, w: 0.4, h: 0.4,
      fontSize: 14, fontFace: BODY_FONT, color: NAVY,
      bold: true, align: "center", valign: "middle"
    });

    s16.addText(feat, {
      x: 1.5, y: yPos, w: 7.7, h: 0.7,
      fontSize: 15, fontFace: BODY_FONT, color: NAVY, valign: "middle", margin: 0
    });
  });

  addFooter(s16);

  // --------------------------------------------------------
  // SLIDE 17: Success Metrics
  // --------------------------------------------------------
  let s17 = pres.addSlide();
  s17.background = { color: CREAM };

  s17.addText("Success Metrics", {
    x: 0.6, y: 0.3, w: 8.8, h: 0.65,
    fontSize: 30, fontFace: HEADER_FONT, color: NAVY, bold: true, margin: 0
  });

  DATA.prd.successMetrics.forEach((m, i) => {
    const xPos = 0.35 + (i * 2.4);

    s17.addShape(pres.shapes.RECTANGLE, {
      x: xPos, y: 1.3, w: 2.15, h: 2.6, fill: { color: WHITE },
      shadow: cardShadow()
    });
    s17.addShape(pres.shapes.RECTANGLE, {
      x: xPos, y: 1.3, w: 2.15, h: 0.06, fill: { color: GOLD }
    });

    // Big metric
    s17.addText(m.metric, {
      x: xPos, y: 1.6, w: 2.15, h: 1.2,
      fontSize: 38, fontFace: HEADER_FONT, color: NAVY,
      bold: true, align: "center", valign: "middle"
    });
    // Label
    s17.addText(m.label, {
      x: xPos + 0.2, y: 2.9, w: 1.75, h: 0.7,
      fontSize: 12, fontFace: BODY_FONT, color: GRAY,
      align: "center", valign: "top"
    });
  });

  addFooter(s17);

  // --------------------------------------------------------
  // SLIDE 18: Key Takeaways
  // --------------------------------------------------------
  let s18 = pres.addSlide();
  s18.background = { color: CREAM };

  s18.addText("Key Takeaways", {
    x: 0.6, y: 0.3, w: 8.8, h: 0.65,
    fontSize: 30, fontFace: HEADER_FONT, color: NAVY, bold: true, margin: 0
  });

  const takeaways = [
    { num: "1", title: "Clear Market Opportunity", body: `The ${DATA.segmentResearch.marketSizeLabel.toLowerCase()} at ${DATA.segmentResearch.marketSize} with ${DATA.segmentResearch.growthRate} CAGR shows strong growth potential.` },
    { num: "2", title: "Validated Through Rigor", body: `${DATA.scamper.totalGenerated} concepts generated, evaluated against ${DATA.rubric.criteria.length} weighted criteria using dual-model analysis.` },
    { num: "3", title: "Ready for Development", body: `${DATA.pughMatrix.winner} scored ${winnerData ? winnerData.total : "top"} with clear specifications across must-have, performance, and excitement features.` }
  ];

  takeaways.forEach((t, i) => {
    const xPos = 0.6 + (i * 3.1);

    s18.addShape(pres.shapes.RECTANGLE, {
      x: xPos, y: 1.2, w: 2.8, h: 3.2, fill: { color: WHITE },
      shadow: cardShadow()
    });
    // Gold top
    s18.addShape(pres.shapes.RECTANGLE, {
      x: xPos, y: 1.2, w: 2.8, h: 0.06, fill: { color: GOLD }
    });
    // Number
    s18.addText(t.num, {
      x: xPos, y: 1.4, w: 2.8, h: 0.7,
      fontSize: 32, fontFace: HEADER_FONT, color: GOLD,
      bold: true, align: "center", valign: "middle"
    });
    // Title
    s18.addText(t.title, {
      x: xPos + 0.25, y: 2.15, w: 2.3, h: 0.5,
      fontSize: 15, fontFace: BODY_FONT, color: NAVY, bold: true,
      align: "center", margin: 0
    });
    // Body
    s18.addText(t.body, {
      x: xPos + 0.25, y: 2.7, w: 2.3, h: 1.4,
      fontSize: 12, fontFace: BODY_FONT, color: GRAY,
      align: "center", margin: 0
    });
  });

  addFooter(s18);

  // --------------------------------------------------------
  // SLIDE 19: Q&A / Closing
  // --------------------------------------------------------
  let s19 = pres.addSlide();
  s19.background = { color: NAVY };

  s19.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 1.8, w: 2.2, h: 0.06, fill: { color: GOLD }
  });

  s19.addText("Questions?", {
    x: 0.8, y: 2.0, w: 8.4, h: 1.2,
    fontSize: 44, fontFace: HEADER_FONT, color: WHITE, bold: true, margin: 0
  });

  s19.addText(DATA.companyName + "  |  " + DATA.productConcept, {
    x: 0.8, y: 3.3, w: 8.4, h: 0.5,
    fontSize: 16, fontFace: BODY_FONT, color: GOLD, italic: true, margin: 0
  });

  s19.addText(DATA.teamName, {
    x: 0.8, y: 4.0, w: 8.4, h: 0.4,
    fontSize: 14, fontFace: BODY_FONT, color: WHITE, transparency: 30, margin: 0
  });

  s19.addText(FOOTER, {
    x: 0.8, y: 4.9, w: 8.4, h: 0.35,
    fontSize: 10, fontFace: BODY_FONT, color: WHITE, transparency: 50, margin: 0
  });

  // --------------------------------------------------------
  // WRITE FILE
  // --------------------------------------------------------
  const outputPath = process.argv[2] || "MKT2700_Team_Presentation.pptx";
  pres.writeFile({ fileName: outputPath })
    .then(() => console.log(`✅ Presentation saved: ${outputPath}`))
    .catch(err => console.error("❌ Error:", err));
}

generatePresentation();
