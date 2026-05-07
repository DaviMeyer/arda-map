"use client";
import type { RaceClock } from "@/types";
import { getPaceStats } from "@/lib/race";

interface Props {
  actualKm: number | null;
  clock: RaceClock;
}

export function PaceStats({ actualKm, clock }: Props) {
  const stats = getPaceStats(actualKm, clock);
  const items = [
    { label: "Avg needed", value: stats.paceNeeded },
    { label: "Remaining pace", value: stats.paceRemaining, color: stats.paceRemainingColor },
    { label: "Est. calories", value: stats.caloriesBurned },
    { label: "Current day", value: stats.currentDay },
  ];

  return (
    <div style={{ padding: "10px 20px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 2, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 8 }}>
        Pace Stats
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        {items.map((item) => (
          <div key={item.label} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 8px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: 1, color: "var(--text-muted)", textTransform: "uppercase" }}>
              {item.label}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 500, marginTop: 2, color: item.color || "var(--text-primary)" }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
