import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Phone, Check } from "lucide-react";
import { findService, services } from "@/content/services";
import { LYONS } from "@/lib/constants";
import { BrandImage } from "@/components/ui/BrandImage";
import { Reveal } from "@/components/ui/Reveal";
import { serviceImages } from "@/content/images";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = findService(slug);
  return { title: s?.title ?? "Service" };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = findService(slug);
  if (!s) notFound();

  const otherServices = services.filter((x) => x.slug !== slug).slice(0, 6);
  const photo = serviceImages[s.slug] ?? serviceImages["panel-upgrades"];

  return (
    <>
      <section className="relative bg-[var(--color-navy-900)] text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" aria-hidden />
        {photo && (
          <div className="absolute inset-0 opacity-40">
            <BrandImage
              photo={photo}
              treatment="duotone"
              rounded="none"
              className="absolute inset-0"
              priority
              sizes="100vw"
            />
          </div>
        )}
        <div className="relative mx-auto max-w-5xl px-5 sm:px-8 pt-20 lg:pt-24 pb-20 lg:pb-28">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--color-navy-200)] hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            All services
          </Link>
          <h1 className="mt-6 text-white max-w-3xl">{s.title}</h1>
          <p className="mt-5 text-lg text-[var(--color-navy-100)] leading-relaxed max-w-2xl">{s.blurb}</p>
          <a
            href={`tel:${LYONS.phoneTel}`}
            className="group mt-8 inline-flex items-center justify-center gap-2.5 rounded-full bg-[var(--color-emergency-500)] hover:bg-[var(--color-emergency-600)] text-white px-6 h-13 font-semibold py-3.5 shadow-[var(--shadow-emergency)] transition-all hover:-translate-y-0.5"
          >
            <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Call {LYONS.phone}
          </a>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 prose-lyons">
          <Reveal>
            <p className="text-lg text-[var(--color-ink)] leading-relaxed">{s.description}</p>
          </Reveal>
          <Reveal>
            <h2 className="mt-12 text-[var(--color-navy-900)]">What&rsquo;s included</h2>
          </Reveal>
          <ul className="mt-5 grid gap-3">
            {s.bullets.map((b) => (
              <li key={b} className="flex gap-3 items-start">
                <Check className="w-5 h-5 mt-0.5 shrink-0 text-[var(--color-brass-600)]" />
                <span className="text-[var(--color-ink)]">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 bg-[var(--color-cream-100)]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <h2 className="text-[var(--color-navy-900)] mb-8">Other services</h2>
          </Reveal>
          {/* Horizontal scroll-snap rail instead of fixed 4-card grid */}
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-5 sm:-mx-8 px-5 sm:px-8 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {otherServices.map((o) => {
              const photo = serviceImages[o.slug];
              return (
                <Link
                  key={o.slug}
                  href={`/services/${o.slug}`}
                  className="group shrink-0 snap-start w-[280px] rounded-3xl bg-white ring-1 ring-[var(--color-navy-200)] hover:ring-[var(--color-navy-700)] transition-all overflow-hidden hover:-translate-y-0.5 hover:shadow-[var(--shadow-pop)]"
                >
                  {photo && (
                    <div className="relative aspect-video">
                      <BrandImage
                        photo={photo}
                        treatment="navy"
                        rounded="none"
                        className="absolute inset-0"
                        sizes="280px"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="font-display text-base text-[var(--color-navy-900)] leading-snug">
                      {o.shortTitle}
                    </div>
                    <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-navy-700)] group-hover:text-[var(--color-brass-700)]">
                      Learn more
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
