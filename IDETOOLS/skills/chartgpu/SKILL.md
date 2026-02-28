---
name: chartgpu
description: >
  WebGPU-accelerated charting library for rendering massive datasets at 60fps.
  1M+ data points with smooth interaction. Based on ChartGPU.
  Trigger on /chartgpu.
allowed-tools: Read, Write, Edit
---
# ©2026 Brad Scheller

# ChartGPU — WebGPU High-Performance Charts

**Source:** [github.com/ChartGPU/ChartGPU](https://github.com/ChartGPU/ChartGPU)

**Purpose:** GPU-accelerated charting library that renders 1 million+ data points at 60fps using WebGPU. Drop-in replacement for Chart.js/D3 when dealing with large datasets.

## Trigger Commands

- `/chartgpu` — Show integration guide
- `/chartgpu setup` — Generate boilerplate for a ChartGPU project
- `/chartgpu migrate` — Migrate from Chart.js/D3 to ChartGPU

## Key Features

| Feature | Details |
|---------|---------|
| 1M points @ 60fps | WebGPU rendering pipeline |
| Chart types | Line, area, bar, scatter, pie, candlestick |
| Density modes | Scatter density, heatmap |
| Annotations | Overlay annotations on any chart |
| Streaming | `appendData()` for real-time data |
| Themes | Built-in theme presets |
| TypeScript | Full type definitions |

## Quick Start

```typescript
import { ChartGPU } from 'chartgpu';

const chart = new ChartGPU({
  container: document.getElementById('chart'),
  type: 'line',
  data: {
    labels: timestamps,
    datasets: [{
      label: 'Sensor Data',
      data: sensorReadings, // 1M+ points
      color: '#3b82f6',
    }],
  },
  options: {
    gpu: true,
    streaming: true,
    density: 'auto', // auto-switch to density mode for large datasets
  },
});

// Stream new data
websocket.onmessage = (event) => {
  chart.appendData(JSON.parse(event.data));
};
```

## When to Use

- **Use ChartGPU** when: >10K data points, real-time streaming, financial charts, IoT dashboards
- **Use Chart.js** when: <1K data points, simple static charts, no WebGPU needed
- **Use D3** when: Custom/exotic visualizations, SVG manipulation needed

## Browser Support

Requires WebGPU (Chrome 113+, Edge 113+, Firefox behind flag). Falls back to WebGL for older browsers.
