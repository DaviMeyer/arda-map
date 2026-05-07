"use client";
import { useState, useEffect } from "react";
import { getRaceClock } from "@/lib/race";
import type { RaceClock } from "@/types";

export function useRaceClock(intervalMs = 30000): RaceClock {
  const [clock, setClock] = useState<RaceClock>(getRaceClock);

  useEffect(() => {
    const id = setInterval(() => setClock(getRaceClock()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return clock;
}
