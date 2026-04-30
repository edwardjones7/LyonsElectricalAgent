"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandImage } from "@/components/ui/BrandImage";
import { ArticleByline } from "@/components/ui/ArticleByline";
import { resourceImages } from "@/content/images";
import type { Resource } from "@/content/resources";
import { cn } from "@/lib/utils";

type Category = Resource["category"];

const FILTERS: { value: Category | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "safety", label: "Safety" },
  { value: "panels", label: "Panels" },
  { value: "diy", label: "DIY vs. Pro" },
  { value: "storm", label: "Storm" },
  { value: "buying", label: "Buying" },
];

export function ResourceGrid({ resources }: { resources: Resource[] }) {
  const [selected, setSelected] = React.useState<Category | "all">("all");

  const visibleFilters = React.useMemo(() => {
    const present = new Set(resources.map((r) => r.category));
    return FILTERS.filter((f) => f.value === "all" || present.has(f.value));
  }, [resources]);

  const filtered = React.useMemo(
    () => (selected === "all" ? resources : resources.filter((r) => r.category === selected)),
    [resources, selected],
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-10">
        {visibleFilters.map((f) => {
          const active = selected === f.value;
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => setSelected(f.value)}
              className={cn(
                "px-4 h-9 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors",
                active
                  ? "bg-[var(--color-navy-900)] text-white"
                  : "bg-white text-[var(--color-navy-700)] ring-1 ring-[var(--color-navy-200)] hover:ring-[var(--color-navy-700)]",
              )}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-[var(--color-muted)]">No articles in this category yet.</p>
      ) : (
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => {
            const photo = resourceImages[r.slug];
            return (
              <Link
                key={r.slug}
                href={`/resources/${r.slug}`}
                className="group flex flex-col rounded-2xl bg-white ring-1 ring-[var(--color-navy-200)] overflow-hidden hover:-translate-y-0.5 hover:shadow-[var(--shadow-pop)] hover:ring-[var(--color-navy-700)] transition-all"
              >
                {photo && (
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <BrandImage
                      photo={photo}
                      treatment="none"
                      rounded="none"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="absolute inset-0"
                      imageClassName="group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="flex flex-col flex-1 p-6 gap-4">
                  <ArticleByline
                    category={r.category}
                    author={r.author}
                    publishedAt={r.publishedAt}
                    readMinutes={r.readMinutes}
                  />
                  <h3 className="text-[var(--color-navy-900)] leading-snug text-xl">
                    {r.title}
                  </h3>
                  <div className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-navy-800)] group-hover:text-[var(--color-brass-700)]">
                    Read article
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
