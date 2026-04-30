"use client";

import { motion } from "framer-motion";
import { citiesByState } from "@/content/serviceArea";

/**
 * Stylized abstract map of the Lyons service area — South Jersey + Eastern PA + Wilmington DE.
 *
 * Not a literal cartographic projection; it's a brand illustration that gives the
 * footprint a face. City "pins" are placed by hand-tuned percentages on the viewBox
 * to roughly land where each town sits relative to the others.
 */

type Pin = { name: string; x: number; y: number; emphasized?: boolean };

// Coords are tuned for the 1000x700 viewBox below. South Jersey forms an L-shape
// from Camden in the northwest down to Cape May in the south.
const PINS: Pin[] = [
  // PA cities (top left)
  { name: "Newtown", x: 165, y: 95 },
  { name: "Fallsington", x: 200, y: 130 },
  { name: "Haverford", x: 95, y: 110 },
  // DE
  { name: "Wilmington", x: 70, y: 295 },
  // NJ — northwest cluster (Camden county area)
  { name: "Camden", x: 280, y: 195, emphasized: true },
  { name: "Cherry Hill", x: 320, y: 220, emphasized: true },
  { name: "Voorhees", x: 350, y: 260 },
  { name: "Bellmawr", x: 295, y: 230 },
  { name: "Mt. Laurel", x: 380, y: 235, emphasized: true },
  { name: "Marlton", x: 400, y: 260, emphasized: true },
  { name: "Berlin", x: 360, y: 300 },
  // Burlington county
  { name: "Burlington", x: 410, y: 175 },
  { name: "Willingboro", x: 415, y: 200 },
  { name: "Beverly", x: 395, y: 165 },
  { name: "Riverside", x: 380, y: 185 },
  { name: "Mt. Holly", x: 445, y: 220 },
  { name: "Medford Lakes", x: 460, y: 270 },
  // Blackwood (HQ) — extra emphasis
  { name: "Blackwood (HQ)", x: 305, y: 250, emphasized: true },
  // Camden / Gloucester county
  { name: "Sicklerville", x: 320, y: 285 },
  { name: "Williamstown", x: 340, y: 320 },
  { name: "Glassboro", x: 285, y: 320 },
  { name: "Wenonah", x: 250, y: 280 },
  { name: "Swedesboro", x: 215, y: 305 },
  { name: "Mullica Hill", x: 245, y: 325 },
  { name: "Carneys Point", x: 165, y: 330 },
  { name: "Salem", x: 175, y: 370 },
  // Down south
  { name: "Vineland", x: 320, y: 415 },
  { name: "Millville", x: 295, y: 460 },
  { name: "Elmer", x: 245, y: 405 },
  { name: "Cape May", x: 460, y: 595 },
  { name: "Marlboro", x: 460, y: 110 },
];

export function ServiceAreaMap({
  className,
  showLabels = false,
}: {
  className?: string;
  showLabels?: boolean;
}) {
  const totalCities =
    citiesByState.NJ.length + citiesByState.PA.length + citiesByState.DE.length;

  return (
    <div className={className}>
      <svg
        viewBox="0 0 1000 700"
        className="w-full h-full"
        role="img"
        aria-label={`Service area map covering ${totalCities} towns across South Jersey, Eastern Pennsylvania, and Wilmington, Delaware`}
      >
        <defs>
          <radialGradient id="pinGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-electric-300)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--color-electric-500)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hqGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-emergency-500)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--color-emergency-500)" stopOpacity="0" />
          </radialGradient>
          <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.8" fill="var(--color-navy-300)" opacity="0.4" />
          </pattern>
        </defs>

        {/* Background dot grid for atmospheric texture */}
        <rect width="1000" height="700" fill="url(#dots)" />

        {/* Stylized region — abstract South Jersey L-shape with a touch of PA + DE */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.4 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.6, ease: [0.4, 0.0, 0.2, 1] }}
          d="M 60,100 Q 90,140 110,180 Q 130,210 150,250 Q 110,260 90,310 Q 80,360 110,400 L 100,440 Q 140,460 170,440 L 180,470 Q 220,490 230,470 L 250,490 Q 270,540 320,560 Q 370,580 430,580 Q 470,570 480,540 L 490,500 Q 470,460 450,400 L 480,360 Q 510,310 510,260 L 490,220 Q 460,180 440,160 Q 420,140 380,140 L 320,150 Q 280,140 240,120 Q 200,100 160,90 Q 100,80 60,100 Z"
          fill="var(--color-navy-700)"
          stroke="var(--color-electric-500)"
          strokeWidth="1.5"
          strokeOpacity="0.5"
          fillOpacity="0.18"
        />

        {/* State annotations */}
        <text x="135" y="60" fontSize="13" fill="var(--color-navy-400)" letterSpacing="6" fontWeight="600">
          PA
        </text>
        <text x="35" y="265" fontSize="13" fill="var(--color-navy-400)" letterSpacing="6" fontWeight="600">
          DE
        </text>
        <text x="430" y="120" fontSize="13" fill="var(--color-navy-400)" letterSpacing="6" fontWeight="600">
          NJ
        </text>

        {/* Pins — animated reveal */}
        {PINS.map((pin, i) => (
          <motion.g
            key={pin.name}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.025, ease: [0.2, 0.8, 0.2, 1] }}
            style={{ transformOrigin: `${pin.x}px ${pin.y}px` }}
          >
            <circle
              cx={pin.x}
              cy={pin.y}
              r={pin.emphasized ? 14 : 9}
              fill={`url(#${pin.name.includes("HQ") ? "hqGlow" : "pinGlow"})`}
            />
            <circle
              cx={pin.x}
              cy={pin.y}
              r={pin.emphasized ? 4.5 : 3}
              fill={pin.name.includes("HQ") ? "var(--color-emergency-500)" : "var(--color-electric-400)"}
            />
            {pin.emphasized && (
              <motion.circle
                cx={pin.x}
                cy={pin.y}
                r={pin.emphasized ? 5 : 3.5}
                fill="none"
                stroke={pin.name.includes("HQ") ? "var(--color-emergency-500)" : "var(--color-electric-400)"}
                strokeWidth="1.2"
                animate={{ r: [5, 16, 5], opacity: [0.8, 0, 0.8] }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeOut",
                }}
              />
            )}
            {showLabels && pin.emphasized && (
              <text
                x={pin.x + 9}
                y={pin.y + 4}
                fontSize="10"
                fill="var(--color-navy-100)"
                fontWeight="600"
              >
                {pin.name.replace(" (HQ)", "")}
              </text>
            )}
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
