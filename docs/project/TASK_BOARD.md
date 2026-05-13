# TASK_BOARD
## Current focus
- evidenceStrengthVsGoal engine gap (P1 remaining)
- P2: fire manglende segment-scenarier (executive, ledig, trade-transition, SOSU same-track)
- P2: rekrutteringslogik-scenarier til dimension 5
- P2: adfærdsmønster-validering dimension 2

## Arkitektur-migration Fase 0
Forudsætninger der skal landes inden pipeline migration kan starte (M2):
- [ ] Benchmark-suite: 5-10 scenarier der måler Lag 2-output kvalitativt og kvantitativt
- [ ] Vendor-abstraktion: interface-lag der skjuler model-udbyder fra forretningslogik
- [ ] Persistence-model: database-design for profil og korrektionshistorik
- [ ] Korrektionskontrakt: API-design for bruger-korrektion af AI-fortolkninger
- [ ] Modelmix-konfiguration: Opus-tier til Lag 2-3-4, hurtig tier til Lag 1

## UX/Design — Fase 1 (blokerer M1-gate)
- Progressbar under interview tilbage og meningsfuld
- Layout omstruktureret til system-look frem for hjemmeside
- Næste-skridt logik tydelig på alle sider
- Konsistent komponent-sprog

## P1 — Blokerer M1-gate (skal laves først)
1. ~~Indholdsvalidering af completionAnalysis-felter pr. scenarie~~ ✅
2. Anti-keyword-validering pr. scenarie
3. Autenticitetsprofil implementeret i motor og tests
4. evidenceStrengthVsGoal engine gap

## P2 — Kritisk før M1-gate
4. ~~Fire nye segment-scenarier: executive, ledig, trade-transition, SOSU same-track~~ ✅
5. ~~Rekrutteringslogik-scenarier til dimension 5~~ ✅ (field signals tilføjet 4 scenarier)
6. ~~Adfærdsmønster-validering dimension 2~~ ✅ (ambitionProfile + naturalTeamRole field signals tilføjet)
7. recruitmentLogic engine gap: warehouse-worker returnerer ikke cv_and_experience (ny P2)
8. interviewReadiness:vulnerabilities tom for job-seeker-gap (ny P2)

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
- Fire nye segment-scenarier tilføjet: trade-transition, sosu-same-track, executive-transition, job-seeker-gap
- recruitmentLogic field signals tilføjet til 4 scenarier (people-manager, specialist-expert, sales-customer-facing, same-role-warehouse-worker)
- behaviorProfile ambitionProfile + naturalTeamRole field signals tilføjet til 4 scenarier (senior-less-responsibility, people-manager, specialist-expert, career-changer)
- workIntensityPreference inference styrket (unclear 2->0)
- interviewReadiness vulnerabilities inference styrket (tom 5->0)
- recruitmentFormatVulnerabilities inference styrket (none_identified 6->0)
- behaviorUnderPressure inference styrket (unclear 6->2)
- naturalTeamRole inference styrket (unclear 5->0)
- Indholdsvalidering af completionAnalysis-felter implementeret (fieldSignals, genericString, diversityCheck)
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
