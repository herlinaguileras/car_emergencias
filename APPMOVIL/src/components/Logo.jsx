import React from 'react';

export default function Logo({ className = '', size = 120, showText = false }) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 800 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-w-full drop-shadow-[0_0_30px_rgba(239,68,68,0.25)]"
      >
        <defs>
          {/* Underglow Gradient */}
          <radialGradient id="underglow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff1e1e" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#ff1e1e" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ff1e1e" stopOpacity="0" />
          </radialGradient>
          {/* Window Glow */}
          <linearGradient id="window-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7f1d1d" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
        </defs>

        {/* 1. Large Underglow beneath the car */}
        <ellipse
          cx="400"
          cy="480"
          rx="280"
          ry="65"
          fill="url(#underglow)"
          opacity="0.9"
        />

        {/* 2. Floating digital squares (pixels) rising from the front hood/windshield area - exact match to logo */}
        {/* Row 1 (Lowest) */}
        <rect x="548" y="278" width="58" height="58" fill="#ff2e2e" />
        
        {/* Row 2 */}
        <rect x="502" y="222" width="50" height="50" fill="#ff2e2e" />
        <rect x="568" y="235" width="13" height="13" fill="#ff2e2e" />
        <rect x="606" y="240" width="50" height="50" fill="#ff2e2e" />

        {/* Row 3 */}
        <rect x="454" y="210" width="22" height="22" fill="#ff2e2e" />
        <rect x="477" y="218" width="24" height="24" fill="#ff2e2e" />
        <rect x="530" y="162" width="56" height="56" fill="#ff2e2e" />
        <rect x="600" y="196" width="46" height="46" fill="#ff2e2e" />
        <rect x="640" y="200" width="26" height="26" fill="#ff2e2e" />

        {/* Row 4 */}
        <rect x="487" y="148" width="28" height="28" fill="#ff2e2e" />
        <rect x="599" y="128" width="46" height="46" fill="#ff2e2e" />

        {/* Row 5 */}
        <rect x="540" y="100" width="30" height="30" fill="#ff2e2e" />
        <rect x="600" y="98" width="30" height="30" fill="#ff2e2e" />

        {/* 3. The main Hatchback Car Silhouette in White */}
        <path
          d="M 140,390 
             C 135,360 152,320 185,302 
             C 210,288 238,285 242,284
             L 345,248 
             C 375,238 465,240 500,246 
             L 655,325
             C 675,335 715,340 722,352 
             C 730,364 732,382 730,402 
             L 730,418 
             C 730,422 725,425 720,425 
             L 670,425 
             C 670,380 630,345 580,345 
             C 530,345 490,380 490,425 
             L 310,425 
             C 310,380 270,345 220,345 
             C 170,345 130,380 130,425 
             L 115,425 
             C 110,425 106,420 106,415 
             C 106,410 110,400 115,398
             Z"
          fill="white"
        />

        {/* Wheels (Outer white ring, inner dark background, center red accent) */}
        <circle cx="220" cy="425" r="54" fill="white" />
        <circle cx="220" cy="425" r="42" fill="#080c16" />
        <circle cx="220" cy="425" r="14" fill="#ff2e2e" />

        <circle cx="580" cy="425" r="54" fill="white" />
        <circle cx="580" cy="425" r="42" fill="#080c16" />
        <circle cx="580" cy="425" r="14" fill="#ff2e2e" />

        {/* Windows matching the exact layout of the logo */}
        <path
          d="M 252,298 
             L 345,268 
             L 440,260
             L 440,314 
             L 252,314 
             Z"
          fill="#080c16"
        />
        <path
          d="M 458,260 
             L 535,266 
             L 638,320
             L 458,320 
             Z"
          fill="#080c16"
        />

        {/* Red door handles / trim accents */}
        <rect x="290" y="328" width="34" height="8" rx="4" fill="#ff2e2e" />
        <rect x="420" y="331" width="34" height="8" rx="4" fill="#ff2e2e" />
      </svg>

      {showText && (
        <div className="mt-2 text-center">
          <h1 className="text-4xl font-black text-white tracking-wider uppercase">
            Data<span className="text-brand-red">Crash</span>
          </h1>
          <p className="text-xs text-gray-400 font-semibold tracking-widest uppercase mt-1">
            Motor de Asistencia Inteligente
          </p>
        </div>
      )}
    </div>
  );
}
