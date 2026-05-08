export type ProfileCommunicationSignals = {
  answerStyle?: string;
  structureLevel?: string;
  evidenceDensity?: string;
  possibleSelfMinimizingLanguage?: boolean;
  possibleOverlongExplanations?: boolean;
};

export type ReadinessAssessment = {
  level: "minimum_usable" | "stronger_profile" | "not_strong_enough_for_target";
  targetDirectionSupport: "partial" | "strong" | "not_yet_proven";
  summary: string;
  strengthSignals: string[];
  gapSignals: string[];
};

export type ProfileModel = {
  facts?: unknown[];
  interpretations?: unknown[];
  uncertainties?: unknown[];
  hypotheses?: unknown[];
  communicationSignals?: ProfileCommunicationSignals;
};

export type ProfileSummary = {
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
    confidence: "low" | "medium" | "high";
  };
};

export type PersonalProfileViewModel = {
  basicInfo: {
    name: string;
    currentRole: string;
    yearsExperience: string;
    targetDirection: string;
  };
  overview: {
    shortSummary: string;
    signalSummary: string;
    practicalUse: string;
  };
  experience: {
    experienceText: string;
    valueText: string;
    optionalRefinement: string;
  };
  jobDirection: {
    directionNow: string;
    markerText: string;
    optionalClarification: string;
  };
  workProfile: {
    goodFit: string;
    styleText: string;
    lessFit: string;
  };
  nextSteps: {
    actions: [string, string][];
  };
  statusLabel: string;
};

export type TechnicalProfileViewModel = {
  readinessAssessment: ReadinessAssessment | null;
  facts: unknown[];
  interpretations: unknown[];
  uncertainties: unknown[];
  hypotheses: unknown[];
  communicationSignals: ProfileCommunicationSignals | null;
  raw: {
    profileSummary: ProfileSummary | null;
    profileModel: ProfileModel | null;
  };
};

export type ProfileViewModel = {
  personal: PersonalProfileViewModel;
  technical: TechnicalProfileViewModel;
};

type BuildProfileViewModelInput = {
  profileSummary: ProfileSummary | null;
  readinessAssessment: ReadinessAssessment | null;
  profileModel: ProfileModel | null;
  communicationSignals: ProfileCommunicationSignals | null;
  userAvoids: string;
};

function safeText(value: string | null | undefined, fallback: string) {
  const text = value?.trim();
  return text && text.length > 0 ? text : fallback;
}

function hasUnsafeTechnicalPhrase(value: string) {
  const lower = value.toLowerCase();
  return (
    lower.includes("brugeren") ||
    lower.includes("no-go") ||
    lower.includes("_") ||
    lower.includes("backlogansvar") ||
    lower.includes("roadmap") ||
    lower.includes("formelt") ||
    lower.includes("bevist") ||
    lower.includes("underbygget") ||
    lower.includes("datagrundlag") ||
    lower.includes("matchvurdering")
  );
}

function safeStrengths(strengths: string[]) {
  const filtered = strengths
    .filter((item) => item && item.trim().length > 0)
    .map((item) => item.trim())
    .filter((item) => !hasUnsafeTechnicalPhrase(item))
    .slice(0, 3);
  return filtered.length > 0 ? filtered.join(", ") : "overblik, koordinering og samarbejde på tværs";
}

function statusLabel(readiness: ReadinessAssessment | null) {
  if (!readiness) return "Første profiludkast";
  if (readiness.level === "minimum_usable") return "Klar til første jobmatch";
  if (readiness.level === "stronger_profile") return "Solidt profiludkast";
  return "Første profiludkast";
}

