# FUTURE_IDEA_BACKLOG

## Formål
Denne fil samler vigtige idéer uden for aktiv V1-scope, så produktretning og founder-intent ikke går tabt mellem chats, konti og branches.

## Styrende regel
Fremtidige idéer må ikke overstyre V1-wedgen: bedre jobbeslutninger, seriøst profilfundament og stærkere målrettede ansøgninger.

## Post-V1 produkter

### AI Agent Udviklings- og Projektplatform
- Hvad: Et selvstændigt program der organiserer projekter og driver udvikling via AI-agenter — bygget og testet før satellit-produkterne.
- Formål: Platformen bygger produkterne. Satellit-produkterne bliver den første test af om platformen virker.
- Projektoverblik:
  - Hvert projekt åbner med visuelt overblik over status, modeller og relevante projektværktøjer
  - Projekter oprettes med en grundidé der bearbejdes i et udviklingsmodul
- Udviklingsmodul:
  - Bruger skriver grundidé
  - AI-rådgiver/research-agent hjælper med at konkretisere idéen
  - Når idéen er moden overføres den til et projekt
  - Systemet opsætter automatisk projektstruktur, dokumenter og agenter
- AI Agent-hierarki:
  - Styregruppe (øverste lag): brugeren kommunikerer med gruppen som helhed; styregruppen består af relevante AI-agenter der deltager i chatten; brugeren er den der endeligt godkender ved gates
  - Per projekt: AI projektleder-agent; under denne specialiserede agenter — research, projektstyring, design, kode, UX osv.
  - Inspireret af JobPilot-arbejdsstrukturen men automatiseret: systemet kører selv mellem gates uden brugerindblanding; ved hver fase-afslutning gate der tages op i styregruppen; brugeren godkender før næste fase starter
- Rækkefølge:
  1. Byg AI Agent Udviklings- og Projektplatform
  2. Test platformen ved at lade den bygge satellit-produkterne
  3. Hvis det virker — platformen er valideret og klar til brug
- Hvornår genovervejes dette: Når JobPilot V1 er lanceret og kerneværdien er valideret.
- Vigtig regel: Dette ændrer ikke V1-fokus. Ingenting her bygges før JobPilot V1 er færdigt.

### Satellit-produkter
- Hvad: Selvstændige mini-sites eller lette produkter der adresserer ét specifikt jobsøger-behov uden fuld JobPilot-onboarding.
- Strategisk formål:
  - Lav friktion — brugeren behøver ikke oprette fuld profil for at prøve produktet
  - Bred top-of-funnel — lavtærskel-indgange der kan konvertere til JobPilot-kerne
  - A/B-laboratorium — teste hvad der resonerer bredt vs. hos seriøse jobsøgere
  - Komplementær, ikke konkurrerende — kernen forbliver det primære produkt
  - Potentiel selvstændig værdiskabelse — nogle satellit-produkter kan have standalone-nytte
- Mulige satellit-indgange:
  - Jobmatch-site: brugeren indsætter CV + jobopslag → hurtig fit-score og gaps
  - CV-oversætter: konverterer CV til mere målrettet dansk format
  - Ansøgningsgenerator: genererer ansøgning fra CV + jobopslag uden fuld profil
  - CV-kritik/vurdering: struktureret feedback på et CV
  - Karriere-retningstest: hurtig afklaring af jobretning og -niveau
- Feedback- og målingslag:
  - Niveau 1: Satellit-bruger → konverterer til JobPilot-kerne? (top-of-funnel effektivitet)
  - Niveau 2: Satellit-output kvalitet vs. JobPilot-kerne-output kvalitet (produktværdi-validering)
- Arkitektur-princip: JobPilot Core er altid det dybeste produkt; satellit-sites peger på samme backend
- Vigtig regel: Dette ændrer ikke V1-fokus. Ingenting her bygges før JobPilot V1 er færdigt.
- Hvornår genovervejes dette: Efter V1-lancering med brugerdata der viser hvad der driver acquisition og conversion.

## Later
### Feedback-loop fra jobansøgninger
- Hvad: Brugeren kan logge udfald pr. job: applied, no reply, rejection, interview, senere runder og evt. employer feedback.
- Hvorfor: JobPilot kan lære hvilke jobtyper der giver reel respons, og gøre anbefalinger og målretning mere realistiske over tid.
- Hvorfor ikke V1: Kræver persistence, outcome tracking og omhyggeligt produktflow.
- Kræver før build: Job tracking-fundament, strukturerede outcome-felter og privacy-sikker datahåndtering.

### CV-/ansøgningskvalitet feedback-loop
- Hvad: Struktureret feedback efter genererede dokumenter, fx multiple-choice:
  - lyder det som mig?
  - for generisk?
  - for poleret/AI-agtigt?
  - konkret nok?
  - klar til at sende?
