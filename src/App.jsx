import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Lenis from 'lenis';
import { motion, useSpring, AnimatePresence } from 'framer-motion';

import Home from './pages/Home';
import Services from './pages/Services';
import Booking from './pages/Booking';
import Archive from './pages/Archive';
import Journal from './pages/Journal';

const LiquidCursor = ({ setCursorPos }) => {
  const cursorX = useSpring(-100, { stiffness: 800, damping: 35 });
  const cursorY = useSpring(-100, { stiffness: 800, damping: 35 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setCursorPos({ x: e.clientX, y: e.clientY });

      const target = e.target;
      if (target.closest('a, button, .hover-target, input, textarea')) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [cursorX, cursorY, setCursorPos]);

  return <motion.div className={`liquid-cursor ${hovered ? 'hovered' : ''}`} style={{ x: cursorX, y: cursorY }} />;
};

const Navigation = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo hover-target" style={{ fontSize: '1.5rem', fontWeight: 600 }}>AURA.</Link>
      <div className="nav-links">
        <Link to="/archive" className="hover-target">Archive</Link>
        <Link to="/journal" className="hover-target">Journal</Link>
        <Link to="/services" className="hover-target">Menu</Link>
        <Link to="/booking" className="hover-target">Reserve</Link>
      </div>
    </nav>
  );
};

// PHYSICS-BASED WATER SPREAD BACKGROUND
const WaterBackground = ({ theme, cursorPos }) => {
  // Capture origin point exactly when the theme changes
  const [origin, setOrigin] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    setOrigin(cursorPos);
  }, [theme]);

  // Aggressive exponential-out easing curve to simulate real water splashing
  return (
    <>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -3, background: '#000000' }} />
      <motion.div 
        initial={false}
        animate={{ 
          clipPath: theme === 'light' 
            ? `circle(3000px at ${origin.x}px ${origin.y}px)` 
            : `circle(0px at ${origin.x}px ${origin.y}px)`
        }}
        transition={{ duration: 0.85, ease: [0.19, 1, 0.22, 1] }}
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh', 
          zIndex: -2, 
          background: '#F0EBE1',
          willChange: 'clip-path'
        }}
      />
    </>
  );
};

function App() {
  const [theme, setTheme] = useState('dark');
  const [revealImage, setRevealImage] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smooth: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <BrowserRouter>
      <div className={`app-wrapper theme-${theme}`}>
        <WaterBackground theme={theme} cursorPos={cursorPos} />
        
        <LiquidCursor setCursorPos={setCursorPos} />
        <Navigation />
        
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
