"""
Slide transition detector for PowerPoint presentation videos.
Extracts frames, detects transitions via histogram comparison,
and generates YouTube-formatted timestamps.
"""

import cv2
import numpy as np
import os
import sys
from pathlib import Path

VIDEO_PATH = r"E:\neu\Powerpoint presentation files files\AI in NPD.mp4"
OUTPUT_DIR = r"E:\neu\Powerpoint presentation files files\slides_output"
SAMPLE_INTERVAL = 0.5       # Sample every 0.5 seconds
HIST_THRESHOLD = 0.85       # Below this correlation = new slide
MIN_SLIDE_GAP = 3.0         # Minimum seconds between transitions
SAVE_THUMBNAILS = True       # Save a thumbnail per detected slide


def format_timestamp(seconds):
    """Format seconds as HH:MM:SS or MM:SS for YouTube."""
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    if h > 0:
        return f"{h}:{m:02d}:{s:02d}"
    return f"{m}:{s:02d}"


def compute_histogram(frame):
    """Compute normalized HSV histogram for a frame."""
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    hist = cv2.calcHist([hsv], [0, 1], None, [50, 60], [0, 180, 0, 256])
    cv2.normalize(hist, hist)
    return hist


def detect_transitions(video_path):
    """Detect slide transitions by comparing frame histograms."""
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"ERROR: Cannot open video: {video_path}")
        sys.exit(1)

    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration = total_frames / fps
    frame_step = int(fps * SAMPLE_INTERVAL)

    print(f"Video: {duration:.1f}s, {fps:.1f} fps, {total_frames} frames")
    print(f"Sampling every {SAMPLE_INTERVAL}s ({frame_step} frames)")
    print()

    transitions = []
    prev_hist = None
    frame_idx = 0

    while True:
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
        ret, frame = cap.read()
        if not ret:
            break

        current_time = frame_idx / fps
        hist = compute_histogram(frame)

        if prev_hist is not None:
            correlation = cv2.compareHist(prev_hist, hist, cv2.HISTCMP_CORREL)

            if correlation < HIST_THRESHOLD:
                # Check minimum gap from last transition
                if not transitions or (current_time - transitions[-1][0]) >= MIN_SLIDE_GAP:
                    transitions.append((current_time, frame.copy(), correlation))
                    print(f"  Transition at {format_timestamp(current_time)} "
                          f"(corr={correlation:.3f})")
        else:
            # First frame is always slide 1
            transitions.append((current_time, frame.copy(), 1.0))
            print(f"  Slide 1 at {format_timestamp(current_time)}")

        prev_hist = hist
        frame_idx += frame_step

    cap.release()
    return transitions, duration


def save_thumbnails(transitions, output_dir):
    """Save a thumbnail image for each detected slide."""
    os.makedirs(output_dir, exist_ok=True)
    for i, (timestamp, frame, _) in enumerate(transitions):
        thumb = cv2.resize(frame, (640, 360))
        filename = f"slide_{i+1:03d}_{format_timestamp(timestamp).replace(':', '-')}.jpg"
        cv2.imwrite(os.path.join(output_dir, filename), thumb)
    print(f"\nThumbnails saved to: {output_dir}")


def generate_timestamps(transitions, duration):
    """Generate YouTube-formatted timestamp list."""
    lines = []
    lines.append("=" * 50)
    lines.append("YOUTUBE TIMESTAMPS")
    lines.append("=" * 50)
    lines.append("")

    for i, (timestamp, _, corr) in enumerate(transitions):
        label = f"Slide {i + 1}"
        lines.append(f"{format_timestamp(timestamp)} {label}")

    lines.append("")
    lines.append(f"Total slides detected: {len(transitions)}")
    lines.append(f"Video duration: {format_timestamp(duration)}")
    return "\n".join(lines)


def main():
    print("Slide Transition Detector")
    print("=" * 50)
    print(f"Input: {VIDEO_PATH}")
    print()

    transitions, duration = detect_transitions(VIDEO_PATH)

    print(f"\nDetected {len(transitions)} slides")

    if SAVE_THUMBNAILS:
        save_thumbnails(transitions, OUTPUT_DIR)

    timestamps = generate_timestamps(transitions, duration)
    print()
    print(timestamps)

    # Save timestamps to file
    ts_path = os.path.join(OUTPUT_DIR, "youtube_timestamps.txt")
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    with open(ts_path, "w") as f:
        f.write(timestamps)
    print(f"\nTimestamps saved to: {ts_path}")


if __name__ == "__main__":
    main()
