import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

type FocusArea =
  | "current_work_reality"
  | "level_seniority"
  | "transferable_strengths"
  | "direction_change"
  | "work_style_fit"
  | "mismatch_risk";

type InterviewState = {
  answeredTurns: number;
  coveredFocusAreas: FocusArea[];
  recentQuestions?: { question: string; focusArea: FocusArea }[];
  coverage?: Record<string, boolean>;
  progressMeta?: {
    evidenceScore: number;
    lastEvidenceDelta: "none" | "modest" | "strong";
  };
};

type ContinueResponse = {
  ok: true;
  status: "continue";
  question: string;
  focusArea: FocusArea;
  interviewState: InterviewState;
};

type CompleteResponse = {
  ok: true;
  status: "complete";
  interviewState: InterviewState;
  profileSummary?: unknown;
  readinessAssessment?: unknown;
  profileModel?: {
    facts?: unknown[];
    interpretations?: unknown[];
    uncertainties?: unknown[];
    hypotheses?: unknown[];
    communicationSignals?: Record<string, unknown>;
  };
  hypothesisSummary?: unknown[];
  uncertaintySummary?: unknown[];
  communicationSignals?: Record<string, unknown>;
};

type ErrorResponse = {
  ok: false;
  error?: string;
  reasonCode?: string;
  lastFailureReasonCode?: string;
  retryTrail?: string[];
  lowQualityReason?: string;
};

type InterviewResponse = ContinueResponse | CompleteResponse | ErrorResponse;

type ProfileDraft = {
  name: string;
  currentRole: string;
  yearsExperience: string;
  targetDirection: string;
};

type AnswerStrategy = {
  defaultAnswers: string[];
  byFocusArea?: Partial<Record<FocusArea, string>>;
  byFamily?: Partial<Record<SemanticFamily, string>>;
};

type ManualPersona = {
  id: string;
  description: string;
  profileDraft: ProfileDraft;
  answerStrategy: AnswerStrategy;
  expectedProductBehaviorNotes: string[];
  reviewChecklist: string[];
  driftPatterns: { label: string; pattern: RegExp }[];
  needsUncertainty: boolean;
  suspiciousEarlyTurns: number;
  maxTurns?: number;
};

type SemanticFamily =
  | "mismatch_risk"
  | "ownership"
  | "current_work_reality"
  | "resultEvidence"
  | "product_ownership"
  | "responsibility"
  | "domain_context";

const divider = "=".repeat(60);
const defaultMaxTurns = 8;

const semanticFamilyPatterns: Record<SemanticFamily, RegExp[]> = {
  mismatch_risk: [/undga|daarlig|bad match|no-go|passer ikke|risiko|fravalg|avoid/iu],
  ownership: [/ansvar|ejede|ejer|beslut|myndighed|stod for|ownership/iu],
  current_work_reality: [/branche|nuvaerende|hverdag|rolle|arbejde|opgaver|drift/iu],
  resultEvidence: [/resultat|eksempel|case|konkret|effekt|forbedr|bevis/iu],
  product_ownership: [/backlog|roadmap|product|produkt|prioritering|produktejer/iu],
  responsibility: [/mere ansvar|mindre ansvar|personaleansvar|ledelse|leder|responsibility/iu],
  domain_context: [/branche|domaene|sektor|marked|kunder|industri/iu],
};

