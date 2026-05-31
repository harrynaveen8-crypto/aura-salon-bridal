import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Lenis from 'lenis';
import CustomCursor from './CustomCursor';
import { Scissors, Droplet, Wind, Sparkles } from 'lucide-react';

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

// Floating element component for extreme playfulness
const FloatingIcon = ({ children, initialX, initialY, scrollProgress, yRange, rotationRange }) => {
  const y = useTransform(scrollProgress, [0, 1], yRange);
  const rotate = useTransform(scrollProgress, [0, 1], rotationRange);
  
  return (
    <motion.div 
      style={{ 
        position: 'absolute', top: initialY, left: initialX, 
        y, rotate, 
        color: 'var(--color-accent)', opacity: 0.3, 
        pointerEvents: 'none', zIndex: 1 
      }}
    >
      {children}
    </motion.div>
  );
};

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5, // Even smoother/longer inertia
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  // Global Scroll for floating objects
  const { scrollYProgress: pageScroll } = useScroll();

  // Hero Scroll Parallax
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const smoothHero = useSpring(heroScroll, { stiffness: 100, damping: 30 });
  const heroScale = useTransform(smoothHero, [0, 1], [1, 1.25]);
  const heroOpacity = useTransform(smoothHero, [0, 0.5], [1, 0]);

  // Horizontal Scroll Section Setup
  const horizontalRef = useRef(null);
  const { scrollYProgress: horizontalScroll } = useScroll({ target: horizontalRef });
  const smoothHorizontal = useSpring(horizontalScroll, { stiffness: 100, damping: 30 });
  
  // Map vertical scroll (0 to 1) to horizontal translation (0% to -75% for 4 panels)
  const xTransform = useTransform(smoothHorizontal, [0, 1], ["0%", "-75%"]);

  return (
    <div style={{ background: 'var(--color-bg)', overflow: 'hidden' }}>
      <CustomCursor />
      <div className="noise"></div>
      
      {/* Floating Playful Salon Elements mapped to page scroll */}
      <FloatingIcon scrollProgress={pageScroll} initialX="10vw" initialY="20vh" yRange={["0vh", "150vh"]} rotationRange={[0, 360]}>
        <Scissors size={120} strokeWidth={0.5} />
      </FloatingIcon>
      <FloatingIcon scrollProgress={pageScroll} initialX="85vw" initialY="40vh" yRange={["0vh", "200vh"]} rotationRange={[45, -180]}>
        <Droplet size={100} strokeWidth={0.5} />
      </FloatingIcon>
      <FloatingIcon scrollProgress={pageScroll} initialX="20vw" initialY="120vh" yRange={["0vh", "-100vh"]} rotationRange={[-45, 180]}>
        <Wind size={150} strokeWidth={0.5} />
      </FloatingIcon>
      <FloatingIcon scrollProgress={pageScroll} initialX="80vw" initialY="200vh" yRange={["0vh", "-150vh"]} rotationRange={[0, -270]}>
        <Sparkles size={120} strokeWidth={0.5} />
      </FloatingIcon>

      <nav className="navbar hover-target">
        <div className="nav-logo">AURA.</div>
        <div style={{ fontFamily: 'Syne', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', cursor: 'pointer' }}>
          Menu
        </div>
      </nav>

      <section className="hero" ref={heroRef}>
        <motion.div className="hero-img-wrapper" style={{ scale: heroScale, opacity: heroOpacity }}>
          <img src="/hero.png" alt="Aura Beauty Salon" className="hero-img" />
        </motion.div>
        
        <div className="container hero-content-container">
          <div className="hero-text-overlay" style={{ overflow: 'hidden' }}>
            <motion.h1 
              initial={{ y: "100%" }} animate={{ y: "0%" }} 
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }} 
              className="text-massive"
            >
              ARTISTRY
            </motion.h1>
            <div style={{ overflow: 'hidden', marginTop: '-4vh' }}>
              <motion.h1 
                initial={{ y: "100%" }} animate={{ y: "0%" }} 
                transition={{ duration: 1.2, delay: 0.1, ease: [0.76, 0, 0.24, 1] }} 
                className="text-massive text-editorial" style={{ marginLeft: '15vw' }}
              >
                UNLEASHED
              </motion.h1>
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal Scroll Masterpiece */}
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
                   <img src="/salon.png" alt="Salon" className="panel-img" />
                 </div>
               </div>
            </div>

            {/* Panel 3 */}
            <div className="horizontal-panel">
               <div className="panel-split reverse">
                 <div className="panel-img-wrapper hover-target" style={{ borderRadius: '200px 200px 0 0' }}>
                   <img src="/bridal.png" alt="Bridal" className="panel-img" />
                 </div>
                 <div className="panel-text">
                   <span className="section-label">02 — Bridal</span>
                   <h2 className="text-large">Editorial <br/><span className="text-editorial">Elegance</span></h2>
                 </div>
               </div>
            </div>

            {/* Panel 4 */}
            <div className="horizontal-panel" style={{ justifyContent: 'center' }}>
               <h2 className="text-massive hover-target" style={{ WebkitTextStroke: '2px var(--color-text)', color: 'transparent', textAlign: 'center' }}>
                 CREATE <br/> MAGIC
               </h2>
            </div>

          </motion.div>
        </div>
      </section>

      <footer className="footer-giant hover-target" style={{ zIndex: 100, position: 'relative' }}>
        <div className="container text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }} viewport={{ once: true }}>
             <h2 className="text-massive text-editorial" style={{ color: 'var(--color-accent)' }}>
               AURA.
             </h2>
             <button className="btn-magnetic mt-8" style={{ background: 'var(--color-text)', color: 'var(--color-bg)' }}>
               <span style={{ color: 'var(--color-bg)'}}>Book the Magic</span>
             </button>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

export default App;
