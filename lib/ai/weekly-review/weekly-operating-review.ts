import { generateTrendIntelligence } from "@/lib/ai/trends/trend-intelligence";
import { generateRetrospective } from "@/lib/ai/retrospective/retrospective-intelligence";
import { generateExecutiveDirection } from "@/lib/ai/executive/executive-layer";
import { calculateEnergy } from "@/lib/ai/state/energy-engine";
import { calculateBurnoutRisk } from "@/lib/ai/state/burnout-engine";
import { generatePersonalPolicy } from "@/lib/ai/policy/personal-policy";

export type SupportedLocale = "en" | "sr";

export type WeeklyOperatingReviewResult = {
  summary: string;
  weeklyMode: "protect" | "stabilize" | "execute" | "scale" | "reset";
  keyMessage: string;
  wins: string[];
  risks: string[];
  adjustments: string[];
  operatingDirectives: string[];
  reasoning: string[];
};

function normalizeLocale(locale?: string): SupportedLocale {
  return locale === "sr" ? "sr" : "en";
}

function t(locale: SupportedLocale, en: string, sr: string) {
  return locale === "sr" ? sr : en;
}

function localizeMode(
  mode: "protect" | "stabilize" | "execute" | "scale" | "reset",
  locale: SupportedLocale
) {
  const map = {
    protect: { en: "protect", sr: "zaštita" },
    stabilize: { en: "stabilize", sr: "stabilizacija" },
    execute: { en: "execute", sr: "izvršavanje" },
    scale: { en: "scale", sr: "širenje" },
    reset: { en: "reset", sr: "reset" },
  };

  return locale === "sr" ? map[mode].sr : map[mode].en;
}