const manualPersonas: ManualPersona[] = [
  {
    id: "manual-unclear-calm",
    description:
      "User is unsure and weak at self-formulation. They want more calm and less pressure but cannot name an ideal job.",
    profileDraft: {
      name: "Camilla",
      currentRole: "Butiksmedarbejder",
      yearsExperience: "6 aar med butik, kunder, vareopfyldning, kasse og aabne/lukke ansvar.",
      targetDirection:
        "Jeg ved ikke helt hvad jeg vil. Jeg vil bare have mere ro, mindre pres og en hverdag jeg kan holde til.",
    },
    answerStrategy: {
      defaultAnswers: [
        "Det er lidt svaert at forklare. Jeg kan godt lide at hjaelpe kunder, men jeg bliver traet af tempoet og alt det uforudsigelige.",
        "Jeg har ikke et bestemt jobnavn. Jeg ved bare, at det skal vaere mere roligt og med tydeligere rammer.",
      ],
      byFocusArea: {
        current_work_reality:
          "Min hverdag er kunder, kasse, vareopfyldning, reklamationer og at faa butikken til at fungere naar der er travlt.",
        work_style_fit:
          "Jeg fungerer bedst naar opgaverne er tydelige, stemningen er ordentlig, og der ikke hele tiden kommer nye akutte ting.",
        mismatch_risk:
          "Jeg vil helst undgaa sene vagter, daarlig stemning og en chef der presser folk uden at forklare hvad der er vigtigst.",
        direction_change:
          "Jeg ved ikke om det er et skift eller bare en roligere service-rolle. Jeg har brug for at finde ud af hvad der passer.",
        level_seniority:
          "Jeg har haft ansvar for aabning og lukning nogle gange, men jeg har ikke vaeret leder og soeger heller ikke ledelse.",
        transferable_strengths:
          "Jeg er god til kunder, holde overblik og skabe ro, men jeg har ikke store flotte resultater at vise.",
      },
    },
    expectedProductBehaviorNotes: [
      "Should help clarify boundaries without pushing a default career change.",
      "Should accept uncertainty and avoid making the user sound more decided than they are.",
      "Should ask practical, grounding questions about energy, no-go conditions and nearby role types.",
    ],
    reviewChecklist: [
      "Did it avoid pushing a direction?",
      "Did it ask strategic clarification questions?",
      "Did it respect weak self-formulation?",
      "Does the final profile keep uncertainty explicit?",
    ],
    driftPatterns: [
      { label: "possible leadership push", pattern: /vil du.{0,80}(leder|ledelse|personaleansvar)/iu },
      { label: "possible promotion push", pattern: /naeste niveau|mere ansvar|forfremmelse|opad/iu },
      { label: "possible forced career change", pattern: /du skal skifte|klart karriereskift|ny retning er bedst/iu },
    ],
    needsUncertainty: true,
    suspiciousEarlyTurns: 2,
  },
  {
    id: "manual-same-role-better-conditions",
    description:
      "User wants roughly the same type of job again, but with better structure, less stress and better management.",
    profileDraft: {
      name: "Ali",
      currentRole: "Lagermedarbejder",
      yearsExperience: "8 aar med lager, pluk og pak, truck, varemodtagelse og daglig drift.",
      targetDirection:
        "Jeg vil gerne have samme type lagerjob igen, bare med bedre struktur, mindre stress og en bedre leder.",
    },
    answerStrategy: {
      defaultAnswers: [
        "Jeg vil egentlig bare have lager igen. Ikke noget fancy. Det skal bare vaere mere ordentligt planlagt.",
        "Jeg er ikke ude efter at blive leder. Jeg vil have et stabilt sted hvor tingene fungerer.",
      ],
      byFocusArea: {
        current_work_reality:
          "Jeg plukker, pakker, scanner, koerer truck og hjaelper med at faa ordrer ud. Nogle dage er det meget brandslukning.",
        work_style_fit:
          "Jeg arbejder bedst med faste vagter, klare opgaver og en leder der siger tingene i god tid.",
        mismatch_risk:
          "Jeg vil undgaa konstant overarbejde, skiftende vagter og ledere der bliver sure naar planen selv er daarlig.",
        level_seniority:
          "Jeg tager ansvar for mine egne opgaver og hjaelper nye folk lidt, men jeg vil ikke have personaleansvar.",
        transferable_strengths:
          "Jeg er stabil, hurtig nok og laver ikke mange fejl, men jeg har ikke tal paa det.",
      },
    },
    expectedProductBehaviorNotes: [
      "Should allow same-track intent without inventing promotion or direction change.",
      "Should focus on fit, conditions, manager quality and realistic same-role matching.",
    ],
    reviewChecklist: [
      "Did it allow the user to want the same kind of work?",
      "Did it avoid promotion or leadership assumptions?",
      "Did it capture better conditions as the real goal?",
    ],
    driftPatterns: [
      {
        label: "possible promotion push",
        pattern: /(vil du|onsker du|kunne du|ser du|naeste skridt).{0,80}(naeste niveau|forfremmelse|mere ansvar|lederrolle)/iu,
      },
      {
        label: "possible career-change push",
        pattern: /(vil du|onsker du|kunne du|ser du|naeste skridt).{0,80}(skifte retning|ny branche|karriereskift)/iu,
      },
      { label: "possible product drift", pattern: /product manager|produktejer|roadmap|backlog/iu },
    ],
    needsUncertainty: false,
    suspiciousEarlyTurns: 1,
  },
  {
    id: "manual-senior-less-responsibility",
    description:
      "User has held high responsibility but wants less pressure while still using experience.",
    profileDraft: {
      name: "Lars",
      currentRole: "Senior projektchef",
      yearsExperience: "20 aar med store projekter, budget, kunder, ledelse, eskaleringer og styring.",
      targetDirection:
        "Jeg vil gerne have mindre ansvar, lavere pres og bedre balance, men stadig bruge min erfaring.",
    },
    answerStrategy: {
      defaultAnswers: [
        "Jeg vil ikke laengere opad. Jeg vil gerne vaere nyttig, men jeg orker ikke at vaere den der altid ejer alle eskaleringer.",
        "Jeg ved ikke praecist om titlen er senior projektleder eller specialist. Det vigtigste er mindre pres.",
      ],
      byFamily: {
        responsibility:
          "Jeg har haft ansvar for budgetter, kunder, teams og svare beslutninger. Fremover vil jeg gerne have mindre topansvar.",
        mismatch_risk:
          "Et daarligt match er store programmer, konstant eskalering, politik og forventning om at jeg altid er paa.",
      },
      byFocusArea: {
        work_style_fit:
          "Jeg vil gerne arbejde mere raadsom og erfaringsbaseret, med roligere tempo og tydelige graenser for ansvar.",
        level_seniority:
          "Jeg kan godt tage fagligt ansvar og vejlede andre, men jeg vil ikke eje hele budgettet eller have tung personaleledelse.",
        transferable_strengths:
          "Jeg er god til struktur, risici, kunder og at se problemer tidligt. Jeg kan bruge det uden at vaere oeverste ansvarlige.",
        direction_change:
          "Det er ikke et karriereskift. Det er mere en nedskalering af pres og ansvar.",
      },
    },
    expectedProductBehaviorNotes: [
      "Should not push upward progression, leadership or more responsibility.",
      "Should distinguish less role pressure from lower competence.",
      "Should capture what responsibility remains acceptable and what must be reduced.",
    ],
    reviewChecklist: [
      "Did it avoid upward-pressure assumptions?",
      "Did it ask what should fill less and what experience can still be used?",
      "Does the final profile frame this as sustainable fit, not failure?",
    ],
    driftPatterns: [
      { label: "possible upward responsibility push", pattern: /mere ansvar|stoerre ansvar|naeste niveau|opad/iu },
      { label: "possible leadership progression", pattern: /mere ledelsesansvar|stor lederrolle|director|head of/iu },
    ],
    needsUncertainty: true,
    suspiciousEarlyTurns: 3,
  },
  {
    id: "manual-specialist-no-people-management",
    description:
      "User wants to stay specialist, deepen expertise and avoid personnel leadership.",
    profileDraft: {
      name: "Jonas",
      currentRole: "Data specialist",
      yearsExperience: "11 aar med analyser, datamodeller, rapportering, kvalitetssikring og faglig raadgivning.",
      targetDirection:
        "Jeg vil gerne blive dybere faglig specialist i data. Jeg vil ikke have personaleledelse.",
    },
    answerStrategy: {
      defaultAnswers: [
        "Jeg vil helst blive bedre fagligt. Jeg gider ikke MUS, personaleansvar eller at bruge det meste af tiden paa ledelse.",
        "Jeg kan godt raadgive andre, men jeg vil stadig selv vaere taet paa data og analyse.",
      ],
      byFamily: {
        ownership:
          "Jeg ejer ofte rapportlogik, datakvalitet og analysegrundlag, men jeg leder ikke mennesker.",
        resultEvidence:
          "Et resultat var en rapportmodel der fjernede noget manuelt arbejde og gjorde tallene mere stabile, men jeg har ikke en perfekt business case.",
      },
      byFocusArea: {
        current_work_reality:
          "Jeg bygger rapporter, tjekker datakvalitet, laver analyser og hjaelper fagteams med at forstaa tallene.",
        work_style_fit:
          "Jeg trives med fordybelse, faglige problemer og tid til at goere tingene ordentligt.",
        mismatch_risk:
          "Et daarligt match er en lederrolle hvor jeg mister fagligheden og mest sidder i personaleopgaver.",
        level_seniority:
          "Jeg har fagligt ansvar for loesninger og standarder, men ikke personaleansvar.",
      },
    },
    expectedProductBehaviorNotes: [
      "Should not equate senior specialist growth with people management.",
      "Should test depth, impact and technical responsibility without pushing leadership.",
    ],
    reviewChecklist: [
      "Did it respect the no-people-management preference?",
      "Did it ask about specialist depth and impact?",
      "Does the final profile preserve specialist identity?",
    ],
    driftPatterns: [
      { label: "possible people-management push", pattern: /personaleansvar|people manager|leder for medarbejdere/iu },
      { label: "possible leadership push", pattern: /vil du.{0,80}(leder|ledelse|teamleder)/iu },
    ],
    needsUncertainty: false,
    suspiciousEarlyTurns: 2,
  },
  {
    id: "manual-product-transition-gap",
    description:
      "User wants to move from project or delivery coordination toward product work, but evidence is mixed and gaps need realistic handling.",
    profileDraft: {
      name: "Maria",
      currentRole: "Projektleder",
      yearsExperience:
        "8 aar med projektleverancer, koordinering, interessenter, prioriteringsoplaeg og implementering.",
      targetDirection:
        "Jeg vil gerne mod Product Manager eller product owner, men jeg har ikke haft formelt roadmap- eller backlogansvar.",
    },
    answerStrategy: {
      defaultAnswers: [
        "Jeg har arbejdet taet paa krav og prioritering, men jeg har ikke ejet produktet alene.",
        "Jeg ved godt at der er et hul. Jeg vil gerne finde en realistisk overgang, ikke bare kalde mig PM uden beviser.",
      ],
      byFamily: {
        product_ownership:
          "Jeg har ikke haft formelt roadmap-ejerskab. Jeg har samlet input, lavet prioriteringsoplaeg og fulgt beslutninger til doers.",
        ownership:
          "Jeg ejede projektplan, leverancer og opfoelgning, men produktbeslutninger blev taget sammen med ledelse og faglige ejere.",
        resultEvidence:
          "Et projekt fik bedre beslutningsflow og faerre forsinkelser, men jeg har ikke haarde tal paa effekten.",
        mismatch_risk:
          "Et daarligt match er en rolle der forventer tung product discovery fra dag et uden onboarding eller stoette.",
      },
      byFocusArea: {
        direction_change:
          "Jeg ser det som en overgang. Maaske product coordinator, associate PM eller product owner i en mindre kompleks kontekst foerst.",
        transferable_strengths:
          "Mine styrker er koordinering, krav, interessenter, struktur og at omsaette behov til leverancer.",
        work_style_fit:
          "Jeg trives med tvaerfagligt arbejde, prioritering og beslutninger, men jeg skal stadig bygge mere produktfaglighed.",
      },
    },
    expectedProductBehaviorNotes: [
      "Should separate project coordination evidence from formal product ownership.",
      "Should challenge gaps realistically without denying the transition.",
      "Should complete with explicit uncertainty if evidence remains mixed.",
    ],
    reviewChecklist: [
      "Did it distinguish delivery coordination from product ownership?",
      "Did it avoid simply approving or denying the transition?",
      "Does it name a realistic next-step role or gap?",
    ],
    driftPatterns: [
      { label: "possible denial of transition", pattern: /ikke realistisk|umuligt|kan ikke|boer ikke/iu },
      { label: "possible formal ownership assumption", pattern: /du har tydeligt ejet roadmap|klart produktansvar/iu },
    ],
    needsUncertainty: true,
    suspiciousEarlyTurns: 3,
  },
];

