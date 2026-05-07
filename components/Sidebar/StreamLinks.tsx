"use client";
import { STREAM_LINKS } from "@/lib/constants";

export function StreamLinks() {
  return (
    <div style={{ padding: "10px 20px", borderBottom: "1px solid var(--border)", display: "flex", gap: 6, flexShrink: 0, flexWrap: "wrap" }}>
      {STREAM_LINKS.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1,
            minWidth: 80,
            padding: "6px 8px",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            color: "var(--text-secondary)",
            textDecoration: "none",
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            textAlign: "center",
          }}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
