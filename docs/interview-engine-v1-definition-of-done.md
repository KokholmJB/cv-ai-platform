# Interview Engine v1 Definition Of Done

## 1. Purpose Of The Interview Engine

JobPilot Interview Engine v1 exists to build a serious job-search profile foundation for the user. It is not a generic onboarding helper. It is not a generic chatbot. It is not a static questionnaire. It is not a lightweight wizard for collecting a few preferences. It is not only a writing-style collector.

It exists to produce a structured and usable profiling baseline that later product subsystems can depend on with reasonable confidence.

The Interview Engine must become the first serious profiling layer behind:

- job-fit evaluation
- targeted CV generation
- targeted application generation
- transparent user profile review
- persistence and later profile memory

The subsystem must gather enough structured understanding to answer these questions downstream:

- who is this person in work terms
- what level do they actually operate at
- what kind of work are they trying to move toward
- what can they credibly transfer
- what environments fit them
- what mismatch risks exist
- how confident should the system be in its own conclusions

The Interview Engine should not be optimized for conversational pleasantness. It should be optimized for profiling clarity, usefulness, and downstream reliability.

The Interview Engine must also be evidence-aware. Serious profiling cannot rely only on:

- minimal profile draft fields
- live interview turns

It must eventually profile from both conversation and supplied material, including:

- uploaded CVs
- education documents
- certificates
- prior application material
- profile text entered in setup
- other serious structured or semi-structured career material

## 2. Definition Of Done For Interview Engine v1

The Interview Engine is only done enough for v1 when all of the following are true.

### Behavioral completion criteria

- it does not stop after shallow coverage
- it does not complete after only one meaningful answer
- it does not complete based only on the initial profile draft
- it does not loop on the same unresolved area in slightly different words
- it asks one question at a time
- it remains controlled and bounded by backend contracts
- it behaves in Danish for all human-facing question text

### Profiling completion criteria

- it covers the required profiling dimensions with enough breadth and depth for phase 1
- it can adapt to materially different job segments without collapsing into a white-collar default
- it can distinguish direct fit, adjacent fit, and transition risk
- it can use uploaded and pre-collected material as evidence input, not only live Q&A
- it captures both user-provided profile data and AI-derived interpretation
- it produces an AI Profile Core that is useful for later job-fit evaluation and generation workflows
- it carries explicit confidence and uncertainty rather than hiding weak inference

### Output quality criteria

- a `continue` response must contain one concrete Danish question and one valid `focusArea`
- a `complete` response must contain a structured `profileSummary`
- `profileSummary.userProfileData` must preserve direct user-provided inputs separately
- `profileSummary.aiProfileCore` must contain concise but usable interpretation, not decorative recap text
- the summary must be strong enough that a later subsystem could begin serious profile evaluation from it

### Operational quality criteria

- malformed model output is rejected safely
- repeated same-focus, same-meaning questions are rejected safely
- the engine stays compact in context use and does not behave like free chat
- the engine can be tested against multiple representative user segments with consistent completion standards
- document and evidence intake must be able to identify what is already known before new questions are asked

If any of the above are not true, Interview Engine v1 is functional but not done.

## 3. Document And Evidence Intake Layer

The Interview Engine must include a document and evidence intake layer.

This is a subsystem requirement, not a future optional enhancement.

The intake layer must eventually evaluate:

- uploaded CVs
- education documentation
- certificates and licenses
- prior application material
- profile text entered in setup
- other structured or semi-structured career material the user provides

The intake layer exists to:

- extract known facts before the interview starts
- identify uncertainty rather than asking blindly
- identify missing proof or weak support
- detect weak material quality
- feed evidence gaps into the interview engine

This means the interview engine should later operate on two inputs:

- conversational input from the live interview
- evidence input from uploaded and pre-collected material

The interview engine must not ask generic clarification questions if the uploaded material already answers them clearly. It must use the intake layer to understand what is already known and what still needs proof, sharpening, or reconciliation.

## 4. Required Profiling Dimensions

The engine must not complete until it has clarified a phase-1 minimum across the dimensions below. These are not optional nice-to-haves. They are the profiling core.

### Factual profile

Must establish:

- current or most recent role
- employment status where relevant
- years or rough depth of experience
- location and geography relevance
- base direction or target role family

Why it matters:

- anchors all later interpretation
- prevents the engine from reasoning on abstract preferences without work context
- supports later user-visible transparency

