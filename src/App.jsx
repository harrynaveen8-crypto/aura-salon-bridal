import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Lenis from 'lenis';
import CustomCursor from './CustomCursor';
import { Scissors } from 'lucide-react';

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

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
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

  // Hero Scroll Parallax
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const smoothHero = useSpring(heroScroll, { stiffness: 100, damping: 30 });
  const heroScale = useTransform(smoothHero, [0, 1], [1, 1.25]);
  const heroOpacity = useTransform(smoothHero, [0, 0.5], [1, 0]);

  // Scissor Cut Section Setup
  const cutRef = useRef(null);
  const { scrollYProgress: cutScroll } = useScroll({ target: cutRef, offset: ["start start", "end end"] });
  const smoothCut = useSpring(cutScroll, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  // Phase 1 (0 to 0.5): Scissor moves left to right, cutting the line
  const scissorX = useTransform(smoothCut, [0, 0.5], ["-10vw", "110vw"]);
  const cutLineWidth = useTransform(smoothCut, [0, 0.5], ["0%", "100%"]);
  // Rotate scissors back and forth to simulate cutting
  const scissorRotate = useTransform(smoothCut, [0, 0.1, 0.2, 0.3, 0.4, 0.5], [-90, -130, -90, -130, -90, -130]);

  // Phase 2 (0.5 to 1): The two panels slide apart vertically
  const topPanelY = useTransform(smoothCut, [0.5, 1], ["0%", "-100%"]);
  const bottomPanelY = useTransform(smoothCut, [0.5, 1], ["0%", "100%"]);

  // Horizontal Scroll Section Setup
  const horizontalRef = useRef(null);
  const { scrollYProgress: horizontalScroll } = useScroll({ target: horizontalRef });
  
  // Map vertical scroll (0 to 1) to horizontal translation (0% to -75% for 4 panels)
  // We use useSpring to ensure it feels buttery and doesn't abruptly stop
  const smoothHorizontal = useSpring(horizontalScroll, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const xTransform = useTransform(smoothHorizontal, [0, 1], ["0%", "-75%"]);

  return (
    // Crucial fix: removed global overflow:hidden which breaks position: sticky
    <div style={{ background: 'var(--color-bg)' }}>
      <CustomCursor />
      <div className="noise"></div>

      <nav className="navbar hover-target">
        <div className="nav-logo">AURA.</div>
        <div style={{ fontFamily: 'Syne', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', cursor: 'pointer' }}>
          Menu
        </div>
      </nav>

      {/* 1. Hero Section */}
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

      {/* 2. Scissor Cut Creative Transition */}
      <section className="scissor-cut-section" ref={cutRef}>
        <div className="scissor-sticky">
           
           {/* Content revealed behind the cut */}
           <div className="revealed-content">
              <h2 className="text-massive text-center text-editorial" style={{ color: 'var(--color-accent)' }}>
                THE REVEAL
              </h2>
           </div>

           {/* Top Half Canvas */}
           <motion.div className="cut-panel top" style={{ y: topPanelY }}>
             <h2 className="cut-text" style={{ top: 'auto', bottom: 0, transform: 'translateY(50%)' }}>SCROLL TO CUT</h2>
           </motion.div>
           
           {/* Bottom Half Canvas */}
           <motion.div className="cut-panel bottom" style={{ y: bottomPanelY }}>
             <h2 className="cut-text" style={{ top: 0, transform: 'translateY(-50%)' }}>SCROLL TO CUT</h2>
           </motion.div>

           {/* The Cut Line */}
           <motion.div className="cut-line" style={{ width: cutLineWidth }} />
           
           {/* The Scissors */}
           <motion.div className="scissor-icon" style={{ x: scissorX, rotate: scissorRotate }}>
             <Scissors size={140} color="var(--color-accent)" strokeWidth={1} />
           </motion.div>

        </div>
      </section>

      {/* 3. Horizontal Scroll Masterpiece (Fixed Sticky Sync) */}
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
