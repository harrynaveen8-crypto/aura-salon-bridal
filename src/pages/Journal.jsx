import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const Journal = ({ setTheme }) => {
  useEffect(() => {
    setTheme('light');
    window.scrollTo(0, 0);
  }, [setTheme]);

  const articles = [
    { 
      title: "The Anatomy of a Precision Cut", 
      date: "MAY 2026", 
      content: "Why geometry dictates exactly how hair falls, and why we abandoned the texturizing shear. Most salons rely on thinning out hair to create false movement. We build structural integrity from the inside out. A true cut does not need product to hold its shape; it relies on mathematics."
    },
    { 
      title: "Chemical Transparency", 
      date: "APR 2026", 
      content: "The molecular reality of lifting hair past level 9 without compromising structural integrity. Lightening hair is not art; it is violent chemistry. We use a proprietary bonding process that repairs the disulfide bonds simultaneously as the peroxide fractures the melanin. This is why our blondes do not break."
    },
    { 
      title: "The Bridal Silhouette", 
      date: "MAR 2026", 
      content: "Engineering a look that withstands 14 hours of movement while maintaining editorial stiffness. A bridal look is not just a style; it is a structural feat meant to survive wind, tears, and gravity. We use tension-pinning techniques borrowed directly from runway shows in Paris."
    },
    { 
      title: "Rejecting the Trend Cycle", 
      date: "FEB 2026", 
      content: "Trends are designed for mass consumption. We engineer bespoke looks that transcend seasons. When you chase a trend, you put an expiration date on your aesthetic. We look at bone structure, skin undertones, and personal ethos to create a permanent signature look."
    },
  ];

  return (
    <div className="page-container relative z-10" style={{ paddingTop: '25vh', paddingBottom: '20vh' }}>
      <div className="container" style={{ paddingBottom: '15vh', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}>
          <span className="tiny-label mb-8">THE JOURNAL // EDITORIAL</span>
          <h1 className="text-massive kinetic-text" style={{ lineHeight: 0.85 }}>THEORY &</h1><br/>
          <h1 className="text-massive text-editorial kinetic-text pl-8">PRACTICE.</h1>
          <p className="editorial-text mt-16 drop-cap" style={{ maxWidth: '800px', color: 'var(--color-text)' }}>
            We do not just style hair. We study it. This journal is a repository of our technical philosophies, chemical breakdowns, and architectural theories. Read to understand the uncompromising standards we hold our directors to.
          </p>
        </motion.div>
      </div>

      <div className="container journal-list mt-16">
        {articles.map((art, i) => (
          <motion.div 
            key={i} 
            className="journal-item hover-target border-bottom py-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '4rem', alignItems: 'flex-start' }}
          >
            <div className="journal-meta" style={{ position: 'sticky', top: '30vh' }}>
              <span className="tiny-label mb-4">{art.date}</span>
              <span className="service-tag">[ READ ARTICLE ]</span>
            </div>
            <div className="journal-content">
              <h2 className="text-large mb-8" style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}>{art.title}</h2>
              <p className="editorial-text" style={{ fontSize: '1.5rem', lineHeight: '2' }}>{art.content}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Journal;
