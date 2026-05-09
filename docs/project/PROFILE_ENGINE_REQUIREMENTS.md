# PROFILE_ENGINE_REQUIREMENTS V2

## Formål og ambition

Dette dokument er den samlede og autoritative kravspecifikation for JobPilots profileringsmotor. Det erstatter og udvider den tidligere version og integrerer kravene fra `DEEP_PROFILE_REQUIREMENTS.md`.

Profileringsmotoren er ikke et onboarding-spørgeskema. Den er JobPilots vigtigste tekniske subsystem — fundamentet som al efterfølgende produktværdi bygger på. Hvis motoren er svag, er alt andet svagt. Hvis motoren er stærk, kan JobPilot levere noget der er svært at sammenligne med andre løsninger på markedet.

Ambitionsniveauet er eksplicit: systemet skal forstå brugeren dybere end de fleste brugere forstår sig selv i arbejdsmæssig sammenhæng. Det er ikke en tom formulering. Det er et konkret krav der betyder at motoren aktivt skal afdække mønstre, styrker og risici som brugeren ikke selv har sat ord på — og gøre det på en måde der føles som hjælp, ikke som vurdering.

---

## De fem profildimensioner

Profilen består af fem dimensioner der tilsammen giver en 360-graders forståelse af brugeren. Dimensionerne er ikke uafhængige — de påvirker og validerer hinanden, og motoren skal behandle dem som et samlet billede, ikke som separate spørgeskemakategorier.

---

### Dimension 1 — Faglig profil og evidensstyrke

Dette lag handler om hvad brugeren faktisk kan og har bevist. Det er ikke en gengivelse af CV'et. Det er en kritisk vurdering af hvad der er dokumenteret, hvad der er sandsynligt, og hvad der kun er selvfortalt.

**Hvad motoren skal afdække:**

Dokumenterede fakta: roller, perioder, organisationer, uddannelse, certificeringer og licenser.

Konkrete eksempler med evidensværdi: specifikke situationer, projekter og cases hvor brugeren har demonstreret en kompetence. Disse er stærke fordi de er specifikke og verificerbare i en samtale.

Ansvar og beslutningsautoritet: hvad brugeren faktisk havde mandat til at beslutte, prioritere og gennemføre. Ansvar er ikke det samme som at have udført en opgave.

Resultater og effekter: hvad kom der ud af brugerens arbejde. Ikke alle jobs producerer kvantificerbare resultater — men alle jobs producerer effekter. Motoren skal hjælpe med at afdække dem selv når brugeren ikke spontant nævner dem.

Transferable strengths: kompetencer der bærer på tværs af roller, brancher og kontekster. Særligt vigtigt for karriereskiftere og for brugere der undervurderer værdien af deres praktiske erfaring.

Evidensstyrke mod målniveau: eksplicit vurdering af om brugerens tilgængelige evidens er stærk nok til det profil-niveau de ønsker. En person der søger en lederstilling skal have evidens for ledelse — ikke kun en titel der indeholder "leder".

**Skelnen motoren altid skal opretholde:**

Bruger-claim: hvad brugeren siger om sig selv — vigtigt input, ikke bevis.

Faktuel information: verificerbar baggrund.

Konkret eksempel: specifik situation med indhold.

Ansvar: hvad brugeren havde mandat over.

Beslutningsautoritet: hvad brugeren kunne beslutte selvstændigt.

Resultat: hvilken effekt der kom ud af arbejdet.

Målbart resultat: resultat med tal, ændring eller tydelig indikator.

Mønster: signal der går igen på tværs af svar og dokumenter.

Uunderbygget antagelse: systemets tolkning uden tilstrækkelig evidens — skal altid markeres.

Usikkerhed: kendt uklarhed som ikke må skjules.

---

### Dimension 2 — Personprofil og adfærdsmønster

Dette lag handler om hvem brugeren er som person i arbejdssammenhæng. Ikke personlighed som abstrakt begreb, men konkrete adfærds- og motivationsmønstre der er direkte relevante for jobvalg, jobperformance og rekrutteringssucces.

