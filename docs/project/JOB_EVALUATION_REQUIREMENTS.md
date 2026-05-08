# JOB_EVALUATION_REQUIREMENTS

## Formål og ambition

Dette dokument definerer kravene til JobPilots jobevalueringsmodul — det system der vurderer om en bruger bør søge et konkret job, og hvordan de bedst positionerer sig hvis de gør.

Jobevaluering er ikke keyword-matching. Det er ikke en procentvis match-score. Det er en intelligent og ærlig vurdering der kombinerer brugerens dybe profil med en forståelse af hvad jobbet egentlig kræver — fagligt, personlighedsmæssigt, kommunikativt og kulturelt.

Målet er at brugeren sender færre men markant stærkere ansøgninger. Og at de ansøgninger de sender fører til samtaler hvor de reelt har en chance — ikke samtaler de sniger sig ind til og derefter ikke kan gennemføre troværdigt.

Det langsigtede mål er at minimum 30-40% af de ansøgninger brugeren sender via JobPilot fører til jobsamtale. Det kræver at systemet er præcist, ærligt og modigt nok til at fraråde job der ikke er realistiske — og til at identificere job der er stærkt mulige selv når brugeren selv er i tvivl.

---

## De fire evalueringssvar

Systemet skal kunne give præcist ét af fire evalueringssvar på et jobopslag. Svaret er ikke en score — det er en handlingsanbefaling med begrundelse.

---

### Svar 1 — Søg: Du er stærkt positioneret

Bruges når brugerens profil matcher jobbet godt på tværs af faglige krav, personprofil, kommunikationsfit og rekrutteringskontekst.

Output skal indeholde:
- Forklaring af hvad der gør matchet stærkt
- De tre til fem stærkeste argumenter for brugeren i dette job
- Anbefalet framing-strategi baseret på rekrutteringslogikken
- Eventuelle mindre svagheder der bør adresseres proaktivt i ansøgningen

---

### Svar 2 — Søg: Men forbered dig på dette

Bruges når matchet overordnet er godt men der er identificerbare svagheder der er relevante for jobbet og kan håndteres strategisk.

Output skal indeholde:
- Klar forklaring af hvad der er stærkt
- Præcis identifikation af de svage punkter der er relevante
- Konkret strategi for hvert svagt punkt: enten adressér det proaktivt i ansøgningen, forbered et godt svar til samtalen, eller framer det som en styrke under de rette omstændigheder
- Vurdering af om brugeren sandsynligvis kan håndtere disse punkter i en samtale hvis de er forberedt
- Samtaleforberedelse der specifikt adresserer de identificerede svagheder

---

### Svar 3 — Måske: Kræver en ærlig vurdering

Bruges når der er et reelt gap mellem brugerens profil og jobbets krav — men gapet er ikke uovervindeligt, og brugeren kan potentielt komme til samtale med stærkt materiale. Samtalen vil dog blive svær på specifikke punkter.

Output skal indeholde:
- Præcis forklaring af gapet
- Ærlig vurdering af om stærkt materiale kan kompensere nok til at komme til samtale
- Hvad der vil ske i samtalen: hvilke spørgsmål der sandsynligvis kommer, og om brugeren reelt kan besvare dem troværdigt
- Hvad brugeren skal beslutte: er det værd at prøve med åbne øjne, eller er energien bedre brugt på et stærkere match
- Alternativ: hvad der skal til for at dette job bliver et stærkt match på sigt

---

### Svar 4 — Søg ikke dette job lige nu

Bruges når gapet er for stort til at stærkt materiale kan kompensere, eller når brugeren sandsynligvis ikke vil kunne gennemføre en troværdig samtale selv hvis de kom ind.

Dette svar kræver mod fra systemet. Det er den vigtigste service JobPilot kan yde — at spare brugeren for et afslag der føles nedslående og at redirecte energien mod noget realistisk.

Output skal indeholde:
- Klar og respektfuld forklaring af hvorfor
- Ingen nedladende tone — det handler om fit, ikke om personens værdi
- Hvad der konkret mangler: erfaring, dokumentation, niveau, kommunikativ kapacitet til denne rekrutteringskontekst
- Hvad brugeren kan gøre i stedet: alternative job der matcher bedre nu, og hvad der skal til for at dette job eller denne type job bliver realistisk på sigt

---

## Evalueringens fem dimensioner

Jobevaluering er ikke én vurdering. Det er fem separate vurderinger der tilsammen fører til det samlede svar.

---

### Dimension A — Faglig og erfaringsmæssig fit

Matcher brugerens dokumenterede erfaring, kompetencer og evidens de faglige krav i jobopslaget?

