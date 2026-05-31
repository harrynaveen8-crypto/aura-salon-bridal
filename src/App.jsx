import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import Lenis from 'lenis';

// -------------------------------------------------------------
// AWWWARDS-GRADE UI COMPONENTS & TOYS
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
  const cursorRef = useRef(null);
  useEffect(() => {
    const onMouseMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.animate({
          left: `${e.clientX}px`,
          top: `${e.clientY}px`
        }, { duration: 800, fill: "forwards", easing: "cubic-bezier(0.175, 0.885, 0.32, 1.275)" });
      }
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);
  return <div ref={cursorRef} className="liquid-cursor" />;
};

const PlayfulTool = ({ children, initialX, initialY, delay = 0, size = "250px" }) => {
  return (
    <motion.div
      drag
      dragConstraints={{ left: -150, right: 150, top: -150, bottom: 150 }}
      dragElastic={0.4}
      whileDrag={{ scale: 1.2, cursor: 'grabbing', rotate: 15, opacity: 0.9 }}
      whileHover={{ scale: 1.1 }}
      animate={{ y: [0, -50, 0], rotate: [0, 8, -8, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: delay }}
      className="playful-tool"
      style={{
        position: 'absolute', top: initialY, left: initialX,
        cursor: 'grab', zIndex: 15, color: 'var(--color-accent)', opacity: 0.2,
        width: size, height: size
      }}
    >
      {children}
    </motion.div>
  );
};

// Premium SVGs
const CombSVG = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="currentColor">
    <path d="M 10 30 L 90 30 C 95 30 95 40 90 40 L 10 40 C 5 40 5 30 10 30 Z" />
    {[...Array(14)].map((_, i) => <rect key={i} x={18 + i * 5} y="40" width="2" height="35" rx="1" />)}
  </svg>
);

const MirrorSVG = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4">
    <circle cx="50" cy="35" r="25" />
    <path d="M 45 60 L 45 85 C 45 90 55 90 55 85 L 55 60" fill="currentColor" stroke="none" />
  </svg>
);

const SpraySVG = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4">
    <rect x="35" y="45" width="30" height="45" rx="8" />
    <rect x="42" y="30" width="16" height="15" fill="currentColor" stroke="none" />
    <path d="M 42 30 L 25 20 L 65 20 C 70 20 70 30 65 30 Z" fill="currentColor" stroke="none" />
  </svg>
);

const BrushSVG = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M 40 50 L 60 50 L 65 30 L 35 30 Z" fill="currentColor"/>
    <path d="M 45 50 L 45 80 Q 50 90 55 80 L 55 50" strokeWidth="6" strokeLinecap="round" />
    <path d="M 35 30 Q 50 10 65 30" stroke="none" fill="currentColor" opacity="0.5"/>
  </svg>
);

// -------------------------------------------------------------
// SECTIONS
// -------------------------------------------------------------

const ManifestoSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 50%"] });
  const text = "We believe hair is a canvas. Every cut is an architectural decision. Every color is an emotion. We don't follow trends, we sculpt them. Welcome to the avant-garde of beauty.";
  const words = text.split(" ");
  
  return (
    <section ref={ref} className="manifesto-section container hover-target">
       <h2 className="text-large text-center kinetic-text" style={{ lineHeight: 1.4, display: 'block' }}>
         {words.map((word, i) => {
           const start = i / words.length;
           const end = start + (1 / words.length);
           const opacity = useTransform(scrollYProgress, [start, end], [0.1, 1]);
           const filter = useTransform(scrollYProgress, [start, end], ["blur(10px)", "blur(0px)"]);
           return <motion.span key={i} style={{ opacity, filter, display: 'inline-block', marginRight: '0.2em' }}>{word}</motion.span>
         })}
       </h2>
       {/* Background playful floating toy */}
       <PlayfulTool initialX="70vw" initialY="-10vh" size="150px" delay={1}><BrushSVG /></PlayfulTool>
    </section>
  );
};

