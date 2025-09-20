import { Clan } from '@/types';

export const clans: Clan[] = [
  {
    id: 'thunderclan',
    name: 'ThunderClan',
    traits: ['Brave', 'Loyal', 'Protective', 'Forest-dwelling'],
    characteristics: ['Strong sense of justice', 'Fierce warriors', 'Traditional values'],
    color: '#059669', // Emerald green - vibrant forest green
    icon: '⚡', // Thunder/lightning bolt
    description: 'ThunderClan cats are known for their courage and loyalty. They live in the forest and value honor above all else, always ready to defend their clan and the warrior code.'
  },
  {
    id: 'riverclan',
    name: 'RiverClan',
    traits: ['Adaptable', 'Clever', 'Water-loving', 'Peaceful'],
    characteristics: ['Excellent swimmers', 'Diplomatic', 'Resourceful'],
    color: '#0284C7', // Sky blue - clear river water
    icon: '🌊', // Water wave
    description: 'RiverClan cats are graceful and adaptable, with a deep connection to water. They are known for their swimming abilities and diplomatic approach to conflicts.'
  },
  {
    id: 'windclan',
    name: 'WindClan',
    traits: ['Fast', 'Independent', 'Proud', 'Moor-dwelling'],
    characteristics: ['Swift runners', 'Close-knit community', 'Resilient'],
    color: '#EAB308', // Amber yellow - golden moor grass
    icon: '💨', // Wind/dash symbol
    description: 'WindClan cats are swift and independent, living on the open moors. They value freedom and are known for their incredible speed and endurance.'
  },
  {
    id: 'shadowclan',
    name: 'ShadowClan',
    traits: ['Ambitious', 'Cunning', 'Mysterious', 'Marsh-dwelling'],
    characteristics: ['Strategic thinkers', 'Adaptable to harsh conditions', 'Fierce loyalty'],
    color: '#7C3AED', // Violet purple - mysterious shadows
    icon: '🌙', // Crescent moon for shadows/night
    description: 'ShadowClan cats are cunning and ambitious, dwelling in the shadowy marshes. They are strategic thinkers who adapt well to challenging environments.'
  },
  {
    id: 'skyclan',
    name: 'SkyClan',
    traits: ['Agile', 'Innovative', 'Tree-climbing', 'Adaptable'],
    characteristics: ['Excellent climbers', 'Creative problem-solvers', 'Strong family bonds', 'Resilient survivors'],
    color: '#DC2626', // Bright red - vibrant autumn leaves
    icon: '🍃', // Leaf for trees/climbing
    description: 'SkyClan cats are agile tree-climbers with innovative spirits. They have strong family bonds and are known for their ability to adapt and survive against all odds.'
  },
  {
    id: 'tribe',
    name: 'Tribe of Rushing Water',
    traits: ['Spiritual', 'Mountain-dwelling', 'Close to nature', 'Traditional'],
    characteristics: ['Deep connection to ancestors', 'Mountain survival skills', 'Communal living', 'Respect for natural order'],
    color: '#475569', // Slate gray - mountain stone and mist
    icon: '⛰️', // Mountain
    description: 'The Tribe of Rushing Water lives high in the mountains, maintaining ancient traditions and a deep spiritual connection to their ancestors and the natural world.'
  }
];

export const getClanById = (id: string): Clan | undefined => {
  return clans.find(clan => clan.id === id);
};

export const getClanByName = (name: string): Clan | undefined => {
  return clans.find(clan => clan.name === name);
};
