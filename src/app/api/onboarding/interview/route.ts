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
  noGoClarityCount: number;
  profileStrengthGapCount: number;
  productOwnershipEvidenceCount: number;
};

type EvidenceDeltaCategory = "none" | "modest" | "strong";

type InterviewProgressMeta = {
  evidenceScore: number;
  lastEvidenceDelta: EvidenceDeltaCategory;
};

type InterviewState = {
  answeredTurns: number;
  coveredFocusAreas: FocusArea[];
  recentQuestions: { question: string; focusArea: FocusArea }[];
  coverage: InterviewCoverage;
  evidenceCounts: InterviewEvidenceCounts;
  progressMeta: InterviewProgressMeta;
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

type ReadinessLevel = "minimum_usable" | "stronger_profile" | "not_strong_enough_for_target";
type TargetDirectionSupport = "partial" | "strong" | "not_yet_proven";

type ReadinessAssessment = {
  level: ReadinessLevel;
  targetDirectionSupport: TargetDirectionSupport;
  summary: string;
  strengthSignals: string[];
  gapSignals: string[];
};

type EvidenceSourceKey =
  | "profile_draft"
  | "interview_answers"
  | "structured_summary"
  | "cv"
  | "linkedin"
  | "job_history"
  | "applications"
  | "certificates"
  | "notes"
  | "feedback";

type EvidenceSourceState = {
  key: EvidenceSourceKey;
  label: string;
  available: boolean;
  readiness: "current" | "future_placeholder";
  strength: "none" | "light" | "strong";
};

type ProfileFact = {
  key: string;
  statement: string;
  evidenceLevel: "explicit" | "supported";
  sources: EvidenceSourceKey[];
};

type ProfileInterpretation = {
  key: string;
  statement: string;
  confidence: ConfidenceLevel;
  evidenceSignals: string[];
};

type ProfileUncertainty = {
  key: string;
  statement: string;
  impact: "medium" | "high";
  focusArea: FocusArea;
  unresolved: boolean;
};

type Hypothesis = {
  key: string;
  statement: string;
  supportLevel: "low" | "medium" | "high";
  contradictionLevel: "none" | "low" | "medium";
  confidence: ConfidenceLevel;
  evidenceSignals: string[];
  unresolved: boolean;
};

type CommunicationSignals = {
  answerStyle: "concise" | "balanced" | "detailed";
  structureLevel: "low" | "medium" | "high";
  evidenceDensity: "low" | "medium" | "high";
  possibleSelfMinimizingLanguage: boolean;
  possibleOverlongExplanations: boolean;
};

type QuestionPriority = {
  key: string;
  statement: string;
  question: string;
  focusArea: FocusArea;
  score: number;
  reason: string;
  unresolved: boolean;
};

type InterviewProfileModel = {
  evidenceSources: EvidenceSourceState[];
  facts: ProfileFact[];
  interpretations: ProfileInterpretation[];
  uncertainties: ProfileUncertainty[];
  hypotheses: Hypothesis[];
  questionPriorities: QuestionPriority[];
  communicationSignals: CommunicationSignals;
};

type HypothesisSummaryItem = Pick<
  Hypothesis,
  "key" | "statement" | "confidence" | "supportLevel" | "contradictionLevel" | "unresolved"
>;

type UncertaintySummaryItem = Pick<ProfileUncertainty, "key" | "statement" | "impact" | "focusArea">;

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
      readinessAssessment: ReadinessAssessment;
      profileModel: InterviewProfileModel;
      hypothesisSummary: HypothesisSummaryItem[];
      uncertaintySummary: UncertaintySummaryItem[];
      communicationSignals: CommunicationSignals;
    };

type GenerateFailure = {
  ok: false;
  error: string;
  reasonCode: ReasonCode;
  retryable: boolean;
};

type AnswerQuality = "junk_or_testlike" | "vague_but_real_attempt" | "substantive_answer";
type TargetProfileKind =
  | "same_track"
  | "same_track_better_conditions"
  | "next_level"
  | "direction_change"
  | "product_transition"
  | "unclear"
  | "less_responsibility"
  | "specialist_track";
type SaturationFamily = "current_work_reality" | "resultEvidence" | "responsibility" | "mismatch_risk" | "ownership";

function isShortString(value: unknown, maxLength = 300): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= maxLength;
}

function isInterviewAnswerString(value: unknown, maxLength = 5000): value is string {
  return typeof value === "string" && value.length <= maxLength;
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
    recentQuestions: [],
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
      noGoClarityCount: 0,
      profileStrengthGapCount: 0,
      productOwnershipEvidenceCount: 0,
    },
    progressMeta: {
      evidenceScore: 0,
      lastEvidenceDelta: "none",
    },
  };
}

function hasSubstantiveAnswer(value: string) {
  return normalizeText(value).split(" ").filter(Boolean).length >= 6;
}

function inferAnswerQuality(value: string): AnswerQuality {
  const normalized = normalizeText(value);
  const tokens = normalized.split(" ").filter(Boolean);
  const clauseCount = value.split(/[,.!?;:\n]/).map((part) => part.trim()).filter(Boolean).length;

  if (getLowQualityReason(value)) {
    return "junk_or_testlike";
  }

  const supportiveSignals = [
    hasConcreteEvidenceSignal(value),
    hasOwnershipScopeSignal(value),
    hasResultEvidenceSignal(value),
    hasMotivationSignal(value),
    hasDomainContextSignal(value),
    hasNoGoSignal(value),
    hasProfileStrengthGapSignal(value),
  ].filter(Boolean).length;

  const shortButMeaningfulSignals = [
    hasDomainContextSignal(value),
    hasMotivationSignal(value),
    hasOwnershipScopeSignal(value),
    hasProfileStrengthGapSignal(value),
    /projektledelse|marketing|saas|b2b|service|fejlfinding|koordinering|ansvar|drift|produktion|salg|support/iu.test(
      value,
    ),
  ].filter(Boolean).length;

  if (tokens.length >= 12 || clauseCount >= 2 || supportiveSignals >= 2) {
    return "substantive_answer";
  }

  if (tokens.length >= 3 && shortButMeaningfulSignals >= 1) {
    return "vague_but_real_attempt";
  }

  return "vague_but_real_attempt";
}

