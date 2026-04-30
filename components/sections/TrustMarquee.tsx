import { Star, ShieldCheck, Wrench, Clock, Phone, MapPin, Heart } from "lucide-react";
import { Marquee } from "@/components/ui/Marquee";
import { LYONS } from "@/lib/constants";

const ITEMS = [
  { icon: <ShieldCheck className="w-4 h-4" />, label: "Licensed · Insured · Bonded" },
  { icon: <Heart className="w-4 h-4" />, label: `Family-owned since ${new Date().getFullYear() - LYONS.yearsInBusiness}` },
  { icon: <Star className="w-4 h-4" />, label: `${LYONS.googleRating.toFixed(1)} ★ across ${LYONS.googleReviewCount} Google reviews` },
  { icon: <Wrench className="w-4 h-4" />, label: "Master Electricians on every job" },
  { icon: <Clock className="w-4 h-4" />, label: "Answering 24 hours a day, 7 days a week, 365 days a year" },
  { icon: <MapPin className="w-4 h-4" />, label: "South Jersey · Eastern PA · Wilmington DE" },
  { icon: <Phone className="w-4 h-4" />, label: `${LYONS.phone} — a real person picks up` },
];

export function TrustMarquee() {
  return (
    <div className="relative bg-[var(--color-cream)] border-y border-[var(--color-navy-100)]">
      <Marquee speed={50} className="py-3">
        {ITEMS.map((item, i) => (
          <div key={i} className="flex items-center gap-2.5 px-5 text-[0.8125rem] font-medium text-[var(--color-navy-800)]">
            <span className="text-[var(--color-brass-600)]">{item.icon}</span>
            {item.label}
            <span className="text-[var(--color-navy-300)] ml-5">·</span>
          </div>
        ))}
      </Marquee>
    </div>
  );
}
