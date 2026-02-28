---
name: hume-emotion-ai
description: >
  Hume AI integration for emotion-aware agent responses. Empathic Voice
  Interface, expression measurement, and affective computing patterns.
  Trigger on /hume, /emotion-ai.
allowed-tools: Read, Write, Edit, Bash
---
# ©2026 Brad Scheller

# Hume Emotion AI Integration

**Source:** [hume.ai](https://www.hume.ai/) | [dev.hume.ai](https://dev.hume.ai/intro)

**Purpose:** Add emotional intelligence to AI agent interactions using Hume's Empathic Voice Interface (EVI) and Expression Measurement API. Detect emotional tone in user input and adapt agent responses accordingly.

## Trigger Commands

- `/hume` — Show Hume AI integration guide
- `/hume setup` — Generate API client and webhook handlers
- `/emotion-ai` — Alias

## Hume APIs

### Empathic Voice Interface (EVI)
Real-time voice analysis detecting emotional tone, vocal stress, and satisfaction cues.

```typescript
import { HumeClient } from 'hume';

const client = new HumeClient({ apiKey: process.env.HUME_API_KEY });

// Analyze voice input
const analysis = await client.expressionMeasurement.batch.startInferenceJob({
  models: { prosody: {} },
  urls: [audioUrl],
});
// Returns: joy, sadness, anger, fear, surprise, contempt scores
```

### Expression Measurement API
Send images, audio, or video for structured emotion predictions.

```typescript
const result = await client.expressionMeasurement.batch.startInferenceJob({
  models: {
    face: {},      // Facial expression analysis
    prosody: {},   // Voice emotion analysis
    language: {},  // Text sentiment analysis
  },
  urls: [mediaUrl],
});
```

### Text-to-Speech (Expressive)
Generate speech that adapts emotional tone to context.

## Integration Patterns

### Emotion-Aware Response Middleware

```typescript
async function emotionMiddleware(userMessage: string) {
  // Analyze text sentiment
  const emotions = await client.expressionMeasurement.batch.startInferenceJob({
    models: { language: {} },
    text: [userMessage],
  });

  const dominant = getDominantEmotion(emotions);

  // Adjust agent system prompt based on detected emotion
  const toneGuide = {
    frustration: 'Be direct, acknowledge difficulty, focus on solutions',
    confusion: 'Be patient, use simple language, provide examples',
    excitement: 'Match energy, be encouraging, build on enthusiasm',
    anxiety: 'Be reassuring, break into small steps, validate concerns',
  };

  return toneGuide[dominant] || 'Be helpful and professional';
}
```

### Emotion Dashboard

Track emotional trends across user interactions:

```typescript
interface EmotionMetric {
  timestamp: Date;
  dominant: string;
  scores: Record<string, number>;
  satisfaction: number;
}
```

## Environment Setup

```env
HUME_API_KEY=your_api_key_here
HUME_SECRET_KEY=your_secret_key_here
```

## Use Cases

| Use Case | API | Integration |
|----------|-----|-------------|
| Customer support | Language + Prosody | Detect frustration early |
| Education | Face + Language | Gauge comprehension |
| Accessibility | Prosody | Voice-based emotional feedback |
| UX research | Face + Language | Measure user satisfaction |
