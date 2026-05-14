# PRODUCT_REQUIREMENTS_V1

## Vision og strategisk kerne

JobPilot er ikke et CV-værktøj. JobPilot er et AI-drevet ekspertpanel der arbejder sammen om ét mål: at maksimere brugerens reelle chance for at komme til samtale — og på sigt få jobbet.

Visionen er at systemet svarer til at sende sine oplysninger til 10+ af de bedste og mest erfarne specialister inden for HR, psykologi, erhvervsledelse, job coaching, markedsføring, karrierestrategi og samtalecoaching — der arbejder parallelt, syntetiserer deres viden, og producerer en samlet strategisk plan for brugeren.

**Overordnet kvalitetsmål:** Brugere der følger systemets anbefalinger skal have dokumenteret 50%+ chance for at komme til samtale på de jobs de søger.

**North Star metric:** Interview rate per qualified application.
Får brugeren flere relevante samtaler ud af færre men bedre valgte ansøgninger?

## Strategisk kerne — beslutningskvalitet

Det centrale spørgsmål er ikke:
"Kan AI skrive mit CV?"

Det centrale spørgsmål er:
"Bør jeg søge dette job — og hvad er min reelle chance?"

JobPilot skal reducere spildt energi i jobsøgningen. Mange søger for bredt, for tilfældigt, for urealistisk, eller uden at forstå hvad arbejdsgiveren faktisk leder efter.

Prioriteringsrækkefølge:
1. Match quality — forstå personen og jobmuligheden først
2. Understanding the person — dybde før bredde
3. Document quality — stærke dokumenter på stærkt fundament
4. Workflow — overblik og struktur
5. Learning loop — lær af markedets respons
6. Coaching — forberedelse og samtale

CV og ansøgninger er vigtige — men de er kun stærke hvis JobPilot først har forstået brugeren ordentligt.

## Hvad JobPilot V1 skal være

- Et AI-drevet ekspertpanel — ikke en chatbot, ikke en formular
- Denmark-first og Danish-first
- Et kontrolleret workflow-produkt med høj beslutningskvalitet
- Et produkt der forstår mennesker på tværs af alle lag i samfundet
- Et produkt med tydelig adskillelse mellem personlig profil og teknisk AI-profil

## Hvad JobPilot aldrig må blive

- En generisk CV-generator
- Et produkt med flotte tekster men tynd profilforståelse
- Et produkt der kun validerer brugeren ukritisk
- Et scope-creep projekt med sidefunktioner før kerneværdi er bevist
- Et produkt der kun henvender sig til akademikere og digitalt kompetente brugere

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

## Idéklassifikation — fast arbejdsramme

Nye idéer klassificeres altid som:
- **now** — i aktiv scope, skal laves nu
- **MVP** — skal med i V1 men ikke nødvendigvis nu
- **later** — post-V1, hører i FUTURE_IDEA_BACKLOG.md
- **parked** — undersøges nærmere før beslutning
- **scope creep** — må ikke påvirke V1-fokus

## Evidenshierarki — hvad systemet skelner mellem

Self-claim er input, ikke bevis. Systemet skelner altid mellem:
- Fakta — verificerbare oplysninger
- Bruger-claims — hvad brugeren siger om sig selv
- Dokumenteret erfaring — hvad der fremgår af dokumentation
- Konkret evidens — specifikke eksempler med ansvar og resultat
- Mønstre — gentagne signaler på tværs af samtalen
- Hypoteser — arbejdshypoteser med eksplicit usikkerhed
- Mismatch-signaler — hvor profil og mål ikke matcher

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
