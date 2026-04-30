import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Photo } from "@/content/images";

type Treatment = "navy" | "brass" | "duotone" | "none";

const treatments: Record<Treatment, string> = {
  navy:
    "after:absolute after:inset-0 after:bg-[var(--color-navy-900)]/35 after:mix-blend-multiply after:pointer-events-none",
  brass:
    "after:absolute after:inset-0 after:bg-gradient-to-tr after:from-[var(--color-navy-900)]/45 after:via-transparent after:to-[var(--color-brass-500)]/15 after:pointer-events-none",
  duotone:
    "after:absolute after:inset-0 after:bg-gradient-to-br after:from-[var(--color-navy-950)]/65 after:via-[var(--color-navy-900)]/35 after:to-[var(--color-navy-700)]/25 after:mix-blend-multiply after:pointer-events-none",
  none: "",
};

export function BrandImage({
  photo,
  treatment = "navy",
  className,
  imageClassName,
  priority,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  rounded = "lg",
}: {
  photo: Photo;
  treatment?: Treatment;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
  rounded?: "none" | "md" | "lg" | "xl" | "2xl" | "3xl";
}) {
  const roundedClass = {
    none: "",
    md: "rounded-md",
    lg: "rounded-2xl",
    xl: "rounded-3xl",
    "2xl": "rounded-[2rem]",
    "3xl": "rounded-[2.5rem]",
  }[rounded];

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        roundedClass,
        treatments[treatment],
        className,
      )}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", imageClassName)}
      />
    </div>
  );
}