function loadLocalEnv() {
  const envPath = join(process.cwd(), ".env.local");

  if (!existsSync(envPath)) {
    return;
  }

  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [key, ...valueParts] = trimmed.split("=");
    const value = valueParts.join("=").trim().replace(/^["']|["']$/g, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

async function loadInterviewPost() {
  const routeUrl = pathToFileURL(join(process.cwd(), "src/app/api/onboarding/interview/route.ts")).href;
  const routeModule = (await import(routeUrl)) as { POST: (request: Request) => Promise<Response> };
  return routeModule.POST;
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function inferSemanticFamilies(question: string, focusArea?: FocusArea): SemanticFamily[] {
  const families = new Set<SemanticFamily>();

  if (focusArea === "mismatch_risk") {
    families.add("mismatch_risk");
  }

  if (focusArea === "current_work_reality") {
    families.add("current_work_reality");
  }

  for (const [family, patterns] of Object.entries(semanticFamilyPatterns) as [SemanticFamily, RegExp[]][]) {
    if (patterns.some((pattern) => pattern.test(question))) {
      families.add(family);
    }
  }

  return [...families];
}

function pickManualAnswer(persona: ManualPersona, question: string, focusArea: FocusArea, turnIndex: number) {
  for (const family of inferSemanticFamilies(question, focusArea)) {
    const answer = persona.answerStrategy.byFamily?.[family];

    if (answer) {
      return answer;
    }
  }

  const focusAnswer = persona.answerStrategy.byFocusArea?.[focusArea];

  if (focusAnswer) {
    return focusAnswer;
  }

  return persona.answerStrategy.defaultAnswers[turnIndex % persona.answerStrategy.defaultAnswers.length];
}

function computeProgress(response: InterviewResponse, interviewState: InterviewState) {
  if (response.ok && response.status === "complete") {
    return 100;
  }

  const coverageCount = Object.values(interviewState.coverage ?? {}).filter(Boolean).length;
  const answeredTurns = interviewState.answeredTurns ?? 0;
  const focusBreadth = new Set(interviewState.coveredFocusAreas ?? []).size;
  const evidenceScore = interviewState.progressMeta?.evidenceScore ?? 0;

  return Math.min(99, Math.round(answeredTurns * 5 + coverageCount * 4 + focusBreadth * 3 + evidenceScore / 2));
}

function countArray(value: unknown) {
  return Array.isArray(value) ? value.length : 0;
}

function formatModelItem(item: unknown) {
  if (!item || typeof item !== "object" || Array.isArray(item)) {
    return String(item);
  }

  const record = item as Record<string, unknown>;
  const label = typeof record.key === "string" ? `[${record.key}] ` : "";
  const statement = typeof record.statement === "string" ? record.statement : JSON.stringify(record);
  const suffixParts = [
    typeof record.confidence === "string" ? `confidence=${record.confidence}` : null,
    typeof record.supportLevel === "string" ? `support=${record.supportLevel}` : null,
    typeof record.impact === "string" ? `impact=${record.impact}` : null,
    typeof record.unresolved === "boolean" ? `unresolved=${record.unresolved}` : null,
  ].filter(Boolean);

  return `${label}${statement}${suffixParts.length ? ` (${suffixParts.join(", ")})` : ""}`;
}

function printModelSection(label: string, items: unknown[] | undefined) {
  console.log(`- ${label}:`);

  if (!items?.length) {
    console.log("  none");
    return;
  }

  for (const item of items) {
    console.log(`  - ${formatModelItem(item)}`);
  }
}

function detectReviewHints({
  persona,
  completeResponse,
  questions,
  turns,
  completed,
}: {
  persona: ManualPersona;
  completeResponse: CompleteResponse | null;
  questions: string[];
  turns: number;
  completed: boolean;
}) {
  const hints: string[] = [];
  const normalizedQuestions = questions.map(normalizeText);
  const repeatedQuestion = normalizedQuestions.some((question, index) => normalizedQuestions.indexOf(question) !== index);
  const profileModel = completeResponse?.profileModel;
  const uncertaintyCount =
    countArray(profileModel?.uncertainties) + countArray(completeResponse?.uncertaintySummary);
  const transcriptText = normalizeText(
    JSON.stringify({
      questions,
      profileSummary: completeResponse?.profileSummary,
      readinessAssessment: completeResponse?.readinessAssessment,
      profileModel,
    }),
  );
  const driftMatches = persona.driftPatterns
    .filter((item) => item.pattern.test(transcriptText))
    .map((item) => item.label);

  hints.push(completed ? "GREEN completed within max turns" : "YELLOW did not complete within max turns");
  hints.push(repeatedQuestion ? "YELLOW repeated question risk" : "GREEN no exact repeated questions");

  if (completed && turns <= persona.suspiciousEarlyTurns) {
    hints.push(`YELLOW possible early completion at ${turns} turns`);
  } else {
    hints.push("GREEN no obvious early-completion signal");
  }

  if (!profileModel) {
    hints.push("RED missing profileModel on complete");
  } else {
    hints.push(
      `GREEN profileModel present: facts=${countArray(profileModel.facts)} interpretations=${countArray(
        profileModel.interpretations,
      )} uncertainties=${countArray(profileModel.uncertainties)} hypotheses=${countArray(profileModel.hypotheses)}`,
    );
  }

  if (persona.needsUncertainty && uncertaintyCount === 0) {
    hints.push("YELLOW no uncertainties on unclear/transition persona");
  }

  if (driftMatches.length) {
    hints.push(`YELLOW potential intention drift: ${[...new Set(driftMatches)].join(", ")}`);
  } else {
    hints.push("GREEN no obvious intention-drift terms");
  }

  return hints;
}

async function callInterview(
  postInterview: (request: Request) => Promise<Response>,
  payload: Record<string, unknown>,
): Promise<InterviewResponse> {
  const response = await postInterview(
    new Request("http://jobpilot.local/api/onboarding/interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );

  return (await response.json()) as InterviewResponse;
}

async function runManualPersona(
  persona: ManualPersona,
  postInterview: (request: Request) => Promise<Response>,
) {
  let interviewState: InterviewState | undefined;
  let lastAssistantQuestion: string | null = null;
  let lastAssistantFocusArea: FocusArea | null = null;
  let lastUserAnswer: string | null = null;
  let completeResponse: CompleteResponse | null = null;
  let turns = 0;
  let finalProgress = 0;
  const questions: string[] = [];

  console.log("");
  console.log(divider);
  console.log(`PERSONA: ${persona.id}`);
  console.log(`DESCRIPTION: ${persona.description}`);
  console.log("EXPECTED:");
  for (const note of persona.expectedProductBehaviorNotes) {
    console.log(`- ${note}`);
  }
  console.log(divider);

  for (let index = 0; index < (persona.maxTurns ?? defaultMaxTurns); index += 1) {
    const result = await callInterview(postInterview, {
      phase: "initial",
      profileDraft: persona.profileDraft,
      lastAssistantQuestion,
      lastUserAnswer,
      interviewState,
    });

    if (!result.ok) {
      console.log("");
      console.log("ENDPOINT ERROR");
      console.log(JSON.stringify(result, null, 2));
      return { completed: false, hadEndpointError: true, hints: ["RED endpoint error"], turns, finalProgress };
    }

    interviewState = result.interviewState;
    finalProgress = computeProgress(result, interviewState);
    turns = interviewState.answeredTurns;

    if (result.status === "complete") {
      completeResponse = result;
      break;
    }

    questions.push(result.question);
    console.log("");
    console.log(`Turn ${index + 1}`);
    console.log(`AI question (${result.focusArea}):`);
    console.log(result.question);

    lastAssistantQuestion = result.question;
    lastAssistantFocusArea = result.focusArea;
    lastUserAnswer = pickManualAnswer(persona, result.question, result.focusArea, index);

    console.log("");
    console.log("User answer:");
    console.log(lastUserAnswer);
  }

  const completed = Boolean(completeResponse);

  console.log("");
  console.log(completed ? "COMPLETE" : "STOPPED AT MAX TURNS");
  console.log(`turns=${turns}`);
  console.log(`progress=${finalProgress}`);
  console.log(`focus areas=${interviewState?.coveredFocusAreas?.join(", ") || "none"}`);

  if (completeResponse) {
    console.log("");
    console.log("readinessAssessment:");
    console.log(JSON.stringify(completeResponse.readinessAssessment ?? null, null, 2));

    console.log("");
    console.log("profileModel:");
    printModelSection("facts", completeResponse.profileModel?.facts);
    printModelSection("interpretations", completeResponse.profileModel?.interpretations);
    printModelSection("uncertainties", completeResponse.profileModel?.uncertainties);
    printModelSection("hypotheses", completeResponse.profileModel?.hypotheses);
    console.log("- communicationSignals:");
    console.log(
      JSON.stringify(
        completeResponse.communicationSignals ?? completeResponse.profileModel?.communicationSignals ?? null,
        null,
        2,
      ),
    );
  }

  const hints = detectReviewHints({
    persona,
    completeResponse,
    questions,
    turns,
    completed,
  });

  console.log("");
  console.log("Product review checklist:");
  for (const item of persona.reviewChecklist) {
    console.log(`- ${item}`);
  }

  console.log("");
  console.log("Review hints:");
  for (const hint of hints) {
    console.log(`- ${hint}`);
  }

  return { completed, hadEndpointError: false, hints, turns, finalProgress };
}

async function main() {
  loadLocalEnv();

  if (!process.env.OPENAI_API_KEY) {
    console.error("Missing OPENAI_API_KEY. Add it to .env.local or the environment before running manual regression.");
    process.exitCode = 1;
    return;
  }

  const postInterview = await loadInterviewPost();
  const summaries: Array<{
    persona: string;
    completed: boolean;
    hadEndpointError: boolean;
    hintCount: number;
    turns: number;
    finalProgress: number;
  }> = [];

  for (const persona of manualPersonas) {
    const result = await runManualPersona(persona, postInterview);
    summaries.push({
      persona: persona.id,
      completed: result.completed,
      hadEndpointError: result.hadEndpointError,
      hintCount: result.hints.filter((hint) => hint.startsWith("YELLOW") || hint.startsWith("RED")).length,
      turns: result.turns,
      finalProgress: result.finalProgress,
    });
  }

  console.log("");
  console.log(divider);
  console.log("MANUAL REGRESSION SUMMARY");
  console.log(divider);
  for (const summary of summaries) {
    console.log(
      `${summary.persona}: completed=${summary.completed} turns=${summary.turns} progress=${summary.finalProgress} reviewHints=${summary.hintCount}`,
    );
  }

  if (summaries.some((summary) => summary.hadEndpointError)) {
    process.exitCode = 1;
  }
}

await main();
