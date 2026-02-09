export interface AnimationWaypoint {
  center: [number, number];
  zoom: number;
  bearing: number;
  pitch: number;
  duration: number;
  countryCode?: string;
}

export interface AnimationConfig {
  waypoints: AnimationWaypoint[];
  highlightColor: string;
  highlightOpacity: number;
}
