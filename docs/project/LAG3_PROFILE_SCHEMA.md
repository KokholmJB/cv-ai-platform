# LAG 3 PROFIL-SCHEMA

Lag 3 er autenticitets- og værdimatchlaget i den fire-lags AI pipeline (se Decision 20). Det tager Lag 2's kvantitative profil som input og producerer en fortolket, menneskelig profil der inkluderer autenticitetsmønstre, værdianker og selvpræsentationsbias.

Dette dokument definerer det tekniske schema for alle felter i Lag 3-outputtet.

---

## Forskellen fra nuværende completionAnalysis

Den nuværende `completionAnalysis` (Lag 2-equivalent) er regelbaseret og deterministisk. Lag 3 adskiller sig ved:

- Integrerer LLM-fortolkning på tværs af alle dimensioner
- Producerer en samlet autenticitetsprofil (ikke kun evidensklassifikation)
- Separerer brugerens "officielle" selvfortælling fra den afdækkede "faktiske" profil
- Generer korrigerbar output: hvert felt har `confidence` og `source`

---

## Lag 3 outputstruktur

```typescript
type Lag3Profile = {
  // Dimension 1: Evidensprofil
  evidenceProfile: Lag3EvidenceProfile;

  // Dimension 2: Adfærdsprofil
  behaviorProfile: Lag3BehaviorProfile;

  // Dimension 3: Kommunikationsprofil
  communicationProfile: Lag3CommunicationProfile;

  // Dimension 4: Livsstilsprofil
  lifestyleProfile: Lag3LifestyleProfile;

  // Dimension 5: Rekrutteringslogik
  recruitmentLogic: Lag3RecruitmentLogic;

  // Kapacitet A: Skjulte styrker
  hiddenStrengths: Lag3HiddenStrengths;

  // Kapacitet B: Energibetingelser
  energyConditions: Lag3EnergyConditions;

  // Kapacitet C: Interviewparathed
  interviewReadiness: Lag3InterviewReadiness;

  // Autenticitetsprofil (Lag 3-specifikt)
  authenticityProfile: Lag3AuthenticityProfile;
};
```

---

## Dimension 1: Evidensprofil

```typescript
type Lag3EvidenceProfile = {
  evidenceClassification: EvidenceClassificationItem[];
  evidenceStrengthVsGoal: "sufficient" | "borderline" | "insufficient";
  transferableStrengths: string[];

  // Lag 3-tilføjelse: kildekvalitet
  sourceQuality: {
    explicitFacts: number;       // antal verificerede facts
    selfClaims: number;          // antal udokumenterede påstande
    verifiedResults: number;     // antal resultater med kvantificerbar effekt
  };
  confidence: "high" | "medium" | "low";
  source: "lag2_inference" | "lag3_synthesis";
};

type EvidenceClassificationItem = {
  statement: string;
  classification: "explicit_fact" | "user_claim" | "verified_result" | "inferred_strength";
  evidenceLevel: "strong" | "moderate" | "weak";
};
```

**Evidenskrav for `sufficient`**: mindst 2 `verified_result` + mindst 3 `explicit_fact`.  
**Evidenskrav for `borderline`**: mindst 1 `verified_result` ELLER mindst 2 `explicit_fact`.  
**Ellers**: `insufficient`.

---

## Dimension 2: Adfærdsprofil

```typescript
type Lag3BehaviorProfile = {
  behaviorUnderPressure: "problem_solver" | "withdraws" | "seeks_support" | "takes_control" | "unclear";
  naturalTeamRole: "initiator" | "executor" | "coordinator" | "specialist" | "unclear";
  decisionStyle: "analytical" | "intuitive" | "consensus_seeking" | "action_oriented";
  ambitionProfile: "upward" | "lateral" | "less_responsibility" | "better_conditions" | "unclear";
  selfImageGap: {
    likelySeverity: "low" | "medium" | "high";
    signals: string[];           // konkrete signaler der begrunder vurderingen
  };

  // Lag 3-tilføjelse: adfærdsmønsterbeskrivelse
  narrativeSummary: string;      // 2-3 sætninger om adfærdsprofil på dansk
  confidence: "high" | "medium" | "low";
  source: "lag2_inference" | "lag3_synthesis";
};
```

**Regler**:
- `selfImageGap.likelySeverity = "high"` udløser specifik sårbarhed i `interviewReadiness`
- `ambitionProfile` må aldrig sættes til "upward" for `less_responsibility`-profiler
- `naturalTeamRole: "unclear"` er tilladt ved < 3 interviewsvar om samarbejdsstil

---

## Dimension 3: Kommunikationsprofil

```typescript
type Lag3CommunicationProfile = {
  selfPromotionComfort: "comfortable" | "balanced" | "reluctant";
  recruitmentFormatVulnerabilities: RecruitmentVulnerability[];
  credibilityInConversation: "strong" | "moderate" | "weak";
  languageNormalization: "minimizes" | "neutral" | "overstates";

  // Lag 3-tilføjelse: kommunikationsstyrker
  communicationStrengths: string[];   // fx ["tydelig struktur", "konkrete eksempler"]
  adaptationCapacity: "high" | "medium" | "low";  // evne til at justere til rekrutterpublikum
  confidence: "high" | "medium" | "low";
  source: "lag2_inference" | "lag3_synthesis";
};

type RecruitmentVulnerability =
  | "structured_competency"
  | "small_talk"
  | "salary_negotiation"
  | "self_promotion_moment"
  | "case_interview"
  | "panel_interview";
```

