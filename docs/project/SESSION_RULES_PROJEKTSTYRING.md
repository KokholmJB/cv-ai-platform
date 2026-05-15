# SESSION_RULES_PROJEKTSTYRING
_Sidst opdateret: 2026-05-15_

## Formål
Denne fil læses automatisk fra Claude-projektmappen ved sessionstart.
Start ny session med denne ét-linjes prompt:

Vi starter Projektstyring Session [N]. Læs SESSION_RULES_PROJEKTSTYRING.md og HANDOFF_SESSION[N-1].md først og følg reglerne.

## Læserækkefølge ved sessionstart
1. SESSION_RULES_PROJEKTSTYRING.md
2. HANDOFF_SESSION[N-1].md
3. CURRENT_STATE.md
4. DECISIONS.md
5. TASK_BOARD.md

Opsummer kort: hvad der er known, næste handling, aktive regler.
Foreslå ikke kode endnu.

## Faste regler — aktive i hele sessionen

### Source of truth
- docs/project/ er altid source of truth
- Repo-filer vinder over chat-hukommelse
- Beslutninger skrives i docs/project/ — ikke kun i chat

### Windows-kommandoer
- Brug altid: npm.cmd run build
- npm.cmd run test:setup-ux-review
- npm.cmd run test:interview-scenarios
- Aldrig bare npm

### Chat-routing
- Projektstyring → scope, rækkefølge, beslutninger
- Claude Code → kodeændringer
- UX/tekst/design → brugervendte tekster og flows
- Interviewmotor/profil → motor- og profillogik
- Strategi/forretning → forretningsmodel og retning

### Sessionsregler
- Når chatten bliver lang eller mister kontekst: sig det aktivt
- Lav handoff inden ny session startes
- Handoff committes til repo inden ny session åbnes
- Ny session starter altid med repo-filer — aldrig chat-hukommelse

### Fil-opdateringsregel
Når opgave er løst:
1. Identificer hvilke docs/project/*.md filer der har ændret sig
2. Arkivér: docs/project/archive/FILNAVN_YYYY-MM-DD.md
3. Opdatér: docs/project/FILNAVN.md
4. Commit via Claude Code

### Claude Code kommando-regler (KRITISK)
For at undgå PowerShell-bekræftelse:
- Aldrig brug pipe-tegn (|) i kommandoer
- Aldrig brug 2>&1 redirect
- Gem output: npm.cmd run test > temp.txt
- Læs output: Get-Content temp.txt
- Kør én kommando ad gangen

### Kvalitetsløft-filter
Løfter det brugerens jobchance markant?
Er brugerværdien større end implementeringsomkostningen?
Passer det ind i ekspertpanel-visionen?
Kan det måles?
Alle fire ja = gør det.

### Idéklassifikation
- now: i aktiv scope
- MVP: skal med i V1 men ikke nu
- later: post-V1, i FUTURE_IDEA_BACKLOG.md
- parked: undersøges nærmere
- scope creep: må ikke påvirke V1

## Kontrolspørgsmål
1. Hvad er JobPilot?
2. Hvad er næste handling?
3. Hvad er M1a gate status?
4. Hvilke filer skal opdateres?
5. Er Lag 2 aktiveret?
