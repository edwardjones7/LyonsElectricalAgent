import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LELogo } from "./LELogo";

// Cropped logo aspect ratio — content width / height after the transparency trim.
// Source: cropped to 1113 × 415 (≈ 2.68:1).
const LOGO_W = 1113;
const LOGO_H = 415;

export function WordMark({
  className,
  variant = "dark",
  size = "md",
}: {
  className?: string;
  variant?: "dark" | "light";
  /** md = header, lg = footer */
  size?: "sm" | "md" | "lg";
}) {
  const isLight = variant === "light";

  if (isLight) {
    // Dark surface — use the inline LELogo (recolorable) + bold wordmark text
    return (
      <Link
        href="/"
        className={cn(
          "inline-flex items-center gap-3 group transition-transform hover:-translate-y-0.5",
          className,
        )}
        aria-label="Lyons Electrical home"
      >
        <LELogo className="w-10 h-10 text-white shrink-0" />
        <span className="flex flex-col leading-none">
          <span className="font-industrial text-[1.625rem] font-extrabold tracking-tight text-white leading-[0.9]">
            LYONS
          </span>
          <span className="font-industrial text-[0.7rem] font-bold tracking-[0.22em] mt-1 text-[var(--color-electric-300)] uppercase leading-none">
            Electrical · 24/7
          </span>
        </span>
      </Link>
    );
  }

  // Light surface — use the (cropped, transparent) logo PNG
  const heightClass =
    size === "sm" ? "h-9" : size === "lg" ? "h-16" : "h-14";

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center group transition-transform hover:-translate-y-0.5 shrink-0",
        className,
      )}
      aria-label="Lyons Electrical Contractors home"
    >
      <Image
        src="/brand/logo.png"
        alt="Lyons Electrical Contractors"
        width={LOGO_W}
        height={LOGO_H}
        priority
        className={cn("w-auto select-none", heightClass)}
        sizes="(min-width: 1024px) 220px, 180px"
      />
    </Link>
  );
}
