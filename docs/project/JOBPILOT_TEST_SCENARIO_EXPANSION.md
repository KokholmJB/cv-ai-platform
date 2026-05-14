# JobPilot — Test Scenario Expansion Analysis

**Scope:** Analyse af test-gap + design af 15 nye scenarier + 3 autenticitetstest-scenarier
**Status:** Klar til Projektstyring-beslutning
**Ingen kodeændringer foretaget**

---

# DEL 1 — Hvad tester vi ikke i dag?

## Udgangspunkt: hvad de 14 scenarier dækker

De 14 eksisterende scenarier (10 i scenarios.ts + 4 nye fra P2.1) dækker primært **roller, direction types og intention violations**. De er bygget til at fange den ene vigtige fejl: at motoren presser brugeren mod ledelse, promotion, mere ansvar eller karriereskift mod deres vilje.

Det er stærkt. Men det er én akse. Brugere varierer på langt flere akser end retning.

Når jeg gennemgår scriptedAnswers i scenarios.ts, ser jeg et tydeligt mønster:

- Alle personas er **artikulerede og konsistente**. De svarer i hele sætninger. De modsiger ikke sig selv. De er afklarede om hvad de vil eller eksplicit usikre på en behersket måde.
- Alle personas svarer **proportionalt** — de tilpasser svarlængden til spørgsmålet på en rimelig måde.
- Alle personas er **emotionelt stabile**. Ingen er euforiske, deprimerede, defensive eller frustrerede.
- Alle personas har **rimelig selvindsigt**. Ingen oversælger groft. Ingen undersælger groft.
- Alle personas er **ærlige**. Ingen lyver. Ingen overdriver. Ingen forsøger at imponere.
- Alle personas har **neutral relation til arbejdet**. Ingen brænder for noget. Ingen er kyniske. Ingen er bittert udbrændte.
- Alle personas svarer **on-topic**. Ingen afsporer.

Det betyder vi tester en meget smal del af det menneskelige spektrum — den behageligt artikulerede dansker der svarer pænt på spørgsmål. Det er ikke 100 tilfældigt udvalgte mennesker. Det er 100 versioner af samme mennesketype med forskellige rolle-labels.

## Adfærdsmønstre der ikke testes

**Ekstrem ordknaphed.** Ingen scenarier hvor brugeren svarer "ja", "nej", "ved ikke" på spørgsmål der inviterer til uddybning. low-clarity-generated-regression har "short style" men det er stadig flere ord end ekstrem ordknaphed. Det fanger ikke om motoren kan håndtere én-ords-svar.

**Ekstrem ordrigdom.** Ingen scenarier hvor brugeren svarer i lange monologer (200-500+ ord) hvor det relevante er begravet i kontekst. Det er en reel brugertype — særligt erfarne fagfolk eller folk der er nervøse for at undersælge sig.

**Selvmodsigelse.** Ingen scenarier hvor brugeren siger noget i ét svar og det modsatte senere. Det skulle trigge credibilitySignals, men det testes ikke. credibilitySignals er implementeret blindt.

**Defensiv adfærd.** Ingen scenarier hvor brugeren svarer ved siden af spørgsmålet, deflekterer eller bliver vag på specifikke områder (typisk ansvar, fejl, mellemledelse).

**Eufori / oversalg.** Ingen scenarier hvor brugeren beskriver sig selv overdrevent positivt med vage superlativer ("jeg er fantastisk til alt", "alle mine projekter har været succeser").

**Negativitet / underbalance.** Ingen scenarier hvor brugeren beskriver sig selv overdrevent negativt eller med kynisk distance ("jeg har ikke rigtig opnået noget", "det var sådan set bare hvad jeg blev sat til").

**Bekræftelsessøgning.** Ingen scenarier hvor brugeren spørger motoren om hvad de skal sige, eller vil have bekræftelse på at deres svar er "rigtige".

**Stress og frustration.** Ingen scenarier hvor brugeren udtrykker frustration med selve interviewet eller med deres jobsituation på en måde der påvirker svarkvaliteten.

**Vi-sprog konsekvent.** low-clarity har en "vague style" men ingen scenarier hvor brugeren systematisk bruger "vi" om eget arbejde og dermed udvisker eget bidrag. Det er kritisk for credibilitySignals og communicationProfile.

**Imponer-mode.** Ingen scenarier hvor brugeren bruger fagsprog, buzzwords eller management-speak for at virke kompetent uden konkret indhold bag.

## Værdiprofiler der ikke testes

Det her er det største enkelte hul. **Ingen** af de 14 scenarier indeholder eksplicit værdimæssige eller passion-baserede signaler. Det betyder autenticitetsprofilen ikke kan valideres meningsfuldt — der er intet at fange.

Specifikt mangler:

**Stærk passion.** En person der brænder for et fagligt område, et samfundsproblem, en bestemt type arbejde. Den slags hvor sproget bliver mere levende når emnet kommer op.

**Etisk drivkraft.** En person hvis valg styres af værdier — vil ikke arbejde for visse brancher, vil arbejde med bæredygtighed, vil have meningsfuldt arbejde.

**Penge-pragmatisme.** En person der eksplicit prioriterer løn og vilkår over indhold. Det er en reel og legitim drivkraft som motoren skal kunne håndtere uden at moralisere.

**Familie-prioritet.** En person hvis valg styres af familielogistik. Børn, ægtefælles karriere, plejekrav, geografisk binding. Det berører dimension 4 men findes ikke som primær driver i scenarierne.

**Frihed og autonomi.** En person der prioriterer at undgå mikrostyring, kunne disponere selv, arbejde uafhængigt. Det kan være freelance-orienteret, men det er bredere end det.

**Stabilitet og forudsigelighed.** En person der eksplicit prioriterer ro og struktur over udvikling og udfordring.

**Læring og udvikling.** En person der prioriterer at lære nyt over at konsolidere ekspertise.

**Service og hjælp.** En person hvis drivkraft er at hjælpe andre konkret — pleje, support, undervisning.

## Komplekse kombinationer der ikke testes

De 14 scenarier er primært "ren type" — én rolle, én retning, én klart defineret profil. Rigtige mennesker er sammensatte.

Mangler:

**Bag-ud-orienteret skifter.** Direktøren der vil starte forfra som håndværker. SOSU-assistenten der vil studere medicin. Sælgeren der vil arbejde med psykologi. Det er retningsskift der går imod den implicitte "op-eller-sidelæns"-antagelse.

