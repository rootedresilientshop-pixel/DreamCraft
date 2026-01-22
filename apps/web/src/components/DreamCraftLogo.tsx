import React from 'react';

interface DreamCraftLogoProps {
  size?: number;
  variant?: 'icon' | 'full';
}

export default function DreamCraftLogo({ size = 48, variant = 'icon' }: DreamCraftLogoProps) {
  if (variant === 'full') {
    return (
      <div style={styles.fullContainer}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={styles.svg}
        >
          {/* Outer circle - gradient base */}
          <defs>
            <linearGradient id="dreamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff9800" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#e91e63" />
            </linearGradient>
            <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background circle */}
          <circle cx="50" cy="50" r="48" fill="url(#dreamGradient)" />
          <circle cx="50" cy="50" r="48" fill="url(#glowGradient)" />

          {/* Star for dream/creativity */}
          <path
            d="M 50 20 L 58 40 L 80 40 L 63 52 L 71 72 L 50 60 L 29 72 L 37 52 L 20 40 L 42 40 Z"
            fill="#fff"
          />

          {/* Lightbulb idea element inside */}
          <circle cx="50" cy="60" r="8" fill="rgba(255,255,255,0.8)" />
          <rect x="48" y="68" width="4" height="6" fill="rgba(255,255,255,0.8)" />
          <rect x="50" y="68" width="4" height="6" fill="rgba(255,255,255,0.8)" />
        </svg>
        <span style={styles.fullText}>DreamCraft</span>
      </div>
    );
  }

  // Icon variant (smaller, just the mark)
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={styles.svg}
    >
      <defs>
        <linearGradient id="dreamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff9800" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#e91e63" />
        </linearGradient>
        <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background circle */}
      <circle cx="50" cy="50" r="48" fill="url(#dreamGradient)" />
      <circle cx="50" cy="50" r="48" fill="url(#glowGradient)" />

      {/* Star for dream/creativity */}
      <path
        d="M 50 20 L 58 40 L 80 40 L 63 52 L 71 72 L 50 60 L 29 72 L 37 52 L 20 40 L 42 40 Z"
        fill="#fff"
      />

      {/* Lightbulb idea element inside */}
      <circle cx="50" cy="60" r="8" fill="rgba(255,255,255,0.8)" />
      <rect x="48" y="68" width="4" height="6" fill="rgba(255,255,255,0.8)" />
      <rect x="50" y="68" width="4" height="6" fill="rgba(255,255,255,0.8)" />
    </svg>
  );
}

const styles: any = {
  svg: {
    filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))',
  },
  fullContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
  },
  fullText: {
    fontSize: '24px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #ff9800 0%, #f97316 50%, #e91e63 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
};
