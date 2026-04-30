import { Star } from "lucide-react";
import { LYONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function StarsBadge({
  className,
  variant = "light",
  showCount = true,
}: {
  className?: string;
  variant?: "light" | "dark";
  showCount?: boolean;
}) {
  const isLight = variant === "light";
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm",
        isLight
          ? "bg-white/85 text-[var(--color-navy-900)] ring-1 ring-[var(--color-navy-200)]"
          : "bg-white/10 text-white ring-1 ring-white/20",
        className,
      )}
    >
      <span className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-3.5 w-3.5",
              isLight ? "fill-[var(--color-brass-500)] text-[var(--color-brass-500)]" : "fill-[var(--color-brass-300)] text-[var(--color-brass-300)]",
            )}
            strokeWidth={0}
          />
        ))}
      </span>
      <span className="font-semibold tabular-nums">{LYONS.googleRating.toFixed(1)}</span>
      {showCount && (
        <span className={cn("text-xs", isLight ? "text-[var(--color-muted)]" : "text-white/70")}>
          {LYONS.googleReviewCount} Google reviews
        </span>
      )}
    </div>
  );
}
