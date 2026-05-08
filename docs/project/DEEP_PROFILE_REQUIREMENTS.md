# DEEP_PROFILE_REQUIREMENTS

## Formål og ambition

Dette dokument definerer kravene til JobPilots dybe profileringsmodel — det fundament som alle efterfølgende produktfunktioner bygger på.

JobPilot skal forstå brugeren dybere end de fleste brugere forstår sig selv i arbejdsmæssig sammenhæng. Det er ikke en tom ambition. Det er et konkret krav til systemets output-kvalitet: profilen skal være stærk nok til at generere CV, ansøgning og jobanbefalinger der markant øger brugerens succes på jobmarkedet — målt i meningsfulde samtaler hvor brugeren reelt har en chance.

Systemet skal virke for alle: direktøren med 25 års ledelseserfaring, fagspecialisten der aldrig har skrevet en ansøgning, lagerassistenten der søger noget bedre, og personen der har svært ved at formulere sig men har solid praktisk erfaring. Profileringsmodellen må ikke favorisere dem der er gode til at beskrive sig selv. Den skal afdække reel værdi uanset brugerens evne til selvpræsentation.

---

## De fire profildimensioner

Profilen består af fire lag der tilsammen giver en 360-graders forståelse af brugeren i jobsøgningskontekst. Lagene er ikke uafhængige — de påvirker og validerer hinanden.

---

### Dimension 1 — Personprofil og adfærdsmønster

Dette lag handler om hvem brugeren er som person i arbejdssammenhæng. Ikke personlighed som abstrakt begreb, men konkrete adfærds- og motivationsmønstre der er direkte relevante for jobvalg, jobperformance og rekrutteringssucces.

Systemet skal ikke administrere en eksisterende personprofiltest eller licensere DISC, MBTI, Big Five eller Hogan. Det skal bygge sit eget lag inspireret af disse modeller — men designet specifikt til jobsøgningskontekst og til at fungere uden at brugeren tager en formel test.

Profilen skal afdække og forstå:

**Energi og motivation**
Hvad giver brugeren energi i arbejdslivet. Hvad dræner dem. Hvad de aktivt søger mere af. Hvad de vil væk fra. Forskellen på hvad de siger de vil have og hvad der rent faktisk motiverer dem baseret på deres faktiske arbejdshistorie.

**Adfærd under pres og i konfliktsituationer**
Hvordan reagerer brugeren når deadlines er stramme, når der opstår uenighed, når de bliver udfordret. Trækker de sig, går de i offensiv, søger de konsensus, ignorerer de konflikten. Dette er kritisk information for jobbets krav til fx ledelse, kundeservice, projektarbejde eller selvstændig drift.

**Naturlig rolle i grupper og teams**
Er brugeren naturligt en igangsætter, en gennemfører, en kvalitetssikrer, en koordinator, en kreativ, en støtte. Disse roller er ikke hierarkisk rangordnede — alle er vigtige, og et mismatch mellem brugerens naturlige rolle og jobbets krav er en reel risikofaktor.

**Beslutningsstil**
Analytisk og datadrevet, intuitiv og erfaringsbaseret, konsensussøgende, hurtig og handleorienteret. Beslutningsstil er ikke god eller dårlig — men den skal matche jobbet og organisationskulturen.

**Selvbillede versus omverdenens sandsynlige billede**
Systemet skal kunne identificere mønstre hvor brugerens selvopfattelse sandsynligvis afviger fra hvordan andre oplever dem. Dette er ikke kritik — det er en service. En bruger der systematisk undervurderer sin egen ledelseserfaring fordi de "bare koordinerede" er et eksempel. En bruger der overvurderer sin strategiske rolle fordi de var til stede ved strategimøder er et andet.

**Stressmønster og bæredygtighed**
Hvad er brugerens historiske mønster omkring arbejdsbyrde, tempo og bæredygtighed. Har de tendens til at overbelaste sig selv, til at underpræstere i kaotiske miljøer, til at trives under pres eller til at have brug for forudsigelighed. Dette er ikke en svaghed der skal skjules — det er information der skal bruges til at finde job brugeren faktisk trives i.

