import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

type AuditFinding = {
  level: "WARN" | "FAIL";
  label: string;
  where: string;
  snippet: string;
};

type StepReview = {
  name: string;
  screenshot: string;
  visibleText: string;
  findings: AuditFinding[];
};

type InterviewRun = {
  completed: boolean;
  turns: number;
  notes: string[];
};

const BASE_URL = "http://localhost:3000/setup";
const OUTPUT_DIR = path.join(process.cwd(), "test-results", "setup-ux-review");
const TIMESTAMP = new Date().toISOString();
const MAX_INTERVIEW_TURNS = 15;

const forbiddenPatterns: { label: string; regex: RegExp; level?: "WARN" | "FAIL" }[] = [
  { label: "Brugeren wording", regex: /\bbrugeren\b/i, level: "FAIL" },
  { label: "Forbidden no-go wording", regex: /\bno-go\b/i, level: "FAIL" },
  { label: "Forbidden technical label: Styrkesignaler", regex: /\bstyrkesignaler\b/i, level: "WARN" },
  { label: "Forbidden wording: gap", regex: /\bgap\b/i, level: "WARN" },
  { label: "Forbidden wording: hul/huller", regex: /\bhul(?:ler)?\b/i, level: "WARN" },
  { label: "Forbidden wording: mangler", regex: /\bmangler\b/i, level: "WARN" },
  { label: "Forbidden wording: ikke stærkt nok", regex: /ikke\s+stærkt\s+nok/i, level: "FAIL" },
  { label: "Forbidden wording: endnu ikke bevist", regex: /endnu\s+ikke\s+bevist/i, level: "FAIL" },
  { label: "Forbidden wording: ikke bevist", regex: /\bikke\s+bevist\b/i, level: "WARN" },
  { label: "Forbidden wording: underbygget", regex: /\bunderbygget\b/i, level: "WARN" },
  { label: "Forbidden wording: formelt roadmap", regex: /formelt\s+roadmap/i, level: "FAIL" },
  { label: "Forbidden wording: backlogansvar", regex: /\bbacklogansvar\b/i, level: "FAIL" },
  { label: "Forbidden wording: datagrundlag", regex: /\bdatagrundlag\b/i, level: "WARN" },
  { label: "Forbidden wording: matchvurdering", regex: /\bmatchvurdering\b/i, level: "WARN" },
  { label: "Forbidden wording: foreløbig vurdering", regex: /\bforeløbig\s+vurdering\b/i, level: "WARN" },
  {
    label: "Forbidden wording: ansvarsniveauet er tilstrækkeligt belyst",
    regex: /ansvarsniveauet\s+er\s+tilstrækkeligt\s+belyst/i,
    level: "FAIL",
  },
  { label: "Snake_case-like token", regex: /\b[a-z]+_[a-z0-9_]+\b/, level: "FAIL" },
  { label: "Raw technical key: profileModel", regex: /\bprofilemodel\b/i, level: "FAIL" },
  { label: "Raw technical key: uncertainties", regex: /\buncertainties\b/i, level: "FAIL" },
  { label: "Raw technical key: hypotheses", regex: /\bhypotheses\b/i, level: "FAIL" },
  { label: "Mojibake: Ã¦", regex: /Ã¦/, level: "WARN" },
  { label: "Mojibake: Ã¸", regex: /Ã¸/, level: "WARN" },
  { label: "Mojibake: Ã¥", regex: /Ã¥/, level: "WARN" },
  { label: "Mojibake: Ã…", regex: /Ã…/, level: "WARN" },
  { label: "Mojibake: â€¢", regex: /â€¢/, level: "WARN" },
  { label: "Mojibake: â€™", regex: /â€™/, level: "WARN" },
];

const suspectDanishAsciiForms = [/\bfoer\b/i, /\bforstaar\b/i, /\bsoeger\b/i, /\bnaeste\b/i, /\btilfoej\b/i, /\bgaa\b/i, /\bmaal\b/i];

function snippetAround(text: string, index: number, radius = 70) {
  const start = Math.max(0, index - radius);
  const end = Math.min(text.length, index + radius);
  return text.slice(start, end).replace(/\s+/g, " ").trim();
}

