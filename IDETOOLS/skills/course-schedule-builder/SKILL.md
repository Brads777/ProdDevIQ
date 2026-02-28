---
name: course-schedule-builder
description: >
  Build a semester week-by-week date schedule that maps course weeks to actual calendar dates,
  accounting for holidays, breaks, and meeting day patterns. This is a reusable date calculation
  engine — professors configure it once per semester and all dates recalculate automatically.
  Use this skill when a professor needs to create a course calendar, build a semester schedule,
  calculate class meeting dates, generate a date grid, or map weeks to dates. Triggers include
  requests to "build a schedule", "create the course calendar", "calculate my class dates",
  "generate the semester dates", "set up the schedule for Spring 2026", "what dates does my
  class meet", or any request involving mapping course weeks to actual calendar dates with
  holiday awareness. Also triggers when another skill (e.g., syllabus-generator) needs a date
  grid and one has not been generated yet.
---
# ©2026 Brad Scheller

# Course Schedule Builder

Build a semester week-by-week date schedule that maps course weeks to actual calendar dates.
Handles holidays, breaks, irregular meeting patterns, and semester-type variations. Outputs a
structured date grid consumed by the syllabus-generator and other CasesIQ pipeline skills.

## Required Inputs

1. **Semester Type** — Spring, Summer, Fall, or Winter
2. **Start Date** — first day of classes (ISO format: YYYY-MM-DD)
3. **Number of Weeks** — 5, 6, 8, 10, 14, 15, or 16 (configurable, default 15)
4. **Meeting Days** — days the course meets (e.g., Monday/Wednesday, Tuesday/Thursday, Monday only, MWF, daily)
5. **Holidays/Breaks** — list of dates or date ranges to exclude from the schedule
6. **Holiday Behavior** — how to handle missed classes: `shift` (default), `skip`, or `ask`
7. **End Date** — last day of classes (optional — calculated from start date + weeks if omitted)
8. **Final Exam Date** — specific date, "last class + 1 week", or "none" (optional)

If inputs 1-4 are missing, ask the user before proceeding. For inputs 5-8, use sensible defaults and document assumptions.

## Common Holiday Presets

To reduce manual entry, offer the following presets based on semester type. The professor confirms or customizes.

### US Academic Calendar Presets

**Fall Semester:**
- Labor Day — first Monday in September
- Thanksgiving Break — Wednesday through Friday of Thanksgiving week
- Reading Day(s) — typically 1-2 days before finals (institution-specific)

**Spring Semester:**
- Martin Luther King Jr. Day — third Monday in January
- Presidents' Day — third Monday in February
- Spring Break — one full week, typically mid-March (institution-specific, ask for dates)

**Summer Session:**
- Memorial Day — last Monday in May
- Independence Day — July 4 (and observed date if it falls on weekend)
- Juneteenth — June 19 (and observed date if it falls on weekend)

**Winter Session:**
- New Year's Day — January 1
- Martin Luther King Jr. Day — third Monday in January

Present the preset and ask: "These are the standard holidays for [semester type]. Should I use these, or do you need to add/remove any dates?"

## Schedule Generation Workflow

### Step 1: Parse Meeting Pattern

1. Convert the meeting day input to a set of weekday numbers (Monday=0 through Sunday=6).
2. Validate that meeting days are consistent with the course format:
   - Lecture-only: typically 2-3 days/week
   - Lab courses: may include a separate day
   - Daily courses: 5 days/week (intensive/summer)
   - Weekend courses: Saturday and/or Sunday (executive programs)
3. Calculate meetings per week for downstream validation.

### Step 2: Generate Raw Date Grid

1. Starting from the start date, iterate week by week.
2. For each week, calculate the calendar dates for each meeting day.
3. Define each week's boundaries:
   - `startDate`: Monday of that week (or the first meeting day if the course starts mid-week)
   - `endDate`: Friday of that week (or Sunday for weekend courses)
   - `meetingDates`: the specific dates the class meets