- Hvorfor: Giver systematisk input til bedre produktbeslutninger og outputkvalitet over tid.
- Hvorfor ikke V1: Kræver stabil baseline og tydelige feedbackskemaer.
- Kræver før build: Standardiserede feedbackfelter, tydelig tolkning af svar og sikker datalagring.

### Profilvurderings-kvalitetsloop
- Hvad: Løbende vurdering af om JobPilot forstår brugeren korrekt:
  - kan brugeren genkende sig selv?
  - føles profilen præcis?
  - mangler vigtige styrker?
  - overdriver profilen noget?
  - bliver profilen valideret eller modbevist af senere jobudfald?
- Hvorfor: Direkte kvalitetssikring af profile engine over tid.
- Hvorfor ikke V1: Kræver kobling mellem profil og outcomes.
- Kræver før build: Persistente profilversioner, outcome-data og enkel feedback UX.

### Produkt/outcome analytics-lag
- Hvad: Aggregeret læringslag for produktkvalitet:
  - interview completion-rate
  - rejection/no-reply mønstre
  - enighed med anbefalinger
  - mismatch mellem anbefaling og faktisk udfald
  - hvilke profiltyper får traction i hvilke jobkategorier
- Hvorfor: Hjælper med at prioritere reelle produktforbedringer.
- Hvorfor ikke V1: Risiko for analytics-overbygning for tidligt.
- Kræver før build: Privacy-bevidst datamodel, klare KPI-definitioner og governance.

### Dybere karriererådgivning
- Hvad: Mere aktiv rådgivning om retning, tempo og valg.
- Hvorfor: Øger brugerens beslutningskvalitet over tid.
- Hvorfor ikke V1: Kræver stærkere profile engine + datafeedback.
- Kræver før build: Stabil profilkvalitet og dokumenteret outcome-loop.

### Follow-up interview/check-in
- Hvad: Opfølgende interview efter ansøgninger/interviews.
- Hvorfor: Profilen bliver skarpere af real-world feedback.
- Hvorfor ikke V1: Mangler feedbackinfrastruktur.
- Kræver før build: Job tracking + struktureret outcome-data.

### Profile page med dybere sektioner
- Hvad: Fuldt profilunivers med personligt overblik + avanceret teknisk profil.
- Hvorfor: Giver transparens og bedre brugerforståelse.
- Hvorfor ikke V1: Basis-shell er endnu tidlig.
- Kræver før build: Færdig profile view-model arkitektur.

## Needs validation
### Realism assessment mod måljob
- Hvad: Tydelig vurdering af hvor realistisk målet er nu.
- Hvorfor: Kan styre brugerens indsats bedre.
- Hvorfor ikke V1: Risiko for hård/fejlkalibreret feedback.
- Kræver før build: Validerede regler + brugerfeedback på tone/nytte.

### Career advisory-lag (realisme + næste trin)
- Hvad: Vurdering af om målniveau er realistisk, forklaring når det ikke er, og forslag til mere realistiske veje samt hvordan profilen kan styrkes.
- Hvorfor: Giver konkret retning uden at sælge falske forventninger.
- Hvorfor ikke V1: Kræver stærk evidensmodel og stabil profilvurdering.
- Kræver før build: Dokumenteret kvalitet i profile engine + testet rådgivningstone.

### Competence-gap planning
- Hvad: Forslag til hvad der skal styrkes for næste skridt.
- Hvorfor: Kan skabe konkret fremdrift.
- Hvorfor ikke V1: Risiko for at blive “kursusmotor” uden effekt.
- Kræver før build: Dokumenteret sammenhæng med bedre jobresultater.

### Ongoing career development
- Hvad: Løbende udviklingsspor efter aktiv jobsøgning.
- Hvorfor: Forlænger produktværdi efter første jobskifte.
- Hvorfor ikke V1: Fokus skal først være kerne-wedge.
- Kræver før build: Bevist retention og tydelig bruger-nytte.

## Potential premium feature
### Interviewtræning (profil + job + CV/ansøgning + historik)
- Hvad: Træningsmodul til jobsamtaler baseret på:
  - personlig profil
  - teknisk AI-profil
  - konkret jobopslag
  - genereret CV/ansøgning
  - feedbackhistorik
  - realistisk rolle-/virksomhedskontekst
- Hvorfor: Mere nyttig end generisk AI-interviewtræning.
- Hvorfor ikke V1: Kræver stærk integration mellem flere kernelag.
- Kræver før build: Stabil jobvurdering + dokumentpipeline + feedbackstruktur.

