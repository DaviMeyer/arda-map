import { TOTAL_DISTANCE_KM } from "./constants";
import type { ElevationPoint } from "@/types";

export function haversine(
  a: [number, number],
  b: [number, number]
): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function getPointAlongRoute(
  km: number,
  routeCoords: [number, number][]
): [number, number] | null {
  if (routeCoords.length < 2) return null;

  const fraction = Math.min(Math.max(km / TOTAL_DISTANCE_KM, 0), 1);

  let cumDist = 0;
  const segDists: number[] = [];
  for (let i = 1; i < routeCoords.length; i++) {
    const d = haversine(routeCoords[i - 1], routeCoords[i]);
    segDists.push(d);
    cumDist += d;
  }

  const targetDist = fraction * cumDist;
  let acc = 0;
  for (let i = 0; i < segDists.length; i++) {
    if (acc + segDists[i] >= targetDist) {
      const segFraction = (targetDist - acc) / segDists[i];
      const lat =
        routeCoords[i][0] +
        segFraction * (routeCoords[i + 1][0] - routeCoords[i][0]);
      const lng =
        routeCoords[i][1] +
        segFraction * (routeCoords[i + 1][1] - routeCoords[i][1]);
      return [lat, lng];
    }
    acc += segDists[i];
  }
  return routeCoords[routeCoords.length - 1];
}

export function getElevAtKm(
  km: number,
  elevationData: ElevationPoint[]
): number {
  if (elevationData.length < 2) return 0;
  for (let i = 0; i < elevationData.length - 1; i++) {
    if (km >= elevationData[i].km && km <= elevationData[i + 1].km) {
      const t =
        (km - elevationData[i].km) /
        (elevationData[i + 1].km - elevationData[i].km || 1);
      return (
        elevationData[i].elevation +
        t * (elevationData[i + 1].elevation - elevationData[i].elevation)
      );
    }
  }
  return elevationData[elevationData.length - 1].elevation;
}
