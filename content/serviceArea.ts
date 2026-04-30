export type ServiceCity = {
  name: string;
  state: "NJ" | "PA" | "DE";
};

export const cities: ServiceCity[] = [
  { name: "Blackwood", state: "NJ" },
  { name: "Cherry Hill", state: "NJ" },
  { name: "Mt. Laurel", state: "NJ" },
  { name: "Marlton", state: "NJ" },
  { name: "Burlington", state: "NJ" },
  { name: "Willingboro", state: "NJ" },
  { name: "Beverly", state: "NJ" },
  { name: "Riverside", state: "NJ" },
  { name: "Mt. Holly", state: "NJ" },
  { name: "Medford Lakes", state: "NJ" },
  { name: "Berlin", state: "NJ" },
  { name: "Sicklerville", state: "NJ" },
  { name: "Williamstown", state: "NJ" },
  { name: "Glassboro", state: "NJ" },
  { name: "Swedesboro", state: "NJ" },
  { name: "Mullica Hill", state: "NJ" },
  { name: "Salem", state: "NJ" },
  { name: "Millville", state: "NJ" },
  { name: "Vineland", state: "NJ" },
  { name: "Elmer", state: "NJ" },
  { name: "Cape May", state: "NJ" },
  { name: "Voorhees", state: "NJ" },
  { name: "Camden", state: "NJ" },
  { name: "Wenonah", state: "NJ" },
  { name: "Bellmawr", state: "NJ" },
  { name: "Carneys Point", state: "NJ" },
  { name: "Marlboro", state: "NJ" },
  { name: "Fallsington", state: "PA" },
  { name: "Newtown", state: "PA" },
  { name: "Haverford", state: "PA" },
  { name: "Wilmington", state: "DE" },
];

export const citiesByState = {
  NJ: cities.filter((c) => c.state === "NJ"),
  PA: cities.filter((c) => c.state === "PA"),
  DE: cities.filter((c) => c.state === "DE"),
};

export type RegionId = "camden-core" | "burlington" | "gloucester-salem" | "shore-south" | "pa-de";

export type ServiceRegion = {
  id: RegionId;
  label: string;
  tagline: string;
  description: string;
  towns: string[];
  jobCount: number;
  topServices: string[];
  jobs: { title: string; icon: "panel" | "ev" | "generator" | "wire" | "surge" | "light" | "siren" | "wrench" }[];
  quote: { text: string; author: string; town: string };
  /** Hand-tuned ellipse anchoring the region cluster on the 1000x700 viewBox. */
  shape: { cx: number; cy: number; rx: number; ry: number };
  isHQ?: boolean;
};

