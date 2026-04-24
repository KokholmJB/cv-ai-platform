"use client";

import { useMemo, useState } from "react";

type StepId =
  | "intro"
  | "dokumenter"
  | "basisprofil"
  | "jobpraeferencer"
  | "personlig-stil"
  | "opsummering";

type UploadedFile = {
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
};

type SetupFormState = {
  documentsSkipped: boolean;
  profile: {
    navn: string;
    nuvaerendeTitel: string;
    erfaring: string;
    uddannelse: string;
    lokation: string;
  };
  preferences: {
    jobtype: string;
    arbejdsform: string;
    loenniveau: string;
    transporttid: string;
    geografi: string;
    brancher: string;
    undgaa: string;
  };
  style: {
    formalitet: string;
    laengde: string;
    tone: string;
  };
};

type InterviewResult =
  | {
      status: "idle";
      message: null;
      question: null;
      focusArea: null;
    }
  | {
      status: "continue";
      message: null;
      question: string;
      focusArea: string;
    }
  | {
      status: "complete";
      message: string;
      question: null;
      focusArea: null;
    };

const steps: { id: StepId; label: string; eyebrow: string; title: string }[] = [
  {
    id: "intro",
    label: "Intro",
    eyebrow: "Trin 1",
    title: "Sådan lærer JobPilot dig at kende",
  },
  {
    id: "dokumenter",
    label: "Dokumenter",
    eyebrow: "Trin 2",
    title: "Giv AI et stærkt udgangspunkt",
  },
  {
    id: "basisprofil",
    label: "Basisprofil",
    eyebrow: "Trin 3",
    title: "Byg din grundprofil",
  },
  {
    id: "jobpraeferencer",
    label: "Jobpræferencer",
    eyebrow: "Trin 4",
    title: "Fortæl hvad du faktisk søger",
  },
  {
    id: "personlig-stil",
    label: "Personlig stil",
    eyebrow: "Trin 5",
    title: "Sæt retning for sprog og tone",
  },
  {
    id: "opsummering",
    label: "Opsummering",
    eyebrow: "Trin 6",
    title: "Se hvad AI arbejder videre med",
  },
];

const mockUploadedFiles: UploadedFile[] = [
  {
    name: "CV_Maria_Jensen_2026.pdf",
    type: "CV",
    size: "1,8 MB",
    uploadedAt: "Uploadet for 2 min siden",
  },
  {
    name: "Ansættelseskontrakt_Northwind.pdf",
    type: "Ansættelseskontrakt",
    size: "840 KB",
    uploadedAt: "Uploadet for 4 min siden",
  },
  {
    name: "Kandidatbevis_CBS.pdf",
    type: "Uddannelsespapir",
    size: "620 KB",
    uploadedAt: "Uploadet for 5 min siden",
  },
];

const aiInterviewQuestions = [
  "Hvilke typer stillinger føles mest motiverende for dig lige nu?",
  "Er der erfaring eller resultater, du altid gerne vil have fremhævet i dine ansøgninger?",
  "Hvornår oplever du, at din tone skal være mere formel end personlig?",
];

const initialState: SetupFormState = {
  documentsSkipped: false,
  profile: {
    navn: "Maria Jensen",
    nuvaerendeTitel: "Projektleder",
    erfaring: "8 år med projektledelse, stakeholder management og tværgående samarbejde.",
    uddannelse: "Cand.merc. i strategi og ledelse",
    lokation: "København",
  },
  preferences: {
    jobtype: "Projektleder eller Product Manager",
    arbejdsform: "Fuldtid",
    loenniveau: "52.000-60.000 kr./md.",
    transporttid: "Maks. 45 minutter hver vej",
    geografi: "København og omegn",
    brancher: "SaaS, konsulentbranchen og grøn omstilling",
    undgaa: "Rene salgsroller, nattevagter og meget tung rejseaktivitet",
  },
  style: {
    formalitet: "Balanceret formel",
    laengde: "Kort og præcis",
    tone: "Direkte og varm",
  },
};

