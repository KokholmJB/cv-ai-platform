# APPLICATION_PROFILE_REQUIREMENTS

## Formål og strategisk rolle

Dette dokument definerer kravene til JobPilots autenticitets- og værdimatchlag — det profil-element der gør forskellen mellem en generisk ansøgning og en ansøgning der lyder som brugeren på sit bedste.

En ansøgning er ikke en omskrivning af CV'et. Den er en strategisk kommunikation mellem to parter — brugeren og virksomheden — hvor matchet handler om mere end faglige kvalifikationer. Det handler om hvem brugeren er, hvad de står for, og om det resonerer med hvad virksomheden signalerer.

Systemet skal forstå begge sider og producere output der er autentisk, troværdigt og strategisk velpositioneret.

---

## Brugerens autenticitetsprofil

Systemet skal afdække og forstå hvad der giver brugerens arbejdsliv mening — ikke som en fast kategori, men som et adaptivt billede der er unikt for hver bruger.

**Hvad systemet skal forstå:**

Hvad brugeren står for i arbejdsmæssig kontekst. Ikke abstrakte værdier som "ærlighed" eller "teamwork" — men konkrete mønstre i hvad de prioriterer, hvad de forsvarer, og hvad der driver dem når arbejdet er svært.

Brugerens personlige stemme og naturlige kommunikationstone. Hvordan de formulerer sig når de er på deres bedste — ikke poleret AI-sprog, men deres egen stemme skarpere.

Hvad brugeren autentisk kan stå inde for i en ansøgning. Systemet må aldrig opfinde engagement eller værdier brugeren ikke har. Alt der skrives skal kunne forsvares i en samtale.

Mønstre i hvad brugeren finder meningsfuldt kontra hvad de blot er dygtige til. Disse er ikke altid det samme — og forskellen er kritisk for ansøgningskvaliteten.

---

## Virksomhedens kulturelle signaler

Systemet skal analysere jobopslaget for kulturelle og værdimæssige signaler — ikke kun faglige krav.

**Hvad systemet skal identificere:**

Hvilken tone og stil virksomheden bruger i opslaget. Formelt eller uformelt. Fagligt eller personligt. Ambitiøst eller trygt.

Hvad virksomheden signalerer at de værdsætter ud over faglige kvalifikationer. Dette kan komme til udtryk på mange måder og varierer markant mellem organisationer og brancher.

Om der er signaler om organisationskultur, arbejdsmiljø eller fællesskab der er relevante for ansøgningens tone og indhold.

Systemet må aldrig antage hvad en virksomhed værdsætter uden at det er forankret i konkrete signaler fra opslaget. Kulturelle antagelser uden evidens er en fejlkilde.

---

## Ansøgningstype-matching

Baseret på brugerens autenticitetsprofil og virksomhedens kulturelle signaler skal systemet vælge den ansøgningstype der giver størst strategisk fordel.

Ansøgningstypen er ikke en fast skabelon — det er en strategisk ramme der styrer tone, struktur og vægtning af indhold. Systemet skal kunne navigere et bredt spektrum af ansøgningstyper tilpasset den konkrete situation.

Valget af ansøgningstype skal altid være forankret i:
- Hvad brugeren autentisk kan levere
- Hvad virksomheden signalerer at de søger
- Hvilken rekrutteringslogik der sandsynligvis er aktiv

---

## Krav til interviewmotoren

Interviewmotoren skal aktivt afdække brugerens autenticitetsprofil som en del af profileringen.

Dette sker primært via mønstre i svarene — hvad brugeren vender tilbage til, hvad de forsvarer, hvad der giver energi i deres beskrivelser. Men motoren kan også stille direkte spørgsmål når det er naturligt og relevant.

Motoren må ikke forcere brugeren ind i kategorier. Autenticitetsprofilen skal fremkomme naturligt — ikke som et spørgeskema om værdier.

---

## Krav til output

Ansøgningen skal:
- Lyde som brugeren — ikke som en AI-skabelon
- Være strategisk positioneret mod det specifikke opslag
- Kun indeholde engagement og værdier brugeren kan stå inde for
- Matche virksomhedens kulturelle tone uden at være utro mod brugeren
- Kunne forsvares ord for ord i en samtale

Systemet må aldrig:
- Opfinde passion eller værdier brugeren ikke har signaleret
- Bruge generiske vendinger der kunne gælde enhver ansøger
- Ignorere kulturelle mismatch-signaler for at producere en positiv ansøgning

---

## Relation til øvrige dokumenter

`DEEP_PROFILE_REQUIREMENTS.md` og `PROFILE_ENGINE_REQUIREMENTS.md` definerer profil-fundamentet dette lag bygger på.

`JOB_EVALUATION_REQUIREMENTS.md` definerer hvordan kulturmatch indgår i jobevalueringen.

`PRODUCT_REQUIREMENTS_V1.md` definerer den overordnede V1-ramme.

Dette lag er en forudsætning for at CV- og ansøgningsgenerering i M3 kan producere output der er væsentligt bedre end det markedet allerede tilbyder.
