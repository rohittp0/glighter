import { useEffect } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { useAnimationStore } from '../../store/useAnimationStore';

interface AnimationControllerProps {
  map: MapLibreMap | null;
}

export function AnimationController({ map }: AnimationControllerProps) {
  const { isPlaying, config, setPlaying, setCurrentCountry } = useAnimationStore();

  useEffect(() => {
    if (!map || !isPlaying || !config) return;

    let cancelled = false;

    async function playAnimation() {
      if (!map || !config) return;

      for (let i = 1; i < config.waypoints.length; i++) {
        if (cancelled) break;

        const waypoint = config.waypoints[i];

        // Update highlighted country
        if (waypoint.countryCode) {
          setCurrentCountry(waypoint.countryCode);
        }

        // Fly to waypoint
        await new Promise<void>((resolve) => {
          const onMoveEnd = () => {
            map.off('moveend', onMoveEnd);
            resolve();
          };
          map.on('moveend', onMoveEnd);

          map.flyTo({
            center: waypoint.center,
            zoom: waypoint.zoom,
            bearing: waypoint.bearing,
            pitch: waypoint.pitch,
            duration: waypoint.duration,
            essential: true,
          });
        });

        // Pause to show country
        if (waypoint.countryCode) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }

      // Animation complete
      setCurrentCountry(null);
      setPlaying(false);
    }

    playAnimation();

    return () => {
      cancelled = true;
    };
  }, [map, isPlaying, config]);

  return null;
}
