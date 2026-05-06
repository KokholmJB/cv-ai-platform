"use client";

import { useMemo, useState } from "react";

type StepId = "start" | "basisoplysninger" | "dokumenter" | "ai-interview" | "profiloverblik" | "klar";
type ProfileTabId = "overblik" | "erfaring" | "jobretning" | "arbejdsprofil" | "naeste-skridt";

type FocusArea =
  | "current_work_reality"
  | "level_seniority"
  | "transferable_strengths"
  | "direction_change"
  | "work_style_fit"
  | "mismatch_risk";

type InterviewReasonCode =
  | "INVALID_MODEL_JSON"
  | "REPEATED_QUESTION"
  | "INSUFFICIENT_COVERAGE"
  | "INVALID_PROFILE_SUMMARY"
  | "INVALID_MODEL_OUTPUT"
  | "INVALID_PLAIN_DANISH"
  | "LOW_QUALITY_ANSWER"
  | "OPENAI_REQUEST_FAILED"
  | "RETRY_EXHAUSTED";

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

type InterviewState = {
  answeredTurns: number;
  coveredFocusAreas: FocusArea[];
  coverage: InterviewCoverage;
};

type ConfidenceLevel = "low" | "medium" | "high";

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

type ReadinessAssessment = {
  level: "minimum_usable" | "stronger_profile" | "not_strong_enough_for_target";
  targetDirectionSupport: "partial" | "strong" | "not_yet_proven";
  summary: string;
  strengthSignals: string[];
  gapSignals: string[];
};

type ProfileModelEntry = {
  key?: string;
  statement?: string;
};

type ProfileCommunicationSignals = {
  answerStyle?: string;
  structureLevel?: string;
  evidenceDensity?: string;
  possibleSelfMinimizingLanguage?: boolean;
  possibleOverlongExplanations?: boolean;
};

type ProfileModel = {
  facts?: unknown[];
  interpretations?: unknown[];
  uncertainties?: unknown[];
  hypotheses?: unknown[];
  communicationSignals?: ProfileCommunicationSignals;
};

type InterviewResult =
  | {
      status: "idle";
      question: null;
      focusArea: null;
      profileSummary: null;
      readinessAssessment: null;
      profileModel: null;
      hypothesisSummary: null;
      uncertaintySummary: null;
      communicationSignals: null;
    }
  | {
      status: "continue";
      question: string;
      focusArea: FocusArea;
      profileSummary: null;
      readinessAssessment: null;
      profileModel: null;
      hypothesisSummary: null;
      uncertaintySummary: null;
      communicationSignals: null;
    }
  | {
      status: "complete";
      question: null;
      focusArea: null;
      profileSummary: ProfileSummary;
      readinessAssessment: ReadinessAssessment;
      profileModel: ProfileModel | null;
      hypothesisSummary: unknown[] | null;
      uncertaintySummary: unknown[] | null;
      communicationSignals: ProfileCommunicationSignals | null;
    };

type UploadedFile = {
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
};

type SetupFormState = {
  documentsSkipped: boolean;
  profile: {
    navn: string;
    nuvaerendeTitel: string;
    erfaring: string;
    uddannelse: string;
    lokation: string;
  };
  preferences: {
    jobtype: string;
    undgaa: string;
  };
};

const steps: { id: StepId; label: string; eyebrow: string; title: string }[] = [
  { id: "start", label: "Start", eyebrow: "Trin 1", title: "Velkommen til JobPilot" },
  { id: "basisoplysninger", label: "Basisoplysninger", eyebrow: "Trin 2", title: "Hurtige basisoplysninger" },
  { id: "dokumenter", label: "Dokumenter", eyebrow: "Trin 3", title: "CV og dokumenter" },
  { id: "ai-interview", label: "AI-interview", eyebrow: "Trin 4", title: "Kort interview med JobPilot" },
  { id: "profiloverblik", label: "Profiloverblik", eyebrow: "Trin 5", title: "Dit første profiludkast" },
  { id: "klar", label: "Klar", eyebrow: "Trin 6", title: "Klar til næste fase" },
];

const profileTabs: { id: ProfileTabId; label: string }[] = [
  { id: "overblik", label: "Overblik" },
  { id: "erfaring", label: "Erfaring" },
  { id: "jobretning", label: "Jobretning" },
  { id: "arbejdsprofil", label: "Arbejdsprofil" },
  { id: "naeste-skridt", label: "Næste skridt" },
];