function auditText(text: string, where: string): AuditFinding[] {
  const findings: AuditFinding[] = [];
  for (const pattern of forbiddenPatterns) {
    const match = pattern.regex.exec(text);
    if (!match || match.index === undefined) continue;
    findings.push({
      level: pattern.level ?? "WARN",
      label: pattern.label,
      where,
      snippet: snippetAround(text, match.index),
    });
  }
  for (const pattern of suspectDanishAsciiForms) {
    const match = pattern.exec(text);
    if (!match || match.index === undefined) continue;
    findings.push({
      level: "WARN",
      label: "Possible Danish ASCII fallback",
      where,
      snippet: snippetAround(text, match.index),
    });
  }
  return findings;
}

function pickInterviewAnswer(question: string, turn: number) {
  const q = question.toLowerCase();
  if (q.includes("ansvar") || q.includes("niveau") || q.includes("senioritet")) {
    return "Jeg havde ansvar for planlægning, koordinering, opfølgning og at få leverancen færdig. Jeg tog ikke alle strategiske beslutninger alene, men jeg havde ansvar for fremdrift, interessenter og den praktiske gennemførelse.";
  }
  if (q.includes("styrk") || q.includes("resultat") || q.includes("eksempel") || q.includes("konkret")) {
    return "Resultatet var en mere stabil proces, bedre overblik for interessenterne og færre afklaringer i slutningen af projektet. Jeg har ikke alle tal, men leverancen blev gennemført og kunne bruges i driften.";
  }
  if (q.includes("nuværende") || q.includes("arbejde") || q.includes("rolle") || q.includes("hverdag")) {
    return "Jeg har primært arbejdet med projektledelse, koordinering, interessenter, leverancer og tværgående samarbejde i en drifts- og leveranceorganisation.";
  }
  if (q.includes("ikke passer") || q.includes("undgå") || q.includes("fravalg")) {
    return "Jeg vil helst undgå roller med konstant uklare mål, meget tung rejseaktivitet, rene salgsopgaver og miljøer hvor ansvar og prioriteringer skifter uden forklaring.";
  }
  if (q.includes("retning") || q.includes("søger") || q.includes("næste job")) {
    return "Retningen er et næste skridt mod projektledelse eller produktnære roller. Jeg vil gerne bruge min erfaring med koordinering, struktur og samarbejde, men stadig teste hvilke roller der passer bedst.";
  }
  if (q.includes("trives") || q.includes("arbejdsmiljø") || q.includes("rammer")) {
    return "Jeg trives bedst med tydelige rammer, ansvar der er afstemt, samarbejde på tværs og mulighed for at skabe fremdrift uden konstant brandslukning.";
  }
  const defaults = [
    "Jeg har arbejdet med koordinering, ansvar, samarbejde og konkrete leverancer. Jeg vil gerne finde en retning, hvor erfaringen kan bruges realistisk, og hvor rammerne passer bedre.",
    "Jeg arbejder struktureret, kommunikerer tydeligt og tager ansvar for fremdrift.",
    "Jeg er god til at skabe overblik og få samarbejde til at fungere i praksis.",
  ];
  return defaults[turn % defaults.length];
}

async function getInterviewAnswerField(page: import("playwright").Page) {
  const byLabel = page.getByLabel("Dit svar").first();
  if (await byLabel.isVisible().catch(() => false)) return byLabel;

  const textboxes = page.getByRole("textbox");
  const textboxCount = await textboxes.count();
  if (textboxCount > 0) {
    const candidate = textboxes.nth(textboxCount - 1);
    if (await candidate.isVisible().catch(() => false)) return candidate;
  }

  const interviewCardTextbox = page.locator("div:has-text('AI-INTERVIEW') textarea, div:has-text('AI-INTERVIEW') input").last();
  if (await interviewCardTextbox.isVisible().catch(() => false)) return interviewCardTextbox;

  return null;
}

async function fillInterviewAnswer(page: import("playwright").Page, answer: string) {
  const field = await getInterviewAnswerField(page);
  if (!field) return false;

  await field.scrollIntoViewIfNeeded().catch(() => undefined);
  await field.fill(answer);
  const afterFill = ((await field.inputValue().catch(() => "") ?? "") as string).trim();
  if (afterFill.length > 0) return true;

  await field.click({ clickCount: 3 }).catch(() => undefined);
  await page.keyboard.type(answer).catch(() => undefined);
  const afterType = ((await field.inputValue().catch(() => "") ?? "") as string).trim();
  return afterType.length > 0;
}

