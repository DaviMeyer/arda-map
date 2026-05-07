"use client";
import { useState, useEffect, useRef } from "react";
import type { Waypoint, RouteData } from "@/types";
import { calculateRoute } from "@/lib/routing";

export function useRoute(
  waypoints: Waypoint[],
  profile: string = "driving"
): RouteData & { loading: boolean } {
  const [routeData, setRouteData] = useState<RouteData>({
    coords: [],
    totalMeters: 0,
  });
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (waypoints.length < 2) {
      setRouteData({ coords: [], totalMeters: 0 });
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const result = await calculateRoute(waypoints, profile);
        setRouteData({
          coords: result.coords,
          totalMeters: result.totalDist,
        });
      } catch (err) {
        console.error("Routing error:", err);
      }
      setLoading(false);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [waypoints, profile]);

  return { ...routeData, loading };
}
