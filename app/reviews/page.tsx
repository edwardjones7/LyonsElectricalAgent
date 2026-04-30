import { Star, Quote } from "lucide-react";
import { reviews } from "@/content/reviews";
import { LYONS } from "@/lib/constants";
import { PageHero } from "@/components/PageHero";

export const metadata = { title: "Reviews" };

export default function ReviewsPage() {
  return (
    <>
      <PageHero
        eyebrow="Reviews"
        title={`${LYONS.googleRating.toFixed(1)} stars across ${LYONS.googleReviewCount} Google reviews.`}
        blurb={`Customers name us by name — Arthur, Tom, Gene, Allie, Jean, Tim, Tom O., Brian, Tyree, Maurice, Sean, Carlos, Darnell, and the rest of the crew. Built one job at a time, over ${LYONS.yearsInBusiness}+ years.`}
        eyebrowTone="brass"
      />

      <section className="pb-28">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="grid gap-5 sm:grid-cols-2">
            {reviews.map((r, i) => (
              <article
                key={i}
                className="relative rounded-3xl bg-white p-7 ring-1 ring-[var(--color-navy-200)] shadow-[var(--shadow-soft)]"
              >
                <Quote className="absolute top-5 right-5 w-7 h-7 text-[var(--color-brass-300)]/40" />
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className="w-3.5 h-3.5 fill-[var(--color-brass-500)] text-[var(--color-brass-500)]"
                      strokeWidth={0}
                    />
                  ))}
                </div>
                <p className="mt-4 text-[var(--color-ink)] leading-relaxed">&ldquo;{r.text}&rdquo;</p>
                <div className="mt-5 pt-4 border-t border-[var(--color-navy-100)] text-sm flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-[var(--color-navy-900)]">{r.author}</div>
                    {r.city && (
                      <div className="text-[var(--color-muted)] text-xs mt-0.5">{r.city}</div>
                    )}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-[var(--color-muted)]">
                    {r.service.replace(/-/g, " ")}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-3xl bg-[var(--color-cream-100)] ring-1 ring-[var(--color-brass-200)] p-6 text-sm text-[var(--color-navy-800)] leading-relaxed">
            <strong className="text-[var(--color-navy-900)]">Heads up:</strong> these reviews are
            representative samples while we wire in live Google review syncing. The full collection of{" "}
            {LYONS.googleReviewCount}+ verified reviews lives on our Google Business Profile.
          </div>
        </div>
      </section>
    </>
  );
}