Systemet bygger sit eget profil-lag inspireret af anerkendte modeller som DISC, Big Five og Hogan — men designet specifikt til jobsøgningskontekst og til at fungere uden at brugeren tager en formel test. Systemet kategoriserer aldrig brugeren med etiketter — det beskriver mønstre og hvad de betyder i praksis.

**Hvad motoren skal afdække:**

Energi og motivation: hvad giver brugeren energi i arbejdslivet, hvad dræner dem, hvad de aktivt søger mere af, og hvad de vil væk fra. Kritisk: forskellen på hvad de siger de vil have og hvad der rent faktisk motiverer dem baseret på deres faktiske arbejdshistorie.

Adfærd under pres og i konfliktsituationer: trækker brugeren sig, går de i offensiv, søger de konsensus, ignorerer de konflikten, eller eskalerer de konstruktivt. Dette er kritisk for job der kræver ledelse, kundeservice, projektarbejde eller selvstændig drift under usikkerhed.

Naturlig rolle i grupper og teams: igangsætter, gennemfører, kvalitetssikrer, koordinator, kreativ, støtte, eller en kombination. Disse roller er ikke hierarkisk rangordnede — alle er vigtige, og et mismatch mellem brugerens naturlige rolle og jobbets krav er en reel risikofaktor.

Beslutningsstil: analytisk og datadrevet, intuitiv og erfaringsbaseret, konsensussøgende, hurtig og handleorienteret. Beslutningsstil er ikke god eller dårlig — men den skal matche jobbet og organisationskulturen.

Selvbillede versus sandsynligt omverdensbillede: motoren skal identificere mønstre hvor brugerens selvopfattelse sandsynligvis afviger fra hvordan andre oplever dem. En bruger der systematisk undervurderer sin ledelseserfaring fordi de "bare koordinerede" er et eksempel. En bruger der overvurderer sin strategiske rolle fordi de var til stede ved strategimøder er et andet. Dette adresseres konstruktivt — aldrig som kritik.

Ambitionsprofil: vil brugeren op, ud til siden, ned i tempo, eller blive hvor de er med bedre vilkår. Systemet antager aldrig at alle vil have mere ansvar eller højere titel. Det forstår den specifikke brugers reelle ambitionsprofil og respekterer den fuldt ud.

---

### Dimension 3 — Kommunikationsprofil og præsentationsevne

Dette lag er kritisk og underimplementeret i næsten alle jobsøgningsværktøjer. Det handler ikke kun om hvad brugeren kan — det handler om hvorvidt brugeren er i stand til at præsentere det overbevisende i den specifikke rekrutteringskontekst de befinder sig i.

**Hvad motoren skal afdække:**

Kommunikationsniveau og naturligt sprog: systemet tilpasser sig brugerens naturlige kommunikationsniveau løbende i selve interviewet — ikke som en kategorisering, men som en levende tilpasning baseret på ordvalg, sætningsstruktur og svar-stil. En direktør med akademisk baggrund og en lagerassistent med folkeskoleuddannelse skal begge opleve at systemet taler til dem på en måde der føles naturlig og respektfuld.

Selvsalgsprofil: hvor komfortabel er brugeren med at fremhæve sig selv. Systematisk undersalg er ligeså problematisk som oversalg. Motoren identificerer brugerens naturlige selvsalgskomfort og kompenserer intelligent i downstream-output — formulerer det brugeren har opnået på en måde de kan stå inde for.

Konkret versus abstrakt kommunikationsstil: foretrækker brugeren at tale i eksempler og konkrete situationer, eller i principper og overordnede perspektiver. Dette er relevant for at matche brugerens naturlige stil med jobbets og organisationens forventede kommunikationsstil.

Sårbarhedspunkter i rekrutteringskommunikation: er der specifikke kommunikationssituationer brugeren sandsynligvis vil kæmpe med. Strukturerede kompetenceinterviews, case-interviews, præsentationsopgaver, small talk og uformelle samtaler. Systemet identificerer disse og adresserer dem konkret.

Troværdighedsvurdering i samtaleformat: systemet vurderer ikke bare om brugeren kan udføre jobbet — men om de vil fremstå troværdige når de taler om det i en samtale. En person der er vant til at sige "vi gjorde" i stedet for "jeg gjorde" vil fremstå svag i en individuel kompetencesamtale selv hvis de var den drivende kraft. Dette fanges og adresseres konkret i samtaleforberedelsen.

