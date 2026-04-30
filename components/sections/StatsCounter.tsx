import { LYONS } from "@/lib/constants";
import { citiesByState } from "@/content/serviceArea";
import { StatCounter } from "@/components/ui/StatCounter";
import { Reveal } from "@/components/ui/Reveal";

export function StatsCounter() {
  const totalCities =
    citiesByState.NJ.length + citiesByState.PA.length + citiesByState.DE.length;

  return (
    <section className="relative py-16 lg:py-20 bg-[var(--color-navy-950)] text-white overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" aria-hidden />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(60% 80% at 50% 0%, rgba(201, 162, 74, 0.25), transparent 70%)",
        }}
        aria-hidden
      />
      <Reveal className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-8 sm:grid-cols-3 text-center">
          <StatBlock value={LYONS.yearsInBusiness} suffix="+" label="years family-owned" />
          <StatBlock value={LYONS.googleReviewCount} label="five-star Google reviews" />
          <StatBlock value={totalCities} label="towns served across NJ, PA & DE" />
        </div>
      </Reveal>
    </section>
  );
}

function StatBlock({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
  return (
    <div>
      <div className="font-industrial text-6xl lg:text-7xl text-[var(--color-electric-300)] leading-none">
        <StatCounter to={value} suffix={suffix} duration={1.8} />
      </div>
      <div className="mt-3 text-sm uppercase tracking-wider text-[var(--color-navy-200)]">
        {label}
      </div>
    </div>
  );
}