---

## Dimension 4: Livsstilsprofil

```typescript
type Lag3LifestyleProfile = {
  workIntensityPreference: "high" | "steady" | "low";
  flexibilityNeeds: {
    workLocation: "remote" | "hybrid" | "onsite" | "unclear";
    scheduleFlexibility: "high" | "moderate" | "low";
  };
  lifestyleFit: string;           // beskrivelse: hvad passer til denne person
  sustainabilityRisk: "high" | "medium" | "low";

  // Lag 3-tilføjelse: grænser og betingelser
  hardBoundaries: string[];       // absolutte nej-betingelser
  preferredEnvironment: string;   // 1 sætning om ideelt arbejdsmiljø
  confidence: "high" | "medium" | "low";
  source: "lag2_inference" | "lag3_synthesis";
};
```

**Regler**:
- `workIntensityPreference: "high"` forbudt for `less_responsibility` og `same_track_better_conditions` med livsstilssignaler
- `sustainabilityRisk: "high"` udløser specifik sårbarhed i `interviewReadiness`

---

## Dimension 5: Rekrutteringslogik

```typescript
type Lag3RecruitmentLogic = {
  type:
    | "cv_and_experience"
    | "portfolio_and_proof"
    | "personality_and_culture"
    | "chemistry_and_fit"
    | "documented_results"
    | "network_and_referral";
  confidence: "high" | "medium" | "low";

  // Lag 3-tilføjelse: rekrutteringsstrategi
  primaryChannel: string;          // anbefalet primær kanal
  pitchStrength: "strong" | "adequate" | "needs_work";
  cvRelevance: "high" | "medium" | "low";  // hvor vigtigt CV er for denne profil
  source: "lag2_inference" | "lag3_synthesis";
};
```

---

## Kapacitet A: Skjulte styrker

```typescript
type Lag3HiddenStrengths = {
  identified: string[];   // styrker brugeren ikke selv fremhæver
  source: string[];       // hvilke svar/data de er udledt fra
  confidence: "high" | "medium" | "low";
};
```

---

## Kapacitet B: Energibetingelser

```typescript
type Lag3EnergyConditions = {
  peaksAt: string[];      // situationer/opgaver der giver energi
  strugglesAt: string[];  // situationer/opgaver der dræner energi
  confidence: "high" | "medium" | "low";
  source: "lag2_inference" | "lag3_synthesis";
};
```

---

## Kapacitet C: Interviewparathed

```typescript
type Lag3InterviewReadiness = {
  overall: "ready" | "needs_preparation" | "significant_gaps";
  vulnerabilities: string[];       // specifikke svage punkter med forklaring
  preparationPriorities: string[]; // hvad brugeren bør forberede sig på

  // Lag 3-tilføjelse: styrker i interviewformat
  interviewStrengths: string[];
  confidence: "high" | "medium" | "low";
  source: "lag2_inference" | "lag3_synthesis";
};
```

---

## Autenticitetsprofil (Lag 3-eksklusivt)

```typescript
type Lag3AuthenticityProfile = {
  // Passionsindikatorer: sproglige markører for ægte engagement
  passionIndicators: {
    raw: string[];           // fundne fraser fra interviewsvar
    themes: string[];        // LLM-fortolkede temaer
    strength: "strong" | "moderate" | "weak" | "absent";
  };

  // Værdianker: hvad der ikke forhandles
  valueAnchors: {
    raw: string[];
    themes: string[];
    anchored: boolean;       // har brugeren klare, eksplicitte værdier?
  };

  // Autentisk stemme: selvstændig vs. konstrueret fortælling
  authenticVoiceMarkers: {
    raw: string[];
    isScripted: boolean;     // lyder svaret som et indstudereret svar?
    specificity: "high" | "medium" | "low";  // konkrete vs. generiske udsagn
  };

  // Selvpræsentationsbias: afstand fra "officiel" til "faktisk" profil
  selfPresentationBias: {
    direction: "undersells" | "neutral" | "oversells";
    severity: "high" | "medium" | "low";
    evidence: string[];
  };

  // Samlet autenticitetsscoring
  authenticityScore: {
    overall: "high" | "medium" | "low";
    rationale: string;       // 1-2 sætninger på dansk
  };
};
```

**Regler**:
- `selfPresentationBias.direction = "undersells"` + `severity = "high"` → udløser "Potentiel selvtillidsudfordring" i `interviewReadiness`
- `authenticVoiceMarkers.isScripted = true` → udløser "Autenticitet i interviewformat" som sårbarhed
- `passionIndicators.strength = "absent"` → noteret i `interviewReadiness.preparationPriorities`
- `valueAnchors.anchored = false` → udløser spørgsmålsprioritet om motivation og grænser

---

## Confidence og source

Alle felter har:
- `confidence: "high" | "medium" | "low"` — baseret på evidensmængde og konsistens
- `source: "lag2_inference" | "lag3_synthesis"` — om feltet er overtaget fra regelbaseret Lag 2 eller LLM-fortolket i Lag 3

Felter med `source: "lag2_inference"` kan genbruges direkte. Felter med `source: "lag3_synthesis"` kræver korrektionskontrakten (Decision 21) for at brugeren kan rette dem.

---

## Versionering

- **v0.1** (2026-05-13): Initialudkast. Lag 3 eksisterer endnu ikke som pipeline-komponent. Dette schema definerer målarkitekturen for M2-implementering.
- Nuværende `completionAnalysis` i route.ts svarer til et subset af Lag 2-output (regelbaseret).
