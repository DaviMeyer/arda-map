"use client";
import { useEffect, useRef } from "react";
import type { ElevationPoint } from "@/types";
import { TOTAL_DISTANCE_KM, TERRAIN_PHASES } from "@/lib/constants";
import { getElevAtKm, getPointAlongRoute } from "@/lib/geo";

interface Props {
  elevationData: ElevationPoint[] | null;
  actualKm: number | null;
  idealKm: number;
  routeCoords: [number, number][];
  loading: boolean;
}

export function ElevationProfile({ elevationData, actualKm, idealKm, routeCoords, loading }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const PAD = { l: 40, r: 12, t: 12, b: 22 };

  useEffect(() => {
    draw();
  });

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const observer = new ResizeObserver(() => draw());
    observer.observe(wrap);
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elevationData, actualKm, idealKm]);

  function draw() {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap || !elevationData || elevationData.length < 2) return;
    const rect = wrap.getBoundingClientRect();
    if (rect.width < 10 || rect.height < 10) return;
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(2, 2);
    const w = rect.width, h = rect.height;
    ctx.clearRect(0, 0, w, h);

    const pw = w - PAD.l - PAD.r;
    const ph = h - PAD.t - PAD.b;

    const elevs = elevationData.map((d) => d.elevation);
    const minE = Math.min(...elevs) - 20;
    const maxE = Math.max(...elevs) + 50;
    const rangeE = maxE - minE || 1;
    const toX = (km: number) => PAD.l + (km / TOTAL_DISTANCE_KM) * pw;
    const toY = (elev: number) => PAD.t + ph - ((elev - minE) / rangeE) * ph;

    TERRAIN_PHASES.forEach((p) => {
      ctx.fillStyle = p.color + "1f";
      ctx.fillRect(toX(p.start), PAD.t, toX(p.end) - toX(p.start), ph);
    });

    ctx.strokeStyle = "#1a1e25";
    ctx.lineWidth = 0.5;
    const step = rangeE > 1000 ? 500 : rangeE > 500 ? 200 : 100;
    for (let e = Math.ceil(minE / step) * step; e <= maxE; e += step) {
      const y = toY(e);
      ctx.beginPath();
      ctx.moveTo(PAD.l, y);
      ctx.lineTo(PAD.l + pw, y);
      ctx.stroke();
      ctx.fillStyle = "#555350";
      ctx.font = "8px DM Mono, monospace";
      ctx.textAlign = "right";
      ctx.fillText(`${e}m`, PAD.l - 4, y + 3);
    }

    ctx.textAlign = "center";
    ctx.fillStyle = "#555350";
    for (let km = 0; km <= 600; km += 100) {
      ctx.fillText(`${km}`, toX(km), PAD.t + ph + 14);
    }

    ctx.beginPath();
    ctx.moveTo(toX(elevationData[0].km), toY(elevationData[0].elevation));
    elevationData.forEach((d) => ctx.lineTo(toX(d.km), toY(d.elevation)));
    ctx.lineTo(toX(elevationData[elevationData.length - 1].km), PAD.t + ph);
    ctx.lineTo(toX(elevationData[0].km), PAD.t + ph);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, PAD.t, 0, PAD.t + ph);
    grad.addColorStop(0, "rgba(0,255,213,0.25)");
    grad.addColorStop(1, "rgba(0,255,213,0.02)");
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(toX(elevationData[0].km), toY(elevationData[0].elevation));
    elevationData.forEach((d) => ctx.lineTo(toX(d.km), toY(d.elevation)));
    ctx.strokeStyle = "#00ffd5";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    if (idealKm > 0 && idealKm <= TOTAL_DISTANCE_KM) {
      const ie = getElevAtKm(idealKm, elevationData);
      const ix = toX(idealKm), iy = toY(ie);
      ctx.beginPath();
      ctx.moveTo(ix, PAD.t);
      ctx.lineTo(ix, PAD.t + ph);
      ctx.strokeStyle = "#ffb80044";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(ix, iy, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#ffb800";
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    if (actualKm !== null && actualKm > 0) {
      const ae = getElevAtKm(actualKm, elevationData);
      const ax = toX(actualKm), ay = toY(ae);
      ctx.beginPath();
      ctx.moveTo(ax, PAD.t);
      ctx.lineTo(ax, PAD.t + ph);
      ctx.strokeStyle = "#ff3b5c88";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([]);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(ax, ay, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#ff3b5c";
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.strokeStyle = "#2a2d33";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PAD.l, PAD.t);
    ctx.lineTo(PAD.l, PAD.t + ph);
    ctx.lineTo(PAD.l + pw, PAD.t + ph);
    ctx.stroke();
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!elevationData || !wrapRef.current || !tooltipRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pw = rect.width - PAD.l - PAD.r;
    const km = ((x - PAD.l) / pw) * TOTAL_DISTANCE_KM;
    if (km < 0 || km > TOTAL_DISTANCE_KM) {
      tooltipRef.current.style.display = "none";
      return;
    }
    const elev = getElevAtKm(km, elevationData);
    tooltipRef.current.style.display = "block";
    tooltipRef.current.textContent = `${km.toFixed(0)} km · ${elev.toFixed(0)} m`;
    tooltipRef.current.style.left = Math.min(x + 10, rect.width - 100) + "px";
    tooltipRef.current.style.top = "8px";
  }

  function handleClick(e: React.MouseEvent) {
    if (!elevationData || !wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pw = rect.width - PAD.l - PAD.r;
    const km = ((x - PAD.l) / pw) * TOTAL_DISTANCE_KM;
    if (km < 0 || km > TOTAL_DISTANCE_KM) return;
    // Could dispatch an event to pan the map
  }

  return (
    <div
      ref={wrapRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { if (tooltipRef.current) tooltipRef.current.style.display = "none"; }}
      onClick={handleClick}
      style={{ width: "100%", height: "100%", position: "relative", cursor: "crosshair" }}
    >
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
      <div
        ref={tooltipRef}
        style={{
          position: "absolute",
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          borderRadius: 6,
          padding: "4px 8px",
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "var(--text-primary)",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          display: "none",
          zIndex: 10,
          boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
        }}
      />
      {loading && (
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 16, height: 16, border: "2px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          Loading elevation...
        </div>
      )}
    </div>
  );
}
