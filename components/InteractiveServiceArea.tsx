"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BatteryCharging,
  Cable,
  Lightbulb,
  PanelTop,
  PlugZap,
  ShieldCheck,
  Siren,
  Wrench,
} from "lucide-react";
import { citiesByState, regions, townToRegion, type RegionId, type ServiceRegion } from "@/content/serviceArea";

/**
 * Interactive map for the service-area page: hover a region to highlight that
 * cluster and surface a side panel with sample jobs, top services, and a quote.
 *
 * The static-style map (no panel, no hover) lives in components/ServiceAreaMap.tsx
 * and is still used by the homepage teaser. This is a richer drill-down view.
 */

type Pin = { name: string; x: number; y: number; emphasized?: boolean };

const PINS: Pin[] = [
  { name: "Newtown", x: 165, y: 95 },
  { name: "Fallsington", x: 200, y: 130 },
  { name: "Haverford", x: 95, y: 110 },
  { name: "Wilmington", x: 70, y: 295 },
  { name: "Camden", x: 280, y: 195, emphasized: true },
  { name: "Cherry Hill", x: 320, y: 220, emphasized: true },
  { name: "Voorhees", x: 350, y: 260 },
  { name: "Bellmawr", x: 295, y: 230 },
  { name: "Mt. Laurel", x: 380, y: 235, emphasized: true },
  { name: "Marlton", x: 400, y: 260, emphasized: true },
  { name: "Berlin", x: 360, y: 300 },
  { name: "Burlington", x: 410, y: 175 },
  { name: "Willingboro", x: 415, y: 200 },
  { name: "Beverly", x: 395, y: 165 },
  { name: "Riverside", x: 380, y: 185 },
  { name: "Mt. Holly", x: 445, y: 220 },
  { name: "Medford Lakes", x: 460, y: 270 },
  { name: "Blackwood (HQ)", x: 305, y: 250, emphasized: true },
  { name: "Sicklerville", x: 320, y: 285 },
  { name: "Williamstown", x: 340, y: 320 },
  { name: "Glassboro", x: 285, y: 320 },
  { name: "Wenonah", x: 250, y: 280 },
  { name: "Swedesboro", x: 215, y: 305 },
  { name: "Mullica Hill", x: 245, y: 325 },
  { name: "Carneys Point", x: 165, y: 330 },
  { name: "Salem", x: 175, y: 370 },
  { name: "Vineland", x: 320, y: 415 },
  { name: "Millville", x: 295, y: 460 },
  { name: "Elmer", x: 245, y: 405 },
  { name: "Cape May", x: 460, y: 595 },
  { name: "Marlboro", x: 460, y: 110 },
];

const ICON_MAP = {
  panel: PanelTop,
  ev: PlugZap,
  generator: BatteryCharging,
  wire: Cable,
  surge: ShieldCheck,
  light: Lightbulb,
  siren: Siren,
  wrench: Wrench,
} as const;

