import { Clan } from '@/types';

interface GeneratedIcon {
  url: string;
  cacheKey: string;
  timestamp: number;
}

// Cache for generated clan icons
const iconCache = new Map<string, GeneratedIcon>();

/**
 * Generate icon prompt for each clan
 */
const generateIconPrompt = (clan: Clan): string => {
  const prompts: { [key: string]: string } = {
    'thunderclan': 'A minimalist lightning bolt symbol in a circular badge, forest green background, simple vector style, clean lines, warrior clan emblem',
    'riverclan': 'A flowing water wave symbol in a circular badge, blue background, simple vector style, clean lines, warrior clan emblem',
    'windclan': 'A stylized wind swirl or feather symbol in a circular badge, golden yellow background, simple vector style, clean lines, warrior clan emblem',
    'shadowclan': 'A crescent moon or shadow symbol in a circular badge, purple background, simple vector style, clean lines, warrior clan emblem',
    'skyclan': 'A tree branch or leaf symbol in a circular badge, red background, simple vector style, clean lines, warrior clan emblem',
    'tribe': 'A mountain peak symbol in a circular badge, gray background, simple vector style, clean lines, warrior clan emblem'
  };

  return prompts[clan.id] || `A symbol representing ${clan.name} in a circular badge, simple vector style, clean lines, warrior clan emblem`;
};

/**
 * Generate clan icon using SVG fallbacks (API disabled to prevent errors)
 */
export const generateClanIcon = async (clan: Clan): Promise<string> => {
  // For now, always use beautiful SVG fallbacks to prevent API errors
  // This ensures stable, fast loading icons without external API dependencies
  console.log(`Using SVG fallback icon for ${clan.name}`);
  return createSVGIcon(clan);
};

/**
 * Call the icon generation API
 */
const callIconGenerationAPI = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch('/api/generate-icon', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate icon');
    }

    const data = await response.json();
    return data.iconUrl;
  } catch (error) {
    console.error('Error calling icon generation API:', error);
    throw error;
  }
};

/**
 * Check if cached icon is still valid (7 days)
 */
const isCacheValid = (cachedIcon: GeneratedIcon): boolean => {
  const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  return Date.now() - cachedIcon.timestamp < CACHE_DURATION;
};

/**
 * Create SVG fallback icons for each clan
 */
const createSVGIcon = (clan: Clan): string => {
  const svgIcons: { [key: string]: string } = {
    'thunderclan': `data:image/svg+xml;base64,${btoa(`
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="${clan.color}"/>
        <path d="M15 8 L25 20 L20 20 L25 32 L15 20 L20 20 Z" fill="white" stroke="white" stroke-width="1"/>
      </svg>
    `)}`,
    
    'riverclan': `data:image/svg+xml;base64,${btoa(`
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="${clan.color}"/>
        <path d="M8 20 Q15 15 20 20 Q25 25 32 20 Q25 15 20 20 Q15 25 8 20" fill="white"/>
      </svg>
    `)}`,
    
    'windclan': `data:image/svg+xml;base64,${btoa(`
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="${clan.color}"/>
        <path d="M10 15 Q20 10 30 15 Q25 20 20 18 Q15 22 10 15" fill="white"/>
        <path d="M10 25 Q20 20 30 25 Q25 30 20 28 Q15 32 10 25" fill="white"/>
      </svg>
    `)}`,
    
    'shadowclan': `data:image/svg+xml;base64,${btoa(`
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="${clan.color}"/>
        <path d="M20 8 A12 12 0 0 0 8 20 A12 12 0 0 0 20 32 A8 8 0 0 1 20 24 A8 8 0 0 1 12 16 A8 8 0 0 1 20 8" fill="white"/>
      </svg>
    `)}`,
    
    'skyclan': `data:image/svg+xml;base64,${btoa(`
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="${clan.color}"/>
        <path d="M20 8 L15 18 L20 15 L25 18 Z" fill="white"/>
        <path d="M12 12 L8 22 L12 19 L16 22 Z" fill="white"/>
        <path d="M28 12 L24 22 L28 19 L32 22 Z" fill="white"/>
      </svg>
    `)}`,
    
    'tribe': `data:image/svg+xml;base64,${btoa(`
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="${clan.color}"/>
        <path d="M20 8 L12 28 L20 24 L28 28 Z" fill="white"/>
        <path d="M20 8 L16 20 L20 18 L24 20 Z" fill="white"/>
      </svg>
    `)}`
  };

  return svgIcons[clan.id] || svgIcons['thunderclan'];
};

/**
 * Preload all clan icons
 */
export const preloadClanIcons = async (clans: Clan[]): Promise<void> => {
  const promises = clans.map(clan => generateClanIcon(clan));
  
  try {
    await Promise.allSettled(promises);
    console.log('Clan icons preloaded');
  } catch (error) {
    console.error('Error preloading icons:', error);
  }
};

