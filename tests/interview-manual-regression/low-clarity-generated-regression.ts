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
  readinessAssessment?: { level?: string; targetDirectionSupport?: string; summary?: string } | unknown;
  profileSummary?: unknown;
  profileModel?: {
    facts?: unknown[];
    interpretations?: unknown[];
    uncertainties?: unknown[];
    hypotheses?: unknown[];
    communicationSignals?: Record<string, unknown>;
  };
  communicationSignals?: Record<string, unknown>;
};

type ErrorResponse = {
  ok: false;
  error?: string;
  reasonCode?: string;
  lastFailureReasonCode?: string;
  retryTrail?: string[];
};

type InterviewResponse = ContinueResponse | CompleteResponse | ErrorResponse;

type GeneratedPersona = {
  id: string;
  profileDraft: {
    name: string;
    currentRole: string;
    yearsExperience: string;
    targetDirection: string;
  };
  dimensions: {
    background: string;
    level: string;
    target: string;
    style: (typeof communicationStyles)[number];
  };
  maxTurns: number;
};

const divider = "=".repeat(60);
const defaultPersonaCount = 8;
const defaultMaxTurns = 8;

const backgroundRoles = [
  { key: "warehouse", role: "Lagermedarbejder" },
  { key: "retail", role: "Butiksmedarbejder" },
  { key: "technician", role: "Tekniker" },
  { key: "admin", role: "Administrativ medarbejder" },
  { key: "service_support", role: "Kundeservice medarbejder" },
  { key: "care_service", role: "Omsorgsmedarbejder" },
  { key: "specialist", role: "Faglig specialist" },
  { key: "coordinator", role: "Koordinator" },
] as const;

const experienceLevels = [
  "junior",
  "experienced_employee",
  "senior_no_formal_leadership",
  "informal_key_person",
  "previously_high_responsibility_uncertain",
] as const;

const targetDirections = [
  { key: "unclear", text: "Jeg ved det ikke helt endnu, men jeg vil gerne i en retning der passer bedre til mig." },
  { key: "same_better_conditions", text: "Jeg vil gerne samme type job, bare med bedre rammer, mere ro og bedre ledelse." },
  { key: "mild_change", text: "Jeg vil gerne skifte lidt retning, men ikke alt for langt fra det jeg kan i dag." },
  { key: "larger_change", text: "Jeg overvejer et stoerre skift, men jeg ved ikke helt hvordan det skal goeres realistisk." },
  { key: "cautious_next_level", text: "Jeg kunne maaske tage lidt mere ansvar, men jeg er i tvivl om niveau og timing." },
  { key: "less_pressure", text: "Jeg vil gerne have mindre pres og mere baeredygtig hverdag, men stadig bruge min erfaring." },
] as const;

const communicationStyles = [
  "short_answers",
  "vague_answers",
  "low_evidence_density",
  "self_minimizing",
  "ordinary_examples_no_metrics",
  "uncertain_strengths",
  "low_reflection",
] as const;

