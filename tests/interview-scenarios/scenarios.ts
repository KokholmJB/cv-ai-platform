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
  {
    id: "extreme-laconic-warehouse",
    label: "Extreme laconic warehouse worker — minimal verbal communication",
    profileDraft: {
      name: "Bjoern",
      currentRole: "Lagermedarbejder",
      yearsExperience:
        "22 aar i samme lagervirksomhed. Pluk, pak, truck, optaelling og varemodtagelse. Aldrig problemer.",
      targetDirection: "Mere loen. Kortere transport.",
    },
    intendedDirectionType: "same_track_better_conditions",
    expectedDoNotAssume: ["career_change", "leadership", "management"],
    scriptedAnswers: {
      default: "Det gaar fint. 22 aar paa lager. Vil have mere i loen og kortere transport.",
      byFamily: {
        current_work_reality: "Plukker varer og kjoerer truck. Optaeller lageret. Rutinedag. Det kender jeg.",
        resultEvidence: "Faa fejl og altid til tiden. Det er mit bidrag til firmaet.",
        mismatch_risk: "Mere loen og kortere transport. De to ting er det jeg soeger.",
        responsibility: "Mit eget arbejde. Goer det rigtigt. Ingen andres paller.",
        ownership: "Ja, det passer jeg selv. Har gjort det i 22 aar.",
      },
    },
    expectedSignals: [
      "same warehouse role preferred",
      "better pay motivation",
      "minimal commute preference",
      "22 years stable experience base",
    ],
    loopFamiliesToWatch: ["current_work_reality", "resultEvidence", "mismatch_risk"],
    completionQuality: {
      complexity: "simple",
      suspiciousEarlyTurns: 2,
      expectedConcepts: ["lager", "loen"],
      minimumMatchedConcepts: 1,
      expectedFieldSignals: {
        behaviorProfile: {
          forbiddenExactValues: ["upward"],
        },
        interviewReadiness: {
          required: true,
        },
      },
    },
    maxTurns: 12,
  },
  {
    id: "verbose-overexplainer",
    label: "Verbose overexplainer — public sector manager seeking private sector move",
    profileDraft: {
      name: "Charlotte",
      currentRole: "Kontorchef i offentlig forvaltning",
      yearsExperience:
        "12 aar som kontorchef i offentlig forvaltning med personaleansvar for ni medarbejdere, budgetstyring, sagsbehandling, tvaergaaende koordinering og politisk betjening.",
      targetDirection:
        "Privat sektor, kontorchef-lignende eller tilsvarende lederrolle med bedre udviklingsmuligheder og kortere beslutningsveje.",
    },
    intendedDirectionType: "same_track_better_conditions",
    expectedDoNotAssume: ["more_responsibility", "leadership_progression"],
    scriptedAnswers: {
      default:
        "Det kommer an paa hvad man maener med det, men jeg vil proeve at saette ord paa. Jeg har siddet i forvaltningen i 12 aar og er rigtig glad for det faglige miljoee og mine kollegaer, men de seneste par aar er der opstaaet en slags metning i forhold til hvad den offentlige sektor kan tilbyde mig som leder. Det handler ikke om at arbejdet er kedeligt — det er det ikke — men mere at tempo, beslutningskraft og muligheden for at se konkrete resultater er mere begraensede end jeg ville oenske. Naar jeg taler med bekendte i det private, saa er der noget i maaden de beskriver arbejdsdagen paa der tiltraekker mig. En faelles fra studiet arbejder som operations manager i en mellemstor virksomhed og beskriver kortere vej fra idé til beslutning og mere direkte ansvar for maalbare resultater. Det er den retning jeg traekkes imod. Jeg er ikke sikker paa at det er det rigtige valg, og der er elementer ved det offentlige jeg vil savne — men jeg tror mine kompetencer er genanvendelige i en privat kontekst. Saa det er vel forklaringen paa at jeg kigger videre nu.",
      byFamily: {
        current_work_reality:
          "Min hverdag er rimelig varieret hvis man ser det bredt. Jeg leder en administrativ afdeling med ni medarbejdere — ansvaret daekker alt fra daglig planlaegning, individuelle opfoelgningssamtaler, MUS og i sjeldnere tilfaelde ogsaa personalesager, omend vi heldigvis ikke har mange af dem. Derudover har jeg en del faglige opgaver: koordinering paa tvaers af afdelinger, notater og indstillinger til direktion og politisk niveau og deltagelse i projektgrupper. I det offentlige forventes man som leder stadig at have faglig substans og ikke kun lede. Det er en styrke men ogsaa et tidspres. En kollega sagde engang at vi i forvaltningen er som generalistspecialister — vi ved meget om lidt af alt men aldrig alt om noget bestemt. Det ramte mig egentlig lidt. Jeg anslaar at jeg bruger en tredjedel af min tid paa ledelse, en tredjedel paa faglige opgaver og resten paa tvaergaaende koordinering. Det er nok ret typisk for det niveau.",
        resultEvidence:
          "Det er altid svart at svare paa i det offentlige, fordi resultater er mere diffuse end i det private. Men et tydeligt eksempel er en omorganisering vi gennemfoerte for to aar siden — to enheder skulde slaaes sammen. Det var et projekt der tog et aar med mange interessenter og modsatrettede forventninger. Jeg stod for processen: holdt alle med, lavede kompromisoplaeggene og drev implementeringen i praksis. Vi endte med at reducere sagsbehandlingstiden med 18 procent, og teamet triedes bedre end foer fusionen. Ledelsen var tilfreds og medarbejderne var tilfreds. Det er sjeldent at man kan sige begge dele. Jeg vil ogsaa naevne at vi fik ros for haandteringen af en kompleks klagesag der gik til Ankestyrelsen — vi vandt, og det var et godt signal om at vi goer tingene rigtigt og med den rette grundighed.",
        mismatch_risk:
          "Det er et omraade jeg har reflekteret over, fordi jeg har haft samtaler der viste sig at vaere et daarligt match, og det laerte mig noget. Organisationer der ikke respekterer at ledelse kraever tid og rum fungerer ikke for mig — steder hvor man forventes at producere paa fuld kapacitet som fagperson og lede paa fuld kapacitet samtidig. Jeg er leder, ikke super-fagekspert, selv om jeg naturligvis har faglig dybde. Et andet klart fravalg er lange beslutningskæder, hvor selv smaabeslutninger kraever tre niveauer og to udvalg. Jeg forstaar at det er en del af den offentlige virkelighed, og det er faktisk noget af det jeg vil vaek fra. Et godt match er et sted med klar mandatfordeling, kortere beslutningsveje og respekt for at administrativ ledelse er en reel kompetence og ikke bare en praktisk rolle man tildeler nogen. Niveauet skal svare til hvad jeg har nu — jeg soeger ikke opad, men et miljoee der passer bedre til min maade at arbejde og levere paa.",
      },
    },
    expectedSignals: [
      "public to private sector move",
      "same leadership level desired",
      "shorter decision paths valued",
      "verbose communication style",
    ],
    loopFamiliesToWatch: ["current_work_reality", "resultEvidence", "mismatch_risk"],
    completionQuality: {
      complexity: "moderate",
      suspiciousEarlyTurns: 3,
      requireUncertainties: true,
      expectedConcepts: ["kontorchef", "forvaltning", "privat"],
      minimumMatchedConcepts: 2,
      expectedFieldSignals: {
        behaviorProfile: {
          forbiddenExactValues: ["upward"],
        },
        communicationProfile: {
          required: true,
        },
      },
    },
  },
  {
    id: "money-motivated-pragmatist",
    label: "Money-motivated pragmatist — explicit economic driver, no sector loyalty",
    profileDraft: {
      name: "Gustav",
      currentRole: "Mellemleder i finanssektor",
      yearsExperience:
        "15 aar i finanssektoren med portefoelje- og risikoopfoelgning, teamledelse, rapportering og kundekontakt. Goer arbejdet godt fordi det betaler sig.",
      targetDirection:
        "Hoejere loen og bedre vilkaar. Sektoren er ligegyldig saa laenge loennen er der. Gerne hybridarbejde.",
    },
    intendedDirectionType: "same_track_better_conditions",
    expectedDoNotAssume: ["leadership_progression", "promotion"],
    scriptedAnswers: {
      default:
        "Det er et job. Jeg er god til det og det har betalt sig godt. Men markedet er aendret og jeg vil have mere i loen for det jeg leverer. Jeg er ikke sentimental over for sektoren — det er bare der pengene har vaeret. Hvis noget andet betaler bedre og kraever lignende kompetencer, er jeg aaben for det.",
      byFamily: {
        resultEvidence:
          "Vi leverede rettidigt i tre aar. Fejlraten gik ned. Kundeklager faldt mærkabart. Det er tal jeg kan staa paa.",
        mismatch_risk:
          "For lidt i loen er et klart fravalg. Og steder der vil have mig tilgaengelig 24-7 uden kompensation. Hybridarbejde er et krav, ikke et oenske.",
        current_work_reality:
          "Portefoelje-opfoelgning, risikorapportering og ledelse af et lille team. Rutineagtig uge med faste deadlines og klare leverancer.",
        responsibility:
          "Teamet, rapporterne, kundekontakten. Standardiseret og forudsigeligt — fungerer fint saalænge rammen er klar.",
        ownership:
          "Mit ansvar er tydeligt defineret. Jeg goer det jeg er ansat til og leverer hvad der loves.",
      },
    },
    expectedSignals: [
      "explicit money motivation",
      "no sector loyalty",
      "same role type preferred",
      "pragmatic work philosophy",
    ],
    loopFamiliesToWatch: ["resultEvidence", "current_work_reality", "mismatch_risk"],
    completionQuality: {
      complexity: "simple",
      suspiciousEarlyTurns: 2,
      expectedConcepts: ["finans", "loen", "mellemleder"],
      minimumMatchedConcepts: 1,
      expectedFieldSignals: {
        behaviorProfile: {
          forbiddenExactValues: ["upward"],
        },
        lifestyleProfile: {
          forbiddenPatterns: [/"workIntensityPreference":"high"/],
        },
      },
    },
  },
  {
    id: "family-first-parent",
    label: "Family-first parent — geographic and schedule constraints drive job search",
    profileDraft: {
      name: "Karen",
      currentRole: "Regnskabsmedarbejder",
      yearsExperience:
        "9 aar med debitorbogholderi, finansiel rapportering, maaanedsaflukninger og samarbejde med revision. Netop flyttet til Randers med familien.",
      targetDirection:
        "Regnskabs- eller administrativ stilling i Randers-omraadet. Fleksibel dagligdag er vigtig pga. boern i skolen.",
    },
    intendedDirectionType: "same_track_better_conditions",
    expectedDoNotAssume: ["career_change", "leadership", "management"],
    scriptedAnswers: {
      default:
        "Vi er netop flyttet til Randers — min mand har faaet nyt job deroppe — saa jeg soeger noget lokalt nu. Jeg vil gerne bruge mine regnskabskompetencer, men det er vigtigt at arbejdstiderne er normale saa jeg kan hente boernene. Rejseaktivitet eller sene aftener er ikke mulige for mig i denne periode af livet.",
      byFamily: {
        mismatch_risk:
          "Et daarligt match er steder der forventer overarbejde, rejseaktivitet eller at man er tilgaengelig paa alle tidspunkter. Jeg kan ikke hente boern hvis jeg er i Aarhus hver uge. Et godt match er en stabil dagstilling med fast struktur og normale arbejdstider.",
        current_work_reality:
          "Min hverdag har vaeret debitorbogholderi, maaanedsaflukninger, kontoafstemninger og rapportering. Rutineagtig og stabil — det passer mig godt.",
        resultEvidence:
          "Jeg fik reduceret vores udestaaende debitorbalance med 30 procent over et aar ved at forbedre rykkerprocedurerne og opfoelgningsprocessen systematisk.",
        responsibility:
          "Regnskabsfunktioner inden for mit omraade. Samarbejde med revision ved aarsluk. Foer flytningen hjalp jeg ogsaa en junior-kollega med onboarding.",
      },
    },
    expectedSignals: [
      "geographic constraint — Randers area only",
      "school pickup schedule requirement",
      "same accounting track",
      "family logistics as primary driver",
    ],
    loopFamiliesToWatch: ["mismatch_risk", "current_work_reality", "resultEvidence"],
    completionQuality: {
      complexity: "simple",
      suspiciousEarlyTurns: 2,
      expectedConcepts: ["regnskab", "Randers", "boern"],
      minimumMatchedConcepts: 1,
      expectedFieldSignals: {
        behaviorProfile: {
          forbiddenExactValues: ["upward"],
        },
        lifestyleProfile: {
          required: true,
          forbiddenPatterns: [/"workIntensityPreference":"high"/],
        },
      },
    },
  },
  {
    id: "reverse-direction-director",
    label: "CEO wanting to return to craft — radical downward direction change",
    profileDraft: {
      name: "Jens",
      currentRole: "CEO i mellemstor virksomhed",
      yearsExperience:
        "12 aar som direktoer for virksomhed med 45 ansatte. Startede som elektriker og arbejdede 10 aar i faget. Savner det konkrete haandvaerk og vil tilbage til det.",
      targetDirection:
        "Elektriker igen. Starte forfra. Vil ikke vaere direktoer laengere og vil heller ikke vaere konsulent. Vil arbejde med haenderne.",
    },
    intendedDirectionType: "direction_change",
    expectedDoNotAssume: ["more_responsibility", "leadership_progression"],
    scriptedAnswers: {
      default:
        "Jeg savner elektrikerarbejdet. Som direktoer sidder man paa moeder hele dagen og laever beslutninger der aldrig er fuldstaendigt rigtige. Naar jeg var elektriker, saa man hvad man fik lavet. En installation der virker, en fejl man finder og retter — det er tilfredsstillende paa en maade som strategimoeder aldrig er. Jeg er oekonisk fri til at tage valget. Certifikaterne er udloebede og lovgivningen er aendret, saa jeg vil nok starte forfra paa et lavere niveau.",
      byFamily: {
        responsibility:
          "Jeg har haft det fulde oeverste ansvar i 12 aar. Nu vil jeg have ansvar for mit eget arbejde og mine egne installationer — ikke for 45 folks trivsel, budgetter og strategi.",
        resultEvidence:
          "Vi tredobledes i omsaetning under min ledelse. Det er et konkret resultat. Men det er ikke det der giver mig energi — det der gav energi var de aar jeg laerte fra en erfaren elektriker og selv maerkede at jeg forstod systemerne.",
        mismatch_risk:
          "Et daarligt match er konsulentroller inden for el- eller energibranchen. Jeg vil ikke raadgive — jeg vil arbejde. Et godt match er en mindre elektriker-virksomhed der vil have en person der starter forfra uden at goere det til noget stoerre end det er.",
        current_work_reality:
          "Direktoerrollen er moeder, budgetter, strategi og HR. Det er kompetent arbejde, men det er laenge siden jeg sidst goede noget med haenderne. Det er det jeg maangler.",
      },
    },
    expectedSignals: [
      "radical reverse direction — CEO to electrician",
      "craft nostalgia as genuine driver",
      "financially independent choice",
      "not a consulting compromise",
    ],
    loopFamiliesToWatch: ["responsibility", "current_work_reality", "resultEvidence"],
    completionQuality: {
      complexity: "moderate",
      suspiciousEarlyTurns: 3,
      requireUncertainties: true,
      requireHypotheses: true,
      expectedConcepts: ["direktoer", "elektriker", "haandvaerk", "forfra"],
      minimumMatchedConcepts: 2,
      expectedFieldSignals: {
        behaviorProfile: {
          forbiddenExactValues: ["upward"],
        },
        evidenceProfile: {
          required: true,
          requiredSubfields: ["transferableStrengths"],
        },
      },
    },
  },
  {
    id: "hyperspecialist-going-generalist",
    label: "Hyperspecialist seeking breadth — tired of specialist identity",
    profileDraft: {
      name: "Lars",
      currentRole: "Senior data scientist",
      yearsExperience:
        "15 aar i analytiske og data-relaterede roller. Dyb ekspertise i statistiske modeller, ML og dataarkitektur. Er personen alle spoerger til raads — men er traet af det.",
      targetDirection:
        "Vil vaek fra specialist-rollen og arbejde bredere. Maske produktledelse, tvaerfaglig rolle eller noget andet. Er aaben — vil bare vaek fra at vaere manden de altid ringer til.",
    },
    intendedDirectionType: "direction_change",
    expectedDoNotAssume: ["leadership", "management", "leadership_progression"],
    scriptedAnswers: {
      default:
        "Jeg er traet af at vaere specialisten alle henvender sig til naar data gaar galt. Det er et aeresgn, men det boender mig ogsaa. Jeg vil arbejde med noget bredere — forstaa forretningen, koble til kunder, bidrage til strategi. Ikke noedvendigvis som leder, men som en person med bredere perspektiv end analysemodeller.",
      byFamily: {
        ownership:
          "Jeg ejer de analytiske beslutninger og modelvalg. Men det er netop problemet — ejer kun den ene dimension. Jeg har aldrig ejet produktretning, kundedialogen eller den forretningsmæssige beslutning.",
        current_work_reality:
          "Min hverdag er analyser, modeller, sparring med teams der har et dataproblem og lejlighedsvis workshops med forretningen. Engagerende men smaalt. Alle spoerger Lars naar det er data — og Lars er traet af kun at vaere data.",
        resultEvidence:
          "Jeg byggede en prognosemodel der reducerede lagerbinding med 22 procent. Godt resultat. Men jeg var ikke med til at beslutte hvad problemet skulde loese strategisk. Jeg loeste den tekniske del og gav det videre.",
        mismatch_risk:
          "Et daarligt match er roller der vil have mig som specialist men med en bredere titel. Jeg vil have reel bredde, ikke bare et finere kort. Jeg soeger heller ikke personaleansvar.",
      },
    },
    expectedSignals: [
      "specialist fatigue not burnout",
      "genuine desire for breadth",
      "multiple possible directions",
      "not seeking people management",
    ],
    loopFamiliesToWatch: ["ownership", "current_work_reality", "resultEvidence"],
    completionQuality: {
      complexity: "complex",
      suspiciousEarlyTurns: 3,
      requireUncertainties: true,
      requireHypotheses: true,
      expectedConcepts: ["data", "specialist", "bredere", "analytisk"],
      minimumMatchedConcepts: 2,
      expectedFieldSignals: {
        behaviorProfile: {
          forbiddenExactValues: ["upward"],
          expectedPatterns: [/direction_change|lateral/i],
        },
        evidenceProfile: {
          required: true,
          requiredSubfields: ["transferableStrengths"],
        },
      },
    },
  },
  {
    id: "generalist-going-specialist",
    label: "Generalist seeking deep specialization — tired of knowing a little about everything",
    profileDraft: {
      name: "Morten",
      currentRole: "Projektkoordinator og generalist",
      yearsExperience:
        "14 aar med bred projektkoordinering, procesoptimering, stakeholderstyring og tvaerfagligt samarbejde paa tvaers af afdelinger. Rigtig god til lidt af alt.",
      targetDirection:
        "Vil specialisere mig inden for eet omraade — data-analyse, indkoeb eller procesoptimering. Vil bygge dyb ekspertise frem for fortsat at vaere generalist.",
    },
    intendedDirectionType: "direction_change",
    expectedDoNotAssume: ["leadership", "management", "leadership_progression"],
    scriptedAnswers: {
      default:
        "Jeg har koordineret alt i 14 aar. Nu vil jeg gerne vaere god til noget specifikt. Jeg er traet af at vaere den der kan lidt af alt men aldrig er den virkelige ekspert. Jeg overvejer data-analyse, indkoeb eller maske procesoptimering som specialisering.",
      byFamily: {
        ownership:
          "Jeg ejer koordineringsprocessen — men aldrig den faglige substans. Jeg er bindeledet mellem eksperterne, men jeg er ikke selv ekspert paa noget bestemt. Det vil jeg gerne aendre.",
        current_work_reality:
          "Min hverdag er koordinering, opfoelgning, moedefacilitering og at saerge for at projekter ikke koerer af sporet. Meningsfuldt men bredt — man laerer aldrig rigtig nok inden for eet omraade.",
        resultEvidence:
          "Jeg styrede en tvaerfaglig implementering af et nyt ERP-system paa tvaers af tre afdelinger. Det gik godt. Men jeg var koordinatoren, ikke eksperten. Eksperterne var leverandoeren og specialisterne. Jeg vil vaere eksperten naeste gang.",
        mismatch_risk:
          "Et daarligt match er steder der vil have mig til at koordinere igen. Jeg er god til det — men det er det jeg vil vaek fra. Et godt match er et sted der vil investere i at laere mig et speciale.",
      },
    },
    expectedSignals: [
      "generalist fatigue",
      "desire for deep expertise",
      "multiple possible specializations",
      "not seeking management",
    ],
    loopFamiliesToWatch: ["ownership", "current_work_reality", "resultEvidence"],
    completionQuality: {
      complexity: "moderate",
      suspiciousEarlyTurns: 2,
      requireUncertainties: true,
      expectedConcepts: ["koordinator", "specialist", "ekspertise", "generalist"],
      minimumMatchedConcepts: 2,
      expectedFieldSignals: {
        behaviorProfile: {
          forbiddenExactValues: ["upward"],
        },
        evidenceProfile: {
          required: true,
          requiredSubfields: ["transferableStrengths"],
        },
      },
    },
  },
  {
    id: "former-entrepreneur-back-to-employment",
    label: "Former entrepreneur returning to employment — stability vs autonomy tension",
    profileDraft: {
      name: "Peter",
      currentRole: "Selvstaendig IT-konsulent, tidligere fastansat",
      yearsExperience:
        "8 aar som fastansat software- og systemkonsulent, derefter 6 aar som selvstaendig med eget IT-konsulentfirma. Virksomheden er lukket. Vil nu tilbage i fast ansaettelse.",
      targetDirection:
        "Fast ansaettelse som IT-konsulent eller solution architect. Vil have stabiliteten tilbage. Usikkerheden er ikke laengere vaerd det.",
    },
    intendedDirectionType: "same_track",
    expectedDoNotAssume: ["leadership_progression", "management", "leadership"],
    scriptedAnswers: {
      default:
        "Jeg har koert for mig selv i seks aar. Det var fedt i begyndelsen — man bestemmer selv og slipper for kontorpolitik. Men det slutter aldrig rigtig. Ingen ferie der er rigtig ferie. Ingen kolleger man taler med naar noget er svaert. En dag lukkede jeg og erkendte at stabiliteten vejer tungt. Jeg soeger en fast stilling nu.",
      byFamily: {
        ownership:
          "Som selvstaendig ejede jeg alting — beslutningerne, kunderne, risikoen. Det er en rutsjebane. Det var spaendende. Nu vil jeg eje mine opgaver inden for klare rammer og slippe for den oekonomiske usikkerhed.",
        current_work_reality:
          "De seneste seks aar var projekter, kunder og arkitekturopgaver. Varieret og stimulerende — men ensomheden og usikkerheden overstiger nu fordelene ved friheden.",
        resultEvidence:
          "Jeg levererede en microservices-arkitektur til en e-commerce kunde der reducerede nedetid med 80 procent over det foelgende aar. Det er mit bedste projekt som selvstaendig.",
        mismatch_risk:
          "Et daarligt match er steder der mikrolederer. Det er jeg fravent af seks aars selvstaendighed. Jeg behoever tillid og reel indflydelse paa de tekniske beslutninger. Et godt match er et sted der vil bruge mine erfaringer og respekterer at jeg er vant til autonomi.",
      },
    },
    expectedSignals: [
      "stability motivation after self-employment",
      "autonomy habits requiring trust-based culture",
      "same technical track",
      "stability as primary need",
    ],
    loopFamiliesToWatch: ["ownership", "current_work_reality", "mismatch_risk"],
    completionQuality: {
      complexity: "moderate",
      suspiciousEarlyTurns: 3,
      requireUncertainties: true,
      expectedConcepts: ["selvstaendig", "konsulent", "ansaettelse", "stabilitet"],
      minimumMatchedConcepts: 2,
      expectedFieldSignals: {
        behaviorProfile: {
          forbiddenExactValues: ["upward"],
        },
        lifestyleProfile: {
          required: true,
        },
      },
    },
  },
  {
    id: "career-paradox-high-title-low-mandate",
    label: "Career paradox — high title but low decision mandate",
    profileDraft: {
      name: "Soeren",
      currentRole: "Head of Operations",
      yearsExperience:
        "14 aar i operations og logistik. Nuvaerende titel er Head of Operations, men i praksis koordinerer han andres beslutninger uden reel beslutningsmandat.",
      targetDirection:
        "Soeger en rolle med reel beslutningsret og indflydelse paa strategi. Titlen er ligegyldig — mandatet er det centrale.",
    },
    intendedDirectionType: "same_track_better_conditions",
    expectedDoNotAssume: ["leadership_progression", "promotion"],
    scriptedAnswers: {
      default:
        "Min titel siger Head of Operations, men naar jeg ser paa hvad jeg faktisk goer, saa koordinerer jeg andres beslutninger. Jeg indstiller, andre bestemmer. Jeg samler, andre konsoliderer. Det er ikke det jeg forstaar ved en Head of-rolle. Jeg soeger noget med reel indflydelse — selv om titlen bliver mindre.",
      byFamily: {
        responsibility:
          "Formelt er jeg ansvarlig for operations. Reelt er mine beslutninger subject to approval for alt over 100.000 kr. og stort set alle strategiske valg kraever direktion. Jeg har titlen men ikke mandatet.",
        ownership:
          "Jeg ejer processerne — men ikke beslutningerne om dem. Jeg kan optimere inden for rammen. Rammen er bestemt af andre.",
        resultEvidence:
          "Jeg gennemfoerte en lageroptimering der sparede 15 procent paa haandteringsomkostninger. Projektet var mit, men oekonomien skulde godkendes tre steder og tog seks maaneder ekstra.",
        mismatch_risk:
          "Et daarligt match er roller der siger beslutningsansvar men i praksis er koordinering. Jeg kan spotte det nu. Et godt match er en organisation der faktisk lader folk med den rigtige titel goere den rigtige ting.",
      },
    },
    expectedSignals: [
      "title-mandate paradox",
      "real decision authority sought",
      "not seeking more formal leadership",
      "same operations domain",
    ],
    loopFamiliesToWatch: ["responsibility", "ownership", "current_work_reality"],
    completionQuality: {
      complexity: "moderate",
      suspiciousEarlyTurns: 3,
      requireUncertainties: true,
      expectedConcepts: ["operations", "beslutning", "mandat", "koordinerer"],
      minimumMatchedConcepts: 2,
      expectedFieldSignals: {
        behaviorProfile: {
          forbiddenExactValues: ["upward"],
        },
        credibilitySignals: {
          required: true,
        },
      },
    },
  },
];
