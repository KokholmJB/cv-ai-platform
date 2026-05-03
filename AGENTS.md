# JobPilot agent instructions

## Product identity

JobPilot is an AI job-search operating system, not only a CV generator.

The core product value is:

- understanding the user seriously
- evaluating job fit and realistic direction
- later generating targeted CVs/applications
- tracking job-search workflow and outcomes

## Current active workstream

When working on branch `feature/interview-hypothesis-engine-v1`, the active scope is:

- interview engine
- profiling engine
- `profileModel` logic
- completion gates
- scenario-test harness
- backend interview contract

Do not start work on:

- CV generator
- job analysis engine
- database/persistence
- UI redesign
- document upload
- marketplace/business model features
- unrelated styling/routing

## Working style

Make one contained change at a time.
Inspect relevant files before editing.
Prefer small deterministic fixes over broad rewrites.
Do not refactor unrelated files.
Do not weaken tests to make them pass.
Do not silently change API/UI contracts.
If a change could affect product behavior, explain it clearly in the final report.

When editing Next.js application code, read the relevant guide in `node_modules/next/dist/docs/` before writing code. This Next.js version may differ from older conventions and APIs.

## Interview engine principles

The interview engine is a core subsystem, not a simple onboarding questionnaire.

It must be:

- intention-first
- evidence-aware
- Denmark-first / Danish-first for v1
- controlled by backend contracts, not open-ended chat behavior

Rules:

- Do not assume the user wants promotion.
- Do not assume the user wants leadership.
- Do not assume the user wants product roles.
- Do not assume the user wants a direction change.
- Same-role users may want the same kind of job again.
- Senior users may want less responsibility.
- Self-claim is input, not proof.
- Separate facts, interpretations, uncertainties, and hypotheses.
- Complete with explicit uncertainties rather than looping.

## Scenario-test rules

The scenario harness is used to detect:

- loops
- exact question repeats
- repeated focus areas
- repeated semantic families
- progress stalls/decreases
- intention violations
- shallow or over-eager completion

Do not reduce or weaken the scenario tests unless there is a clear measurement bug.
If tests fail, prefer fixing engine behavior or improving test visibility over hiding the failure.

## Commands

For interview engine changes, run:

```powershell
npm.cmd run test:interview-scenarios
```

For normal code changes, also run:

```powershell
npm.cmd run build
```

Use Windows-compatible commands because the repo is developed on Windows.

## Reporting requirements

After each task, report:

- files changed
- what behavior changed
- tests run
- test summary
- remaining WARN/FAIL patterns
- build result if run
- anything intentionally left unresolved

## Safety rails

Do not generate images.
Do not introduce new dependencies unless explicitly justified.
Do not make broad architecture changes unless explicitly requested.
Do not move the project into a new product direction.
