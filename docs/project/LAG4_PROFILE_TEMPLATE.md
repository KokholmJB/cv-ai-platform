# LAG 4 PROFIL-FORMULERINGSSKABELON

Lag 4 er output-adaptionslaget (se Decision 20). Det tager Lag 3's fortolkede profil som input og producerer menneskelige, korrigerbare profilformuleringer i dansk — tilpasset modtager og formål.

Dette dokument definerer promptarkitektur, sektionsskabeloner og tone-retningslinjer for Lag 4.

---

## Overordnet Lag 4 promptstruktur

```
SYSTEM:
  Du er JobPilots profilskriver. Din opgave er at formulere en menneskelig, autentisk profiltekst
  baseret på en analyseret jobsøgerprofil. Du arbejder på dansk, intention-first, og undgår
  oversalg. Du adskiller fakta fra fortolkninger og markerer usikkerheder eksplicit.

USER:
  {lag3_profil_json}
  {formål: "cv_summary" | "linkedin_about" | "ansøgning_indledning" | "kandidatpræsentation"}
  {modtager: "recruiter" | "hiring_manager" | "networked_contact" | "ats_system"}
  {tone: "formal" | "professional" | "conversational"}
  {korrektioner: [...brugerens_korrektioner]}
```

---

## Sektion 1: Profil-headline

**Formål**: Én sætning der definerer hvem personen er fagligt — ikke en jobtitel.

**Lag 3 input**:
- `behaviorProfile.ambitionProfile`
- `recruitmentLogic.type`
- `evidenceProfile.transferableStrengths[0..1]`
- `authenticityProfile.passionIndicators.themes[0]`

**Tone-retningslinjer**:
- Undgå: "Erfaren og engageret X med passion for Y"
- Undgå: buzzwords som "resultatdrevet", "proaktiv", "dynamisk"
- Foretruk: konkret faglig identitet + specifik kontekst

**Stærkt eksempel**:
> "Projektkoordinator med 11 års erfaring i interessentstyring og intern kommunikation — søger stabilitet, ikke nødvendigvis forfremmelse."

**Svagt eksempel**:
> "Ambitiøs og resultatorienteret projektkoordinator med passion for mennesker og processer."

**Anti-mønstre**:
- Antag ikke `upward` ambition medmindre `ambitionProfile = "upward"` eksplicit
- Brug ikke "leder" i headline for profiler med `ambitionProfile = "less_responsibility"`

---

## Sektion 2: Kernekompetencer

**Formål**: 3-5 bullets med konkrete, evidensunderbyggede kompetencer.

**Lag 3 input**:
- `evidenceProfile.transferableStrengths`
- `hiddenStrengths.identified`
- `evidenceProfile.evidenceClassification` (brug kun `explicit_fact` og `verified_result`)

**Tone-retningslinjer**:
- Hvert punkt skal have en handling + kontekst, ikke bare et nøgleord
- Undgå generiske nominaliseringer ("kommunikation", "samarbejde" alene)
- Foretruk sætningsfragmenter med specificitet

**Stærkt eksempel**:
> "Koordinering af interessenter på tværs af fem afdelinger i komplekse renoveringsprojekter"

**Svagt eksempel**:
> "Stærk kommunikator med erfaring inden for projektledelse og samarbejde"

**Korrektionsadfærd**:
- Hvis bruger fjerner et punkt → fjern det, tilføj ikke noget tilsvarende
- Hvis bruger omformulerer → bevar den nye formulering eksakt
- Tilføj ikke points der ikke er dækket af `evidenceProfile`

---

## Sektion 3: Professionel baggrund (narrativ)

**Formål**: 2-4 sætninger der etablerer faglig historik — kronologisk eller tematisk.

**Lag 3 input**:
- `evidenceProfile.sourceQuality`
- `behaviorProfile.narrativeSummary`
- `authenticityProfile.authenticVoiceMarkers`
- `lifestyleProfile.preferredEnvironment`

**Tone-retningslinjer**:
- Skriv i første person ("Jeg har") for CV og LinkedIn, tredje person ("Claus har") for kandidatpræsentation
- Lad `authenticVoiceMarkers.raw` inspirere konkrete formuleringer
- Undgå periodeformulering ("Igennem mine X år") — start med det konkrete

**Stærkt eksempel**:
> "Jeg har stået for den daglige koordinering af store renoveringsprojekter, inklusiv interessentstyring og dokumentation. Mit arbejde har typisk involveret at holde overblik, når mange parter skal bevæge sig i samme retning."

**Svagt eksempel**:
> "Igennem mine 11 år som projektkoordinator har jeg opbygget en bred vifte af kompetencer inden for projektledelse og kommunikation."

**Anti-mønstre**:
- Brug ikke `user_claim` fra `evidenceClassification` som fakta — formuler som fortolkning
- Indsæt ikke `passionIndicators` der ikke optræder i `raw` fra autenticitetsprofilen

---

## Sektion 4: Retningserklæring

**Formål**: 1-3 sætninger der beskriver hvad personen søger — ærligt og præcist.

**Lag 3 input**:
- `behaviorProfile.ambitionProfile`
- `recruitmentLogic.type`
- `lifestyleProfile.hardBoundaries`
- `authenticityProfile.valueAnchors.themes`

