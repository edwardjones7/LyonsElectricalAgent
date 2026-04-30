import Image from "next/image";
import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "w-7 h-7",
  md: "w-9 h-9",
  lg: "w-11 h-11",
} as const;

const sizePx = {
  sm: 28,
  md: 36,
  lg: 44,
} as const;

export function AllieAvatar({
  size = "md",
  className,
}: {
  size?: keyof typeof sizeClasses;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-sm bg-[var(--color-electric-600)]",
        sizeClasses[size],
        className,
      )}
    >
      <Image
        src="/allie.png"
        alt=""
        width={sizePx[size]}
        height={sizePx[size]}
        className="w-full h-full object-cover"
        priority={size === "lg"}
      />
      <span
        className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white"
        aria-hidden
      />
    </span>
  );
}
