import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import Lenis from 'lenis';
import CustomCursor from './CustomCursor';
import { Droplet } from 'lucide-react';

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

// Hyper-realistic Awwwards-inspired Professional Shear SVG
const PremiumScissors = ({ progress }) => {
  // Multiply progress by a large frequency so the blades open and close continuously
  const angle = useTransform(progress, p => Math.abs(Math.sin(p * 30)) * 12);
  const topBlade = useTransform(angle, a => -a);
  const bottomBlade = useTransform(angle, a => a);

  return (
    <svg width="220" height="220" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0px 15px 25px rgba(0,0,0,0.4))' }}>
      <defs>
        <linearGradient id="premiumGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F9D49B" />
          <stop offset="50%" stopColor="#C19A6B" />
          <stop offset="100%" stopColor="#8C6E46" />
        </linearGradient>
        <linearGradient id="titanium" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#e4e4e7" />
          <stop offset="100%" stopColor="#a1a1aa" />
        </linearGradient>
      </defs>

      {/* Center Pivot */}
      <circle cx="100" cy="100" r="4.5" fill="url(#titanium)" stroke="#27272a" strokeWidth="1.5" style={{ zIndex: 10 }} />
      <circle cx="100" cy="100" r="1.5" fill="#18181b" />

      {/* Top Blade & Handle (Pivot at 100, 100) */}
      <motion.g style={{ originX: "100px", originY: "100px", rotate: topBlade }}>
        {/* Blade */}
        <path d="M 100 100 L 195 96 Q 198 96 195 98.5 L 100 102 Z" fill="url(#titanium)" />
        {/* Handle shank */}
        <path d="M 100 100 L 55 108" stroke="url(#premiumGold)" strokeWidth="7" strokeLinecap="round" />
        {/* Finger Ring */}
        <circle cx="40" cy="113" r="16" fill="transparent" stroke="url(#premiumGold)" strokeWidth="5.5" />
        {/* Tang (finger rest) */}
        <path d="M 24 113 L 10 110" stroke="url(#premiumGold)" strokeWidth="3.5" strokeLinecap="round" />
      </motion.g>

      {/* Bottom Blade & Handle */}
      <motion.g style={{ originX: "100px", originY: "100px", rotate: bottomBlade }}>
        {/* Blade */}
        <path d="M 100 100 L 195 104 Q 198 104 195 101.5 L 100 98 Z" fill="url(#titanium)" />
        {/* Handle shank */}
        <path d="M 100 100 L 55 92" stroke="url(#premiumGold)" strokeWidth="7" strokeLinecap="round" />
        {/* Finger Ring */}
        <circle cx="40" cy="87" r="16" fill="transparent" stroke="url(#premiumGold)" strokeWidth="5.5" />
      </motion.g>
    </svg>
  );
};

