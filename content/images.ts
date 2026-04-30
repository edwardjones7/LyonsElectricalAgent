/**
 * Curated photo manifest for the Lyons site.
 *
 * All sources are Unsplash (royalty-free for commercial use, attribution courteous
 * but not required). Photos are referenced by Unsplash photo ID; we pass them
 * through next/image which generates responsive variants on top of the Unsplash
 * CDN's `?w=&q=&auto=format` transforms.
 *
 * TODO before launch: replace these with Lyons' own photoshoot of the team,
 * trucks, and completed work. The URLs and components stay the same — just swap
 * the manifest values.
 */

export type Photo = {
  /** Full Unsplash CDN URL (no query string). */
  src: string;
  alt: string;
  /** Photographer name + handle, for the optional credits panel in the footer. */
  credit: string;
  /** Approximate aspect ratio, used to avoid CLS on layout. */
  aspect: number;
};

export const heroPanel: Photo = {
  src: "https://images.unsplash.com/photo-1635335874521-7987db781153",
  alt: "Master electrician working on the inside of an open electrical panel.",
  credit: "Mostafa Mahmoudi · Unsplash",
  aspect: 4 / 5,
};

export const heroSecondary: Photo = {
  src: "https://images.unsplash.com/photo-1576446470246-499c738d1c8e",
  alt: "Clean modern circuit breakers in a residential panel.",
  credit: "Mark Kats · Unsplash",
  aspect: 16 / 10,
};

export const serviceImages: Record<string, Photo> = {
  emergency: {
    src: "https://images.unsplash.com/photo-1652715564391-38cc4475b7f5",
    alt: "Close-up of bundled electrical wires under tension.",
    credit: "Bruno Guerrero · Unsplash",
    aspect: 16 / 9,
  },
  "panel-upgrades": {
    src: "https://images.unsplash.com/photo-1576446470246-499c738d1c8e",
    alt: "Modern 200-amp residential breaker panel after upgrade.",
    credit: "Mark Kats · Unsplash",
    aspect: 16 / 9,
  },
  "service-line-replacement": {
    src: "https://images.unsplash.com/photo-1566417110090-6b15a06ec800",
    alt: "Gray utility service entrance and meter base mounted to a home.",
    credit: "Troy Bridges · Unsplash",
    aspect: 16 / 9,
  },
  rewiring: {
    src: "https://images.unsplash.com/photo-1601462904263-f2fa0c851cb9",
    alt: "Color-coded electrical wires bundled and labeled for a rewire.",
    credit: "Frames For Your Heart · Unsplash",
    aspect: 16 / 9,
  },
  "outlets-and-switches": {
    src: "https://images.unsplash.com/photo-1767514536570-83d70c024247",
    alt: "Wires terminated into a yellow junction block on a clean install.",
    credit: "Unsplash",
    aspect: 16 / 9,
  },
  "code-compliance": {
    src: "https://images.unsplash.com/photo-1553873002-785d775854c9",
    alt: "Electrician's clamp meter taking a measurement on a live circuit.",
    credit: "Unsplash",
    aspect: 16 / 9,
  },
  "smart-meter-conversions": {
    src: "https://images.unsplash.com/photo-1566417110104-cd4f94af0fb3",
    alt: "Black metered service equipment on the exterior of a home.",
    credit: "Troy Bridges · Unsplash",
    aspect: 16 / 9,
  },
  "light-commercial": {
    src: "https://images.unsplash.com/photo-1601848094958-6241ffbf2715",
    alt: "White contractor pickup truck staged outside a small commercial site.",
    credit: "Unsplash",
    aspect: 16 / 9,
  },
};

export const processImages: Photo[] = [
  {
    src: "https://images.unsplash.com/photo-1553873002-785d775854c9",
    alt: "Master electrician on the phone, walking a homeowner through a problem.",
    credit: "Unsplash",
    aspect: 1,
  },
  {
    src: "https://images.unsplash.com/photo-1601848094958-6241ffbf2715",
    alt: "Lyons-style work truck pulling up to a residential job.",
    credit: "Unsplash",
    aspect: 1,
  },
  {
    src: "https://images.unsplash.com/photo-1576446470246-499c738d1c8e",
    alt: "Finished panel install — labeled, tidy, inspector-ready.",
    credit: "Mark Kats · Unsplash",
    aspect: 1,
  },
];

export const galleryImages: Photo[] = [
  {
    src: "https://images.unsplash.com/photo-1635335874521-7987db781153",
    alt: "Live circuit work in progress on an open panel.",
    credit: "Mostafa Mahmoudi · Unsplash",
    aspect: 4 / 5,
  },
  {
    src: "https://images.unsplash.com/photo-1576446470246-499c738d1c8e",
    alt: "Tidy, code-compliant 200A panel after upgrade.",
    credit: "Mark Kats · Unsplash",
    aspect: 16 / 10,
  },
  {
    src: "https://images.unsplash.com/photo-1601462904263-f2fa0c851cb9",
    alt: "Color-coded wiring waiting to be terminated during a rewire.",
    credit: "Frames For Your Heart · Unsplash",
    aspect: 1,
  },
  {
    src: "https://images.unsplash.com/photo-1767514536570-83d70c024247",
    alt: "Wires landed neatly into a junction terminal block.",
    credit: "Unsplash",
    aspect: 1,
  },
  {
    src: "https://images.unsplash.com/photo-1767514536575-82aaf8b0afc4",
    alt: "Exposed junction box being made safe before re-finishing.",
    credit: "Unsplash",
    aspect: 4 / 5,
  },
];

export const resourceImages: Record<string, Photo> = {
  "when-to-call-an-electrician": {
    src: "https://images.unsplash.com/photo-1553873002-785d775854c9",
    alt: "An electrician taking a meter reading at an outlet.",
    credit: "Unsplash",
    aspect: 21 / 9,
  },
  "is-my-panel-dangerous": {
    src: "https://images.unsplash.com/photo-1566417110090-6b15a06ec800",
    alt: "An older service panel that may be a candidate for replacement.",
    credit: "Troy Bridges · Unsplash",
    aspect: 21 / 9,
  },
  "storm-prep-and-response": {
    src: "https://images.unsplash.com/photo-1601848094958-6241ffbf2715",
    alt: "Service truck staged after storm damage to a home's electrical service.",
    credit: "Unsplash",
    aspect: 21 / 9,
  },
  "why-master-electricians-matter": {
    src: "https://images.unsplash.com/photo-1635335874521-7987db781153",
    alt: "Master electrician working on a panel that requires licensed expertise.",
    credit: "Mostafa Mahmoudi · Unsplash",
    aspect: 21 / 9,
  },
  "do-i-need-a-permit": {
    src: "https://images.unsplash.com/photo-1767514536570-83d70c024247",
    alt: "Inspector-ready terminations on a clean install.",
    credit: "Unsplash",
    aspect: 21 / 9,
  },
  "ev-charging-at-home": {
    src: "https://images.unsplash.com/photo-1601462904263-f2fa0c851cb9",
    alt: "Heavy-gauge wiring of the kind required for an EV-charger circuit.",
    credit: "Frames For Your Heart · Unsplash",
    aspect: 21 / 9,
  },
};

/** All photos — useful for the credits list. */
export const allPhotos: Photo[] = [
  heroPanel,
  heroSecondary,
  ...Object.values(serviceImages),
  ...processImages,
  ...galleryImages,
  ...Object.values(resourceImages),
];