const mockUploadedFiles: UploadedFile[] = [
  { name: "CV_Maria_Jensen_2026.pdf", type: "CV", size: "1,8 MB", uploadedAt: "Uploadet for 2 min siden" },
  { name: "Ansættelseskontrakt_Northwind.pdf", type: "Ansættelseskontrakt", size: "840 KB", uploadedAt: "Uploadet for 4 min siden" },
  { name: "Kandidatbevis_CBS.pdf", type: "Uddannelsespapir", size: "620 KB", uploadedAt: "Uploadet for 5 min siden" },
];

const initialState: SetupFormState = {
  documentsSkipped: false,
  profile: {
    navn: "Maria Jensen",
    nuvaerendeTitel: "Projektleder",
    erfaring: "8 år med projektledelse, stakeholder management og tværgående samarbejde.",
    uddannelse: "Cand.merc. i strategi og ledelse",
    lokation: "København",
  },
  preferences: {
    jobtype: "Projektleder eller Product Manager",
    undgaa: "Rene salgsroller, nattevagter og meget tung rejseaktivitet",
  },
};

const emptyInterviewState: InterviewState = {
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
};

function formatMaybeValue(value: string | null) {
  return value && value.trim().length > 0 ? value : "Ikke tilgængelig endnu";
}

function formatMaybeText(value: unknown, fallback = "Ikke tilgængelig endnu") {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

function formatModelEntry(item: unknown) {
  if (!item || typeof item !== "object" || Array.isArray(item)) return formatMaybeText(item);
  const entry = item as ProfileModelEntry;
  return formatMaybeText(entry.statement);
}

function normalizeSignalText(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\bno go\b/gi, "rammer der ikke passer")
    .replace(/\bno-go\b/gi, "rammer der ikke passer")
    .replace(/\bmismatch\b/gi, "mismatch")
    .replace(/\bnot yet proven\b/gi, "kan afklares mere")
    .replace(/\bnot strong enough for target\b/gi, "kan styrkes med flere eksempler")
    .replace(/\bmangler\b/gi, "kan styrkes med")
    .replace(/\bendnu ikke bevist\b/gi, "kan afklares mere")
    .replace(/\bkræver mere dokumentation\b/gi, "kan afklares med flere eksempler")
    .replace(/\bhul\b/gi, "område")
    .trim();
}

function hasTechnicalPattern(value: string) {
  const lower = value.toLowerCase();
  return (
    value.includes("_") ||
    lower.includes("brugeren") ||
    lower.includes("no-go") ||
    lower.includes("hul") ||
    lower.includes("huller") ||
    lower.includes("mangler") ||
    lower.includes("ikke stærkt nok") ||
    lower.includes("endnu ikke bevist") ||
    lower.includes("underbygget") ||
    lower.includes("formelt") ||
    lower.includes("datagrundlag") ||
    lower.includes("matchvurdering")
  );
}

function toUserFacingText(value: string) {
  let text = normalizeSignalText(value);
  text = text.replace(/\b[Bb]rugeren\b/g, "Du");
  text = text.replace(/\bunderbygget\b/gi, "afklaret");
  text = text.replace(/\bdatagrundlag\b/gi, "udgangspunkt");
  text = text.replace(/\bmatchvurdering\b/gi, "vurdering");
  text = text.replace(/\bno-go\b/gi, "rammer der ikke passer");
  text = text.replace(/\bformelt\b/gi, "");
  text = text.replace(/\s{2,}/g, " ").trim();
  return text;
}

function uniqueNonEmpty(items: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const rawItem of items) {
    const normalized = normalizeSignalText(rawItem);
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(normalized);
  }
  return result;
}

function toStatementList(entries: unknown[] | null | undefined) {
  if (!entries || entries.length === 0) return [];
  return uniqueNonEmpty(
    entries
      .map((entry) => toUserFacingText(formatModelEntry(entry)))
      .filter((entry) => !hasTechnicalPattern(entry)),
  );
}

function isGapLike(text: string) {
  const value = text.toLowerCase();
  return (
    value.includes("mangler") ||
    value.includes("uklar") ||
    value.includes("usikker") ||
    value.includes("ikke tydelig") ||
    value.includes("ikke afklaret") ||
    value.includes("ikke dokumenteret") ||
    value.includes("kræver") ||
    value.includes("gap") ||
    value.includes("svag")
  );
}

function getInterviewErrorMessage(reasonCode?: InterviewReasonCode) {
  switch (reasonCode) {
    case "LOW_QUALITY_ANSWER":
      return "Svaret er for kort eller uklart til at føre interviewet videre.";
    case "INSUFFICIENT_COVERAGE":
      return "JobPilot kan bruge lidt mere afklaring. Prøv gerne et mere konkret svar.";
    case "RETRY_EXHAUSTED":
    case "OPENAI_REQUEST_FAILED":
      return "JobPilot kunne ikke hente næste spørgsmål lige nu. Prøv igen om et øjeblik.";
    default:
      return "JobPilot kunne ikke hente næste spørgsmål lige nu.";
  }
}

