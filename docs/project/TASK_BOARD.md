# TASK_BOARD
## Current focus
- evidenceStrengthVsGoal engine gap (P1 remaining — Lag 2 prompt-regel tilføjet, rule-based path stadig ukorrekt)
- P1: anti-keyword-validering pr. scenarie
- P1: autenticitetsprofil test-dækning med rigtige signaler (Lag 2 dynamic injection ✅ — rule-based path stadig low confidence)
- sales-customer-facing recruitmentLogic WARN (persistent LLM-variance — kræver dybere motor-undersøgelse)

## Arkitektur-migration Fase 0
Forudsætninger der skal landes inden pipeline migration kan starte (M2):
- [x] Benchmark-suite: 14 scenarier (min. 5-10 opfyldt) — BENCHMARK_SUITE_DESIGN.md dokumenteret
- [ ] Vendor-abstraktion: interface-lag der skjuler model-udbyder fra forretningslogik — VENDOR_ABSTRACTION_DESIGN.md dokumenteret, ingen implementation endnu
- [ ] Persistence-model: database-design for profil og korrektionshistorik
- [ ] Korrektionskontrakt: API-design for bruger-korrektion af AI-fortolkninger
- [ ] Modelmix-konfiguration: Opus-tier til Lag 2-3-4, hurtig tier til Lag 1

## UX/Design — Fase 1 (blokerer M1-gate)
- Progressbar under interview tilbage og meningsfuld ✅ (session 5)
- Layout omstruktureret til system-look frem for hjemmeside
- Næste-skridt logik tydelig på alle sider
- Konsistent komponent-sprog

## P1 — Blokerer M1-gate (skal laves først)
1. ~~Indholdsvalidering af completionAnalysis-felter pr. scenarie~~ ✅
2. Anti-keyword-validering pr. scenarie
3. Autenticitetsprofil implementeret i motor og tests — `authenticitySignals` ✅, `authenticityProfile` i CompletionAnalysis ✅. Test-dækning med reel signal-detektion mangler endnu.
4. evidenceStrengthVsGoal engine gap

## P2 — Kritisk før M1-gate
4. ~~Fire nye segment-scenarier: executive, ledig, trade-transition, SOSU same-track~~ ✅
5. ~~Rekrutteringslogik-scenarier til dimension 5~~ ✅ (field signals tilføjet 4 scenarier)
6. ~~Adfærdsmønster-validering dimension 2~~ ✅ (ambitionProfile + naturalTeamRole field signals tilføjet)
7. ~~recruitmentLogic engine gap: warehouse-worker~~ ✅ (cv_and_experience scoring fix, session 3)
8. ~~interviewReadiness:vulnerabilities tom for job-seeker-gap~~ ✅ (3 nye sårbarhedssignaler, session 4)
9. ~~executive-transition shallow_completion~~ ✅ (less_responsibility keyword + 2. interpretation, session 4)

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
## Recently completed (session 12, 2026-05-15)
- Lag 2 system prompt: 8 prompt-forbedringer (authenticityProfile dynamic injection, workIntensityPreference mapping, naturalTeamRole/behaviorUnderPressure inference, flexibilityNeeds defaults, recruitmentLogic customer-facing, evidenceStrengthVsGoal, fraseforbudsregel)
- 4 Runde 2-scenarier tilføjet: self-contradicting-manager, overconfident-junior, burnout-recovery, imposter-syndrome-specialist
- `credibilitySignals` tilføjet til `expectedFieldSignals` type i scenarios.ts
- Test: 18 PASS / 5 WARN / 0 FAIL (23 scenarier, Lag 2 aktiv)

## Recently completed (session 5, 2026-05-14)
- Lag 2 AI-sti implementeret bag `ENABLE_AI_COMPLETION_ANALYSIS` feature flag (claude-opus-4-5, tool_use, fallback)
- `AuthenticityProfile` type tilføjet + `authenticityProfile` felt i `CompletionAnalysis`
- `buildCompletionAnalysis()` syntetiserer `authenticityProfile` fra `authenticitySignals`
- `authenticityProfile` field signals tilføjet til 3 scenarier (career-changer, pm-to-pm, people-manager)
- `runAuthenticityDiversityCheck()` tilføjet til run-interview-scenarios.ts
- Progressbar genoprettet i interview-panel med coverage-baseret pct og stage-labels
- VENDOR_ABSTRACTION_DESIGN.md oprettet
- BENCHMARK_SUITE_DESIGN.md oprettet
## Recently completed (session 4, 2026-05-13)
- `authenticitySignals` tilføjet til `InterviewProfileModel` (passionIndicators, valueAnchors, authenticVoiceMarkers)
- LAG3_PROFILE_SCHEMA.md oprettet — komplet teknisk schema for Lag 3-output
- LAG4_PROFILE_TEMPLATE.md oprettet — promptarkitektur og sektionsskabeloner for Lag 4
- interviewReadiness: 3 nye sårbarhedssignaler (CV-gap, selvtillid, rustent interviewformat)
- executive-transition: less_responsibility keyword-dækning udvidet ("ned i tempo", "traede tilbage" m.fl.)
- executive-transition: 2. deterministisk interpretation for less_responsibility profiler
- cv_and_experience scoring fix for same_track_better_conditions (session 3)
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
- authenticityProfile confidence universelt low i scenarietests — scripted svar indeholder ikke passion/value nøgleord
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
