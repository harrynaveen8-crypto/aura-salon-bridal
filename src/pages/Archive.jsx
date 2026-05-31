import React, { useEffect, useRef } from 'react';
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
const CinematicImage = ({ img, mouseX, mouseY, globalVelocityScale, globalVelocityFilter, globalVelocityY }) => {
  const ref = useRef(null);
  
  // Parallax mapped to Y-axis velocity to prevent horizontal overlapping
  const yParallax = useTransform(globalVelocityY, value => value * img.depthMult); 

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
        alignSelf: img.align,
        minWidth: img.width,
        height: img.height,
        y: yParallax,
        x: repulseX,
        translateY: repulseY,
        rotateX,
        rotateY,
        scale: localScale,
        willChange: 'transform',
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        position: 'relative'
      }}
      initial={{ opacity: 0, scale: 0.94, y: 80 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "200px" }}
      transition={{ type: "spring", stiffness: 100, damping: 25, mass: 1.5 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="archive-cinematic-item flex-shrink-0"
    >
      <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', borderRadius: '4px' }}>
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
          <span className="tiny-label" style={{ color: '#fff' }}>[ INDEX: 0{img.id} ]</span>
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

  const containerRef = useRef(null);

  // Global Scroll & Velocity Physics
  const { scrollYProgress, scrollY } = useScroll({ target: containerRef });
  
  // Horizontal Translation
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const xTransform = useTransform(smoothProgress, [0, 1], ["0%", "-85%"]); 

  // Heavy, expensive, physical inertia
  const rawVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(rawVelocity, { stiffness: 150, damping: 40, mass: 2.5 });

  // Velocity-driven global effects
  const globalVelocityScale = useTransform(smoothVelocity, [-1500, 0, 1500], [1.05, 1, 1.05]);
  const globalBlur = useTransform(smoothVelocity, [-1500, 0, 1500], ["2px", "0px", "2px"]);
  const globalContrast = useTransform(smoothVelocity, [-1500, 0, 1500], ["contrast(102%) brightness(98%)", "contrast(100%) brightness(100%)", "contrast(102%) brightness(98%)"]);
  const globalVelocityY = useTransform(smoothVelocity, [-1500, 1500], [40, -40]); // Used for vertical parallax

  // Combine blur and contrast into one filter string for performance
  const globalFilter = useTransform(() => `${globalContrast.get()} blur(${globalBlur.get()})`);

  // Floating Camera Effect (The entire scene shifts microscopically based on velocity)
  const cameraX = useTransform(smoothVelocity, [-1500, 1500], [10, -10]);
  const cameraY = useTransform(smoothVelocity, [-1500, 1500], [6, -6]);
  const cameraRotate = useTransform(smoothVelocity, [-1500, 1500], [0.4, -0.4]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Asymmetrical Non-Overlapping Layout
  const images = [
    { id: 1, src: "/hero.png", title: "The Construct", width: "40vw", height: "70vh", align: "flex-start", depthMult: 1 },
    { id: 2, src: "/salon.png", title: "Chemistry", width: "25vw", height: "40vh", align: "center", depthMult: -0.5 },
    { id: 3, src: "/bridal.png", title: "Silhouette", width: "35vw", height: "60vh", align: "flex-end", depthMult: 0.8 },
    
    { id: 4, src: "/hero.png", title: "Tension", width: "30vw", height: "55vh", align: "flex-start", depthMult: -0.8 },
    { id: 5, src: "/salon.png", title: "Form", width: "45vw", height: "80vh", align: "center", depthMult: 1.2 },
    { id: 6, src: "/bridal.png", title: "Velocity", width: "25vw", height: "45vh", align: "flex-end", depthMult: -0.4 },
    
    { id: 7, src: "/hero.png", title: "Physics", width: "40vw", height: "65vh", align: "flex-start", depthMult: 0.7 },
    { id: 8, src: "/salon.png", title: "Mass", width: "20vw", height: "35vh", align: "center", depthMult: -0.6 },
    { id: 9, src: "/bridal.png", title: "Inertia", width: "45vw", height: "75vh", align: "flex-end", depthMult: 1 },
  ];

  return (
    <div ref={containerRef} className="page-container relative z-10" style={{ background: 'var(--color-bg)', height: '700vh' }}>
      <MouseTracker mouseX={mouseX} mouseY={mouseY} />
      
      <div className="sticky-horizontal-container" style={{ position: 'sticky', top: 0, height: '100vh', width: '100vw', overflow: 'hidden' }}>
        
        {/* Intro Typographic Element (Fixed) */}
        <div style={{ position: 'absolute', top: '10%', left: '10%', zIndex: 0, pointerEvents: 'none' }}>
          <span className="tiny-label mb-8">SPATIAL GALLERY // V.05</span>
          <h1 className="text-massive kinetic-text" style={{ lineHeight: 0.85, opacity: 0.2 }}>INFINITE</h1><br/>
          <h1 className="text-massive text-editorial kinetic-text pl-8" style={{ opacity: 0.2 }}>CANVAS.</h1>
        </div>

        {/* Floating Camera Wrapper */}
        <motion.div 
          className="horizontal-track"
          style={{ 
            x: xTransform,
            y: cameraY, 
            rotateZ: cameraRotate,
            height: '100%', 
            display: 'flex',
            alignItems: 'center',
            padding: '0 20vw',
            gap: '12vw', // Enforces strictly no overlapping
            willChange: 'transform'
          }}
        >
          {images.map((img, i) => (
            <CinematicImage 
              key={i} 
              img={img} 
              mouseX={mouseX} 
              mouseY={mouseY} 
              globalVelocityScale={globalVelocityScale}
              globalVelocityFilter={globalFilter}
              globalVelocityY={globalVelocityY}
            />
          ))}

          <div style={{ minWidth: '40vw', display: 'flex', justifyContent: 'center' }}>
            <h2 className="text-large text-editorial" style={{ opacity: 0.5 }}>End of Simulation.</h2>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Archive;
