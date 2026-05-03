# Current Implementation Status

## Core Subsystem Framing

- the interview engine is now treated as a standalone core subsystem, not only as an onboarding helper
- this subsystem is expected to become the profiling foundation for later job-fit evaluation, CV generation, application generation, transparent profile review, and persistence-compatible profile storage
- the current implementation is functional, but it is not yet done by the stricter Interview Engine v1 Definition of Done
- the new canonical subsystem spec is `docs/interview-engine-v1-definition-of-done.md`

## Product Direction Confirmed

- JobPilot is an AI job-search operating system, not a CV builder
- the strongest wedge is decision quality: should the user apply, and why
- onboarding must be an adaptive AI interview, not a static form
- the system must work across executives, managers, specialists, finance and admin, trades, warehouse and operations, career changers, and simpler job seekers
- the system must understand both who the person is and how they fit the market
- v1 scope is Denmark only and Danish only
- the architecture should support later expansion to the Nordics, then Germany, then broader Europe without rewriting the core profile model
- the interview engine must be strong enough to support multiple user segments, not only management or white-collar profiles
- the profiling model should be serious and operational, not shallow

## Profiling Scope To Support

The onboarding system is expected to eventually support:

- factual profile
- evidence, achievements, and proof
- transferable strengths
- direction of change
- work-style fit
- mismatch risk
- voice and output style
- interview and story foundation
- confidence and uncertainty
- market context
- geo context
- evidence-aware use of uploaded and pre-collected material

## Evidence-Aware Interview Requirement

Evidence-aware document intake is now a confirmed interview-engine requirement.

The interview engine must eventually account for:

- uploaded CVs
- education documents
- certificates and licenses
- prior application material
- setup profile text
- other serious supporting career material

The engine must use that material to:

- understand what is already known
- identify uncertainty
- identify missing proof
- detect weak material quality
- drive targeted gap-closing follow-up questions
- judge whether the evidence is strong enough for the intended profile level

This is not implemented yet.

Current interview logic still works primarily from:

- minimal profile draft fields
- live Q&A turns

This must be addressed before the interview engine can be considered done by the stricter Definition of Done.

## Active Interview Hardening Notes

