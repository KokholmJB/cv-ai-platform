export type IntendedDirectionType =
  | "same_track"
  | "same_track_better_conditions"
  | "next_level"
  | "direction_change"
  | "unclear"
  | "less_responsibility";

export type LoopFamily =
  | "mismatch_risk"
  | "ownership"
  | "current_work_reality"
  | "resultEvidence"
  | "product_ownership"
  | "responsibility"
  | "domain_context";

export type CompletionComplexity = "simple" | "moderate" | "complex";

export type CompletionQualityExpectations = {
  complexity: CompletionComplexity;
  suspiciousEarlyTurns?: number;
  requireUncertainties?: boolean;
  requireHypotheses?: boolean;
  expectedConcepts?: string[];
  minimumMatchedConcepts?: number;
};

export type InterviewScenario = {
  id: string;
  label: string;
  profileDraft: {
    name: string;
    currentRole: string;
    yearsExperience: string;
    targetDirection: string;
  };
  intendedDirectionType: IntendedDirectionType;
  expectedDoNotAssume: string[];
  scriptedAnswers: {
    default: string;
    byFamily?: Partial<Record<LoopFamily, string>>;
    byFocusArea?: Record<string, string>;
  };
  expectedSignals: string[];
  loopFamiliesToWatch: LoopFamily[];
  completionQuality: CompletionQualityExpectations;
  maxTurns?: number;
};

