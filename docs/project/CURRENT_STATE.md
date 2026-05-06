# CURRENT_STATE

## Produkt
JobPilot er et AI-baseret job search operating system, ikke kun en CV-generator.

## Aktuel baseline
- Safe baseline: `main`
- Branch i denne opgave: `feature/project-docs`

## Bygget status (kendt)
- Ruter:
  - `/setup`
  - `/profile` (tidlig shell)
- Setup-flow:
  - `Start -> Basisoplysninger -> Dokumenter -> AI-interview -> Profiloverblik -> Klar`
- Setup Profiloverblik er gjort brugerrettet og undgår rå teknisk AI-tekst.

## Senest kendte teststatus
- `npm.cmd run build`: pass (på main)
- `npm.cmd run test:setup-ux-review`: pass (på main)
  - `interview completed=true`
  - `screenshots=11`
  - `tabs audited=5`
  - `tabs not reached=0`
  - `findings=0 WARN, 0 FAIL`

## Næste workstream
- Profilarkitektur:
  - personlig profil (user-facing)
  - teknisk AI-profil (intern/advanced)
  - mapping-lag mellem dem

## Kendte begrænsninger
- `/profile` er stadig tidlig og uden persistence.
- Ingen auth/database/payment/persistence endnu.
- Ingen marketplace/business-model lag endnu.
- Tidligere WIP profilarkitektur ligger i stash (ikke på denne branch).

## Standardkommandoer før/efter arbejde
- Før:
  - `git status --short`
  - `git branch --show-current`
- Efter:
  - `npm.cmd run build`
  - `npm.cmd run lint`
  - `git diff --check`
  - Ved setup/profile-arbejde: `npm.cmd run test:setup-ux-review`
