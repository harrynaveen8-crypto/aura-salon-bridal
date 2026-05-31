import React from 'react';
import { motion, useTransform } from 'framer-motion';

// Generates a perfectly combed "ribbon" of hair paths, now accepting a specific progress transform for sequential drawing.
const generateRibbon = (idPrefix, startX, startY, cp1x, cp1y, cp2x, cp2y, endX, endY, strands, thickness, specificProgress) => {
  return Array.from({ length: strands }).map((_, i) => {
    const offset = (i - strands / 2) * (thickness / strands);
    
    // Hyper-gloss metallic effect
    const isHighlight = i % 12 === 0 || i % 19 === 0;
    const isDeepShadow = i % 5 === 0 && !isHighlight;
    
    let strokeColor = "var(--color-accent)";
    let opacity = 0.4;
    let strokeWidth = 0.5;

    if (isHighlight) {
      strokeColor = "#ffffff";
      opacity = 1;
      strokeWidth = 1.5;
    } else if (isDeepShadow) {
      strokeColor = "rgba(10, 10, 10, 0.8)";
      opacity = 0.8;
      strokeWidth = 1;
    }

    // Tapering
    const rootX = startX + offset * 0.15;
    const rootY = startY;
    const control1X = cp1x + offset * 1.6;
    const control1Y = cp1y;
    const control2X = cp2x + offset * 1.3;
    const control2Y = cp2y;
    const tipX = endX + offset * 0.05;
    const tipY = endY;

    // We stagger the drawing of individual strands slightly based on their index
    // so it doesn't look like a solid block moving, but actual individual hairs flowing.
    const strandStart = (i / strands) * 0.2; // 0 to 0.2 offset
    const individualProgress = useTransform(specificProgress, [strandStart, 1], [0, 1]);

    return (
      <motion.path 
        key={`${idPrefix}-${i}`}
        d={`M ${rootX} ${rootY} C ${control1X} ${control1Y} ${control2X} ${control2Y} ${tipX} ${tipY}`}
        fill="transparent"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        style={{ pathLength: individualProgress, opacity: individualProgress }}
      />
    );
  });
};

const AssemblingSVG = ({ pathLength, opacity }) => {
  
  // SEQUENTIAL PHYSICS: Splitting the master scroll (0 to 1) into distinct, chronological styling phases.
  // 1. First, the face and base structure is established (0.0 to 0.2)
  const structureProgress = useTransform(pathLength, [0, 0.2], [0, 1]);
  
  // 2. The hair is pulled back tightly into the crown swoop (0.2 to 0.4)
  const crownProgress = useTransform(pathLength, [0.2, 0.4], [0, 1]);
  
  // 3. The Chignon (Bun) is twisted into place at the nape (0.4 to 0.6)
  const bunProgress = useTransform(pathLength, [0.4, 0.6], [0, 1]);
  
  // 4. The mid-wave falls out of the bun (0.6 to 0.8)
  const midProgress = useTransform(pathLength, [0.6, 0.8], [0, 1]);
  
  // 5. The final tail cascades down the shoulder, and face-framing piece falls (0.8 to 1.0)
  const tailProgress = useTransform(pathLength, [0.8, 1.0], [0, 1]);

  
  // Mathematical representation of a sleek bridal updo with a cascading wave.
  const crownSwoop = generateRibbon("crown", 260, 100, 350, 150, 200, 280, 150, 320, 150, 70, crownProgress);
  const bunTop = generateRibbon("bun-top", 180, 250, 80, 200, 80, 350, 150, 350, 100, 50, bunProgress);
  const bunBottom = generateRibbon("bun-bot", 150, 350, 250, 350, 250, 250, 180, 250, 100, 50, bunProgress);
  const midWave = generateRibbon("mid", 150, 320, 100, 380, 280, 420, 250, 500, 180, 60, midProgress);
  const tailEnd = generateRibbon("tail", 250, 500, 220, 550, 300, 580, 280, 650, 120, 40, tailProgress);
  const faceFrame = generateRibbon("frame", 280, 120, 330, 200, 270, 280, 330, 350, 30, 8, tailProgress);

  // Generate background particles simulating hairspray / studio dust catching the light
  const particles = Array.from({ length: 40 }).map((_, i) => (
    <motion.circle 
      key={`particle-${i}`}
      cx={100 + Math.random() * 300} 
      cy={100 + Math.random() * 500} 
      r={Math.random() * 1.5 + 0.5} 
      fill="#fff" 
      style={{ 
        scale: structureProgress, 
        opacity: useTransform(pathLength, [0.2, 0.8], [0, Math.random() * 0.8])
      }} 
    />
  ));

  return (
    <div className="svg-assembly-container" style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <motion.svg 
        viewBox="0 0 500 700" 
        style={{ width: '100%', height: '100%', maxWidth: '800px', opacity }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Studio Particles */}
        {particles}

        {/* Abstract Architectural Lines (Background Structure) */}
        <motion.circle cx="250" cy="350" r="250" fill="transparent" stroke="rgba(240, 235, 225, 0.03)" strokeWidth="1" style={{ pathLength: structureProgress }} />
        <motion.line x1="250" y1="0" x2="250" y2="700" stroke="rgba(240, 235, 225, 0.05)" strokeWidth="1" strokeDasharray="4 4" style={{ pathLength: structureProgress }} />
        
        {/* The Facial Silhouette (Severe, high-fashion profile) */}
        <motion.path 
          d="M 280 80 Q 290 120 300 150 C 330 180, 340 210, 360 230 Q 365 240 350 250 C 340 260, 330 270, 340 280 Q 360 290 350 300 C 330 320, 330 340, 340 360 Q 360 380 320 420 Q 280 460 280 500" 
          fill="transparent" 
          stroke="rgba(240, 235, 225, 0.6)" 
          strokeWidth="2" 
          style={{ pathLength: structureProgress }} 
        />
        
        {/* Render Perfectly Combed Hair Ribbons, sequenced chronologically */}
        <g filter="url(#goldGlow)">
          {crownSwoop}
          {bunTop}
          {bunBottom}
          {midWave}
          {tailEnd}
          {faceFrame}
        </g>

        {/* Assembly Tracking Nodes */}
        <motion.circle cx="280" cy="80" r="4" fill="var(--color-accent)" style={{ scale: structureProgress }} />
        <motion.circle cx="150" cy="320" r="3" fill="#fff" style={{ scale: bunProgress }} />
        <motion.circle cx="250" cy="500" r="4" fill="var(--color-accent)" style={{ scale: midProgress }} />
        <motion.circle cx="280" cy="650" r="3" fill="#fff" style={{ scale: tailProgress }} />
        
      </motion.svg>
    </div>
  );
};

export default AssemblingSVG;