**Ambitionsprofil**
Vil brugeren op, ud til siden, ned i tempo, eller blive hvor de er med bedre vilkår. Ambition er ikke kun vertikal. Systemet må ikke antage at alle vil have mere ansvar, højere titel eller mere løn. Systemet skal forstå den specifikke brugers reelle ambitionsprofil og respektere den.

---

### Dimension 2 — Faglig profil og evidensstyrke

Dette lag handler om hvad brugeren faktisk kan og har bevist. Det er ikke en gengivelse af CV'et. Det er en kritisk vurdering af hvad der er dokumenteret, hvad der er sandsynligt, og hvad der kun er selvfortalt.

Systemet skal skelne eksplicit mellem:

**Dokumenterede fakta**
Roller, perioder, organisationer, uddannelse, certificeringer, licenser. Det der kan verificeres.

**Konkrete eksempler med evidensværdi**
Specifikke situationer, projekter, cases hvor brugeren har demonstreret en kompetence. Disse er stærke fordi de er specifikke og verificerbare i en samtale.

**Ansvar og beslutningsautoritet**
Hvad brugeren faktisk havde mandat til at beslutte, prioritere og gennemføre. Ansvar er ikke det samme som at have udført en opgave. Systemet skal forstå forskellen.

**Resultater og målbare effekter**
Hvad kom der ud af brugerens arbejde. Ikke alle jobs producerer kvantificerbare resultater — men alle jobs producerer effekter. Systemet skal hjælpe med at afdække dem.

**Transferable strengths**
Kompetencer der bærer på tværs af roller, brancher og kontekster. Dette er særligt vigtigt for karriereskiftere og for brugere der undervurderer værdien af deres praktiske erfaring.

**Evidensstyrke mod målniveau**
Systemet skal eksplicit vurdere om brugerens tilgængelige evidens er stærk nok til det profil-niveau de ønsker. En person der søger en lederstilling skal have evidens for ledelse — ikke kun en titel der indeholder "leder". En person der søger et specialist-job skal have evidens for domænedybde. Systemet skal markere tydeligt hvad der er bevist, hvad der er sandsynligt og hvad der er for svagt til at stå alene.

---

### Dimension 3 — Kommunikationsprofil og præsentationsevne

Dette lag er kritisk og underimplementeret i de fleste jobsøgningsværktøjer. Det handler ikke kun om hvad brugeren kan — det handler om hvorvidt brugeren er i stand til at præsentere det overbevisende i den specifikke rekrutteringskontekst de befinder sig i.

**Kommunikationsniveau og ordforråd**
Systemet skal tilpasse sig brugerens naturlige kommunikationsniveau — ikke skrive ned til dem, men møde dem præcis der hvor de er. En direktør med akademisk baggrund og en lagerassistent med folkeskoleuddannelse skal begge opleve at systemet taler til dem på en måde der føles naturlig og respektfuld. Systemet registrerer kommunikationsniveau primært via svar-stil, ordvalg og sætningsstruktur i interviewet — aldrig via eksplicit kategorisering.

**Selvsalgsprofil**
Hvor komfortabel er brugeren med at fremhæve sig selv. Nogle brugere undersælger sig systematisk fordi det føles ubeskeden eller unaturligt. Andre oversælger fordi de er vant til det fra salgsroller. Begge mønstre giver problemer. Systemet skal identificere brugerens naturlige selvsalgskomfort og kompensere intelligent — ikke ændre hvem de er, men formulere det de har opnået på en måde de kan stå inde for.

**Skriftlig versus mundtlig styrke**
Nogle brugere er stærkere skriftligt end mundtligt og omvendt. Systemet kan delvist vurdere dette via interview-svar. Dette er relevant information for samtaleforberedelse.

