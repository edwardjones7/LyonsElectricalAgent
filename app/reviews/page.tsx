import Link from "next/link";
import { Phone, Star, ExternalLink, Quote, ArrowRight } from "lucide-react";
import { reviews } from "@/content/reviews";
import { LYONS } from "@/lib/constants";
import { fieldElectricians } from "@/content/team";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { StatCounter } from "@/components/ui/StatCounter";
import { Marquee } from "@/components/ui/Marquee";
import { SpotlightReviews } from "@/components/sections/SpotlightReviews";

export const metadata = { title: "Reviews" };

const LYONS_GBP_URL = "https://share.google/a0ViWY9AoGNYoXmPL";

export default function ReviewsPage() {
  // Each row gets the full remaining set so it's wide enough to scroll
  // continuously on any viewport. Row B uses a rotated order so the two rows
  // don't read like the same content moving in opposite directions.
  const remaining = reviews.filter((r) => !r.featured);
  const rowA = remaining;
  const rotateBy = Math.floor(remaining.length / 2);
  const rowB = [...remaining.slice(rotateBy), ...remaining.slice(0, rotateBy)];

  return (
    <>
      <PageHero
        eyebrow="Reviews"
        title={`${LYONS.googleRating.toFixed(1)} stars across ${LYONS.googleReviewCount} Google reviews.`}
        blurb={`Customers name us by name — Arthur, Tom, Gene, Allie, Jean, Tim, Tom O., Brian, Tyree, Maurice, Sean, Carlos, Darnell, and the rest of the crew. Built one job at a time, over ${LYONS.yearsInBusiness}+ years.`}
        eyebrowTone="brass"
      />

      {/* Stats band */}
      <section className="relative bg-[var(--color-navy-950)] text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" aria-hidden />
        <div
          className="absolute inset-0 opacity-25"
          style={{
            background:
              "radial-gradient(60% 80% at 50% 50%, var(--color-electric-700), transparent 70%)",
          }}
          aria-hidden
        />
        <Reveal className="relative mx-auto max-w-6xl px-5 sm:px-8 py-12 lg:py-14">
          <div className="grid gap-6 sm:grid-cols-3 text-center">
            <StatBlock
              value={LYONS.googleRating}
              decimals={1}
              suffix=" ★"
              label="Google rating average"
            />
            <StatBlock
              value={LYONS.googleReviewCount}
              label="verified Google reviews"
            />
            <StatBlock
              value={fieldElectricians.length + 5}
              label="named electricians on the crew"
            />
          </div>
        </Reveal>
      </section>

      {/* Spotlight — magazine-story picks */}
      <SpotlightReviews />

      {/* Marquee — the rest of the curated set */}
      <section className="py-16 lg:py-20 bg-[var(--color-cream-100)]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal className="max-w-2xl mb-10">
            <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-brass-700)] font-bold">
              More from neighbors
            </div>
            <h2 className="mt-3 text-[var(--color-navy-900)]">
              Same story, every time.
            </h2>
          </Reveal>
        </div>

        <div className="space-y-4">
          <Marquee speed={95}>
            {rowA.map((r, i) => (
              <div key={`a-${i}`} className="px-2.5">
                <ReviewTile r={r} variant={i % 2 === 0 ? "tall" : "short"} />
              </div>
            ))}
          </Marquee>
          <Marquee speed={95} reverse>
            {rowB.map((r, i) => (
              <div key={`b-${i}`} className="px-2.5">
                <ReviewTile r={r} variant={i % 2 === 0 ? "short" : "tall"} />
              </div>
            ))}
          </Marquee>
        </div>
      </section>

      {/* Closing CTA — Google + Call */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <div className="grid gap-4 lg:grid-cols-12">
              {/* See on Google */}
              <a
                href={LYONS_GBP_URL}
                target="_blank"
                rel="noreferrer"
                className="group lg:col-span-8 relative rounded-[2rem] bg-white ring-1 ring-[var(--color-navy-200)] hover:ring-[var(--color-navy-700)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-pop)] transition-all p-7 lg:p-10 overflow-hidden"
              >
                <Quote className="absolute top-6 right-6 w-10 h-10 text-[var(--color-brass-300)]/40" aria-hidden />
                <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-brass-700)] font-bold">
                  All {LYONS.googleReviewCount} of them
                </div>
                <h3 className="mt-3 text-[var(--color-navy-900)] max-w-md">
                  Read every review on Google.
                </h3>
                <p className="mt-3 text-[var(--color-ink-soft)] leading-relaxed max-w-lg">
                  We don&rsquo;t curate the live list. Every star, every story, every named
                  electrician — go straight to the source.
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-[var(--color-brass-500)] text-[var(--color-brass-500)]"
                        strokeWidth={0}
                      />
                    ))}
                  </div>
                  <span className="text-[var(--color-navy-900)] font-semibold">
                    {LYONS.googleRating.toFixed(1)} · {LYONS.googleReviewCount} reviews
                  </span>
                </div>
                <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-electric-700)] group-hover:text-[var(--color-electric-600)]">
                  Open Google profile
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </a>

              {/* Got your own? Call */}
              <a
                href={`tel:${LYONS.phoneTel}`}
                className="group lg:col-span-4 relative rounded-[2rem] bg-[var(--color-navy-900)] hover:bg-[var(--color-navy-800)] text-white p-7 lg:p-10 overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-pop)] flex flex-col justify-between min-h-[280px]"
              >
                <div
                  className="absolute -top-12 -right-12 w-[16rem] h-[16rem] rounded-full opacity-30 blur-3xl"
                  style={{
                    background: "radial-gradient(circle, var(--color-emergency-500), transparent 70%)",
                  }}
                  aria-hidden
                />
                <div className="relative">
                  <div className="text-[0.7rem] uppercase tracking-[0.2em] text-[var(--color-electric-300)] font-bold">
                    Got your own situation?
                  </div>
                  <h3 className="mt-3 text-white">Call us. We&rsquo;ll pick up.</h3>
                </div>
                <div className="relative mt-6 inline-flex items-center gap-2.5 rounded-full bg-[var(--color-emergency-500)] group-hover:bg-[var(--color-emergency-600)] text-white px-5 h-12 font-semibold shadow-[var(--shadow-emergency)] transition-colors w-fit">
                  <span className="relative flex w-2 h-2">
                    <span className="absolute inset-0 rounded-full bg-white pulse-dot" />
                    <span className="relative rounded-full bg-white w-2 h-2" />
                  </span>
                  <Phone className="w-4 h-4" />
                  {LYONS.phone}
                </div>
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function StatBlock({
  value,
  decimals = 0,
  suffix = "",
  label,
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  label: string;
}) {
  return (
    <div>
      <div className="font-industrial text-6xl lg:text-7xl text-[var(--color-electric-300)] leading-none">
        <StatCounter to={value} decimals={decimals} suffix={suffix} duration={1.6} />
      </div>
      <div className="mt-3 text-sm uppercase tracking-wider text-[var(--color-navy-200)]">
        {label}
      </div>
    </div>
  );
}

