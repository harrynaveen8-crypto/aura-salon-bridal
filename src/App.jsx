import React, { useEffect } from 'react';

function App() {
  useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
        });
      });
    });
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="nav-logo">AURA</div>
        <ul className="nav-links">
          <li><a href="#salon">Salon</a></li>
          <li><a href="#bridal">Bridal</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      <header className="hero">
        <img src="/hero.png" alt="Aura Beauty Salon" className="hero-bg" />
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <h1 className="title">Elevate Your Natural Beauty</h1>
            <p className="subtitle" style={{marginBottom: '2rem'}}>
              Experience luxury hair, skin, and bridal styling in a serene, modern oasis.
            </p>
            <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
              <a href="#salon" className="btn btn-primary">Discover Services</a>
              <a href="#bridal" className="btn btn-outline">Bridal Packages</a>
            </div>
          </div>
        </div>
      </header>

      <section id="salon" className="section container">
        <h2 className="section-title">The Salon Experience</h2>
        <div className="feature-section">
          <div className="feature-image">
            <div className="feature-image-wrapper">
              <img src="/salon.png" alt="Luxurious Hair Salon" />
            </div>
          </div>
          <div className="feature-content">
            <span className="feature-label">Expert Care</span>
            <h2>Bespoke Hair & Beauty</h2>
            <p>
              At Aura, we believe that true beauty starts with personalized care. Our master stylists and aestheticians take the time to understand your unique vision and lifestyle, crafting a look that is effortlessly you.
            </p>
            <p>
              Using only premium, sustainably-sourced products, our signature treatments range from precision cuts and dimensional color to rejuvenating spa facials. Step into our minimalist haven and step out feeling entirely renewed.
            </p>
            <a href="#contact" className="btn btn-outline" style={{marginTop: '1rem'}}>Book an Appointment</a>
          </div>
        </div>

        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">✨</div>
            <h3>Signature Styling</h3>
            <p>Precision haircuts, bespoke styling, and flawless blowouts tailored to your features.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🎨</div>
            <h3>Color & Highlights</h3>
            <p>Balayage, foil highlights, and rich all-over color utilizing premium, damage-free formulas.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🌿</div>
            <h3>Rejuvenating Spa</h3>
            <p>Customized facials, scalp treatments, and relaxation massages designed to restore balance.</p>
          </div>
        </div>
      </section>

      <section id="bridal" className="section" style={{backgroundColor: '#FFFFFF'}}>
        <div className="container">
          <h2 className="section-title">Bridal Elegance</h2>
          <div className="feature-section reverse">
            <div className="feature-image">
              <div className="feature-image-wrapper">
                <img src="/bridal.png" alt="Radiant Bride" />
              </div>
            </div>
            <div className="feature-content">
              <span className="feature-label">Your Special Day</span>
              <h2>Flawless Editorial Bridal Looks</h2>
              <p>
                Your wedding day requires a look that translates beautifully both in person and on camera. Our bridal specialists are trained in high-definition makeup and long-lasting hair artistry.
              </p>
              <p>
                We offer comprehensive bridal packages that include pre-wedding trials, skin preparation, and on-location services to ensure your morning is seamless, luxurious, and completely stress-free. Let us bring your dream bridal vision to life.
              </p>
              <ul style={{listStyle: 'none', marginBottom: '2rem'}}>
                <li style={{marginBottom: '0.5rem'}}>✓ Comprehensive Bridal Consultations & Trials</li>
                <li style={{marginBottom: '0.5rem'}}>✓ High-Definition Airbrush Makeup</li>
                <li style={{marginBottom: '0.5rem'}}>✓ Intricate Updos & Hollywood Waves</li>
                <li style={{marginBottom: '0.5rem'}}>✓ Full Bridal Party Styling Services</li>
              </ul>
              <a href="#contact" className="btn btn-primary">Inquire About Dates</a>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="container">
          <h2>Ready to Transform?</h2>
          <p style={{maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem'}}>
            Reach out to our front desk to schedule a consultation, book an appointment, or inquire about our specialized bridal services.
          </p>
          
          <div className="contact-details">
            <div className="contact-item">
              <h4>Call Us</h4>
              <p>+1 (555) 123-4567</p>
            </div>
            <div className="contact-item">
              <h4>Email</h4>
              <p>hello@aurabeauty.com</p>
            </div>
            <div className="contact-item">
              <h4>Visit Us</h4>
              <p>123 Luxury Lane, Design District</p>
              <p>New York, NY 10001</p>
            </div>
          </div>
          
          <button className="btn btn-outline" style={{borderColor: '#fff', color: '#fff'}} onClick={() => alert('Booking modal would open here!')}>
            Book Online Now
          </button>
        </div>
      </section>

      <footer>
        <div className="container">
          <p>&copy; 2026 Aura Beauty & Bridal Salon. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