### Profil-dybde packaging (Basisprofil / Avanceret profil / Komplet profil)
- Hvad: Fremtidig pakning af profiloplevelsen i niveauer.
- Hvorfor: Kan skabe tydelig værdiopdeling.
- Hvorfor ikke V1: Risiko for at monetisere før kernekvalitet er bevist.
- Kræver før build: Klar produktetik:
  - basiskvalitet må ikke degraderes i lavere tiers
  - forskellen skal være hvor dybt profilen anvendes (jobevaluering, dokumenter, advisory), ikke at basisprofilen gøres dårlig.

### Premium synlig arbejds-/personprofil
- Hvad: Dybere, visuelt profil-lag for avancerede brugere.
- Hvorfor: Kan differentiere produktet.
- Hvorfor ikke V1: Risiko for scope creep og pseudo-psykometri.
- Kræver før build: Klar modelgrænse og dokumenteret effekt.

### LinkedIn/CV maintenance
- Hvad: Løbende vedligehold af profiltekster og dokumenter.
- Hvorfor: Kontinuerlig værdi mellem aktive ansøgningsperioder.
- Hvorfor ikke V1: Kræver stabil kerne først.
- Kræver før build: Konsistent outputkvalitet over tid.

### Lønforhandlingsstøtte
- Hvad: Hjælp til lønforhandling baseret på profil og marked.
- Hvorfor: Direkte økonomisk værdi for bruger.
- Hvorfor ikke V1: Kræver moden markeds- og evidensmodel.
- Kræver før build: Sikker datakvalitet + defensible anbefalinger.

## Potential business model layer
### Subscription-pakker (Basis/Aktiv/Pro)
- Hvad: Fremtidig pakning af funktioner.
- Hvorfor: Mulig skalerbar monetisering.
- Hvorfor ikke V1: Packaging skal følge dokumenteret værdi, ikke omvendt.
- Kræver før build: Pilot-læring på faktisk brugeradfærd.

### Pilot/pricing-idéer som arbejdshypoteser
- Hvad: Midlertidige prisantagelser til test.
- Hvorfor: Hjælper med tidlig forretningsvalidering.
- Hvorfor ikke V1: Ikke låste beslutninger endnu.
- Kræver før build: Klar pilotmåling af retention og outcome.

### Employer/recruitment-side services
- Hvad: Betalt rekrutteringsservice hvor virksomheder får bedre matching- og kandidatstøtte (ikke generiske bannerannoncer).
- Hvorfor: Mulig stærk B2B-indtægt med højere værdi pr. kunde.
- Hvorfor ikke V1: Risiko for at splitte fokus før kandidatværdien er bevist.
- Kræver før build: Dokumenteret B2C-kandidatværdi først + tydelig B2B-go-to-market.

### Job marketplace / partnerskaber
- Hvad: Senere partnerskaber/integrationer med jobplatforme (fx Jobindex/LinkedIn i generel forstand).
- Hvorfor: Mulig distribution, datafordel og workflow-fart.
- Hvorfor ikke V1: Må ikke være en afhængighed for at bevise kerneværdi.
- Kræver før build: Stabil matchkvalitet, tydelig partner-case og operationel kapacitet.

### Direkte company job ads/recruitment support
- Hvad: Virksomheder kan publicere/styre opslag via JobPilot.
- Hvorfor: Potentiel to-sidet model.
- Hvorfor ikke V1: For tidligt ift. kernefokus.
- Kræver før build: Bevist kandidatværdi + klar B2B-efterspørgsel.

### Intern jobskifte-støtte
- Hvad: Hjælp til intern mobilitet: interne roller, intern promotion, afdelingsskifte og intern repositionering.
- Hvorfor: Stor praktisk værdi for brugere, som ikke vil skifte arbejdsgiver.
- Hvorfor ikke V1: Kræver særskilt logik, datafelter og rådgivningstone.
- Kræver før build: Stabil profilvurdering + tydelig intern mobilitet use case.

## Parked
### Retention-layer efter aktiv jobsøgning
- Hvad: Produktlag til “efter jobskifte”-fasen.
- Hvorfor: Kan øge livstidsværdi.
- Hvorfor ikke V1: Ikke kritisk for wedge-validering nu.
- Kræver før build: Dokumenteret behov hos pilotbrugere.

## Scope creep for now
### Funktioner der ligner “alt-i-en karriereplatform”
- Hvad: Store sidefunktioner uden direkte kobling til V1-kernen.
- Hvorfor: Kan virke attraktive på idéplan.
- Hvorfor ikke V1: Øger kompleksitet uden sikker kernelæring.
- Kræver før build: At V1-kernen er valideret og driftssikker.

## Regel mod idé-overload
Nye idéer må ikke direkte blive tasks.

Før en idé bliver aktiv opgave, skal den gennem Projektstyring og klassificeres som:
- now
- MVP
- later
- parked
- scope creep
