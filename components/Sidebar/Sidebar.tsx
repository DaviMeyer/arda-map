"use client";
import type { Waypoint, Milestone, RaceClock } from "@/types";
import { TrackerPanel } from "./TrackerPanel";
import { KmInput } from "./KmInput";
import { PaceStats } from "./PaceStats";
import { MilestoneLog } from "./MilestoneLog";
import { TerrainPhases } from "./TerrainPhases";
import { StreamLinks } from "./StreamLinks";
import { WaypointList } from "./WaypointList";
import { SidebarActions } from "./SidebarActions";
import { exportGPX } from "@/lib/gpx";

interface Props {
  isOpen: boolean;
  onToggle: () => void;
  waypoints: Waypoint[];
  onAddWaypoint: (lat: number, lng: number, name?: string) => void;
  onRemoveWaypoint: (index: number) => void;
  onMoveWaypoint: (from: number, to: number) => void;
  onResetDefaults: () => void;
  onClearAll: () => void;
  actualKm: number | null;
  onSetKm: (km: number) => void;
  clock: RaceClock;
  milestones: Milestone[];
  onRemoveMilestone: (index: number) => void;
  onClearMilestones: () => void;
  routeLoading: boolean;
  totalDistance: number;
  editMode: boolean;
}

export function Sidebar({
  isOpen,
  onToggle,
  waypoints,
  onRemoveWaypoint,
  onMoveWaypoint,
  onResetDefaults,
  onClearAll,
  actualKm,
  onSetKm,
  clock,
  milestones,
  onRemoveMilestone,
  onClearMilestones,
  totalDistance,
  editMode,
}: Props) {
  const s: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: "var(--sidebar-width)",
    background: "var(--bg-primary)",
    borderRight: "1px solid var(--border)",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    transition: "transform 0.3s",
    transform: isOpen ? "none" : "translateX(-100%)",
    scrollbarWidth: "thin",
    scrollbarColor: "var(--border) transparent",
  };

  return (
    <>
      <div style={s}>
        <div
          style={{
            padding: "20px 20px 12px",
            borderBottom: "1px solid var(--border)",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              fontWeight: 300,
              letterSpacing: 6,
              color: "var(--accent)",
              textTransform: "uppercase",
              marginBottom: 2,
            }}
          >
            Cyborg Season
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--text-muted)",
              letterSpacing: 2,
            }}
          >
            Arda Saatçi · 600 km · Death Valley → Santa Monica
          </div>
        </div>

        <TrackerPanel actualKm={actualKm} clock={clock} />
        <KmInput onSetKm={onSetKm} actualKm={actualKm} />
        <PaceStats actualKm={actualKm} clock={clock} />
        <MilestoneLog
          milestones={milestones}
          onRemove={onRemoveMilestone}
          onClear={onClearMilestones}
        />
        <TerrainPhases actualKm={actualKm} />
        <StreamLinks />

        <div
          style={{
            padding: "12px 20px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                letterSpacing: 2,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Route
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 16, fontWeight: 500 }}>
              {totalDistance > 0 ? (totalDistance / 1000).toFixed(1) : "—"}
              <span style={{ fontSize: 11, color: "var(--text-secondary)", marginLeft: 2 }}>km</span>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                letterSpacing: 2,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Stops
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 16, fontWeight: 500 }}>
              {waypoints.length}
            </div>
          </div>
        </div>

        {editMode && (
          <>
            <div
              style={{
                padding: "12px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: 2,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                }}
              >
                Waypoints (Edit Mode)
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--text-secondary)",
                  background: "var(--bg-tertiary)",
                  padding: "2px 8px",
                  borderRadius: 4,
                }}
              >
                {waypoints.length}
              </span>
            </div>

            <WaypointList
              waypoints={waypoints}
              onRemove={onRemoveWaypoint}
              onMove={onMoveWaypoint}
            />
          </>
        )}

        {editMode ? (
          <SidebarActions
            waypoints={waypoints}
            onExportGPX={() => exportGPX(waypoints)}
            onClearAll={onClearAll}
            onResetDefaults={onResetDefaults}
          />
        ) : (
          <div style={{ padding: "10px 16px 16px", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
            <button
              onClick={() => exportGPX(waypoints)}
              style={{ width: "100%", padding: "8px 14px", border: "none", borderRadius: 8, fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "var(--accent)", color: "var(--bg-primary)" }}
            >
              ↓ Export GPX
            </button>
          </div>
        )}
      </div>

      <button
        onClick={onToggle}
        style={{
          position: "absolute",
          top: 16,
          left: isOpen ? "calc(var(--sidebar-width) + 12px)" : 12,
          zIndex: 1001,
          width: 36,
          height: 36,
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          color: "var(--text-secondary)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          transition: "all 0.3s",
        }}
      >
        {isOpen ? "◀" : "▶"}
      </button>
    </>
  );
}
