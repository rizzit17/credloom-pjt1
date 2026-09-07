"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import CursorGrid from './CursorGrid';

export default function SiteCursorGrid() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="w-full h-full relative">
        <CursorGrid
          cellSize={70}
          color="#D946EF"
          radius={140}
          falloff="smooth"
          holdTime={400}
          fadeDuration={800}
          lineWidth={1.2}
          maxOpacity={1}
          fillOpacity={0}
          gridOpacity={0}
          cellRadius={0}
          clickPulse={true}
          pulseSpeed={600}
        />
      </div>
      {/* Subtle vignette layer to preserve ink depth */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_30%,#0E1013_90%] pointer-events-none opacity-50" />
    </div>
  );
}
