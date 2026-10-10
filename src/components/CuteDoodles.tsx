import React from 'react';

export const CloudDoodle: React.FC<{ className?: string; opacity?: number }> = ({
  className = 'w-16 h-10',
  opacity = 1,
}) => (
  <svg
    viewBox="0 0 100 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} select-none pointer-events-none`}
    style={{ opacity }}
  >
    <path
      d="M20 45C11.7 45 5 38.3 5 30C5 22.3 10.8 16 18.3 15.1C20.6 6.5 28.5 0 38 0C46.8 0 54.2 5.5 57.1 13.3C60.2 11.2 64 10 68 10C77.4 10 85 17.6 85 27C85 27.7 84.9 28.3 84.8 29C90.5 30.7 95 36.3 95 43C95 51.3 88.3 58 80 58L20 58C11.7 58 5 51.3 5 43"
      fill="#FFFFFF"
      stroke="#DFE8F2"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
  </svg>
);

export const StarDoodle: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-6 h-6',
  color = '#FFE779',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} select-none pointer-events-none drop-shadow-xs`}
  >
    <path
      d="M12 2L14.8 8.2L21.5 9L16.4 13.5L17.9 20L12 16.6L6.1 20L7.6 13.5L2.5 9L9.2 8.2L12 2Z"
      fill={color}
      stroke="#202B49"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

export const HeartDoodle: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-5 h-5',
  color = '#FF5793',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} select-none pointer-events-none drop-shadow-xs`}
  >
    <path
      d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
      fill={color}
      stroke="#202B49"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

export const WashiTapeDoodle: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-24 h-6',
  color = '#FFE779',
}) => (
  <svg
    viewBox="0 0 100 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} select-none pointer-events-none`}
  >
    <path
      d="M3 4L0 12L3 20H97L100 12L97 4H3Z"
      fill={color}
      fillOpacity="0.85"
      stroke="#202B49"
      strokeWidth="1.2"
      strokeDasharray="2 2"
    />
  </svg>
);

export const SparkleDoodle: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-5 h-5',
  color = '#FF5793',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} select-none pointer-events-none`}
  >
    <path
      d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9L12 0Z"
      fill={color}
    />
  </svg>
);
