import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cities, citiesByState, type ServiceCity } from "@/content/serviceArea";
import { ServiceAreaMap } from "@/components/ServiceAreaMap";
import { Reveal } from "@/components/ui/Reveal";
import { Marquee } from "@/components/ui/Marquee";

const HQ = "Blackwood";

// NJ first (HQ leads), then PA, then DE — gives the marquee a natural
// regional flow that mirrors how the map reads outward from Blackwood.
const orderedTowns: ServiceCity[] = [
  ...citiesByState.NJ.filter((c) => c.name === HQ),
  ...citiesByState.NJ.filter((c) => c.name !== HQ),
  ...citiesByState.PA,
  ...citiesByState.DE,
];

export function ServiceAreaTeaser() {
  return (
    <section className="relative py-20 lg:py-28 bg-[var(--color-navy-950)] text-white overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-15" aria-hidden />

      {/* Ambient brass glow centered behind the map */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] opacity-25 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--color-brass-500), transparent 70%)",
        }}
        aria-hidden
      />
      {/* Cool electric accent glow, lower-left, for atmospheric depth */}
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 w-[28rem] h-[28rem] opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--color-electric-500), transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* TOP — editorial roster (numeral block | pull-quote) */}
        <Reveal
          direction="up"
          className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-end"
        >
          {/* Display numeral block */}
          <div className="lg:col-span-5 text-center lg:text-left">
            <div className="text-xs uppercase tracking-[0.25em] text-[var(--color-brass-300)] font-bold">
              The full roster
            </div>
            <h2 className="mt-3 flex items-end justify-center lg:justify-start gap-4 text-white leading-none">
              <span className="font-industrial text-[7rem] lg:text-[9rem] leading-[0.85] text-[var(--color-brass-300)] tabular-nums">
                {cities.length}
              </span>
              <span className="pb-3 text-xl lg:text-2xl text-white leading-snug max-w-[10ch] font-display">
                towns &amp; counting
              </span>
            </h2>
            <div className="mt-4 flex flex-wrap items-center justify-center lg:justify-start gap-x-2 gap-y-1 text-sm text-[var(--color-navy-200)]">
              <CountChip count={citiesByState.NJ.length} label="New Jersey" />
              <span className="text-[var(--color-navy-500)]">·</span>
              <CountChip count={citiesByState.PA.length} label="Pennsylvania" />
              <span className="text-[var(--color-navy-500)]">·</span>
              <CountChip count={citiesByState.DE.length} label="Delaware" />
            </div>
          </div>

          {/* Pull-quote panel — brass through-line connects to map below */}
          <div className="lg:col-span-7 relative">
            <div
              className="absolute -left-1 top-0 -bottom-12 w-[2px] bg-gradient-to-b from-transparent via-[var(--color-brass-500)] to-transparent hidden lg:block"
              aria-hidden
            />
            <p className="heading-prose text-2xl lg:text-3xl text-white leading-snug pl-0 lg:pl-8">
              <span className="text-[var(--color-electric-300)]">If your town isn&rsquo;t on the list</span>, call us.
              Odds are we still come out — we built this map one job at a time, and it keeps growing.
            </p>
            <div className="mt-6 lg:pl-8 flex items-center gap-4 text-sm text-[var(--color-navy-200)]">
              <span className="inline-flex items-center gap-2">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inset-0 rounded-full bg-[var(--color-emergency-500)] pulse-dot" />
                  <span className="relative rounded-full bg-[var(--color-emergency-500)] w-2 h-2" />
                </span>
                <span className="font-semibold text-white">HQ Blackwood, NJ</span>
              </span>
              <span className="text-[var(--color-navy-500)]">·</span>
              <span>Open 24/7/365</span>
            </div>
          </div>
        </Reveal>

        {/* MIDDLE — the map */}
        <Reveal direction="up" delay={0.2} className="relative mt-10 lg:mt-14">
          {/* Map, with a soft circular SVG mask so corners don't terminate as a rectangle */}
          <div
            className="relative w-full aspect-[4/5] sm:aspect-[16/11] lg:aspect-[16/9]"
            style={{
              WebkitMaskImage:
                "radial-gradient(ellipse 65% 70% at 50% 50%, black 30%, rgba(0,0,0,0.6) 55%, transparent 88%)",
              maskImage:
                "radial-gradient(ellipse 65% 70% at 50% 50%, black 30%, rgba(0,0,0,0.6) 55%, transparent 88%)",
            }}
          >
            <ServiceAreaMap className="w-full h-full" />
          </div>
          {/* Full-perimeter vignette: navy on the outside, transparent core.
              Constrained to the map's bounds so it can't bleed into the editorial
              block above or the marquee below. */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 65% 70% at 50% 50%, transparent 30%, rgba(7, 17, 38, 0.7) 70%, var(--color-navy-950) 95%)",
            }}
            aria-hidden
          />
        </Reveal>
      </div>

      {/* BOTTOM — full-bleed marquee + CTA, beyond max-w-7xl for a true credits-roll feel */}
      <Reveal direction="up" delay={0.35} className="relative mt-10 lg:mt-14">
        <div className="border-y border-white/10 bg-gradient-to-r from-[var(--color-navy-950)] via-[var(--color-navy-900)] to-[var(--color-navy-950)] py-5">
          <Marquee speed={75}>
            <TownStrip towns={orderedTowns} />
          </Marquee>
        </div>
      </Reveal>

      <Reveal direction="up" delay={0.45} className="relative mt-10 text-center px-5 sm:px-8">
        <Link
          href="/service-area"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--color-electric-500)] hover:bg-[var(--color-electric-400)] text-white px-6 h-12 font-semibold transition-colors group shadow-[0_0_0_4px_rgba(46,107,229,0.15)]"
        >
          Open the full coverage map
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </Reveal>
    </section>
  );
}

function CountChip({ count, label }: { count: number; label: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className="font-industrial text-base text-[var(--color-electric-300)] tabular-nums">
        {count}
      </span>
      <span className="uppercase tracking-wider text-xs">{label}</span>
    </span>
  );
}

function TownStrip({ towns }: { towns: ServiceCity[] }) {
  return (
    <div className="flex items-center gap-7 lg:gap-10 px-3 text-base lg:text-lg whitespace-nowrap">
      {towns.map((c, i) => {
        const prev = i > 0 ? towns[i - 1] : undefined;
        const stateChanged = prev !== undefined && prev.state !== c.state;
        const isHq = c.name === HQ;
        return (
          <span key={c.name} className="flex items-center gap-7 lg:gap-10 shrink-0">
            {stateChanged && (
              <span className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-brass-300)] font-bold">
                <span className="inline-block w-6 h-px bg-[var(--color-brass-500)]/60" aria-hidden />
                {c.state === "PA" ? "Into Pennsylvania" : c.state === "DE" ? "Into Delaware" : "New Jersey"}
                <span className="inline-block w-6 h-px bg-[var(--color-brass-500)]/60" aria-hidden />
              </span>
            )}
            {isHq ? (
              <span className="flex items-baseline gap-2 font-bold text-[var(--color-brass-300)]">
                {c.name}
                <span className="text-[0.6rem] tracking-[0.2em] uppercase text-[var(--color-brass-300)]/70">
                  HQ
                </span>
              </span>
            ) : (
              <span className="text-[var(--color-navy-100)]">{c.name}</span>
            )}
            <span className="text-[var(--color-navy-500)]/40 select-none" aria-hidden>
              ◆
            </span>
          </span>
        );
      })}
    </div>
  );
}
