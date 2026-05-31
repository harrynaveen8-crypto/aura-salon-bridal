import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import Lenis from 'lenis';

// -------------------------------------------------------------
// AWWWARDS-GRADE UI COMPONENTS
// -------------------------------------------------------------

const AnimatedText = ({ text, className }) => {
  const words = text.split(" ");
  return (
    <span className={className} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2em' }}>
      {words.map((word, index) => (
        <span key={index} style={{ overflow: 'hidden', display: 'inline-block' }}>
          <motion.span
            initial={{ y: "110%", rotateZ: 5 }}
            whileInView={{ y: 0, rotateZ: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: index * 0.05, ease: [0.76, 0, 0.24, 1] }}
            style={{ display: 'inline-block', transformOrigin: 'left bottom' }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

// Liquid Blob Cursor
const LiquidCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (cursorRef.current) {
        // smooth tracking
        cursorRef.current.animate({
          left: `${e.clientX}px`,
          top: `${e.clientY}px`
        }, { duration: 800, fill: "forwards", easing: "cubic-bezier(0.175, 0.885, 0.32, 1.275)" });
      }
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <div ref={cursorRef} className="liquid-cursor" />
  );
};

// Draggable, floating physics-enabled Salon Toys
const PlayfulTool = ({ children, initialX, initialY, delay = 0 }) => {
  return (
    <motion.div
      drag
      dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
      dragElastic={0.4}
      whileDrag={{ scale: 1.2, cursor: 'grabbing', rotate: 15, opacity: 0.8 }}
      whileHover={{ scale: 1.05 }}
      animate={{ 
        y: [0, -40, 0],
        rotate: [0, 5, -5, 0]
      }}
      transition={{ 
        duration: 8, 
        repeat: Infinity, 
        ease: "easeInOut",
        delay: delay 
      }}
      className="playful-tool"
      style={{
        position: 'absolute',
        top: initialY,
        left: initialX,
        cursor: 'grab',
        zIndex: 15,
        color: 'var(--color-accent)',
        opacity: 0.25
      }}
    >
      {children}
    </motion.div>
  );
};

// Premium Line-art SVGs for the Playful Tools
const CombSVG = () => (
  <svg width="250" height="250" viewBox="0 0 100 100" fill="currentColor">
    <path d="M 10 30 L 90 30 C 95 30 95 40 90 40 L 10 40 C 5 40 5 30 10 30 Z" />
    {[...Array(14)].map((_, i) => (
      <rect key={i} x={18 + i * 5} y="40" width="2" height="35" rx="1" />
    ))}
  </svg>
);

const MirrorSVG = () => (
  <svg width="250" height="250" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4">
    <circle cx="50" cy="35" r="25" />
    <path d="M 45 60 L 45 85 C 45 90 55 90 55 85 L 55 60" fill="currentColor" stroke="none" />
  </svg>
);

const SpraySVG = () => (
  <svg width="200" height="200" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4">
    <rect x="35" y="45" width="30" height="45" rx="8" />
    <rect x="42" y="30" width="16" height="15" fill="currentColor" stroke="none" />
    <path d="M 42 30 L 25 20 L 65 20 C 70 20 70 30 65 30 Z" fill="currentColor" stroke="none" />
  </svg>
);


function App() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      smooth: true,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const { scrollYProgress: pageScroll } = useScroll();

  // Transformation Reveal (Light Mode Shift)
  useMotionValueEvent(pageScroll, "change", (latest) => {
    if (latest > 0.8 && theme !== 'light') {
      setTheme('light');
    } else if (latest <= 0.8 && theme !== 'dark') {
      setTheme('dark');
    }
  });

  // Hero Parallax
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const smoothHero = useSpring(heroScroll, { stiffness: 100, damping: 30 });
  const heroScale = useTransform(smoothHero, [0, 1], [1, 1.25]);
  const heroOpacity = useTransform(smoothHero, [0, 0.6], [1, 0]);

  // Horizontal Scroll Section
  const horizontalRef = useRef(null);
  const { scrollYProgress: horizontalScroll } = useScroll({ target: horizontalRef });
  const smoothHorizontal = useSpring(horizontalScroll, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const xTransform = useTransform(smoothHorizontal, [0, 1], ["0%", "-75%"]);

  // Horizontal Image Parallax (moves opposite to the track for 3D depth)
  const imageParallax = useTransform(smoothHorizontal, [0, 1], ["-10%", "10%"]);

  return (
    <div className={`app-wrapper theme-${theme}`}>
      <LiquidCursor />
      <div className="noise"></div>

      <nav className="navbar">
        <div className="nav-logo">AURA.</div>
        <div style={{ fontFamily: 'Syne', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', cursor: 'none' }}>
          Menu
        </div>
      </nav>

      {/* 1. Hero with Draggable Toys */}
      <section className="hero" ref={heroRef}>
        
        {/* Playful Physics Toys layered behind text */}
        <PlayfulTool initialX="10vw" initialY="15vh" delay={0}>
          <MirrorSVG />
        </PlayfulTool>
        <PlayfulTool initialX="75vw" initialY="30vh" delay={1}>
          <CombSVG />
        </PlayfulTool>
        <PlayfulTool initialX="20vw" initialY="65vh" delay={2}>
          <SpraySVG />
        </PlayfulTool>

        <motion.div className="hero-img-wrapper" style={{ scale: heroScale, opacity: heroOpacity, zIndex: 1 }}>
          <img src="/hero.png" alt="Aura Beauty Salon" className="hero-img liquid-image" />
        </motion.div>
        
        <div className="container hero-content-container" style={{ zIndex: 10 }}>
          <div className="hero-text-overlay" style={{ overflow: 'hidden' }}>
            <motion.h1 
              initial={{ y: "100%" }} animate={{ y: "0%" }} 
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }} 
              className="text-massive kinetic-text"
            >
              ARTISTRY
            </motion.h1>
            <div style={{ overflow: 'hidden', marginTop: '-4vh' }}>
              <motion.h1 
                initial={{ y: "100%" }} animate={{ y: "0%" }} 
                transition={{ duration: 1.2, delay: 0.1, ease: [0.76, 0, 0.24, 1] }} 
                className="text-massive text-editorial kinetic-text" style={{ marginLeft: '15vw' }}
              >
                UNLEASHED
              </motion.h1>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Fluid Horizontal Scroll Gallery (Removed Scissors) */}
      <section ref={horizontalRef} className="horizontal-section-container">
        <div className="horizontal-sticky">
          <motion.div className="horizontal-track" style={{ x: xTransform }}>
            
            {/* Panel 1 */}
            <div className="horizontal-panel">
              <div className="panel-content">
                <AnimatedText text="We don't just style." className="text-large" />
                <br/>
                <AnimatedText text="We architect." className="text-large text-editorial" />
                <motion.p 
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}
                  className="editorial-text mt-8"
                >
                  Grab a comb, throw the mirror. This is a playground. Where aesthetics meet physics, and your natural beauty is elevated to high art.
                </motion.p>
              </div>
            </div>

            {/* Panel 2 */}
            <div className="horizontal-panel">
               <div className="panel-split">
                 <div className="panel-text">
                   <span className="section-label">01 — The Studio</span>
                   <h2 className="text-large">Precision <br/><span className="text-editorial">Craft</span></h2>
                 </div>
                 {/* Parallax Image Wrapper */}
                 <div className="panel-img-wrapper" style={{ borderRadius: '0 200px 0 200px', overflow: 'hidden' }}>
                   <motion.img 
                     src="/salon.png" 
                     alt="Salon" 
                     className="panel-img liquid-image" 
                     style={{ x: imageParallax, scale: 1.2 }} 
                   />
                 </div>
               </div>
            </div>

            {/* Panel 3 */}
            <div className="horizontal-panel">
               <div className="panel-split reverse">
                 <div className="panel-img-wrapper" style={{ borderRadius: '200px 200px 0 0', overflow: 'hidden' }}>
                   <motion.img 
                     src="/bridal.png" 
                     alt="Bridal" 
                     className="panel-img liquid-image" 
                     style={{ x: imageParallax, scale: 1.2 }} 
                   />
                 </div>
                 <div className="panel-text">
                   <span className="section-label">02 — Bridal</span>
                   <h2 className="text-large">Editorial <br/><span className="text-editorial">Elegance</span></h2>
                 </div>
               </div>
            </div>

            {/* Panel 4 */}
            <div className="horizontal-panel" style={{ justifyContent: 'center' }}>
               <h2 className="text-massive kinetic-text" style={{ WebkitTextStroke: '2px var(--color-text)', color: 'transparent', textAlign: 'center' }}>
                 CREATE <br/> MAGIC
               </h2>
            </div>

          </motion.div>
        </div>
      </section>

      {/* 3. The Light Mode Reveal Footer */}
      <footer className="footer-giant">
        <div className="container text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }} viewport={{ once: true }}>
             <h2 className="text-massive text-editorial kinetic-text" style={{ color: 'var(--color-accent)' }}>
               AURA.
             </h2>
             <button className="btn-magnetic mt-8" style={{ background: 'var(--color-text)', color: 'var(--color-bg)', borderColor: 'transparent' }}>
               <span style={{ color: 'var(--color-bg)'}}>Book the Transformation</span>
             </button>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

export default App;
