"use client";
import { useRef } from "react";
import type { Waypoint } from "@/types";

interface Props {
  waypoints: Waypoint[];
  onRemove: (index: number) => void;
  onMove: (from: number, to: number) => void;
}

export function WaypointList({ waypoints, onRemove, onMove }: Props) {
  const dragSrc = useRef<number | null>(null);

  if (waypoints.length === 0) {
    return (
      <div style={{ padding: 20, textAlign: "center", color: "var(--text-muted)", fontSize: 12 }}>
        No waypoints
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "0 12px 12px", scrollbarWidth: "thin", scrollbarColor: "var(--border) transparent" }}>
      {waypoints.map((wp, i) => (
        <div
          key={`${i}-${wp.name}`}
          draggable
          onDragStart={() => { dragSrc.current = i; }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (dragSrc.current !== null && dragSrc.current !== i) {
              onMove(dragSrc.current, i);
            }
            dragSrc.current = null;
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 8px",
            borderRadius: 8,
            cursor: "grab",
            position: "relative",
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: "var(--accent-dim)",
              border: "1.5px solid var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              fontWeight: 500,
              color: "var(--accent)",
              flexShrink: 0,
            }}
          >
            {i + 1}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 500,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {wp.name}
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                color: "var(--text-muted)",
                marginTop: 1,
              }}
            >
              {wp.lat.toFixed(4)}, {wp.lng.toFixed(4)}
            </div>
          </div>
          <button
            onClick={() => onRemove(i)}
            style={{
              width: 22,
              height: 22,
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              flexShrink: 0,
              opacity: 0.3,
            }}
            onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.opacity = "1"; (e.target as HTMLButtonElement).style.color = "var(--danger)"; }}
            onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.opacity = "0.3"; (e.target as HTMLButtonElement).style.color = "var(--text-muted)"; }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
