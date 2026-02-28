---
name: video-reader
description: >
  Extract and analyze content from video files including transcription, key frames, metadata,
  chapter markers, and embedded text (OCR). Use this skill when a user uploads or references a
  video file and needs to understand its content, extract a transcript, pull key frames, summarize
  lectures, or analyze visual content. Triggers include requests to "read this video", "transcribe
  this lecture", "extract key frames", "summarize this recording", "get the transcript", "analyze
  this video", or any task requiring content extraction from video files (.mp4, .mov, .avi, .mkv,
  .webm, .wmv).
---

# ©2026 Brad Scheller

# Video Content Reader

Extract structured content from video files — transcription, key frames, metadata, chapter
markers, and on-screen text — for downstream analysis, grading, or summarization.

## Required Inputs

1. **Video File** — path to a video file (.mp4, .mov, .avi, .mkv, .webm, .wmv)
2. **Extraction Mode** — one of: `full`, `transcript`, `keyframes`, `metadata`, `chapters`
   (default: `full`)
3. **Language** — ISO 639-1 code for transcription language (default: `en`)
4. **Output Format** — one of: `markdown`, `json`, `plain` (default: `markdown`)

If the video file is missing, ask the user to provide it.

## Supported Formats

| Format | Extension | Notes |
|--------|-----------|-------|
| MP4 | .mp4 | Most common; H.264/H.265 + AAC |
| QuickTime | .mov | Apple ecosystem |
| AVI | .avi | Legacy Windows format |
| Matroska | .mkv | Open container, any codec |
| WebM | .webm | VP8/VP9 + Opus/Vorbis |
| Windows Media | .wmv | Legacy; may need codec |

---

## Extraction Workflow

### Step 1: Validate File
- Confirm the file exists and has a supported video extension
- Verify it's a valid media container using ffprobe

```bash
ffprobe -v error -show_entries format=format_name,duration,size \
  -show_entries stream=codec_type,codec_name,width,height \
  -of json "<file_path>"
```

### Step 2: Extract Metadata
Use ffprobe to extract comprehensive metadata:

```bash
ffprobe -v error -show_format -show_streams -of json "<file_path>"
```

Parse for:
- **Duration** — total length in HH:MM:SS
- **Resolution** — width x height (e.g., 1920x1080)
- **Frame rate** — fps
- **Video codec** — H.264, H.265, VP9, etc.
- **Audio codec** — AAC, Opus, MP3, etc.
- **Audio channels** — mono, stereo, 5.1
- **Sample rate** — 44100, 48000 Hz
- **File size** — in MB/GB
- **Title** — from metadata tags
- **Creation date** — from metadata tags
- **Chapter markers** — from format chapters (if present)

### Step 3: Extract Audio Track
Separate the audio for transcription:

```bash
ffmpeg -i "<file_path>" -vn -acodec pcm_s16le -ar 16000 -ac 1 \
  "$TEMP_DIR/audio.wav"
```

Options:
- `-vn` — discard video
- `-acodec pcm_s16le` — 16-bit PCM (best for speech recognition)
- `-ar 16000` — 16kHz sample rate (optimal for most ASR models)
- `-ac 1` — mono channel

### Step 4: Transcribe Audio
Use one of the available transcription methods (in order of preference):

#### Option A: Whisper (Local)
```bash
# If whisper is installed locally
whisper "$TEMP_DIR/audio.wav" --model medium --language en \
  --output_format json --output_dir "$TEMP_DIR/"
```

Whisper outputs include word-level timestamps in the JSON format:
```json
{
  "segments": [
    {
      "start": 0.0,
      "end": 4.5,
      "text": "Welcome to today's lecture on strategic management."
    }
  ]
}
```

#### Option B: Cloud ASR API
If local Whisper is unavailable, use a cloud speech-to-text API:
- Google Cloud Speech-to-Text
- NVIDIA RIVA (if voice bridge is deployed)
- Azure Speech Service

For long videos (>10 minutes), split audio into chunks:
```bash
ffmpeg -i "$TEMP_DIR/audio.wav" -f segment -segment_time 300 \
  -c copy "$TEMP_DIR/chunk_%03d.wav"
```

