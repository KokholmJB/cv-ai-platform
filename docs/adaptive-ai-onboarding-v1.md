# Adaptive AI Onboarding v1

## Direction Snapshot

This document is scoped to the currently confirmed JobPilot direction:

- JobPilot is an AI job-search operating system, not a CV builder
- the strongest initial wedge is decision quality: should the user apply, and why
- onboarding is not a generic intake form; it is the first structured intelligence layer behind later job-fit decisions
- v1 is Denmark-only and Danish-only
- the architecture must avoid dead ends so the system can later expand to the Nordics, then Germany, then broader Europe

This means onboarding must help JobPilot understand both:

- who the user is as a worker
- how that user fits a changing job market

Those two concerns must stay separate in the architecture. The user profile is relatively stable. Market context is not.

## 1. Purpose

JobPilot onboarding exists to build an actionable operating profile for the user's job search, not to merely collect data for a profile page. The onboarding should give JobPilot enough structured understanding to:

- evaluate whether the user should apply to a given job, and why
- evaluate whether a job is relevant
- estimate role and seniority fit
- assess realistic transition paths
- identify work-style compatibility
- personalize CVs, applications, and messaging
- preserve continuity across later interactions

In JobPilot, onboarding is the system's first intelligence-gathering layer. It should create a durable baseline that later workflows can reuse and improve rather than forcing the user to re-explain themselves in every step.

A static form is insufficient because the information needed varies dramatically across users:

- an executive needs different signals than a simpler job seeker with short-form work history
- an executive needs different probes than a warehouse operator
- a skilled tradesperson may be evaluated on certifications, mobility, and schedule fit more than on narrative self-description
- a career changer may need transition evidence and adjacency mapping more than direct title matching
- a knowledge worker may need nuance around domain depth, autonomy, and collaboration style

Static forms fail in three ways:

- they over-ask irrelevant questions, which increases friction
- they under-ask where the user's case is ambiguous, risky, or unusually strong
- they produce shallow data that is too generic for real job evaluation

The onboarding must therefore behave like an adaptive interview that gathers the minimum fixed baseline and then expands only where necessary to improve downstream decision quality.

## 2. Core design principle

Adaptive AI Onboarding v1 should use a hybrid model:

- a small fixed intake that creates a universal baseline for every user
- an adaptive AI interview that expands based on the user's profile, gaps, contradictions, and opportunities

The fixed intake is needed because JobPilot requires a stable foundation across all users. Without a common baseline, later scoring and memory become inconsistent. The adaptive interview is needed because the meaning of "fit" changes across industries, levels, and career situations.

This hybrid model is necessary because JobPilot serves users across:

- leadership and executive roles
- managers
- professional specialists and knowledge workers
- finance, accounting, and administrative roles
- skilled trades and field work
- warehouse, operations, and production environments
- people with unclear direction or ongoing career transitions
- simpler job seekers who may not have a polished professional narrative

Across those groups, the same headline question can mean very different things. For example:

- "preferred role" is insufficient without scope, authority, and complexity for leadership candidates
- "experience" is insufficient without systems, tools, or regulated workflows for finance/admin users
- "location" is insufficient without license, route radius, shift tolerance, and physical demands for field workers
- "target job" is insufficient for career changers unless JobPilot also understands transferable capability and transition realism

The design principle for v1 is therefore:

Collect a universal minimum. Expand only where uncertainty affects job evaluation, personalization, or workflow continuity.

This hybrid model must eventually include a document and evidence intake layer. Adaptive interviewing is not sufficient on its own if the system ignores serious user-provided material that already contains facts, credentials, examples, or evidence gaps.

## 3. Universal profile dimensions

These dimensions should exist for all users regardless of profession. They form the common language JobPilot uses to score jobs, personalize outputs, preserve context over time, and later compare the user profile against changing market conditions.

### Factual background

Purpose: establish objective identity and work-history anchors.

Must capture:

- current or most recent role/title
- employment status
- years and type of experience
- industry background
- education level or equivalent pathway
- certifications or licenses that materially affect eligibility
- location and mobility range
- language capability where job relevance depends on it

Operational use:

- anchors job relevance and eligibility
- reduces title ambiguity
- supports later resume/application personalization
- distinguishes direct-fit users from transition candidates

### Skills and capabilities

Purpose: separate what the user can do from what they have been called.

Must capture:

- core functional skills
- tools, systems, machinery, or platforms used
- level of independence versus supervision required
- leadership, coordination, or training responsibilities if present
- recurring tasks and strongest execution areas
- evidence of outcomes, not just duties

