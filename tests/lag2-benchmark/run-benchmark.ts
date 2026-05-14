// Benchmark: compare claude-haiku-4-5-20251001 vs claude-sonnet-4-6 for Lag 2 AI analysis
// Requires: ANTHROPIC_API_KEY in .env.local or environment

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { interviewScenarios } from "../interview-scenarios/scenarios";
import type { InterviewScenario } from "../interview-scenarios/scenarios";

// ── env ───────────────────────────────────────────────────────────────────────

function loadLocalEnv() {
  const envPath = join(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (!process.env[key]) process.env[key] = rest.join("=").trim().replace(/^["']|["']$/g, "");
  }
}
loadLocalEnv();

// ── config ────────────────────────────────────────────────────────────────────

const TARGET_IDS = [
  "senior-less-responsibility",
  "project-manager-to-product-manager",
  "passion-strong-craftsperson",
] as const;

const MODELS = ["claude-haiku-4-5-20251001", "claude-sonnet-4-6"] as const;
type ModelId = (typeof MODELS)[number];

const PRICING: Record<ModelId, { input: number; output: number }> = {
  "claude-haiku-4-5-20251001": { input: 0.00025, output: 0.00125 },
  "claude-sonnet-4-6": { input: 0.003, output: 0.015 },
};

// ── targetKind inference (mirrors inferTargetProfileKind in route.ts) ─────────

type TargetKind =
  | "same_track"
  | "same_track_better_conditions"
  | "next_level"
  | "direction_change"
  | "product_transition"
  | "unclear"
  | "less_responsibility"
  | "specialist_track";

function inferTargetKind(scenario: InterviewScenario): TargetKind {
  const t = (scenario.profileDraft.targetDirection ?? "").toLowerCase();
  const r = (scenario.profileDraft.currentRole ?? "").toLowerCase();
  if (["ved ikke", "usikker", "ikke helt hvad", "afklare"].some((k) => t.includes(k))) return "unclear";
  if (["mindre ansvar", "lavere pres", "bedre balance", "uden topansvar", "roligere"].some((k) => t.includes(k))) return "less_responsibility";
  if (["product manager", "product owner"].some((k) => t.includes(k)) && ["projekt", "project"].some((k) => r.includes(k))) return "product_transition";
  if (["specialist", "faglig ekspert"].some((k) => t.includes(k) || r.includes(k))) return "specialist_track";
  if (scenario.intendedDirectionType === "same_track_better_conditions") return "same_track_better_conditions";
  if (scenario.intendedDirectionType === "direction_change") return "direction_change";
  if (scenario.intendedDirectionType === "next_level") return "next_level";
  if (scenario.intendedDirectionType === "same_track") return "same_track";
  return "unclear";
}

// ── mock context ──────────────────────────────────────────────────────────────

type AuthSignals = { passionIndicators: string[]; valueAnchors: string[]; authenticVoiceMarkers: string[] };
type CommSignals = { answerStyle: string; structureLevel: string; evidenceDensity: string; possibleSelfMinimizingLanguage: boolean; possibleOverlongExplanations: boolean };

const AUTHENTICITY_SIGNALS: Record<string, AuthSignals> = {
  "senior-less-responsibility": {
    passionIndicators: [],
    valueAnchors: ["bedre balance og roligere rammer", "ikke øverste ansvarlige for store programmer"],
    authenticVoiceMarkers: ["Jeg vil ikke længere opad", "vil bruge min erfaring men med mindre pres og færre eskaleringer"],
  },
  "project-manager-to-product-manager": {
    passionIndicators: ["vil gerne mod Product Manager i en realistisk overgang"],
    valueAnchors: ["realistisk overgang", "bruge koordineringserfaring fra projektledelse"],
    authenticVoiceMarkers: ["Jeg har ikke haft formelt roadmap-ejerskab"],
  },
  "passion-strong-craftsperson": {
    passionIndicators: [
      "Restaurering er ikke bare et job for mig — det er noget jeg virkelig tror på",
      "elsker arbejdet med fredede og historiske bygninger",
      "brænder for at bevare gammelt håndværk og originale materialer",
    ],
    valueAnchors: [
      "kvalitet frem for hastighed",
      "vil ikke acceptere pladser der bare vil have det billigste og hurtigste",
    ],
    authenticVoiceMarkers: [
      "Det er det jeg er god til og det jeg vil have mere af",
      "Det betød noget — bygningen vil stå i hundrede år",
    ],
  },
};

const COMMUNICATION_SIGNALS: Record<string, CommSignals> = {
  "senior-less-responsibility": {
    answerStyle: "balanced",
    structureLevel: "high",
    evidenceDensity: "medium",
    possibleSelfMinimizingLanguage: false,
    possibleOverlongExplanations: false,
  },
  "project-manager-to-product-manager": {
    answerStyle: "balanced",
    structureLevel: "medium",
    evidenceDensity: "medium",
    possibleSelfMinimizingLanguage: true,
    possibleOverlongExplanations: false,
  },
  "passion-strong-craftsperson": {
    answerStyle: "detailed",
    structureLevel: "medium",
    evidenceDensity: "high",
    possibleSelfMinimizingLanguage: false,
    possibleOverlongExplanations: true,
  },
};

const DEFAULT_AUTH: AuthSignals = { passionIndicators: [], valueAnchors: [], authenticVoiceMarkers: [] };
const DEFAULT_COMM: CommSignals = { answerStyle: "balanced", structureLevel: "medium", evidenceDensity: "medium", possibleSelfMinimizingLanguage: false, possibleOverlongExplanations: false };

function buildUserContent(scenario: InterviewScenario, targetKind: TargetKind): string {
  const auth = AUTHENTICITY_SIGNALS[scenario.id] ?? DEFAULT_AUTH;
  const comm = COMMUNICATION_SIGNALS[scenario.id] ?? DEFAULT_COMM;

  const facts = [
    { key: "current_role", statement: `Arbejder som ${scenario.profileDraft.currentRole}`, evidenceLevel: "explicit", sources: ["profile_draft"] },
    { key: "target_direction", statement: `Ønsket retning: ${scenario.profileDraft.targetDirection}`, evidenceLevel: "explicit", sources: ["profile_draft"] },
    { key: "experience", statement: scenario.profileDraft.yearsExperience, evidenceLevel: "explicit", sources: ["profile_draft"] },
    { key: "interview_default", statement: scenario.scriptedAnswers.default, evidenceLevel: "supported", sources: ["interview_answers"] },
    ...Object.entries(scenario.scriptedAnswers.byFamily ?? {}).slice(0, 4).map(([, answer], i) => ({
      key: `interview_answer_${i + 2}`,
      statement: answer,
      evidenceLevel: "supported",
      sources: ["interview_answers"],
    })),
  ];

  const recentQuestions = [
    { question: "Hvad er din nuværende hverdag i rollen?", focusArea: "current_work_reality" },
    { question: "Hvad ønsker du anderledes i næste rolle?", focusArea: "mismatch_risk" },
    { question: "Kan du give et konkret eksempel på et resultat du er stolt af?", focusArea: "current_work_reality" },
    { question: "Hvad er dit klare nej til i næste job?", focusArea: "mismatch_risk" },
  ];

  return JSON.stringify({
    targetKind,
    profileDraft: {
      currentRole: scenario.profileDraft.currentRole ?? null,
      targetDirection: scenario.profileDraft.targetDirection ?? null,
      yearsExperience: scenario.profileDraft.yearsExperience ?? null,
    },
    communicationSignals: comm,
    authenticitySignals: auth,
    evidenceCounts: {
      concreteEvidenceCount: 3,
      ownershipScopeCount: 2,
      resultEvidenceCount: 2,
      noGoClarityCount: 2,
      profileStrengthGapCount: 1,
      productOwnershipEvidenceCount: scenario.id === "project-manager-to-product-manager" ? 1 : 0,
    },
    interviewCoverage: {
      currentWorkReality: true, levelSeniority: true, transferableStrengths: true,
      directionOfChange: true, workStyleFit: true, mismatchRisk: true,
      evidenceDepth: true, concreteEvidence: true, ownershipScope: true,
      resultEvidence: true, motivationFit: true, domainContext: false,
      noGoClarity: true, profileStrengthGap: false,
    },
    answeredTurns: 4,
    recentQuestions,
    facts,
    interpretations: [],
    hypotheses: [],
    uncertainties: [],
    profileSummaryCore: null,
  });
}

// ── system prompt (verbatim copy from buildAICompletionAnalysis in route.ts) ──

const SYSTEM_PROMPT = `Du er JobPilots Lag 2-profileringssystem — del af et AI-drevet ekspertpanel der analyserer jobsøgere.

KRITISKE REGLER DU ALDRIG MÅ BRYDE:
- Antag ALDRIG at brugeren vil have mere ansvar eller højere titel medmindre der er eksplicit evidens
- Respekter ALTID brugerens erklærede retning — hvis brugeren vil skifte retning, støt det
- Hvis targetKind er 'less_responsibility' → ambitionProfile SKAL være 'less_responsibility'

VIGTIGT om less_responsibility:
Hvis targetKind er 'less_responsibility' betyder det at brugeren AKTIVT har valgt at gå ned i ansvar. Det er ikke en midlertidig tilstand. Det er ikke noget du skal rette.
Du må IKKE:
- Foreslå at brugeren søger lederstillinger
- Antyde at brugeren er overkvalificeret til sin ønskede rolle
- Anbefale karriereudvikling opad
- Bruge ord som 'potentiale' eller 'muligheder' der antyder mere ansvar
Du SKAL:
- Respektere valget fuldt ud
- Fokusere på hvad der gør den ønskede rolle god for brugeren
- Anerkende at mindre ansvar kan være et bevidst og klogt valg

- Hvis targetKind er 'same_track' → ambitionProfile SKAL være 'better_conditions'
- Hvis targetKind er 'specialist_track' → naturalTeamRole SKAL være 'specialist'
- Hvis targetKind er 'direction_change' eller 'product_transition' → ambitionProfile SKAL være 'lateral' og du SKAL anerkende og støtte transitionen
- Returner ALDRIG 'unclear' hvis targetKind er known
- Returner ALDRIG generiske sætninger der passer til alle brugere
- MÅ IKKE afvise eller modvirke en transition brugeren selv har valgt
- Returner ALDRIG 'chemistry_and_fit' som default recruitmentLogic — KUN til startup/kultur-stillinger med eksplicit evidens
- Returner ALDRIG identiske communicationProfile-svar til alle brugere — basér UDELUKKENDE på de faktiske communicationSignals

VIGTIGT: targetKind er det vigtigste signal i analysen. Map direkte fra targetKind — lad det aldrig overrides af andre signaler medmindre targetKind selv er 'unclear'.

FELTSPECIFIKKE REGLER:

ambitionProfile — map DIREKTE fra targetKind — ingen undtagelse, ingen fortolkning:
  next_level → 'upward'
  less_responsibility → 'less_responsibility'
  same_track → 'better_conditions'
  same_track_better_conditions → 'better_conditions'
  direction_change → 'lateral'
  product_transition → 'lateral'
  specialist_track → 'lateral'
  unclear → brug evidens fra svarene, men præfer en konkret værdi frem for 'unclear'

naturalTeamRole — map fra targetKind og signaler:
  specialist_track → ALTID 'specialist'
  next_level med ledelsesindikator (leder/chef/head of i currentRole eller targetDirection) → 'initiator'
  tværgående koordination eller projektledelse-signaler → 'coordinator'
  same_track/same_track_better_conditions uden ledelse → 'executor'
  Returner IKKE 'unclear' hvis targetKind er known — vælg nærmest passende

workIntensityPreference — map fra targetKind:
  less_responsibility / same_track / same_track_better_conditions → 'steady'
  next_level uden burnout-signaler → 'high'
  direction_change / product_transition / specialist_track → 'moderate'
  Returner IKKE 'unclear' hvis targetKind er known — vælg nærmest passende

recruitmentLogic — map fra targetKind:
  same_track / same_track_better_conditions → 'cv_and_experience'
  next_level med ledelseserfaring → 'documented_results'
  specialist_track → 'academic_and_structured'
  service/salg/hr/relationer i currentRole eller targetDirection → 'personality_and_culture'
  Returner ALDRIG 'chemistry_and_fit' som default — KUN til startup/stærk kultur-fit med eksplicit signal i svarene

communicationProfile:
  Basér UDELUKKENDE på communicationSignals i inputtet:
    selfPromotionComfort: 'undersells' hvis possibleSelfMinimizingLanguage=true, 'balanced' ellers
    languageNormalization: 'minimizes' hvis korte/beskedne svar, 'overstates' hvis grandiøse påstande uden belæg, 'neutral' ellers
    credibilityInConversation: 'strong' hvis høj evidenceDensity og strukturerede svar, 'weak' hvis lav evidenceDensity, 'moderate' ellers
  Identisk svar til alle brugere er en fejl — tilpas til DENNE brugers specifikke signaler

authenticityProfile:
  Brug authenticitySignals direkte — kopier indholdet præcist
  Hvis passionIndicators ikke er tom → dominantPassions SKAL indeholde dem (maks 3)
  Hvis valueAnchors ikke er tom → coreValueAnchors SKAL indeholde dem (maks 3)
  Hvis authenticVoiceMarkers ikke er tom → naturalVoiceMarkers SKAL indeholde dem (maks 5)
  authenticityConfidence: 'high' hvis passionIndicators.length >= 3 OG valueAnchors.length >= 2
  authenticityConfidence: 'medium' hvis passionIndicators.length >= 1 ELLER valueAnchors.length >= 1
  authenticityConfidence: 'low' KUN hvis begge er tomme

PÅKRÆVET JSON-SCHEMA — returner præcist dette format via tool analyze_profile_completion:
{
  "communicationStyle": { "answerLength": "short"|"medium"|"narrative", "abstractionLevel": "concrete"|"conceptual", "selfReferences": "active_i"|"distancing_we", "tone": "direct"|"exploratory" },
  "recruitmentFit": { "communicationStyleMatchToRecruitmentExpectations": "<dansk streng specifik til denne bruger>", "likelyUnderseller": true|false },
  "strengthGaps": { "explicitlyMentionedStrengths": ["<dansk>"], "implicitStrengthsFromExamples": ["<dansk>"], "discrepancyConfidence": "medium"|"low" },
  "energyMap": { "energizers": ["<dansk>"], "drainers": ["<dansk>"] },
  "credibilitySignals": { "consistency": "high"|"medium"|"low", "identifiedContradictions": ["<dansk>"], "claimsWithoutSupportingEvidence": ["<dansk>"] },
  "recruitmentLogic": { "type": "cv_and_experience"|"portfolio_and_proof"|"personality_and_culture"|"chemistry_and_fit"|"documented_results"|"academic_and_structured", "confidence": "high"|"medium"|"low" },
  "behaviorProfile": { "behaviorUnderPressure": "problem_solver"|"withdraws"|"seeks_support"|"takes_control"|"unclear", "naturalTeamRole": "initiator"|"executor"|"coordinator"|"specialist"|"unclear", "decisionStyle": "analytical"|"intuitive"|"consensus_seeking"|"action_oriented", "ambitionProfile": "upward"|"lateral"|"less_responsibility"|"better_conditions"|"unclear", "selfImageGap": { "likelySeverity": "low"|"medium"|"high", "signals": ["<dansk>"] } },
  "lifestyleProfile": { "workIntensityPreference": "high"|"moderate"|"steady"|"unclear", "flexibilityNeeds": { "workLocation": "remote"|"hybrid"|"onsite"|"unclear", "scheduleFlexibility": "high"|"moderate"|"low"|"unclear" }, "lifestyleFit": "good_fit"|"potential_mismatch"|"unclear", "sustainabilityRisk": "low"|"medium"|"high" },
  "evidenceProfile": { "evidenceClassification": [{ "strength": "<dansk>", "classification": "user_claim"|"concrete_example"|"proven_responsibility"|"measurable_result"|"pattern" }], "evidenceStrengthVsGoal": "sufficient"|"borderline"|"insufficient", "transferableStrengths": ["<dansk>"] },
  "communicationProfile": { "selfPromotionComfort": "undersells"|"balanced"|"oversells", "recruitmentFormatVulnerabilities": ["structured_competency"|"case_interview"|"presentation"|"small_talk"|"none_identified"], "credibilityInConversation": "strong"|"moderate"|"weak", "languageNormalization": "minimizes"|"neutral"|"overstates" },
  "hiddenStrengths": ["<dansk>"],
  "energyConditions": { "peaksAt": ["<dansk>"], "strugglesAt": ["<dansk>"] },
  "interviewReadiness": { "overall": "ready"|"needs_preparation"|"significant_gaps", "vulnerabilities": ["<dansk>"] },
  "authenticityProfile": { "dominantPassions": ["<dansk — fra passionIndicators>"], "coreValueAnchors": ["<dansk — fra valueAnchors>"], "naturalVoiceMarkers": ["<dansk — fra authenticVoiceMarkers>"], "authenticityConfidence": "high"|"medium"|"low" }
}

Alle string-værdier returneres på dansk. Du returnerer altid det præcise JSON-format defineret i værktøjet — intet andet.`;

// ── tool schema (verbatim copy from buildAICompletionAnalysis in route.ts) ────

const TOOL_SCHEMA = {
  name: "analyze_profile_completion",
  description: "Returner struktureret profilanalyse for alle fem dimensioner og kapaciteter.",
  input_schema: {
    type: "object",
    required: ["communicationStyle", "recruitmentFit", "strengthGaps", "energyMap", "credibilitySignals", "recruitmentLogic", "behaviorProfile", "lifestyleProfile", "evidenceProfile", "communicationProfile", "hiddenStrengths", "energyConditions", "interviewReadiness", "authenticityProfile"],
    properties: {
      communicationStyle: {
        type: "object",
        required: ["answerLength", "abstractionLevel", "selfReferences", "tone"],
        properties: {
          answerLength: { type: "string", enum: ["short", "medium", "narrative"] },
          abstractionLevel: { type: "string", enum: ["concrete", "conceptual"] },
          selfReferences: { type: "string", enum: ["active_i", "distancing_we"] },
          tone: { type: "string", enum: ["direct", "exploratory"] },
        },
      },
      recruitmentFit: {
        type: "object",
        required: ["communicationStyleMatchToRecruitmentExpectations", "likelyUnderseller"],
        properties: {
          communicationStyleMatchToRecruitmentExpectations: { type: "string" },
          likelyUnderseller: { type: ["boolean", "string"] },
        },
      },
      strengthGaps: {
        type: "object",
        required: ["explicitlyMentionedStrengths", "implicitStrengthsFromExamples", "discrepancyConfidence"],
        properties: {
          explicitlyMentionedStrengths: { type: "array", items: { type: "string" } },
          implicitStrengthsFromExamples: { type: "array", items: { type: "string" } },
          discrepancyConfidence: { type: "string", enum: ["medium", "low"] },
        },
      },
      energyMap: {
        type: "object",
        required: ["energizers", "drainers"],
        properties: {
          energizers: { type: "array", items: { type: "string" } },
          drainers: { type: "array", items: { type: "string" } },
        },
      },
      credibilitySignals: {
        type: "object",
        required: ["consistency", "identifiedContradictions", "claimsWithoutSupportingEvidence"],
        properties: {
          consistency: { type: "string", enum: ["high", "medium", "low"] },
          identifiedContradictions: { type: "array", items: { type: "string" } },
          claimsWithoutSupportingEvidence: { type: "array", items: { type: "string" } },
          contradictionMarkers: { type: "array", items: { type: "string" } },
          evidenceVsClaimsGap: { type: "string", enum: ["significant", "moderate", "minimal"] },
          emotionalLoad: { type: "string", enum: ["high", "moderate", "low"] },
        },
      },
      recruitmentLogic: {
        type: "object",
        required: ["type", "confidence"],
        properties: {
          type: { type: "string", enum: ["chemistry_and_fit", "cv_and_experience", "documented_results", "personality_and_culture", "academic_and_structured"] },
          confidence: { type: "string", enum: ["high", "medium", "low"] },
        },
      },
      behaviorProfile: {
        type: "object",
        required: ["behaviorUnderPressure", "naturalTeamRole", "decisionStyle", "ambitionProfile", "selfImageGap"],
        properties: {
          behaviorUnderPressure: { type: "string", enum: ["problem_solver", "withdraws", "seeks_support", "takes_control", "unclear"] },
          naturalTeamRole: { type: "string", enum: ["initiator", "executor", "coordinator", "specialist", "unclear"] },
          decisionStyle: { type: "string", enum: ["analytical", "intuitive", "consensus_seeking", "action_oriented"] },
          ambitionProfile: { type: "string", enum: ["upward", "lateral", "less_responsibility", "better_conditions", "unclear"] },
          selfImageGap: {
            type: "object",
            required: ["likelySeverity", "signals"],
            properties: {
              likelySeverity: { type: "string", enum: ["low", "medium", "high"] },
              signals: { type: "array", items: { type: "string" } },
            },
          },
        },
      },
      lifestyleProfile: {
        type: "object",
        required: ["workIntensityPreference", "flexibilityNeeds", "lifestyleFit", "sustainabilityRisk"],
        properties: {
          workIntensityPreference: { type: "string", enum: ["high", "moderate", "steady", "unclear"] },
          flexibilityNeeds: {
            type: "object",
            required: ["workLocation", "scheduleFlexibility"],
            properties: {
              workLocation: { type: "string", enum: ["remote", "hybrid", "onsite", "unclear"] },
              scheduleFlexibility: { type: "string", enum: ["high", "moderate", "low", "unclear"] },
            },
          },
          lifestyleFit: { type: "string", enum: ["good_fit", "potential_mismatch", "unclear"] },
          sustainabilityRisk: { type: "string", enum: ["low", "medium", "high"] },
          workloadHistory: { type: "string", enum: ["high", "moderate", "low", "unclear"] },
          economicConstraints: { type: "array", items: { type: "string" } },
        },
      },
      evidenceProfile: {
        type: "object",
        required: ["evidenceClassification", "evidenceStrengthVsGoal", "transferableStrengths"],
        properties: {
          evidenceClassification: {
            type: "array",
            items: {
              type: "object",
              required: ["strength", "classification"],
              properties: {
                strength: { type: "string" },
                classification: { type: "string", enum: ["user_claim", "concrete_example", "proven_responsibility", "measurable_result", "pattern"] },
              },
            },
          },
          evidenceStrengthVsGoal: { type: "string", enum: ["sufficient", "borderline", "insufficient"] },
          transferableStrengths: { type: "array", items: { type: "string" } },
        },
      },
      communicationProfile: {
        type: "object",
        required: ["selfPromotionComfort", "recruitmentFormatVulnerabilities", "credibilityInConversation", "languageNormalization"],
        properties: {
          selfPromotionComfort: { type: "string", enum: ["undersells", "balanced", "oversells"] },
          recruitmentFormatVulnerabilities: { type: "array", items: { type: "string", enum: ["structured_competency", "case_interview", "presentation", "small_talk", "none_identified"] } },
          credibilityInConversation: { type: "string", enum: ["strong", "moderate", "weak"] },
          languageNormalization: { type: "string", enum: ["minimizes", "neutral", "overstates"] },
        },
      },
      hiddenStrengths: { type: "array", items: { type: "string" } },
      energyConditions: {
        type: "object",
        required: ["peaksAt", "strugglesAt"],
        properties: {
          peaksAt: { type: "array", items: { type: "string" } },
          strugglesAt: { type: "array", items: { type: "string" } },
        },
      },
      interviewReadiness: {
        type: "object",
        required: ["overall", "vulnerabilities"],
        properties: {
          overall: { type: "string", enum: ["ready", "needs_preparation", "significant_gaps"] },
          vulnerabilities: { type: "array", items: { type: "string" } },
          criticalRecommendations: { type: "array", items: { type: "string" } },
        },
      },
      authenticityProfile: {
        type: "object",
        required: ["dominantPassions", "coreValueAnchors", "naturalVoiceMarkers", "authenticityConfidence"],
        properties: {
          dominantPassions: { type: "array", items: { type: "string" } },
          coreValueAnchors: { type: "array", items: { type: "string" } },
          naturalVoiceMarkers: { type: "array", items: { type: "string" } },
          authenticityConfidence: { type: "string", enum: ["high", "medium", "low"] },
        },
      },
    },
  },
};

// ── API call ──────────────────────────────────────────────────────────────────

type ApiResult = {
  result: Record<string, unknown>;
  inputTokens: number;
  outputTokens: number;
  elapsedMs: number;
};

async function callApi(model: ModelId, userContent: string): Promise<ApiResult | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const t0 = Date.now();
  try {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 3000,
        system: SYSTEM_PROMPT,
        tools: [TOOL_SCHEMA],
        tool_choice: { type: "tool", name: "analyze_profile_completion" },
        messages: [{ role: "user", content: userContent }],
      }),
    });

    if (!resp.ok) {
      const body = await resp.text();
      console.error(`  [API error ${resp.status}] ${body.slice(0, 200)}`);
      return null;
    }

    const data = (await resp.json()) as {
      content?: { type: string; name?: string; input?: unknown }[];
      usage?: { input_tokens: number; output_tokens: number };
    };

    const toolBlock = data.content?.find((c) => c.type === "tool_use" && c.name === "analyze_profile_completion");
    if (!toolBlock?.input) return null;

    return {
      result: toolBlock.input as Record<string, unknown>,
      inputTokens: data.usage?.input_tokens ?? 0,
      outputTokens: data.usage?.output_tokens ?? 0,
      elapsedMs: Date.now() - t0,
    };
  } catch (err) {
    console.error(`  [fetch error] ${err instanceof Error ? err.message : String(err)}`);
    return null;
  }
}

