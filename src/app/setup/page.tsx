export default function SetupPage() {
  return (
    <>
      <section className="pb-10 pt-4">
        <div className="max-w-3xl">
          <div className="inline-flex rounded-full border border-cyan-100 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-900">
            Opsætning
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance text-slate-950 sm:text-5xl">
            Første trin i dit AI-interview
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Start med at dele dine dokumenter, dine basisoplysninger og det, du søger. JobPilot
            analyserer materialet og vender senere tilbage med opfølgende spørgsmål.
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Upload dokumenter
          </p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
            Del det, du allerede har
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Upload dit nuværende CV, tidligere ansøgninger eller andre relevante dokumenter. AI vil
            bruge dem som udgangspunkt for analysen.
          </p>
          <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
            Træk filer hertil eller vælg dokumenter senere. Ingen upload er aktiv endnu i denne
            prototype.
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Basisoplysninger
          </p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
            Giv AI den nødvendige kontekst
          </h2>
          <div className="mt-6 grid gap-4">
            <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-500">Navn</p>
              <p className="mt-2 text-base text-slate-900">Skrives senere i produktflowet</p>
            </div>
            <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-500">Erfaringsniveau</p>
              <p className="mt-2 text-base text-slate-900">Junior, mellem eller senior</p>
            </div>
            <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-500">Fagligt fokus</p>
              <p className="mt-2 text-base text-slate-900">Fx marketing, produkt, drift eller analyse</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Hvad søger du
          </p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
            Definér retning og præferencer
          </h2>
          <div className="mt-6 space-y-4 text-base leading-7 text-slate-600">
            <p>JobPilot vil senere spørge ind til roller, brancher, lokation, lønniveau og ønsket arbejdsmåde.</p>
            <p>
              Når AI har analyseret dine dokumenter, får du opfølgende spørgsmål, så anbefalinger
              og genereret materiale bliver mere præcise.
            </p>
          </div>
          <div className="mt-6 rounded-[1.5rem] border border-cyan-100 bg-cyan-50/80 p-5">
            <p className="text-sm font-medium text-cyan-950">Vigtigt at vide</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Dette er begyndelsen på et AI-interview, ikke en almindelig formular. Platformen
              bygger videre på dine svar over tid.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
