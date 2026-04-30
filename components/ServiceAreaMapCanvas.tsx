"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { serviceAreaMapData } from "@/lib/map/serviceAreaShapes";

type Data = typeof serviceAreaMapData;

const HQ = "Blackwood";
const LABELED_CITIES = new Set([
  "Blackwood",
  "Cherry Hill",
  "Camden",
  "Mt. Laurel",
  "Marlton",
  "Burlington",
  "Vineland",
  "Cape May",
  "Wilmington",
  "Haverford",
  "Newtown",
]);

export function ServiceAreaMapCanvas({
  className,
  showLabels = true,
  data,
}: {
  className?: string;
  showLabels?: boolean;
  data: Data;
}) {
  const { viewBox, paths, cities, regionClusters } = data;

  return (
    <div className={cn("relative", className)}>
      <svg
        viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        role="img"
        aria-label="Lyons Electrical service area — South Jersey, parts of Pennsylvania and Delaware"
      >
        <defs>
          <radialGradient id="region-glow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="var(--color-electric-400)" stopOpacity="0.55" />
            <stop offset="60%" stopColor="var(--color-electric-500)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--color-electric-600)" stopOpacity="0" />
          </radialGradient>
          <filter id="pin-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        {/* State silhouettes — soft fill, brighter stroke */}
        <g>
          {(["nj", "pa", "de"] as const).map((key) => {
            const d = paths[key];
            if (!d) return null;
            return (
              <motion.path
                key={key}
                d={d}
                fill="rgba(255,255,255,0.04)"
                stroke="var(--color-navy-300)"
                strokeOpacity={0.35}
                strokeWidth={1.2}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            );
          })}
        </g>

        {/* County outlines for the service footprint */}
        <g>
          {paths.counties.map((c, i) => (
            <motion.path
              key={c.id}
              d={c.d}
              fill="rgba(46, 107, 229, 0.06)"
              stroke="var(--color-electric-400)"
              strokeOpacity={0.25}
              strokeWidth={0.7}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.02 }}
            />
          ))}
        </g>

        {/* Soft regional glow per cluster */}
        <g>
          {regionClusters.map((r, i) => {
            if (r.rx === 0 && r.ry === 0) return null;
            return (
              <motion.ellipse
                key={r.id}
                cx={r.cx}
                cy={r.cy}
                rx={r.rx}
                ry={r.ry}
                fill="url(#region-glow)"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.6 + i * 0.06, ease: "easeOut" }}
                style={{ transformOrigin: `${r.cx}px ${r.cy}px` }}
              />
            );
          })}
        </g>

        {/* City pins */}
        <g>
          {cities.map((c, i) => {
            const isHq = c.name === HQ;
            const r = isHq ? 6 : 3.5;
            return (
              <motion.g
                key={c.name}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.35,
                  delay: 0.9 + i * 0.025,
                  ease: "backOut",
                }}
                style={{ transformOrigin: `${c.x}px ${c.y}px` }}
              >
                {isHq && (
                  <motion.circle
                    cx={c.x}
                    cy={c.y}
                    r={14}
                    fill="var(--color-electric-400)"
                    initial={{ opacity: 0.6, scale: 0.6 }}
                    animate={{ opacity: 0, scale: 1.6 }}
                    transition={{
                      duration: 2,
                      delay: 1.2,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                    style={{ transformOrigin: `${c.x}px ${c.y}px` }}
                  />
                )}
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={r + 2}
                  fill="rgba(11, 31, 58, 0.6)"
                  filter="url(#pin-shadow)"
                />
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={r}
                  fill={isHq ? "var(--color-brass-400)" : "var(--color-electric-300)"}
                  stroke="white"
                  strokeWidth={isHq ? 1.5 : 1}
                />
              </motion.g>
            );
          })}
        </g>

        {/* Labels — selective so the map stays legible */}
        {showLabels && (
          <g>
            {cities.map((c, i) => {
              if (!LABELED_CITIES.has(c.name)) return null;
              const isHq = c.name === HQ;
              return (
                <motion.text
                  key={`label-${c.name}`}
                  x={c.x + (isHq ? 10 : 7)}
                  y={c.y + 4}
                  fill={isHq ? "var(--color-brass-200)" : "var(--color-navy-100)"}
                  fontSize={isHq ? 13 : 11}
                  fontWeight={isHq ? 700 : 500}
                  initial={{ opacity: 0, x: c.x }}
                  animate={{ opacity: 1, x: c.x + (isHq ? 10 : 7) }}
                  transition={{ duration: 0.4, delay: 1.1 + i * 0.02 }}
                  style={{
                    paintOrder: "stroke",
                    stroke: "var(--color-navy-950)",
                    strokeWidth: 3,
                    strokeLinejoin: "round",
                  }}
                >
                  {isHq ? `${c.name} — HQ` : c.name}
                </motion.text>
              );
            })}
          </g>
        )}
      </svg>
    </div>
  );
}