#### Option C: Embedded Subtitles
Check for embedded subtitle tracks first (no transcription needed):
```bash
ffprobe -v error -select_streams s -show_entries stream=index,codec_name \
  -of csv=p=0 "<file_path>"
```

If subtitles exist, extract them:
```bash
ffmpeg -i "<file_path>" -map 0:s:0 "$TEMP_DIR/subtitles.srt"
```

### Step 5: Extract Key Frames
Capture representative frames from the video for visual analysis:

#### Scene-Change Detection (Preferred)
```bash
ffmpeg -i "<file_path>" -vf "select='gt(scene,0.3)',showinfo" \
  -vsync vfr "$TEMP_DIR/keyframe_%04d.png" 2>&1 | \
  grep showinfo | grep pts_time
```

This captures frames where >30% of pixels change (scene transitions).

#### Fixed Interval Fallback
If scene detection produces too few/many frames:
```bash
# One frame per 30 seconds
ffmpeg -i "<file_path>" -vf "fps=1/30" "$TEMP_DIR/frame_%04d.png"
```

#### Thumbnail Generation
For a quick overview grid:
```bash
ffmpeg -i "<file_path>" -vf "select='not(mod(n,300))',scale=320:-1,tile=4x4" \
  "$TEMP_DIR/thumbnail_grid.png"
```

### Step 6: OCR On-Screen Text (Optional)
For lecture recordings, slides-on-screen, or screencasts, extract visible text:

1. Capture frames at regular intervals (every 5 seconds for slide-heavy content)
2. Run OCR on each frame to detect on-screen text
3. Deduplicate consecutive frames with identical text (same slide still showing)
4. Map text to timestamps

```bash
# Capture frames every 5 seconds
ffmpeg -i "<file_path>" -vf "fps=1/5" "$TEMP_DIR/ocr_frame_%04d.png"
```

Then process each frame for text extraction. Group identical/near-identical text blocks
to determine slide transition points.

### Step 7: Detect Chapter Markers
Some videos have embedded chapters:
```bash
ffprobe -v error -show_chapters -of json "<file_path>"
```

If no embedded chapters, generate automatic chapter suggestions based on:
- Scene changes (from Step 5)
- Long pauses in audio (>3 seconds of silence)
- Topic shifts in transcript (keyword clustering)

---

## Output Formats

### Markdown Output (default)
```markdown
# [Video Title or Filename]
**Duration:** 1:23:45 | **Resolution:** 1920x1080 | **Size:** 2.3 GB
**Date:** 2026-01-15 | **Codec:** H.264 + AAC

---

## Chapters

| # | Time | Title |
|---|------|-------|
| 1 | 00:00 | Introduction |
| 2 | 05:30 | Market Analysis |
| 3 | 15:20 | Strategic Recommendations |

---

## Transcript

**[00:00:00]** Welcome to today's lecture on strategic management. We'll be
covering three main topics...

**[00:05:30]** Let's begin with the market analysis. If you look at the data
from Q4...

**[00:15:20]** Based on our analysis, I'd like to recommend three strategic
initiatives...

---

## Key Frames

| Time | Description |
|------|-------------|
| 00:00:05 | Title slide — "Strategic Management Lecture 7" |
| 00:05:32 | Market data chart — bar graph showing Q4 revenue |
| 00:15:22 | Recommendations slide — three bullet points |

---

## On-Screen Text

**[00:00:05 – 00:05:28]**
Strategic Management — Lecture 7
Professor Smith, Spring 2026

**[00:05:30 – 00:15:18]**
Q4 Market Analysis
- Revenue: $4.2M (+12% YoY)
- Market share: 23%
```

### JSON Output
```json
{
  "metadata": {
    "filename": "lecture7.mp4",
    "title": "Strategic Management Lecture 7",
    "duration": 5025.3,
    "durationFormatted": "1:23:45",
    "resolution": { "width": 1920, "height": 1080 },
    "fileSize": 2470000000,
    "videoCodec": "h264",
    "audioCodec": "aac",
    "createdAt": "2026-01-15T14:30:00Z"
  },
  "chapters": [
    { "index": 1, "startTime": 0, "endTime": 330, "title": "Introduction" }
  ],
  "transcript": {
    "segments": [
      { "start": 0.0, "end": 4.5, "text": "Welcome to today's lecture..." }
    ],
    "fullText": "Welcome to today's lecture..."
  },
  "keyFrames": [
    { "time": 5.0, "filename": "keyframe_0001.png", "description": "Title slide" }
  ],
  "onScreenText": [
    { "startTime": 5.0, "endTime": 328.0, "text": "Strategic Management..." }
  ]
}
```

