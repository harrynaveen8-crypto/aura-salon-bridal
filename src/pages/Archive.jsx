import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useVelocity, useMotionValueEvent, useMotionValue } from 'framer-motion';

// Global mouse tracking for subtle interactions
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

// Premium, clean film-slide component
const CinematicImage = ({ img, mouseX, mouseY, globalVelocityScale, globalVelocityFilter }) => {
  const ref = useRef(null);
  
  // Hover Physics Springs (Extremely subtle)
  const rotateX = useSpring(0, { stiffness: 150, damping: 20, mass: 1 });
  const rotateY = useSpring(0, { stiffness: 150, damping: 20, mass: 1 });
  const localScale = useSpring(1, { stiffness: 200, damping: 25 });
  const hoverBlur = useSpring(0, { stiffness: 200, damping: 30 }); // Drops shadow when hovered

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Rotate ±2deg based on cursor (very subtle)
    const xPos = (e.clientX - centerX) / (rect.width / 2);
    const yPos = (e.clientY - centerY) / (rect.height / 2);
    
    rotateX.set(yPos * -2);
    rotateY.set(xPos * 2);
  };

  const handleMouseEnter = () => {
    localScale.set(1.02);
    hoverBlur.set(20);
  };
  
  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    localScale.set(1);
    hoverBlur.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{
        width: img.width,
        height: '65vh', // Uniform height creates a clean, premium museum feel
        marginRight: '15vw', // Massive, consistent spacing guarantees NO OVERLAP
        rotateX,
        rotateY,
        scale: localScale,
        boxShadow: useTransform(hoverBlur, value => `0px 20px ${value}px rgba(0,0,0,0.4)`),
        willChange: 'transform',
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        position: 'relative',
        flexShrink: 0 // Prevent squishing
      }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "200px" }}
      transition={{ type: "spring", stiffness: 100, damping: 30 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="archive-cinematic-item cursor-none"
    >
      <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', borderRadius: '4px', backgroundColor: '#000' }}>
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
        {/* Elegant typography overlay */}
        <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mixBlendMode: 'difference', color: '#fff' }}>
          <div>
            <span className="tiny-label" style={{ color: '#fff', opacity: 0.7 }}>[ ARCHIVE NO. 0{img.id} ]</span>
            <p className="editorial-text-small mt-2" style={{ color: '#fff', fontSize: '1.2rem', fontFamily: 'var(--font-heading)' }}>{img.title}</p>
          </div>
          <span className="tiny-label" style={{ color: '#fff', opacity: 0.5 }}>{img.format}</span>
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

  // Scroll mapping
  const { scrollYProgress, scrollY } = useScroll({ target: containerRef });
  
  // Smooth translation for the track
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const xTransform = useTransform(smoothProgress, [0, 1], ["0%", "-85%"]); 

  // Heavy Cinematic Inertia Physics
  const rawVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(rawVelocity, { stiffness: 150, damping: 50, mass: 2 });

  // Velocity-driven global effects
  const globalVelocityScale = useTransform(smoothVelocity, [-1500, 0, 1500], [1.05, 1, 1.05]);
  const globalBlur = useTransform(smoothVelocity, [-1500, 0, 1500], ["2px", "0px", "2px"]);
  const globalContrast = useTransform(smoothVelocity, [-1500, 0, 1500], ["contrast(105%) brightness(95%)", "contrast(100%) brightness(100%)", "contrast(105%) brightness(95%)"]);
  const globalFilter = useTransform(() => `${globalContrast.get()} blur(${globalBlur.get()})`);

  // Microscopic Camera Drift
  const cameraX = useTransform(smoothVelocity, [-1500, 1500], [5, -5]);
  const cameraY = useTransform(smoothVelocity, [-1500, 1500], [3, -3]);
  const cameraRotate = useTransform(smoothVelocity, [-1500, 1500], [0.2, -0.2]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Clean, uniform-height cinematic sequence.
  // Varying widths (aspect ratios) provide interest without messiness.
  const images = [
    { id: 1, src: "/hero.png", title: "The Construct", width: "35vw", format: "PORTRAIT" },
    { id: 2, src: "/salon.png", title: "Chemistry", width: "55vw", format: "CINEMATIC" },
    { id: 3, src: "/bridal.png", title: "Silhouette", width: "45vw", format: "STANDARD" },
    { id: 4, src: "/hero.png", title: "Tension", width: "30vw", format: "PORTRAIT" },
    { id: 5, src: "/salon.png", title: "Form", width: "60vw", format: "ULTRAWIDE" },
    { id: 6, src: "/bridal.png", title: "Velocity", width: "40vw", format: "STANDARD" },
    { id: 7, src: "/hero.png", title: "Physics", width: "35vw", format: "PORTRAIT" },
    { id: 8, src: "/salon.png", title: "Mass", width: "50vw", format: "CINEMATIC" },
    { id: 9, src: "/bridal.png", title: "Inertia", width: "45vw", format: "STANDARD" },
  ];

  return (
    <div ref={containerRef} className="page-container relative z-10" style={{ background: 'var(--color-bg)', height: '800vh' }}>
      <MouseTracker mouseX={mouseX} mouseY={mouseY} />
      
      <div className="sticky-horizontal-container" style={{ position: 'sticky', top: 0, height: '100vh', width: '100vw', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        
        {/* Microscopic Camera Drift Wrapper */}
        <motion.div 
          className="horizontal-track"
          style={{ 
            x: xTransform,
            y: cameraY,
            rotateZ: cameraRotate,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '20vw',
            width: 'max-content',
            willChange: 'transform'
          }}
        >
          {/* Typographic Anchor */}
          <div style={{ marginRight: '15vw', flexShrink: 0 }}>
            <span className="tiny-label mb-8">SPATIAL GALLERY // V.06</span>
            <h1 className="text-massive kinetic-text" style={{ lineHeight: 0.85 }}>CINEMATIC</h1><br/>
            <h1 className="text-massive text-editorial kinetic-text pl-8">SEQUENCE.</h1>
          </div>

          {/* Clean Film Sequence */}
          {images.map((img, i) => (
            <CinematicImage 
              key={i} 
              img={img} 
              mouseX={mouseX} 
              mouseY={mouseY} 
              globalVelocityScale={globalVelocityScale}
              globalVelocityFilter={globalFilter}
            />
          ))}

          {/* Ending Anchor */}
          <div style={{ width: '40vw', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
            <h2 className="text-large text-editorial" style={{ opacity: 0.5 }}>Fin.</h2>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Archive;
