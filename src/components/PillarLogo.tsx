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
      {/* Capitel (Topo Estilo Grego) */}
      <rect x="5" y="3" width="14" height="2" rx="0.5" fill="currentColor" />
      <rect x="7" y="5" width="10" height="1.5" rx="0.2" fill="currentColor" />
      
      {/* Fuste (Corpo com Caneluras) */}
      <rect x="8.5" y="7" width="1.5" height="11" rx="0.3" fill="currentColor" />
      <rect x="11.25" y="7" width="1.5" height="11" rx="0.3" fill="currentColor" />
      <rect x="14" y="7" width="1.5" height="11" rx="0.3" fill="currentColor" />
      
      {/* Base (Degraus Clássicos) */}
      <rect x="7" y="18.5" width="10" height="1.5" rx="0.2" fill="currentColor" />
      <rect x="5" y="20.5" width="14" height="1.5" rx="0.5" fill="currentColor" />
    </svg>
  );
};

export default PillarLogo;