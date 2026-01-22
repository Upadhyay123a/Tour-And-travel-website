import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './EnhancedDashboard.css';

const EnhancedDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('month');
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock data for demonstration
  const [stats, setStats] = useState({
    totalRevenue: 45678,
    totalBookings: 234,
    activeUsers: 1234,
    avgRating: 4.8,
    growth: 23.5,
    conversionRate: 12.3
  });

  const [recentActivity] = useState([
    { id: 1, type: 'booking', user: 'John Doe', tour: 'Bali Paradise', amount: 299, time: '2 mins ago', status: 'completed' },
    { id: 2, type: 'review', user: 'Sarah Smith', tour: 'London Bridge', rating: 5, time: '5 mins ago', status: 'completed' },
    { id: 3, type: 'booking', user: 'Mike Johnson', tour: 'Swiss Alps', amount: 599, time: '12 mins ago', status: 'pending' },
    { id: 4, type: 'wishlist', user: 'Emma Wilson', tour: 'Santorini Sunset', time: '1 hour ago', status: 'completed' },
  ]);

  const [topTours] = useState([
    { id: 1, title: 'Bali Paradise', bookings: 45, revenue: 13455, rating: 4.9, growth: 12 },
    { id: 2, title: 'Swiss Alps Adventure', bookings: 38, revenue: 22762, rating: 4.8, growth: 8 },
    { id: 3, title: 'Santorini Sunset', bookings: 32, revenue: 14688, rating: 4.7, growth: 15 },
    { id: 4, title: 'London Bridge Tour', bookings: 28, revenue: 2772, rating: 4.6, growth: -2 },
  ]);

  const [userAnalytics] = useState({
    newUsers: 156,
    returningUsers: 89,
    churnRate: 2.3,
    avgSessionTime: '4m 32s',
    topCountries: ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany'],
    deviceBreakdown: { desktop: 65, mobile: 30, tablet: 5 }
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalRevenue: prev.totalRevenue + Math.floor(Math.random() * 100),
        totalBookings: prev.totalBookings + (Math.random() > 0.7 ? 1 : 0),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const renderOverview = () => (
    <div className="enhanced-dashboard__overview">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-card--revenue">
          <div className="stat-card__header">
            <h3>Total Revenue</h3>
            <span className="stat-card__trend positive">+{stats.growth}%</span>
          </div>
          <div className="stat-card__value">${stats.totalRevenue.toLocaleString()}</div>
          <div className="stat-card__chart">
            <div className="mini-chart">
              {[65, 78, 90, 81, 95, 88, 92, 98, 85, 91, 96, 89].map((height, i) => (
                <div key={i} className="mini-chart__bar" style={{ height: `${height}%` }}></div>
              ))}
            </div>
          </div>
        </div>

        <div className="stat-card stat-card--bookings">
          <div className="stat-card__header">
            <h3>Total Bookings</h3>
            <span className="stat-card__trend positive">+18%</span>
          </div>
          <div className="stat-card__value">{stats.totalBookings}</div>
          <div className="stat-card__chart">
            <div className="mini-chart">
              {[45, 52, 48, 61, 58, 72, 68, 75, 82, 79, 88, 91].map((height, i) => (
                <div key={i} className="mini-chart__bar" style={{ height: `${height}%` }}></div>
              ))}
            </div>
          </div>
        </div>

        <div className="stat-card stat-card--users">
          <div className="stat-card__header">
            <h3>Active Users</h3>
            <span className="stat-card__trend positive">+12%</span>
          </div>
          <div className="stat-card__value">{stats.activeUsers.toLocaleString()}</div>
          <div className="stat-card__chart">
            <div className="mini-chart">
              {[88, 92, 85, 98, 102, 108, 115, 112, 118, 125, 122, 128].map((height, i) => (
                <div key={i} className="mini-chart__bar" style={{ height: `${height}%` }}></div>
              ))}
            </div>
          </div>
        </div>

        <div className="stat-card stat-card--rating">
          <div className="stat-card__header">
            <h3>Avg Rating</h3>
            <span className="stat-card__trend positive">+0.2</span>
          </div>
          <div className="stat-card__value">
            {stats.avgRating}
            <span className="stars">⭐⭐⭐⭐⭐</span>
          </div>
          <div className="stat-card__chart">
            <div className="rating-distribution">
              <div className="rating-bar">
                <span>5⭐</span>
                <div className="rating-bar__fill" style={{ width: '75%' }}></div>
              </div>
              <div className="rating-bar">
                <span>4⭐</span>
                <div className="rating-bar__fill" style={{ width: '15%' }}></div>
              </div>
              <div className="rating-bar">
                <span>3⭐</span>
                <div className="rating-bar__fill" style={{ width: '7%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="analytics-section">
        <div className="analytics-card">
          <h3>Revenue Analytics</h3>
          <div className="time-selector">
            <button 
              className={timeRange === 'day' ? 'active' : ''}
              onClick={() => setTimeRange('day')}
            >Day</button>
            <button 
              className={timeRange === 'week' ? 'active' : ''}
              onClick={() => setTimeRange('week')}
            >Week</button>
            <button 
              className={timeRange === 'month' ? 'active' : ''}
              onClick={() => setTimeRange('month')}
            >Month</button>
            <button 
              className={timeRange === 'year' ? 'active' : ''}
              onClick={() => setTimeRange('year')}
            >Year</button>
          </div>
          <div className="revenue-chart">
            <div className="chart-container">
              {timeRange === 'day' && (
                <div className="daily-chart">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                    <div key={day} className="chart-bar">
                      <div className="chart-bar__label">{day}</div>
                      <div className="chart-bar__visual" style={{ height: `${Math.random() * 80 + 20}%` }}></div>
                      <div className="chart-bar__value">${Math.floor(Math.random() * 5000 + 2000)}</div>
                    </div>
                  ))}
                </div>
              )}
              {timeRange === 'week' && (
                <div className="weekly-chart">
                  {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((week, i) => (
                    <div key={week} className="chart-bar">
                      <div className="chart-bar__label">{week}</div>
                      <div className="chart-bar__visual" style={{ height: `${Math.random() * 80 + 20}%` }}></div>
                      <div className="chart-bar__value">${Math.floor(Math.random() * 20000 + 10000)}</div>
                    </div>
                  ))}
                </div>
              )}
              {timeRange === 'month' && (
                <div className="monthly-chart">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => (
                    <div key={month} className="chart-bar">
                      <div className="chart-bar__label">{month}</div>
                      <div className="chart-bar__visual" style={{ height: `${Math.random() * 80 + 20}%` }}></div>
                      <div className="chart-bar__value">${Math.floor(Math.random() * 50000 + 20000)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="analytics-card">
          <h3>User Analytics</h3>
          <div className="user-stats">
            <div className="user-stat">
              <div className="user-stat__icon">👤</div>
              <div className="user-stat__info">
                <h4>New Users</h4>
                <p>{userAnalytics.newUsers}</p>
                <span className="trend positive">+23%</span>
              </div>
            </div>
            <div className="user-stat">
              <div className="user-stat__icon">🔄</div>
              <div className="user-stat__info">
                <h4>Returning Users</h4>
                <p>{userAnalytics.returningUsers}</p>
                <span className="trend positive">+15%</span>
              </div>
            </div>
            <div className="user-stat">
              <div className="user-stat__icon">📱</div>
              <div className="user-stat__info">
                <h4>Device Breakdown</h4>
                <div className="device-breakdown">
                  <div className="device-item">
                    <span>Desktop</span>
                    <div className="device-bar">
                      <div className="device-bar__fill" style={{ width: `${userAnalytics.deviceBreakdown.desktop}%` }}></div>
                    </div>
                    <span>{userAnalytics.deviceBreakdown.desktop}%</span>
                  </div>
                  <div className="device-item">
                    <span>Mobile</span>
                    <div className="device-bar">
                      <div className="device-bar__fill" style={{ width: `${userAnalytics.deviceBreakdown.mobile}%` }}></div>
                    </div>
                    <span>{userAnalytics.deviceBreakdown.mobile}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Tours */}
      <div className="top-tours-section">
        <h3>Top Performing Tours</h3>
        <div className="top-tours-grid">
          {topTours.map((tour) => (
            <div key={tour.id} className="top-tour-card">
              <img src={`/images/tour-img0${tour.id}.jpg`} alt={tour.title} />
              <div className="top-tour-info">
                <h4>{tour.title}</h4>
                <div className="tour-metrics">
                  <div className="metric">
                    <span>📊 {tour.bookings} bookings</span>
                  </div>
                  <div className="metric">
                    <span>💰 ${tour.revenue.toLocaleString()}</span>
                  </div>
                  <div className="metric">
                    <span>⭐ {tour.rating}</span>
                  </div>
                  <div className="metric">
                    <span className={`trend ${tour.growth > 0 ? 'positive' : 'negative'}`}>
                      {tour.growth > 0 ? '↑' : '↓'} {Math.abs(tour.growth)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="bookings-section">
      <div className="bookings-header">
        <h2>Booking Management</h2>
        <div className="bookings-controls">
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <select className="filter-select">
            <option>All Status</option>
            <option>Completed</option>
            <option>Pending</option>
            <option>Cancelled</option>
          </select>
          <button className="export-btn">📊 Export</button>
        </div>
      </div>

      <div className="bookings-stats">
        <div className="booking-stat">
          <span className="booking-stat__number">156</span>
          <span className="booking-stat__label">Pending</span>
        </div>
        <div className="booking-stat">
          <span className="booking-stat__number">89</span>
          <span className="booking-stat__label">Confirmed</span>
        </div>
        <div className="booking-stat">
          <span className="booking-stat__number">234</span>
          <span className="booking-stat__label">Completed</span>
        </div>
        <div className="booking-stat">
          <span className="booking-stat__number">12</span>
          <span className="booking-stat__label">Cancelled</span>
        </div>
      </div>

      <div className="bookings-table">
        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Customer</th>
              <th>Tour</th>
              <th>Date</th>
              <th>People</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentActivity.map((activity) => (
              <tr key={activity.id}>
                <td>#{1000 + activity.id}</td>
                <td>
                  <div className="customer-info">
                    <img src="/images/avatar.jpg" alt={activity.user} />
                    <span>{activity.user}</span>
                  </div>
                </td>
                <td>{activity.tour}</td>
                <td>{new Date().toLocaleDateString()}</td>
                <td>2</td>
                <td>${activity.amount}</td>
                <td>
                  <span className={`status ${activity.status}`}>
                    {activity.status}
                  </span>
                </td>
                <td>
                  <button className="action-btn">View</button>
                  <button className="action-btn">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="users-section">
      <h2>User Management</h2>
      <div className="users-grid">
        <div className="user-card">
          <div className="user-card__header">
            <img src="/images/ava-1.jpg" alt="User" />
            <div>
              <h3>Sarah Johnson</h3>
              <p>sarah@example.com</p>
            </div>
          </div>
          <div className="user-card__stats">
            <div className="user-stat-item">
              <span>12 Bookings</span>
            </div>
            <div className="user-stat-item">
              <span>$3,456 Total</span>
            </div>
            <div className="user-stat-item">
              <span>⭐ 4.9 Rating</span>
            </div>
          </div>
          <div className="user-card__actions">
            <button className="action-btn">View Profile</button>
            <button className="action-btn">Send Message</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="enhanced-dashboard">
      {/* Header */}
      <div className="enhanced-dashboard__header">
        <div className="dashboard-welcome">
          <h1>Welcome back, {user?.username || 'Admin'}! 👋</h1>
          <p>Manage your tour business with advanced analytics and insights</p>
        </div>
        
        <div className="dashboard-actions">
          <div className="date-range">
            <span>📅 {new Date().toLocaleDateString()}</span>
          </div>
          
          <div className="notification-center">
            <button 
              className="notification-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              🔔
              {notifications.length > 0 && (
                <span className="notification-badge">{notifications.length}</span>
              )}
            </button>
            
            {showNotifications && (
              <div className="notification-dropdown">
                <h3>Notifications</h3>
                <div className="notification-list">
                  <div className="notification-item">
                    <span className="notification-icon">🎉</span>
                    <div className="notification-content">
                      <p>New booking received!</p>
                      <span>2 mins ago</span>
                    </div>
                  </div>
                  <div className="notification-item">
                    <span className="notification-icon">⭐</span>
                    <div className="notification-content">
                      <p>5-star review received</p>
                      <span>15 mins ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <Link to="/tours" className="quick-action-btn">
            <span>🔍</span>
            <span>Browse Tours</span>
          </Link>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <div className="enhanced-dashboard__content">
        <div className="dashboard-sidebar">
          <div className="sidebar-user">
            <img src="/images/avatar.jpg" alt="User" />
            <div>
              <h3>{user?.username || 'Admin User'}</h3>
              <p>{user?.email || 'admin@tourhub.com'}</p>
              <span className="user-role">Administrator</span>
            </div>
          </div>
          
          <nav className="sidebar-nav">
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
              Bookings
            </button>
            <button 
              className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <span>👥</span>
              Users
            </button>
            <button 
              className={`nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <span>📈</span>
              Analytics
            </button>
            <button 
              className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <span>⚙️</span>
              Settings
            </button>
          </nav>

          <div className="sidebar-footer">
            <div className="quick-stats">
              <div className="quick-stat">
                <span>📈</span>
                <div>
                  <p>Growth</p>
                  <strong>+{stats.growth}%</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="dashboard-main">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'bookings' && renderBookings()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'analytics' && renderOverview()}
          {activeTab === 'settings' && renderOverview()}
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
