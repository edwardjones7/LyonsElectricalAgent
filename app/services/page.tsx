import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Phone,
  Zap,
  Layers,
  Cable,
  Hammer,
  Plug,
  ClipboardCheck,
  Cpu,
  Building2,
  Check,
  Sparkles,
} from "lucide-react";
import { findService, services } from "@/content/services";
import { LYONS } from "@/lib/constants";
import { PageHero } from "@/components/PageHero";
import { BrandImage } from "@/components/ui/BrandImage";
import { Reveal, RevealStagger, RevealItem } from "@/components/ui/Reveal";
import { serviceImages } from "@/content/images";

export const metadata = { title: "Electrical Services" };

export default function ServicesPage() {
  const emergency = findService("emergency");
  const panel = findService("panel-upgrades");
  const serviceLine = findService("service-line-replacement");
  const rewiring = findService("rewiring");
  const outlets = findService("outlets-and-switches");
  const code = findService("code-compliance");
  const smart = findService("smart-meter-conversions");
  const commercial = findService("light-commercial");

  return (
    <>
      <PageHero
        eyebrow="What we do"
        title="From a single GFCI to a full service-line replacement."
        blurb="Residential and light commercial electrical work across South Jersey, parts of Pennsylvania, and Wilmington, Delaware. Master electricians on every job."
      />

      {/* === FEATURED: 24/7 Emergency === */}
      {emergency && (
        <section className="relative">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <div className="relative rounded-[2.5rem] overflow-hidden ring-1 ring-[var(--color-navy-200)] bg-[var(--color-navy-900)] text-white">
                <div className="absolute inset-0 opacity-50">
                  <BrandImage
                    photo={serviceImages.emergency}
                    treatment="duotone"
                    rounded="none"
                    className="absolute inset-0"
                    sizes="(min-width: 1024px) 80vw, 100vw"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-navy-950)] via-[var(--color-navy-900)]/80 to-[var(--color-navy-900)]/40" />
                <div className="relative grid lg:grid-cols-12 gap-8 p-8 lg:p-14 min-h-[440px]">
                  <div className="lg:col-span-7 flex flex-col justify-end">
                    <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-emergency-500)] text-white px-3.5 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.18em] w-fit shadow-[var(--shadow-emergency)]">
                      <span className="relative flex w-1.5 h-1.5">
                        <span className="absolute inset-0 rounded-full bg-white pulse-dot" />
                        <span className="relative rounded-full bg-white w-1.5 h-1.5" />
                      </span>
                      Featured · 24/7
                    </div>
                    <h2 className="mt-5 text-white max-w-xl">
                      When it can&rsquo;t wait, a master electrician picks up.
                    </h2>
                    <p className="mt-5 text-lg text-[var(--color-navy-100)] leading-relaxed max-w-2xl">
                      {emergency.description}
                    </p>
                    <Link
                      href={`/services/${emergency.slug}`}
                      className="mt-6 inline-flex items-center gap-2 text-[0.875rem] font-semibold text-[var(--color-electric-300)] hover:text-white transition-colors group w-fit"
                    >
                      Read more about emergency service
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                  <div className="lg:col-span-5 lg:border-l lg:border-white/15 lg:pl-10 flex flex-col justify-end">
                    <div className="text-[0.7rem] uppercase tracking-[0.2em] text-[var(--color-electric-300)] font-bold">
                      What you get
                    </div>
                    <ul className="mt-4 grid gap-2.5">
                      {emergency.bullets.map((b) => (
                        <li key={b} className="flex gap-2.5 items-start text-[0.9375rem] text-[var(--color-navy-100)]">
                          <Check className="w-4 h-4 mt-0.5 shrink-0 text-[var(--color-electric-300)]" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href={`tel:${LYONS.phoneTel}`}
                      className="mt-7 inline-flex items-center justify-center gap-2.5 rounded-full bg-[var(--color-emergency-500)] hover:bg-[var(--color-emergency-600)] text-white px-6 h-13 font-semibold py-3.5 shadow-[var(--shadow-emergency)] transition-all hover:-translate-y-0.5 w-fit"
                    >
                      <Phone className="w-4 h-4" />
                      Call {LYONS.phone}
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* === BENTO GRID — varied tile sizes & treatments === */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal className="mb-10 lg:mb-14 max-w-3xl">
            <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-electric-600)] font-bold">
              The full menu
            </div>
            <h2 className="mt-3 text-[var(--color-navy-900)]">
              Eight kinds of work. One number.
            </h2>
          </Reveal>

          <RevealStagger
            stagger={0.06}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 auto-rows-[220px] gap-4"
          >
            {/* Panel Upgrades — wide image-led tile (lg col-span-4) */}
            {panel && (
              <RevealItem direction="up" className="sm:col-span-2 lg:col-span-4 lg:row-span-2">
                <ImageTile service={panel} icon={<Layers className="w-5 h-5" />} stat="150A → 200A" />
              </RevealItem>
            )}

            {/* Service Line — square-ish image tile (lg col-span-2) */}
            {serviceLine && (
              <RevealItem direction="up" className="sm:col-span-1 lg:col-span-2 lg:row-span-2">
                <ImageTile
                  service={serviceLine}
                  icon={<Cable className="w-5 h-5" />}
                  variant="compact"
                  stat="Storm-ready"
                />
              </RevealItem>
            )}

            {/* Rewiring — vertical image tile (lg col-span-2 row-span-2) */}
            {rewiring && (
              <RevealItem direction="up" className="sm:col-span-1 lg:col-span-2 lg:row-span-2">
                <ImageTile
                  service={rewiring}
                  icon={<Hammer className="w-5 h-5" />}
                  variant="vertical"
                  stat="Pre-1970s homes"
                />
              </RevealItem>
            )}

            {/* Outlets & Switches — text-led brass pill (lg col-span-2 row-span-1) */}
            {outlets && (
              <RevealItem direction="up" className="sm:col-span-1 lg:col-span-2">
                <TextTile
                  service={outlets}
                  icon={<Plug className="w-5 h-5" />}
                  accent="brass"
                />
              </RevealItem>
            )}

            {/* Code & Inspections — text-led electric pill (lg col-span-2) */}
            {code && (
              <RevealItem direction="up" className="sm:col-span-1 lg:col-span-2">
                <TextTile
                  service={code}
                  icon={<ClipboardCheck className="w-5 h-5" />}
                  accent="electric"
                />
              </RevealItem>
            )}

            {/* Light Commercial — wide split tile (lg col-span-4) */}
            {commercial && (
              <RevealItem direction="up" className="sm:col-span-2 lg:col-span-4 lg:row-span-2">
                <SplitTile service={commercial} icon={<Building2 className="w-5 h-5" />} />
              </RevealItem>
            )}

            {/* Smart Meter — minimal text tile (lg col-span-2) */}
            {smart && (
              <RevealItem direction="up" className="sm:col-span-1 lg:col-span-2 lg:row-span-2">
                <MinimalTile service={smart} icon={<Cpu className="w-5 h-5" />} />
              </RevealItem>
            )}
          </RevealStagger>
        </div>
      </section>

      {/* === Mini process strip === */}
      <section className="py-16 bg-[var(--color-navy-950)] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" aria-hidden />
        <div
          className="absolute -top-24 left-1/4 w-[36rem] h-[36rem] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-electric-500), transparent 70%)" }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-electric-300)] font-bold">
              How a job goes
            </div>
            <h2 className="mt-3 text-white max-w-2xl">
              You call. We look. We quote. We do it right.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-3 sm:grid-cols-4">
            {[
              { n: "01", title: "You call.", body: "A master electrician picks up — day, night, weekend." },
              { n: "02", title: "We look.", body: "On-site or over the phone. Often we solve it without a truck roll." },
              { n: "03", title: "We quote.", body: "Clear, in writing, no hidden line items. Financing if you want it." },
              { n: "04", title: "We do it right.", body: "Permits pulled. Inspector signs off. Site cleaner than we found it." },
            ].map((step) => (
              <div
                key={step.n}
                className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5 backdrop-blur-sm hover:bg-white/10 hover:ring-[var(--color-electric-500)]/40 transition-colors"
              >
                <div className="font-industrial text-2xl font-extrabold text-[var(--color-electric-300)] leading-none">
                  {step.n}
                </div>
                <div className="mt-3 font-industrial text-lg font-bold uppercase tracking-tight text-white">
                  {step.title}
                </div>
                <p className="mt-2 text-[0.875rem] text-[var(--color-navy-200)] leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === "Don't see what you need" === */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <Reveal>
            <div className="rounded-[2rem] bg-[var(--color-cream-100)] ring-1 ring-[var(--color-navy-200)] p-8 lg:p-12 grid gap-6 lg:grid-cols-12 items-center">
              <div className="lg:col-span-8">
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--color-electric-600)] font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Anything else
                </div>
                <h3 className="mt-3 text-[var(--color-navy-900)]">
                  Don&rsquo;t see what you need? Just call.
                </h3>
                <p className="mt-3 text-[var(--color-ink-soft)] leading-relaxed">
                  If we don&rsquo;t do it, we know who does. {LYONS.yearsInBusiness}+ years in the
                  business means we know every reputable trade in South Jersey by first name.
                </p>
              </div>
              <div className="lg:col-span-4 lg:text-right">
                <a
                  href={`tel:${LYONS.phoneTel}`}
                  className="inline-flex items-center gap-2.5 rounded-full bg-[var(--color-emergency-500)] hover:bg-[var(--color-emergency-600)] text-white px-6 h-13 font-semibold py-3.5 shadow-[var(--shadow-emergency)] transition-all hover:-translate-y-0.5"
                >
                  <Phone className="w-4 h-4" />
                  {LYONS.phone}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Tile variants — each has its own visual personality                */
/* ------------------------------------------------------------------ */

type TileService = ReturnType<typeof findService> extends infer U
  ? U extends NonNullable<U>
    ? U
    : never
  : never;

function ImageTile({
  service,
  icon,
  variant = "feature",
  stat,
}: {
  service: TileService;
  icon: React.ReactNode;
  variant?: "feature" | "compact" | "vertical";
  stat?: string;
}) {
  const photo = serviceImages[service.slug];
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group relative block w-full h-full rounded-3xl overflow-hidden ring-1 ring-[var(--color-navy-200)] hover:ring-[var(--color-navy-700)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-pop)] bg-[var(--color-navy-900)] text-white"
    >
      {photo && (
        <BrandImage
          photo={photo}
          treatment="duotone"
          rounded="none"
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]"
          sizes={
            variant === "feature"
              ? "(min-width: 1024px) 60vw, 100vw"
              : "(min-width: 1024px) 30vw, 50vw"
          }
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy-950)]/95 via-[var(--color-navy-900)]/40 to-transparent" />

      <div className="relative h-full flex flex-col justify-between p-5 lg:p-7">
        <div className="flex items-start justify-between">
          <div className="grid place-items-center w-10 h-10 rounded-xl bg-[var(--color-electric-600)] text-white">
            {icon}
          </div>
          <ArrowUpRight className="w-5 h-5 text-white/70 group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
        </div>
        <div>
          {stat && (
            <div className="font-industrial text-2xl font-extrabold uppercase tracking-tight text-[var(--color-electric-300)] mb-2">
              {stat}
            </div>
          )}
          <h3 className="text-white leading-tight">{service.shortTitle}</h3>
          {variant === "feature" && (
            <p className="mt-2 text-[0.875rem] text-[var(--color-navy-100)] leading-relaxed line-clamp-2 max-w-md">
              {service.blurb}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

function TextTile({
  service,
  icon,
  accent,
}: {
  service: TileService;
  icon: React.ReactNode;
  accent: "brass" | "electric";
}) {
  const styles =
    accent === "brass"
      ? {
          bg: "bg-gradient-to-br from-[var(--color-brass-100)] via-[var(--color-cream-100)] to-[var(--color-cream)]",
          ring: "ring-[var(--color-brass-200)] hover:ring-[var(--color-brass-600)]",
          icon: "bg-[var(--color-brass-500)] text-[var(--color-navy-950)]",
          arrow: "text-[var(--color-brass-700)]",
        }
      : {
          bg: "bg-gradient-to-br from-[var(--color-electric-50)] via-white to-[var(--color-cream)]",
          ring: "ring-[var(--color-electric-200)] hover:ring-[var(--color-electric-600)]",
          icon: "bg-[var(--color-electric-600)] text-white",
          arrow: "text-[var(--color-electric-700)]",
        };

  return (
    <Link
      href={`/services/${service.slug}`}
      className={`group relative block w-full h-full rounded-3xl overflow-hidden ring-1 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-pop)] ${styles.bg} ${styles.ring}`}
    >
      <div className="relative h-full flex flex-col justify-between p-5 lg:p-7">
        <div className="flex items-start justify-between">
          <div className={`grid place-items-center w-10 h-10 rounded-xl ${styles.icon}`}>
            {icon}
          </div>
          <ArrowUpRight className={`w-5 h-5 ${styles.arrow} group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all`} />
        </div>
        <div>
          <h3 className="text-[var(--color-navy-900)] leading-tight">{service.shortTitle}</h3>
          <p className="mt-2 text-[0.875rem] text-[var(--color-ink-soft)] leading-relaxed line-clamp-2">
            {service.blurb}
          </p>
        </div>
      </div>
    </Link>
  );
}

function SplitTile({ service, icon }: { service: TileService; icon: React.ReactNode }) {
  const photo = serviceImages[service.slug];
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group relative block w-full h-full rounded-3xl overflow-hidden ring-1 ring-[var(--color-navy-200)] hover:ring-[var(--color-navy-700)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-pop)] bg-[var(--color-cream)]"
    >
      <div className="grid grid-cols-5 h-full">
        <div className="col-span-2 relative bg-[var(--color-navy-900)]">
          {photo && (
            <BrandImage
              photo={photo}
              treatment="duotone"
              rounded="none"
              className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.05]"
              sizes="(min-width: 1024px) 25vw, 40vw"
            />
          )}
        </div>
        <div className="col-span-3 flex flex-col justify-between p-5 lg:p-7">
          <div className="flex items-start justify-between">
            <div className="grid place-items-center w-10 h-10 rounded-xl bg-[var(--color-electric-50)] text-[var(--color-electric-700)]">
              {icon}
            </div>
            <ArrowUpRight className="w-5 h-5 text-[var(--color-navy-400)] group-hover:text-[var(--color-electric-700)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
          </div>
          <div>
            <div className="text-[0.7rem] uppercase tracking-[0.2em] text-[var(--color-electric-600)] font-bold">
              For businesses
            </div>
            <h3 className="mt-2 text-[var(--color-navy-900)] leading-tight">{service.shortTitle}</h3>
            <p className="mt-2 text-[0.875rem] text-[var(--color-ink-soft)] leading-relaxed line-clamp-3">
              {service.blurb}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function MinimalTile({ service, icon }: { service: TileService; icon: React.ReactNode }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group relative block w-full h-full rounded-3xl overflow-hidden ring-1 ring-[var(--color-navy-200)] hover:ring-[var(--color-electric-600)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-pop)] bg-[var(--color-navy-900)] text-white"
    >
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-grid opacity-30" aria-hidden />
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 100%, var(--color-electric-700), transparent 70%)",
        }}
        aria-hidden
      />
      <div className="relative h-full flex flex-col justify-between p-5 lg:p-7">
        <div className="flex items-start justify-between">
          <div className="grid place-items-center w-10 h-10 rounded-xl bg-white/10 ring-1 ring-white/20 text-[var(--color-electric-300)]">
            {icon}
          </div>
          <ArrowUpRight className="w-5 h-5 text-white/70 group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
        </div>
        <div>
          <div className="text-[0.7rem] uppercase tracking-[0.2em] text-[var(--color-electric-300)] font-bold">
            Utility-side
          </div>
          <h3 className="mt-2 text-white leading-tight">{service.shortTitle}</h3>
          <p className="mt-2 text-[0.875rem] text-[var(--color-navy-100)] leading-relaxed line-clamp-3">
            {service.blurb}
          </p>
        </div>
      </div>
    </Link>
  );
}
