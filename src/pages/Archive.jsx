import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';

const Archive = ({ setTheme }) => {
  useEffect(() => {
    setTheme('dark');
    window.scrollTo(0, 0);
  }, [setTheme]);

  const containerRef = useRef(null);
  
  // Track vertical scroll for the horizontal translation
  const { scrollYProgress } = useScroll({ target: containerRef });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const xTransform = useTransform(smoothProgress, [0, 1], ["0%", "-85%"]); 

  // Track raw scroll velocity for the 3D physics engine
  const { scrollY } = useScroll();
  const rawVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(rawVelocity, { damping: 40, stiffness: 300 });

  // 3D BENDING PHYSICS 
  // Map vertical scroll velocity to a 3D Y-axis rotation (the "bend")
  const rotateY = useTransform(smoothVelocity, [-2000, 2000], [35, -35]);
  // Slight Z-axis twist for organic drag
  const rotateZ = useTransform(smoothVelocity, [-2000, 2000], [3, -3]);
  // Scale down slightly under extreme momentum
  const scale = useTransform(smoothVelocity, [-2000, 0, 2000], [0.85, 1, 0.85]);
  // Dynamic shadows that pull opposite to the direction of velocity
  const boxShadow = useTransform(
    smoothVelocity,
    [-2000, 0, 2000],
    [
      "40px 30px 60px rgba(0,0,0,0.9)", 
      "0px 10px 20px rgba(0,0,0,0.2)",  
      "-40px 30px 60px rgba(0,0,0,0.9)" 
    ]
  );
  // Dynamic lighting/shading on the image itself
  const imageFilter = useTransform(
    smoothVelocity,
    [-2000, 0, 2000],
    [
      "brightness(0.6) contrast(1.2)", 
      "brightness(1) contrast(1)", 
      "brightness(0.6) contrast(1.2)"
    ]
  );

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
  ];

  return (
    <div ref={containerRef} className="page-container relative z-10" style={{ height: '700vh', background: 'var(--color-bg)' }}>
      <div className="sticky-horizontal-container" style={{ position: 'sticky', top: 0, height: '100vh', width: '100vw', overflow: 'hidden', display: 'flex', alignItems: 'center', perspective: '1500px' }}>
        <motion.div 
          className="horizontal-track" 
          style={{ x: xTransform, display: 'flex', alignItems: 'center', height: '100%', paddingLeft: '10vw', transformStyle: 'preserve-3d' }}
        >
          {/* Intro Text */}
          <div style={{ minWidth: '80vw', paddingRight: '10vw' }}>
            <span className="tiny-label mb-8">THE ARCHIVE // V.02</span>
            <h1 className="text-massive kinetic-text" style={{ lineHeight: 0.85 }}>VISUAL</h1><br/>
            <h1 className="text-massive text-editorial kinetic-text pl-8">INDEX.</h1>
            <p className="editorial-text mt-16 drop-cap" style={{ maxWidth: '600px' }}>
              Scroll to explore. The faster you move, the more the visual fabric bends through 3D space. Engineered with dynamic tension physics.
            </p>
          </div>

          {/* 3D Bending Image Gallery */}
          <div style={{ display: 'flex', gap: '10vw', paddingRight: '20vw', alignItems: 'center', transformStyle: 'preserve-3d' }}>
            {images.map((img, i) => (
              <motion.div 
                key={i} 
                className="hover-target"
                style={{ 
                  rotateY, 
                  rotateZ, 
                  scale, 
                  boxShadow,
                  minWidth: img.aspect === 'aspect-wide' ? '55vw' : '30vw', 
                  height: img.aspect === 'aspect-tall' ? '65vh' : '45vh', 
                  position: 'relative',
                  transformOrigin: 'center center',
                  borderRadius: '8px',
                  backgroundColor: '#000',
                }} 
              >
                <div style={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: '8px' }}>
                  <motion.img 
                    src={img.src} 
                    alt={img.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: imageFilter }} 
                  />
                </div>
                <div className="flex-between mt-6" style={{ position: 'absolute', bottom: '-40px', width: '100%', left: 0 }}>
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
