import { feature } from "topojson-client";
import { geoMercator, geoPath } from "d3-geo";
import type { Feature, FeatureCollection, LineString, MultiPoint } from "geojson";
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
 * The projection is fit to a south-NJ-centric bounding box (with a slim
 * Philly/Wilmington edge) so the actual service footprint fills the canvas
 * instead of getting squeezed into a corner of all-of-NJ-and-PA.
 *
 * The us-atlas JSON files (~700KB combined) and the d3-geo projection code
 * stay server-side. Only the projected SVG path strings + pin coordinates ship.
 */

const NJ_FIPS = "34";
const PA_FIPS = "42";
const DE_FIPS = "10";

// South Jersey + the two PA counties + New Castle DE — the counties touching
// our service footprint. Drawn for visual richness so the map reads as a real
// regional cartogram, not just a state silhouette.
const COUNTIES: { fips: string; name: string }[] = [
  { fips: "34001", name: "Atlantic" },
  { fips: "34005", name: "Burlington" },
  { fips: "34007", name: "Camden" },
  { fips: "34009", name: "Cape May" },
  { fips: "34011", name: "Cumberland" },
  { fips: "34015", name: "Gloucester" },
  { fips: "34033", name: "Salem" },
  { fips: "42017", name: "Bucks" },
  { fips: "42045", name: "Delaware" },
  { fips: "42091", name: "Montgomery" },
  { fips: "42101", name: "Philadelphia" },
  { fips: "10003", name: "New Castle" },
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
const counties = COUNTIES.map(({ fips, name }) => ({
  id: fips,
  name,
  feature: findFeature(countyFc, fips),
})).filter(
  (c): c is { id: string; name: string; feature: Feature } => Boolean(c.feature),
);

// viewBox sized to match the Mercator-projected aspect of the bounding box at
// this latitude (lng span / (lat span × sec(lat)) ≈ 0.78), so the south-NJ
// content fills the canvas without big left/right letterboxing.
const VIEW_W = 720;
const VIEW_H = 900;
const PADDING = 24;

// South-NJ-centric bounding box, sized to keep all 31 service-area pins on
// canvas (Wilmington in the SW corner, Cape May at the south, Marlboro in the
// NE corner, Newtown PA up north). Chosen with ~0.1° of breathing room on
// each side so no pin sits flush against the edge.
const BBOX_WEST = -75.65;
const BBOX_EAST = -74.1;
const BBOX_SOUTH = 38.85;
const BBOX_NORTH = 40.4;

// Use MultiPoint of the two opposite corners (not Polygon) — d3-geo's spherical
// `geoBounds` on a small CCW (lng,lat) polygon flips inside/outside and reports
// the entire globe, which makes fitExtent compute a near-default zoom and
// crams every projected pin into a few pixels. MultiPoint has no winding
// ambiguity and gives the bounding box we actually want.
const bboxFeature: Feature<MultiPoint> = {
  type: "Feature",
  properties: {},
  geometry: {
    type: "MultiPoint",
    coordinates: [
      [BBOX_WEST, BBOX_SOUTH],
      [BBOX_EAST, BBOX_NORTH],
    ],
  },
};

const projection = geoMercator().fitExtent(
  [
    [PADDING, PADDING],
    [VIEW_W - PADDING, VIEW_H - PADDING],
  ],
  bboxFeature,
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
const REGION_PAD = 28;
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
  const rx = Math.max(36, (xmax - xmin) / 2 + REGION_PAD);
  const ry = Math.max(36, (ymax - ymin) / 2 + REGION_PAD);
  return { id: r.id, cx, cy, rx, ry };
});

// Stylized highway paths — hand-picked waypoints along three of the major
// routes that run through the service area. Not GPS-accurate; the goal is to
// give the map geographic context so people recognize it as their backyard.
type LngLat = [number, number];
function lineFeature(coords: LngLat[]): Feature<LineString> {
  return {
    type: "Feature",
    properties: {},
    geometry: { type: "LineString", coordinates: coords },
  };
}

const HIGHWAY_DEFS: { name: string; coords: LngLat[]; labelLng: number; labelLat: number }[] = [
  {
    name: "I-295",
    coords: [
      [-75.55, 39.74], // Wilmington
      [-75.49, 39.7], // crossing into NJ
      [-75.42, 39.72], // Carneys Point area
      [-75.24, 39.78], // Mickleton
      [-75.1, 39.87], // Bellmawr
      [-74.95, 39.93], // Mt. Laurel area
      [-74.86, 40.07], // Burlington
      [-74.78, 40.18], // Bordentown
    ],
    labelLng: -75.0,
    labelLat: 40.0,
  },
  {
    name: "NJ Tpke",
    coords: [
      [-75.45, 39.65], // Salem County
      [-75.2, 39.78], // Mullica Hill area
      [-75.0, 39.85], // east of Bellmawr
      [-74.92, 39.95], // Cherry Hill / Mt. Laurel split
      [-74.78, 40.15], // Bordentown
      [-74.65, 40.3], // northbound
    ],
    labelLng: -74.85,
    labelLat: 40.05,
  },
  {
    name: "AC Expwy",
    coords: [
      [-75.1, 39.87], // Bellmawr split
      [-74.97, 39.74], // Sicklerville
      [-74.88, 39.66], // Williamstown / Hammonton
      [-74.7, 39.56], // Hammonton
      [-74.55, 39.49], // Mays Landing
      [-74.4, 39.45], // toward Atlantic City
    ],
    labelLng: -74.78,
    labelLat: 39.62,
  },
];

const highways = HIGHWAY_DEFS.map((h) => ({
  name: h.name,
  d: pathGen(lineFeature(h.coords)) ?? "",
  labelAt: project(h.labelLat, h.labelLng),
}));

export type ProjectedCity = (typeof projectedCities)[number];
export type RegionCluster = { id: RegionId; cx: number; cy: number; rx: number; ry: number };
export type ProjectedCounty = { id: string; name: string; d: string; cx: number; cy: number };
export type ProjectedHighway = { name: string; d: string; labelAt: { x: number; y: number } };

export const serviceAreaMapData = {
  viewBox: { width: VIEW_W, height: VIEW_H },
  paths: {
    nj: NJ ? (pathGen(NJ) ?? "") : "",
    pa: PA ? (pathGen(PA) ?? "") : "",
    de: DE ? (pathGen(DE) ?? "") : "",
    counties: counties.map((c): ProjectedCounty => {
      const [cx, cy] = pathGen.centroid(c.feature);
      return {
        id: c.id,
        name: c.name,
        d: pathGen(c.feature) ?? "",
        cx,
        cy,
      };
    }),
  },
  cities: projectedCities,
  regionClusters,
  highways,
};
