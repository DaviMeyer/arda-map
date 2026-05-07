"use client";
import { useState, useCallback } from "react";
import type { Waypoint } from "@/types";
import { initialWaypoints } from "@/lib/constants";
import {
  loadWaypoints,
  saveWaypoints,
  clearSavedWaypoints,
} from "@/lib/storage";

export function useWaypoints() {
  const [waypoints, setWaypoints] = useState<Waypoint[]>(() => {
    if (typeof window === "undefined") return initialWaypoints;
    return loadWaypoints() || initialWaypoints;
  });

  const persist = useCallback((wps: Waypoint[]) => {
    setWaypoints(wps);
    saveWaypoints(wps);
  }, []);

  const addWaypoint = useCallback(
    (lat: number, lng: number, name?: string) => {
      persist([
        ...waypoints,
        { lat, lng, name: name || `Waypoint ${waypoints.length + 1}` },
      ]);
    },
    [waypoints, persist]
  );

  const removeWaypoint = useCallback(
    (index: number) => {
      persist(waypoints.filter((_, i) => i !== index));
    },
    [waypoints, persist]
  );

  const moveWaypoint = useCallback(
    (from: number, to: number) => {
      const copy = [...waypoints];
      const [item] = copy.splice(from, 1);
      copy.splice(to, 0, item);
      persist(copy);
    },
    [waypoints, persist]
  );

  const updateWaypoint = useCallback(
    (index: number, lat: number, lng: number) => {
      const copy = [...waypoints];
      copy[index] = { ...copy[index], lat, lng };
      persist(copy);
    },
    [waypoints, persist]
  );

  const resetToDefaults = useCallback(() => {
    clearSavedWaypoints();
    setWaypoints(initialWaypoints);
  }, []);

  const clearAll = useCallback(() => {
    clearSavedWaypoints();
    setWaypoints([]);
  }, []);

  return {
    waypoints,
    addWaypoint,
    removeWaypoint,
    moveWaypoint,
    updateWaypoint,
    resetToDefaults,
    clearAll,
  };
}
