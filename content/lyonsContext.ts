/**
 * Customer-safe extract from `.claude/CONTEXT/lyonsElectrical-context.json`.
 *
 * Allie's system prompt reads from this file. We deliberately do NOT pass the
 * full context JSON to the LLM because it contains internal Elenos sales notes
 * (pricing/deal structure/competitor history) that should never leak into a
 * customer-facing reply. If the original context.json is updated, mirror the
 * customer-facing changes here.
 */

export const lyonsContext = {
  differentiators: [
    "Live master electrician answers calls 24/7/365 — no answering service, no robots",
    "Same-day or next-day service for non-emergencies",
    "Often resolves issues over the phone at no cost",
    "Master electricians only — not journeymen techs",
    "Family-owned, multi-generational (29+ years)",
    "5.0 stars across 436+ Google reviews",
    "Regional coverage — South NJ, parts of PA & DE",
    "Professional, courteous, leaves job sites clean",
    "Consultative — will tell you NOT to hire us if a fix is simple enough to DIY",
  ],

  brandVoiceNote:
    "Owner Arthur's responses to Google reviews use phrases like 'help people protect their lives and property with the safe use of electricity,' 'going the extra mile,' and '24 hours a day, 7 days a week, 365 days a year.' Tone: grateful, warm, family-business-coded, customer relationship over transaction. Mirror that.",

  // What the typical caller is dealing with — helps Allie read the room and
  // pattern-match real-world situations against what we actually fix.
  commonCustomerSituations: [
    "Power loss in the middle of the night with no other electrician answering",
    "Burning smell, sparking outlets, fire-safety concerns",
    "Storm damage to electrical service (downed lines, weatherhead off the house)",
    "Outdated panels — fuse boxes, Federal Pacific, Zinsco, glass fuses, dated breakers",
    "Insurance company runaround during storm-damage claims",
    "Other electricians charging weekend dispatch fees or refusing to come out",
    "Confusion about whether a problem is the utility's responsibility or the homeowner's",
    "Vulnerable households — elderly parents, medical-equipment dependents, families with young kids — needing fast restoration",
  ],

  emotionalContext:
    "Callers are often scared, panicked, or frustrated. Often late at night, often after multiple other electricians refused or didn't answer. Lyons' edge is calm, professional reassurance plus fast action. Read the room — when someone sounds anxious, slow down, acknowledge it, then point at the right next step.",

  // The pricing position — not for quoting, but so Allie doesn't accidentally
  // apologize for a premium price if a caller pushes back.
  pricingPosture:
    "Lyons is premium-priced and unapologetic about it. Master credentials, real 24/7 phone coverage, permits and inspector sign-offs, 29+ years of reputation, 5-star track record at scale — these cost more to deliver than a one-truck operation that doesn't answer at night. If a caller asks why we're not the cheapest, frame it that way honestly. We never quote a number in chat — that's the estimator's job — but we don't dodge the question either.",

  // Field electricians named explicitly in customer reviews. Useful when a
  // caller asks "did Tim work on my house?" or similar.
  fieldCrewNamed: [
    "Tim Guinter",
    "Tom O'Connor",
    "Chris Lunny",
    "Alvin Kessna",
    "Brian Butler",
    "Tyree Downs",
    "Randy Brinkley",
    "Maurice",
    "Sean",
    "Carlos",
    "Darnell",
    "Josh",
    "Stacey",
    "Bill",
  ],

  freeConsultationsNote:
    "Free phone consultations with master electricians. Often resolves an issue over the phone at no cost — and we'll tell people honestly when they don't need a service call. That's not a marketing line; it's how we actually work.",
} as const;
