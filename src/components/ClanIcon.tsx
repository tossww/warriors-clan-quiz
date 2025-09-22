'use client';

import { useState, useEffect } from 'react';
import { Clan } from '@/types';

interface ClanIconProps {
  clan: Clan;
  size?: number;
  className?: string;
}

export default function ClanIcon({ clan, size = 160, className = '' }: ClanIconProps) {
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    generateClanIcon();
  }, [clan.id]);

  const generateClanIcon = async () => {
    setIsLoading(true);
    setError(false);

    try {
      // Check if we have a cached icon in localStorage
      const cacheKey = `clan-icon-${clan.id}`;
      const cachedIcon = localStorage.getItem(cacheKey);

      if (cachedIcon) {
        const parsed = JSON.parse(cachedIcon);
        // Check if cache is less than 24 hours old
        if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
          setIconUrl(parsed.url);
          setIsLoading(false);
          return;
        }
      }

      // Generate new icon using Nano Banana
      const response = await fetch('/api/generate-clan-icon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clanId: clan.id,
          clanName: clan.name,
          traits: clan.traits,
          characteristics: clan.characteristics,
          color: clan.color,
        }),
      });

      const data = await response.json();

      if (data.svgData) {
        // Convert SVG to data URL
        const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(data.svgData)}`;
        setIconUrl(svgDataUrl);

        // Cache the icon
        localStorage.setItem(cacheKey, JSON.stringify({
          url: svgDataUrl,
          timestamp: Date.now()
        }));
      } else if (data.iconUrl) {
        setIconUrl(data.iconUrl);

        // Cache the icon URL
        localStorage.setItem(cacheKey, JSON.stringify({
          url: data.iconUrl,
          timestamp: Date.now()
        }));
      } else {
        throw new Error('No icon generated');
      }

    } catch (err) {
      console.error('Failed to generate clan icon:', err);
      setError(true);
      // Use fallback icon
      setIconUrl(createFallbackIcon(clan));
    } finally {
      setIsLoading(false);
    }
  };

  const createFallbackIcon = (clan: Clan): string => {
    const firstLetter = clan.name.charAt(0).toUpperCase();

    const svg = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="grad-${clan.id}" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:${clan.color};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${clan.color};stop-opacity:0.6" />
          </radialGradient>
          <filter id="shadow-${clan.id}">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/>
          </filter>
        </defs>
        <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 4}" fill="url(#grad-${clan.id})" filter="url(#shadow-${clan.id})"/>
        <text x="${size/2}" y="${size/2 + 20}" text-anchor="middle" fill="white" font-size="${size/3}" font-weight="bold" font-family="system-ui, -apple-system, sans-serif">
          ${firstLetter}
        </text>
      </svg>
    `;

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {iconUrl ? (
        <img
          src={iconUrl}
          alt={`${clan.name} icon`}
          className="w-full h-full object-contain"
          onError={() => {
            setError(true);
            setIconUrl(createFallbackIcon(clan));
          }}
        />
      ) : (
        <div
          className="w-full h-full rounded-full flex items-center justify-center text-white font-bold"
          style={{
            backgroundColor: clan.color,
            fontSize: `${size/3}px`
          }}
        >
          {clan.name.charAt(0)}
        </div>
      )}
    </div>
  );
}