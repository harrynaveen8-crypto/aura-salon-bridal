import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Lenis from 'lenis';
import CustomCursor from './CustomCursor';

// Split Text Component for letter/word animations
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
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
    };
  }, []);

  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  const heroScale = useTransform(smoothProgress, [0, 0.2], [1, 1.15]);
  const heroY = useTransform(smoothProgress, [0, 0.2], ["0%", "20%"]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.15], [1, 0]);

  const marqueeX1 = useTransform(smoothProgress, [0, 1], ["0%", "-50%"]);
  const marqueeX2 = useTransform(smoothProgress, [0, 1], ["-50%", "0%"]);

  return (
    <div ref={containerRef} style={{ background: 'var(--color-bg)' }}>
      <CustomCursor />
      <div className="noise"></div>
      
      <nav className="navbar hover-target">
        <div className="nav-logo">AURA.</div>
        <div style={{ fontFamily: 'Syne', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', cursor: 'pointer' }}>
          Book Now
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero hover-target">
        <motion.div 
          className="hero-img-wrapper"
          style={{ scale: heroScale, y: heroY }}
        >
          <motion.div 
            className="hero-img-inner"
            initial={{ scale: 1.2, filter: 'blur(10px)' }}
            animate={{ scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
          >
            <img src="/hero.png" alt="Aura Beauty Salon" className="hero-img" />
          </motion.div>
        </motion.div>
        
        <div className="container hero-content-container">
          <motion.div className="hero-text-overlay" style={{ opacity: heroOpacity }}>
            <div style={{ overflow: 'hidden' }}>
              <motion.h1 
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
                className="text-massive"
              >
                AESTHETICS
              </motion.h1>
            </div>
            <div style={{ overflow: 'hidden', marginTop: '-4vh' }}>
              <motion.h1 
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
                className="text-massive text-editorial"
                style={{ marginLeft: '15vw' }}
              >
                REDEFINED
              </motion.h1>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="marquee-section">
        <motion.div className="marquee" style={{ x: marqueeX1 }}>
          <h2>BEAUTY • BRIDAL • EDITORIAL • LUXURY • WELLNESS •</h2>
        </motion.div>
        <motion.div className="marquee" style={{ x: marqueeX2 }}>
          <h2 className="text-editorial" style={{ color: 'var(--color-bg)', WebkitTextStroke: '1px var(--color-accent)' }}>
            ELEVATE YOUR AURA • ELEVATE YOUR AURA • ELEVATE YOUR AURA •
          </h2>
        </motion.div>
      </section>

      {/* Content Reveal Sections */}
      <section className="sticky-wrapper">
        <div className="sticky-content container">
          <div className="grid-asymmetric">
            <div className="sticky-text-block">
              <span className="section-label">01 — The Space</span>
              <AnimatedText text="A minimal sanctuary designed for the modern muse." className="text-large" />
              <motion.p 
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}
                className="editorial-text mt-8 hover-target"
              >
                Forget the chaotic salon floor. We curate bespoke hair and skin transformations in an environment that demands you exhale.
              </motion.p>
              <button className="btn-magnetic mt-8">
                <span>Explore</span>
              </button>
            </div>
            
            <div className="image-reveal-container hover-target">
              <motion.div 
                initial={{ height: "100%" }}
                whileInView={{ height: "0%" }}
                transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                viewport={{ once: true, margin: "-100px" }}
                className="image-curtain"
              />
              <img src="/salon.png" alt="Salon Experience" className="img-fluid" />
            </div>
          </div>
        </div>
      </section>

      <section className="sticky-wrapper" style={{ marginTop: '10vh' }}>
        <div className="sticky-content container">
          <div className="grid-asymmetric reverse">
             <div className="image-reveal-container hover-target">
              <motion.div 
                initial={{ width: "100%" }}
                whileInView={{ width: "0%" }}
                transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                viewport={{ once: true, margin: "-100px" }}
                className="image-curtain"
                style={{ right: 0, left: 'auto' }}
              />
              <img src="/bridal.png" alt="Bridal Styling" className="img-fluid" style={{ borderRadius: '200px 0 0 200px' }} />
            </div>

            <div className="sticky-text-block">
              <span className="section-label">02 — Bridal</span>
              <AnimatedText text="Unapologetically modern, flawlessly executed." className="text-large" />
              <button className="btn-magnetic mt-8">
                <span>Bridal Inquiries</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="services-showcase container">
        <AnimatedText text="Signature Menu" className="text-massive text-center" />
        
        <ul className="services-list mt-16">
          {['Precision Styling', 'Dimensional Color', 'Editorial Makeup', 'Skin Rituals'].map((service, i) => (
            <motion.li 
              key={i}
              className="service-item hover-target"
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: i * 0.1, ease: [0.76, 0, 0.24, 1] } }
              }}
            >
              <h3 className="service-title">{service}</h3>
              <div className="service-line"></div>
            </motion.li>
          ))}
        </ul>
      </section>

      <footer className="footer-giant hover-target">
        <div className="container">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            viewport={{ once: true }}
            className="text-center"
          >
             <h2 className="text-massive" style={{ WebkitTextStroke: '2px var(--color-text)', color: 'transparent', textAlign: 'center' }}>
               AURA STUDIOS
             </h2>
             <button className="btn-magnetic mt-8" style={{ background: 'var(--color-text)', color: 'var(--color-bg)' }}>
               <span style={{ color: 'var(--color-bg)'}}>Book Now</span>
             </button>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

export default App;
