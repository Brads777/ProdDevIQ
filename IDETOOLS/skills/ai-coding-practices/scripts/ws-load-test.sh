#!/bin/bash
# =============================================================================
# WebSocket Load Test (Example)
# =============================================================================
# A simple WebSocket load test script using websocat or wscat.
# Tests that the server handles multiple concurrent connections.
#
# Prerequisites:
#   brew install websocat    OR    npm install -g wscat
#
# Usage:
#   ./scripts/ws-load-test.sh <ws-url> <token> [num-connections]
#
# Example:
#   ./scripts/ws-load-test.sh ws://localhost:3000/ws eyJhbGc... 100
# =============================================================================

WS_URL="${1:-ws://localhost:3000/ws}"
TOKEN="${2:-}"
NUM_CONNECTIONS="${3:-50}"

if [ -z "$TOKEN" ]; then
  echo "Usage: $0 <ws-url> <token> [num-connections]"
  echo ""
  echo "Example:"
  echo "  $0 ws://localhost:3000/ws eyJhbGciOiJIUzI1NiJ9... 100"
  exit 1
fi

# Check for available tools
if command -v websocat &>/dev/null; then
  WS_TOOL="websocat"
elif command -v wscat &>/dev/null; then
  WS_TOOL="wscat"
else
  echo "Error: Neither websocat nor wscat found."
  echo "Install one of:"
  echo "  brew install websocat"
  echo "  npm install -g wscat"
  exit 1
fi

echo "WebSocket Load Test"
echo "  URL: $WS_URL"
echo "  Connections: $NUM_CONNECTIONS"
echo "  Tool: $WS_TOOL"
echo ""

PIDS=()
CONNECTED=0
FAILED=0

connect_websocat() {
  local i=$1
  echo "ping" | websocat -1 "${WS_URL}?token=${TOKEN}" 2>/dev/null
  return $?
}

connect_wscat() {
  local i=$1
  echo "ping" | timeout 5 wscat -c "${WS_URL}?token=${TOKEN}" -x "ping" 2>/dev/null
  return $?
}

echo "Opening $NUM_CONNECTIONS connections..."

for i in $(seq 1 "$NUM_CONNECTIONS"); do
  if [ "$WS_TOOL" = "websocat" ]; then
    connect_websocat "$i" &
  else
    connect_wscat "$i" &
  fi
  PIDS+=($!)

  # Stagger connections slightly to avoid overwhelming the server
  if [ $((i % 10)) -eq 0 ]; then
    echo "  Opened $i / $NUM_CONNECTIONS connections..."
    sleep 0.1
  fi
done

echo "  Waiting for all connections to complete..."

for PID in "${PIDS[@]}"; do
  wait "$PID"
  if [ $? -eq 0 ]; then
    CONNECTED=$((CONNECTED + 1))
  else
    FAILED=$((FAILED + 1))
  fi
done

echo ""
echo "Results:"
echo "  Successful: $CONNECTED"
echo "  Failed:     $FAILED"
echo "  Total:      $NUM_CONNECTIONS"

if [ $FAILED -gt 0 ]; then
  echo ""
  echo "Some connections failed. Check server logs for details."
  exit 1
fi

echo ""
echo "All connections successful."
