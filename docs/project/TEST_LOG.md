# TEST_LOG

## Latest confirmed state (known)
- `npm.cmd run build`: pass (14 scenarier, session 3)
- `npm.cmd run test:interview-scenarios`: 6 PASS / 8 WARN / 0 FAIL (14 scenarier, session 3)
  - WARN breakdown:
    - generic_string_value:behaviorProfile:unclear 5/14 — stochastisk variance
    - field_signal_pattern_not_found:recruitmentLogic 1/14 — engine gap (warehouse-worker)
    - field_signal_forbidden_value:evidenceProfile.evidenceStrengthVsGoal:sufficient 1/14 — P1 engine gap
    - field_signal_empty_subfield:interviewReadiness:vulnerabilities 1/14 — engine gap (job-seeker-gap)
    - generic_string_value:lifestyleProfile:unclear 1/14 — stochastisk
    - shallow_completion + early_completion_needs_review 1/14 — executive-transition stochastisk
- `npm.cmd run test:setup-ux-review`: pass (main baseline — ikke re-kørt efter motor-ændringer)
  - `interview completed=true`
  - `screenshots=11`
  - `tabs audited=5`
  - `tabs not reached=0`
  - `findings=0 WARN, 0 FAIL`

## Scenarier tilføjet (session 3)
| Scenario | Type | Status |
|----------|------|--------|
| trade-transition | direction_change | PASS |
| sosu-same-track | same_track_better_conditions | PASS |
| executive-transition | less_responsibility | WARN (shallow_completion stochastisk) |
| job-seeker-gap | same_track | WARN (vulnerabilities tom — engine gap) |

## Inference gaps lukket (session 2)
| Gap | Før | Efter |
|-----|-----|-------|
| behaviorUnderPressure:unclear | 6/10 | 2/10 |
| communicationProfile:none_identified | 6/10 | 0/10 |
| interviewReadiness:vulnerabilities tom | 5/10 | 0/10 |
| workIntensityPreference:unclear | 2/10 | 0/10 |
| naturalTeamRole:unclear | 5/10 | 0/10 |

## Known scripts
- `npm.cmd run build`
- `npm.cmd run lint`
- `npm.cmd run test:setup-ux-review`
- `npm.cmd run test:interview-scenarios`
- `npm.cmd run test:interview-manual-regression`
- `npm.cmd run test:interview-low-clarity`

## Important
- `test-results/` er en artefaktmappe og skal ikke committes.