const styleAnswerPools: Record<(typeof communicationStyles)[number], string[]> = {
  short_answers: ["Det ved jeg ikke helt.", "Det er svaert at sige.", "Jeg passer bare mit arbejde."],
  vague_answers: ["Jeg hjaelper bare til hvor der mangler noget.", "Det er lidt forskelligt fra dag til dag.", "Det er nok meget almindeligt."],
  low_evidence_density: ["Det fungerede fint nok.", "Der kom noget ud af det, men jeg har ikke detaljer.", "Jeg har ikke tal paa det."],
  self_minimizing: ["Jeg er nok meget almindelig.", "Jeg er ikke noget saerligt.", "Jeg goer bare det jeg skal."],
  ordinary_examples_no_metrics: ["Jeg fik loest opgaven og folk var tilfredse.", "Jeg fik hverdagen til at glide bedre.", "Jeg hjalp med at holde styr paa tingene."],
  uncertain_strengths: ["Det er svaert at sige hvad jeg er god til.", "Jeg ved ikke helt hvilke styrker jeg skal naevne.", "Jeg er ikke saa god til at forklare det."],
  low_reflection: ["Jeg har ikke taenkt saa meget over det.", "Jeg tager bare tingene som de kommer.", "Jeg ved ikke helt hvad naeste skridt er."],
};

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

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hashString(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a: number) {
  return function rng() {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickOne<T>(arr: readonly T[], rng: () => number) {
  return arr[Math.floor(rng() * arr.length)];
}

function buildYearsExperience(level: (typeof experienceLevels)[number]) {
  switch (level) {
    case "junior":
      return "1-2 aar erfaring.";
    case "experienced_employee":
      return "5-7 aar erfaring i lignende roller.";
    case "senior_no_formal_leadership":
      return "10+ aar erfaring, men uden formelt personaleansvar.";
    case "informal_key_person":
      return "8-12 aar erfaring, ofte brugt som faglig noegleperson.";
    case "previously_high_responsibility_uncertain":
      return "12+ aar erfaring, tidligere med hoejt ansvar, nu mere i tvivl om retning.";
    default:
      return "Flere aar erfaring.";
  }
}

function generatedName(index: number) {
  const names = ["Maja", "Jonas", "Fatima", "Nicolai", "Sofie", "Emil", "Sara", "Rasmus", "Nadia", "Anders"];
  return names[index % names.length];
}

function generatePersonas(seed: string, count: number): GeneratedPersona[] {
  const rng = mulberry32(hashString(seed));
  const personas: GeneratedPersona[] = [];

  for (let i = 0; i < count; i += 1) {
    const background = pickOne(backgroundRoles, rng);
    const level = pickOne(experienceLevels, rng);
    const target = pickOne(targetDirections, rng);
    const style = pickOne(communicationStyles, rng);

    personas.push({
      id: `generated-low-clarity-${i + 1}`,
      profileDraft: {
        name: generatedName(i),
        currentRole: background.role,
        yearsExperience: buildYearsExperience(level),
        targetDirection: target.text,
      },
      dimensions: {
        background: background.key,
        level,
        target: target.key,
        style,
      },
      maxTurns: defaultMaxTurns,
    });
  }

  return personas;
}

function inferSemanticFamily(question: string): "ownership" | "result" | "mismatch" | "direction" | "other" {
  const normalized = normalizeText(question);
  if (/(ansvar|ejede|stod for|beslut)/iu.test(normalized)) return "ownership";
  if (/(resultat|eksempel|konkret|effekt|forbedr)/iu.test(normalized)) return "result";
  if (/(undga|darligt match|passer ikke|no go)/iu.test(normalized)) return "mismatch";
  if (/(retning|naeste skridt|overgang|skifte)/iu.test(normalized)) return "direction";
  return "other";
}

function buildAnswer(persona: GeneratedPersona, focusArea: FocusArea, question: string, turn: number) {
  const pool = styleAnswerPools[persona.dimensions.style];
  const fallback = pool[turn % pool.length];

  if (focusArea === "current_work_reality") {
    return `${fallback} I min hverdag som ${persona.profileDraft.currentRole.toLowerCase()} loeser jeg de opgaver der kommer, og jeg hjaelper hvor der mangler noget.`;
  }
  if (focusArea === "level_seniority") {
    return `${fallback} Jeg passer mest mit eget ansvar og spoerger hvis noget er uklart.`;
  }
  if (focusArea === "transferable_strengths") {
    return `${fallback} Jeg har ikke tal paa det, men jeg faar normalt opgaverne i maal.`;
  }
  if (focusArea === "mismatch_risk") {
    return `${fallback} Jeg vil helst undgaa kaos, uklare forventninger og for hoejt pres over lang tid.`;
  }
  if (focusArea === "work_style_fit") {
    return `${fallback} Jeg fungerer bedst med tydelige opgaver, ro og ordentlig planlaegning.`;
  }
  if (focusArea === "direction_change") {
    return `${fallback} Jeg er ikke helt sikker, men jeg vil gerne i en retning der virker realistisk for mig.`;
  }

  const family = inferSemanticFamily(question);
  if (family === "ownership") return `${fallback} Jeg hjaelper hvor der mangler noget, men uden at have et stort formelt ansvar.`;
  if (family === "result") return `${fallback} Der kom noget ud af det, men jeg har ikke maalinger eller tal.`;
  if (family === "mismatch") return `${fallback} Jeg vil undgaa roller med konstant pres og uklare forventninger.`;
  if (family === "direction") return `${fallback} Jeg ved ikke helt praecist hvad naeste skridt er endnu.`;

  return fallback;
}

async function loadInterviewPost() {
  const routeUrl = pathToFileURL(join(process.cwd(), "src/app/api/onboarding/interview/route.ts")).href;
  const routeModule = (await import(routeUrl)) as { POST: (request: Request) => Promise<Response> };
  return routeModule.POST;
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

function countArray(value: unknown) {
  return Array.isArray(value) ? value.length : 0;
}

function detectHints({
  persona,
  completed,
  turns,
  questions,
  finalResponse,
  endpointError,
}: {
  persona: GeneratedPersona;
  completed: boolean;
  turns: number;
  questions: string[];
  finalResponse: CompleteResponse | null;
  endpointError: string | null;
}) {
  const hints: string[] = [];
  const normalized = questions.map(normalizeText);
  const repeatedQuestion = normalized.some((question, i) => normalized.indexOf(question) !== i);
  const textBlob = normalizeText(
    JSON.stringify({
      profileSummary: finalResponse?.profileSummary,
      readiness: finalResponse?.readinessAssessment,
      profileModel: finalResponse?.profileModel,
    }),
  );
  const profileModel = finalResponse?.profileModel;
  const comm = (finalResponse?.communicationSignals ?? profileModel?.communicationSignals ?? {}) as Record<string, unknown>;
  const uncertaintyCount = countArray(profileModel?.uncertainties);
  const factCount = countArray(profileModel?.facts);
  const interpretationCount = countArray(profileModel?.interpretations);
  const isLowClarityExpected = true;
  const forcedDirectionPatterns = [
    /du (skal|ma|bor) (skifte|ga efter|ga i retning af|blive|satse pa)/iu,
    /du er nodt til/iu,
    /klart at du bor/iu,
    /du passer bedre til [a-z0-9\s]+ end/iu,
  ];
  const possibleForcedDirection = forcedDirectionPatterns.some((pattern) => pattern.test(textBlob));

  if (!completed) hints.push("did_not_complete");
  if (endpointError) hints.push(`endpoint_error:${endpointError}`);
  if (repeatedQuestion) hints.push("repeated_question_risk");
  if (possibleForcedDirection) hints.push("possible_forced_direction");
  if (/(stark profil|klar til malet|helt klar)/iu.test(textBlob)) hints.push("possible_overconfident_profile");
  if (factCount >= 5 && interpretationCount >= 5 && uncertaintyCount === 0) hints.push("possible_generic_polished_profile_without_evidence");
  if (/(svag bruger|lav kompetence|mangler vaerdi)/iu.test(textBlob)) hints.push("possible_treating_low_communication_as_low_competence");
  if (isLowClarityExpected && uncertaintyCount === 0) hints.push("missing_uncertainty_on_low_clarity_persona");
  if (completed && !profileModel) hints.push("missing_profile_model_on_complete");
  if (
    isLowClarityExpected &&
    (comm.answerStyle !== "concise" || (comm.structureLevel !== "low" && comm.evidenceDensity !== "low"))
  ) {
    hints.push("communication_signals_not_reflecting_low_clarity");
  }

  return hints;
}

async function runPersona(
  persona: GeneratedPersona,
  postInterview: (request: Request) => Promise<Response>,
) {
  let interviewState: InterviewState | null = null;
  let lastAssistantQuestion: string | null = null;
  let lastAssistantFocusArea: FocusArea | null = null;
  const questions: string[] = [];
  let turns = 0;
  let completed = false;
  let endpointError: string | null = null;
  let finalResponse: CompleteResponse | null = null;
  let progress = 0;

  for (let turn = 0; turn < persona.maxTurns; turn += 1) {
    const answer =
      turn === 0 || !lastAssistantQuestion || !lastAssistantFocusArea
        ? null
        : buildAnswer(persona, lastAssistantFocusArea, lastAssistantQuestion, turn);

    const result = await callInterview(postInterview, {
      phase: "initial",
      profileDraft: persona.profileDraft,
      lastAssistantQuestion,
      lastUserAnswer: answer,
      interviewState,
    });

    if (!result.ok) {
      endpointError = result.reasonCode ?? result.error ?? "unknown_error";
      break;
    }

    interviewState = result.interviewState;
    progress = Math.max(progress, interviewState?.answeredTurns ?? 0);

    if (result.status === "complete") {
      completed = true;
      finalResponse = result;
      break;
    }

    turns += 1;
    questions.push(result.question);
    lastAssistantQuestion = result.question;
    lastAssistantFocusArea = result.focusArea;
  }

  const hints = detectHints({
    persona,
    completed,
    turns,
    questions,
    finalResponse,
    endpointError,
  });

  return {
    persona,
    completed,
    turns,
    finalProgress: completed ? 100 : Math.min(99, progress * 10),
    hintCount: hints.length,
    hints,
    endpointError,
  };
}

async function main() {
  loadLocalEnv();
  const seed = process.env.LOW_CLARITY_SEED?.trim() || "low-clarity-default-seed-v1";
  const personaCountRaw = Number.parseInt(process.env.LOW_CLARITY_COUNT ?? "", 10);
  const personaCount = Number.isFinite(personaCountRaw) && personaCountRaw > 0 ? personaCountRaw : defaultPersonaCount;

  console.log(divider);
  console.log("LOW CLARITY GENERATED REGRESSION");
  console.log(divider);
  console.log(`seed=${seed}`);
  console.log(`generated_personas=${personaCount}`);

  const personas = generatePersonas(seed, personaCount);
  const postInterview = await loadInterviewPost();

  const summaries: Array<{
    id: string;
    completed: boolean;
    turns: number;
    finalProgress: number;
    hintCount: number;
    hintPreview: string;
  }> = [];

  for (const persona of personas) {
    console.log("");
    console.log(divider);
    console.log(`PERSONA: ${persona.id}`);
    console.log(
      `dimensions: background=${persona.dimensions.background} level=${persona.dimensions.level} target=${persona.dimensions.target} style=${persona.dimensions.style}`,
    );
    console.log(
      `draft: role=${persona.profileDraft.currentRole} | years=${persona.profileDraft.yearsExperience} | target=${persona.profileDraft.targetDirection}`,
    );
    console.log(divider);

    const result = await runPersona(persona, postInterview);
    const hintPreview = result.hints.length ? result.hints.join(", ") : "none";

    console.log(
      `result: completed=${result.completed} turns=${result.turns} progress=${result.finalProgress} reviewHints=${result.hintCount}`,
    );
    if (result.endpointError) {
      console.log(`endpoint_error=${result.endpointError}`);
    }
    console.log(`review_hints=${hintPreview}`);

    summaries.push({
      id: persona.id,
      completed: result.completed,
      turns: result.turns,
      finalProgress: result.finalProgress,
      hintCount: result.hintCount,
      hintPreview,
    });
  }

  const completedCount = summaries.filter((item) => item.completed).length;
  const hintedCount = summaries.filter((item) => item.hintCount > 0).length;
  const blockedCount = summaries.filter((item) => item.hintPreview.includes("endpoint_error")).length;

  console.log("");
  console.log(divider);
  console.log("LOW CLARITY SUMMARY");
  console.log(divider);
  for (const summary of summaries) {
    console.log(
      `${summary.id}: completed=${summary.completed} turns=${summary.turns} progress=${summary.finalProgress} reviewHints=${summary.hintCount}`,
    );
  }
  console.log(
    `totals: personas=${summaries.length} completed=${completedCount} hinted=${hintedCount} endpoint_blocked=${blockedCount}`,
  );
}

main().catch((error) => {
  console.error("low-clarity-regression failed:", error);
  process.exitCode = 1;
});
