import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalSpent: 0,
    upcomingTours: 0,
    favoriteCount: 0
  });

  useEffect(() => {
    // Load user data
    const savedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    setBookings(savedBookings);
    setFavorites(savedFavorites);
    
    // Calculate stats
    const totalSpent = savedBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
    const upcomingTours = savedBookings.filter(booking => 
      new Date(booking.date) > new Date()
    ).length;
    
    setStats({
      totalBookings: savedBookings.length,
      totalSpent,
      upcomingTours,
      favoriteCount: savedFavorites.length
    });
  }, []);

  const renderOverview = () => (
    <div className="dashboard__overview">
      <div className="dashboard__stats">
        <div className="stat-card">
          <div className="stat-card__icon">🎫</div>
          <div className="stat-card__content">
            <h3>{stats.totalBookings}</h3>
            <p>Total Bookings</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card__icon">💰</div>
          <div className="stat-card__content">
            <h3>${stats.totalSpent}</h3>
            <p>Total Spent</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card__icon">🗓️</div>
          <div className="stat-card__content">
            <h3>{stats.upcomingTours}</h3>
            <p>Upcoming Tours</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card__icon">❤️</div>
          <div className="stat-card__content">
            <h3>{stats.favoriteCount}</h3>
            <p>Favorites</p>
          </div>
        </div>
      </div>

      <div className="dashboard__recent">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          {bookings.slice(0, 3).map((booking) => (
            <div key={booking.id} className="activity-item">
              <img src={`/images/${booking.photo}`} alt={booking.title} />
              <div className="activity-details">
                <h4>{booking.title}</h4>
                <p>📍 {booking.city} • 📅 {booking.date}</p>
                <p>💰 ${booking.totalPrice}</p>
              </div>
              <span className="activity-status">{booking.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="dashboard__bookings">
      <h2>My Bookings</h2>
      <div className="booking-filters">
        <button className="filter-btn active">All</button>
        <button className="filter-btn">Upcoming</button>
        <button className="filter-btn">Completed</button>
        <button className="filter-btn">Cancelled</button>
      </div>
      
      <div className="booking-list">
        {bookings.map((booking) => (
          <div key={booking.id} className="booking-card">
            <img src={`/images/${booking.photo}`} alt={booking.title} />
            <div className="booking-details">
              <h3>{booking.title}</h3>
              <p>📍 {booking.city} • {booking.address}</p>
              <p>📅 {booking.date} • 🕒 {booking.time}</p>
              <p>👥 {booking.people} people • 💰 ${booking.totalPrice}</p>
            </div>
            <div className="booking-actions">
              <span className={`booking-status ${booking.status.toLowerCase()}`}>
                {booking.status}
              </span>
              <button className="action-btn">View Details</button>
              <button className="action-btn">Download Ticket</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFavorites = () => (
    <div className="dashboard__favorites">
      <h2>My Favorites</h2>
      <div className="favorites-grid">
        {favorites.map((tour) => (
          <div key={tour._id} className="favorite-card">
            <img src={`/images/${tour.photo}`} alt={tour.title} />
            <div className="favorite-overlay">
              <h3>{tour.title}</h3>
              <p>📍 {tour.city}</p>
              <p>💰 ${tour.price}</p>
              <div className="favorite-actions">
                <button className="action-btn">View Details</button>
                <button className="action-btn">Add to Cart</button>
                <button className="favorite-remove">❤️</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="dashboard__profile">
      <h2>Profile Settings</h2>
      <div className="profile-form">
        <div className="profile-header">
          <img src="/images/avatar.jpg" alt="Profile" className="profile-avatar" />
          <button className="change-photo-btn">Change Photo</button>
        </div>
        
        <form className="profile-fields">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" defaultValue={user?.username || 'John Doe'} />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input type="email" defaultValue={user?.email || 'john@example.com'} />
          </div>
          
          <div className="form-group">
            <label>Phone</label>
            <input type="tel" placeholder="+1 (555) 123-4567" />
          </div>
          
          <div className="form-group">
            <label>Date of Birth</label>
            <input type="date" />
          </div>
          
          <div className="form-group">
            <label>Address</label>
            <textarea placeholder="Enter your address"></textarea>
          </div>
          
          <div className="form-group">
            <label>Preferences</label>
            <div className="preferences">
              <label>
                <input type="checkbox" /> Email Notifications
              </label>
              <label>
                <input type="checkbox" /> SMS Updates
              </label>
              <label>
                <input type="checkbox" /> Newsletter
              </label>
            </div>
          </div>
          
          <button type="submit" className="save-profile-btn">Save Changes</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div className="dashboard__welcome">
          <h1>Welcome back, {user?.username || 'Traveler'}! 👋</h1>
          <p>Manage your tours, bookings, and preferences</p>
        </div>
        
        <div className="dashboard__quick-actions">
          <Link to="/tours" className="quick-action-btn">
            <span>🔍</span>
            <span>Browse Tours</span>
          </Link>
          <Link to="/cart" className="quick-action-btn">
            <span>🛒</span>
            <span>My Cart</span>
          </Link>
          <button className="quick-action-btn">
            <span>💬</span>
            <span>Support</span>
          </button>
        </div>
      </div>

      <div className="dashboard__content">
        <div className="dashboard__sidebar">
          <div className="user-info">
            <img src="/images/avatar.jpg" alt="User" />
            <div>
              <h3>{user?.username || 'John Doe'}</h3>
              <p>{user?.email || 'john@example.com'}</p>
            </div>
          </div>
          
          <nav className="dashboard-nav">
            <button 
              className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <span>📊</span>
              Overview
            </button>
            <button 
              className={`nav-btn ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              <span>🎫</span>
              My Bookings
            </button>
            <button 
              className={`nav-btn ${activeTab === 'favorites' ? 'active' : ''}`}
              onClick={() => setActiveTab('favorites')}
            >
              <span>❤️</span>
              Favorites
            </button>
            <button 
              className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <span>👤</span>
              Profile
            </button>
          </nav>
        </div>

        <div className="dashboard__main">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'bookings' && renderBookings()}
          {activeTab === 'favorites' && renderFavorites()}
          {activeTab === 'profile' && renderProfile()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
