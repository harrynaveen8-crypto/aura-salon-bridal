import React from 'react';
import { motion } from 'framer-motion';

const AssemblingSVG = ({ pathLength, opacity }) => {
  // Generate a massive amount of bezier curves to simulate insane hair depth
  const hairStripes = Array.from({ length: 150 }).map((_, i) => {
    // Randomize control points to create organic flowing waves
    const startX = 250 + (Math.random() * 40 - 20);
    const startY = 150 + (Math.random() * 20 - 10);
    
    const cp1x = 100 + (Math.random() * 300);
    const cp1y = 250 + (Math.random() * 100);
    
    const cp2x = 50 + (Math.random() * 400);
    const cp2y = 400 + (Math.random() * 100);
    
    const endX = 50 + (Math.random() * 400);
    const endY = 550 + (Math.random() * 50);

    return (
      <motion.path 
        key={i}
        d={`M ${startX} ${startY} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${endX} ${endY}`} 
        fill="transparent" 
        stroke={Math.random() > 0.8 ? "var(--color-accent)" : "rgba(240, 235, 225, 0.2)"} 
        strokeWidth={Math.random() * 1.5 + 0.2} 
        style={{ pathLength }} 
      />
    );
  });

  return (
    <div className="svg-assembly-container" style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <motion.svg 
        viewBox="0 0 500 600" 
        style={{ width: '100%', height: '100%', maxWidth: '800px', opacity }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-accent)" />
            <stop offset="100%" stopColor="#fff" />
          </linearGradient>
        </defs>

        {/* Dense geometric background mapping */}
        <motion.circle cx="250" cy="300" r="220" fill="transparent" stroke="rgba(240, 235, 225, 0.03)" strokeWidth="1" style={{ pathLength }} />
        <motion.circle cx="250" cy="300" r="180" fill="transparent" stroke="rgba(240, 235, 225, 0.05)" strokeWidth="1" style={{ pathLength }} />
        <motion.circle cx="250" cy="300" r="140" fill="transparent" stroke="rgba(240, 235, 225, 0.08)" strokeWidth="1" style={{ pathLength }} />

        {/* The Sharp Facial Silhouette */}
        <motion.path 
          d="M 250 150 C 270 150 280 170 280 200 C 280 220 290 230 310 240 C 330 250 330 270 310 290 C 300 300 290 320 290 350 C 290 400 250 450 200 450" 
          fill="transparent" 
          stroke="var(--color-text)" 
          strokeWidth="4" 
          strokeLinecap="round"
          style={{ pathLength }} 
        />
        <motion.path 
          d="M 200 450 C 150 450 120 500 100 550" 
          fill="transparent" 
          stroke="var(--color-text)" 
          strokeWidth="4" 
          strokeLinecap="round"
          style={{ pathLength }} 
        />
        
        {/* Massive Hair Stripes Mapping */}
        {hairStripes}
        
        {/* Assembly tracking nodes */}
        <motion.circle cx="250" cy="150" r="5" fill="var(--color-accent)" style={{ scale: pathLength }} />
        <motion.circle cx="310" cy="240" r="4" fill="#fff" style={{ scale: pathLength }} />
        <motion.circle cx="310" cy="290" r="4" fill="#fff" style={{ scale: pathLength }} />
        <motion.circle cx="200" cy="450" r="5" fill="var(--color-accent)" style={{ scale: pathLength }} />
      </motion.svg>
    </div>
  );
};

export default AssemblingSVG;
