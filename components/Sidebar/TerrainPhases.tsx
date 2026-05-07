"use client";
import { TERRAIN_PHASES, TOTAL_DISTANCE_KM } from "@/lib/constants";

interface Props {
  actualKm: number | null;
}

export function TerrainPhases({ actualKm }: Props) {
  const indicatorPct = actualKm !== null ? Math.min((actualKm / TOTAL_DISTANCE_KM) * 100, 100) : -1;

  return (
    <div style={{ padding: "10px 20px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 2, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 8 }}>
        Terrain Phases
      </div>
      <div style={{ display: "flex", borderRadius: 4, overflow: "hidden", height: 22, position: "relative" }}>
        {TERRAIN_PHASES.map((p) => (
          <div
            key={p.label}
            style={{
              flex: p.end - p.start,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-mono)",
              fontSize: 8,
              fontWeight: 500,
              color: "rgba(255,255,255,0.9)",
              textShadow: "0 1px 2px rgba(0,0,0,0.5)",
              background: p.color,
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {p.label}
          </div>
        ))}
        {indicatorPct >= 0 && (
          <div
            style={{
              position: "absolute",
              top: -2,
              bottom: -2,
              left: `${indicatorPct}%`,
              width: 2,
              background: "var(--live)",
              boxShadow: "0 0 6px var(--live)",
              zIndex: 1,
              transition: "left 0.5s ease",
            }}
          />
        )}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
        {TERRAIN_PHASES.map((p) => (
          <div key={p.label} style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "var(--font-mono)", fontSize: 8, color: "var(--text-muted)" }}>
            <div style={{ width: 6, height: 6, borderRadius: 2, background: p.color }} />
            {p.start}–{p.end} km
          </div>
        ))}
      </div>
    </div>
  );
}
