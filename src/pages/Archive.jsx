import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const Archive = ({ setTheme }) => {
  useEffect(() => {
    setTheme('dark');
    window.scrollTo(0, 0);
  }, [setTheme]);

  const images = [
    { src: "/hero.png", title: "Structure 01", aspect: "aspect-tall", speed: -20 },
    { src: "/salon.png", title: "Geometry 02", aspect: "aspect-wide", speed: 10 },
    { src: "/bridal.png", title: "Elegance 03", aspect: "aspect-square", speed: -10 },
    { src: "/hero.png", title: "Volume 04", aspect: "aspect-tall", speed: 20 },
    { src: "/salon.png", title: "Precision 05", aspect: "aspect-square", speed: -30 },
    { src: "/bridal.png", title: "Symmetry 06", aspect: "aspect-wide", speed: 15 },
  ];

  return (
    <div className="page-container relative z-10" style={{ paddingTop: '20vh', paddingBottom: '15vh' }}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}>
          <span className="tiny-label mb-8">THE ARCHIVE</span>
          <h1 className="text-massive kinetic-text" style={{ lineHeight: 0.85 }}>VISUAL</h1><br/>
          <h1 className="text-massive text-editorial kinetic-text pl-8">INDEX.</h1>
          <p className="editorial-text mt-8 drop-cap">
            A curated database of our structural interventions and chemical formulations. 
            Scroll to experience the raw output of our directors.
          </p>
        </motion.div>

        <div className="archive-masonry mt-16">
          {images.map((img, i) => (
            <motion.div 
              key={i} 
              className={`archive-item hover-target ${img.aspect}`}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1, delay: i * 0.1, ease: [0.76, 0, 0.24, 1] }}
            >
              <div className="archive-img-wrapper">
                <img src={img.src} alt={img.title} className="liquid-image" />
              </div>
              <div className="archive-meta flex-between mt-4">
                <span className="tiny-label">ID // 00{i+1}</span>
                <span className="editorial-text-small">{img.title}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Archive;
