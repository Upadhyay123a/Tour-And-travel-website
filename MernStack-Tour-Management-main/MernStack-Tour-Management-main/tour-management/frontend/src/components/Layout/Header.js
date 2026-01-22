import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import './Header.css';

const Header = ({ user, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((total, item) => total + item.quantity, 0);
      setCartCount(count);
    };

    updateCartCount();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      updateCartCount();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for cart updates
    window.addEventListener('cartUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    authService.removeToken();
    onLogout();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo">
          <Link to="/" onClick={closeMobileMenu}>
            <img src="/images/logo.png" alt="TourHub Logo" />
            <span>TourHub</span>
          </Link>
        </div>

        <nav className={`header__nav ${mobileMenuOpen ? 'header__nav--mobile' : ''}`}>
          <ul className="header__nav-list">
            <li className="header__nav-item">
              <Link to="/" className="header__nav-link" onClick={closeMobileMenu}>Home</Link>
            </li>
            <li className="header__nav-item">
              <Link to="/tours" className="header__nav-link" onClick={closeMobileMenu}>Tours</Link>
            </li>
            <li className="header__nav-item">
              <Link to="/gallery" className="header__nav-link" onClick={closeMobileMenu}>Gallery</Link>
            </li>
            <li className="header__nav-item">
              <Link to="/about" className="header__nav-link" onClick={closeMobileMenu}>About</Link>
            </li>
            <li className="header__nav-item">
              <Link to="/contact" className="header__nav-link" onClick={closeMobileMenu}>Contact</Link>
            </li>
          </ul>
        </nav>

        <div className="header__actions">
          {user ? (
            <div className="header__user-menu">
              <Link to="/dashboard" className="header__dashboard-link">
                <span className="header__dashboard-icon">📊</span>
                <span className="header__dashboard-text">Dashboard</span>
              </Link>
              
              <Link to="/cart" className="header__cart-link">
                <span className="header__cart-icon">🛒</span>
                {cartCount > 0 && (
                  <span className="header__cart-count">{cartCount}</span>
                )}
              </Link>
              
              <div className="header__user-info">
                <img src="/images/avatar.jpg" alt="User Avatar" className="header__user-avatar" />
                <span className="header__username">Welcome, {user.username}</span>
              </div>
              
              <button onClick={handleLogout} className="header__btn header__btn--logout">
                Logout
              </button>
            </div>
          ) : (
            <div className="header__auth-buttons">
              <Link to="/login" className="header__btn header__btn--login">
                Login
              </Link>
              <Link to="/register" className="header__btn header__btn--register">
                Register
              </Link>
              
              <Link to="/cart" className="header__cart-link">
                <span className="header__cart-icon">🛒</span>
                {cartCount > 0 && (
                  <span className="header__cart-count">{cartCount}</span>
                )}
              </Link>
            </div>
          )}
        </div>

        <button 
          className="header__mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className={mobileMenuOpen ? 'header__hamburger--active' : ''}></span>
          <span className={mobileMenuOpen ? 'header__hamburger--active' : ''}></span>
          <span className={mobileMenuOpen ? 'header__hamburger--active' : ''}></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
