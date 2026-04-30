import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORY_LABEL: Record<string, string> = {
  safety: "Safety",
  panels: "Panels",
  diy: "DIY vs. Pro",
  storm: "Storm",
  buying: "Buying",
};

function formatDateline(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

type Props = {
  category: string;
  author?: string;
  publishedAt: string;
  readMinutes: number;
  align?: "left" | "center";
  tone?: "default" | "muted";
};

export function ArticleByline({
  category,
  author = "Lyons Electrical",
  publishedAt,
  readMinutes,
  align = "left",
  tone = "default",
}: Props) {
  const label = CATEGORY_LABEL[category] ?? category;
  const dateline = formatDateline(publishedAt);
  const textTone =
    tone === "muted" ? "text-[var(--color-navy-200)]" : "text-[var(--color-muted)]";
  const chipTone =
    tone === "muted"
      ? "bg-white/10 text-[var(--color-brass-200)]"
      : "bg-[var(--color-cream-100)] text-[var(--color-brass-700)]";

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-2 text-xs",
        align === "center" && "justify-center",
        textTone,
      )}
    >
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-1 font-semibold uppercase tracking-wider text-[0.65rem]",
          chipTone,
        )}
      >
        {label}
      </span>
      <span className="font-medium">By {author}</span>
      <span aria-hidden className="opacity-60">·</span>
      <span>{dateline}</span>
      <span aria-hidden className="opacity-60">·</span>
      <span className="inline-flex items-center gap-1">
        <Clock className="w-3 h-3" />
        {readMinutes} min read
      </span>
    </div>
  );
}
