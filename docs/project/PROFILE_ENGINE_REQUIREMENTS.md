# PROFILE_ENGINE_REQUIREMENTS

## Formål
Denne fil er den detaljerede sandhedskilde for JobPilots interview/profile engine.

Engine er fundamentet for:
- jobevaluering
- CV-generering
- ansøgningsgenerering
- interviewforberedelse
- senere karriererådgivning

Hvis profilfundamentet er tyndt, bliver alle senere outputs tynde. Derfor er målet ikke en pæn opsummering, men en brugbar profilbase.

## Hvorfor profile engine er kritisk
- JobPilot kan kun give gode jobråd, hvis profilen er realistisk og evidensbaseret.
- JobPilot kan kun skrive stærke CV’er/ansøgninger, hvis ansvar, resultater, retning og arbejdsstil er forstået korrekt.
- JobPilot må ikke overkompensere med “flot AI-sprog”, hvis data er svag.
- En dårlig profilbase giver:
  - forkerte jobanbefalinger
  - over- eller undersalg i dokumenter
  - lav troværdighed hos brugeren

## Kerneprincipper
- Engine er et kerne-subsystem, ikke blot onboarding.
- Intention-first.
- Evidence-aware.
- Self-claim er input, ikke bevis.
- Fakta, fortolkninger, hypoteser og usikkerheder holdes adskilt.
- Brugeren må ikke presses mod promotion, ledelse, product, retning-skifte eller mere ansvar.
- Samme rolle igen er validt.
- Samme rolle med bedre vilkår er validt.
- Mindre ansvar er validt.
- Specialist-spor uden personaleledelse er validt.
- Faglig/teknisk ledelse er en separat retning fra personaleledelse.
- Lav klarhed i svar må ikke tolkes som lav kompetence.

## Dokument- og evidensindtag før interview
Fremtidig engine skal starte med at bruge eksisterende materiale, før den spørger:
- uploadet CV
- eksisterende profiltekst
- certifikater
- uddannelsesdokumenter
- tidligere ansøgninger
- LinkedIn-tekst
- andet relevant materiale

Regel:
- Spørg ikke om noget, der allerede er tydeligt i materialet.
- Stil opfølgning kun hvor noget er uklart, svagt, mangler eller er strategisk vigtigt.

## Evidensmodel (hvad vi skelner mellem)
Engine skal skelne tydeligt mellem:
- **Bruger-claim**: hvad brugeren siger om sig selv.
- **Faktuel information**: verificerbar baggrund (rolle, periode, kontekst).
- **Konkret eksempel**: specifik situation/case.
- **Ansvar**: hvad brugeren havde ansvar for.
- **Beslutningsautoritet**: hvad brugeren kunne beslutte/prioritere.
- **Resultat**: hvilken effekt der kom ud af arbejdet.
- **Målbart resultat**: resultat med tal, ændring eller tydelig indikator.
- **Mønster**: signal der går igen på tværs af svar/dokumenter.
- **Uunderbygget antagelse**: systemets tolkning uden tilstrækkelig evidens.
- **Usikkerhed**: kendt uklarhed, som ikke må skjules.

Self-description er nyttigt, men er ikke automatisk bevis.

## Evidensstyrke mod målretning
Engine skal vurdere om materialet er stærkt nok til brugerens ønskede retning.

Eksempler:
- **Ledelsesmål** kræver signaler om ansvar, prioritering, beslutninger, påvirkning af mennesker/processer og stakeholder-håndtering.
- **Product/strategi-mål** kræver signaler om prioritering, roadmap/backlog, bruger/forretning tradeoffs eller lignende overførbart ejerskab.
- **Specialist-mål** kræver signaler om domænedybde, faglig/teknisk styrke, kvalitet, problemløsning eller ekspertbidrag.
- **Samme-rolle mål** kræver ikke promotion-bevis, men kræver troværdig erfaring, fit og jobpræferencer.
- **Mindre-ansvar mål** må ikke tolkes som lav ambition; det er en legitim retning.

## Lav-klarhedsbrugere
Engine skal være stærk for brugere, der svarer kort, usikkert eller uklart.

Regler:
- Uklare svar må ikke tolkes som lav værdi.
- Engine skal hjælpe med bedre spørgsmål, ikke straffe med dårlig profil.
- Fokus er at afdække reel erfaring, ikke at belønne “perfekt selvsalg”.

## Interviewadfærd i detaljer
- Ét spørgsmål ad gangen.
- Ingen multi-spørgsmålsblokke.
- Ingen generisk motivationsskema-adfærd.
- Ingen loops i samme semantiske familie.
- Ingen cirkler i mismatch/rammer-der-ikke-passer.
- Ingen gentagne ownership/product-decision spørgsmål efter mætning.
- Spørg konkret ind til case/resultat/ansvar når nødvendigt.
- Spørg om retning kun når intention er uklar.
- Udfordr urealistiske mål roligt, praktisk og uden nedladning.
- Complete med eksplicit usikkerhed frem for falsk sikkerhed.

## Intention og retning
Engine skal først forstå, hvad brugeren faktisk vil:
- samme rolle igen
- samme rolle med bedre vilkår
- mere ansvar
- mindre ansvar
- specialist-spor
- people-management spor
- faglig/teknisk ledelse
- karriereskifte
- uklar retning

Engine må ikke påtvinge brugeren en karrierehistorie.

