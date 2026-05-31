import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Booking = ({ setTheme }) => {
  useEffect(() => {
    // Deliberately shift to light theme for the booking form to create stark psychological contrast
    setTheme('light');
    window.scrollTo(0, 0);
  }, [setTheme]);

  return (
    <div className="page-container booking-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '15vh', paddingBottom: '10vh' }}>
       <div className="container" style={{ width: '100%' }}>
          
          <Link to="/">
            <div className="mb-16 hover-target" style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', cursor: 'none' }}>
              <span style={{ fontSize: '1.5rem' }}>←</span>
              <span className="tiny-label" style={{ margin: 0 }}>RETURN TO GALLERY</span>
            </div>
          </Link>

          <div className="booking-grid">
             <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
                <span className="tiny-label mb-8">004 — RESERVE</span>
                <h1 className="text-massive" style={{ color: 'var(--color-text)' }}>SECURE <br/><span className="text-editorial">YOUR CANVAS</span></h1>
                <p className="editorial-text mt-8 text-black" style={{ maxWidth: '400px' }}>
                  Our Master Directors are currently accepting new clients for the upcoming season. Submit your reservation request and our concierge will contact you within 24 hours.
                </p>
                
                <div className="meta-data mt-16" style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                  <div>EMAIL: CONCIERGE@AURASALON.COM</div>
                  <div>PHONE: +1 (212) 555-0199</div>
                  <div>LOCATION: 142 AESTHETIC BLVD, NY</div>
                </div>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}
               className="booking-form" 
             >
                <div className="input-group">
                  <input type="text" placeholder="FIRST NAME" className="luxury-input hover-target" />
                  <input type="text" placeholder="LAST NAME" className="luxury-input hover-target" />
                </div>
                
                <input type="email" placeholder="EMAIL ADDRESS" className="luxury-input hover-target" />
                <input type="tel" placeholder="PHONE NUMBER" className="luxury-input hover-target" />
                
                <select className="luxury-input hover-target" defaultValue="">
                  <option value="" disabled>SELECT PRIMARY SERVICE</option>
                  <option value="sculpting">Structural Sculpting / Cut</option>
                  <option value="chemistry">Chemistry / Color</option>
                  <option value="bridal">Editorial Bridal</option>
                </select>

                <button className="btn-magnetic mt-8 hover-target" style={{ background: 'var(--color-text)', color: 'var(--color-bg)', width: '100%' }}>
                  <span style={{ color: 'var(--color-bg)' }}>SUBMIT RESERVATION</span>
                </button>
             </motion.div>
          </div>
       </div>
    </div>
  )
}

export default Booking;
