import React from 'react';

const Illustration = () => {
  return (
    <div className="relative w-full h-full">
      <svg viewBox="0 0 700 450" className="w-full h-auto">
        {/* Background table - light brown wooden table */}
        <rect x="80" y="280" width="540" height="25" fill="#D4A574" rx="6" />
        <rect x="80" y="280" width="540" height="8" fill="#C49663" rx="6" />
        
        {/* Person sitting in profile, facing left */}
        {/* Head */}
        <ellipse cx="220" cy="200" rx="32" ry="38" fill="#F4D1AE" />
        
        {/* Beanie - light brown */}
        <ellipse cx="220" cy="175" rx="38" ry="28" fill="#D4A574" />
        <ellipse cx="220" cy="175" rx="38" ry="12" fill="#C49663" />
        
        {/* Body - green long-sleeved top */}
        <rect x="185" y="235" width="70" height="90" fill="#4CAF50" rx="8" />
        
        {/* Left arm (extended forward) */}
        <ellipse cx="180" cy="250" rx="12" ry="50" fill="#4CAF50" />
        <ellipse cx="180" cy="300" rx="12" ry="8" fill="#F4D1AE" />
        
        {/* Right arm (typing) */}
        <ellipse cx="260" cy="250" rx="12" ry="50" fill="#4CAF50" />
        <ellipse cx="260" cy="300" rx="12" ry="8" fill="#F4D1AE" />
        
        {/* Shorts - light brown */}
        <rect x="190" y="325" width="60" height="35" fill="#D4A574" rx="4" />
        
        {/* Legs - green socks/leggings */}
        <rect x="195" y="360" width="18" height="50" fill="#4CAF50" rx="6" />
        <rect x="227" y="360" width="18" height="50" fill="#4CAF50" rx="6" />
        
        {/* Keyboard on table */}
        <rect x="120" y="290" width="140" height="10" fill="#2C2C2C" rx="2" />
        <rect x="130" y="292" width="8" height="6" fill="#1A1A1A" rx="1" />
        <rect x="145" y="292" width="8" height="6" fill="#1A1A1A" rx="1" />
        <rect x="160" y="292" width="8" height="6" fill="#1A1A1A" rx="1" />
        <rect x="175" y="292" width="8" height="6" fill="#1A1A1A" rx="1" />
        <rect x="190" y="292" width="8" height="6" fill="#1A1A1A" rx="1" />
        <rect x="205" y="292" width="8" height="6" fill="#1A1A1A" rx="1" />
        <rect x="220" y="292" width="8" height="6" fill="#1A1A1A" rx="1" />
        <rect x="235" y="292" width="8" height="6" fill="#1A1A1A" rx="1" />
        <rect x="250" y="292" width="8" height="6" fill="#1A1A1A" rx="1" />
        
        {/* Hand outline - cream colored with thick black border, positioned on table */}
        <path
          d="M 380 220 
             Q 400 200 420 220 
             Q 440 240 430 260 
             Q 420 280 410 270 
             Q 400 260 390 270 
             Q 380 280 370 270 
             Q 360 260 350 270 
             Q 340 280 330 260 
             Q 320 240 340 220 
             Q 360 200 380 220 Z"
          fill="#F5E6D3"
          stroke="#000"
          strokeWidth="4"
        />
        
        {/* Scanner/screen area on table - positioned where fingerprint would be */}
        <ellipse cx="380" cy="240" rx="90" ry="60" fill="#E8E8E8" opacity="0.8" />
        <rect x="320" y="200" width="120" height="80" fill="#F0F0F0" opacity="0.6" rx="8" />
        
        {/* Detailed fingerprint pattern - concentric circles */}
        <g transform="translate(380, 240)">
          {/* Outer circles */}
          <circle cx="0" cy="0" r="18" fill="none" stroke="#000" strokeWidth="2" />
          <circle cx="0" cy="0" r="28" fill="none" stroke="#000" strokeWidth="2" />
          <circle cx="0" cy="0" r="38" fill="none" stroke="#000" strokeWidth="2" />
          <circle cx="0" cy="0" r="48" fill="none" stroke="#000" strokeWidth="2" />
          <circle cx="0" cy="0" r="58" fill="none" stroke="#000" strokeWidth="1.5" />
          
          {/* Fingerprint ridges - wavy patterns */}
          <path d="M -45 -25 Q -35 -20 -25 -25 Q -15 -30 -5 -25 Q 5 -20 15 -25 Q 25 -30 35 -25 Q 45 -20 55 -25" 
                fill="none" stroke="#000" strokeWidth="1.5" />
          <path d="M -50 -10 Q -40 -5 -30 -10 Q -20 -15 -10 -10 Q 0 -5 10 -10 Q 20 -15 30 -10 Q 40 -5 50 -10" 
                fill="none" stroke="#000" strokeWidth="1.5" />
          <path d="M -50 5 Q -40 10 -30 5 Q -20 0 -10 5 Q 0 10 10 5 Q 20 0 30 5 Q 40 10 50 5" 
                fill="none" stroke="#000" strokeWidth="1.5" />
          <path d="M -45 20 Q -35 25 -25 20 Q -15 15 -5 20 Q 5 25 15 20 Q 25 15 35 20 Q 45 25 55 20" 
                fill="none" stroke="#000" strokeWidth="1.5" />
          
          {/* Vertical ridges */}
          <path d="M -30 -40 Q -30 -30 -30 -20 Q -30 -10 -30 0 Q -30 10 -30 20 Q -30 30 -30 40" 
                fill="none" stroke="#000" strokeWidth="1" />
          <path d="M 0 -40 Q 0 -30 0 -20 Q 0 -10 0 0 Q 0 10 0 20 Q 0 30 0 40" 
                fill="none" stroke="#000" strokeWidth="1" />
          <path d="M 30 -40 Q 30 -30 30 -20 Q 30 -10 30 0 Q 30 10 30 20 Q 30 30 30 40" 
                fill="none" stroke="#000" strokeWidth="1" />
        </g>
      </svg>
    </div>
  );
};

export default Illustration;
