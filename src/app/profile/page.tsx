import { buildProfileViewModel } from "@/lib/profile/profile-view-model";

const vm = buildProfileViewModel({
  profileSummary: {
    userProfileData: {
      name: "Maria Jensen",
      currentRole: "Projektleder",
      yearsExperience: "8 år med projektledelse, stakeholder management og tværgående samarbejde.",
      targetDirection: "Projektleder eller Product Manager",
    },
    aiProfileCore: {
      currentWorkReality: "Projektledelse, koordinering og leveranceansvar",
      levelSeniority: "Erfaren",
      transferableStrengths: ["Overblik", "Koordinering", "Tværgående samarbejde"],
      directionOfChange: "Projektledelse eller produktnære roller",
      workStyleFit: "Tydelige rammer og prioritering",
      mismatchRisks: ["Uklare mål", "Konstant brandslukning"],
      confidence: "medium",
    },
  },
  readinessAssessment: {
    level: "minimum_usable",
    targetDirectionSupport: "partial",
    summary: "Første profiludkast",
    strengthSignals: [],
    gapSignals: [],
  },
  profileModel: {
    facts: [],
    interpretations: [],
    uncertainties: [],
    hypotheses: [],
  },
  communicationSignals: {
    answerStyle: "concise",
    structureLevel: "medium",
    evidenceDensity: "low",
  },
  userAvoids: "Rene salgsroller, nattevagter og meget tung rejseaktivitet",
});

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.14),_transparent_32%),linear-gradient(180deg,_#f7fbfd_0%,_#eef4f8_50%,_#ffffff_100%)] text-slate-950">
      <div className="mx-auto w-full max-w-7xl px-6 pb-14 pt-10 sm:px-8 lg:px-12">
        <section className="rounded-[1.75rem] border border-white/80 bg-white/90 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Profil</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Din profil</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">
            Personlig profil først. Den tekniske profil vises som sekundær transparens.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <article className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-slate-950">Personlig profil</h2>
              <p className="mt-2 text-sm leading-7 text-slate-700">{vm.personal.overview.shortSummary}</p>
              <p className="mt-2 text-sm leading-7 text-slate-700">{vm.personal.overview.signalSummary}</p>
            </article>
            <article className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-slate-950">Avanceret: Teknisk profil</h2>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                Den tekniske profil er den strukturerede version, JobPilot bruger til jobmatch, CV, ansøgninger og rådgivning.
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Fakta: {vm.technical.facts.length} · Fortolkninger: {vm.technical.interpretations.length} · Usikkerheder:{" "}
                {vm.technical.uncertainties.length} · Hypoteser: {vm.technical.hypotheses.length}
              </p>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
