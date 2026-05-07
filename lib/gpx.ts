import type { Waypoint } from "@/types";

export function exportGPX(waypoints: Waypoint[]): void {
  if (waypoints.length === 0) return;
  const now = new Date().toISOString();
  const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="ARDA Cyborg Season Tracker"
  xmlns="http://www.topografix.com/GPX/1/1">
  <metadata><name>Cyborg Season Route</name><time>${now}</time></metadata>
  <rte><name>Arda Saatçi – Death Valley to Santa Monica</name>
${waypoints.map((wp) => `    <rtept lat="${wp.lat}" lon="${wp.lng}"><name>${wp.name}</name></rtept>`).join("\n")}
  </rte>
</gpx>`;
  const blob = new Blob([gpx], { type: "application/gpx+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "cyborg-season-route.gpx";
  a.click();
  URL.revokeObjectURL(url);
}
