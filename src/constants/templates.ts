import type { AnimationTemplate } from '../types/animation.types';

export const ANIMATION_TEMPLATES: AnimationTemplate[] = [
  {
    id: 'coastal-glide',
    name: 'Coastal Glide',
    subtitle: 'Balanced',
    description: 'Smooth flyovers with a cinematic pause on each selected country.',
    durationLabel: 'Medium',
    viewpointLabel: 'Cinematic',
    waypointZoom: 5.25,
    waypointPitch: 34,
    waypointDuration: 2200,
    pauseAfterWaypointMs: 1400,
    finalDuration: 3000,
    highlightColor: '#0ea5e9',
    highlightOpacity: 0.42,
    cardGradient: 'linear-gradient(110deg, #0ea5e9, #22d3ee)',
  },
  {
    id: 'atlas-sprint',
    name: 'Atlas Sprint',
    subtitle: 'Fast',
    description: 'Quick transitions optimized for short clips and social sharing.',
    durationLabel: 'Short',
    viewpointLabel: 'Dynamic',
    waypointZoom: 4.8,
    waypointPitch: 24,
    waypointDuration: 1500,
    pauseAfterWaypointMs: 900,
    finalDuration: 2200,
    highlightColor: '#2563eb',
    highlightOpacity: 0.36,
    cardGradient: 'linear-gradient(110deg, #2563eb, #38bdf8)',
  },
  {
    id: 'horizon-showcase',
    name: 'Horizon Showcase',
    subtitle: 'Detailed',
    description: 'Longer pauses and deeper camera angle for richer destination storytelling.',
    durationLabel: 'Long',
    viewpointLabel: 'Showcase',
    waypointZoom: 5.6,
    waypointPitch: 42,
    waypointDuration: 2900,
    pauseAfterWaypointMs: 1800,
    finalDuration: 3400,
    highlightColor: '#0891b2',
    highlightOpacity: 0.44,
    cardGradient: 'linear-gradient(110deg, #0891b2, #14b8a6)',
  },
];

export const DEFAULT_TEMPLATE_ID = ANIMATION_TEMPLATES[0].id;

export function getTemplateById(templateId: string): AnimationTemplate {
  return ANIMATION_TEMPLATES.find((template) => template.id === templateId) ?? ANIMATION_TEMPLATES[0];
}
