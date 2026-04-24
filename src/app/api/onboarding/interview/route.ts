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

type FocusArea = (typeof allowedFocusAreas)[number];
type InterviewStatus = (typeof allowedStatuses)[number];

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
    "Think in terms of sufficiency for phase-1 profile evaluation: current work reality, level or seniority, transferable strengths, direction of change, work-style fit, and mismatch risk.",
    "Use status complete only when there is enough clarity to begin serious next-step profile assessment.",
    "If status is continue, the question text must be written in natural, professional Danish.",
    "Keep the question concise and specific.",
    'Return only valid JSON in exactly one of these shapes: {"status":"continue","question":"...","focusArea":"current_work_reality|level_seniority|transferable_strengths|direction_change|work_style_fit|mismatch_risk"} or {"status":"complete"}.',
    "Do not include markdown, prose, or extra keys.",
  ].join(" ");

  const userPrompt = JSON.stringify({
    phase: "initial",
    profileDraft,
    lastAssistantQuestion: typeof lastAssistantQuestion === "string" ? lastAssistantQuestion.trim() : null,
    lastUserAnswer: typeof lastUserAnswer === "string" ? lastUserAnswer.trim() : null,
    instruction:
      "Decide whether JobPilot should continue with exactly one next question or stop because phase-1 onboarding is sufficiently complete. The human-facing question text must be in Danish. Return only the required JSON object.",
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
      return Response.json({
        ok: true,
        status,
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