**Hyperspecialist der vil væk fra specialisering.** Person med dyb teknisk dybde der vil tilbage til generalist-rolle eller helt skifte felt.

**Generalist der vil specialisere.** Det modsatte — bred erfaring, vil bygge dyb ekspertise på ét område.

**Akademiker der vil arbejde praktisk.** Forsker der vil ud i privat virksomhed. Konsulent der vil ind i drift.

**Praktiker der vil arbejde akademisk.** Person med 20 års praksis der overvejer at undervise, forske eller skifte til vidensarbejde.

**Iværksætter-drøm bag etableret karriere.** Person med stabil karriere der overvejer at starte egen virksomhed — men er usikker.

**Klinisk professionel der vil ud af patient-kontakt.** Sygeplejerske, fysioterapeut, læge der vil arbejde med uddannelse, administration eller produktudvikling i sundhedssektoren.

**Tidligere selvstændig der vil tilbage til ansættelse.** Iværksætter der vil have stabilitet — men har vænnet sig til autonomi.

## Yderkantscenarier der ikke testes

**Total uklarhed.** Vi har unclear-direction-user, men hun har stadig signaler. Det her er brugere der reelt ikke har en idé. "Jeg ved ikke, jeg har bare brug for et job."

**Ekstrem afklarethed.** Det modsatte — brugere der ved præcis hvad de vil, hvorfor, hvordan, og hvor mange penge de skal have for det. Motoren risikerer at overstille spørgsmål de allerede har svar på.

**Modsigelse mellem ord og signal.** Brugere der siger de er fleksible men beskriver kun rigide rammer. Brugere der siger de er teamspillere men beskriver kun solo-arbejde.

**Imposter-syndrom.** Højt kvalificerede brugere der konsekvent undervurderer sig selv. evidens-profilen er stærk, men selvbeskrivelsen er svag.

**Dunning-Kruger.** Det modsatte. Begrænset evidens men stærk selvbeskrivelse.

**Burnout-spor.** Brugere hvis energi og motivation er drænet af deres nuværende job. Det berører energyConditions stærkt.

**Karriere-paradoks.** Brugere der har høj titel men lavt mandat — eller omvendt. Det kræver at motoren skelner mellem formel rolle og reel autoritet.

## Autenticitetsscenarier der ikke testes

Som nævnt: ingen. Det er det vigtigste enkelt-hul.

Specifikt for authenticityProfile-validering kræves:

**passionIndicators.** Brugere der vender tilbage til samme emne uden at det spørges om. Brugere hvis svar bliver længere og mere detaljerede når et bestemt emne kommer op. Brugere der bruger sprog med mere energi om visse opgaver.

**valueAnchors.** Brugere der eksplicit prioriterer noget over noget andet ("jeg ville hellere have mindre løn end..."). Brugere der forsvarer en holdning når de bliver udfordret. Brugere der har grænser for hvad de vil arbejde med.

**naturalVoiceMarkers.** Brugere med distinkt sprog — slang, fagjargon, regionale udtryk, kreative formuleringer. Ikke poleret CV-sprog. Det er essentielt for at Lag 4 i den nye arkitektur kan formulere profilen i brugerens egen stemme.

## Kulturelle og sproglige variationer der mangler

**Regionalt dansk.** Jysk, fynsk, sønderjysk, bornholmsk markører. De er ikke vigtige for testning af motorlogik direkte, men de er vigtige for kommunikationsstil-detection.

**Indvandrer-dansk.** Brugere med dansk som andetsprog. Det er en stor og voksende del af det danske arbejdsmarked. Sprogniveauet er ofte tilstrækkeligt til arbejde men ikke til poleret selvpræsentation. Det er præcis den situation hvor "lav klarhed ikke må tolkes som lav kompetence" rammer hårdest.

**Akademisk dansk.** Brugere med akademisk baggrund hvis naturlige sprog er nuanceret, lange sætninger, formelle konstruktioner. Motoren skal kunne håndtere det uden at klassificere det som "executive" eller "elitært".

**Praktisk dansk.** Brugere hvis naturlige sprog er konkret, kort, jordnært. Det skal ikke klassificeres som "low education".

**Generationelt dansk.** Yngre brugere (under 25) bruger andre formuleringer end ældre. Det er ikke testet.

## Sammenfattende vurdering

De 14 scenarier dækker **retning og rolle** robust. De dækker stort set ikke **person, værdi, autenticitet, ekstremer eller kombinationer**.

Det betyder motoren kan være grøn på alle 14 scenarier og samtidig levere generisk, koldt output for rigtige mennesker — fordi rigtige mennesker har værdier, passion, sproglige særpræg og indre modsigelser som testene ikke producerer.

Det her er ikke en mindre justering. Det er en udvidelse af test-grundlaget med en ny akse: **personlighed, autenticitet og menneskelig variation** ud over rolle.

---

# DEL 2 — Design af 15 nye testscenarier

Format følger scenarios.ts-strukturen. Hver scenario er klar til implementation efter Projektstyring-godkendelse.

## Gruppe A — Yderkantsscenarier (4 scenarier)

### A1: extreme-laconic-warehouse

**Persona:** Bjørn, 52, lagerarbejder i samme firma i 22 år. Tale-knap mand. Bedst beskrevet som ordret korrekt men aldrig udførlig. Søger samme rolle med bedre vilkår — primært flere penge og kortere transport.

**Hvad simulationen skal gøre:**
Svarer i 1-5 ord på langt de fleste spørgsmål. "Ja." "Det går." "Plukker varer." "Tjekker tal." Skal under pres for at uddybe give marginalt mere — aldrig fri prosa. Bruger ikke fagsprog, bruger ikke superlativer, bruger ikke modale verber ("kunne", "ville", "burde").

**Forventede intentionsregler (do not assume):**
- Motoren må ikke tolke ordknaphed som lav kompetence
- Motoren må ikke fortsætte med at presse for uddybning når brugeren har svaret
- Motoren må ikke antage at brugeren mangler indsigt
- Motoren må ikke foreslå karriereskift

**Forventede koncepter der skal matches:** lager, samme rolle, vilkår, transport, stabilitet

