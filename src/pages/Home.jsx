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

const Home = ({ setTheme, revealImage, setRevealImage }) => {
  useEffect(() => {
    setTheme('dark');
    window.scrollTo(0, 0);
  }, [setTheme]);

  const { scrollYProgress: pageScroll } = useScroll();

  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const smoothHero = useSpring(heroScroll, { stiffness: 100, damping: 30 });
  const imageY = useTransform(smoothHero, [0, 1], ["0%", "30%"]);
  const textOpacity = useTransform(smoothHero, [0, 0.5], [1, 0]);
  const textY = useTransform(smoothHero, [0, 1], ["0%", "-50%"]);

  const horizontalRef = useRef(null);
  const { scrollYProgress: horizontalScroll } = useScroll({ target: horizontalRef });
  const smoothHorizontal = useSpring(horizontalScroll, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const xTransform = useTransform(smoothHorizontal, [0, 0.8, 1], ["0%", "-75%", "-75%"]);
  const imageParallax = useTransform(smoothHorizontal, [0, 1], ["-15%", "15%"]);

  // Trigger light theme when reaching the end of the horizontal scroll
  useMotionValueEvent(horizontalScroll, "change", (latest) => {
    if (latest > 0.85) setTheme('light');
    else setTheme('dark');
  });

  const doctrineRef = useRef(null);
  const { scrollYProgress: doctrineScroll } = useScroll({ target: doctrineRef, offset: ["start center", "end end"] });
  const svgPathLength = useTransform(doctrineScroll, [0, 1], [0, 1]);
  const svgOpacity = useTransform(doctrineScroll, [0, 0.2], [0, 1]);

  return (
    <>
      {/* MATURE FULL-BLEED PARALLAX HERO - No Noise Overlay */}
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

      {/* DOCTRINE WITH STICKY SVG ASSEMBLY */}
      <section ref={doctrineRef} className="bg-base py-32 relative z-10 border-bottom">
        <div className="container">
          <div className="grid-2-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8rem', alignItems: 'start' }}>
            
            <div className="sticky-col" style={{ position: 'sticky', top: '15vh', height: '80vh', display: 'flex', flexDirection: 'column' }}>
              <div>
                <span className="tiny-label mb-8">001 — THE DOCTRINE & ARCHITECTURE</span>
                <h2 className="text-large">We reject<br/><span className="text-editorial">the ordinary.</span></h2>
              </div>
              
              <div style={{ position: 'absolute', top: '20%', left: '-10vw', width: '150%', height: '120vh', opacity: 0.15, zIndex: -1, pointerEvents: 'none' }}>
                <AssemblingSVG pathLength={svgPathLength} opacity={svgOpacity} />
              </div>
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

      {/* HORIZONTAL GALLERY ARCHIVE */}
      <section ref={horizontalRef} className="horizontal-section-container">
        <div className="horizontal-sticky">
          <motion.div className="horizontal-track" style={{ x: xTransform }}>
            
            <div className="horizontal-panel-intro">
              <div className="panel-content">
                <span className="tiny-label mb-8">002 — THE ARCHIVE</span>
                <WordReveal text="A Curated" className="text-large" delay={0} />
                <WordReveal text="Experience." className="text-large text-editorial" delay={0.3} />
                <p className="editorial-text mt-8">Step into our structural gallery. Observe the tension between severe technical mastery and fluid aesthetic vision.</p>
              </div>
            </div>

            <div className="horizontal-panel">
               <div className="panel-split">
                 <div className="panel-text relative">
                   <span className="tiny-label mb-8">SCENE // 01</span>
                   <h2 className="text-large">Precision <br/><span className="text-editorial">Craft</span></h2>
                 </div>
                 <div className="panel-img-group hover-target">
                   <div className="panel-img-wrapper main-img"><motion.img src="/salon.png" alt="Salon" className="panel-img liquid-image" style={{ x: imageParallax, scale: 1.2 }} /></div>
                 </div>
               </div>
            </div>

            <div className="horizontal-panel">
               <div className="panel-split reverse">
                 <div className="panel-img-group hover-target">
                   <div className="panel-img-wrapper main-img"><motion.img src="/bridal.png" alt="Bridal" className="panel-img liquid-image" style={{ x: imageParallax, scale: 1.2 }} /></div>
                 </div>
                 <div className="panel-text relative pl-8">
                   <span className="tiny-label mb-8">SCENE // 02</span>
                   <h2 className="text-large">Editorial <br/><span className="text-editorial">Elegance</span></h2>
                 </div>
               </div>
            </div>

            <div className="horizontal-panel" style={{ justifyContent: 'center', width: '100vw' }}>
               <div className="text-center">
                 <WordReveal text="THE FINALE" className="text-massive kinetic-text" delay={0} />
                 <p className="editorial-text mt-8 mx-auto" style={{ textAlign: 'center', opacity: 0.5 }}>
                   Scroll down to trigger the climax.
                 </p>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* BRUTALIST PURE WHITE FOOTER */}
      <footer className="footer-giant relative z-10" style={{ background: '#FFFFFF', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <div className="container text-center">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }} viewport={{ once: true }}>
             <span className="tiny-label mb-8" style={{ color: '#000000' }}>THE CONCLUSION</span>
             <h2 className="text-massive kinetic-text" style={{ color: '#000000', fontFamily: 'var(--font-heading)' }}>AURA.</h2>
             <div className="mt-16">
               <Link to="/booking">
                 <button className="btn-magnetic hover-target" style={{ borderColor: '#000000', color: '#000000' }}>
                   <span style={{ color: '#FFFFFF', mixBlendMode: 'normal' }}>Reserve Your Canvas</span>
                 </button>
               </Link>
             </div>
          </motion.div>
        </div>
      </footer>
    </>
  );
};

export default Home;
