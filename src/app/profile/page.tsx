export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.14),_transparent_32%),linear-gradient(180deg,_#f7fbfd_0%,_#eef4f8_50%,_#ffffff_100%)] text-slate-950">
      <div className="mx-auto w-full max-w-7xl px-6 pb-14 pt-10 sm:px-8 lg:px-12">
        <section className="rounded-[1.75rem] border border-white/80 bg-white/90 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Profil (MVP)</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Din profilside er på vej
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">
            Her samler vi den personlige profilvisning først og den tekniske AI-profil som en sekundær, avanceret visning.
          </p>
          <div className="mt-8 flex flex-wrap gap-2 rounded-[1.25rem] border border-slate-200 bg-slate-50 p-3">
            <button type="button" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">
              Personlig profil
            </button>
            <button type="button" className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600">
              Avanceret: Teknisk profil
            </button>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <article className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-slate-950">Personlig profil</h2>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                Læsbar visning af retning, erfaring, styrker, motivation og rammer der ikke passer.
              </p>
            </article>
            <article className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-slate-950">Avanceret: Teknisk AI-profil</h2>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                Den tekniske profil er den strukturerede version, JobPilot bruger til jobmatch, CV, ansøgninger og rådgivning.
              </p>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