Operational use:

- improves job matching beyond title keywords
- supports transferability analysis
- enables AI to recognize adjacent roles
- prevents false negatives for non-standard titles

### Evidence, achievements, and proof

Purpose: capture what can be credibly used as evidence in job-fit evaluation and later profile positioning.

Must capture:

- measurable outcomes where relevant
- examples of responsibility scope
- repeated strengths demonstrated in practice
- proof signals such as certifications, awards, project ownership, client responsibility, process ownership, or output volume
- evidence quality level: strong, moderate, weak, or unproven

Operational use:

- separates claims from demonstrated fit
- improves seriousness of later apply-or-not decisions
- supports document generation without generic inflation
- helps the system detect when a transition story lacks proof
- helps the system distinguish between evidence already present in uploaded material and evidence that still must be elicited through interview follow-up

### Career direction

Purpose: clarify where the user wants to go, not only where they have been.

Must capture:

- target role families
- preferred seniority band
- desired industries or environments
- openness to adjacent roles
- short-term versus stretch ambitions
- appetite for promotion, specialization, stability, or change

Operational use:

- separates immediate match targets from longer-horizon possibilities
- prevents irrelevant recommendations
- helps JobPilot decide whether to score for direct fit, adjacency, or transition potential

### Direction of change

Purpose: understand not just where the user wants to go, but how far the desired move is from current reality.

Must capture:

- staying in lane versus changing lane
- desired increase or decrease in seniority
- industry change versus role change versus work-style change
- urgency of the change
- tolerance for stepping-stone roles
- realism of transition based on current evidence

Operational use:

- supports transition analysis
- separates viable next-step roles from longer-range aspirations
- helps explain why some jobs are strong, weak, or premature

### Work environment fit

Purpose: understand the conditions under which the user is likely to perform sustainably.

Must capture:

- preferred work setting such as office, remote, hybrid, site-based, field-based, warehouse, customer-facing, or solitary
- schedule tolerance such as fixed hours, rotating shifts, nights, weekends, travel, or on-call work
- pace and structure preference such as high-volume, deadline-driven, steady-state, or project-based
- team interaction preference such as leadership-heavy, collaborative, independent, or hands-on supervised
- physical environment tolerance where relevant

Operational use:

- prevents recommending jobs that look right on paper but are wrong in practice
- supports work-style fit scoring
- helps detect burnout risk or false-fit patterns

### Motivation and energy

Purpose: capture what gives the user momentum and what drains them.

Must capture:

- what types of work feel meaningful or energizing
- what types of tasks are tolerated versus actively preferred
- what the user wants more of in the next role
- what the user wants less of or wants to leave behind
- urgency level and search motivation

Operational use:

- improves recommendation ranking when multiple jobs are technically viable
- supports more authentic application tone
- helps the AI detect why a user may keep rejecting "good" matches

### Constraints

Purpose: record real-world conditions that bound the search.

Must capture:

- compensation floor or acceptable range when known
- geography limits
- commute or travel limits
- schedule constraints
- family or caregiving constraints if voluntarily shared and relevant
- legal/work authorization constraints if relevant
- required accommodations if the user chooses to disclose them
- non-negotiables around contract type, hours, or physical demands

Operational use:

- filters out impractical opportunities early
- prevents demotivating recommendations
- supports continuity without forcing repeated explanation

### Communication and output style

Purpose: help JobPilot produce materials and interactions that sound credible for the user.

Must capture:

- preferred tone in written materials
- formality level
- direct versus explanatory style
- concise versus narrative preference
- comfort with self-promotion versus factual understatement

Operational use:

- improves CV/application personalization
- makes AI outputs feel like the user rather than template content
- helps the system tune question phrasing and support level

### Interview and story foundation

Purpose: create the narrative base JobPilot will later need for explaining fit, adapting documents, and generating consistent interview material.

Must capture:

- how the user explains their current role
- how they explain transitions
- how they describe strengths without exaggeration
- gaps between factual experience and current self-positioning
- reusable story anchors for later job relevance explanations

Operational use:

- supports later interview preparation
- reduces inconsistency between user profile, applications, and job-fit reasoning
- avoids forcing the user to rebuild their story from scratch in later workflows

### Job-match red flags

Purpose: identify disqualifiers, recurring mismatch patterns, and risk factors.

Must capture:

- roles the user should avoid
- environments that repeatedly lead to poor fit
- capability gaps that block certain targets
- unrealistic expectations or title inflation
- missing documentation, certifications, or requirements
- contradictory preferences that reduce viable matches