Sprog-normalisering: "vi" versus "jeg" i beskrivelse af egne bidrag, tendens til at minimere eget bidrag, tendens til at overdrive, brug af fagsprog der enten inkluderer eller ekskluderer rekruttøren. Alle disse mønstre har konkrete konsekvenser for rekrutteringssucces og skal adresseres.

---

### Dimension 4 — Livsstil, privatliv og arbejdsliv-balance

Dette er en selvstændig og ofte overset profildimension. Det handler ikke om work-life balance som begreb — det handler om det reelle match mellem brugerens liv uden for arbejdet og det arbejdsliv jobbet faktisk kræver i praksis.

Jobopslag beskriver sjældent de reelle forventninger til tilgængelighed, tempo, rejseaktivitet og intensitet præcist. Systemet skal vurdere hvad der realistisk kræves baseret på stillingsniveau, branche og organisationstype — og matche det mod brugerens faktiske livssituation og præferencer.

**Hvad motoren skal afdække:**

Livssituation og reelle rammer: familiestatus, omsorgsansvar, geografiske begrænsninger, sundhedsmæssige forhold der er relevante for arbejdskapacitet, og andre faktorer der reelt sætter rammer for arbejdslivet. Dette afdækkes med respekt og kun i det omfang brugeren vælger at dele det.

Ønsket arbejdsintensitet og tempo: foretrækker brugeren et roligt og forudsigeligt tempo, et moderat og varieret arbejdsliv, eller et højt tempo med meget variation og krav. Ingen af disse er bedre end de andre — men mismatch mellem brugerens ønskede intensitet og jobbets reelle krav er en af de hyppigste årsager til at mennesker mistrives i jobs de fagligt er kvalificerede til.

Fleksibilitetspræferencer og behov: hvornår, hvor og hvordan brugeren ønsker at arbejde. Fast arbejdstid versus fleksibel tilrettelæggelse, hjemmearbejde versus kontor, fast placering versus rejseaktivitet. Og hvad der er hårde krav versus hvad der er præferencer der kan justeres.

Organisationskultur og arbejdsliv-forventninger: systemet vurderer hvilke forventninger den type organisation sandsynligvis har til medarbejdernes tilgængelighed og engagement uden for arbejdstiden — svarende emails om aftenen, deltagelse i sociale arrangementer, rejseaktivitet, overarbejde i projektperioder. Dette varierer markant mellem brancher, organisationsstørrelser og kulturer, og det er ikke altid hvad der fremgår af jobopslaget.

Energibalance og bæredygtighed over tid: hvad er brugerens historiske mønster omkring arbejdsbyrde. Har de tendens til at overbelaste sig selv, til at underpræstere i kaotiske miljøer, til at trives under højt pres eller til at have brug for forudsigelighed for at præstere godt. Et job der er fagligt perfekt men energimæssigt uholdbart er ikke et godt match.

Karrierefase og livsfase-match: et job der er perfekt i én livsfase kan være forkert i en anden. En person med små børn har andre reelle rammer end den samme person ti år tidligere. Systemet skal forstå livsfasen og bruge den aktivt i jobevalueringen.

**Vigtigt princip:**
Livsstils-dimensionen bruges til at hjælpe brugeren med at finde job de reelt vil trives i — ikke til at begrænse deres muligheder. Systemet advarer om potentielle mismatch, men brugeren bestemmer altid selv.

---

### Dimension 5 — Rekrutteringsflexibilitet og kontekstforståelse

Dette lag handler om at forstå at rekruttering ikke er ens overalt — og at den samme profil og det samme CV ikke virker på tværs af alle rekrutteringskontekster.

**Rekrutteringslogik-typer motoren skal forstå:**

Mavefornemmelse og kemi: rekrutteringen er primært drevet af om ansætteren kan lide og stoler på ansøgeren. Autentisk personlig stemme, troværdighed og menneskelig varme er vigtigere end formelle kvalifikationer. Output skal afspejle brugeren som person, ikke kun som fagperson.

