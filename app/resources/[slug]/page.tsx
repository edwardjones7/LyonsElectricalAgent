import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, Phone, AlertOctagon, Info } from "lucide-react";
import { findResource, resources } from "@/content/resources";
import { LYONS } from "@/lib/constants";
import { BrandImage } from "@/components/ui/BrandImage";
import { Reveal } from "@/components/ui/Reveal";
import { resourceImages } from "@/content/images";

export function generateStaticParams() {
  return resources.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = findResource(slug);
  return { title: r?.title ?? "Resource" };
}

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const r = findResource(slug);
  if (!r) notFound();

  const others = resources.filter((x) => x.slug !== slug).slice(0, 3);
  const heroPhoto = resourceImages[r.slug];

  return (
    <>
      <section className="relative bg-[var(--color-navy-900)] text-white overflow-hidden">
        {heroPhoto && (
          <div className="absolute inset-0">
            <BrandImage photo={heroPhoto} treatment="duotone" rounded="none" priority className="absolute inset-0" sizes="100vw" />
          </div>
        )}
        <div className="absolute inset-0 bg-grid opacity-20" aria-hidden />
        <div className="relative mx-auto max-w-3xl px-5 sm:px-8 pt-20 lg:pt-28 pb-16 lg:pb-24">
          <Link
            href="/resources"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--color-navy-200)] hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            All resources
          </Link>
          <h1 className="mt-6 text-white">{r.title}</h1>
          <div className="mt-6 inline-flex items-center gap-2 text-sm text-[var(--color-navy-200)]">
            <Clock className="w-4 h-4" />
            {r.readMinutes}-minute read
          </div>
        </div>
      </section>

      <article className="py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 prose-lyons">
          {r.body.map((block, i) => (
            <Reveal key={i}>
              <Block block={block} first={i === 0} />
            </Reveal>
          ))}
        </div>
      </article>

      <section className="py-12 bg-[var(--color-navy-900)] text-white">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <div className="font-display text-2xl text-white">Got a question this didn&rsquo;t cover?</div>
            <div className="text-[var(--color-navy-200)] mt-1.5">
              A master electrician is on the line, day or night.
            </div>
          </div>
          <a
            href={`tel:${LYONS.phoneTel}`}
            className="inline-flex items-center gap-2.5 rounded-full bg-[var(--color-emergency-500)] hover:bg-[var(--color-emergency-600)] text-white px-6 h-12 font-semibold transition-colors shrink-0"
          >
            <Phone className="w-4 h-4" />
            {LYONS.phone}
          </a>
        </div>
      </section>

      <section className="py-16 bg-[var(--color-cream-100)]">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <h2 className="text-[var(--color-navy-900)] mb-8">Keep reading</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/resources/${o.slug}`}
                className="group rounded-2xl bg-white p-5 ring-1 ring-[var(--color-navy-200)] hover:ring-[var(--color-navy-700)] hover:-translate-y-0.5 transition-all"
              >
                <div className="font-display text-base text-[var(--color-navy-900)] leading-snug">{o.title}</div>
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-navy-700)] group-hover:text-[var(--color-brass-700)]">
                  Read
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Block({ block, first }: { block: import("@/content/resources").ResourceBlock; first?: boolean }) {
  switch (block.kind) {
    case "p":
      if (first) {
        // Treat the first paragraph as a pull-quote-styled lead
        return (
          <p className="text-xl text-[var(--color-navy-900)] font-display leading-snug border-l-4 border-[var(--color-brass-500)] pl-5 py-1 my-6">
            {block.text}
          </p>
        );
      }
      return <p>{block.text}</p>;
    case "h2":
      return <h2>{block.text}</h2>;
    case "h3":
      return <h3>{block.text}</h3>;
    case "ul":
      return (
        <ul>
          {block.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      );
    case "callout":
      return (
        <div
          className={`my-6 rounded-2xl p-5 ring-1 flex gap-3 ${
            block.tone === "warning"
              ? "bg-[var(--color-emergency-50)] ring-[var(--color-emergency-500)]/30"
              : "bg-[var(--color-cream-100)] ring-[var(--color-brass-200)]"
          }`}
        >
          {block.tone === "warning" ? (
            <AlertOctagon className="w-5 h-5 mt-0.5 shrink-0 text-[var(--color-emergency-600)]" />
          ) : (
            <Info className="w-5 h-5 mt-0.5 shrink-0 text-[var(--color-brass-700)]" />
          )}
          <div>
            <div className="font-semibold text-[var(--color-navy-900)] text-[0.9375rem]">{block.title}</div>
            <p className="mt-1 text-[0.9375rem] text-[var(--color-ink)]">{block.text}</p>
          </div>
        </div>
      );
  }
}
