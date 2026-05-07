"use client";

interface Props {
  routingProfile: string;
  onToggleProfile: () => void;
  editMode: boolean;
  onToggleEditMode: () => void;
}

const btnStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  background: "var(--bg-secondary)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  color: "var(--text-secondary)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 16,
};

export function MapControls({ routingProfile, onToggleProfile, editMode, onToggleEditMode }: Props) {
  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        right: 16,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <button
        onClick={onToggleEditMode}
        style={{
          ...btnStyle,
          background: editMode ? "var(--warning-dim)" : "var(--bg-secondary)",
          color: editMode ? "var(--warning)" : "var(--text-secondary)",
          borderColor: editMode ? "var(--warning)" : "var(--border)",
        }}
        title={editMode ? "Edit Mode ON — click to switch to View Mode" : "View Mode — click to switch to Edit Mode"}
      >
        {editMode ? "✏️" : "👁"}
      </button>
      {editMode && (
        <button
          onClick={onToggleProfile}
          style={btnStyle}
          title={`Routing: ${routingProfile}`}
        >
          {routingProfile === "foot" ? "🏃" : "🚗"}
        </button>
      )}
    </div>
  );
}
