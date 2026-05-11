# TASK_BOARD
## Current focus
Commit og push af ekstra kapaciteter A/B/C.
## P1 — Blokerer M1-gate (skal laves først)
1. Indholdsvalidering af completionAnalysis-felter pr. scenarie
2. Anti-keyword-validering pr. scenarie
3. Autenticitetsprofil implementeret i motor og tests

## P2 — Kritisk før M1-gate
4. Fire nye segment-scenarier: executive, ledig, trade-transition, SOSU same-track
5. Rekrutteringslogik-scenarier til dimension 5
6. Adfærdsmønster-validering dimension 2

## P3 — Venter til M2
7. Adaptiv kommunikation differentialtest
8. Modsigelsestest for credibilitySignals
9. Vi/jeg-sprogtest
10. Low-clarity coverage udvidelse
11. Diversity/bias-aggregattest (før M3)

## M1-gate kriterier (alle skal være opfyldt)
- P1 og P2 opgaver completed
- test:interview-scenarios: 10 PASS 0 WARN 0 FAIL på tre kørsler
- test:interview-manual-regression: bestået
- test:interview-low-clarity: bestået
- test:setup-ux-review: 0 WARN 0 FAIL
- Indholdsvalidering af completionAnalysis aktiv
- Autenticitetsprofil testet
- Projektstyring godkender eksplicit
## Recently completed
- Ekstra kapacitet A (hiddenStrengths), B (energyConditions), C (interviewReadiness) tilføjet til completionAnalysis
- Kontomigration gennemført og verificeret
- Transition completion gate implementeret og testet
- stash@{0} applied rent — profile view model arkitektur på plads
- buildProfileViewModel aktiv i setup-flow og profile/page.tsx
- PROFILE_ENGINE_REQUIREMENTS.md opdateret til V2 med fem dimensioner
- DEEP_PROFILE_REQUIREMENTS.md committed
- JOB_EVALUATION_REQUIREMENTS.md committed
- V1 projektplan defineret (7 milepæle, 8 uger)
- Cowork sat op med adgang til docs/project/
- Analyse-lag implementeret i route.ts (communicationStyle, recruitmentFit, strengthGaps, energyMap, credibilitySignals)
- Dimension 5: recruitmentLogic klassificering tilføjet til completionAnalysis
- Dimension 2: behaviorProfile tilføjet (behaviorUnderPressure, naturalTeamRole, decisionStyle, ambitionProfile, selfImageGap)
- Dimension 4: lifestyleProfile tilføjet (workIntensityPreference, flexibilityNeeds, lifestyleFit, sustainabilityRisk)
- Dimension 1: evidenceProfile tilføjet (evidenceClassification, evidenceStrengthVsGoal, transferableStrengths)
- Dimension 3: communicationProfile tilføjet (selfPromotionComfort, recruitmentFormatVulnerabilities, credibilityInConversation, languageNormalization)
## Known limitations
- specialist-expert og project-manager-to-product-manager earlyCompletionWarning — stokastisk LLM-varians, ikke regressionsfejl
## Parked / later
- Persistence/database
- Payment/abonnement
- CV generation (fuld pipeline)
- Application generation
- Jobtracker
- Marketplace/business model
- Document/evidence intake
- Interview training
## Aktive risici
- Motorudvidelse er kompleks — kræver præcis scope før Codex-prompts
- Kontekttab mellem sessions — brug Cowork til filsynkronisering fremover
