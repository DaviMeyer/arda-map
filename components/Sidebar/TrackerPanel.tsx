"use client";
import type { RaceClock } from "@/types";
import { TOTAL_DISTANCE_KM } from "@/lib/constants";
import { getStatusBadge } from "@/lib/race";

const mono: React.CSSProperties = { fontFamily: "var(--font-mono)" };
const label: React.CSSProperties = {
  ...mono,
  fontSize: 8,
  letterSpacing: 1.5,
  color: "var(--text-muted)",
  textTransform: "uppercase",
  marginBottom: 4,
};

interface Props {
  actualKm: number | null;
  clock: RaceClock;
}

export function TrackerPanel({ actualKm, clock }: Props) {
  const idealPct = Math.min((clock.idealKm / TOTAL_DISTANCE_KM) * 100, 100);
  const actualPct =
    actualKm !== null
      ? Math.min((actualKm / TOTAL_DISTANCE_KM) * 100, 100)
      : 0;
  const status = getStatusBadge(actualKm, clock.idealKm);

  const badgeColors: Record<string, { bg: string; color: string; border: string }> = {
    ahead: { bg: "#00ffd520", color: "var(--accent)", border: "#00ffd540" },
    behind: { bg: "var(--danger-dim)", color: "var(--danger)", border: "#ff4d4d40" },
    "on-track": { bg: "var(--warning-dim)", color: "var(--warning)", border: "#ffb80040" },
    "not-started": { bg: "var(--bg-tertiary)", color: "var(--text-muted)", border: "var(--border)" },
  };
  const bc = badgeColors[status.className] || badgeColors["not-started"];

  return (
    <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
      <div style={{ ...mono, fontSize: 10, letterSpacing: 2, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 8, height: 8, background: "var(--live)", borderRadius: "50%", animation: "pulse-dot 2s ease-in-out infinite" }} />
        Race Tracker
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <div style={{ flex: 1, background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
          <div style={label}>Elapsed</div>
          <div style={{ ...mono, fontSize: 16, fontWeight: 500 }}>{clock.elapsedText}</div>
        </div>
        <div style={{ flex: 1, background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
          <div style={label}>Remaining</div>
          <div style={{ ...mono, fontSize: 16, fontWeight: 500, color: "var(--warning)" }}>{clock.remainingText}</div>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ height: 8, background: "var(--bg-tertiary)", borderRadius: 4, overflow: "hidden", position: "relative", marginBottom: 6 }}>
          <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: `${idealPct}%`, background: "var(--warning)", opacity: 0.3, borderRadius: 4, transition: "width 1s linear" }} />
          <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: `${actualPct}%`, background: "var(--live)", borderRadius: 4, transition: "width 0.5s ease" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", ...mono, fontSize: 10, color: "var(--text-muted)" }}>
          <span>0 km</span>
          <span>600 km</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <div style={{ flex: 1, background: "var(--bg-secondary)", borderRadius: 8, padding: 10, border: "1px solid var(--live-dim)" }}>
          <div style={{ ...label, color: "var(--live)", display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--live)" }} /> Arda
          </div>
          <div style={{ ...mono, fontSize: 22, fontWeight: 500 }}>
            {actualKm !== null ? actualKm.toFixed(1) : "—"} <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>km</span>
          </div>
        </div>
        <div style={{ flex: 1, background: "var(--bg-secondary)", borderRadius: 8, padding: 10, border: "1px solid var(--warning-dim)" }}>
          <div style={{ ...label, color: "var(--warning)", display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 7, height: 7, background: "var(--warning)", transform: "rotate(45deg)" }} /> Ideal
          </div>
          <div style={{ ...mono, fontSize: 22, fontWeight: 500 }}>
            {clock.idealKm.toFixed(1)} <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>km</span>
          </div>
        </div>
      </div>

      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 6, ...mono, fontSize: 12, fontWeight: 500, width: "100%", justifyContent: "center", background: bc.bg, color: bc.color, border: `1px solid ${bc.border}` }}>
        {status.text}
      </div>
    </div>
  );
}
