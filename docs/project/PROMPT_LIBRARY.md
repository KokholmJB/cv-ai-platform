# PROMPT_LIBRARY

## 1) Standard Codex safety rules
Use this as baseline instruction snippet:
- Scope only requested area.
- Do not edit interview engine/API unless explicitly requested.
- No silent contract changes.
- Keep changes small and deterministic.
- Run required validation commands.
- Report exact files changed and test results.

## 2) Start coding task prompt
```text
Read AGENTS.md first. Scope strictly to [AREA]. Do not edit unrelated files.
Inspect current implementation before changes. Make one contained change.
Run: npm.cmd run build, npm.cmd run lint, git diff --check.
Report: files changed, behavior changed, test results, remaining risks.
Do not commit.
```

## 3) Analyze test output prompt
```text
Analyze failing test output only. Identify root cause vs symptom.
Do not weaken tests. Prefer minimal targeted fix.
List exact failing assertions/patterns, probable cause, and smallest safe patch plan.
```

## 4) Setup UX task prompt
```text
Frontend/content only. Do not change interview engine/API/tests.
Focus on /setup and user-facing profile language.
Forbidden terms in setup profile: Brugeren, no-go, snake_case, backlogansvar, underbygget, datagrundlag, matchvurdering.
Validate with npm.cmd run test:setup-ux-review.
```

## 5) Interview engine task prompt
```text
Engine/backend only. Do not change UI/harness unless measurement bug.
Preserve intention-first behavior and avoid direction forcing.
Run: test:interview-scenarios, test:interview-manual-regression, test:interview-low-clarity, build.
Report remaining WARN/FAIL patterns explicitly.
```

## 6) New ChatGPT project chat starter
```text
Project: JobPilot (AI job-search operating system).
Read order:
1) docs/project/HANDOFF.md
2) docs/project/CURRENT_STATE.md
3) docs/project/DECISIONS.md
4) docs/project/TASK_BOARD.md
Then inspect code and proceed with one scoped task.
```