Operational use:

- protects recommendation quality
- guides follow-up questioning
- helps the system explain low-fit results honestly

### Confidence and uncertainty

Purpose: track what the system knows versus what it is still inferring.

Must capture:

- profile areas with strong evidence
- areas that are still inferred from weak signals
- unresolved contradictions
- missing information that materially affects job-fit confidence

Operational use:

- supports sufficiency decisions in onboarding
- determines when to stop interviewing versus ask one more question
- keeps later job scoring honest about what is known and unknown

### Market context

Purpose: represent the changing job market separately from the user profile.

Must capture:

- current role demand assumptions
- hiring-market difficulty for the target direction
- market-specific eligibility expectations
- common fit risks in the active geography
- refresh timestamp and version

Operational use:

- prevents relying on stale or vague model memory
- supports refreshable job-fit logic
- allows the system to explain recommendations against the current market, not just the user's background

### Geo context

Purpose: keep geography explicit because fit, language, commuting, and role norms are location-sensitive.

Must capture:

- country scope
- language scope
- relevant local commuting or mobility assumptions
- location-specific role norms and constraints

Operational use:

- keeps Denmark-first scope explicit in v1
- avoids premature Europe-wide localization logic
- gives the architecture a clean path to later regional expansion

## 3A. Document And Evidence Intake Layer

Adaptive onboarding must include a document and evidence intake layer as part of the serious profiling architecture.

This layer should eventually evaluate:

- uploaded CVs
- education documentation
- certificates and licenses
- prior application material
- profile text entered during setup
- other structured or semi-structured career material the user provides

The purpose of this layer is to:

- extract known facts before asking follow-up questions
- identify uncertainty rather than asking blind generic questions
- identify missing proof or weak support
- detect weak material quality
- feed evidence gaps into the interview engine

The interview engine should therefore eventually work from both:

- live interview answers
- document and evidence intake signals

This is a hard subsystem requirement. The engine must not be considered serious if it can only profile from minimal draft fields plus live Q&A.

## 4. Role-specific interview modules

These modules extend the universal profile when the user's background suggests additional dimensions matter. A user may activate more than one module if their profile spans categories.

### Executive and leadership module

What extra information matters:

- scope of responsibility
- team size and management layers
- budget, revenue, P&L, or operational ownership
- strategic versus operational balance
- change leadership experience
- board, stakeholder, or cross-functional influence
- decision horizon and complexity
- public or high-accountability representation duties

What the AI should probe:

- whether the user led strategy, execution, or both
- what level of authority they actually had
- measurable business impact
- scale handled comfortably
- preferred mandate such as turnaround, growth, optimization, transformation, or stewardship
- tolerance for ambiguity, politics, and visibility
- willingness to step down in level or scope if the market requires it

What job-fit risks it should detect:

- title inflation without corresponding scope
- mismatch between desired level and demonstrated responsibility
- transition from senior leadership into roles that may feel too tactical
- overemphasis on prestige titles with weak evidence of outcomes
- underestimating stakeholder complexity in target roles

### Specialist and knowledge worker module

What extra information matters:

- domain expertise depth
- technical or analytical tool stack
- project versus operational work ratio
- IC versus leadership preference
- collaboration model with product, sales, clients, or cross-functional teams
- portfolio of outcomes, not just responsibilities

What the AI should probe:

- strongest problem types the user solves
- contexts where they perform best
- depth versus breadth preference
- whether they want deeper specialization or broader scope
- how current skills map to target roles
- proof of judgment, ownership, and impact

What job-fit risks it should detect:

- generic specialist positioning with weak differentiation
- shallow evidence for senior-level targeting
- role drift between what the user enjoys and what they are applying for
- mismatch between desired autonomy and actual experience
- transition claims unsupported by adjacent capability

### Finance, admin, and accounting module

What extra information matters:

- process accuracy and compliance exposure
- systems used such as ERP, payroll, bookkeeping, reporting, or office workflow platforms
- transaction volume or complexity
- reporting cadence and controls
- confidentiality and audit sensitivity
- stakeholder service expectations

What the AI should probe:

- what workflows the user can run independently
- whether experience is transactional, controlling, analytical, or coordination-oriented
- comfort with deadlines, month-end, audit cycles, and documentation standards
- software proficiency and process discipline
- degree of customer-facing or internal service responsibility

What job-fit risks it should detect:

- weak systems proficiency for roles requiring operational speed
- mismatch between detail tolerance and role demands
- transition claims from admin to finance without enough financial process depth
- poor fit for high-compliance environments
- over-targeting senior finance roles based on support experience only

### Skilled trades and field work module

What extra information matters:

- trade area and practical task range
- licenses, tickets, certifications, and safety qualifications
- equipment and tool familiarity
- field mobility and service radius
- physical demands tolerance
- solo versus crew-based work preference
- customer-facing responsibilities
- quality, maintenance, installation, repair, or inspection focus

What the AI should probe:

- exact tasks the user performs confidently without supervision
- which certifications are current and required
- travel, weather, and site-condition tolerance
- scheduling flexibility
- safety record and standards familiarity
- whether the target work is similar, adjacent, or a meaningful shift

What job-fit risks it should detect:

- missing certification or license requirements
- unrealistic move into a regulated trade area without the necessary pathway
- mismatch between physical demands and user constraints
- mismatch between field/service expectations and preference for stable site-based work
- overstating task independence relative to actual supervision level

### Warehouse, operations, and production module

What extra information matters:

- shift tolerance
- production or throughput environment
- machinery, scanning, inventory, or logistics systems
- pace, safety, and repetitive work tolerance
- team coordination versus line work
- quality control or process discipline
- forklift or relevant equipment certification where applicable

What the AI should probe:

- whether the user thrives in speed, routine, or problem-solving environments
- operational tasks performed reliably
- schedule flexibility and commute feasibility
- safety and process compliance habits
- experience with inventory accuracy, loading, receiving, picking, packing, dispatch, or line operations

What job-fit risks it should detect:

- mismatch between schedule requirements and user constraints
- low tolerance for repetitive or physical work in highly repetitive environments
- unsupported jump into supervisory operations roles
- inaccurate self-positioning around equipment or systems use
- jobs that conflict with transport or shift realities

### Career changer or unclear direction module

What extra information matters:

- reasons for change
- transferable capabilities
- level flexibility
- learning readiness
- time pressure and financial constraints
- confidence and clarity around target direction
- willingness to pursue stepping-stone roles

What the AI should probe:

- what patterns across past experience are reusable
- what the user wants to move toward and away from
- whether target roles are realistic now, adjacent, or longer-term
- evidence that the user can operate in the target environment
- appetite for reskilling, interim roles, or staged progression

What job-fit risks it should detect:

- unrealistic leap without bridge experience
- mismatch between urgency and transition complexity
- identity conflict between previous experience and desired future positioning
- overly broad search direction that reduces recommendation quality
- discouragement risk if the system treats an aspirational target as immediately attainable

## 5. Interview engine logic

The interview engine should decide the next question based on information value, not on a fixed script.

The decision logic for the next question should prioritize:

### What the material already answers

If uploaded or pre-collected material already answers a question clearly, the engine should not ask it again. Instead, it should move to what the material does not prove strongly enough.

Examples:

- if the CV already establishes current role and recent timeline, do not re-ask for basic orientation
- if certificates already establish a qualification, do not ask for it again as if it were unknown
- if existing profile text already clarifies target direction, the engine should move to transition support, fit, or evidence quality

### Missing information

If a high-impact profile dimension is absent, ask for it next. High-impact means missing data that directly weakens job scoring, eligibility filtering, or personalization.

Examples:

- target direction is unknown
- location or schedule constraints are missing
- current level/scope is unclear
- core capabilities are still generic

### Uncertainty

If the user has answered, but the answer is vague, broad, or low-confidence, ask a clarifying question instead of moving on.

Examples:

- "I can do many things"
- "open to anything"
- "I want a better role"

The engine should convert broad claims into evaluable signals.

### Contradictions

If two answers conflict, ask a reconciliation question.

Examples:

- wants remote-only work but targets field-heavy roles
- wants senior leadership positions but describes limited scope
- says stability is most important but targets high-volatility environments
- wants high pay with narrow location and schedule flexibility

The system should not silently resolve contradictions. It should surface them and seek user clarification.

### Unrealistic transitions

If the target role appears materially above or outside the demonstrated background, the engine should probe for bridging evidence before accepting the target at face value.

Examples:

- operational support to finance manager
- line worker to operations director
- unrelated industry jump with no transferable evidence

The goal is not to reject ambition. The goal is to separate:

- directly viable targets
- adjacent targets
- longer-horizon aspirations

### Signals of mismatch

If the user is technically eligible for a role family but likely to dislike or fail the environment, ask questions that improve work-style fit understanding.

