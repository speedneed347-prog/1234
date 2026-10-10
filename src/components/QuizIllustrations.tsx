import React from 'react';

export const HeroIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-auto' }) => (
  <svg viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft backdrop ambient glow */}
    <rect width="600" height="400" rx="32" fill="#fffbeb" />
    <circle cx="480" cy="100" r="80" fill="#fef3c7" />
    <circle cx="120" cy="320" r="100" fill="#fed7aa" fillOpacity="0.4" />
    
    {/* Central phone test card */}
    <g transform="translate(180, 40)">
      <rect width="240" height="320" rx="28" fill="#1e293b" />
      <rect x="8" y="8" width="224" height="304" rx="22" fill="#ffffff" />
      
      {/* Phone header */}
      <rect x="70" y="16" width="100" height="6" rx="3" fill="#cbd5e1" />
      <circle cx="120" cy="45" r="20" fill="#f59e0b" />
      <text x="120" y="52" fontSize="18" textAnchor="middle" fill="#ffffff">💖</text>
      
      <rect x="40" y="75" width="160" height="12" rx="6" fill="#0f172a" />
      <rect x="60" y="93" width="120" height="8" rx="4" fill="#94a3b8" />
      
      {/* Interactive Options */}
      <rect x="24" y="115" width="192" height="34" rx="10" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
      <circle cx="44" cy="132" r="9" fill="#e2e8f0" />
      <text x="44" y="136" fontSize="10" textAnchor="middle">🍕</text>
      <rect x="62" y="128" width="100" height="8" rx="4" fill="#475569" />

      {/* Selected Correct option with vibrant pulse */}
      <rect x="24" y="157" width="192" height="34" rx="10" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
      <circle cx="44" cy="174" r="9" fill="#f59e0b" />
      <text x="44" y="178" fontSize="10" textAnchor="middle" fill="#fff">✨</text>
      <rect x="62" y="170" width="120" height="8" rx="4" fill="#92400e" />
      <path d="M196 170L202 176L210 168" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      <rect x="24" y="199" width="192" height="34" rx="10" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
      <circle cx="44" cy="216" r="9" fill="#e2e8f0" />
      <text x="44" y="220" fontSize="10" textAnchor="middle">☕</text>
      <rect x="62" y="212" width="90" height="8" rx="4" fill="#475569" />

      <rect x="24" y="241" width="192" height="34" rx="10" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
      <circle cx="44" cy="258" r="9" fill="#e2e8f0" />
      <text x="44" y="262" fontSize="10" textAnchor="middle">✈️</text>
      <rect x="62" y="254" width="110" height="8" rx="4" fill="#475569" />

      {/* Progress pill */}
      <rect x="50" y="288" width="140" height="12" rx="6" fill="#f1f5f9" />
      <rect x="50" y="288" width="98" height="12" rx="6" fill="#f59e0b" />
    </g>

    {/* Floating Left Friend Card */}
    <g transform="translate(40, 110)">
      <rect width="120" height="110" rx="18" fill="#ffffff" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.05))" stroke="#fef08a" strokeWidth="1.5" />
      <circle cx="60" cy="38" r="22" fill="#fed7aa" />
      <text x="60" y="45" fontSize="20" textAnchor="middle">😎</text>
      <rect x="20" y="70" width="80" height="8" rx="4" fill="#0f172a" />
      <text x="60" y="96" fontSize="12" fontWeight="bold" fill="#f59e0b" textAnchor="middle">Score: 90%</text>
    </g>

    {/* Floating Right Trophy Badge */}
    <g transform="translate(440, 120)">
      <rect width="120" height="110" rx="18" fill="#ffffff" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.05))" stroke="#fed7aa" strokeWidth="1.5" />
      <circle cx="60" cy="38" r="22" fill="#fef3c7" />
      <text x="60" y="46" fontSize="20" textAnchor="middle">🏆</text>
      <text x="60" y="75" fontSize="11" fontWeight="bold" fill="#0f172a" textAnchor="middle">#1 Soulmate</text>
      <text x="60" y="93" fontSize="10" fill="#64748b" textAnchor="middle">Podium Gold</text>
    </g>

    {/* Cheerful Decorative floating stars & sparks */}
    <path d="M120 70L124 82L136 86L124 90L120 102L116 90L104 86L116 82Z" fill="#f59e0b" />
    <path d="M470 290L473 300L483 303L473 306L470 316L467 306L457 303L467 300Z" fill="#ec4899" />
    <circle cx="160" cy="270" r="6" fill="#f43f5e" />
    <circle cx="430" cy="80" r="5" fill="#3b82f6" />
  </svg>
);

export const PodiumTrophyIllustration: React.FC<{ className?: string }> = ({ className = 'w-32 h-32' }) => (
  <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="80" cy="80" r="70" fill="#fef3c7" />
    <path d="M45 45H115V80C115 99.33 99.33 115 80 115C60.67 115 45 99.33 45 80V45Z" fill="#f59e0b" />
    <path d="M30 55C30 50 35 48 45 48V72C35 72 30 68 30 55Z" stroke="#d97706" strokeWidth="6" strokeLinecap="round" />
    <path d="M130 55C130 50 125 48 115 48V72C125 72 130 68 130 55Z" stroke="#d97706" strokeWidth="6" strokeLinecap="round" />
    <rect x="68" y="115" width="24" height="22" fill="#d97706" rx="3" />
    <rect x="50" y="134" width="60" height="14" rx="6" fill="#78350f" />
    <text x="80" y="86" fontSize="24" fontWeight="900" fill="#ffffff" textAnchor="middle">1</text>
    <path d="M80 25L84 34L94 36L87 43L89 53L80 48L71 53L73 43L66 36L76 34Z" fill="#fbbf24" />
  </svg>
);
