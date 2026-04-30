import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Phone, AlertOctagon, Info } from "lucide-react";
import { findResource, resources } from "@/content/resources";
import { LYONS } from "@/lib/constants";
import { BrandImage } from "@/components/ui/BrandImage";
import { Reveal } from "@/components/ui/Reveal";
import { ArticleByline } from "@/components/ui/ArticleByline";
import { PullQuote } from "@/components/ui/PullQuote";
import { SectionRule } from "@/components/ui/SectionRule";
import { YouTubeEmbed } from "@/components/ui/YouTubeEmbed";
import { resourceImages } from "@/content/images";
import Image from "next/image";

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
      <header className="bg-[var(--color-cream)] pt-14 lg:pt-20 pb-10">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Link
            href="/resources"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--color-navy-700)] hover:text-[var(--color-navy-900)]"
          >
            <ArrowLeft className="w-4 h-4" />
            All resources
          </Link>
          <h1 className="heading-prose mt-8 text-[2.25rem] sm:text-[2.75rem] lg:text-[3.25rem] text-[var(--color-navy-900)]">
            {r.title}
          </h1>
          <p className="mt-5 text-lg text-[var(--color-ink-soft)] leading-relaxed font-display">
            {r.blurb}
          </p>
          <div className="mt-7">
            <ArticleByline
              category={r.category}
              author={r.author}
              publishedAt={r.publishedAt}
              readMinutes={r.readMinutes}
            />
          </div>
        </div>
      </header>

      {heroPhoto && (
        <div className="bg-[var(--color-cream)]">
          <div className="mx-auto max-w-4xl px-5 sm:px-8">
            <figure>
              <div className="relative aspect-[21/9] overflow-hidden rounded-2xl">
                <BrandImage
                  photo={heroPhoto}
                  treatment="none"
                  rounded="none"
                  priority
                  sizes="(min-width: 1024px) 56rem, 100vw"
                  className="absolute inset-0"
                />
              </div>
              {heroPhoto.credit && (
                <figcaption className="mt-2 text-xs text-[var(--color-muted)] italic font-display text-right">
                  Photo · {heroPhoto.credit}
                </figcaption>
              )}
            </figure>
          </div>
        </div>
      )}

      <article className="bg-[var(--color-cream)] pt-10 pb-20 lg:pb-28">
        <div className="mx-auto max-w-2xl px-5 sm:px-8 prose-lyons prose-lyons-article">
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
      return <p className={first ? "lead-paragraph" : undefined}>{block.text}</p>;
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
          className={`my-8 rounded-2xl p-5 flex gap-3 ${
            block.tone === "warning"
              ? "bg-[var(--color-emergency-50)] border-l-4 border-[var(--color-emergency-500)]"
              : "bg-[var(--color-cream-100)] border-l-4 border-[var(--color-brass-500)]"
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
    case "quote":
      return <PullQuote text={block.text} attribution={block.attribution} />;
    case "image":
      return (
        <figure className="my-10">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl ring-1 ring-[var(--color-navy-200)]">
            <Image
              src={block.src}
              alt={block.alt}
              fill
              sizes="(min-width: 1024px) 42rem, 100vw"
              className="object-cover"
            />
          </div>
          {(block.caption || block.credit) && (
            <figcaption className="mt-3 text-sm text-[var(--color-muted)] italic font-display leading-snug">
              {block.caption}
              {block.caption && block.credit && " · "}
              {block.credit && <span className="not-italic text-xs">Photo · {block.credit}</span>}
            </figcaption>
          )}
        </figure>
      );
    case "video":
      return <YouTubeEmbed youtubeId={block.youtubeId} caption={block.caption} />;
    case "hr":
      return <SectionRule />;
  }
}
