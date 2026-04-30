export type Review = {
  author: string;
  rating: 5;
  text: string;
  service: "emergency" | "panel" | "service-line" | "wiring" | "general" | "commercial";
  city?: string;
};

// Placeholder reviews drawn from common themes in Lyons' 5.0 / 436 Google reviews
// (24/7 phone answer, master-electrician quality, storm response, transparent pricing,
//  family-business feel, willingness to walk callers through issues without a truck roll).
// TODO: Replace with verified Google reviews before launch — pull from the live GBP.
export const reviews: Review[] = [
  {
    author: "Sarah K.",
    rating: 5,
    text: "Power went out at 11 p.m. and I'd already called two other electricians who never picked up. Lyons answered on the second ring. Arthur walked me through what to check before sending anyone, and they had the service back up by morning. Above and beyond.",
    service: "emergency",
    city: "Cherry Hill",
  },
  {
    author: "Michael T.",
    rating: 5,
    text: "Federal Pacific panel finally caught up with us. Tom came out, gave us a clear estimate the same day, and the crew swapped it for a 200A service two days later. Permits handled, inspector signed off, and the job site was cleaner than they found it.",
    service: "panel",
    city: "Mt. Laurel",
  },
  {
    author: "Linda R.",
    rating: 5,
    text: "Storm took down the wires running to our weatherhead. The utility wouldn't touch it and our insurance company was giving us the runaround. Gene coordinated with everyone, got the line back, and helped us through the claim. Real, kind people.",
    service: "service-line",
    city: "Burlington",
  },
  {
    author: "David M.",
    rating: 5,
    text: "Called about a flickering light fixture I was sure was a major issue. The electrician on the phone (master, not a dispatcher!) walked me through it in five minutes — turned out to be the bulb. Didn't charge me a dime. I'll call them for anything from now on.",
    service: "general",
    city: "Marlton",
  },
  {
    author: "Patricia V.",
    rating: 5,
    text: "Whole-house rewire on a 1950s ranch. Maurice and his crew were professional, quiet, and respectful of the house. Almost no drywall damage. We sleep better knowing the wiring is safe.",
    service: "wiring",
    city: "Voorhees",
  },
  {
    author: "James H.",
    rating: 5,
    text: "Tim and Brian installed a sub-panel and dedicated circuits for my workshop. Showed up exactly when they said, cleaned up better than I would have, and the work passed inspection on the first try. Premium pricing, premium work.",
    service: "wiring",
    city: "Sicklerville",
  },
  {
    author: "Karen S.",
    rating: 5,
    text: "GFCI tripped on Christmas Eve and I had family in town. Lyons answered on a holiday. Tyree was at the house in under an hour. The 24/7 thing is real — they actually answer the phone.",
    service: "emergency",
    city: "Blackwood",
  },
  {
    author: "Robert L.",
    rating: 5,
    text: "I run a small storefront in Camden. Lyons handled the lighting retrofit and a service upgrade with zero downtime to our business hours. Price was fair, communication was tight, work was clean. Already booked them for the next location.",
    service: "commercial",
    city: "Camden",
  },
  {
    author: "Anita P.",
    rating: 5,
    text: "Insurance was about to drop us over the old fuse box. Allie scheduled the upgrade fast, the crew finished in a day, and we sent the paperwork to insurance the same week. They saved us.",
    service: "panel",
    city: "Glassboro",
  },
  {
    author: "Christopher D.",
    rating: 5,
    text: "Outlet was sparking — I called in a panic. They told me exactly what to do (turn off the breaker, don't touch it) while a truck was already on the way. Calm, professional, and there in 30 minutes. That's why I trust this company.",
    service: "emergency",
    city: "Berlin",
  },
];