Systemet skal:
- Identificere de reelle krav i opslaget — ikke kun de eksplicit nævnte, men også de implicitte baseret på stillingsniveau, branche og organisation
- Skelne mellem must-have krav og nice-to-have krav
- Vurdere brugerens evidensstyrke mod hvert must-have krav
- Identificere gaps og vurdere om de er kritiske eller kompensérbare
- Undgå at reducere vurderingen til keyword-overlap — to ord kan matche uden at erfaringen bag dem gør det

---

### Dimension B — Niveaufit og realismetjek

Er det stillingsniveau brugeren søger realistisk givet deres dokumenterede baggrund?

Systemet skal:
- Vurdere om brugerens reelle niveau matcher jobbets krav — ikke kun titlen, men ansvarsomfanget, kompleksiteten og de forventede kompetencer
- Identificere title inflation i begge retninger: brugere der søger for højt, og brugere der underpositionerer sig selv
- Vurdere om en eventuel niveauforskel er for stor til at kompensere, eller om stærke transferable strengths kan bro den
- Være eksplicit om stretch-jobs versus direkte fit versus underudnyttelse

---

### Dimension C — Personprofil og kulturfit

Vil brugerens naturlige adfærd, motivation og arbejdsstil passe til dette job og denne organisation?

Systemet skal:
- Vurdere om jobbets reelle arbejdsbetingelser matcher brugerens profil fra Dimension 1 i den dybe profil
- Identificere kulturmismatch-risici: en bruger med høj autonomi-præference i en stærkt hierarkisk organisation, en introvert profil i et job der kræver konstant repræsentation, en resultatdrevet profil i en procesorienteret organisation
- Vurdere energi- og motivationsfit: vil dette job sandsynligvis energisere eller dræne brugeren over tid
- Ikke diskvalificere brugere fra job på baggrund af personprofil alene — men markere mismatch-risici tydeligt så brugeren kan tage en informeret beslutning

---

### Dimension D — Kommunikativt fit og præsentationsevne

Kan brugeren præsentere sig selv troværdigt og overbevisende i den rekrutteringskontekst dette job sandsynligvis involverer?

Dette er en selvstændig evalueringsdimension fordi en fagligt stærk bruger kan fejle i rekruttering på grund af kommunikativt mismatch — og fordi en fagligt marginal bruger kan lykkes hvis kommunikationen er stærk og rekrutteringen er relationsbaseret.

Systemet skal:
- Identificere den sandsynlige rekrutteringslogik for dette job og denne organisation baseret på opslaget, branche, stillingsniveau og organisationstype
- Vurdere om brugerens kommunikationsprofil matcher den forventede rekrutteringskontekst
- Identificere specifikke kommunikative sårbarhedspunkter: strukturerede kompetenceinterviews brugeren sandsynligvis vil kæmpe med, small talk-krav i uformelle kulturer, præsentationsopgaver der kræver akademisk struktur, cases der kræver hurtig analytisk kommunikation
- Vurdere om disse sårbarhedspunkter er kritiske eller forberedbare
- Producere konkret samtaleforberedelse der er tilpasset både brugerens kommunikationsprofil og rekrutteringskontekstens forventede format

---

### Dimension E — Strategisk positionering og framing

Givet brugerens profil og jobbets kontekst — hvad er den optimale måde at positionere brugeren på?

Dette er ikke spin. Det er intelligent fremhævning af det der er mest relevant og troværdigt givet konteksten.

Systemet skal:
- Vælge den framing-strategi der passer til rekrutteringslogikken: task-baseret, result-baseret, case-baseret eller transition-baseret
- Identificere brugerens stærkeste argumenter for dette specifikke job — ikke deres generelt stærkeste kompetencer
- Identificere hvad der bør nedtones eller håndteres proaktivt
- Sikre at positioneringen er troværdig: brugeren skal kunne forsvare alt der fremhæves i en samtale

---

## Ærlighedsprincip

JobPilots stærkeste differentiator er ærlighed kombineret med handling. Systemet skal aldrig:

- Sende brugeren til en samtale de ikke kan vinde bare for at nå en konverteringsmetrik
- Pynte på en vurdering fordi brugeren tydeligvis ønsker at høre noget positivt
- Skjule kritiske gaps i en positiv formulering der reelt skjuler budskabet
- Anbefale en ansøgning der er baseret på materiale der ikke er troværdigt

Systemet skal altid:

- Give brugeren den information de har brug for til at tage en god beslutning
- Respektere brugerens autonomi: give anbefalingen, forklare grundlaget, og lade brugeren beslutte
- Formulere svær information på en måde der er konstruktiv og respektfuld — men aldrig fortynde det til det punkt hvor det mister sit indhold
- Sætte brugerens langsigtede succes og oplevelse over kortsigtede konverteringstal

---

## Samtaleforberedelse som del af jobevalueringen

Jobevaluering slutter ikke ved anbefalingen. For alle svar undtagen Svar 4 skal systemet producere konkret samtaleforberedelse.

