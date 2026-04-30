import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  blurb,
  variant = "light",
  align = "left",
  eyebrowTone = "electric",
  children,
}: {
  eyebrow?: string;
  title: string;
  blurb?: string;
  variant?: "light" | "dark";
  align?: "left" | "center";
  /** Default electric for energy-coded pages; pass "brass" on warm pages (about/team/resources). */
  eyebrowTone?: "electric" | "brass";
  children?: React.ReactNode;
}) {
  const isDark = variant === "dark";
  const eyebrowColor =
    eyebrowTone === "brass"
      ? isDark
        ? "text-[var(--color-brass-300)]"
        : "text-[var(--color-brass-700)]"
      : isDark
        ? "text-[var(--color-electric-300)]"
        : "text-[var(--color-electric-600)]";

  return (
    <section
      className={cn(
        "relative overflow-hidden",
        isDark ? "bg-[var(--color-navy-900)] text-white" : "bg-[var(--color-cream)]",
      )}
    >
      {isDark && <div className="absolute inset-0 bg-grid opacity-30" aria-hidden />}
      <div
        className={cn(
          "relative mx-auto max-w-5xl px-5 sm:px-8 py-20 lg:py-28",
          align === "center" && "text-center",
        )}
      >
        {eyebrow && (
          <div className={cn("text-xs uppercase tracking-[0.2em] font-bold", eyebrowColor)}>
            {eyebrow}
          </div>
        )}
        <h1 className={cn("mt-3", isDark ? "text-white" : "text-[var(--color-navy-900)]")}>
          {title}
        </h1>
        {blurb && (
          <p
            className={cn(
              "mt-5 text-lg leading-relaxed max-w-2xl",
              align === "center" && "mx-auto",
              isDark ? "text-[var(--color-navy-200)]" : "text-[var(--color-ink-soft)]",
            )}
          >
            {blurb}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
