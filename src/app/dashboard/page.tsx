import Link from "next/link";
import { getRecentJobs, jobStats, nextSteps } from "@/lib/mock-data";

const stats = [
  {
    title: "Job under vurdering",
    value: String(jobStats.underVurdering),
    description: "Opslag hvor du endnu vurderer relevans, match og prioritet.",
  },
  {
    title: "Ansøgninger sendt",
    value: String(jobStats.ansoegningerSendt),
    description: "Stillinger hvor materiale er sendt, og næste opfølgning bør planlægges.",
  },
  {
    title: "Samtaler i gang",
    value: String(jobStats.samtalerIGang),
    description: "Forløb hvor du allerede er videre og bør forberede næste skridt.",
  },
];

export default function DashboardPage() {
  const recentJobs = getRecentJobs();

  return (
    <>
      <section className="grid gap-10 pb-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-center">
        <div className="max-w-3xl">
          <div className="inline-flex rounded-full border border-cyan-100 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-900">
            Dashboard
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance text-slate-950 sm:text-5xl lg:text-6xl">
            Velkommen tilbage til JobPilot
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
            Her får du et samlet billede af din jobsøgning, dine aktive forløb og de handlinger,
            der skaber mest fremdrift lige nu.
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-x-10 top-8 h-48 rounded-full bg-cyan-200/40 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Ugens fokus</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                  Prioritér de stærkeste match
                </p>
              </div>
              <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                Høj fremdrift
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-cyan-100 bg-cyan-50/80 p-5">
              <p className="text-sm font-medium text-cyan-950">Anbefaling</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Brug de næste 30 minutter på roller med høj anbefaling og tæt deadline. Det giver
                typisk bedst afkast på din indsats.
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Næste dokument</p>
                <p className="mt-2 text-xl font-semibold text-slate-950">CV til produktchefrolle</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Næste opfølgning</p>
                <p className="mt-2 text-xl font-semibold text-slate-950">Mail efter samtale 1</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {stats.map((card) => (
            <article
              key={card.title}
              className="rounded-[1.75rem] border border-slate-200/80 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
            >
              <p className="text-sm font-medium text-slate-500">{card.title}</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
                {card.value}
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 py-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <div className="rounded-[2rem] border border-slate-200/70 bg-slate-950 px-6 py-10 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] sm:px-8 sm:py-12">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">
              Næste skridt
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Tre konkrete handlinger, der holder tempoet oppe
            </h2>
          </div>

          <div className="mt-10 grid gap-5">
            {nextSteps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 backdrop-blur"
              >
                <p className="text-sm font-semibold text-cyan-200">Trin {index + 1}</p>
                <p className="mt-4 text-xl font-semibold leading-8 text-white">{step.title}</p>
                <p className="mt-3 text-base leading-7 text-slate-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Seneste job
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                Job, du nyligt har arbejdet på
              </h2>
            </div>
            <Link
              href="/jobs"
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Se alle
            </Link>
          </div>

          <div className="mt-8 space-y-4">
            {recentJobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="block rounded-[1.25rem] border border-slate-200/70 p-4 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">{job.title}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {job.company} · {job.location}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {job.status}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{job.recommendationSummary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
