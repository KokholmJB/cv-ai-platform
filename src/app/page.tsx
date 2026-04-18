const features = [
  {
    title: "AI onboarding, der forstår din profil",
    description:
      "CV Klar stiller de rigtige spørgsmål, så platformen hurtigt forstår din erfaring, dine styrker og den retning, du søger.",
  },
  {
    title: "CV og ansøgninger på få minutter",
    description:
      "Generér skarpe, målrettede dokumenter med tydelig struktur, professionelt sprog og fokus på det job, du vil lande.",
  },
  {
    title: "Vurdering af jobannoncer med heat score",
    description:
      "Få et hurtigt overblik over, hvor godt din profil matcher opslaget, og hvad du bør fremhæve for at stå stærkere.",
  },
];

const steps = [
  "Upload dokumenter eller spring over",
  "AI lærer dig at kende gennem spørgsmål",
  "Generér målrettet CV og ansøgning",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.12),_transparent_35%),linear-gradient(180deg,_#f8fbff_0%,_#eef4f7_52%,_#ffffff_100%)] text-slate-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col px-6 pb-12 pt-6 sm:px-8 lg:px-12">
        <header className="sticky top-0 z-10 mb-12 rounded-full border border-white/70 bg-white/80 px-5 py-4 shadow-[0_10px_35px_rgba(15,23,42,0.06)] backdrop-blur md:mb-20">
          <div className="flex items-center justify-between gap-4">
            <a href="#top" className="text-lg font-semibold tracking-tight text-slate-900">
              CV Klar
            </a>
            <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
              <a href="#funktioner" className="transition hover:text-slate-950">
                Funktioner
              </a>
              <a href="#saadan-fungerer-det" className="transition hover:text-slate-950">
                Saadan virker det
              </a>
            </nav>
          </div>
        </header>

        <section
          id="top"
          className="grid items-center gap-12 pb-20 pt-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:pb-28"
        >
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-cyan-100 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-900">
              AI-hjælp til danske jobsøgere
            </div>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-balance text-slate-950 sm:text-6xl lg:text-7xl">
              Gør din jobsøgning skarpere med en AI-platform bygget til CV og ansøgninger.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              CV Klar hjælper dig med at forstå din egen profil, tilpasse dine dokumenter til
              konkrete stillinger og arbejde mere struktureret gennem hele jobsøgningen.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#saadan-fungerer-det"
                className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Kom i gang
              </a>
              <a
                href="#funktioner"
                className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                Se hvordan det virker
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-x-10 top-8 h-48 rounded-full bg-cyan-200/40 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Matchanalyse</p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                    Heat score: 84
                  </p>
                </div>
                <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                  Stærk kandidat
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">Kompetencematch</span>
                    <span className="text-slate-500">Meget høj</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-slate-200">
                    <div className="h-2 w-[88%] rounded-full bg-slate-900" />
                  </div>
                </div>

                <div className="rounded-2xl border border-cyan-100 bg-cyan-50/80 p-4">
                  <p className="text-sm font-medium text-cyan-950">AI-anbefaling</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    Fremhæv din erfaring med projektledelse og tilpas profilen mod tværfagligt
                    samarbejde for et endnu skarpere match.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-100 p-4">
                    <p className="text-sm text-slate-500">CV-kvalitet</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-950">Klar til afsendelse</p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 p-4">
                    <p className="text-sm text-slate-500">Ansøgning</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-950">Målrettet udkast</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="funktioner" className="py-16 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Funktioner
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Alt det vigtigste samlet i ét enkelt flow
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Platformen er bygget til at skabe ro, overblik og bedre kvalitet i dine jobmaterialer.
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

        <section id="saadan-fungerer-det" className="py-16 sm:py-20">
          <div className="rounded-[2rem] border border-slate-200/70 bg-slate-950 px-6 py-10 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] sm:px-8 sm:py-12 lg:px-12">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">
                Sådan virker det
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Tre enkle trin fra usikker start til klare dokumenter
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-300">
                Du behøver ikke have alt klar på forhånd. Flowet er designet til at møde dig, hvor
                du er.
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

        <footer className="mt-auto border-t border-slate-200/80 pt-8 text-sm text-slate-500">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>CV Klar</p>
            <p>En moderne AI-platform til CV, ansøgninger og bedre jobmatch.</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