export function InteractiveServiceArea() {
  // null = "Overview" panel; otherwise the active region id.
  const [activeId, setActiveId] = useState<RegionId | null>(null);
  const active = activeId ? regions.find((r) => r.id === activeId) ?? null : null;

  const totalCities =
    citiesByState.NJ.length + citiesByState.PA.length + citiesByState.DE.length;
  const totalJobs = regions.reduce((sum, r) => sum + r.jobCount, 0);

  return (
    <div className="grid gap-6 lg:gap-10 lg:grid-cols-12 items-stretch">
      <div className="lg:col-span-7 relative">
        <RegionMap activeId={activeId} onChange={setActiveId} />
      </div>

      <div className="lg:col-span-5">
        <div className="sticky lg:top-24">
          <AnimatePresence mode="wait">
            {active ? (
              <RegionPanel key={active.id} region={active} />
            ) : (
              <OverviewPanel key="overview" totalCities={totalCities} totalJobs={totalJobs} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// -- Map --------------------------------------------------------------

function RegionMap({
  activeId,
  onChange,
}: {
  activeId: RegionId | null;
  onChange: (id: RegionId | null) => void;
}) {
  return (
    <div className="rounded-3xl bg-[var(--color-navy-900)] ring-1 ring-white/10 p-4 sm:p-6 lg:p-8 overflow-hidden">
      <svg
        viewBox="20 30 540 640"
        className="w-full h-auto"
        role="img"
        aria-label="Interactive service area map. Hover or tap a region to see jobs and services from that area."
        onMouseLeave={() => onChange(null)}
      >
        <defs>
          <radialGradient id="iPinGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-electric-300)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--color-electric-500)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="iHqGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-emergency-500)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="var(--color-emergency-500)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="iRegionGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-electric-400)" stopOpacity="0.45" />
            <stop offset="60%" stopColor="var(--color-electric-500)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--color-electric-500)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="iRegionGlowHQ" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-emergency-500)" stopOpacity="0.4" />
            <stop offset="60%" stopColor="var(--color-emergency-500)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--color-emergency-500)" stopOpacity="0" />
          </radialGradient>
          <pattern id="iDots" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.8" fill="var(--color-navy-300)" opacity="0.4" />
          </pattern>
        </defs>

        <rect x="0" y="0" width="600" height="700" fill="url(#iDots)" />

        {/* Region L-shape backdrop */}
        <path
          d="M 60,100 Q 90,140 110,180 Q 130,210 150,250 Q 110,260 90,310 Q 80,360 110,400 L 100,440 Q 140,460 170,440 L 180,470 Q 220,490 230,470 L 250,490 Q 270,540 320,560 Q 370,580 430,580 Q 470,570 480,540 L 490,500 Q 470,460 450,400 L 480,360 Q 510,310 510,260 L 490,220 Q 460,180 440,160 Q 420,140 380,140 L 320,150 Q 280,140 240,120 Q 200,100 160,90 Q 100,80 60,100 Z"
          fill="var(--color-navy-700)"
          stroke="var(--color-electric-500)"
          strokeWidth="1.5"
          strokeOpacity="0.45"
          fillOpacity="0.18"
        />

        <text x="135" y="60" fontSize="13" fill="var(--color-navy-400)" letterSpacing="6" fontWeight="600">
          PA
        </text>
        <text x="35" y="265" fontSize="13" fill="var(--color-navy-400)" letterSpacing="6" fontWeight="600">
          DE
        </text>
        <text x="430" y="120" fontSize="13" fill="var(--color-navy-400)" letterSpacing="6" fontWeight="600">
          NJ
        </text>

        {/* Region overlays — hover targets, glow when active */}
        {regions.map((region) => (
          <RegionOverlay
            key={region.id}
            region={region}
            active={activeId === region.id}
            anyActive={activeId !== null}
            onEnter={() => onChange(region.id)}
            onClick={() => onChange(region.id === activeId ? null : region.id)}
          />
        ))}

        {/* Pins */}
        {PINS.map((pin, i) => {
          const regionId = townToRegion(pin.name);
          const isInActive = activeId !== null && regionId === activeId;
          const isOutsideActive = activeId !== null && regionId !== activeId;
          const isHQ = pin.name.includes("HQ");
          return (
            <motion.g
              key={pin.name}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: 0.25 + i * 0.02, ease: [0.2, 0.8, 0.2, 1] }}
              animate={{
                opacity: isOutsideActive ? 0.25 : 1,
                scale: isInActive ? 1.15 : 1,
              }}
              style={{ transformOrigin: `${pin.x}px ${pin.y}px` }}
            >
              <circle
                cx={pin.x}
                cy={pin.y}
                r={pin.emphasized ? 14 : 9}
                fill={`url(#${isHQ ? "iHqGlow" : "iPinGlow"})`}
              />
              <circle
                cx={pin.x}
                cy={pin.y}
                r={pin.emphasized ? 4.5 : 3}
                fill={isHQ ? "var(--color-emergency-500)" : "var(--color-electric-400)"}
              />
              {pin.emphasized && !isOutsideActive && (
                <motion.circle
                  cx={pin.x}
                  cy={pin.y}
                  r={5}
                  fill="none"
                  stroke={isHQ ? "var(--color-emergency-500)" : "var(--color-electric-400)"}
                  strokeWidth="1.2"
                  animate={{ r: [5, 16, 5], opacity: [0.8, 0, 0.8] }}
                  transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.2, ease: "easeOut" }}
                />
              )}
              {isInActive && (
                <text
                  x={pin.x + (pin.emphasized ? 9 : 7)}
                  y={pin.y + 3.5}
                  fontSize="9.5"
                  fill="var(--color-navy-50)"
                  fontWeight="600"
                  style={{ paintOrder: "stroke", stroke: "var(--color-navy-900)", strokeWidth: 3 }}
                >
                  {pin.name.replace(" (HQ)", "")}
                </text>
              )}
            </motion.g>
          );
        })}
      </svg>
      <div className="mt-3 text-xs text-[var(--color-navy-300)] text-center hidden lg:block">
        Hover a region to explore. Tap to lock.
      </div>
      <div className="mt-3 text-xs text-[var(--color-navy-300)] text-center lg:hidden">
        Tap any region to explore.
      </div>
    </div>
  );
}