const ServicesSection = () => {
  return (
    <section className="services-section hover-target">
       <div className="marquee-container">
          <div className="marquee-content">
             SCULPT • COLOR • STYLE • BRIDAL • EXTENSIONS • SCULPT • COLOR • STYLE • BRIDAL • EXTENSIONS •
          </div>
       </div>
       <div className="container services-grid mt-8">
          <div className="service-item">
            <span className="service-number">01</span>
            <h3>The Cut</h3>
            <p className="editorial-text">Architectural precision meets effortless flow. We engineer cuts that grow beautifully over time.</p>
          </div>
          <div className="service-item">
            <span className="service-number">02</span>
            <h3>The Color</h3>
            <p className="editorial-text">Bespoke formulations. From dimensional balayage to vivid color blocking, painted by masters.</p>
          </div>
          <div className="service-item">
            <span className="service-number">03</span>
            <h3>The Bridal</h3>
            <p className="editorial-text">Editorial elegance for your biggest moment. High-fashion techniques applied to classic beauty.</p>
          </div>
          <div className="service-item">
            <span className="service-number">04</span>
            <h3>The Care</h3>
            <p className="editorial-text">Luxury treatments, scalp facials, and deep molecular repair to restore your canvas.</p>
          </div>
       </div>
    </section>
  )
}

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
    if (latest > 0.9 && theme !== 'light') setTheme('light');
    else if (latest <= 0.9 && theme !== 'dark') setTheme('dark');
  });

  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const smoothHero = useSpring(heroScroll, { stiffness: 100, damping: 30 });
  const heroScale = useTransform(smoothHero, [0, 1], [1, 1.3]);
  const heroOpacity = useTransform(smoothHero, [0, 0.7], [1, 0]);

  const horizontalRef = useRef(null);
  const { scrollYProgress: horizontalScroll } = useScroll({ target: horizontalRef });
  const smoothHorizontal = useSpring(horizontalScroll, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const xTransform = useTransform(smoothHorizontal, [0, 1], ["0%", "-75%"]);
  const imageParallax = useTransform(smoothHorizontal, [0, 1], ["-15%", "15%"]);

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

      {/* 1. Hero */}
      <section className="hero" ref={heroRef}>
        <PlayfulTool initialX="10vw" initialY="15vh" delay={0} size="250px"><MirrorSVG /></PlayfulTool>
        <PlayfulTool initialX="75vw" initialY="30vh" delay={1} size="250px"><CombSVG /></PlayfulTool>
        <PlayfulTool initialX="20vw" initialY="65vh" delay={2} size="200px"><SpraySVG /></PlayfulTool>

        <motion.div className="hero-img-wrapper" style={{ scale: heroScale, opacity: heroOpacity, zIndex: 1 }}>
          <img src="/hero.png" alt="Aura" className="hero-img liquid-image" />
        </motion.div>
        
        <div className="container hero-content-container" style={{ zIndex: 10 }}>
          <div className="hero-text-overlay" style={{ overflow: 'hidden' }}>
            <motion.h1 initial={{ y: "100%" }} animate={{ y: "0%" }} transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }} className="text-massive kinetic-text">
              ARTISTRY
            </motion.h1>
            <div style={{ overflow: 'hidden', marginTop: '-4vh' }}>
              <motion.h1 initial={{ y: "100%" }} animate={{ y: "0%" }} transition={{ duration: 1.2, delay: 0.1, ease: [0.76, 0, 0.24, 1] }} className="text-massive text-editorial kinetic-text" style={{ marginLeft: '15vw' }}>
                UNLEASHED
              </motion.h1>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Manifesto Section */}
      <ManifestoSection />

      {/* 3. Services Section */}
      <ServicesSection />

      {/* 4. Dense Horizontal Gallery */}
      <section ref={horizontalRef} className="horizontal-section-container">
        <div className="horizontal-sticky">
          <motion.div className="horizontal-track" style={{ x: xTransform }}>
            
            <div className="horizontal-panel">
              <div className="panel-content">
                <AnimatedText text="A Curated" className="text-large" />
                <br/>
                <AnimatedText text="Experience." className="text-large text-editorial" delayOffset={0.2} />
                <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.6, duration: 1 }} className="editorial-text mt-8">
                  Step into our gallery. We approach hair as a sculptural medium, combining technical mastery with an unapologetic aesthetic vision.
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
                 <div className="panel-img-wrapper hover-target" style={{ borderRadius: '0 200px 0 200px', overflow: 'hidden' }}>
                   <motion.img src="/salon.png" alt="Salon" className="panel-img liquid-image" style={{ x: imageParallax, scale: 1.2 }} />
                 </div>
                 <PlayfulTool initialX="-5vw" initialY="-10vh" size="120px" delay={0}><BrushSVG /></PlayfulTool>
               </div>
            </div>

            <div className="horizontal-panel">
               <div className="panel-split reverse">
                 <div className="panel-img-wrapper hover-target" style={{ borderRadius: '200px 200px 0 0', overflow: 'hidden' }}>
                   <motion.img src="/bridal.png" alt="Bridal" className="panel-img liquid-image" style={{ x: imageParallax, scale: 1.2 }} />
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

      {/* 5. Footer */}
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
