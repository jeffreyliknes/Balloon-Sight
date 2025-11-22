import React from "react";

export function BalloonSightLogo({ className = "", size = 40 }: { className?: string, size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Yellow Border Ring */}
      <circle cx="50" cy="50" r="46" fill="#FDF8F3" stroke="#F3B72E" strokeWidth="8" />
      
      {/* Teal Cloud (Left) */}
      <path d="M25 45C25 45 15 45 15 55C15 65 25 65 25 65H35V45H25Z" fill="#2B6B6E" />
      <path d="M25 45C25 45 25 35 35 35C45 35 45 45 45 45" fill="#2B6B6E" />
      
      {/* Green Mountains */}
      <path d="M20 70L35 55L50 70H20Z" fill="#436347" />
      <path d="M40 75L65 50L90 75H40Z" fill="#436347" />
      <path d="M10 85H90V70H10V85Z" fill="#436347" /> 
      {/* Simplified mountains to fit generic SVG shape, refining below for better match */}
    </svg>
  );
}

export function BalloonSightLogoFull({ className = "", size = 40 }: { className?: string, size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            {/* Yellow Outer Circle */}
            <circle cx="256" cy="256" r="240" fill="#F9F4E8" stroke="#F3B62E" strokeWidth="32"/>
            
            {/* Green Mountains */}
            <path d="M120 400L230 280L340 400H120Z" fill="#3E6348"/>
            <path d="M250 400L380 250L510 400H250Z" fill="#3E6348"/> {/* Overlapping mountain */}
            <rect x="60" y="398" width="400" height="60" fill="#3E6348"/> {/* Base */}

            {/* Teal Cloud */}
            <path d="M80 220C60 220 40 240 40 260C40 280 60 300 80 300H140V220H80Z" fill="#2B6B6E"/>
            <circle cx="140" cy="240" r="30" fill="#2B6B6E"/>

            {/* Red Balloon */}
            <path d="M256 120C211.817 120 176 155.817 176 200C176 244.183 256 340 256 340C256 340 336 244.183 336 200C336 155.817 300.183 120 256 120Z" fill="#DA4A30"/>
            <rect x="246" y="340" width="20" height="20" rx="4" fill="#DA4A30"/> {/* Basket */}
            <rect x="251" y="345" width="10" height="10" rx="2" fill="#F9F4E8"/> {/* Basket Hole */}
        </svg>
    )
}