- plain Danish wording is now an explicit interview-engine requirement
- an internal interview scenario test harness now exists under `tests/interview-scenarios/`
- it covers multiple job segments and user intentions, including same-track users, better-conditions users, specialists, managers, unclear-direction users, career changers, and users wanting less responsibility
- the harness checks loop behavior, progress behavior, repeated focus areas, repeated semantic question families, and intention-first behavior
- this harness is a development visibility tool, not a full production QA system yet
- interview questions should avoid English career jargon and internal HR or product language unless the user's own profile clearly justifies it
- broader coverage beyond role, level, strengths, and direction remains part of the active interview-engine hardening work
- the engine still needs stronger balanced coverage of branch or domain context, evidence depth, concrete cases or results, motivation or no-go conditions, and profile-strength-versus-goal-level
- interviewState and completion hardening now include broader coverage dimensions such as domain context, no-go clarity, and profile-strength-gap signals
- completion now requires broader coverage than before, not mainly role, level, and direction
- interview evidence-depth hardening now tracks `concreteEvidence`, `ownershipScope`, and `resultEvidence`
- completion now requires stronger practical evidence than before, not only broad profile positioning
- interview flow reliability hardening is now implemented
- backend now retries certain recoverable interview-generation failures internally before returning an error
- frontend now prevents duplicate rapid-fire submits while an interview request is already in flight
- local and dev interview testing now exposes backend `reasonCode` for failed interview-generation attempts
- this is a temporary hardening aid for debugging interview reliability
- production still keeps user-facing messaging simple
- dev mode now also exposes retry exhaustion details such as the last failure reason and a compact retry trail
- low-quality-answer handling has been added as a controlled fallback before model retries are used
- low-quality-answer handling was too aggressive and is now being narrowed to true filler or junk detection only
- substantive Danish answers with real work, domain, responsibility, or motivation detail should now pass the guard
- `INVALID_MODEL_OUTPUT` diagnosis has now been split into more specific backend reason codes
- development logging now gives compact sanitized visibility into failed model output validation
- this is still a debugging aid, not a final product feature
- focusArea normalization has been added to reduce near-miss invalid focusArea failures
- the public `focusArea` contract is unchanged
- broader interview coverage still maps into the original controlled `focusArea` enum
- insufficient-coverage completion attempts now recover into targeted follow-up questions
- this reduces user-facing failure when the model tries to complete too early
- evidence saturation and anti-circling logic has now been added
- repeated case, responsibility, and result probing should now recover toward other missing areas instead of looping
- complete now returns a separate readiness and profile-quality assessment
- the system can now distinguish between completed interview status and target-readiness strength
- this readiness still does not yet include uploaded document or evidence intake
- restrictive short-answer behavior is not acceptable as the product rule
- long raw answers are now accepted in the active interview flow
- vague or weak real-attempt answers should now trigger adaptive interviewing and scaffolding rather than simple blocking
- interview progress and threshold UI is now implemented in the active setup flow
- it distinguishes between early progress, minimum usable, stronger profile, and complete
- it is still based on current `interviewState` and readiness logic only
- progress UI has now been refined for clearer threshold visibility during the live interview
- the progress threshold labels are now Basis, Avanceret, and Færdig
- the helper text now explains more clearly when JobPilot can be used and why continuing improves quality
- short but meaningful answers are now treated as valid interview input or guided recovery instead of junk
- junk-answer rejection is now more polite and helpful in tone
- reached milestone styling in the progress UI now updates correctly as thresholds are passed
- progress fill has been tuned to feel more intuitive around the Basis threshold
- insufficient-coverage completion attempts should now recover more reliably into follow-up questions instead of surfacing as user-facing retry exhaustion
- semantic loop protection now covers no-go and mismatch repetition more reliably
- progress smoothing has been improved and 95% plateau behavior has been reduced
- milestone reached-state styling now updates more reliably when thresholds are crossed
- the current manually adjusted color scale was intentionally left unchanged
- the interview route now builds a lightweight internal profile model with facts, interpretations, uncertainties, and explicit hypotheses
- the engine now treats target direction and other self-claims separately from current proven evidence when choosing the next question and judging readiness
- question recovery is now increasingly guided by unresolved hypothesis and evidence gaps instead of only shallow focus-area continuation
- lightweight communication signals such as concise versus detailed style and evidence density are now tracked as internal signals, not as facts
- the route is now more clearly prepared for documents-first evidence intake, but real document parsing and persistence are still not implemented
- progress percent, fill width, and stage logic are now aligned more tightly from the same active progress state
- progress should no longer visually overstate completion before Basis or Avanceret is actually reached
- mismatch_risk and no-go semantic-family saturation has now been strengthened again
- repeated avoid, bad-match, and poor-fit paraphrase loops should now redirect or complete more reliably
- mismatch/no-go and target-gap families are now handled more distinctly instead of acting like one shared paraphrase pool
- progress is now driven more by evidence delta and accumulated new evidence than by repeated turns alone
- mid-range progress stagnation has been reduced when strong new evidence is added
- saturated mismatch families should now redirect or complete more reliably instead of circling in paraphrases
- ownership and product-decision repetition is now treated as its own saturated family instead of being mixed too loosely with general mismatch or level questions
- level or scope, formal product ownership, target-gap, and direction-change realism are now handled more distinctly in the interview route
- repeated mid-range stalls caused by ownership-family paraphrases should now be reduced because strong clarifying evidence can move progress or trigger redirect more clearly
- once ownership or product-authority evidence is well covered, the engine should redirect or complete more reliably instead of re-asking nearby paraphrases
- pause and resume across closed browser, browser, or device sessions is still not implemented

## Interview Progress And Resume Requirement

Interview progress, pause and resume, and usable-versus-stronger-profile thresholds are now confirmed future interview-engine requirements.

Current state:

- interview state is still only held in active frontend or browser session memory
- no pause or resume across a closed browser session exists yet
- no pause or resume across browser, device, or account sessions exists yet
- progress visualization is not implemented yet
- usable-threshold versus stronger-profile UX is not implemented yet

This is now a confirmed future interview-engine requirement and a build gate for the longer-term serious interview UX.

## Market And Geography Principles