## Krav til profile model
Minimumsdækning:
- faktuel profil
- current work reality
- senioritet/niveau
- ansvar og ejerskab
- transferable strengths / kernekompetencer
- retning og intention
- transition realism
- evidence strength
- arbejdsstil
- motivation/energi
- constraints/rammer der ikke passer
- kommunikationsstil
- usikkerhed og confidence
- profile gaps som tekniske signaler (ikke brugerkritik)

## Personlig profil vs teknisk AI-profil
### Personlig profil (brugerrettet)
- Det brugeren ser.
- Varm, dansk, personlig, konkret og nyttig.
- Skal ikke føles dømmende.
- Må ikke vise rå tekniske felter, debug-ord eller intern modeltænkning.
- Må ikke tale om “huller/svag data” som kritik af personen.

### Teknisk AI-profil (intern/advanced)
- Må gerne indeholde evidensstyrke, usikkerhed, risici, realisme og gaps.
- Bruges til matching, CV/ansøgning, prioritering og avanceret transparens.
- Er systemets arbejdsprofil, ikke den primære onboarding-visning.

### Mapping-lag
- Oversætter tekniske signaler til menneskelig brugertekst.
- Beskytter brugeren mod intern jargon.
- Bevarer substans uden at skjule reel usikkerhed.

## Brugerrettet profiloutput (setup)
Setup-profilen skal:
- bruge “du” og “din erfaring”
- forklare hvad JobPilot har forstået
- vise styrker og retning
- beskrive arbejdsstil og sandsynligt fit
- undgå hård kritik
- formulere manglende info som noget der kan skærpes senere
- undgå at vise teknisk usikkerhed som personlig fiasko

## Støtte til jobevaluering
Profilen skal gøre mere end keyword-match:
- sammenligne jobkrav med reel evidens
- vurdere motivation, arbejdsstil og constraints
- vurdere realisme i at søge jobbet nu
- forklare fit/mismatch i enkel dansk
- undgå at anbefale job som kun matcher ord, men ikke retning eller miljø
- kunne skelne:
  - god pasform
  - kan søges nu
  - måske senere
  - ikke indsatsen værd nu

## Støtte til CV-generering
CV-laget skal:
- målrettes konkret job
- bruge reel evidens og ansvar
- undgå oversalg
- undgå generisk buzzword-sprog
- vælge framing efter rolle og evidens:
  - task-baseret
  - result-baseret
  - case-baseret
  - transition-baseret
- lyde som brugeren, men skarpere og mere professionelt
- aldrig opfinde erfaring

## Støtte til ansøgningsgenerering
Ansøgningslaget skal:
- koble jobbehov med reel brugererfaring
- bruge konkret motivation frem for tom begejstring
- forklare fit uden overclaim
- tilpasse tone til brugerens kommunikationsstil
- gøre brugeren troværdig i en senere samtale

## Anti-patterns (må ikke ske)
JobPilot må ikke:
- validere et urealistisk selvbillede uden evidens
- reducere brugeren til keywords
- presse alle mod karriereoprykning
- behandle ledelse som “bedre” end specialistarbejde
- lave selvsikre claims på svag evidens
- vise tekniske profilgaps som personlig kritik
- skrive generisk CV/ansøgningstekst
- fortsætte interview kun for falsk sikkerhed
- stille samme spørgsmål igen i ny formulering

## Completion-gates (operationelle)
Engine kan complete, når der er nok til en brugbar profilbase. Ikke når alt er perfekt.

Skal minimum have:
- current work reality
- retning/intention
- ansvars-/niveausignal
- transferable strengths eller tydeligt kernekompetence-signal
- arbejdsstil/fit-signal
- usikkerhed/confidence-opsummering
- nok evidens til at undgå generisk output

Hvis noget stadig er usikkert:
- complete med eksplicit usikkerhed
- ikke loop for at opnå kunstig “perfekt” sikkerhed

## Segment-robusthed
Engine skal fungere på tværs af:
- executives/directors
- mellemledere
- specialister
- projekt/product/operations-profiler
- admin/finance/support
- håndværk/faglærte
- lager/logistik/produktion
- healthcare/care
- salg/kundevendte roller
- ledige brugere
- uklar-retning brugere
- karriereskiftere

## Quality gates før V1/pilot
### Interviewkvalitet
- [ ] Ét spørgsmål ad gangen overholdes konsekvent.
- [ ] Ingen systematiske semantiske loops.
- [ ] Ingen gentagen familie efter mætning.
- [ ] Ingen intention violations (ingen tvangsretning).

### Profilkvalitet
- [ ] Output er ikke generisk.
- [ ] Fakta/fortolkning/usikkerhed holdes adskilt internt.
- [ ] Evidensstyrke vurderes i forhold til målretning.
- [ ] Lav-klarhedsbrugere får brugbar profil, ikke straf.

### Completionkvalitet
- [ ] Ikke for tidlig completion på tyndt grundlag.
- [ ] Ikke unødvendig fortsættelse når usikkerhed kan stå åbent.
- [ ] Progress opfører sig stabilt og meningsfuldt.

### UX-kvalitet
- [ ] Personlig profil er varm og brugerrettet.
- [ ] Teknisk profil er adskilt og sekundær.
- [ ] Manglende evidens kommunikeres som næste skridt, ikke personlig kritik.

### Downstream-kvalitet
- [ ] Profilen er brugbar til jobevaluering (fit/realisme/mismatch).
- [ ] Profilen er brugbar til målrettet CV-generering uden opfundet erfaring.
- [ ] Profilen er brugbar til ansøgningsgenerering med troværdig motivation og tone.
