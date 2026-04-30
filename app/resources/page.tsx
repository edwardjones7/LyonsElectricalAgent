import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { resources } from "@/content/resources";
import { resourceImages } from "@/content/images";
import { PageHero } from "@/components/PageHero";
import { BrandImage } from "@/components/ui/BrandImage";
import { ArticleByline } from "@/components/ui/ArticleByline";
import { ResourceGrid } from "@/components/sections/ResourceGrid";

export const metadata = { title: "Resources" };

export default function ResourcesPage() {
  const featured = resources.find((r) => r.featured) ?? resources[0];
  const rest = resources.filter((r) => r.slug !== featured.slug);
  const featuredPhoto = resourceImages[featured.slug];

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Plain-language electrical, written by people who do it for a living."
        blurb="The articles we wish every customer had read before they called us — so the call goes faster and you walk away knowing more than you did."
        eyebrowTone="brass"
      />

      <section className="pb-12">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Link
            href={`/resources/${featured.slug}`}
            className="group block overflow-hidden rounded-3xl bg-white ring-1 ring-[var(--color-navy-200)] hover:ring-[var(--color-navy-700)] hover:shadow-[var(--shadow-pop)] transition-all"
          >
            <div className="grid lg:grid-cols-12 gap-0">
              {featuredPhoto && (
                <div className="relative lg:col-span-7 aspect-[16/10] lg:aspect-auto lg:min-h-[420px]">
                  <BrandImage
                    photo={featuredPhoto}
                    treatment="none"
                    rounded="none"
                    priority
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="absolute inset-0"
                    imageClassName="group-hover:scale-[1.01] transition-transform duration-500"
                  />
                </div>
              )}
              <div className="lg:col-span-5 p-7 sm:p-10 flex flex-col gap-5 justify-center">
                <div className="text-[0.65rem] uppercase tracking-[0.25em] font-bold text-[var(--color-brass-700)]">
                  Editor&rsquo;s pick
                </div>
                <h2 className="heading-prose text-[1.875rem] sm:text-[2.25rem] leading-[1.1] text-[var(--color-navy-900)]">
                  {featured.title}
                </h2>
                <p className="text-[var(--color-ink-soft)] leading-relaxed">{featured.blurb}</p>
                <ArticleByline
                  category={featured.category}
                  author={featured.author}
                  publishedAt={featured.publishedAt}
                  readMinutes={featured.readMinutes}
                />
                <div className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-navy-800)] group-hover:text-[var(--color-brass-700)]">
                  Read the article
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <section className="pb-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex items-end justify-between gap-4 mb-6">
            <h2 className="heading-prose text-2xl text-[var(--color-navy-900)]">More articles</h2>
          </div>
          <ResourceGrid resources={rest} />
        </div>
      </section>
    </>
  );
}