4. Continue until the specified number of weeks is reached or the end date is hit.

### Step 3: Apply Holiday Exclusions

For each generated meeting date, check against the holiday/break list:

1. **If a meeting date falls on a holiday:**
   - `shift` mode (default): Remove the date. All subsequent weeks shift forward by the number of lost class days. The semester extends.
   - `skip` mode: Remove the date but keep the week numbering intact. Mark the week with a note (e.g., "No class Monday — MLK Day"). The semester length stays the same, but that week has fewer meetings.
   - `ask` mode: Flag the conflict and ask the professor how to handle it before continuing.

2. **If an entire week falls within a break (e.g., Spring Break):**
   - `shift` mode: Skip the break week entirely. Week numbering resumes after the break. The semester extends by one week.
   - `skip` mode: Include the break as a numbered week with zero meeting dates and a note (e.g., "Spring Break — No Classes").
   - `ask` mode: Present both options and let the professor choose.

3. **Mixed weeks** (e.g., Thanksgiving — Monday/Tuesday meet, Wednesday-Friday off):
   - Keep the partial meeting dates.
   - Note which dates are cancelled and why.

### Step 4: Validate Schedule Integrity

1. Count total meeting dates. Compare against expected count (meetings per week x number of weeks).
2. If the schedule is shorter than expected, warn: "Your schedule has [X] meetings instead of the expected [Y]. [Z] were lost to holidays."
3. If an end date was provided, verify the last meeting date does not exceed it. If it does (because of shift mode), warn and offer to compress.
4. Verify no duplicate dates exist.
5. Verify all meeting dates fall on the correct weekday.

### Step 5: Add Final Exam

1. If a specific final exam date is provided, add it as a special entry after the last regular week.
2. If "last class + 1 week" is specified, calculate it from the last meeting date.
3. If "none" is specified, omit the final exam row.
4. The final exam entry does not count as a regular week.

### Step 6: Format Output

Generate the date grid in the requested format(s). JSON is the primary output for consumption by other skills.

---

## Output Format

### JSON (Primary — for other tools)

```json
{
  "courseCode": "MGT 6100",
  "semester": "Spring 2026",
  "startDate": "2026-01-12",
  "endDate": "2026-05-01",
  "meetingPattern": "Monday/Wednesday",
  "totalWeeks": 15,
  "totalMeetings": 28,
  "holidayBehavior": "skip",
  "weeks": [
    {
      "weekNumber": 1,
      "startDate": "2026-01-12",
      "endDate": "2026-01-16",
      "meetingDates": ["2026-01-13", "2026-01-15"],
      "holidays": [],
      "notes": ""
    },
    {
      "weekNumber": 2,
      "startDate": "2026-01-19",
      "endDate": "2026-01-23",
      "meetingDates": ["2026-01-21"],
      "holidays": [
        {"date": "2026-01-19", "name": "Martin Luther King Jr. Day"}
      ],
      "notes": "Monday class cancelled — MLK Day. One meeting this week."
    },
    {
      "weekNumber": 8,
      "startDate": "2026-03-09",
      "endDate": "2026-03-13",
      "meetingDates": [],
      "holidays": [
        {"date": "2026-03-09", "name": "Spring Break"},
        {"date": "2026-03-10", "name": "Spring Break"},
        {"date": "2026-03-11", "name": "Spring Break"},
        {"date": "2026-03-12", "name": "Spring Break"},
        {"date": "2026-03-13", "name": "Spring Break"}
      ],
      "notes": "Spring Break — No Classes"
    }
  ],
  "finalExam": {
    "date": "2026-05-06",
    "time": "TBD",
    "notes": "Final Exam — see registrar for room assignment"
  }
}
```

### Markdown Table

