export interface AnimationWaypoint {
  center: [number, number];
  zoom: number;
  bearing: number;
  pitch: number;
  duration: number;
  countryCode?: string;
}

export interface AnimationConfig {
  templateId: string;
  waypoints: AnimationWaypoint[];
  highlightColor: string;
  highlightOpacity: number;
  pauseAfterWaypointMs: number;
}

export interface AnimationTemplate {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  durationLabel: string;
  viewpointLabel: string;
  waypointZoom: number;
  waypointPitch: number;
  waypointDuration: number;
  pauseAfterWaypointMs: number;
  finalDuration: number;
  highlightColor: string;
  highlightOpacity: number;
  cardGradient: string;
}
