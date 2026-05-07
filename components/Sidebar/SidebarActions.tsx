"use client";
import type { Waypoint } from "@/types";

interface Props {
  waypoints: Waypoint[];
  onExportGPX: () => void;
  onClearAll: () => void;
  onResetDefaults: () => void;
}

const btn: React.CSSProperties = {
  padding: "8px 14px",
  border: "none",
  borderRadius: 8,
  fontFamily: "var(--font-sans)",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
};

export function SidebarActions({ waypoints, onExportGPX, onClearAll, onResetDefaults }: Props) {
  return (
    <div style={{ padding: "10px 16px 16px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
      <button onClick={onExportGPX} style={{ ...btn, background: "var(--accent)", color: "var(--bg-primary)" }}>
        ↓ Export GPX
      </button>
      <div style={{ display: "flex", gap: 6 }}>
        <button
          onClick={() => { if (confirm("Clear all waypoints?")) onClearAll(); }}
          style={{ ...btn, flex: 1, background: "var(--danger-dim)", color: "var(--danger)", border: "1px solid transparent" }}
          disabled={waypoints.length === 0}
        >
          ✕ Clear
        </button>
        <button
          onClick={() => { if (confirm("Reset all waypoints to defaults?")) onResetDefaults(); }}
          style={{ ...btn, flex: 1, background: "var(--bg-tertiary)", color: "var(--text-secondary)", border: "1px solid var(--border)", fontSize: 10 }}
        >
          Reset defaults
        </button>
      </div>
    </div>
  );
}
