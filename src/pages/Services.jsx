import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const Services = ({ setTheme }) => {
  useEffect(() => {
    setTheme('dark');
    window.scrollTo(0, 0);
  }, [setTheme]);

  return (
    <div className="page-container services-page">
       <div className="container" style={{ paddingTop: '25vh', paddingBottom: '20vh' }}>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <span className="tiny-label mb-8">003 — CURATED MENU</span>
            <h1 className="text-massive kinetic-text">THE MENU</h1>
            <p className="editorial-text mt-8" style={{ maxWidth: '600px' }}>
              We offer bespoke structural engineering for your hair. Every service is a collaborative architectural process between you and our Master Directors.
            </p>
          </motion.div>

          <div className="menu-grid mt-16">
             {/* Category 1 */}
             <div className="menu-category">
                <span className="tiny-label mb-8" style={{ borderBottom: '1px solid var(--color-accent)', paddingBottom: '1rem' }}>01 / SCULPTING</span>
                
                <div className="menu-item border-bottom py-4 hover-target">
                  <div className="flex-between">
                    <h3 className="text-large" style={{ fontSize: '2rem' }}>Director Cut</h3>
                    <span className="price">$150</span>
                  </div>
                  <p className="editorial-text-small mt-2">Precision geometric shaping by our Master Directors. Includes molecular bonding wash.</p>
                </div>
                
                <div className="menu-item border-bottom py-4 hover-target">
                  <div className="flex-between">
                    <h3 className="text-large" style={{ fontSize: '2rem' }}>Structural Trim</h3>
                    <span className="price">$95</span>
                  </div>
                  <p className="editorial-text-small mt-2">Maintenance of your current architecture.</p>
                </div>

                <div className="menu-item border-bottom py-4 hover-target">
                  <div className="flex-between">
                    <h3 className="text-large" style={{ fontSize: '2rem' }}>Editorial Blowout</h3>
                    <span className="price">$85</span>
                  </div>
                  <p className="editorial-text-small mt-2">High-volume, long-lasting structure.</p>
                </div>
             </div>

             {/* Category 2 */}
             <div className="menu-category">
                <span className="tiny-label mb-8" style={{ borderBottom: '1px solid var(--color-accent)', paddingBottom: '1rem' }}>02 / CHEMISTRY</span>
                
                <div className="menu-item border-bottom py-4 hover-target">
                  <div className="flex-between">
                    <h3 className="text-large" style={{ fontSize: '2rem' }}>Bespoke Balayage</h3>
                    <span className="price">from $250</span>
                  </div>
                  <p className="editorial-text-small mt-2">Hand-painted dimensional lighting customized to your skin undertone.</p>
                </div>
                
                <div className="menu-item border-bottom py-4 hover-target">
                  <div className="flex-between">
                    <h3 className="text-large" style={{ fontSize: '2rem' }}>Global Color</h3>
                    <span className="price">from $180</span>
                  </div>
                  <p className="editorial-text-small mt-2">Flawless, multi-tonal root-to-end saturation.</p>
                </div>

                <div className="menu-item border-bottom py-4 hover-target">
                  <div className="flex-between">
                    <h3 className="text-large" style={{ fontSize: '2rem' }}>Color Correction</h3>
                    <span className="price">P.O.A</span>
                  </div>
                  <p className="editorial-text-small mt-2">Intensive structural and chemical repair.</p>
                </div>
             </div>

             {/* Category 3 */}
             <div className="menu-category">
                <span className="tiny-label mb-8" style={{ borderBottom: '1px solid var(--color-accent)', paddingBottom: '1rem' }}>03 / EVENT & BRIDAL</span>
                
                <div className="menu-item border-bottom py-4 hover-target">
                  <div className="flex-between">
                    <h3 className="text-large" style={{ fontSize: '2rem' }}>Runway Pinning</h3>
                    <span className="price">$120</span>
                  </div>
                  <p className="editorial-text-small mt-2">Architectural upstyling for high-end events.</p>
                </div>
                
                <div className="menu-item border-bottom py-4 hover-target">
                  <div className="flex-between">
                    <h3 className="text-large" style={{ fontSize: '2rem' }}>Bridal Masterclass</h3>
                    <span className="price">from $350</span>
                  </div>
                  <p className="editorial-text-small mt-2">Comprehensive trial, day-of styling, and structural prep.</p>
                </div>
             </div>
          </div>
       </div>
    </div>
  )
}

export default Services;
