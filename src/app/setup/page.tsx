import { SetupFlow } from "@/components/setup-flow";

export default function SetupPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.14),_transparent_32%),linear-gradient(180deg,_#f7fbfd_0%,_#eef4f8_50%,_#ffffff_100%)] text-slate-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col px-6 pb-14 pt-8 sm:px-8 lg:px-12">
        <header className="mb-10 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              JobPilot Setup
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Kom godt i gang med dit AI-onboardingforløb
            </h1>
          </div>
          <div className="hidden rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 shadow-[0_10px_35px_rgba(15,23,42,0.06)] backdrop-blur sm:block">
            Ingen konto nødvendig endnu
          </div>
        </header>

        <SetupFlow />
      </div>
    </main>
  );
}