Samtaleforberedelsen skal indeholde:

**Sandsynlige spørgsmål**
Baseret på jobbet, rekrutteringslogikken og brugerens profil — hvilke spørgsmål vil sandsynligvis komme. Ikke generiske interviewspørgsmål, men spørgsmål der er specifikke for denne bruger i dette job.

**Svar-strategi for svagheder**
For hvert identificeret svagt punkt: hvad er det bedste ærlige svar brugeren kan give. Systemet skal hjælpe med at formulere dette på en måde der er troværdig og positivt framed uden at være uærligt.

**Styrke-ankre**
De tre til fem argumenter brugeren altid skal vende tilbage til uanset spørgsmålets retning. Formuleret i brugerens naturlige sprog.

**Format-forberedelse**
Hvis rekrutteringen sandsynligvis involverer cases, præsentationer eller strukturerede kompetenceinterviews: konkret forberedelse til det specifikke format tilpasset brugerens kommunikationsprofil.

**Kultur og menneskelig forberedelse**
Hvad ved vi om organisationens kultur, stil og forventninger til kandidaten som person. Hvad skal brugeren være opmærksom på i den menneskelige del af samtalen.

---

## Rekrutteringslogik-detection

Systemet skal forsøge at identificere den sandsynlige rekrutteringslogik baseret på tilgængelige signaler i jobopslaget og konteksten.

**Signaler der indikerer mavefornemmelse og kemi:**
Uformelt sprog i opslaget, stærkt fokus på personlighed og kulturmatch, lille eller mellemstor virksomhed, direkte ansættelse uden HR-filter, netværksrekruttering.

**Signaler der indikerer CV og erfaring:**
Specifik liste af must-have erfaringskrav, fokus på anciennitet og branchekendskab, standardiseret stillingsbeskrivelse, offentlig sektor eller stærkt regulerede brancher.

**Signaler der indikerer dokumenterbare resultater:**
Salgsroller, ledelsesroller med P&L-ansvar, projektstillinger med leverancefokus, startups og vækstvirksomheder, stillinger der eksplicit nævner KPI'er eller målsætninger.

**Signaler der indikerer personprofiltest og kulturmatch:**
Eksplicit nævnelse af personprofil, kulturtest eller assessment center, større organisationer med strukturerede onboarding-processer, konsulentbranchen, finanssektoren.

**Signaler der indikerer akademisk og struktureret rekruttering:**
Formelle kompetencekrav, krav om akademisk uddannelse, case-interviews, præsentationsopgaver, graduate programmer, rådgivningsbranchen.

Systemet skal altid markere detektionen som sandsynlig — aldrig som sikker. Rekrutteringslogik kan ikke læses med fuldstændig sikkerhed fra et jobopslag alene.

---

## Output-krav til jobevaluering

Jobevalueringen skal producere følgende output til brugeren:

**Evalueringssvar** — ét af de fire svar med begrundelse i brugerens naturlige sprog.

**Fit-forklaring** — hvad der matcher godt og hvad der ikke matcher, formuleret konkret og uden jargon.

**Handlingsanbefaling** — hvad brugeren skal gøre nu: søge, forberede sig yderligere, overveje alternativerne eller lade være.

**Samtaleforberedelse** — kun hvis Svar 1, 2 eller 3.

**Alternativ-forslag** — kun hvis Svar 3 eller 4: hvilke typer job matcher bedre nu, og hvad der skal til for at dette job bliver realistisk.

Al output skal formuleres i brugerens kommunikationsprofil — ikke i generisk systemsprog.

---

## Kvalitetskrav og gates

Jobevalueringsmodulet må ikke tages i produktion før:

- Den dybe profil fra `DEEP_PROFILE_REQUIREMENTS.md` er opfyldt for brugeren
- Systemet kan demonstrere Svar 4 på mindst to testscenarier uden at blødgøre budskabet
- Systemet kan demonstrere korrekt rekrutteringslogik-detection på mindst fire scenariotyper
- Samtaleforberedelse er valideret som specifik og brugbar — ikke generisk
- Output er formuleret i brugerens kommunikationsprofil på tværs af mindst tre kommunikationsniveauer
- Systemet ikke producerer stærke konklusioner på svag evidens i den underliggende profil

---

## Relation til øvrige krav-dokumenter

`DEEP_PROFILE_REQUIREMENTS.md` definerer det profil-fundament jobevaluering bygger på.

`PROFILE_ENGINE_REQUIREMENTS.md` definerer den tekniske motor der producerer profilen.

`PRODUCT_REQUIREMENTS_V1.md` definerer den overordnede V1-ramme.

Jobevalueringsmodulet er det første sted brugeren oplever den fulde kraft af JobPilots profil-fundament. Det er ikke et sekundært modul — det er den primære demonstration af systemets kerneværdi.
