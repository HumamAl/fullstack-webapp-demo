# Domain Knowledge Brief — B2B Engineering Team Ops Platform (Project / Sprint Management)

## Sub-Domain Classification

Mid-size B2B SaaS engineering org (2-4 product squads, 15-40 engineers, shipping weekly). The client builds ongoing web applications — not a greenfield startup and not an enterprise monolith. Their team runs Scrum or a hybrid Scrum/Kanban. They track sprints, PRs, deployments, and DORA metrics. The demo must feel like an internal eng-ops dashboard that a Staff Engineer or Engineering Manager would actually use daily — not a generic "project tracker."

---

## Job Analyst Vocabulary — Confirmed and Extended

No formal Job Analyst brief was provided. The vocabulary below is derived from the job posting's stack (React + MUI, Java Spring Boot, Node.js microservices, Oracle/SQL, Playwright, GraphQL) and standard full-stack engineering team operations.

### Confirmed Primary Entity Names

These are the words that must appear in every UI label — sidebar nav, table headers, KPI card titles, status badges, search placeholders.

- Primary record type: **Issue** (Jira, Linear) or **Task** — "ticket" is acceptable; "card" is Trello-specific; "item" is too generic
- Sprint record: **Sprint** (Scrum) — use "Sprint 23" not "Iteration 4"
- Collection of work above sprint level: **Epic**
- High-level planning container: **Project** or **Initiative**
- People roles: **Engineer**, **Engineering Manager (EM)**, **Product Manager (PM)**, **QA Engineer**, **DevOps / Platform Engineer**, **Tech Lead**, **Scrum Master**
- Deployment record: **Release** or **Deployment** (not "push" or "ship")
- Code review: **Pull Request (PR)** — "merge request" is GitLab-specific
- Secondary entities: **Milestone**, **Backlog**, **Story**, **Bug**, **Subtask**, **Label/Tag**

### Expanded KPI Vocabulary

| KPI Name | What It Measures | Typical Format |
|---|---|---|
| Sprint Velocity | Story points completed per sprint | count (e.g., 47 pts) |
| Cycle Time | Hours/days from "In Progress" to "Done" | time (e.g., 2.4 days avg) |
| Lead Time for Changes | Hours from code commit to production deploy | time (e.g., 18h) |
| Deployment Frequency | How often team deploys to production | rate (e.g., 3.2/week) |
| Change Failure Rate | % of deployments causing incidents | % (e.g., 4.7%) |
| Mean Time to Restore (MTTR) | Time to recover from production incidents | time (e.g., 34 min) |
| Sprint Completion Rate | % of committed story points delivered | % (e.g., 84%) |
| PR Review Time | Median time for PR approval | time (e.g., 6.2 hrs) |
| Test Coverage | % of codebase covered by automated tests | % (e.g., 73%) |
| Bug Escape Rate | Bugs found in production vs. QA | % (e.g., 12%) |
| Open PRs Aging >48h | Count of PRs stuck without review | count |
| Backlog Depth | Total open issues in product backlog | count |

### Status Label Vocabulary

Issue workflow — exact strings used in Jira, Linear, and similar tools:

- Active states: **In Progress**, **In Review**, **In QA**, **Blocked**
- Queued states: **Backlog**, **To Do**, **Ready for Dev**, **Ready for QA**
- Problem states: **Blocked**, **At Risk**, **On Hold**, **Needs Triage**
- Terminal states: **Done**, **Closed**, **Won't Fix**, **Duplicate**, **Cancelled**

Sprint states:
- **Planning**, **Active**, **Complete**, **Cancelled**

Deployment states:
- **Queued**, **Building**, **Deploying**, **Live**, **Rolled Back**, **Failed**

PR states:
- **Draft**, **Open**, **Changes Requested**, **Approved**, **Merged**, **Closed**

### Workflow and Action Vocabulary

- Primary actions: **assign**, **triage**, **groom** (backlog grooming), **close**, **merge**, **deploy**, **rollback**, **resolve**, **reopen**
- Secondary actions: **prioritize**, **estimate** (story points), **link** (link to epic/issue), **comment**, **flag**, **escalate** (for blocked items), **cherry-pick** (commits)
- Sprint actions: **plan sprint**, **start sprint**, **complete sprint**, **carry over** (incomplete items)

### Sidebar Navigation Candidates

Domain-specific navigation that engineering tools actually use — not generic SaaS labels:

- **Sprint Board** (primary kanban/scrum board view)
- **Backlog** (ordered product backlog)
- **Issues** (all issues with filtering)
- **Projects** (initiative / epic level view)
- **Deployments** (CI/CD pipeline runs and release history)
- **Metrics** (DORA metrics dashboard — velocity, cycle time, MTTR)
- **Team** (team members, workload distribution)

---

## Design Context — Visual Language of This Industry

### What "Premium" Looks Like in This Domain

Engineering team tools have a specific visual language that practitioners recognize instantly. The gold standard is **Linear** — minimalist, keyboard-first, dark-mode native with near-black backgrounds (not true black), subtle sidebar dividers, monospace font for identifiers (issue numbers, commit hashes), compact list density, and a quiet color palette with a single electric accent (Linear uses a vibrant purple/indigo). Every element earns its pixel.

Practitioners who use Jira, Linear, GitHub Issues, or Shortcut all day have internalized two competing aesthetics. **Linear/GitHub** crowd: minimal, fast, dark, keyboard-driven — visual complexity = friction. **Jira/Confluence** crowd: information-dense, structured, lots of visible metadata per item — everything configurable. The client posting this job writes "ongoing web application" and lists Spring Boot + microservices, suggesting a mature engineering org. They likely lean toward the Linear school — tools that get out of the way.

The critical detail: developers notice **monospace numerics** on identifiers and metrics immediately. PRD-2847, commit `a3f9c12`, story points as a pill badge, deployment build numbers — these read as "built by someone who codes" vs. "built by a consultant who googled agile." Status badges should be minimal chips/pills (not heavy colored boxes), consistent radius, with a 2-3 color palette: neutral gray for standard states, amber for blocked/at-risk, green for done/live, red for failed/critical.

### Real-World Apps Clients Would Recognize as "Premium"

1. **Linear** — The benchmark for modern dev team tooling. Extremely minimal: dark sidebar with icon + label at 14px, tight list rows (36-40px height), issue identifiers in monospace (ENG-247), status as colored circles not full badges, priority icons instead of text labels, instant search. Practitioners treat it as a reference for "what good feels like" in 2025 dev tooling. Color: near-black bg `#0F0F0F`, primary accent electric purple `#5E6AD2`.

2. **GitHub Projects + GitHub Issues** — The most familiar interface for developers. Tabular, monospace identifiers, PR status chips (Draft/Open/Merged/Closed) with distinct colors, a compact activity timeline, assignee avatars on each row. Developers cross-reference issues with PRs constantly — linking is expected.

3. **Jira Software (2025 redesign)** — The enterprise standard. More information-dense than Linear, with explicit sprint boards, burndown charts, velocity reports, and epic trees. The 2025 redesign is cleaner than previous versions. Even developers who dislike Jira have internalized its vocabulary: epic > story > subtask, story points, sprint planning, backlog grooming.

### Aesthetic Validation

- **Job Analyst chose**: Linear/Minimal (SaaS/Dev Tools industry default, and appropriate here)
- **Domain validation**: Confirmed. This is precisely where Linear/Minimal aesthetic originated — developer team tooling. Linear.app, Vercel, GitHub itself all use this visual language. The client will recognize it as "this developer uses modern tooling."
- **One adjustment**: Lean toward the darker end of Linear/Minimal. Use a near-black sidebar (`oklch(0.10 0.02 270)`) rather than a white one — Linear's dark mode is the canonical reference and most engineers use dark mode exclusively. Primary hue: electric indigo/violet rather than a generic blue. `oklch(0.55 0.22 270)` produces a distinctive violet that reads as "dev tool" not "generic SaaS."

### Density and Layout Expectations

**Standard-to-compact density.** Engineering ops practitioners are power users. Compact row heights (36-42px per issue row), tight spacing between sidebar nav items, monospace text for all identifiers. More information visible per screen without scrolling = more professional. Think GitHub Issues list: no cards, just dense rows with avatar, issue number, title, labels, assignee, date.

Layout pattern: **list-heavy with one board view**. The sprint board is a kanban (columns of card stacks), but every other view is a table/list. Dashboard leads with stat row (4-6 DORA/velocity cards), followed by a trend chart, followed by a dense issue table. No marketing-style cards with large images. Practitioner-grade = dense, tabular, precise.

---

## Entity Names (10+ realistic names)

### Companies / Organizations (Engineering teams at B2B SaaS companies)

These are realistic engineering team or company names — naming patterns used by real mid-size B2B SaaS orgs:

