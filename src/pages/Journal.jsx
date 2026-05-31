import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const Journal = ({ setTheme }) => {
  useEffect(() => {
    setTheme('light');
    window.scrollTo(0, 0);
  }, [setTheme]);

  const articles = [
    { title: "The Anatomy of a Precision Cut", date: "MAY 2026", excerpt: "Why geometry dictates exactly how hair falls, and why we abandoned the texturizing shear." },
    { title: "Chemical Transparency", date: "APR 2026", excerpt: "The molecular reality of lifting hair past level 9 without compromising structural integrity." },
    { title: "The Bridal Silhouette", date: "MAR 2026", excerpt: "Engineering a look that withstands 14 hours of movement while maintaining editorial stiffness." },
  ];

  return (
    <div className="page-container relative z-10" style={{ paddingTop: '20vh', paddingBottom: '15vh' }}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}>
          <span className="tiny-label mb-8">THE JOURNAL</span>
          <h1 className="text-massive kinetic-text" style={{ lineHeight: 0.85 }}>THEORY &</h1><br/>
          <h1 className="text-massive text-editorial kinetic-text pl-8">PRACTICE.</h1>
        </motion.div>

        <div className="journal-list mt-16">
          {articles.map((art, i) => (
            <motion.div 
              key={i} 
              className="journal-item hover-target border-bottom py-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1, delay: i * 0.1, ease: [0.76, 0, 0.24, 1] }}
            >
              <div className="flex-between mb-4">
                <span className="tiny-label">{art.date}</span>
                <span className="service-tag">[ READ ]</span>
              </div>
              <h2 className="text-large" style={{ fontSize: 'clamp(2rem, 4vw, 4rem)' }}>{art.title}</h2>
              <p className="editorial-text mt-4" style={{ maxWidth: '800px' }}>{art.excerpt}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Journal;
