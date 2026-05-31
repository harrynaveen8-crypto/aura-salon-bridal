import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const Archive = ({ setTheme }) => {
  useEffect(() => {
    setTheme('dark');
    window.scrollTo(0, 0);
  }, [setTheme]);

  // Generates a massive list of images to force deep scrolling
  const images = [
    { src: "/hero.png", title: "Structure 01", aspect: "aspect-tall" },
    { src: "/salon.png", title: "Geometry 02", aspect: "aspect-wide" },
    { src: "/bridal.png", title: "Elegance 03", aspect: "aspect-square" },
    { src: "/hero.png", title: "Volume 04", aspect: "aspect-tall" },
    { src: "/salon.png", title: "Precision 05", aspect: "aspect-square" },
    { src: "/bridal.png", title: "Symmetry 06", aspect: "aspect-wide" },
    { src: "/hero.png", title: "Texture 07", aspect: "aspect-tall" },
    { src: "/salon.png", title: "Form 08", aspect: "aspect-wide" },
    { src: "/bridal.png", title: "Light 09", aspect: "aspect-square" },
    { src: "/hero.png", title: "Shadow 10", aspect: "aspect-tall" },
    { src: "/salon.png", title: "Contrast 11", aspect: "aspect-square" },
    { src: "/bridal.png", title: "Balance 12", aspect: "aspect-wide" },
  ];

  return (
    <div className="page-container relative z-10" style={{ paddingTop: '25vh', paddingBottom: '20vh' }}>
      <div className="container" style={{ paddingBottom: '15vh', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}>
          <span className="tiny-label mb-8">THE ARCHIVE // V.01</span>
          <h1 className="text-massive kinetic-text" style={{ lineHeight: 0.85 }}>VISUAL</h1><br/>
          <h1 className="text-massive text-editorial kinetic-text pl-8">INDEX.</h1>
          <p className="editorial-text mt-16 drop-cap" style={{ maxWidth: '800px' }}>
            A curated database of our structural interventions and chemical formulations. 
            We do not believe in temporary styling. We believe in building architectural 
            frameworks for your hair that last. Scroll through the raw, unedited output of our master directors.
          </p>
        </motion.div>
      </div>

      <div className="container archive-masonry mt-16">
        {images.map((img, i) => (
          <motion.div 
            key={i} 
            className={`archive-item hover-target ${img.aspect}`}
            initial={{ opacity: 0, y: 150 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, delay: (i % 3) * 0.2, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="archive-img-wrapper" style={{ overflow: 'hidden' }}>
              <img src={img.src} alt={img.title} className="liquid-image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="archive-meta flex-between mt-4">
              <span className="tiny-label">ID // 00{i+1}</span>
              <span className="editorial-text-small">{img.title}</span>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="container text-center mt-32">
         <h2 className="text-large text-editorial">End of Index.</h2>
      </div>
    </div>
  );
};

export default Archive;
