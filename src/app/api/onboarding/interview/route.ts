const model = "gpt-5.4-mini";
const allowedFocusAreas = [
  "current_work_reality",
  "level_seniority",
  "transferable_strengths",
  "direction_change",
  "work_style_fit",
  "mismatch_risk",
] as const;
const allowedStatuses = ["continue", "complete"] as const;
const allowedConfidenceLevels = ["low", "medium", "high"] as const;

type FocusArea = (typeof allowedFocusAreas)[number];
type InterviewStatus = (typeof allowedStatuses)[number];
type ConfidenceLevel = (typeof allowedConfidenceLevels)[number];
type ReasonCode =
  | "INVALID_MODEL_JSON"
  | "INVALID_MODEL_SHAPE"
  | "INVALID_STATUS"
  | "INVALID_CONTINUE_PAYLOAD"
  | "INVALID_COMPLETE_PAYLOAD"
  | "INVALID_QUESTION_TEXT"
  | "INVALID_FOCUS_AREA"
  | "REPEATED_QUESTION"
  | "INSUFFICIENT_COVERAGE"
  | "INVALID_PROFILE_SUMMARY"
  | "INVALID_AI_PROFILE_CORE"
  | "INVALID_MODEL_OUTPUT"
  | "INVALID_PLAIN_DANISH"
  | "LOW_QUALITY_ANSWER"
  | "OPENAI_REQUEST_FAILED"
  | "RETRY_EXHAUSTED";

type ProfileDraft = {
  name?: string;
  currentRole?: string;
  yearsExperience?: string;
  targetDirection?: string;
};

type InterviewCoverage = {
  currentWorkReality: boolean;
  levelSeniority: boolean;
  transferableStrengths: boolean;
  directionOfChange: boolean;
  workStyleFit: boolean;
  mismatchRisk: boolean;
  evidenceDepth: boolean;
  concreteEvidence: boolean;
  ownershipScope: boolean;
  resultEvidence: boolean;
  motivationFit: boolean;
  domainContext: boolean;
  noGoClarity: boolean;
  profileStrengthGap: boolean;
};

type InterviewEvidenceCounts = {
  concreteEvidenceCount: number;
  ownershipScopeCount: number;
  resultEvidenceCount: number;
};

type InterviewState = {
  answeredTurns: number;
  coveredFocusAreas: FocusArea[];
  coverage: InterviewCoverage;
  evidenceCounts: InterviewEvidenceCounts;
};

type ProfileSummary = {
  userProfileData: {
    name: string | null;
    currentRole: string | null;
    yearsExperience: string | null;
    targetDirection: string | null;
  };
  aiProfileCore: {
    currentWorkReality: string;
    levelSeniority: string;
    transferableStrengths: string[];
    directionOfChange: string;
    workStyleFit: string;
    mismatchRisks: string[];
    confidence: ConfidenceLevel;
  };
};

type ErrorPayload = {
  ok: false;
  error: string;
  reasonCode?: ReasonCode;
  lastFailureReasonCode?: ReasonCode;
  retryTrail?: ReasonCode[];
  lowQualityReason?: string;
};

type GenerateSuccess =
  | {
      ok: true;
      status: "continue";
      question: string;
      focusArea: FocusArea;
      interviewState: InterviewState;
    }
  | {
      ok: true;
      status: "complete";
      profileSummary: ProfileSummary;
      interviewState: InterviewState;
    };

type GenerateFailure = {
  ok: false;
  error: string;
  reasonCode: ReasonCode;
  retryable: boolean;
};

function isShortString(value: unknown, maxLength = 300): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= maxLength;
}

function errorResponse(
  error: string,
  reasonCode?: ReasonCode,
  debug?: { lastFailureReasonCode?: ReasonCode; retryTrail?: ReasonCode[]; lowQualityReason?: string },
) {
  const includeDebug = process.env.NODE_ENV !== "production";

  return Response.json({
    ok: false,
    error,
    ...(reasonCode ? { reasonCode } : {}),
    ...(includeDebug && debug?.lastFailureReasonCode ? { lastFailureReasonCode: debug.lastFailureReasonCode } : {}),
    ...(includeDebug && debug?.retryTrail?.length ? { retryTrail: debug.retryTrail } : {}),
    ...(includeDebug && debug?.lowQualityReason ? { lowQualityReason: debug.lowQualityReason } : {}),
  } satisfies ErrorPayload);
}

function extractOutputText(data: Record<string, unknown>) {
  const outputItems = Array.isArray(data.output) ? data.output : [];
  const assistantMessage = outputItems.find((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return false;
    }

    const candidate = item as Record<string, unknown>;
    return candidate.type === "message" && candidate.role === "assistant";
  });

  if (!assistantMessage || typeof assistantMessage !== "object" || Array.isArray(assistantMessage)) {
    return "";
  }

  const message = assistantMessage as Record<string, unknown>;
  const content = Array.isArray(message.content) ? message.content : [];

  for (const item of content) {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      continue;
    }

    const candidate = item as Record<string, unknown>;

    if (typeof candidate.text === "string") {
      return candidate.text.trim();
    }

    if (!candidate.text || typeof candidate.text !== "object" || Array.isArray(candidate.text)) {
      continue;
    }

    const textObject = candidate.text as Record<string, unknown>;

    if (typeof textObject.value === "string") {
      return textObject.value.trim();
    }
  }

  return "";
}

function isFocusArea(value: unknown): value is FocusArea {
  return typeof value === "string" && allowedFocusAreas.includes(value as FocusArea);
}

