import { Question } from '@/types';

export const questions: Question[] = [
  {
    id: 'environment',
    text: 'What environment do you feel most comfortable in?',
    answers: [
      { id: 'env_forest', text: 'Dense forest with tall trees', clanId: 'thunderclan' },
      { id: 'env_moor', text: 'Open moorland with rolling hills', clanId: 'windclan' },
      { id: 'env_river', text: 'Rivers and streams with flowing water', clanId: 'riverclan' },
      { id: 'env_marsh', text: 'Dark marshes and shadowy areas', clanId: 'shadowclan' },
      { id: 'env_cliffs', text: 'High cliffs and rocky terrain', clanId: 'skyclan' },
      { id: 'env_mountain', text: 'Mountain caves and rushing waterfalls', clanId: 'tribe' }
    ]
  },
  {
    id: 'territory_intruder',
    text: 'If you find a cat from another clan in your territory, what would you do?',
    answers: [
      { id: 'intruder_challenge', text: 'Challenge them immediately and demand they leave', clanId: 'thunderclan' },
      { id: 'intruder_observe', text: 'Observe from a distance and report to leadership', clanId: 'windclan' },
      { id: 'intruder_diplomatic', text: 'Approach diplomatically to understand their purpose', clanId: 'riverclan' },
      { id: 'intruder_stealth', text: 'Use stealth to track their movements', clanId: 'shadowclan' },
      { id: 'intruder_height', text: 'Climb to higher ground for tactical advantage', clanId: 'skyclan' },
      { id: 'intruder_ancestors', text: 'Consult with ancestors for guidance', clanId: 'tribe' }
    ]
  },
  {
    id: 'conflict_resolution',
    text: 'How do you prefer to resolve conflicts?',
    answers: [
      { id: 'conflict_courage', text: 'Face challenges head-on with courage', clanId: 'thunderclan' },
      { id: 'conflict_speed', text: 'Use speed and agility to outmaneuver problems', clanId: 'windclan' },
      { id: 'conflict_diplomatic', text: 'Find diplomatic solutions through communication', clanId: 'riverclan' },
      { id: 'conflict_strategy', text: 'Use strategy and cunning to overcome obstacles', clanId: 'shadowclan' },
      { id: 'conflict_creative', text: 'Think creatively and find unconventional solutions', clanId: 'skyclan' },
      { id: 'conflict_spiritual', text: 'Seek wisdom from spiritual guidance', clanId: 'tribe' }
    ]
  },
  {
    id: 'leadership',
    text: 'What is your approach to leadership?',
    answers: [
      { id: 'lead_moral', text: 'Lead by example with strong moral principles', clanId: 'thunderclan' },
      { id: 'lead_quick', text: 'Lead through quick decision-making and independence', clanId: 'windclan' },
      { id: 'lead_collaborate', text: 'Lead through collaboration and consensus-building', clanId: 'riverclan' },
      { id: 'lead_strategic', text: 'Lead through careful planning and strategic thinking', clanId: 'shadowclan' },
      { id: 'lead_innovative', text: 'Lead through innovation and adaptability', clanId: 'skyclan' },
      { id: 'lead_spiritual', text: 'Lead through spiritual connection and tradition', clanId: 'tribe' }
    ]
  },
  {
    id: 'social_preferences',
    text: 'What type of social environment do you prefer?',
    answers: [
      { id: 'social_community', text: 'Large, close-knit community gatherings', clanId: 'thunderclan' },
      { id: 'social_family', text: 'Small, tight family groups', clanId: 'windclan' },
      { id: 'social_harmony', text: 'Peaceful, harmonious group activities', clanId: 'riverclan' },
      { id: 'social_strategic', text: 'Selective, strategic alliances', clanId: 'shadowclan' },
      { id: 'social_creative', text: 'Creative, collaborative problem-solving groups', clanId: 'skyclan' },
      { id: 'social_spiritual', text: 'Spiritual ceremonies and ancestor worship', clanId: 'tribe' }
    ]
  },
  {
    id: 'danger_response',
    text: 'How do you respond to danger?',
    answers: [
      { id: 'danger_fight', text: 'Stand and fight to protect others', clanId: 'thunderclan' },
      { id: 'danger_speed', text: 'Use speed to escape and regroup', clanId: 'windclan' },
      { id: 'danger_peaceful', text: 'Seek peaceful resolution or retreat to water', clanId: 'riverclan' },
      { id: 'danger_cunning', text: 'Use cunning and shadows to avoid or counter', clanId: 'shadowclan' },
      { id: 'danger_climb', text: 'Climb to safety and assess from above', clanId: 'skyclan' },
      { id: 'danger_spirits', text: 'Call upon ancestral spirits for protection', clanId: 'tribe' }
    ]
  },
  {
    id: 'communication',
    text: 'What is your communication style?',
    answers: [
      { id: 'comm_direct', text: 'Direct and honest, with strong convictions', clanId: 'thunderclan' },
      { id: 'comm_quick', text: 'Quick and to-the-point', clanId: 'windclan' },
      { id: 'comm_diplomatic', text: 'Diplomatic and considerate of others', clanId: 'riverclan' },
      { id: 'comm_strategic', text: 'Strategic and sometimes secretive', clanId: 'shadowclan' },
      { id: 'comm_creative', text: 'Creative and expressive', clanId: 'skyclan' },
      { id: 'comm_spiritual', text: 'Thoughtful and spiritual', clanId: 'tribe' }
    ]
  },
  {
    id: 'training',
    text: 'What type of training appeals to you most?',
    answers: [
      { id: 'train_combat', text: 'Combat skills and warrior training', clanId: 'thunderclan' },
      { id: 'train_speed', text: 'Speed and agility exercises', clanId: 'windclan' },
      { id: 'train_swimming', text: 'Swimming and water skills', clanId: 'riverclan' },
      { id: 'train_stealth', text: 'Stealth and night hunting', clanId: 'shadowclan' },
      { id: 'train_climbing', text: 'Climbing and aerial maneuvers', clanId: 'skyclan' },
      { id: 'train_spiritual', text: 'Spiritual practices and mountain survival', clanId: 'tribe' }
    ]
  },
  {
    id: 'loyalty',
    text: 'Where do your loyalties lie?',
    answers: [
      { id: 'loyal_clan', text: 'Clan above all, following the warrior code', clanId: 'thunderclan' },
      { id: 'loyal_freedom', text: 'Personal freedom while respecting the group', clanId: 'windclan' },
      { id: 'loyal_peace', text: 'Peaceful coexistence with all', clanId: 'riverclan' },
      { id: 'loyal_strategic', text: 'Strategic alliances that benefit the clan', clanId: 'shadowclan' },
      { id: 'loyal_family', text: 'Family bonds and innovative survival', clanId: 'skyclan' },
      { id: 'loyal_ancestors', text: 'Ancestral traditions and spiritual duties', clanId: 'tribe' }
    ]
  },
  {
    id: 'teaching',
    text: 'How would you teach an apprentice?',
    answers: [
      { id: 'teach_discipline', text: 'Strict discipline with emphasis on honor', clanId: 'thunderclan' },
      { id: 'teach_independence', text: 'Encourage independence and quick thinking', clanId: 'windclan' },
      { id: 'teach_patience', text: 'Patient guidance with emphasis on cooperation', clanId: 'riverclan' },
      { id: 'teach_strategic', text: 'Strategic thinking and careful planning', clanId: 'shadowclan' },
      { id: 'teach_creative', text: 'Creative problem-solving and adaptability', clanId: 'skyclan' },
      { id: 'teach_wisdom', text: 'Spiritual wisdom and respect for tradition', clanId: 'tribe' }
    ]
  },
  {
    id: 'herbs',
    text: 'When gathering herbs and medicine, you focus on:',
    answers: [
      { id: 'herbs_forest', text: 'Common forest remedies', clanId: 'thunderclan' },
      { id: 'herbs_accessible', text: 'Quick gathering of easily accessible herbs', clanId: 'windclan' },
      { id: 'herbs_water', text: 'Water plants and riverside medicines', clanId: 'riverclan' },
      { id: 'herbs_rare', text: 'Rare herbs found in dark, hidden places', clanId: 'shadowclan' },
      { id: 'herbs_tree', text: 'Tree bark and aerial plant medicines', clanId: 'skyclan' },
      { id: 'herbs_sacred', text: 'Sacred mountain herbs with spiritual properties', clanId: 'tribe' }
    ]
  }
];

export const getRandomQuestions = (count: number = 10): Question[] => {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, questions.length));
};

export const shuffleAnswers = (answers: Question['answers']): Question['answers'] => {
  return [...answers].sort(() => Math.random() - 0.5);
};