1. Stackline Analytics
2. Meridian Platform Inc.
3. Cortex Systems
4. Bridgepoint Software
5. Luminary Labs
6. Crestfield Technology
7. Ovation Networks
8. Northgate DevOps Co.
9. Helix Platform
10. Ironveil Security

### People Names (role-appropriate for full-stack engineering teams)

Demographically realistic mix for a typical U.S./global engineering org:

- **Aisha Patel** — Engineering Manager
- **Marcus Chen** — Tech Lead / Staff Engineer
- **Sofia Rios** — Senior Full Stack Engineer
- **Jordan Webb** — Product Manager
- **Tariq Hassan** — Backend Engineer (Java/Spring Boot)
- **Elena Novak** — Frontend Engineer (React/MUI)
- **Darnell Bryant** — QA Engineer / SDET
- **Priya Nair** — DevOps / Platform Engineer
- **Lucas Ferreira** — Scrum Master
- **Mei Lin** — Senior Full Stack Engineer
- **Ravi Sharma** — Junior Engineer

### Products / Services (software features or project names)

Realistic naming patterns for B2B SaaS engineering initiatives:

1. Billing Microservice v2 (Java Spring Boot)
2. User Auth Refactor (GraphQL migration)
3. Reporting Dashboard — Phase 1
4. Oracle DB Migration — MSSQL Legacy
5. Playwright E2E Test Suite — Checkout Flow
6. API Gateway Rate Limiting
7. MUI v6 Component Library Upgrade
8. Multi-tenant SSO (SAML 2.0)
9. Background Job Processor (Node.js)
10. Admin Panel Rebuild (React + MUI)
11. Data Export Service (CSV/XLS)
12. Notification Service Overhaul

---

## Realistic Metric Ranges

| Metric | Low | Typical | High | Notes |
|--------|-----|---------|------|-------|
| Sprint Velocity (story pts) | 22 pts | 41–55 pts | 78 pts | Per 2-week sprint, 4-6 engineer team; Atlassian agile benchmarks |
| Cycle Time (issue avg) | 0.8 days | 2.3–3.7 days | 9+ days | "In Progress" to "Done"; LinearB / DORA research |
| Lead Time for Changes | 4 hrs | 18–36 hrs | 4+ days | Commit to prod deploy; DORA "Elite" < 1hr, "Low" > 1 week |
| Deployment Frequency | 1/week | 2–5/week | Multiple/day | DORA "Elite" = multiple/day; mid-teams = 2-5/week |
| Change Failure Rate | 0.5% | 4–8% | 18%+ | DORA "Elite" < 5%; industry avg 7-10% |
| MTTR (Mean Time to Restore) | 12 min | 34–90 min | 8+ hrs | DORA "Elite" < 1hr; typical = 30-90 min |
| Sprint Completion Rate | 58% | 78–86% | 97% | % of committed story points delivered |
| PR Review Time (median) | 1.2 hrs | 5–8 hrs | 48+ hrs | PRs aging >48hr without review = team pain point |
| Test Coverage % | 38% | 62–74% | 91% | Playwright / unit test combined; varies by codebase age |
| Active Issues (per sprint) | 12 | 28–45 | 80+ | Total In Progress + To Do items per sprint |
| Bug Escape Rate | 2% | 8–14% | 30%+ | Bugs reaching prod vs. caught in QA |
| Engineers per team | 3 | 5–8 | 15 | "Squad" size in a microservices org |

---

## Industry Terminology Glossary (15 terms)