### Current work reality

Must clarify:

- what the user actually does in practice
- what kinds of tasks dominate the role
- whether the work is operational, strategic, technical, customer-facing, people-facing, process-heavy, physical, administrative, or mixed
- scope of day-to-day responsibility

Why it matters:

- job titles are too ambiguous on their own
- later fit logic depends more on real work content than on labels

### Level and seniority

Must clarify:

- degree of autonomy
- decision scope
- people responsibility if any
- business or delivery ownership
- supervision level
- whether the target level is realistic relative to the current or previous level

Why it matters:

- title inflation is common
- direct-fit versus stretch-fit depends heavily on actual level

### Transferable strengths

Must clarify:

- which capabilities carry across roles or segments
- what repeated strengths are evidenced by past work
- what the user can credibly bring into adjacent roles

Why it matters:

- essential for career changers
- essential for adjacent-role matching
- prevents over-reliance on literal title matches

### Direction of change

Must clarify:

- whether the user wants to stay in lane, shift laterally, move up, move down, or change segment
- whether the user is targeting a direct next step or a longer-range aspiration
- whether the user is open to stepping-stone roles

Why it matters:

- distinguishes real next-step roles from future ambition
- reduces recommendation noise

### Work-style fit

Must clarify:

- preferred structure versus ambiguity
- individual versus collaborative preference
- people-heavy versus delivery-heavy preference
- pace, environment, and schedule fit where relevant
- physical versus desk-based tolerance where relevant

Why it matters:

- a technically eligible role can still be a bad job choice
- later apply-or-not decisions depend on sustainable fit, not just eligibility

### Mismatch risk

Must clarify:

- obvious red flags
- environments the user should probably avoid
- target-role assumptions that may be too optimistic
- gaps that materially weaken role fit

Why it matters:

- JobPilot's strongest wedge is decision quality
- the engine must support not just positive matching, but credible non-match reasoning

### Evidence, proof, and concrete basis

Must clarify:

- whether the user's claims are supported by examples, responsibility scope, outcomes, credentials, or repeated patterns
- whether the system is inferring beyond what the evidence justifies
- whether uploaded or pre-collected material is actually strong enough for the intended profile level

Why it matters:

- later summaries must not become inflated
- job-fit and generation systems need a credible basis, not only self-description
- the engine must know the difference between existing evidence and evidence it still needs to elicit

### Confidence and uncertainty

Must clarify:

- what is known directly
- what is inferred
- what remains unresolved
- what the system is only moderately confident about

Why it matters:

- prevents false certainty
- allows later systems to ask follow-up questions only where needed

### Voice and style considerations

Must clarify:

- whether the user prefers direct or more explanatory positioning
- how formal written output should later feel
- how much self-promotion feels authentic versus forced

Why it matters:

- needed for later writing quality
- should not dominate the interview, but cannot be absent from the profile foundation

### Transition realism

Must clarify:

- whether the desired move is directly supported, adjacent, or long-range
- whether the user has enough bridge evidence
- whether the transition likely needs stepping-stone roles

Why it matters:

- critical for Denmark-first job relevance decisions
- avoids recommending that the user apply for roles that are not yet realistic

### Motivation and energy pattern

Must clarify:

- what kinds of work the user wants more of
- what they are trying to move away from
- what appears to energize versus drain them in job-choice terms

Why it matters:

- helps discriminate between multiple technically plausible directions
- improves later prioritization and writing tone

### Constraints and no-go conditions

Must clarify where relevant:

- geography and commuting limits
- shift tolerance
- physical constraints
- contract or schedule constraints
- role types the user explicitly does not want

Why it matters:

- practical fit matters as much as conceptual fit
- prevents wasted recommendation cycles

### Segment-specific relevance

Must clarify:

- what additional role-specific dimensions matter for this user segment
- what evidence is required for this segment
- what common failure modes exist in this segment

Why it matters:

- the engine must not ask the same interview for an executive and a warehouse worker

### Geography and country-context readiness

Must clarify:

- Denmark as active scope
- whether the profile includes country-relevant constraints or assumptions for later matching

Why it matters:

- v1 is Denmark-only and Danish-only
- the profile must be ready for Denmark-first role evaluation without pretending to support broader Europe yet

## 5. Evidence Quality Model

The engine must judge not only whether data exists, but whether it is strong enough.

The evidence quality model must evaluate:

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

Operational interpretation:

- a CV with generic duties but no responsibility or outcome detail is weak evidence
- education or certificate documents can strengthen eligibility but do not replace work-reality evidence
- prior application text may show positioning intent but may still be weak proof
- setup profile text can provide orientation but may still require evidence strengthening

The engine must explicitly distinguish:

- evidence already available
- evidence that is missing
- evidence that exists but is too weak for the user's intended profile level

## 6. Gap-Closing Interview Logic

The interview must use the existing material and ask targeted follow-up questions when the evidence is too thin.

Examples of gaps the engine may need to close:

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

This means:

- if the CV already shows the current role clearly, the engine should not ask for the role again
- if certificates already establish eligibility, the engine should shift to fit, depth, or transition questions
- if the target profile level is under-supported, the engine should ask for the missing evidence, not restate ambition

## 7. Profile Strength Versus Goal Level

The engine must compare:

- current material quality
- against the level and type of profile the user is trying to build

Examples:

- if the user wants a senior, strategic, product, or leadership profile but the material only shows generic task descriptions, that must be recognized as insufficient
- if a result-heavy or case-heavy profile is needed but no evidence exists, the engine must try to elicit it
- if a role is better supported by responsibility, coordination, process ownership, or regulated task framing than by quantified results, that should also be recognized

The engine must not apply one narrow evidence standard across all segments.

It must ask:

- what kind of evidence is appropriate for this role family
- whether the supplied material supports the target level
- whether the profile target is currently stronger than the evidence basis

## 8. Interview Coverage Rules

The engine must not be allowed to complete under the following conditions.

- it has only the initial profile draft and no meaningful answer from the user
- it has only conversational hints but has not accounted for available supporting material
- it has only clarified one uncertainty area
- it has not established a credible current work reality
- it has not established a plausible level or seniority view
- it has not clarified direction of change at all
- it has not identified any transferable strengths or any concrete basis for them
- it has not probed work-style fit or practical mismatch risk where that matters
- it is still relying on vague language such as "open to many things" or "wants a better job" without sharpening it
- it is repeating the same uncertainty in different wording
- it has a plausible profile story but not enough evidence basis to support it

Minimum phase-1 coverage before `complete` is allowed:

- at least one meaningful user answer beyond the initial draft
- at least three materially different profiling areas clarified
- available uploaded or pre-collected material has been accounted for when such material exists
- current work reality clarified to a usable degree
- level or seniority clarified to a usable degree
- direction of change clarified to a usable degree
- at least one of transferable strengths, work-style fit, or mismatch risk meaningfully clarified
- enough evidence basis to justify the summary tone

The engine may complete without every dimension being equally deep. It may not complete with only narrow depth in one area and shallow guesses everywhere else.

## 9. Completion Gates

Completion must be governed by hard product rules, even if implementation evolves over time.

### Minimum depth

The engine must have enough detail that the profile is more useful than the original intake. That means:

- summary statements are specific, not generic
- current work reality is tied to recognizable work content
- level is tied to scope or responsibility, not just title
- direction of change is tied to actual movement logic

### Minimum breadth

Completion must require cross-dimensional coverage, not just one strong thread. At minimum, the engine must have credible signals across:

- current reality
- level
- direction
- at least one fit or risk dimension

### Minimum evidence quality

The engine must not write strong profile conclusions from weak evidence.

Examples of weak evidence:

- a target title with no basis
- self-description with no work-content support
- broad ambition without adjacent proof
- inferred seniority based only on years

If evidence is weak, confidence must stay lower and the engine should either continue or complete cautiously with explicit uncertainty.

Completion must later depend on both:

- enough clarified answers
- sufficient evidence quality for the intended downstream use

The interview engine is not done if it can profile only from conversation. It must eventually account for both:

- interview responses
- uploaded or pre-collected evidence quality

### Non-trivial summary requirement

`status: "complete"` is only valid when the resulting `profileSummary` is useful enough to seed later profile evaluation. That means:

- it contains actual interpretation
- it separates raw user data from AI interpretation
- it identifies strengths and risks, not just preferences
- it reflects enough structure to inform later routing and scoring

### Confidence requirements

`high` confidence should only be used when:

- current reality is clear
- level is credible
- direction is clear
- evidence basis is reasonably strong
- major contradictions are absent

`medium` confidence is appropriate when:

- core direction is usable
- some interpretation is still inferential
- some evidence is moderate rather than strong
- profile is usable downstream but should remain open to later refinement