CV og erfaring: rekrutteringen er primært drevet af om erfaring og baggrund matcher stillingsbeskrivelsen. Klarhed, relevans og direkte match er vigtigst. Direkte og præcis præsentation af relevant erfaring uden kreative omformuleringer der skjuler gaps.

Dokumenterbare resultater: rekrutteringen er primært drevet af hvad ansøgeren har opnået. Konkrete tal, cases og målbare effekter er afgørende. Stærkeste resultat-evidens fremhæves og generiske ansvarsbeskrivelser undgås.

Personprofiltest og kulturmatch: rekrutteringen inkluderer formelle eller uformelle vurderinger af personlighed og kulturmatch. Systemet hjælper brugeren med at forstå hvad organisationen sandsynligvis leder efter og om brugerens naturlige profil matcher det — ærligt, ikke strategisk.

Akademisk og struktureret rekruttering: rekrutteringen følger formelle processer med kompetencebaserede interviews, cases eller præsentationsopgaver. Struktureret svar-teknik, faglig dybde og evnen til at præsentere klart og præcist er afgørende.

Organisationskultur-fit: udover stillingens krav vurderer systemet om brugerens arbejdsstil, værdier og adfærdsmønstre sandsynligvis passer til den type organisation. En bruger med høj autonomi-præference vil have svært i en hierarkisk organisation selv hvis de er fagligt kvalificerede.

---

## De tre ekstra profileringskapaciteter

Udover de fem dimensioner skal motoren have tre specifikke kapaciteter der løfter profileringen fra god til exceptionel.

---

### Kapacitet A — Styrkeblinde pletter

Motoren skal aktivt lede efter kompetencer brugeren ikke selv nævner men som fremgår implicit af deres svar.

En lagerassistent der beskriver at hun altid er den der oplærer nye kollegaer har en underanerkendt pædagogisk og koordinerende styrke. En tekniker der beskriver at han altid er den kollegaerne spørger til råds har en uformel ekspertrolle der er mere værdifuld end hans titel antyder. En administrativ medarbejder der beskriver at hun selv har optimeret processer der tidligere var manuelle har en initiativtagende og løsningsorienteret profil der rækker langt ud over jobkategorien.

Systemet skal fange disse mønstre, spejle dem tilbage til brugeren, og bruge dem aktivt i positionering. Det er ofte disse usynlige styrker der åbner jobmuligheder brugeren ikke selv havde overvejet — og det er her JobPilot kan gøre en fundamental forskel for brugere der aldrig har lært at sætte ord på deres egen værdi.

---

### Kapacitet B — Energikort over arbejdslivet

Udover hvad brugeren kan skal systemet forstå hvornår og under hvilke betingelser de er på deres bedste.

Nogle mennesker præsterer bedst i krisesituationer og højtryk. Andre i stabil drift og forudsigelig struktur. Nogle trives med mange bolde i luften og konstant variation. Andre med dyb fokus på ét problem over lang tid. Nogle får energi fra mennesker og sociale interaktioner. Andre fra selvstændigt arbejde og koncentration.

Dette energikort er afgørende for at anbefale job der ikke bare matcher kompetencer men også giver brugeren en god arbejdsdag år efter år. En fagligt perfekt match der energimæssigt er forkert er ikke et godt match — det er en risiko for mistrivsel, nedsat præstation og til sidst endnu et jobskifte.

Energikortet opbygges primært via mønstre i brugerens beskrivelser af hvornår de har haft det godt på arbejde, hvornår de har kæmpet, og hvad der kendetegner de bedste perioder i deres arbejdsliv.

---

### Kapacitet C — Troværdighedsvurdering og samtalereadiness

Systemet skal vurdere ikke bare om brugeren kan udføre jobbet — men om de vil fremstå troværdige og kompetente i den specifikke rekrutteringsproces der sandsynligvis venter dem.

Det er to fundamentalt forskellige spørgsmål. En person der er fuldt ud kvalificeret kan fejle i rekrutteringen fordi de kommunikerer forkert i den givne kontekst. En person der er marginalt kvalificeret kan lykkes fordi de kommunikerer stærkt og autentisk på en måde der matcher det rekruttøren leder efter.

Systemet skal for hvert konkret job vurdere:

Om brugerens naturlige kommunikationsstil matcher det format rekrutteringsprocessen sandsynligvis bruger.