- stable user profile and changing market context must be separate inputs
- market context must be refreshable and versioned
- the system should not rely on vague AI memory for market updates
- v1 should not implement Europe-wide localization logic
- the architecture should be Denmark-first without becoming a dead end

## Cost And Usage Governance Principles

- no open-ended chat as the default product shape
- workflows should be controlled by backend contracts
- model routing should follow task type
- `gpt-5.4-mini` is the current reasoning model for high-value onboarding flows
- `gpt-5.4-nano` is the planned later model for cheap extraction, classification, and background tasks
- outputs should be structured and validated server-side
- context windows should stay short
- avoid replaying full transcript history or full documents every turn
- stored or refreshable market context should be preferred before live research by default
- Denmark-first market refresh should use a controlled cadence, not continuous refresh
- usage should later be tracked by feature
- operating principle: quality-first, spend-controlled

## Transparency And Data Rights Requirement

Transparent profile data handling is now a confirmed product requirement.

JobPilot must later expose profile information in two separate layers:

- `User Profile Data`: direct user-provided or user-edited profile information
- `AI Profile Core`: AI-derived structured interpretation and summary

The architecture must support that the user can later:

- view stored profile data
- view the AI-generated profile core
- edit or correct profile data
- request deletion or removal of profile data
- remove AI-generated profile elements that should no longer be retained
- export relevant profile data in a structured format

This is not implemented yet.

It must be addressed before persistence and broader storage design are treated as complete.

Additional design implications:

- user-provided data and AI-derived data should remain explicitly separate
- persistence should follow privacy-by-design and data-minimisation principles
- storage design should be ready for encryption and access-control later
- retention should be treated as a real storage concern, not a future cleanup task

## Verified Technical Status

- the setup flow is live on production
- the active repository branch for this snapshot is `main`
- `OPENAI_API_KEY` is configured locally in `.env.local` and has been verified server-side
- `GET /api/health/openai` exists and confirms key presence without exposing it
- `GET /api/test/openai` exists and successfully verifies the OpenAI Responses API with `gpt-5.4-mini`
- `POST /api/onboarding/interview` exists
- that route is controlled, server-side, and not a free chat endpoint
- it returns exactly one next question when continuing
- it returns a strict `focusArea` enum
- it supports multi-turn context through `lastAssistantQuestion` and `lastUserAnswer`
- it uses strict JSON parsing and validation for model output
- it can now return either `status: "continue"` or `status: "complete"`
- it can return a structured `profileSummary` on completion
- it can now also return a compact internal `profileModel`, `hypothesisSummary`, `uncertaintySummary`, and `communicationSignals` on completion
- it includes a simple repetition guard against near-duplicate same-focus follow-up questions
- the `/setup` UI can start the interview, continue one additional turn, and render the completed phase-1 profile summary
- interview state is currently carried only within the active frontend session
- failed interview generation now returns a compact `reasonCode` after internal retries are exhausted
- it does not yet persist interview state
- it does not yet satisfy the stricter coverage, completion-gate, and segment-robustness requirements defined for Interview Engine v1
- it does not yet account for uploaded or pre-collected evidence quality through real document parsing as part of interview sufficiency
- plain-Danish wording and broader coverage balancing are now part of the active interview-engine hardening work
- document and evidence-aware intake is still not implemented

## Explicit Boundaries

The following are not built yet:

- no persistence yet
- no database yet
- no transparent profile access, edit, delete, or export flow yet
- no final profile schema output yet
- no market intelligence refresh system yet
- no real job-fit engine yet
- no CV or application generation pipeline yet
- no localization beyond Denmark and Danish
- no open user-facing AI chat
- no interview engine completion-gate system that is yet strong enough to be considered done by the new subsystem definition
- no broad segment-level acceptance validation across trades, care, warehouse, support, leadership, and unclear-direction users yet
- no implemented document and evidence intake layer inside the interview engine yet

## Current Next Step

Complete the interview engine to the new Definition of Done before broader product expansion.

Ordered workstream:

- harden completion gates
- improve coverage rules
- strengthen output quality
- improve UI transparency for completed profile
- add transparent profile review
- only then prepare persistence-compatible storage design

Continue only after the interview engine is materially closer to that standard.
