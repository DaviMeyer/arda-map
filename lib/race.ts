import {
  RACE_START,
  RACE_END,
  TOTAL_DISTANCE_KM,
} from "./constants";
import type { RaceClock, PaceStats } from "@/types";

export function getRaceClock(): RaceClock {
  const now = new Date();
  const elapsed = now.getTime() - RACE_START.getTime();
  const remaining = Math.max(RACE_END.getTime() - now.getTime(), 0);

  let elapsedText: string;
  let remainingText: string;

  if (elapsed < 0) {
    elapsedText = "Not started";
    const h = Math.floor(-elapsed / 3600000);
    const m = Math.floor((-elapsed % 3600000) / 60000);
    remainingText = `Starts in ${h}h ${m}m`;
  } else {
    const eH = Math.floor(elapsed / 3600000);
    const eM = Math.floor((elapsed % 3600000) / 60000);
    elapsedText = `${eH}h ${String(eM).padStart(2, "0")}m`;

    if (remaining > 0) {
      const rH = Math.floor(remaining / 3600000);
      const rM = Math.floor((remaining % 3600000) / 60000);
      remainingText = `${rH}h ${String(rM).padStart(2, "0")}m`;
    } else {
      remainingText = "FINISHED";
    }
  }

  const totalMs = RACE_END.getTime() - RACE_START.getTime();
  const fraction = Math.min(Math.max(elapsed / totalMs, 0), 1);
  const idealKm = fraction * TOTAL_DISTANCE_KM;

  return {
    elapsedText,
    remainingText,
    idealKm,
    elapsedMs: elapsed,
    remainingMs: remaining,
  };
}

export function getPaceStats(
  actualKm: number | null,
  clock: RaceClock
): PaceStats {
  const elapsedH = clock.elapsedMs / 3600000;
  const remainingH = clock.remainingMs / 3600000;

  const currentDay = Math.min(Math.floor(elapsedH / 24) + 1, 4);
  const calEstimate = Math.max(0, Math.round(elapsedH * 625));

  const isDay = clock.elapsedMs >= 0;
  const dayText = !isDay
    ? "Pre-race"
    : `Day ${currentDay}/4`;

  let paceRemaining = "—";
  let paceRemainingColor = "var(--text-primary)";

  if (actualKm !== null && remainingH > 0) {
    const remainingKm = Math.max(TOTAL_DISTANCE_KM - actualKm, 0);
    const neededPace = remainingKm / remainingH;
    paceRemaining = `${neededPace.toFixed(2)} km/h`;
    paceRemainingColor =
      neededPace > 8
        ? "var(--danger)"
        : neededPace > 6.5
          ? "var(--warning)"
          : "var(--accent)";
  } else if (clock.remainingMs <= 0) {
    paceRemaining = "Finished";
  }

  return {
    paceNeeded: "6.25 km/h",
    paceRemaining,
    paceRemainingColor,
    caloriesBurned: !isDay
      ? "—"
      : `~${(calEstimate / 1000).toFixed(0)}k kcal`,
    currentDay: dayText,
  };
}

export function getStatusBadge(
  actualKm: number | null,
  idealKm: number
): { className: string; text: string } {
  if (actualKm === null) {
    return { className: "not-started", text: "Waiting for km input…" };
  }
  const diff = actualKm - idealKm;
  if (Math.abs(diff) < 5) {
    return {
      className: "on-track",
      text: `On track (${diff >= 0 ? "+" : ""}${diff.toFixed(1)} km)`,
    };
  }
  if (diff > 0) {
    return {
      className: "ahead",
      text: `Ahead of schedule +${diff.toFixed(1)} km`,
    };
  }
  return {
    className: "behind",
    text: `Behind schedule ${diff.toFixed(1)} km`,
  };
}
