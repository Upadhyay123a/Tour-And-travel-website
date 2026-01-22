import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './TourCard.css';

const TourCard = ({ tour }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(1);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item._id === tour._id);
    
    if (existingItem) {
      existingItem.quantity += cartQuantity;
    } else {
      cart.push({ ...tour, quantity: cartQuantity });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show success notification
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
    // Create notification element
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
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 2000);
  };

  return (
    <div className="tour-card">
      <div className="tour-card__image-container">
        <img 
          src={`/images/${tour.photo}`} 
          alt={tour.title}
          className="tour-card__image"
        />
        <div className="tour-card__overlay">
          <span className="tour-card__price">${tour.price}</span>
          {tour.featured && (
            <span className="tour-card__featured">Featured</span>
          )}
        </div>
        <button 
          className={`tour-card__favorite ${isFavorite ? 'tour-card__favorite--active' : ''}`}
          onClick={handleFavorite}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
      
      <div className="tour-card__content">
        <div className="tour-card__header">
          <h3 className="tour-card__title">{tour.title}</h3>
          <div className="tour-card__rating">
            <span className="tour-card__stars">⭐⭐⭐⭐⭐</span>
            <span className="tour-card__rating-text">(4.5)</span>
          </div>
        </div>
        
        <div className="tour-card__location">
          <span className="tour-card__city">📍 {tour.city}</span>
          <span className="tour-card__distance">{tour.distance} km</span>
        </div>
        
        <p className="tour-card__description">
          {tour.desc.length > 100 ? `${tour.desc.substring(0, 100)}...` : tour.desc}
        </p>
        
        <div className="tour-card__details">
          <div className="tour-card__detail">
            <span className="tour-card__detail-icon">👥</span>
            <span>{tour.maxGroupSize} people</span>
          </div>
          <div className="tour-card__detail">
            <span className="tour-card__detail-icon">🕒</span>
            <span>5 days</span>
          </div>
          <div className="tour-card__detail">
            <span className="tour-card__detail-icon">🎟️</span>
            <span>Instant Confirmation</span>
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
            <Link to={`/tour/${tour._id}`} className="tour-card__btn tour-card__btn--primary">
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
      </div>
    </div>
  );
};

export default TourCard;
