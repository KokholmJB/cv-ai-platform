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
- interview questions should avoid English career jargon and internal HR or product language unless the user's own profile clearly justifies it
- broader coverage beyond role, level, strengths, and direction remains part of the active interview-engine hardening work
- the engine still needs stronger balanced coverage of branch or domain context, evidence depth, concrete cases or results, motivation or no-go conditions, and profile-strength-versus-goal-level

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
- it includes a simple repetition guard against near-duplicate same-focus follow-up questions
- the `/setup` UI can start the interview, continue one additional turn, and render the completed phase-1 profile summary
- interview state is currently carried only within the active frontend session
- it does not yet persist interview state
- it does not yet satisfy the stricter coverage, completion-gate, and segment-robustness requirements defined for Interview Engine v1
- it does not yet account for uploaded or pre-collected evidence quality as part of interview sufficiency
- plain-Danish wording and broader coverage balancing are now part of the active interview-engine hardening work

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