async function isInterviewCompleted(page: import("playwright").Page) {
  const doneText = await page.getByText(/Interviewet er gennemført/i).first().isVisible().catch(() => false);
  if (doneText) return true;
  const successPanel = await page.getByText(/Gå videre til Profiloverblik/i).first().isVisible().catch(() => false);
  return doneText || successPanel;
}

function toMarkdown(report: {
  timestamp: string;
  appUrl: string;
  stepsVisited: string[];
  screenshots: string[];
  reviews: StepReview[];
  findings: AuditFinding[];
  hardErrors: string[];
  interview: InterviewRun;
  tabsAudited: string[];
  tabsNotReached: string[];
}) {
  const failCount = report.findings.filter((f) => f.level === "FAIL").length;
  const warnCount = report.findings.filter((f) => f.level === "WARN").length;
  const overall = report.hardErrors.length > 0 ? "FAIL" : failCount > 0 ? "FAIL" : warnCount > 0 ? "WARN" : "PASS";

  const lines: string[] = [];
  lines.push("# JobPilot Setup UX Review", "");
  lines.push("## Summary");
  lines.push(`- Overall status: ${overall}`);
  lines.push(`- Timestamp: ${report.timestamp}`);
  lines.push(`- App URL: ${report.appUrl}`);
  lines.push(`- Interview completed: ${report.interview.completed}`);
  lines.push(`- Interview turns: ${report.interview.turns}`);
  lines.push(`- Screenshots: ${report.screenshots.length}`);
  lines.push(`- Tabs audited: ${report.tabsAudited.length}`);
  lines.push(`- Tabs not reached: ${report.tabsNotReached.length}`);
  lines.push(`- Content warnings: ${warnCount}`);
  lines.push(`- Content fails: ${failCount}`);
  lines.push(`- Hard errors: ${report.hardErrors.length}`);
  lines.push("");

  if (report.interview.notes.length > 0) {
    lines.push("### Interview run notes");
    for (const note of report.interview.notes) lines.push(`- ${note}`);
    lines.push("");
  }

  if (report.hardErrors.length > 0) {
    lines.push("### Hard errors");
    for (const err of report.hardErrors) lines.push(`- ${err}`);
    lines.push("");
  }

  lines.push("## Steps visited");
  for (const step of report.stepsVisited) lines.push(`- ${step}`);
  lines.push("");

  lines.push("## Screenshots");
  for (const file of report.screenshots) lines.push(`- ${file}`);
  lines.push("");

  lines.push("## Tab coverage");
  lines.push(`- Audited tabs: ${report.tabsAudited.join(", ") || "None"}`);
  lines.push(`- Not reached tabs: ${report.tabsNotReached.join(", ") || "None"}`);
  lines.push("");

  lines.push("## Step review");
  for (const review of report.reviews) {
    lines.push(`### ${review.name}`);
    lines.push(`- Screenshot: ${review.screenshot}`);
    lines.push("");
    lines.push("Visible text:");
    lines.push("```text");
    lines.push(review.visibleText.trim().slice(0, 5000) || "(No text captured)");
    lines.push("```");
    if (review.findings.length > 0) {
      lines.push("");
      lines.push("Audit warnings:");
      for (const finding of review.findings) {
        lines.push(`- [${finding.level}] ${finding.label}: ${finding.snippet}`);
      }
    }
    lines.push("");
  }

  lines.push("## Content audit findings");
  if (report.findings.length === 0) {
    lines.push("- None");
  } else {
    for (const finding of report.findings) {
      lines.push(`- [${finding.level}] ${finding.where}: ${finding.label} — ${finding.snippet}`);
    }
  }
  lines.push("");

  lines.push("## Recommendation notes");
  lines.push(
    "- Denne rapport er en automatiseret tekst- og screenshot-gennemgang. Den erstatter ikke en endelig menneskelig UX-vurdering af tone, flow og forståelighed.",
  );
  lines.push("");

  return lines.join("\n");
}

