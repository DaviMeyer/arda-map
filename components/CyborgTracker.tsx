"use client";
import { useState, useEffect, useCallback } from "react";
import { useWaypoints } from "@/hooks/useWaypoints";
import { useRoute } from "@/hooks/useRoute";
import { useRaceClock } from "@/hooks/useRaceClock";
import { useElevation } from "@/hooks/useElevation";
import { useMilestones } from "@/hooks/useMilestones";
import { loadKmFromHash, saveKmToHash } from "@/lib/storage";
import { Sidebar } from "./Sidebar/Sidebar";
import RouteMap from "./Map/RouteMap";
import { ElevationProfile } from "./ElevationProfile";
import { MapControls } from "./MapControls";

export default function CyborgTracker() {
  const wp = useWaypoints();
  const [routingProfile, setRoutingProfile] = useState("driving");
  const route = useRoute(wp.waypoints, routingProfile);
  const clock = useRaceClock();
  const elevation = useElevation(route.coords);
  const ms = useMilestones();
  const [actualKm, setActualKm] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth > 768 : true
  );
  const [elevOpen, setElevOpen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth > 768 : true
  );
  const [editMode, setEditMode] = useState(false);
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  useEffect(() => {
    const fromHash = loadKmFromHash();
    if (fromHash !== null) setActualKm(fromHash);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === "k" &&
        !e.ctrlKey &&
        !e.metaKey &&
        (e.target as HTMLElement).tagName !== "INPUT"
      ) {
        e.preventDefault();
        document.getElementById("kmInput")?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleSetKm = useCallback(
    (km: number) => {
      setActualKm(km);
      saveKmToHash(km);
      ms.addMilestone(km);
    },
    [ms]
  );

  return (
    <>
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        waypoints={wp.waypoints}
        onAddWaypoint={wp.addWaypoint}
        onRemoveWaypoint={wp.removeWaypoint}
        onMoveWaypoint={wp.moveWaypoint}
        onResetDefaults={wp.resetToDefaults}
        onClearAll={wp.clearAll}
        actualKm={actualKm}
        onSetKm={handleSetKm}
        clock={clock}
        milestones={ms.milestones}
        onRemoveMilestone={ms.removeMilestone}
        onClearMilestones={ms.clearMilestones}
        routeLoading={route.loading}
        totalDistance={route.totalMeters}
        editMode={editMode}
      />

      <div
        id="map-container"
        style={{
          position: "absolute",
          top: 0,
          left: sidebarOpen && !isMobile ? "var(--sidebar-width)" : 0,
          right: 0,
          bottom: elevOpen ? (isMobile ? 100 : 150) : 0,
          zIndex: 1,
          transition: "all 0.3s",
        }}
      >
        <RouteMap
          waypoints={wp.waypoints}
          routeCoords={route.coords}
          actualKm={actualKm}
          idealKm={clock.idealKm}
          editMode={editMode}
          onMapClick={(lat, lng) => editMode && wp.addWaypoint(lat, lng)}
          onMarkerDrag={(idx, lat, lng) => wp.updateWaypoint(idx, lat, lng)}
          onMarkerDelete={(idx) => wp.removeWaypoint(idx)}
        />
        <MapControls
          routingProfile={routingProfile}
          onToggleProfile={() =>
            setRoutingProfile((p) => (p === "driving" ? "foot" : "driving"))
          }
          editMode={editMode}
          onToggleEditMode={() => setEditMode(!editMode)}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: sidebarOpen && !isMobile ? "var(--sidebar-width)" : 0,
          right: 0,
          bottom: 0,
          height: elevOpen ? (isMobile ? 100 : 150) : 0,
          background: "var(--bg-primary)",
          borderTop: "1px solid var(--border)",
          zIndex: 100,
          transition: "all 0.3s",
          overflow: "hidden",
        }}
      >
        <ElevationProfile
          elevationData={elevation.data}
          actualKm={actualKm}
          idealKm={clock.idealKm}
          routeCoords={route.coords}
          loading={elevation.loading}
        />
      </div>

      <button
        onClick={() => setElevOpen(!elevOpen)}
        style={{
          position: "absolute",
          bottom: elevOpen ? (isMobile ? 105 : 155) : 5,
          right: 120,
          zIndex: 1000,
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          color: "var(--text-secondary)",
          cursor: "pointer",
          padding: "4px 10px",
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          transition: "all 0.3s",
        }}
      >
        Elevation {elevOpen ? "▼" : "▲"}
      </button>
    </>
  );
}
