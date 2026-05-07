import type { Waypoint } from "@/types";

export const RACE_START = new Date("2026-05-05T18:07:00Z");
export const RACE_DURATION_H = 96;
export const RACE_END = new Date(
  RACE_START.getTime() + RACE_DURATION_H * 3600 * 1000
);
export const TOTAL_DISTANCE_KM = 600;

export const WP_VERSION = "v7";

export const TERRAIN_PHASES = [
  { start: 0, end: 240, label: "Death Valley", color: "#c2703a" },
  { start: 240, end: 360, label: "Mojave", color: "#5a7a4a" },
  { start: 360, end: 510, label: "Route 66", color: "#8b6914" },
  { start: 510, end: 600, label: "LA Urban", color: "#4a5a8b" },
] as const;

export const STREAM_LINKS = [
  {
    label: "Red Bull TV",
    href: "https://www.redbull.tv/en/page/rrn:content:live-videos:a78a7413-a3ad-4f18-b3a8-9d5947a0b9a6/red-bull-cyborg-season-2026",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/watch?v=l0X5R1hRw8g",
  },
  { label: "Twitch", href: "https://www.twitch.tv/ardasaatci1" },
  { label: "TikTok", href: "https://www.tiktok.com/@ardasaatci1" },
] as const;

export const initialWaypoints: Waypoint[] = [
  { lat: 36.264301, lng: -116.782398, name: "Start – Badwater Basin" },
  { lat: 36.460934, lng: -116.866987, name: "2" },
  { lat: 36.609533, lng: -116.986901, name: "3" },
  { lat: 36.339603929602255, lng: -117.42273330688478, name: "4" },
  { lat: 36.028614, lng: -117.292402, name: "5" },
  { lat: 35.77, lng: -117.371799, name: "6" },
  { lat: 35.647771, lng: -117.5014, name: "7" },
  { lat: 35.45535659379871, lng: -117.5859832763672, name: "8" },
  { lat: 35.30798114633294, lng: -117.61138916015626, name: "9" },
  { lat: 34.99831474269113, lng: -117.54333615303041, name: "10" },
  { lat: 34.99604282471028, lng: -117.35385417938234, name: "11" },
  { lat: 34.924728, lng: -117.329873, name: "12" },
  { lat: 34.849413, lng: -117.330297, name: "12b" },
  { lat: 34.782618, lng: -117.330785, name: "12c" },
  { lat: 34.72388, lng: -117.329686, name: "13" },
  { lat: 34.503851, lng: -117.314172, name: "14" },
  { lat: 34.500414, lng: -117.172729, name: "15" },
  { lat: 34.420936, lng: -117.172734, name: "16" },
  { lat: 34.41455724173147, lng: -117.22540855407716, name: "17" },
  { lat: 34.38311269824024, lng: -117.36110687255861, name: "18" },
  { lat: 34.267147552575445, lng: -117.45826721191408, name: "19" },
  { lat: 34.2216277340106, lng: -117.4024021625519, name: "20" },
  { lat: 34.14164577990677, lng: -117.32316970825197, name: "21" },
  { lat: 34.120001, lng: -117.379676, name: "21b" },
  { lat: 34.099942, lng: -117.44, name: "21c" },
  { lat: 34.129299, lng: -117.557928, name: "22" },
  { lat: 34.121001, lng: -117.648656, name: "23" },
  { lat: 34.106701, lng: -117.712427, name: "24" },
  { lat: 34.1216, lng: -117.782543, name: "25" },
  { lat: 34.1388, lng: -117.8482, name: "26" },
  { lat: 34.139472, lng: -117.907899, name: "27" },
  { lat: 34.145498, lng: -117.970938, name: "28" },
  { lat: 34.148053, lng: -118.002797, name: "29" },
  { lat: 34.142059, lng: -118.032598, name: "30" },
  { lat: 34.145781, lng: -118.149699, name: "31" },
  { lat: 34.11527, lng: -118.157332, name: "32" },
  { lat: 34.097861, lng: -118.206963, name: "33" },
  { lat: 34.076127, lng: -118.259919, name: "34" },
  { lat: 34.089941, lng: -118.309001, name: "35" },
  { lat: 34.0866, lng: -118.344607, name: "36" },
  { lat: 34.074233, lng: -118.401099, name: "37" },
  { lat: 34.027996, lng: -118.460021, name: "38" },
  { lat: 34.009205, lng: -118.496954, name: "Finish – Santa Monica Pier" },
];