| Term | Definition | Usage Context |
|------|-----------|---------------|
| Epic | Large feature or initiative spanning multiple sprints | Top-level container in backlog; groups related issues |
| Sprint | Time-boxed iteration (usually 2 weeks) | Core scrum unit; "Sprint 23" not "Iteration 4" |
| Story Points | Abstract effort estimate (Fibonacci: 1, 2, 3, 5, 8, 13) | Issue estimation; velocity calculated in story points |
| Velocity | Avg story points completed per sprint (over 3+ sprints) | Sprint planning input; team performance trend |
| Cycle Time | Time from "In Progress" to "Done" for an issue | Measures delivery speed; DORA flow metric |
| Lead Time for Changes | Time from commit to production deploy | DORA metric; measures release pipeline efficiency |
| DORA Metrics | Four DevOps performance KPIs (Deploy Freq, Lead Time, CFR, MTTR) | Org-level engineering health; used by EMs and VPs |
| Definition of Done (DoD) | Team-agreed criteria an issue must meet to be "Done" | Gates the Done column on sprint board |
| Backlog Grooming | Session to estimate, prioritize, and refine backlog issues | Also called "Backlog Refinement" in Scrum 2020 |
| Burndown Chart | Sprint chart showing remaining work (story pts) over time | Visual indicator of sprint health |
| Standup / Daily Scrum | 15-min daily sync on blockers and progress | Team ritual; surface "Blocked" issues |
| PR (Pull Request) | Code change submitted for peer review before merge | GitHub/GitLab workflow; central to delivery pipeline |
| CI/CD Pipeline | Automated build → test → deploy chain | DevOps standard; each PR triggers a run |
| Story | User-facing feature description ("As a user, I want...") | Backlog item type; smaller than Epic, larger than Subtask |
| Rollback | Reverting a deployment to a prior stable version | Triggered when Change Failure Rate > threshold |
| SDET | Software Developer in Test — engineers who build test automation | Role title; relevant for Playwright test suite work |
| GraphQL Schema | API contract defining types, queries, mutations | Relevant to this job; appears in architecture docs |

---

## Common Workflows

### Workflow 1: Issue Lifecycle (Scrum Sprint)

1. **Backlog Grooming** — PM and Tech Lead review and estimate backlog issues in story points; issues get priority label (P0/P1/P2/P3)
2. **Sprint Planning** — Team selects issues from backlog for the sprint (capacity planning against velocity); Sprint created with goal statement
3. **Development** — Engineer moves issue from "To Do" → "In Progress"; creates feature branch; commits code
4. **PR Review** — Engineer opens PR linked to issue; Tech Lead or peer reviews; CI/CD pipeline runs automated tests (Playwright E2E + unit)
5. **QA Signoff** — Issue moved to "In QA"; QA Engineer validates acceptance criteria
6. **Definition of Done** — Issue marked "Done" after QA approval + PR merged to main
7. **Sprint Retrospective** — Velocity calculated; completed vs. committed compared; blockers reviewed

### Workflow 2: Deployment Pipeline (CI/CD)

1. **PR Merged** — Developer merges approved PR to `main` branch
2. **CI Build Triggered** — GitHub Actions / Jenkins runs: lint → unit tests → integration tests → build artifact
3. **Staging Deploy** — Automatic deploy to staging environment; Playwright E2E tests run against staging
4. **Approval Gate** — Tech Lead or PM approves production release (or auto-deploy if tests pass + no manual gate)
5. **Production Deploy** — Blue/green or rolling deploy to prod; health checks run
6. **Monitoring** — Ops team monitors error rate, latency, uptime for 30 min post-deploy
7. **Incident (if triggered)** — Alert fires; On-call engineer investigates; MTTR clock starts; rollback if needed

### Workflow 3: Bug Triage

1. **Bug Reported** — Via QA, monitoring alert, or customer support ticket
2. **Triage** — EM or Tech Lead assigns severity (P0 = production down, P1 = major feature broken, P2 = minor issue)
3. **Assignment** — Bug assigned to engineer; linked to affected sprint or hotfix branch
4. **Fix + PR** — Engineer fixes, opens PR with "fix:" commit message convention
5. **Hotfix Deploy** — P0/P1 bugs bypassed normal sprint cycle; emergency deploy pipeline
6. **Post-Mortem** — For P0 incidents: written post-mortem documenting timeline, root cause, action items

---

## Common Edge Cases

1. **Blocked Issue** — Issue in "Blocked" status with a blocker description (e.g., "Waiting on Oracle DB access from infra team") — appears with amber warning badge
2. **Overdue Sprint Items** — Issues committed to a sprint that weren't completed; carried over to next sprint with "Carry Over" label
3. **High Story Point Estimate Outlier** — Issue estimated at 13 or 21 points (very high) — signals unclear requirements; should be split
4. **Failed CI/CD Build** — Deployment stuck in "Failed" state; build logs linked; unblocks nothing until resolved
5. **PR Aging > 72 Hours** — Pull request open but not reviewed; shows in "stale" queue; creates delivery risk
6. **Change Failure / Rollback** — Deployment marked "Rolled Back" after producing elevated error rate; feeds into Change Failure Rate metric
7. **Velocity Spike / Crash** — Sprint with unusually high (100+ pts) or low (< 15 pts) velocity due to team absence, crunch, or scope change
8. **Zero Test Coverage Module** — A service (e.g., legacy Oracle reporting module) with 0% Playwright/test coverage — appears as red in coverage breakdown

