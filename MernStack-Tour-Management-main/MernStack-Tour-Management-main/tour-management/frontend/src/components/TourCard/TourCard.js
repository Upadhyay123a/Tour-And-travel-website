import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './TourCard.css';

const TourCard = ({ tour, viewMode = 'grid' }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Use beautiful placeholder images from Unsplash
  const tourImages = [
    `https://source.unsplash.com/featured/?${encodeURIComponent(tour.title)}&w=400&h=300`,
    `https://source.unsplash.com/featured/?${encodeURIComponent(tour.city)}&w=400&h=300`,
    `https://source.unsplash.com/featured/?${encodeURIComponent(tour.category)}&w=400&h=300`
  ];

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item._id === tour._id);
    
    if (existingItem) {
      existingItem.quantity += cartQuantity;
    } else {
      cart.push({ ...tour, quantity: cartQuantity });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    showNotification('Added to cart!');
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (isFavorite) {
      const updatedFavorites = favorites.filter(item => item._id !== tour._id);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      showNotification('Removed from favorites');
    } else {
      favorites.push(tour);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      showNotification('Added to favorites!');
    }
    
    setIsFavorite(!isFavorite);
  };

  const showNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = 'tour-card__notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 10px;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
      z-index: 10000;
      animation: slideInRight 0.3s ease;
      font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 2000);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      beach: '🏖️',
      mountain: '⛰️',
      city: '🏙️',
      adventure: '🧗',
      cultural: '🏛️',
      wildlife: '🦁',
      luxury: '💎'
    };
    return icons[category] || '🌍';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: '#28a745',
      medium: '#ffc107',
      hard: '#dc3545'
    };
    return colors[difficulty] || '#6c757d';
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);
    
    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="tour-card__star tour-card__star--full">⭐</span>
        ))}
        {hasHalfStar && <span className="tour-card__star tour-card__star--half">⭐</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="tour-card__star tour-card__star--empty">⭐</span>
        ))}
      </>
    );
  };

  return (
    <div 
      className={`tour-card tour-card--${viewMode}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="tour-card__image-container">
        <img 
          src={tourImages[currentImageIndex]} 
          alt={tour.title}
          className="tour-card__image"
          onError={(e) => {
            e.target.src = `https://source.unsplash.com/featured/?travel&${tour._id}&w=400&h=300`;
          }}
        />
        <div className="tour-card__overlay">
          <div className="tour-card__price-info">
            <span className="tour-card__price">${tour.price}</span>
            <span className="tour-card__price-label">per person</span>
          </div>
          {tour.featured && (
            <span className="tour-card__featured">
              <span className="tour-card__featured-icon">⭐</span>
              Featured
            </span>
          )}
          <div className="tour-card__category-badge">
            {getCategoryIcon(tour.category)} {tour.category}
          </div>
        </div>
        <button 
          className={`tour-card__favorite ${isFavorite ? 'tour-card__favorite--active' : ''}`}
          onClick={handleFavorite}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
        {viewMode === 'grid' && (
          <div className="tour-card__image-indicators">
            {tourImages.map((_, index) => (
              <button
                key={index}
                className={`tour-card__indicator ${index === currentImageIndex ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
              />
            ))}
          </div>
        )}
      </div>
      
      <div className="tour-card__content">
        <div className="tour-card__header">
          <div className="tour-card__title-section">
            <h3 className="tour-card__title">{tour.title}</h3>
            <div className="tour-card__location">
              <span className="tour-card__city">📍 {tour.city}</span>
              <span className="tour-card__distance">{tour.distance} km</span>
            </div>
          </div>
          <div className="tour-card__rating">
            <div className="tour-card__stars">
              {renderStars(tour.avgRating || 4.5)}
            </div>
            <span className="tour-card__rating-text">({tour.avgRating || 4.5})</span>
            <span className="tour-card__reviews">({tour.reviews?.length || 0} reviews)</span>
          </div>
        </div>
        
        <p className="tour-card__description">
          {tour.description?.length > (viewMode === 'list' ? 200 : 100) 
            ? `${tour.description.substring(0, viewMode === 'list' ? 200 : 100)}...` 
            : tour.description || 'Experience an amazing adventure in this beautiful destination.'}
        </p>
        
        <div className="tour-card__details">
          <div className="tour-card__detail">
            <span className="tour-card__detail-icon">👥</span>
            <span>{tour.maxGroupSize} people</span>
          </div>
          <div className="tour-card__detail">
            <span className="tour-card__detail-icon">🕒</span>
            <span>{tour.duration || '5 days'}</span>
          </div>
          <div className="tour-card__detail">
            <span className="tour-card__detail-icon">🎟️</span>
            <span>Instant Confirmation</span>
          </div>
          <div className="tour-card__detail">
            <span className="tour-card__detail-icon">📊</span>
            <span style={{ color: getDifficultyColor(tour.difficulty) }}>
              {tour.difficulty || 'Easy'}
            </span>
          </div>
        </div>
        
        <div className="tour-card__booking">
          <div className="tour-card__quantity">
            <label>People:</label>
            <select 
              value={cartQuantity} 
              onChange={(e) => setCartQuantity(Number(e.target.value))}
              className="tour-card__quantity-select"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          
          <div className="tour-card__actions">
            <Link 
              to={`/tour/${tour._id}`} 
              className="tour-card__btn tour-card__btn--primary"
            >
              View Details
            </Link>
            <button 
              onClick={handleAddToCart}
              className="tour-card__btn tour-card__btn--cart"
            >
              🛒 Add to Cart
            </button>
          </div>
        </div>

        {isHovered && viewMode === 'grid' && (
          <div className="tour-card__quick-actions">
            <button className="tour-card__quick-btn" title="Quick View">
              👁️
            </button>
            <button className="tour-card__quick-btn" title="Share">
              📤
            </button>
            <button className="tour-card__quick-btn" title="Compare">
              ⚖️
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TourCard;
