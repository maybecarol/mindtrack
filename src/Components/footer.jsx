import React from 'react';
import './footer.css'; // Import your CSS file

const Footer = () => {
  return (
    <footer className="footer">
      <ul className="footer-links">
        <li><a href="#about">About Us</a></li>
        <li><a href="#blog">Blog</a></li>
        <li><a href="#privacy">Privacy Policy</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <div className="social-media">
        <a href="#instagram" className="social-link"><i className="fab fa-instagram"></i></a>
        <a href="#twitter" className="social-link"><i className="fab fa-twitter"></i></a>
        <a href="#facebook" className="social-link"><i className="fab fa-facebook"></i></a>
      </div>
    </footer>
  );
};

export default Footer;
