import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__section">
          <h3 className="footer__title">TourHub</h3>
          <p className="footer__description">
            Your trusted partner for unforgettable travel experiences around the world.
          </p>
          <div className="footer__social">
            <a href="#" className="footer__social-link">📘</a>
            <a href="#" className="footer__social-link">🐦</a>
            <a href="#" className="footer__social-link">📷</a>
            <a href="#" className="footer__social-link">📺</a>
          </div>
        </div>

        <div className="footer__section">
          <h4 className="footer__subtitle">Quick Links</h4>
          <ul className="footer__links">
            <li><a href="/">Home</a></li>
            <li><a href="/tours">All Tours</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/gallery">Gallery</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer__section">
          <h4 className="footer__subtitle">Popular Destinations</h4>
          <ul className="footer__links">
            <li><a href="#">London</a></li>
            <li><a href="#">Bali</a></li>
            <li><a href="#">Bangkok</a></li>
            <li><a href="#">Paris</a></li>
            <li><a href="#">Tokyo</a></li>
          </ul>
        </div>

        <div className="footer__section">
          <h4 className="footer__subtitle">Contact Info</h4>
          <div className="footer__contact">
            <p>📧 info@tourhub.com</p>
            <p>📞 +1 (555) 123-4567</p>
            <p>📍 123 Travel Street, Adventure City</p>
            <p>🕒 Mon-Fri: 9AM-6PM</p>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <p>&copy; 2024 TourHub. All rights reserved.</p>
        <div className="footer__bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
