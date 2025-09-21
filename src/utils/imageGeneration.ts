import { Clan } from '@/types';

interface ImageGenerationOptions {
  clan: Clan;
  userAnswers?: string[];
}

interface GeneratedImage {
  url: string;
  cacheKey: string;
  timestamp: number;
}

// Simple in-memory cache for development
// In production, you'd want to use Redis or a database
const imageCache = new Map<string, GeneratedImage>();

/**
 * Generate a cache key for the image based on clan and user preferences
 */
const generateCacheKey = (clan: Clan, userAnswers?: string[]): string => {
  const answersHash = userAnswers ? userAnswers.join('|') : 'default';
  return `${clan.id}_${answersHash}`;
};

/**
 * Check if cached image is still valid (24 hours)
 */
const isCacheValid = (cachedImage: GeneratedImage): boolean => {
  const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  return Date.now() - cachedImage.timestamp < CACHE_DURATION;
};

/**
 * Generate image prompt based on clan characteristics
 */
const generatePrompt = (clan: Clan): string => {
  const basePrompt = `A mystical warrior cat representing ${clan.name} from the Warriors book series`;
  
  const environmentMap: { [key: string]: string } = {
    'thunderclan': 'in a lush green forest with tall oak trees, dappled sunlight filtering through leaves',
    'riverclan': 'beside a flowing river with clear blue water, surrounded by reeds and water plants',
    'windclan': 'on an open moorland with golden grass swaying in the wind, under a vast sky',
    'shadowclan': 'in a dark mysterious marsh with purple shadows and moonlight',
    'skyclan': 'among tall trees with autumn red leaves, perched on high branches',
    'tribe': 'on a mountain peak with gray stone and rushing waterfalls in the background'
  };

  const environment = environmentMap[clan.id] || 'in a natural setting';
  
  return `${basePrompt} ${environment}. The cat should embody the traits: ${clan.traits.join(', ')}. Style: digital art, fantasy illustration, detailed, atmospheric lighting, high quality`;
};

/**
 * Call Google's image generation API
 */
const callGoogleImageAPI = async (prompt: string): Promise<string> => {
  try {
    // Note: This is a placeholder for Google's image generation API
    // You'll need to replace this with the actual Google API endpoint
    // For now, we'll use a placeholder service or return a default image
    
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate image');
    }

    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.error('Error generating image:', error);
    // Return a fallback placeholder image
    return `https://via.placeholder.com/400x400/059669/FFFFFF?text=${encodeURIComponent('Clan Image')}`;
  }
};

/**
 * Generate clan image using local fallbacks (API disabled to prevent errors)
 */
export const generateClanImage = async (options: ImageGenerationOptions): Promise<string> => {
  const { clan } = options;
  
  // For now, always use beautiful local fallbacks to prevent API errors
  // This ensures stable, fast loading images without external API dependencies
  console.log(`Using local fallback image for ${clan.name}`);
  return createClanPlaceholder(clan);
};

/**
 * Create a beautiful clan-specific placeholder image
 */
const createClanPlaceholder = (clan: Clan): string => {
  const color = clan.color.replace('#', '');
  const icon = encodeURIComponent(clan.icon || clan.name.charAt(0));
  
  // Create a more sophisticated placeholder URL with the clan icon
  return `https://via.placeholder.com/512x512/${color}/FFFFFF?text=${icon}`;
};

/**
 * Preload images for better user experience
 */
export const preloadClanImages = async (clans: Clan[]): Promise<void> => {
  const promises = clans.map(clan => generateClanImage({ clan }));
  
  try {
    await Promise.allSettled(promises);
    console.log('Clan images preloaded');
  } catch (error) {
    console.error('Error preloading images:', error);
  }
};

/**
 * Clear expired cache entries
 */
export const clearExpiredCache = (): void => {
  for (const [key, image] of imageCache.entries()) {
    if (!isCacheValid(image)) {
      imageCache.delete(key);
    }
  }
};
