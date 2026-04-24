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

type ProfileDraft = {
  name?: string;
  currentRole?: string;
  yearsExperience?: string;
  targetDirection?: string;
};

function isShortString(value: unknown, maxLength = 300): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= maxLength;
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

function hasSubstantiveAnswer(value: string) {
  return normalizeText(value).split(" ").filter(Boolean).length >= 6;
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

function isProfileSummarySufficientForPhase1({
  profileSummary,
  lastAssistantQuestion,
  lastUserAnswer,
}: {
  profileSummary: {
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
  lastAssistantQuestion: string | null;
  lastUserAnswer: string | null;
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

  return true;
}

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json({
      ok: false,
      error: "OpenAI is not configured.",
    });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({
      ok: false,
      error: "Invalid JSON body.",
    });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json({
      ok: false,
      error: "Invalid request body.",
    });
  }

  const payload = body as Record<string, unknown>;

  if (payload.phase !== "initial") {
    return Response.json({
      ok: false,
      error: "Invalid phase.",
    });
  }

  const rawProfileDraft = payload.profileDraft;

  if (!rawProfileDraft || typeof rawProfileDraft !== "object" || Array.isArray(rawProfileDraft)) {
    return Response.json({
      ok: false,
      error: "Invalid profileDraft.",
    });
  }

  const profileDraftInput = rawProfileDraft as Record<string, unknown>;
  const profileDraft: ProfileDraft = {};

  for (const key of ["name", "currentRole", "yearsExperience", "targetDirection"] as const) {
    const rawValue = profileDraftInput[key];

    if (rawValue === undefined) {
      continue;
    }

    if (!isShortString(rawValue)) {
      return Response.json({
        ok: false,
        error: `Invalid ${key}.`,
      });
    }

    profileDraft[key] = rawValue.trim();
  }

  const lastUserAnswer = payload.lastUserAnswer;
  const lastAssistantQuestion = payload.lastAssistantQuestion;

  if (lastUserAnswer !== undefined && lastUserAnswer !== null && !isShortString(lastUserAnswer, 1000)) {
    return Response.json({
      ok: false,
      error: "Invalid lastUserAnswer.",
    });
  }

  if (
    lastAssistantQuestion !== undefined &&
    lastAssistantQuestion !== null &&
    !isShortString(lastAssistantQuestion, 300)
  ) {
    return Response.json({
      ok: false,
      error: "Invalid lastAssistantQuestion.",
    });
  }

  if (
    typeof lastUserAnswer === "string" &&
    lastUserAnswer.trim().length > 0 &&
    !(typeof lastAssistantQuestion === "string" && lastAssistantQuestion.trim().length > 0)
  ) {
    return Response.json({
      ok: false,
      error: "lastAssistantQuestion is required.",
    });
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
    instruction:
      "Decide whether JobPilot should continue with exactly one next question or stop because phase-1 onboarding is sufficiently complete. The human-facing question text must be in Danish. If complete, return the structured phase-1 profile summary. Return only the required JSON object.",
  });

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
      return Response.json({
        ok: false,
        error: "OpenAI request failed.",
      });
    }

    const data = (await response.json()) as Record<string, unknown>;
    const outputText = extractOutputText(data);

    if (!outputText) {
      return Response.json({
        ok: false,
        error: "Could not parse model output.",
      });
    }

    let parsed: unknown;

    try {
      parsed = JSON.parse(outputText);
    } catch {
      return Response.json({
        ok: false,
        error: "Invalid model JSON.",
      });
    }

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return Response.json({
        ok: false,
        error: "Invalid model response.",
      });
    }

    const result = parsed as Record<string, unknown>;
    const status = result.status;

    if (!isInterviewStatus(status)) {
      return Response.json({
        ok: false,
        error: "Invalid interview status.",
      });
    }

    if (status === "complete") {
      const profileSummary = result.profileSummary;

      if (!profileSummary || typeof profileSummary !== "object" || Array.isArray(profileSummary)) {
        return Response.json({
          ok: false,
          error: "Invalid profile summary.",
        });
      }

      const summary = profileSummary as Record<string, unknown>;
      const userProfileData = summary.userProfileData;
      const aiProfileCore = summary.aiProfileCore;

      if (!userProfileData || typeof userProfileData !== "object" || Array.isArray(userProfileData)) {
        return Response.json({
          ok: false,
          error: "Invalid user profile data.",
        });
      }

      if (!aiProfileCore || typeof aiProfileCore !== "object" || Array.isArray(aiProfileCore)) {
        return Response.json({
          ok: false,
          error: "Invalid AI profile core.",
        });
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
        return Response.json({
          ok: false,
          error: "Invalid AI profile core.",
        });
      }

      if (!isStringArray(aiCore.transferableStrengths) || !isStringArray(aiCore.mismatchRisks)) {
        return Response.json({
          ok: false,
          error: "Invalid AI profile arrays.",
        });
      }

      if (!isConfidenceLevel(aiCore.confidence)) {
        return Response.json({
          ok: false,
          error: "Invalid confidence level.",
        });
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

      if (
        !isProfileSummarySufficientForPhase1({
          profileSummary: normalizedProfileSummary,
          lastAssistantQuestion: typeof lastAssistantQuestion === "string" ? lastAssistantQuestion.trim() : null,
          lastUserAnswer: typeof lastUserAnswer === "string" ? lastUserAnswer.trim() : null,
        })
      ) {
        return Response.json({
          ok: false,
          error: "Profile summary is not sufficient.",
        });
      }

      return Response.json({
        ok: true,
        status,
        profileSummary: normalizedProfileSummary,
      });
    }

    const question = typeof result.question === "string" ? result.question.trim() : "";
    const focusArea = result.focusArea;

    if (!question || question.length > 300 || /\n/.test(question)) {
      return Response.json({
        ok: false,
        error: "Could not generate question.",
      });
    }

    if (!isFocusArea(focusArea)) {
      return Response.json({
        ok: false,
        error: "Invalid focus area.",
      });
    }

    const priorFocusArea =
      typeof lastAssistantQuestion === "string" ? inferFocusAreaFromQuestion(lastAssistantQuestion) : null;

    if (
      typeof lastAssistantQuestion === "string" &&
      priorFocusArea === focusArea &&
      areQuestionsTooSimilar(lastAssistantQuestion, question)
    ) {
      return Response.json({
        ok: false,
        error: "Repeated interview question.",
      });
    }

    return Response.json({
      ok: true,
      status,
      question,
      focusArea,
    });
  } catch {
    return Response.json({
      ok: false,
      error: "Server request failed.",
    });
  }
}