async function captureStep(page: import("playwright").Page, name: string, screenshotFile: string): Promise<StepReview> {
  await page.waitForTimeout(250);
  const section = page.locator("section").first();
  const visibleText = await section.innerText();
  await page.screenshot({ path: path.join(OUTPUT_DIR, screenshotFile), fullPage: true });
  return {
    name,
    screenshot: screenshotFile,
    visibleText,
    findings: auditText(visibleText, name),
  };
}

async function clickByName(page: import("playwright").Page, name: string, timeoutMs = 5000) {
  try {
    await page.getByRole("button", { name, exact: true }).click({ timeout: timeoutMs });
    await page.waitForTimeout(250);
    return true;
  } catch {
    return false;
  }
}

async function runInterview(page: import("playwright").Page): Promise<InterviewRun> {
  const notes: string[] = [];
  let turns = 0;

  const startClicked =
    (await clickByName(page, "Start AI-interview", 4000)) ||
    (await clickByName(page, "Start AI interview", 4000));
  if (!startClicked) {
    notes.push("Kunne ikke starte interviewet via knappen 'Start AI-interview'.");
    return { completed: false, turns, notes };
  }

  for (let i = 0; i < MAX_INTERVIEW_TURNS; i += 1) {
    if (await isInterviewCompleted(page)) {
      return { completed: true, turns, notes };
    }

    const questionText = await page
      .locator("div.rounded-\\[1\\.25rem\\].border.border-cyan-100 p")
      .last()
      .innerText()
      .catch(() => "");
    const answer = pickInterviewAnswer(questionText, i);

    const filled = await fillInterviewAnswer(page, answer);
    if (!filled) {
      notes.push("Kunne ikke finde svarfelt under interviewloop.");
      break;
    }

    const continueClicked = (await clickByName(page, "Fortsæt", 8000)) || (await clickByName(page, "Henter næste spørgsmål...", 1200));
    if (!continueClicked) {
      const completedNow = await isInterviewCompleted(page);
      if (completedNow) {
        return { completed: true, turns, notes };
      }
      notes.push("Kunne ikke klikke 'Fortsæt' i interviewloop.");
      break;
    }
    turns += 1;
  }

  const completed = await isInterviewCompleted(page);
  if (!completed) {
    notes.push(`Interview blev ikke markeret som gennemført inden for ${MAX_INTERVIEW_TURNS} ture.`);
  }
  return { completed, turns, notes };
}

