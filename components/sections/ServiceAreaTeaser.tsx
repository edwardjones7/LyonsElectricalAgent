import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { citiesByState } from "@/content/serviceArea";
import { ServiceAreaMap } from "@/components/ServiceAreaMap";
import { Reveal } from "@/components/ui/Reveal";

export function ServiceAreaTeaser() {
  return (
    <section className="py-20 lg:py-28 bg-[var(--color-navy-950)] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-15" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 grid gap-12 lg:grid-cols-12 items-center">
        <Reveal direction="left" className="lg:col-span-5">
          <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-electric-300)] font-semibold">
            Service area
          </div>
          <h2 className="mt-3 text-white">
            From Blackwood, across South Jersey, into PA & DE.
          </h2>
          <p className="mt-4 text-lg text-[var(--color-navy-200)] leading-relaxed">
            We cover {citiesByState.NJ.length} towns in NJ, {citiesByState.PA.length} in PA, and{" "}
            {citiesByState.DE.length} in DE — and counting. If your town isn&rsquo;t on the map,
            call us. Odds are we still come out.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
            <Pill state="NJ" count={citiesByState.NJ.length} />
            <Pill state="PA" count={citiesByState.PA.length} />
            <Pill state="DE" count={citiesByState.DE.length} />
          </div>
          <Link
            href="/service-area"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--color-electric-500)] hover:bg-[var(--color-electric-400)] text-white px-5 h-12 font-semibold transition-colors group"
          >
            Check your area
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Reveal>

        <Reveal direction="right" delay={0.15} className="lg:col-span-7">
          <div className="relative">
            <ServiceAreaMap className="w-full aspect-[4/5]" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Pill({ state, count }: { state: string; count: number }) {
  return (
    <div className="rounded-2xl bg-white/5 ring-1 ring-white/15 px-4 py-3.5 backdrop-blur-sm">
      <div className="font-display text-2xl text-[var(--color-electric-300)]">{count}</div>
      <div className="text-xs uppercase tracking-wider text-[var(--color-navy-200)] mt-0.5">
        {state} towns
      </div>
    </div>
  );
}