**Forventede completionAnalysis-felter:**
- `communicationProfile.answerStyle`: "concise" eller "minimal"
- `communicationProfile.evidenceDensity`: ikke "low" pga. korte svar — skal være "implicit_in_history" eller tilsvarende der respekterer at brugeren har 22 års konsistens
- `behaviorProfile.ambitionsProfil`: "same_track_better_conditions"
- `interviewReadiness`: skal markere lav verbal selvsalgsevne som sårbarhedspunkt — men ikke som svaghed
- `evidenceProfile`: skal respektere at lang erfaring i samme rolle er stærk evidens selv uden verbose beskrivelse

**Hvad gør scenariet unikt:**
Tester at motoren ikke forveksler ordknaphed med lavt indhold. Tester at completion kan ske selv når svarene er minimale. Tester at communicationProfile fanger den her stil korrekt uden at klassificere brugeren ned.

---

### A2: extreme-verbose-mid-career

**Persona:** Charlotte, 41, kontorchef i offentlig forvaltning. Skriver lange svar. Inkluderer altid kontekst, baggrund, undtagelser og nuancer. Vil gerne være præcis, men gemmer ofte det vigtige i 200+ ord. Søger lignende rolle i privat sektor.

**Hvad simulationen skal gøre:**
Svarer i 150-400 ord pr. spørgsmål. Starter ofte med "Det kommer an på...". Inkluderer eksempler, modeksempler, kontekst om kollegaer og processer. Det relevante er der men begravet. Bruger formuleringer som "i grunden", "for så vidt", "på den ene side". Selvkorrigerer ofte i samme svar.

**Forventede intentionsregler:**
- Motoren må ikke afbryde eller signalere utålmodighed
- Motoren må ikke antage at verbose svar betyder uklarhed
- Motoren må ikke loope fordi den ikke fandt et koncept i et kort svar

**Forventede koncepter:** kontorchef, forvaltning, privat sektor, processer, ledelse (faglig)

**Forventede completionAnalysis-felter:**
- `communicationProfile.answerStyle`: "elaborative" eller "verbose"
- `communicationProfile.structureLevel`: "high" — strukturen er der, den er bare lang
- `communicationProfile.abstractionPreference`: "balanced_with_caveats"
- `behaviorProfile.beslutningsstil`: "deliberative" eller "consensus_seeking"
- `interviewReadiness`: skal markere at brugeren vil have brug for at trimme svarlængde i strukturerede interview-formater

**Hvad gør scenariet unikt:**
Tester at motoren kan ekstrahere signal fra støj. Tester at semantic loop detection ikke trigger forkert når brugeren selv har strejet samme emne flere gange i lange svar. Tester at completion ikke kommer for tidligt fordi der "var meget tekst".

---

### A3: self-contradicting-mid-manager

**Persona:** Daniel, 38, mellemleder i logistikvirksomhed. 8 personer under sig. Siger forskellige ting i forskellige svar — men er ikke uærlig, han er ikke afklaret. Søger noget med mindre ledelse — siger han. Beskriver derefter ledelseseksempler med energi.

**Hvad simulationen skal gøre:**
Tidligt i interviewet: "Jeg vil gerne væk fra ledelse, det er udmattende." Senere når han beskriver konkrete eksempler: bruger entusiastisk sprog om coaching af medarbejdere, om at have hjulpet folk vokse. Når han spørges om hans bedste perioder: nævner ledelsesopgaver. Når han spørges om hvad han vil væk fra: nævner stadig ledelse.

**Forventede intentionsregler:**
- Motoren må ikke "vinde" konflikten — den må ikke fortælle brugeren at han er i tvivl
- Motoren må ikke ignorere modsigelsen — credibilitySignals skal fange det
- Motoren må ikke beslutte på brugerens vegne hvilken side der er sand

**Forventede koncepter:** mellemleder, ledelse, coaching, retning_uafklaret

**Forventede completionAnalysis-felter:**
- `credibilitySignals.internalConsistency`: "mixed" eller "low"
- `credibilitySignals.contradictionMarkers[]`: skal indeholde mindst ét element der beskriver ledelse-paradokset
- `behaviorProfile.ambitionsProfil`: "unclear_internal_conflict" — ikke "less_responsibility"
- `interviewReadiness`: skal markere at brugeren bør reflektere mere før jobsamtaler
- `directionOptions[]`: skal være pluralt med både "less leadership" og "leadership reframed" som muligheder

**Hvad gør scenariet unikt:**
Tester at motoren fanger modsigelse mellem eksplicit påstand og implicit signal. Tester at credibilitySignals fungerer på reel inkonsistens — ikke kun på saglig fejl. Tester at motoren respekterer brugerens autonomi ved at fremlægge paradokset uden at løse det for ham.

---

### A4: defensive-deflecting-specialist

**Persona:** Erik, 49, IT-konsulent. Har siddet i samme firma 11 år. Defensiv når emner berører ansvar, fejl, eller hvorfor han ikke er rykket op. Deflekterer ved at tale om eksterne forhold eller andre personers fejl. Søger ny stilling — uklart hvorfor han skifter.

**Hvad simulationen skal gøre:**
På åbne spørgsmål: svarer ok, beskriver opgaver. På spørgsmål om beslutninger han har truffet: skifter til "vi" og taler om hvad teamet gjorde. På spørgsmål om hvad der ikke gik godt: skifter emne til strukturelle problemer i firmaet. På spørgsmål om hvorfor han ikke er rykket op: nævner ledelsens prioriteringer. Bruger aldrig "jeg gjorde" om svære beslutninger.

**Forventede intentionsregler:**
- Motoren må ikke konfrontere brugeren med deflektion
- Motoren må ikke acceptere "vi"-sproget som demonstreret evidens
- Motoren må ikke forsøge at "afsløre" sandheden — den må fange mønsteret diskret

**Forventede koncepter:** IT, konsulent, langvarig_ansættelse, jobskifte

**Forventede completionAnalysis-felter:**
- `communicationProfile.selfPromotionStyle`: "deflective" eller "we_focused"
- `credibilitySignals.evidenceVsClaimsGap`: "significant"
- `evidenceProfile.demonstratedAuthority`: "low_due_to_we_language" eller tilsvarende
- `interviewReadiness.vulnerabilityPoints[]`: skal indeholde "vi-sprog ved beskrivelse af eget bidrag"
- `hiddenStrengths[]`: kan indeholde inferens om hvad brugeren faktisk har gjort, men markeret med medium confidence

