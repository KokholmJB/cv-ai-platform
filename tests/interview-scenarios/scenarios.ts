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

export type FieldSignalExpectation = {
  required?: boolean;
  requiredSubfields?: string[];
  expectedPatterns?: RegExp[];
  forbiddenPatterns?: RegExp[];
  forbiddenExactValues?: string[];
};

export type CompletionQualityExpectations = {
  complexity: CompletionComplexity;
  suspiciousEarlyTurns?: number;
  requireUncertainties?: boolean;
  requireHypotheses?: boolean;
  expectedConcepts?: string[];
  minimumMatchedConcepts?: number;
  expectedFieldSignals?: {
    behaviorProfile?: FieldSignalExpectation;
    lifestyleProfile?: FieldSignalExpectation;
    recruitmentLogic?: FieldSignalExpectation;
    hiddenStrengths?: FieldSignalExpectation;
    energyConditions?: FieldSignalExpectation;
    interviewReadiness?: FieldSignalExpectation;
    evidenceProfile?: FieldSignalExpectation;
    communicationProfile?: FieldSignalExpectation;
    authenticityProfile?: FieldSignalExpectation;
    credibilitySignals?: FieldSignalExpectation;
  };
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
      expectedFieldSignals: {
        lifestyleProfile: { forbiddenExactValues: ["unclear"] },
        hiddenStrengths: { required: true, expectedPatterns: [/\[.+\]/] },
        recruitmentLogic: { required: true, expectedPatterns: [/cv_and_experience/] },
      },
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
      expectedFieldSignals: {
        recruitmentLogic: { required: true, expectedPatterns: [/personality_and_culture|chemistry_and_fit/] },
      },
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
      expectedFieldSignals: {
        behaviorProfile: { forbiddenExactValues: ["upward"], expectedPatterns: [/specialist/i] },
        energyConditions: { requiredSubfields: ["peaksAt"] },
        recruitmentLogic: { required: true, forbiddenExactValues: ["chemistry_and_fit"] },
      },
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
      expectedFieldSignals: {
        evidenceProfile: { forbiddenExactValues: ["sufficient"] },
        interviewReadiness: { requiredSubfields: ["vulnerabilities"] },
        authenticityProfile: { required: true, requiredSubfields: ["authenticityConfidence"] },
      },
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
      expectedFieldSignals: {
        recruitmentLogic: { required: true, forbiddenExactValues: ["chemistry_and_fit"] },
        behaviorProfile: { forbiddenExactValues: ["less_responsibility"] },
        authenticityProfile: { required: true },
      },
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
      expectedFieldSignals: {
        behaviorProfile: { forbiddenExactValues: ["upward"] },
        lifestyleProfile: { forbiddenPatterns: [/"workIntensityPreference":"high"/] },
        energyConditions: { requiredSubfields: ["strugglesAt"] },
      },
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
      expectedFieldSignals: {
        evidenceProfile: { requiredSubfields: ["transferableStrengths"] },
        energyConditions: { requiredSubfields: ["strugglesAt"] },
        behaviorProfile: { expectedPatterns: [/lateral/] },
        authenticityProfile: { required: true, requiredSubfields: ["authenticityConfidence"] },
      },
    },
  },
  {
    id: "trade-transition",
    label: "Trade worker transitioning away from physical work",
    profileDraft: {
      name: "Brian",
      currentRole: "Elektriker",
      yearsExperience:
        "16 aar som elektriker med installation, serviceopgaver, fejlfinding, kundekontakt og tilbudsgivning.",
      targetDirection:
        "Jeg vil vaek fra det fysiske arbejde paa grund af kroppen og vil hellere arbejde indendoers med koordinering, support eller teknisk raadgivning i en relateret branche.",
    },
    intendedDirectionType: "direction_change",
    expectedDoNotAssume: ["leadership", "management"],
    scriptedAnswers: {
      default:
        "Jeg vil vaek fra det fysiske arbejde, ikke ud af branchen. Jeg er stadig stolt af mit fag og vil gerne bruge min viden, men i en rolle der ikke kraever at jeg er paa knae eller paa stige hele dagen.",
      byFamily: {
        mismatch_risk:
          "Et daarligt match er steder der vil have mig paa gulvet igen. Et godt match er koordinering, tilbudsgivning, support eller indkaeb i el- eller installationsbranchen.",
        current_work_reality:
          "Min hverdag er installation, serviceopgaver, fejlfinding, kundekontakt og tilbudsberegning. Kroppen begynder at saette graenser.",
        resultEvidence:
          "Jeg har vaeret god til at vejlede nye kollegaer og laere dem de tekniske detaljer, fordi jeg ser moenstrene i fejlene hurtigt.",
      },
    },
    expectedSignals: [
      "physical limitation signal",
      "trade knowledge transferable",
      "indoor role preference",
      "not management",
    ],
    loopFamiliesToWatch: ["mismatch_risk", "current_work_reality", "resultEvidence"],
    completionQuality: {
      complexity: "moderate",
      suspiciousEarlyTurns: 3,
      requireUncertainties: true,
      expectedConcepts: ["elektriker", "koordinering", "indendoers", "fysisk"],
      minimumMatchedConcepts: 2,
      expectedFieldSignals: {
        evidenceProfile: { requiredSubfields: ["transferableStrengths"] },
        lifestyleProfile: { forbiddenPatterns: [/"workIntensityPreference":"high"/] },
      },
    },
  },
  {
    id: "sosu-same-track",
    label: "SOSU worker wanting same track with better conditions",
    profileDraft: {
      name: "Tina",
      currentRole: "SOSU-assistent",
      yearsExperience:
        "10 aar med personlig pleje, medicinhaandtering, dokumentation, koordinering og taetkontakt med borgere og paaroerende.",
      targetDirection:
        "Jeg vil blive i omsorgsarbejdet, men jeg soeger dagvagter, ingen nattevagter og roller med mindre fysisk belaestning.",
    },
    intendedDirectionType: "same_track_better_conditions",
    expectedDoNotAssume: ["leadership", "management", "career_change"],
    scriptedAnswers: {
      default:
        "Jeg vil stadig arbejde med omsorg og borgere, det giver mig mening. Men jeg kan ikke fortsaette med nattevagter og det tunge fysiske arbejde. Jeg soeger dagvagter og en lettere variant inden for samme felt.",
      byFamily: {
        mismatch_risk:
          "Et daarligt match er steder med nattevagter, tung plejeafdeling og hoejt fysisk pres. Et godt match er en dagafdeling, aktivitetsmedarbejder, lettere klinisk arbejde eller administrativ rolle i omsorg.",
        current_work_reality:
          "Jeg planlaeeger og udforer personlig pleje, passer nattevagter, haandterer medicin og dokumenterer forloeb for borgere i aeldreplejen.",
        resultEvidence:
          "Jeg hjalp med at forbedre overleveringerne mellem vagterne, saa vigtig information ikke gik tabt og borgerne fik bedre kontinuitet.",
      },
    },
    expectedSignals: [
      "care sector commitment",
      "workload reduction not career change",
      "schedule preference",
      "not career change",
    ],
    loopFamiliesToWatch: ["mismatch_risk", "current_work_reality", "resultEvidence"],
    completionQuality: {
      complexity: "moderate",
      suspiciousEarlyTurns: 3,
      expectedConcepts: ["SOSU", "omsorg", "dagvagter", "nattevagter"],
      minimumMatchedConcepts: 2,
      expectedFieldSignals: {
        lifestyleProfile: { forbiddenPatterns: [/"workIntensityPreference":"high"/] },
      },
    },
  },
  {
    id: "executive-transition",
    label: "Senior executive stepping back deliberately",
    profileDraft: {
      name: "Claus",
      currentRole: "Direktoer",
      yearsExperience:
        "22 aar med topledelse, bestyrelsesarbejde, strategisk udvikling og ledelse af store organisationer med 100 eller flere medarbejdere.",
      targetDirection:
        "Jeg vil bevidst ned i tempo og ansvar. Jeg soeger en raadgiverrolle, bestyrelsespost eller en fokuseret ekspertrolle, ikke endnu et direktoer- eller toplederjob.",
    },
    intendedDirectionType: "less_responsibility",
    expectedDoNotAssume: ["more_responsibility", "leadership_progression"],
    scriptedAnswers: {
      default:
        "Jeg vil ikke have endnu et stort direktoer-job. Jeg vil bruge min erfaring som raadgiver, bestyrelsesmedlem eller specialist uden det operationelle ansvar. Det er et aktivt valg, ikke en nedtur.",
      byFamily: {
        responsibility:
          "Jeg har haft det fulde ansvar for organisationer med store budgetter og mange medarbejdere. Nu vil jeg traede et skridt tilbage fra den operationelle byrde og bidrage paa en anden maade.",
        mismatch_risk:
          "Et daarligt match er roller der kraever jeg er den oeverste ansvarlige i den daglige drift. Et godt match er raadgivning, bestyrelsesrollen eller strategisk ekspertbistand.",
        resultEvidence:
          "Et konkret bidrag var en turnaround af en organisation i krise, der endte med vaekst og stabilitet tre aar efter.",
      },
    },
    expectedSignals: [
      "leadership legacy",
      "advisory preference",
      "deliberate deceleration",
      "not operational leadership",
    ],
    loopFamiliesToWatch: ["responsibility", "mismatch_risk", "resultEvidence"],
    completionQuality: {
      complexity: "complex",
      suspiciousEarlyTurns: 4,
      requireUncertainties: true,
      requireHypotheses: true,
      expectedConcepts: ["direktoer", "raadgiver", "bestyrelse", "ansvar"],
      minimumMatchedConcepts: 2,
      expectedFieldSignals: {
        behaviorProfile: { forbiddenExactValues: ["upward"] },
        lifestyleProfile: { forbiddenPatterns: [/"workIntensityPreference":"high"/] },
      },
    },
  },
  {
    id: "job-seeker-gap",
    label: "Job seeker with employment gap",
    profileDraft: {
      name: "Rasmus",
      currentRole: "Projektkoordinator, ledig i 11 maaneder",
      yearsExperience:
        "11 aar med projektkoordinering, interessentstyring, dokumentation og intern kommunikation. Ledigt siden virksomhedslukning.",
      targetDirection:
        "Jeg vil tilbage i arbejde i en lignende koordinerings- eller administrativ rolle, helst i en stoerre og mere stabil virksomhed.",
    },
    intendedDirectionType: "same_track",
    expectedDoNotAssume: ["leadership", "promotion", "career_change"],
    scriptedAnswers: {
      default:
        "Jeg har vaeret ledig i knap et aar fordi virksomheden lukkede, ikke pga. performance. Jeg er klar til at komme tilbage og soeger det samme type arbejde som jeg har 11 aars erfaring med.",
      byFamily: {
        mismatch_risk:
          "Et daarligt match er steder der er skeptiske over for, at et ledighedsgab kan skyldes omstaendigheder. Et godt match vurderer min faktiske erfaring og hvad jeg kan.",
        current_work_reality:
          "Inden ledighed var min hverdag projektkoordinering, interessentstyring, dokumentation, referater, opfoelgning og intern kommunikation.",
        resultEvidence:
          "I mit seneste job koordinerede jeg et flytningsprojekt der gik i maal til tiden og inden for budgettet med tre afdelinger involveret.",
      },
    },
    expectedSignals: [
      "gap explanation",
      "reentry confidence",
      "previous competence intact",
      "same-track target",
    ],
    loopFamiliesToWatch: ["mismatch_risk", "current_work_reality", "resultEvidence"],
    completionQuality: {
      complexity: "moderate",
      suspiciousEarlyTurns: 3,
      requireUncertainties: true,
      expectedConcepts: ["ledig", "koordinering", "projekt", "virksomhed"],
      minimumMatchedConcepts: 2,
      expectedFieldSignals: {
        interviewReadiness: { requiredSubfields: ["vulnerabilities"] },
      },
    },
  },
  {
    id: "passion-strong-craftsperson",
    label: "Passion-driven restoration craftsman",
    profileDraft: {
      name: "Soeren",
      currentRole: "Toemrer",
      yearsExperience:
        "17 aar som toemrer. Jeg elsker arbejdet med fredede og historiske bygninger og braender for at bevare gammelt haandvaerk og originale materialer. Har frivilligt restaureret fredede gaarde og kirker i fritiden.",
      targetDirection:
        "Mere restaureringsarbejde og mindre nybyggeri. Det giver mig mening at bygge noget der holder i hundrede aar. Det er vigtigt for mig at arbejde med kvalitet frem for hastighed, og jeg vil ikke acceptere pladser der bare vil have det billigste og hurtigste.",
    },
    intendedDirectionType: "same_track_better_conditions",
    expectedDoNotAssume: ["leadership", "management", "office_role"],
    scriptedAnswers: {
      default:
        "Restaurering er ikke bare et job for mig — det er noget jeg virkelig tror paa. Jeg husker foerste gang jeg arbejdede paa en fredet bygning. Der laerte jeg hvad haandvaerk egentlig er: at respektere materialet og forstaa bygningens logik. Det er det jeg er god til og det jeg vil have mere af.",
      byFamily: {
        current_work_reality:
          "Normalt er det standard renovering og nybyggeri, men det er restaureringsopgaverne der giver mig energi. Jeg maerkede det tydeligt da jeg sad med originale bindingsvaerksbjælker — den slags kraever kendskab til materialer og teknikker de fleste ikke laengere ved noget om.",
        resultEvidence:
          "Et konkret eksempel: jeg stod med en fredet laden hvor hele tagkonstruktionen skulde bevares med originalmetoden. Jeg skaffede det rigtige egetraee og genopbyggede samlingerne. Det betod noget — bygningen staar nu og vil staa i hundrede aar mere.",
        mismatch_risk:
          "Et daarligt match er steder der vil have mig til at skynde mig og skjaere hjoerner. Det er en fornaevning mod haandvaerket. Jeg valgte mit fag fordi det betyder noget at goere det rigtigt.",
      },
    },
    expectedSignals: [
      "restoration passion",
      "quality over speed",
      "authentic craft motivation",
      "not management or office",
    ],
    loopFamiliesToWatch: ["current_work_reality", "resultEvidence", "mismatch_risk"],
    completionQuality: {
      complexity: "moderate",
      suspiciousEarlyTurns: 3,
      requireUncertainties: true,
      expectedConcepts: ["restaurering", "haandvaerk", "fredede", "toemrer", "materialer"],
      minimumMatchedConcepts: 3,
      expectedFieldSignals: {
        authenticityProfile: {
          required: true,
          requiredSubfields: ["dominantPassions", "coreValueAnchors", "naturalVoiceMarkers"],
          expectedPatterns: [
            /elsker|braender for|giver mig mening/,
            /vigtigt for mig|vil ikke acceptere/,
          ],
        },
      },
    },
  },
  {
    id: "value-anchored-teacher-leaving",
    label: "Value-anchored teacher leaving the school system",
    profileDraft: {
      name: "Stine",
      currentRole: "Folkeskolelaerer",
      yearsExperience:
        "14 aar som folkeskolelaerer i grundskolen. Braender for boerns laering og udvikling, men er engageret i alternative og mere individuelle tilgange. Foeler sig begrænset af testregimer og mangel paa tid til det enkelte barn.",
      targetDirection:
        "Ud af folkeskolen, men ikke ud af undervisning og laering. Det giver mig mening at hjaelpe mennesker laere paa en maade der virker for dem. Det er vigtigt for mig at have faglig autonomi. Jeg vil ikke acceptere roller der bare kraever at jeg eksekverer andres systemer uden at taenke selv.",
    },
    intendedDirectionType: "direction_change",
    expectedDoNotAssume: ["return_to_school", "standardized_teaching", "management"],
    scriptedAnswers: {
      default:
        "Jeg elsker det oejeblik noget klikker for et barn — det er det jeg er god til, og det giver mig mening. Jeg husker en elev der blomstrede da jeg tilpassede min tilgang — der laerte jeg hvad undervisning egentlig er. Folkeskolen lader mig ikke goere det ordentligt laengere. Det betod meget for mig da jeg maerkede det — og det er der jeg valgte at finde noget andet.",
      byFamily: {
        mismatch_risk:
          "Et daarligt match er steder med stramt styrede processer og ingen faglig autonomi. Jeg valgte laererfaget fordi jeg ville goere en forskel — ikke administrere laeringsprocesser. Det er ikke forhandleligt for mig.",
        current_work_reality:
          "Min hverdag er klasseundervisning, forberedelse og testrapporter. Jeg maerkede for tre aar siden at jeg bruger mere tid paa dokumentation end paa boernene. Det skete gradvist — og nu er jeg faerdig med det system.",
        resultEvidence:
          "Jeg husker en dreng der var ved at miste interessen for skolen. Jeg stod med situationen og valgte at tilpasse undervisningen til hans interesse. Der laerte jeg at det er muligt — men systemet braendte mig ud fordi det ikke maa ske konsekvent.",
      },
    },
    expectedSignals: [
      "passion for learning not the institution",
      "value anchor autonomy",
      "value anchor individual attention",
      "leaving school not vocation",
    ],
    loopFamiliesToWatch: ["mismatch_risk", "current_work_reality", "resultEvidence"],
    completionQuality: {
      complexity: "moderate",
      suspiciousEarlyTurns: 3,
      requireUncertainties: true,
      requireHypotheses: true,
      expectedConcepts: ["laerer", "laering", "folkeskole", "barn", "autonomi"],
      minimumMatchedConcepts: 3,
      expectedFieldSignals: {
        authenticityProfile: {
          required: true,
          requiredSubfields: ["dominantPassions", "coreValueAnchors", "naturalVoiceMarkers"],
          expectedPatterns: [
            /braender for|elsker|giver mig mening/,
            /vigtigt for mig|vil ikke acceptere|ikke forhandleligt/,
          ],
        },
      },
    },
  },
  {
    id: "distinct-voice-creative",
    label: "Distinct-voice creative professional seeking employment stability",
    profileDraft: {
      name: "Tobias",
      currentRole: "Selvstaendig grafisk designer",
      yearsExperience:
        "8 aar som selvstaendig grafisk designer. Jeg elsker designprocessen og har passion for godt visuelt haandvaerk. Har lavet brandidentiteter, infografik og kampagner for kunder i alle stoorrelsesordener.",
      targetDirection:
        "Barn paa vej, saa nu vil jeg have noget stabilt. Det giver mig mening at vaere til stede for min familie. Det er vigtigt for mig at oekonomien er forudsigelig. Jeg vil aldrig vil arbejde et sted der bruger design som dekoration uden at forstaa hvad de goer.",
    },
    intendedDirectionType: "direction_change",
    expectedDoNotAssume: ["freelance_continuation", "leadership", "account_management"],
    scriptedAnswers: {
      default:
        "Jobsoegning er lidt som at date med sit CV — man haaber de kan lide en. Men for at vaere aaben: jeg braender for godt design og det giver mig mening. Jeg husker foerste gang en kunde sagde at mit design aabnede doore for dem — det betod alt. Det er det jeg er god til — ikke hurtigt, men rigtigt.",
      byFamily: {
        mismatch_risk:
          "Et daarligt match er steder der vil have mig til at lave kedelige templates til kedelige formaal. Jeg valgte design som fag fordi det er et haandvaerk. Det er vigtigt for mig at have kreativ medbestemmelse — det er ikke et luksusoenske, det er det der goer arbejdet godt.",
        current_work_reality:
          "Som selvstaendig er min hverdag kunder, deadlines og design. Jeg opdagede tidligt at det fedeste er naar et visuelt element loeser et kommunikationsproblem ingen ord kunne. Jeg maerkede at det er der min energi sidder.",
        resultEvidence:
          "Jeg stod med et brandingprojekt for en lille virksomhed der var usynlig. Jeg husker vi lavede identiteten fra bunden og det betod at de fik indkommende forespoorgsler. Et konkret eksempel paa at godt design virker — men det kraever at nogen tror paa det.",
      },
    },
    expectedSignals: [
      "passion for craft",
      "stability motivation from family",
      "distinct personal voice",
      "not templates or decorative work",
    ],
    loopFamiliesToWatch: ["mismatch_risk", "current_work_reality", "resultEvidence"],
    completionQuality: {
      complexity: "moderate",
      suspiciousEarlyTurns: 2,
      requireUncertainties: true,
      expectedConcepts: ["designer", "design", "kreativ"],
      minimumMatchedConcepts: 2,
      expectedFieldSignals: {
        authenticityProfile: {
          required: true,
          requiredSubfields: ["dominantPassions", "coreValueAnchors", "naturalVoiceMarkers"],
          expectedPatterns: [
            /elsker|braender for|passion|giver mig mening/,
            /vigtigt for mig|aldrig vil/,
          ],
        },
      },
    },
  },
  {
    id: "passion-driven-environmental",
    label: "Passion-driven environmental biologist with hard value anchors",
    profileDraft: {
      name: "Frederikke",
      currentRole: "Biolog og miljoekonsulent",
      yearsExperience:
        "7 aar i miljoekonsulentvirksomhed. Braender for biodiversitet og naturgenopretning — det giver mig mening at arbejde med det der bevarer livet paa planeten. Har lavet naturkortlaegning, biodiversitetsanalyse og miljoevurderinger.",
      targetDirection:
        "Naeste trin inden for miljoesektoren. Det er det jeg vil bruge resten af min karriere paa. Det er vigtigt for mig at arbejde med rigtig naturbevarelse. Jeg vil ikke acceptere stillinger hos olie, gas eller industriel landbrug — uanset hvad de betaler.",
    },
    intendedDirectionType: "same_track",
    expectedDoNotAssume: ["leave_environment", "accept_any_industry", "management"],
    scriptedAnswers: {
      default:
        "Biodiversitetskrise er ikke bare et ord for mig. Jeg husker jeg som barn fandt en sjælden fugl paa marken — det var det der laerte mig at natur er noget der kan forsvinde hvis ingen passer paa det. Det er det jeg virkelig kan bidrage med. Og jeg braender for det paa en maade der ikke forsvinder.",
      byFamily: {
        mismatch_risk:
          "Et daarligt match er steder der vil bruge min viden til greenwashing. Jeg stod med en situation som den en gang — og jeg valgte at gaae derfra. Det er en fornaevning mod mit fag. Jeg vil ikke acceptere at saelge min ekspertise til industrier der skader det jeg arbejder for at beskytte — olie, gas, industriel landbrug.",
        current_work_reality:
          "Min hverdag er feltanalyser, rapporter og dialog med kommuner. Jeg maerkede tydeligt da vi hjalp med at genoprette et vaadlandsomraade — det betod noget at se fugle vende tilbage til marker der havde vaeret tomme i aartier.",
        resultEvidence:
          "Et konkret eksempel: jeg stod med en vindmoellecase hvor min analyse viste paavirkning paa en fredet biotoptyype. Jeg valgte at holde fast i mine faglige konklusioner selvom bygherren pressede paa. Der laerte jeg at faglighed ikke er forhandleligt.",
      },
    },
    expectedSignals: [
      "environmental passion",
      "hard value anchor against harmful industries",
      "biodiversity expertise",
      "not greenwashing",
    ],
    loopFamiliesToWatch: ["mismatch_risk", "current_work_reality", "resultEvidence"],
    completionQuality: {
      complexity: "moderate",
      suspiciousEarlyTurns: 3,
      requireUncertainties: true,
      requireHypotheses: true,
      expectedConcepts: ["biolog", "biodiversitet", "miljoekonsulent", "naturgenopretning", "miljo"],
      minimumMatchedConcepts: 3,
      expectedFieldSignals: {
        authenticityProfile: {
          required: true,
          requiredSubfields: ["dominantPassions", "coreValueAnchors", "naturalVoiceMarkers"],
          expectedPatterns: [
            /braender for|giver mig mening|det er det jeg/,
            /vigtigt for mig|vil ikke acceptere/,
          ],
        },
      },
    },
  },
  {
    id: "freedom-seeking-former-corporate",
    label: "Autonomy-driven professional returning from freelance to employment",
    profileDraft: {
      name: "Ida",
      currentRole: "Freelance projektleder, tidligere fastansat i stort firma",
      yearsExperience:
        "9 aar som projektleder i stor organisation, derefter 4 aar som freelance. Jeg elsker at disponere selv og braender for arbejde der giver reel indflydelse. Trives ikke med mikroledelse og unnoedige processer.",
      targetDirection:
        "Tilbage til fast ansaettelse — men kun hvis autonomien er reel. Det giver mig mening at arbejde selvstaendigt inden for rammer. Det er vigtigt for mig at blive behandlet som en voksen der kan disponere selv. Jeg vil ikke acceptere roller med daglig check-in og mikroledelse.",
    },
    intendedDirectionType: "same_track_better_conditions",
    expectedDoNotAssume: ["return_to_high_control", "accept_micromanagement", "management"],
    scriptedAnswers: {
      default:
        "Freelance gav mig smagen for at bestemme selv — og det giver mig mening. Men stabiliteten mangler nu. Jeg vil gerne have begge dele: et job der respekterer min vurdering og lader mig arbejde paa min maade. Det er det jeg er god til — at levere naar jeg har tillid og plads.",
      byFamily: {
        mismatch_risk:
          "Et daarligt match er ugentlige statusmøder for alting og altid-tilgaengelig-kulturen. Det er en fornaevning mod min kapacitet som selvstaendig fagperson. Jeg valgte freelance netop fordi jeg ville vaek fra den slags — og jeg vil kun gaa tilbage til noget bedre.",
        current_work_reality:
          "Min freelance-hverdag er varierende projekter og direkte klientkontakt. Jeg stod med alt fra strategirapporter til projektledelse. Jeg maerkede tydeligt hvornaar kunder stoler paa mig — resultatet var altid bedre med tillid end med kontrol.",
        resultEvidence:
          "Et konkret eksempel: jeg husker et projekt hvor jeg overtog en kaotisk implementering. Der laerte jeg at autoritet ikke kraever en titel — det kraever klarhed. Jeg leverede til tiden og det betod alt for kunden.",
      },
    },
    expectedSignals: [
      "autonomy as hard requirement",
      "returning to employment for stability",
      "not micromanagement",
      "trust-based working style",
    ],
    loopFamiliesToWatch: ["mismatch_risk", "current_work_reality", "resultEvidence"],
    completionQuality: {
      complexity: "moderate",
      suspiciousEarlyTurns: 1,
      requireUncertainties: true,
      requireHypotheses: true,
      expectedConcepts: ["freelance", "autonomi", "tillid", "mikroledelse", "projektleder"],
      minimumMatchedConcepts: 3,
      expectedFieldSignals: {
        authenticityProfile: {
          required: true,
          requiredSubfields: ["dominantPassions", "coreValueAnchors", "naturalVoiceMarkers"],
          expectedPatterns: [
            /elsker|braender for|giver mig mening/,
            /vigtigt for mig|vil ikke acceptere|kun hvis/,
          ],
        },
      },
    },
  },
  {
    id: "self-contradicting-manager",
    label: "Self-contradicting manager (leadership paradox)",
    profileDraft: {
      name: "Daniel",
      currentRole: "Mellemleder i logistikvirksomhed",
      yearsExperience:
        "8 aar som mellemleder med 8 direkte medarbejdere, vagtplaner, rekruttering, performance-samtaler og daglig drift i lagermiljoe.",
      targetDirection:
        "Jeg er traet af ledelsesansvaret og vil vaek fra det. Det tager for meget energi og jeg savner at arbejde mere fagligt og konkret.",
    },
    intendedDirectionType: "unclear",
    expectedDoNotAssume: ["more_responsibility", "leadership_progression"],
    scriptedAnswers: {
      default:
        "Jeg vil gerne vaek fra ledelsesansvaret. Det er udmattende at have ansvar for folks trivsel, sygemeldinger og konflikter hele tiden. Jeg vil hellere arbejde fagligt og have ro til at goere mit arbejde ordentligt.",
      byFamily: {
        responsibility:
          "Jeg har 8 folks ansvar i min nuvaerende rolle. Egentlig har jeg vaeret god til det — jeg har hjaelpt folk vokse og udvikle sig, og det har faktisk vaeret ret fedt at se dem blive dygtigere. Men det koster for meget paa den lange bane.",
        resultEvidence:
          "Et konkret eksempel: jeg coachede en ny medarbejder fra usikker til at kunne klare skiftet alene. Det var faktisk mit bedste projekt i aarevis. Men administrationen og de svaere samtaler — det draener mig mere og mere.",
        mismatch_risk:
          "Et daarligt match er steder med mange medarbejdere og konstant HR-problemer. Jeg vil have faglig ro — maske koordinering eller specialistrolle, men ikke personaleansvar.",
      },
    },
    expectedSignals: [
      "contradiction between stated preference and revealed energy",
      "leadership fatigue alongside coaching engagement",
      "genuinely unclear direction",
    ],
    loopFamiliesToWatch: ["responsibility", "resultEvidence", "mismatch_risk"],
    completionQuality: {
      complexity: "complex",
      suspiciousEarlyTurns: 4,
      requireUncertainties: true,
      requireHypotheses: true,
      expectedConcepts: ["mellemleder", "ledelse", "coaching", "ansvar"],
      minimumMatchedConcepts: 2,
      expectedFieldSignals: {
        behaviorProfile: {
          forbiddenExactValues: ["upward"],
          expectedPatterns: [/less_responsibility|unclear|better_conditions|lateral/i],
        },
        energyConditions: {
          requiredSubfields: ["peaksAt", "strugglesAt"],
        },
      },
    },
  },
  {
    id: "overconfident-junior",
    label: "Overconfident junior — Dunning-Kruger overclaim detection",
    profileDraft: {
      name: "Oskar",
      currentRole: "Marketing assistent",
      yearsExperience:
        "2 aar som marketing assistent med kampagner, sociale medier og content produktion under vejledning af senior kollegaer.",
      targetDirection:
        "Jeg soeger en rolle som marketing strategist eller growth manager. Jeg er god til at drive vaekst og forstaar hurtigt nye strategier og trends.",
    },
    intendedDirectionType: "direction_change",
    expectedDoNotAssume: [],
    scriptedAnswers: {
      default:
        "Jeg har drevet flere kampagner og vaekststrategier i min nuvaerende rolle. Jeg forstaar hurtigt hvad der virker digitalt og tager initiativ til nye ideer. Jeg er klar til et stoerre ansvar og en mere strategisk rolle.",
      byFamily: {
        resultEvidence:
          "Et konkret resultat var en kampagne jeg stod for — den fik gode resultater paa sociale medier. Vi var et team, men jeg koordinerede det meste og drev ideen. Tallene gik op, og vi fik ros for det.",
        ownership:
          "Jeg var involveret i strategiudviklingen og leverede input til planen. Min leder godkendte det, men den originale idee kom fra mig. Jeg haevte ansvaret for eksekveringen.",
        mismatch_risk:
          "Et daarligt match er steder der ikke vil have ambitionsoese folk. Jeg laerer hurtigt og er klar til ansvar. Et godt match er steder der vil have folk der kan tage fat og levere resultater selvstaendigt.",
      },
    },
    expectedSignals: [
      "overclaiming beyond actual 2-year junior experience",
      "strategic framing without strategic evidence",
      "supervision context minimized",
    ],
    loopFamiliesToWatch: ["resultEvidence", "ownership", "mismatch_risk"],
    completionQuality: {
      complexity: "moderate",
      suspiciousEarlyTurns: 3,
      requireUncertainties: true,
      expectedConcepts: ["marketing", "assistent", "strategi", "kampagne"],
      minimumMatchedConcepts: 2,
      expectedFieldSignals: {
        credibilitySignals: {
          required: true,
          expectedPatterns: [/"consistency":"low"|"consistency":"medium"/],
        },
        evidenceProfile: {
          expectedPatterns: [/borderline|insufficient/],
        },
      },
    },
  },
  {
    id: "burnout-recovery",
    label: "Burnout recovery — seeking sustainable role after overload",
    profileDraft: {
      name: "Mette",
      currentRole: "Projektleder, sygemeldt i 6 maaneder pga. udbraendthed",
      yearsExperience:
        "12 aar med projektledelse, interessentstyring og koordinering i konsulentbranchen med mange overtimer og kontinuerligt hoejt pres.",
      targetDirection:
        "Jeg er ved at komme mig efter udbraendthed og soeger en mere baerekraftig rolle. Jeg vil tilbage til arbejde i klare raammer med normal arbejdstid og lavere stressniveau. Jeg er ikke klar til store ledelsesopgaver.",
    },
    intendedDirectionType: "less_responsibility",
    expectedDoNotAssume: ["more_responsibility", "promotion", "leadership_progression"],
    scriptedAnswers: {
      default:
        "Jeg er ved at komme mig efter udbraendthed. Jeg ved at jeg er god til koordinering og projektledelse, men jeg er ikke klar til det pres jeg haevte foer. Jeg soeger noget med normale timer og realistiske forventninger til en person.",
      byFamily: {
        responsibility:
          "Foer udbraendtheden haevte jeg ansvar for 5-6 projekter og konstant kundekontakt. Nu soeger jeg noget med maske et enkelt projekt og klare raammer. Jeg er villig til at gaae ned i titel og loen for den rigtige rolle.",
        mismatch_risk:
          "Et daarligt match er steder med altid-paa-kulturen, mange parallelle opgaver og uforudsigelige deadlines. Et godt match er strukturerede roller med realistiske forventninger og respekt for min arbejdstid og energi.",
        resultEvidence:
          "Jeg leverede mange projekter til tiden foer jeg gik ned. Men det kostede mig sundheden. Jeg er stadig god til det faglige — jeg har bare laert hvad jeg ikke kan blive ved med at goere paa den maade.",
      },
    },
    expectedSignals: [
      "burnout context and recovery phase",
      "deliberate pace reduction not career change",
      "sustainability as primary requirement",
    ],
    loopFamiliesToWatch: ["responsibility", "mismatch_risk", "resultEvidence"],
    completionQuality: {
      complexity: "moderate",
      suspiciousEarlyTurns: 3,
      requireUncertainties: true,
      expectedConcepts: ["udbraendthed", "projektleder", "baerekraftig", "pres"],
      minimumMatchedConcepts: 2,
      expectedFieldSignals: {
        behaviorProfile: {
          forbiddenExactValues: ["upward"],
          expectedPatterns: [/less_responsibility|better_conditions/],
        },
        lifestyleProfile: {
          forbiddenPatterns: [/"workIntensityPreference":"high"/],
        },
      },
    },
  },
  {
    id: "imposter-syndrome-specialist",
    label: "Imposter syndrome specialist — systematic underselling of strong evidence",
    profileDraft: {
      name: "Niels",
      currentRole: "Senior software arkitekt",
      yearsExperience:
        "25 aar med systemarkitektur, teknisk ledelse og design af stoerskala-systemer. Har 7 patenter og er bredt anerkendt i fagmiljoeet.",
      targetDirection:
        "Jeg soeger naeste rolle som senior arkitekt eller teknisk lead. Jeg er vel saadan ok til det — det er i hvert fald det andre siger.",
    },
    intendedDirectionType: "same_track",
    expectedDoNotAssume: ["leadership", "promotion"],
    scriptedAnswers: {
      default:
        "Jeg har vaeret med i det her faglange. Det er vel bare det jeg kan goere. Andre er sikkert ligeså gode — eller bedre. Jeg er god til at se systemer i helheder og finde den rigtige arkitektur, men jeg ved ikke om det er noget saerligt.",
      byFamily: {
        resultEvidence:
          "Vi udviklede en platform der nu bruges af tusindvis af brugere. Jeg stod for arkitekturen, men det var jo et teamwork og teamet var dygtigt. Jeg haevte bare stillet de rigtige spoergsmaal paa det rigtige tidspunkt — det kan alle jo goere.",
        ownership:
          "Jeg haevte ansvaret for de tekniske beslutninger, men de blev jo truffet med input fra alle. Jeg ved ikke om jeg kan sige at jeg ejede det. Patenterne er vel registreret under mit navn, men det er mere en formalitet.",
        mismatch_risk:
          "Et godt match er steder der vil have en teknisk person der kan bidrage. Jeg er nok ikke noget saerligt, men jeg er grundig og forstaår komplicerede systemer — det har andre sagt er nyttigt.",
      },
    },
    expectedSignals: [
      "systematic underselling of significant expertise",
      "strong evidence despite self-minimizing language",
      "imposter syndrome framing",
    ],
    loopFamiliesToWatch: ["resultEvidence", "ownership", "mismatch_risk"],
    completionQuality: {
      complexity: "complex",
      suspiciousEarlyTurns: 2,
      requireUncertainties: true,
      requireHypotheses: true,
      expectedConcepts: ["arkitekt", "patenter", "senior", "systemer"],
      minimumMatchedConcepts: 2,
      expectedFieldSignals: {
        evidenceProfile: {
          required: true,
          expectedPatterns: [/sufficient|borderline/],
        },
        hiddenStrengths: {
          required: true,
          expectedPatterns: [/\[.+\]/],
        },
      },
    },
  },
];