function formatFocusAreaLabel(focusArea: FocusArea) {
  const labels: Record<FocusArea, string> = {
    current_work_reality: "Nuværende arbejde",
    level_seniority: "Ansvar og niveau",
    transferable_strengths: "Overførbare styrker",
    direction_change: "Jobretning",
    work_style_fit: "Arbejdsstil og trivsel",
    mismatch_risk: "Rammer der ikke passer",
  };
  return labels[focusArea] ?? focusArea;
}

type UserFacingSetupProfile = {
  overblik: {
    kortFortalt: string;
    hvadJobpilotSer: string;
    saadanBrugesProfilen: string;
  };
  erfaring: {
    erfaringstekst: string;
    vaerdibidrag: string;
    senereEksempler: string;
  };
  jobretning: {
    retningLigeNu: string;
    pejlemaerke: string;
    naesteAfklaring: string;
  };
  arbejdsprofil: {
    rammerPasserGodt: string;
    arbejdsstil: string;
    rammerPasserMindreGodt: string;
  };
  naesteSkridt: {
    handlinger: [string, string][];
  };
};

function buildUserFacingSetupProfile(input: {
  name: string;
  currentRole: string;
  yearsExperience: string;
  targetDirection: string;
  workStyleFit: string;
  directionOfChange: string;
  strengths: string[];
  communicationSignals: ProfileCommunicationSignals | null;
  readinessLevel: ReadinessAssessment["level"];
  hasProfileModelSignals: boolean;
  userAvoids: string;
}): UserFacingSetupProfile {
  const role = input.currentRole || "din nuværende rolle";
  const experience = input.yearsExperience || "den erfaring du har opbygget";
  const target = input.targetDirection || "en retning, der passer til din erfaring";
  const topStrengths = input.strengths.slice(0, 3);
  const strengthsText = topStrengths.length > 0 ? topStrengths.join(", ") : "overblik, koordinering og samarbejde på tværs";

  const communicationLine =
    input.communicationSignals?.answerStyle === "concise"
      ? "Du formulerer dig kort og direkte, hvilket giver en klar profil med fokus på det vigtigste."
      : "Du giver et godt første billede af, hvordan du arbejder og træffer valg i praksis.";

  const responsibilityLine =
    input.readinessLevel === "minimum_usable"
      ? "Det tyder på, at du trives med tydeligt ansvar og konkrete opgaver."
      : "JobPilot ser tegn på, at du kan skabe fremdrift i roller med ansvar og samarbejde.";

  const avoidLine = input.userAvoids
    ? `Miljøer med ${input.userAvoids.toLowerCase()} passer typisk mindre godt til dine præferencer.`
    : "Miljøer med uklare forventninger eller vedvarende højt pres kan passe mindre godt.";

  return {
    overblik: {
      kortFortalt: `JobPilot ser en profil med erfaring fra ${role.toLowerCase()}, koordinering og samarbejde på tværs.`,
      hvadJobpilotSer: `Din retning peger mod ${target.toLowerCase()}, og din erfaring fra ${experience.toLowerCase()} kan bruges aktivt.`,
      saadanBrugesProfilen: "Profilen kan bruges som et første afsæt til at vurdere relevante jobopslag og målrette dit næste CV-udkast.",
    },
    erfaring: {
      erfaringstekst: `Du kommer med erfaring fra ${role.toLowerCase()} og har arbejdet med ${experience.toLowerCase()}.`,
      vaerdibidrag: "Din erfaring peger især på koordinering, overblik, samarbejde og ansvar for at få opgaver videre i praksis.",
      senereEksempler:
        "Senere kan du tilføje 1-2 konkrete eksempler, hvis du vil gøre CV og ansøgninger mere præcise.",
    },
    jobretning: {
      retningLigeNu: `Din ønskede retning peger mod ${target.toLowerCase()}.`,
      pejlemaerke: "Retningen kan bruges som et første pejlemærke. Når du tilføjer et konkret jobopslag, kan JobPilot teste retningen mere præcist.",
      naesteAfklaring: "Hvis du vil, kan JobPilot senere stille få opfølgende spørgsmål for at gøre retningen skarpere.",
    },
    arbejdsprofil: {
      rammerPasserGodt: "Det tyder på, at du arbejder bedst med tydelige rammer, klar prioritering og samarbejde, hvor ansvar er afstemt.",
      arbejdsstil: `${communicationLine} ${responsibilityLine} JobPilot hjælper med at gøre dine erfaringer tydeligere i CV og ansøgninger.`,
      rammerPasserMindreGodt: avoidLine,
    },
    naesteSkridt: {
      handlinger: [
        ["Tilføj første jobopslag", "Vælg et konkret opslag, så JobPilot kan vurdere fit og prioritere næste handlinger."],
        ["Tilføj 1-2 konkrete eksempler senere", "Beskriv kort en situation med ansvar, samarbejde eller resultat, når det passer dig."],
        ["Brug profilen til CV og ansøgning", "Brug profiludkastet som retning for de vigtigste budskaber i dit materiale."],
        [
          "Svar på få ekstra spørgsmål senere",
          input.hasProfileModelSignals
            ? "Hvis du vil gøre profilen skarpere, kan JobPilot stille et par korte opfølgende spørgsmål."
            : "Du kan altid vende tilbage og gøre profilen endnu mere præcis med få ekstra svar.",
        ],
      ],
    },
  };
}

