# ACCOUNT_MIGRATION

## Formål
Denne fil bruges, når JobPilot flyttes til en ny ChatGPT-konto eller et nyt ChatGPT-projekt, så kontekst, status, beslutninger og arbejdsstruktur ikke går tabt.

Målet er at genstarte sikkert fra repo-tilstanden, ikke fra hukommelsen i en gammel chat.

## Sandhedskilde
JobPilots fælles hukommelse er repoet, især filer under `docs/project/`.

Følgende filer er autoritative:
- `docs/project/HANDOFF.md`
- `docs/project/CURRENT_STATE.md`
- `docs/project/DECISIONS.md`
- `docs/project/TASK_BOARD.md`
- `docs/project/QUALITY_GATES.md`
- `docs/project/TEST_LOG.md`
- `docs/project/PROMPT_LIBRARY.md`
- `docs/project/BRUGERKONTEKST.md`
- `docs/project/ACCOUNT_MIGRATION.md`

Hvis noget i en chat strider mod disse filer, er det filerne der gælder.

Ny konto skal have begge kontekstlag:
- **Projektkontekst** (status, beslutninger, tasks, kvalitet)
- **Bruger/workflow-kontekst** (`docs/project/BRUGERKONTEKST.md`)

## Hvad migrationspakken skal indeholde
Når du flytter til ny konto/projekt, skal du have adgang til:

1. `docs/project/*` filer (hele mappen)
2. `AGENTS.md`
3. `README.md`
4. `docs/adaptive-ai-onboarding-v1.md`
5. `docs/current-implementation-status.md`
6. `docs/interview-engine-v1-definition-of-done.md`
7. (Valgfrit) ChatGPT data-export / `conversations.json` som historisk arkiv
8. Lokal repo-sti (fx `C:\dev\cv-ai-platform`) og GitHub repo-identitet
9. Kendt branch/stash status (hvad er aktivt, og hvad ligger evt. i stash)
10. `docs/project/BRUGERKONTEKST.md` som samarbejds-kontekst for ny konto

## Opsætning i ny ChatGPT Project (trin for trin)
1. Opret ny ChatGPT-konto (hvis nødvendigt).
2. Opret et nyt Project med navn: **JobPilot**.
3. Upload eller gør følgende filer tilgængelige i projektet:
   - alle `docs/project/*`
   - `AGENTS.md`
   - `README.md`
   - `docs/adaptive-ai-onboarding-v1.md`
   - `docs/current-implementation-status.md`
   - `docs/interview-engine-v1-definition-of-done.md`
4. Opret fem faste chats i projektet:
   1. **JobPilot – Projektstyring**
   2. **JobPilot – Codex/kode**
   3. **JobPilot – UX/tekst/design**
   4. **JobPilot – Interviewmotor/profil**
   5. **JobPilot – Strategi/forretning**
5. Start med at få assistenten til at læse `docs/project/HANDOFF.md` og `docs/project/CURRENT_STATE.md`.
6. Kør en kort verifikation (se kontrolspørgsmål nederst), før du fortsætter rigtigt arbejde.

## Fælles routing-regel mellem chats
Hvis du starter en opgave i en forkert chat/workstream, skal assistenten:
- stoppe tidligt
- pege på den rigtige JobPilot-chat
- bede dig fortsætte der

Assistenten må ikke fortsætte dybt i forkert workstream for nemheds skyld.

## Regel for lange chats / checkpoint-handoff
Hvis en chat bliver lang, uklar, gentager sig, blander workstreams, modsiger projektfiler, eller tydeligt mister kontekst, skal assistenten stoppe og lave et **handoff-checkpoint**.

Checkpoint skal indeholde:
- hvad der er sikkert kendt
- branch/status (hvis relevant)
- hvad der blev ændret eller besluttet
- relevante filer/tests
- usikkerheder
- næste konkrete handling
- hvilke `docs/project/*` filer der bør opdateres
- om arbejdet bør fortsætte i samme chat eller i en ny

## Første besked i nyt Project (copy/paste)
Brug denne som første besked i den nye JobPilot Project-chat:

```text
Vi starter JobPilot i ny konto. Brug repo og docs/project som source of truth, ikke gammel chat-hukommelse.
Læs først:
1) docs/project/HANDOFF.md
2) docs/project/CURRENT_STATE.md
3) docs/project/DECISIONS.md
4) docs/project/TASK_BOARD.md
5) docs/project/QUALITY_GATES.md
6) docs/project/TEST_LOG.md
7) docs/project/PROMPT_LIBRARY.md
8) docs/project/BRUGERKONTEKST.md
9) docs/project/ACCOUNT_MIGRATION.md

Opsummer derefter kort:
- hvad JobPilot er
- nuværende status
- aktive workstreams/chats
- næste sandsynlige workstream
- vigtigste “må ikke blande”-regler
```

## Kontrolspørgsmål (verifikation af ny konto)
Den nye konto/projekt bør kunne svare klart på:

1. Hvad er JobPilot?
2. Hvad er nuværende status?
3. Hvilke fem chats/workstreams bruges?
4. Hvad er næste sandsynlige workstream?
5. Hvad må ikke blandes sammen?

Hvis svarene er uklare, skal opsætningen ikke betragtes som godkendt endnu.

## Sikkerhedsregler
- Slet ikke gammel konto/projekt, før ny konto er verificeret.
- Stol ikke på ChatGPT-hukommelse alene.
- Indsæt ikke alle gamle chats i én ny chat.
- Genoptag ikke profilarkitektur-arbejde før migration/struktur er verificeret.
- Hold repo + `docs/project/*` som sandhedskilde hele tiden.
