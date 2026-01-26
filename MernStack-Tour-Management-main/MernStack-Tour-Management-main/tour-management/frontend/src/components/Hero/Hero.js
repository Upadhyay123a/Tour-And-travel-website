import React, { useState, useEffect } from 'react';
import './Hero.css';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [stats, setStats] = useState({
    tours: 500,
    destinations: 50,
    travelers: 10000
  });

  const heroSlides = [
    {
      title: "Discover Your Next Adventure",
      subtitle: "Explore breathtaking destinations around the world with our curated tour experiences",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      title: "Experience Paradise",
      subtitle: "From tropical beaches to mountain peaks, find your perfect getaway",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      title: "Create Unforgettable Memories",
      subtitle: "Join thousands of happy travelers on life-changing journeys",
      image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Animate stats
    const interval = setInterval(() => {
      setStats(prev => ({
        tours: prev.tours + Math.floor(Math.random() * 3),
        destinations: prev.destinations + (Math.random() > 0.8 ? 1 : 0),
        travelers: prev.travelers + Math.floor(Math.random() * 5)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/tours?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="hero">
      <div className="hero__background">
        <div 
          className="hero__slide"
          style={{ backgroundImage: `url(${heroSlides[currentSlide].image})` }}
        >
          <div className="hero__overlay"></div>
        </div>
      </div>
      
      <div className="hero__content">
        <div className="hero__text-content">
          <h1 className="hero__title">
            {heroSlides[currentSlide].title}
          </h1>
          <p className="hero__subtitle">
            {heroSlides[currentSlide].subtitle}
          </p>
        </div>
        
        <form className="hero__search" onSubmit={handleSearch}>
          <div className="hero__search-container">
            <input 
              type="text" 
              placeholder="Search for your dream destination..." 
              className="hero__search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="hero__search-btn">
              <i className="fas fa-search"></i>
              Search
            </button>
          </div>
          <div className="hero__quick-searches">
            <span className="hero__quick-search-label">Popular:</span>
            <button 
              type="button" 
              className="hero__quick-search"
              onClick={() => setSearchQuery('Paris')}
            >
              Paris
            </button>
            <button 
              type="button" 
              className="hero__quick-search"
              onClick={() => setSearchQuery('Bali')}
            >
              Bali
            </button>
            <button 
              type="button" 
              className="hero__quick-search"
              onClick={() => setSearchQuery('New York')}
            >
              New York
            </button>
            <button 
              type="button" 
              className="hero__quick-search"
              onClick={() => setSearchQuery('Tokyo')}
            >
              Tokyo
            </button>
          </div>
        </form>
        
        <div className="hero__stats">
          <div className="hero__stat">
            <div className="hero__stat-number">
              {stats.tours.toLocaleString()}+
            </div>
            <div className="hero__stat-label">Amazing Tours</div>
            <div className="hero__stat-icon">🌍</div>
          </div>
          <div className="hero__stat">
            <div className="hero__stat-number">
              {stats.destinations}+
            </div>
            <div className="hero__stat-label">Destinations</div>
            <div className="hero__stat-icon">📍</div>
          </div>
          <div className="hero__stat">
            <div className="hero__stat-number">
              {(stats.travelers / 1000).toFixed(1)}K+
            </div>
            <div className="hero__stat-label">Happy Travelers</div>
            <div className="hero__stat-icon">😊</div>
          </div>
        </div>
        
        <div className="hero__indicators">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`hero__indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
