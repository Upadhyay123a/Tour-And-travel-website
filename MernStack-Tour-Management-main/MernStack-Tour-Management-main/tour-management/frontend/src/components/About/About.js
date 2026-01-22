import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about">
      <div className="about__hero">
        <div className="about__hero-content">
          <h1 className="about__hero-title">About TourHub</h1>
          <p className="about__hero-subtitle">Your Gateway to Unforgettable Adventures</p>
        </div>
      </div>

      <div className="about__content">
        <div className="about__section">
          <div className="about__text">
            <h2>Our Story</h2>
            <p>
              Founded in 2020, TourHub has become the premier destination for travelers seeking authentic, 
              memorable experiences around the world. We believe that travel is not just about seeing new places, 
              but about creating lasting memories and connections.
            </p>
            <p>
              Our team of experienced travel experts carefully curates each tour to ensure you get the most 
      out of your adventure. From hidden gems to iconic landmarks, we've got you covered.
            </p>
          </div>
          <div className="about__image">
            <img src="/images/experience.png" alt="Travel Experience" />
          </div>
        </div>

        <div className="about__section about__section--reverse">
          <div className="about__text">
            <h2>Our Mission</h2>
            <p>
              To make travel accessible, enjoyable, and transformative for everyone. We strive to create 
              experiences that not only showcase the beauty of our world but also foster understanding 
              between cultures.
            </p>
            <p>
              Every tour we offer is designed with sustainability, authenticity, and your safety in mind. 
              We work with local communities to ensure that tourism benefits everyone involved.
            </p>
          </div>
          <div className="about__image">
            <img src="/images/customization.png" alt="Customized Tours" />
          </div>
        </div>

        <div className="about__stats">
          <div className="about__stat">
            <img src="/images/world.png" alt="Global Reach" className="about__stat-icon" />
            <h3>50+</h3>
            <p>Countries</p>
          </div>
          <div className="about__stat">
            <img src="/images/guide.png" alt="Expert Guides" className="about__stat-icon" />
            <h3>200+</h3>
            <p>Expert Guides</p>
          </div>
          <div className="about__stat">
            <img src="/images/weather.png" alt="Best Time" className="about__stat-icon" />
            <h3>365</h3>
            <p>Days of Adventure</p>
          </div>
          <div className="about__stat">
            <img src="/images/user.png" alt="Happy Travelers" className="about__stat-icon" />
            <h3>10K+</h3>
            <p>Happy Travelers</p>
          </div>
        </div>

        <div className="about__team">
          <h2>Meet Our Team</h2>
          <div className="about__team-grid">
            <div className="about__team-member">
              <img src="/images/ava-1.jpg" alt="Team Member" />
              <h3>Sarah Johnson</h3>
              <p>Founder & CEO</p>
            </div>
            <div className="about__team-member">
              <img src="/images/ava-2.jpg" alt="Team Member" />
              <h3>Michael Chen</h3>
              <p>Head of Operations</p>
            </div>
            <div className="about__team-member">
              <img src="/images/ava-3.jpg" alt="Team Member" />
              <h3>Emma Rodriguez</h3>
              <p>Lead Travel Designer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
