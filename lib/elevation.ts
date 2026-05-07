import type { ElevationPoint } from "@/types";
import { TOTAL_DISTANCE_KM } from "./constants";
import { getPointAlongRoute } from "./geo";

const ELEV_SAMPLES = 100;
const CACHE_KEY = "arda_elevation_v2";

export async function fetchElevationData(
  routeCoords: [number, number][]
): Promise<ElevationPoint[]> {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      /* ignore */
    }
  }

  const points: { km: number; lat: number; lng: number }[] = [];
  for (let i = 0; i <= ELEV_SAMPLES; i++) {
    const km = (i / ELEV_SAMPLES) * TOTAL_DISTANCE_KM;
    const pt = getPointAlongRoute(km, routeCoords);
    if (pt) points.push({ km, lat: pt[0], lng: pt[1] });
  }

  if (points.length === 0) return generateFallback();

  try {
    const locations = points
      .map((p) => `${p.lat.toFixed(5)},${p.lng.toFixed(5)}`)
      .join("|");
    const url = `https://api.opentopodata.org/v1/srtm90m?locations=${locations}`;
    const resp = await fetch(url);
    const data = await resp.json();

    if (data.status === "OK" && data.results) {
      const result: ElevationPoint[] = data.results.map(
        (r: { elevation: number | null }, i: number) => ({
          km: points[i].km,
          elevation: r.elevation ?? 0,
        })
      );
      localStorage.setItem(CACHE_KEY, JSON.stringify(result));
      return result;
    }
  } catch {
    /* fall through */
  }

  return generateFallback();
}

function generateFallback(): ElevationPoint[] {
  const keyPoints = [
    { km: 0, elev: -86 },
    { km: 25, elev: -40 },
    { km: 40, elev: 0 },
    { km: 70, elev: 200 },
    { km: 100, elev: 1500 },
    { km: 130, elev: 600 },
    { km: 170, elev: 500 },
    { km: 200, elev: 700 },
    { km: 240, elev: 800 },
    { km: 280, elev: 750 },
    { km: 320, elev: 900 },
    { km: 360, elev: 1100 },
    { km: 380, elev: 1300 },
    { km: 400, elev: 500 },
    { km: 430, elev: 400 },
    { km: 460, elev: 350 },
    { km: 500, elev: 300 },
    { km: 530, elev: 250 },
    { km: 560, elev: 200 },
    { km: 580, elev: 100 },
    { km: 600, elev: 5 },
  ];
  const result: ElevationPoint[] = [];
  for (let i = 0; i <= ELEV_SAMPLES; i++) {
    const km = (i / ELEV_SAMPLES) * TOTAL_DISTANCE_KM;
    let lo = keyPoints[0];
    let hi = keyPoints[keyPoints.length - 1];
    for (let j = 0; j < keyPoints.length - 1; j++) {
      if (km >= keyPoints[j].km && km <= keyPoints[j + 1].km) {
        lo = keyPoints[j];
        hi = keyPoints[j + 1];
        break;
      }
    }
    const t = hi.km - lo.km > 0 ? (km - lo.km) / (hi.km - lo.km) : 0;
    result.push({ km, elevation: lo.elev + t * (hi.elev - lo.elev) });
  }
  return result;
}
