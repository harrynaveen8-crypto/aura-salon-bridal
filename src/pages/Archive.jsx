import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform, useVelocity, useMotionValue, useMotionValueEvent } from 'framer-motion';

// Global mouse tracking for repulsion physics
const MouseTracker = ({ mouseX, mouseY }) => {
  useEffect(() => {
    const handleMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);
  return null;
};

// Physics-driven individual image component
const CinematicImage = ({ img, mouseX, mouseY, globalVelocityScale, globalVelocityFilter, scrollY }) => {
  const ref = useRef(null);
  
  // Parallax based on Depth Layer
  // Layer 1 (Foreground) = 1.0x, Layer 2 = 0.85x, Layer 3 = 0.7x
  const depthMult = img.depth === 1 ? 1 : img.depth === 2 ? 0.85 : 0.7;
  const yParallax = useTransform(scrollY, value => -(value * (1 - depthMult))); 

  // Hover & Repulsion Physics Springs
  const rotateX = useSpring(0, { stiffness: 150, damping: 20, mass: 1.5 });
  const rotateY = useSpring(0, { stiffness: 150, damping: 20, mass: 1.5 });
  const repulseX = useSpring(0, { stiffness: 100, damping: 30, mass: 1 });
  const repulseY = useSpring(0, { stiffness: 100, damping: 30, mass: 1 });
  const localScale = useSpring(1, { stiffness: 200, damping: 25 });

  // Handle Repulsion (Mouse Influence System)
  useMotionValueEvent(mouseX, "change", (latestX) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distX = latestX - centerX;
    const distY = mouseY.get() - centerY;
    const distance = Math.sqrt(distX * distX + distY * distY);
    
    // Repulsion radius: 250px
    if (distance < 250 && distance > 0) {
      const force = (250 - distance) / 250;
      repulseX.set(-(distX / distance) * force * 15); // max 15px drift
      repulseY.set(-(distY / distance) * force * 15);
    } else {
      repulseX.set(0);
      repulseY.set(0);
    }
  });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Rotate ±4deg based on cursor
    const xPos = (e.clientX - centerX) / (rect.width / 2);
    const yPos = (e.clientY - centerY) / (rect.height / 2);
    
    rotateX.set(yPos * -4);
    rotateY.set(xPos * 4);
  };

  const handleMouseEnter = () => localScale.set(1.04);
  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    localScale.set(1);
  };

  return (
    <motion.div
      ref={ref}
      style={{
        position: 'absolute',
        top: img.top,
        left: img.left,
        width: img.width,
        height: img.height,
        y: yParallax,
        x: repulseX,
        translateY: repulseY,
        rotateX,
        rotateY,
        scale: localScale,
        zIndex: 10 - img.depth, // foreground is higher
        willChange: 'transform',
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
      initial={{ opacity: 0, scale: 0.94, y: 80 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "100px" }}
      transition={{ type: "spring", stiffness: 100, damping: 25, mass: 1.5 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="archive-cinematic-item"
    >
      <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', borderRadius: '2px' }}>
        <motion.img 
          src={img.src} 
          alt={img.title} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            scale: globalVelocityScale,
            filter: globalVelocityFilter,
            willChange: 'transform, filter'
          }} 
        />
        <div style={{ position: 'absolute', bottom: '20px', left: '20px', mixBlendMode: 'difference', color: '#fff' }}>
          <span className="tiny-label" style={{ color: '#fff' }}>[ DEPTH: 0{img.depth} ]</span>
          <p className="editorial-text-small mt-4" style={{ color: '#fff' }}>{img.title}</p>
        </div>
      </div>
    </motion.div>
  );
};


const Archive = ({ setTheme }) => {
  useEffect(() => {
    setTheme('dark');
    window.scrollTo(0, 0);
  }, [setTheme]);

  // Global Scroll & Velocity Physics
  const { scrollY } = useScroll();
  const rawVelocity = useVelocity(scrollY);
  // Heavy, expensive, physical inertia
  const smoothVelocity = useSpring(rawVelocity, { stiffness: 150, damping: 40, mass: 2.5 });

  // Velocity-driven global effects
  const globalVelocityScale = useTransform(smoothVelocity, [-1500, 0, 1500], [1.05, 1, 1.05]);
  const globalBlur = useTransform(smoothVelocity, [-1500, 0, 1500], ["2px", "0px", "2px"]);
  const globalContrast = useTransform(smoothVelocity, [-1500, 0, 1500], ["contrast(102%) brightness(98%)", "contrast(100%) brightness(100%)", "contrast(102%) brightness(98%)"]);
  
  // Combine blur and contrast into one filter string for performance
  const globalFilter = useTransform(() => `${globalContrast.get()} blur(${globalBlur.get()})`);

  // Floating Camera Effect (The entire scene shifts microscopically based on velocity)
  const cameraX = useTransform(smoothVelocity, [-1500, 1500], [10, -10]);
  const cameraY = useTransform(smoothVelocity, [-1500, 1500], [6, -6]);
  const cameraRotate = useTransform(smoothVelocity, [-1500, 1500], [0.4, -0.4]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Asymmetrical Spatial Layout (No Grids)
  const images = [
    { src: "/hero.png", title: "The Construct", depth: 1, top: "5%", left: "10%", width: "45vw", height: "70vh" },
    { src: "/salon.png", title: "Chemistry", depth: 3, top: "15%", left: "65%", width: "20vw", height: "35vh" },
    { src: "/bridal.png", title: "Silhouette", depth: 2, top: "35%", left: "25%", width: "35vw", height: "60vh" },
    
    { src: "/hero.png", title: "Tension", depth: 1, top: "55%", left: "45%", width: "45vw", height: "80vh" },
    { src: "/salon.png", title: "Form", depth: 3, top: "70%", left: "10%", width: "25vw", height: "40vh" },
    { src: "/bridal.png", title: "Velocity", depth: 2, top: "85%", left: "60%", width: "30vw", height: "55vh" },
    
    { src: "/hero.png", title: "Physics", depth: 1, top: "115%", left: "15%", width: "50vw", height: "85vh" },
    { src: "/salon.png", title: "Mass", depth: 3, top: "125%", left: "75%", width: "15vw", height: "30vh" },
    { src: "/bridal.png", title: "Inertia", depth: 2, top: "140%", left: "30%", width: "40vw", height: "65vh" },
  ];

  return (
    <div className="page-container relative z-10" style={{ background: 'var(--color-bg)', overflow: 'hidden' }}>
      <MouseTracker mouseX={mouseX} mouseY={mouseY} />
      
      {/* Floating Camera Wrapper */}
      <motion.div 
        style={{ 
          x: cameraX, 
          y: cameraY, 
          rotateZ: cameraRotate,
          width: '100%', 
          height: '220vh', // massive scroll area for spatial layout
          position: 'relative',
          willChange: 'transform'
        }}
      >
        {/* Intro Typographic Element (Floating in space) */}
        <motion.div 
          style={{ position: 'absolute', top: '10%', left: '30%', zIndex: 0, y: useTransform(scrollY, value => -(value * 0.5)) }}
        >
          <span className="tiny-label mb-8">SPATIAL GALLERY // V.04</span>
          <h1 className="text-massive kinetic-text" style={{ lineHeight: 0.85, opacity: 0.2 }}>INFINITE</h1><br/>
          <h1 className="text-massive text-editorial kinetic-text pl-8" style={{ opacity: 0.2 }}>CANVAS.</h1>
        </motion.div>

        {/* Spatial Render */}
        {images.map((img, i) => (
          <CinematicImage 
            key={i} 
            img={img} 
            mouseX={mouseX} 
            mouseY={mouseY} 
            globalVelocityScale={globalVelocityScale}
            globalVelocityFilter={globalFilter}
            scrollY={scrollY}
          />
        ))}

        <div style={{ position: 'absolute', bottom: '5%', width: '100%', textAlign: 'center' }}>
          <h2 className="text-large text-editorial" style={{ opacity: 0.5 }}>End of Simulation.</h2>
        </div>
      </motion.div>
    </div>
  );
};

export default Archive;
