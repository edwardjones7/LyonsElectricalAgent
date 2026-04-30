"use client";

import { cn } from "@/lib/utils";

export function Marquee({
  children,
  speed = 40,
  pauseOnHover = true,
  reverse = false,
  className,
  fadeEdges = true,
}: {
  children: React.ReactNode;
  /** seconds per full loop */
  speed?: number;
  pauseOnHover?: boolean;
  reverse?: boolean;
  className?: string;
  fadeEdges?: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden",
        fadeEdges && "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className,
      )}
      style={{ "--marquee-speed": `${speed}s` } as React.CSSProperties}
    >
      <div
        className={cn(
          "flex w-max",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
