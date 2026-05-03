import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import type { CompletionComplexity, InterviewScenario, LoopFamily } from "./scenarios";

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
  coverage: Record<string, boolean>;
  evidenceCounts?: Record<string, number>;
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
  profileSummary: {
    aiProfileCore?: {
      directionOfChange?: string;
      mismatchRisks?: string[];
      transferableStrengths?: string[];
    };
  };
  interviewState: InterviewState;
  readinessAssessment?: {
    targetDirectionSupport?: string;
    gapSignals?: string[];
    strengthSignals?: string[];
  };
  profileModel?: {
    facts?: unknown[];
    interpretations?: unknown[];
    uncertainties?: unknown[];
    hypotheses?: unknown[];
    questionPriorities?: unknown[];
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

type ScenarioIssue = {
  level: "warn" | "fail";
  reason: string;
};

type ScenarioResult = {
  scenario: InterviewScenario;
  status: "PASS" | "WARN" | "FAIL";
  turns: number;
  completed: boolean;
  finalProgress: number;
  detectedLoops: string[];
  repeatedFocusAreas: string[];
  intentionViolations: string[];
  warnings: string[];
  failureReasons: string[];
  questions: string[];
  completionQuality: CompletionQualityReport | null;
};

type CompletionQualityReport = {
  facts: number;
  interpretations: number;
  uncertainties: number;
  hypotheses: number;
  hypothesisSummary: number;
  uncertaintySummary: number;
  communicationSignals: number;
  matchedConcepts: string[];
  missingConcepts: string[];
  earlyCompletionWarning: boolean;
  thinProfile: boolean;
  qualityWarnings: string[];
};

const maxUnchangedProgressTurns = 3;
const defaultMaxTurns = 14;

const semanticFamilyPatterns: Record<LoopFamily, RegExp[]> = {
  mismatch_risk: [/undga|daarlig|bad match|no-go|passer ikke|risiko|fravalg|avoid/iu],
  ownership: [/ansvar|ejede|ejer|beslut|myndighed|stod for|ownership/iu],
  current_work_reality: [/branche|nuværende|nuvaerende|hverdag|rolle|arbejde|opgaver|drift/iu],
  resultEvidence: [/resultat|eksempel|case|konkret|effekt|forbedr|bevis/iu],
  product_ownership: [/backlog|roadmap|product|produkt|prioritering|produktejer/iu],
  responsibility: [/mere ansvar|mindre ansvar|personaleansvar|ledelse|leder|responsibility/iu],
  domain_context: [/branche|domæne|domaene|sektor|marked|kunder|industri/iu],
};

const pushPatterns: Record<string, RegExp[]> = {
  leadership: [
    /(vil du|ønsker du|onsker du|ser du|kunne du|naeste skridt|næste skridt).{0,80}(leder|ledelse|personaleansvar|people manager|teamleder)/iu,
  ],
  management: [/(vil du|ønsker du|onsker du|ser du|kunne du).{0,80}(management|lederrolle|ledelse|personaleansvar|chef)/iu],
  people_management: [
    /(vil du|ønsker du|onsker du|ser du|kunne du).{0,80}(personaleansvar|people manager|leder for medarbejdere|ledelse af mennesker)/iu,
  ],
  promotion: [/(vil du|ønsker du|onsker du|ser du|kunne du).{0,80}(forfremmelse|næste niveau|naeste niveau|opad|promotion|mere ansvar)/iu],
  leadership_progression: [/mere ledelsesansvar|større ledelsesansvar|stor lederrolle|opad i ledelse/iu],
  more_responsibility: [/(vil du|ønsker du|onsker du|ser du|kunne du).{0,80}(mere ansvar|større ansvar|stoerre ansvar|næste niveau|naeste niveau)/iu],
  product: [/(vil du|ønsker du|onsker du|ser du|kunne du).{0,80}(product manager|produktejer|produktansvar|backlog|roadmap)/iu],
  career_change: [/(vil du|ønsker du|onsker du|ser du|kunne du).{0,80}(skifte retning|ny retning|karriereskift|career change)/iu],
  office_role: [/(vil du|ønsker du|onsker du|ser du|kunne du).{0,80}(kontorrolle|kontorarbejde|administrativ rolle|office)/iu],
  cold_outreach: [/(fortsætte|fortsaette|mere|tilbage).{0,80}(cold outreach|kold kanvas|kanvas|opsøgende salg|opsoegende salg)/iu],
  sales_hunter: [/(fortsætte|fortsaette|mere|tilbage).{0,80}(hunter|nykundesalg|opsøgende salg|opsoegende salg|ringelister)/iu],
  formal_product_ownership: [/(antager|forudsætter|forudsaetter).{0,80}(roadmap|backlog|produktansvar)/iu],
  deny_transition: [/ikke realistisk|kan ikke|umuligt|bør ikke|boer ikke/iu],
  individual_contributor_only: [/uden ledelse|kun specialist|ingen personaleansvar/iu],
  same_level_only: [/samme niveau|ikke mere ansvar|bliv hvor du er/iu],
  same_clinical_role: [/klinisk rolle|patientansvar|sygeplejerske igen|nattevagter/iu],
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

async function loadInterviewPost() {
  const routeUrl = pathToFileURL(join(process.cwd(), "src/app/api/onboarding/interview/route.ts")).href;
  const routeModule = (await import(routeUrl)) as { POST: (request: Request) => Promise<Response> };
  return routeModule.POST;
}

async function loadScenarios() {
  const scenarioUrl = pathToFileURL(join(process.cwd(), "tests/interview-scenarios/scenarios.ts")).href;
  const scenarioModule = (await import(scenarioUrl)) as { interviewScenarios: InterviewScenario[] };
  return scenarioModule.interviewScenarios;
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

function inferSemanticFamilies(question: string, focusArea?: FocusArea): LoopFamily[] {
  const families = new Set<LoopFamily>();

  if (focusArea === "mismatch_risk") {
    families.add("mismatch_risk");
  }

  if (focusArea === "current_work_reality") {
    families.add("current_work_reality");
  }

  for (const [family, patterns] of Object.entries(semanticFamilyPatterns) as [LoopFamily, RegExp[]][]) {
    if (patterns.some((pattern) => pattern.test(question))) {
      families.add(family);
    }
  }

  return [...families];
}

function pickScriptedAnswer(scenario: InterviewScenario, question: string, focusArea: FocusArea) {
  const families = inferSemanticFamilies(question, focusArea);
  const focusAnswer = scenario.scriptedAnswers.byFocusArea?.[focusArea];

  if (focusAnswer) {
    return focusAnswer;
  }

  for (const family of families) {
    const familyAnswer = scenario.scriptedAnswers.byFamily?.[family];

    if (familyAnswer) {
      return familyAnswer;
    }
  }

  return scenario.scriptedAnswers.default;
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

function detectIntentionViolations(scenario: InterviewScenario, text: string) {
  const normalized = normalizeText(text);
  const violations: string[] = [];

  for (const expectation of scenario.expectedDoNotAssume) {
    const patterns = pushPatterns[expectation] ?? [new RegExp(expectation.replace(/_/g, " "), "iu")];

    if (patterns.some((pattern) => pattern.test(normalized))) {
      violations.push(expectation);
    }
  }

  if (
    scenario.intendedDirectionType === "less_responsibility" &&
    /mere ansvar|større ansvar|stoerre ansvar|opad|næste niveau|naeste niveau/iu.test(normalized)
  ) {
    violations.push("less_responsibility_pushed_upward");
  }

  return [...new Set(violations)];
}

function countArray(value: unknown) {
  return Array.isArray(value) ? value.length : 0;
}

function countObjectSignals(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return 0;
  }

  return Object.values(value).filter((item) => item !== null && item !== undefined && item !== "").length;
}

function getQualityThresholds(complexity: CompletionComplexity) {
  switch (complexity) {
    case "complex":
      return {
        minFacts: 2,
        minInterpretations: 2,
        minHypotheses: 2,
        minUncertainties: 1,
        minCommunicationSignals: 3,
      };
    case "moderate":
      return {
        minFacts: 2,
        minInterpretations: 1,
        minHypotheses: 1,
        minUncertainties: 0,
        minCommunicationSignals: 3,
      };
    case "simple":
    default:
      return {
        minFacts: 2,
        minInterpretations: 1,
        minHypotheses: 1,
        minUncertainties: 0,
        minCommunicationSignals: 3,
      };
  }
}

function analyzeCompletionQuality({
  scenario,
  response,
  turns,
  finalProgress,
}: {
  scenario: InterviewScenario;
  response: CompleteResponse;
  turns: number;
  finalProgress: number;
}): CompletionQualityReport {
  const expectations = scenario.completionQuality;
  const thresholds = getQualityThresholds(expectations.complexity);
  const profileModel = response.profileModel;
  const facts = countArray(profileModel?.facts);
  const interpretations = countArray(profileModel?.interpretations);
  const uncertainties = countArray(profileModel?.uncertainties);
  const hypotheses = countArray(profileModel?.hypotheses);
  const hypothesisSummary = countArray(response.hypothesisSummary);
  const uncertaintySummary = countArray(response.uncertaintySummary);
  const communicationSignals = countObjectSignals(response.communicationSignals ?? profileModel?.communicationSignals);
  const payloadText = normalizeText(JSON.stringify(response));
  const expectedConcepts = expectations.expectedConcepts ?? [];
  const matchedConcepts = expectedConcepts.filter((concept) => payloadText.includes(normalizeText(concept)));
  const missingConcepts = expectedConcepts.filter((concept) => !matchedConcepts.includes(concept));
  const minimumMatchedConcepts = expectations.minimumMatchedConcepts ?? Math.min(2, expectedConcepts.length);
  const qualityWarnings: string[] = [];
  const profileModelMissing =
    !profileModel ||
    (facts === 0 && interpretations === 0 && uncertainties === 0 && hypotheses === 0 && countArray(profileModel.questionPriorities) === 0);
  const missingExpectedUncertainties =
    (expectations.requireUncertainties || thresholds.minUncertainties > 0) &&
    uncertainties === 0 &&
    uncertaintySummary === 0;
  const missingExpectedHypotheses =
    (expectations.requireHypotheses || thresholds.minHypotheses > 0) &&
    hypotheses === 0 &&
    hypothesisSummary === 0;
  const thinProfile =
    profileModelMissing ||
    facts < thresholds.minFacts ||
    interpretations < thresholds.minInterpretations ||
    communicationSignals < thresholds.minCommunicationSignals ||
    missingExpectedUncertainties ||
    missingExpectedHypotheses ||
    matchedConcepts.length < minimumMatchedConcepts;
  const earlyCompletion =
    expectations.suspiciousEarlyTurns !== undefined && turns <= expectations.suspiciousEarlyTurns;
  const earlyCompletionWarning =
    earlyCompletion && (thinProfile || expectations.complexity === "complex" || matchedConcepts.length < expectedConcepts.length);

  if (profileModelMissing) {
    qualityWarnings.push("missing_profile_model_on_complete");
  }

  if (facts < thresholds.minFacts) {
    qualityWarnings.push(`thin_facts_on_complete:${facts}<${thresholds.minFacts}`);
  }

  if (missingExpectedUncertainties) {
    qualityWarnings.push("missing_uncertainties_on_complex_scenario");
  }

  if (missingExpectedHypotheses) {
    qualityWarnings.push("missing_hypotheses_on_transition_scenario");
  }

  if (communicationSignals < thresholds.minCommunicationSignals) {
    qualityWarnings.push(`missing_communication_signals_on_complete:${communicationSignals}<${thresholds.minCommunicationSignals}`);
  }

  if (matchedConcepts.length < minimumMatchedConcepts) {
    qualityWarnings.push(`missing_expected_completion_concepts:${matchedConcepts.length}<${minimumMatchedConcepts}`);
  }

  if (thinProfile) {
    qualityWarnings.push("shallow_completion");
  }

  if (earlyCompletionWarning) {
    qualityWarnings.push("early_completion_needs_review");
  }

  if (finalProgress === 100 && thinProfile) {
    qualityWarnings.push("progress_100_with_thin_profile");
  }

  return {
    facts,
    interpretations,
    uncertainties,
    hypotheses,
    hypothesisSummary,
    uncertaintySummary,
    communicationSignals,
    matchedConcepts,
    missingConcepts,
    earlyCompletionWarning,
    thinProfile,
    qualityWarnings: [...new Set(qualityWarnings)],
  };
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

async function runScenario(
  scenario: InterviewScenario,
  postInterview: (request: Request) => Promise<Response>,
): Promise<ScenarioResult> {
  const issues: ScenarioIssue[] = [];
  const questions: string[] = [];
  const detectedLoops: string[] = [];
  const intentionViolations: string[] = [];
  const focusAreaCounts = new Map<string, number>();
  const familyCounts = new Map<string, number>();
  const progressValues: number[] = [];
  let repeatedUnchangedProgress = 0;
  let repeatedExactQuestion = false;
  let interviewState: InterviewState | undefined;
  let lastAssistantQuestion: string | null = null;
  let lastAssistantFocusArea: FocusArea | null = null;
  let completed = false;
  let finalProgress = 0;
  let turns = 0;
  let completionQuality: CompletionQualityReport | null = null;

  for (let turn = 0; turn < (scenario.maxTurns ?? defaultMaxTurns); turn += 1) {
    const lastUserAnswer =
      lastAssistantQuestion && interviewState
        ? pickScriptedAnswer(scenario, lastAssistantQuestion, lastAssistantFocusArea ?? "current_work_reality")
        : null;
    const payload = {
      phase: "initial",
      profileDraft: scenario.profileDraft,
      lastAssistantQuestion,
      lastUserAnswer,
      interviewState,
    };
    const result = await callInterview(postInterview, payload);

    if (!result.ok) {
      issues.push({
        level: "fail",
        reason: `endpoint_error:${result.reasonCode ?? result.error ?? "unknown"}`,
      });
      break;
    }

    interviewState = result.interviewState;
    finalProgress = computeProgress(result, interviewState);
    turns = interviewState.answeredTurns;

    const previousProgress = progressValues.at(-1);
    if (previousProgress !== undefined) {
      if (finalProgress < previousProgress) {
        issues.push({ level: "fail", reason: `progress_decreased:${previousProgress}->${finalProgress}` });
      }

      if (finalProgress === previousProgress) {
        repeatedUnchangedProgress += 1;
      } else {
        repeatedUnchangedProgress = 0;
      }

      if (repeatedUnchangedProgress >= maxUnchangedProgressTurns) {
        issues.push({ level: "warn", reason: `progress_stalled:${repeatedUnchangedProgress + 1}_turns` });
      }
    }
    progressValues.push(finalProgress);

    if (result.status === "complete") {
      completed = true;

      if (finalProgress !== 100) {
        issues.push({ level: "fail", reason: `complete_progress_not_100:${finalProgress}` });
      }

      completionQuality = analyzeCompletionQuality({
        scenario,
        response: result,
        turns,
        finalProgress,
      });

      for (const warning of completionQuality.qualityWarnings) {
        issues.push({ level: "warn", reason: warning });
      }

      const summaryText = JSON.stringify({
        profileSummary: result.profileSummary,
        readinessAssessment: result.readinessAssessment,
        profileModel: result.profileModel,
        hypothesisSummary: result.hypothesisSummary,
        uncertaintySummary: result.uncertaintySummary,
      });
      intentionViolations.push(...detectIntentionViolations(scenario, summaryText));
      break;
    }

    const normalizedQuestion = normalizeText(result.question);
    repeatedExactQuestion = questions.map(normalizeText).includes(normalizedQuestion);

    if (repeatedExactQuestion) {
      detectedLoops.push("exact_question_repeat");
      issues.push({ level: "fail", reason: "exact_question_repeat" });
    }

    questions.push(result.question);
    lastAssistantQuestion = result.question;
    lastAssistantFocusArea = result.focusArea;
    intentionViolations.push(...detectIntentionViolations(scenario, result.question));

    const currentFocusCount = (focusAreaCounts.get(result.focusArea) ?? 0) + 1;
    focusAreaCounts.set(result.focusArea, currentFocusCount);

    if (currentFocusCount >= 4) {
      issues.push({ level: "warn", reason: `repeated_focus_area:${result.focusArea}:${currentFocusCount}` });
    }

    for (const family of inferSemanticFamilies(result.question, result.focusArea)) {
      if (!scenario.loopFamiliesToWatch.includes(family)) {
        continue;
      }

      const nextCount = (familyCounts.get(family) ?? 0) + 1;
      familyCounts.set(family, nextCount);

      if (nextCount >= 3) {
        detectedLoops.push(`${family}:${nextCount}`);
        issues.push({ level: "warn", reason: `semantic_family_repeat:${family}:${nextCount}` });
      }
    }

    if (detectedLoops.length > 0 && detectedLoops.some((loop) => loop === "exact_question_repeat")) {
      break;
    }
  }

  if (!completed) {
    issues.push({ level: "warn", reason: "did_not_complete_within_max_turns" });
  }

  for (const violation of new Set(intentionViolations)) {
    issues.push({ level: "fail", reason: `intention_violation:${violation}` });
  }

  const repeatedFocusAreas = [...focusAreaCounts.entries()]
    .filter(([, count]) => count >= 3)
    .map(([focusArea, count]) => `${focusArea}:${count}`);
  const failureReasons = issues.filter((issue) => issue.level === "fail").map((issue) => issue.reason);
  const warnings = issues.filter((issue) => issue.level === "warn").map((issue) => issue.reason);
  const status = failureReasons.length > 0 ? "FAIL" : warnings.length > 0 ? "WARN" : "PASS";

  return {
    scenario,
    status,
    turns,
    completed,
    finalProgress,
    detectedLoops: [...new Set(detectedLoops)],
    repeatedFocusAreas,
    intentionViolations: [...new Set(intentionViolations)],
    warnings: [...new Set(warnings)],
    failureReasons: [...new Set(failureReasons)],
    questions,
    completionQuality,
  };
}

function printScenarioResult(result: ScenarioResult) {
  console.log(
    `${result.status} ${result.scenario.id} | turns=${result.turns} | completed=${result.completed} | progress=${result.finalProgress}`,
  );
  console.log(`  loops: ${result.detectedLoops.length ? result.detectedLoops.join(", ") : "none"}`);
  console.log(`  repeated focus: ${result.repeatedFocusAreas.length ? result.repeatedFocusAreas.join(", ") : "none"}`);
  console.log(
    `  intention violations: ${
      result.intentionViolations.length ? result.intentionViolations.join(", ") : "none"
    }`,
  );
  if (result.completionQuality) {
    const quality = result.completionQuality;
    console.log(
      `  completion quality: facts=${quality.facts} interpretations=${quality.interpretations} uncertainties=${quality.uncertainties} hypotheses=${quality.hypotheses} hypothesisSummary=${quality.hypothesisSummary} uncertaintySummary=${quality.uncertaintySummary} communicationSignals=${quality.communicationSignals}`,
    );
    console.log(
      `    concepts=${quality.matchedConcepts.length}/${
        quality.matchedConcepts.length + quality.missingConcepts.length
      } matched | earlyCompletionWarning=${quality.earlyCompletionWarning} | thinProfile=${quality.thinProfile}`,
    );
    console.log(`    quality warnings: ${quality.qualityWarnings.length ? quality.qualityWarnings.join(", ") : "none"}`);
  } else {
    console.log("  completion quality: not available");
  }
  console.log(`  warnings: ${result.warnings.length ? result.warnings.join(", ") : "none"}`);
  console.log(`  failures: ${result.failureReasons.length ? result.failureReasons.join(", ") : "none"}`);
}

function printSummary(results: ScenarioResult[]) {
  const passed = results.filter((result) => result.status === "PASS").length;
  const warned = results.filter((result) => result.status === "WARN").length;
  const failed = results.filter((result) => result.status === "FAIL").length;
  const reasonCounts = new Map<string, number>();

  for (const result of results) {
    for (const reason of [...result.failureReasons, ...result.warnings]) {
      reasonCounts.set(reason, (reasonCounts.get(reason) ?? 0) + 1);
    }
  }

  const topReasons = [...reasonCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([reason, count]) => `${reason} (${count})`);

  console.log("");
  console.log(`Summary: passed=${passed} warned=${warned} failed=${failed}`);
  console.log(`Top repeated reasons: ${topReasons.length ? topReasons.join(", ") : "none"}`);
}

async function main() {
  loadLocalEnv();

  if (!process.env.OPENAI_API_KEY) {
    console.error("Missing OPENAI_API_KEY. Add it to .env.local or the environment before running scenarios.");
    process.exitCode = 1;
    return;
  }

  const postInterview = await loadInterviewPost();
  const interviewScenarios = await loadScenarios();
  const results: ScenarioResult[] = [];

  for (const scenario of interviewScenarios) {
    const result = await runScenario(scenario, postInterview);
    results.push(result);
    printScenarioResult(result);
  }

  printSummary(results);

  if (results.some((result) => result.status === "FAIL")) {
    process.exitCode = 1;
  }
}

await main();
