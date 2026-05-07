import type { Waypoint } from "@/types";
import { haversine } from "./geo";

const DETOUR_THRESHOLD = 1.8;

interface RouteResult {
  coords: [number, number][];
  totalDist: number;
  totalDur: number;
}

async function tryRoute(
  w1: Waypoint,
  w2: Waypoint,
  profile: string
): Promise<{
  distance: number;
  duration: number;
  coords: [number, number][];
} | null> {
  try {
    const c = `${w1.lng},${w1.lat};${w2.lng},${w2.lat}`;
    const url = `https://router.project-osrm.org/route/v1/${profile}/${c}?overview=full&geometries=geojson&steps=false`;
    const resp = await fetch(url);
    const data = await resp.json();
    if (data.code === "Ok") {
      const route = data.routes[0];
      return {
        distance: route.distance,
        duration: route.duration,
        coords: route.geometry.coordinates.map(
          (c: [number, number]) => [c[1], c[0]] as [number, number]
        ),
      };
    }
  } catch {
    /* ignore */
  }
  return null;
}

export async function calculateRoute(
  waypoints: Waypoint[],
  routingProfile: string = "driving"
): Promise<RouteResult> {
  const allCoords: [number, number][] = [];
  let totalDist = 0;
  let totalDur = 0;

  const fallbackProfile =
    routingProfile === "foot" ? "driving" : "foot";

  for (let i = 0; i < waypoints.length - 1; i++) {
    const w1 = waypoints[i];
    const w2 = waypoints[i + 1];
    const p1: [number, number] = [w1.lat, w1.lng];
    const p2: [number, number] = [w2.lat, w2.lng];
    const straightDist = haversine(p1, p2);

    let bestRoute: Awaited<ReturnType<typeof tryRoute>> = null;

    for (const profile of [routingProfile, fallbackProfile]) {
      const result = await tryRoute(w1, w2, profile);
      if (result && result.distance / (straightDist || 1) < DETOUR_THRESHOLD) {
        bestRoute = result;
        break;
      }
      if (
        result &&
        (!bestRoute || result.distance < bestRoute.distance)
      ) {
        bestRoute = result;
      }
    }

    if (
      bestRoute &&
      bestRoute.distance / (straightDist || 1) < DETOUR_THRESHOLD
    ) {
      totalDist += bestRoute.distance;
      totalDur += bestRoute.duration;
      allCoords.push(
        ...(allCoords.length > 0
          ? bestRoute.coords.slice(1)
          : bestRoute.coords)
      );
    } else {
      if (allCoords.length === 0) allCoords.push(p1);
      allCoords.push(p2);
      totalDist += straightDist;
    }
  }

  return { coords: allCoords, totalDist, totalDur };
}
