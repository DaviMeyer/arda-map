"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";
import type { Waypoint } from "@/types";
import { getPointAlongRoute } from "@/lib/geo";

interface Props {
  waypoints: Waypoint[];
  routeCoords: [number, number][];
  actualKm: number | null;
  idealKm: number;
  editMode: boolean;
  onMapClick: (lat: number, lng: number) => void;
  onMarkerDrag: (index: number, lat: number, lng: number) => void;
  onMarkerDelete: (index: number) => void;
}

function createIcon(index: number, total: number) {
  let cls = "custom-marker";
  if (index === 0) cls += " start-marker";
  else if (index === total - 1 && total > 1) cls += " end-marker";
  const size = index === 0 || index === total - 1 ? 30 : 26;
  return L.divIcon({
    className: "",
    html: `<div class="${cls}" style="width:${size}px;height:${size}px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--font-mono);font-size:${size > 26 ? 11 : 10}px;font-weight:${size > 26 ? 700 : 500};background:${index === 0 ? "var(--accent)" : index === total - 1 ? "var(--danger)" : "var(--bg-primary)"};color:${index === 0 ? "var(--bg-primary)" : index === total - 1 ? "#fff" : "var(--accent)"};border:2px solid ${index === total - 1 ? "var(--danger)" : "var(--accent)"};box-shadow:0 0 10px var(--accent-dim),0 2px 6px rgba(0,0,0,0.6);cursor:grab;">${index + 1}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export default function RouteMap({
  waypoints,
  routeCoords,
  actualKm,
  idealKm,
  editMode,
  onMapClick,
  onMarkerDrag,
  onMarkerDelete,
}: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const routeOutlineRef = useRef<L.Polyline | null>(null);
  const liveMarkerRef = useRef<L.Marker | null>(null);
  const idealMarkerRef = useRef<L.Marker | null>(null);
  const dayMarkersRef = useRef<L.Marker[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const tilesRef = useRef<{
    satellite: L.TileLayer;
    street: L.TileLayer;
    labels: L.TileLayer;
    places: L.TileLayer;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [35.0, -117.2],
      zoom: 8,
      zoomControl: false,
    });

    const satellite = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { attribution: "Tiles &copy; Esri", maxZoom: 19 }
    ).addTo(map);

    const street = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      { attribution: "&copy; OSM", maxZoom: 19 }
    );

    const labels = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}",
      { maxZoom: 19, opacity: 0.7 }
    ).addTo(map);

    const places = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
      { maxZoom: 19, opacity: 0.8 }
    ).addTo(map);

    tilesRef.current = { satellite, street, labels, places };
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Invalidate map size when container resizes (sidebar toggle)
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !mapRef.current) return;
    const observer = new ResizeObserver(() => {
      mapRef.current?.invalidateSize();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Map click: only add waypoints in edit mode
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const handler = (e: L.LeafletMouseEvent) => {
      if (editMode) onMapClick(e.latlng.lat, e.latlng.lng);
    };
    map.on("click", handler);
    return () => { map.off("click", handler); };
  }, [editMode, onMapClick]);

  // Update waypoint markers (only in edit mode)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    if (!editMode) return;

    waypoints.forEach((wp, i) => {
      const marker = L.marker([wp.lat, wp.lng], {
        icon: createIcon(i, waypoints.length),
        draggable: true,
      }).addTo(map);

      marker.on("dragend", (e) => {
        const pos = (e.target as L.Marker).getLatLng();
        onMarkerDrag(i, pos.lat, pos.lng);
      });

      marker.on("contextmenu", (e) => {
        if (e.originalEvent) e.originalEvent.preventDefault();
        onMarkerDelete(i);
      });

      markersRef.current.push(marker);
    });
  }, [waypoints, editMode, onMarkerDrag, onMarkerDelete]);

  // Update route polyline
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (routeOutlineRef.current) map.removeLayer(routeOutlineRef.current);
    if (routeLineRef.current) map.removeLayer(routeLineRef.current);

    if (routeCoords.length > 1) {
      routeOutlineRef.current = L.polyline(routeCoords, {
        color: "#003d33",
        weight: 8,
        opacity: 0.8,
      }).addTo(map);

      routeLineRef.current = L.polyline(routeCoords, {
        color: "#00ffd5",
        weight: 4,
        opacity: 0.95,
      }).addTo(map);

      routeOutlineRef.current.bringToBack();

      if (markersRef.current.length > 0) {
        map.fitBounds(
          L.featureGroup(markersRef.current).getBounds().pad(0.1)
        );
      }
    }
  }, [routeCoords]);

  // Update live + ideal markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || routeCoords.length < 2) return;

    // Ideal marker
    const idealPos = getPointAlongRoute(idealKm, routeCoords);
    if (idealPos) {
      if (!idealMarkerRef.current) {
        idealMarkerRef.current = L.marker(idealPos, {
          icon: L.divIcon({
            className: "",
            html: '<div style="width:30px;height:30px;display:flex;align-items:center;justify-content:center;"><div style="width:16px;height:16px;background:var(--warning);border:2px solid #fff;transform:rotate(45deg);box-shadow:0 0 10px var(--warning-dim);"></div></div>',
            iconSize: [30, 30],
            iconAnchor: [15, 15],
          }),
          zIndexOffset: 2000,
          interactive: false,
        }).addTo(map);
      } else {
        idealMarkerRef.current.setLatLng(idealPos);
      }
    }

    // Live marker
    if (actualKm !== null) {
      const actualPos = getPointAlongRoute(actualKm, routeCoords);
      if (actualPos) {
        if (!liveMarkerRef.current) {
          liveMarkerRef.current = L.marker(actualPos, {
            icon: L.divIcon({
              className: "",
              html: '<div style="width:40px;height:40px;position:relative;display:flex;align-items:center;justify-content:center;"><div style="position:absolute;width:40px;height:40px;border-radius:50%;background:var(--live);opacity:0.3;animation:live-pulse 2s ease-out infinite;"></div><div style="width:18px;height:18px;border-radius:50%;background:var(--live);border:3px solid #fff;box-shadow:0 0 12px var(--live);z-index:1;"></div></div>',
              iconSize: [40, 40],
              iconAnchor: [20, 20],
            }),
            zIndexOffset: 3000,
            interactive: true,
          }).addTo(map);
          liveMarkerRef.current.bindTooltip(
            '<span style="cursor:pointer;">Arda — click for Street View</span>',
            {
              permanent: true,
              direction: "top",
              offset: [0, -16],
              interactive: true,
            }
          );
          const openStreetView = () => {
            const pos = liveMarkerRef.current!.getLatLng();
            window.open(
              `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${pos.lat},${pos.lng}`,
              "_blank"
            );
          };
          liveMarkerRef.current.on("click", openStreetView);
          liveMarkerRef.current.getTooltip()?.getElement()?.addEventListener("click", openStreetView);
        } else {
          liveMarkerRef.current.setLatLng(actualPos);
        }
      }
    }

    // Day markers
    dayMarkersRef.current.forEach((m) => map.removeLayer(m));
    dayMarkersRef.current = [];
    [150, 300, 450].forEach((km, i) => {
      const pos = getPointAlongRoute(km, routeCoords);
      if (pos) {
        const m = L.marker(pos, {
          icon: L.divIcon({
            className: "",
            html: `<div style="display:flex;align-items:center;justify-content:center;width:50px;height:20px;border-radius:4px;background:var(--bg-secondary);border:1px solid var(--warning);color:var(--warning);font-family:var(--font-mono);font-size:9px;font-weight:500;box-shadow:0 2px 8px rgba(0,0,0,0.5);">D${i + 1} ${km}km</div>`,
            iconSize: [50, 20],
            iconAnchor: [25, 10],
          }),
          zIndexOffset: 1500,
          interactive: false,
        }).addTo(map);
        dayMarkersRef.current.push(m);
      }
    });
  }, [routeCoords, actualKm, idealKm]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", background: "var(--bg-primary)" }}
    />
  );
}
