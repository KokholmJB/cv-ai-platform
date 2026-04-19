import Link from "next/link";
import { jobs, recommendationToneClass, statusToneClass } from "@/lib/mock-data";

export default function JobsPage() {
  return (
    <>
      <section className="pb-10 pt-4">
        <div className="max-w-3xl">
          <div className="inline-flex rounded-full border border-cyan-100 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-900">
            Joboversigt
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance text-slate-950 sm:text-5xl">
            Alle job samlet i ét arbejdsflow
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Få overblik over de job, du vurderer, har søgt eller er i dialog om. Hvert opslag kan
            åbnes og bruges som udgangspunkt for næste handling.
          </p>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200/80 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-6">
        <div className="hidden lg:block">
          <div className="grid grid-cols-[minmax(0,2.2fr)_minmax(0,1.4fr)_minmax(0,1.2fr)_minmax(0,1.1fr)_minmax(0,1.3fr)] gap-4 border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-500">
            <span>Job</span>
            <span>Virksomhed</span>
            <span>Lokation</span>
            <span>Status</span>
            <span>Anbefaling</span>
          </div>

          <div className="divide-y divide-slate-200">
            {jobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="grid grid-cols-[minmax(0,2.2fr)_minmax(0,1.4fr)_minmax(0,1.2fr)_minmax(0,1.1fr)_minmax(0,1.3fr)] gap-4 px-4 py-5 transition hover:bg-slate-50"
              >
                <div>
                  <p className="font-semibold text-slate-950">{job.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{job.updatedLabel}</p>
                </div>
                <p className="text-sm text-slate-700">{job.company}</p>
                <p className="text-sm text-slate-700">{job.location}</p>
                <div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusToneClass[job.status]}`}
                  >
                    {job.status}
                  </span>
                </div>
                <div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${recommendationToneClass[job.recommendation]}`}
                  >
                    {job.recommendation}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:hidden">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="rounded-[1.5rem] border border-slate-200/80 p-5 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-slate-950">{job.title}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {job.company} · {job.location}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusToneClass[job.status]}`}
                >
                  {job.status}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between gap-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${recommendationToneClass[job.recommendation]}`}
                >
                  {job.recommendation}
                </span>
                <span className="text-xs font-medium text-slate-500">{job.updatedLabel}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
