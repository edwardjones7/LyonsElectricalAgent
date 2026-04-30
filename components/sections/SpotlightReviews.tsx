import { Quote, Star } from "lucide-react";
import { reviews } from "@/content/reviews";
import { serviceImages } from "@/content/images";
import { BrandImage } from "@/components/ui/BrandImage";
import { Reveal } from "@/components/ui/Reveal";

const SERVICE_LABEL: Record<string, string> = {
  emergency: "Emergency",
  panel: "Panel Upgrade",
  "service-line": "Service Line",
  wiring: "Wiring",
  general: "Free Phone Consult",
  commercial: "Commercial",
};

export function SpotlightReviews() {
  const featured = reviews.filter((r) => r.featured).slice(0, 3);
  if (featured.length === 0) return null;

  const [first, second, third] = featured;

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="max-w-3xl mb-10 lg:mb-14">
          <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-brass-700)] font-bold">
            Editor&rsquo;s picks
          </div>
          <h2 className="mt-3 text-[var(--color-navy-900)]">
            Three calls that say it best.
          </h2>
          <p className="mt-4 text-lg text-[var(--color-ink-soft)] leading-relaxed">
            Pulled from the {reviews.length === 10 ? "ten" : reviews.length}-plus reviews on this
            page — one emergency, one panel, one we-talked-them-out-of-a-service-call. Same kind of
            story we hear over and over.
          </p>
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-12">
          {first && (
            <Reveal direction="up" className="lg:col-span-7">
              <SpotlightCardEmergency review={first} index="01" />
            </Reveal>
          )}
          {second && (
            <Reveal direction="up" delay={0.1} className="lg:col-span-5">
              <SpotlightCardPanel review={second} index="02" />
            </Reveal>
          )}
          {third && (
            <Reveal direction="up" delay={0.2} className="lg:col-span-12">
              <SpotlightCardConsult review={third} index="03" />
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

type Pick = (typeof reviews)[number];

/* --- Card 1 — dark navy, dramatic, brass quote mark ---------------- */
function SpotlightCardEmergency({ review, index }: { review: Pick; index: string }) {
  return (
    <article className="relative h-full rounded-[2rem] bg-[var(--color-navy-900)] text-white p-8 lg:p-10 overflow-hidden ring-1 ring-[var(--color-navy-200)] min-h-[440px] flex flex-col justify-between">
      <div className="absolute inset-0 bg-grid opacity-15" aria-hidden />
      <div
        className="absolute -top-16 -right-16 w-[24rem] h-[24rem] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-brass-500), transparent 70%)" }}
        aria-hidden
      />
      <Quote className="absolute top-7 right-7 w-12 h-12 text-[var(--color-brass-500)]/40" aria-hidden />

      <div className="relative">
        <Eyebrow index={index} service={review.service} city={review.city} tone="dark" />
        <h3 className="mt-4 text-white max-w-md">{review.editorHeadline}</h3>
      </div>

      <div className="relative mt-8">
        <Stars />
        <p className="mt-4 heading-prose text-[1.375rem] lg:text-[1.5rem] text-white leading-snug max-w-xl">
          &ldquo;{review.text}&rdquo;
        </p>
        <Byline review={review} tone="dark" />
      </div>
    </article>
  );
}

/* --- Card 2 — cream, image strip on top ---------------------------- */
function SpotlightCardPanel({ review, index }: { review: Pick; index: string }) {
  return (
    <article className="relative h-full rounded-[2rem] bg-white ring-1 ring-[var(--color-navy-200)] overflow-hidden min-h-[440px] flex flex-col">
      <div className="relative h-32 lg:h-36 shrink-0 overflow-hidden">
        <BrandImage
          photo={serviceImages["panel-upgrades"]}
          treatment="duotone"
          rounded="none"
          className="absolute inset-0"
          sizes="(min-width: 1024px) 40vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/30" />
      </div>

      <div className="relative flex-1 p-7 lg:p-9 flex flex-col justify-between">
        <div>
          <Eyebrow index={index} service={review.service} city={review.city} tone="light" />
          <h3 className="mt-4 text-[var(--color-navy-900)] max-w-sm">{review.editorHeadline}</h3>
        </div>

        <div className="mt-8">
          <Stars />
          <p className="mt-4 heading-prose text-[1.125rem] lg:text-[1.25rem] text-[var(--color-ink)] leading-snug">
            &ldquo;{review.text}&rdquo;
          </p>
          <Byline review={review} tone="light" />
        </div>
      </div>
    </article>
  );
}