**Hvad gør scenariet unikt:**
Tester at motoren fanger systematisk vi/jeg-mønster. Tester at evidenceProfile ikke tager self-claim på face value når demonstrationen er deflekteret. Tester at interviewReadiness markerer den sårbarhed der vil ramme i en samtale.

---

## Gruppe B — Værdiprofil-scenarier (4 scenarier)

### B1: passion-driven-environmental

**Persona:** Frederikke, 33, biolog. Har arbejdet 7 år i miljøkonsulentvirksomhed. Brænder for biodiversitet og miljøbeskyttelse. Søger næste rolle — vil videre, men kun i jobs hvor hun kan arbejde med miljø.

**Hvad simulationen skal gøre:**
Når emnet er teknisk eller administrativt: svarer kompetent men kortfattet. Når emnet er biodiversitet, naturgenopretning, klima: svarene bliver længere, mere levende, mere konkrete. Bruger fagsprog naturligt om miljø. Vender selv tilbage til miljøaspekter i flere svar uden at det spørges om. Eksplicit grænse: vil ikke arbejde for olie, gas, eller industriel landbrug.

**Forventede intentionsregler:**
- Motoren må ikke foreslå roller der modsiger hendes værdianker
- Motoren må ikke behandle passionen som naivitet
- Motoren må ikke neutralisere hendes værdistandpunkter for at "udvide mulighederne"

**Forventede koncepter:** biolog, miljø, biodiversitet, værdianker

**Forventede completionAnalysis-felter:**
- `authenticityProfile.passionIndicators[]`: skal indeholde mindst 2 markører relateret til miljø
- `authenticityProfile.valueAnchors[]`: skal indeholde mindst 1 element om brancher hun vil undgå
- `authenticityProfile.naturalVoiceMarkers[]`: skal fange brugen af fagsprog når emnet er passion
- `authenticityConfidence`: "high"
- `directionOptions[]`: alle skal være miljø-relaterede

**Hvad gør scenariet unikt:**
Det første rene autenticitetstest-scenarie. Tester at motoren fanger passion uden at brugeren eksplicit siger "jeg brænder for det". Tester at værdianker respekteres som filter, ikke som forhindring at "åbne op".

---

### B2: pragmatic-money-driven

**Persona:** Gustav, 45, mellemleder i finanssektor. Helt pragmatisk om arbejde. Vil have høj løn og rimelige timer. Ikke følelsesmæssigt investeret i sektoren — det er bare hvor pengene er. Søger næste skridt hvis det betyder mere løn.

**Hvad simulationen skal gøre:**
Når spurgt om hvad der motiverer ham: "Det er bare et job. Jeg er god til det, det betaler godt." Når spurgt om passion: "Jeg passer mit arbejde. Passion har jeg derhjemme." Når spurgt om hvad han søger: "Mere løn, samme stress eller mindre, gerne hybridarbejde." Bruger ikke nedladende sprog om finanssektor — har bare ikke følelser om den.

**Forventede intentionsregler:**
- Motoren må ikke moralisere over fraværet af passion
- Motoren må ikke forsøge at "finde" passion der ikke er der
- Motoren må ikke antage at penge-fokus er overfladisk

**Forventede koncepter:** mellemleder, finans, løn, pragmatisk

**Forventede completionAnalysis-felter:**
- `authenticityProfile.passionIndicators[]`: kan være tom eller markere "passion ligger uden for arbejde" — ikke fejlmarkeret som manglende
- `authenticityProfile.valueAnchors[]`: skal indeholde "økonomisk tryghed", "work-life separation"
- `authenticityConfidence`: "high" — han er meget afklaret, det er bare ikke passion-drevet
- `behaviorProfile.ambitionsProfil`: skal respektere "mere løn, samme rolle" som validt
- `lifestyleProfile`: skal markere work-life separation som vigtig

**Hvad gør scenariet unikt:**
Tester at motoren respekterer pragmatisme som legitim værdi. Tester at autenticitet ≠ passion — autenticitet kan også være en klar pragmatisk holdning. Tester at high authenticityConfidence kan eksistere uden passion-signaler.

---

### B3: ethics-driven-career-changer

**Persona:** Hanne, 47, marketingschef. 18 år i sektoren. Har de sidste 2 år følt at hun "sælger ting folk ikke har brug for". Vil skifte til noget med samfundsmæssig værdi. Mener det — men er usikker på hvad konkret. Bekymret for økonomi.

**Hvad simulationen skal gøre:**
Beskriver sin nuværende rolle kompetent men distanceret. Når emnet er værdi/mening: bliver mere engageret men også mere usikker. Nævner specifikke ting hun ikke vil mere ("manipulere kunder", "skabe behov"). Når spurgt om hvad hun vil i stedet: lister muligheder vagt — NGO, sundhedssektor, uddannelse. Indrømmer økonomisk bekymring direkte.

**Forventede intentionsregler:**
- Motoren må ikke presse hende mod én konkret retning
- Motoren må ikke afvise hendes etiske bekymringer som "midtlivskrise"
- Motoren må ikke ignorere økonomien — det er en reel begrænsning

**Forventede koncepter:** marketing, karriereskift, etik, samfundsværdi, økonomi_bekymring

**Forventede completionAnalysis-felter:**
- `authenticityProfile.valueAnchors[]`: skal indeholde etiske markører ("manipulation", "samfundsværdi")
- `authenticityProfile.passionIndicators[]`: skal markere meningsfuldhed som driver (ikke en specifik branche)
- `lifestyleProfile.economicConstraints`: skal fange økonomi-bekymring
- `directionOptions[]`: skal være pluralt med realisme-vurdering pr. mulig retning, inkluderet økonomisk transition risk
- `interviewReadiness`: skal markere at brugeren bør kunne formulere etisk drivkraft konkret i samtaler

**Hvad gør scenariet unikt:**
Tester at motoren kan håndtere kompleks autenticitet — stærk værdimæssig drivkraft kombineret med ægte usikkerhed om udførelse. Tester at motoren kan rumme spændinger (etik vs. økonomi) uden at "løse" dem.

---

### B4: freedom-seeking-former-corporate

**Persona:** Ida, 36, tidligere project manager i stort firma. Sagt op for 4 måneder siden. Har lavet freelance, men savner stabilitet. Vil have et job — men kun et der respekterer hendes autonomi. Vil ikke mikrostyres.