export const interviewScenarios: InterviewScenario[] = [
  {
    id: "same-role-warehouse-worker",
    label: "Same-role warehouse worker",
    profileDraft: {
      name: "Ali",
      currentRole: "Lagermedarbejder",
      yearsExperience:
        "7 aar paa lager med varemodtagelse, pluk og pak, truckkoersel, optaelling og daglig drift.",
      targetDirection:
        "Jeg vil gerne have samme type lager- eller logistikjob igen, men med stabile arbejdstider og en bedre leder.",
    },
    intendedDirectionType: "same_track_better_conditions",
    expectedDoNotAssume: ["leadership", "promotion", "product", "career_change"],
    scriptedAnswers: {
      default:
        "Jeg soeger samme type lagerarbejde. Jeg vil ikke vaere leder eller skifte retning, men jeg vil gerne have faste vagter, ordentlig planlaegning og en chef der kommunikerer tydeligt.",
      byFamily: {
        mismatch_risk:
          "Jeg vil undgaa kaotiske vagtplaner, daarlig tone og ledere der aendrer alt i sidste oejeblik. Et godt match er stabil drift, klare opgaver og respekt for folk paa gulvet.",
        current_work_reality:
          "Min hverdag er varemodtagelse, pluk og pak, truck, scanning, optaelling og at faa ordrer ud til tiden uden fejl.",
        resultEvidence:
          "Et konkret resultat er at jeg ofte blev sat paa hasteordrer, fordi jeg plukkede sikkert og fik faerre fejl end gennemsnittet.",
      },
    },
    expectedSignals: ["same warehouse/logistics track", "stable hours", "better manager", "no promotion wish"],
    loopFamiliesToWatch: ["mismatch_risk", "current_work_reality", "resultEvidence"],
    completionQuality: {
      complexity: "simple",
      suspiciousEarlyTurns: 2,
      expectedConcepts: ["lager", "logistik", "stabile", "leder"],
      minimumMatchedConcepts: 2,
    },
  },
  {
    id: "skilled-trades-technician",
    label: "Skilled tradesperson / technician",
    profileDraft: {
      name: "Mikkel",
      currentRole: "Servicetekniker",
      yearsExperience:
        "12 aar med fejlfinding, installation, servicebesoeg, kundekontakt og reparation af tekniske anlaeg.",
      targetDirection: "Samme fag og teknik, men i en bedre virksomhed med mindre kaos og bedre planlaegning.",
    },
    intendedDirectionType: "same_track_better_conditions",
    expectedDoNotAssume: ["office_role", "management", "leadership", "career_change"],
    scriptedAnswers: {
      default:
        "Jeg vil blive i mit fag og arbejde praktisk med teknik. Jeg vil ikke ind paa kontor eller vaere leder, men jeg vil have bedre planlaegning, realistiske tidsplaner og mindre brandslukning.",
      byFamily: {
        ownership:
          "Jeg har ansvar for mine egne servicebesoeg fra fejlfinding til loesning, dokumentation og overlevering til kunden.",
        current_work_reality:
          "Arbejdet handler om servicebesoeg, fejlfinding, reservedele, sikkerhed, dokumentation og kundedialog ude paa lokation.",
        resultEvidence:
          "Jeg har loest gentagne fejl ved at finde den egentlige aarsag, saa kunden fik faerre nedbrud og mere stabil drift.",
      },
    },
    expectedSignals: ["same trade", "better company", "less chaos", "not management"],
    loopFamiliesToWatch: ["ownership", "current_work_reality", "resultEvidence"],
    completionQuality: {
      complexity: "moderate",
      suspiciousEarlyTurns: 3,
      expectedConcepts: ["servicetekniker", "teknik", "kaos", "planlaegning"],
      minimumMatchedConcepts: 2,
    },
  },
  {
    id: "administrative-employee",
    label: "Administrative employee",
    profileDraft: {
      name: "Sofie",
      currentRole: "Administrativ medarbejder",
      yearsExperience: "9 aar med sagsbehandling, kalenderstyring, kundeservice, fakturaer og intern koordinering.",
      targetDirection: "En lignende administrativ eller koordinerende rolle med struktur og forudsigelighed.",
    },
    intendedDirectionType: "same_track",
    expectedDoNotAssume: ["leadership", "promotion", "career_change"],
    scriptedAnswers: {
      default:
        "Jeg trives bedst i en lignende administrativ rolle med faste rammer, klare processer og opgaver hvor jeg skaber orden og overblik.",
      byFamily: {
        mismatch_risk:
          "Jeg vil undgaa meget uklare roller, konstant hast og steder hvor alt er akut. Jeg arbejder bedst med struktur og tydelige forventninger.",
        resultEvidence:
          "Jeg har ryddet op i sager og fakturaer, saa svartider blev kortere og kolleger hurtigere kunne finde de rigtige oplysninger.",
      },
    },
    expectedSignals: ["similar admin role", "structure", "predictability"],
    loopFamiliesToWatch: ["mismatch_risk", "resultEvidence"],
    completionQuality: {
      complexity: "simple",
      suspiciousEarlyTurns: 2,
      expectedConcepts: ["administrativ", "struktur", "forudsigelighed"],
      minimumMatchedConcepts: 2,
    },
  },
  {
    id: "sales-customer-facing",
    label: "Sales/customer-facing profile",
    profileDraft: {
      name: "Nadia",
      currentRole: "Sales development representative",
      yearsExperience: "5 aar med kundedialog, behovsafdækning, CRM, moebooking, tilbud og samarbejde med account managers.",
      targetDirection:
        "Jeg vil vaek fra kold kanvas og cold outreach, men gerne bruge mine kundeevner i customer success, support eller account coordination.",
    },
    intendedDirectionType: "direction_change",
    expectedDoNotAssume: ["cold_outreach", "sales_hunter", "leadership"],
    scriptedAnswers: {
      default:
        "Jeg vil stadig arbejde med kunder, behov og relationer, men ikke have en rolle hvor hovedopgaven er kold outreach eller hoejt pres paa nykundesalg.",
      byFamily: {
        mismatch_risk:
          "Et daarligt match er ren hunter-salg, daglige ringelister og bonuspres. Et godt match er service, fastholdelse, onboarding eller koordinering med kunder.",
        resultEvidence:
          "Jeg har forbedret moede-kvaliteten ved at afdække behov bedre, saa account managers fik samtaler med mere relevante kunder.",
      },
    },
    expectedSignals: ["away from cold outreach", "customer skills", "customer success/support direction"],
    loopFamiliesToWatch: ["mismatch_risk", "resultEvidence"],
    completionQuality: {
      complexity: "moderate",
      suspiciousEarlyTurns: 3,
      requireUncertainties: true,
      expectedConcepts: ["cold outreach", "customer success", "support", "kunder"],
      minimumMatchedConcepts: 2,
    },
  },
  {
    id: "specialist-expert",
    label: "Specialist/expert",
    profileDraft: {
      name: "Jonas",
      currentRole: "Data specialist",
      yearsExperience: "11 aar med analyse, datamodeller, rapportering, kvalitetssikring og raadgivning af fagteams.",
      targetDirection: "Jeg vil blive faglig specialist og arbejde dybere med data, ikke blive people manager.",
    },
    intendedDirectionType: "same_track",
    expectedDoNotAssume: ["people_management", "leadership", "promotion"],
    scriptedAnswers: {
      default:
        "Jeg vil gerne udvikle mig fagligt som specialist. Jeg vil ikke have personaleansvar, men gerne vaere den der laver solide analyser og hjalper beslutninger med god data.",
      byFamily: {
        ownership:
          "Jeg ejer typisk datakvalitet, rapportlogik og analysegrundlag, men jeg leder ikke mennesker og oensker heller ikke personaleansvar.",
        resultEvidence:
          "Et resultat var en ny rapportmodel, der fjernede manuelle fejl og gav ledelsen hurtigere overblik over de vigtigste nøgletal.",
      },
    },
    expectedSignals: ["remain specialist", "no people management", "deep expertise"],
    loopFamiliesToWatch: ["ownership", "resultEvidence"],
    completionQuality: {
      complexity: "moderate",
      suspiciousEarlyTurns: 3,
      expectedConcepts: ["specialist", "data", "personaleansvar"],
      minimumMatchedConcepts: 2,
    },
  },
  {
    id: "project-manager-to-product-manager",
    label: "Project manager to Product Manager transition",
    profileDraft: {
      name: "Maria",
      currentRole: "Projektleder",
      yearsExperience:
        "8 aar med projektledelse, stakeholder management, prioritering, implementering, koordinering og beslutningsoplæg.",
      targetDirection: "Jeg vil gerne mod Product Manager eller product owner i en realistisk overgang.",
    },
    intendedDirectionType: "direction_change",
    expectedDoNotAssume: ["deny_transition"],
    scriptedAnswers: {
      default:
        "Jeg har ikke haft formelt roadmap- eller backlog-ejerskab, men jeg har koordineret krav, lavet beslutningsoplæg, prioriteret leverancer og samlet input fra kunder og interne teams.",
      byFamily: {
        product_ownership:
          "Jeg har ikke ejet roadmap formelt. Mit bevis er koordinering af krav, prioriteringsoplæg, stakeholder-afstemning og at omsætte behov til gennemførbare leverancer.",
        ownership:
          "Jeg havde ansvar for projektleverancer, plan, interessenter og opfølgning, men produktbeslutninger blev taget sammen med ledelse og faglige ejere.",
        resultEvidence:
          "Et konkret resultat var en implementering hvor bedre prioritering reducerede forsinkelser og gjorde beslutninger tydeligere for teamet.",
      },
    },
    expectedSignals: ["product direction", "coordination evidence", "decision-support evidence", "product ownership gap"],
    loopFamiliesToWatch: ["product_ownership", "ownership", "resultEvidence"],
    completionQuality: {
      complexity: "complex",
      suspiciousEarlyTurns: 4,
      requireUncertainties: true,
      requireHypotheses: true,
      expectedConcepts: ["product", "roadmap", "backlog", "koordinering", "prioritering"],
      minimumMatchedConcepts: 3,
    },
  },
  {
    id: "people-manager",
    label: "People manager",
    profileDraft: {
      name: "Henrik",
      currentRole: "Teamleder",
      yearsExperience: "10 aar i drift og 4 aar som teamleder med personaleansvar, MUS, vagtplaner og performance.",
      targetDirection: "Jeg vil gerne have mere ledelsesansvar og en større afdeling.",
    },
    intendedDirectionType: "next_level",
    expectedDoNotAssume: ["individual_contributor_only", "same_level_only"],
    scriptedAnswers: {
      default:
        "Jeg har formelt personaleansvar for 12 medarbejdere, holder samtaler, fordeler opgaver og arbejder med trivsel, kvalitet og resultater. Jeg vil gerne tage mere ledelsesansvar.",
      byFamily: {
        responsibility:
          "Mit ansvar er direkte personaleledelse, prioritering, opfølgning, svære samtaler og at sikre både drift og trivsel.",
        resultEvidence:
          "Jeg forbedrede stabiliteten i teamet ved at ændre planlægning og opfølgning, så sygefravær faldt og leverancer blev mere forudsigelige.",
      },
    },
    expectedSignals: ["formal people responsibility", "wants more leadership", "next level"],
    loopFamiliesToWatch: ["responsibility", "resultEvidence"],
    completionQuality: {
      complexity: "moderate",
      suspiciousEarlyTurns: 3,
      requireHypotheses: true,
      expectedConcepts: ["teamleder", "personaleansvar", "ledelsesansvar"],
      minimumMatchedConcepts: 2,
    },
  },
  {
    id: "unclear-direction-user",
    label: "Unclear direction user",
    profileDraft: {
      name: "Camilla",
      currentRole: "Butiksmedarbejder",
      yearsExperience: "6 aar med butik, kunder, vareopfyldning, kasse, åbning og lukning.",
      targetDirection: "Jeg ved ikke helt hvad jeg vil nu.",
    },
    intendedDirectionType: "unclear",
    expectedDoNotAssume: ["leadership", "promotion", "office_role", "career_change"],
    scriptedAnswers: {
      default:
        "Jeg er usikker. Jeg ved at jeg er god med kunder, praktiske opgaver og tempo, men jeg har brug for hjælp til at afklare om jeg skal blive i butik, service eller noget beslægtet.",
      byFamily: {
        mismatch_risk:
          "Jeg vil undgå uforudsigelige vagter sent om aftenen og steder med dårlig stemning. Jeg er åben, men vil ikke presses i en bestemt retning.",
        current_work_reality:
          "Min hverdag er kunder, varer, kasse, reklamationer, åbne og lukke butik og hjælpe kolleger når der er travlt.",
      },
    },
    expectedSignals: ["unclear direction", "guided clarification", "no default push"],
    loopFamiliesToWatch: ["mismatch_risk", "current_work_reality"],
    completionQuality: {
      complexity: "complex",
      suspiciousEarlyTurns: 4,
      requireUncertainties: true,
      requireHypotheses: true,
      expectedConcepts: ["usikker", "butik", "afklare", "service"],
      minimumMatchedConcepts: 2,
    },
  },
  {
    id: "senior-less-responsibility",
    label: "Senior person wanting less responsibility",
    profileDraft: {
      name: "Lars",
      currentRole: "Senior projektchef",
      yearsExperience: "20 aar med store projekter, ledelse, budget, kunder, styring og eskaleringer.",
      targetDirection: "Jeg vil gerne have mindre ansvar, lavere pres og bedre balance, gerne som erfaren specialist eller senior projektleder uden topansvar.",
    },
    intendedDirectionType: "less_responsibility",
    expectedDoNotAssume: ["more_responsibility", "promotion", "leadership_progression"],
    scriptedAnswers: {
      default:
        "Jeg vil ikke længere opad. Jeg vil bruge min erfaring, men med mindre pres, færre eskaleringer og uden at være øverste ansvarlige for store programmer.",
      byFamily: {
        responsibility:
          "Jeg har haft meget ansvar for budgetter, kunder og teams, men målet nu er mindre ansvar og bedre balance, ikke mere ledelse.",
        mismatch_risk:
          "Et dårligt match er roller med konstant eskalering, stort personaleansvar og forventning om altid at være på. Jeg vil have roligere rammer.",
      },
    },
    expectedSignals: ["less responsibility", "lower pressure", "better balance", "not upward progression"],
    loopFamiliesToWatch: ["responsibility", "mismatch_risk"],
    completionQuality: {
      complexity: "complex",
      suspiciousEarlyTurns: 4,
      requireUncertainties: true,
      requireHypotheses: true,
      expectedConcepts: ["mindre ansvar", "lavere pres", "balance", "senior"],
      minimumMatchedConcepts: 2,
    },
  },
  {
    id: "career-changer",
    label: "Career changer",
    profileDraft: {
      name: "Emma",
      currentRole: "Sygeplejerske",
      yearsExperience: "8 aar med patientkontakt, koordinering, dokumentation, prioritering og tværfagligt samarbejde.",
      targetDirection:
        "Jeg vil skifte til sundhedsadministration, koordinatorrolle eller support i health tech, hvor mine erfaringer kan bruges.",
    },
    intendedDirectionType: "direction_change",
    expectedDoNotAssume: ["same_clinical_role", "leadership"],
    scriptedAnswers: {
      default:
        "Jeg vil væk fra kliniske vagter, men bruge min sundhedsforståelse, dokumentation, koordinering og evne til at skabe ro for patienter og kolleger.",
      byFamily: {
        mismatch_risk:
          "Jeg vil undgå nattevagter og direkte klinisk ansvar. Et godt match bruger min erfaring i administration, koordinering, support eller health tech.",
        resultEvidence:
          "Jeg har koordineret komplekse patientforløb og forbedret overleveringer, så fejl og misforståelser blev færre.",
        domain_context:
          "Domænet må gerne stadig være sundhed, kommune, hospital, leverandør eller health tech, men rollen skal være mindre klinisk.",
      },
    },
    expectedSignals: ["new domain or role", "transferable strengths", "gap analysis"],
    loopFamiliesToWatch: ["mismatch_risk", "resultEvidence", "domain_context"],
    completionQuality: {
      complexity: "complex",
      suspiciousEarlyTurns: 4,
      requireUncertainties: true,
      requireHypotheses: true,
      expectedConcepts: ["sygeplejerske", "health tech", "skifte", "koordinering", "support"],
      minimumMatchedConcepts: 3,
    },
  },
];
