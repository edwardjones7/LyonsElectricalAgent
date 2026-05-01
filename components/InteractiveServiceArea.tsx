"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  BatteryCharging,
  Cable,
  ChevronRight,
  Lightbulb,
  MapPin,
  PanelTop,
  Phone,
  PlugZap,
  ShieldCheck,
  Siren,
  Wrench,
} from "lucide-react";
import { LYONS } from "@/lib/constants";
import {
  cities,
  citiesByState,
  regions,
  townToRegion,
  type RegionId,
  type ServiceCity,
  type ServiceRegion,
} from "@/content/serviceArea";

/**
 * Interactive map for the service-area page.
 *
 * Click-driven model: hover only previews a region (subtle highlight, no panel
 * change); clicking a region or a town pin commits a selection that locks the
 * panel until the user backs out. Town pins drill into a town view with
 * distance-from-HQ and the region's recent work.
 *
 * The static-style map (no panel, no hover) lives in components/ServiceAreaMap.tsx
 * and is still used by the homepage teaser.
 */

type Selection =
  | { kind: "none" }
  | { kind: "region"; id: RegionId }
  | { kind: "town"; name: string };

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

// HQ coords from cities[] (Blackwood, NJ).
const HQ = { lat: 39.8023, lng: -75.0671 };

function milesFromHq(city: ServiceCity): number {
  const R = 3958.8;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(city.lat - HQ.lat);
  const dLng = toRad(city.lng - HQ.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(HQ.lat)) * Math.cos(toRad(city.lat)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function pinNameToCity(pinName: string): ServiceCity | undefined {
  const clean = pinName.replace(" (HQ)", "");
  return cities.find((c) => c.name === clean);
}

export function InteractiveServiceArea() {
  const [selection, setSelection] = useState<Selection>({ kind: "none" });
  const [hoveredRegion, setHoveredRegion] = useState<RegionId | null>(null);

  const selectedRegionId =
    selection.kind === "region"
      ? selection.id
      : selection.kind === "town"
        ? townToRegion(selection.name) ?? null
        : null;

  const totalCities =
    citiesByState.NJ.length + citiesByState.PA.length + citiesByState.DE.length;
  const totalJobs = regions.reduce((sum, r) => sum + r.jobCount, 0);

  return (
    <div className="grid gap-6 lg:gap-10 lg:grid-cols-12 items-stretch">
      <div className="lg:col-span-7 relative">
        <RegionMap
          selectedRegionId={selectedRegionId}
          selectedTownName={selection.kind === "town" ? selection.name : null}
          hoveredRegion={hoveredRegion}
          onHoverRegion={setHoveredRegion}
          onSelectRegion={(id) =>
            setSelection((s) =>
              s.kind === "region" && s.id === id ? { kind: "none" } : { kind: "region", id },
            )
          }
          onSelectTown={(name) =>
            setSelection((s) =>
              s.kind === "town" && s.name === name ? { kind: "none" } : { kind: "town", name },
            )
          }
        />
      </div>

      <div className="lg:col-span-5">
        <div className="sticky lg:top-24">
          <AnimatePresence mode="wait">
            {selection.kind === "town" ? (
              <TownPanel
                key={"town-" + selection.name}
                townName={selection.name}
                onSelectRegion={(id) => setSelection({ kind: "region", id })}
                onClear={() => setSelection({ kind: "none" })}
              />
            ) : selection.kind === "region" ? (
              <RegionPanel
                key={"region-" + selection.id}
                region={regions.find((r) => r.id === selection.id)!}
                onClear={() => setSelection({ kind: "none" })}
                onSelectTown={(name) => setSelection({ kind: "town", name })}
              />
            ) : (
              <OverviewPanel
                key="overview"
                totalCities={totalCities}
                totalJobs={totalJobs}
                onSelectRegion={(id) => setSelection({ kind: "region", id })}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// -- Map --------------------------------------------------------------

function RegionMap({
  selectedRegionId,
  selectedTownName,
  hoveredRegion,
  onHoverRegion,
  onSelectRegion,
  onSelectTown,
}: {
  selectedRegionId: RegionId | null;
  selectedTownName: string | null;
  hoveredRegion: RegionId | null;
  onHoverRegion: (id: RegionId | null) => void;
  onSelectRegion: (id: RegionId) => void;
  onSelectTown: (name: string) => void;
}) {
  return (
    <div className="rounded-3xl bg-[var(--color-navy-900)] ring-1 ring-white/10 p-4 sm:p-6 lg:p-8 overflow-hidden">
      <svg
        viewBox="20 30 540 640"
        className="w-full h-auto"
        role="img"
        aria-label="Interactive service area map. Click a region or a town pin to drill in."
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

        {/* Region overlays — hover previews softly, click locks selection */}
        {regions.map((region) => (
          <RegionOverlay
            key={region.id}
            region={region}
            selected={selectedRegionId === region.id}
            hovered={hoveredRegion === region.id}
            anySelected={selectedRegionId !== null}
            onEnter={() => onHoverRegion(region.id)}
            onLeave={() => onHoverRegion(null)}
            onClick={() => onSelectRegion(region.id)}
          />
        ))}

        {/* Pins */}
        {PINS.map((pin, i) => {
          const regionId = townToRegion(pin.name);
          const cleanName = pin.name.replace(" (HQ)", "");
          const isSelectedTown = selectedTownName === cleanName;
          const activeRegion = selectedRegionId ?? hoveredRegion;
          const isInActiveRegion = activeRegion !== null && regionId === activeRegion;
          const isOutsideActive = activeRegion !== null && regionId !== activeRegion && !isSelectedTown;
          const isHQ = pin.name.includes("HQ");
          const showLabel = isInActiveRegion || isSelectedTown;

          return (
            <motion.g
              key={pin.name}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: 0.25 + i * 0.02, ease: [0.2, 0.8, 0.2, 1] }}
              animate={{
                opacity: isOutsideActive ? 0.25 : 1,
                scale: isSelectedTown ? 1.3 : isInActiveRegion ? 1.12 : 1,
              }}
              style={{ transformOrigin: `${pin.x}px ${pin.y}px`, cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectTown(cleanName);
              }}
              role="button"
              aria-label={`${cleanName} — click for town details`}
            >
              {/* invisible large hit target */}
              <circle cx={pin.x} cy={pin.y} r={14} fill="transparent" />

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
              {isSelectedTown && (
                <motion.circle
                  cx={pin.x}
                  cy={pin.y}
                  r={9}
                  fill="none"
                  stroke="var(--color-brass-400)"
                  strokeWidth="2"
                  animate={{ r: [9, 22, 9], opacity: [1, 0, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                />
              )}
              {showLabel && (
                <text
                  x={pin.x + (pin.emphasized ? 9 : 7)}
                  y={pin.y + 3.5}
                  fontSize={isSelectedTown ? "11" : "9.5"}
                  fill={isSelectedTown ? "var(--color-brass-300)" : "var(--color-navy-50)"}
                  fontWeight={isSelectedTown ? "700" : "600"}
                  style={{ paintOrder: "stroke", stroke: "var(--color-navy-900)", strokeWidth: 3 }}
                >
                  {cleanName}
                </text>
              )}
            </motion.g>
          );
        })}
      </svg>
      <div className="mt-3 text-xs text-[var(--color-navy-300)] text-center">
        Click a region or a town pin to drill in.
      </div>
    </div>
  );
}

function RegionOverlay({
  region,
  selected,
  hovered,
  anySelected,
  onEnter,
  onLeave,
  onClick,
}: {
  region: ServiceRegion;
  selected: boolean;
  hovered: boolean;
  anySelected: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const { cx, cy, rx, ry } = region.shape;
  // Selected always wins. Hover previews softly only when nothing is locked.
  const dim = anySelected && !selected;
  const haloOpacity = selected ? 1 : hovered && !anySelected ? 0.55 : dim ? 0.05 : 0.35;
  const ringOpacity = selected ? 0.85 : hovered && !anySelected ? 0.45 : 0;
  const scale = selected ? 1.05 : hovered && !anySelected ? 1.025 : 1;

  return (
    <g
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
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
        animate={{ opacity: haloOpacity, scale }}
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
        animate={{ opacity: ringOpacity, scale }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />
      {/* "selected" pulse beat */}
      {selected && (
        <motion.ellipse
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          fill="transparent"
          stroke={region.isHQ ? "var(--color-emergency-400)" : "var(--color-electric-300)"}
          strokeWidth={1}
          animate={{ scale: [1.05, 1.18, 1.05], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
      )}
      {/* invisible bigger hit area so hovering near the cluster works */}
      <ellipse cx={cx} cy={cy} rx={rx + 8} ry={ry + 8} fill="transparent" pointerEvents="all" />
    </g>
  );
}

// -- Panels -----------------------------------------------------------

function PanelShell({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl bg-white ring-1 ring-[var(--color-navy-100)] shadow-soft p-6 sm:p-8"
    >
      {children}
    </motion.div>
  );
}

function BackButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] font-semibold text-[var(--color-muted)] hover:text-[var(--color-electric-600)] transition-colors"
    >
      <ArrowLeft className="w-3.5 h-3.5" />
      {children}
    </button>
  );
}

function OverviewPanel({
  totalCities,
  totalJobs,
  onSelectRegion,
}: {
  totalCities: number;
  totalJobs: number;
  onSelectRegion: (id: RegionId) => void;
}) {
  return (
    <PanelShell>
      <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-electric-600)] font-semibold">
        Service area
      </div>
      <h3 className="mt-2 font-display text-3xl text-[var(--color-navy-900)] leading-tight">
        Five regions, one truck fleet.
      </h3>
      <p className="mt-3 text-[var(--color-muted)] leading-relaxed">
        Click any region or town pin on the map to drill in — recent jobs, top services, and a
        local quote.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <Stat value={totalCities} label="Towns served" />
        <Stat value={`${totalJobs}+`} label="Jobs logged" />
        <Stat value="24/7" label="Emergency line" />
      </div>

      <div className="mt-6 space-y-1">
        {regions.map((r) => (
          <button
            key={r.id}
            onClick={() => onSelectRegion(r.id)}
            className="group w-full flex items-center justify-between text-sm py-2.5 px-2 -mx-2 rounded-lg hover:bg-[var(--color-cream-100)] transition-colors text-left"
          >
            <div className="flex items-center gap-2.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  r.isHQ ? "bg-[var(--color-emergency-500)]" : "bg-[var(--color-electric-500)]"
                }`}
              />
              <span className="font-medium text-[var(--color-navy-900)]">{r.label}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
              <span>
                {r.towns.length} towns · {r.jobCount} jobs
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--color-electric-600)]" />
            </div>
          </button>
        ))}
      </div>
    </PanelShell>
  );
}

function RegionPanel({
  region,
  onClear,
  onSelectTown,
}: {
  region: ServiceRegion;
  onClear: () => void;
  onSelectTown: (name: string) => void;
}) {
  return (
    <PanelShell>
      <BackButton onClick={onClear}>All regions</BackButton>

      <div className="mt-4 flex items-center gap-2">
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

      <div className="mt-6">
        <div className="text-xs uppercase tracking-wider text-[var(--color-navy-500)] font-semibold mb-2">
          Towns in this region
        </div>
        <div className="flex flex-wrap gap-1.5">
          {region.towns.map((t) => (
            <button
              key={t}
              onClick={() => onSelectTown(t)}
              className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-navy-50)] text-[var(--color-navy-700)] ring-1 ring-[var(--color-navy-100)] hover:ring-[var(--color-electric-500)] hover:text-[var(--color-electric-700)] transition-colors"
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </PanelShell>
  );
}

function TownPanel({
  townName,
  onSelectRegion,
  onClear,
}: {
  townName: string;
  onSelectRegion: (id: RegionId) => void;
  onClear: () => void;
}) {
  const regionId = townToRegion(townName);
  const region = regionId ? regions.find((r) => r.id === regionId) : undefined;
  const city = pinNameToCity(townName);
  const distance = city ? Math.round(milesFromHq(city)) : null;
  const isHq = townName === "Blackwood";

  return (
    <PanelShell>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 flex-wrap text-xs text-[var(--color-muted)]">
        <button
          onClick={onClear}
          className="uppercase tracking-[0.18em] font-semibold hover:text-[var(--color-electric-600)] transition-colors"
        >
          All regions
        </button>
        {region && (
          <>
            <ChevronRight className="w-3 h-3 opacity-50" />
            <button
              onClick={() => onSelectRegion(region.id)}
              className="hover:text-[var(--color-electric-600)] transition-colors"
            >
              {region.label}
            </button>
          </>
        )}
        <ChevronRight className="w-3 h-3 opacity-50" />
        <span className="text-[var(--color-navy-700)] font-semibold">{townName}</span>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <MapPin
          className={`w-4 h-4 ${
            isHq ? "text-[var(--color-emergency-500)]" : "text-[var(--color-electric-600)]"
          }`}
        />
        <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-electric-600)] font-semibold">
          {isHq ? "Our HQ" : `Town · ${city?.state ?? ""}`}
        </div>
      </div>
      <h3 className="mt-2 font-display text-3xl text-[var(--color-navy-900)] leading-tight">
        {townName}
        {isHq && (
          <span className="text-base font-sans font-semibold text-[var(--color-emergency-500)] ml-2">
            HQ
          </span>
        )}
      </h3>

      <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[var(--color-electric-50,#eaf2ff)] px-3 py-1.5 ring-1 ring-[var(--color-electric-200,#cfe0ff)]">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-electric-500)] animate-pulse" />
        <span className="text-xs font-semibold text-[var(--color-electric-700)] uppercase tracking-wider">
          Yes — we cover {townName}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {distance !== null && (
          <Stat value={isHq ? "HQ" : `~${distance}mi`} label={isHq ? "Our home base" : "From our HQ"} />
        )}
        {region && <Stat value={region.jobCount} label="Jobs in region" />}
      </div>

      {region && (
        <>
          <div className="mt-6">
            <div className="text-xs uppercase tracking-wider text-[var(--color-navy-500)] font-semibold mb-2">
              Recent work in the {region.label} area
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {region.jobs.map((job) => (
                <JobCard key={job.title} title={job.title} icon={job.icon} hq={!!region.isHQ} />
              ))}
            </div>
          </div>

          <figure className="mt-6 rounded-2xl bg-[var(--color-cream-100)] p-4 border-l-2 border-[var(--color-electric-500)]">
            <blockquote className="text-sm italic text-[var(--color-ink-soft)] leading-relaxed">
              &ldquo;{region.quote.text}&rdquo;
            </blockquote>
            <figcaption className="mt-2 text-xs text-[var(--color-muted)]">
              — {region.quote.author}
              {region.quote.town === townName ? "" : `, ${region.quote.town}`}
            </figcaption>
          </figure>
        </>
      )}

      <a
        href={LYONS.phoneTel ? `tel:${LYONS.phoneTel}` : `tel:${LYONS.phone.replace(/\D/g, "")}`}
        className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-navy-900)] text-white py-3.5 px-4 font-semibold hover:bg-[var(--color-emergency-700)] transition-colors"
      >
        <Phone className="w-4 h-4" />
        Call {LYONS.phone}
      </a>
    </PanelShell>
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