`low` confidence is required when:

- direction remains weakly defined
- transition realism is weak
- level is still ambiguous
- evidence is sparse
- contradictions remain unresolved

### Continue instead of complete

The engine must continue when:

- the last answer created new ambiguity
- the current summary would still be too generic
- the profile has breadth but not enough depth in a critical area
- the user appears to be a transition case without adequate bridge evidence
- a high-impact mismatch risk remains untested
- available material is too weak for the intended profile level even if the interview answers sound plausible

### Refuse strong profile conclusion

The engine should not produce a strong-sounding profile conclusion when:

- evidence is thin
- the user is highly unclear
- the desired transition is materially unsupported
- role level is ambiguous
- key facts remain contradictory
- uploaded or pre-collected material is too weak for the target profile level and the gap has not been closed through targeted questioning

In those cases it should either continue or complete with lower confidence and explicit unresolved implications.

## 10. Interview Progress Model

The interview engine must later expose meaningful progress to the user.

This must not be implemented as a naive question counter.

Progress should eventually reflect:

- coverage breadth across required profiling dimensions
- evidence depth and proof quality
- readiness for downstream use
- remaining uncertainty

Progress must be tied to profile quality, not only the number of questions already asked.

This means:

- a user should not appear "almost done" only because many questions have been asked
- a user may be closer to usable completion if the profile has high-value coverage with good evidence
- a user may still be early in progress if many answers exist but the evidence remains weak or narrow

The progress model should eventually be able to distinguish between:

- basic orientation gathered
- minimum usable profile reached
- stronger profile reached
- important uncertainty still unresolved

## 11. Minimum Usable Threshold Versus Stronger Profile

The interview engine should later communicate at least two useful thresholds in user-facing product language.

### Minimum usable threshold

This is the point where JobPilot has enough information for:

- reasonable job evaluation
- initial profile help
- early CV or application assistance with cautious confidence

This should be framed to the user as meaning:

- JobPilot can already help
- the profile is usable
- some later improvement is still possible

### Stronger or optimal profile threshold

This is the point where JobPilot has enough coverage and evidence quality to provide:

- stronger targeting
- stronger writing support
- more confident profiling
- less need for immediate follow-up clarification

This should be framed to the user as meaning:

- the profile is stronger
- JobPilot can tailor output better
- continuing the interview improved quality, not just completeness

The product should not force users to think in internal system terms such as "coverage model" or "confidence layer". It should communicate usable versus stronger profile value in normal product language.

## 12. Pause And Resume Requirement

The interview engine must later support:

- stopping mid-way
- returning later
- continuing from the current profiling state
- eventually continuing across browser, device, and account sessions

This is required because the serious interview model will be too long and too evidence-sensitive to assume every user finishes in one sitting.

The current browser-session-only state is not sufficient for the long-term interview model.

The engine should be treated as resumable work, not as a one-session wizard.

## 13. Dependency On Persistence

Pause and resume across closed browser sessions or across devices requires persistence-compatible interview state storage.

This does not mean persistence should be built now.

It does mean:

- this becomes a required design gate before the interview UX can be considered complete
- progress and resume design must be compatible with later transparent user data handling
- interview state storage must later support user visibility, correction, deletion, and export compatibility where relevant

The interview subsystem should therefore avoid design shortcuts that assume interview state is disposable or inaccessible once persistence is introduced.

## 14. UX Principle

The product should later avoid making the user feel trapped in a long interview.

Instead, the interview UX should:

- show meaningful progress
- show when the profile is already usable
- encourage continuation for higher-quality output
- allow return later without losing work

The product goal is not to maximize question count. The product goal is to improve profile quality while maintaining user trust and forward momentum.

## 15. Segment Robustness Requirements

The engine must work across very different user types. It must adapt what it probes and what it treats as risk.

### Executives and directors

Must adapt to:

- mandate scope
- strategy versus execution balance
- stakeholder complexity
- scale, budget, or organizational influence

Profiling risks:

- title inflation
- unclear actual decision scope
- prestige bias hiding weak evidence

### People managers and middle managers

Must adapt to:

- team leadership depth
- delivery ownership
- operational versus strategic management
- coaching, hiring, escalation, and cross-functional work

Profiling risks:

- management title without real people responsibility
- mismatch between desired level and demonstrated span

### Specialists and experts

Must adapt to:

- domain depth
- technical or analytical strength
- autonomy pattern
- collaboration pattern

