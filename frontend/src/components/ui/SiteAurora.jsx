"use client";

import React from 'react';
import Aurora from './Aurora';

export default function SiteAurora() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="w-full h-full relative opacity-60">
        <Aurora
          colorStops={["#141268", "#B497CF", "#5227FF"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>
      {/* Subtle radial & linear vignettes to protect terminal contrast & text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0E1013]/60 via-transparent to-[#0E1013]/80 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_25%,#0E1013_85%] pointer-events-none opacity-60" />
    </div>
  );
}
