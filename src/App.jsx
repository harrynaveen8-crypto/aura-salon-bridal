import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import Lenis from 'lenis';

// -------------------------------------------------------------
// AWWWARDS-GRADE UI COMPONENTS
// -------------------------------------------------------------

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

const Flashbulb = ({ scrollProgress }) => {
  const [flashed, setFlashed] = useState(false);
  const flashOpacity = useSpring(0, { stiffness: 400, damping: 20 });
  
  useMotionValueEvent(scrollProgress, "change", (latest) => {
    if (latest > 0.95 && !flashed) {
      setFlashed(true);
      flashOpacity.set(1); 
      setTimeout(() => flashOpacity.set(0), 100); 
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

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smooth: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const { scrollYProgress: pageScroll } = useScroll();

  useMotionValueEvent(pageScroll, "change", (latest) => {
    if (latest > 0.95 && theme !== 'light') setTheme('light');
    else if (latest <= 0.95 && theme !== 'dark') setTheme('dark');
  });

  // Hero Parallax
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const smoothHero = useSpring(heroScroll, { stiffness: 100, damping: 30 });
  const heroScale = useTransform(smoothHero, [0, 1], [1, 1.3]);
  const heroY = useTransform(smoothHero, [0, 1], ["0%", "20%"]);

  // Horizontal Scroll Setup
  const horizontalRef = useRef(null);
  const { scrollYProgress: horizontalScroll } = useScroll({ target: horizontalRef });
  const smoothHorizontal = useSpring(horizontalScroll, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const xTransform = useTransform(smoothHorizontal, [0, 1], ["0%", "-75%"]);
  const imageParallax = useTransform(smoothHorizontal, [0, 1], ["-15%", "15%"]);

  return (
    <div className={`app-wrapper theme-${theme}`}>
      <LiquidCursor />
      <Flashbulb scrollProgress={pageScroll} />
      <div className="noise"></div>

      <nav className="navbar">
        <div className="nav-logo">AURA.</div>
        <div style={{ fontFamily: 'Syne', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', cursor: 'none' }}>
          Menu
        </div>
      </nav>

      {/* 1. PROFESSIONAL HERO (Removed Fog Gimmick) */}
      <section className="hero" ref={heroRef}>
        <motion.div className="hero-img-wrapper" style={{ scale: heroScale, y: heroY, zIndex: 1 }}>
          <img src="/hero.png" alt="Aura" className="hero-img" style={{ opacity: 0.7 }} />
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

      {/* 2. PROFESSIONAL MANIFESTO (Replaced choppy scrub with Editorial Grid) */}
      <section className="editorial-manifesto relative">
        <div className="container manifesto-grid hover-target">
           <div className="manifesto-left">
             <span className="tiny-label">001 — THE ETHOS</span>
           </div>
           <div className="manifesto-right">
             <motion.h2 
               initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1 }}
               className="text-large"
             >
               We do not follow trends. <br/>
               <span className="text-editorial">We engineer them.</span>
             </motion.h2>
             <motion.p 
               initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1, delay: 0.2 }}
               className="editorial-text mt-8"
             >
               Hair is not just material; it is a structural canvas. Our approach marries architectural precision with raw, unapologetic aesthetics. Every cut, every formulation, every movement is meticulously calculated to elevate your natural geometry. Welcome to the avant-garde.
             </motion.p>
           </div>
        </div>
      </section>

      {/* 3. SERVICES MARQUEE & GRID */}
      <section className="services-section hover-target relative">
         <div className="marquee-container">
            <div className="marquee-content">
               SCULPT • COLOR • STYLE • BRIDAL • EXTENSIONS • SCULPT • COLOR • STYLE • BRIDAL • EXTENSIONS •
            </div>
         </div>
         <div className="container services-grid mt-8">
            <div className="service-item">
              <span className="tiny-label mb-8">01 / FOUNDATION</span>
              <h3>The Cut</h3>
              <p className="editorial-text-small">Architectural precision meets effortless flow.</p>
            </div>
            <div className="service-item">
              <span className="tiny-label mb-8">02 / CHEMISTRY</span>
              <h3>The Color</h3>
              <p className="editorial-text-small">Bespoke formulations painted by masters.</p>
            </div>
            <div className="service-item">
              <span className="tiny-label mb-8">03 / EVENT</span>
              <h3>The Bridal</h3>
              <p className="editorial-text-small">High-fashion techniques for classic elegance.</p>
            </div>
            <div className="service-item">
              <span className="tiny-label mb-8">04 / RESTORE</span>
              <h3>The Care</h3>
              <p className="editorial-text-small">Luxury molecular repair treatments.</p>
            </div>
         </div>
      </section>

      {/* 4. HIGH-DETAIL HORIZONTAL EDITORIAL GALLERY */}
      <section ref={horizontalRef} className="horizontal-section-container">
        <div className="horizontal-sticky">
          <motion.div className="horizontal-track" style={{ x: xTransform }}>
            
            <div className="horizontal-panel border-right">
              <div className="panel-content">
                <span className="tiny-label mb-8">002 — THE ARCHIVE</span>
                <h2 className="text-large">A Curated <br/><span className="text-editorial">Experience.</span></h2>
                <p className="editorial-text mt-8">
                  Step into our structural gallery. Observe the tension between severe technical mastery and fluid aesthetic vision.
                </p>
                <div className="meta-data mt-8">
                  <div>ARCHIVE NO: 0042</div>
                  <div>CURATOR: AURA DIRECTORS</div>
                  <div>STATUS: ACTIVE</div>
                </div>
              </div>
            </div>

            {/* Gallery Panel 1: Studio (High Detail) */}
            <div className="horizontal-panel border-right">
               <div className="panel-split">
                 <div className="panel-text relative">
                   <h1 className="background-number">01</h1>
                   <span className="tiny-label mb-8">SCENE // 01</span>
                   <h2 className="text-large">Precision <br/><span className="text-editorial">Craft</span></h2>
                   <div className="meta-data mt-8">
                     <div>TECHNIQUE: DRY SCULPTING</div>
                     <div>DURATION: 120 MIN</div>
                     <div>RESULT: EFFORTLESS VOLUME</div>
                   </div>
                 </div>
                 
                 <div className="panel-img-group hover-target">
                   <div className="panel-img-wrapper main-img" style={{ borderRadius: '0 100px 0 100px' }}>
                     <motion.img src="/salon.png" alt="Salon" className="panel-img liquid-image" style={{ x: imageParallax, scale: 1.2 }} />
                   </div>
                   {/* Secondary Inset Detail Image */}
                   <motion.div className="panel-img-wrapper inset-img" initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
                     <img src="/bridal.png" alt="Detail" className="panel-img liquid-image" />
                   </motion.div>
                 </div>
               </div>
            </div>

            {/* Gallery Panel 2: Bridal (High Detail) */}
            <div className="horizontal-panel border-right">
               <div className="panel-split reverse">
                 <div className="panel-img-group hover-target">
                   <div className="panel-img-wrapper main-img" style={{ borderRadius: '100px 100px 0 0' }}>
                     <motion.img src="/bridal.png" alt="Bridal" className="panel-img liquid-image" style={{ x: imageParallax, scale: 1.2 }} />
                   </div>
                   {/* Secondary Inset Detail Image */}
                   <motion.div className="panel-img-wrapper inset-img-left" initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
                     <img src="/salon.png" alt="Detail" className="panel-img liquid-image" />
                   </motion.div>
                 </div>

                 <div className="panel-text relative pl-8">
                   <h1 className="background-number" style={{ left: '0%' }}>02</h1>
                   <span className="tiny-label mb-8">SCENE // 02</span>
                   <h2 className="text-large">Editorial <br/><span className="text-editorial">Elegance</span></h2>
                   <div className="meta-data mt-8">
                     <div>TECHNIQUE: STRUCTURAL PINNING</div>
                     <div>AESTHETIC: RUNWAY</div>
                     <div>FEEL: TIMELESS</div>
                   </div>
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