Profiling risks:

- shallow differentiation
- over-claiming seniority without depth evidence

### Project, product, and operations profiles

Must adapt to:

- coordination versus ownership
- ambiguity tolerance
- stakeholder and delivery mix
- process versus product orientation

Profiling risks:

- confusion between project and product roles
- overstated strategic scope
- unclear ownership depth

### Finance, admin, and support roles

Must adapt to:

- systems and process discipline
- controls and accuracy expectations
- service orientation
- workflow independence

Profiling risks:

- role confusion between support and specialist work
- overstated move into higher-compliance roles

### Trades and craftspeople

Must adapt to:

- certifications and practical task range
- physical demands
- travel and site conditions
- tool or equipment familiarity

Profiling risks:

- missing credentials
- physical mismatch
- unsupported transition to less physical work

### Warehouse, logistics, and production

Must adapt to:

- shift tolerance
- physical tolerance
- process discipline
- throughput and safety expectations

Profiling risks:

- unrealistic move into supervisory roles
- ignoring schedule and transport constraints

### Healthcare and care roles

Must adapt to:

- care load
- physical and emotional demands
- schedule intensity
- boundaries around less heavy work

Profiling risks:

- underestimating care burden as a job-choice factor
- transitions away from heavy work without realistic bridge paths

### Sales and customer-facing roles

Must adapt to:

- quota or service orientation
- relationship-building style
- pace and rejection tolerance
- commercial versus support balance

Profiling risks:

- poor fit between user temperament and role environment
- overstating transferable sales credibility from general customer contact

### Unemployed or unclear-direction users

Must adapt to:

- reduced clarity
- reduced confidence
- higher uncertainty
- need for staged profiling

Profiling risks:

- forcing false precision too early
- producing overconfident summaries from thin input

### Career changers

Must adapt to:

- bridge logic
- transferable strength mapping
- evidence gap identification
- staged path realism

Profiling risks:

- aspirational target accepted as immediate fit
- lack of proof ignored

## 16. Question Strategy And Interview Behavior

The engine must ask one question at a time. Every question must have a profiling purpose.

Question selection rules:

- ask the highest-value unresolved uncertainty first
- do not ask for data the system already has
- do not ask for evidence already clearly present in supplied material
- do not ask generic rapport-building questions
- move from broad orientation to sharper clarification
- adapt to user segment and clarity level
- ask for evidence where claims are too soft
- stop when sufficiently clear, not when merely plausible
- accept that users may answer shortly, at medium length, or very fully
- treat answer style itself as a potentially useful profiling signal
- do not impose restrictive short-answer behavior as a product rule
- if the user makes a real but vague attempt, respond with supportive scaffolding rather than simple blocking

Good question quality means:

- one concrete question
- understandable Danish
- directly tied to an unresolved profiling dimension
- likely to change downstream profile quality
- not answerable only by repeating the draft
- not so broad that the user can answer with empty generalities

Bad question quality includes:

- soft conversational filler
- repeated direction questions after the user has already clarified direction
- asking for title labels when the real issue is task content
- asking for broad life goals instead of job-search-relevant clarification
- asking the user to repeat facts that are already clear from CV or setup material

## 17. Downstream Relevance

Evidence-aware profiling is required because later CV and application generation must be able to choose between:

- task-based framing
- result-based framing
- case-based framing
- transition-based framing

depending on:

- the target job
- the target level
- the actual strength of available evidence

If the interview engine does not understand what evidence exists and what evidence is missing, downstream generation will either:

- overclaim
- underuse strong material
- default to generic output
- fail to support difficult but realistic transitions

This is why document and evidence intake is part of the interview subsystem itself, not a separate decorative preprocessing step.

## 18. Output Contract Requirements

The output contract must preserve two distinct layers.

### User Profile Data

This layer contains direct user-provided or directly editable profile data.

Phase-1 minimum:

- `name`
- `currentRole`
- `yearsExperience`
- `targetDirection`

This layer should remain traceable as direct input, not AI interpretation.

### AI Profile Core

This layer contains the system's structured interpretation.

Phase-1 minimum:

- `currentWorkReality`
- `levelSeniority`
- `transferableStrengths`
- `directionOfChange`
- `workStyleFit`
- `mismatchRisks`
- `confidence`

The output must be usable for later subsystems. That means the AI Profile Core must be strong enough to inform:

