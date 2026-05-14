# CURRENT_STATE
## Produkt
JobPilot er et AI-baseret job search operating system, ikke kun en CV-generator.

## Vision og målsætning
- Ekspertpanel-vision dokumenteret: JobPilot er et AI-drevet ekspertpanel af specialister der arbejder parallelt om at maksimere brugerens jobchance
- 50% samtalechance som overordnet kvalitetsmål — alt output måles mod dette
- Lag 0 dokument-analyse som næste arkitekturkrav: interviewet skal starte fra analyseret dokumentation, ikke fra nul
## Aktuel baseline
- Safe baseline: main
- Seneste commit: f210648 — Merge PR #15 (product requirements and idea backlog)
## Bygget status (known)
- Ruter: /setup og /profile (tidlig shell)
- Setup-flow: Start → Basisoplysninger → Dokumenter → AI-interview → Profiloverblik → Klar
- profile-view-model.ts oprettet og aktiv
- buildProfileViewModel bruges i setup-flow og profile/page.tsx
- completionAnalysis implementeret i route.ts: communicationStyle, recruitmentFit, strengthGaps, energyMap, credibilitySignals, recruitmentLogic, behaviorProfile, lifestyleProfile, evidenceProfile, communicationProfile, hiddenStrengths, energyConditions, interviewReadiness, authenticityProfile
- Lag 2 AI-sti implementeret bag ENABLE_AI_COMPLETION_ANALYSIS feature flag (claude-opus-4-5, tool_use structured output, fallback til regelbaseret)
- Progressbar i interview-panel genoprettet med stage-baserede labels og coverage-baseret pct
## Senest kendte teststatus (session 5, 2026-05-14)
- npm.cmd run build: pass (typecheck clean)
- npm.cmd run test:interview-scenarios: 11 PASS / 3 WARN / 0 FAIL (14 scenarier)
- WARN breakdown:
  * generic_string_value:behaviorProfile:unclear 2/14 — stochastisk LLM-variance (unclear-direction-user, career-changer)
  * generic_string_value:lifestyleProfile:unclear 1/14 — stochastisk LLM-variance (specialist-expert)
  * early_completion_needs_review 1/14 — stochastisk timing (career-changer)
- npm.cmd run test:setup-ux-review: 0 WARN, 0 FAIL (interview completed=true, turns=7, screenshots=11, tabs=5)
## Rettede gaps siden sidst (session 4-5)
- interviewReadiness:vulnerabilities for re-entry profiler → løst (3 nye sårbarhedssignaler)
- executive-transition shallow_completion → løst (less_responsibility keyword + 2. interpretation)
- authenticityProfile tilføjet til CompletionAnalysis (syntetiseret fra authenticitySignals)
- Lag 2 AI-sti bag feature flag — ingen adfærdsændring i produktion (flag = false default)
- authenticityProfile field signals tilføjet til 3 scenarier (career-changer, project-manager-to-product-manager, people-manager)
## Arkitekturbeslutning (2026-05-12)
- Fire-lags AI pipeline arkitektur godkendt — erstatter regelbaseret completionAnalysis
- M2 dedikeres til pipeline migration + korrektion + persistence; jobanbefalingsmodel flyttes til M3
- Persistence og korrektion er nu V1-scope (bryder no-persistence-reglen bevidst)
- Autenticitetsprofil er Lag 3-output og forudsætning for M3

## Næste workstream
- P1 remaining: evidenceStrengthVsGoal engine gap (project-manager-to-product-manager)
- P1: anti-keyword-validering pr. scenarie
- P1: autenticitetsprofil testet (authenticitySignals tilføjet — mangler test-dækning der kan passere med rigtige signaler)
- UX Fase 1: system-look layout + konsistent komponent-sprog (blokerer M1-gate)
## M1-gate
- M1-gate kriterier defineret og aktive (se TASK_BOARD.md)
## Kendte begrænsninger
- /profile er stadig tidlig og uden persistence
- Ingen auth/database/payment/persistence endnu
- Document/evidence intake ikke implementeret
- authenticityProfile returnerer universelt low confidence — scripted testdata har ikke passion/value keywords
## Projektdokumentation committed på main
- PROFILE_ENGINE_REQUIREMENTS.md (V2)
- DEEP_PROFILE_REQUIREMENTS.md
- JOB_EVALUATION_REQUIREMENTS.md
- APPLICATION_PROFILE_REQUIREMENTS.md
- UX_DESIGN_REQUIREMENTS.md
- LAG3_PROFILE_SCHEMA.md
- LAG4_PROFILE_TEMPLATE.md
- VENDOR_ABSTRACTION_DESIGN.md (ny, session 5)
- BENCHMARK_SUITE_DESIGN.md (ny, session 5)
- JOBPILOT_PROFILE_ARCHITECTURE.md (ny, session 6)
- V1 projektplan defineret med 7 milepæle over 8 uger
