import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, useVelocity } from 'framer-motion';
import Lenis from 'lenis';

// -------------------------------------------------------------
// AWWWARDS-GRADE UI COMPONENTS
// -------------------------------------------------------------

const AnimatedText = ({ text, className, delayOffset = 0 }) => {
  const words = text.split(" ");
  return (
    <span className={className} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2em' }}>
      {words.map((word, index) => (
        <span key={index} style={{ overflow: 'hidden', display: 'inline-block' }}>
          <motion.span
            initial={{ y: "110%", rotateZ: 5 }}
            whileInView={{ y: 0, rotateZ: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: delayOffset + index * 0.05, ease: [0.76, 0, 0.24, 1] }}
            style={{ display: 'inline-block', transformOrigin: 'left bottom' }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

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

// Act 2: Golden Hair Strand Spine (Physics-enabled center line)
const GoldenSpine = () => {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  // Map high scroll velocity to bending the spine
  const bend = useTransform(smoothVelocity, [-2000, 2000], [-30, 30]);
  
  // Create an SVG path dynamically: A bezier curve that bends in the middle based on velocity
  const pathD = useTransform(bend, b => `M 50 0 Q ${50 + b} 50 50 100`);

  return (
    <div className="golden-spine-container">
      <svg preserveAspectRatio="none" viewBox="0 0 100 100" className="golden-spine-svg">
         <motion.path 
           d={pathD} 
           stroke="var(--color-accent)" 
           strokeWidth="0.2" 
           fill="none" 
         />
      </svg>
    </div>
  );
};

// Act 3: Dye Mixing Orbs
const DyeOrb = ({ color, setAccentColor, label }) => {
  return (
    <motion.div
      drag
      dragConstraints={{ left: -150, right: 150, top: -150, bottom: 150 }}
      dragElastic={0.4}
      whileDrag={{ scale: 1.3, cursor: 'grabbing', zIndex: 50 }}
      whileHover={{ scale: 1.1 }}
      onDragStart={() => setAccentColor(color)}
      animate={{ y: [0, -20, 0], x: [0, 10, -10, 0] }}
      transition={{ duration: 5 + Math.random() * 3, repeat: Infinity, ease: "easeInOut" }}
      className="dye-orb hover-target"
      style={{ backgroundColor: color }}
    >
      <span className="dye-label">{label}</span>
    </motion.div>
  );
};

// Act 5: The Editorial Flashbulb
const Flashbulb = ({ scrollProgress }) => {
  const [flashed, setFlashed] = useState(false);
  const flashOpacity = useSpring(0, { stiffness: 400, damping: 20 });
  
  useMotionValueEvent(scrollProgress, "change", (latest) => {
    if (latest > 0.95 && !flashed) {
      setFlashed(true);
      flashOpacity.set(1); // Blinding flash
      setTimeout(() => flashOpacity.set(0), 100); // Fade rapidly
    } else if (latest < 0.9) {
      setFlashed(false);
    }
  });

  return <motion.div className="flashbulb-overlay" style={{ opacity: flashOpacity }} />;
};

// -------------------------------------------------------------
// MAIN APP ARCHITECTURE
// -------------------------------------------------------------

function App() {
  const [theme, setTheme] = useState('dark');
  const [accentColor, setAccentColor] = useState('#B89C72'); // Default Gold

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smooth: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const { scrollYProgress: pageScroll } = useScroll();

  // Shift to light mode at the exact moment of the flashbulb
  useMotionValueEvent(pageScroll, "change", (latest) => {
    if (latest > 0.95 && theme !== 'light') setTheme('light');
    else if (latest <= 0.95 && theme !== 'dark') setTheme('dark');
  });

  // Hero / Foggy Mirror Logic
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const smoothHero = useSpring(heroScroll, { stiffness: 100, damping: 30 });
  const heroScale = useTransform(smoothHero, [0, 1], [1, 1.3]);
  
  const [fogPos, setFogPos] = useState({ x: -1000, y: -1000 });
  const handleFogMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setFogPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  // Horizontal Scroll Setup
  const horizontalRef = useRef(null);
  const { scrollYProgress: horizontalScroll } = useScroll({ target: horizontalRef });
  const smoothHorizontal = useSpring(horizontalScroll, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const xTransform = useTransform(smoothHorizontal, [0, 1], ["0%", "-75%"]);
  const trackLineWidth = useTransform(smoothHorizontal, [0, 1], ["0vw", "400vw"]);
  const imageParallax = useTransform(smoothHorizontal, [0, 1], ["-15%", "15%"]);

  return (
    // Inject dynamic CSS variable for Accent Color (Act 3 payoff)
    <div className={`app-wrapper theme-${theme}`} style={{ '--color-accent': accentColor }}>
      <LiquidCursor />
      <Flashbulb scrollProgress={pageScroll} />
      <GoldenSpine />
      <div className="noise"></div>

      <nav className="navbar">
        <div className="nav-logo">AURA.</div>
        <div style={{ fontFamily: 'Syne', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', cursor: 'none' }}>
          Menu
        </div>
      </nav>

      {/* ACT 1: ARRIVAL & REFLECTION (FOGGY MIRROR HERO) */}
      <section className="hero" ref={heroRef} onMouseMove={handleFogMove}>
        
        {/* Base layer: Crystal clear image */}
        <motion.div className="hero-img-wrapper" style={{ scale: heroScale, zIndex: 1 }}>
          <img src="/hero.png" alt="Aura" className="hero-img" style={{ opacity: 0.8 }} />
        </motion.div>
        
        {/* Overlay layer: Foggy glass that gets "wiped" away by the cursor */}
        <motion.div 
          className="hero-img-wrapper hero-fog-layer" 
          style={{ 
            scale: heroScale, 
            zIndex: 2,
            WebkitMaskImage: `radial-gradient(circle 180px at ${fogPos.x}px ${fogPos.y}px, transparent 0%, black 100%)`,
            maskImage: `radial-gradient(circle 180px at ${fogPos.x}px ${fogPos.y}px, transparent 0%, black 100%)`
          }}
        >
          <img src="/hero.png" alt="Aura Fog" className="hero-img" style={{ filter: 'blur(15px) grayscale(50%) saturate(150%)' }} />
        </motion.div>
        
        <div className="container hero-content-container" style={{ zIndex: 10 }}>
          <div className="hero-text-grid">
            <motion.h1 initial={{ y: "100%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }} transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }} className="text-massive kinetic-text" style={{ pointerEvents: 'auto' }}>
              ARTISTRY
            </motion.h1>
            <motion.h1 initial={{ y: "100%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }} transition={{ duration: 1.2, delay: 0.1, ease: [0.76, 0, 0.24, 1] }} className="text-massive text-editorial kinetic-text align-end" style={{ pointerEvents: 'auto' }}>
              UNLEASHED
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section className="manifesto-section container hover-target">
         <h2 className="text-large text-center kinetic-text" style={{ lineHeight: 1.4, display: 'block' }}>
           "We believe hair is a canvas. Every cut is an architectural decision. Every color is an emotion. We don't follow trends, we sculpt them. Welcome to the avant-garde of beauty."
         </h2>
      </section>

      {/* ACT 3: THE PROCESS (PLAYFUL DYE MIXING) */}
      <section className="dye-mixing-section hover-target">
         <div className="container text-center">
            <span className="section-label">Bespoke Formulations</span>
            <h2 className="text-large mb-8">Mix the <span className="text-editorial">Canvas</span></h2>
            <p className="editorial-text mx-auto">Drag the color orbs to shift the aesthetic of this entire experience. You are the artist.</p>
            
            <div className="orb-container mt-8">
               <DyeOrb color="#14b8a6" label="Cyan" setAccentColor={setAccentColor} />
               <DyeOrb color="#ec4899" label="Magenta" setAccentColor={setAccentColor} />
               <DyeOrb color="#eab308" label="Gold" setAccentColor={setAccentColor} />
               <DyeOrb color="#f87171" label="Crimson" setAccentColor={setAccentColor} />
            </div>
         </div>
      </section>

      <section className="services-section hover-target">
         <div className="marquee-container">
            <div className="marquee-content">
               SCULPT • COLOR • STYLE • BRIDAL • EXTENSIONS • SCULPT • COLOR • STYLE • BRIDAL • EXTENSIONS •
            </div>
         </div>
         <div className="container services-grid mt-8">
            <div className="service-item"><span className="service-number">01</span><h3>The Cut</h3></div>
            <div className="service-item"><span className="service-number">02</span><h3>The Color</h3></div>
            <div className="service-item"><span className="service-number">03</span><h3>The Bridal</h3></div>
            <div className="service-item"><span className="service-number">04</span><h3>The Care</h3></div>
         </div>
         <div className="cornerstone-vertical-line"></div>
      </section>

      {/* ACT 4: THE ART (KINETIC PORTRAITS HORIZONTAL GALLERY) */}
      <section ref={horizontalRef} className="horizontal-section-container">
        <div className="horizontal-sticky">
          
          <motion.div className="cornerstone-horizontal-line" style={{ width: trackLineWidth }} />

          <motion.div className="horizontal-track" style={{ x: xTransform }}>
            
            <div className="horizontal-panel">
              <div className="panel-content">
                <AnimatedText text="A Curated" className="text-large" />
                <br/>
                <AnimatedText text="Experience." className="text-large text-editorial" delayOffset={0.2} />
                <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.6, duration: 1 }} className="editorial-text mt-8">
                  Hover over the typographic masks to unveil the masterpieces.
                </motion.p>
              </div>
            </div>

            <div className="horizontal-panel">
               <div className="panel-split">
                 <div className="panel-text relative">
                   <h1 className="background-number">01</h1>
                   <span className="section-label">The Studio</span>
                   <h2 className="text-large">Precision <br/><span className="text-editorial">Craft</span></h2>
                 </div>
                 
                 {/* Kinetic Typographic Portrait 1 */}
                 <div className="panel-img-wrapper kinetic-portrait hover-target" style={{ borderRadius: '0 200px 0 200px', overflow: 'hidden' }}>
                   <div className="kinetic-ascii-overlay">
                     AURA SCULPT COLOR STYLE CRAFT EDITORIAL MAGIC AURA SCULPT COLOR STYLE CRAFT EDITORIAL MAGIC AURA SCULPT COLOR STYLE CRAFT EDITORIAL MAGIC AURA SCULPT COLOR STYLE CRAFT EDITORIAL MAGIC AURA SCULPT COLOR STYLE CRAFT EDITORIAL MAGIC
                     AURA SCULPT COLOR STYLE CRAFT EDITORIAL MAGIC AURA SCULPT COLOR STYLE CRAFT EDITORIAL MAGIC AURA SCULPT COLOR STYLE CRAFT EDITORIAL MAGIC
                     AURA SCULPT COLOR STYLE CRAFT EDITORIAL MAGIC AURA SCULPT COLOR STYLE CRAFT EDITORIAL MAGIC AURA SCULPT COLOR STYLE CRAFT EDITORIAL MAGIC
                   </div>
                   <motion.img src="/salon.png" alt="Salon" className="panel-img clear-portrait" style={{ x: imageParallax, scale: 1.2 }} />
                 </div>
               </div>
            </div>

            <div className="horizontal-panel">
               <div className="panel-split reverse">
                 
                 {/* Kinetic Typographic Portrait 2 */}
                 <div className="panel-img-wrapper kinetic-portrait hover-target" style={{ borderRadius: '200px 200px 0 0', overflow: 'hidden' }}>
                   <div className="kinetic-ascii-overlay">
                     BRIDAL ELEGANCE FASHION RUNWAY BEAUTY GLAMOUR BRIDAL ELEGANCE FASHION RUNWAY BEAUTY GLAMOUR BRIDAL ELEGANCE FASHION RUNWAY BEAUTY GLAMOUR
                     BRIDAL ELEGANCE FASHION RUNWAY BEAUTY GLAMOUR BRIDAL ELEGANCE FASHION RUNWAY BEAUTY GLAMOUR BRIDAL ELEGANCE FASHION RUNWAY BEAUTY GLAMOUR
                     BRIDAL ELEGANCE FASHION RUNWAY BEAUTY GLAMOUR BRIDAL ELEGANCE FASHION RUNWAY BEAUTY GLAMOUR BRIDAL ELEGANCE FASHION RUNWAY BEAUTY GLAMOUR
                   </div>
                   <motion.img src="/bridal.png" alt="Bridal" className="panel-img clear-portrait" style={{ x: imageParallax, scale: 1.2 }} />
                 </div>
                 
                 <div className="panel-text relative">
                   <h1 className="background-number" style={{ left: '-20%' }}>02</h1>
                   <span className="section-label">Bridal</span>
                   <h2 className="text-large">Editorial <br/><span className="text-editorial">Elegance</span></h2>
                 </div>
               </div>
            </div>

            <div className="horizontal-panel" style={{ justifyContent: 'center' }}>
               <h2 className="text-massive kinetic-text" style={{ WebkitTextStroke: '2px var(--color-text)', color: 'transparent', textAlign: 'center' }}>
                 CREATE <br/> MAGIC
               </h2>
            </div>

          </motion.div>
        </div>
      </section>

      {/* 5. Footer (ACT 5 completes here) */}
      <footer className="footer-giant">
        <div className="container text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }} viewport={{ once: true }}>
             <h2 className="text-massive text-editorial kinetic-text" style={{ color: 'var(--color-accent)' }}>
               AURA.
             </h2>
             <button className="btn-magnetic mt-8" style={{ background: 'var(--color-text)', color: 'var(--color-bg)', borderColor: 'transparent' }}>
               <span style={{ color: 'var(--color-bg)'}}>Reserve Your Canvas</span>
             </button>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

export default App;