**Tone-retningslinjer**:
- Matér sproget til `ambitionProfile`: "less_responsibility" bruger ikke "karriereudvikling"
- Nævn eksplicitte grænser kun hvis de er positive (hvad de søger, ikke hvad de undgår)
- For `unclear` ambition: formuler som "søger afklaring" eller "overvejer X og Y"

**Stærkt eksempel (less_responsibility)**:
> "Jeg søger en rolle som rådgiver eller bestyrelsesmedlem, hvor jeg kan bidrage med min erfaring uden det operationelle daglige ansvar."

**Svagt eksempel**:
> "Jeg er klar til nye udfordringer og søger en spændende stilling, der kan videreudvikle min karriere."

**Korrektionsadfærd**:
- Hvis bruger angiver andet mål end `ambitionProfile` → opdater `ambitionProfile` og omformuler
- Tillad aldrig "lederstilling" i en retningserklæring for `less_responsibility`-profil uden eksplicit brugerkorrektion

---

## Sektion 5: Styrker og differentiering

**Formål**: Hvad adskiller denne person fra en generisk profil?

**Lag 3 input**:
- `hiddenStrengths.identified`
- `authenticityProfile.selfPresentationBias`
- `behaviorProfile.selfImageGap`
- `evidenceProfile.evidenceClassification` (kun `verified_result`)

**Tone-retningslinjer**:
- Fremhæv `hiddenStrengths` frem for de åbenlyse
- Hvis `selfPresentationBias.direction = "undersells"` → løft formuleringerne aktivt
- Undgå hype: "exceptionel", "best-in-class", "top performer"

**Stærkt eksempel**:
> "Rasmus er ualmindelig god til at holde komplekse koordineringsprocesser i gang uden at insistere på at være den synlige leder — en egenskab der sjældent fremgår af et CV."

**Svagt eksempel**:
> "Rasmus er en stærk teamplayer med gode kommunikationsevner."

---

## Sektion 6: Interviewparathed (intern brug)

**Formål**: Ikke synlig for rekrutterere — bruges til at forberede brugeren.

**Lag 3 input**:
- `interviewReadiness.vulnerabilities`
- `interviewReadiness.preparationPriorities`
- `interviewReadiness.interviewStrengths`
- `authenticityProfile.authenticVoiceMarkers.isScripted`

**Output**:
```
Styrker i interviewformat:
- [liste fra interviewStrengths]

Forbered dig på:
- [liste fra preparationPriorities med forklaringer]

Potentielle svage punkter:
- [liste fra vulnerabilities med konkrete tips]
```

**Anti-mønstre**:
- Vis aldrig denne sektion i offentlige profiltekster
- Undgå at formulere svagheder som anklagelser ("du undersælger dig selv")

---

## Sektion 7: Autenticitetscheck (intern brug)

**Formål**: Redaktionel kvalitetskontrol — ikke brugervendt.

**Lag 3 input**:
- `authenticityProfile.authenticityScore`
- `authenticityProfile.selfPresentationBias`
- `authenticityProfile.authenticVoiceMarkers.isScripted`

**Output**:
```
Autenticitetsscoring: [high|medium|low]
Rationale: [rationale]

Risici:
- [hvis isScripted = true]: Teksten lyder indstudereret — overvej mere specifik sprogbrug
- [hvis oversells + high]: Profilteksten risikerer at skabe urealistiske forventninger
- [hvis undersells + high]: Profilstyrkerne er undervurderede — overvej stærkere formuleringer
```

---

## Sektion 8: Korrektionssporingslog

**Formål**: Spor brugerens korrektioner af AI-fortolkninger for fremtidigt læring (korrektionskontrakten, Decision 21).

```typescript
type CorrectionEntry = {
  field: string;              // hvilket Lag 3-felt blev korrigeret
  originalValue: unknown;     // hvad AI infererede
  correctedValue: unknown;    // hvad brugeren rettede til
  timestamp: string;
  correctionSource: "user_explicit" | "user_rewrite" | "user_deletion";
};
```

**Regler**:
- Korrektioner persisteres (Decision 22) og bruges til at justere fremtidige Lag 3-inferenser
- En korrektion af `ambitionProfile` medfører automatisk reformulering af sektionerne 1, 4 og 5
- Korrektioner er ikke tilbageskrives til `interviewState` — de er et separat lag

---

## Generelle Lag 4 anti-mønstre

| Anti-mønster | Årsag |
|---|---|
| "passion for mennesker" | Generisk, ikke verificeret af autenticitetsprofil |
| "erfaren og engageret" | Kvalificeres ikke — alle er det i CV |
| Brug af "leder" for `less_responsibility` | Intention violation |
| Brug af karrieresnak for `same_track` profiler | Antager ambition der ikke er der |
| Indsætning af `user_claim` som fakta | Evidensniveau respekteres ikke |
| Undladelse af usikkerheder ved `confidence: "low"` | Skaber falsk præcision |

---

## Versionering

- **v0.1** (2026-05-13): Initialudkast. Lag 4 eksisterer endnu ikke som pipeline-komponent. Dette dokument definerer prompt-arkitektur og outputkrav for M2-implementering.
