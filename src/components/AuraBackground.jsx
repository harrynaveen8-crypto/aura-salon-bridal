import React from 'react';
import { motion } from 'framer-motion';

const AuraBackground = () => {
  return (
    <div className="aura-container">
      <motion.div 
        className="aura-blob aura-1"
        animate={{ 
          x: [0, 100, -50, 0],
          y: [0, -100, 50, 0],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="aura-blob aura-2"
        animate={{ 
          x: [0, -150, 50, 0],
          y: [0, 150, -50, 0],
          scale: [1, 1.5, 0.9, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 2 }}
      />
      <motion.div 
        className="aura-blob aura-3"
        animate={{ 
          x: [0, 50, -150, 0],
          y: [0, 50, 100, 0],
          scale: [1, 0.8, 1.3, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear", delay: 5 }}
      />
    </div>
  );
};

export default AuraBackground;
