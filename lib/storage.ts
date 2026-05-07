import type { Waypoint, Milestone } from "@/types";
import { WP_VERSION } from "./constants";

export function loadWaypoints(): Waypoint[] | null {
  const savedVersion = localStorage.getItem("arda_wp_version");
  if (savedVersion !== WP_VERSION) {
    localStorage.removeItem("arda_waypoints");
    localStorage.setItem("arda_wp_version", WP_VERSION);
    return null;
  }
  const saved = localStorage.getItem("arda_waypoints");
  return saved ? JSON.parse(saved) : null;
}

export function saveWaypoints(waypoints: Waypoint[]): void {
  localStorage.setItem("arda_waypoints", JSON.stringify(waypoints));
  localStorage.setItem("arda_wp_version", WP_VERSION);
}

export function clearSavedWaypoints(): void {
  localStorage.removeItem("arda_waypoints");
}

export function loadMilestones(): Milestone[] {
  return JSON.parse(localStorage.getItem("arda_milestones") || "[]");
}

export function saveMilestones(milestones: Milestone[]): void {
  localStorage.setItem("arda_milestones", JSON.stringify(milestones));
}

export function loadKmFromHash(): number | null {
  const hash = window.location.hash;
  const match = hash.match(/km=([\d.]+)/);
  if (match) {
    const val = parseFloat(match[1]);
    if (!isNaN(val) && val >= 0 && val <= 700) return val;
  }
  return null;
}

export function saveKmToHash(km: number): void {
  window.location.hash = `km=${km.toFixed(1)}`;
}