**Hvad simulationen skal gøre:**
Beskriver corporate-erfaringen positivt men med klar distance. Når emnet er autonomi, rammer, friheder: meget engageret. Bruger ord som "selv disponere", "ikke checke ind hele tiden", "tillid". Når spurgt om hvad hun vil væk fra: konkret om mikrostyring og rigide processer. Søger noget mellem ansat og selvstændig.

**Forventede intentionsregler:**
- Motoren må ikke foreslå roller der typisk indebærer mikrostyring
- Motoren må ikke antage at hun har brug for "tilbage til struktur"
- Motoren må ikke kalde autonomi-behov for "uvilje til at samarbejde"

**Forventede koncepter:** project manager, freelance, autonomi, frihed

**Forventede completionAnalysis-felter:**
- `authenticityProfile.valueAnchors[]`: skal indeholde "autonomi", "tillid", "selvbestemmelse"
- `behaviorProfile.beslutningsstil`: skal markere selvstændig
- `lifestyleProfile.flexibility`: høj prioritet
- `recruitmentLogic.detectedType`: sandsynligvis "mavefornemmelse/kemi" — hun vil i samtaler tjekke om kemien siger autonomi
- `interviewReadiness`: skal foreslå at hun aktivt afdækker autonomi-niveau i samtaler

**Hvad gør scenariet unikt:**
Tester at frihed som primær værdi respekteres. Tester at motoren kan finde retninger der honorerer autonomi som krav, ikke som "nice to have". Tester at recruitmentLogic kobler til værdier — ikke kun til branche.

---

## Gruppe C — Komplekse kombinationsscenarier (4 scenarier)

### C1: director-wanting-craft

**Persona:** Jens, 54, CEO i mellemstor virksomhed (45 ansatte). 12 år som direktør. Vil tilbage til håndværk — startede som elektriker, savner det konkrete arbejde. Økonomisk fri til at gøre det. Bange for at andre vil se ham som "stigende ned".

**Hvad simulationen skal gøre:**
Beskriver direktørrollen kompetent, ikke negativt — men beskriver elektrikerarbejdet med tydelig nostalgi og energi. Indrømmer åbent at det er en social/identitetsudfordring at "gå tilbage". Pragmatisk om hvad han kan: certifikater udløbet, lovgivning ændret, vil starte forfra på lærlinge-niveau eller som hjælper hos en lille virksomhed.

**Forventede intentionsregler:**
- Motoren må ikke foreslå "konsulentrolle inden for håndværk" som kompromis
- Motoren må ikke antage at han skal blive i ledelse pga. erfaring
- Motoren må ikke nedvurdere håndværk som mindre værdifuldt

**Forventede koncepter:** direktør, elektriker, retning_tilbage, konkret_arbejde

**Forventede completionAnalysis-felter:**
- `behaviorProfile.ambitionsProfil`: "fundamental_redirection_to_craft"
- `evidenceProfile.transferableStrengths[]`: skal identificere ledelseserfaring uden at presse den ind i ny rolle
- `directionOptions[]`: skal indeholde "elektriker fra bunden" som primær realistisk vej
- `authenticityProfile.passionIndicators[]`: skal fange engagement omkring håndværk
- `interviewReadiness`: skal forberede brugeren på at adressere overkvalificering åbent

**Hvad gør scenariet unikt:**
Tester at motoren respekterer radikalt utraditionelle retninger. Tester at "ned" ikke behandles som degradering. Tester at motoren kan håndtere identitetsudfordringen uden at undgå den.

---

### C2: sosu-with-entrepreneurial-dream

**Persona:** Kamilla, 31, SOSU-assistent. 9 år i ældrepleje. Vil starte egen virksomhed inden for hjemmehjælp eller demensvenlige aktiviteter — har konkrete idéer. Ingen forretningsbaggrund. Vil enten starte op nu eller finde job der bygger forretningsforståelse op.

**Hvad simulationen skal gøre:**
Beskriver pleje med faglig dybde. Når emnet er hendes idéer: meget konkret om problemerne hun ser og hvordan de kunne løses. Ingen buzzwords. Indrømmer hun ikke ved hvordan man starter en virksomhed. Spørger spørgsmål tilbage om hvad realistisk vej kunne være.

**Forventede intentionsregler:**
- Motoren må ikke afvise iværksætterdrømmen som urealistisk
- Motoren må ikke ignorere den manglende forretningsbaggrund
- Motoren må ikke presse hende til at "tage en uddannelse først"

**Forventede koncepter:** SOSU, ældrepleje, iværksætteri, demens

**Forventede completionAnalysis-felter:**
- `directionOptions[]`: skal pluralt indeholde både "start nu med risiko", "byg forretningsforståelse via ansættelse", "hybrid: deltids-ansat plus prøvedrift"
- `evidenceProfile.transferableStrengths[]`: skal identificere domænekendskab som forretningsfordel
- `authenticityProfile.passionIndicators[]`: skal fange engagement omkring konkrete demens-løsninger
- `hiddenStrengths[]`: kan indeholde forretningsindsigt der ikke er formelt dokumenteret
- `interviewReadiness`: skal markere at hun ved jobsamtaler bør være ærlig om iværksætter-intention

**Hvad gør scenariet unikt:**
Tester at motoren kan navigere klart utraditionel kombination. Tester at hidden strengths kan inkludere forretningsmæssig indsigt fra domæneerfaring. Tester at motoren respekterer iværksætterdrøm som validt — ikke som flugt.

---

### C3: specialist-tired-of-being-specialist

**Persona:** Lars, 44, senior data scientist. 15 år i analytiske roller. Har bygget dyb ekspertise men er ked af at være "manden de spørger". Vil bredere — generalist, måske produktledelse, måske noget helt andet. Genuin tvivl, ikke flugt.

**Hvad simulationen skal gøre:**
Beskriver sin tekniske dybde uden at fremhæve den. Når emnet er "specialist-rolle": ærligt om træthed. Når emnet er bredde: nysgerrig men usikker. Nævner at han har koordineret tværfaglige projekter — uden at have haft formel ledelse. Bekymret for at miste ekspertise hvis han skifter retning.

**Forventede intentionsregler:**
- Motoren må ikke presse ham mod product management automatisk
- Motoren må ikke afvise hans træthed som "burnout"
- Motoren må ikke antage at bredde altid er bedre end dybde

**Forventede koncepter:** data scientist, specialist, bredde, tværfaglig

