# UX_DESIGN_REQUIREMENTS

## Vision

JobPilot skal ikke bare være et godt produkt. Det skal være det 
digitale værktøj som mennesker på tværs af hele samfundet — 
ufaglærte, faglærte, specialister, ledere, folk i krise, folk 
med ambitioner — bruger når de skal tage de vigtigste beslutninger 
i deres arbejdsliv.

Det kræver et design der ikke kun er smukt. Det kræver et design 
der er usynligt intelligent — der forstår brugeren, møder dem 
præcis der hvor de er, og gør det komplekse enkelt uden at gøre 
det banalt.

Standarden er ikke "bedre end konkurrenterne". Standarden er 
produkter som Spotify, Duolingo og Airbnb — oplevelser der skaber 
ægte afhængighed fordi de leverer reel værdi på en måde der føles 
personlig, tryg og ubesværet.

---

## Designprincip 1 — Radikal inklusivitet

JobPilot henvender sig til alle lag af samfundet. Det er ikke en 
metafor — det er et hårdt designkrav.

En lagerassistent med folkeskoleuddannelse og en direktør med 25 
års ledelseserfaring skal begge opleve at systemet taler til dem 
på en måde der føles naturlig, respektfuld og nyttig.

Kræver:
- Adaptivt sprog i hele interfacet — systemet kommunikerer på 
  brugerens niveau, ikke på systemets niveau
- Visuel kommunikation frem for teksttung vejledning — ikoner, 
  animationer og visuelle flows bærer den primære vejledning
- Zero-assumption onboarding — hvert trin forklarer sig selv
- Kontekstuelle hints der dukker op præcis når de er relevante
- Fejltolerance og blød vejledning — brugeren guides stille videre, 
  aldrig straffet med fejlbeskeder

---

## Designprincip 2 — Systemoplevelse ikke hjemmesideoplevelse

JobPilot er et personligt arbejdsværktøj — og det skal se og 
føles som et. Referencepunkter: Notion, Linear, Superhuman, Figma.

Kræver:
- Dashboard-arkitektur som primær landingsoplevelse
- Klart hierarki og konsistens på tværs af hele systemet
- Funktionelt visuelt design — farver, typografi og spacing er 
  kommunikation, ikke dekoration
- Mørkt og lyst tema understøttes

---

## Designprincip 3 — Profilstyrke er synlig og levende

Brugerens profil er ikke et statisk dokument. Det er en levende 
ressource der vokser jo mere de bruger systemet.

Kræver:
- Profilstyrke-indikator — meningsfuld visualisering af hvad der 
  er stærkt og hvad der kan styrkes — ikke en simpel procentbar
- Progressfeedback under interview — reelt viser hvad der er 
  afdækket og hvad der mangler
- Dynamisk profil-overblik der opdateres i realtid under interview
- Brugeren ser profilen vokse — stærk følelse af fremdrift og 
  investering

---

## Designprincip 4 — Hook-design der skaber ægte afhængighed

De produkter der skaber afhængighed gør det ved at levere ægte 
og unik værdi der aktiverer et indre behov.

For JobPilot er det indre behov: behovet for at føle sig klar, 
forberedt og i kontrol i en situation der normalt føles 
overvældende og usikker.

Hook-loop:
- Trigger: "Jeg har et jobopslag. Hvad nu?" — systemet er det 
  første de tænker på
- Action: én handling, minimal friktion fra trigger til resultat
- Variable reward: systemet afslører noget brugeren ikke vidste 
  om sig selv — præcis og personlig indsigt der overrasker
- Investment: profilen bliver mere værdifuld for hvert brug — 
  kan ikke kopieres til en konkurrent

---

## Designprincip 5 — Emotionel intelligens i designet

Jobsøgning er en emotionelt ladet oplevelse. Mange brugere 
kommer i en sårbar situation.

Kræver:
- Varm, menneskelig tone — aldrig koldt, aldrig klinisk
- Micro-interactions der bekræfter og motiverer — subtile 
  animationer der fejrer fremdrift
- Gaps og mangler præsenteres aldrig som kritik — altid som 
  mulighed for at gøre noget godt endnu bedre
- Sproget tilpasser sig brugeren — systemet taler aldrig ned

---

## Designprincip 6 — Mobil-first ikke mobil-kompatibel

Mange brugere vil bruge systemet fra en telefon som primær 
oplevelse. Hele flowet designes til touch og små skærme først 
— derefter skaleret til desktop.

---

## Dashboard — det centrale overblik

