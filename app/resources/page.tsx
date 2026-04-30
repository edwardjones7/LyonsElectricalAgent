import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { resources } from "@/content/resources";
import { PageHero } from "@/components/PageHero";

export const metadata = { title: "Resources" };

const CATEGORY_LABEL: Record<string, string> = {
  safety: "Safety",
  panels: "Panels",
  diy: "DIY vs. Pro",
  storm: "Storm",
  buying: "Buying",
};

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Plain-language electrical, written by people who do it for a living."
        blurb="The articles we wish every customer had read before they called us — so the call goes faster and you walk away knowing more than you did."
        eyebrowTone="brass"
      />

      <section className="pb-28">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="grid gap-5 lg:grid-cols-2">
            {resources.map((r) => (
              <Link
                key={r.slug}
                href={`/resources/${r.slug}`}
                className="group rounded-3xl bg-white p-7 lg:p-8 ring-1 ring-[var(--color-navy-200)] hover:ring-[var(--color-navy-700)] hover:-translate-y-0.5 transition-all hover:shadow-[var(--shadow-pop)]"
              >
                <div className="flex items-center gap-2.5 text-xs text-[var(--color-muted)]">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-cream-100)] px-2.5 py-1 text-[var(--color-brass-700)] font-semibold uppercase tracking-wider text-[0.65rem]">
                    {CATEGORY_LABEL[r.category]}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {r.readMinutes} min read
                  </span>
                </div>
                <h3 className="mt-4 text-[var(--color-navy-900)] leading-snug">{r.title}</h3>
                <p className="mt-3 text-[var(--color-ink-soft)] leading-relaxed">{r.blurb}</p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-navy-800)] group-hover:text-[var(--color-brass-700)]">
                  Read article
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
