import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobById, recommendationToneClass, statusToneClass } from "@/lib/mock-data";

type JobDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const job = getJobById(id);

  if (!job) {
    notFound();
  }

  return (
    <>
      <section className="pb-10 pt-4">
        <Link href="/jobs" className="text-sm font-medium text-slate-500 transition hover:text-slate-900">
          Tilbage til joboversigt
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
          <div className="rounded-[2rem] border border-slate-200/80 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${statusToneClass[job.status]}`}
              >
                {job.status}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${recommendationToneClass[job.recommendation]}`}
              >
                {job.recommendation}
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              {job.title}
            </h1>
            <p className="mt-3 text-lg text-slate-600">
              {job.company} · {job.location}
            </p>

            <div className="mt-8 rounded-[1.5rem] border border-cyan-100 bg-cyan-50/80 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-950">
                Anbefalingsresume
              </p>
              <p className="mt-4 text-base leading-7 text-slate-700">{job.recommendationSummary}</p>
            </div>

            <div className="mt-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Noter
              </p>
              <div className="mt-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
                <div className="space-y-4 text-sm leading-7 text-slate-700">
                  {job.notes.map((note) => (
                    <p key={note}>{note}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Handlinger
              </p>
              <div className="mt-5 grid gap-3">
                <button className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800">
                  Vurder job
                </button>
                <button className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50">
                  Generér CV
                </button>
                <button className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50">
                  Generér ansøgning
                </button>
                <button className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50">
                  Opdater status
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Hurtigt overblik
              </p>
              <dl className="mt-5 space-y-4 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-slate-500">Frist</dt>
                  <dd className="font-medium text-slate-900">{job.deadline}</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-slate-500">Senest opdateret</dt>
                  <dd className="font-medium text-slate-900">{job.updatedLabel}</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-slate-500">Primært fokus</dt>
                  <dd className="max-w-[12rem] text-right font-medium text-slate-900">
                    {job.focusArea}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
