"use client";
import { useState, useCallback } from "react";
import type { Milestone } from "@/types";
import { loadMilestones, saveMilestones } from "@/lib/storage";

export function useMilestones() {
  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    if (typeof window === "undefined") return [];
    return loadMilestones();
  });

  const addMilestone = useCallback(
    (km: number) => {
      const updated = [
        ...milestones,
        { km, time: new Date().toISOString() },
      ].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
      setMilestones(updated);
      saveMilestones(updated);
    },
    [milestones]
  );

  const removeMilestone = useCallback(
    (index: number) => {
      const updated = milestones.filter((_, i) => i !== index);
      setMilestones(updated);
      saveMilestones(updated);
    },
    [milestones]
  );

  const clearMilestones = useCallback(() => {
    setMilestones([]);
    saveMilestones([]);
  }, []);

  return { milestones, addMilestone, removeMilestone, clearMilestones };
}