export const regions: ServiceRegion[] = [
  {
    id: "camden-core",
    label: "Camden County Core",
    tagline: "Our home base since day one.",
    description:
      "Headquartered in Blackwood, this is where we cut our teeth. We're often on a Cherry Hill panel upgrade by 8am and a Camden emergency call by 2pm.",
    towns: ["Blackwood", "Cherry Hill", "Camden", "Voorhees", "Bellmawr", "Berlin", "Sicklerville"],
    jobCount: 184,
    topServices: ["Service panel upgrades", "Whole-home rewires", "Emergency repairs"],
    jobs: [
      { title: "200A panel upgrade", icon: "panel" },
      { title: "Whole-home surge protection", icon: "surge" },
      { title: "Emergency panel replacement", icon: "siren" },
    ],
    quote: {
      text: "Lost power Sunday morning, Lyons truck was in the driveway by 11. Same-day fix on a 200A panel.",
      author: "Mike R.",
      town: "Cherry Hill",
    },
    shape: { cx: 320, cy: 250, rx: 75, ry: 75 },
    isHQ: true,
  },
  {
    id: "burlington",
    label: "Burlington County",
    tagline: "Suburban swing — Marlton to Mt. Holly.",
    description:
      "Heavy on residential remodels and finished-basement work. EV chargers are the #1 ask in this stretch since the new Tesla showroom opened.",
    towns: [
      "Mt. Laurel",
      "Marlton",
      "Burlington",
      "Willingboro",
      "Beverly",
      "Riverside",
      "Mt. Holly",
      "Medford Lakes",
      "Marlboro",
    ],
    jobCount: 142,
    topServices: ["EV charger installs", "Basement & addition wiring", "Recessed lighting"],
    jobs: [
      { title: "Tesla wall connector", icon: "ev" },
      { title: "Finished basement circuits", icon: "wire" },
      { title: "Generator transfer switch", icon: "generator" },
    ],
    quote: {
      text: "Installed our Tesla wall connector and a backup generator transfer switch in one visit. Clean conduit work.",
      author: "Sarah K.",
      town: "Mt. Laurel",
    },
    shape: { cx: 425, cy: 200, rx: 65, ry: 110 },
  },
  {
    id: "gloucester-salem",
    label: "Gloucester & Salem",
    tagline: "Older homes, knob-and-tube territory.",
    description:
      "Lots of farmhouses and pre-war housing stock. We do full rewires, knob-and-tube replacements, and outbuilding feeders out here.",
    towns: [
      "Williamstown",
      "Glassboro",
      "Wenonah",
      "Swedesboro",
      "Mullica Hill",
      "Carneys Point",
      "Salem",
      "Elmer",
    ],
    jobCount: 96,
    topServices: ["Knob-and-tube replacement", "Outbuilding feeders", "Service entrance upgrades"],
    jobs: [
      { title: "Full home rewire", icon: "wire" },
      { title: "Detached garage feeder", icon: "panel" },
      { title: "Service entrance upgrade", icon: "panel" },
    ],
    quote: {
      text: "1920s house, fuse panel still in the basement. Lyons crew rewired the whole thing in four days.",
      author: "Tom B.",
      town: "Mullica Hill",
    },
    shape: { cx: 245, cy: 340, rx: 105, ry: 80 },
  },
  {
    id: "shore-south",
    label: "Cape May & Cumberland",
    tagline: "Shore homes & farm country.",
    description:
      "Vacation rentals down the shore, agricultural service out by Vineland. Storm-prone — we install a lot of generators and surge protection here.",
    towns: ["Vineland", "Millville", "Cape May"],
    jobCount: 58,
    topServices: ["Whole-home generators", "Surge protection", "Marina-grade outlets"],
    jobs: [
      { title: "Generac 22kW install", icon: "generator" },
      { title: "Marina-grade outlets", icon: "surge" },
      { title: "Whole-home surge protection", icon: "surge" },
    ],
    quote: {
      text: "Generac 22kW installed and running before hurricane season. Worth every dollar.",
      author: "Dana L.",
      town: "Cape May",
    },
    shape: { cx: 380, cy: 505, rx: 115, ry: 115 },
  },
  {
    id: "pa-de",
    label: "PA & DE Crossings",
    tagline: "Across the bridge — and worth the trip.",
    description:
      "We don't service all of PA or DE, but for our long-time clients in Bucks County and Wilmington, we're still a phone call away.",
    towns: ["Newtown", "Fallsington", "Haverford", "Wilmington"],
    jobCount: 41,
    topServices: ["Service calls", "Diagnostic visits", "Repeat-customer remodels"],
    jobs: [
      { title: "Diagnostic & repair visit", icon: "wrench" },
      { title: "Long-distance service call", icon: "wrench" },
      { title: "Past-client remodel", icon: "light" },
    ],
    quote: {
      text: "Moved from Cherry Hill to Wilmington and Lyons still does our work. That kind of loyalty is rare.",
      author: "Pat M.",
      town: "Wilmington",
    },
    shape: { cx: 130, cy: 200, rx: 80, ry: 125 },
  },
];

export function townToRegion(townName: string): RegionId | undefined {
  const clean = townName.replace(" (HQ)", "");
  return regions.find((r) => r.towns.includes(clean))?.id;
}

const cityNamesLower = cities.map((c) => ({
  name: c.name.toLowerCase().replace(/[.\s]/g, ""),
  state: c.state,
  display: c.name,
}));

export function checkCity(query: string): { covered: boolean; city?: ServiceCity; closest?: ServiceCity } {
  const q = query.toLowerCase().replace(/[.\s,]/g, "");
  if (!q) return { covered: false };
  const exact = cityNamesLower.find((c) => c.name === q || c.name.startsWith(q) || q.startsWith(c.name));
  if (exact) return { covered: true, city: { name: exact.display, state: exact.state } };
  let closest: { name: string; state: "NJ" | "PA" | "DE"; distance: number } | null = null;
  for (const c of cityNamesLower) {
    const distance = Math.abs(c.name.length - q.length) + (c.name.includes(q) || q.includes(c.name) ? 0 : 5);
    if (!closest || distance < closest.distance) {
      closest = { name: c.display, state: c.state, distance };
    }
  }
  return {
    covered: false,
    closest: closest ? { name: closest.name, state: closest.state } : undefined,
  };
}
