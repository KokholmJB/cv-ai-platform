# HANDOFF

## Read-this-first order
1. `docs/project/CURRENT_STATE.md`
2. `docs/project/DECISIONS.md`
3. `docs/project/TASK_BOARD.md`
4. `docs/project/QUALITY_GATES.md`
5. `docs/project/TEST_LOG.md`
6. `docs/project/PROMPT_LIBRARY.md`
7. `docs/project/BRUGERKONTEKST.md`
8. `docs/project/ACCOUNT_MIGRATION.md`

## One-line product summary
JobPilot er et AI-baseret job search operating system med interview/profil-fundament før bred automationsudvidelse.

## Current safe baseline
- Baseline: `main`
- Setup-flow og setup UX review er kendt grøn på main.

## Next likely workstream
- Profilarkitektur:
  - personal profile (user-facing)
  - technical AI profile (advanced/internal)
  - kontrolleret mapping-lag mellem dem

## Standard workflow commands
- `git status --short`
- `git branch --show-current`
- `npm.cmd run build`
- `npm.cmd run lint`
- `npm.cmd run test:setup-ux-review`
- `git diff --check`

## Session reminder
Antag ikke manglende repo-state. Verificér altid aktuel branch, ændringer og seneste teststatus før nye edits.
