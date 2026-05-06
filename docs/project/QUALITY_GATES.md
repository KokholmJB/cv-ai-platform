# QUALITY_GATES

## Før coding
- `git status --short`
- `git branch --show-current`

## Før commit
- `npm.cmd run build`
- `npm.cmd run lint`
- `git diff --check`

## Setup/profile UX gate
- `npm.cmd run test:setup-ux-review`

## Interview engine gate
- `npm.cmd run test:interview-scenarios`
- `npm.cmd run test:interview-manual-regression`
- `npm.cmd run test:interview-low-clarity`

## Forbidden terms i user-facing setup Profiloverblik
Undgå følgende i personlig profiltekst:
- `Brugeren`
- `no-go`
- `snake_case`
- `backlogansvar`
- `endnu ikke bevist`
- `ikke stærkt nok`
- `underbygget`
- `datagrundlag`
- `matchvurdering`
- `huller`
- `mangler` (som personlig kritik)
- rå `profileModel` / debug wording
