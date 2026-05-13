# CURRENT_STATE
## Produkt
JobPilot er et AI-baseret job search operating system, ikke kun en CV-generator.
## Aktuel baseline
- Safe baseline: main
- Seneste commit: ed8c5a5 — workIntensityPreference inference styrket
## Bygget status (known)
- Ruter: /setup og /profile (tidlig shell)
- Setup-flow: Start → Basisoplysninger → Dokumenter → AI-interview → Profiloverblik → Klar
- profile-view-model.ts oprettet og aktiv
- buildProfileViewModel bruges i setup-flow og profile/page.tsx
- completionAnalysis implementeret i route.ts: communicationStyle, recruitmentFit, strengthGaps, energyMap, credibilitySignals, recruitmentLogic, behaviorProfile, lifestyleProfile, evidenceProfile, communicationProfile, hiddenStrengths, energyConditions, interviewReadiness
## Senest kendte teststatus
- npm.cmd run build: pass
- npm.cmd run test:interview-scenarios: 6 PASS / 8 WARN / 0 FAIL (14 scenarier)
- WARN breakdown:
  * generic_string_value:behaviorProfile:unclear 5/14 — stochastisk variance
  * field_signal_pattern_not_found:recruitmentLogic 1/14 — engine gap (warehouse-worker)
  * field_signal_forbidden_value:evidenceProfile.evidenceStrengthVsGoal:sufficient 1/14 — known P1 engine gap
  * field_signal_empty_subfield:interviewReadiness:vulnerabilities 1/14 — engine gap (job-seeker-gap)
  * generic_string_value:lifestyleProfile:unclear 1/14 — stochastisk
  * shallow_completion + early_completion_needs_review 1/14 — executive-transition stochastisk
## Rettede gaps siden sidst
- behaviorUnderPressure:unclear 6->2
- communicationProfile:none_identified 6->0
- interviewReadiness:vulnerabilities tom 5->0
- workIntensityPreference:unclear 2->0
## Arkitekturbeslutning (2026-05-12)
- Fire-lags AI pipeline arkitektur godkendt — erstatter regelbaseret completionAnalysis
- M2 dedikeres til pipeline migration + korrektion + persistence; jobanbefalingsmodel flyttes til M3
- Persistence og korrektion er nu V1-scope (bryder no-persistence-reglen bevidst)
- Autenticitetsprofil er Lag 3-output og forudsætning for M3

## Næste workstream
- Fase 0: benchmark-suite nu 14 scenarier — forudsætning for pipeline migration er opfyldt (min. 5-10)
- P1 remaining: evidenceStrengthVsGoal engine gap
- P2 ny: recruitmentLogic engine gap (warehouse-worker returnerer ikke cv_and_experience)
- P2 ny: interviewReadiness:vulnerabilities tom for job-seeker-gap
- P2: rekrutteringslogik-scenarier til dimension 5 (delvist dækket via field signals)
## M1-gate
- M1-gate kriterier defineret og aktive (se TASK_BOARD.md)
## Kendte begrænsninger
- /profile er stadig tidlig og uden persistence
- Ingen auth/database/payment/persistence endnu
- Document/evidence intake ikke implementeret
## Projektdokumentation committed på main
- PROFILE_ENGINE_REQUIREMENTS.md (V2)
- DEEP_PROFILE_REQUIREMENTS.md
- JOB_EVALUATION_REQUIREMENTS.md
- APPLICATION_PROFILE_REQUIREMENTS.md
- UX_DESIGN_REQUIREMENTS.md
- V1 projektplan defineret med 7 milepæle over 8 uger
