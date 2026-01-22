import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact">
      <div className="contact__hero">
        <div className="contact__hero-content">
          <h1 className="contact__hero-title">Get in Touch</h1>
          <p className="contact__hero-subtitle">We'd love to hear from you</p>
        </div>
      </div>

      <div className="contact__content">
        <div className="contact__container">
          <div className="contact__info">
            <h2>Contact Information</h2>
            <div className="contact__info-grid">
              <div className="contact__info-item">
                <div className="contact__info-icon">📍</div>
                <div className="contact__info-text">
                  <h3>Address</h3>
                  <p>123 Travel Street<br />Adventure City, AC 12345<br />United States</p>
                </div>
              </div>
              
              <div className="contact__info-item">
                <div className="contact__info-icon">📞</div>
                <div className="contact__info-text">
                  <h3>Phone</h3>
                  <p>+1 (555) 123-4567<br />+1 (555) 987-6543</p>
                </div>
              </div>
              
              <div className="contact__info-item">
                <div className="contact__info-icon">📧</div>
                <div className="contact__info-text">
                  <h3>Email</h3>
                  <p>info@tourhub.com<br />support@tourhub.com</p>
                </div>
              </div>
              
              <div className="contact__info-item">
                <div className="contact__info-icon">🕒</div>
                <div className="contact__info-text">
                  <h3>Business Hours</h3>
                  <p>Monday - Friday: 9AM - 6PM<br />Saturday: 10AM - 4PM<br />Sunday: Closed</p>
                </div>
              </div>
            </div>

            <div className="contact__social">
              <h3>Follow Us</h3>
              <div className="contact__social-links">
              <a href="#facebook" className="contact__social-link" aria-label="Facebook">📘</a>
              <a href="#twitter" className="contact__social-link" aria-label="Twitter">🐦</a>
              <a href="#instagram" className="contact__social-link" aria-label="Instagram">📷</a>
              <a href="#youtube" className="contact__social-link" aria-label="YouTube">📺</a>
              <a href="#linkedin" className="contact__social-link" aria-label="LinkedIn">💼</a>
            </div>
            </div>
          </div>

          <div className="contact__form-container">
            <h2>Send us a Message</h2>
            <form className="contact__form" onSubmit={handleSubmit}>
              <div className="contact__form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact__form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact__form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact__form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  required
                ></textarea>
              </div>

              <button type="submit" className="contact__submit-btn">
                Send Message
              </button>
            </form>
          </div>
        </div>

        <div className="contact__map">
          <h2>Find Us</h2>
          <div className="contact__map-placeholder">
            <img src="/images/world.png" alt="World Map" className="contact__map-image" />
            <div className="contact__map-overlay">
              <p>Interactive Map Coming Soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
