# SESSION_RULES_CLAUDE_CODE
_Sidst opdateret: 2026-05-15_

## Formål
Denne fil beskriver regler for Claude Code sessioner.
Projektstyring udfylder prompts og du kopierer dem ind i Claude Code.

## Kommando-regler (KRITISK — undgår PowerShell-bekræftelse)
- Aldrig brug pipe-tegn (|) i kommandoer
- Aldrig brug 2>&1 redirect
- Aldrig brug Select-String eller Out-File
- Gem output til filer: npm.cmd run test > temp.txt
- Læs filer: Get-Content temp.txt
- Kør altid én kommando ad gangen

## Generisk Claude Code-prompt skabelon

Read AGENTS.md first. Then read:
- docs/project/CURRENT_STATE.md
- docs/project/DECISIONS.md
[TILFØJ EKSTRA FILER EFTER BEHOV]

Scope: [BESKRIV PRÆCIST HVAD DER SKAL ÆNDRES]
Do not edit any other files.

Task: [PRÆCIS BESKRIVELSE AF OPGAVEN]

Rules:
- Scope kun det anmodede område
- Ingen silent contract changes
- Hold ændringer små og contained

Run: npm.cmd run build > temp-build.txt
Read temp-build.txt and verify build is clean.
Run: npm.cmd run test:interview-scenarios > temp-test.txt
Read temp-test.txt and find Summary line.

Report: files changed, build result, test summary.
Do not commit.

## Mappestruktur
docs/project/          — altid nyeste filer
docs/project/archive/  — gamle versioner med dato

Arkivformat: FILNAVN_YYYY-MM-DD.md
