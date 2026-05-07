export interface Waypoint {
  lat: number;
  lng: number;
  name: string;
}

export interface ElevationPoint {
  km: number;
  elevation: number;
}

export interface Milestone {
  km: number;
  time: string;
}

export interface RouteData {
  coords: [number, number][];
  totalMeters: number;
}

export interface PaceStats {
  paceNeeded: string;
  paceRemaining: string;
  paceRemainingColor: string;
  caloriesBurned: string;
  currentDay: string;
}

export interface RaceClock {
  elapsedText: string;
  remainingText: string;
  idealKm: number;
  elapsedMs: number;
  remainingMs: number;
}
