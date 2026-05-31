import React from 'react';
import { motion } from 'framer-motion';

const SpinningBadge = () => {
  const text = "AURA STUDIO • EST 2026 • LUXURY CRAFT • ";
  const chars = text.split("");

  return (
    <div className="spinning-badge-container hover-target">
      <motion.div 
        className="spinning-badge"
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <defs>
            <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
          </defs>
          <text fontSize="8.5" fontFamily="var(--font-body)" letterSpacing="2.5" fill="var(--color-text)" opacity="0.6">
            <textPath href="#circlePath">
              {text}
            </textPath>
          </text>
        </svg>
      </motion.div>
      <div className="badge-center">A.</div>
    </div>
  );
};

export default SpinningBadge;
