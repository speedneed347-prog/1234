export interface BankQuestion {
  id: string;
  category: string;
  categoryBn?: string;
  text: string;
  textBn?: string;
  emoji: string;
  options: { id: string; text: string; textBn?: string; emoji?: string; imageUrl?: string }[];
}

export const QUESTION_BANK: BankQuestion[] = [
  {
    id: 'qb-1',
    category: 'Habits & Mornings',
    categoryBn: 'অভ্যাস ও সকাল',
    text: 'What is my morning routine reality?',
    textBn: 'আমার সকালের আসল রুটিন কোনটা?',
    emoji: '☀️',
    options: [
      { id: 'opt-1', text: 'Hits snooze at least 5 times', textBn: 'কমপক্ষে ৫ বার অ্যালার্ম স্নুজ করা', emoji: '⏰' },
      { id: 'opt-2', text: 'Instantly checks notifications in bed', textBn: 'বিছানায় শুয়েই নোটিফিকেশন চেক করা', emoji: '📱' },
      { id: 'opt-3', text: 'Needs a caffeine ritual before speaking', textBn: 'কথা বলার আগে চা বা কফি লাগবেই', emoji: '☕' },
      { id: 'opt-4', text: 'Miraculously jumps out of bed energetic', textBn: 'অলৌকিকভাবে এনার্জি নিয়ে লাফিয়ে ওঠা', emoji: '⚡' },
    ],
  },
  {
    id: 'qb-2',
    category: 'Food & Snacking',
    categoryBn: 'খাবার ও নাস্তা',
    text: 'What is my ultimate comfort midnight snack?',
    textBn: 'মধ্যরাতের আমার সেরা কমফোর্ট স্ন্যাক কোনটা?',
    emoji: '🍕',
    options: [
      { id: 'opt-1', text: 'Instant noodles / ramen bowl', textBn: 'ইনস্ট্যান্ট নুডুলস বা গরম স্যুপ', emoji: '🍜', imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=200&auto=format&fit=crop&q=60' },
      { id: 'opt-2', text: 'A whole bag of spicy chips', textBn: 'এক প্যাকেট ঝাল চিপস', emoji: '🌶️', imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200&auto=format&fit=crop&q=60' },
      { id: 'opt-3', text: 'Ice cream tub straight from freezer', textBn: 'ফ্রিজ থেকে আইসক্রিম টাব', emoji: '🍨', imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=200&auto=format&fit=crop&q=60' },
      { id: 'opt-4', text: 'Leftover pizza slices', textBn: 'আগের রাতের পিৎজা স্লাইস', emoji: '🍕', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&auto=format&fit=crop&q=60' },
    ],
  },
  {
    id: 'qb-3',
    category: 'Travel & Adventures',
    text: 'If I won an all-expenses-paid trip tomorrow, where am I going?',
    emoji: '✈️',
    options: [
      { id: 'opt-1', text: 'Tokyo night markets & anime cafes', emoji: '🗾' },
      { id: 'opt-2', text: 'Cozy alpine cabin in the snowy mountains', emoji: '🏔️' },
      { id: 'opt-3', text: 'Tropical beach resort with unlimited smoothies', emoji: '🏖️' },
      { id: 'opt-4', text: 'Historic European city stroll with pastries', emoji: '🥐' },
    ],
  },
  {
    id: 'qb-4',
    category: 'Social & Hangouts',
    text: 'What is my ideal Saturday night vibe?',
    emoji: '🎉',
    options: [
      { id: 'opt-1', text: 'Chaotic game night with close besties', emoji: '🎲' },
      { id: 'opt-2', text: 'Binging a drama series in fuzzy pajamas', emoji: '🛋️' },
      { id: 'opt-3', text: 'Exploring concerts, parties or buzzing venues', emoji: '🪩' },
      { id: 'opt-4', text: 'Deep 2 AM life chats at a diner or car ride', emoji: '🚗' },
    ],
  },
  {
    id: 'qb-5',
    category: 'Quirks & Flaws',
    text: 'What is my most predictable bad habit?',
    emoji: '🙈',
    options: [
      { id: 'opt-1', text: 'Saying "I am leaving now" while still in pyjamas', emoji: '⏳' },
      { id: 'opt-2', text: 'Leaving 47 open browser tabs forever', emoji: '💻' },
      { id: 'opt-3', text: 'Impulsive online shopping after midnight', emoji: '📦' },
      { id: 'opt-4', text: 'Typing out a text and forgetting to press send', emoji: '💬' },
    ],
  },
  {
    id: 'qb-6',
    category: 'Stress & Emotions',
    text: 'How do I cope when life gets super stressful?',
    emoji: '💆',
    options: [
      { id: 'opt-1', text: 'Ranting passionately to best friends for an hour', emoji: '🗣️' },
      { id: 'opt-2', text: 'Going completely silent into hermit mode', emoji: '📴' },
      { id: 'opt-3', text: 'Aggressive retail or food therapy', emoji: '🛍️' },
      { id: 'opt-4', text: 'Blasting my playlist at maximum volume', emoji: '🎧' },
    ],
  },
  {
    id: 'qb-7',
    category: 'Entertainment & Pop Culture',
    text: 'Which genre dominates my watch history?',
    emoji: '🍿',
    options: [
      { id: 'opt-1', text: 'True crime documentaries & mysteries', emoji: '🔍' },
      { id: 'opt-2', text: 'Cheesy romantic comedies or sitcom reruns', emoji: '💖' },
      { id: 'opt-3', text: 'Sci-fi, thrillers & fantasy epics', emoji: '🚀' },
      { id: 'opt-4', text: 'Anime, animated movies & cartoons', emoji: '🎨' },
    ],
  },
  {
    id: 'qb-8',
    category: 'Hypothetical Dilemmas',
    text: 'In a zombie apocalypse, what is my honest fate?',
    emoji: '🧟',
    options: [
      { id: 'opt-1', text: 'Accidentally gets bitten trying to save a pet', emoji: '🐕' },
      { id: 'opt-2', text: 'The resourceful strategist who survives till the end', emoji: '🛡️' },
      { id: 'opt-3', text: 'Builds a cozy underground fortress with snacks', emoji: '🏰' },
      { id: 'opt-4', text: 'First one to panic and sprint in the wrong direction', emoji: '🏃' },
    ],
  },
  {
    id: 'qb-9',
    category: 'Dreams & Goals',
    text: 'What secret dream would I pursue if money was no object?',
    emoji: '🌟',
    options: [
      { id: 'opt-1', text: 'Opening an aesthetic bakery or plant cafe', emoji: '🪴' },
      { id: 'opt-2', text: 'Traveling non-stop to document the whole world', emoji: '🧭' },
      { id: 'opt-3', text: 'Writing a novel, directing a film or making art', emoji: '📚' },
      { id: 'opt-4', text: 'Building an animal rescue sanctuary', emoji: '🐾' },
    ],
  },
  {
    id: 'qb-10',
    category: 'Friendship Dynamics',
    text: 'What role do I naturally play in our friend group?',
    emoji: '👯',
    options: [
      { id: 'opt-1', text: 'The group "parent" with band-aids and snacks', emoji: '🩹' },
      { id: 'opt-2', text: 'The chaotic entertainer sparking spontaneous ideas', emoji: '💥' },
      { id: 'opt-3', text: 'The therapist who listens without judgement', emoji: '👂' },
      { id: 'opt-4', text: 'The reliable navigator and organizer', emoji: '🗺️' },
    ],
  },
  {
    id: 'qb-11',
    category: 'Pet Peeves',
    text: 'What instantly ruins my good mood?',
    emoji: '😤',
    options: [
      { id: 'opt-1', text: 'Slow walkers blocking the entire sidewalk', emoji: '🚶' },
      { id: 'opt-2', text: 'People who interrupt repeatedly in conversations', emoji: '🛑' },
      { id: 'opt-3', text: 'Unreliable plans canceled at the very last second', emoji: '❌' },
      { id: 'opt-4', text: 'Unsolicited life advice from strangers', emoji: '🙅' },
    ],
  },
  {
    id: 'qb-12',
    category: 'Music & Vibes',
    text: 'When I am passed the AUX cord in the car, expect:',
    emoji: '🎶',
    options: [
      { id: 'opt-1', text: 'Nostalgic 2000s/2010s throwback bops', emoji: '📻' },
      { id: 'opt-2', text: 'Indie, lofi or moody acoustic ballads', emoji: '🎸' },
      { id: 'opt-3', text: 'High-energy hip-hop or pop dance tracks', emoji: '🔥' },
      { id: 'opt-4', text: 'A chaotic rollercoaster playlist with zero genre limits', emoji: '🎢' },
    ],
  },
];
