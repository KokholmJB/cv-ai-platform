# JOBPILOT PROFIL ARKITEKTUR

## Overordnet vision og ekspertpanel-arkitektur

JobPilot er ikke et CV-værktøj. Det er et AI-drevet ekspertpanel der arbejder sammen om ét mål: at maksimere brugerens reelle chance for at komme til samtale — og på sigt få jobbet.

Visionen er at systemet svarer til at sende sine oplysninger til 10+ af de bedste og mest erfarne specialister inden for:
- HR og rekruttering (hvad rekrutterer ser og screener på)
- Psykologi (hvem er denne person, hvad driver dem)
- Erhvervsledelse (markedsværdi og strategisk positionering)
- Job coaching (handlingsplan og samtale-forberedelse)
- Markedsføring (profilering og personligt brand)
- Karrierestrategi (hvilke jobs, hvilken rækkefølge, hvilke brancher giver størst chance)
- Samtalecoaching (forberedelse til specifikke formater)

Disse specialister arbejder parallelt, syntetiserer deres viden, og producerer en samlet strategisk plan for brugeren.

Målsætning: Brugere der følger systemets anbefalinger skal have dokumenteret 50%+ chance for at komme til samtale på de jobs de søger.

Dette er det overordnede kvalitetsmål alt andet måles mod.

---

## Lag 0 — Dokument-analyse

Lag 0 er forudsætningen for at ekspertpanelet kan arbejde præcist.

Input: CV, uddannelsesbeviser, certifikater, kurser, personlig tekst — alt hvad brugeren har.

Output: Struktureret profileDraft som Lag 1 starter fra:
- Roller og ansvar med tidslinje
- Dokumenterede kompetencer og resultater
- Uddannelse og certificeringer
- Identificerede gaps og uklarheder
- Første evidensvurdering: claim vs. dokumenteret

Konsekvens for Lag 1: Interviewet starter ikke fra nul.
Motoren ved hvad CV'et siger og bruger interview-turns på:
- At validere og uddybe CV-claims
- At finde hvad CV'et ikke fortæller
- At afdække motivation, værdier og autenticitet
- At identificere gaps mellem dokumentation og mål

Uden Lag 0 er interviewet for bredt og for generelt.
Med Lag 0 bliver interviewet præcist, personligt og fokuseret.

**Status**: Arkitekturkrav godkendt. Implementation planlagt i M1/M2.

---

## Lag 1 — Interview-motor

Lag 1 er det kontrollerede AI-interview der bygger profileDraft videre fra Lag 0's fundament.

Lag 1 er intention-first og evidence-aware. Det stiller målrettede opfølgningsspørgsmål for at:
- Validere og uddybe dokumenterede claims
- Afdække hvad CV'et ikke fortæller (motivation, værdier, no-gos)
- Identificere gaps mellem dokumentation og brugerens mål
- Sikre komplet dækning af alle fem profildimensioner

De fem profildimensioner:
1. Faglig profil (evidensklassificering, styrker, gaps)
2. Personprofil og adfærdsmønster (ambition, teamrolle, beslutningsstil)
3. Kommunikationsprofil (selvpromotion, rekrutteringsformat-sårbarhed)
4. Livsstil og arbejdsliv-balance (intensitet, fleksibilitet, bæredygtighed)
5. Rekrutteringsfleksibilitet (klassificering, tillid, evidensstyrke)

Output: Komplet `interviewState` og `profileDraft` til Lag 2.

**Regler**:
- Antag ikke at brugeren vil have forfremmelse
- Antag ikke at brugeren vil have ledelse
- Antag ikke at brugeren vil skifte retning
- Self-claim er input, ikke bevis
- Kompletter med eksplicit usikkerhed fremfor at loope

**Status**: Implementeret og aktiv. Se PROFILE_ENGINE_REQUIREMENTS.md for detaljeret spec.

---

## Lag 2 — Profileringslag

Lag 2 analyserer det samlede interviewoutput og producerer alle `completionAnalysis`-felter.

