export type JobStatus =
  | "Vurderes"
  | "Afventer"
  | "Søgt"
  | "Samtale 1"
  | "Samtale 2"
  | "Samtale 3"
  | "Afslag"
  | "Tilbud";

export type Recommendation = "Stærk anbefaling" | "Relevant" | "Usikker";

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  status: JobStatus;
  recommendation: Recommendation;
  recommendationSummary: string;
  notes: string[];
  deadline: string;
  updatedLabel: string;
  focusArea: string;
};

export const jobs: Job[] = [
  {
    id: "product-manager-northstar",
    title: "Product Manager",
    company: "Northstar Digital",
    location: "København",
    status: "Vurderes",
    recommendation: "Stærk anbefaling",
    recommendationSummary:
      "Rollen matcher din erfaring med tværgående samarbejde og prioritering. Det ligner et opslag, hvor du bør investere tid hurtigt.",
    notes: [
      "Godt match på stakeholder management og roadmap-arbejde.",
      "Bør fremhæve erfaring med produktprioritering og lanceringer i CV og ansøgning.",
    ],
    deadline: "24. april",
    updatedLabel: "Opdateret i dag",
    focusArea: "Produktstrategi og prioritering",
  },
  {
    id: "marketing-lead-brighthub",
    title: "Marketing Lead",
    company: "BrightHub",
    location: "Aarhus",
    status: "Søgt",
    recommendation: "Relevant",
    recommendationSummary:
      "Stillingen er relevant, men konkurrencen virker høj. Dit materiale bør især understøtte ledelsesansvar og dokumenterede resultater.",
    notes: [
      "Ansøgning sendt i sidste uge.",
      "Mulig opfølgning med kort mail, hvis der ikke er svar inden fredag.",
    ],
    deadline: "18. april",
    updatedLabel: "Opdateret i går",
    focusArea: "Ledelse og kampagneperformance",
  },
  {
    id: "operations-manager-logisync",
    title: "Operations Manager",
    company: "LogiSync",
    location: "Odense",
    status: "Afventer",
    recommendation: "Relevant",
    recommendationSummary:
      "Der er et stabilt match på drift og koordinering, men jobopslaget lægger mere vægt på procesoptimering end dine seneste roller.",
    notes: [
      "Mangler stadig at beslutte, om jobbet er prioritet A eller B.",
      "Hvis du går videre, så fremhæv forbedringer i driftstal og samarbejde på tværs.",
    ],
    deadline: "26. april",
    updatedLabel: "Opdateret for 2 dage siden",
    focusArea: "Drift, koordinering og procesforbedring",
  },
  {
    id: "customer-success-director-saascore",
    title: "Customer Success Director",
    company: "SaaSCore",
    location: "Remote i Danmark",
    status: "Samtale 1",
    recommendation: "Stærk anbefaling",
    recommendationSummary:
      "Du står stærkt på relationer, teamledelse og kommerciel forståelse. Samtalen bør forberedes med konkrete cases om fastholdelse og vækst.",
    notes: [
      "Første samtale planlagt tirsdag kl. 10.00.",
      "Forbered en case om onboarding og reduktion af churn.",
    ],
    deadline: "Løbende",
    updatedLabel: "Opdateret i dag",
    focusArea: "Kundefastholdelse og teamledelse",
  },
  {
    id: "business-analyst-finwave",
    title: "Business Analyst",
    company: "FinWave",
    location: "København",
    status: "Afslag",
    recommendation: "Usikker",
    recommendationSummary:
      "Jobbet var delvist relevant, men kravene til tung finansbaggrund lå uden for din nuværende profil.",
    notes: [
      "Afslag modtaget efter screening.",
      "Ingen yderligere handling, men erfaringen kan bruges til at justere fremtidige mål.",
    ],
    deadline: "Afsluttet",
    updatedLabel: "Opdateret for 5 dage siden",
    focusArea: "Analyse og branchespecialisering",
  },
  {
    id: "senior-project-lead-civiclabs",
    title: "Senior Project Lead",
    company: "CivicLabs",
    location: "Aalborg",
    status: "Tilbud",
    recommendation: "Stærk anbefaling",
    recommendationSummary:
      "Forløbet er langt og positivt. Det er et stærkt strategisk match, og næste skridt handler mest om afklaring af ansvar og vilkår.",
    notes: [
      "Tilbud modtaget og gennemgås i denne uge.",
      "Vurder lønniveau, ledelsesansvar og fleksibilitet, før der svares.",
    ],
    deadline: "Svar senest 22. april",
    updatedLabel: "Opdateret i dag",
    focusArea: "Projektledelse og tværgående eksekvering",
  },
];

export const nextSteps = [
  {
    title: "Afslut vurdering af Product Manager hos Northstar Digital",
    description:
      "Det er det stærkeste nye match. Prioritér vurdering og beslut, om du skal generere materiale i dag.",
  },
  {
    title: "Forbered første samtale med SaaSCore",
    description:
      "Saml 2-3 korte cases, der viser ledelse, kundeindsigt og dokumenterede forbedringer.",
  },
  {
    title: "Følg op på ansøgningen til BrightHub",
    description:
      "Planlæg en kort opfølgende mail, hvis du ikke har hørt noget inden ugens udgang.",
  },
];

export const jobStats = {
  underVurdering: jobs.filter((job) => job.status === "Vurderes").length,
  ansoegningerSendt: jobs.filter((job) => job.status === "Søgt").length,
  samtalerIGang: jobs.filter((job) => job.status.startsWith("Samtale")).length,
};

export const statusToneClass: Record<JobStatus, string> = {
  Vurderes: "bg-amber-50 text-amber-700",
  Afventer: "bg-slate-100 text-slate-700",
  Søgt: "bg-sky-50 text-sky-700",
  "Samtale 1": "bg-violet-50 text-violet-700",
  "Samtale 2": "bg-violet-50 text-violet-700",
  "Samtale 3": "bg-violet-50 text-violet-700",
  Afslag: "bg-rose-50 text-rose-700",
  Tilbud: "bg-emerald-50 text-emerald-700",
};

export const recommendationToneClass: Record<Recommendation, string> = {
  "Stærk anbefaling": "bg-emerald-50 text-emerald-700",
  Relevant: "bg-cyan-50 text-cyan-800",
  Usikker: "bg-slate-100 text-slate-700",
};

export function getRecentJobs() {
  return jobs.slice(0, 4);
}

export function getJobById(id: string) {
  return jobs.find((job) => job.id === id);
}
