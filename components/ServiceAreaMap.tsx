import "server-only";
import { serviceAreaMapData } from "@/lib/map/serviceAreaShapes";
import { ServiceAreaMapCanvas } from "./ServiceAreaMapCanvas";

/**
 * Real-geography service-area map. Pulls projected SVG paths and pin
 * coordinates from the server-side projection helper, then hands them to a
 * lightweight client component for animation. None of the topojson / d3-geo
 * code reaches the browser bundle.
 */
export function ServiceAreaMap({
  className,
  showLabels = true,
}: {
  className?: string;
  showLabels?: boolean;
}) {
  return (
    <ServiceAreaMapCanvas
      className={className}
      showLabels={showLabels}
      data={serviceAreaMapData}
    />
  );
}
