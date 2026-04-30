export type Resource = {
  slug: string;
  title: string;
  blurb: string;
  category: "safety" | "panels" | "diy" | "storm" | "buying";
  readMinutes: number;
  /** ISO date (e.g. "2026-04-01"). Renders as the article dateline ("Apr 2026"). */
  publishedAt: string;
  /** Defaults to "Lyons Electrical" if omitted. */
  author?: string;
  /** Pinned as the editor's-pick on the /resources index. At most one should be true. */
  featured?: boolean;
  body: ResourceBlock[];
};

export type ResourceBlock =
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "callout"; tone: "warning" | "info"; title: string; text: string }
  | { kind: "quote"; text: string; attribution?: string }
  | { kind: "image"; src: string; alt: string; caption?: string; credit?: string }
  | { kind: "video"; youtubeId: string; caption?: string }
  | { kind: "hr" };

export const resources: Resource[] = [
  {
    slug: "when-to-call-an-electrician",
    title: "When to Call an Electrician (and When You Don't Have To)",
    blurb:
      "Most flickering lights aren't an emergency. A burning smell behind a wall is. A practical guide.",
    category: "diy",
    readMinutes: 4,
    publishedAt: "2026-03-12",
    body: [
      {
        kind: "p",
        text: "We get calls every week from people who are convinced their house is about to burn down because of something that turns out to be a loose bulb or a tripped GFCI. We also get calls from people who shrug off a burning smell for two days before picking up the phone. The line between 'no big deal' and 'turn the breaker off right now' isn't always obvious. Here's how we think about it.",
      },
      { kind: "h2", text: "Call us right now" },
      { kind: "ul", items: [
        "You smell something burning, hot plastic, or fish (a sign of overheating wiring)",
        "An outlet is sparking, melted, or warm to the touch",
        "You see arcing, smoke, or scorch marks anywhere",
        "Water has gotten near a panel, outlet, or fixture",
        "A breaker keeps tripping immediately when you reset it",
        "A wire is exposed where someone could touch it",
      ] },
      {
        kind: "callout",
        tone: "warning",
        title: "Active hazard?",
        text: "Don't troubleshoot it yourself. Turn off the breaker for that circuit if you can do so safely, leave the area, and call (856) 895-9667. A master electrician will pick up.",
      },
      { kind: "h2", text: "Schedule a visit (it can wait a day or two)" },
      { kind: "ul", items: [
        "An outlet stopped working and resetting the GFCI didn't fix it",
        "You want to add an outlet, fixture, or dedicated circuit",
        "You're planning a panel upgrade or service-line replacement",
        "You're selling and an inspector flagged something",
        "Lights flicker only sometimes and only on one circuit",
      ] },
      { kind: "h2", text: "You can probably handle it" },
      { kind: "ul", items: [
        "A GFCI outlet has tripped — press the reset button on the outlet itself",
        "A breaker has tripped once after a vacuum, hair dryer, or AC kicked on — reset it once",
        "A bulb went out — replace it with the correct wattage",
      ] },
      {
        kind: "p",
        text: "If you're not sure, just call. We do free phone consultations. Half the time we tell people they don't need us — and we mean it.",
      },
    ],
  },
  {
    slug: "is-my-panel-dangerous",
    title: "Is My Electrical Panel Dangerous?",
    blurb:
      "Federal Pacific, Zinsco, and glass-fuse panels have all earned their reputation. How to spot one.",
    category: "panels",
    readMinutes: 5,
    publishedAt: "2026-04-02",
    featured: true,
    body: [
      {
        kind: "p",
        text: "Most homes built before the late 1980s have a panel that wouldn't be installed today. Some of them are merely outdated. A few of them are genuinely dangerous and need to come out.",
      },
      { kind: "h2", text: "The three panels we replace most often" },
      { kind: "h3", text: "Federal Pacific Stab-Lok" },
      {
        kind: "p",
        text: "The headline brand of dangerous panels. The breakers fail to trip during overloads at rates well above any modern brand. If you have a Federal Pacific Stab-Lok panel, it should be replaced. Insurance companies increasingly refuse to cover homes that still have one.",
      },
      { kind: "h3", text: "Zinsco / Sylvania-Zinsco" },
      {
        kind: "p",
        text: "Similar story — breakers can fuse to the bus bar and fail to trip. Often the bus bar itself shows heat damage when we open one of these up. Replace it.",
      },
      { kind: "h3", text: "Glass-fuse boxes" },
      {
        kind: "p",
        text: "Not necessarily dangerous if maintained correctly, but the wiring downstream of these is usually undersized for modern loads, and people notoriously install oversized fuses to stop the box from blowing — which defeats the protection entirely.",
      },
      {
        kind: "callout",
        tone: "info",
        title: "Not sure what you have?",
        text: "Take a photo of the inside of the panel cover (the inside of the door, where the labels live) and call us. We'll tell you for free.",
      },
      { kind: "h2", text: "What a replacement involves" },
      { kind: "ul", items: [
        "Coordinate a power-down with the utility (usually a few hours)",
        "Pull a permit from your township",
        "Replace the panel and breakers with modern equipment (typically 200A service)",
        "Re-terminate every existing circuit to the new bus",
        "Schedule and pass inspection",
      ] },
      {
        kind: "p",
        text: "Most full panel upgrades are completed in a single day.",
      },
    ],
  },
  {
    slug: "storm-prep-and-response",
    title: "Before, During, and After a Storm",
    blurb:
      "What to do when the lights go out — and what's your responsibility versus the utility's.",
    category: "storm",
    readMinutes: 4,
    publishedAt: "2026-02-18",
    body: [
      {
        kind: "p",
        text: "South Jersey gets nor'easters, summer thunderstorms, and the occasional hurricane remnant. Power goes out. Trees take down service lines. Here's what to do — and an important point about what you own versus what the utility owns.",
      },
      { kind: "h2", text: "What's yours, what's theirs" },
      {
        kind: "p",
        text: "The utility owns the wires running on the poles up to the point where they connect to your house — the weatherhead. Everything from the weatherhead down to your panel — the mast, the meter base, the service entrance — is yours. If the storm tore the line off the side of your house, that's typically an electrician's job, not the utility's.",
      },
      { kind: "h2", text: "Before the storm" },
      { kind: "ul", items: [
        "Charge phones, flashlights, and any medical equipment",
        "Know where your main breaker is and how to throw it",
        "If you have a generator, test it before the wind picks up — not during",
      ] },
      { kind: "h2", text: "During an outage" },
      { kind: "ul", items: [
        "Don't go near downed power lines, even if they look dead",
        "Don't open the fridge unless you have to — it'll hold cold for ~4 hours sealed",
        "If you smell burning or see scorch marks anywhere, call us immediately",
      ] },
      {
        kind: "callout",
        tone: "warning",
        title: "Generator safety",
        text: "Never run a portable generator inside a garage, basement, or near windows. Carbon monoxide has killed more people in storms than the storm itself. If you want a permanently-installed generator with an automatic transfer switch, we can size and install one.",
      },
      { kind: "h2", text: "After the storm" },
      {
        kind: "p",
        text: "If your service line came down or your weatherhead was damaged, call us. We coordinate the repair with the utility, document the damage for your insurance company, and get your power restored as quickly as the utility's crews allow.",
      },
    ],
  },
  {
    slug: "why-master-electricians-matter",
    title: "Why a Master Electrician Picks Up the Phone",
    blurb:
      "The difference between a master, a journeyman, and an apprentice — and why the person on the line matters.",
    category: "buying",
    readMinutes: 3,
    publishedAt: "2026-01-22",
    body: [
      {
        kind: "p",
        text: "When you call most electrical companies after hours, you get an answering service. They take a message and pass it to whoever's on call — sometimes a journeyman, sometimes an apprentice, sometimes a tech who just learned how to run a home-run. We do it differently.",
      },
      { kind: "h2", text: "What 'master' actually means" },
      {
        kind: "p",
        text: "A master electrician has gone through years of apprenticeship, then journeyman work, then passed a master's exam administered by the state. In New Jersey, you can't pull permits, sign off on installations, or run an electrical contracting business without a master's license. It's the highest tier of the trade.",
      },
      { kind: "h2", text: "Why we have one on the phone 24/7" },
      {
        kind: "p",
        text: "When you're calling at 11 p.m. about a sparking outlet or a panel that smells like it's been baking, you don't need someone to take a message. You need someone who can tell you whether to throw the main breaker, whether to leave the house, and whether a truck needs to be on the way in five minutes or in the morning. That's a judgment call only a master can make. So that's who answers.",
      },
      { kind: "h2", text: "We'll talk you off the ledge for free" },
      {
        kind: "p",
        text: "Plenty of calls end with us telling you it's a bulb, a GFCI button, or a switch you forgot you had. We don't charge for that. The number — (856) 895-9667 — is open 24 hours a day, 7 days a week, 365 days a year.",
      },
    ],
  },
  {
    slug: "do-i-need-a-permit",
    title: "Do I Need a Permit For That?",
    blurb:
      "If a township inspector showed up tomorrow, would your last electrical project pass?",
    category: "diy",
    readMinutes: 3,
    publishedAt: "2025-11-08",
    body: [
      {
        kind: "p",
        text: "Most New Jersey townships require a permit for any electrical work beyond replacing a like-for-like fixture. That's the rule. The reality is messier — but the consequences of unpermitted work tend to show up at the worst possible moment, like during a home sale.",
      },
      { kind: "h2", text: "Almost always requires a permit" },
      { kind: "ul", items: [
        "Panel replacement or upgrade",
        "Service-line or weatherhead replacement",
        "New circuits (dedicated outlet for an A/C, EV charger, microwave, etc.)",
        "Sub-panel installation",
        "Any work involving the meter base",
        "Generator transfer switch installation",
      ] },
      { kind: "h2", text: "Usually doesn't require a permit" },
      { kind: "ul", items: [
        "Replacing a like-for-like outlet, switch, or fixture",
        "Replacing a single breaker (same amperage)",
        "Replacing a bulb (obviously)",
      ] },
      {
        kind: "callout",
        tone: "info",
        title: "When in doubt",
        text: "We pull permits as part of every job that needs one — it's baked into the price. If you're hiring someone who suggests skipping the permit to save you money, hire someone else.",
      },
    ],
  },
  {
    slug: "ev-charging-at-home",
    title: "Installing an EV Charger at Home",
    blurb:
      "What it actually takes to get a Level 2 charger in your garage, and what it usually costs.",
    category: "buying",
    readMinutes: 4,
    publishedAt: "2026-04-15",
    body: [
      {
        kind: "p",
        text: "EV chargers are the most common new-circuit installation we do. The car comes with a charger or you buy one separately; we install the dedicated circuit it needs. Here's the practical version.",
      },
      { kind: "h2", text: "What it takes" },
      { kind: "ul", items: [
        "A dedicated 240V circuit, typically 40A or 50A",
        "Wire run from the panel to the charger location",
        "A receptacle (NEMA 14-50 is most common) or hardwired connection",
        "A permit and inspection",
      ] },
      { kind: "h2", text: "What can complicate it" },
      { kind: "ul", items: [
        "Your panel doesn't have capacity for a new 40-50A circuit (we may need to upgrade the panel)",
        "The charger is far from the panel (long wire runs add cost)",
        "Older homes with finicky service may need bonding/grounding work",
      ] },
      {
        kind: "p",
        text: "We'll come out, look at your panel, look at where you want the charger, and quote the actual job — not a generic install fee. Most installs land between a few hundred and a couple thousand dollars depending on the run and whether the panel needs work.",
      },
    ],
  },
];

export function findResource(slug: string) {
  return resources.find((r) => r.slug === slug);
}
