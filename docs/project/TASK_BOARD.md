# TASK_BOARD
## Current focus
Ekstra kapaciteter A (styrkeblinde pletter), B (energikort), C (troværdighedsvurdering).
## Næste workstream
1. Ekstra kapaciteter A, B, C fra PROFILE_ENGINE_REQUIREMENTS.md V2
## Recently completed
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