Dashboardet er brugerens hjembase. Det er ikke en velkomstside. 
Det er et levende kontrolpanel der på ét overblik viser hvem 
brugeren er, hvad de er i gang med, og hvad der skal til for 
at komme videre.

### Profilsektion
- Profilstyrke visualiseret på tværs af dimensioner
- Hvad der er stærkt og hvad der mangler — konstruktivt og 
  visuelt tydeligt
- Hurtig adgang til at styrke profilen

### Aktive jobansøgninger
- Overblik over jobs brugeren har evalueret, er i gang med 
  eller har sendt ansøgning til
- Status pr. job: evalueret / ansøgning skrevet / sendt / 
  svar modtaget / afslag / samtale
- Visuel timeline der viser fremdrift

### Statistik og resultater
- Hvor mange jobs evalueret
- Hvor mange ansøgninger sendt
- Svarrate — andel der har ført til respons
- Samtalekonvertering — andel der har ført til samtale
- Trends over tid — brugeren kan se at de forbedrer sig
- Disse tal er motiverende, ikke dømende — de viser fremdrift

### Motivationsmekanik — blid fremdriftsmotor
Systemet registrerer stille hvad der har ligget uberørt for 
længe og skubber blidt fremad — aldrig med pres, altid med 
opbakning.

Eksempler på blide nudges:
- "Din profil er ikke opdateret i 3 uger — et par svar kan 
  gøre den endnu stærkere"
- "Du evaluerede dette job for 5 dage siden — er du klar til 
  at skrive ansøgningen?"
- "Du har sendt 3 ansøgninger uden svar — vil du have et 
  frisk blik på din profil?"
- "Det er 2 uger siden din sidste jobsøgning — hvad er der 
  sket siden sidst?"

Tonen er altid: en ven der spørger nænsomt — aldrig et system 
der minder om en uafsluttet opgave.

Nudges vises maksimalt én ad gangen. Aldrig som notifikations-
spam. Altid med mulighed for at afvise uden at det gentages 
med det samme.

### Næste anbefalede handling
Systemet viser altid én klar anbefalet næste handling baseret 
på brugerens aktuelle situation:
- "Din profil er klar — find et job at evaluere"
- "Du har et stærkt match til dette job — skriv ansøgningen nu"
- "Du har en samtale om 3 dage — start forberedelsen"

Én handling. Aldrig en liste af ti ting brugeren burde gøre.

---

## Accessibility og European Accessibility Act

JobPilot skal fra dag ét designes til at overholde European 
Accessibility Act som træder i kraft i EU i 2025.

Det er ikke kun etik — det er forretning. De brugere der 
oftest har størst behov for hjælp i jobsøgningen er præcis 
de brugere accessibility-design hjælper mest.

Krav:
- Stærk farvekontrast (WCAG 2.2 AA minimum)
- Keyboard-navigerbart
- Skærmlæser-kompatibelt
- Dysleksivenligt skriftsnit som option
- Ingen information kommunikeres udelukkende via farve

---

## Leverancefaser

### Fase 1 — Strukturelt fundament (blokerer M1-gate)
- Progressbar tilbage under interview — meningsfuld, ikke 
  dekorativ
- Navigation og layout omstruktureret til system-look
- Tydelig næste-skridt logik på alle sider
- Konsistent komponent-sprog på tværs af systemet

### Fase 2 — Dashboard og visualisering (før pilot)
- Fuldt dashboard med profiloverblik, jobstatus og statistik
- Levende profilstyrke-visualisering
- Motivationsmekanik og nudges implementeret
- Design system etableret

### Fase 3 — Engagement og retention (efter pilot-feedback)
- Hook-mekanikker fuldt implementeret baseret på brugerdata
- Adaptive kommunikationstilpasning i UI
- Accessibility-audit og EAA-compliance verificeret
- Mobil-first redesign af kritiske flows

---

## Kvalitetskrav

Ingen fase må godkendes uden:
- Brugertest på minimum to segmenter der repræsenterer 
  forskellige baggrunde og digitalt kompetenceniveau
- Accessibility-check på alle nye komponenter
- Ingen forbidden terms i brugervendt tekst
- Mobil-visning verificeret på mindst to skærmstørrelser

---

## Anti-patterns — hvad vi aldrig må gøre

- Designe primært for den digitalt kompetente akademiker
- Bruge fagtermer eller interne systemtermer i UI
- Præsentere mangler som personlig kritik
- Overbelaste brugeren med for mange valg på én gang
- Lade notifikationer og nudges føles som pres
- Bygge desktop-first og tilpasse til mobil bagefter
- Lave et design der kun er smukt men ikke hjælper brugeren 
  med at handle