// ── scoring ───────────────────────────────────────────────────────────────────

type ScoreBreakdown = {
  ambitionNotUnclear: boolean;    // 1 pt
  teamRoleNotUnclear: boolean;    // 1 pt
  intensityNotUnclear: boolean;   // 1 pt
  authenticityNotLow: boolean;    // 1 pt (passion scenario only; always true for others)
  noIntentionViolation: boolean;  // 2 pt
  recruitmentLogicCorrect: boolean; // 1 pt (senior-less-responsibility only; always true for others)
  total: number;                  // max 7
  violations: string[];
};

function scoreResult(scenario: InterviewScenario, result: Record<string, unknown>): ScoreBreakdown {
  const bp = result.behaviorProfile as { ambitionProfile?: string; naturalTeamRole?: string } | undefined;
  const lp = result.lifestyleProfile as { workIntensityPreference?: string } | undefined;
  const ap = result.authenticityProfile as { authenticityConfidence?: string } | undefined;
  const rl = result.recruitmentLogic as { type?: string } | undefined;

  const ambitionNotUnclear = bp?.ambitionProfile !== "unclear";
  const teamRoleNotUnclear = bp?.naturalTeamRole !== "unclear";
  const intensityNotUnclear = lp?.workIntensityPreference !== "unclear";

  const authenticityNotLow =
    scenario.id === "passion-strong-craftsperson" ? ap?.authenticityConfidence !== "low" : true;

  let intentionViolation = false;
  if (scenario.id === "senior-less-responsibility") {
    intentionViolation = bp?.ambitionProfile === "upward";
  } else if (scenario.id === "project-manager-to-product-manager") {
    intentionViolation = bp?.ambitionProfile !== "lateral";
  }
  const noIntentionViolation = !intentionViolation;

  const recruitmentLogicCorrect =
    scenario.id === "senior-less-responsibility" ? rl?.type !== "chemistry_and_fit" : true;

  const violations: string[] = [];
  if (!ambitionNotUnclear) violations.push("ambition:unclear");
  if (!teamRoleNotUnclear) violations.push("teamRole:unclear");
  if (!intensityNotUnclear) violations.push("intensity:unclear");
  if (!authenticityNotLow) violations.push("authenticity:low");
  if (!noIntentionViolation) violations.push("INTENTION_VIOLATION");
  if (!recruitmentLogicCorrect) violations.push("recruitmentLogic:chemistry_and_fit");

  const total =
    (ambitionNotUnclear ? 1 : 0) +
    (teamRoleNotUnclear ? 1 : 0) +
    (intensityNotUnclear ? 1 : 0) +
    (authenticityNotLow ? 1 : 0) +
    (noIntentionViolation ? 2 : 0) +
    (recruitmentLogicCorrect ? 1 : 0);

  return { ambitionNotUnclear, teamRoleNotUnclear, intensityNotUnclear, authenticityNotLow, noIntentionViolation, recruitmentLogicCorrect, total, violations };
}