---

## What Would Impress a Domain Expert

1. **DORA Metric Performance Tiers** — Showing "Elite / High / Medium / Low" performance bands next to Deployment Frequency and Lead Time (from Google's DORA research, used by every serious engineering org). Elite teams deploy multiple times per day with < 1hr lead time. Showing where the mock team sits on this spectrum makes the dashboard read as genuine eng-ops tooling, not a generic project tracker.

2. **PR Aging Heatmap / Alert** — A dedicated panel for "PRs open > 48h without review" is a real pain point that shows up in every retro at teams with 5+ engineers. This is the #1 complaint in LinearB, Swarmia, and Waydev dashboards. Including it as a KPI signals deep familiarity with dev team operational friction.

3. **Sprint Burndown by Story Points (Not Just Tasks)** — A burndown chart that tracks remaining story points (not issue count) over sprint days is the canonical scrum metric. Teams that use issue count burndown are considered amateur by experienced scrum practitioners. Story points remaining per day is what every Jira board, Linear, and Monday.com scrum board shows.

4. **Monospace Issue Identifiers** — Every issue in the table should have an identifier like `ENG-247` or `PLAT-093` in a monospace pill — not "Issue #247". The prefix convention (ENG for Engineering team, PLAT for Platform, INF for Infra) is standard in Jira and Linear. This is a visual micro-signal that separates "developer built this" from "designer built this."

5. **Playwright Test Coverage as a Separate Metric** — Since the job posting specifically mentions Playwright, showing a "E2E Test Coverage" card (distinct from unit test coverage) would signal direct relevance. Playwright tests cover user flows end-to-end; teams track this separately from unit coverage. Showing both is insider knowledge.

---

## Common Systems & Tools Used

1. **Linear** — Modern issue tracker; favored by product-focused SaaS teams; keyboard-first, minimal UI
2. **Jira Software** — Enterprise standard; epic/story/subtask hierarchy; sprint boards, velocity reports, burndown charts
3. **GitHub / GitHub Actions** — Source control + CI/CD; PR workflow is central; GitHub Projects for lightweight tracking
4. **Confluence** — Documentation and engineering specs; sprint retrospectives, architecture decision records (ADRs)
5. **Datadog** — Application monitoring, APM, log management; MTTR calculations pulled from incident alerts
6. **PagerDuty** — On-call scheduling and incident management; MTTR measurement starts from PagerDuty alert
7. **SonarQube** — Code quality and test coverage analysis; coverage metrics shown in dashboards
8. **Jenkins / CircleCI / GitHub Actions** — CI/CD pipeline runners; build pass rate, deploy frequency tracked here
9. **Playwright** — E2E test automation (explicitly mentioned in job posting); runs as part of CI/CD pipeline
10. **Oracle Database / SQL Developer** — Database tooling (mentioned in job); relevant for backend data layer work

---

## Geographic / Cultural Considerations

No specific geographic constraints identified. The job posting describes an ongoing web application — likely a U.S.-based or global company with a distributed team. Use standard US date formats (MM/DD/YYYY or relative dates like "2 days ago"), USD for any financial figures, English-only UI. Sprint cadence is typically aligned to business calendar (2-week sprints start Monday).

---

## Data Architect Notes

- **Primary entity**: `Issue` with fields: `id` (format: `ENG-XXX`), `title`, `type` (Story/Bug/Task/Epic), `status` (To Do/In Progress/In Review/In QA/Done/Blocked), `priority` (P0/P1/P2/P3), `storyPoints` (1/2/3/5/8/13), `assigneeId`, `sprintId`, `epicId`, `createdAt`, `updatedAt`, `completedAt`
- **Sprint entity**: `id`, `name` ("Sprint 21"), `status` (Planning/Active/Complete), `startDate`, `endDate`, `committedPoints`, `completedPoints`, `goal`
- **Team member entity**: `id`, `name`, `role` (Engineer/Tech Lead/EM/PM/QA/DevOps), `avatar`, `issuesOpen`, `issuesCompleted`, `avgCycleTime`
- **Deployment entity**: `id`, `buildNumber`, `environment` (staging/production), `status` (Building/Live/Failed/Rolled Back), `triggeredBy`, `commitHash` (7-char monospace), `deployedAt`, `duration`
- **DORA metrics dataset**: Monthly series for 12 months: `deploymentFrequency` (per week), `leadTimeHours`, `changeFailureRate` (%), `mttrMinutes`
- **Status labels to use exactly**: "To Do", "In Progress", "In Review", "In QA", "Done", "Blocked" — not "active/inactive"
- **Priority labels**: "P0", "P1", "P2", "P3" — not "Critical/High/Medium/Low" (those are for incidents, not issues)
- **Edge cases**: Include 2 "Blocked" issues, 1 "Failed" deployment, 1 overdue sprint carry-over issue, 1 sprint with <60% completion rate, 1 PR with aging > 72hrs
- **Date pattern**: Sprint 21 just completed, Sprint 22 is "Active" starting today. Chart data: 12 months monthly. All individual issue dates within last 45 days.
- **Story points distribution**: NOT uniform — weight toward 2-point (35%) and 3-point (30%) issues, a few 8-point (10%) and 13-point (5%), rest are 1-point and 5-point

### Sprint Velocity chart data (12 months of realistic data with variance):
Sprints per month (biweekly = ~2/month). Velocities should fluctuate with a general upward trend: 38, 41, 35 (holiday dip), 43, 47, 44, 52, 49, 51, 55, 48, 57 — NOT 40, 40, 40, 40.

---

## Layout Builder Notes

- **Density**: Compact. Use `--content-padding: 1rem` and `--card-padding: 1rem`. This domain's practitioners live in linear.app and GitHub all day — they are comfortable with compact density and expect it.
- **Sidebar width**: 14rem (slimmer than default). Dev tools have slim sidebars with icon + short label. Linear uses a 220px sidebar. 14rem (224px) is appropriate.
- **Sidebar background**: Use a distinct dark sidebar even in light mode: `oklch(0.12 0.025 270)` — near-black with a faint indigo tint. This matches Linear's iconic sidebar treatment and reads as "developer tool" immediately.
- **Status badges**: Use minimal pill/chip shapes, not full-width badges. Small dot + label pattern for issue status (Linear's approach). Colors: neutral gray for standard, amber for "Blocked/At Risk", green for "Done/Live", red for "Failed".
- **Typography**: Geist Sans for body (already the template default — excellent choice, Geist was designed for dev tools). Geist Mono for all identifiers (issue IDs, commit hashes, build numbers, story point counts).
- **Primary color**: Indigo/violet — `oklch(0.55 0.22 270)`. This is the Linear accent color family and reads as "modern dev tooling" vs. a generic blue.
- **Motion**: Snappy (100-150ms ease-out). Developers are context-switching constantly — slow animations are friction. No bouncy effects.
- **Border treatment**: `border-border/50` — subtle, not heavy. Linear uses almost-invisible 1px dividers between list rows. Do not use cards with prominent borders for issue lists — use row-level hover states instead.

---

## Dashboard Builder Notes

- **Single most important metric** (largest stat card): **Sprint Velocity** for the current sprint with delta vs. previous sprint. This is the first thing an EM or Scrum Master looks at. Show current sprint name ("Sprint 22 — Active"), points completed so far vs. committed.
- **Secondary stat cards**: Cycle Time (avg days), Deployment Frequency (this week), Change Failure Rate (%)
- **Chart type**: Area chart for velocity trend (12 months of sprint velocity — shows growth trajectory). Line chart for Cycle Time trend. Do NOT use pie charts — engineering practitioners find them less useful than time-series views.
- **Sprint Burndown panel**: A secondary chart showing remaining story points per sprint day (today's sprint). Bar chart by day, declining from left to right, with an "ideal" reference line. This is the most recognizable sprint visualization in Scrum.
- **One domain-specific panel that would impress a practitioner**: **Active Issues by Status** — a horizontal stacked bar or a compact Kanban summary showing how many issues are in each status (Backlog / To Do / In Progress / In Review / In QA / Done) for the current sprint. Engineers check this multiple times per day. It gives an instant snapshot of where work is flowing or stuck.
- **PR Aging panel**: A small table of "PRs open > 48 hours without review" with assignee, days open, and link icon. This is a recurring pain point that senior developers will immediately recognize as practical, not cosmetic.
- **Chart Y-axis calibration**: Velocity: Y-axis 0–80 story points. Cycle Time: 0–10 days. Deployment Frequency: 0–7 per week. These ranges show a healthy but realistic mid-size team, not a heroic 10x outlier.