Om brugeren kan fortælle om sine resultater og erfaringer på en måde der lyder troværdig — ikke overspillet, ikke underspillet.

Hvilke specifikke spørgsmål der sandsynligvis vil komme og om brugeren reelt kan besvare dem overbevisende.

Hvad der skal forberedes konkret for at øge troværdighed og gennemslagskraft i samtalen.

---

## Adaptiv kommunikation i selve interviewet

Motoren skal tilpasse sin egen kommunikation løbende baseret på de signaler den opfanger om brugeren. Dette er ikke en kategorisering der sker én gang — det er en levende tilpasning gennem hele interviewet.

**Hvad tilpasningen dækker:**

Ordvalg og sætningslængde tilpasset brugerens naturlige sprog. Mængden af forklaring og kontekst der gives. Tonen i spørgsmål og feedback — direkte og konkret til brugere der signalerer det, mere understøttende og konstruktivt til brugere der signalerer sårbarhed eller usikkerhed. Mængden af scaffolding og hjælp til at formulere svar. Tempoet i interviewet.

**Ufravigelig regel:**
Tilpasning må aldrig gå på kompromis med ærlighed. Systemet kan pakke svær information ind — men det må ikke skjule den. En bruger der ikke er klar til det job de søger skal vide det uanset kommunikationsprofil. Metoden tilpasses. Budskabet gør ikke.

---

## Krav til interviewadfærd

Ét spørgsmål ad gangen uden undtagelse.

Ingen multi-spørgsmålsblokke.

Ingen generisk motivationsskema-adfærd.

Ingen loops i samme semantiske familie.

Spørgsmål skal have en tydelig profileringsformål — ikke stilles for at fylde tid eller opnå kunstig completeness.

Motoren skal spørge ind til adfærd og konkrete situationer, ikke til selvvurderinger og holdninger alene. "Hvad skete der da..." er stærkere end "er du god til...".

Motoren skal lede efter styrker brugeren ikke selv nævner ved at følge op på antydninger og mønstre i svarene.

Motoren skal udfordre urealistiske mål roligt, praktisk og uden nedladning.

Motoren skal complete med eksplicit usikkerhed frem for falsk sikkerhed eller unødvendig fortsættelse.

---

## Lav-klarhedsbrugere og sprogtilpasning

Motoren skal være særligt stærk for brugere der svarer kort, usikkert eller uklart — og for brugere der ikke har et veludviklet professionelt sprog om sig selv og deres arbejde.

Lav klarhed i svar må aldrig tolkes som lav kompetence.

Upræcise eller praktiske svar må aldrig nedprioriteres i forhold til velartikulerede selvpræsentationer.

Motoren skal hjælpe med at afdække profilen gennem bedre og mere konkrete spørgsmål — ikke straffe brugeren med en svag profil fordi de ikke kan sælge sig selv.

For brugere der ikke spontant nævner resultater og ansvar skal motoren stille specifikke opfølgningsspørgsmål der hjælper dem med at formulere det.

---

## Krav til profile model output

Den færdige profil skal indeholde to adskillede output-lag.

**Brugerrettet personlig profil:**
Varm, dansk, konkret og nyttig. Skrevet med "du" og "din erfaring". Hjælper brugeren med at forstå sig selv bedre i jobsøgningskontekst. Fremhæver styrker, peger på retning, beskriver arbejdsstil og fit. Undgår teknisk jargon og interne systemtermer. Formulerer eventuelle gaps som noget der kan gøres skarpere — ikke som personlige mangler.

**Teknisk AI-profil til downstream-brug:**
Struktureret og analytisk. Indeholder alle fem dimensioner med eksplicit evidensstyrke-markering. Indeholder energikort, kommunikationsprofil, livsstilsfit og rekrutteringslogik-vurdering. Bruges af jobevalueringsmodulet, CV-generering og ansøgningsgenerering. Må aldrig vises direkte til brugeren i rå form.

