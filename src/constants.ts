export const COLORS = [
  '#FF4B4B', // Red
  '#FF9F29', // Orange
  '#FFD93D', // Yellow
  '#6BCB77', // Green
  '#4D96FF', // Blue
  '#9B72AA', // Purple
  '#FF87CA', // Pink
  '#474747', // Dark Gray
  '#FFFFFF', // White
];

export const BRUSH_SIZES = [
  { id: 'xxs', size: 2, label: 'זעיר' },
  { id: 'xs', size: 6, label: 'קטן מאוד' },
  { id: 'sm', size: 14, label: 'קטן' },
  { id: 'md', size: 26, label: 'בינוני' },
  { id: 'lg', size: 42, label: 'גדול' },
  { id: 'xl', size: 64, label: 'גדול מאוד' },
];

export const CATEGORIES = [
  { id: 'animals', name: 'חיות', icon: '🐾' },
  { id: 'princesses', name: 'נסיכות', icon: '👑' },
];

export interface Template {
  id: string;
  name: string;
  icon: string;
  url: string | null;
}

export const TEMPLATES: Record<string, Template[]> = {
  animals: [
    { id: 'none', name: 'דף חלק', icon: '📄', url: null },
    { id: 'dog', name: 'כלב', icon: '🐶', url: '/templates/puppy.svg' },
    { id: 'cat', name: 'חתול', icon: '🐱', url: '/templates/cat_v2.svg' },
    { id: 'lion', name: 'אריה', icon: '🦁', url: '/templates/lion_v2.svg' },
    { id: 'elephant', name: 'פיל', icon: '🐘', url: '/templates/elephant_v2.svg' },
    { id: 'bird', name: 'ציפור', icon: '🐦', url: '/templates/bird_v2.svg' },
    { id: 'owl', name: 'ינשוף', icon: '🦉', url: '/templates/owl_v2.svg' },
    { id: 'turtle', name: 'צב', icon: '🐢', url: '/templates/turtle_v2.svg' },
    { id: 'rabbit', name: 'ארנב', icon: '🐰', url: '/templates/rabbit_v2.svg' },
    { id: 'fish', name: 'דג', icon: '🐟', url: '/templates/fish_v2.svg' },
    { id: 'butterfly', name: 'פרפר', icon: '🦋', url: '/templates/butterfly_v2.svg' },
  ],
  princesses: [
    { id: 'none_p', name: 'דף חלק', icon: '📄', url: null },
    { id: 'princess', name: 'נסיכה', icon: '👸', url: '/templates/princess_v2.svg' },
    { id: 'castle', name: 'טירה', icon: '🏰', url: '/templates/castle_v2.svg' },
    { id: 'fairy', name: 'פיה', icon: '🧚', url: '/templates/fairy_v2.svg' },
    { id: 'unicorn', name: 'חד קרן', icon: '🦄', url: '/templates/unicorn_v2.svg' },
    { id: 'mermaid', name: 'בת הים', icon: '🧜‍♀️', url: '/templates/mermaid_v2.svg' },
    { id: 'carriage', name: 'כרכרה', icon: '🎠', url: '/templates/carriage_v2.svg' },
    { id: 'crown', name: 'כתר', icon: '👑', url: '/templates/crown_v2.svg' },
    { id: 'flower', name: 'פרח', icon: '🌸', url: '/templates/flower_v2.svg' },
    { id: 'tree', name: 'עץ', icon: '🌳', url: '/templates/tree_v2.svg' },
    { id: 'mountain', name: 'נוף', icon: '🏔️', url: '/templates/mountain_v2.svg' },
  ]
};