Examples:

- detail-averse user targeting high-compliance accounting work
- low-structure-tolerant user targeting repetitive production environments
- low-conflict-tolerance user targeting people-management-heavy leadership roles

### Strong opportunities

If the interview detects unusually strong leverage, it should probe to sharpen it because that improves matching and personalization quality.

Examples:

- clear industry niche
- rare certification
- strong measurable outcomes
- cross-functional experience that enables adjacency
- under-marketed leadership or training responsibility

The engine should ask the next question that most improves JobPilot's ability to evaluate, rank, and personalize. It should stop asking once additional questions are low-value relative to current confidence.

## 5A. Evidence Quality Model

The engine must judge not only whether data exists, but whether it is strong enough.

The evidence quality model should evaluate:

- role clarity
- timeline clarity
- responsibility clarity
- result or evidence strength
- case or example availability
- progression and seniority signals
- tool, system, or domain specificity
- transition support
- credibility of claims
- whether the material is too weak for the target profile level

This matters because:

- a CV may exist but still be weak
- a certificate may prove eligibility but not level
- profile text may state ambition without proving relevance
- prior applications may show positioning attempts without showing evidence quality

The system must distinguish between:

- evidence already available
- evidence missing entirely
- evidence present but too weak for the intended profile level

## 5B. Gap-Closing Interview Logic

The interview must use existing material and ask targeted follow-up questions when the evidence is too thin.

Examples of gaps it may need to close:

- missing measurable results
- missing concrete cases
- missing examples of ownership
- missing seniority indicators
- missing evidence for role transition
- missing proof for strategic, product, or leadership relevance
- missing examples of tools, systems, or domain depth
- missing motivation, no-go, or fit clarity

The engine must not just ask generic questions if uploaded material already contains the answer.

It must ask to close real evidence gaps.

## 5C. Profile Strength Versus Goal Level

The engine must compare current material quality against the level and type of profile the user is trying to build.

Examples:

- if the user wants a senior, strategic, product, or leadership profile but the material only shows generic task descriptions, that should be recognized as insufficient
- if a result-heavy or case-heavy profile is needed but no evidence exists, the engine must try to elicit it
- if a role is better supported by responsibility or regulated-task framing than by quantified results, that should also be recognized

This comparison matters because JobPilot must understand not only what the user wants, but whether the available material can credibly support that profile position.

## 6. Confidence and sufficiency model

JobPilot needs a practical standard for when it knows enough to begin serious job evaluation. The threshold is not "complete biography." It is "sufficiently reliable operating profile."

### High confidence

High confidence means JobPilot can confidently evaluate jobs and generate reasonably personalized materials without immediate clarification.

Typical conditions:

- factual background is clear
- capabilities are specific and evidenced
- career direction is defined
- constraints are known
- work environment fit is reasonably clear
- no major unresolved contradictions remain
- role level appears credible

At high confidence, JobPilot can:

- rank opportunities with meaningful precision
- explain why matches are good or weak
- generate tailored CV/application drafts
- preserve memory with low ambiguity

### Medium confidence

Medium confidence means JobPilot can begin evaluating jobs, but recommendations and personalization should remain somewhat cautious.

Typical conditions:

- core background is known
- some capability areas are still broad
- target direction is partially clear
- a few constraints or preferences remain vague
- minor contradictions or untested assumptions remain

At medium confidence, JobPilot can:

- start job scoring
- suggest clarifying follow-ups alongside recommendations
- present provisional transition or adjacency options

### Low confidence

Low confidence means the system does not yet know enough to provide trustworthy job evaluation.

Typical conditions:

- role direction is unclear
- experience description is too vague
- constraints are unknown
- user is in a major transition without evidence mapping
- core contradictions remain unresolved

At low confidence, JobPilot should:

- avoid overconfident job ranking
- ask more targeted questions
- present exploratory guidance rather than hard recommendations

### Unresolved areas

The profile should explicitly track unresolved areas rather than treating missing clarity as invisible.

Examples:

- target level unclear
- remote preference conflicts with role family
- compensation expectations may constrain search unrealistically
- management scope appears overstated
- transferability not yet validated

This matters because onboarding is not one-and-done. JobPilot should be able to continue learning later inside the operating workflow.

### When follow-up is required later

Follow-up should happen later when:

- the user starts evaluating jobs in a domain with unresolved ambiguity
- the system sees repeated rejection of recommended roles
- a target role requires proof not yet captured
- generated documents would benefit from stronger evidence or tone calibration
- the market response suggests the profile is incomplete or mispositioned

