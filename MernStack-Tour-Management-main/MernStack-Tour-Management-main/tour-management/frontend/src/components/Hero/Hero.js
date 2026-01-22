import React from 'react';
import './Hero.css';

const Hero = () => {
 return (
    <section className="hero">
      <div className="hero__background">
        <div className="hero__overlay"></div>
      </div>
      <div className="hero__content">
        <h1 className="hero__title">Discover Your Next Adventure</h1>
        <p className="hero__subtitle">
          Explore breathtaking destinations around the world with our curated tour experiences
        </p>
        <div className="hero__search">
          <input 
            type="text" 
            placeholder="Search for your dream destination..." 
            className="hero__search-input"
          />
          <button className="hero__search-btn">Search</button>
        </div>
        <div className="hero__stats">
          <div className="hero__stat">
            <h3>500+</h3>
            <p>Amazing Tours</p>
          </div>
          <div className="hero__stat">
            <h3>50+</h3>
            <p>Destinations</p>
          </div>
          <div className="hero__stat">
            <h3>10K+</h3>
            <p>Happy Travelers</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
