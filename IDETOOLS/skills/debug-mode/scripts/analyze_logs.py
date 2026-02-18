#!/usr/bin/env python3
"""
Log Analysis Script for Debug Mode

Parses and analyzes debug logs collected during bug reproduction to help
identify root causes. Supports both file input and stdin for flexibility.

Usage:
    python3 analyze_logs.py <log-file>
    python3 analyze_logs.py --stdin
    cat logs.txt | python3 analyze_logs.py --stdin

Options:
    --session-id ID    Filter logs by session ID
    --format FORMAT    Output format: text, json, markdown (default: markdown)
    --trace            Show detailed execution trace
    --anomalies        Highlight potential anomalies in the log data

Examples:
    python3 analyze_logs.py debug_output.log
    python3 analyze_logs.py debug_output.log --trace --anomalies
    python3 analyze_logs.py debug_output.log --format json
"""

import argparse
import json
import re
import sys
from collections import defaultdict
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional


@dataclass
class LogEntry:
    """Represents a single debug log entry."""
    session_id: str
    timestamp: datetime
    location: str
    event_type: str  # ENTRY, EXIT, STATE, ERROR
    data: dict
    raw_line: str
    line_number: int

    @property
    def function_name(self) -> Optional[str]:
        """Extract function name from location."""
        if ':' in self.location:
            return self.location.split(':')[0]
        return self.location

    @property
    def source_line(self) -> Optional[int]:
        """Extract source line number from location."""
        if ':' in self.location:
            try:
                return int(self.location.split(':')[1])
            except (ValueError, IndexError):
                pass
        return None


@dataclass
class FunctionCall:
    """Represents a function call with entry and exit."""
    name: str
    entry: Optional[LogEntry] = None
    exit: Optional[LogEntry] = None
    states: list = field(default_factory=list)
    duration_ms: Optional[float] = None

    def compute_duration(self):
        """Calculate duration between entry and exit."""
        if self.entry and self.exit:
            delta = self.exit.timestamp - self.entry.timestamp
            self.duration_ms = delta.total_seconds() * 1000


@dataclass
class AnalysisResult:
    """Complete analysis of debug logs."""
    session_id: str
    total_entries: int
    time_range: tuple
    functions_called: list
    execution_trace: list
    anomalies: list
    call_stack: list
    state_changes: list


# Log parsing regex
LOG_PATTERN = re.compile(
    r'\[DEBUG:(\w+)\]\s*'  # Session ID
    r'(\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(?:\.\d+)?)\s*\|\s*'  # Timestamp
    r'([^|]+)\s*\|\s*'  # Location
    r'(\w+)\s*\|\s*'  # Event type
    r'(.*)'  # Data
)


def parse_log_line(line: str, line_number: int) -> Optional[LogEntry]:
    """Parse a single log line into a LogEntry."""
    match = LOG_PATTERN.search(line)
    if not match:
        return None

    session_id, timestamp_str, location, event_type, data_str = match.groups()

    # Parse timestamp (handle various formats)
    timestamp_str = timestamp_str.strip()
    for fmt in ['%Y-%m-%dT%H:%M:%S.%f', '%Y-%m-%dT%H:%M:%S', '%Y-%m-%d %H:%M:%S.%f', '%Y-%m-%d %H:%M:%S']:
        try:
            timestamp = datetime.strptime(timestamp_str[:26], fmt)
            break
        except ValueError:
            continue
    else:
        timestamp = datetime.now()

    # Parse data (try JSON first, then key=value pairs)
    data = {}
    data_str = data_str.strip()

    if data_str:
        # Try to extract key=value or key={...}
        kv_match = re.match(r'(\w+)=(.+)', data_str)
        if kv_match:
            key, value = kv_match.groups()
            try:
                data[key] = json.loads(value)
            except json.JSONDecodeError:
                data[key] = value
        else:
            try:
                data = json.loads(data_str)
            except json.JSONDecodeError:
                data = {'raw': data_str}

    return LogEntry(
        session_id=session_id.strip(),
        timestamp=timestamp,
        location=location.strip(),
        event_type=event_type.strip().upper(),
        data=data,
        raw_line=line.strip(),
        line_number=line_number
    )


def parse_logs(content: str, session_filter: Optional[str] = None) -> list[LogEntry]:
    """Parse all debug log entries from content."""
    entries = []
    for i, line in enumerate(content.split('\n'), 1):
        if '[DEBUG:' in line:
            entry = parse_log_line(line, i)
            if entry:
                if session_filter is None or entry.session_id == session_filter:
                    entries.append(entry)
    return entries


