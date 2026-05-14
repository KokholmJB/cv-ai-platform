# BENCHMARK SUITE DESIGN

Defines the specification for the Lag 2 benchmark suite. The benchmark measures profile analysis quality before and after pipeline changes — including model upgrades, provider switches, and prompt revisions.

**Status**: Design document. Benchmark suite is the existing 14-scenario test harness (`test:interview-scenarios`). This document defines the selection, metrics, and decision criteria for M2 gate usage.

**Prerequisite**: Fase 0 requires 5-10 benchmark scenarios. The current harness has 14 — this prerequisite is met.

---

## Purpose

The benchmark answers two questions:

1. **Regression guard**: Does a change break something that was working?
2. **Quality delta**: Is the new approach (AI Lag 2, new model, new provider) better or worse than the baseline?

---

## Selected benchmark scenarios (10 of 14)

These 10 cover the full range of `TargetProfileKind` values and known engine edge cases:

| ID | Scenario | Direction type | Why included |
|----|----------|---------------|-------------|
| `same-role-warehouse-worker` | Same-role warehouse | same_track_better_conditions | Low-complexity baseline; tests cv_and_experience scoring |
| `skilled-trades-technician` | Skilled trades | same_track | Tests domain-specific inference without direction change |
| `administrative-employee` | Administrative | same_track | Short-tenure, thin evidence; tests minimum profile floor |
| `project-manager-to-product-manager` | PM → Product | direction_change | Complex transition; tests product domain gap detection |
| `people-manager` | People manager | next_level | Tests upward ambition without direction change |
| `senior-less-responsibility` | Senior less responsibility | less_responsibility | Tests intention-first; must not infer upward ambition |
| `career-changer` | Career changer | direction_change | Nurse to health tech; transferable strength identification |
| `executive-transition` | Executive step-back | less_responsibility | High-experience profile seeking advisory/board role |
| `job-seeker-gap` | Job seeker with gap | same_track | Re-entry profile; CV gap vulnerability detection |
| `unclear-direction-user` | Unclear direction | unclear | Ambiguity tolerance; no direction push |

The remaining 4 scenarios (trade-transition, sosu-same-track, specialist-expert, sales-customer-facing) are part of the full regression suite but excluded from the benchmark core to keep it focused.

---

## Measurement metrics

Each scenario is scored on five dimensions:

### 1. Completion quality (0-3)
- 3: facts ≥ 3, interpretations ≥ 2, uncertainties ≥ 1, no `thinProfile`, no `earlyCompletionWarning`
- 2: one dimension below threshold
- 1: two dimensions below threshold
- 0: `thinProfile = true` or fails to complete

### 2. Field signal pass rate (0-3)
- 3: all `expectedFieldSignals` checks pass (0 warnings)
- 2: 1 field signal warning
- 1: 2 field signal warnings
- 0: ≥ 3 field signal warnings or a `field_signal_missing`

### 3. Intention adherence (0-3)
- 3: 0 intention violations detected
- 2: 1 intention violation
- 1: 2 intention violations
- 0: ≥ 3 intention violations

### 4. Loop / repeat avoidance (0-2)
- 2: 0 detected loops, 0 repeated focus areas
- 1: 1 loop or repeat
- 0: ≥ 2 loops or repeats

### 5. Diversity (0-1)
- Evaluated at suite level, not per scenario
- 1: no field has identical value across ≥ 10 of 10 benchmark scenarios
- 0: any field is universally identical

**Maximum per-scenario score**: 11 (dimensions 1-4). Diversity score applies to the full suite.

---

## Scoring rubric

| Total suite score (10 scenarios × 11) | Rating |
|---------------------------------------|--------|
| ≥ 95 (86%) | Excellent — safe to promote |
| 85-94 (77-85%) | Acceptable — review warnings before promoting |
| 75-84 (68-76%) | Marginal — must resolve P1 issues before promoting |
| < 75 | Failing — do not promote to production |

The existing test runner already collects all inputs for dimensions 1-4. Scoring aggregation needs to be added in `run-interview-scenarios.ts` for the benchmark mode.

---

## Run script outline

The benchmark is a mode flag on the existing `test:interview-scenarios` runner:

```
BENCHMARK_MODE=true npm.cmd run test:interview-scenarios
```

In benchmark mode:
1. Only the 10 selected scenarios run (filter by ID list)
2. Each scenario is scored across all 5 dimensions
3. Suite-level scores are aggregated and printed
4. Exit code 1 if total score < 75 or any scenario scores 0 on dimension 3 (intention)

Output format:
```
[benchmark] same-role-warehouse-worker: 10/11
[benchmark] ...
[benchmark] Suite score: 98/110 (89%) — ACCEPTABLE
[benchmark] Diversity: PASS
```

---

## Decision criteria for model/provider changes

A model or provider change is approved for production if:

1. Benchmark suite score ≥ 85 (acceptable or excellent)
2. No scenario has an intention violation (dimension 3 = 0)
3. No regression vs. previous benchmark run on any scenario scoring 3 in the current baseline
4. `buildDeterministicCompleteResult` p99 latency ≤ 3 000 ms (measured in benchmark run)
5. At least 3 consecutive runs produce the same PASS/WARN/FAIL distribution (stochastic stability)

Criteria 4 and 5 require infrastructure not yet in place — they are M2 targets.

---

## Baseline (session 4, 2026-05-14)

Rule-based Lag 2 (current production path):

| Scenario | Score |
|----------|-------|
| same-role-warehouse-worker | 11/11 |
| skilled-trades-technician | 11/11 |
| administrative-employee | 11/11 |
| project-manager-to-product-manager | 11/11 |
| people-manager | 11/11 |
| senior-less-responsibility | 11/11 |
| career-changer | 9/11 (early_completion_needs_review, behaviorProfile:unclear) |
| executive-transition | 11/11 |
| job-seeker-gap | 11/11 |
| unclear-direction-user | 10/11 (behaviorProfile:unclear) |
| **Suite** | **107/110 (97%) — EXCELLENT** |

Known stochastic patterns (not regressions):
- `generic_string_value:behaviorProfile:unclear` for unclear-direction-user and career-changer — LLM variance in ambitionProfile inference
- `early_completion_needs_review` for career-changer — stochastic timing

---

## Versionering

- **v0.1** (2026-05-14): Initialudkast. Scenarieudvælgelse, metrikker, scoringsrubrik og baseline dokumenteret.