/* --- Card 3 — full-width, electric stripe on the left -------------- */
function SpotlightCardConsult({ review, index }: { review: Pick; index: string }) {
  return (
    <article className="relative rounded-[2rem] bg-[var(--color-cream-100)] ring-1 ring-[var(--color-navy-200)] overflow-hidden">
      {/* Left accent stripe */}
      <div
        className="absolute inset-y-0 left-0 w-1.5 lg:w-2 bg-gradient-to-b from-[var(--color-electric-500)] via-[var(--color-electric-600)] to-[var(--color-electric-700)]"
        aria-hidden
      />

      <div className="grid lg:grid-cols-12 gap-6 p-8 lg:p-12 pl-10 lg:pl-16">
        <div className="lg:col-span-5">
          <Eyebrow index={index} service={review.service} city={review.city} tone="light" />
          <h3 className="mt-4 text-[var(--color-navy-900)] max-w-md">{review.editorHeadline}</h3>
          <p className="mt-4 text-[0.9375rem] text-[var(--color-ink-soft)] leading-relaxed max-w-md">
            One of the calls we&rsquo;re proudest of. Free phone consultations are real — many days
            we&rsquo;ll tell you not to hire us, and we mean it.
          </p>
        </div>

        <div className="lg:col-span-7 lg:border-l lg:border-[var(--color-navy-200)] lg:pl-10">
          <Stars />
          <p className="mt-4 heading-prose text-[1.375rem] lg:text-[1.625rem] text-[var(--color-ink)] leading-snug">
            &ldquo;{review.text}&rdquo;
          </p>
          <Byline review={review} tone="light" />
        </div>
      </div>
    </article>
  );
}

/* --- Shared bits --------------------------------------------------- */

function Eyebrow({
  index,
  service,
  city,
  tone,
}: {
  index: string;
  service: Pick["service"];
  city?: string;
  tone: "dark" | "light";
}) {
  const color =
    tone === "dark"
      ? "text-[var(--color-electric-300)]"
      : "text-[var(--color-electric-600)]";
  return (
    <div className={`flex items-center gap-3 text-[0.7rem] font-bold uppercase tracking-[0.2em] ${color}`}>
      <span className="font-industrial text-2xl font-extrabold tabular-nums leading-none">
        {index}
      </span>
      <span className="opacity-60">·</span>
      <span>{SERVICE_LABEL[service] ?? service}</span>
      {city && (
        <>
          <span className="opacity-60">·</span>
          <span>{city}</span>
        </>
      )}
    </div>
  );
}

function Byline({ review, tone }: { review: Pick; tone: "dark" | "light" }) {
  const nameColor = tone === "dark" ? "text-white" : "text-[var(--color-navy-900)]";
  const subColor =
    tone === "dark" ? "text-[var(--color-navy-300)]" : "text-[var(--color-muted)]";
  return (
    <div className={`mt-6 pt-5 border-t ${tone === "dark" ? "border-white/15" : "border-[var(--color-navy-100)]"} text-sm flex items-center justify-between`}>
      <div>
        <div className={`font-semibold ${nameColor}`}>{review.author}</div>
        {review.city && <div className={`text-xs mt-0.5 ${subColor}`}>{review.city}</div>}
      </div>
      <div className={`text-[0.7rem] uppercase tracking-wider ${subColor}`}>
        Verified · 5.0 ★
      </div>
    </div>
  );
}

function Stars() {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="w-4 h-4 fill-[var(--color-brass-500)] text-[var(--color-brass-500)]"
          strokeWidth={0}
        />
      ))}
    </div>
  );
}