def build_execution_trace(entries: list[LogEntry]) -> list[FunctionCall]:
    """Build a trace of function calls from log entries."""
    calls = []
    call_stack = []
    function_calls = {}  # Track in-progress calls

    for entry in sorted(entries, key=lambda e: e.timestamp):
        func_name = entry.function_name

        if entry.event_type == 'ENTRY':
            call = FunctionCall(name=func_name, entry=entry)
            function_calls[func_name] = call
            call_stack.append(call)

        elif entry.event_type == 'EXIT':
            if func_name in function_calls:
                call = function_calls[func_name]
                call.exit = entry
                call.compute_duration()
                calls.append(call)
                del function_calls[func_name]
                if call in call_stack:
                    call_stack.remove(call)

        elif entry.event_type == 'STATE':
            # Attach state to current function call
            if call_stack:
                call_stack[-1].states.append(entry)

    # Add any unclosed calls
    for call in function_calls.values():
        calls.append(call)

    return calls


def detect_anomalies(entries: list[LogEntry], calls: list[FunctionCall]) -> list[dict]:
    """Detect potential anomalies in the execution."""
    anomalies = []

    # Check for functions that entered but never exited
    for call in calls:
        if call.entry and not call.exit:
            anomalies.append({
                'type': 'UNCLOSED_FUNCTION',
                'severity': 'high',
                'location': call.entry.location,
                'message': f'Function {call.name} was entered but never exited',
                'entry': call.entry
            })

    # Check for unusually long function durations
    durations = [c.duration_ms for c in calls if c.duration_ms is not None]
    if durations:
        avg_duration = sum(durations) / len(durations)
        for call in calls:
            if call.duration_ms and call.duration_ms > avg_duration * 10:
                anomalies.append({
                    'type': 'SLOW_FUNCTION',
                    'severity': 'medium',
                    'location': call.entry.location if call.entry else call.name,
                    'message': f'Function {call.name} took {call.duration_ms:.2f}ms (avg: {avg_duration:.2f}ms)',
                    'duration_ms': call.duration_ms
                })

    # Check for error events
    for entry in entries:
        if entry.event_type == 'ERROR':
            anomalies.append({
                'type': 'ERROR_LOGGED',
                'severity': 'high',
                'location': entry.location,
                'message': f'Error at {entry.location}: {entry.data}',
                'entry': entry
            })

    # Check for None/null return values
    for entry in entries:
        if entry.event_type == 'EXIT':
            ret_val = entry.data.get('return')
            if ret_val is None or ret_val == 'None':
                anomalies.append({
                    'type': 'NULL_RETURN',
                    'severity': 'low',
                    'location': entry.location,
                    'message': f'Function at {entry.location} returned None/null',
                    'entry': entry
                })

    return anomalies


def analyze_logs(content: str, session_filter: Optional[str] = None) -> AnalysisResult:
    """Perform full analysis on debug logs."""
    entries = parse_logs(content, session_filter)

    if not entries:
        return AnalysisResult(
            session_id=session_filter or 'unknown',
            total_entries=0,
            time_range=(None, None),
            functions_called=[],
            execution_trace=[],
            anomalies=[],
            call_stack=[],
            state_changes=[]
        )

    # Determine session ID
    session_ids = set(e.session_id for e in entries)
    session_id = session_filter or (list(session_ids)[0] if len(session_ids) == 1 else 'multiple')

    # Time range
    timestamps = [e.timestamp for e in entries]
    time_range = (min(timestamps), max(timestamps))

    # Build execution trace
    trace = build_execution_trace(entries)

    # Get unique functions
    functions = list(set(e.function_name for e in entries if e.function_name))

    # Extract state changes
    state_changes = [e for e in entries if e.event_type == 'STATE']

    # Detect anomalies
    anomalies = detect_anomalies(entries, trace)

    return AnalysisResult(
        session_id=session_id,
        total_entries=len(entries),
        time_range=time_range,
        functions_called=functions,
        execution_trace=trace,
        anomalies=anomalies,
        call_stack=[],  # Could build current stack from incomplete calls
        state_changes=state_changes
    )


