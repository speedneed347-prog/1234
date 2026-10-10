export interface PresetGif {
  id: string;
  title: string;
  titleBn: string;
  category: 'cats' | 'celebration' | 'reactions' | 'love' | 'food' | 'vibes';
  url: string;
  previewUrl: string;
}

export const PRESET_GIFS: PresetGif[] = [
  {
    id: 'gif-waving-cat',
    title: 'Waving Cute Cat (Milo)',
    titleBn: 'হাত নাড়ানো কিউট বিড়াল',
    category: 'cats',
    url: 'https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif',
  },
  {
    id: 'gif-bongo-cat',
    title: 'Bongo Cat Vibing',
    titleBn: 'বঙ্গো ক্যাট ডান্স',
    category: 'cats',
    url: 'https://media.giphy.com/media/jpbnoe3UIa8TU8LM13/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/jpbnoe3UIa8TU8LM13/giphy.gif',
  },
  {
    id: 'gif-cat-high-five',
    title: 'Cat Paw High Five (Luna)',
    titleBn: 'বিড়ালের হাই ফাইভ',
    category: 'reactions',
    url: 'https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif',
  },
  {
    id: 'gif-thumbs-up',
    title: 'Thumbs Up Kitty',
    titleBn: 'থাম্বস আপ কিটি',
    category: 'reactions',
    url: 'https://media.giphy.com/media/111ebonMs90YLu/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/111ebonMs90YLu/giphy.gif',
  },
  {
    id: 'gif-confetti',
    title: 'Confetti Party Burst',
    titleBn: 'কনফেটি সেলিব্রেশন',
    category: 'celebration',
    url: 'https://media.giphy.com/media/26tOZ42Mg6pbTUPHW/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/26tOZ42Mg6pbTUPHW/giphy.gif',
  },
  {
    id: 'gif-sparkles',
    title: 'Magic Sparkles',
    titleBn: 'ম্যাজিক স্পার্কল',
    category: 'celebration',
    url: 'https://media.giphy.com/media/3o7TKMt1VVNkHV2PaE/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/3o7TKMt1VVNkHV2PaE/giphy.gif',
  },
  {
    id: 'gif-heart-love',
    title: 'Heart Pulse Love',
    titleBn: 'হার্ট বিট লাভ',
    category: 'love',
    url: 'https://media.giphy.com/media/M90mJvfWfd5mbUuULX/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/M90mJvfWfd5mbUuULX/giphy.gif',
  },
  {
    id: 'gif-popcorn-cheer',
    title: 'Excited Popcorn Cat',
    titleBn: 'উত্তেজিত পপকর্ন বিড়াল',
    category: 'cats',
    url: 'https://media.giphy.com/media/vFKqnCdLPNOKc/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/vFKqnCdLPNOKc/giphy.gif',
  },
  {
    id: 'gif-trophy',
    title: 'Trophy Winner Celebration',
    titleBn: 'চ্যাম্পিয়ন ট্রফি সেলিব্রেশন',
    category: 'celebration',
    url: 'https://media.giphy.com/media/artj92V8o75VPL7AeQ/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/artj92V8o75VPL7AeQ/giphy.gif',
  },
  {
    id: 'gif-thinking-cat',
    title: 'Thinking Questioning Cat',
    titleBn: 'চিন্তিত বিড়াল ভাবছে',
    category: 'reactions',
    url: 'https://media.giphy.com/media/3o7bu3XilJ5BOiSGic/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/3o7bu3XilJ5BOiSGic/giphy.gif',
  },
  {
    id: 'gif-vibing-headbob',
    title: 'Cat Vibing Jam',
    titleBn: 'ক্যাট ভাইব ও মিউজিক',
    category: 'vibes',
    url: 'https://media.giphy.com/media/GeimqsH0TLDt4tScGw/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/GeimqsH0TLDt4tScGw/giphy.gif',
  },
];

export const PRESET_STICKERS = [
  { id: 'stk-heart', emoji: '💖', label: 'Heart Sparkle' },
  { id: 'stk-cat-boy', emoji: '🐱🧢', label: 'Milo Boy Cat' },
  { id: 'stk-cat-girl', emoji: '🐱🌸', label: 'Luna Girl Cat' },
  { id: 'stk-crown', emoji: '👑', label: 'Crown Bestie' },
  { id: 'stk-fire', emoji: '🔥', label: 'Hot Streak' },
  { id: 'stk-star', emoji: '⭐', label: 'Super Star' },
  { id: 'stk-party', emoji: '🎉', label: 'Party Time' },
  { id: 'stk-paw', emoji: '🐾', label: 'Paw Print' },
  { id: 'stk-trophy', emoji: '🏆', label: 'Trophy' },
  { id: 'stk-cupcake', emoji: '🧁', label: 'Sweet Treat' },
];

