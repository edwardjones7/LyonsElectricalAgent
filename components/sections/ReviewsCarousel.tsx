"use client";

import Link from "next/link";
import { Star, Quote, ArrowRight } from "lucide-react";
import { reviews } from "@/content/reviews";
import { LYONS } from "@/lib/constants";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";

export function ReviewsCarousel() {
  // Split reviews into two rows for a richer marquee feel
  const half = Math.ceil(reviews.length / 2);
  const rowA = reviews.slice(0, half);
  const rowB = reviews.slice(half);

  return (
    <section className="py-20 lg:py-28 bg-[var(--color-cream-100)]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-brass-700)] font-semibold">
              From your neighbors
            </div>
            <h2 className="mt-3 text-[var(--color-navy-900)]">
              {LYONS.googleReviewCount} five-star reviews. Same story, every time.
            </h2>
          </div>
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 text-[var(--color-navy-800)] font-semibold hover:text-[var(--color-navy-900)] group"
          >
            Read all reviews
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Reveal>
      </div>

      <div className="space-y-4">
        <Marquee speed={70} className="">
          {rowA.map((r, i) => (
            <div key={`a-${i}`} className="px-2.5">
              <ReviewTile r={r} />
            </div>
          ))}
        </Marquee>
        <Marquee speed={90} reverse>
          {rowB.map((r, i) => (
            <div key={`b-${i}`} className="px-2.5">
              <ReviewTile r={r} />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

function ReviewTile({ r }: { r: typeof reviews[number] }) {
  return (
    <article
      className="relative rounded-3xl bg-white p-6 ring-1 ring-[var(--color-navy-200)] shadow-[var(--shadow-soft)] w-[340px] h-[280px]"
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
