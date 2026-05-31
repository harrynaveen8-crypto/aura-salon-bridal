import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import AssemblingSVG from '../components/AssemblingSVG';

const WordReveal = ({ text, className, delay = 0 }) => {
  const words = text.split(" ");
  return (
    <div style={{ overflow: 'hidden', display: 'flex', flexWrap: 'wrap', gap: '0.2em' }} className={className}>
      {words.map((word, i) => (
        <motion.span 
          key={i}
          initial={{ y: "100%", opacity: 0, rotate: 2 }}
          whileInView={{ y: "0%", opacity: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: delay + (i * 0.05), ease: [0.76, 0, 0.24, 1] }}
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
  const imageY = useTransform(smoothHero, [0, 1], ["0%", "30%"]);
  const textOpacity = useTransform(smoothHero, [0, 0.5], [1, 0]);
  const textY = useTransform(smoothHero, [0, 1], ["0%", "-50%"]);

  const assemblyRef = useRef(null);
  const { scrollYProgress: assemblyScroll } = useScroll({ target: assemblyRef, offset: ["start start", "end end"] });
  // Map scroll progress of the 400vh container to 0-1 for the SVG drawing
  const svgPathLength = useTransform(assemblyScroll, [0, 1], [0, 1]);
  const svgOpacity = useTransform(assemblyScroll, [0, 0.05], [0, 1]);
  const textFadeOut = useTransform(assemblyScroll, [0.8, 1], [1, 0]);

  const horizontalRef = useRef(null);
  const { scrollYProgress: horizontalScroll } = useScroll({ target: horizontalRef });
  const smoothHorizontal = useSpring(horizontalScroll, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const xTransform = useTransform(smoothHorizontal, [0, 0.8, 1], ["0%", "-75%", "-75%"]);
  const imageParallax = useTransform(smoothHorizontal, [0, 1], ["-15%", "15%"]);

  return (
    <>
      <Flashbulb scrollProgress={pageScroll} />

      {/* MATURE FULL-BLEED PARALLAX HERO */}
      <section ref={heroRef} className="hero-mature relative" style={{ height: '120vh', overflow: 'hidden' }}>
        <motion.div style={{ y: imageY, width: '100%', height: '120%', position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
          <img src="/hero.png" alt="Aura" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
        </motion.div>
        
        <motion.div className="container" style={{ position: 'relative', height: '100%', zIndex: 10, display: 'flex', alignItems: 'center', opacity: textOpacity, y: textY }}>
          <div style={{ width: '100%' }}>
             <WordReveal text="ARTISTRY" className="text-massive kinetic-text" delay={0.2} />
             <div className="flex-between mt-8" style={{ alignItems: 'flex-start' }}>
               <p className="editorial-text-small" style={{ maxWidth: '300px' }}>
                 A symphony of chemical mastery and geometric precision. Based in the heart of the design district.
               </p>
               <WordReveal text="UNLEASHED." className="text-massive text-editorial kinetic-text" delay={0.5} />
             </div>
          </div>
        </motion.div>
      </section>

      {/* EXTREME ZETTA-JOULE ASSEMBLY ANIMATION - PAGE PINNED */}
      <section ref={assemblyRef} className="bg-base relative z-10" style={{ height: '400vh' }}>
        <div className="sticky-assembly" style={{ position: 'sticky', top: 0, height: '100vh', width: '100vw', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
           <motion.div style={{ opacity: textFadeOut }} className="text-center mb-8">
              <span className="tiny-label">CONSTRUCTING THE SILHOUETTE</span>
              <p className="editorial-text-small mt-4" style={{ maxWidth: '400px', margin: '0 auto' }}>Scroll to build the physical framework.</p>
           </motion.div>
           <div style={{ height: '70vh', width: '100vw' }}>
              <AssemblingSVG pathLength={svgPathLength} opacity={svgOpacity} />
           </div>
        </div>
      </section>

      {/* MASSIVE PHILOSOPHICAL SCROLL SECTION */}
      <section className="bg-base py-32 relative z-10 border-bottom">
        <div className="container">
          <div className="grid-2-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8rem' }}>
            <div className="sticky-col" style={{ position: 'sticky', top: '25vh', height: 'max-content' }}>
              <span className="tiny-label mb-8">001 — THE DOCTRINE</span>
              <h2 className="text-large">We reject<br/><span className="text-editorial">the ordinary.</span></h2>
            </div>
            <div className="scroll-col">
              <p className="editorial-text mb-16 drop-cap">
                The foundation of luxury is not excess; it is absolute, unforgiving curation. We dissect every strand, every formulation, and every shadow to build a silhouette that commands the room.
              </p>
              <img src="/salon.png" alt="Detail" className="w-full mb-16" style={{ height: '70vh', objectFit: 'cover' }} />
              <p className="editorial-text mb-16">
                Our directors undergo brutal training regimens. Only the top 1% of structural engineers touch your canvas. The result is an architectural integrity that lasts for months, not hours.
              </p>
              <img src="/bridal.png" alt="Detail" className="w-full" style={{ height: '70vh', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </section>

      {/* EXPERT ACCORDION / DETAILS SECTION */}
      <section className="bg-base py-32 relative z-10 border-bottom">
        <div className="container text-center">
           <span className="tiny-label mb-16">THE METHODOLOGY</span>
           <WordReveal text="Precision is" className="text-large mx-auto" />
           <WordReveal text="our only language." className="text-large text-editorial mx-auto mb-16" />
        </div>
        <div className="container" style={{ maxWidth: '900px' }}>
           <div className="accordion-item border-bottom py-8">
             <div className="flex-between"><h3 className="text-large" style={{ fontSize: '2rem' }}>01 / Consultation</h3><span className="tiny-label">[ 30 MIN ]</span></div>
             <p className="editorial-text-small mt-8">We analyze facial geometry, lifestyle tension, and hair density. No scissors are lifted until the blueprint is perfect.</p>
           </div>
           <div className="accordion-item border-bottom py-8">
             <div className="flex-between"><h3 className="text-large" style={{ fontSize: '2rem' }}>02 / Chemistry</h3><span className="tiny-label">[ 120 MIN ]</span></div>
             <p className="editorial-text-small mt-8">Bespoke formulations. We do not use off-the-shelf color. Every pigment is mixed specifically for your skin undertone.</p>
           </div>
           <div className="accordion-item border-bottom py-8">
             <div className="flex-between"><h3 className="text-large" style={{ fontSize: '2rem' }}>03 / Architecture</h3><span className="tiny-label">[ 90 MIN ]</span></div>
             <p className="editorial-text-small mt-8">The cut. Dry-sculpting techniques to ensure the hair falls perfectly even when you wash it at home.</p>
           </div>
        </div>
      </section>

      {/* ORIGINAL SERVICES SECTION, BUT LONGER */}
      <section className="services-section hover-target relative bg-base pt-32">
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
         <div className="container mt-16 mb-16 text-center" style={{ paddingBottom: '15vh' }}>
            <Link to="/services">
              <button className="btn-magnetic hover-target" style={{ borderColor: 'rgba(240, 235, 225, 0.4)' }}>
                <span>Explore Full Details</span>
              </button>
            </Link>
         </div>
      </section>

      {/* HORIZONTAL SCROLL IS RETAINED FOR TENSION */}
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

      <footer className="footer-giant bg-base relative z-10">
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