def format_markdown(result: AnalysisResult, show_trace: bool = False) -> str:
    """Format analysis result as markdown."""
    lines = []
    lines.append("# Debug Log Analysis\n")

    lines.append(f"**Session ID:** `{result.session_id}`\n")
    lines.append(f"**Total Log Entries:** {result.total_entries}\n")

    if result.time_range[0]:
        lines.append(f"**Time Range:** {result.time_range[0]} to {result.time_range[1]}\n")

    if result.functions_called:
        lines.append("\n## Functions Called\n")
        for func in result.functions_called:
            lines.append(f"- `{func}`")

    if result.anomalies:
        lines.append("\n## Anomalies Detected\n")
        for anomaly in result.anomalies:
            severity_icon = {'high': '🔴', 'medium': '🟡', 'low': '🟢'}.get(anomaly['severity'], '⚪')
            lines.append(f"{severity_icon} **{anomaly['type']}** at `{anomaly['location']}`")
            lines.append(f"   {anomaly['message']}\n")

    if show_trace and result.execution_trace:
        lines.append("\n## Execution Trace\n")
        lines.append("```")
        for call in result.execution_trace:
            status = '✓' if call.exit else '✗ (no exit)'
            duration = f" ({call.duration_ms:.2f}ms)" if call.duration_ms else ""
            lines.append(f"{call.name}{duration} {status}")

            if call.entry:
                args = call.entry.data.get('args', {})
                if args:
                    lines.append(f"  → args: {json.dumps(args, default=str)}")

            for state in call.states:
                lines.append(f"  | state: {json.dumps(state.data, default=str)}")

            if call.exit:
                ret = call.exit.data.get('return')
                if ret is not None:
                    lines.append(f"  ← return: {json.dumps(ret, default=str)}")
        lines.append("```")

    if result.state_changes:
        lines.append("\n## State Changes\n")
        lines.append("```")
        for state in result.state_changes[:20]:  # Limit to 20
            lines.append(f"[{state.timestamp.strftime('%H:%M:%S.%f')[:-3]}] {state.location}: {json.dumps(state.data, default=str)}")
        if len(result.state_changes) > 20:
            lines.append(f"... and {len(result.state_changes) - 20} more state changes")
        lines.append("```")

    return '\n'.join(lines)


def format_json(result: AnalysisResult) -> str:
    """Format analysis result as JSON."""
    return json.dumps({
        'session_id': result.session_id,
        'total_entries': result.total_entries,
        'time_range': [str(t) if t else None for t in result.time_range],
        'functions_called': result.functions_called,
        'anomalies': result.anomalies,
        'execution_trace': [
            {
                'name': c.name,
                'duration_ms': c.duration_ms,
                'has_exit': c.exit is not None,
                'state_count': len(c.states)
            }
            for c in result.execution_trace
        ]
    }, indent=2, default=str)


def format_text(result: AnalysisResult) -> str:
    """Format analysis result as plain text."""
    lines = []
    lines.append(f"Debug Log Analysis - Session: {result.session_id}")
    lines.append(f"Total entries: {result.total_entries}")
    lines.append(f"Functions: {', '.join(result.functions_called)}")

    if result.anomalies:
        lines.append("\nAnomalies:")
        for a in result.anomalies:
            lines.append(f"  [{a['severity'].upper()}] {a['type']}: {a['message']}")

    return '\n'.join(lines)


def main():
    parser = argparse.ArgumentParser(
        description='Analyze debug logs collected during bug reproduction'
    )
    parser.add_argument('file', nargs='?', help='Log file to analyze')
    parser.add_argument('--stdin', action='store_true',
                       help='Read logs from stdin')
    parser.add_argument('--session-id', '-s',
                       help='Filter logs by session ID')
    parser.add_argument('--format', '-f', choices=['text', 'json', 'markdown'],
                       default='markdown', help='Output format')
    parser.add_argument('--trace', '-t', action='store_true',
                       help='Show detailed execution trace')
    parser.add_argument('--anomalies', '-a', action='store_true',
                       help='Focus on anomalies (always shown, this emphasizes them)')

    args = parser.parse_args()

    # Read input
    if args.stdin or args.file is None:
        content = sys.stdin.read()
    else:
        try:
            with open(args.file, 'r') as f:
                content = f.read()
        except FileNotFoundError:
            print(f"Error: File not found: {args.file}")
            sys.exit(1)

    # Analyze
    result = analyze_logs(content, args.session_id)

    if result.total_entries == 0:
        print("No debug log entries found in input.")
        print("Expected format: [DEBUG:<session-id>] <timestamp> | <location> | <event-type> | <data>")
        sys.exit(1)

    # Format output
    if args.format == 'json':
        print(format_json(result))
    elif args.format == 'text':
        print(format_text(result))
    else:
        print(format_markdown(result, show_trace=args.trace))


if __name__ == '__main__':
    main()