function RegionOverlay({
  region,
  active,
  anyActive,
  onEnter,
  onClick,
}: {
  region: ServiceRegion;
  active: boolean;
  anyActive: boolean;
  onEnter: () => void;
  onClick: () => void;
}) {
  const { cx, cy, rx, ry } = region.shape;
  const dim = anyActive && !active;
  return (
    <g
      onMouseEnter={onEnter}
      onClick={onClick}
      style={{ cursor: "pointer" }}
      role="button"
      aria-label={`${region.label} region — ${region.towns.length} towns, ${region.jobCount} jobs`}
    >
      {/* glow halo */}
      <motion.ellipse
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        fill={`url(#${region.isHQ ? "iRegionGlowHQ" : "iRegionGlow"})`}
        animate={{ opacity: active ? 1 : dim ? 0.05 : 0.35, scale: active ? 1.05 : 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />
      {/* outline ring */}
      <motion.ellipse
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        fill="transparent"
        stroke={region.isHQ ? "var(--color-emergency-500)" : "var(--color-electric-400)"}
        strokeWidth={1.4}
        strokeDasharray="4 5"
        animate={{ opacity: active ? 0.85 : 0, scale: active ? 1.05 : 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />
      {/* invisible bigger hit area so hovering near the cluster works */}
      <ellipse cx={cx} cy={cy} rx={rx + 8} ry={ry + 8} fill="transparent" pointerEvents="all" />
    </g>
  );
}

// -- Panels -----------------------------------------------------------

function OverviewPanel({ totalCities, totalJobs }: { totalCities: number; totalJobs: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl bg-white ring-1 ring-[var(--color-navy-100)] shadow-soft p-6 sm:p-8"
    >
      <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-electric-600)] font-semibold">
        Service area
      </div>
      <h3 className="mt-2 font-display text-3xl text-[var(--color-navy-900)] leading-tight">
        Five regions, one truck fleet.
      </h3>
      <p className="mt-3 text-[var(--color-muted)] leading-relaxed">
        Hover any region on the map to see the jobs we run there, the services that come up most,
        and what local clients have to say.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <Stat value={totalCities} label="Towns served" />
        <Stat value={`${totalJobs}+`} label="Jobs logged" />
        <Stat value="24/7" label="Emergency line" />
      </div>

      <div className="mt-6 space-y-2">
        {regions.map((r) => (
          <div
            key={r.id}
            className="flex items-center justify-between text-sm py-2 border-b border-[var(--color-navy-100)] last:border-0"
          >
            <div className="flex items-center gap-2.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  r.isHQ ? "bg-[var(--color-emergency-500)]" : "bg-[var(--color-electric-500)]"
                }`}
              />
              <span className="font-medium text-[var(--color-navy-900)]">{r.label}</span>
            </div>
            <span className="text-xs text-[var(--color-muted)]">
              {r.towns.length} towns · {r.jobCount} jobs
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function RegionPanel({ region }: { region: ServiceRegion }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl bg-white ring-1 ring-[var(--color-navy-100)] shadow-soft p-6 sm:p-8"
    >
      <div className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${
            region.isHQ ? "bg-[var(--color-emergency-500)]" : "bg-[var(--color-electric-500)]"
          }`}
        />
        <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-electric-600)] font-semibold">
          {region.isHQ ? "Headquarters region" : "Region"}
        </div>
      </div>
      <h3 className="mt-2 font-display text-3xl text-[var(--color-navy-900)] leading-tight">
        {region.label}
      </h3>
      <div className="mt-1 text-[var(--color-navy-600)] italic text-sm">{region.tagline}</div>
      <p className="mt-4 text-[var(--color-muted)] leading-relaxed">{region.description}</p>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <Stat value={region.jobCount} label="Jobs done" />
        <Stat value={region.towns.length} label="Towns" />
        <Stat value={region.topServices.length} label="Top services" />
      </div>

      <div className="mt-6">
        <div className="text-xs uppercase tracking-wider text-[var(--color-navy-500)] font-semibold mb-2">
          Recent work
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {region.jobs.map((job) => (
            <JobCard key={job.title} title={job.title} icon={job.icon} hq={!!region.isHQ} />
          ))}
        </div>
      </div>

      <div className="mt-6">
        <div className="text-xs uppercase tracking-wider text-[var(--color-navy-500)] font-semibold mb-2">
          Common services
        </div>
        <ul className="text-sm text-[var(--color-ink)] space-y-1.5">
          {region.topServices.map((s) => (
            <li key={s} className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[var(--color-electric-500)]" />
              {s}
            </li>
          ))}
        </ul>
      </div>

      <figure className="mt-6 rounded-2xl bg-[var(--color-cream-100)] p-4 border-l-2 border-[var(--color-electric-500)]">
        <blockquote className="text-sm italic text-[var(--color-ink-soft)] leading-relaxed">
          &ldquo;{region.quote.text}&rdquo;
        </blockquote>
        <figcaption className="mt-2 text-xs text-[var(--color-muted)]">
          — {region.quote.author}, {region.quote.town}
        </figcaption>
      </figure>

      <details className="mt-5 group">
        <summary className="text-xs uppercase tracking-wider text-[var(--color-navy-500)] font-semibold cursor-pointer hover:text-[var(--color-electric-600)] transition-colors">
          All {region.towns.length} towns in this region
        </summary>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {region.towns.map((t) => (
            <span
              key={t}
              className="text-xs px-2 py-1 rounded-full bg-[var(--color-navy-50)] text-[var(--color-navy-700)] ring-1 ring-[var(--color-navy-100)]"
            >
              {t}
            </span>
          ))}
        </div>
      </details>
    </motion.div>
  );
}

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-2xl bg-[var(--color-navy-50)] px-3 py-3">
      <div className="font-display text-2xl text-[var(--color-navy-900)] leading-none">{value}</div>
      <div className="mt-1 text-[0.6875rem] uppercase tracking-wider text-[var(--color-muted)]">
        {label}
      </div>
    </div>
  );
}

function JobCard({
  title,
  icon,
  hq,
}: {
  title: string;
  icon: keyof typeof ICON_MAP;
  hq: boolean;
}) {
  const Icon = ICON_MAP[icon];
  return (
    <div
      className={`relative aspect-square rounded-xl overflow-hidden p-2.5 flex flex-col justify-between ${
        hq
          ? "bg-gradient-to-br from-[var(--color-emergency-700)] via-[var(--color-emergency-600)] to-[var(--color-navy-900)]"
          : "bg-gradient-to-br from-[var(--color-electric-700)] via-[var(--color-electric-800)] to-[var(--color-navy-900)]"
      }`}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 100% 100%, rgba(255,255,255,0.4), transparent 60%)",
        }}
      />
      <Icon className="relative w-5 h-5 text-white/80" />
      <div className="relative text-[0.6875rem] font-semibold text-white leading-tight">
        {title}
      </div>
    </div>
  );
}