export const SITE_PAGES = [
  { id: 'home', name: 'Home Page', nameBn: 'হোম পেজ', path: '/' },
  { id: 'quiz-landing', name: 'Quiz Landing Page', nameBn: 'কুইজ ল্যান্ডিং পেজ', path: '/quiz/bm-maya26' },
  { id: 'quiz-play', name: 'Quiz Play Page', nameBn: 'কুইজ খেলা পেজ', path: '/quiz/bm-maya26/play' },
  { id: 'quiz-result', name: 'Quiz Result Page', nameBn: 'ফলাফল পেজ', path: '/quiz/bm-maya26/scoreboard' },
  { id: 'quiz-scoreboard', name: 'Scoreboard Page', nameBn: 'লিডারবোর্ড পেজ', path: '/quiz/bm-maya26/scoreboard' },
  { id: 'create', name: 'Create Quiz Page', nameBn: 'কুইজ তৈরি পেজ', path: '/create' },
  { id: 'dashboard', name: 'Creator Dashboard', nameBn: 'ক্রিয়েটর ড্যাশবোর্ড', path: '/dashboard/bm-maya26' },
  { id: 'contact', name: 'Contact Us', nameBn: 'যোগাযোগ পেজ', path: '/contact' },
  { id: 'privacy', name: 'Privacy Policy', nameBn: 'গোপনীয়তা নীতি', path: '/privacy' },
  { id: 'terms', name: 'Terms of Service', nameBn: 'শর্তাবলী পেজ', path: '/terms' },
];

/**
 * Returns a high-quality animated GIF or image for quiz options
 * ensuring EVERY option always has a big, gorgeous, funny visual!
 */
export function getOptionVisualGif(text: string, emoji?: string, fallbackIndex = 0): string {
  const t = (text || '').toLowerCase();

  if (t.includes('coffee') || t.includes('চা') || t.includes('কফি')) {
    return 'https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif';
  }
  if (t.includes('pizza') || t.includes('পিৎজা') || t.includes('food') || t.includes('খাবার')) {
    return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80';
  }
  if (t.includes('sleep') || t.includes('ঘুমানো') || t.includes('bed') || t.includes('বিছানা')) {
    return 'https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif';
  }
  if (t.includes('party') || t.includes('পার্টি') || t.includes('dance') || t.includes('নাচ')) {
    return 'https://media.giphy.com/media/26tOZ42Mg6pbTUPHW/giphy.gif';
  }
  if (t.includes('game') || t.includes('গেমিং') || t.includes('video')) {
    return 'https://media.giphy.com/media/jpbnoe3UIa8TU8LM13/giphy.gif';
  }
  if (t.includes('love') || t.includes('ভালোবাসা') || t.includes('heart') || t.includes('ক্রাশ')) {
    return 'https://media.giphy.com/media/M90mJvfWfd5mbUuULX/giphy.gif';
  }
  if (t.includes('cat') || t.includes('বিড়াল') || t.includes('milo') || t.includes('luna')) {
    return 'https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif';
  }
  if (t.includes('beach') || t.includes('travel') || t.includes('ট্যুর') || t.includes('সমুদ্র')) {
    return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80';
  }
  if (t.includes('noodle') || t.includes('নুডুলস') || t.includes('chips') || t.includes('ঝাল')) {
    return 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80';
  }
  if (t.includes('ice cream') || t.includes('আইসক্রিম') || t.includes('মিষ্টি')) {
    return 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80';
  }

  // Fallback gif rotation
  const fallbackList = [
    'https://media.giphy.com/media/jpbnoe3UIa8TU8LM13/giphy.gif',
    'https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif',
    'https://media.giphy.com/media/111ebonMs90YLu/giphy.gif',
    'https://media.giphy.com/media/vFKqnCdLPNOKc/giphy.gif',
    'https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif',
    'https://media.giphy.com/media/3o7TKMt1VVNkHV2PaE/giphy.gif',
  ];

  return fallbackList[Math.abs(fallbackIndex) % fallbackList.length];
}
