import { BrandImage } from "./BrandImage";
import type { Photo } from "@/content/images";
import { cn } from "@/lib/utils";

/**
 * 5-image masonry: one large hero on the left, four smaller stacked on the right.
 * Each tile gets a slightly different aspect to break the box-grid feel.
 */
export function ImageMosaic({
  photos,
  className,
  treatment = "navy",
}: {
  photos: Photo[]; // expects exactly 5 — extras are ignored, missing = fewer tiles
  className?: string;
  treatment?: "navy" | "brass" | "duotone" | "none";
}) {
  const [a, b, c, d, e] = photos;
  return (
    <div className={cn("grid gap-3 sm:gap-4 grid-cols-6 grid-rows-6 h-[420px] sm:h-[520px] lg:h-[600px]", className)}>
      {a && (
        <div className="col-span-6 sm:col-span-3 row-span-6 relative">
          <BrandImage photo={a} treatment={treatment} className="absolute inset-0" rounded="2xl" sizes="(min-width: 640px) 50vw, 100vw" />
        </div>
      )}
      {b && (
        <div className="hidden sm:block col-span-3 row-span-3 relative">
          <BrandImage photo={b} treatment={treatment} className="absolute inset-0" rounded="2xl" sizes="(min-width: 640px) 50vw, 100vw" />
        </div>
      )}
      {c && (
        <div className="hidden sm:block col-span-2 row-span-3 relative">
          <BrandImage photo={c} treatment={treatment} className="absolute inset-0" rounded="2xl" sizes="(min-width: 640px) 33vw, 100vw" />
        </div>
      )}
      {d && (
        <div className="hidden sm:block col-span-1 row-span-3 relative">
          <BrandImage photo={d} treatment="brass" className="absolute inset-0" rounded="2xl" sizes="(min-width: 640px) 16vw, 100vw" />
        </div>
      )}
      {e && (
        <div className="hidden lg:block col-span-3 row-span-3 col-start-4 relative">
          {/* hide d and replace with this on lg if needed */}
        </div>
      )}
    </div>
  );
}