function ReviewTile({
  r,
  variant,
}: {
  r: (typeof reviews)[number];
  variant: "tall" | "short";
}) {
  return (
    <article
      className={`relative rounded-3xl bg-white p-6 ring-1 ring-[var(--color-navy-200)] shadow-[var(--shadow-soft)] w-[340px] ${
        variant === "tall" ? "min-h-[260px]" : "min-h-[200px]"
      }`}
    >
      <Quote className="absolute top-5 right-5 w-6 h-6 text-[var(--color-brass-300)]/40" />
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, idx) => (
          <Star
            key={idx}
            className="w-3.5 h-3.5 fill-[var(--color-brass-500)] text-[var(--color-brass-500)]"
            strokeWidth={0}
          />
        ))}
      </div>
      <p className="mt-4 text-[0.875rem] text-[var(--color-ink)] leading-relaxed line-clamp-6">
        &ldquo;{r.text}&rdquo;
      </p>
      <div className="mt-4 pt-3 border-t border-[var(--color-navy-100)] text-xs flex items-center justify-between">
        <div>
          <div className="font-semibold text-[var(--color-navy-900)]">{r.author}</div>
          {r.city && <div className="text-[var(--color-muted)] mt-0.5">{r.city}</div>}
        </div>
      </div>
    </article>
  );
}
