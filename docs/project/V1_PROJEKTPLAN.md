# V1_PROJEKTPLAN

## Vision
Danmarks bedste AI-baserede job search operating system. Ikke et CV-værktøj. Et seriøst profilfundament der hjælper mennesker med at tage bedre jobbeslutninger og få markant flere meningsfulde jobsamtaler. Ambition: 30-40% samtalekonvertering på afsendte ansøgninger.

## Produktmål V1
Et funktionelt system som rigtige brugere betaler for at bruge. Ledige danske jobsøgere på tværs af alle brancher og niveauer kan oprette sig, gennemføre AI-interview, få en profil, evaluere job, generere CV og ansøgning, og betale abonnement.

## Abonnementsmodel
- Basis: enkel adgang, prøveperiode
- Plus: fuld adgang
- Premium (V2): karriereprofil, avanceret rådgivning

## Milepælsplan — 8 uger

### M1 — Uge 1-2: Profilfundament færdigt
Interviewmotor dækker alle fem profildimensioner. Profile view model og mapping-lag færdigt. Personlig og teknisk profil adskilt.
Gate: test:interview-scenarios 0 WARN · test:setup-ux-review 0 WARN/FAIL · build grøn

### M2 — Uge 2-3: Jobanbefalingsmodel
Brugeren kan indsætte et jobopslag og få: søg / måske / ikke indsatsen værd. Forklaring af fit og mismatch. Fire evalueringssvar implementeret.
Gate: jobevaluering fungerer på mindst 3 segmenter · ingen keyword-only matching

### M3 — Uge 3-4: CV og ansøgningsgenerering
CV-generering med 2-3 layouts målrettet konkret job. Ansøgningsgenerering med troværdig motivation og tone. Output bygger på reel evidens.
Gate: output lyder som brugeren · ingen opfundet erfaring · mindst 2 layouts virker

### M4 — Uge 4-5: Jobtracker
Brugeren kan logge job de søger, status og noter. Simpelt og funktionelt.
Gate: tracker virker ende-til-ende · data gemmes korrekt

### M5 — Uge 5-6: Auth + persistence + GDPR
Brugerregistrering og login. Profil og jobtracker-data gemmes pr. bruger. GDPR-kompatibel datamodel.
Gate: login virker · data isoleret pr. bruger · GDPR-basis opfyldt

### M6 — Uge 6-7: Betaling + abonnement
Basis og Plus abonnement. Betalingsflow med prøveperiode. Stripe. Kontrolpanel.
Gate: betalingsflow virker i test · abonnement aktiveres korrekt

### M7 — Uge 7-8: Feedback-kampagne + pilot-klar
Feedback-skema med belønning (2 dages ekstra abonnement). Pilot kan lanceres.
Gate: alle M1-M6 gates grønne · feedback-flow virker · pilot-tjekliste godkendt

## WBS — Arbejdsnedbrydning

### 1.0 Interview engine + profilering (I GANG)
- 1.1 Completion gates hærdet ✅
- 1.2 Profile view model + mapping-lag ✅
- 1.3 Analyse-lag (communicationStyle, recruitmentFit, strengthGaps, energyMap, credibilitySignals) — I GANG
- 1.4 Nye spørgsmålsstrategier dimension 2 og 4
- 1.5 Personlig profil UX færdig
- 1.6 Document/evidence intake

### 2.0 Jobanbefalingsmodel
- 2.1 Jobopslag-parsing
- 2.2 Fit/mismatch-evaluering (fire evalueringssvar)
- 2.3 Søg / måske / ikke værd UI
- 2.4 Samtaleforberedelse output

### 3.0 CV + ansøgningsgenerering
- 3.1 CV-generering (2-3 layouts)
- 3.2 Ansøgningsgenerering
- 3.3 Framing-valg (task/result/case/transition)

### 4.0 Jobtracker
- 4.1 Job-log (status, noter, dato)
- 4.2 Tracker UI

### 5.0 Auth + persistence
- 5.1 Brugerregistrering + login
- 5.2 Database + datamodel
- 5.3 GDPR — vis/ret/slet egne data

### 6.0 Betaling + abonnement
- 6.1 Stripe integration
- 6.2 Basis / Plus + prøveperiode
- 6.3 Kontrolpanel

### 7.0 Feedback-kampagne
- 7.1 Feedback-skema
- 7.2 Belønningslogik (2 dages ekstra abo)

## Risikoanalyse

| Risiko | Sandsynlighed | Konsekvens | Mitigering |
|--------|--------------|------------|------------|
| Profilfundament for svagt | Middel | Høj | M1-gate må ikke passeres uden 0 WARN |
| 8 uger for ambitiøst | Høj | Middel | M1-M3 er kernen — kan aldrig forskydes |
| Auth/persistence GDPR-fejl | Middel | Høj | GDPR-model i M5 før betaling |
| CV output generisk | Middel | Høj | M3 bygger kun på M1-profil |
| Stripe kompleks alene | Middel | Middel | Brug Stripe Checkout hosted |
| Jobevaluering keyword-only | Middel | Høj | M2-gate kræver fit/mismatch forklaring |

## UX/Design-spor (parallelt med M1-M3)

### UX Fase 1 — Strukturelt fundament
Gate: progressbar aktiv, system-look, næste-skridt logik,
konsistent komponent-sprog. Skal være klar inden M1-gate.

### UX Fase 2 — Dashboard og visualisering
Gate: fuldt dashboard, profilstyrke-visualisering,
motivationsmekanik, design system. Klar inden pilot.

### UX Fase 3 — Engagement og retention
Gate: accessibility-audit, hook-mekanikker, mobil-first.
Klar efter pilot-feedback.

## Aktuel position
Vi er i M1 — Profilfundament.

Færdigt: interview engine hærdet · transition gate · stash@{0} applied · profile view model · analyse-lag design klar

Næste: analyse-lag i route.ts implementeret og verificeret lokalt · spørgsmålsstrategier dimension 2 og 4

## Known limitations
- project-manager-to-product-manager WARN — accepteret, løses senere
- Analyse-lag designet men ikke verificeret lokalt endnu
