import React from "react";
import { IndianTheme } from "../utils/indianThemes";

interface RangoliProps {
  theme: IndianTheme;
  className?: string;
  size?: number;
}

export default function RangoliDecoration({ theme, className = "", size = 120 }: RangoliProps) {
  const pColor = theme.hexPrimary;
  const sColor = theme.hexSecondary;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`opacity-20 dark:opacity-10 pointer-events-none select-none ${className}`}
    >
      {/* Outer Rangoli Circular Guide */}
      <circle cx="50" cy="50" r="45" fill="none" stroke={sColor} strokeWidth="1" strokeDasharray="2 3" />
      <circle cx="50" cy="50" r="38" fill="none" stroke={pColor} strokeWidth="1.5" />
      
      {/* Inner Petal/Lotus Drawing */}
      <path
        d="M50 15 C54 30 46 30 50 15 Z"
        fill={pColor}
        opacity="0.8"
      />
      <path
        d="M50 85 C54 70 46 70 50 85 Z"
        fill={pColor}
        opacity="0.8"
      />
      <path
        d="M15 50 C30 54 30 46 15 50 Z"
        fill={pColor}
        opacity="0.8"
      />
      <path
        d="M85 50 C70 54 70 46 85 50 Z"
        fill={pColor}
        opacity="0.8"
      />

      {/* Diagonal Petals */}
      <path
        d="M25 25 C38 35 32 28 25 25 Z"
        fill={sColor}
        opacity="0.8"
      />
      <path
        d="M75 25 C62 35 68 28 75 25 Z"
        fill={sColor}
        opacity="0.8"
      />
      <path
        d="M25 75 C38 65 32 72 25 75 Z"
        fill={sColor}
        opacity="0.8"
      />
      <path
        d="M75 75 C62 65 68 72 75 75 Z"
        fill={sColor}
        opacity="0.8"
      />

      {/* Center Star Mandala */}
      <polygon
        points="50,38 53,47 62,50 53,53 50,62 47,53 38,50 47,47"
        fill={sColor}
      />
      <circle cx="50" cy="50" r="4" fill="white" stroke={pColor} strokeWidth="1" />

      {/* Traditional Indian Outer Rangoli Dots */}
      <circle cx="50" cy="8" r="1.5" fill={pColor} />
      <circle cx="50" cy="92" r="1.5" fill={pColor} />
      <circle cx="8" cy="50" r="1.5" fill={pColor} />
      <circle cx="92" cy="50" r="1.5" fill={pColor} />
      
      <circle cx="21" cy="21" r="1.5" fill={sColor} />
      <circle cx="79" cy="21" r="1.5" fill={sColor} />
      <circle cx="21" cy="79" r="1.5" fill={sColor} />
      <circle cx="79" cy="79" r="1.5" fill={sColor} />
    </svg>
  );
}
