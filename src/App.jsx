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

// INTERIORGLOBE.CO STYLE LOADING PERCENTAGE ANIMATION
const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      // Non-linear counting speed for more realism
      current += Math.floor(Math.random() * 12) + 2;
      if (current >= 100) {
        current = 100;
        setIsComplete(true);
        clearInterval(interval);
        setTimeout(onComplete, 1200); // Hold at 100% briefly before sliding up
      }
      setProgress(current);
    }, 70);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div 
      className="preloader-overlay"
      initial={{ y: "0%" }}
      animate={{ y: isComplete ? "-100%" : "0%" }}
      transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.5 }}
      style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '4vw' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-end', overflow: 'hidden' }}>
        <motion.span 
          className="tiny-label" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 1 }}
        >
          {isComplete ? "AURA INITIALIZED." : "ASSEMBLING FRAMEWORK..."}
        </motion.span>
        <motion.h1 
          className="text-massive kinetic-text" 
          style={{ fontSize: '18vw', lineHeight: '0.75', margin: 0, color: 'var(--color-accent)' }}
        >
          {progress.toString().padStart(3, '0')}
        </motion.h1>
      </div>
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