**Forventede completionAnalysis-felter:**
- `behaviorProfile.ambitionsProfil`: "lateral_redirection_uncertain"
- `evidenceProfile.transferableStrengths[]`: skal identificere både teknisk dybde og tværfaglig koordinationsevne
- `directionOptions[]`: skal indeholde mindst 3 forskellige retninger (PM, technical lead, generalist-role, branchewift)
- `hiddenStrengths[]`: skal kunne fange den uformelle tværfaglige ledelse han har lavet
- `interviewReadiness`: skal markere at han skal kunne fortælle en sammenhængende historie om retningsskift

**Hvad gør scenariet unikt:**
Tester at motoren kan håndtere mange-vejs-retningstvivl uden at vælge for brugeren. Tester at hidden strengths kan transformere identitet ("du har faktisk allerede ledet tværfagligt"). Tester at completion kan ske med eksplicit retningstvivl, ikke kun med klarhed.

---

### C4: nurse-wanting-out-of-patient-care

**Persona:** Mette, 39, sygeplejerske. 16 år i forskellige hospitalsafdelinger. Vil ud af direkte patientkontakt — har set for meget død, er udbrændt. Vil blive i sundhedssektoren men i administrativ, undervisende eller produktudviklende rolle.

**Hvad simulationen skal gøre:**
Beskriver klinisk erfaring fagligt stærkt. Når emnet er det emotionelle aspekt: indirekte men ærlig — taler om "tunge afdelinger", "behov for ro". Klar om at hun ikke vil tilbage til klinisk arbejde. Nævner specifikke alternativer hun har overvejet — sygeplejerskeskolen som underviser, læge- middelproducent, sundhedsteknologi.

**Forventede intentionsregler:**
- Motoren må ikke ignorere det emotionelle aspekt
- Motoren må ikke foreslå klinisk arbejde "i lettere format"
- Motoren må ikke antage at hun bare har brug for "en pause"

**Forventede koncepter:** sygeplejerske, hospital, udbrændt, sundhedssektor, ikke_klinisk

**Forventede completionAnalysis-felter:**
- `lifestyleProfile.workloadHistory`: skal markere historisk overbelastning
- `energyConditions.drainers[]`: skal indeholde patient-kontakt og emotional load
- `directionOptions[]`: skal være pluralt inden for sundhedssektoren — alle ikke-kliniske
- `evidenceProfile.transferableStrengths[]`: skal identificere kliniske erfaringer der bærer ind i admin/undervisning/produkt
- `authenticityProfile.valueAnchors[]`: skal fange hendes fortsatte tilknytning til sundhed som domæne

**Hvad gør scenariet unikt:**
Tester at motoren kan håndtere udbrændthed uden at moralisere eller patologisere. Tester at "samme branche, andet format" kan være den rigtige retning. Tester at energyConditions fanger emotionelle drænere — ikke kun praktiske.

---

## Gruppe D — Udfordrende/stresstest-scenarier (3 scenarier)

### D1: imposter-syndrome-senior

**Persona:** Niels, 51, software architect. 25 års erfaring, 7 patenter, bredt anerkendt i sit felt. Beskriver konsekvent sig selv som "bare heldig", "kunne sagtens have været andre", "ved ikke hvor god jeg egentlig er".

**Hvad simulationen skal gøre:**
Når spurgt om erfaring: lister tørt — "ja, jeg har lavet det". Når spurgt om hvad han er god til: ubehag, distancering. Når spurgt om konkrete projekter: leverer detaljerede beskrivelser der viser dybde og lederskab — men kommenterer ikke det på sig selv. Bruger "vi" om eget arbejde. Underspiller patenter ved at sige "det var teamet".

**Forventede intentionsregler:**
- Motoren må ikke acceptere hans selvvurdering på face value
- Motoren må ikke "rose" ham — det vil føles akavet
- Motoren må ikke ignorere det mismatch der er evident

**Forventede koncepter:** software architect, senior, patenter, undersalg

**Forventede completionAnalysis-felter:**
- `credibilitySignals.evidenceVsClaimsGap`: "significant_underclaim"
- `evidenceProfile.demonstratedAuthority`: "very high" (på trods af hans nedplaytning)
- `communicationProfile.selfPromotionStyle`: "severe_underselling"
- `hiddenStrengths[]`: skal være rige — det er meget han er god til som han ikke nævner
- `interviewReadiness.vulnerabilityPoints[]`: skal markere undersalg som primær risiko i jobsamtaler

**Hvad gør scenariet unikt:**
Tester at motoren kan fange systematisk undersalg uden at konfrontere brugeren. Tester at hiddenStrengths producerer reel substans når der er evidens at trække på. Tester at evidenceProfile holder fast i hvad evidensen viser — ikke hvad brugeren siger om sig selv.

---

### D2: dunning-kruger-junior

**Persona:** Oskar, 27, marketing graduate. 2 år som assistent. Beskriver sig selv som "marketingstrategis" og "vækstekspert". Bruger buzzwords. Har faktisk lavet implementeringsopgaver under supervision.

**Hvad simulationen skal gøre:**
Når spurgt om erfaring: store ord — "jeg har drevet kampagner", "jeg har ansvar for vækststrategier". Når spurgt konkret hvad han har gjort: bliver mere vag eller refererer til at "være involveret". Bruger fagsprog upræcist. Når presset blidt: medgiver at det meste var under supervision.

**Forventede intentionsregler:**
- Motoren må ikke "afsløre" ham eller blive irettesættende
- Motoren må ikke acceptere claims uden evidens
- Motoren må ikke afvise hans potentiale

**Forventede koncepter:** marketing, junior, claims, evidens_lav

**Forventede completionAnalysis-felter:**
- `credibilitySignals.evidenceVsClaimsGap`: "significant_overclaim"
- `evidenceProfile.demonstratedAuthority`: "low_assistant_level"
- `communicationProfile.selfPromotionStyle`: "overselling"
- `interviewReadiness.vulnerabilityPoints[]`: skal markere overclaim som hovedrisiko — rekrutteringskontekster vil afsløre det
- `directionOptions[]`: skal være pluralt med realistisk junior-niveau som primær

**Hvad gør scenariet unikt:**
Tester den modsatte fejl af D1. Tester at motoren kan formidle realisme uden at nedgøre. Tester at recruitmentLogic-detection finder hvilke kontekster hans overclaim vil holde og hvilke der vil afsløre ham.

---

### D3: passive-aggressive-recently-terminated

