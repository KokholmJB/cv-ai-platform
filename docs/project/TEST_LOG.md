# TEST_LOG

## Latest confirmed state (session 4, 2026-05-13)
- `npm.cmd run build`: pass (typecheck clean, Google Fonts network-fejl ignoreres — ikke kode)
- `npm.cmd run test:interview-scenarios`: 12 PASS / 2 WARN / 0 FAIL (14 scenarier)
  - WARN breakdown:
    - generic_string_value:behaviorProfile:unclear 2/14 — stochastisk LLM-variance (unclear-direction-user, career-changer)
  - Alle engine gaps lukket denne session
- `npm.cmd run test:setup-ux-review`: pass (main baseline — ikke re-kørt efter motor-ændringer)
  - `interview completed=true`
  - `screenshots=11`
  - `tabs audited=5`
  - `tabs not reached=0`
  - `findings=0 WARN, 0 FAIL`

## Ændringer session 4 (2026-05-13)
| Ændring | Resultat |
|---------|----------|
| interviewReadiness: CV-gap + selvtillid + rustent format sårbarhedssignaler | job-seeker-gap → PASS |
| less_responsibility keyword udvidet ("ned i tempo" m.fl.) | executive-transition klassificeret korrekt |
| 2. deterministisk interpretation for less_responsibility | executive-transition → PASS (interpretations=3) |
| authenticitySignals tilføjet til InterviewProfileModel | ny felt, typecheck clean |
| LAG3_PROFILE_SCHEMA.md + LAG4_PROFILE_TEMPLATE.md oprettet | designdokumenter til M2 |

## Scenarier tilføjet (session 3)
| Scenario | Type | Status (session 3→4) |
|----------|------|--------|
| trade-transition | direction_change | PASS → PASS |
| sosu-same-track | same_track_better_conditions | PASS → PASS |
| executive-transition | less_responsibility | WARN → PASS |
| job-seeker-gap | same_track | WARN → PASS |

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