function ProgressPill({
  active,
  completed,
  index,
  label,
}: {
  active: boolean;
  completed: boolean;
  index: number;
  label: string;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition ${
        active
          ? "border-slate-900 bg-slate-950 text-white shadow-[0_16px_40px_rgba(15,23,42,0.14)]"
          : completed
            ? "border-cyan-100 bg-cyan-50 text-cyan-950"
            : "border-slate-200 bg-white text-slate-600"
      }`}
    >
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
          active
            ? "bg-white/15 text-white"
            : completed
              ? "bg-cyan-100 text-cyan-900"
              : "bg-slate-100 text-slate-500"
        }`}
      >
        {index + 1}
      </div>
      <div>
        <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${active ? "text-slate-200" : "text-slate-400"}`}>
          Trin {index + 1}
        </p>
        <p className="text-sm font-semibold">{label}</p>
      </div>
    </div>
  );
}

export function SetupFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formState, setFormState] = useState<SetupFormState>(initialState);
  const [interviewResult, setInterviewResult] = useState<InterviewResult>({
    status: "idle",
    message: null,
    question: null,
    focusArea: null,
  });
  const [interviewAnswer, setInterviewAnswer] = useState("");
  const [interviewErrorMessage, setInterviewErrorMessage] = useState<string | null>(null);
  const [isInterviewLoading, setIsInterviewLoading] = useState(false);

  const progressValue = useMemo(
    () => Math.round(((currentStep + 1) / steps.length) * 100),
    [currentStep],
  );

  const current = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  function updateProfile(field: keyof SetupFormState["profile"], value: string) {
    setFormState((previous) => ({
      ...previous,
      profile: {
        ...previous.profile,
        [field]: value,
      },
    }));
  }

  function updatePreferences(field: keyof SetupFormState["preferences"], value: string) {
    setFormState((previous) => ({
      ...previous,
      preferences: {
        ...previous.preferences,
        [field]: value,
      },
    }));
  }

  function updateStyle(field: keyof SetupFormState["style"], value: string) {
    setFormState((previous) => ({
      ...previous,
      style: {
        ...previous.style,
        [field]: value,
      },
    }));
  }

  function goNext() {
    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  }

  function goBack() {
    setCurrentStep((step) => Math.max(step - 1, 0));
  }

  async function requestInterviewTurn(lastAssistantQuestion: string | null, lastUserAnswer: string | null) {
    setIsInterviewLoading(true);
    setInterviewErrorMessage(null);

    try {
      const response = await fetch("/api/onboarding/interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phase: "initial",
          profileDraft: {
            name: formState.profile.navn,
            currentRole: formState.profile.nuvaerendeTitel,
            yearsExperience: formState.profile.erfaring,
            targetDirection: formState.preferences.jobtype,
          },
          lastAssistantQuestion,
          lastUserAnswer,
        }),
      });

      const data = (await response.json()) as
        | {
            ok: true;
            status: "continue";
            question: string;
            focusArea: string;
          }
        | {
            ok: true;
            status: "complete";
          }
        | {
            ok: false;
            error?: string;
          };

      if (!response.ok || !data.ok) {
        setInterviewErrorMessage("Kunne ikke hente næste spørgsmål lige nu.");
        return;
      }

      if (data.status === "complete") {
        setInterviewResult({
          status: "complete",
          message: "JobPilot har nok information til fase 1 og kan gå videre til profilvurdering.",
          question: null,
          focusArea: null,
        });
        setInterviewAnswer("");
        return;
      }

      setInterviewResult({
        status: "continue",
        message: null,
        question: data.question,
        focusArea: data.focusArea,
      });
      setInterviewAnswer("");
    } catch {
      setInterviewErrorMessage("Kunne ikke hente næste spørgsmål lige nu.");
    } finally {
      setIsInterviewLoading(false);
    }
  }

  async function startInterview() {
    await requestInterviewTurn(null, null);
  }

  async function continueInterview() {
    if (interviewResult.status !== "continue") {
      return;
    }

    const trimmedAnswer = interviewAnswer.trim();

    if (!trimmedAnswer) {
      setInterviewErrorMessage("Skriv et kort svar for at fortsætte.");
      return;
    }

    await requestInterviewTurn(interviewResult.question, trimmedAnswer);
  }

  function renderInterviewPanel() {
    return (
      <div className="rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Første AI-spørgsmål
          </p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
            Start den første interviewrunde
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            JobPilot bruger din basisprofil og din jobretning til at stille det første målrettede spørgsmål.
          </p>
        </div>

        {interviewResult.status === "idle" ? (
          <div className="mt-6 rounded-[1.25rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm leading-7 text-slate-700">
              Når du er klar, kan du starte den første AI-runde med knappen nederst.
            </p>
          </div>
        ) : null}

        {interviewResult.status === "continue" ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-[1.25rem] border border-cyan-100 bg-cyan-50/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-950">
                Fokusområde: {interviewResult.focusArea}
              </p>
              <p className="mt-3 text-base leading-7 text-slate-800">{interviewResult.question}</p>
            </div>

            <TextAreaField
              label="Dit svar"
              value={interviewAnswer}
              onChange={setInterviewAnswer}
              rows={4}
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={continueInterview}
                disabled={isInterviewLoading}
                className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isInterviewLoading ? "Henter næste spørgsmål..." : "Fortsæt"}
              </button>
            </div>
          </div>
        ) : null}

        {interviewResult.status === "complete" ? (
          <div className="mt-6 rounded-[1.25rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm leading-7 text-slate-700">{interviewResult.message}</p>
          </div>
        ) : null}

        {interviewErrorMessage ? (
          <div className="mt-6 rounded-[1.25rem] border border-rose-200 bg-rose-50 p-5">
            <p className="text-sm leading-7 text-rose-700">{interviewErrorMessage}</p>
          </div>
        ) : null}
      </div>
    );
  }

  function renderStep() {
    switch (current.id) {
      case "intro":
        return (
          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-cyan-100 bg-cyan-50/80 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-950">
                Hvad der sker nu
              </p>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-700">
                JobPilot lærer dig at kende gennem dokumenter, præferencer og korte spørgsmål. Målet
                er ikke at presse dig ind i en skabelon, men at skabe naturlige og målrettede CV&apos;er,
                ansøgninger og jobvurderinger, som faktisk føles som dig.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {[
                {
                  title: "Dokumenter først",
                  description:
                    "Dine eksisterende filer hjælper AI med at forstå erfaring, roller og resultater hurtigere.",
                },
                {
                  title: "Spørgsmål bagefter",
                  description:
                    "Du får opfølgende spørgsmål, hvor der mangler nuance eller tydelig retning i din profil.",
                },
                {
                  title: "Bedre output",
                  description:
                    "Jo bedre onboarding, desto mere præcist kan JobPilot tilpasse materiale til konkrete stillinger.",
                },
              ].map((card) => (
                <article
                  key={card.title}
                  className="rounded-[1.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.05)]"
                >
                  <h3 className="text-lg font-semibold tracking-tight text-slate-950">{card.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{card.description}</p>
                </article>
              ))}
            </div>
          </div>
        );
      case "dokumenter":
        return (
          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50/80 p-6 sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Uploadområde
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                    Del dine vigtigste dokumenter med JobPilot
                  </h3>
                  <p className="mt-3 text-base leading-7 text-slate-600">
                    Upload dit CV, ansættelseskontrakter, uddannelsespapirer og andre relevante
                    dokumenter. Der er ingen rigtig upload endnu, men UI&apos;et viser, hvordan
                    flowet vil fungere.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormState((previous) => ({
                      ...previous,
                      documentsSkipped: !previous.documentsSkipped,
                    }))
                  }
                  className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                >
                  {formState.documentsSkipped ? "Fortsæt med dokumenter" : "Spring over for nu"}
                </button>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {["CV", "Ansættelseskontrakter", "Uddannelsespapirer", "Andre dokumenter"].map(
                  (label) => (
                    <div
                      key={label}
                      className="rounded-[1.5rem] border border-white/90 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]"
                    >
                      <p className="text-sm font-medium text-slate-500">{label}</p>
                      <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                        Slip filer her eller vælg dokument
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Klargjorte filer
                  </p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
                    Mockliste over uploadede dokumenter
                  </h3>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {formState.documentsSkipped ? "Springes over midlertidigt" : "3 filer registreret"}
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {mockUploadedFiles.map((file) => (
                  <div
                    key={file.name}
                    className="flex flex-col gap-4 rounded-[1.25rem] border border-slate-200/70 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-slate-950">{file.name}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {file.type} · {file.size} · {file.uploadedAt}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      Vis preview
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "basisprofil":
        return (
          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              label="Navn"
              value={formState.profile.navn}
              onChange={(value) => updateProfile("navn", value)}
            />
            <FormField
              label="Nuværende titel"
              value={formState.profile.nuvaerendeTitel}
              onChange={(value) => updateProfile("nuvaerendeTitel", value)}
            />
            <FormField
              label="Lokation"
              value={formState.profile.lokation}
              onChange={(value) => updateProfile("lokation", value)}
            />
            <TextAreaField
              label="Uddannelse"
              value={formState.profile.uddannelse}
              onChange={(value) => updateProfile("uddannelse", value)}
              className="md:col-span-2"
              rows={3}
            />
            <TextAreaField
              label="Erfaring"
              value={formState.profile.erfaring}
              onChange={(value) => updateProfile("erfaring", value)}
              className="md:col-span-2"
              rows={4}
            />
          </div>
        );
      case "jobpraeferencer":
        return (
          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              label="Ønsket jobtype"
              value={formState.preferences.jobtype}
              onChange={(value) => updatePreferences("jobtype", value)}
            />
            <SelectField
              label="Fuldtid eller deltid"
              value={formState.preferences.arbejdsform}
              onChange={(value) => updatePreferences("arbejdsform", value)}
              options={["Fuldtid", "Deltid", "Åben for begge"]}
            />
            <FormField
              label="Lønniveau"
              value={formState.preferences.loenniveau}
              onChange={(value) => updatePreferences("loenniveau", value)}
            />
            <FormField
              label="Transporttid"
              value={formState.preferences.transporttid}
              onChange={(value) => updatePreferences("transporttid", value)}
            />
            <FormField
              label="Geografi"
              value={formState.preferences.geografi}
              onChange={(value) => updatePreferences("geografi", value)}
            />
            <FormField
              label="Brancher"
              value={formState.preferences.brancher}
              onChange={(value) => updatePreferences("brancher", value)}
            />
            <TextAreaField
              label="Hvad du ikke ønsker"
              value={formState.preferences.undgaa}
              onChange={(value) => updatePreferences("undgaa", value)}
              className="md:col-span-2"
              rows={4}
            />
          </div>
        );
      case "personlig-stil":
        return (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-6">
              <div className="rounded-[1.75rem] border border-cyan-100 bg-cyan-50/80 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-950">
                  Om personlig stil
                </p>
                <p className="mt-4 text-base leading-8 text-slate-700">
                  JobPilot tilpasser tone, ordvalg og struktur til dig, så output føles naturligt og
                  troværdigt. Det handler ikke kun om at være formel eller uformel, men om at ramme
                  den måde, du gerne vil fremstå på over for arbejdsgivere.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <SelectField
                  label="Formalitet"
                  value={formState.style.formalitet}
                  onChange={(value) => updateStyle("formalitet", value)}
                  options={["Formel", "Balanceret formel", "Uformel"]}
                />
                <SelectField
                  label="Formulering"
                  value={formState.style.laengde}
                  onChange={(value) => updateStyle("laengde", value)}
                  options={["Kort og præcis", "Balanceret", "Fyldig og forklarende"]}
                />
                <SelectField
                  label="Tone"
                  value={formState.style.tone}
                  onChange={(value) => updateStyle("tone", value)}
                  options={["Direkte og varm", "Reflekteret", "Meget direkte"]}
                />
              </div>
            </div>

            <aside className="rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                AI-interview preview
              </p>
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">
                Eksempler på opfølgende spørgsmål
              </h3>
              <div className="mt-6 space-y-3">
                {aiInterviewQuestions.map((question) => (
                  <div key={question} className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm leading-7 text-slate-700">{question}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        );
      case "opsummering":
        return (
          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-cyan-100 bg-cyan-50/80 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-950">
                Klar til næste fase
              </p>
              <p className="mt-4 text-base leading-8 text-slate-700">
                JobPilot bruger denne profil til at tilpasse CV&apos;er, ansøgninger og vurderinger af
                jobopslag. Efter setup kommer AI med opfølgende spørgsmål, når noget kræver mere
                præcision eller personlig nuance.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <SummaryCard
                title="Basisprofil"
                items={[
                  ["Navn", formState.profile.navn],
                  ["Titel", formState.profile.nuvaerendeTitel],
                  ["Lokation", formState.profile.lokation],
                  ["Uddannelse", formState.profile.uddannelse],
                  ["Erfaring", formState.profile.erfaring],
                ]}
              />
              <SummaryCard
                title="Jobpræferencer"
                items={[
                  ["Jobtype", formState.preferences.jobtype],
                  ["Arbejdsform", formState.preferences.arbejdsform],
                  ["Lønniveau", formState.preferences.loenniveau],
                  ["Transporttid", formState.preferences.transporttid],
                  ["Geografi", formState.preferences.geografi],
                  ["Brancher", formState.preferences.brancher],
                  ["Ønsker ikke", formState.preferences.undgaa],
                ]}
              />
              <SummaryCard
                title="Personlig stil"
                items={[
                  ["Formalitet", formState.style.formalitet],
                  ["Formulering", formState.style.laengde],
                  ["Tone", formState.style.tone],
                ]}
              />
              <SummaryCard
                title="Dokumenter"
                items={[
                  [
                    "Status",
                    formState.documentsSkipped
                      ? "Springes over foreløbigt, AI fortsætter med spørgsmål senere."
                      : "3 mock-dokumenter klargjort som udgangspunkt for analysen.",
                  ],
                  ["Typer", "CV, ansættelseskontrakter og uddannelsespapirer"],
                ]}
              />
            </div>

            {renderInterviewPanel()}
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="rounded-[2rem] border border-white/80 bg-white/80 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur xl:sticky xl:top-8 xl:h-fit">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Fremdrift
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              {progressValue}%
            </p>
          </div>
          <div className="text-right text-sm text-slate-500">
            <p>{currentStep + 1} af {steps.length}</p>
            <p>{current.label}</p>
          </div>
        </div>

        <div className="mt-5 h-2 rounded-full bg-slate-200">
          <div
            className="h-2 rounded-full bg-slate-950 transition-all duration-300"
            style={{ width: `${progressValue}%` }}
          />
        </div>

        <div className="mt-6 space-y-3">
          {steps.map((step, index) => (
            <ProgressPill
              key={step.id}
              active={index === currentStep}
              completed={index < currentStep}
              index={index}
              label={step.label}
            />
          ))}
        </div>
      </aside>

      <div className="rounded-[2rem] border border-white/80 bg-white/85 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8 lg:p-10">
        <div className="flex flex-col gap-5 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              {current.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              {current.title}
            </h2>
          </div>

          <button
            type="button"
            className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Gem og fortsæt senere
          </button>
        </div>

        <div className="py-8">{renderStep()}</div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={isFirstStep}
            className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Tilbage
          </button>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Gem og fortsæt senere
            </button>
            {!isLastStep || interviewResult.status === "idle" ? (
              <button
                type="button"
                onClick={isLastStep ? startInterview : goNext}
                disabled={isInterviewLoading}
                className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLastStep
                  ? isInterviewLoading
                    ? "Starter..."
                    : "Start AI-interview"
                  : "Næste"}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function FieldWrapper({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="mb-3 block text-sm font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function FormField({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <FieldWrapper label={label} className={className}>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
      />
    </FieldWrapper>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
  className?: string;
}) {
  return (
    <FieldWrapper label={label} className={className}>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
      />
    </FieldWrapper>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <FieldWrapper label={label}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}

function SummaryCard({
  title,
  items,
}: {
  title: string;
  items: [string, string][];
}) {
  return (
    <article className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 p-6">
      <h3 className="text-lg font-semibold tracking-tight text-slate-950">{title}</h3>
      <dl className="mt-5 space-y-4">
        {items.map(([label, value]) => (
          <div key={`${title}-${label}`} className="border-b border-slate-200 pb-4 last:border-b-0 last:pb-0">
            <dt className="text-sm font-medium text-slate-500">{label}</dt>
            <dd className="mt-2 text-sm leading-7 text-slate-700">{value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