// ── formatting ────────────────────────────────────────────────────────────────

function pad(s: string, n: number): string {
  return s.length >= n ? s.slice(0, n) : s + " ".repeat(n - s.length);
}

function estimateCost(model: ModelId, inputTokens: number, outputTokens: number): string {
  const p = PRICING[model];
  const cost = (inputTokens / 1000) * p.input + (outputTokens / 1000) * p.output;
  return `$${cost.toFixed(4)}`;
}

// ── main ──────────────────────────────────────────────────────────────────────

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("Missing ANTHROPIC_API_KEY. Add it to .env.local or environment before running.");
    process.exit(1);
  }

  const scenarios = interviewScenarios.filter((s) => (TARGET_IDS as readonly string[]).includes(s.id));
  if (scenarios.length !== 3) {
    console.error(`Expected 3 scenarios, found ${scenarios.length}. Check TARGET_IDS against scenarios.ts.`);
    process.exit(1);
  }

  console.log("\nLag 2 Benchmark — claude-haiku-4-5-20251001 vs claude-sonnet-4-6\n");

  const COL = { scenario: 40, model: 28, time: 10, cost: 12, quality: 10 };
  const header = `${pad("Scenario", COL.scenario)} ${pad("Model", COL.model)} ${pad("Time(ms)", COL.time)} ${pad("Est.Cost", COL.cost)} Quality(/7)`;
  console.log(header);
  console.log("─".repeat(header.length + 10));

  type Row = { scenarioId: string; model: ModelId; score: number; failed: boolean };
  const rows: Row[] = [];

  for (const scenario of scenarios) {
    const targetKind = inferTargetKind(scenario);
    const userContent = buildUserContent(scenario, targetKind);
    console.log(`\n[${scenario.id}] targetKind=${targetKind}`);

    for (const model of MODELS) {
      process.stdout.write(`  ${model}... `);
      const apiResult = await callApi(model, userContent);

      if (!apiResult) {
        console.log("FAILED");
        rows.push({ scenarioId: scenario.id, model, score: 0, failed: true });
        console.log(`${pad(scenario.label, COL.scenario)} ${pad(model, COL.model)} ${pad("FAILED", COL.time)} ${pad("-", COL.cost)} 0/7`);
        continue;
      }

      const scores = scoreResult(scenario, apiResult.result);
      rows.push({ scenarioId: scenario.id, model, score: scores.total, failed: false });
      console.log(`done (${apiResult.elapsedMs}ms)`);

      const violStr = scores.violations.length > 0 ? `  ← ${scores.violations.join(", ")}` : "";
      console.log(
        `${pad(scenario.label, COL.scenario)} ${pad(model, COL.model)} ${pad(String(apiResult.elapsedMs), COL.time)} ${pad(estimateCost(model, apiResult.inputTokens, apiResult.outputTokens), COL.cost)} ${scores.total}/7${violStr}`,
      );
    }
  }

  // Summary
  console.log("\n" + "─".repeat(80));
  const haikuRows = rows.filter((r) => r.model === "claude-haiku-4-5-20251001" && !r.failed);
  const sonnetRows = rows.filter((r) => r.model === "claude-sonnet-4-6" && !r.failed);

  if (haikuRows.length === 0 || sonnetRows.length === 0) {
    console.log("Anbefaling: Utilstrækkelige data — for mange fejlede kald.");
    return;
  }

  const haikuAvg = haikuRows.reduce((a, r) => a + r.score, 0) / haikuRows.length;
  const sonnetAvg = sonnetRows.reduce((a, r) => a + r.score, 0) / sonnetRows.length;
  const diff = sonnetAvg - haikuAvg;

  console.log(`\nGennemsnit — Haiku: ${haikuAvg.toFixed(1)}/7   Sonnet: ${sonnetAvg.toFixed(1)}/7   Forskel: ${diff >= 0 ? "+" : ""}${diff.toFixed(1)} point`);
  console.log();
  if (diff <= 1) {
    console.log("Anbefaling: Brug Haiku — tilstrækkelig kvalitet til markant lavere pris og tid");
  } else {
    console.log("Anbefaling: Brug Sonnet — kvalitetsforskel er for stor til at nedgradere");
  }
  console.log();
}

main().catch((err) => {
  console.error("Benchmark failed:", err instanceof Error ? err.message : String(err));
  process.exit(1);
});