Completion should later depend not only on enough answers, but also on sufficient evidence quality for the intended downstream use.

## 6A. Interview Progress And Usable Thresholds

As onboarding becomes longer and more serious, the product must later expose meaningful interview progress to the user.

This should not be treated as a simple question counter.

Progress should eventually reflect:

- coverage breadth
- evidence depth
- readiness for downstream use
- remaining uncertainty

Progress must be tied to profile quality, not only question count.

The product should later communicate at least two useful thresholds:

- a minimum usable threshold where JobPilot has enough information for reasonable job evaluation and initial CV help
- a stronger profile threshold where JobPilot can provide more confident targeting and stronger writing support

This should be explained to the user in product language, not internal system language.

The product should be able to say, in effect:

- your profile is usable now
- continuing will improve quality

without forcing the user to finish the full interview in one sitting.

## 6B. Pause And Resume Requirement

The interview must later support:

- stopping mid-way
- returning later
- continuing from the current profiling state
- eventually continuing across browser, device, and account sessions

The current browser-session-only state is not sufficient for the long-term serious interview model.

This means pause and resume becomes a real product requirement, not optional convenience behavior.

## 6C. Dependency On Persistence-Compatible State

Pause and resume across closed browser sessions or devices requires persistence-compatible interview state storage.

This does not mean persistence should be built now.

It does mean:

- interview UX cannot be considered complete without a persistence-compatible state model
- progress and resume design must be compatible with later transparent user data handling
- future persistence work must preserve inspectable interview state rather than introducing opaque resume state

## 6D. UX Principle For Longer Interviews

The product should avoid making the user feel trapped in a long interview.

Instead, it should later:

- show meaningful progress
- show when the profile is already usable
- encourage continuation for stronger output quality
- allow return later without losing work

This is important because the serious interview model is no longer a small onboarding form. It is becoming a core profiling workflow.

## 7. Market And Geography Principles

JobPilot must separate stable user understanding from changing market understanding.

Principles:

- the user profile is relatively stable and should be stored as structured profile state
- market context is changing and must be refreshable
- market context should be versioned so later evaluations can explain which market assumptions were used
- the system must not rely on vague AI memory for market updates
- stored market context should be preferred before live research by default
- v1 should not build Europe-wide localization logic
- v1 should be Denmark-first and Danish-first without closing off future regional expansion

Architecture implication:

- profile state and market state should become separate inputs to later job-fit evaluation
- Denmark is the only supported v1 market
- later expansion should follow a deliberate sequence: Nordics, Germany, then broader Europe

## 8. Structured profile output

The onboarding should produce a structured profile suitable for job scoring, personalization, memory, and later learning. A practical v1 target shape is below.