function normalizeFocusArea(value: unknown) {
  if (isFocusArea(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim().toLowerCase();

  const nearMissMap: Record<string, FocusArea> = {
    domain_context: "current_work_reality",
    evidence_depth: "transferable_strengths",
    concrete_evidence: "transferable_strengths",
    result_evidence: "transferable_strengths",
    ownership_scope: "level_seniority",
    motivation_fit: "work_style_fit",
    no_go_clarity: "mismatch_risk",
    profile_strength_gap: "mismatch_risk",
  };

  const mapped = nearMissMap[normalized];

  if (mapped && process.env.NODE_ENV !== "production") {
    console.debug(`[interview] normalized focusArea: ${normalized} -> ${mapped}`);
  }

  return mapped ?? null;
}

function isInterviewStatus(value: unknown): value is InterviewStatus {
  return typeof value === "string" && allowedStatuses.includes(value as InterviewStatus);
}

function isConfidenceLevel(value: unknown): value is ConfidenceLevel {
  return typeof value === "string" && allowedConfidenceLevels.includes(value as ConfidenceLevel);
}

function toNullableShortString(value: unknown, maxLength = 300) {
  if (value === null) {
    return null;
  }

  return isShortString(value, maxLength) ? value.trim() : null;
}

function isStringArray(value: unknown, maxItems = 10, maxLength = 200): value is string[] {
  return (
    Array.isArray(value) &&
    value.length <= maxItems &&
    value.every((item) => typeof item === "string" && item.trim().length > 0 && item.trim().length <= maxLength)
  );
}

function createEmptyInterviewState(): InterviewState {
  return {
    answeredTurns: 0,
    coveredFocusAreas: [],
    coverage: {
      currentWorkReality: false,
      levelSeniority: false,
      transferableStrengths: false,
      directionOfChange: false,
      workStyleFit: false,
      mismatchRisk: false,
      evidenceDepth: false,
      concreteEvidence: false,
      ownershipScope: false,
      resultEvidence: false,
      motivationFit: false,
      domainContext: false,
      noGoClarity: false,
      profileStrengthGap: false,
    },
    evidenceCounts: {
      concreteEvidenceCount: 0,
      ownershipScopeCount: 0,
      resultEvidenceCount: 0,
    },
  };
}

function hasSubstantiveAnswer(value: string) {
  return normalizeText(value).split(" ").filter(Boolean).length >= 6;
}

function getLowQualityReason(value: string) {
  const normalized = normalizeText(value);
  const tokens = normalized.split(" ").filter(Boolean);
  const uniqueTokens = new Set(tokens);

  if (tokens.length >= 8) {
    if (
      hasConcreteEvidenceSignal(value) ||
      hasMotivationSignal(value) ||
      hasDomainContextSignal(value) ||
      hasNoGoSignal(value) ||
      hasProfileStrengthGapSignal(value)
    ) {
      return null;
    }
  }

  if (tokens.length <= 2) {
    return "TOO_SHORT";
  }

  const lowValuePhrases = [
    "ved ikke",
    "ved det ikke",
    "idk",
    "test",
    "tester",
    "123",
    "hej",
    "hello",
    "asdf",
    "qwer",
    "bla bla",
    "blah blah",
    "ingen ide",
    "same",
    "ok",
    "ja",
    "nej",
  ];

  if (lowValuePhrases.includes(normalized)) {
    return "TESTLIKE_FILLER";
  }

  if (/^\d+$/.test(normalized)) {
    return "NUMERIC_FILLER";
  }

  if (tokens.length <= 4 && lowValuePhrases.some((phrase) => normalized.includes(phrase))) {
    return "SHORT_FILLER";
  }

  if (tokens.length <= 5 && uniqueTokens.size <= 2) {
    return "REPETITIVE_FILLER";
  }

  if (tokens.length <= 6 && !hasSubstantiveAnswer(value)) {
    return "TOO_SHORT_GENERIC";
  }

  return null;
}

function hasConcreteEvidenceSignal(value: string) {
  const normalized = normalizeText(value);
  const evidenceKeywords = [
    "for eksempel",
    "fx",
    "konkret",
    "eksempel",
    "case",
    "situation",
    "opgave",
    "ansvar",
    "ejede",
    "ejet",
    "leverede",
    "leverancer",
    "resultat",
    "resultater",
    "forbedrede",
    "projekt",
    "projekter",
    "stakeholder",
    "team",
    "budget",
    "proces",
    "strategi",
    "kunde",
    "implementerede",
    "system",
    "vaerktoj",
    "analyse",
    "tal",
    "maal",
  ];

  const matchedKeywords = evidenceKeywords.filter((keyword) => normalized.includes(keyword)).length;
  return hasSubstantiveAnswer(value) && matchedKeywords >= 2;
}

function hasOwnershipScopeSignal(value: string) {
  const normalized = normalizeText(value);
  const ownershipKeywords = [
    "ansvar",
    "ansvaret",
    "ejede",
    "ejet",
    "koordinerede",
    "planlagde",
    "prioriterede",
    "fulgte op",
    "sikrede",
    "drev",
    "stod for",
    "havde ansvar for",
    "besluttede",
    "overlevering",
    "kvalitet",
    "kundeansvar",
    "fra start til slut",
    "ende til ende",
  ];

  const matchedKeywords = ownershipKeywords.filter((keyword) => normalized.includes(keyword)).length;
  return hasSubstantiveAnswer(value) && matchedKeywords >= 2;
}

function hasResultEvidenceSignal(value: string) {
  const normalized = normalizeText(value);
  const resultKeywords = [
    "resultat",
    "resultater",
    "forbedrede",
    "bedre",
    "hurtigere",
    "færre fejl",
    "faerre fejl",
    "mere stabil",
    "stabilitet",
    "løst",
    "loest",
    "gennemført",
    "gennemfoert",
    "smidigere",
    "smoother",
    "kundeoplevelse",
    "kvalitet",
    "effekt",
    "værdi",
    "vaerdi",
    "undgik",
    "afsluttede",
  ];

  const matchedKeywords = resultKeywords.filter((keyword) => normalized.includes(keyword)).length;
  return hasSubstantiveAnswer(value) && matchedKeywords >= 2;
}

function hasMotivationSignal(value: string) {
  const normalized = normalizeText(value);
  const motivationKeywords = [
    "onsker",
    "vil",
    "helst",
    "trives",
    "motiverer",
    "motiverende",
    "undga",
    "ikke",
    "gerne",
    "mindre",
    "mere",
    "passe",
    "passer",
    "energi",
    "lyst",
  ];

  const matchedKeywords = motivationKeywords.filter((keyword) => normalized.includes(keyword)).length;
  return hasSubstantiveAnswer(value) && matchedKeywords >= 2;
}

function hasNoGoSignal(value: string) {
  const normalized = normalizeText(value);
  const noGoKeywords = [
    "undga",
    "ikke",
    "vil ikke",
    "onsker ikke",
    "fravaelger",
    "fravalg",
    "passer ikke",
    "trives ikke",
    "ikke lyst",
    "ikke interesseret",
  ];

  const matchedKeywords = noGoKeywords.filter((keyword) => normalized.includes(keyword)).length;
  return hasSubstantiveAnswer(value) && matchedKeywords >= 2;
}

function hasProfileStrengthGapSignal(value: string) {
  const normalized = normalizeText(value);
  const gapKeywords = [
    "mangler",
    "ikke endnu",
    "vil gerne",
    "onsker at bevise",
    "har ikke",
    "mere ansvar",
    "taettere pa",
    "overgang",
    "skifte",
    "naeste skridt",
    "bygge op",
  ];

  const matchedKeywords = gapKeywords.filter((keyword) => normalized.includes(keyword)).length;
  return hasSubstantiveAnswer(value) && matchedKeywords >= 2;
}

function hasDomainContextSignal(value: string) {
  const normalized = normalizeText(value);
  const domainKeywords = [
    "branche",
    "industri",
    "sektor",
    "kunder",
    "kundetype",
    "b2b",
    "b2c",
    "saas",
    "offentlig",
    "privat",
    "reguleret",
    "produktion",
    "logistik",
    "sundhed",
    "finans",
    "detail",
    "byggeri",
    "energi",
    "teknologi",
    "forretning",
    "marked",
    "medico",
    "kommune",
    "hospital",
  ];

  const matchedKeywords = domainKeywords.filter((keyword) => normalized.includes(keyword)).length;
  return hasSubstantiveAnswer(value) && matchedKeywords >= 2;
}

function hasDescriptiveDepth(value: string | null, minimumWords = 6) {
  return Boolean(value && normalizeText(value).split(" ").filter(Boolean).length >= minimumWords);
}

function hasMeaningfulItems(value: string[], minimumItems: number, minimumWords = 1) {
  const meaningfulCount = value.filter(
    (item) => normalizeText(item).split(" ").filter(Boolean).length >= minimumWords,
  ).length;

  return meaningfulCount >= minimumItems;
}

function hasDistinctVocabulary(values: string[], minimumUniqueTokens: number) {
  const uniqueTokens = new Set(
    values.flatMap((value) => getMeaningfulTokens(value)).filter((token) => token.length > 2),
  );

  return uniqueTokens.size >= minimumUniqueTokens;
}

function looksTemplateLike(values: string[]) {
  const normalizedValues = values.map((value) => normalizeText(value)).filter(Boolean);

  if (normalizedValues.length === 0) {
    return true;
  }

  const uniqueValues = new Set(normalizedValues);
  return uniqueValues.size <= Math.max(1, Math.floor(normalizedValues.length / 2));
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

function getMeaningfulTokens(value: string) {
  const stopWords = new Set([
    "hvad",
    "hvilken",
    "hvilke",
    "hvordan",
    "hvorfor",
    "vil",
    "du",
    "dig",
    "din",
    "dit",
    "de",
    "det",
    "der",
    "for",
    "med",
    "mest",
    "mod",
    "eller",
    "som",
    "til",
    "lige",
    "nu",
    "gerne",
    "helst",
    "vaere",
    "blive",
    "arbejder",
    "rolle",
  ]);

  return normalizeText(value)
    .split(" ")
    .filter((token) => token.length > 2 && !stopWords.has(token));
}

function inferFocusAreaFromQuestion(question: string): FocusArea | null {
  const normalized = normalizeText(question);

  const keywordMap: Record<FocusArea, string[]> = {
    current_work_reality: ["nuvaerende", "hverdag", "arbejde", "arbejder", "ansvar", "opgaver", "processer", "produkter", "mennesker"],
    level_seniority: ["senior", "niveau", "ansvar", "ledelse", "beslutninger", "scope", "leder", "erfaren"],
    transferable_strengths: ["styrker", "kompetencer", "erfaring", "overforbare", "transferable", "stolt", "resultater"],
    direction_change: ["naeste", "skridt", "retning", "produktleder", "projektleder", "udvikle", "skifte", "onsker"],
    work_style_fit: ["arbejdsmiljo", "arbejdsmiljoe", "trives", "ambiguity", "uklarhed", "struktur", "tempo", "samarbejde"],
    mismatch_risk: ["bekymring", "risiko", "udfordring", "mismatch", "ikke", "blokere", "hindre"],
  };

  let bestMatch: { focusArea: FocusArea; score: number } | null = null;

  for (const [focusArea, keywords] of Object.entries(keywordMap) as [FocusArea, string[]][]) {
    const score = keywords.reduce((count, keyword) => (normalized.includes(keyword) ? count + 1 : count), 0);

    if (score === 0) {
      continue;
    }

    if (!bestMatch || score > bestMatch.score) {
      bestMatch = { focusArea, score };
    }
  }

  return bestMatch?.focusArea ?? null;
}

function areQuestionsTooSimilar(previousQuestion: string, nextQuestion: string) {
  const previousNormalized = normalizeText(previousQuestion);
  const nextNormalized = normalizeText(nextQuestion);

  if (!previousNormalized || !nextNormalized) {
    return false;
  }

  if (previousNormalized === nextNormalized) {
    return true;
  }

  const previousTokens = new Set(getMeaningfulTokens(previousQuestion));
  const nextTokens = new Set(getMeaningfulTokens(nextQuestion));

  if (previousTokens.size === 0 || nextTokens.size === 0) {
    return false;
  }

  let overlap = 0;

  for (const token of previousTokens) {
    if (nextTokens.has(token)) {
      overlap += 1;
    }
  }

  const overlapRatio = overlap / Math.min(previousTokens.size, nextTokens.size);
  return overlapRatio >= 0.6;
}

function containsDisallowedJargon(question: string) {
  const normalized = normalizeText(question);
  const disallowedTerms = [
    "individual contributor",
    "career path",
    "people manager",
    "ownership",
    "scope",
    "stakeholder management",
    "delivery",
    "fit gap",
    "seniority level",
  ];

  return disallowedTerms.some((term) => normalized.includes(term));
}

function logRetryAttempt(attempt: number, reasonCode: ReasonCode) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[interview] retry attempt ${attempt} after ${reasonCode}`);
  }
}

function sanitizeModelOutputExcerpt(outputText: string) {
  return outputText.replace(/\s+/g, " ").trim().slice(0, 220);
}

function logModelValidationFailure(reasonCode: ReasonCode, outputText: string, status?: unknown) {
  if (process.env.NODE_ENV !== "production") {
    const excerpt = sanitizeModelOutputExcerpt(outputText);
    const statusDetail = typeof status === "string" ? ` status=${status}` : "";
    console.warn(`[interview] model validation failed: ${reasonCode}${statusDetail} excerpt="${excerpt}"`);
  }
}

function incrementEvidenceCount(count: number) {
  return Math.min(count + 1, 2);
}

function normalizeInterviewState(value: unknown): InterviewState {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return createEmptyInterviewState();
  }

  const candidate = value as Record<string, unknown>;
  const coverageCandidate =
    candidate.coverage && typeof candidate.coverage === "object" && !Array.isArray(candidate.coverage)
      ? (candidate.coverage as Record<string, unknown>)
      : {};
  const evidenceCountsCandidate =
    candidate.evidenceCounts && typeof candidate.evidenceCounts === "object" && !Array.isArray(candidate.evidenceCounts)
      ? (candidate.evidenceCounts as Record<string, unknown>)
      : {};

  const coveredFocusAreas = Array.isArray(candidate.coveredFocusAreas)
    ? candidate.coveredFocusAreas.filter(isFocusArea)
    : [];

  return {
    answeredTurns:
      typeof candidate.answeredTurns === "number" && Number.isInteger(candidate.answeredTurns) && candidate.answeredTurns >= 0
        ? candidate.answeredTurns
        : 0,
    coveredFocusAreas,
    coverage: {
      currentWorkReality: coverageCandidate.currentWorkReality === true,
      levelSeniority: coverageCandidate.levelSeniority === true,
      transferableStrengths: coverageCandidate.transferableStrengths === true,
      directionOfChange: coverageCandidate.directionOfChange === true,
      workStyleFit: coverageCandidate.workStyleFit === true,
      mismatchRisk: coverageCandidate.mismatchRisk === true,
      evidenceDepth: coverageCandidate.evidenceDepth === true,
      concreteEvidence: coverageCandidate.concreteEvidence === true,
      ownershipScope: coverageCandidate.ownershipScope === true,
      resultEvidence: coverageCandidate.resultEvidence === true,
      motivationFit: coverageCandidate.motivationFit === true,
      domainContext: coverageCandidate.domainContext === true,
      noGoClarity: coverageCandidate.noGoClarity === true,
      profileStrengthGap: coverageCandidate.profileStrengthGap === true,
    },
    evidenceCounts: {
      concreteEvidenceCount:
        typeof evidenceCountsCandidate.concreteEvidenceCount === "number"
          ? Math.max(0, Math.min(2, Math.floor(evidenceCountsCandidate.concreteEvidenceCount)))
          : 0,
      ownershipScopeCount:
        typeof evidenceCountsCandidate.ownershipScopeCount === "number"
          ? Math.max(0, Math.min(2, Math.floor(evidenceCountsCandidate.ownershipScopeCount)))
          : 0,
      resultEvidenceCount:
        typeof evidenceCountsCandidate.resultEvidenceCount === "number"
          ? Math.max(0, Math.min(2, Math.floor(evidenceCountsCandidate.resultEvidenceCount)))
          : 0,
    },
  };
}

function updateInterviewState({
  interviewState,
  lastAssistantQuestion,
  lastUserAnswer,
  profileSummary,
}: {
  interviewState: InterviewState;
  lastAssistantQuestion: string | null;
  lastUserAnswer: string | null;
  profileSummary?: ProfileSummary;
}) {
  const nextState: InterviewState = {
    answeredTurns: interviewState.answeredTurns,
    coveredFocusAreas: [...interviewState.coveredFocusAreas],
    coverage: { ...interviewState.coverage },
    evidenceCounts: { ...interviewState.evidenceCounts },
  };

  if (!lastAssistantQuestion || !lastUserAnswer || !hasSubstantiveAnswer(lastUserAnswer)) {
    return nextState;
  }

  const priorFocusArea = inferFocusAreaFromQuestion(lastAssistantQuestion);

  nextState.answeredTurns += 1;

  if (priorFocusArea && !nextState.coveredFocusAreas.includes(priorFocusArea)) {
    nextState.coveredFocusAreas.push(priorFocusArea);
  }

  if (priorFocusArea === "current_work_reality") {
    nextState.coverage.currentWorkReality = true;
  }

  if (priorFocusArea === "level_seniority") {
    nextState.coverage.levelSeniority = true;
  }

  if (priorFocusArea === "transferable_strengths") {
    nextState.coverage.transferableStrengths = true;
  }

  if (priorFocusArea === "direction_change") {
    nextState.coverage.directionOfChange = true;
  }

  if (priorFocusArea === "work_style_fit") {
    nextState.coverage.workStyleFit = true;
  }

  if (priorFocusArea === "mismatch_risk") {
    nextState.coverage.mismatchRisk = true;
  }

  if (hasConcreteEvidenceSignal(lastUserAnswer)) {
    nextState.coverage.evidenceDepth = true;
    nextState.coverage.concreteEvidence = true;
    nextState.evidenceCounts.concreteEvidenceCount = incrementEvidenceCount(nextState.evidenceCounts.concreteEvidenceCount);
  }

  if (hasOwnershipScopeSignal(lastUserAnswer)) {
    nextState.coverage.ownershipScope = true;
    nextState.evidenceCounts.ownershipScopeCount = incrementEvidenceCount(nextState.evidenceCounts.ownershipScopeCount);
  }

  if (hasResultEvidenceSignal(lastUserAnswer)) {
    nextState.coverage.resultEvidence = true;
    nextState.evidenceCounts.resultEvidenceCount = incrementEvidenceCount(nextState.evidenceCounts.resultEvidenceCount);
  }

  if (hasMotivationSignal(lastUserAnswer)) {
    nextState.coverage.motivationFit = true;
  }

  if (hasDomainContextSignal(lastUserAnswer)) {
    nextState.coverage.domainContext = true;
  }

  if (hasNoGoSignal(lastUserAnswer)) {
    nextState.coverage.noGoClarity = true;
  }

  if (hasProfileStrengthGapSignal(lastUserAnswer)) {
    nextState.coverage.profileStrengthGap = true;
  }

  if (profileSummary) {
    if (hasDescriptiveDepth(profileSummary.aiProfileCore.currentWorkReality, 7)) {
      nextState.coverage.currentWorkReality = true;
    }

    if (hasDescriptiveDepth(profileSummary.aiProfileCore.levelSeniority, 6)) {
      nextState.coverage.levelSeniority = true;
    }

    if (hasMeaningfulItems(profileSummary.aiProfileCore.transferableStrengths, 3, 1)) {
      nextState.coverage.transferableStrengths = true;
    }

    if (hasDescriptiveDepth(profileSummary.aiProfileCore.directionOfChange, 6)) {
      nextState.coverage.directionOfChange = true;
    }

    if (hasDescriptiveDepth(profileSummary.aiProfileCore.workStyleFit, 6)) {
      nextState.coverage.workStyleFit = true;
    }

    if (hasMeaningfulItems(profileSummary.aiProfileCore.mismatchRisks, 2, 3)) {
      nextState.coverage.mismatchRisk = true;
    }

    if (
      hasDistinctVocabulary(
        [
          profileSummary.aiProfileCore.currentWorkReality,
          profileSummary.aiProfileCore.levelSeniority,
          profileSummary.aiProfileCore.directionOfChange,
          profileSummary.aiProfileCore.workStyleFit,
        ],
        12,
      )
    ) {
      nextState.coverage.evidenceDepth = true;
    }

    if (
      hasConcreteEvidenceSignal(profileSummary.aiProfileCore.currentWorkReality) ||
      hasConcreteEvidenceSignal(profileSummary.aiProfileCore.levelSeniority)
    ) {
      nextState.coverage.concreteEvidence = true;
      nextState.evidenceCounts.concreteEvidenceCount = Math.max(nextState.evidenceCounts.concreteEvidenceCount, 2);
    }

    if (
      hasOwnershipScopeSignal(profileSummary.aiProfileCore.currentWorkReality) ||
      hasOwnershipScopeSignal(profileSummary.aiProfileCore.levelSeniority)
    ) {
      nextState.coverage.ownershipScope = true;
      nextState.evidenceCounts.ownershipScopeCount = Math.max(nextState.evidenceCounts.ownershipScopeCount, 2);
    }

    if (
      hasResultEvidenceSignal(profileSummary.aiProfileCore.currentWorkReality) ||
      profileSummary.aiProfileCore.mismatchRisks.some((item) => hasResultEvidenceSignal(item))
    ) {
      nextState.coverage.resultEvidence = true;
      nextState.evidenceCounts.resultEvidenceCount = Math.max(nextState.evidenceCounts.resultEvidenceCount, 2);
    }

    if (
      hasMotivationSignal(profileSummary.aiProfileCore.directionOfChange) ||
      hasMotivationSignal(profileSummary.aiProfileCore.workStyleFit)
    ) {
      nextState.coverage.motivationFit = true;
    }

    if (
      hasDomainContextSignal(profileSummary.aiProfileCore.currentWorkReality) ||
      profileSummary.aiProfileCore.transferableStrengths.some((item) => hasDomainContextSignal(item))
    ) {
      nextState.coverage.domainContext = true;
    }

    if (
      hasNoGoSignal(profileSummary.aiProfileCore.workStyleFit) ||
      profileSummary.aiProfileCore.mismatchRisks.some((item) => hasNoGoSignal(item))
    ) {
      nextState.coverage.noGoClarity = true;
    }

    if (
      hasProfileStrengthGapSignal(profileSummary.aiProfileCore.directionOfChange) ||
      profileSummary.aiProfileCore.mismatchRisks.some((item) => hasProfileStrengthGapSignal(item))
    ) {
      nextState.coverage.profileStrengthGap = true;
    }
  }

  return nextState;
}

function hasMinimumInterviewCoverage(interviewState: InterviewState) {
  const practicalEvidenceCount = [
    interviewState.coverage.concreteEvidence,
    interviewState.coverage.ownershipScope,
    interviewState.coverage.resultEvidence,
  ].filter(Boolean).length;

  const broaderCoverageCount = [
    interviewState.coverage.levelSeniority,
    interviewState.coverage.workStyleFit,
    interviewState.coverage.mismatchRisk,
    interviewState.coverage.domainContext,
    interviewState.coverage.noGoClarity,
    interviewState.coverage.profileStrengthGap,
  ].filter(Boolean).length;

  return (
    interviewState.answeredTurns >= 7 &&
    interviewState.coveredFocusAreas.length >= 5 &&
    interviewState.coverage.currentWorkReality &&
    interviewState.coverage.directionOfChange &&
    interviewState.coverage.transferableStrengths &&
    interviewState.coverage.evidenceDepth &&
    interviewState.coverage.motivationFit &&
    practicalEvidenceCount >= 2 &&
    broaderCoverageCount >= 2
  );
}

function isEvidenceTrackSaturated(interviewState: InterviewState, track: EvidenceTrack) {
  switch (track) {
    case "concreteEvidence":
      return interviewState.evidenceCounts.concreteEvidenceCount >= 2;
    case "ownershipScope":
      return interviewState.evidenceCounts.ownershipScopeCount >= 2;
    case "resultEvidence":
      return interviewState.evidenceCounts.resultEvidenceCount >= 2;
  }
}

function inferEvidenceTrackFromQuestion(question: string): EvidenceTrack | null {
  const normalized = normalizeText(question);

  const resultKeywords = ["hvad kom ud af", "resultat", "effekt", "ud af dit arbejde", "hvad skete der"];
  if (resultKeywords.some((keyword) => normalized.includes(keyword))) {
    return "resultEvidence";
  }

  const ownershipKeywords = ["ansvaret for", "selv ansvaret", "fra start til slut", "eget ansvar", "hvad havde du selv ansvaret for"];
  if (ownershipKeywords.some((keyword) => normalized.includes(keyword))) {
    return "ownershipScope";
  }

  const concreteKeywords = ["konkret eksempel", "eksempel", "case", "situation", "opgave"];
  if (concreteKeywords.some((keyword) => normalized.includes(keyword))) {
    return "concreteEvidence";
  }

  return null;
}

type MissingCoverageDimension =
  | "currentWorkReality"
  | "levelSeniority"
  | "transferableStrengths"
  | "directionOfChange"
  | "workStyleFit"
  | "mismatchRisk"
  | "evidenceDepth"
  | "concreteEvidence"
  | "ownershipScope"
  | "resultEvidence"
  | "motivationFit"
  | "domainContext"
  | "noGoClarity"
  | "profileStrengthGap";

type EvidenceTrack = "concreteEvidence" | "ownershipScope" | "resultEvidence";

function getMissingCoverageDimensions(interviewState: InterviewState): MissingCoverageDimension[] {
  const coverageEntries: Array<[MissingCoverageDimension, boolean]> = [
    ["currentWorkReality", interviewState.coverage.currentWorkReality],
    ["levelSeniority", interviewState.coverage.levelSeniority],
    ["transferableStrengths", interviewState.coverage.transferableStrengths],
    ["directionOfChange", interviewState.coverage.directionOfChange],
    ["workStyleFit", interviewState.coverage.workStyleFit],
    ["mismatchRisk", interviewState.coverage.mismatchRisk],
    ["evidenceDepth", interviewState.coverage.evidenceDepth],
    ["concreteEvidence", interviewState.coverage.concreteEvidence],
    ["ownershipScope", interviewState.coverage.ownershipScope],
    ["resultEvidence", interviewState.coverage.resultEvidence],
    ["motivationFit", interviewState.coverage.motivationFit],
    ["domainContext", interviewState.coverage.domainContext],
    ["noGoClarity", interviewState.coverage.noGoClarity],
    ["profileStrengthGap", interviewState.coverage.profileStrengthGap],
  ];

  return coverageEntries.filter(([, covered]) => !covered).map(([dimension]) => dimension);
}

function buildRecoveryQuestionForMissingCoverage(
  interviewState: InterviewState,
  priorityOverride?: MissingCoverageDimension[],
): { question: string; focusArea: FocusArea; missingDimension: MissingCoverageDimension } | null {
  const missingDimensions = new Set(getMissingCoverageDimensions(interviewState));
  const recoveryPriority: MissingCoverageDimension[] = priorityOverride ?? [
    "concreteEvidence",
    "ownershipScope",
    "resultEvidence",
    "noGoClarity",
    "domainContext",
    "profileStrengthGap",
    "motivationFit",
    "mismatchRisk",
    "workStyleFit",
    "levelSeniority",
  ];

  for (const dimension of recoveryPriority) {
    if (!missingDimensions.has(dimension)) {
      continue;
    }

    switch (dimension) {
      case "concreteEvidence":
        return {
          question: "Kan du give et konkret eksempel på en opgave eller situation, som viser det bedst?",
          focusArea: "transferable_strengths",
          missingDimension: dimension,
        };
      case "ownershipScope":
        return {
          question: "Hvad havde du selv ansvaret for i den opgave fra start til slut?",
          focusArea: "level_seniority",
          missingDimension: dimension,
        };
      case "resultEvidence":
        return {
          question: "Kan du give et konkret eksempel på, hvad der kom ud af dit arbejde i en vigtig opgave eller leverance?",
          focusArea: "transferable_strengths",
          missingDimension: dimension,
        };
      case "noGoClarity":
        return {
          question: "Hvad vil du helst undgå i dit næste job, hvis du skal trives og lykkes?",
          focusArea: "mismatch_risk",
          missingDimension: dimension,
        };
      case "domainContext":
        return {
          question: "Hvilken branche, type virksomhed eller type kunder har du mest arbejdet med de seneste år?",
          focusArea: "current_work_reality",
          missingDimension: dimension,
        };
      case "profileStrengthGap":
        return {
          question: "Hvor mener du selv, at din profil endnu er svagere end den rolle, du gerne vil bevæge dig mod?",
          focusArea: "mismatch_risk",
          missingDimension: dimension,
        };
      case "motivationFit":
        return {
          question: "Hvad giver dig mest energi i arbejdet, når du virkelig trives og lykkes?",
          focusArea: "work_style_fit",
          missingDimension: dimension,
        };
      case "mismatchRisk":
        return {
          question: "Hvilke typer opgaver, ansvar eller rammer vil være et dårligt match for dig fremover?",
          focusArea: "mismatch_risk",
          missingDimension: dimension,
        };
      case "workStyleFit":
        return {
          question: "Hvilken måde at arbejde på passer bedst til dig i hverdagen, hvis du skal lykkes over tid?",
          focusArea: "work_style_fit",
          missingDimension: dimension,
        };
      case "levelSeniority":
        return {
          question: "Hvilket ansvar eller hvilken beslutningsrolle har du typisk haft i de vigtigste opgaver?",
          focusArea: "level_seniority",
          missingDimension: dimension,
        };
      default:
        break;
    }
  }

  return null;
}

function isProfileSummarySufficientForPhase1({
  profileSummary,
  lastAssistantQuestion,
  lastUserAnswer,
  interviewState,
}: {
  profileSummary: ProfileSummary;
  lastAssistantQuestion: string | null;
  lastUserAnswer: string | null;
  interviewState: InterviewState;
}) {
  if (!lastAssistantQuestion || !lastUserAnswer) {
    return false;
  }

  if (!hasSubstantiveAnswer(lastUserAnswer)) {
    return false;
  }

  const populatedUserFields = [
    profileSummary.userProfileData.name,
    profileSummary.userProfileData.currentRole,
    profileSummary.userProfileData.yearsExperience,
    profileSummary.userProfileData.targetDirection,
  ].filter((value) => typeof value === "string" && value.trim().length > 0).length;

  if (populatedUserFields < 2) {
    return false;
  }

  const aiCore = profileSummary.aiProfileCore;

  if (
    !hasDescriptiveDepth(aiCore.currentWorkReality, 7) ||
    !hasDescriptiveDepth(aiCore.levelSeniority, 6) ||
    !hasDescriptiveDepth(aiCore.directionOfChange, 6) ||
    !hasDescriptiveDepth(aiCore.workStyleFit, 6)
  ) {
    return false;
  }

  if (
    !hasMeaningfulItems(aiCore.transferableStrengths, 3, 1) ||
    !hasMeaningfulItems(aiCore.mismatchRisks, 2, 3)
  ) {
    return false;
  }

  if (!isConfidenceLevel(aiCore.confidence)) {
    return false;
  }

  const narrativeFields = [
    aiCore.currentWorkReality,
    aiCore.levelSeniority,
    aiCore.directionOfChange,
    aiCore.workStyleFit,
  ];

  if (
    looksTemplateLike(narrativeFields) ||
    !hasDistinctVocabulary(narrativeFields, 12) ||
    !hasDistinctVocabulary(aiCore.transferableStrengths, 4) ||
    !hasDistinctVocabulary(aiCore.mismatchRisks, 5)
  ) {
    return false;
  }

  const priorFocusArea = inferFocusAreaFromQuestion(lastAssistantQuestion);
  const distinctCoverageSignals = [
    hasDescriptiveDepth(aiCore.currentWorkReality, 7),
    hasDescriptiveDepth(aiCore.levelSeniority, 6),
    hasDescriptiveDepth(aiCore.directionOfChange, 6),
    hasDescriptiveDepth(aiCore.workStyleFit, 6),
    hasMeaningfulItems(aiCore.transferableStrengths, 3, 1),
    hasMeaningfulItems(aiCore.mismatchRisks, 2, 3),
  ].filter(Boolean).length;

  if (distinctCoverageSignals < 5) {
    return false;
  }

  if (
    priorFocusArea === "direction_change" &&
    (!hasDescriptiveDepth(aiCore.currentWorkReality, 7) ||
      !hasDescriptiveDepth(aiCore.levelSeniority, 6) ||
      !hasDescriptiveDepth(aiCore.workStyleFit, 6) ||
      !hasMeaningfulItems(aiCore.mismatchRisks, 2, 3))
  ) {
    return false;
  }

  const normalizedDirection = normalizeText(aiCore.directionOfChange);
  const normalizedReality = normalizeText(aiCore.currentWorkReality);
  const normalizedStyleFit = normalizeText(aiCore.workStyleFit);

  if (
    normalizedDirection &&
    (normalizedDirection === normalizedReality ||
      normalizedDirection === normalizedStyleFit ||
      areQuestionsTooSimilar(aiCore.directionOfChange, aiCore.currentWorkReality) ||
      areQuestionsTooSimilar(aiCore.directionOfChange, aiCore.workStyleFit))
  ) {
    return false;
  }

  if (!hasMinimumInterviewCoverage(interviewState)) {
    return false;
  }

  return true;
}

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return errorResponse("OpenAI is not configured.", "OPENAI_REQUEST_FAILED");
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid JSON body.");
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return errorResponse("Invalid request body.");
  }

  const payload = body as Record<string, unknown>;

  if (payload.phase !== "initial") {
    return errorResponse("Invalid phase.");
  }

  const rawProfileDraft = payload.profileDraft;

  if (!rawProfileDraft || typeof rawProfileDraft !== "object" || Array.isArray(rawProfileDraft)) {
    return errorResponse("Invalid profileDraft.");
  }

  const profileDraftInput = rawProfileDraft as Record<string, unknown>;
  const profileDraft: ProfileDraft = {};

  for (const key of ["name", "currentRole", "yearsExperience", "targetDirection"] as const) {
    const rawValue = profileDraftInput[key];

    if (rawValue === undefined) {
      continue;
    }

    if (!isShortString(rawValue)) {
      return errorResponse(`Invalid ${key}.`);
    }

    profileDraft[key] = rawValue.trim();
  }

  const lastUserAnswer = payload.lastUserAnswer;
  const lastAssistantQuestion = payload.lastAssistantQuestion;
  const interviewState = normalizeInterviewState(payload.interviewState);

  if (lastUserAnswer !== undefined && lastUserAnswer !== null && !isShortString(lastUserAnswer, 1000)) {
    return errorResponse("Invalid lastUserAnswer.");
  }

  if (
    lastAssistantQuestion !== undefined &&
    lastAssistantQuestion !== null &&
    !isShortString(lastAssistantQuestion, 300)
  ) {
    return errorResponse("Invalid lastAssistantQuestion.");
  }

  if (
    typeof lastUserAnswer === "string" &&
    lastUserAnswer.trim().length > 0 &&
    !(typeof lastAssistantQuestion === "string" && lastAssistantQuestion.trim().length > 0)
  ) {
    return errorResponse("lastAssistantQuestion is required.");
  }

  const lowQualityReason =
    typeof lastUserAnswer === "string" && lastUserAnswer.trim().length > 0
      ? getLowQualityReason(lastUserAnswer)
      : null;

  if (lowQualityReason) {
    return errorResponse(
      "Svaret er for kort eller uklart til at føre interviewet videre.",
      "LOW_QUALITY_ANSWER",
      { lowQualityReason },
    );
  }

  const systemPrompt = [
    "You are JobPilot's adaptive onboarding interviewer.",
    "JobPilot is an AI job-search operating system, not a chatbot and not a CV generator.",
    "JobPilot v1 is Denmark-only and Danish-only.",
    "Your task is to ask exactly one high-value next question.",
    "You may also decide that phase-1 onboarding is sufficiently clear and should stop now.",
    "Do not give advice, explanations, summaries, encouragement, or multiple questions.",
    "Do not ask open-ended chatty questions.",
    "Ask one concrete question that reduces uncertainty about work reality, level, transferable strengths, direction of change, work-style fit, or mismatch risk.",
    "If information is missing, prioritize the highest-value clarification.",
    "When a prior assistant question and user answer are provided, use that pair as controlled interview context for interpreting the user's latest answer.",
    "Do not repeat the same clarification if the latest user answer already resolves it sufficiently for phase 1.",
    "If the latest answer has already clarified the active uncertainty, either move to a different unresolved area or return status complete.",
    "Repeated direction-of-change questions are a sign to stop if the user's direction is already clear enough for phase 1.",
    "You are working toward actual coverage across profiling dimensions, not just a plausible sounding summary.",
    "Use plain Danish that ordinary users across job types can understand.",
    "Avoid English career jargon and internal HR or product language unless the user's own profile clearly justifies it.",
    "Prefer normal Danish expressions such as specialist uden personaleansvar, faglig specialist, rolle med personaleansvar, or lederrolle when relevant.",
    "Do not complete until enough areas are clarified in substance: current work reality, direction of change, transferable strengths, evidence depth, motivation, and broader missing dimensions such as branch or domain context, no-go conditions, work-style fit, mismatch risk, or whether the current profile is strong enough for the target level.",
    "If direction of change is already clear, move to missing areas instead of circling back.",
    "Do not over-prioritize role identity, level, and strengths if branch context, concrete examples, results, motivation, fravalg, or profile-strength-versus-goal-level are still weak.",
    "Actively move toward missing areas such as domain or industry context, examples, results, evidence, motivation, no-go conditions, and profile strength versus target level when those areas remain unresolved.",
    "If status is continue, focusArea must always be exactly one of these six values: current_work_reality, level_seniority, transferable_strengths, direction_change, work_style_fit, mismatch_risk.",
    "Never invent new focusArea labels.",
    "Broader themes such as domain context, evidence depth, concrete evidence, ownership scope, result evidence, motivation fit, no-go clarity, or profile-strength-gap must still be expressed through one of the six allowed focusArea values.",
    "Do not rely too much on generic preference answers when the profile evidence is still weak.",
    "Ask what the user has actually done in practice, not only what they want or think they are good at.",
    "When evidence is weak, ask for a specific example, case, task pattern, responsibility, ownership scope, or practical outcome.",
    "Probe responsibility and scope when the user's target level looks higher than the currently proven evidence.",
    "Look for proof of readiness, not only aspiration.",
    "Evidence can be result-based, case-based, task-and-responsibility-based, or transition-supporting depending on the user's segment.",
    "Make it easier to understand what the user owned themselves, what they coordinated, what happened because of their work, and what supports readiness for the next level.",
    "Once a concrete example has already been established with responsibility and result, do not keep asking slightly different versions of the same evidence request.",
    "Avoid semantic circling around the same case, responsibility, or result theme even if the wording changes.",
    "When enough evidence has already been gathered on one evidence track, move to missing areas or assess completion instead.",
    "Think in terms of sufficiency for phase-1 profile evaluation: current work reality, level or seniority, transferable strengths, direction of change, work-style fit, and mismatch risk.",
    "Use status complete only when there is enough clarity to begin serious next-step profile assessment.",
    "If status is continue, the question text must be written in natural, professional Danish.",
    "If status is complete, return a concise structured phase-1 profile summary.",
    "For status complete, separate user-provided profile data from AI-derived profile core.",
    "Keep the question concise and specific.",
    'Return only valid JSON in exactly one of these shapes: {"status":"continue","question":"...","focusArea":"current_work_reality|level_seniority|transferable_strengths|direction_change|work_style_fit|mismatch_risk"} or {"status":"complete","profileSummary":{"userProfileData":{"name":string|null,"currentRole":string|null,"yearsExperience":string|null,"targetDirection":string|null},"aiProfileCore":{"currentWorkReality":string,"levelSeniority":string,"transferableStrengths":string[],"directionOfChange":string,"workStyleFit":string,"mismatchRisks":string[],"confidence":"low"|"medium"|"high"}}}.',
    "Do not include markdown, prose, or extra keys.",
  ].join(" ");

  const userPrompt = JSON.stringify({
    phase: "initial",
    profileDraft,
    lastAssistantQuestion: typeof lastAssistantQuestion === "string" ? lastAssistantQuestion.trim() : null,
    lastUserAnswer: typeof lastUserAnswer === "string" ? lastUserAnswer.trim() : null,
    interviewState,
    instruction:
      "Decide whether JobPilot should continue with exactly one next question or stop because phase-1 onboarding is sufficiently complete. The human-facing question text must be in Danish. If complete, return the structured phase-1 profile summary. Return only the required JSON object.",
  });

  async function generateInterviewStep(): Promise<GenerateSuccess | GenerateFailure> {
    try {
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          input: [
            {
              role: "system",
              content: [{ type: "input_text", text: systemPrompt }],
            },
            {
              role: "user",
              content: [{ type: "input_text", text: userPrompt }],
            },
          ],
        }),
      });

      if (!response.ok) {
        return {
          ok: false,
          error: "OpenAI request failed.",
          reasonCode: "OPENAI_REQUEST_FAILED",
          retryable: true,
        };
      }

      const data = (await response.json()) as Record<string, unknown>;
      const outputText = extractOutputText(data);

      if (!outputText) {
        logModelValidationFailure("INVALID_MODEL_OUTPUT", "[empty output]");
        return {
          ok: false,
          error: "Could not parse model output.",
          reasonCode: "INVALID_MODEL_OUTPUT",
          retryable: true,
        };
      }

      let parsed: unknown;

      try {
        parsed = JSON.parse(outputText);
      } catch {
        logModelValidationFailure("INVALID_MODEL_JSON", outputText);
        return {
          ok: false,
          error: "Invalid model JSON.",
          reasonCode: "INVALID_MODEL_JSON",
          retryable: true,
        };
      }

      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        logModelValidationFailure("INVALID_MODEL_SHAPE", outputText);
        return {
          ok: false,
          error: "Invalid model response.",
          reasonCode: "INVALID_MODEL_SHAPE",
          retryable: true,
        };
      }

      const result = parsed as Record<string, unknown>;
      const status = result.status;

      if (!isInterviewStatus(status)) {
        logModelValidationFailure("INVALID_STATUS", outputText, status);
        return {
          ok: false,
          error: "Invalid interview status.",
          reasonCode: "INVALID_STATUS",
          retryable: true,
        };
      }

      if (status === "complete") {
        const profileSummary = result.profileSummary;

        if (!profileSummary || typeof profileSummary !== "object" || Array.isArray(profileSummary)) {
          logModelValidationFailure("INVALID_COMPLETE_PAYLOAD", outputText, status);
          return {
            ok: false,
            error: "Invalid profile summary.",
            reasonCode: "INVALID_COMPLETE_PAYLOAD",
            retryable: true,
          };
        }

        const summary = profileSummary as Record<string, unknown>;
        const userProfileData = summary.userProfileData;
        const aiProfileCore = summary.aiProfileCore;

        if (!userProfileData || typeof userProfileData !== "object" || Array.isArray(userProfileData)) {
          logModelValidationFailure("INVALID_PROFILE_SUMMARY", outputText, status);
          return {
            ok: false,
            error: "Invalid user profile data.",
            reasonCode: "INVALID_PROFILE_SUMMARY",
            retryable: true,
          };
        }

        if (!aiProfileCore || typeof aiProfileCore !== "object" || Array.isArray(aiProfileCore)) {
          logModelValidationFailure("INVALID_AI_PROFILE_CORE", outputText, status);
          return {
            ok: false,
            error: "Invalid AI profile core.",
            reasonCode: "INVALID_AI_PROFILE_CORE",
            retryable: true,
          };
        }

        const userData = userProfileData as Record<string, unknown>;
        const aiCore = aiProfileCore as Record<string, unknown>;

        const normalizedUserProfileData = {
          name: toNullableShortString(userData.name),
          currentRole: toNullableShortString(userData.currentRole),
          yearsExperience: toNullableShortString(userData.yearsExperience),
          targetDirection: toNullableShortString(userData.targetDirection),
        };

        const currentWorkReality = toNullableShortString(aiCore.currentWorkReality);
        const levelSeniority = toNullableShortString(aiCore.levelSeniority);
        const directionOfChange = toNullableShortString(aiCore.directionOfChange);
        const workStyleFit = toNullableShortString(aiCore.workStyleFit);

        if (!currentWorkReality || !levelSeniority || !directionOfChange || !workStyleFit) {
          logModelValidationFailure("INVALID_AI_PROFILE_CORE", outputText, status);
          return {
            ok: false,
            error: "Invalid AI profile core.",
            reasonCode: "INVALID_AI_PROFILE_CORE",
            retryable: true,
          };
        }

        if (!isStringArray(aiCore.transferableStrengths) || !isStringArray(aiCore.mismatchRisks)) {
          logModelValidationFailure("INVALID_AI_PROFILE_CORE", outputText, status);
          return {
            ok: false,
            error: "Invalid AI profile arrays.",
            reasonCode: "INVALID_AI_PROFILE_CORE",
            retryable: true,
          };
        }

        if (!isConfidenceLevel(aiCore.confidence)) {
          logModelValidationFailure("INVALID_AI_PROFILE_CORE", outputText, status);
          return {
            ok: false,
            error: "Invalid confidence level.",
            reasonCode: "INVALID_AI_PROFILE_CORE",
            retryable: true,
          };
        }

        const normalizedProfileSummary = {
          userProfileData: normalizedUserProfileData,
          aiProfileCore: {
            currentWorkReality,
            levelSeniority,
            transferableStrengths: aiCore.transferableStrengths.map((item) => item.trim()),
            directionOfChange,
            workStyleFit,
            mismatchRisks: aiCore.mismatchRisks.map((item) => item.trim()),
            confidence: aiCore.confidence,
          },
        };

        const updatedInterviewState = updateInterviewState({
          interviewState,
          lastAssistantQuestion: typeof lastAssistantQuestion === "string" ? lastAssistantQuestion.trim() : null,
          lastUserAnswer: typeof lastUserAnswer === "string" ? lastUserAnswer.trim() : null,
          profileSummary: normalizedProfileSummary,
        });

        if (
          !isProfileSummarySufficientForPhase1({
            profileSummary: normalizedProfileSummary,
            lastAssistantQuestion: typeof lastAssistantQuestion === "string" ? lastAssistantQuestion.trim() : null,
            lastUserAnswer: typeof lastUserAnswer === "string" ? lastUserAnswer.trim() : null,
            interviewState: updatedInterviewState,
          })
        ) {
          const recovery = buildRecoveryQuestionForMissingCoverage(updatedInterviewState);

          if (recovery) {
            if (process.env.NODE_ENV !== "production") {
              console.debug(
                `[interview] recovered from insufficient coverage by asking about ${recovery.missingDimension}`,
              );
            }

            return {
              ok: true,
              status: "continue",
              question: recovery.question,
              focusArea: recovery.focusArea,
              interviewState: updatedInterviewState,
            };
          }

          return {
            ok: false,
            error: "Interview coverage is not sufficient for completion.",
            reasonCode: "INSUFFICIENT_COVERAGE",
            retryable: true,
          };
        }

        return {
          ok: true,
          status,
          profileSummary: normalizedProfileSummary,
          interviewState: updatedInterviewState,
        };
      }

      const question = typeof result.question === "string" ? result.question.trim() : "";
      const focusArea = normalizeFocusArea(result.focusArea);

      if (!question || question.length > 300 || /\n/.test(question)) {
        logModelValidationFailure("INVALID_QUESTION_TEXT", outputText, status);
        return {
          ok: false,
          error: "Could not generate question.",
          reasonCode: "INVALID_QUESTION_TEXT",
          retryable: true,
        };
      }

      if (!isFocusArea(focusArea)) {
        logModelValidationFailure("INVALID_FOCUS_AREA", outputText, status);
        return {
          ok: false,
          error: "Invalid focus area.",
          reasonCode: "INVALID_FOCUS_AREA",
          retryable: true,
        };
      }

      if (containsDisallowedJargon(question)) {
        logModelValidationFailure("INVALID_PLAIN_DANISH", outputText, status);
        return {
          ok: false,
          error: "Interview question is not in plain Danish.",
          reasonCode: "INVALID_PLAIN_DANISH",
          retryable: true,
        };
      }

      const priorFocusArea =
        typeof lastAssistantQuestion === "string" ? inferFocusAreaFromQuestion(lastAssistantQuestion) : null;

      if (
        typeof lastAssistantQuestion === "string" &&
        priorFocusArea === focusArea &&
        areQuestionsTooSimilar(lastAssistantQuestion, question)
      ) {
        return {
          ok: false,
          error: "Repeated interview question.",
          reasonCode: "REPEATED_QUESTION",
          retryable: true,
        };
      }

      const updatedInterviewState = updateInterviewState({
        interviewState,
        lastAssistantQuestion: typeof lastAssistantQuestion === "string" ? lastAssistantQuestion.trim() : null,
        lastUserAnswer: typeof lastUserAnswer === "string" ? lastUserAnswer.trim() : null,
      });

      const evidenceTrack = inferEvidenceTrackFromQuestion(question);

      if (evidenceTrack && isEvidenceTrackSaturated(updatedInterviewState, evidenceTrack)) {
        const recovery = buildRecoveryQuestionForMissingCoverage(updatedInterviewState, [
          "noGoClarity",
          "profileStrengthGap",
          "mismatchRisk",
          "workStyleFit",
          "levelSeniority",
          "domainContext",
        ]);

        if (recovery) {
          if (process.env.NODE_ENV !== "production") {
            console.debug(`[interview] recovered from saturated evidence track: ${evidenceTrack}`);
          }

          return {
            ok: true,
            status: "continue",
            question: recovery.question,
            focusArea: recovery.focusArea,
            interviewState: updatedInterviewState,
          };
        }
      }

      return {
        ok: true,
        status,
        question,
        focusArea,
        interviewState: updatedInterviewState,
      };
    } catch {
      return {
        ok: false,
        error: "OpenAI request failed.",
        reasonCode: "OPENAI_REQUEST_FAILED",
        retryable: true,
      };
    }
  }

  const maxAttempts = 3;
  let lastFailure: GenerateFailure | null = null;
  const retryTrail: ReasonCode[] = [];

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const result = await generateInterviewStep();

    if (result.ok) {
      return Response.json(result);
    }

    lastFailure = result;
    retryTrail.push(result.reasonCode);

    if (!result.retryable) {
      return errorResponse(result.error, result.reasonCode);
    }

    if (attempt < maxAttempts) {
      logRetryAttempt(attempt, result.reasonCode);
      continue;
    }
  }

  if (lastFailure) {
    return errorResponse("Could not generate the next interview step.", "RETRY_EXHAUSTED", {
      lastFailureReasonCode: lastFailure.reasonCode,
      retryTrail,
    });
  }
}
