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
