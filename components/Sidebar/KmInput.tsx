"use client";
import { useState } from "react";

interface Props {
  onSetKm: (km: number) => void;
  actualKm: number | null;
}

export function KmInput({ onSetKm, actualKm }: Props) {
  const [inputVal, setInputVal] = useState(actualKm?.toFixed(1) || "");

  const handleSet = () => {
    const val = parseFloat(inputVal);
    if (!isNaN(val) && val >= 0 && val <= 700) onSetKm(val);
  };

  return (
    <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 2, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 8 }}>
        {"Arda's current km"}
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
        <input
          id="kmInput"
          type="number"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSet()}
          placeholder="0"
          min={0}
          max={600}
          step={0.1}
          style={{
            flex: 1,
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "10px 12px",
            fontFamily: "var(--font-mono)",
            fontSize: 16,
            color: "var(--text-primary)",
            outline: "none",
          }}
        />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--text-secondary)", flexShrink: 0 }}>km</span>
        <button
          onClick={handleSet}
          style={{
            padding: "10px 16px",
            background: "var(--live)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          Set
        </button>
      </div>
      <input
        type="range"
        min={0}
        max={600}
        step={0.5}
        value={actualKm ?? 0}
        onChange={(e) => {
          const val = parseFloat(e.target.value);
          setInputVal(val.toFixed(1));
          onSetKm(val);
        }}
        style={{ width: "100%", accentColor: "var(--live)", marginBottom: 8 }}
      />
      <a
        href="https://www.redbull.com/at-de/events/red-bull-cyborg-season/red-bull-cyborg-season-livesticker"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 12px",
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          color: "var(--text-secondary)",
          textDecoration: "none",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
        }}
      >
        <div style={{ width: 6, height: 6, background: "var(--live)", borderRadius: "50%", animation: "pulse-dot 2s ease-in-out infinite" }} />
        Red Bull Live-Ticker öffnen →
      </a>
    </div>
  );
}
