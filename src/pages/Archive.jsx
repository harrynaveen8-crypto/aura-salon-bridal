import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

const GalleryArtwork = ({ src, title, id, initialZ, initialX, initialY, scrollProgress }) => {
  // We simulate walking 15,000px deep into the gallery
  const z = useTransform(scrollProgress, [0, 1], [initialZ, initialZ + 15000]);
  
  // Physics of passing by the artwork
  // -3000 to -1000: Emerging from the dark distance
  // -500 to 0: Peak focus directly in front of the user
  // 500 to 1000: Passed the camera, rushing behind the user
  const opacity = useTransform(z, [-4000, -2000, -500, 0, 600, 1000], [0, 0.4, 1, 1, 0, 0]);
  const blur = useTransform(z, [-4000, -1000, 0, 600], ["blur(20px)", "blur(5px)", "blur(0px)", "blur(15px)"]);
  const brightness = useTransform(z, [-4000, -1000, 0, 600], ["brightness(0.1)", "brightness(0.4)", "brightness(1)", "brightness(0)"]);
  const scale = useTransform(z, [-4000, 0, 1000], [0.5, 1, 2.5]);

  return (
    <motion.div 
      style={{ 
        position: 'absolute', 
        left: initialX, 
        top: initialY, 
        z, 
        opacity, 
        filter: blur,
        scale,
        transformOrigin: 'center center'
      }}
      className="gallery-artwork hover-target"
    >
      <motion.img 
        src={src} 
        alt={title} 
        style={{ width: '40vw', height: 'auto', maxHeight: '70vh', objectFit: 'cover', filter: brightness }} 
      />
      <div className="flex-between mt-4" style={{ width: '10vw' }}>
        <span className="tiny-label">ARCHIVE // {id}</span>
      </div>
    </motion.div>
  );
};

const Archive = ({ setTheme }) => {
  useEffect(() => {
    setTheme('dark');
    window.scrollTo(0, 0);
  }, [setTheme]);

  const containerRef = useRef(null);
  
  // Total depth of the gallery scroll
  const { scrollYProgress } = useScroll({ target: containerRef });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

  // Array of 12 distinct artworks scattered deeply across Z-space
  // They alternate left, right, center, high, low to simulate a 3D museum corridor.
  const artworks = [
    { src: "/hero.png", title: "Structure 01", z: -1000, x: "10vw", y: "15vh" },
    { src: "/salon.png", title: "Geometry 02", z: -2500, x: "50vw", y: "10vh" },
    { src: "/bridal.png", title: "Elegance 03", z: -4000, x: "20vw", y: "30vh" },
    { src: "/hero.png", title: "Volume 04", z: -5500, x: "55vw", y: "40vh" },
    { src: "/salon.png", title: "Precision 05", z: -7000, x: "5vw", y: "20vh" },
    { src: "/bridal.png", title: "Symmetry 06", z: -8500, x: "45vw", y: "10vh" },
    { src: "/hero.png", title: "Texture 07", z: -10000, x: "25vw", y: "25vh" },
    { src: "/salon.png", title: "Form 08", z: -11500, x: "60vw", y: "15vh" },
    { src: "/bridal.png", title: "Light 09", z: -13000, x: "10vw", y: "40vh" },
    { src: "/hero.png", title: "Shadow 10", z: -14500, x: "40vw", y: "20vh" },
  ];

  return (
    <div ref={containerRef} className="page-container relative z-10" style={{ height: '1000vh', background: 'var(--color-bg)' }}>
      {/* The physical gallery space */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100vw', overflow: 'hidden', perspective: '1200px', background: '#0a0908' }}>
        
        {/* HUD UI overlay */}
        <div style={{ position: 'absolute', top: '10vh', left: '5vw', zIndex: 100 }}>
           <span className="tiny-label mb-2">DIGITAL EXHIBITION</span>
           <h1 className="text-large text-editorial" style={{ fontSize: '2rem' }}>The Corridor.</h1>
        </div>
        <div style={{ position: 'absolute', bottom: '10vh', right: '5vw', zIndex: 100, textAlign: 'right' }}>
           <span className="tiny-label mb-2">NAVIGATION</span>
           <p className="editorial-text-small">Scroll forward to walk through the space.<br/>You are navigating the Z-axis.</p>
        </div>
        
        {/* Crosshair / Focal Point to ground the 3D space */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.1, zIndex: 0, pointerEvents: 'none' }}>
           <div style={{ width: '1px', height: '40px', background: 'var(--color-accent)', margin: '0 auto' }}></div>
           <div style={{ width: '40px', height: '1px', background: 'var(--color-accent)', marginTop: '-20px' }}></div>
        </div>

        {/* 3D Transform Container holding the artworks */}
        <div style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d' }}>
          {artworks.map((art, i) => (
            <GalleryArtwork 
              key={i}
              id={`00${i+1}`}
              src={art.src}
              title={art.title}
              initialZ={art.z}
              initialX={art.x}
              initialY={art.y}
              scrollProgress={smoothProgress}
            />
          ))}
        </div>
        
        {/* End of Gallery text emerging from the absolute distance */}
        <motion.div 
          style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            z: useTransform(smoothProgress, [0, 1], [-16000, 0]),
            opacity: useTransform(smoothProgress, [0.8, 1], [0, 1])
          }}
        >
           <h1 className="text-massive text-editorial" style={{ whiteSpace: 'nowrap' }}>Exit Corridor.</h1>
        </motion.div>

      </div>
    </div>
  );
};

export default Archive;
