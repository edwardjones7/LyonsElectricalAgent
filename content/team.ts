export type TeamMember = {
  name: string;
  role: string;
  group: "leadership" | "field";
};

export const leadership: TeamMember[] = [
  { name: "Arthur Carroll", role: "Owner / Master Electrician", group: "leadership" },
  { name: "Tom Carroll", role: "Estimator", group: "leadership" },
  { name: "Gene Goodman", role: "Operations Chief", group: "leadership" },
  { name: "Allie", role: "Administration", group: "leadership" },
  { name: "Jean", role: "Coordination & Scheduling", group: "leadership" },
];

export const fieldElectricians: TeamMember[] = [
  { name: "Tim Guinter", role: "Master Electrician", group: "field" },
  { name: "Tom O'Connor", role: "Master Electrician", group: "field" },
  { name: "Chris Lunny", role: "Master Electrician", group: "field" },
  { name: "Alvin Kessna", role: "Master Electrician", group: "field" },
  { name: "Brian Butler", role: "Master Electrician", group: "field" },
  { name: "Tyree Downs", role: "Master Electrician", group: "field" },
  { name: "Randy Brinkley", role: "Master Electrician", group: "field" },
  { name: "Maurice", role: "Electrician", group: "field" },
  { name: "Sean", role: "Electrician", group: "field" },
  { name: "Carlos", role: "Electrician", group: "field" },
  { name: "Darnell", role: "Electrician", group: "field" },
  { name: "Josh", role: "Electrician", group: "field" },
  { name: "Stacey", role: "Electrician", group: "field" },
  { name: "Bill", role: "Electrician", group: "field" },
];

export const allTeam = [...leadership, ...fieldElectricians];
