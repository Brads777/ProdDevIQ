#!/usr/bin/env python3
"""
send_digest.py — Weekly follow-ups digest sender (authoritative SMTP path).
Called by .github/workflows/followups-weekly.yml at 13:00 UTC every Monday.
Parses FOLLOWUPS.md, renders HTML grouped by [Category], sends via SMTP.

Required env vars:
  SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD
Optional:
  DIGEST_TO   (default: brads77@gmail.com)
  DIGEST_FROM (default: SMTP_USER)
"""
import os
import re
import smtplib
import sys
from collections import defaultdict
from datetime import date
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path


FOLLOWUPS_PATH = Path(__file__).parents[2] / "FOLLOWUPS.md"
RECIPIENT = os.getenv("DIGEST_TO", "brads77@gmail.com")


def parse_items(text: str) -> list[dict]:
    """Extract open items between ## Open items and ## Closed."""
    m = re.search(
        r"^## Open items\s*\n(.*?)(?=^## |\Z)",
        text,
        re.MULTILINE | re.DOTALL,
    )
    if not m:
        return []
    section = m.group(1)

    items: list[dict] = []
    parts = re.split(r"^(### \d+\.\s+\[.+?\]\s+.+)$", section, flags=re.MULTILINE)
    i = 1
    while i < len(parts):
        header = parts[i].strip()
        body = parts[i + 1] if i + 1 < len(parts) else ""

        hm = re.match(r"### (\d+)\.\s+\[(.+?)\]\s+(.+)", header)
        if not hm:
            i += 2
            continue

        def field(name: str) -> str:
            fm = re.search(rf"\*\*{name}:\*\*\s*(.+)", body)
            return fm.group(1).strip() if fm else ""

        items.append({
            "number": int(hm.group(1)),
            "category": hm.group(2).strip(),
            "title": hm.group(3).strip(),
            "added": field("Added"),
            "effort": field("Effort"),
            "gate": field("Gate"),
            "plan": field("Plan"),
            "why": field("Why it matters"),
        })
        i += 2

    return items


def render_html(items: list[dict], run_date: str) -> str:
    by_cat: dict[str, list] = defaultdict(list)
    for item in items:
        by_cat[item["category"]].append(item)

    sections: list[str] = []
    for cat in sorted(by_cat):
        rows = "".join(
            f"""
      <tr style="border-bottom:1px solid #eee">
        <td style="padding:8px 12px;vertical-align:top;font-weight:600;white-space:nowrap;color:#555">#{it['number']}</td>
        <td style="padding:8px 12px;vertical-align:top">
          <strong style="font-size:15px">{it['title']}</strong><br>
          <small style="color:#777">Added: {it['added']} &nbsp;|&nbsp; Effort: <strong>{it['effort']}</strong></small><br>
          <span style="color:#c0392b;font-weight:600">&#x26A0; Gate: {it['gate']}</span><br>
          <em>Plan:</em> {it['plan']}<br>
          <em>Why it matters:</em> {it['why']}
        </td>
      </tr>"""
            for it in by_cat[cat]
        )
        sections.append(
            f"""<h2 style="margin:28px 0 8px;color:#2c3e50;border-bottom:2px solid #eee;padding-bottom:4px">{cat}</h2>
    <table style="width:100%;border-collapse:collapse;font-family:sans-serif;font-size:14px">
      {rows}
    </table>"""
        )

    n = len(items)
    return f"""<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Follow-ups digest</title></head>
<body style="font-family:sans-serif;max-width:720px;margin:auto;padding:24px;color:#222">
  <h1 style="color:#2c3e50">Follow-ups digest &mdash; {n} open &middot; {run_date}</h1>
  {''.join(sections)}
  <hr style="margin-top:32px">
  <p style="font-size:12px;color:#999">
    Sent by <code>scripts/followups/send_digest.py</code> via GitHub Actions (SMTP path).<br>
    Source of truth: <code>FOLLOWUPS.md</code> &mdash; brads777/proddeviq.
  </p>
</body>
</html>"""


def main() -> None:
    if not FOLLOWUPS_PATH.exists():
        print("FOLLOWUPS.md not found — skipping digest.", file=sys.stderr)
        sys.exit(0)

    text = FOLLOWUPS_PATH.read_text(encoding="utf-8")
    items = parse_items(text)

    if not items:
        print("No open items — skipping digest.")
        sys.exit(0)

    run_date = date.today().isoformat()
    subject = f"Follow-ups digest — {len(items)} open · {run_date}"
    html = render_html(items, run_date)

    host = os.environ["SMTP_HOST"]
    port = int(os.getenv("SMTP_PORT", "587"))
    user = os.environ["SMTP_USER"]
    password = os.environ["SMTP_PASSWORD"]
    sender = os.getenv("DIGEST_FROM", user)

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = sender
    msg["To"] = RECIPIENT
    msg.attach(MIMEText(html, "html"))

    with smtplib.SMTP(host, port) as server:
        server.ehlo()
        server.starttls()
        server.login(user, password)
        server.sendmail(sender, [RECIPIENT], msg.as_string())

    print(f"Sent: {subject} → {RECIPIENT}")


if __name__ == "__main__":
    main()
