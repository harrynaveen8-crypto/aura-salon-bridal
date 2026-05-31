import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const AssemblingSVG = () => {
  const containerRef = useRef(null);
  
  // Track scroll specifically over this component to control the drawing
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Map scroll progress (0.2 to 0.8) to pathLength (0 to 1)
  const pathLength = useTransform(scrollYProgress, [0.2, 0.8], [0, 1]);
  // Make opacity fade in smoothly as drawing begins
  const opacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);

  return (
    <div ref={containerRef} className="svg-assembly-container" style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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

        {/* Abstract Shears / Reactor Construction Lines */}
        <motion.path 
          d="M 50 50 L 450 550 M 450 50 L 50 550" 
          fill="transparent" 
          stroke="rgba(240, 235, 225, 0.1)" 
          strokeWidth="1" 
          style={{ pathLength }} 
        />
        <motion.circle 
          cx="250" cy="300" r="200" 
          fill="transparent" 
          stroke="rgba(240, 235, 225, 0.05)" 
          strokeWidth="1" 
          style={{ pathLength }} 
        />

        {/* The Profile / Structural Face */}
        <motion.path 
          d="M 250 150 C 270 150 280 170 280 200 C 280 220 290 230 310 240 C 330 250 330 270 310 290 C 300 300 290 320 290 350 C 290 400 250 450 200 450" 
          fill="transparent" 
          stroke="var(--color-text)" 
          strokeWidth="3" 
          strokeLinecap="round"
          style={{ pathLength }} 
        />
        
        {/* Intricate Flowing Hair / Geometric Formulations */}
        <motion.path 
          d="M 250 150 C 200 100 100 150 150 300 C 180 400 100 500 50 550" 
          fill="transparent" 
          stroke="url(#goldGradient)" 
          strokeWidth="2" 
          strokeLinecap="round"
          style={{ pathLength }} 
        />
        <motion.path 
          d="M 230 160 C 180 120 80 200 120 350 C 140 450 80 520 40 580" 
          fill="transparent" 
          stroke="var(--color-accent)" 
          strokeWidth="1" 
          strokeLinecap="round"
          style={{ pathLength }} 
        />
        <motion.path 
          d="M 270 160 C 350 100 450 200 400 350 C 370 450 450 500 480 550" 
          fill="transparent" 
          stroke="var(--color-text)" 
          strokeWidth="1.5" 
          strokeLinecap="round"
          strokeDasharray="5, 10"
          style={{ pathLength }} 
        />
        
        {/* Assembly nodes */}
        <motion.circle cx="250" cy="150" r="4" fill="var(--color-accent)" style={{ scale: pathLength }} />
        <motion.circle cx="310" cy="240" r="3" fill="#fff" style={{ scale: pathLength }} />
        <motion.circle cx="310" cy="290" r="3" fill="#fff" style={{ scale: pathLength }} />
        <motion.circle cx="200" cy="450" r="4" fill="var(--color-accent)" style={{ scale: pathLength }} />
      </motion.svg>
    </div>
  );
};

export default AssemblingSVG;