```ts
type ConfidenceLevel = "high" | "medium" | "low";

type SufficiencyStatus = {
  overallConfidence: ConfidenceLevel;
  readyForJobEvaluation: boolean;
  unresolvedAreas: string[];
  followUpTopics: string[];
};

type UserIdentity = {
  currentTitle: string;
  recentRoleCategory: string;
  seniorityLevel: string;
  employmentStatus: string;
  locationBase: string;
  mobilityRadius: string;
  workAuthorization?: string;
  languages?: string[];
};

type BackgroundProfile = {
  industries: string[];
  yearsOfExperience: string;
  education: string[];
  certifications: string[];
  licenses: string[];
  notableContext: string[];
};

type CapabilityProfile = {
  coreSkills: string[];
  toolsSystemsEquipment: string[];
  recurringResponsibilities: string[];
  impactEvidence: string[];
  autonomyLevel: string;
  peopleResponsibility: string;
};

type CareerDirectionProfile = {
  targetRoleFamilies: string[];
  targetSeniority: string[];
  targetIndustries: string[];
  adjacentRoleOpenness: string;
  transitionIntent: string;
  urgencyLevel: string;
};

type WorkFitProfile = {
  preferredEnvironment: string[];
  schedulePreferences: string[];
  travelTolerance: string;
  physicalWorkTolerance: string;
  collaborationStyle: string[];
  pacePreference: string[];
};

type MotivationProfile = {
  energizers: string[];
  drainers: string[];
  wantsMoreOf: string[];
  wantsLessOf: string[];
  searchMotivationSummary: string;
};

type ConstraintProfile = {
  compensationFloor?: string;
  targetCompensation?: string;
  locationConstraints: string[];
  commuteConstraints: string[];
  contractConstraints: string[];
  scheduleConstraints: string[];
  nonNegotiables: string[];
};

type CommunicationProfile = {
  tonePreference: string;
  formalityPreference: string;
  narrativeStyle: string;
  selfPromotionComfort: string;
};

type FitRiskProfile = {
  redFlags: string[];
  contradictions: string[];
  realismRisks: string[];
  missingEligibilityItems: string[];
};

type ModuleProfile = {
  activeModules: string[];
  executiveLeadership?: {
    responsibilityScope: string[];
    teamScale: string;
    budgetScope: string;
    strategyVsExecution: string;
    stakeholderComplexity: string[];
  };
  specialistKnowledgeWorker?: {
    domainDepth: string[];
    technicalDepth: string[];
    ownershipPattern: string;
    specializationDirection: string;
  };
  financeAdminAccounting?: {
    processAreas: string[];
    systemExposure: string[];
    controlsComplianceExposure: string[];
    reportingCadence: string[];
  };
  skilledTradesFieldWork?: {
    tradeAreas: string[];
    equipmentExposure: string[];
    certificationsTickets: string[];
    serviceRadius: string;
    siteConditionTolerance: string[];
  };
  warehouseOperationsProduction?: {
    operationTypes: string[];
    shiftTolerance: string[];
    machinerySystems: string[];
    throughputEnvironment: string;
    safetyProcessDiscipline: string;
  };
  careerChangerUnclearDirection?: {
    transitionDrivers: string[];
    transferableStrengths: string[];
    realisticBridgeRoles: string[];
    learningReadiness: string;
    clarityLevel: string;
  };
};

type AdaptiveOnboardingProfileV1 = {
  profileVersion: "v1";
  lastUpdatedAt: string;
  identity: UserIdentity;
  background: BackgroundProfile;
  capabilities: CapabilityProfile;
  careerDirection: CareerDirectionProfile;
  workFit: WorkFitProfile;
  motivation: MotivationProfile;
  constraints: ConstraintProfile;
  communication: CommunicationProfile;
  fitRisks: FitRiskProfile;
  modules: ModuleProfile;
  sufficiency: SufficiencyStatus;
  interviewSignals: {
    strongSignals: string[];
    uncertainSignals: string[];
    nextBestQuestions: string[];
  };
};
```

Practical notes for v1:

- arrays are preferred over dense prose so later scoring logic can operate on explicit signals
- unresolved areas should be first-class data, not hidden in notes
- confidence should exist at the profile level even if the scoring model is simple at first
- the structure should support partial completion and later updates
- the profile should later be able to represent whether downstream writing is primarily supported by task evidence, result evidence, case evidence, or transition evidence

## 8A. Downstream Relevance Of Evidence-Aware Profiling

Evidence-aware profiling is required because later CV and application generation must be able to choose between:

- task-based framing
- result-based framing
- case-based framing
- transition-based framing

depending on:

- the target job
- the intended profile level
- the actual strength of available evidence

If the interview engine does not understand document quality and evidence strength, downstream generation will either:

- overclaim
- underuse strong material
- default to generic phrasing
- fail to support realistic transitions properly

## 9. Cost And Usage Governance

JobPilot should not default to open-ended chat. It should default to controlled workflows with explicit backend contracts.

Principles:

- no open-ended chat as the default product pattern
- workflows should be bounded by route contracts and structured outputs
- model choice should be task-dependent
- `gpt-5.4-mini` is the current model for high-value reasoning flows where question quality matters
- `gpt-5.4-nano` should be introduced later for cheap extraction, classification, and background tasks
- structured outputs should be strict and validated server-side
- context windows should stay short and purposeful
- the system should avoid replaying full transcripts or full documents on every turn
- stored and refreshable market context should be used before live research by default
- Denmark-first market refresh cadence should be controlled, not continuous
- usage should later be tracked by feature so onboarding, job-fit scoring, market refresh, and document work can be priced separately
- the operating principle is quality-first, spend-controlled

Implementation implication:

- onboarding interviewing should remain contract-driven, not chat-driven
- later job-fit and generation flows should follow the same pattern
- backend routes should continue to enforce structured input and structured output

## 10. Transparency And Data Rights Model

JobPilot v1 must be designed around transparent handling of user profile data before persistence becomes a core product layer. This is a Denmark-first, GDPR-oriented product and architecture requirement. It is not a claim of legal completeness. It is a hard design constraint for how profile and storage work should evolve.

### Transparency model

JobPilot must expose user data in two separate layers:

