import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';

const Archive = ({ setTheme }) => {
  useEffect(() => {
    setTheme('dark');
    window.scrollTo(0, 0);
  }, [setTheme]);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const xTransform = useTransform(smoothProgress, [0, 1], ["0%", "-80%"]); // Horizontal translation

  const { scrollY } = useScroll();
  const rawVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(rawVelocity, { damping: 50, stiffness: 400 });
  // Map vertical scroll velocity to horizontal skew/slant
  const skewX = useTransform(smoothVelocity, [-1500, 1500], [20, -20]);

  const images = [
    { src: "/hero.png", title: "Structure 01", aspect: "aspect-tall" },
    { src: "/salon.png", title: "Geometry 02", aspect: "aspect-wide" },
    { src: "/bridal.png", title: "Elegance 03", aspect: "aspect-square" },
    { src: "/hero.png", title: "Volume 04", aspect: "aspect-tall" },
    { src: "/salon.png", title: "Precision 05", aspect: "aspect-square" },
    { src: "/bridal.png", title: "Symmetry 06", aspect: "aspect-wide" },
    { src: "/hero.png", title: "Texture 07", aspect: "aspect-tall" },
    { src: "/salon.png", title: "Form 08", aspect: "aspect-wide" },
  ];

  return (
    <div ref={containerRef} className="page-container relative z-10" style={{ height: '600vh', background: 'var(--color-bg)' }}>
      <div className="sticky-horizontal-container" style={{ position: 'sticky', top: 0, height: '100vh', width: '100vw', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <motion.div 
          className="horizontal-track" 
          style={{ x: xTransform, display: 'flex', alignItems: 'center', height: '100%', paddingLeft: '10vw' }}
        >
          {/* Intro Text */}
          <div style={{ minWidth: '80vw', paddingRight: '10vw' }}>
            <span className="tiny-label mb-8">THE ARCHIVE // V.01</span>
            <h1 className="text-massive kinetic-text" style={{ lineHeight: 0.85 }}>VISUAL</h1><br/>
            <h1 className="text-massive text-editorial kinetic-text pl-8">INDEX.</h1>
            <p className="editorial-text mt-16 drop-cap" style={{ maxWidth: '600px' }}>
              Scroll to explore. The faster you move, the more the visual fabric distorts. A complete horizontal catalog of structural interventions.
            </p>
          </div>

          {/* Slanted Image Gallery */}
          <div style={{ display: 'flex', gap: '8vw', paddingRight: '20vw', alignItems: 'center' }}>
            {images.map((img, i) => (
              <motion.div 
                key={i} 
                className="hover-target"
                style={{ skewX: skewX, minWidth: img.aspect === 'aspect-wide' ? '60vw' : '35vw', height: img.aspect === 'aspect-tall' ? '70vh' : '50vh', position: 'relative' }} 
              >
                <div style={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: '4px' }}>
                  <img src={img.src} alt={img.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} className="liquid-image" />
                </div>
                <div className="flex-between mt-4">
                  <span className="tiny-label">ID // 00{i+1}</span>
                  <span className="editorial-text-small">{img.title}</span>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div style={{ minWidth: '50vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
             <h2 className="text-large text-editorial">End of Index.</h2>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Archive;