Input: `profileDraft`, `interviewState`, `profileModel` fra Lag 1.

Output:
- `evidenceProfile`: evidensklassificering, styrkemod-mål, transferable strengths
- `behaviorProfile`: adfærd under pres, teamrolle, beslutningsstil, ambitionsprofil
- `communicationProfile`: selvpromotion, rekrutteringsformat-sårbarhed, troværdighed
- `lifestyleProfile`: arbejdsintensitet, fleksibilitetsbehov, bæredygtighed
- `recruitmentLogic`: klassificering, kandidattype, evidensstyrke
- `hiddenStrengths`, `energyConditions`, `interviewReadiness`
- `authenticityProfile`: dominante passioner, værdianker, naturlig stemme

Den nuværende implementering er regelbaseret. En AI-baseret version (claude-opus-4-7) er implementeret bag feature flag `ENABLE_AI_COMPLETION_ANALYSIS`.

**Status**: Regelbaseret sti i produktion. AI-sti bag flag. Validering via benchmark-suite i M2.

---

## Lag 3 — Autenticitetsprofil og værdimatch

Lag 3 syntetiserer Lag 2's output til en fortolket profil med autenticitets- og værdimatch-analyse.

Output: `Lag3Profile` som defineret i LAG3_PROFILE_SCHEMA.md.

Nøglefelter:
- `authenticityProfile.authenticityScore`: high / medium / low
- `authenticityProfile.selfPresentationBias`: undersells / accurate / oversells
- `authenticityProfile.passionIndicators`: verificerede interessemarkører
- `authenticityProfile.valueAnchors`: kerneværdier der ikke forhandles
- `authenticityProfile.authenticVoiceMarkers`: naturlig sprogbrug

Lag 3 er forudsætning for M3 (jobevaluering og ansøgningsgenerering). Uden autenticitetsprofil kan output ikke lyde som brugeren.

**Status**: Schema designet (LAG3_PROFILE_SCHEMA.md). Implementation planlagt i M2.

---

## Lag 4 — Output-adaption

Lag 4 tager Lag 3's fortolkede profil og producerer menneskelige, korrigerbare profilformuleringer.

Output tilpasses modtager og formål:
- `cv_summary`: CV-opsummering
- `linkedin_about`: LinkedIn om-sektion
- `ansøgning_indledning`: Ansøgningsindledning
- `kandidatpræsentation`: Rekrutteringsvendt præsentation

Nøgleprincip: Lag 4 oversælger ikke. Det adskiller fakta fra fortolkninger og markerer usikkerheder eksplicit. Det formulerer i brugerens stemme — baseret på `authenticVoiceMarkers` fra Lag 3.

**Status**: Promptarkitektur og sektionsskabeloner designet (LAG4_PROFILE_TEMPLATE.md). Implementation planlagt i M2.

---

## Pipeline-flow

```
Brugerens dokumenter
      ↓
   [Lag 0]  Dokument-analyse → struktureret profileDraft
      ↓
   [Lag 1]  AI-interview → komplet interviewState + profileDraft
      ↓
   [Lag 2]  Profileringslag → completionAnalysis (alle 5 dimensioner)
      ↓
   [Lag 3]  Autenticitet + værdimatch → Lag3Profile
      ↓
   [Lag 4]  Output-adaption → CV / LinkedIn / ansøgning / interviewforberedelse
```

---

## Kvalitetsmål

Alt output måles mod ekspertpanel-visionen:

> Brugere der følger systemets anbefalinger skal have dokumenteret 50%+ chance for at komme til samtale på de jobs de søger.

Kvalitetsfilter for alle nye features:
1. Løfter det brugerens jobchance markant?
2. Er brugerværdien større end implementeringsomkostningen?
3. Passer det ind i ekspertpanel-visionen?
4. Kan det måles?

Alle fire ja = gør det.

---

## Versionering

- **v0.1** (2026-05-14): Oprettet. Ekspertpanel-vision, Lag 0-4 pipeline, kvalitetsmål dokumenteret.
