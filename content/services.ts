export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  blurb: string;
  description: string;
  bullets: string[];
  category: "emergency" | "panel" | "service-line" | "wiring" | "inspection" | "commercial";
  emergency?: boolean;
};

export const services: Service[] = [
  {
    slug: "emergency",
    title: "24/7 Emergency Electrical Service",
    shortTitle: "Emergency Service",
    blurb:
      "Power out, sparks, burning smell, storm damage — a master electrician is on the line, day or night.",
    description:
      "When the power's out at 2 a.m. or you smell something burning behind the wall, you don't have time for an answering service. Call us and a master electrician picks up — 24 hours a day, 7 days a week, 365 days a year. Often we can resolve the problem with you over the phone at no cost. When we can't, a truck is on the way.",
    bullets: [
      "Live master electrician answers 24/7 — no robots, no answering service",
      "Same-day or next-day for non-emergencies",
      "Free phone consultations — many issues resolved without a service call",
      "Storm response and insurance claim coordination",
    ],
    category: "emergency",
    emergency: true,
  },
  {
    slug: "panel-upgrades",
    title: "Electrical Panel Replacement & Upgrades",
    shortTitle: "Panel Upgrades",
    blurb:
      "150A to 200A is the most common upgrade — bringing older homes up to today's electrical demands safely.",
    description:
      "Older panels (Federal Pacific, Zinsco, glass-fuse boxes, dated breakers) weren't built for the loads modern homes pull. We replace them with code-compliant 200A service, coordinate with the utility, pull permits, and clean up before we leave.",
    bullets: [
      "150A to 200A upgrades (most common)",
      "Federal Pacific and Zinsco replacements",
      "Permit pulling and utility coordination",
    ],
    category: "panel",
  },
  {
    slug: "service-line-replacement",
    title: "Service Line & Weatherhead Replacement",
    blurb:
      "When the line from the pole to your house fails — common after storms or with aging masts.",
    shortTitle: "Service Line",
    description:
      "The wires running from the utility pole to your weatherhead are your responsibility, not the utility's. When they fail — usually after a storm or because the mast has aged out — we replace the run, the mast, and the meter base, coordinate with the power company, and restore your service.",
    bullets: [
      "Storm-damaged service lines",
      "Aging weatherhead and mast replacement",
      "Meter base replacement",
      "Utility coordination start-to-finish",
    ],
    category: "service-line",
  },
  {
    slug: "rewiring",
    title: "Whole-House Rewiring",
    shortTitle: "Rewiring",
    blurb:
      "Older homes still on knob-and-tube or fuse-and-cloth wiring deserve a safer, code-compliant rewire.",
    description:
      "If your home was built before the 1970s, there's a good chance it still has wiring that wouldn't pass an inspection today. We rewire whole houses with minimal drywall damage, convert fuse boxes to modern breakers, and bring everything up to current code.",
    bullets: [
      "Knob-and-tube and cloth-wiring replacement",
      "Fuse-to-breaker conversions",
      "Code-compliant grounding throughout",
      "Minimal drywall impact during cuts",
    ],
    category: "wiring",
  },
  {
    slug: "outlets-and-switches",
    title: "Outlets, Switches & GFCIs",
    shortTitle: "Outlets & Switches",
    blurb:
      "Adding an outlet, replacing a flickering switch, installing required GFCIs in kitchens and baths.",
    description:
      "The small jobs matter too. We install and replace outlets, switches, and dimmers; add GFCIs in kitchens, baths, and outdoors where code requires them; and install dedicated circuits for microwaves, A/C units, and EV chargers.",
    bullets: [
      "Outlet, switch, and dimmer installation",
      "GFCI installation (kitchen, bath, outdoor)",
      "Dedicated circuits for appliances and EV",
      "Outdoor and weatherproof outlets",
    ],
    category: "wiring",
  },
  {
    slug: "code-compliance",
    title: "Code Compliance & Inspections",
    shortTitle: "Code & Inspections",
    blurb:
      "Pre-sale inspections, insurance-required upgrades, township re-inspections — handled.",
    description:
      "Selling a house and the inspector flagged something? Insurance company demanding a panel upgrade? Township needs a permit closed out? We handle code work, pull the permits, and walk it through inspection.",
    bullets: [
      "Pre-sale electrical inspections",
      "Insurance-required upgrades",
      "Township permit and inspection coordination",
      "Code violation correction",
    ],
    category: "inspection",
  },
  {
    slug: "smart-meter-conversions",
    title: "Smart Meter Conversions",
    shortTitle: "Smart Meters",
    blurb:
      "Adapting your service to the utility's smart meter program when retrofits require electrician work.",
    description:
      "When the utility comes through with smart meter conversions and finds the existing service won't take it, you need an electrician to bring it up to spec. We handle the meter base, grounding, and any panel work the conversion requires.",
    bullets: [
      "Meter base replacement for smart meter compatibility",
      "Grounding and bonding upgrades",
      "Utility coordination",
    ],
    category: "service-line",
  },
  {
    slug: "light-commercial",
    title: "Light Commercial Electrical",
    shortTitle: "Commercial",
    blurb:
      "Storefronts, offices, and small industrial spaces across South Jersey.",
    description:
      "We handle light commercial work for businesses across South Jersey and the tri-state — service upgrades, lighting retrofits, dedicated circuits for equipment, and code work for tenant fit-outs.",
    bullets: [
      "Service upgrades for businesses",
      "Lighting retrofits and LED conversions",
      "Equipment circuits and panel additions",
      "Tenant fit-out electrical",
    ],
    category: "commercial",
  },
];

export function findService(slug: string) {
  return services.find((s) => s.slug === slug);
}
