"use client";
import { useEffect, useRef } from "react";
import type { Milestone } from "@/types";
import { RACE_START, TOTAL_DISTANCE_KM } from "@/lib/constants";

interface Props {
  milestones: Milestone[];
  onRemove: (index: number) => void;
  onClear: () => void;
}

export function MilestoneLog({ milestones, onRemove, onClear }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    drawChart();
  });

  function drawChart() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(2, 2);
    const w = rect.width, h = rect.height;
    ctx.clearRect(0, 0, w, h);

    const pad = { l: 30, r: 8, t: 8, b: 16 };
    const pw = w - pad.l - pad.r;
    const ph = h - pad.t - pad.b;

    ctx.strokeStyle = "#2a2d33";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(pad.l, pad.t);
    ctx.lineTo(pad.l, pad.t + ph);
    ctx.lineTo(pad.l + pw, pad.t + ph);
    ctx.stroke();

    ctx.fillStyle = "#555350";
    ctx.font = "8px DM Mono, monospace";
    ctx.textAlign = "center";
    for (let d = 0; d <= 4; d++) {
      const x = pad.l + (d / 4) * pw;
      ctx.fillText(`D${d}`, x, pad.t + ph + 12);
      ctx.beginPath();
      ctx.moveTo(x, pad.t);
      ctx.lineTo(x, pad.t + ph);
      ctx.strokeStyle = "#1a1e25";
      ctx.stroke();
    }
    ctx.textAlign = "right";
    ctx.fillText("600", pad.l - 4, pad.t + 8);
    ctx.fillText("0", pad.l - 4, pad.t + ph + 4);

    ctx.beginPath();
    ctx.moveTo(pad.l, pad.t + ph);
    ctx.lineTo(pad.l + pw, pad.t);
    ctx.strokeStyle = "#ffb80055";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 3]);
    ctx.stroke();
    ctx.setLineDash([]);

    if (milestones.length > 0) {
      ctx.beginPath();
      ctx.strokeStyle = "#ff3b5c";
      ctx.lineWidth = 2;
      milestones.forEach((m, i) => {
        const t = (new Date(m.time).getTime() - RACE_START.getTime()) / (96 * 3600000);
        const x = pad.l + Math.min(Math.max(t, 0), 1) * pw;
        const y = pad.t + ph - (m.km / TOTAL_DISTANCE_KM) * ph;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      milestones.forEach((m) => {
        const t = (new Date(m.time).getTime() - RACE_START.getTime()) / (96 * 3600000);
        const x = pad.l + Math.min(Math.max(t, 0), 1) * pw;
        const y = pad.t + ph - (m.km / TOTAL_DISTANCE_KM) * ph;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#ff3b5c";
        ctx.fill();
      });
    }

    const nowFrac = (Date.now() - RACE_START.getTime()) / (96 * 3600000);
    if (nowFrac >= 0 && nowFrac <= 1) {
      const nx = pad.l + nowFrac * pw;
      ctx.beginPath();
      ctx.moveTo(nx, pad.t);
      ctx.lineTo(nx, pad.t + ph);
      ctx.strokeStyle = "#00ffd555";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  return (
    <div style={{ padding: "10px 20px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 2, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Progress Log
        <button onClick={() => { if (confirm("Clear all logged milestones?")) onClear(); }} style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
          clear
        </button>
      </div>
      <div style={{ width: "100%", height: 80, background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 6, position: "relative", overflow: "hidden", marginBottom: 6 }}>
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
      </div>
      <div style={{ maxHeight: 80, overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "var(--border) transparent" }}>
        {milestones.length === 0 ? (
          <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 9, padding: 6, fontFamily: "var(--font-mono)" }}>
            Set km to auto-log entries
          </div>
        ) : (
          milestones.map((m, i) => {
            const t = new Date(m.time);
            const elapsed = (t.getTime() - RACE_START.getTime()) / 3600000;
            const elH = Math.floor(elapsed);
            const elM = Math.floor((elapsed % 1) * 60);
            return (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "3px 0", fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-secondary)", borderBottom: i < milestones.length - 1 ? "1px solid var(--border)" : "none" }}>
                <span style={{ color: "var(--live)", fontWeight: 500 }}>{m.km.toFixed(1)} km</span>
                <span style={{ color: "var(--text-muted)" }}>
                  {t.getHours().toString().padStart(2, "0")}:{t.getMinutes().toString().padStart(2, "0")} ({elH}h{elM.toString().padStart(2, "0")}m)
                </span>
                <button onClick={() => onRemove(i)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 9, padding: "0 2px" }}>
                  x
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
