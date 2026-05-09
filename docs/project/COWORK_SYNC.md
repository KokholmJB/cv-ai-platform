# COWORK SYNC KOMMANDO

Når Projektstyring-chatten beder om opdateret kontekst, kør denne opgave i Cowork:

---

## Opgave: Generer kontekst-snapshot til Projektstyring

Læs alle .md filer i C:\dev\cv-ai-platform\docs\project\ og generer én samlet fil:

Output-sti: C:\dev\cv-ai-platform\docs\project\snapshots\context-[DATO].md

Format:
- Brug dagens dato i filnavnet: context-YYYY-MM-DD.md
- Tilføj header med dato og liste over inkluderede filer
- Inkludér indholdet af hver fil med filnavnet som separator
- Prioritér øverst: CURRENT_STATE.md, TASK_BOARD.md, DECISIONS.md, PROFILE_ENGINE_REQUIREMENTS.md

Afslut med: "Snapshot klar: [filsti]"

---

## Hvornår bruges den

1. Projektstyring-chatten siger "jeg har brug for opdateret kontekst"
2. Kør kommandoen i Cowork
3. Upload snapshot-filen til Projektstyring-chatten

Commit bagefter:

```
git add docs/project/COWORK_SYNC.md docs/project/snapshots/
git commit -m "docs: add cowork sync command and snapshots folder"
```
