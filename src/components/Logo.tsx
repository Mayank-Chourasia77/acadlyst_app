
import React from 'react';

export const Logo = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      className={className}
      aria-labelledby="logoTitle"
      role="img"
    >
      <title id="logoTitle">Acadlyst Logo</title>
      <defs>
        {/* Gradient for the beaker */}
        <linearGradient id="beakerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" /> {/* light blue */}
          <stop offset="100%" stopColor="#2563EB" /> {/* deep blue */}
        </linearGradient>
        
        {/* Gradient for the stylized flame */}
        <linearGradient id="flameGradient" y1="0%" x1="0%" y2="100%" x2="0%">
          <stop offset="0%" stopColor="#FBBF24" /> {/* yellow */}
          <stop offset="50%" stopColor="#FB923C" /> {/* orange */}
          <stop offset="100%" stopColor="#EF4444" /> {/* red */}
        </linearGradient>
      </defs>
      
      {/* Erlenmeyer flask path with a flat top opening */}
      <path 
        d="M 56,58 H 8 C 6,58 4,56 4,54 L 24,28 V 14 L 22,14 V 5 H 42 V 14 L 40,14 V 28 L 60,54 C 60,56 58,58 56,58 Z"
        fill="url(#beakerGradient)"
      />
      
      {/* Stylized flame path inside the beaker, raised up */}
      <path 
        d="M 26,52 C 22,41 28,31 32,24 C 36,31 45,41 38,52 C 34,55 30,55 26,52 Z"
        fill="url(#flameGradient)"
      />
    </svg>
  );
};