**Konkret versus abstrakt kommunikationsstil**
Foretrækker brugeren at tale i eksempler og konkrete situationer, eller i principper og overordnede perspektiver. Rekruttører har forskellige præferencer her, og det er vigtigt at matche brugerens naturlige stil med jobbets og organisationens forventede kommunikationsstil.

**Sårbarhedspunkter i rekrutteringskommunikation**
Er der specifikke kommunikationssituationer brugeren sandsynligvis vil kæmpe med. Strukturerede kompetenceinterviews, case-interviews, præsentationsopgaver, small talk og uformelle samtaler med fremtidige kollegaer. Systemet skal identificere disse og adressere dem konkret i samtaleforberedelsen.

---

### Dimension 4 — Rekrutteringsflexibilitet og kontekstforståelse

Dette lag handler om at forstå at rekruttering ikke er ens overalt — og at den samme profil og det samme CV ikke virker på tværs af alle rekrutteringskontekster.

**Rekrutteringslogik-typer**

Systemet skal forstå og kunne tilpasse output til følgende rekrutteringslogikker:

*Mavefornemmelse og kemi*
Rekrutteringen er primært drevet af om ansætteren kan lide og stoler på ansøgeren. Her er autentisk personlig stemme, troværdighed og menneskelig varme vigtigere end formelle kvalifikationer. Ansøgningen og CV'et skal afspejle brugeren som person, ikke kun som fagperson.

*CV og erfaring*
Rekrutteringen er primært drevet af om erfaring og baggrund matcher stillingsbeskrivelsen. Her er klarhed, relevans og direkte match vigtigst. Ingen kreative formuleringer der skjuler gaps — direkte og præcis præsentation af relevant erfaring.

*Dokumenterbare resultater*
Rekrutteringen er primært drevet af hvad ansøgeren har opnået. Her er konkrete tal, cases og målbare effekter afgørende. Systemet skal fremhæve brugerens stærkeste resultat-evidens og undgå generiske ansvarsbeskrivelser.

*Personprofiltest og kulturmatch*
Rekrutteringen inkluderer formelle eller uformelle vurderinger af personlighed og kulturmatch. Her skal systemet hjælpe brugeren med at forstå hvad organisationen sandsynligvis leder efter og om brugerens naturlige profil matcher det — ærligt, ikke strategisk.

*Akademisk og struktureret rekruttering*
Rekrutteringen følger formelle processer med kompetencebaserede interviews, cases eller præsentationsopgaver. Her er struktureret svar-teknik, faglig dybde og evnen til at præsentere klart og præcist afgørende. Systemet skal vurdere om brugeren er forberedt til dette format.

**Organisationskultur-fit**
Udover stillingens krav skal systemet vurdere om brugerens arbejdsstil, værdier og adfærdsmønstre sandsynligvis passer til den type organisation der rekrutterer. En bruger med høj autonomi-præference vil have svært i en hierarkisk organisation selv hvis de er fagligt kvalificerede. Det er relevant information der skal fremgå af jobevalueringen.

---

## Krav til datakvalitet og evidensbevidsthed

Profilen er kun så god som det den bygger på. Systemet skal til enhver tid vide hvad det ved med sikkerhed, hvad det antager med rimelighed, og hvad det ikke ved.

**Tre niveauer af evidens:**

*Stærk evidens*: Direkte bekræftet via konkrete eksempler, dokumenter eller detaljerede svar med specifikke situationer.

*Sandsynlig evidens*: Konsistente mønstre på tværs af svar der peger i samme retning uden at være eksplicit bekræftet.

*Svag evidens eller antagelse*: Systemets inferens baseret på kontekst, stil eller enkeltobservationer. Skal altid markeres internt som usikker og må ikke drive stærke konklusioner alene.

Systemet må aldrig præsentere antagelser som fakta — hverken for brugeren eller i downstream-processer som jobevaluering og CV-generering.

---

## Krav til adaptiv kommunikation