// Boundary: this is the controlled mapping from technical/interview signals to user-facing profile text.
export function buildProfileViewModel(input: BuildProfileViewModelInput): ProfileViewModel {
  const profile = input.profileSummary;
  const communication = input.communicationSignals ?? input.profileModel?.communicationSignals ?? null;

  const currentRole = safeText(profile?.userProfileData.currentRole ?? null, "din nuværende rolle");
  const yearsExperience = safeText(profile?.userProfileData.yearsExperience ?? null, "din erfaring");
  const targetDirection = safeText(profile?.userProfileData.targetDirection ?? null, "en retning, der passer til din erfaring");
  const strengthsText = safeStrengths(profile?.aiProfileCore.transferableStrengths ?? []);

  const communicationLine =
    communication?.answerStyle === "concise"
      ? "Du svarer kort og direkte, og JobPilot hjælper med at gøre dine erfaringer tydelige i CV og ansøgninger."
      : "Du giver et klart første billede af, hvordan du arbejder, og JobPilot bygger videre på det i næste trin.";

  const avoidLine = input.userAvoids
    ? `Miljøer med ${input.userAvoids.toLowerCase()} passer typisk mindre godt til dine præferencer.`
    : "Miljøer med uklare forventninger eller vedvarende højt pres kan passe mindre godt.";

  const personal: PersonalProfileViewModel = {
    basicInfo: {
      name: safeText(profile?.userProfileData.name ?? null, "Ikke tilgængelig endnu"),
      currentRole,
      yearsExperience,
      targetDirection,
    },
    overview: {
      shortSummary: `JobPilot ser en profil med erfaring fra ${currentRole.toLowerCase()}, koordinering og samarbejde på tværs.`,
      signalSummary: `Din retning peger mod ${targetDirection.toLowerCase()}, og din erfaring fra ${yearsExperience.toLowerCase()} kan bruges aktivt.`,
      practicalUse: "Profilen kan bruges som et første afsæt til at vurdere relevante jobopslag og målrette dit næste CV-udkast.",
    },
    experience: {
      experienceText: `Du kommer med erfaring fra ${currentRole.toLowerCase()} og har arbejdet med ${yearsExperience.toLowerCase()}.`,
      valueText: `Din erfaring peger især på ${strengthsText}.`,
      optionalRefinement: "Senere kan du tilføje 1-2 konkrete eksempler, hvis du vil gøre CV og ansøgninger mere præcise.",
    },
    jobDirection: {
      directionNow: `Din ønskede retning peger mod ${targetDirection.toLowerCase()}.`,
      markerText: "Retningen kan bruges som et første pejlemærke. Når du tilføjer et konkret jobopslag, kan JobPilot teste retningen mere præcist.",
      optionalClarification: "Hvis du vil, kan JobPilot senere stille få opfølgende spørgsmål for at gøre retningen skarpere.",
    },
    workProfile: {
      goodFit: "Det tyder på, at du arbejder bedst med tydelige rammer, klar prioritering og samarbejde, hvor ansvar er afstemt.",
      styleText: communicationLine,
      lessFit: avoidLine,
    },
    nextSteps: {
      actions: [
        ["Tilføj første jobopslag", "Vælg et konkret opslag, så JobPilot kan vurdere fit og prioritere næste handlinger."],
        ["Tilføj 1-2 konkrete eksempler senere", "Beskriv kort en situation med ansvar, samarbejde eller resultat, når det passer dig."],
        ["Brug profilen til CV og ansøgning", "Brug profiludkastet som retning for de vigtigste budskaber i dit materiale."],
        ["Svar på få ekstra spørgsmål senere", "Hvis du vil gøre profilen skarpere, kan JobPilot stille et par korte opfølgende spørgsmål."],
      ],
    },
    statusLabel: statusLabel(input.readinessAssessment),
  };

  const technical: TechnicalProfileViewModel = {
    readinessAssessment: input.readinessAssessment,
    facts: input.profileModel?.facts ?? [],
    interpretations: input.profileModel?.interpretations ?? [],
    uncertainties: input.profileModel?.uncertainties ?? [],
    hypotheses: input.profileModel?.hypotheses ?? [],
    communicationSignals: communication,
    raw: {
      profileSummary: input.profileSummary,
      profileModel: input.profileModel,
    },
  };

  return { personal, technical };
}
