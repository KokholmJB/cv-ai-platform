# Current Implementation Status

## Product Direction Confirmed

- JobPilot is an AI job-search operating system, not a CV builder
- the strongest wedge is decision quality: should the user apply, and why
- onboarding must be an adaptive AI interview, not a static form
- the system must work across executives, managers, specialists, finance and admin, trades, warehouse and operations, career changers, and simpler job seekers
- the system must understand both who the person is and how they fit the market
- v1 scope is Denmark only and Danish only
- the architecture should support later expansion to the Nordics, then Germany, then broader Europe without rewriting the core profile model

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
- `main` is clean and synced after merge
- current working branch is `feature/setup-persistence`
- `OPENAI_API_KEY` is configured locally in `.env.local` and has been verified server-side
- `GET /api/health/openai` exists and confirms key presence without exposing it
- `GET /api/test/openai` exists and successfully verifies the OpenAI Responses API with `gpt-5.4-mini`
- `POST /api/onboarding/interview` exists
- that route is controlled, server-side, and not a free chat endpoint
- it returns exactly one next question when continuing
- it returns a strict `focusArea` enum
- it supports multi-turn context through `lastAssistantQuestion` and `lastUserAnswer`
- it uses strict JSON parsing and validation for model output
- it does not yet persist interview state
- it does not yet produce a final structured profile output
- stop and sufficiency logic is the next active backend step being worked on

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

## Current Next Step

Finish and validate backend onboarding sufficiency and status logic.

Continue only after that works.
