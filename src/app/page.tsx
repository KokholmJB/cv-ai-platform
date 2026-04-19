import Link from "next/link";

const features = [
  {
    title: "Vurder om jobbet er værd at gå efter",
    description:
      "JobPilot analyserer opslaget, sammenholder det med din profil og giver en klar anbefaling, før du bruger tid på at søge.",
  },
  {
    title: "Generér skarpe CV'er og ansøgninger",
    description:
      "Byg målrettede dokumenter hurtigere med AI-støtte, tydelig struktur og fokus på det konkrete job.",
  },
  {
    title: "Følg alle job i ét samlet overblik",
    description:
      "Hold styr på job under vurdering, sendte ansøgninger og samtaleforløb uden at miste momentum.",
  },
];

const steps = [
  "Start med opsætning og upload af dokumenter",
  "Lad AI analysere din profil og dine jobmål",
  "Vurdér job, generér materiale og følg status ét sted",
];

export default function Home() {
  return (
    <>
      <section className="grid items-center gap-12 pb-20 pt-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] lg:pb-28">
        <div className="max-w-3xl">
          <div className="inline-flex rounded-full border border-cyan-100 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-900">
            AI-platform til moderne jobsøgning
          </div>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-balance text-slate-950 sm:text-6xl lg:text-7xl">
            JobPilot hjælper dig med at vælge de rigtige job og sende stærkere ansøgninger.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
            Få et seriøst produktmiljø til at vurdere jobmatch, generere CV og ansøgning og følge
            hvert forløb fra første overvejelse til endeligt svar.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/setup"
              className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Start opsætning
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              Se produktet
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-x-10 top-8 h-48 rounded-full bg-cyan-200/40 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Dagens overblik</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                  6 aktive jobspor
                </p>
              </div>
              <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                Klar prioritering
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">Anbefalet at søge</span>
                  <span className="text-slate-500">4 job</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-200">
                  <div className="h-2 w-[72%] rounded-full bg-slate-900" />
                </div>
              </div>

              <div className="rounded-2xl border border-cyan-100 bg-cyan-50/80 p-4">
                <p className="text-sm font-medium text-cyan-950">AI-anbefaling</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Fokusér først på roller med høj matchscore og korte ansøgningsfrister. Det løfter
                  din hitrate og reducerer spildtid.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 p-4">
                  <p className="text-sm text-slate-500">Seneste status</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">2 samtaler i gang</p>
                </div>
                <div className="rounded-2xl border border-slate-100 p-4">
                  <p className="text-sm text-slate-500">Næste trin</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    Generér CV til produktrolle
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Funktioner
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Et seriøst arbejdsværktøj til hele jobsøgningen
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            JobPilot er bygget som et produkt, ikke en enkelt generator. Du får overblik,
            prioritering og handling samlet i samme flow.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="rounded-[1.75rem] border border-slate-200/80 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
                0{index + 1}
              </div>
              <h3 className="mt-6 text-xl font-semibold tracking-tight text-slate-950">
                {feature.title}
              </h3>
              <p className="mt-4 text-base leading-7 text-slate-600">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="rounded-[2rem] border border-slate-200/70 bg-slate-950 px-6 py-10 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] sm:px-8 sm:py-12 lg:px-12">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">
              Sådan starter det
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Et enkelt setup før JobPilot tager over
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-300">
              Du lægger fundamentet én gang. Derefter kan platformen analysere dine dokumenter,
              stille opfølgende spørgsmål og hjælpe dig mere præcist fra job til job.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step}
                className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 backdrop-blur"
              >
                <p className="text-sm font-semibold text-cyan-200">Trin {index + 1}</p>
                <p className="mt-4 text-xl font-semibold leading-8 text-white">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
