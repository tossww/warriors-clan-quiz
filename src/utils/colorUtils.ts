import { ColorTint } from '@/types';
import { getClanById } from '@/data/clans';

/**
 * Converts hex color to RGB values
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * Generates background color with clan tinting
 */
export const getBackgroundColor = (colorTint: ColorTint | null): string => {
  if (!colorTint) {
    return '#ffffff'; // Default white background
  }

  const clan = getClanById(colorTint.clanId);
  if (!clan) {
    return '#ffffff';
  }

  const rgb = hexToRgb(clan.color);
  if (!rgb) {
    return '#ffffff';
  }

  // Blend clan color with white background
  const { r, g, b } = rgb;
  const intensity = colorTint.intensity;
  
  // Calculate blended color (clan color mixed with white)
  const blendedR = Math.round(255 - (255 - r) * intensity);
  const blendedG = Math.round(255 - (255 - g) * intensity);
  const blendedB = Math.round(255 - (255 - b) * intensity);

  return `rgb(${blendedR}, ${blendedG}, ${blendedB})`;
};

/**
 * Gets text color that maintains contrast with background
 */
export const getTextColor = (backgroundColor: string): string => {
  // For now, return dark text for all backgrounds
  // In the future, we could calculate luminance and adjust accordingly
  return '#1f2937'; // Tailwind gray-800
};

/**
 * Generates CSS custom properties for clan colors
 */
export const getClanColorVariables = (): { [key: string]: string } => {
  const variables: { [key: string]: string } = {};
  
  // Add each clan color as a CSS custom property
  variables['--color-thunderclan'] = '#059669';
  variables['--color-riverclan'] = '#0284C7';
  variables['--color-windclan'] = '#EAB308';
  variables['--color-shadowclan'] = '#7C3AED';
  variables['--color-skyclan'] = '#DC2626';
  variables['--color-tribe'] = '#475569';
  
  return variables;
};
