"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface PillarLogoProps {
  className?: string;
  size?: number;
}

const PillarLogo = ({ className, size = 24 }: PillarLogoProps) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={cn("transition-transform", className)}
    >
      {/* Base */}
      <rect x="6" y="19" width="12" height="2" rx="0.5" fill="currentColor" />
      {/* Capital (Top) */}
      <rect x="7" y="3" width="10" height="2" rx="0.5" fill="currentColor" />
      {/* Main Shaft */}
      <rect x="9" y="6" width="6" height="12" rx="0.5" fill="currentColor" />
    </svg>
  );
};

export default PillarLogo;