Systemet skal tilpasse sin kommunikation løbende baseret på de signaler det opfanger om brugeren. Dette er ikke en binær kategorisering — det er et kontinuum.

**Kommunikationstilpasning dækker:**

Ordvalg og sætningslængde tilpasset brugerens naturlige sprog.

Mængden af forklaring og kontekst der gives omkring spørgsmål og feedback.

Tonen i feedback — direkte og konkret til brugere der signalerer at de foretrækker det, mere indpakket og konstruktivt til brugere der signalerer sårbarhed eller usikkerhed.

Mængden af ros versus udfordring i profilsvar — systemet skal ikke validere alt, men det skal afkalibrere kritik i forhold til hvad brugeren er klar til at modtage.

Tempoet i interviewet — nogle brugere har brug for mere tid og scaffolding, andre vil hurtigt igennem.

**Regel:**
Tilpasning må aldrig gå på kompromis med ærlighed. Systemet kan pakke svær information ind — men det må ikke skjule den. En bruger der ikke er klar til det job de søger skal vide det, uanset kommunikationsprofil. Metoden tilpasses, budskabet gør ikke.

---

## Krav til profil-output

Den dybe profil skal producere to adskillede output-lag:

**Brugerrettet personlig profil**
Varm, dansk, konkret og nyttig. Skrevet med "du" og "din erfaring". Hjælper brugeren med at forstå sig selv bedre i jobsøgningskontekst. Fremhæver styrker, peger på retning, beskriver arbejdsstil og fit. Undgår teknisk jargon og interne systemtermer.

**Teknisk AI-profil til downstream-brug**
Struktureret og analytisk. Indeholder alle fire dimensioner med eksplicit evidensstyrke-markering. Bruges af jobevalueringsmodulet, CV-generering og ansøgningsgenerering. Må aldrig vises direkte til brugeren i rå form.

---

## Kvalitetskrav før downstream-brug

Profilen er ikke klar til at drive jobevaluering, CV-generering eller ansøgningsgenerering medmindre følgende er opfyldt:

Dimension 1 er dækket med mindst ét konkret signal pr. underpunkt eller eksplicit markeret som usikker.

Dimension 2 har mindst tre konkrete evidens-eksempler eller tilsvarende dokumentation.

Dimension 3 er vurderet tilstrækkeligt til at styre output-tone og kommunikationstilpasning.

Dimension 4 er kortlagt nok til at rekrutteringslogik-tilpasning er mulig.

Evidensstyrke er eksplicit markeret for alle centrale profilpunkter.

Kommunikationsprofil er aktiv og styrer allerede al brugerrettet kommunikation fra systemet.

---

## Anti-patterns — hvad systemet aldrig må gøre

Antage at alle brugere vil have mere ansvar, højere titel eller karriereoprykning.

Behandle lav kommunikationsevne som lav kompetence.

Producere en stærk profil på svagt evidensgrundlag.

Skjule reelle gaps eller svagheder i profileringen.

Bruge standardiserede personlighedskategorier som etiketter på brugeren.

Tilpasse kommunikationen så meget at ærlig feedback fortyndes til ubrugelig positivitet.

Lade brugeren søge job der åbenlyst ikke er realistisk uden at adressere det direkte.

Formulere profilen i generisk AI-sprog der kunne gælde hvem som helst.

---

## Relation til øvrige krav-dokumenter

`PROFILE_ENGINE_REQUIREMENTS.md` definerer den tekniske interview-motor og profileModel-arkitektur.

`interview-engine-v1-definition-of-done.md` definerer hvornår interviewmotoren er færdig nok til produktionsbrug.

`JOB_EVALUATION_REQUIREMENTS.md` definerer hvordan den dybe profil bruges i jobevalueringsmodulet.

`PRODUCT_REQUIREMENTS_V1.md` definerer den overordnede V1-produktramme.

Den dybe profil er fundamentet. Ingen af de øvrige moduler må bygges til produktion før dette fundament lever op til kravene her.
