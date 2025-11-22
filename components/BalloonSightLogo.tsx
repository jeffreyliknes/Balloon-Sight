import React from "react";
import Image from "next/image";

interface BalloonSightLogoProps {
  size?: number;
  className?: string;
}

export function BalloonSightLogo({ size = 52, className = "" }: BalloonSightLogoProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <Image 
        src="/logo.png"
        alt="BalloonSight Logo"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}
