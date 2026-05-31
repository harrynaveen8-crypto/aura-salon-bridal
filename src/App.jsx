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

// Realistic animated Scissor Component
const RealisticScissors = ({ progress }) => {
  // Multiply progress by a large frequency so the blades open and close continuously
  const angle = useTransform(progress, p => Math.abs(Math.sin(p * 30)) * 25);
  const topBlade = useTransform(angle, a => -a);
  const bottomBlade = useTransform(angle, a => a);

  return (
    <svg width="120" height="120" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
      <circle cx="50" cy="50" r="4" fill="var(--color-bg)" stroke="var(--color-accent)" strokeWidth="2" zIndex="10"/>
      {/* Top Blade */}
      <motion.g style={{ originX: "50px", originY: "50px", rotate: topBlade }}>
        <path d="M 15 35 C 30 35 45 45 50 50 L 95 48 C 98 48 98 50 95 50 L 50 50 Z" fill="var(--color-accent)" />
        <circle cx="25" cy="35" r="8" fill="var(--color-bg)" stroke="var(--color-accent)" strokeWidth="3" />
      </motion.g>
      {/* Bottom Blade */}
      <motion.g style={{ originX: "50px", originY: "50px", rotate: bottomBlade }}>
        <path d="M 15 65 C 30 65 45 55 50 50 L 95 52 C 98 52 98 50 95 50 L 50 50 Z" fill="var(--color-accent)" />
        <circle cx="25" cy="65" r="8" fill="var(--color-bg)" stroke="var(--color-accent)" strokeWidth="3" />
      </motion.g>
    </svg>
  );
};

// Falling Water Droplets
const RainBackground = ({ scrollProgress }) => {
  return (
    <div className="rain-container">
      {[...Array(12)].map((_, i) => {
        const speed = 1 + (i % 3);
        const y = useTransform(scrollProgress, [0, 1], [`-${10 * speed}vh`, `${100 * speed}vh`]);
        const left = `${(i * 8.5)}vw`;
        return (
          <motion.div key={i} style={{ position: 'absolute', top: 0, left, y, opacity: 0.15, color: 'var(--color-accent)', pointerEvents: 'none', zIndex: 1 }}>
            <Droplet size={30 + (i % 20)} strokeWidth={1} />
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

  // Switch to light mode when reaching the bottom (Transformation Reveal)
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

  // Refined Scissor Cut Sequence
  const cutRef = useRef(null);
  const { scrollYProgress: cutScroll } = useScroll({ target: cutRef, offset: ["start start", "end end"] });
  const smoothCut = useSpring(cutScroll, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  // Phase 1 (0 to 0.6): Scissor tracks horizontally and oscillates vertically for a "free cut"
  const scissorX = useTransform(smoothCut, [0, 0.6], ["-10vw", "110vw"]);
  const scissorY = useTransform(smoothCut, p => Math.sin(p * Math.PI * 6) * 30); // Wavy Y movement
  const cutLineWidth = useTransform(smoothCut, [0, 0.6], ["0%", "100%"]);

  // Phase 2 (0.6 to 1): The canvas elegantly tears away diagonally
  const tearProgress = useTransform(smoothCut, [0.6, 1], [0, 1]);
  const topTearY = useTransform(tearProgress, [0, 1], ["0%", "-120%"]);
  const topTearRotate = useTransform(tearProgress, [0, 1], [0, -10]);
  const bottomTearY = useTransform(tearProgress, [0, 1], ["0%", "120%"]);
  const bottomTearRotate = useTransform(tearProgress, [0, 1], [0, 10]);

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
           
           {/* The content waiting beneath the cut (Horizontal Scroll acts as the layer underneath visually) */}
           {/* Actually, to make it seamless, the tear layers just overlay the horizontal section which naturally follows in flow. */}
           {/* So the "cut" happens over a black overlay that tears open to reveal the actual horizontal section. */}
           
           <motion.div className="tear-canvas top" style={{ y: topTearY, rotateZ: topTearRotate, transformOrigin: 'top left' }}>
              <div className="canvas-texture"></div>
           </motion.div>
           
           <motion.div className="tear-canvas bottom" style={{ y: bottomTearY, rotateZ: bottomTearRotate, transformOrigin: 'bottom right' }}>
              <div className="canvas-texture"></div>
           </motion.div>

           {/* Wavy Cut Line */}
           <motion.div className="wavy-cut-container" style={{ opacity: useTransform(smoothCut, [0.6, 0.65], [1, 0]) }}>
             <svg width="100vw" height="100px" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', overflow: 'visible' }}>
               <motion.path 
                 d="M 0 50 Q 50 0 100 50 T 200 50 T 300 50 T 400 50 T 500 50 T 600 50 T 700 50 T 800 50 T 900 50 T 1000 50 T 1100 50 T 1200 50 T 1300 50 T 1400 50 T 1500 50 T 1600 50 T 1700 50 T 1800 50 T 1900 50 T 2000 50" 
                 fill="none" 
                 stroke="var(--color-accent)" 
                 strokeWidth="2"
                 style={{ pathLength: cutLineWidth }}
               />
             </svg>
             {/* Realistic Scissors tracking the path */}
             <motion.div className="scissor-icon" style={{ x: scissorX, y: scissorY }}>
               <RealisticScissors progress={smoothCut} />
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
                  Welcome to the playground. Where scissors dance, colors pop, and your natural beauty is elevated to high art.
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
