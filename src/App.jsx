import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { motion, useSpring } from 'framer-motion';

import Home from './pages/Home';
import Services from './pages/Services';
import Booking from './pages/Booking';

// Global Liquid Cursor
const LiquidCursor = ({ revealImage }) => {
  const cursorX = useSpring(-100, { stiffness: 800, damping: 35 });
  const cursorY = useSpring(-100, { stiffness: 800, damping: 35 });
  const imgX = useSpring(-100, { stiffness: 400, damping: 40 });
  const imgY = useSpring(-100, { stiffness: 400, damping: 40 });

  useEffect(() => {
    const onMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      imgX.set(e.clientX);
      imgY.set(e.clientY);
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [cursorX, cursorY, imgX, imgY]);

  return (
    <>
      <motion.div className="liquid-cursor" style={{ x: cursorX, y: cursorY }} />
      <motion.div 
        className={`cursor-image-reveal ${revealImage ? 'active' : ''}`}
        style={{ x: imgX, y: imgY }}
      >
        {revealImage && <img src={revealImage} alt="Reveal" />}
      </motion.div>
    </>
  );
};

// Global Navigation
const Navigation = () => {
  const location = useLocation();
  const isLight = location.pathname === '/booking'; // Quick hack for booking light theme

  return (
    <nav className="navbar" style={{ mixBlendMode: 'difference', color: '#fff' }}>
      <Link to="/" className="nav-logo hover-target" style={{ fontSize: '1.5rem', fontWeight: 600 }}>AURA.</Link>
      <div className="nav-links">
        <Link to="/services" className="hover-target">Menu</Link>
        <Link to="/booking" className="hover-target">Reserve</Link>
      </div>
    </nav>
  );
};

function App() {
  const [theme, setTheme] = useState('dark');
  const [revealImage, setRevealImage] = useState(null);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smooth: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <BrowserRouter>
      <div className={`app-wrapper theme-${theme}`}>
        <LiquidCursor revealImage={revealImage} />
        <div className="noise"></div>
        <Navigation />
        
        <Routes>
          <Route path="/" element={<Home setTheme={setTheme} setRevealImage={setRevealImage} />} />
          <Route path="/services" element={<Services setTheme={setTheme} />} />
          <Route path="/booking" element={<Booking setTheme={setTheme} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