export async function generateWeeklyOperatingReview(
  userId: string,
  localeInput?: string
): Promise<WeeklyOperatingReviewResult> {
  const locale = normalizeLocale(localeInput);

  const [trends, retrospective, executive, energy, burnout, policy] =
    await Promise.all([
      generateTrendIntelligence(userId),
      generateRetrospective(userId),
      generateExecutiveDirection(userId),
      calculateEnergy(userId),
      calculateBurnoutRisk(userId),
      generatePersonalPolicy(userId),
    ]);

  let weeklyMode: "protect" | "stabilize" | "execute" | "scale" | "reset" =
    "execute";
  let summary = t(
    locale,
    "The coming week should focus on controlled execution and visible progress.",
    "Predstojeća nedelja treba da se fokusira na kontrolisano izvršavanje i vidljiv napredak."
  );
  let keyMessage = t(
    locale,
    "Push meaningful work, but keep the system clean.",
    "Guraj smislen rad, ali održavaj sistem čistim."
  );

  const risks: string[] = [];
  const operatingDirectives: string[] = [];
  const reasoning: string[] = [];

  const wins = retrospective.wins.slice(0, 4);

  if (burnout.burnoutRisk === "high" || energy.energyLevel === "low") {
    weeklyMode = "protect";
    summary = t(
      locale,
      "The coming week should prioritize protection of energy and reduction of strain.",
      "Predstojeća nedelja treba da prioritet da zaštiti energije i smanjenju opterećenja."
    );
    keyMessage = t(
      locale,
      "Lower pressure first, then rebuild momentum.",
      "Prvo smanji pritisak, pa onda obnavljaj momentum."
    );
    operatingDirectives.push(
      t(
        locale,
        "Do not expand commitments this week.",
        "Ne širi obaveze ove nedelje."
      ),
      t(
        locale,
        "Protect energy before chasing output.",
        "Zaštiti energiju pre nego što juriš output."
      ),
      t(
        locale,
        "Use smaller daily plans and lower-friction wins.",
        "Koristi manje dnevne planove i pobede sa manjim otporom."
      )
    );
    risks.push(
      t(locale, "Burnout risk is elevated.", "Burnout rizik je povišen."),
      t(
        locale,
        "Energy capacity is currently reduced.",
        "Kapacitet energije je trenutno smanjen."
      )
    );
    reasoning.push(
      t(
        locale,
        "Burnout and energy signals dominate weekly planning.",
        "Burnout i energetski signali dominiraju nedeljnim planiranjem."
      )
    );
  } else if (
    executive.mode === "recover" ||
    executive.mode === "stabilize" ||
    trends.direction === "declining"
  ) {
    weeklyMode = "stabilize";
    summary = t(
      locale,
      "The coming week should focus on stabilization before expansion.",
      "Predstojeća nedelja treba da se fokusira na stabilizaciju pre širenja."
    );
    keyMessage = t(
      locale,
      "Reduce drift, clean up overload, and restore consistency.",
      "Smanji drift, raščisti preopterećenje i vrati doslednost."
    );
    operatingDirectives.push(
      t(
        locale,
        "Close open loops before adding new work.",
        "Zatvori otvorene petlje pre dodavanja novog rada."
      ),
      t(
        locale,
        "Keep the active system smaller than usual.",
        "Održi aktivni sistem manjim nego obično."
      ),
      t(
        locale,
        "Reconnect tasks to one important goal.",
        "Ponovo poveži zadatke sa jednim važnim ciljem."
      )
    );
    risks.push(
      t(
        locale,
        "Recent system direction is weak or unstable.",
        "Skorašnji pravac sistema je slab ili nestabilan."
      ),
      t(
        locale,
        "Stability should come before ambition.",
        "Stabilnost treba da dođe pre ambicije."
      )
    );
    reasoning.push(
      t(
        locale,
        "Executive mode or trend direction indicates stabilization is needed.",
        "Izvršni režim ili smer trenda ukazuju da je potrebna stabilizacija."
      )
    );
  } else if (executive.mode === "reset") {
    weeklyMode = "reset";
    summary = t(
      locale,
      "The coming week should be used to reset direction and reduce misalignment.",
      "Predstojeću nedelju treba iskoristiti za reset pravca i smanjenje neusklađenosti."
    );
    keyMessage = t(
      locale,
      "Choose one direction and cut the noise.",
      "Izaberi jedan pravac i ukloni šum."
    );
    operatingDirectives.push(
      t(
        locale,
        "Select one primary goal for the week.",
        "Izaberi jedan glavni cilj za nedelju."
      ),
      t(
        locale,
        "Archive or defer low-value work.",
        "Arhiviraj ili odloži rad male vrednosti."
      ),
      t(
        locale,
        "Rebuild clarity before pushing harder.",
        "Vrati jasnoću pre jačeg pritiska."
      )
    );
    risks.push(
      t(
        locale,
        "System direction appears diffused or misaligned.",
        "Pravac sistema deluje razvodnjeno ili neusklađeno."
      )
    );
    reasoning.push(
      t(
        locale,
        "Executive layer recommends reset-oriented behavior.",
        "Izvršni sloj preporučuje reset-orijentisano ponašanje."
      )
    );
  } else if (
    executive.mode === "scale" &&
    trends.direction === "improving" &&
    burnout.burnoutRisk === "low"
  ) {
    weeklyMode = "scale";
    summary = t(
      locale,
      "The coming week supports stronger execution and selective expansion.",
      "Predstojeća nedelja podržava jače izvršavanje i selektivno širenje."
    );
    keyMessage = t(
      locale,
      "Scale carefully from a stable base.",
      "Širi pažljivo iz stabilne osnove."
    );
    operatingDirectives.push(
      t(
        locale,
        "Push one high-value weekly result to completion.",
        "Dovedi jedan visoko-vredan nedeljni rezultat do kraja."
      ),
      t(
        locale,
        "Expand only where stability already exists.",
        "Širi samo tamo gde stabilnost već postoji."
      ),
      t(
        locale,
        "Preserve what is already working.",
        "Sačuvaj ono što već funkcioniše."
      )
    );
    risks.push(
      t(
        locale,
        "Avoid scaling too many things at once.",
        "Izbegni da širiš previše stvari odjednom."
      )
    );
    reasoning.push(
      t(
        locale,
        "Executive, trend, and burnout signals all support selective scaling.",
        "Izvršni, trend i burnout signali zajedno podržavaju selektivno širenje."
      )
    );
  } else {
    weeklyMode = "execute";
    summary = t(
      locale,
      "The coming week favors focused execution with controlled pressure.",
      "Predstojeća nedelja favorizuje fokusirano izvršavanje uz kontrolisan pritisak."
    );
    keyMessage = t(
      locale,
      "Convert stable structure into visible progress.",
      "Pretvori stabilnu strukturu u vidljiv napredak."
    );
    operatingDirectives.push(
      t(
        locale,
        "Work from a short list of meaningful priorities.",
        "Radi iz kratke liste smislenih prioriteta."
      ),
      t(
        locale,
        "Protect focus blocks early in the day.",
        "Zaštiti fokus blokove rano u toku dana."
      ),
      t(
        locale,
        "Avoid clutter and unnecessary switching.",
        "Izbegavaj nered i nepotrebno prebacivanje."
      )
    );
    risks.push(
      t(
        locale,
        "Execution quality drops if the system becomes crowded.",
        "Kvalitet izvršavanja opada ako sistem postane prenatrpan."
      )
    );
    reasoning.push(
      t(
        locale,
        "No dominant protect/stabilize/reset signal detected.",
        "Nije detektovan dominantan signal za zaštitu/stabilizaciju/reset."
      )
    );
  }

  if (policy.profile === "gentle_rebuilder" && weeklyMode !== "protect") {
    operatingDirectives.push(
      t(
        locale,
        "Keep tone supportive and avoid aggressive pressure.",
        "Zadrži podržavajući ton i izbegavaj agresivan pritisak."
      )
    );
    reasoning.push(
      t(
        locale,
        "Policy profile favors gentler handling.",
        "Policy profil favorizuje blaži pristup."
      )
    );
  }

  if (policy.profile === "ambitious_executor" && weeklyMode === "execute") {
    operatingDirectives.push(
      t(
        locale,
        "Allow stronger execution on the highest-value result.",
        "Dozvoli jače izvršavanje na rezultatu najveće vrednosti."
      )
    );
    reasoning.push(
      t(
        locale,
        "Policy profile supports stronger execution style.",
        "Policy profil podržava jači stil izvršavanja."
      )
    );
  }

  retrospective.nextWeekAdjustments.slice(0, 3).forEach((item) => {
    operatingDirectives.push(item);
  });

  if (risks.length === 0) {
    risks.push(
      t(
        locale,
        "No major weekly operating risk detected.",
        "Nije detektovan glavni nedeljni operativni rizik."
      )
    );
  }

  if (reasoning.length === 0) {
    reasoning.push(
      t(
        locale,
        "Weekly review defaults to current stable system state.",
        "Nedeljni pregled se oslanja na trenutno stabilno stanje sistema."
      )
    );
  }

  return {
    summary,
    weeklyMode,
    keyMessage,
    wins,
    risks,
    adjustments: retrospective.nextWeekAdjustments.slice(0, 4),
    operatingDirectives: Array.from(new Set(operatingDirectives)).slice(0, 8),
    reasoning,
  };
}