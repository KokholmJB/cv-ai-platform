# DECISIONS

## Produktretning
1. JobPilot er ikke kun en CV-generator.
2. Profil- og interviewfundament kommer før bred CV/ansøgningsautomatisering.

## Profilarkitektur
3. Personlig profil og teknisk AI-profil skal være adskilt.
4. Setup skal vise personlig profil (user-facing) og ikke rå teknisk profiltekst.
5. Teknisk AI-profil er sekundær/advanced transparens (fx på `/profile`).

## Interviewmotor
6. Interview engine er en kerne-subsystem, ikke blot onboarding-formular.
7. Self-claim er input, ikke bevis.

## Leveranceprioritet
8. Undgå at bygge database/payment/persistence/marketplace for tidligt.
9. Fokusér på sikker, iterativ produktkerne før platform-udvidelser.

## Profilarkitektur V2 (godkendt 2026-05-09)
10. Interviewmotoren udvides til fem profildimensioner som defineret i PROFILE_ENGINE_REQUIREMENTS.md V2.
11. De fem dimensioner er: faglig profil, personprofil og adfærdsmønster, kommunikationsprofil, livsstil og arbejdsliv-balance, rekrutteringsflexibilitet.
12. Tre ekstra kapaciteter tilføjes: styrkeblinde pletter, energikort over arbejdslivet, troværdighedsvurdering.
13. Dette er V1-scope — ikke future backlog.
14. Systemet skal understøtte et adaptivt autenticitets- og værdimatchlag i profil og ansøgningsgenerering. Dette er V1-scope, ikke backlog. Krav er defineret i APPLICATION_PROFILE_REQUIREMENTS.md. (Godkendt Session 2, 2026-05-11)
15. M1-gate kræver indholdsvalidering af completionAnalysis-felter — ikke kun antal-tælling. (Godkendt Session 2, 2026-05-11)
16. Autenticitetsprofil implementeres i interviewmotor og tests som V1-scope før M1-gate. (Godkendt Session 2, 2026-05-11)
17. Fire manglende segment-scenarier tilføjes før M1-gate: executive, ledig, trade-transition, SOSU same-track. (Godkendt Session 2, 2026-05-11)
18. Diversity/bias-aggregattest landes før M3 — ikke M1. (Godkendt Session 2, 2026-05-11)
