
import React from 'react';

export const Logo = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      {/* Gear Background */}
      <path 
        d="M50 15 L55 5 L65 5 L70 15 L80 15 L85 25 L80 35 L85 45 L95 45 L100 55 L90 60 L90 70 L100 75 L95 85 L85 85 L80 95 L70 95 L65 85 L55 85 L50 95 L40 95 L35 85 L25 85 L20 95 L10 95 L5 85 L10 75 L10 65 L0 60 L5 50 L15 50 L20 40 L15 30 L20 20 L30 20 L35 30 L45 30 L50 20 Z" 
        fill="url(#logoGradient)" 
        opacity="0.9"
      />
      
      {/* Bulb Outline */}
      <path 
        d="M35 35 C 35 20, 65 20, 65 35 C 65 45, 55 50, 55 60 L 45 60 C 45 50, 35 45, 35 35" 
        fill="white" 
        stroke="white" 
        strokeWidth="2"
      />
      <rect x="45" y="62" width="10" height="3" rx="1" fill="white" />
      <rect x="46" y="67" width="8" height="3" rx="1" fill="white" />
      <path d="M47 72 L53 72 L50 77 Z" fill="white" />

      {/* Dollar Sign */}
      <text x="50" y="52" fontSize="24" textAnchor="middle" fill="url(#logoGradient)" fontWeight="bold" fontFamily="sans-serif">$</text>
    </svg>
  );
};
