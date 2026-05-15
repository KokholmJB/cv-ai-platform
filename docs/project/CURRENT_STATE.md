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
## Senest kendte teststatus (session 12, 2026-05-15)
- npm.cmd run build: pass (typecheck clean)
- npm.cmd run test:interview-scenarios (Lag 2 aktiv): 18 PASS / 5 WARN / 0 FAIL (23 scenarier)
- WARN breakdown (Lag 2 aktiv):
  * field_signal_pattern_not_found:recruitmentLogic — sales-customer-facing (persistent LLM-variance)
  * generic_string_value:behaviorProfile:unclear — unclear-direction-user (API timeout → rule-based fallback)
  * early_completion_needs_review — distinct-voice-creative (stochastisk, 2 turns)
  * field_signal_empty_subfield:authenticityProfile:naturalVoiceMarkers + generic_string_value:behaviorProfile:unclear — freedom-seeking-former-corporate (API timeout → rule-based fallback)
  * early_completion_needs_review — imposter-syndrome-specialist (2 turns, forventet — suspiciousEarlyTurns=2)
- Diversity output: authenticityProfile universelt {"dominantPassions":[],"coreValueAnchors":[],"naturalVoiceMarkers":[],"authenticityConfidence":"low"} (14/23) — scripted testdata mangler passion/value nøgleord
- npm.cmd run test:interview-scenarios (Lag 2 inaktiv): 14 PASS / 9 WARN / 0 FAIL (23 scenarier) ✓ Baseline OK
## Rettede gaps siden sidst (session 4-12)
- interviewReadiness:vulnerabilities for re-entry profiler → løst (3 nye sårbarhedssignaler)
- executive-transition shallow_completion → løst (less_responsibility keyword + 2. interpretation)
- authenticityProfile tilføjet til CompletionAnalysis (syntetiseret fra authenticitySignals)
- Lag 2 AI-sti bag feature flag — ingen adfærdsændring i produktion (flag = false default)
- authenticityProfile field signals tilføjet til 3 scenarier (career-changer, project-manager-to-product-manager, people-manager)
- 6 nye optional felter tilføjet til 4 typer i route.ts
- Inference logic implementeret for alle 6 nye felter i buildCompletionAnalysis()
- field_signal_forbidden_value:lifestyleProfile.workloadHistory:high regression rettet
- **Session 12 — Lag 2 prompt-forbedringer (Phase 1):**
  * authenticityProfile: dynamisk injektion af faktiske passionIndicators/valueAnchors/authenticVoiceMarkers fra profileDraft ind i Lag 2 system prompt — AI kopierer verbatim i stedet for at inferere
  * workIntensityPreference: udtømmende targetKind→value mapping, 'unclear' forbudt når targetKind er known
  * naturalTeamRole og behaviorUnderPressure: rolle-keyword-baseret inference, 'unclear' forbudt medmindre ingen signaler
  * flexibilityNeeds og lifestyleFit: defaults tilføjet (hybrid/moderate/good_fit) for alle targetKind-værdier
  * recruitmentLogic: customer-facing/support/service-roller mappet til personality_and_culture
  * communicationProfile: recruitmentFormatVulnerabilities-regel skærpet (["none_identified"] forbudt)
  * evidenceStrengthVsGoal: ny regel — basér på demonstreret kompetence, ikke self-minimizing sprog
  * Fraseforbudsregel: 'kan ikke', 'ikke realistisk', 'umuligt', 'bør ikke', 'boer ikke' forbudt i Lag 2 output
- **Session 12 — 4 Runde 2-scenarier tilføjet (Phase 3):**
  * A3: self-contradicting-manager (unclear direction, conflicted manager, 8 direct reports)
  * A4: overconfident-junior (direction_change, marketing assistent med gap mellem selvhævdelse og evidens)
  * D1: burnout-recovery (less_responsibility, projektleder ramt af burnout, søger nedskalering)
  * D2: imposter-syndrome-specialist (same_track, senior software arkitekt, 25 år + 7 patenter, self-minimizing)
## Arkitekturbeslutning (2026-05-12)
- Fire-lags AI pipeline arkitektur godkendt — erstatter regelbaseret completionAnalysis
- M2 dedikeres til pipeline migration + korrektion + persistence; jobanbefalingsmodel flyttes til M3
- Persistence og korrektion er nu V1-scope (bryder no-persistence-reglen bevidst)
- Autenticitetsprofil er Lag 3-output og forudsætning for M3

## Næste workstream
- P1 remaining: evidenceStrengthVsGoal engine gap (rule-based path — Lag 2 har fået regel, men rule-based infererer stadig fejlagtigt)
- P1: anti-keyword-validering pr. scenarie
- P1: autenticitetsprofil test-dækning (Lag 2 dynamic injection implementeret — rule-based path returnerer stadig low confidence for scripted data)
- Persistente WARNs: sales-customer-facing recruitmentLogic (LLM-variance, kræver dybere motor-ændring)
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