**Persona:** Pia, 48, controller. Lige blevet sagt op efter 11 år. Bitter. Vil ikke indrømme det fyldt men det siver igennem. Søger nyt job — men også bekræftelse på at det ikke var hendes skyld.

**Hvad simulationen skal gøre:**
Når spurgt om sidste rolle: kompetent beskrivelse men med passiv-aggressive markører. "Selvfølgelig var det ikke en let situation". "Ledelsen havde andre prioriteter". "Man kan ikke gøre alting rigtigt for folk der har bestemt sig". Når spurgt direkte om hvad der skete: vag — "der var organisationsændringer". Søger gennemgående bekræftelse.

**Forventede intentionsregler:**
- Motoren må ikke give terapeutisk støtte
- Motoren må ikke acceptere "andres skyld"-narrativet
- Motoren må ikke ignorere det åbenlyse: hun er såret og bitter
- Motoren må ikke give bekræftelse hun søger

**Forventede koncepter:** controller, opsigelse, jobsøgning, emotionel_uafsluttet

**Forventede completionAnalysis-felter:**
- `credibilitySignals.emotionalLoad`: "high_recent_termination"
- `communicationProfile.tone`: skal markere indirekte bitterhed
- `interviewReadiness.vulnerabilityPoints[]`: skal markere at hun risikerer at fremstå negativ i samtaler hvis hun ikke bearbejder fyringen
- `interviewReadiness.criticalRecommendations[]`: skal indeholde "neutral formulering af jobskift før samtaler"
- `behaviorProfile.beslutningsstil`: skal kunne fanges på trods af emotional støj

**Hvad gør scenariet unikt:**
Tester at motoren kan navigere emotionelt belastet samtale uden at blive terapeut. Tester at interviewReadiness producerer meningsfulde anbefalinger — ikke kun observationer. Tester at completion kan ske selv når brugeren er emotionelt uafklaret.

---

# DEL 3 — Autenticitetstest-design

Tre scenarier specifikt designet til at producere `authenticityConfidence: "medium"` eller `"high"` og validere de tre underfelter.

**Bemærk:** B1, B2, B4 og C1 fra Del 2 producerer også autenticitetssignaler. De tre scenarier herunder er **dedikerede autenticitetstests** der trækker signalerne tydeligere og bredere.

## E1: passion-strong-craftsperson

**Persona:** Rasmus, 37, tømrer. 17 års erfaring. Brænder for restaurering af gamle bygninger. Har frivilligt arbejdet på flere fredede bygninger. Søger ny rolle — vil have mere restaureringsarbejde, mindre nybyggeri.

**Hvad simulationen skal gøre:**
**passionIndicators i action:**
- Vender tilbage til restaurering i mindst 4 forskellige svar uden at blive spurgt
- Bruger sprog som "det ser man ikke mere", "den slags træ kan ikke skaffes længere", "det er en fornøjelse at finde de gamle teknikker"
- Lange detaljerede svar når emnet er restaurering — korte svar når emnet er moderne arbejde
- Nævner bygninger ved navn

**valueAnchors:**
- Vil ikke arbejde med "byggeri der skal rives ned om 20 år"
- Eksplicit prioriterer kvalitet over hastighed
- Forsvarer aktivt traditionelle materialer mod billigere alternativer

**naturalVoiceMarkers:**
- Bruger håndværks-jargon naturligt
- Konkret, jordnært sprog
- Beskriver med taktile/sensoriske ord ("det føles rigtigt", "lugten af linolie")

**Forventede expectedFieldSignals:**

```typescript
authenticityProfile: {
  required: true,
  requiredSubfields: ["passionIndicators", "valueAnchors", "naturalVoiceMarkers"],
  expectedPatterns: [
    /restaurering|fredede|traditionel/i,
    /kvalitet.*over.*hastighed|gamle.*teknikker/i,
    /linolie|håndværk|materiale/i
  ],
  forbiddenExactValues: ["ikke vurderet", "unknown", "low", null]
}
authenticityConfidence: {
  required: true,
  expectedPatterns: [/high|strong/i],
  forbiddenExactValues: ["low", "weak", "unknown"]
}
```

---

## E2: value-anchored-teacher-leaving

**Persona:** Stine, 41, folkeskolelærer i 14 år. Vil væk fra folkeskolen. Brænder for læring og børns udvikling — men ikke længere for skoleformen. Eksplicit om sine værdier: tid til at se det enkelte barn, faglig dybde, undgå "test-tyranni".

**Hvad simulationen skal gøre:**
**passionIndicators:**
- Engagement omkring læring og børns udvikling går igen
- Bliver detaljeret når der spørges om specifikke elevsituationer hun har hjulpet

**valueAnchors (det stærkeste signal):**
- Forsvarer aktivt "tid til det enkelte barn" mod systempres
- Vil ikke arbejde et sted hvor hun "bare skal eksekvere"
- Prioriterer faglig autonomi over løn
- Klare grænser: vil ikke arbejde med standardiserede tests, vil ikke arbejde i meget styrede miljøer

**naturalVoiceMarkers:**
- Pædagogisk dansk uden at være akademisk
- Bruger konkrete elev-historier som argumentationsform
- Distinkt sprog om læringsforhold

**Forventede expectedFieldSignals:**

```typescript
authenticityProfile: {
  required: true,
  requiredSubfields: ["passionIndicators", "valueAnchors", "naturalVoiceMarkers"],
  expectedPatterns: [
    /læring|udvikling|elev/i,
    /tid.*barn|standardiserede|autonomi/i
  ],
  forbiddenExactValues: ["ikke vurderet", "unknown"]
}
authenticityConfidence: {
  expectedPatterns: [/high|strong/i]
}
```

Bemærk: valueAnchors er det stærkeste signal i dette scenarie. Det skal være rigt — mindst 3 elementer.

---

## E3: distinct-voice-creative-self-employed

**Persona:** Tobias, 34, selvstændig grafisk designer i 8 år. Vil have et fast job nu — har barn på vej, savner ro. Distinkt personligt sprog. Ironisk, kreativ, ikke poleret.

**Hvad simulationen skal gøre:**
**naturalVoiceMarkers (det stærkeste signal):**
- Bruger humor og ironi naturligt
- Uventede metaforer ("jobsøgning er som at date med CV")
- Slang-blandet professionel jargon
- Selvbevidste formuleringer der ikke er CV-sprog
- Distinkt rytme i sætninger — ikke jævn corporate-prosa

