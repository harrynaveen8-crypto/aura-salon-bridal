import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const WordReveal = ({ text, className, delay = 0 }) => {
  const words = text.split(" ");
  return (
    <div style={{ overflow: 'hidden', display: 'flex', flexWrap: 'wrap', gap: '0.2em' }} className={className}>
      {words.map((word, i) => (
        <motion.span 
          key={i}
          initial={{ y: "100%", opacity: 0, rotate: 5 }}
          whileInView={{ y: "0%", opacity: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: delay + (i * 0.08), ease: [0.76, 0, 0.24, 1] }}
          style={{ display: 'inline-block', transformOrigin: 'left bottom', pointerEvents: 'auto' }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  )
}

const Flashbulb = ({ scrollProgress }) => {
  const [flashed, setFlashed] = useState(false);
  const flashOpacity = useSpring(0, { stiffness: 200, damping: 20 });
  
  useMotionValueEvent(scrollProgress, "change", (latest) => {
    if (latest >= 0.98 && !flashed) {
      setFlashed(true); 
      flashOpacity.set(1); 
      setTimeout(() => flashOpacity.set(0), 400); 
    } else if (latest < 0.95) { 
      setFlashed(false); 
    }
  });

  return <motion.div className="flashbulb-overlay" style={{ opacity: flashOpacity }} />;
};

const Home = ({ setTheme, revealImage, setRevealImage }) => {
  useEffect(() => {
    setTheme('dark');
    window.scrollTo(0, 0);
  }, [setTheme]);

  const { scrollYProgress: pageScroll } = useScroll();

  useMotionValueEvent(pageScroll, "change", (latest) => {
    if (latest > 0.95) setTheme('light');
    else setTheme('dark');
  });

  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const smoothHero = useSpring(heroScroll, { stiffness: 100, damping: 30 });
  const heroScale = useTransform(smoothHero, [0, 1], [1, 1.3]);
  const heroY = useTransform(smoothHero, [0, 1], ["0%", "20%"]);

  const horizontalRef = useRef(null);
  const { scrollYProgress: horizontalScroll } = useScroll({ target: horizontalRef });
  const smoothHorizontal = useSpring(horizontalScroll, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const xTransform = useTransform(smoothHorizontal, [0, 0.8, 1], ["0%", "-75%", "-75%"]);
  const imageParallax = useTransform(smoothHorizontal, [0, 1], ["-15%", "15%"]);

  return (
    <>
      <Flashbulb scrollProgress={pageScroll} />

      <section className="hero" ref={heroRef}>
        <motion.div className="hero-img-wrapper" style={{ scale: heroScale, y: heroY, zIndex: 1 }}>
          <img src="/hero.png" alt="Aura" className="hero-img" style={{ opacity: 0.6 }} />
        </motion.div>
        
        <div className="container hero-content-container" style={{ zIndex: 10 }}>
          <div className="hero-text-grid">
            <WordReveal text="ARTISTRY" className="text-massive kinetic-text" delay={0.2} />
            <WordReveal text="UNLEASHED" className="text-massive text-editorial kinetic-text align-end" delay={0.6} />
          </div>
        </div>
      </section>

      <section className="editorial-manifesto relative">
        <div className="container manifesto-grid hover-target">
           <div className="manifesto-left relative">
             <span className="tiny-label sticky-label">001 — THE ETHOS</span>
             <div className="vertical-ticker">
               <div className="vertical-ticker-content">AESTHETIC / CRAFT / VISION / AESTHETIC / CRAFT / VISION / AESTHETIC / CRAFT / VISION</div>
             </div>
             <div className="fixed-editorial-frame">
                <AnimatePresence>
                  {revealImage && (
                    <motion.div 
                      className="editorial-frame-inner"
                      initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, scale: 0.95, filter: 'blur(5px)' }}
                      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                    >
                      <img src={revealImage} alt="Reference" />
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
           </div>
           
           <div className="manifesto-right">
             <WordReveal text="We do not follow trends." className="text-large" delay={0.1} />
             <WordReveal text="We engineer them." className="text-large text-editorial" delay={0.5} />
             
             <motion.p initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1.5, delay: 0.4, ease: [0.76, 0, 0.24, 1] }} className="editorial-text mt-8 drop-cap">
               Hair is not just material; it is a structural canvas. Our approach marries 
               <span className="text-reveal-trigger" onMouseEnter={() => setRevealImage('/salon.png')} onMouseLeave={() => setRevealImage(null)}> architectural precision </span> 
               with raw, unapologetic aesthetics. Every cut, every formulation, every movement is meticulously calculated to elevate your 
               <span className="text-reveal-trigger" onMouseEnter={() => setRevealImage('/bridal.png')} onMouseLeave={() => setRevealImage(null)}> natural geometry</span>. 
             </motion.p>
             <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.6 }} className="manifesto-stats mt-8">
               <div className="stat-block"><span className="stat-value">EST.</span><span className="stat-label">2026</span></div>
               <div className="stat-block"><span className="stat-value">04</span><span className="stat-label">MASTER DIRECTORS</span></div>
               <div className="stat-block"><span className="stat-value">12K</span><span className="stat-label">HOURS OF CRAFT</span></div>
             </motion.div>
           </div>
        </div>
      </section>

      <section className="services-section hover-target relative">
         <div className="marquee-container">
            <div className="marquee-content">SCULPT • COLOR • STYLE • BRIDAL • EXTENSIONS • SCULPT • COLOR • STYLE • BRIDAL • EXTENSIONS •</div>
         </div>
         <div className="container services-grid mt-8">
            <div className="service-item">
              <div className="service-watermark">01</div>
              <div className="service-header-flex"><span className="tiny-label">FOUNDATION</span><span className="service-tag">[ 120 MIN ]</span></div>
              <h3 className="service-title">The Cut <span className="service-arrow">→</span></h3>
              <p className="editorial-text-small">Architectural precision meets effortless flow.</p>
            </div>
            <div className="service-item">
              <div className="service-watermark">02</div>
              <div className="service-header-flex"><span className="tiny-label">CHEMISTRY</span><span className="service-tag">[ 180 MIN ]</span></div>
              <h3 className="service-title">The Color <span className="service-arrow">→</span></h3>
              <p className="editorial-text-small">Bespoke formulations painted by masters.</p>
            </div>
            <div className="service-item">
              <div className="service-watermark">03</div>
              <div className="service-header-flex"><span className="tiny-label">EVENT</span><span className="service-tag">[ BESPOKE ]</span></div>
              <h3 className="service-title">The Bridal <span className="service-arrow">→</span></h3>
              <p className="editorial-text-small">High-fashion techniques for classic elegance.</p>
            </div>
            <div className="service-item">
              <div className="service-watermark">04</div>
              <div className="service-header-flex"><span className="tiny-label">RESTORE</span><span className="service-tag">[ 60 MIN ]</span></div>
              <h3 className="service-title">The Care <span className="service-arrow">→</span></h3>
              <p className="editorial-text-small">Luxury molecular repair treatments.</p>
            </div>
         </div>
         <div className="container mt-16 mb-16 text-center" style={{ paddingBottom: '10vh' }}>
            <Link to="/services">
              <button className="btn-magnetic hover-target" style={{ borderColor: 'rgba(240, 235, 225, 0.4)' }}>
                <span>Explore Full Details</span>
              </button>
            </Link>
         </div>
      </section>

      <section ref={horizontalRef} className="horizontal-section-container">
        <div className="horizontal-sticky">
          <motion.div className="horizontal-track" style={{ x: xTransform }}>
            <div className="horizontal-panel border-right">
              <div className="panel-content">
                <span className="tiny-label mb-8">002 — THE ARCHIVE</span>
                <WordReveal text="A Curated" className="text-large" delay={0} />
                <WordReveal text="Experience." className="text-large text-editorial" delay={0.3} />
                <p className="editorial-text mt-8">Step into our structural gallery. Observe the tension between severe technical mastery and fluid aesthetic vision.</p>
                <div className="meta-data mt-8">
                  <div>ARCHIVE NO: 0042</div><div>CURATOR: AURA DIRECTORS</div><div>STATUS: ACTIVE</div>
                </div>
              </div>
            </div>

            <div className="horizontal-panel border-right">
               <div className="panel-split">
                 <div className="panel-text relative">
                   <h1 className="background-number">01</h1>
                   <span className="tiny-label mb-8">SCENE // 01</span>
                   <h2 className="text-large">Precision <br/><span className="text-editorial">Craft</span></h2>
                   <div className="meta-data mt-8"><div>TECHNIQUE: DRY SCULPTING</div><div>DURATION: 120 MIN</div><div>RESULT: EFFORTLESS VOLUME</div></div>
                 </div>
                 <div className="panel-img-group hover-target">
                   <div className="panel-img-wrapper main-img" style={{ borderRadius: '0 100px 0 100px' }}><motion.img src="/salon.png" alt="Salon" className="panel-img liquid-image" style={{ x: imageParallax, scale: 1.2 }} /></div>
                   <motion.div className="panel-img-wrapper inset-img" initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}><img src="/bridal.png" alt="Detail" className="panel-img liquid-image" /></motion.div>
                 </div>
               </div>
            </div>

            <div className="horizontal-panel border-right">
               <div className="panel-split reverse">
                 <div className="panel-img-group hover-target">
                   <div className="panel-img-wrapper main-img" style={{ borderRadius: '100px 100px 0 0' }}><motion.img src="/bridal.png" alt="Bridal" className="panel-img liquid-image" style={{ x: imageParallax, scale: 1.2 }} /></div>
                   <motion.div className="panel-img-wrapper inset-img-left" initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}><img src="/salon.png" alt="Detail" className="panel-img liquid-image" /></motion.div>
                 </div>
                 <div className="panel-text relative pl-8">
                   <h1 className="background-number" style={{ left: '0%' }}>02</h1>
                   <span className="tiny-label mb-8">SCENE // 02</span>
                   <h2 className="text-large">Editorial <br/><span className="text-editorial">Elegance</span></h2>
                   <div className="meta-data mt-8"><div>TECHNIQUE: STRUCTURAL PINNING</div><div>AESTHETIC: RUNWAY</div><div>FEEL: TIMELESS</div></div>
                 </div>
               </div>
            </div>

            <div className="horizontal-panel" style={{ justifyContent: 'center' }}>
               <div className="text-center">
                 <WordReveal text="THE FINALE" className="text-massive kinetic-text" delay={0} />
                 <p className="editorial-text mt-8 mx-auto" style={{ textAlign: 'center', opacity: 0.5 }}>
                   Scroll down to experience the climax.
                 </p>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="footer-giant">
        <div className="container text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }} viewport={{ once: true }}>
             <h2 className="text-massive text-editorial kinetic-text" style={{ color: 'var(--color-accent)' }}>AURA.</h2>
             <Link to="/booking">
               <button className="btn-magnetic mt-8 hover-target" style={{ background: 'var(--color-text)', color: 'var(--color-bg)', borderColor: 'transparent' }}>
                 <span style={{ color: 'var(--color-bg)'}}>Reserve Your Canvas</span>
               </button>
             </Link>
          </motion.div>
        </div>
      </footer>
    </>
  );
};

export default Home;
