import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { tourService } from './services/tourService';
import { authService } from './services/authService';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Hero from './components/Hero/Hero';
import Filters from './components/Filters/Filters';
import TourGallery from './components/TourGallery/TourGallery';
import Gallery from './components/Gallery/Gallery';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import EnhancedDashboard from './components/Dashboard/EnhancedDashboard';
import Cart from './components/Cart/Cart';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Payment from './components/Payment/Payment';
import Wallet from './components/Wallet/Wallet';
import OrderTracking from './components/OrderTracking/OrderTracking';
import SupportChat from './components/SupportChat/SupportChat';
import './styles/global.css';

// Fixed TourGallery error and data handling - Layout organization improved
console.log('App.js loaded successfully - TourGallery and TourCard fixed!');

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [filters, setFilters] = useState({
    searchQuery: '',
    selectedCity: 'all',
    selectedPriceRange: 'all',
    selectedCategory: 'all'
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    if (authService.isLoggedIn()) {
      const userData = authService.getUser();
      setUser(userData);
    }
    setAuthLoading(false);
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleRegister = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    authService.removeToken();
    setUser(null);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (authLoading) {
    return (
      <div className="app-loading">
        <div className="app-loading__spinner"></div>
        <p>Loading TourHub...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <Header user={user} onLogout={handleLogout} />
        
        <Routes>
          <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register onRegister={handleRegister} /> : <Navigate to="/" />} />
          <Route path="/" element={
            <>
              <Hero />
              <Filters onFilterChange={handleFilterChange} />
              <TourGallery 
                searchQuery={filters.searchQuery}
                selectedCity={filters.selectedCity}
                selectedPriceRange={filters.selectedPriceRange}
                selectedCategory={filters.selectedCategory}
              />
            </>
          } />
          <Route path="/tours" element={
            <>
              <Filters onFilterChange={handleFilterChange} />
              <TourGallery 
                searchQuery={filters.searchQuery}
                selectedCity={filters.selectedCity}
                selectedPriceRange={filters.selectedPriceRange}
                selectedCategory={filters.selectedCategory}
              />
            </>
          } />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={user ? <EnhancedDashboard user={user} /> : <Navigate to="/login" />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment" element={user ? <Payment /> : <Navigate to="/login" />} />
          <Route path="/wallet" element={user ? <Wallet /> : <Navigate to="/login" />} />
          <Route path="/tracking/:bookingId" element={user ? <OrderTracking /> : <Navigate to="/login" />} />
        </Routes>
        
        <Footer />
        <SupportChat />
      </div>
    </Router>
  );
}

export default App;