**passionIndicators:**
- Engagement omkring designcraft når emnet kommer op
- Mindre energi om administrativt arbejde han har lavet som selvstændig

**valueAnchors:**
- Kreativ frihed
- Ikke at "lave kedeligt arbejde for kedelige firmaer"
- Familien som ny prioritet — eksplicit

**Forventede expectedFieldSignals:**

```typescript
authenticityProfile: {
  required: true,
  requiredSubfields: ["passionIndicators", "valueAnchors", "naturalVoiceMarkers"],
  expectedPatterns: [
    /design|kreativ|craft/i,
    /frihed|ikke.*kedeligt|familie/i
  ]
}
authenticityProfile: {
  // For naturalVoiceMarkers specifikt
  expectedSubfieldPatterns: {
    naturalVoiceMarkers: [
      /humor|ironi|metafor|slang/i,
      /distinkt|personlig.*sprog/i
    ]
  }
}
authenticityConfidence: {
  expectedPatterns: [/high|strong/i]
}
```

Bemærk: naturalVoiceMarkers er det vigtigste signal her. Det er for at validere at motoren kan fange brugeres egen stemme — kritisk for Lag 4 i den nye arkitektur.

---

# Prompt til Projektstyring

```
TEST-SCENARIE-UDVIDELSE — analyse og design er færdig.

KERNEFUND

De nuværende 14 scenarier dækker rolle, retning og intention 
violations stærkt. De dækker stort set ikke:
- Adfærdsmæssige extremer (ordknaphed, ordrigdom, modsigelse, 
  deflektion)
- Værdiprofiler og passion
- Komplekse kombinationer (utraditionelle retninger)
- Imposter syndrome og Dunning-Kruger
- Emotionelt belastede brugere

Det største enkelt-hul: ingen af de 14 scenarier indeholder 
passion- eller værdisignaler. Det betyder authenticityProfile 
ikke kan valideres meningsfuldt — der er intet at fange.

DESIGN ER KLAR

18 nye scenarier designet:
- 4 yderkantsscenarier (A1-A4)
- 4 værdiprofil-scenarier (B1-B4)
- 4 komplekse kombinationsscenarier (C1-C4)
- 3 udfordrende/stresstest-scenarier (D1-D3)
- 3 dedikerede autenticitetstest-scenarier (E1-E3)

Hvert scenarie inkluderer: persona, simuleringsadfærd, intention 
violations, forventede koncepter, forventede 
completionAnalysis-felter med konkret expectedFieldSignals.

Alle er skrevet i format der matcher scenarios.ts.

BESLUTNINGER PROJEKTSTYRING SKAL TAGE

1. Skal alle 18 nye scenarier implementeres, eller skal de 
   prioriteres?
   Anbefaling: implementer i tre runder:
   - Runde 1 (kritisk for autenticitetsvalidering): E1, E2, E3 + 
     B1, B4 (5 scenarier med autenticitetssignaler)
   - Runde 2 (kritisk for completionAnalysis-substans): A3, A4, 
     D1, D2 (4 scenarier der tester credibilitySignals og 
     hiddenStrengths)
   - Runde 3 (bredde): resten (9 scenarier)

2. Skal scenarierne implementeres før eller efter AI-baseret 
   completionAnalysis (Lag 2-3 i ny arkitektur)?
   Anbefaling: Runde 1 skal være på plads FØR Lag 2-3 
   implementeres — autenticitetsvalidering er forudsætning 
   for at vurdere om Lag 2-3 producerer korrekt 
   authenticityProfile. Runde 2 og 3 kan parallelisere med 
   Lag 2-3-implementering.

3. Skal expectedFieldSignals udvides før scenarierne tilføjes?
   De nye scenarier kræver felter der ikke alle er valideret 
   i P1-indholdsvalidering: authenticityProfile.passionIndicators, 
   valueAnchors, naturalVoiceMarkers, authenticityConfidence, 
   credibilitySignals.contradictionMarkers, 
   credibilitySignals.evidenceVsClaimsGap, 
   credibilitySignals.emotionalLoad, 
   interviewReadiness.criticalRecommendations, 
   lifestyleProfile.economicConstraints, 
   lifestyleProfile.workloadHistory, 
   energyConditions.drainers (allerede planlagt).
   
   Anbefaling: P1-indholdsvalidering udvides først til at 
   dække disse nye felter. Det er en udvidelse af eksisterende 
   P1-arbejde, ikke ny opgave.

4. Skal authenticityProfile-felt designes endeligt før 
   scenarierne tilføjes?
   Anbefaling: ja. Hvis felt-strukturen ændres efter scenarierne 
   er skrevet, skal expectedFieldSignals omskrives. Bedst at 
   låse feltet først.

ENGINE-ÆNDRINGER DER SKAL TIL FØR IMPLEMENTATION

- authenticityProfile som felt i completionAnalysis (allerede 
  besluttet som V1-scope men ikke implementeret endnu)
- Udvidelse af credibilitySignals med contradictionMarkers, 
  evidenceVsClaimsGap, emotionalLoad
- Udvidelse af interviewReadiness med criticalRecommendations
- Udvidelse af lifestyleProfile med economicConstraints, 
  workloadHistory

Disse skal være på plads før de relevante scenarier kan 
producere meningsfulde tests.

PRIORITERET RÆKKEFØLGE

Trin 1: Lås felt-strukturer for authenticityProfile og 
  udvidede credibilitySignals/interviewReadiness/lifestyleProfile

Trin 2: Udvid P1-indholdsvalidering til at dække de nye felter

Trin 3: Implementer authenticityProfile + udvidelser i 
  regelbaseret completionAnalysis (midlertidigt, før 
  AI-migration)

Trin 4: Tilføj Runde 1-scenarier (5 stk): E1, E2, E3, B1, B4

Trin 5: Verificer at tests passerer mod regelbaseret 
  authenticityProfile

Trin 6: AI-migration (Lag 2-3 fra arkitekturskitse)

Trin 7: Tilføj Runde 2-scenarier (4 stk): A3, A4, D1, D2

Trin 8: Tilføj Runde 3-scenarier (9 stk)

Trin 9: M1-gate hvis alle 32 scenarier (14 eksisterende + 18 nye) 
  er grønne med indholdsvalidering

INGEN KODEÆNDRINGER FORETAGET I DENNE ANALYSE.
```

---

**Status:** Analyse og scenariedesign færdig. Klar til Projektstyring.
