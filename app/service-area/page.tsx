import { citiesByState, regions } from "@/content/serviceArea";
import { LYONS } from "@/lib/constants";
import { PageHero } from "@/components/PageHero";
import { ZipCheck } from "@/components/ZipCheck";
import { InteractiveServiceArea } from "@/components/InteractiveServiceArea";
import { Reveal, RevealStagger, RevealItem } from "@/components/ui/Reveal";
import { MapPin, Star } from "lucide-react";

export const metadata = { title: "Service Area" };

export default function ServiceAreaPage() {
  const totalTowns =
    citiesByState.NJ.length + citiesByState.PA.length + citiesByState.DE.length;

  return (
    <>
      <PageHero
        eyebrow="Service area"
        title="Across South Jersey, into PA & DE."
        blurb={`Headquartered in ${LYONS.hq} and serving over ${totalTowns} cities and towns. If your town isn&rsquo;t listed, call us — we probably still come out.`}
      >
        <ZipCheck />
      </PageHero>

      <section className="py-12 lg:py-16 bg-[var(--color-cream)]">
        <Reveal className="mx-auto max-w-7xl px-5 sm:px-8">
          <InteractiveServiceArea />
        </Reveal>
      </section>

      {/* Region cards — replaces the unbalanced state-column list. */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal className="max-w-2xl mb-10 lg:mb-14">
            <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-electric-600)] font-bold">
              Where we work
            </div>
            <h2 className="mt-3 text-[var(--color-navy-900)]">
              Five regions. {totalTowns} towns. One number.
            </h2>
          </Reveal>

          <RevealStagger
            stagger={0.08}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6 auto-rows-fr"
          >
            {regions.map((region, i) => (
              <RevealItem
                key={region.id}
                direction="up"
                className={
                  // Bento-style sizing: HQ card is wider, last card spans full row
                  region.isHQ
                    ? "sm:col-span-2 lg:col-span-4"
                    : i === regions.length - 1
                      ? "sm:col-span-2 lg:col-span-6"
                      : "sm:col-span-1 lg:col-span-2"
                }
              >
                <RegionCard region={region} />
              </RevealItem>
            ))}
          </RevealStagger>

          <Reveal className="mt-10 text-center text-sm text-[var(--color-muted)]">
            Don&rsquo;t see your town? Call {LYONS.phone} — odds are we still come out.
          </Reveal>
        </div>
      </section>
    </>
  );
}

function RegionCard({ region }: { region: typeof regions[number] }) {
  return (
    <article
      className={`group relative h-full rounded-3xl p-6 lg:p-7 ring-1 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-pop)] overflow-hidden flex flex-col ${
        region.isHQ
          ? "bg-[var(--color-navy-900)] text-white ring-[var(--color-navy-200)] hover:ring-[var(--color-electric-500)]"
          : "bg-white ring-[var(--color-navy-200)] hover:ring-[var(--color-electric-600)]"
      }`}
    >
      {region.isHQ && (
        <div
          className="absolute -top-16 -right-16 w-[20rem] h-[20rem] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-electric-500), transparent 70%)" }}
          aria-hidden
        />
      )}

      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <MapPin
            className={`w-4 h-4 ${
              region.isHQ ? "text-[var(--color-electric-300)]" : "text-[var(--color-electric-600)]"
            }`}
          />
          <span
            className={`text-[0.65rem] uppercase tracking-[0.22em] font-bold ${
              region.isHQ ? "text-[var(--color-electric-300)]" : "text-[var(--color-electric-600)]"
            }`}
          >
            {region.isHQ ? "HQ · " : ""}
            {region.towns.length} towns
          </span>
        </div>

        <h3
          className={`leading-tight ${
            region.isHQ ? "text-white" : "text-[var(--color-navy-900)]"
          }`}
        >
          {region.label}
        </h3>

        <p
          className={`mt-2 text-[0.9375rem] italic font-display leading-snug ${
            region.isHQ ? "text-[var(--color-navy-100)]" : "text-[var(--color-ink-soft)]"
          }`}
        >
          {region.tagline}
        </p>
      </div>

      {/* Town chips */}
      <ul className="relative mt-5 flex flex-wrap gap-1.5">
        {region.towns.map((town) => (
          <li
            key={town}
            className={`text-xs px-2.5 py-1 rounded-full ${
              region.isHQ
                ? "bg-white/10 ring-1 ring-white/20 text-white"
                : "bg-[var(--color-cream-100)] ring-1 ring-[var(--color-navy-200)] text-[var(--color-navy-800)]"
            }`}
          >
            {town}
          </li>
        ))}
      </ul>

      {/* Top services / quote — pinned to bottom */}
      <div
        className={`relative mt-6 pt-5 border-t ${
          region.isHQ ? "border-white/15" : "border-[var(--color-navy-100)]"
        } space-y-2.5`}
      >
        <div
          className={`text-[0.65rem] uppercase tracking-[0.18em] font-bold ${
            region.isHQ ? "text-[var(--color-electric-300)]" : "text-[var(--color-brass-700)]"
          }`}
        >
          What we do here
        </div>
        <ul
          className={`text-[0.875rem] leading-snug space-y-1 ${
            region.isHQ ? "text-[var(--color-navy-100)]" : "text-[var(--color-ink-soft)]"
          }`}
        >
          {region.topServices.map((s) => (
            <li key={s}>· {s}</li>
          ))}
        </ul>

        <blockquote
          className={`mt-4 pt-3 border-t text-[0.875rem] leading-relaxed italic font-display ${
            region.isHQ
              ? "border-white/10 text-[var(--color-navy-100)]"
              : "border-[var(--color-navy-100)] text-[var(--color-ink-soft)]"
          }`}
        >
          <div className="flex items-center gap-1 mb-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="w-3 h-3 fill-[var(--color-brass-500)] text-[var(--color-brass-500)]"
                strokeWidth={0}
              />
            ))}
          </div>
          &ldquo;{region.quote.text}&rdquo;
          <footer
            className={`mt-1.5 text-[0.7rem] not-italic font-sans ${
              region.isHQ ? "text-[var(--color-navy-300)]" : "text-[var(--color-muted)]"
            }`}
          >
            — {region.quote.author}, {region.quote.town}
          </footer>
        </blockquote>
      </div>
    </article>
  );
}
