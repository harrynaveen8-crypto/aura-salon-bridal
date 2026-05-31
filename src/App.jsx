import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { motion, useSpring, AnimatePresence } from 'framer-motion';

import Home from './pages/Home';
import Services from './pages/Services';
import Booking from './pages/Booking';

const Preloader = ({ onComplete }) => {
  return (
    <motion.div 
      className="preloader-overlay"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1.5, delay: 2.5, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={onComplete}
    >
      <motion.svg width="120" height="120" viewBox="0 0 100 100">
        <motion.path 
          d="M20,80 L50,20 L80,80" 
          stroke="var(--color-accent)" 
          strokeWidth="1.5" 
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <motion.path 
          d="M35,60 L65,60" 
          stroke="var(--color-accent)" 
          strokeWidth="1.5" 
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
        />
      </motion.svg>
    </motion.div>
  )
}

const LiquidCursor = () => {
  const cursorX = useSpring(-100, { stiffness: 800, damping: 35 });
  const cursorY = useSpring(-100, { stiffness: 800, damping: 35 });

  useEffect(() => {
    const onMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [cursorX, cursorY]);

  return <motion.div className="liquid-cursor" style={{ x: cursorX, y: cursorY }} />;
};

const Navigation = ({ show }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.nav 
          className="navbar" 
          style={{ mixBlendMode: 'difference', color: '#fff' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.76, 0, 0.24, 1] }}
        >
          <Link to="/" className="nav-logo hover-target" style={{ fontSize: '1.5rem', fontWeight: 600 }}>AURA.</Link>
          <div className="nav-links">
            <Link to="/services" className="hover-target">Menu</Link>
            <Link to="/booking" className="hover-target">Reserve</Link>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

function App() {
  const [theme, setTheme] = useState('dark');
  const [revealImage, setRevealImage] = useState(null);
  const [preloaderComplete, setPreloaderComplete] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smooth: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <BrowserRouter>
      <div className={`app-wrapper theme-${theme}`}>
        <Preloader onComplete={() => setPreloaderComplete(true)} />
        <LiquidCursor />
        <div className="noise"></div>
        <Navigation show={preloaderComplete} />
        
        {preloaderComplete && (
          <Routes>
            <Route path="/" element={<Home setTheme={setTheme} revealImage={revealImage} setRevealImage={setRevealImage} />} />
            <Route path="/services" element={<Services setTheme={setTheme} />} />
            <Route path="/booking" element={<Booking setTheme={setTheme} />} />
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
