import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { motion, useSpring, AnimatePresence } from 'framer-motion';

import Home from './pages/Home';
import Services from './pages/Services';
import Booking from './pages/Booking';
import Archive from './pages/Archive';
import Journal from './pages/Journal';
import AuraBackground from './components/AuraBackground';
import SpinningBadge from './components/SpinningBadge';

// ELEGANT TYPOGRAPHY & LOGO PRELOADER
const Preloader = ({ onComplete }) => {
  return (
    <motion.div 
      className="preloader-overlay"
      initial={{ y: "0%" }}
      animate={{ y: "-100%" }}
      transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1], delay: 2.8 }}
      onAnimationComplete={onComplete}
      style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '0 10vw',
        background: 'var(--color-bg)'
      }}
    >
      <motion.div 
        initial={{ opacity: 0, x: -50 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ duration: 1.5, ease: "easeOut" }} 
        className="text-large text-editorial"
        style={{ fontSize: 'clamp(2rem, 5vw, 5rem)' }}
      >
        LUXURY
      </motion.div>
      
      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotate: 90 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ duration: 2, ease: [0.76, 0, 0.24, 1] }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
      >
        <svg width="80" height="80" viewBox="0 0 100 100">
          <motion.circle cx="50" cy="50" r="45" fill="none" stroke="var(--color-accent)" strokeWidth="1" 
             initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2 }} />
          <motion.path d="M 50 15 L 85 80 L 15 80 Z" fill="none" stroke="var(--color-text)" strokeWidth="1" 
             initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.5 }} />
        </svg>
        <span className="tiny-label" style={{ letterSpacing: '8px' }}>AURA</span>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 50 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ duration: 1.5, ease: "easeOut" }} 
        className="text-large text-editorial"
        style={{ fontSize: 'clamp(2rem, 5vw, 5rem)' }}
      >
        CRAFT
      </motion.div>
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
            <Link to="/archive" className="hover-target">Archive</Link>
            <Link to="/journal" className="hover-target">Journal</Link>
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
        <AnimatePresence>
          {!preloaderComplete && <Preloader onComplete={() => setPreloaderComplete(true)} />}
        </AnimatePresence>
        <AuraBackground />
        <SpinningBadge />
        <LiquidCursor />
        <div className="noise"></div>
        <Navigation show={preloaderComplete} />
        
        <Routes>
          <Route path="/" element={<Home setTheme={setTheme} revealImage={revealImage} setRevealImage={setRevealImage} />} />
          <Route path="/archive" element={<Archive setTheme={setTheme} />} />
          <Route path="/journal" element={<Journal setTheme={setTheme} />} />
          <Route path="/services" element={<Services setTheme={setTheme} />} />
          <Route path="/booking" element={<Booking setTheme={setTheme} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
