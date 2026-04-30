import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "emergency" | "ghost" | "outline" | "brass";
type Size = "sm" | "md" | "lg";

const baseStyles =
  "inline-flex items-center justify-center gap-2 font-medium rounded-full transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--color-navy-900)] text-white hover:bg-[var(--color-navy-800)] focus-visible:outline-[var(--color-navy-900)] shadow-[var(--shadow-soft)]",
  emergency:
    "bg-[var(--color-emergency-500)] text-white hover:bg-[var(--color-emergency-600)] focus-visible:outline-[var(--color-emergency-500)] shadow-[var(--shadow-emergency)]",
  brass:
    "bg-[var(--color-brass-500)] text-[var(--color-navy-950)] hover:bg-[var(--color-brass-400)] focus-visible:outline-[var(--color-brass-500)] shadow-[var(--shadow-soft)]",
  ghost:
    "bg-transparent text-[var(--color-navy-900)] hover:bg-[var(--color-navy-100)] focus-visible:outline-[var(--color-navy-900)]",
  outline:
    "bg-transparent text-[var(--color-navy-900)] border border-[var(--color-navy-900)]/30 hover:border-[var(--color-navy-900)] hover:bg-[var(--color-navy-50)] focus-visible:outline-[var(--color-navy-900)]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-14 px-7 text-base",
};

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...rest}
    >
      {children}
    </button>
  );
}

type LinkButtonProps = {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
  external?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  external,
  ...rest
}: LinkButtonProps) {
  const classes = cn(baseStyles, variants[variant], sizes[size], className);
  if (external || href.startsWith("tel:") || href.startsWith("mailto:") || href.startsWith("http")) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