- `User Profile Data`: direct information the user has provided or explicitly edited
- `AI Profile Core`: structured interpretation, summary, and derived profile elements generated from onboarding interview signals and later analysis

These layers must remain distinct in architecture and storage design.

Implications:

- user-provided fields should remain traceable as direct input
- AI-derived fields should remain traceable as derived interpretation
- the system should not blur raw user statements and AI conclusions into one opaque profile blob
- later UI should be able to display both layers separately

### User rights and product requirements

The architecture must support that the user can later:

- view stored user profile data
- view the AI-generated profile core
- edit or correct profile data
- request deletion or removal of profile data
- remove AI-generated profile elements that should no longer be retained
- export relevant profile data in a structured format

This requirement applies even if the full user-facing controls are not built in v1.

Architecture implication:

- profile storage design must support selective read, update, deletion, and export
- AI-derived profile elements should be stored in a way that allows them to be removed or regenerated independently
- persistence should not assume that profile data is append-only or permanently retained

### Privacy and trust principles

JobPilot should be designed for:

- privacy by design
- data minimisation
- explicit separation between user-provided data and AI-derived data
- controlled access to sensitive profile information
- no public exposure of profile data
- strong protection of stored personal data
- readiness for encryption and access-control in storage design
- retention rules that avoid keeping unnecessary personal data forever

Technical implication:

- persistence should store only the minimum required to support onboarding continuity, profile evaluation, and later user rights
- sensitive profile data should be treated as protected application data, not generic analytics payload
- storage design should assume future encryption and role-based access requirements even if those controls are not yet implemented
- retention should become an explicit part of storage design, not an afterthought

### Build-order rule

The full data-rights UI is not being built right now.

However:

- persistence and database work must not begin without this transparency and data-rights model being accounted for
- transparent user access, edit, delete, and export support becomes a required phase before broad production scaling

This means:

- early persistence work must be compatible with later user rights
- storage shortcuts that make selective deletion, correction, or export impractical should be avoided
- profile architecture must be designed for transparency before it is designed for scale

## 11. Phase-1 scope boundary

What belongs in v1:

- a small fixed onboarding intake
- adaptive follow-up questions based on role type, uncertainty, and fit risk
- structured output design aligned to job evaluation and personalization
- basic sufficiency tracking
- support for direct-fit users and transition users at a practical MVP level
- Denmark-only and Danish-only operation
- a controlled backend interview contract
- clear separation between user profile and future market context

What should wait:

- persistence
- database-backed profile storage
- deep psychological profiling
- therapy-style coaching
- formal psychometrics or personality testing
- enterprise-grade competency frameworks
- employer-side assessment logic
- full labor-market intelligence
- advanced scoring calibration across all professions from day one
- document ingestion intelligence from real uploaded files if upload parsing is not yet production-ready
- multi-user org workflows
- backend memory orchestration beyond the simplest persistence layer

However, evidence-aware intake itself should not be treated as optional future polish. It belongs inside the serious interview-engine definition even if the full file-ingestion implementation matures in phases.

V1 should not try to fully understand the person as a human being. It should understand the person well enough as a job-search actor to improve decisions, personalization, and continuity.

## 12. Recommended next implementation step

The next single safest technical step is:

Finish and validate backend onboarding sufficiency and stop/continue logic in `POST /api/onboarding/interview`.

Why this should come next:

- it hardens the first controlled backend contract for adaptive onboarding
- it determines when JobPilot knows enough to begin serious profile evaluation
- it keeps cost and product behavior under control by avoiding chat-like over-questioning
- it should be proven before persistence, database, or profile-output work expands around it

Continue only after the sufficiency logic works reliably.

## 13. Interview Engine As Standalone Core Subsystem

The adaptive onboarding interview should now be treated as a standalone core subsystem, not as a lightweight helper inside setup.

Implications:

- the interview engine is the profiling foundation for later job-fit evaluation
- the interview engine is the profiling foundation for later CV and application generation
- the interview engine is the profiling foundation for later transparent profile review
- the interview engine must be hardened before persistence and profile storage expand

This changes the standard for what counts as "good enough".

The engine is not done when it can ask a few relevant questions. It is only done when it can build a serious Denmark-first phase-1 profile across materially different user segments without collapsing into shallow or repetitive interviewing.

Canonical governance for that subsystem now lives in:

- `docs/interview-engine-v1-definition-of-done.md`

That document should govern the next implementation steps for interview logic, completion gates, output quality, and transparency compatibility.