export function SetupFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [activeProfileTab, setActiveProfileTab] = useState<ProfileTabId>("overblik");
  const [formState, setFormState] = useState<SetupFormState>(initialState);
  const [interviewResult, setInterviewResult] = useState<InterviewResult>({
    status: "idle",
    question: null,
    focusArea: null,
    profileSummary: null,
    readinessAssessment: null,
    profileModel: null,
    hypothesisSummary: null,
    uncertaintySummary: null,
    communicationSignals: null,
  });
  const [interviewAnswer, setInterviewAnswer] = useState("");
  const [interviewErrorMessage, setInterviewErrorMessage] = useState<string | null>(null);
  const [interviewErrorReasonCode, setInterviewErrorReasonCode] = useState<InterviewReasonCode | null>(null);
  const [interviewLastFailureReasonCode, setInterviewLastFailureReasonCode] = useState<InterviewReasonCode | null>(null);
  const [interviewRetryTrail, setInterviewRetryTrail] = useState<InterviewReasonCode[]>([]);
  const [isInterviewLoading, setIsInterviewLoading] = useState(false);
  const [interviewState, setInterviewState] = useState<InterviewState>(emptyInterviewState);

  const current = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const progressValue = useMemo(() => Math.round(((currentStep + 1) / steps.length) * 100), [currentStep]);

  function updateProfile(field: keyof SetupFormState["profile"], value: string) {
    setFormState((previous) => ({ ...previous, profile: { ...previous.profile, [field]: value } }));
  }

  function updatePreferences(field: keyof SetupFormState["preferences"], value: string) {
    setFormState((previous) => ({ ...previous, preferences: { ...previous.preferences, [field]: value } }));
  }

  function goNext() {
    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  }

  function goBack() {
    setCurrentStep((step) => Math.max(step - 1, 0));
  }

  async function requestInterviewTurn(lastAssistantQuestion: string | null, lastUserAnswer: string | null) {
    if (isInterviewLoading) return;
    setIsInterviewLoading(true);
    setInterviewErrorMessage(null);
    setInterviewErrorReasonCode(null);
    setInterviewLastFailureReasonCode(null);
    setInterviewRetryTrail([]);

    try {
      const response = await fetch("/api/onboarding/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phase: "initial",
          profileDraft: {
            name: formState.profile.navn,
            currentRole: formState.profile.nuvaerendeTitel,
            yearsExperience: formState.profile.erfaring,
            targetDirection: formState.preferences.jobtype,
          },
          lastAssistantQuestion,
          lastUserAnswer,
          interviewState,
        }),
      });

      const data = (await response.json()) as
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
            profileModel?: ProfileModel;
            hypothesisSummary?: unknown[];
            uncertaintySummary?: unknown[];
            communicationSignals?: ProfileCommunicationSignals;
          }
        | {
            ok: false;
            error?: string;
            reasonCode?: InterviewReasonCode;
            lastFailureReasonCode?: InterviewReasonCode;
            retryTrail?: InterviewReasonCode[];
          };

      if (!response.ok || !data.ok) {
        const reasonCode = data.ok ? undefined : data.reasonCode;
        const lastFailureReasonCode = data.ok ? undefined : data.lastFailureReasonCode;
        const retryTrail = data.ok ? undefined : data.retryTrail;
        setInterviewErrorMessage(getInterviewErrorMessage(reasonCode));
        setInterviewErrorReasonCode(reasonCode ?? null);
        setInterviewLastFailureReasonCode(lastFailureReasonCode ?? null);
        setInterviewRetryTrail(retryTrail ?? []);
        return;
      }

      if (data.status === "complete") {
        setInterviewState(data.interviewState);
        setInterviewResult({
          status: "complete",
          question: null,
          focusArea: null,
          profileSummary: data.profileSummary,
          readinessAssessment: data.readinessAssessment,
          profileModel: data.profileModel ?? null,
          hypothesisSummary: data.hypothesisSummary ?? null,
          uncertaintySummary: data.uncertaintySummary ?? null,
          communicationSignals: data.communicationSignals ?? data.profileModel?.communicationSignals ?? null,
        });
        setInterviewAnswer("");
        return;
      }

      setInterviewState(data.interviewState);
      setInterviewResult({
        status: "continue",
        question: data.question,
        focusArea: data.focusArea,
        profileSummary: null,
        readinessAssessment: null,
        profileModel: null,
        hypothesisSummary: null,
        uncertaintySummary: null,
        communicationSignals: null,
      });
      setInterviewAnswer("");
    } catch {
      setInterviewErrorMessage(getInterviewErrorMessage("OPENAI_REQUEST_FAILED"));
      setInterviewErrorReasonCode("OPENAI_REQUEST_FAILED");
      setInterviewLastFailureReasonCode(null);
      setInterviewRetryTrail([]);
    } finally {
      setIsInterviewLoading(false);
    }
  }

  async function startInterview() {
    if (isInterviewLoading) return;
    setInterviewErrorMessage(null);
    setInterviewErrorReasonCode(null);
    setInterviewLastFailureReasonCode(null);
    setInterviewRetryTrail([]);
    setInterviewState(emptyInterviewState);
    setInterviewResult({
      status: "idle",
      question: null,
      focusArea: null,
      profileSummary: null,
      readinessAssessment: null,
      profileModel: null,
      hypothesisSummary: null,
      uncertaintySummary: null,
      communicationSignals: null,
    });
    await requestInterviewTurn(null, null);
  }

  async function continueInterview() {
    if (interviewResult.status !== "continue" || isInterviewLoading) return;
    const trimmedAnswer = interviewAnswer.trim();
    if (!trimmedAnswer) {
      setInterviewErrorMessage("Skriv et svar for at fortsætte.");
      setInterviewErrorReasonCode(null);
      setInterviewLastFailureReasonCode(null);
      setInterviewRetryTrail([]);
      return;
    }
    await requestInterviewTurn(interviewResult.question, trimmedAnswer);
  }

  function renderInterviewPanel() {
    return (
      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_14px_30px_rgba(15,23,42,0.05)]">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">AI-interview</p>
        <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">Et kort interview, der gør profilen skarpere</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          JobPilot stiller nogle få opfølgende spørgsmål for at forstå din erfaring, dine styrker, din retning og hvilke rammer du trives bedst i.
        </p>
        <p className="mt-2 text-sm leading-7 text-slate-600">Du behøver ikke svare perfekt. JobPilot hjælper med at få profilen frem.</p>

        {interviewResult.status === "idle" ? (
          <div className="mt-5 rounded-[1.25rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-700">Tryk &quot;Start AI-interview&quot; nederst for at begynde.</p>
          </div>
        ) : null}

        {interviewResult.status === "continue" ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-[1.25rem] border border-cyan-100 bg-cyan-50/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-950">
                Fokusområde: {formatFocusAreaLabel(interviewResult.focusArea)}
              </p>
              <p className="mt-3 text-base leading-7 text-slate-800">{interviewResult.question}</p>
            </div>
            <TextAreaField label="Dit svar" value={interviewAnswer} onChange={setInterviewAnswer} rows={4} />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={continueInterview}
                disabled={isInterviewLoading}
                className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
              >
                {isInterviewLoading ? "Henter næste spørgsmål..." : "Fortsæt"}
              </button>
            </div>
          </div>
        ) : null}

        {interviewResult.status === "complete" ? (
          <div className="mt-6 rounded-[1.25rem] border border-emerald-200 bg-emerald-50 p-5">
            <p className="text-sm leading-7 text-emerald-800">
              Interviewet er gennemført. Gå videre til <strong>Profiloverblik</strong> for at se resultatet.
            </p>
          </div>
        ) : null}

        {interviewErrorMessage ? (
          <div className="mt-6 rounded-[1.25rem] border border-rose-200 bg-rose-50 p-5">
            <p className="text-sm leading-7 text-rose-700">{interviewErrorMessage}</p>
            {process.env.NODE_ENV !== "production" && interviewErrorReasonCode ? (
              <div className="mt-2 space-y-1 text-xs font-medium uppercase tracking-[0.12em] text-rose-500">
                <p>Teknisk kode: {interviewErrorReasonCode}</p>
                {interviewLastFailureReasonCode ? <p>Sidste fejlkode: {interviewLastFailureReasonCode}</p> : null}
                {interviewRetryTrail.length > 0 ? <p>Retry-forløb: {interviewRetryTrail.join(" → ")}</p> : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }

  function renderProfileTabs() {
    if (interviewResult.status !== "complete" || !interviewResult.profileSummary || !interviewResult.readinessAssessment) {
      return (
        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm leading-7 text-slate-700">Profiloverblikket bliver tilgængeligt, når AI-interviewet er gennemført.</p>
        </div>
      );
    }

    const { profileSummary, readinessAssessment, profileModel, communicationSignals } = interviewResult;
    const effectiveCommunicationSignals = communicationSignals ?? profileModel?.communicationSignals ?? null;
    const profileStrengths = uniqueNonEmpty(
      profileSummary.aiProfileCore.transferableStrengths.map(toUserFacingText).filter((item) => !hasTechnicalPattern(item)),
    );
    const hasProfileModelSignals = Boolean(
      (profileModel?.facts?.length ?? 0) > 0 ||
        (profileModel?.interpretations?.length ?? 0) > 0 ||
        (profileModel?.uncertainties?.length ?? 0) > 0 ||
        (profileModel?.hypotheses?.length ?? 0) > 0,
    );

    const displayProfile = buildUserFacingSetupProfile({
      name: formState.profile.navn,
      currentRole: formatMaybeValue(profileSummary.userProfileData.currentRole),
      yearsExperience: formatMaybeValue(profileSummary.userProfileData.yearsExperience),
      targetDirection: formatMaybeValue(profileSummary.userProfileData.targetDirection),
      workStyleFit: toUserFacingText(formatMaybeText(profileSummary.aiProfileCore.workStyleFit)),
      directionOfChange: toUserFacingText(formatMaybeText(profileSummary.aiProfileCore.directionOfChange)),
      strengths: profileStrengths,
      communicationSignals: effectiveCommunicationSignals,
      readinessLevel: readinessAssessment.level,
      hasProfileModelSignals,
      userAvoids: formState.preferences.undgaa,
    });

    const tabContent: Record<ProfileTabId, React.ReactNode> = {
      overblik: (
        <div className="space-y-5">
          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-lg font-semibold tracking-tight text-slate-950">Din første JobPilot-profil</h3>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Her er dit første profiludkast. Det er ikke en endelig vurdering, men JobPilots første forståelse af din erfaring, retning og arbejdsprofil.
              Du kan senere udbygge den med flere eksempler.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <SummaryCard
              title="Kort fortalt"
              items={[
                ["Sådan forstår JobPilot dig", displayProfile.overblik.kortFortalt],
                ["Det JobPilot især ser", displayProfile.overblik.hvadJobpilotSer],
                ["Sådan kan profilen bruges", displayProfile.overblik.saadanBrugesProfilen],
              ]}
            />
            <SummaryCard
              title="Det du kommer med"
              items={[
                ["Nuværende rolle", formatMaybeValue(profileSummary.userProfileData.currentRole)],
                ["Erfaring", formatMaybeValue(profileSummary.userProfileData.yearsExperience)],
                ["Retning lige nu", formatMaybeValue(profileSummary.userProfileData.targetDirection)],
              ]}
            />
          </div>
        </div>
      ),
      erfaring: (
        <div className="grid gap-5 lg:grid-cols-2">
          <SummaryCard
            title="Din erfaring i praksis"
            items={[
              ["Din erfaring", displayProfile.erfaring.erfaringstekst],
              ["Det din erfaring peger på", displayProfile.erfaring.vaerdibidrag],
              ["Hvis du vil gøre profilen skarpere", displayProfile.erfaring.senereEksempler],
            ]}
          />
          <SummaryCard
            title="Sådan kan profilen bruges"
            items={[
              ["I din jobsøgning", "Brug profilen til at prioritere opslag, hvor din erfaring og arbejdsform passer naturligt ind."],
              ["Til CV og ansøgning", "Lad profilen styre, hvilke erfaringer og styrker der skal stå tydeligst i dine materialer."],
              ["I næste dialog med JobPilot", "JobPilot kan bygge videre på samme profil, når du vil gøre den mere præcis."],
            ]}
          />
        </div>
      ),
      jobretning: (
        <div className="grid gap-5 lg:grid-cols-2">
          <SummaryCard
            title="Din retning lige nu"
            items={[
              ["Retning", displayProfile.jobretning.retningLigeNu],
              ["Som pejlemærke", displayProfile.jobretning.pejlemaerke],
              ["Hvis du vil afklare mere", displayProfile.jobretning.naesteAfklaring],
            ]}
          />
          <SummaryCard
            title="Sådan bruger du retningen"
            items={[
              ["Kort fortalt", "Retningen er et godt startpunkt for de første job, du vil afprøve."],
              ["I praksis", "Vælg et jobopslag og lad JobPilot vurdere, hvordan din profil matcher rollen."],
              ["Videre herfra", "Du kan altid justere retningen, når du får nye erfaringer eller bliver mere afklaret."],
            ]}
          />
        </div>
      ),
      arbejdsprofil: (
        <div className="grid gap-5 lg:grid-cols-2">
          <SummaryCard
            title="Rammer der passer godt"
            items={[
              ["Kort fortalt", displayProfile.arbejdsprofil.rammerPasserGodt],
              ["Din arbejdsstil", displayProfile.arbejdsprofil.arbejdsstil],
              ["Ansvar og tempo", "JobPilot ser tegn på, at du trives bedst, når ansvar, forventninger og samarbejde er tydeligt afstemt."],
            ]}
          />
          <SummaryCard
            title="Rammer der passer mindre godt"
            items={[
              ["Miljø og samarbejde", displayProfile.arbejdsprofil.rammerPasserMindreGodt],
              ["Kommunikation", "Det tyder på, at du foretrækker klar kommunikation og tydelige prioriteringer."],
              ["I praksis", "Roller med varigt uklare mål eller uforudsigelige rammer kan være mindre attraktive for dig."],
            ]}
          />
        </div>
      ),
      "naeste-skridt": (
        <SummaryCard
          title="Næste bedste skridt"
          items={displayProfile.naesteSkridt.handlinger}
        />
      ),
    };

    return (
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2 rounded-[1.25rem] border border-slate-200 bg-slate-50 p-3">
          {profileTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveProfileTab(tab.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeProfileTab === tab.id ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {tabContent[activeProfileTab]}
      </div>
    );
  }

  function renderStep() {
    switch (current.id) {
      case "start":
        return (
          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-cyan-100 bg-cyan-50/80 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-950">Sådan foregår det</p>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">
                Vi starter med hurtige basisoplysninger og dit CV, fortsætter med et kort interview og slutter med et personligt profiludkast.
              </p>
            </div>
          </div>
        );
      case "basisoplysninger":
        return (
          <div className="space-y-5">
            <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm leading-7 text-slate-700">
                Kun det vigtigste lige nu. Du kan altid justere og udbygge profilen senere.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Navn" value={formState.profile.navn} onChange={(value) => updateProfile("navn", value)} />
              <FormField
                label="Nuværende titel"
                value={formState.profile.nuvaerendeTitel}
                onChange={(value) => updateProfile("nuvaerendeTitel", value)}
              />
              <FormField label="Lokation" value={formState.profile.lokation} onChange={(value) => updateProfile("lokation", value)} />
              <FormField
                label="Overordnet jobretning"
                value={formState.preferences.jobtype}
                onChange={(value) => updatePreferences("jobtype", value)}
              />
              <TextAreaField
                label="Kort om erfaring"
                value={formState.profile.erfaring}
                onChange={(value) => updateProfile("erfaring", value)}
                className="md:col-span-2"
                rows={3}
              />
              <TextAreaField
                label="Uddannelse og kurser"
                value={formState.profile.uddannelse}
                onChange={(value) => updateProfile("uddannelse", value)}
                className="md:col-span-2"
                rows={3}
              />
            </div>
          </div>
        );
      case "dokumenter":
        return (
          <div className="space-y-6">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-lg font-semibold tracking-tight text-slate-950">CV er centralt i JobPilot</h3>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                JobPilot bruger CV’et som primær faktakilde til erfaring, roller og uddannelse. I den rigtige produktflow er CV-upload derfor obligatorisk.
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                Har du ikke et CV endnu, kan du lave et enkelt dokument med de vigtigste oplysninger. Senere kan vi også støtte en formular-baseret CV-opbygning direkte i JobPilot.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <SummaryCard
                title="Har du ikke et CV?"
                items={[
                  ["Forslag", "Lav et enkelt dokument med dine vigtigste oplysninger og upload det som midlertidigt CV."],
                  ["Accepterede formater", "PDF, Word, Google Docs (eksporteret), OpenOffice/LibreOffice (eksporteret) eller enkel tekstfil."],
                ]}
              />
              <SummaryCard
                title="Minimumsindhold i dokumentet"
                items={[
                  ["Kontakt og navn", "Navn og kontaktoplysninger"],
                  ["Erfaring", "Nuværende/seneste rolle, tidligere roller og kerneansvar"],
                  ["Baggrund", "Uddannelse/kurser samt vigtige resultater eller projekter"],
                  ["Retning", "Jobretning hvis du kender den"],
                ]}
              />
            </div>

            <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-6 sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Uploadområde</p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">Del dine vigtigste dokumenter</h3>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormState((previous) => ({
                      ...previous,
                      documentsSkipped: !previous.documentsSkipped,
                    }))
                  }
                  className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                >
                  {formState.documentsSkipped ? "Fortsæt med dokumenter" : "Spring over i denne demo"}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {mockUploadedFiles.map((file) => (
                <div key={file.name} className="rounded-[1.25rem] border border-slate-200/70 bg-white p-4">
                  <p className="font-semibold text-slate-950">{file.name}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {file.type} • {file.size} • {file.uploadedAt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      case "ai-interview":
        return renderInterviewPanel();
      case "profiloverblik":
        return (
          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-cyan-100 bg-cyan-50/80 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-950">Profiloverblik</p>
              <p className="mt-4 text-base leading-8 text-slate-700">
                Her ser du dit første personlige profiludkast. Fokus er på, hvordan JobPilot forstår dig og hvad der vil styrke profilen i næste trin.
              </p>
            </div>
            {renderProfileTabs()}
          </div>
        );
      case "klar":
        return (
          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-cyan-100 bg-cyan-50/80 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-950">Klar til næste fase</p>
              <p className="mt-4 text-base leading-8 text-slate-700">
                Dit første profiludkast er klar. Nu kan du gå videre med jobvurdering og næste konkrete handlinger.
              </p>
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              <SummaryCard
                title="Status i setup"
                items={[
                  ["Basisoplysninger", "Klar"],
                  ["CV og dokumenter", formState.documentsSkipped ? "Mangler CV (demo: sprunget over)" : "Registreret"],
                  ["Interview", interviewResult.status === "complete" ? "Gennemført" : "Afventer"],
                  ["Profil", interviewResult.status === "complete" ? "Første udkast klar" : "Afventer interview"],
                ]}
              />
              <SummaryCard
                title="Næste handlinger"
                items={[
                  ["Gå til min profil", "Se den samlede profil og senere den tekniske profil under avanceret visning."],
                  ["Tilføj første jobopslag", "Brug et konkret opslag til at teste fit og prioritering."],
                  ["Gå til dashboard", "Brug dashboardet som fast startpunkt i din jobsøgning."],
                ]}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex h-11 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Gå til min profil
              </button>
              <button
                type="button"
                className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Tilføj første jobopslag
              </button>
              <button
                type="button"
                className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Gå til dashboard
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  const isProfileStepLocked = current.id === "profiloverblik" && interviewResult.status !== "complete";

  return (
    <section className="space-y-4">
      <div className="rounded-[1.25rem] border border-white/80 bg-white/85 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Setup-flow</p>
          <p className="text-sm text-slate-500">{progressValue}%</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {steps.map((step, index) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setCurrentStep(index)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                index === currentStep
                  ? "bg-slate-900 text-white"
                  : index < currentStep
                    ? "bg-cyan-100 text-cyan-900"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {step.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/80 bg-white/85 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8 lg:p-10">
        <div className="flex flex-col gap-5 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              {current.eyebrow} • {current.label}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{current.title}</h2>
          </div>
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Gem og fortsæt senere
          </button>
        </div>

        <div className="py-8">{renderStep()}</div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={isFirstStep}
            className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
          >
            Tilbage
          </button>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Gem og fortsæt senere
            </button>
            {!isLastStep || current.id === "ai-interview" ? (
              <button
                type="button"
                onClick={current.id === "ai-interview" && interviewResult.status === "idle" ? startInterview : goNext}
                disabled={isInterviewLoading || isProfileStepLocked}
                className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
              >
                {current.id === "ai-interview" && interviewResult.status === "idle"
                  ? isInterviewLoading
                    ? "Starter..."
                    : "Start AI-interview"
                  : "Næste"}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function FieldWrapper({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function FormField({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <FieldWrapper label={label} className={className}>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
      />
    </FieldWrapper>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
  className?: string;
}) {
  return (
    <FieldWrapper label={label} className={className}>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
      />
    </FieldWrapper>
  );
}

function SummaryCard({
  title,
  items,
}: {
  title: string;
  items: [string, string][];
}) {
  return (
    <article className="rounded-[1rem] border border-slate-200/80 bg-slate-50/80 p-6">
      <h3 className="text-lg font-semibold tracking-tight text-slate-950">{title}</h3>
      <dl className="mt-5 space-y-4">
        {items.map(([label, value]) => (
          <div key={`${title}-${label}`} className="border-b border-slate-200 pb-4 last:border-b-0 last:pb-0">
            <dt className="text-sm font-medium text-slate-500">{label}</dt>
            <dd className="mt-2 text-sm leading-7 text-slate-700">{value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