async function run() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const stepsVisited: string[] = [];
  const screenshots: string[] = [];
  const reviews: StepReview[] = [];
  const hardErrors: string[] = [];
  const softWarnings: string[] = [];
  const tabsAudited: string[] = [];
  const tabsNotReached: string[] = [];
  let interviewResult: InterviewRun = { completed: false, turns: 0, notes: [] };

  let browser: import("playwright").Browser | null = null;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

    const response = await page.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 20000 });
    if (!response || !response.ok()) {
      throw new Error(`Could not open ${BASE_URL}. HTTP status: ${response?.status() ?? "unknown"}`);
    }

    const start = await captureStep(page, "Start", "01-start.png");
    stepsVisited.push("Start");
    screenshots.push(start.screenshot);
    reviews.push(start);

    if (!(await clickByName(page, "Basisoplysninger"))) softWarnings.push("Kunne ikke navigere til Basisoplysninger.");
    const basis = await captureStep(page, "Basisoplysninger", "02-basisoplysninger.png");
    stepsVisited.push("Basisoplysninger");
    screenshots.push(basis.screenshot);
    reviews.push(basis);

    if (!(await clickByName(page, "Dokumenter"))) softWarnings.push("Kunne ikke navigere til Dokumenter.");
    const docs = await captureStep(page, "Dokumenter", "03-dokumenter.png");
    stepsVisited.push("Dokumenter");
    screenshots.push(docs.screenshot);
    reviews.push(docs);

    if (!(await clickByName(page, "AI-interview"))) softWarnings.push("Kunne ikke navigere til AI-interview.");
    const interviewStep = await captureStep(page, "AI-interview", "04-ai-interview.png");
    stepsVisited.push("AI-interview");
    screenshots.push(interviewStep.screenshot);
    reviews.push(interviewStep);

    interviewResult = await runInterview(page);
    const interviewAfter = await captureStep(page, "AI-interview - efter kørsel", "05-ai-interview-after-run.png");
    stepsVisited.push("AI-interview - efter kørsel");
    screenshots.push(interviewAfter.screenshot);
    reviews.push(interviewAfter);

    if (!interviewResult.completed) {
      tabsNotReached.push("Overblik", "Erfaring", "Jobretning", "Arbejdsprofil", "Næste skridt");
      softWarnings.push("Interview not completed, profile tabs not audited.");
    } else {
      const nextClicked = await clickByName(page, "Næste");
      if (!nextClicked) softWarnings.push("Kunne ikke klikke videre til Profiloverblik efter interview.");
      if (!(await clickByName(page, "Profiloverblik"))) softWarnings.push("Kunne ikke skifte direkte til Profiloverblik via step-knap.");

      const profileOverview = await captureStep(page, "Profiloverblik - Overblik", "06-profiloverblik-overblik.png");
      stepsVisited.push("Profiloverblik - Overblik");
      screenshots.push(profileOverview.screenshot);
      reviews.push(profileOverview);

      const tabs: Array<{ label: string; stepName: string; screenshot: string }> = [
        { label: "Overblik", stepName: "Profiloverblik - Overblik", screenshot: "07-profiloverblik-overblik-tab.png" },
        { label: "Erfaring", stepName: "Profiloverblik - Erfaring", screenshot: "08-profiloverblik-erfaring.png" },
        { label: "Jobretning", stepName: "Profiloverblik - Jobretning", screenshot: "09-profiloverblik-jobretning.png" },
        { label: "Arbejdsprofil", stepName: "Profiloverblik - Arbejdsprofil", screenshot: "10-profiloverblik-arbejdsprofil.png" },
        { label: "Næste skridt", stepName: "Profiloverblik - Næste skridt", screenshot: "11-profiloverblik-naeste-skridt.png" },
      ];

      for (const tab of tabs) {
        const clicked = await clickByName(page, tab.label, 3500);
        if (!clicked) {
          tabsNotReached.push(tab.label);
          softWarnings.push(`Kunne ikke åbne fanen "${tab.label}".`);
          continue;
        }
        tabsAudited.push(tab.label);
        const tabReview = await captureStep(page, tab.stepName, tab.screenshot);
        stepsVisited.push(tab.stepName);
        screenshots.push(tabReview.screenshot);
        reviews.push(tabReview);
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    hardErrors.push(message);
  } finally {
    if (browser) await browser.close();
  }

  const findings = reviews.flatMap((r) => r.findings);
  for (const warning of softWarnings) {
    findings.push({
      level: "WARN",
      label: "Flow limitation",
      where: "Runtime",
      snippet: warning,
    });
  }
  for (const note of interviewResult.notes) {
    findings.push({
      level: "WARN",
      label: "Interview runtime note",
      where: "Interview",
      snippet: note,
    });
  }

  const markdown = toMarkdown({
    timestamp: TIMESTAMP,
    appUrl: BASE_URL,
    stepsVisited,
    screenshots,
    reviews,
    findings,
    hardErrors,
    interview: interviewResult,
    tabsAudited,
    tabsNotReached,
  });

  const reportPath = path.join(OUTPUT_DIR, "setup-profile-review.md");
  await writeFile(reportPath, `\uFEFF${markdown}`, "utf8");

  const failCount = findings.filter((f) => f.level === "FAIL").length;
  const warnCount = findings.filter((f) => f.level === "WARN").length;
  console.log(`[setup-ux-review] report: ${reportPath}`);
  console.log(`[setup-ux-review] interview: completed=${interviewResult.completed} turns=${interviewResult.turns}`);
  console.log(`[setup-ux-review] screenshots: ${screenshots.length}`);
  console.log(`[setup-ux-review] tabs audited: ${tabsAudited.length}, tabs not reached: ${tabsNotReached.length}`);
  console.log(`[setup-ux-review] findings: ${warnCount} WARN, ${failCount} FAIL`);

  if (hardErrors.length > 0) {
    console.error("[setup-ux-review] hard errors:");
    for (const err of hardErrors) console.error(`- ${err}`);
    process.exitCode = 1;
  } else {
    process.exitCode = 0;
  }
}

void run();
