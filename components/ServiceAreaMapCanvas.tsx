"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { serviceAreaMapData } from "@/lib/map/serviceAreaShapes";
import type { LabelPos } from "@/content/serviceArea";

type Data = typeof serviceAreaMapData;

const HQ = "Blackwood";

// South-NJ counties get heavier strokes than the PA/DE edges so the eye is
// drawn to where the work actually happens.
function isSouthNJ(fips: string): boolean {
  return fips.startsWith("34");
}

function labelGeom(pos: LabelPos | undefined, isHq: boolean) {
  const base = isHq ? 14 : 9;
  const diag = base * 0.72;
  switch (pos ?? "right") {
    case "right":
      return { dx: base, dy: 4, anchor: "start" as const };
    case "left":
      return { dx: -base, dy: 4, anchor: "end" as const };
    case "top":
      return { dx: 0, dy: -base - 2, anchor: "middle" as const };
    case "bottom":
      return { dx: 0, dy: base + 10, anchor: "middle" as const };
    case "top-right":
      return { dx: diag, dy: -diag + 2, anchor: "start" as const };
    case "top-left":
      return { dx: -diag, dy: -diag + 2, anchor: "end" as const };
    case "bottom-right":
      return { dx: diag, dy: diag + 8, anchor: "start" as const };
    case "bottom-left":
      return { dx: -diag, dy: diag + 8, anchor: "end" as const };
  }
}

export function ServiceAreaMapCanvas({
  className,
  showLabels = true,
  data,
}: {
  className?: string;
  showLabels?: boolean;
  data: Data;
}) {
  const { viewBox, paths, cities, regionClusters, highways } = data;

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
            <feGaussianBlur stdDeviation="2.4" />
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
                strokeOpacity={0.4}
                strokeWidth={1.4}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            );
          })}
        </g>

        {/* County outlines — south NJ beefier than PA/DE so focus stays on the work area */}
        <g>
          {paths.counties.map((c, i) => {
            const focus = isSouthNJ(c.id);
            return (
              <motion.path
                key={c.id}
                d={c.d}
                fill={focus ? "rgba(46, 107, 229, 0.08)" : "rgba(46, 107, 229, 0.03)"}
                stroke="var(--color-electric-400)"
                strokeOpacity={focus ? 0.5 : 0.22}
                strokeWidth={focus ? 1.2 : 0.7}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.02 }}
              />
            );
          })}
        </g>

        {/* Stylized highway routes — dashed so they read as roads, not borders */}
        <g>
          {highways.map((h, i) => (
            <motion.path
              key={h.name}
              d={h.d}
              fill="none"
              stroke="var(--color-electric-300)"
              strokeOpacity={0.45}
              strokeWidth={1.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="5 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.55 + i * 0.1, ease: "easeOut" }}
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

        {/* County names — sit above glows so they stay readable, behind town labels */}
        {showLabels && (
          <g>
            {paths.counties.map((c, i) => (
              <motion.text
                key={`county-${c.id}`}
                x={c.cx}
                y={c.cy}
                textAnchor="middle"
                fill="var(--color-navy-100)"
                fillOpacity={isSouthNJ(c.id) ? 0.42 : 0.25}
                fontSize={11}
                fontStyle="italic"
                fontWeight={500}
                letterSpacing="0.08em"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.85 + i * 0.02 }}
                style={{ textTransform: "uppercase" }}
              >
                {c.name}
              </motion.text>
            ))}
          </g>
        )}

        {/* Highway labels */}
        {showLabels && (
          <g>
            {highways.map((h, i) => (
              <motion.text
                key={`hwy-${h.name}`}
                x={h.labelAt.x}
                y={h.labelAt.y}
                textAnchor="middle"
                fill="var(--color-electric-200)"
                fillOpacity={0.55}
                fontSize={9}
                fontWeight={600}
                letterSpacing="0.1em"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.0 + i * 0.05 }}
                style={{
                  paintOrder: "stroke",
                  stroke: "var(--color-navy-950)",
                  strokeWidth: 3,
                  strokeLinejoin: "round",
                }}
              >
                {h.name}
              </motion.text>
            ))}
          </g>
        )}

        {/* City pins */}
        <g>
          {cities.map((c, i) => {
            const isHq = c.name === HQ;
            const r = isHq ? 9 : 5.5;
            return (
              <motion.g
                key={c.name}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.35,
                  delay: 0.9 + i * 0.018,
                  ease: "backOut",
                }}
                style={{ transformOrigin: `${c.x}px ${c.y}px` }}
              >
                {isHq && (
                  <motion.circle
                    cx={c.x}
                    cy={c.y}
                    r={18}
                    fill="var(--color-electric-400)"
                    initial={{ opacity: 0.6, scale: 0.6 }}
                    animate={{ opacity: 0, scale: 1.7 }}
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
                  r={r + 2.5}
                  fill="rgba(11, 31, 58, 0.65)"
                  filter="url(#pin-shadow)"
                />
                {isHq && (
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r={r + 3}
                    fill="none"
                    stroke="var(--color-brass-300)"
                    strokeOpacity={0.5}
                    strokeWidth={1.5}
                  />
                )}
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={r}
                  fill={isHq ? "var(--color-brass-400)" : "var(--color-electric-300)"}
                  stroke="white"
                  strokeWidth={isHq ? 2 : 1.2}
                />
              </motion.g>
            );
          })}
        </g>

        {/* Town labels — every town, placed per labelPos hint to avoid overlap */}
        {showLabels && (
          <g>
            {cities.map((c, i) => {
              const isHq = c.name === HQ;
              const { dx, dy, anchor } = labelGeom(c.labelPos, isHq);
              return (
                <motion.text
                  key={`label-${c.name}`}
                  x={c.x + dx}
                  y={c.y + dy}
                  textAnchor={anchor}
                  fill={isHq ? "var(--color-brass-200)" : "var(--color-navy-100)"}
                  fontSize={isHq ? 14 : 10.5}
                  fontWeight={isHq ? 700 : 500}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35, delay: 1.05 + i * 0.015 }}
                  style={{
                    paintOrder: "stroke",
                    stroke: "var(--color-navy-950)",
                    strokeWidth: isHq ? 3.5 : 3,
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