// Falling Water Droplets
const RainBackground = ({ scrollProgress }) => {
  return (
    <div className="rain-container">
      {[...Array(15)].map((_, i) => {
        const speed = 1 + (i % 4);
        const y = useTransform(scrollProgress, [0, 1], [`-${15 * speed}vh`, `${120 * speed}vh`]);
        const left = `${(i * 6.5)}vw`;
        return (
          <motion.div key={i} style={{ position: 'absolute', top: 0, left, y, opacity: 0.1, color: 'var(--color-accent)', pointerEvents: 'none', zIndex: 1 }}>
            <Droplet size={25 + (i % 25)} strokeWidth={1} />
          </motion.div>
        );
      })}
    </div>
  );
};

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
    if (latest > 0.85 && theme !== 'light') {
      setTheme('light');
    } else if (latest <= 0.85 && theme !== 'dark') {
      setTheme('dark');
    }
  });

  // Hero Parallax
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const smoothHero = useSpring(heroScroll, { stiffness: 100, damping: 30 });
  const heroScale = useTransform(smoothHero, [0, 1], [1, 1.25]);
  const heroOpacity = useTransform(smoothHero, [0, 0.5], [1, 0]);

  // Cinematic Scissor Cut Overlay Transition
  const cutRef = useRef(null);
  const { scrollYProgress: cutScroll } = useScroll({ target: cutRef, offset: ["start start", "end end"] });
  const smoothCut = useSpring(cutScroll, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  // Phase 1 (0 to 0.6): Scissor tracks horizontally and oscillates vertically for a "free cut"
  const scissorX = useTransform(smoothCut, [0, 0.6], ["-10vw", "110vw"]);
  const scissorY = useTransform(smoothCut, p => Math.sin(p * Math.PI * 6) * 35); // Free and wiggly
  const cutLineWidth = useTransform(smoothCut, [0, 0.6], ["0%", "100%"]);

  // Phase 2 (0.6 to 1): The entire overlay gracefully dissolves into the next section.
  // This avoids the "childish" split effect and looks like a professional webgl dissolve.
  const overlayOpacity = useTransform(smoothCut, [0.6, 0.9], [1, 0]);
  const overlayBlur = useTransform(smoothCut, [0.6, 0.9], ["blur(0px)", "blur(30px)"]);
  const overlayScale = useTransform(smoothCut, [0.6, 0.9], [1, 1.1]);

  // Horizontal Scroll Section
  const horizontalRef = useRef(null);
  const { scrollYProgress: horizontalScroll } = useScroll({ target: horizontalRef });
  const smoothHorizontal = useSpring(horizontalScroll, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const xTransform = useTransform(smoothHorizontal, [0, 1], ["0%", "-75%"]);

  return (
    <div className={`app-wrapper theme-${theme}`}>
      <CustomCursor />
      <div className="noise"></div>
      
      <RainBackground scrollProgress={pageScroll} />

      <nav className="navbar hover-target">
        <div className="nav-logo">AURA.</div>
        <div style={{ fontFamily: 'Syne', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', cursor: 'pointer' }}>
          Menu
        </div>
      </nav>

      {/* 1. Hero */}
      <section className="hero" ref={heroRef}>
        <motion.div className="hero-img-wrapper" style={{ scale: heroScale, opacity: heroOpacity }}>
          <img src="/hero.png" alt="Aura Beauty Salon" className="hero-img liquid-image" />
        </motion.div>
        
        <div className="container hero-content-container">
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

      {/* 2. Fluid Scissor Cut Transition */}
      <section className="scissor-cut-section" ref={cutRef}>
        <div className="scissor-sticky">
           
           {/* The solid dark overlay that blurs and dissolves smoothly */}
           <motion.div 
             className="cinematic-overlay" 
             style={{ 
               opacity: overlayOpacity, 
               filter: overlayBlur, 
               scale: overlayScale 
             }}
           >
              <div className="canvas-texture"></div>

              {/* Wavy Cut Line */}
              <motion.div className="wavy-cut-container" style={{ opacity: useTransform(smoothCut, [0.6, 0.65], [1, 0]) }}>
                <svg width="100vw" height="100px" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', overflow: 'visible' }}>
                  <motion.path 
                    d="M 0 50 Q 50 0 100 50 T 200 50 T 300 50 T 400 50 T 500 50 T 600 50 T 700 50 T 800 50 T 900 50 T 1000 50 T 1100 50 T 1200 50 T 1300 50 T 1400 50 T 1500 50 T 1600 50 T 1700 50 T 1800 50 T 1900 50 T 2000 50" 
                    fill="none" 
                    stroke="var(--color-accent)" 
                    strokeWidth="3"
                    style={{ pathLength: cutLineWidth }}
                  />
                </svg>
                {/* Masterfully animated scissors tracking the path */}
                <motion.div className="scissor-icon" style={{ x: scissorX, y: scissorY }}>
                  <PremiumScissors progress={smoothCut} />
                </motion.div>
              </motion.div>
           </motion.div>

        </div>
      </section>

      {/* 3. Horizontal Scroll Masterpiece */}
      <section ref={horizontalRef} className="horizontal-section-container" style={{ marginTop: '-250vh' }}>
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
                  className="editorial-text mt-8 hover-target"
                >
                  Welcome to the playground. Where shears dance, colors pop, and your natural beauty is elevated to high art.
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
                 <div className="panel-img-wrapper hover-target" style={{ borderRadius: '0 200px 0 200px' }}>
                   <img src="/salon.png" alt="Salon" className="panel-img liquid-image" />
                 </div>
               </div>
            </div>

            {/* Panel 3 */}
            <div className="horizontal-panel">
               <div className="panel-split reverse">
                 <div className="panel-img-wrapper hover-target" style={{ borderRadius: '200px 200px 0 0' }}>
                   <img src="/bridal.png" alt="Bridal" className="panel-img liquid-image" />
                 </div>
                 <div className="panel-text">
                   <span className="section-label">02 — Bridal</span>
                   <h2 className="text-large">Editorial <br/><span className="text-editorial">Elegance</span></h2>
                 </div>
               </div>
            </div>

            {/* Panel 4 */}
            <div className="horizontal-panel" style={{ justifyContent: 'center' }}>
               <h2 className="text-massive hover-target kinetic-text" style={{ WebkitTextStroke: '2px var(--color-text)', color: 'transparent', textAlign: 'center' }}>
                 CREATE <br/> MAGIC
               </h2>
            </div>

          </motion.div>
        </div>
      </section>

      {/* 4. The Light Mode Reveal Footer */}
      <footer className="footer-giant hover-target">
        <div className="container text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }} viewport={{ once: true }}>
             <h2 className="text-massive text-editorial" style={{ color: 'var(--color-accent)' }}>
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
