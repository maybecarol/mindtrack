import React from 'react';
import heroImage from '../../assets/images/hero.jpg';
import './hero.css'; // Import your CSS file

const Hero = () => {
  const handleGetStarted = () => {
    const aboutSection = document.getElementById('about'); // Get the About section by ID
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' }); // Use 'smooth' for smooth scrolling if desired
    }
  };

  return (
    <header className="hero">
      <div className="hero-content">
        <h1>Your Mental Wellness Simplified</h1>
        <p>Track, Heal, and Thrive Every Day.</p>
        <div className="hero-buttons">
          <button onClick={handleGetStarted}>Get Started</button>
        </div>
      </div>
      <div className="hero-image">
        <img src={heroImage} alt="Mental wellness visual" />
      </div>
    </header>
  );
};

export default Hero;
