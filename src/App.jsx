import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

function App() {
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  // Parallax effects
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(heroScroll, [0, 1], [1, 0]);

  // Reveal variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.6, 0.05, -0.01, 0.9] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <>
      <div className="noise"></div>
      
      <nav className="navbar">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="nav-logo"
        >
          Aura.
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          style={{ fontFamily: 'Syne', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', cursor: 'pointer' }}
        >
          Book Now
        </motion.div>
      </nav>

      <section className="hero" ref={heroRef}>
        <motion.div className="hero-img-container" style={{ y: heroY, opacity: heroOpacity }}>
          <img src="/hero.png" alt="Aura Beauty Salon" className="hero-img" />
        </motion.div>
        
        <div className="container">
          <motion.div 
            className="hero-content"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.p className="hero-subtitle" variants={fadeInUp}>
              The New Standard
            </motion.p>
            <motion.h1 className="text-huge" variants={fadeInUp}>
              Elevated
            </motion.h1>
            <motion.h1 className="text-huge text-editorial" variants={fadeInUp} style={{ marginLeft: '10vw', marginTop: '-3vh' }}>
              Aesthetics
            </motion.h1>
          </motion.div>
        </div>
      </section>

      <section className="editorial-section container">
        <div className="grid-asymmetric">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <img src="/salon.png" alt="Salon Experience" className="img-tall" />
          </motion.div>
          
          <motion.div
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            style={{ padding: '0 2vw' }}
          >
            <motion.span className="section-label" variants={fadeInUp}>01 — The Space</motion.span>
            <motion.h2 className="text-editorial" variants={fadeInUp} style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: '#e4e4e7' }}>
              Redefining <br/><span style={{ color: 'var(--color-accent)' }}>Luxury</span>
            </motion.h2>
            <motion.p className="editorial-text" variants={fadeInUp}>
              Forget the chaotic salon floor. Aura is designed as a minimalist sanctuary where brutalist architecture meets soft, organic beauty. We curate bespoke hair and skin transformations in an environment that demands you exhale.
            </motion.p>
            <motion.button className="btn-magnetic" variants={fadeInUp}>
              Explore Services
            </motion.button>
          </motion.div>
        </div>
      </section>

      <section className="editorial-section container" style={{ paddingTop: 0 }}>
        <div className="grid-asymmetric reverse">
          <motion.div
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            style={{ padding: '0 2vw' }}
          >
            <motion.span className="section-label" variants={fadeInUp}>02 — Bridal</motion.span>
            <motion.h2 className="text-editorial" variants={fadeInUp} style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: '#e4e4e7' }}>
              Editorial <br/><span style={{ color: 'var(--color-accent)' }}>Bridal</span>
            </motion.h2>
            <motion.p className="editorial-text" variants={fadeInUp}>
              Your wedding look shouldn't feel like a costume. Our bridal artists specialize in high-fashion, camera-ready styling that enhances your natural architecture. Unapologetically modern, flawlessly executed.
            </motion.p>
            <motion.button className="btn-magnetic" variants={fadeInUp}>
              Bridal Inquiries
            </motion.button>
          </motion.div>

          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <img src="/bridal.png" alt="Bridal Styling" className="img-wide" />
          </motion.div>
        </div>
      </section>

      <section className="editorial-section container">
        <motion.span 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          className="section-label"
        >
          03 — Our Signature Menu
        </motion.span>
        
        <ul className="services-list">
          {['Precision Cut & Style', 'Dimensional Color & Balayage', 'Editorial Makeup', 'Restorative Skin Treatments'].map((service, i) => (
            <motion.li 
              key={i}
              className="service-item"
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: i * 0.1 } }
              }}
            >
              <h3>{service}</h3>
              <span>Discover +</span>
            </motion.li>
          ))}
        </ul>
      </section>

      <footer className="footer">
        <div className="container">
          <motion.h2 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="footer-huge"
          >
            Ready to <br/>Transform?
          </motion.h2>
          <motion.button 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="btn-magnetic" style={{ backgroundColor: 'var(--color-text)', color: 'var(--color-bg)' }}
          >
            Book Appointment
          </motion.button>
          
          <div style={{ marginTop: '15vh', display: 'flex', justifyContent: 'space-between', fontFamily: 'Syne', fontSize: '0.8rem', color: '#71717a', textTransform: 'uppercase', letterSpacing: '1px' }}>
            <span>© 2026 Aura Studios</span>
            <span>New York City</span>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