**Minimumsdækning i teknisk profil:**
Faktuel profil og current work reality. Senioritet og niveau. Ansvar og ejerskab med evidensstyrke. Transferable strengths med evidensgrundlag. Retning og intention. Transition realism. Adfærdsmønstre og naturlig rolle. Energikort og arbejdsbetingelsespræferencer. Kommunikationsprofil og selvsalgsstil. Livsstilsfit og reelle rammer. Rekrutteringslogik-profil. Styrkeblinde pletter identificeret. Samtalereadiness vurderet. Usikkerhed og confidence eksplicit markeret. Profile gaps som tekniske signaler.

---

## Completion-gates

Motoren kan complete når der er nok til en brugbar profilbase på tværs af alle fem dimensioner. Ikke når alt er perfekt.

Minimum før completion:
Dimension 1: current work reality, niveau, mindst to konkrete evidens-eksempler.
Dimension 2: ambitionsprofil og retning, mindst ét adfærdsmønster identificeret.
Dimension 3: kommunikationsniveau vurderet, selvsalgsprofil identificeret.
Dimension 4: reelle livsstilsrammer kortlagt i det omfang brugeren har delt dem.
Dimension 5: rekrutteringslogik-profil mulig baseret på tilgængelig information.

Hvis noget stadig er usikkert: complete med eksplicit usikkerhed — ikke loop for at opnå kunstig sikkerhed.

---

## Anti-patterns — hvad motoren aldrig må gøre

Antage at alle brugere vil have mere ansvar, højere titel eller karriereoprykning.

Behandle lav kommunikationsevne som lav kompetence.

Producere en stærk profil på svagt evidensgrundlag.

Skjule reelle gaps eller svagheder i profileringen.

Bruge standardiserede personlighedskategorier som etiketter på brugeren.

Tilpasse kommunikationen så meget at ærlig feedback fortyndes til ubrugelig positivitet.

Lade brugeren søge job der åbenlyst ikke er realistisk uden at adressere det direkte.

Formulere profilen i generisk AI-sprog der kunne gælde hvem som helst.

Ignorere livsstils- og livsfase-faktorer i jobevalueringen.

Overse uudtalte styrker fordi brugeren ikke selv har nævnt dem.

Vurdere samtalereadiness uden at tage rekrutteringslogikken i betragtning.

---

## Segment-robusthed

Motoren skal fungere på tværs af alle brugertyper uden at favorisere dem der er gode til at beskrive sig selv.

Executives og direktører. Mellemledere. Specialister og eksperter. Projekt-, produkt- og operations-profiler. Admin, finans og support. Håndværk og faglærte. Lager, logistik og produktion. Healthcare og omsorg. Salg og kundevendte roller. Ledige brugere. Uklar-retning brugere. Karriereskiftere. Brugere med begrænset professionelt selvsprog. Brugere i særlige livssituationer.

---

## Quality gates før V1-produktion

Interviewkvalitet: ét spørgsmål ad gangen overholdt konsekvent. Ingen systematiske semantiske loops. Ingen intention violations. Adaptiv kommunikation aktivt i brug.

Profildimension-dækning: alle fem dimensioner dækket eller eksplicit markeret som usikre. Styrkeblinde pletter identificeret i mindst to testscenarier. Energikort produceret på mindst tre brugertyper.

Kommunikationstilpasning: systemet kommunikerer målbart forskelligt til brugere med forskellige kommunikationsprofiler. Ingen generisk systemtone uanset brugertype.

Livsstilsfit: reelle livsstilsrammer indgår i jobevalueringen. Mismatch identificeres og adresseres.

Downstream-kvalitet: profilen er brugbar til jobevaluering med de fire evalueringssvar. Profilen er brugbar til CV-generering uden generisk AI-sprog. Profilen er brugbar til ansøgningsgenerering med troværdig motivation og individuel tone.

---

## Relation til øvrige dokumenter

`DEEP_PROFILE_REQUIREMENTS.md` definerer de fire profildimensioner dette dokument implementerer.

`JOB_EVALUATION_REQUIREMENTS.md` definerer hvordan profilen bruges i jobevalueringsmodulet.

`interview-engine-v1-definition-of-done.md` definerer hvornår interviewmotoren er færdig nok til produktionsbrug.

`PRODUCT_REQUIREMENTS_V1.md` definerer den overordnede V1-produktramme.

Dette dokument er fundamentet. Ingen downstream-moduler bygges til produktion før profileringsmotoren lever op til kravene her.
