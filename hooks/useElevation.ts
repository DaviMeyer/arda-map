"use client";
import { useState, useEffect } from "react";
import type { ElevationPoint } from "@/types";
import { fetchElevationData } from "@/lib/elevation";

export function useElevation(
  routeCoords: [number, number][]
): { data: ElevationPoint[] | null; loading: boolean } {
  const [data, setData] = useState<ElevationPoint[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (routeCoords.length < 2) return;

    let cancelled = false;
    setLoading(true);

    fetchElevationData(routeCoords).then((result) => {
      if (!cancelled) {
        setData(result);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [routeCoords]);

  return { data, loading };
}