---

## Extraction Modes

| Mode | What's Extracted |
|------|-----------------|
| `full` | Everything: metadata, transcript, key frames, chapters, OCR |
| `transcript` | Audio transcription only with timestamps |
| `keyframes` | Scene-change frames only with timestamps |
| `metadata` | File properties, duration, codecs, embedded metadata |
| `chapters` | Chapter markers (embedded or auto-detected) |

---

## Performance Guidelines

| Video Length | Expected Processing Time | Recommendation |
|-------------|-------------------------|----------------|
| < 5 min | 1-2 minutes | Full extraction |
| 5-30 min | 5-10 minutes | Full extraction |
| 30-60 min | 10-20 minutes | Full or transcript-only |
| 1-3 hours | 20-60 minutes | Transcript + key frames |
| > 3 hours | 60+ minutes | Split into segments first |

For videos longer than 1 hour, consider splitting first:
```bash
# Split into 30-minute segments
ffmpeg -i "<file_path>" -c copy -map 0 -segment_time 1800 \
  -f segment "$TEMP_DIR/segment_%03d.mp4"
```

---

## Edge Cases

- **No audio track**: Skip transcription. Extract key frames and metadata only.
  Inform user: "This video has no audio track — only visual content was extracted."
- **Audio-only files**: (.mp3, .wav, .m4a) — Treat as transcript-only extraction.
  Skip key frames and OCR.
- **Screen recordings**: Increase OCR frame rate to 1/3 seconds (slides change more
  frequently). Enable OCR deduplication.
- **Multiple audio tracks**: Default to track 0 (primary). List available tracks and
  ask user if ambiguous.
- **Corrupted files**: If ffprobe fails, report the error. Do not attempt to force-read.
- **DRM-protected files**: Cannot extract. Inform user.
- **Very large files (>10 GB)**: Warn user about processing time. Suggest `metadata` or
  `transcript` mode to reduce processing.
- **Non-English content**: Specify `--language` flag for Whisper. For unknown languages,
  use `--language auto` for detection.
- **Background music/noise**: Whisper handles moderate noise well. For noisy recordings,
  suggest pre-processing with noise reduction before transcription.
- **Multiple speakers**: Note speaker changes in transcript where detectable. Whisper
  does not natively diarize — if speaker identification is critical, pipe through a
  diarization model (e.g., pyannote.audio) first.

---

## Tool Dependencies

| Tool | Purpose | Required? |
|------|---------|-----------|
| ffmpeg | Audio extraction, key frames, format conversion | Yes |
| ffprobe | Metadata extraction, stream analysis | Yes |
| whisper | Local transcription (OpenAI Whisper) | Preferred |
| Cloud ASR | Fallback transcription | Alternative |

Check availability before starting:
```bash
command -v ffmpeg >/dev/null && echo "ffmpeg: OK" || echo "ffmpeg: MISSING"
command -v ffprobe >/dev/null && echo "ffprobe: OK" || echo "ffprobe: MISSING"
command -v whisper >/dev/null && echo "whisper: OK" || echo "whisper: NOT INSTALLED"
```

If ffmpeg is missing, it must be installed before proceeding. Whisper can be installed via:
```bash
pip install openai-whisper
```

---

## Integration with Other Skills

This skill produces structured output that feeds into:
- **case-grader**: When student submissions include video presentations
- **lessons-learned-generator**: When lecture recordings need to be summarized
- **pptx-reader**: When a video contains embedded slide content (OCR extracts what's on screen,
  but if the original .pptx is available, use pptx-reader for higher fidelity)
- **Any summarization or analysis skill**: Provides transcript and visual context for LLM processing

---

## Cleanup

After extraction, remove temporary files:
```bash
rm -rf "$TEMP_DIR"
```
