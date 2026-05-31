import React from 'react';
import { motion } from 'framer-motion';

// Generates a perfectly combed "ribbon" of hair paths.
// The strands run parallel, creating a sleek, glossy, high-fashion look.
const generateRibbon = (idPrefix, startX, startY, cp1x, cp1y, cp2x, cp2y, endX, endY, strands, thickness, pathLength) => {
  return Array.from({ length: strands }).map((_, i) => {
    // Distribute strands smoothly across the defined thickness
    const offset = (i - strands / 2) * (thickness / strands);
    
    // Vary the stroke properties to create "highlights" (glossy effect)
    const isHighlight = i % 8 === 0 || i % 13 === 0;
    const strokeColor = isHighlight ? "#ffffff" : "var(--color-accent)";
    const opacity = isHighlight ? 0.9 : 0.2;
    const strokeWidth = isHighlight ? 1.2 : 0.5;

    // Tapering: the offset is smaller at the roots and ends, wider in the middle belly of the curve
    const rootX = startX + offset * 0.2;
    const rootY = startY;
    
    const control1X = cp1x + offset * 1.5;
    const control1Y = cp1y;
    
    const control2X = cp2x + offset * 1.2;
    const control2Y = cp2y;
    
    const tipX = endX + offset * 0.1;
    const tipY = endY;

    return (
      <motion.path 
        key={`${idPrefix}-${i}`}
        d={`M ${rootX} ${rootY} C ${control1X} ${control1Y} ${control2X} ${control2Y} ${tipX} ${tipY}`}
        fill="transparent"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        style={{ pathLength, opacity: pathLength }}
        initial={{ opacity: 0 }}
      />
    );
  });
};

const AssemblingSVG = ({ pathLength, opacity }) => {
  
  // Mathematical representation of a sleek bridal updo with a cascading wave.
  
  // 1. The Crown Swoop (Pulling back tightly from the forehead to the nape)
  const crownSwoop = generateRibbon("crown", 260, 100, 350, 150, 200, 280, 150, 320, 120, 60, pathLength);
  
  // 2. The Mid-Section Wave (Flowing seamlessly from the swoop)
  const midWave = generateRibbon("mid", 150, 320, 100, 380, 280, 420, 250, 500, 150, 50, pathLength);
  
  // 3. The Tail / Ends (Cascading down the shoulder neatly)
  const tailEnd = generateRibbon("tail", 250, 500, 220, 550, 300, 580, 280, 650, 100, 30, pathLength);

  // 4. The Chignon / Bun (Elegant twist at the back of the head)
  const bunTop = generateRibbon("bun-top", 180, 250, 80, 200, 80, 350, 150, 350, 80, 40, pathLength);
  const bunBottom = generateRibbon("bun-bot", 150, 350, 250, 350, 250, 250, 180, 250, 80, 40, pathLength);
  
  // 5. The Face-Framing Strand (A single neat, S-curve falling near the cheek)
  const faceFrame = generateRibbon("frame", 280, 120, 320, 200, 280, 280, 330, 350, 25, 6, pathLength);

  return (
    <div className="svg-assembly-container" style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <motion.svg 
        viewBox="0 0 500 700" 
        style={{ width: '100%', height: '100%', maxWidth: '800px', opacity }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Abstract Architectural Lines (Background Structure) */}
        <motion.circle cx="250" cy="350" r="250" fill="transparent" stroke="rgba(240, 235, 225, 0.02)" strokeWidth="1" style={{ pathLength }} />
        <motion.line x1="250" y1="0" x2="250" y2="700" stroke="rgba(240, 235, 225, 0.05)" strokeWidth="1" strokeDasharray="4 4" style={{ pathLength }} />
        <motion.line x1="0" y1="350" x2="500" y2="350" stroke="rgba(240, 235, 225, 0.05)" strokeWidth="1" strokeDasharray="4 4" style={{ pathLength }} />

        {/* The Facial Silhouette (Severe, high-fashion profile) */}
        <motion.path 
          d="M 280 80 Q 290 120 300 150 C 330 180, 340 210, 360 230 Q 365 240 350 250 C 340 260, 330 270, 340 280 Q 360 290 350 300 C 330 320, 330 340, 340 360 Q 360 380 320 420 Q 280 460 280 500" 
          fill="transparent" 
          stroke="rgba(240, 235, 225, 0.4)" 
          strokeWidth="1.5" 
          style={{ pathLength }} 
        />
        
        {/* Render Perfectly Combed Hair Ribbons */}
        <g filter="url(#glow)">
          {bunTop}
          {bunBottom}
          {crownSwoop}
          {midWave}
          {tailEnd}
          {faceFrame}
        </g>

        {/* Assembly Tracking Nodes (Scientific / Reactor feel) */}
        <motion.circle cx="280" cy="80" r="4" fill="var(--color-accent)" style={{ scale: pathLength }} />
        <motion.circle cx="150" cy="320" r="3" fill="#fff" style={{ scale: pathLength }} />
        <motion.circle cx="250" cy="500" r="4" fill="var(--color-accent)" style={{ scale: pathLength }} />
        <motion.circle cx="280" cy="650" r="3" fill="#fff" style={{ scale: pathLength }} />
        
      </motion.svg>
    </div>
  );
};

export default AssemblingSVG;