function getLowQualityReason(value: string) {
  const normalized = normalizeText(value);
  const tokens = normalized.split(" ").filter(Boolean);
  const uniqueTokens = new Set(tokens);
  const hasMeaningfulSignal =
    hasConcreteEvidenceSignal(value) ||
    hasMotivationSignal(value) ||
    hasDomainContextSignal(value) ||
    hasNoGoSignal(value) ||
    hasProfileStrengthGapSignal(value) ||
    hasOwnershipScopeSignal(value) ||
    /projektledelse|marketing|saas|b2b|service|fejlfinding|koordinering|ansvar|drift|produktion|salg|support/iu.test(
      value,
    );

  if (tokens.length >= 8) {
    if (hasMeaningfulSignal) {
      return null;
    }
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

  if (tokens.length >= 3 && hasMeaningfulSignal) {
    return null;
  }

  if (tokens.length <= 2) {
    return "TOO_SHORT";
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

function inferTargetProfileKind(profileDraft: ProfileDraft): TargetProfileKind {
  const target = normalizeText(profileDraft.targetDirection ?? "");
  const currentRole = normalizeText(profileDraft.currentRole ?? "");
  const combined = `${currentRole} ${target}`.trim();

  if (["ved ikke", "usikker", "ikke helt hvad", "afklare", "uklar"].some((keyword) => target.includes(keyword))) {
    return "unclear";
  }

  if (
    ["mindre ansvar", "lavere pres", "bedre balance", "uden topansvar", "roligere", "mindre pres"].some((keyword) =>
      target.includes(keyword),
    )
  ) {
    return "less_responsibility";
  }

  if (
    ["product manager", "product owner", "produktejer", "produktleder"].some((keyword) => target.includes(keyword)) &&
    ["projekt", "project"].some((keyword) => currentRole.includes(keyword) || combined.includes(keyword))
  ) {
    return "product_transition";
  }

  if (
    ["specialist", "faglig", "ekspert"].some((keyword) => target.includes(keyword) || currentRole.includes(keyword)) &&
    ["ikke blive people manager", "ikke people manager", "ikke personaleansvar", "uden personaleansvar"].some((keyword) =>
      target.includes(keyword),
    )
  ) {
    return "specialist_track";
  }

  if (
    ["skifte", "vaek fra", "væk fra", "overgang", "ny retning", "health tech", "sundhedsadministration"].some((keyword) =>
      target.includes(keyword),
    )
  ) {
    return "direction_change";
  }

  if (["mere ledelsesansvar", "storre afdeling", "større afdeling", "naeste niveau", "næste niveau"].some((keyword) => target.includes(keyword))) {
    return "next_level";
  }

  if (["samme", "lignende", "blive i", "bedre virksomhed", "bedre leder", "bedre manager", "stabile"].some((keyword) => target.includes(keyword))) {
    return "same_track_better_conditions";
  }

  return "same_track";
}

function isStrictCompletionKind(kind: TargetProfileKind) {
  return kind === "unclear" || kind === "direction_change" || kind === "product_transition" || kind === "less_responsibility";
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

function incrementNoGoCount(count: number) {
  return Math.min(count + 1, 2);
}

function incrementProfileStrengthGapCount(count: number) {
  return Math.min(count + 1, 2);
}

function incrementProductOwnershipEvidenceCount(count: number) {
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
  const recentQuestions = Array.isArray(candidate.recentQuestions)
    ? candidate.recentQuestions
        .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object" && !Array.isArray(item))
        .map((item) => ({
          question: typeof item.question === "string" ? item.question.trim().slice(0, 300) : "",
          focusArea: normalizeFocusArea(item.focusArea),
        }))
        .filter((item): item is { question: string; focusArea: FocusArea } => item.question.length > 0 && Boolean(item.focusArea))
        .slice(-12)
    : [];

  return {
    answeredTurns:
      typeof candidate.answeredTurns === "number" && Number.isInteger(candidate.answeredTurns) && candidate.answeredTurns >= 0
        ? candidate.answeredTurns
        : 0,
    coveredFocusAreas,
    recentQuestions,
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
      noGoClarityCount:
        typeof evidenceCountsCandidate.noGoClarityCount === "number"
          ? Math.max(0, Math.min(2, Math.floor(evidenceCountsCandidate.noGoClarityCount)))
          : 0,
      profileStrengthGapCount:
        typeof evidenceCountsCandidate.profileStrengthGapCount === "number"
          ? Math.max(0, Math.min(2, Math.floor(evidenceCountsCandidate.profileStrengthGapCount)))
          : 0,
      productOwnershipEvidenceCount:
        typeof evidenceCountsCandidate.productOwnershipEvidenceCount === "number"
          ? Math.max(0, Math.min(2, Math.floor(evidenceCountsCandidate.productOwnershipEvidenceCount)))
          : 0,
    },
    progressMeta:
      candidate.progressMeta && typeof candidate.progressMeta === "object" && !Array.isArray(candidate.progressMeta)
        ? {
            evidenceScore:
              typeof (candidate.progressMeta as Record<string, unknown>).evidenceScore === "number"
                ? Math.max(0, Math.min(100, Math.floor((candidate.progressMeta as Record<string, unknown>).evidenceScore as number)))
                : 0,
            lastEvidenceDelta:
              (candidate.progressMeta as Record<string, unknown>).lastEvidenceDelta === "strong" ||
              (candidate.progressMeta as Record<string, unknown>).lastEvidenceDelta === "modest" ||
              (candidate.progressMeta as Record<string, unknown>).lastEvidenceDelta === "none"
                ? ((candidate.progressMeta as Record<string, unknown>).lastEvidenceDelta as EvidenceDeltaCategory)
                : "none",
          }
        : {
            evidenceScore: 0,
            lastEvidenceDelta: "none",
          },
  };
}

function appendRecentQuestion(interviewState: InterviewState, question: string, focusArea: FocusArea): InterviewState {
  const normalizedQuestion = normalizeText(question);
  const alreadyTracked = interviewState.recentQuestions.some((item) => normalizeText(item.question) === normalizedQuestion);

  if (alreadyTracked) {
    return interviewState;
  }

  return {
    ...interviewState,
    recentQuestions: [...interviewState.recentQuestions, { question: question.trim(), focusArea }].slice(-12),
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
  const priorCoverageCount = Object.values(interviewState.coverage).filter(Boolean).length;
  const priorEvidenceCountTotal =
    interviewState.evidenceCounts.concreteEvidenceCount +
    interviewState.evidenceCounts.ownershipScopeCount +
    interviewState.evidenceCounts.resultEvidenceCount +
    interviewState.evidenceCounts.noGoClarityCount +
    interviewState.evidenceCounts.profileStrengthGapCount +
    interviewState.evidenceCounts.productOwnershipEvidenceCount;
  const nextState: InterviewState = {
    answeredTurns: interviewState.answeredTurns,
    coveredFocusAreas: [...interviewState.coveredFocusAreas],
    recentQuestions: [...interviewState.recentQuestions],
    coverage: { ...interviewState.coverage },
    evidenceCounts: { ...interviewState.evidenceCounts },
    progressMeta: { ...interviewState.progressMeta },
  };

  if (lastAssistantQuestion && lastUserAnswer) {
    const priorFocusArea = inferFocusAreaFromQuestion(lastAssistantQuestion);

    if (priorFocusArea) {
      const normalizedQuestion = normalizeText(lastAssistantQuestion);
      const alreadyTracked = nextState.recentQuestions.some((item) => normalizeText(item.question) === normalizedQuestion);

      if (!alreadyTracked) {
        nextState.recentQuestions = [
          ...nextState.recentQuestions,
          { question: lastAssistantQuestion.trim(), focusArea: priorFocusArea },
        ].slice(-12);
      }
    }
  }

  if (lastAssistantQuestion && lastUserAnswer && hasSubstantiveAnswer(lastUserAnswer)) {
    const priorFocusArea = inferFocusAreaFromQuestion(lastAssistantQuestion);
    const priorQuestionFamily = inferQuestionFamily(lastAssistantQuestion, priorFocusArea ?? "current_work_reality");

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
      nextState.evidenceCounts.noGoClarityCount = incrementNoGoCount(nextState.evidenceCounts.noGoClarityCount);
    }

    if (hasProfileStrengthGapSignal(lastUserAnswer)) {
      nextState.coverage.profileStrengthGap = true;
      nextState.evidenceCounts.profileStrengthGapCount = incrementProfileStrengthGapCount(
        nextState.evidenceCounts.profileStrengthGapCount,
      );
    }

    if (
      priorQuestionFamily === "productOwnershipEvidence" ||
      hasProductOwnershipEvidenceSignal(lastUserAnswer) ||
      hasProductOwnershipGapSignal(lastUserAnswer)
    ) {
      nextState.evidenceCounts.productOwnershipEvidenceCount = incrementProductOwnershipEvidenceCount(
        nextState.evidenceCounts.productOwnershipEvidenceCount,
      );
    }
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
      nextState.evidenceCounts.noGoClarityCount = Math.max(nextState.evidenceCounts.noGoClarityCount, 1);
    }

    if (
      hasProfileStrengthGapSignal(profileSummary.aiProfileCore.directionOfChange) ||
      profileSummary.aiProfileCore.mismatchRisks.some((item) => hasProfileStrengthGapSignal(item))
    ) {
      nextState.coverage.profileStrengthGap = true;
      nextState.evidenceCounts.profileStrengthGapCount = Math.max(nextState.evidenceCounts.profileStrengthGapCount, 1);
    }

    if (
      hasProductOwnershipEvidenceSignal(profileSummary.aiProfileCore.currentWorkReality) ||
      hasProductOwnershipEvidenceSignal(profileSummary.aiProfileCore.levelSeniority) ||
      hasProductOwnershipGapSignal(profileSummary.aiProfileCore.currentWorkReality)
    ) {
      nextState.evidenceCounts.productOwnershipEvidenceCount = Math.max(
        nextState.evidenceCounts.productOwnershipEvidenceCount,
        1,
      );
    }
  }

  const nextCoverageCount = Object.values(nextState.coverage).filter(Boolean).length;
  const nextEvidenceCountTotal =
    nextState.evidenceCounts.concreteEvidenceCount +
    nextState.evidenceCounts.ownershipScopeCount +
    nextState.evidenceCounts.resultEvidenceCount +
    nextState.evidenceCounts.noGoClarityCount +
    nextState.evidenceCounts.profileStrengthGapCount +
    nextState.evidenceCounts.productOwnershipEvidenceCount;
  const coverageDelta = nextCoverageCount - priorCoverageCount;
  const evidenceDelta = nextEvidenceCountTotal - priorEvidenceCountTotal;

  let lastEvidenceDelta: EvidenceDeltaCategory = "none";

  if (coverageDelta >= 2 || evidenceDelta >= 2) {
    lastEvidenceDelta = "strong";
  } else if (coverageDelta >= 1 || evidenceDelta >= 1) {
    lastEvidenceDelta = "modest";
  }

  nextState.progressMeta.lastEvidenceDelta = lastEvidenceDelta;
  nextState.progressMeta.evidenceScore = Math.min(
    100,
    interviewState.progressMeta.evidenceScore + (lastEvidenceDelta === "strong" ? 8 : lastEvidenceDelta === "modest" ? 4 : 0),
  );

  if (process.env.NODE_ENV !== "production" && (lastAssistantQuestion || profileSummary)) {
    console.debug(`[interview] evidence delta: ${lastEvidenceDelta}`);
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

function estimateVisibleInterviewProgress(interviewState: InterviewState) {
  const coverageCount = Object.values(interviewState.coverage).filter(Boolean).length;
  const focusBreadth = new Set(interviewState.coveredFocusAreas).size;

  return Math.min(
    99,
    Math.round(
      interviewState.answeredTurns * 5 +
        coverageCount * 4 +
        focusBreadth * 3 +
        interviewState.progressMeta.evidenceScore / 2,
    ),
  );
}

function hasMinimumProvisionalProfileBasis({
  profileDraft,
  interviewState,
  profileModel,
}: {
  profileDraft: ProfileDraft;
  interviewState: InterviewState;
  profileModel: InterviewProfileModel;
}) {
  const hasRoleContext = Boolean(profileDraft.currentRole?.trim()) || interviewState.coverage.currentWorkReality;
  const hasDirectionSignal = Boolean(profileDraft.targetDirection?.trim()) || interviewState.coverage.directionOfChange;
  const hasLevelSignal =
    Boolean(profileDraft.yearsExperience?.trim()) ||
    interviewState.coverage.levelSeniority ||
    interviewState.coverage.ownershipScope ||
    profileModel.uncertainties.some((uncertainty) => uncertainty.focusArea === "level_seniority");
  const hasEvidenceOrExplicitUncertainty =
    interviewState.coverage.evidenceDepth ||
    interviewState.coverage.concreteEvidence ||
    interviewState.coverage.ownershipScope ||
    interviewState.coverage.resultEvidence ||
    profileModel.uncertainties.length > 0;
  const hasFitOrNoGoSignal =
    interviewState.coverage.workStyleFit ||
    interviewState.coverage.mismatchRisk ||
    interviewState.coverage.noGoClarity ||
    interviewState.coverage.motivationFit ||
    Boolean(profileDraft.targetDirection?.trim()) ||
    interviewState.answeredTurns >= 4;

  return (
    interviewState.answeredTurns >= 1 &&
    hasRoleContext &&
    hasDirectionSignal &&
    hasLevelSignal &&
    hasEvidenceOrExplicitUncertainty &&
    hasFitOrNoGoSignal
  );
}

function countCoveredCompletionSignals(interviewState: InterviewState) {
  return [
    interviewState.coverage.currentWorkReality,
    interviewState.coverage.levelSeniority,
    interviewState.coverage.transferableStrengths,
    interviewState.coverage.directionOfChange,
    interviewState.coverage.workStyleFit,
    interviewState.coverage.mismatchRisk,
    interviewState.coverage.evidenceDepth,
    interviewState.coverage.concreteEvidence,
    interviewState.coverage.ownershipScope,
    interviewState.coverage.resultEvidence,
    interviewState.coverage.motivationFit,
    interviewState.coverage.domainContext,
    interviewState.coverage.noGoClarity,
    interviewState.coverage.profileStrengthGap,
  ].filter(Boolean).length;
}

function hasRecentFocusArea(interviewState: InterviewState, focusArea: FocusArea) {
  return interviewState.recentQuestions.some((item) => item.focusArea === focusArea);
}

function countRecentQuestionFamily(interviewState: InterviewState, family: QuestionFamily | null) {
  if (!family) {
    return 0;
  }

  return interviewState.recentQuestions.filter((item) => inferQuestionFamily(item.question, item.focusArea) === family).length;
}

function countRecentEvidenceTrack(interviewState: InterviewState, track: EvidenceTrack | null) {
  if (!track) {
    return 0;
  }

  return interviewState.recentQuestions.filter((item) => inferEvidenceTrackFromQuestion(item.question) === track).length;
}

function inferSaturationFamilies(question: string, focusArea: FocusArea): SaturationFamily[] {
  const normalized = normalizeText(question);
  const families = new Set<SaturationFamily>();
  const evidenceTrack = inferEvidenceTrackFromQuestion(question);

  if (
    focusArea === "current_work_reality" ||
    ["nuvaerende", "hverdag", "arbejde", "opgaver", "rolle", "drift", "branche", "kunder", "virksomhed"].some((keyword) =>
      normalized.includes(keyword),
    )
  ) {
    families.add("current_work_reality");
  }

  if (focusArea === "mismatch_risk" || ["undga", "darligt match", "passer ikke", "trives", "no go", "fravalg"].some((keyword) => normalized.includes(keyword))) {
    families.add("mismatch_risk");
  }

  if (
    evidenceTrack === "resultEvidence" ||
    ["resultat", "effekt", "kom ud af", "forbedr", "bevis", "eksempel", "konkret", "case"].some((keyword) =>
      normalized.includes(keyword),
    )
  ) {
    families.add("resultEvidence");
  }

  if (
    evidenceTrack === "ownershipScope" ||
    ["ansvar", "eget ansvar", "selv ansvaret", "beslut", "stod for", "ejede", "ejer"].some((keyword) =>
      normalized.includes(keyword),
    )
  ) {
    families.add("ownership");
  }

  if (
    ["personaleansvar", "ledelse", "leder", "teamleder", "mere ansvar", "mindre ansvar", "ledelsesansvar"].some(
      (keyword) => normalized.includes(keyword),
    )
  ) {
    families.add("responsibility");
  }

  return [...families];
}

function countRecentSaturationFamily(interviewState: InterviewState, family: SaturationFamily) {
  return interviewState.recentQuestions.filter((item) => inferSaturationFamilies(item.question, item.focusArea).includes(family))
    .length;
}

function isQuestionOverused({
  question,
  focusArea,
  interviewState,
  lastAssistantQuestion,
}: {
  question: string;
  focusArea: FocusArea;
  interviewState: InterviewState;
  lastAssistantQuestion: string | null;
}) {
  const questionFamily = inferQuestionFamily(question, focusArea);
  const evidenceTrack = inferEvidenceTrackFromQuestion(question);
  const isRepeatedQuestion =
    Boolean(lastAssistantQuestion && areQuestionsTooSimilar(lastAssistantQuestion, question)) ||
    interviewState.recentQuestions.some((item) => areQuestionsTooSimilar(item.question, question));
  const recentFocusAreaCount = interviewState.recentQuestions.filter((item) => item.focusArea === focusArea).length;
  const recentQuestionFamilyCount = countRecentQuestionFamily(interviewState, questionFamily);
  const recentEvidenceTrackCount = countRecentEvidenceTrack(interviewState, evidenceTrack);
  const saturatedSemanticFamily = inferSaturationFamilies(question, focusArea).some(
    (family) => countRecentSaturationFamily(interviewState, family) >= 2,
  );
  const isRepeatedLevelQuestion =
    focusArea === "level_seniority" &&
    (recentFocusAreaCount >= 2 ||
      interviewState.coverage.levelSeniority ||
      interviewState.coverage.ownershipScope ||
      interviewState.evidenceCounts.ownershipScopeCount >= 1 ||
      interviewState.evidenceCounts.productOwnershipEvidenceCount >= 1);

  return (
    isRepeatedQuestion ||
    recentFocusAreaCount >= 4 ||
    recentQuestionFamilyCount >= 2 ||
    recentEvidenceTrackCount >= 2 ||
    saturatedSemanticFamily ||
    isRepeatedLevelQuestion ||
    Boolean(questionFamily && isQuestionFamilySaturated(interviewState, questionFamily)) ||
    Boolean(evidenceTrack && isEvidenceTrackSaturated(interviewState, evidenceTrack))
  );
}

function hasSufficientCompletionSubstance({
  profileDraft,
  interviewState,
  profileModel,
}: {
  profileDraft: ProfileDraft;
  interviewState: InterviewState;
  profileModel: InterviewProfileModel;
}) {
  const kind = inferTargetProfileKind(profileDraft);
  const strictKind = isStrictCompletionKind(kind);
  const hasDraftRole = Boolean(profileDraft.currentRole?.trim());
  const hasDraftTarget = Boolean(profileDraft.targetDirection?.trim());
  const hasCurrentWorkSignal =
    interviewState.coverage.currentWorkReality ||
    interviewState.coverage.domainContext ||
    hasRecentFocusArea(interviewState, "current_work_reality") ||
    (!strictKind && hasDraftRole);
  const hasDirectionSignal =
    interviewState.coverage.directionOfChange ||
    interviewState.coverage.profileStrengthGap ||
    hasRecentFocusArea(interviewState, "direction_change") ||
    (!strictKind && hasDraftTarget);
  const hasLevelSignal =
    interviewState.coverage.levelSeniority ||
    interviewState.coverage.ownershipScope ||
    interviewState.evidenceCounts.ownershipScopeCount >= 1 ||
    interviewState.evidenceCounts.productOwnershipEvidenceCount >= 1 ||
    (!strictKind && Boolean(profileDraft.yearsExperience?.trim()));
  const hasTransferableOrTransitionSignal =
    interviewState.coverage.transferableStrengths ||
    interviewState.coverage.evidenceDepth ||
    interviewState.coverage.concreteEvidence ||
    interviewState.coverage.resultEvidence ||
    profileModel.interpretations.length >= (strictKind ? 2 : 1) ||
    (!strictKind && Boolean(profileDraft.yearsExperience?.trim()));
  const hasFitOrBoundarySignal =
    interviewState.coverage.workStyleFit ||
    interviewState.coverage.mismatchRisk ||
    interviewState.coverage.noGoClarity ||
    interviewState.coverage.motivationFit ||
    interviewState.coverage.profileStrengthGap;
  const hasExplicitGapOrUncertainty = profileModel.uncertainties.some((uncertainty) => uncertainty.unresolved);
  const coveredSignals = countCoveredCompletionSignals(interviewState);
  const focusBreadth = new Set(interviewState.coveredFocusAreas).size;

  if (!hasCurrentWorkSignal || !hasDirectionSignal || !hasLevelSignal || !hasTransferableOrTransitionSignal) {
    return false;
  }

  if (!strictKind) {
    return coveredSignals >= 4 || (coveredSignals >= 3 && focusBreadth >= 2);
  }

  if (!hasExplicitGapOrUncertainty || !hasFitOrBoundarySignal) {
    return false;
  }

  if (kind === "unclear") {
    return (
      (interviewState.coverage.workStyleFit || interviewState.coverage.mismatchRisk || interviewState.coverage.noGoClarity) &&
      coveredSignals >= 5 &&
      focusBreadth >= 2
    );
  }

  if (kind === "product_transition") {
    return (
      interviewState.evidenceCounts.productOwnershipEvidenceCount >= 1 &&
      (interviewState.coverage.ownershipScope || interviewState.coverage.levelSeniority) &&
      coveredSignals >= 4 &&
      focusBreadth >= 2
    );
  }

  if (kind === "less_responsibility") {
    return (
      interviewState.coverage.workStyleFit &&
      interviewState.coverage.noGoClarity &&
      (interviewState.coverage.mismatchRisk || interviewState.coverage.profileStrengthGap) &&
      (interviewState.coverage.ownershipScope || interviewState.coverage.levelSeniority) &&
      coveredSignals >= 6 &&
      focusBreadth >= 3
    );
  }

  return coveredSignals >= 4 && focusBreadth >= 2;
}

function shouldCompleteInsteadOfContinuing({
  question,
  focusArea,
  interviewState,
  profileDraft,
  profileModel,
  lastAssistantQuestion,
}: {
  question: string;
  focusArea: FocusArea;
  interviewState: InterviewState;
  profileDraft: ProfileDraft;
  profileModel: InterviewProfileModel;
  lastAssistantQuestion: string | null;
}) {
  if (!hasMinimumProvisionalProfileBasis({ profileDraft, interviewState, profileModel })) {
    return false;
  }

  if (!hasSufficientCompletionSubstance({ profileDraft, interviewState, profileModel })) {
    return false;
  }

  const visibleProgress = estimateVisibleInterviewProgress(interviewState);
  const questionFamily = inferQuestionFamily(question, focusArea);
  const evidenceTrack = inferEvidenceTrackFromQuestion(question);
  const isRepeatedQuestion =
    Boolean(lastAssistantQuestion && areQuestionsTooSimilar(lastAssistantQuestion, question)) ||
    interviewState.recentQuestions.some((item) => areQuestionsTooSimilar(item.question, question));
  const isSaturatedFamily = Boolean(questionFamily && isQuestionFamilySaturated(interviewState, questionFamily));
  const isSaturatedEvidenceTrack = Boolean(evidenceTrack && isEvidenceTrackSaturated(interviewState, evidenceTrack));
  const recentFocusAreaCount = interviewState.recentQuestions.filter((item) => item.focusArea === focusArea).length;
  const recentQuestionFamilyCount = countRecentQuestionFamily(interviewState, questionFamily);
  const recentEvidenceTrackCount = countRecentEvidenceTrack(interviewState, evidenceTrack);
  const saturatedSemanticFamily = inferSaturationFamilies(question, focusArea).some(
    (family) => countRecentSaturationFamily(interviewState, family) >= 2,
  );
  const isRepeatedLevelQuestion =
    focusArea === "level_seniority" &&
    (recentFocusAreaCount >= 2 ||
      interviewState.coverage.levelSeniority ||
      interviewState.coverage.ownershipScope ||
      interviewState.evidenceCounts.ownershipScopeCount >= 1 ||
      interviewState.evidenceCounts.productOwnershipEvidenceCount >= 1);
  const isRepeatedFocusArea = recentFocusAreaCount >= 4;
  const isRepeatedSemanticFamily = recentQuestionFamilyCount >= 2 || recentEvidenceTrackCount >= 2;
  const highProgress = visibleProgress >= 90;
  const nearCompleteProgress = visibleProgress >= 97;

  return (
    nearCompleteProgress ||
    (highProgress &&
      (isRepeatedQuestion ||
        isSaturatedFamily ||
        isSaturatedEvidenceTrack ||
        isRepeatedLevelQuestion ||
        isRepeatedFocusArea ||
        isRepeatedSemanticFamily ||
        saturatedSemanticFamily)) ||
    isRepeatedQuestion ||
    isSaturatedFamily ||
    isSaturatedEvidenceTrack ||
    isRepeatedLevelQuestion ||
    isRepeatedSemanticFamily ||
    saturatedSemanticFamily
  );
}

function buildProvisionalProfileSummary({
  profileDraft,
  interviewState,
  profileModel,
}: {
  profileDraft: ProfileDraft;
  interviewState: InterviewState;
  profileModel: InterviewProfileModel;
}): ProfileSummary {
  const uncertaintyStatements = profileModel.uncertainties
    .filter((uncertainty) => uncertainty.unresolved)
    .slice(0, 3)
    .map((uncertainty) => uncertainty.statement);
  const strengthStatements = profileModel.interpretations.slice(0, 3).map((interpretation) => interpretation.statement);
  const currentRole = profileDraft.currentRole?.trim() || null;
  const targetDirection = profileDraft.targetDirection?.trim() || null;
  const yearsExperience = profileDraft.yearsExperience?.trim() || null;

  return {
    userProfileData: {
      name: profileDraft.name?.trim() || null,
      currentRole,
      yearsExperience,
      targetDirection,
    },
    aiProfileCore: {
      currentWorkReality:
        currentRole && yearsExperience
          ? `Brugeren kommer fra ${currentRole} med erfaring beskrevet som: ${yearsExperience}`
          : currentRole
            ? `Brugeren kommer fra ${currentRole}, men den fulde arbejdskontekst er stadig delvist usikker.`
            : "Brugerens nuvaerende arbejdskontekst er kun delvist afklaret.",
      levelSeniority:
        interviewState.coverage.ownershipScope || interviewState.coverage.levelSeniority
          ? "Ansvarsniveauet er tilstraekkeligt belyst til en foreloebig profil, men kan styrkes senere med flere eksempler."
          : "Ansvarsniveauet er ikke fuldt bevist endnu og boer behandles som en usikkerhed i naeste fase.",
      transferableStrengths:
        strengthStatements.length > 0
          ? strengthStatements
          : [
              "Erfaring og retning giver et brugbart foerste billede af overfoerbare styrker.",
              "Konkrete eksempler kan styrke profilen yderligere senere.",
              "JobPilot boer bruge profilen som foreloebig og evidence-aware.",
            ],
      directionOfChange:
        targetDirection ??
        "Brugerens oenskede retning er endnu uklar og boer afklares videre uden at presse en standardretning ned over profilen.",
      workStyleFit:
        interviewState.coverage.workStyleFit || interviewState.coverage.noGoClarity || interviewState.coverage.mismatchRisk
          ? "Der er nok signaler om rammer, motivation eller no-go forhold til at lave en foreloebig matchvurdering."
          : "Arbejdsstil og no-go forhold er kun delvist afklaret og boer sta som usikkerheder.",
      mismatchRisks:
        uncertaintyStatements.length > 0
          ? uncertaintyStatements
          : ["Der mangler stadig dybere beviser paa enkelte omraader, men ikke nok til at fortsaette et repeterende interview."],
      confidence: estimateVisibleInterviewProgress(interviewState) >= 90 ? "medium" : "low",
    },
  };
}

function buildDeterministicCompleteResult({
  profileDraft,
  interviewState,
  profileModel,
}: {
  profileDraft: ProfileDraft;
  interviewState: InterviewState;
  profileModel: InterviewProfileModel;
}): Extract<GenerateSuccess, { status: "complete" }> {
  const profileSummary = buildProvisionalProfileSummary({ profileDraft, interviewState, profileModel });
  const completedInterviewState = updateInterviewState({
    interviewState,
    lastAssistantQuestion: null,
    lastUserAnswer: null,
    profileSummary,
  });
  const completedProfileModel = buildInterviewProfileModel({
    profileDraft,
    interviewState: completedInterviewState,
    profileSummary,
    lastUserAnswer: null,
  });

  return {
    ok: true,
    status: "complete",
    profileSummary,
    interviewState: completedInterviewState,
    readinessAssessment: buildReadinessAssessment({
      profileDraft,
      profileSummary,
      interviewState: completedInterviewState,
      profileModel: completedProfileModel,
    }),
    profileModel: completedProfileModel,
    hypothesisSummary: completedProfileModel.hypotheses.slice(0, 4).map((hypothesis) => ({
      key: hypothesis.key,
      statement: hypothesis.statement,
      confidence: hypothesis.confidence,
      supportLevel: hypothesis.supportLevel,
      contradictionLevel: hypothesis.contradictionLevel,
      unresolved: hypothesis.unresolved,
    })),
    uncertaintySummary: completedProfileModel.uncertainties
      .filter((uncertainty) => uncertainty.unresolved)
      .slice(0, 4)
      .map((uncertainty) => ({
        key: uncertainty.key,
        statement: uncertainty.statement,
        impact: uncertainty.impact,
        focusArea: uncertainty.focusArea,
      })),
    communicationSignals: completedProfileModel.communicationSignals,
  };
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
type QuestionFamily =
  | "noGoClarity"
  | "profileStrengthGap"
  | "productOwnershipEvidence"
  | "directionChangeRealism"
  | "domainContext"
  | EvidenceTrack;

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

function inferQuestionFamily(question: string, focusArea: FocusArea): QuestionFamily | null {
  const normalized = normalizeText(question);

  if (
    focusArea === "mismatch_risk" &&
    [
      "undga",
      "fravalg",
      "darligt match",
      "trives",
      "helst undga",
      "passer ikke",
      "daarligt fit",
      "lav indflydelse",
      "uklare prioriteter",
      "for meget admin",
      "kaotisk",
    ].some((keyword) =>
      normalized.includes(keyword),
    )
  ) {
    return "noGoClarity";
  }

  if (
    focusArea === "mismatch_risk" &&
    ["svagere", "mangler", "ikke endnu", "bevaege dig mod", "naeste skridt", "ikke bevist"].some((keyword) =>
      normalized.includes(keyword),
    )
  ) {
    return "profileStrengthGap";
  }

  if (
    ["backlog", "roadmap", "prioritering", "prioritere", "product owner", "produktbeslut", "formelt ansvar"].some(
      (keyword) => normalized.includes(keyword),
    )
  ) {
    return "productOwnershipEvidence";
  }

  if (
    focusArea === "direction_change" &&
    ["naeste skridt", "laengere mal", "realistisk", "overgang", "langsigtet"].some((keyword) =>
      normalized.includes(keyword),
    )
  ) {
    return "directionChangeRealism";
  }

  if (
    focusArea === "current_work_reality" &&
    ["branche", "virksomhed", "kunder", "domaene", "saas", "b2b", "miljo"].some((keyword) =>
      normalized.includes(keyword),
    )
  ) {
    return "domainContext";
  }

  return inferEvidenceTrackFromQuestion(question);
}

function isQuestionFamilySaturated(interviewState: InterviewState, family: QuestionFamily) {
  switch (family) {
    case "noGoClarity":
      return interviewState.coverage.noGoClarity && interviewState.evidenceCounts.noGoClarityCount >= 1;
    case "domainContext":
      return interviewState.coverage.domainContext && interviewState.coverage.currentWorkReality;
    case "profileStrengthGap":
      return interviewState.coverage.profileStrengthGap && interviewState.evidenceCounts.profileStrengthGapCount >= 1;
    case "productOwnershipEvidence":
      return interviewState.evidenceCounts.productOwnershipEvidenceCount >= 1;
    case "directionChangeRealism":
      return interviewState.coverage.directionOfChange && interviewState.evidenceCounts.profileStrengthGapCount >= 1;
    case "concreteEvidence":
      return isEvidenceTrackSaturated(interviewState, "concreteEvidence");
    case "ownershipScope":
      return isEvidenceTrackSaturated(interviewState, "ownershipScope");
    case "resultEvidence":
      return isEvidenceTrackSaturated(interviewState, "resultEvidence");
    default:
      return false;
  }
}

function buildNonNoGoRecoveryQuestion(
  interviewState: InterviewState,
): { question: string; focusArea: FocusArea; missingDimension: MissingCoverageDimension } | null {
  return (
    buildRecoveryQuestionForMissingCoverage(interviewState, [
      "profileStrengthGap",
      "resultEvidence",
      "concreteEvidence",
      "ownershipScope",
      "domainContext",
      "levelSeniority",
      "directionOfChange",
      "workStyleFit",
      "mismatchRisk",
    ]) ??
    buildRecoveryQuestionForFocusAreaBreadth(interviewState)
  );
}

function buildNonTargetGapRecoveryQuestion(
  interviewState: InterviewState,
): { question: string; focusArea: FocusArea; missingDimension: MissingCoverageDimension } | null {
  return (
    buildRecoveryQuestionForMissingCoverage(interviewState, [
      "concreteEvidence",
      "resultEvidence",
      "ownershipScope",
      "directionOfChange",
      "transferableStrengths",
      "domainContext",
      "levelSeniority",
      "workStyleFit",
    ]) ??
    buildRecoveryQuestionForFocusAreaBreadth(interviewState)
  );
}

function buildNonOwnershipRecoveryQuestion(
  interviewState: InterviewState,
): { question: string; focusArea: FocusArea; missingDimension: MissingCoverageDimension } | null {
  return (
    buildRecoveryQuestionForMissingCoverage(interviewState, [
      "resultEvidence",
      "concreteEvidence",
      "domainContext",
      "transferableStrengths",
      "directionOfChange",
      "levelSeniority",
      "workStyleFit",
    ]) ??
    buildRecoveryQuestionForFocusAreaBreadth(interviewState)
  );
}

function buildRecoveryQuestionForFocusAreaBreadth(
  interviewState: InterviewState,
): { question: string; focusArea: FocusArea; missingDimension: MissingCoverageDimension } | null {
  const coveredFocusAreas = new Set(interviewState.coveredFocusAreas);
  const focusAreaPriority: FocusArea[] = [
    "mismatch_risk",
    "work_style_fit",
    "level_seniority",
    "current_work_reality",
    "transferable_strengths",
    "direction_change",
  ];

  for (const focusArea of focusAreaPriority) {
    if (coveredFocusAreas.has(focusArea)) {
      continue;
    }

    switch (focusArea) {
      case "mismatch_risk":
        return {
          question: "Hvad vil du helst undgå i dit næste job, hvis du skal trives og lykkes?",
          focusArea,
          missingDimension: "mismatchRisk",
        };
      case "work_style_fit":
        return {
          question: "Hvilke rammer eller måder at arbejde på passer bedst til dig i hverdagen?",
          focusArea,
          missingDimension: "workStyleFit",
        };
      case "level_seniority":
        return {
          question: "Hvilket ansvar eller hvilken beslutningsrolle har du typisk haft i de vigtigste opgaver?",
          focusArea,
          missingDimension: "levelSeniority",
        };
      case "current_work_reality":
        return {
          question: "Hvad fylder mest i din hverdag i dag, og hvor ligger dit eget ansvar typisk?",
          focusArea,
          missingDimension: "currentWorkReality",
        };
      case "transferable_strengths":
        return {
          question: "Hvilke styrker bruger du mest i praksis, når du skal lykkes i arbejdet?",
          focusArea,
          missingDimension: "transferableStrengths",
        };
      case "direction_change":
        return {
          question: "Hvad er den vigtigste grund til, at du vil i den retning, du søger nu?",
          focusArea,
          missingDimension: "directionOfChange",
        };
      default:
        break;
    }
  }

  return null;
}

function buildLateStageRecoveryQuestion(
  interviewState: InterviewState,
): { question: string; focusArea: FocusArea; missingDimension: MissingCoverageDimension } | null {
  return (
    buildRecoveryQuestionForMissingCoverage(interviewState, [
      "noGoClarity",
      "profileStrengthGap",
      "resultEvidence",
      "ownershipScope",
      "concreteEvidence",
      "domainContext",
      "mismatchRisk",
      "workStyleFit",
      "levelSeniority",
    ]) ??
    (interviewState.coveredFocusAreas.length < 5
      ? buildRecoveryQuestionForFocusAreaBreadth(interviewState)
      : null) ??
    (interviewState.answeredTurns < 7
      ? buildRecoveryQuestionForMissingCoverage(interviewState, [
          "noGoClarity",
          "profileStrengthGap",
          "resultEvidence",
          "ownershipScope",
          "concreteEvidence",
          "domainContext",
          "mismatchRisk",
          "workStyleFit",
          "levelSeniority",
        ]) ??
        buildRecoveryQuestionForFocusAreaBreadth(interviewState)
      : null)
  );
}

function buildGuidedRecoveryQuestionForVagueAnswer(focusArea: FocusArea | null) {
  switch (focusArea) {
    case "current_work_reality":
      return {
        question: "Kan du tage én konkret opgave eller situation fra din hverdag og beskrive, hvad du selv havde ansvar for?",
        focusArea,
      };
    case "level_seniority":
      return {
        question: "Hvad havde du selv ansvaret for, og hvad lå hos andre?",
        focusArea,
      };
    case "transferable_strengths":
      return {
        question: "Kan du nævne ét konkret eksempel, hvor den styrke kom tydeligt i spil?",
        focusArea,
      };
    case "direction_change":
      return {
        question: "Hvad er den vigtigste grund til, at du vil i den retning, og hvad vil du gerne have mindre af?",
        focusArea,
      };
    case "work_style_fit":
      return {
        question: "Hvad i din nuværende hverdag giver dig mest energi, og hvad fungerer dårligst?",
        focusArea,
      };
    case "mismatch_risk":
      return {
        question: "Hvad vil du helst undgå i dit næste job, hvis du skal trives og lykkes?",
        focusArea,
      };
    default:
      return {
        question: "Kan du tage ét konkret eksempel fra din hverdag, som viser det?",
        focusArea: "current_work_reality" as FocusArea,
      };
  }
}

function isProfileSummarySufficientForPhase1({
  profileSummary,
  lastAssistantQuestion,
  lastUserAnswer,
  interviewState,
  profileModel,
}: {
  profileSummary: ProfileSummary;
  lastAssistantQuestion: string | null;
  lastUserAnswer: string | null;
  interviewState: InterviewState;
  profileModel?: InterviewProfileModel;
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

  if (profileModel && countHighImpactUnresolvedUncertainties(profileModel) >= 3 && interviewState.answeredTurns < 9) {
    return false;
  }

  return true;
}

function hasHigherBarTargetDirection(targetDirection: string | null | undefined) {
  const normalized = normalizeText(targetDirection ?? "");
  const lowerPressureKeywords = [
    "mindre ansvar",
    "lavere pres",
    "bedre balance",
    "uden topansvar",
    "ikke laengere opad",
  ];

  if (lowerPressureKeywords.some((keyword) => normalized.includes(keyword))) {
    return false;
  }

  const higherBarKeywords = [
    "product manager",
    "produktleder",
    "product owner",
    "leder",
    "lederrolle",
    "head of",
    "director",
    "senior",
    "strategi",
    "strategisk",
  ];

  return higherBarKeywords.some((keyword) => normalized.includes(keyword));
}

function hasFormalProductOwnershipSignal(value: string | null | undefined) {
  const normalized = normalizeText(value ?? "");
  const keywords = [
    "product owner",
    "produktleder",
    "roadmap",
    "backlog",
    "prioritering",
    "prioritere",
    "discovery",
    "brugerindsigt",
    "kundebehov",
    "produktretning",
  ];

  return keywords.filter((keyword) => normalized.includes(keyword)).length >= 2;
}

function hasStrategicOwnershipSignal(value: string | null | undefined) {
  const normalized = normalizeText(value ?? "");
  const keywords = [
    "strategi",
    "strategisk",
    "retning",
    "forretning",
    "roadmap",
    "prioritering",
    "beslutning",
    "maal",
    "mal",
  ];

  return keywords.filter((keyword) => normalized.includes(keyword)).length >= 2;
}

function hasLeadershipScopeSignal(value: string | null | undefined) {
  const normalized = normalizeText(value ?? "");
  const keywords = [
    "leder",
    "ledelse",
    "personaleansvar",
    "team",
    "coache",
    "ansvaret for andre",
    "fordele opgaver",
    "beslutninger",
  ];

  return keywords.filter((keyword) => normalized.includes(keyword)).length >= 2;
}

function hasProductOwnershipEvidenceSignal(value: string | null | undefined) {
  const normalized = normalizeText(value ?? "");
  const keywords = [
    "backlog",
    "roadmap",
    "prioritering",
    "prioritere",
    "produktbeslut",
    "product owner",
    "produktleder",
    "produktafklaring",
    "produktretning",
  ];

  return keywords.filter((keyword) => normalized.includes(keyword)).length >= 2;
}

function hasProductOwnershipGapSignal(value: string | null | undefined) {
  const normalized = normalizeText(value ?? "");
  const keywords = [
    "ikke formelt",
    "ikke backlog",
    "ikke roadmap",
    "ikke direkte",
    "stottede prioritering",
    "beslutningsstotte",
    "understottede",
    "ikke product owner",
    "ikke produktleder",
  ];

  return keywords.some((keyword) => normalized.includes(keyword));
}

function hasSelfMinimizingLanguage(value: string | null | undefined) {
  const normalized = normalizeText(value ?? "");
  const phrases = ["bare", "lidt", "nok", "hjalp til", "stottede", "forsogte", "ikke sa meget", "mest lidt"];
  return phrases.some((phrase) => normalized.includes(phrase));
}

function inferCommunicationSignals(value: string | null | undefined): CommunicationSignals {
  const normalized = normalizeText(value ?? "");
  const words = normalized.split(" ").filter(Boolean);
  const sentenceLikeClauses = (value ?? "").split(/[.!?;,]/).map((item) => item.trim()).filter(Boolean).length;
  const evidenceHits = [
    hasConcreteEvidenceSignal(value ?? ""),
    hasOwnershipScopeSignal(value ?? ""),
    hasResultEvidenceSignal(value ?? ""),
    hasDomainContextSignal(value ?? ""),
  ].filter(Boolean).length;

  const answerStyle: CommunicationSignals["answerStyle"] =
    words.length >= 80 ? "detailed" : words.length >= 20 ? "balanced" : "concise";
  const structureLevel: CommunicationSignals["structureLevel"] =
    sentenceLikeClauses >= 4 ? "high" : sentenceLikeClauses >= 2 ? "medium" : "low";
  const evidenceDensity: CommunicationSignals["evidenceDensity"] =
    evidenceHits >= 3 ? "high" : evidenceHits >= 1 ? "medium" : "low";

  return {
    answerStyle,
    structureLevel,
    evidenceDensity,
    possibleSelfMinimizingLanguage: hasSelfMinimizingLanguage(value),
    possibleOverlongExplanations: words.length >= 140,
  };
}

function buildEvidenceSources({
  profileDraft,
  interviewState,
  profileSummary,
}: {
  profileDraft: ProfileDraft;
  interviewState: InterviewState;
  profileSummary?: ProfileSummary;
}): EvidenceSourceState[] {
  const draftStrength =
    Object.values(profileDraft).filter((value) => typeof value === "string" && value.trim().length > 0).length >= 3
      ? "strong"
      : "light";
  const answerStrength = interviewState.answeredTurns >= 4 ? "strong" : interviewState.answeredTurns > 0 ? "light" : "none";
  const summaryStrength = profileSummary ? "strong" : "none";

  return [
    { key: "profile_draft", label: "Profiludkast", available: true, readiness: "current", strength: draftStrength },
    {
      key: "interview_answers",
      label: "Interviewsvar",
      available: interviewState.answeredTurns > 0,
      readiness: "current",
      strength: answerStrength,
    },
    {
      key: "structured_summary",
      label: "Struktureret profilsammendrag",
      available: Boolean(profileSummary),
      readiness: "current",
      strength: summaryStrength,
    },
    { key: "cv", label: "CV", available: false, readiness: "future_placeholder", strength: "none" },
    { key: "linkedin", label: "LinkedIn", available: false, readiness: "future_placeholder", strength: "none" },
    { key: "job_history", label: "Jobhistorik", available: false, readiness: "future_placeholder", strength: "none" },
    { key: "applications", label: "Ansogninger", available: false, readiness: "future_placeholder", strength: "none" },
    { key: "certificates", label: "Certifikater", available: false, readiness: "future_placeholder", strength: "none" },
    { key: "notes", label: "Noter og refleksioner", available: false, readiness: "future_placeholder", strength: "none" },
    { key: "feedback", label: "Feedback og afslag", available: false, readiness: "future_placeholder", strength: "none" },
  ];
}

function addQuestionPriority(
  priorities: QuestionPriority[],
  candidate: Omit<QuestionPriority, "score"> & { score: number },
) {
  if (priorities.some((item) => item.key === candidate.key)) {
    return;
  }

  priorities.push(candidate);
}

function mapQuestionPriorityToRecoveryQuestion(priority: QuestionPriority) {
  return {
    question: priority.question,
    focusArea: priority.focusArea,
  };
}

function buildInterviewProfileModel({
  profileDraft,
  interviewState,
  profileSummary,
  lastUserAnswer,
}: {
  profileDraft: ProfileDraft;
  interviewState: InterviewState;
  profileSummary?: ProfileSummary;
  lastUserAnswer: string | null;
}): InterviewProfileModel {
  const coverage = interviewState.coverage;
  const targetDirection = profileDraft.targetDirection?.trim() ?? null;
  const currentRole = profileDraft.currentRole?.trim() ?? null;
  const communicationSignals = inferCommunicationSignals(lastUserAnswer);
  const evidenceSources = buildEvidenceSources({ profileDraft, interviewState, profileSummary });
  const facts: ProfileFact[] = [];
  const interpretations: ProfileInterpretation[] = [];
  const uncertainties: ProfileUncertainty[] = [];
  const hypotheses: Hypothesis[] = [];
  const questionPriorities: QuestionPriority[] = [];
  const higherBarTarget = hasHigherBarTargetDirection(targetDirection);
  const targetKind = inferTargetProfileKind(profileDraft);
  const productOwnershipSupported =
    hasFormalProductOwnershipSignal(lastUserAnswer) ||
    hasFormalProductOwnershipSignal(profileSummary?.aiProfileCore.currentWorkReality) ||
    hasFormalProductOwnershipSignal(profileSummary?.aiProfileCore.levelSeniority);
  const strategicOwnershipSupported =
    hasStrategicOwnershipSignal(lastUserAnswer) ||
    hasStrategicOwnershipSignal(profileSummary?.aiProfileCore.directionOfChange) ||
    hasStrategicOwnershipSignal(profileSummary?.aiProfileCore.levelSeniority);
  const leadershipScopeSupported =
    hasLeadershipScopeSignal(lastUserAnswer) ||
    hasLeadershipScopeSignal(profileSummary?.aiProfileCore.levelSeniority);

  if (currentRole) {
    facts.push({
      key: "current_role",
      statement: `Nuværende eller seneste rolle er ${currentRole}.`,
      evidenceLevel: "explicit",
      sources: ["profile_draft"],
    });
  }

  if (targetDirection) {
    facts.push({
      key: "target_direction",
      statement: `Brugeren sigter mod ${targetDirection}.`,
      evidenceLevel: "explicit",
      sources: ["profile_draft"],
    });
  }

  if (targetDirection && targetKind === "same_track_better_conditions") {
    interpretations.push({
      key: "same_track_better_conditions",
      statement: "Brugerens retning handler primaert om samme type arbejde med bedre rammer, ikke om forfremmelse eller retningsskift.",
      confidence: coverage.motivationFit || coverage.noGoClarity ? "high" : "medium",
      evidenceSignals: ["target_direction", "same_track", "conditions_signal"],
    });
  }

  if (targetDirection && targetKind === "direction_change") {
    interpretations.push({
      key: "direction_change_transfer_basis",
      statement: "Brugeren oensker et retningsskift, saa profilen skal skelne mellem overfoerbare styrker og manglende direkte beviser.",
      confidence: coverage.transferableStrengths || coverage.profileStrengthGap ? "medium" : "low",
      evidenceSignals: ["target_direction", "transferable_strengths", "transition_gap"],
    });
  }

  if (targetDirection && targetKind === "unclear") {
    interpretations.push({
      key: "direction_unclear_needs_boundaries",
      statement: "Brugerens retning er bevidst uklar og boer afklares gennem energi, no-go forhold og naermeste realistiske rolletyper.",
      confidence: coverage.workStyleFit || coverage.noGoClarity ? "medium" : "low",
      evidenceSignals: ["unclear_direction", "needs_clarification", "no_default_push"],
    });
  }

  if (targetDirection && targetKind === "less_responsibility") {
    interpretations.push({
      key: "less_responsibility_direction",
      statement: "Brugeren oensker at bruge sin erfaring med lavere pres og mindre ansvar, ikke en automatisk karrierevej mod hoejere pres.",
      confidence: coverage.noGoClarity || coverage.workStyleFit ? "high" : "medium",
      evidenceSignals: ["target_direction", "less_responsibility", "work_style_fit"],
    });
  }

  if (targetDirection && targetKind === "specialist_track") {
    interpretations.push({
      key: "specialist_without_people_management",
      statement: "Brugeren sigter mod faglig specialistdybde og har eksplicit fravalgt personaleansvar eller people management.",
      confidence: coverage.ownershipScope || coverage.resultEvidence ? "high" : "medium",
      evidenceSignals: ["target_direction", "specialist_track", "no_people_management"],
    });
  }

  if (targetDirection && targetKind === "product_transition") {
    interpretations.push({
      key: "product_transition_gap",
      statement: "Brugeren sigter mod produktretning, hvor koordinering og beslutningsstoette skal holdes adskilt fra formelt roadmap- eller backlogansvar.",
      confidence: interviewState.evidenceCounts.productOwnershipEvidenceCount >= 1 ? "high" : "medium",
      evidenceSignals: ["target_direction", "product_transition", "formal_product_ownership_gap"],
    });
  }

  if (coverage.currentWorkReality && profileSummary?.aiProfileCore.currentWorkReality) {
    facts.push({
      key: "current_work_reality",
      statement: profileSummary.aiProfileCore.currentWorkReality,
      evidenceLevel: "supported",
      sources: ["interview_answers", "structured_summary"],
    });
  }

  if (coverage.domainContext) {
    facts.push({
      key: "domain_context",
      statement: "Branche eller kundekontekst er nu nogenlunde tydeliggjort.",
      evidenceLevel: "supported",
      sources: ["interview_answers", ...(profileSummary ? (["structured_summary"] as EvidenceSourceKey[]) : [])],
    });
  }

  if (coverage.directionOfChange && profileSummary?.aiProfileCore.directionOfChange) {
    interpretations.push({
      key: "direction_is_clearer_than_proof",
      statement: "Den ønskede retning er tydeligere beskrevet end den endnu er direkte bevist.",
      confidence: coverage.profileStrengthGap ? "high" : "medium",
      evidenceSignals: ["direction_of_change", "self_claim_not_proof"],
    });
  }

  if (coverage.currentWorkReality && coverage.transferableStrengths && !productOwnershipSupported && higherBarTarget) {
    interpretations.push({
      key: "product_adjacent_transition",
      statement: "Profilen ligner foreløbig en stærkere overgang til produktnære eller hybride roller end til tungt dokumenteret fuldt produktansvar.",
      confidence: coverage.profileStrengthGap ? "high" : "medium",
      evidenceSignals: ["cross_functional_coordination", "transferable_strengths", "missing_formal_product_ownership"],
    });
  }

  if (coverage.ownershipScope && coverage.currentWorkReality) {
    interpretations.push({
      key: "execution_and_coordination_strength",
      statement: "Styrken ser ud til at ligge i koordinering, gennemførelse, prioriteringsstøtte eller operativ fremdrift.",
      confidence: coverage.resultEvidence ? "high" : "medium",
      evidenceSignals: ["ownership_scope", "current_work_reality", "evidence_depth"],
    });
  }

  if (!productOwnershipSupported && higherBarTarget) {
    uncertainties.push({
      key: "formal_product_ownership",
      statement: "Formelt produktansvar som roadmap, backlog eller prioriteringsret er endnu ikke stærkt bevist.",
      impact: "high",
      focusArea: "level_seniority",
      unresolved: true,
    });
  }

  if (!strategicOwnershipSupported && higherBarTarget) {
    uncertainties.push({
      key: "strategic_direction_ownership",
      statement: "Strategisk retning eller produktbeslutninger er endnu ikke tydeligt underbygget.",
      impact: "high",
      focusArea: "level_seniority",
      unresolved: true,
    });
  }

  if (!coverage.resultEvidence) {
    uncertainties.push({
      key: "result_strength",
      statement: "Det er stadig uklart, hvad der konkret kom ud af brugerens arbejde.",
      impact: "high",
      focusArea: "transferable_strengths",
      unresolved: true,
    });
  }

  if (!coverage.ownershipScope) {
    uncertainties.push({
      key: "ownership_scope",
      statement: "Det er stadig uklart, hvad brugeren selv bar ansvaret for fra start til slut.",
      impact: "high",
      focusArea: "level_seniority",
      unresolved: true,
    });
  }

  if (!coverage.domainContext) {
    uncertainties.push({
      key: "domain_context",
      statement: "Branche, kundetype eller forretningskontekst er endnu ikke stærkt nok forankret.",
      impact: "medium",
      focusArea: "current_work_reality",
      unresolved: true,
    });
  }

  if (!coverage.noGoClarity) {
    uncertainties.push({
      key: "no_go_clarity",
      statement: "Det er endnu ikke helt tydeligt, hvilke rammer eller roller der vil være et dårligt match.",
      impact: "medium",
      focusArea: "mismatch_risk",
      unresolved: true,
    });
  }

  if (!leadershipScopeSupported && coverage.levelSeniority === false && higherBarTarget) {
    uncertainties.push({
      key: "leadership_vs_coordination_scope",
      statement: "Det er endnu uklart, om niveauet primært er koordinering eller også mere formel ledelses- eller beslutningsscope.",
      impact: "medium",
      focusArea: "level_seniority",
      unresolved: true,
    });
  }

  hypotheses.push({
    key: "target_direction_stronger_than_proven_evidence",
    statement: "Målretningen er foreløbig stærkere end de direkte beviser.",
    supportLevel: coverage.profileStrengthGap || (higherBarTarget && !productOwnershipSupported) ? "high" : "medium",
    contradictionLevel: coverage.resultEvidence && coverage.ownershipScope ? "low" : "none",
    confidence: coverage.profileStrengthGap ? "high" : "medium",
    evidenceSignals: ["target_direction", "profile_strength_gap", "evidence_depth"],
    unresolved: Boolean(coverage.profileStrengthGap || (higherBarTarget && !productOwnershipSupported)),
  });

  hypotheses.push({
    key: "product_adjacent_transition_stronger_than_full_pm",
    statement: "Brugeren er muligvis bedre støttet som produktnær overgangsprofil end som fuldt bevist Product Manager lige nu.",
    supportLevel: higherBarTarget && !productOwnershipSupported ? "high" : "medium",
    contradictionLevel: productOwnershipSupported ? "medium" : "none",
    confidence: higherBarTarget ? "medium" : "low",
    evidenceSignals: ["target_direction", "missing_formal_product_ownership", "coordination_strength"],
    unresolved: Boolean(higherBarTarget && !productOwnershipSupported),
  });

  hypotheses.push({
    key: "execution_coordination_is_core_strength",
    statement: "Brugerens stærkeste værdi ser ud til at ligge i koordinering, gennemførelse og beslutningsstøtte.",
    supportLevel: coverage.currentWorkReality && coverage.transferableStrengths ? "high" : "medium",
    contradictionLevel: productOwnershipSupported && strategicOwnershipSupported ? "medium" : "low",
    confidence: coverage.evidenceDepth ? "medium" : "low",
    evidenceSignals: ["current_work_reality", "transferable_strengths", "ownership_scope"],
    unresolved: false,
  });

  hypotheses.push({
    key: "communication_style_signal",
    statement:
      communicationSignals.answerStyle === "detailed"
        ? "Brugeren forklarer sig forholdsvis udførligt."
        : communicationSignals.answerStyle === "concise"
          ? "Brugeren svarer forholdsvis kort og koncentreret."
          : "Brugeren svarer med nogenlunde balanceret detaljeringsgrad.",
    supportLevel: "medium",
    contradictionLevel: "none",
    confidence: "medium",
    evidenceSignals: [
      `answer_style_${communicationSignals.answerStyle}`,
      `evidence_density_${communicationSignals.evidenceDensity}`,
      `structure_${communicationSignals.structureLevel}`,
    ],
    unresolved: false,
  });

  addQuestionPriority(questionPriorities, {
    key: "profile_strength_gap",
    statement: "Afklar hullet mellem ønsket retning og nuværende beviser.",
    question: "Hvor mener du selv, at din profil endnu er svagere end den rolle, du gerne vil bevæge dig mod?",
    focusArea: "mismatch_risk",
    score:
      coverage.profileStrengthGap && interviewState.evidenceCounts.profileStrengthGapCount >= 1
        ? 10
        : higherBarTarget
          ? 90
          : 74,
    reason: "Det skelner mellem ambition og realistisk næste skridt.",
    unresolved: !(coverage.profileStrengthGap && interviewState.evidenceCounts.profileStrengthGapCount >= 1) || higherBarTarget,
  });

  addQuestionPriority(questionPriorities, {
    key: "result_evidence",
    statement: "Afklar hvad der konkret kom ud af arbejdet.",
    question: "Kan du give et konkret eksempel på, hvad der kom ud af dit arbejde i en vigtig opgave eller leverance?",
    focusArea: "transferable_strengths",
    score: coverage.resultEvidence ? 18 : 92,
    reason: "Resultateffekt ændrer både readiness og styrken i profilen.",
    unresolved: !coverage.resultEvidence,
  });

  addQuestionPriority(questionPriorities, {
    key: "ownership_scope",
    statement: "Afklar hvad brugeren selv bar ansvaret for.",
    question: "Hvad havde du selv ansvaret for i den opgave fra start til slut?",
    focusArea: "level_seniority",
    score:
      interviewState.evidenceCounts.productOwnershipEvidenceCount >= 1 && coverage.ownershipScope
        ? 12
        : coverage.ownershipScope
          ? 16
          : higherBarTarget
            ? 91
            : 87,
    reason: "Ansvarsscope tester niveau, ikke kun selvopfattelse.",
    unresolved: !coverage.ownershipScope,
  });

  addQuestionPriority(questionPriorities, {
    key: "product_ownership_evidence",
    statement: "Afklar om der faktisk har vÃ¦ret formelt produkt- eller prioriteringsansvar.",
    question: "Har du haft direkte ansvar for backlog, roadmap eller egentlig prioritering, eller har du mest understÃ¸ttet andres beslutninger?",
    focusArea: "level_seniority",
    score:
      interviewState.evidenceCounts.productOwnershipEvidenceCount >= 1
        ? 9
        : higherBarTarget && !productOwnershipSupported
          ? 89
          : 42,
    reason: "Det skiller produktnÃ¦r erfaring fra formelt produktansvar.",
    unresolved: higherBarTarget && interviewState.evidenceCounts.productOwnershipEvidenceCount < 1,
  });

  addQuestionPriority(questionPriorities, {
    key: "concrete_evidence",
    statement: "Få et konkret eksempel, hvis profilen stadig er for generisk.",
    question: "Kan du give et konkret eksempel på en opgave eller situation, som viser det bedst?",
    focusArea: "transferable_strengths",
    score: coverage.concreteEvidence ? 20 : 88,
    reason: "Et konkret eksempel reducerer generisk profilering.",
    unresolved: !coverage.concreteEvidence,
  });

  addQuestionPriority(questionPriorities, {
    key: "no_go_clarity",
    statement: "Afklar hvad der vil være et dårligt match fremover.",
    question: "Hvad vil du helst undgå i dit næste job, hvis du skal trives og lykkes?",
    focusArea: "mismatch_risk",
    score: coverage.noGoClarity && interviewState.evidenceCounts.noGoClarityCount >= 1 ? 8 : 84,
    reason: "No-go signaler forbedrer jobmatch og beslutningskvalitet.",
    unresolved: !(coverage.noGoClarity && interviewState.evidenceCounts.noGoClarityCount >= 1),
  });

  addQuestionPriority(questionPriorities, {
    key: "domain_context",
    statement: "Afklar branche, kundetype eller forretningskontekst.",
    question: "Hvilken branche, type virksomhed eller type kunder har du mest arbejdet med de seneste år?",
    focusArea: "current_work_reality",
    score: coverage.domainContext ? 22 : 80,
    reason: "Domænekontekst gør profilen mere realistisk og mindre generisk.",
    unresolved: !coverage.domainContext,
  });

  addQuestionPriority(questionPriorities, {
    key: "level_seniority",
    statement: "Afklar faktisk beslutnings- og ansvarsniveau.",
    question: "Hvilket ansvar eller hvilken beslutningsrolle har du typisk haft i de vigtigste opgaver?",
    focusArea: "level_seniority",
    score: coverage.levelSeniority ? 24 : higherBarTarget ? 86 : 76,
    reason: "Niveau og scope påvirker både jobfit og readiness.",
    unresolved: !coverage.levelSeniority,
  });

  addQuestionPriority(questionPriorities, {
    key: "direction_of_change",
    statement: "Afklar forskellen mellem næste skridt og længere ambition.",
    question: "Hvad er det vigtigste ved den retning, du søger nu, og er det et næste skridt eller mere et længere mål?",
    focusArea: "direction_change",
    score:
      coverage.directionOfChange && interviewState.evidenceCounts.profileStrengthGapCount >= 1
        ? 14
        : coverage.directionOfChange
          ? 26
          : 82,
    reason: "Det skiller reel overgang fra aspiration.",
    unresolved: !coverage.directionOfChange || interviewState.evidenceCounts.profileStrengthGapCount < 1,
  });

  addQuestionPriority(questionPriorities, {
    key: "work_style_fit",
    statement: "Afklar hvilke rammer der faktisk passer brugeren.",
    question: "Hvilke rammer eller måder at arbejde på passer bedst til dig i hverdagen, hvis du skal lykkes over tid?",
    focusArea: "work_style_fit",
    score: coverage.workStyleFit ? 25 : 72,
    reason: "Sustainable fit er vigtig, men kommer efter tunge evidenshuller.",
    unresolved: !coverage.workStyleFit,
  });

  questionPriorities.sort((a, b) => b.score - a.score);

  return {
    evidenceSources,
    facts,
    interpretations,
    uncertainties,
    hypotheses,
    questionPriorities,
    communicationSignals,
  };
}

function buildRecoveryQuestionFromProfileModel(
  profileModel: InterviewProfileModel,
  interviewState: InterviewState,
  lastAssistantQuestion: string | null = null,
): { question: string; focusArea: FocusArea } | null {
  for (const priority of profileModel.questionPriorities) {
    if (!priority.unresolved || priority.score < 40) {
      continue;
    }

    if (
      isQuestionOverused({
        question: priority.question,
        focusArea: priority.focusArea,
        interviewState,
        lastAssistantQuestion,
      })
    ) {
      continue;
    }

    const family = inferQuestionFamily(priority.question, priority.focusArea);
    if (family && isQuestionFamilySaturated(interviewState, family)) {
      continue;
    }

    const evidenceTrack = inferEvidenceTrackFromQuestion(priority.question);
    if (evidenceTrack && isEvidenceTrackSaturated(interviewState, evidenceTrack)) {
      continue;
    }

    return mapQuestionPriorityToRecoveryQuestion(priority);
  }

  return null;
}

function buildUnsaturatedRecoveryQuestion({
  profileModel,
  interviewState,
  lastAssistantQuestion,
  priorityOverride,
}: {
  profileModel: InterviewProfileModel;
  interviewState: InterviewState;
  lastAssistantQuestion: string | null;
  priorityOverride?: MissingCoverageDimension[];
}): { question: string; focusArea: FocusArea; missingDimension?: MissingCoverageDimension } | null {
  const profileModelRecovery = buildRecoveryQuestionFromProfileModel(profileModel, interviewState, lastAssistantQuestion);

  if (profileModelRecovery) {
    return profileModelRecovery;
  }

  const missingDimensions = priorityOverride ?? getMissingCoverageDimensions(interviewState);

  for (const dimension of missingDimensions) {
    const recovery = buildRecoveryQuestionForMissingCoverage(interviewState, [dimension]);

    if (!recovery) {
      continue;
    }

    if (
      isQuestionOverused({
        question: recovery.question,
        focusArea: recovery.focusArea,
        interviewState,
        lastAssistantQuestion,
      })
    ) {
      continue;
    }

    return recovery;
  }

  const breadthRecovery = buildRecoveryQuestionForFocusAreaBreadth(interviewState);

  if (
    breadthRecovery &&
    !isQuestionOverused({
      question: breadthRecovery.question,
      focusArea: breadthRecovery.focusArea,
      interviewState,
      lastAssistantQuestion,
    })
  ) {
    return breadthRecovery;
  }

  return null;
}

function countHighImpactUnresolvedUncertainties(profileModel: InterviewProfileModel) {
  return profileModel.uncertainties.filter((item) => item.unresolved && item.impact === "high").length;
}

function buildComplexGapRecoveryQuestion({
  profileDraft,
  interviewState,
  lastAssistantQuestion,
}: {
  profileDraft: ProfileDraft;
  interviewState: InterviewState;
  lastAssistantQuestion: string | null;
}): { question: string; focusArea: FocusArea } | null {
  const kind = inferTargetProfileKind(profileDraft);

  if (kind !== "less_responsibility" && kind !== "product_transition") {
    return null;
  }

  const recovery =
    kind === "less_responsibility"
      ? {
          question: "Hvad vil du gerne bruge din erfaring til fremover, og hvad skal fylde mindre for at presset bliver lavere?",
          focusArea: "work_style_fit" as FocusArea,
        }
      : kind === "product_transition"
        ? {
            question: "Hvilken rolle taet paa maalet virker mest realistisk nu, og hvad skal stadig afklares foer du gaar laengere i den retning?",
            focusArea: "work_style_fit" as FocusArea,
          }
        : null;

  if (
    !recovery ||
    isQuestionOverused({
      question: recovery.question,
      focusArea: recovery.focusArea,
      interviewState,
      lastAssistantQuestion,
    })
  ) {
    return null;
  }

  return recovery;
}

function buildReadinessAssessment({
  profileDraft,
  profileSummary,
  interviewState,
  profileModel,
}: {
  profileDraft: ProfileDraft;
  profileSummary: ProfileSummary;
  interviewState: InterviewState;
  profileModel?: InterviewProfileModel;
}): ReadinessAssessment {
  const coverage = interviewState.coverage;
  const confidence = profileSummary.aiProfileCore.confidence;
  const targetDirection = profileDraft.targetDirection?.trim() ?? null;
  const practicalEvidenceCount = [
    coverage.concreteEvidence,
    coverage.ownershipScope,
    coverage.resultEvidence,
  ].filter(Boolean).length;
  const broadSupportCount = [
    coverage.levelSeniority,
    coverage.workStyleFit,
    coverage.domainContext,
    coverage.noGoClarity,
    coverage.mismatchRisk,
  ].filter(Boolean).length;
  const strongEvidence =
    coverage.evidenceDepth &&
    coverage.concreteEvidence &&
    coverage.ownershipScope &&
    coverage.resultEvidence;
  const strongContext = coverage.domainContext && coverage.motivationFit && coverage.noGoClarity;
  const higherBarTarget = hasHigherBarTargetDirection(targetDirection);
  const hasProfileGap =
    coverage.profileStrengthGap ||
    Boolean(
      profileModel?.hypotheses.some(
        (hypothesis) => hypothesis.key === "target_direction_stronger_than_proven_evidence" && hypothesis.unresolved,
      ),
    );

  let targetDirectionSupport: TargetDirectionSupport;

  if (
    hasProfileGap ||
    (higherBarTarget && (!strongEvidence || !coverage.levelSeniority || practicalEvidenceCount < 2))
  ) {
    targetDirectionSupport = "not_yet_proven";
  } else if (
    strongEvidence &&
    coverage.levelSeniority &&
    coverage.domainContext &&
    coverage.workStyleFit &&
    confidence !== "low"
  ) {
    targetDirectionSupport = "strong";
  } else {
    targetDirectionSupport = "partial";
  }

  let level: ReadinessLevel;

  if (targetDirectionSupport === "not_yet_proven") {
    level = "not_strong_enough_for_target";
  } else if (strongEvidence && strongContext && !hasProfileGap && confidence !== "low" && broadSupportCount >= 4) {
    level = "stronger_profile";
  } else {
    level = "minimum_usable";
  }

  const strengthSignals: string[] = [];
  const gapSignals: string[] = [];

  if (coverage.currentWorkReality) {
    strengthSignals.push("Du har tydelig beskrivelse af din nuværende arbejdssituation");
  }
  if (coverage.directionOfChange) {
    strengthSignals.push("Din retning er klart beskrevet");
  }
  if (coverage.ownershipScope) {
    strengthSignals.push("Du har konkrete eksempler på ansvar og opgaveejerskab");
  }
  if (coverage.resultEvidence) {
    strengthSignals.push("Du har eksempler på, hvad der kom ud af dit arbejde");
  }
  if (coverage.domainContext) {
    strengthSignals.push("Din branche- og kontekstforståelse er godt beskrevet");
  }
  if (coverage.workStyleFit) {
    strengthSignals.push("Det er tydeligt, hvilke rammer og arbejdsformer der passer dig");
  }

  if (hasProfileGap) {
    gapSignals.push("Din profil viser stadig et hul mellem nuværende beviser og den retning, du sigter mod");
  }
  if (!coverage.resultEvidence) {
    gapSignals.push("Der mangler stadig stærkere beviser for resultater eller effekt");
  }
  if (!coverage.ownershipScope) {
    gapSignals.push("Det er endnu ikke tydeligt nok, hvilket ansvar du selv har båret");
  }
  if (!coverage.domainContext) {
    gapSignals.push("Din erfaring er endnu ikke stærkt nok forankret i en tydelig branche- eller kundekontekst");
  }
  if (higherBarTarget && !coverage.levelSeniority) {
    gapSignals.push("Du mangler stadig stærkere tegn på niveau og ansvar i forhold til målretningen");
  }
  if (
    profileModel?.uncertainties.some((uncertainty) => uncertainty.key === "formal_product_ownership" && uncertainty.unresolved)
  ) {
    gapSignals.push("Formelt ejerskab eller prioriteringsansvar er endnu ikke tydeligt nok bevist");
  }
  if (targetDirectionSupport === "not_yet_proven" && targetDirection) {
    gapSignals.push(`Din profil er endnu mere indirekte end direkte i forhold til ${targetDirection}`);
  }

  if (strengthSignals.length === 0) {
    strengthSignals.push("Din profil giver et brugbart første billede af erfaring og retning");
  }

  if (gapSignals.length === 0 && level !== "stronger_profile") {
    gapSignals.push("Der er stadig plads til stærkere eksempler og mere direkte beviser");
  }

  let summary: string;

  switch (level) {
    case "not_strong_enough_for_target":
      summary = "Din profil er brugbar, men endnu ikke stærk nok til den retning, du sigter mod.";
      break;
    case "stronger_profile":
      summary = "Din profil fremstår stærk og relativt godt underbygget i forhold til den retning, du søger.";
      break;
    case "minimum_usable":
    default:
      summary = "Din profil er brugbar og giver et rimeligt grundlag for vurdering og målretning.";
      break;
  }

  return {
    level,
    targetDirectionSupport,
    summary,
    strengthSignals: strengthSignals.slice(0, 4),
    gapSignals: gapSignals.slice(0, 4),
  };
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

  if (lastUserAnswer !== undefined && lastUserAnswer !== null && !isInterviewAnswerString(lastUserAnswer, 5000)) {
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

  const normalizedLastAssistantQuestion =
    typeof lastAssistantQuestion === "string" ? lastAssistantQuestion.trim() : null;
  const rawLastUserAnswer = typeof lastUserAnswer === "string" ? lastUserAnswer : null;
  const trimmedLastUserAnswer = rawLastUserAnswer?.trim() ?? null;
  let answerQuality: AnswerQuality | null = null;
  let lowQualityReason: string | null = null;

  if (rawLastUserAnswer && trimmedLastUserAnswer && trimmedLastUserAnswer.length > 0) {
    answerQuality = inferAnswerQuality(rawLastUserAnswer);

    if (answerQuality === "junk_or_testlike") {
      lowQualityReason = getLowQualityReason(rawLastUserAnswer);
    }
  }

  if (lowQualityReason) {
    return errorResponse(
      "Det svar er lidt for kort eller uklart til, at JobPilot kan føre interviewet videre endnu. Du må gerne svare kort eller langt. Et konkret eksempel hjælper ofte.",
      "LOW_QUALITY_ANSWER",
      { lowQualityReason },
    );
  }

  const workingInterviewState =
    answerQuality
      ? updateInterviewState({
          interviewState,
          lastAssistantQuestion: normalizedLastAssistantQuestion,
          lastUserAnswer: rawLastUserAnswer,
        })
      : interviewState;
  const workingProfileModel = buildInterviewProfileModel({
    profileDraft,
    interviewState: workingInterviewState,
    lastUserAnswer: rawLastUserAnswer,
  });

  if (answerQuality === "vague_but_real_attempt" && normalizedLastAssistantQuestion) {
    const priorFocusArea = inferFocusAreaFromQuestion(normalizedLastAssistantQuestion);
    let guidedRecovery =
      buildRecoveryQuestionFromProfileModel(workingProfileModel, workingInterviewState, normalizedLastAssistantQuestion) ??
      buildGuidedRecoveryQuestionForVagueAnswer(priorFocusArea);

    if (
      isQuestionOverused({
        question: guidedRecovery.question,
        focusArea: guidedRecovery.focusArea,
        interviewState: workingInterviewState,
        lastAssistantQuestion: normalizedLastAssistantQuestion,
      })
    ) {
      if (
        hasMinimumProvisionalProfileBasis({
          profileDraft,
          interviewState: workingInterviewState,
          profileModel: workingProfileModel,
        }) &&
        (estimateVisibleInterviewProgress(workingInterviewState) >= 60 || workingInterviewState.answeredTurns >= 2)
      ) {
        if (process.env.NODE_ENV !== "production") {
          console.debug("[interview] completed with uncertainty after overused guided recovery");
        }

        return Response.json(
          buildDeterministicCompleteResult({
            profileDraft,
            interviewState: workingInterviewState,
            profileModel: workingProfileModel,
          }),
        );
      }

      const unsaturatedRecovery = buildUnsaturatedRecoveryQuestion({
        profileModel: workingProfileModel,
        interviewState: workingInterviewState,
        lastAssistantQuestion: normalizedLastAssistantQuestion,
        priorityOverride: [
          "noGoClarity",
          "workStyleFit",
          "directionOfChange",
          "profileStrengthGap",
          "domainContext",
          "ownershipScope",
          "transferableStrengths",
          "mismatchRisk",
        ],
      });

      if (unsaturatedRecovery) {
        guidedRecovery = unsaturatedRecovery;
      }
    }

    if (process.env.NODE_ENV !== "production") {
      console.debug(`[interview] guided recovery for vague answer on ${guidedRecovery.focusArea}`);
    }

    return Response.json({
      ok: true,
      status: "continue",
      question: guidedRecovery.question,
      focusArea: guidedRecovery.focusArea,
      interviewState: appendRecentQuestion(workingInterviewState, guidedRecovery.question, guidedRecovery.focusArea),
    } satisfies GenerateSuccess);
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
    "Users may answer shortly, at medium length, or very fully. Adapt to the user's answer style rather than forcing short-answer behavior.",
    "Answer style itself can contain profiling signal.",
    "Do not repeat the same clarification if the latest user answer already resolves it sufficiently for phase 1.",
    "If the latest answer has already clarified the active uncertainty, either move to a different unresolved area or return status complete.",
    "Repeated direction-of-change questions are a sign to stop if the user's direction is already clear enough for phase 1.",
    "You are working toward actual coverage across profiling dimensions, not just a plausible sounding summary.",
    "Derive as much as possible from current evidence before asking a new question.",
    "Treat profileDraft and prior structured signals as evidence sources, not just interview decorations.",
    "Separate facts, interpretations, and uncertainties internally before choosing the next question.",
    "The user's ambition or self-description is a self-claim, not proof.",
    "Ask the single next question that most reduces a high-value uncertainty or tests an unresolved hypothesis.",
    "Prefer fewer heavy questions over many light ones.",
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
    "If the user makes a real attempt but stays vague or underdeveloped, ask a more supportive and scaffolded follow-up question instead of treating the answer as invalid.",
    "Ask what the user has actually done in practice, not only what they want or think they are good at.",
    "When evidence is weak, ask for a specific example, case, task pattern, responsibility, ownership scope, or practical outcome.",
    "Probe responsibility and scope when the user's target level looks higher than the currently proven evidence.",
    "Look for proof of readiness, not only aspiration.",
    "Evidence can be result-based, case-based, task-and-responsibility-based, or transition-supporting depending on the user's segment.",
    "Make it easier to understand what the user owned themselves, what they coordinated, what happened because of their work, and what supports readiness for the next level.",
    "Once a concrete example has already been established with responsibility and result, do not keep asking slightly different versions of the same evidence request.",
    "Avoid semantic circling around the same case, responsibility, or result theme even if the wording changes.",
    "Do not ask for information that is already strongly known from current structured evidence.",
    "If current evidence points to a likely interpretation but the proof is still weak, ask the narrowest question that can confirm or challenge it.",
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
    lastAssistantQuestion: normalizedLastAssistantQuestion,
    lastUserAnswer: rawLastUserAnswer,
    interviewState: workingInterviewState,
    profileModel: {
      facts: workingProfileModel.facts.slice(0, 4),
      interpretations: workingProfileModel.interpretations.slice(0, 4),
      uncertainties: workingProfileModel.uncertainties.slice(0, 5),
      hypotheses: workingProfileModel.hypotheses.slice(0, 4).map((item) => ({
        key: item.key,
        statement: item.statement,
        supportLevel: item.supportLevel,
        contradictionLevel: item.contradictionLevel,
        confidence: item.confidence,
        unresolved: item.unresolved,
      })),
      nextQuestionPriorities: workingProfileModel.questionPriorities.slice(0, 4).map((item) => ({
        key: item.key,
        statement: item.statement,
        focusArea: item.focusArea,
        score: item.score,
        reason: item.reason,
      })),
      communicationSignals: workingProfileModel.communicationSignals,
      evidenceSources: workingProfileModel.evidenceSources,
    },
    instruction:
      "Decide whether JobPilot should continue with exactly one next question or stop because phase-1 onboarding is sufficiently complete. Use the profile model to test unresolved hypotheses and evidence gaps before asking anything new. The human-facing question text must be in Danish. If complete, return the structured phase-1 profile summary. Return only the required JSON object.",
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

        const updatedInterviewState = answerQuality === "substantive_answer"
          ? updateInterviewState({
              interviewState: workingInterviewState,
              lastAssistantQuestion: null,
              lastUserAnswer: null,
              profileSummary: normalizedProfileSummary,
            })
          : updateInterviewState({
              interviewState,
              lastAssistantQuestion: typeof lastAssistantQuestion === "string" ? lastAssistantQuestion.trim() : null,
              lastUserAnswer: typeof lastUserAnswer === "string" ? lastUserAnswer.trim() : null,
              profileSummary: normalizedProfileSummary,
            });
        const profileModel = buildInterviewProfileModel({
          profileDraft,
          interviewState: updatedInterviewState,
          profileSummary: normalizedProfileSummary,
          lastUserAnswer: rawLastUserAnswer,
        });

        if (
          !isProfileSummarySufficientForPhase1({
            profileSummary: normalizedProfileSummary,
            lastAssistantQuestion: typeof lastAssistantQuestion === "string" ? lastAssistantQuestion.trim() : null,
            lastUserAnswer: typeof lastUserAnswer === "string" ? lastUserAnswer.trim() : null,
            interviewState: updatedInterviewState,
            profileModel,
          })
        ) {
          const recovery =
            buildRecoveryQuestionFromProfileModel(
              profileModel,
              updatedInterviewState,
              typeof lastAssistantQuestion === "string" ? lastAssistantQuestion.trim() : null,
            ) ??
            buildLateStageRecoveryQuestion(updatedInterviewState);

          if (recovery) {
            if (process.env.NODE_ENV !== "production") {
              const recoveryLabel =
                "missingDimension" in recovery ? recovery.missingDimension : profileModel.questionPriorities[0]?.key;
              console.debug(`[interview] recovered from insufficient coverage by asking about ${recoveryLabel}`);
            }

            return {
              ok: true,
              status: "continue",
              question: recovery.question,
              focusArea: recovery.focusArea,
              interviewState: appendRecentQuestion(updatedInterviewState, recovery.question, recovery.focusArea),
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
          readinessAssessment: buildReadinessAssessment({
            profileDraft,
            profileSummary: normalizedProfileSummary,
            interviewState: updatedInterviewState,
            profileModel,
          }),
          profileModel,
          hypothesisSummary: profileModel.hypotheses.slice(0, 4).map((hypothesis) => ({
            key: hypothesis.key,
            statement: hypothesis.statement,
            confidence: hypothesis.confidence,
            supportLevel: hypothesis.supportLevel,
            contradictionLevel: hypothesis.contradictionLevel,
            unresolved: hypothesis.unresolved,
          })),
          uncertaintySummary: profileModel.uncertainties
            .filter((uncertainty) => uncertainty.unresolved)
            .slice(0, 4)
            .map((uncertainty) => ({
              key: uncertainty.key,
              statement: uncertainty.statement,
              impact: uncertainty.impact,
              focusArea: uncertainty.focusArea,
            })),
          communicationSignals: profileModel.communicationSignals,
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
      const updatedInterviewState = workingInterviewState;
      const updatedProfileModel = buildInterviewProfileModel({
        profileDraft,
        interviewState: updatedInterviewState,
        lastUserAnswer: rawLastUserAnswer,
      });

      if (
        typeof lastAssistantQuestion === "string" &&
        priorFocusArea === focusArea &&
        areQuestionsTooSimilar(lastAssistantQuestion, question)
      ) {
        const complexGapRecovery = buildComplexGapRecoveryQuestion({
          profileDraft,
          interviewState: updatedInterviewState,
          lastAssistantQuestion,
        });

        if (complexGapRecovery) {
          if (process.env.NODE_ENV !== "production") {
            console.debug("[interview] redirected repeated question to complex gap recovery");
          }

          return {
            ok: true,
            status: "continue",
            question: complexGapRecovery.question,
            focusArea: complexGapRecovery.focusArea,
            interviewState: appendRecentQuestion(
              updatedInterviewState,
              complexGapRecovery.question,
              complexGapRecovery.focusArea,
            ),
          };
        }

        if (
          hasMinimumProvisionalProfileBasis({
            profileDraft,
            interviewState: updatedInterviewState,
            profileModel: updatedProfileModel,
          }) &&
          (estimateVisibleInterviewProgress(updatedInterviewState) >= 60 || updatedInterviewState.answeredTurns >= 2)
        ) {
          if (process.env.NODE_ENV !== "production") {
            console.debug("[interview] completed with uncertainty after repeated question hard stop");
          }

          return buildDeterministicCompleteResult({
            profileDraft,
            interviewState: updatedInterviewState,
            profileModel: updatedProfileModel,
          });
        }

        const recovery = buildUnsaturatedRecoveryQuestion({
          profileModel: updatedProfileModel,
          interviewState: updatedInterviewState,
          lastAssistantQuestion,
          priorityOverride: [
            "noGoClarity",
            "workStyleFit",
            "directionOfChange",
            "profileStrengthGap",
            "domainContext",
            "ownershipScope",
            "transferableStrengths",
            "mismatchRisk",
          ],
        });

        if (recovery) {
          if (process.env.NODE_ENV !== "production") {
            console.debug("[interview] redirected repeated question before retrying model");
          }

          return {
            ok: true,
            status: "continue",
            question: recovery.question,
            focusArea: recovery.focusArea,
            interviewState: appendRecentQuestion(updatedInterviewState, recovery.question, recovery.focusArea),
          };
        }

        if (
          shouldCompleteInsteadOfContinuing({
            question,
            focusArea,
            interviewState: updatedInterviewState,
            profileDraft,
            profileModel: updatedProfileModel,
            lastAssistantQuestion: typeof lastAssistantQuestion === "string" ? lastAssistantQuestion : null,
          })
        ) {
          if (process.env.NODE_ENV !== "production") {
            console.debug("[interview] completed instead of returning repeated question");
          }

          return buildDeterministicCompleteResult({
            profileDraft,
            interviewState: updatedInterviewState,
            profileModel: updatedProfileModel,
          });
        }

        if (
          hasMinimumProvisionalProfileBasis({
            profileDraft,
            interviewState: updatedInterviewState,
            profileModel: updatedProfileModel,
          }) &&
          (estimateVisibleInterviewProgress(updatedInterviewState) >= 70 || updatedInterviewState.answeredTurns >= 4)
        ) {
          if (process.env.NODE_ENV !== "production") {
            console.debug("[interview] completed with uncertainty after repeated question and no recovery path");
          }

          return buildDeterministicCompleteResult({
            profileDraft,
            interviewState: updatedInterviewState,
            profileModel: updatedProfileModel,
          });
        }

        return {
          ok: false,
          error: "Repeated interview question.",
          reasonCode: "REPEATED_QUESTION",
          retryable: true,
        };
      }

      const questionFamily = inferQuestionFamily(question, focusArea);
      if (questionFamily && isQuestionFamilySaturated(updatedInterviewState, questionFamily)) {
        const lastQuestionForRecovery = typeof lastAssistantQuestion === "string" ? lastAssistantQuestion : null;
        const recovery =
          questionFamily === "noGoClarity"
            ? buildUnsaturatedRecoveryQuestion({
                profileModel: updatedProfileModel,
                interviewState: updatedInterviewState,
                lastAssistantQuestion: lastQuestionForRecovery,
                priorityOverride: [
                  "profileStrengthGap",
                  "resultEvidence",
                  "concreteEvidence",
                  "ownershipScope",
                  "domainContext",
                  "levelSeniority",
                  "directionOfChange",
                  "workStyleFit",
                  "mismatchRisk",
                ],
              })
            : questionFamily === "productOwnershipEvidence"
              ? buildUnsaturatedRecoveryQuestion({
                  profileModel: updatedProfileModel,
                  interviewState: updatedInterviewState,
                  lastAssistantQuestion: lastQuestionForRecovery,
                  priorityOverride: [
                    "profileStrengthGap",
                    "resultEvidence",
                    "concreteEvidence",
                    "domainContext",
                    "transferableStrengths",
                    "directionOfChange",
                    "workStyleFit",
                  ],
                })
            : questionFamily === "profileStrengthGap"
              ? buildUnsaturatedRecoveryQuestion({
                  profileModel: updatedProfileModel,
                  interviewState: updatedInterviewState,
                  lastAssistantQuestion: lastQuestionForRecovery,
                  priorityOverride: [
                    "concreteEvidence",
                    "resultEvidence",
                    "ownershipScope",
                    "directionOfChange",
                    "transferableStrengths",
                    "domainContext",
                    "levelSeniority",
                    "workStyleFit",
                  ],
                })
            : buildUnsaturatedRecoveryQuestion({
                profileModel: updatedProfileModel,
                interviewState: updatedInterviewState,
                lastAssistantQuestion: lastQuestionForRecovery,
              });

        if (recovery) {
          if (
            shouldCompleteInsteadOfContinuing({
              question: recovery.question,
              focusArea: recovery.focusArea,
              interviewState: updatedInterviewState,
              profileDraft,
              profileModel: updatedProfileModel,
              lastAssistantQuestion: typeof lastAssistantQuestion === "string" ? lastAssistantQuestion : null,
            })
          ) {
            if (process.env.NODE_ENV !== "production") {
              console.debug("[interview] completed instead of returning saturated-family recovery question");
            }

            return buildDeterministicCompleteResult({
              profileDraft,
              interviewState: updatedInterviewState,
              profileModel: updatedProfileModel,
            });
          }

          if (process.env.NODE_ENV !== "production") {
            const recoveryLabel =
              "missingDimension" in recovery ? recovery.missingDimension : updatedProfileModel.questionPriorities[0]?.key;
            if (questionFamily === "noGoClarity") {
              console.debug(`[interview] blocked noGo family repetition -> ${recoveryLabel}`);
            } else if (questionFamily === "productOwnershipEvidence") {
              console.debug(`[interview] blocked ownership/product-decision repetition -> ${recoveryLabel}`);
            } else if (questionFamily === "profileStrengthGap") {
              console.debug(`[interview] blocked targetGap family repetition -> ${recoveryLabel}`);
            } else {
              console.debug(`[interview] blocked saturated ${questionFamily} family and redirected to ${recoveryLabel}`);
            }
          }

          return {
            ok: true,
            status: "continue",
            question: recovery.question,
            focusArea: recovery.focusArea,
            interviewState: appendRecentQuestion(updatedInterviewState, recovery.question, recovery.focusArea),
          };
        }
      }

      const evidenceTrack = inferEvidenceTrackFromQuestion(question);

      if (evidenceTrack && isEvidenceTrackSaturated(updatedInterviewState, evidenceTrack)) {
        const recovery = buildUnsaturatedRecoveryQuestion({
          profileModel: updatedProfileModel,
          interviewState: updatedInterviewState,
          lastAssistantQuestion: typeof lastAssistantQuestion === "string" ? lastAssistantQuestion : null,
          priorityOverride: [
            "noGoClarity",
            "profileStrengthGap",
            "mismatchRisk",
            "workStyleFit",
            "directionOfChange",
            "domainContext",
            "ownershipScope",
          ],
        });

        if (recovery) {
          if (
            shouldCompleteInsteadOfContinuing({
              question: recovery.question,
              focusArea: recovery.focusArea,
              interviewState: updatedInterviewState,
              profileDraft,
              profileModel: updatedProfileModel,
              lastAssistantQuestion: typeof lastAssistantQuestion === "string" ? lastAssistantQuestion : null,
            })
          ) {
            if (process.env.NODE_ENV !== "production") {
              console.debug("[interview] completed instead of returning saturated-evidence recovery question");
            }

            return buildDeterministicCompleteResult({
              profileDraft,
              interviewState: updatedInterviewState,
              profileModel: updatedProfileModel,
            });
          }

          if (process.env.NODE_ENV !== "production") {
            console.debug(`[interview] recovered from saturated evidence track: ${evidenceTrack}`);
          }

          return {
            ok: true,
            status: "continue",
            question: recovery.question,
            focusArea: recovery.focusArea,
            interviewState: appendRecentQuestion(updatedInterviewState, recovery.question, recovery.focusArea),
          };
        }
      }

      if (
        isQuestionOverused({
          question,
          focusArea,
          interviewState: updatedInterviewState,
          lastAssistantQuestion: typeof lastAssistantQuestion === "string" ? lastAssistantQuestion : null,
        }) &&
        !hasSufficientCompletionSubstance({
          profileDraft,
          interviewState: updatedInterviewState,
          profileModel: updatedProfileModel,
        })
      ) {
        const recovery = buildUnsaturatedRecoveryQuestion({
          profileModel: updatedProfileModel,
          interviewState: updatedInterviewState,
          lastAssistantQuestion: typeof lastAssistantQuestion === "string" ? lastAssistantQuestion : null,
          priorityOverride: [
            "noGoClarity",
            "workStyleFit",
            "directionOfChange",
            "profileStrengthGap",
            "domainContext",
            "ownershipScope",
            "transferableStrengths",
            "mismatchRisk",
          ],
        });

        if (recovery) {
          if (process.env.NODE_ENV !== "production") {
            console.debug("[interview] redirected overused question before completion was sufficient");
          }

          return {
            ok: true,
            status: "continue",
            question: recovery.question,
            focusArea: recovery.focusArea,
            interviewState: appendRecentQuestion(updatedInterviewState, recovery.question, recovery.focusArea),
          };
        }

        if (
          hasMinimumProvisionalProfileBasis({
            profileDraft,
            interviewState: updatedInterviewState,
            profileModel: updatedProfileModel,
          }) &&
          (estimateVisibleInterviewProgress(updatedInterviewState) >= 70 || updatedInterviewState.answeredTurns >= 4)
        ) {
          const complexGapRecovery = buildComplexGapRecoveryQuestion({
            profileDraft,
            interviewState: updatedInterviewState,
            lastAssistantQuestion: typeof lastAssistantQuestion === "string" ? lastAssistantQuestion : null,
          });

          if (complexGapRecovery) {
            if (process.env.NODE_ENV !== "production") {
              console.debug("[interview] redirected no-recovery completion to complex gap recovery");
            }

            return {
              ok: true,
              status: "continue",
              question: complexGapRecovery.question,
              focusArea: complexGapRecovery.focusArea,
              interviewState: appendRecentQuestion(
                updatedInterviewState,
                complexGapRecovery.question,
                complexGapRecovery.focusArea,
              ),
            };
          }

          if (process.env.NODE_ENV !== "production") {
            console.debug("[interview] completed with uncertainty because no unsaturated question remained");
          }

          return buildDeterministicCompleteResult({
            profileDraft,
            interviewState: updatedInterviewState,
            profileModel: updatedProfileModel,
          });
        }
      }

      if (
        shouldCompleteInsteadOfContinuing({
          question,
          focusArea,
          interviewState: updatedInterviewState,
          profileDraft,
          profileModel: updatedProfileModel,
          lastAssistantQuestion: typeof lastAssistantQuestion === "string" ? lastAssistantQuestion : null,
        })
      ) {
        const complexGapRecovery = buildComplexGapRecoveryQuestion({
          profileDraft,
          interviewState: updatedInterviewState,
          lastAssistantQuestion: typeof lastAssistantQuestion === "string" ? lastAssistantQuestion : null,
        });

        if (complexGapRecovery) {
          if (process.env.NODE_ENV !== "production") {
            console.debug("[interview] redirected forced completion to complex gap recovery");
          }

          return {
            ok: true,
            status: "continue",
            question: complexGapRecovery.question,
            focusArea: complexGapRecovery.focusArea,
            interviewState: appendRecentQuestion(
              updatedInterviewState,
              complexGapRecovery.question,
              complexGapRecovery.focusArea,
            ),
          };
        }

        if (process.env.NODE_ENV !== "production") {
          console.debug("[interview] completed instead of continuing after deterministic post-processing gate");
        }

        return buildDeterministicCompleteResult({
          profileDraft,
          interviewState: updatedInterviewState,
          profileModel: updatedProfileModel,
        });
      }

      return {
        ok: true,
        status,
        question,
        focusArea,
        interviewState: appendRecentQuestion(updatedInterviewState, question, focusArea),
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
