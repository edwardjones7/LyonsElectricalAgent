import { feature } from "topojson-client";
import { geoMercator, geoPath } from "d3-geo";
import type { Feature, FeatureCollection } from "geojson";
import type { Topology, GeometryCollection } from "topojson-specification";
import statesTopo from "us-atlas/states-10m.json";
import countiesTopo from "us-atlas/counties-10m.json";
import { cities, regions, type RegionId } from "@/content/serviceArea";

/**
 * Projects real US Census state + county boundaries (us-atlas) into a fixed
 * SVG viewBox, plus projects every Lyons service-area city pin onto the same
 * coordinate system. Imported by the server `ServiceAreaMap` component; the
 * resulting object is plain serializable data and is safe to pass into a
 * client component as props.
 *
 * The us-atlas JSON files (~700KB combined) and the d3 projection code stay
 * server-side. Only the projected SVG path strings + pin coordinates ship.
 */

const NJ_FIPS = "34";
const PA_FIPS = "42";
const DE_FIPS = "10";

// South Jersey + the two PA counties + New Castle DE — the counties touching
// our service footprint. Drawn for visual richness so the map reads as a real
// regional cartogram, not just a state silhouette.
const COUNTY_FIPS = [
  "34001", // Atlantic
  "34005", // Burlington
  "34007", // Camden
  "34009", // Cape May
  "34011", // Cumberland
  "34015", // Gloucester
  "34033", // Salem
  "42017", // Bucks PA
  "42045", // Delaware PA
  "42091", // Montgomery PA (covers Haverford-area)
  "42101", // Philadelphia PA
  "10003", // New Castle DE
];

const statesData = statesTopo as unknown as Topology;
const countiesData = countiesTopo as unknown as Topology;

const stateFc = feature(
  statesData,
  statesData.objects.states as GeometryCollection,
) as FeatureCollection;
const countyFc = feature(
  countiesData,
  countiesData.objects.counties as GeometryCollection,
) as FeatureCollection;

function findFeature(fc: FeatureCollection, id: string): Feature | undefined {
  return fc.features.find((f) => String(f.id) === id);
}

const NJ = findFeature(stateFc, NJ_FIPS);
const PA = findFeature(stateFc, PA_FIPS);
const DE = findFeature(stateFc, DE_FIPS);
const counties = COUNTY_FIPS.map((id) => ({
  id,
  feature: findFeature(countyFc, id),
})).filter((c): c is { id: string; feature: Feature } => Boolean(c.feature));

const VIEW_W = 1000;
const VIEW_H = 700;
const PADDING = 28;

// Fit the projection to the bounding box of the three states so the entire
// region fills the viewBox with a comfortable margin.
const fitBox: FeatureCollection = {
  type: "FeatureCollection",
  features: [NJ, PA, DE].filter((f): f is Feature => Boolean(f)),
};

const projection = geoMercator().fitExtent(
  [
    [PADDING, PADDING],
    [VIEW_W - PADDING, VIEW_H - PADDING],
  ],
  fitBox,
);
const pathGen = geoPath(projection);

function project(lat: number, lng: number): { x: number; y: number } {
  const result = projection([lng, lat]);
  if (!result) return { x: 0, y: 0 };
  return { x: result[0], y: result[1] };
}

const projectedCities = cities.map((c) => ({
  ...c,
  ...project(c.lat, c.lng),
}));

// Compute a bounding ellipse for each region from its member cities, padded
// out so the cluster reads as a soft regional shading on the map.
const REGION_PAD = 24;
const regionClusters = regions.map((r) => {
  const cluster = projectedCities.filter((c) => r.towns.includes(c.name));
  if (cluster.length === 0) {
    return { id: r.id, cx: 0, cy: 0, rx: 0, ry: 0 };
  }
  const xs = cluster.map((c) => c.x);
  const ys = cluster.map((c) => c.y);
  const xmin = Math.min(...xs);
  const xmax = Math.max(...xs);
  const ymin = Math.min(...ys);
  const ymax = Math.max(...ys);
  const cx = (xmin + xmax) / 2;
  const cy = (ymin + ymax) / 2;
  const rx = Math.max(28, (xmax - xmin) / 2 + REGION_PAD);
  const ry = Math.max(28, (ymax - ymin) / 2 + REGION_PAD);
  return { id: r.id, cx, cy, rx, ry };
});

export type ProjectedCity = (typeof projectedCities)[number];
export type RegionCluster = { id: RegionId; cx: number; cy: number; rx: number; ry: number };

export const serviceAreaMapData = {
  viewBox: { width: VIEW_W, height: VIEW_H },
  paths: {
    nj: NJ ? (pathGen(NJ) ?? "") : "",
    pa: PA ? (pathGen(PA) ?? "") : "",
    de: DE ? (pathGen(DE) ?? "") : "",
    counties: counties.map((c) => ({ id: c.id, d: pathGen(c.feature) ?? "" })),
  },
  cities: projectedCities,
  regionClusters,
};