- whether to continue clarification later
- what kinds of roles to evaluate
- what kinds of transition assumptions are being made
- what later writing should emphasize carefully
- what kinds of evidence framing are available downstream

Weak or insufficient summaries are unacceptable. Examples:

- generic prose that could apply to anyone
- inflated confidence unsupported by the interview
- strengths listed without plausible basis
- mismatch risks omitted to keep the summary optimistic
- no clear distinction between current reality and desired direction
- no signal of whether the profile is supported by task evidence, result evidence, case evidence, or transition evidence

## 19. Transparency And User Trust Requirements

The interview subsystem must be compatible with later transparent profile handling.

Requirements:

- the user must later be able to see what the system thinks
- user-provided data and AI-derived interpretation must remain distinct
- the engine must not rely on opaque hidden profiling blobs
- the subsystem must be compatible with later view, edit, delete, and export rights

Build-order implication:

- persistence work must not hard-code an opaque profile format
- interview outputs must remain decomposable and inspectable
- future profile review UI should be able to show both profile layers clearly
- future profile review must also be able to distinguish direct user data, derived profile interpretation, and evidence-backed support where relevant

## 20. Denmark-First Boundary For Interview Engine v1

Done for v1 means:

- Danish-only human-facing interview language
- Denmark-only market context assumptions
- no need to localize for Europe yet
- no need to support multilingual interviewing yet

Not a dead end means:

- keys and schema should stay language-neutral where possible
- country and market assumptions should remain separable from user profile data
- future regional expansion should extend the subsystem, not require replacement

Intentionally deferred:

- broader Europe localization logic
- multi-country market tuning
- non-Danish interview variants

## 21. Acceptance Test Matrix

### Project manager moving toward product

Success means:

- engine distinguishes project coordination from product ownership
- direction-of-change is clarified without looping
- summary identifies transition realism and relevant strengths
- completion does not happen before product-adjacent evidence or fit signals are probed
- if uploaded material is generic, the engine asks for stronger product-adjacent ownership or case evidence

### Tradesperson moving away from physical work

Success means:

- engine probes physical constraints and no-go conditions
- transferable strengths are mapped beyond trade label
- summary does not pretend the user is immediately fit for desk roles without bridge logic
- uploaded certificates or trade documentation are used as eligibility and background input, not ignored

### SOSU or care profile seeking less heavy work

Success means:

- engine captures physical and emotional load as real job-choice factors
- work-style fit and constraints are surfaced
- summary reflects realistic adjacent paths instead of generic "people skills"
- the engine recognizes whether existing material actually supports a lighter adjacent role or whether bridge evidence is still missing

### Unemployed former cashier with unclear direction

Success means:

- engine does not stop after shallow answers
- it sharpens direction enough to become useful or stays low-confidence
- summary explicitly shows uncertainty if direction remains weak
- existing material is used to identify what is known and what is still unproven, rather than being ignored

### Specialist profile

Success means:

- engine identifies actual domain depth and strengths
- it does not rely only on title
- summary is specific enough to support later differentiation
- tools, systems, domain, or case evidence already present in supplied material reduce redundant questioning

### Manager or director profile

Success means:

- engine probes scope, mandate, and ownership
- it avoids accepting leadership level at face value
- summary captures level credibly and flags any mismatch risk
- if supporting material is too generic for the claimed level, the engine recognizes that and asks for stronger scope or impact evidence

## 22. Explicit Non-Goals

Interview Engine v1 does not need to solve:

- full legal or GDPR implementation UI
- persistence itself
- storage architecture implementation
- CV generation itself
- application generation itself
- the full job-fit engine itself
- Europe-wide localization
- perfect psychological assessment
- therapy, coaching, or counseling
- full market-intelligence refresh machinery

These are downstream or adjacent concerns. The engine's job in v1 is to produce a strong enough profile foundation for them.

## 23. Recommended Build Sequence After This Spec

The correct next implementation order for the interview engine is:

1. harden completion gates
2. improve coverage rules so completion requires real breadth and depth
3. add document and evidence intake awareness
4. add progress and usable-versus-stronger-profile product thresholds
5. strengthen output quality and usefulness of the AI Profile Core
6. improve UI transparency for completed profile output
7. add transparent profile review capabilities
8. only then prepare persistence-compatible storage design and real pause-resume support

Do not jump ahead to CV generation, job-fit engine expansion, or broad storage work before the interview engine meets this Definition of Done.