| Week | Dates | Meeting Days | Holidays/Notes |
|------|-------|-------------|----------------|
| 1 | Jan 12-16 | Mon 1/13, Wed 1/15 | |
| 2 | Jan 19-23 | Wed 1/21 | MLK Day (Mon) |
| 3 | Jan 26-30 | Mon 1/27, Wed 1/29 | |
| ... | ... | ... | ... |
| 8 | Mar 9-13 | -- | Spring Break |
| ... | ... | ... | ... |
| 15 | Apr 27-May 1 | Mon 4/28, Wed 4/30 | |
| -- | May 6 | -- | Final Exam |

### HTML Calendar View

When requested, generate an HTML calendar rendering with:
- Month grid layout (standard calendar format)
- Meeting dates highlighted in the course's brand color
- Holidays marked with a distinct color and tooltip showing the holiday name
- Assignment due dates overlaid (if provided by the syllabus-generator)
- Responsive design for embedding in LMS

---

## Reusability

The key feature of this skill is semester-to-semester reuse:

1. **Save the configuration** — store the meeting pattern, number of weeks, and holiday preset as a course template.
2. **Next semester:** The professor provides only the new start date and any holiday date changes.
3. **Recalculate:** All dates regenerate automatically. The course content (topics, readings, assignments) stays the same — only dates change.
4. **Diff view:** Show what changed between the old and new schedule so the professor can review before publishing.

Template storage format:
```json
{
  "templateName": "MGT 6100 — Strategic Management",
  "meetingPattern": "Monday/Wednesday",
  "numberOfWeeks": 15,
  "holidayPreset": "spring-northeastern",
  "customHolidays": [],
  "finalExamRule": "last class + 1 week"
}
```

---

## Edge Cases

- **Summer terms with variable week lengths:** Summer I (6 weeks), Summer II (6 weeks), Full Summer (12 weeks). Meeting frequency is often higher (4-5 days/week) to compress content. Validate that the meeting count is reasonable.
- **Courses spanning two calendar years:** Fall courses that start in September and end in December are straightforward. Winter intersession courses that start in December and end in January cross the year boundary — ensure date arithmetic handles the year rollover.
- **Courses meeting 5 days/week:** Common in intensive programs and some summer sessions. Generate 5 meeting dates per week instead of 2-3. Holiday impact is larger (one holiday cancels 20% of the week vs. 33-50%).
- **Courses with irregular schedules:** First 8 weeks only (half-semester courses), alternating weeks, or "meets every other Saturday." Support a custom recurrence pattern input.
- **Saturday classes:** Common in executive MBA and professional programs. Saturdays are typically not affected by weekday holidays but may be affected by university closures (e.g., holiday weekends). Include Saturday awareness in the holiday logic.
- **Online asynchronous courses:** No specific meeting dates, but content is released on a weekly schedule. Generate weekly windows (Monday 12:00 AM to Sunday 11:59 PM) instead of meeting dates. Assignments still have specific due dates (typically Sunday night).
- **Courses with a different start week:** Some courses start in Week 2 of the semester (late-start courses). Support an offset parameter.
- **Multiple meeting patterns:** A course that meets Monday for lecture and Wednesday for lab at different times. Track each pattern separately but merge into a single weekly view.
- **Snow days / emergency closures:** Support adding ad-hoc cancellations after the schedule is generated. Recalculate downstream dates if in `shift` mode.

---

## Integration with Other CasesIQ Skills

| Skill | Integration Point |
|-------|-------------------|
| **syllabus-generator** | Primary consumer. The date grid JSON feeds directly into the syllabus course schedule table, populating the Dates column. |
| **quiz-generator** | Quiz due dates are placed on specific meeting dates from this grid. The quiz-generator can request "Quiz on Week 5, second meeting" and this skill resolves it to an actual date. |
| **case-grader** | Case submission deadlines reference specific dates from this grid. |
| **roadmap-builder** | The roadmap defines the number of modules/weeks. This skill validates that the date grid has enough weeks to accommodate all roadmap modules. |
| **docx-generator** | When the schedule is exported as a standalone document (e.g., a printable calendar), the docx-generator handles formatting. |
