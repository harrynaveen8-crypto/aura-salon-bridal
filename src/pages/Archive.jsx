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
  const xTransform = useTransform(smoothProgress, [0, 1], ["0%", "-85%"]); 

  const { scrollY } = useScroll();
  const rawVelocity = useVelocity(scrollY);
  // Extremely responsive spring for aggressive physics
  const smoothVelocity = useSpring(rawVelocity, { damping: 40, stiffness: 400 });

  // 3D DIMENSIONAL BENDING PHYSICS
  
  // 1. Angular Rotations
  const rotateY = useTransform(smoothVelocity, [-2000, 2000], [45, -45]);
  const rotateX = useTransform(smoothVelocity, [-2000, 2000], [10, -10]);
  const rotateZ = useTransform(smoothVelocity, [-2000, 2000], [4, -4]);
  
  // 2. Z-Axis Dimension (Pushing the card deep into 3D space based on force)
  const z = useTransform(smoothVelocity, [-2000, 0, 2000], [-400, 0, -400]);
  
  // 3. The "Sail Curve" (Physically warping the geometry to simulate bending under pressure)
  const borderRadius = useTransform(
    smoothVelocity,
    [-2000, 0, 2000],
    [
      "15vw 4px 4px 15vw", // Forces the image to look like it's bending/bowing
      "4px 4px 4px 4px",  
      "4px 15vw 15vw 4px" 
    ]
  );

  // 4. Dynamic Parallax within the image to enhance the depth illusion
  const imageX = useTransform(smoothVelocity, [-2000, 2000], ["-10%", "10%"]);

  // 5. Environmental Lighting & Shadows
  const boxShadow = useTransform(
    smoothVelocity,
    [-2000, 0, 2000],
    [
      "60px 40px 80px rgba(0,0,0,0.95)", 
      "0px 10px 20px rgba(0,0,0,0.2)",  
      "-60px 40px 80px rgba(0,0,0,0.95)" 
    ]
  );
  const imageFilter = useTransform(
    smoothVelocity,
    [-2000, 0, 2000],
    [
      "brightness(0.5) contrast(1.3) saturate(0.8)", 
      "brightness(1) contrast(1) saturate(1)", 
      "brightness(0.5) contrast(1.3) saturate(0.8)"
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
      <div className="sticky-horizontal-container" style={{ position: 'sticky', top: 0, height: '100vh', width: '100vw', overflow: 'hidden', display: 'flex', alignItems: 'center', perspective: '1200px' }}>
        <motion.div 
          className="horizontal-track" 
          style={{ x: xTransform, display: 'flex', alignItems: 'center', height: '100%', paddingLeft: '10vw', transformStyle: 'preserve-3d' }}
        >
          {/* Intro Text */}
          <div style={{ minWidth: '80vw', paddingRight: '10vw' }}>
            <span className="tiny-label mb-8">THE ARCHIVE // V.03</span>
            <h1 className="text-massive kinetic-text" style={{ lineHeight: 0.85 }}>VISUAL</h1><br/>
            <h1 className="text-massive text-editorial kinetic-text pl-8">INDEX.</h1>
            <p className="editorial-text mt-16 drop-cap" style={{ maxWidth: '600px' }}>
              We have completely abandoned flat design. Scroll forcefully to observe the physical canvas bow, curve, and sink into the Z-dimension under the sheer pressure of momentum.
            </p>
          </div>

          {/* 3D Bending Image Gallery */}
          <div style={{ display: 'flex', gap: '10vw', paddingRight: '20vw', alignItems: 'center', transformStyle: 'preserve-3d' }}>
            {images.map((img, i) => (
              <motion.div 
                key={i} 
                className="archive-card-wrapper hover-target"
                style={{ 
                  rotateX,
                  rotateY, 
                  rotateZ, 
                  z,
                  boxShadow,
                  minWidth: img.aspect === 'aspect-wide' ? '55vw' : '30vw', 
                  height: img.aspect === 'aspect-tall' ? '65vh' : '45vh', 
                  position: 'relative',
                  transformOrigin: 'center center',
                  backgroundColor: '#000',
                  borderRadius, // This provides the physical curving illusion
                  overflow: 'hidden'
                }} 
              >
                <motion.div style={{ width: '100%', height: '100%', x: imageX }}>
                  <motion.img 
                    src={img.src} 
                    alt={img.title} 
                    style={{ 
                      width: '120%', 
                      height: '100%', 
                      objectFit: 'cover', 
                      filter: imageFilter,
                      position: 'absolute',
                      left: '-10%'
                    }} 
                  />
                </motion.div>
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
