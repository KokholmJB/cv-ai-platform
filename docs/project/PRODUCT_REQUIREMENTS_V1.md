# PRODUCT_REQUIREMENTS_V1

## Formål med V1
V1 skal bevise JobPilots kerne-wedge:
- seriøst profilfundament
- bedre jobbeslutninger
- fundament for målrettet CV/ansøgningsarbejde

V1 behøver ikke levere alle senere moduler fuldt ud. V1 skal bevise, at kerne-logikken virker i praksis.

## Hvad JobPilot V1 skal være
- Et AI-baseret job-search operating system (ikke kun dokumentgenerator).
- Denmark-first og Danish-first.
- Et kontrolleret workflow-produkt (ikke open-ended chatbot).
- Et produkt med tydelig adskillelse mellem personlig profil og teknisk AI-profil.

## Hvad JobPilot V1 ikke må blive
- En generisk CV-generator.
- Et projekt med flotte tekster, men tynd profilforståelse.
- Et scope-creep projekt med for mange sidefunktioner før kerneværdi er bevist.

## V1 user journey (forventet flow)
1. Bruger lander på produktet.
2. Bruger går ind i setup.
3. Bruger udfylder basisoplysninger.
4. Bruger uploader CV/profilmateriale eller tilsvarende grundlag.
5. AI-interview styrker og afklarer profilen.
6. Bruger får et personligt profiloverblik.
7. Systemet har et teknisk AI-profilfundament bagved.
8. Fundamentet kan senere bruges til jobevaluering og målrettet materiale.

## V1 non-negotiables
- JobPilot må ikke føles som en generisk CV-generator.
- JobPilot må ikke producere overfladiske profilopsummeringer.
- JobPilot må ikke vise rå AI/debug-felter til normale brugere.
- JobPilot må ikke kun bygge på brugerens selvbeskrivelse.
- JobPilot må ikke skubbe brugere mod promotion, ledelse eller karriereskifte som default.
- JobPilot skal holde personlig profil og teknisk AI-profil adskilt.
- JobPilot skal være Danish-first og Denmark-first i V1.

## Setup/onboarding-krav i V1
- Basisoplysninger skal være kompakte og overskuelige.
- Dokument-trin skal tydeligt forklare, at CV/profilmateriale er vigtigt.
- Hvis bruger ikke har CV, skal der senere være et struktureret alternativ.
- AI-interview skal føles hjælpsomt og seriøst, ikke som et standardspørgeskema.
- Setup skal ende i brugerrettet profiloverblik, ikke teknisk systemrapport.

## Dokument-/intake-fundament i V1
V1-krav:
- Produktet skal fastlåse princippet om, at dokumenter og materiale betyder noget.
- Arkitekturen skal støtte dokument-first/profile-first tænkning.

Kan være senere (hvis ikke klar nu):
- Fuldt dokument-parse flow.
- Fuldt evidensscore-lag.

Vigtigt:
- Produktet må ikke lade som om interview alene altid er nok, hvis evidensgrundlaget er svagt.

## AI-interview-krav i V1
Detaljeret source-of-truth ligger i:
- `docs/project/PROFILE_ENGINE_REQUIREMENTS.md`

Opsummeret skal V1-interview:
- være intention-first
- være evidence-aware
- håndtere uklare brugere ordentligt
- undgå loops og gentagelser
- complete med eksplicit usikkerhed når nødvendigt
- producere et brugbart profilfundament

## Profiloverblik-krav (personlig profil)
- Skal være varm, dansk, praktisk og nyttig.
- Skal bruge “du” og “din erfaring”.
- Må ikke vise rå `profileModel`/debug/interne felter.
- Må ikke præsentere gaps som personlig kritik.
- Skal forklare:
  - hvad JobPilot har forstået
  - styrker
  - retning
  - arbejdsstil
  - næste nyttige skridt

## Teknisk AI-profil-fundament
V1 skal forberede et separat teknisk profil-lag.

Det lag må gerne indeholde:
- evidenssignaler
- usikkerhed
- confidence
- realisme
- mismatch-signaler

Det bruges senere til:
- jobevaluering
- CV-generering
- ansøgningsgenerering

Det må ikke være primær setup-output til brugeren.

## Jobevaluerings-fundament
Fuld jobevaluering kan være senere/early V1 afhængigt af implementering.
Produktretningen i V1 skal dog understøtte:
- apply / maybe / not worth effort-logik
- forklaring af fit og mismatch
- sammenligning mellem jobkrav og profilens evidens
- fravalg af keyword-only matching

## CV-/ansøgnings-fundament
Fuld produktionspipeline kan være uden for V1.
Men V1 skal bygge grundlaget korrekt:
- senere output skal bruge reel evidens
- output skal lyde som brugeren, bare skarpere
- output må ikke være generisk AI-sprog
- output må ikke oversælge eller opfinde erfaring
- framing skal kunne tilpasses task/result/case/transition-behov

## Minimum kvalitetsbar før pilot
- Setup virker ende-til-ende.
- Interview/profile engine leverer stabil og brugbar profilbase.
- Personlig profilvisning er tydeligt brugerrettet.
- Kritiske regressionschecks er grønne på kendt baseline.
- Projektdokumentation under `docs/project/` er opdateret.

## Pilot ready-checkliste
- [ ] Setup-flow virker stabilt fra start til profiloverblik.
- [ ] Interview/profile engine består relevante quality gates.
- [ ] Personlig profiloutput er brugbar og brugerrettet.
- [ ] Teknisk profilfundament findes eller er tydeligt repræsenteret.
- [ ] Ingen kendte kritiske UX/profil-regressioner.
- [ ] `docs/project` source-of-truth er opdateret.
- [ ] Build/lint/relevante tests er grønne.

## Eksplicit ikke V1
- Fuld produktion auth/payment.
- Fuld database/persistence.
- Fuld CV-/ansøgningspipeline i produktion (hvis ikke klar).
- Marketplace/B2B/rekrutteringsside.
- Avanceret karrierecoaching som hovedmodul.
- Fuldt automatiseret læringsloop.
- Bred internationalisering.
- Tung analytics-udbygning.

## Relation til øvrige projekt-dokumenter
- `docs/project/PROFILE_ENGINE_REQUIREMENTS.md` definerer interview/profile engine i detalje.
- `docs/project/FUTURE_IDEA_BACKLOG.md` samler ideer uden for V1.
- `docs/project/QUALITY_GATES.md` definerer valideringsgates.
- `docs/project/TASK_BOARD.md` tracker aktive opgaver.
