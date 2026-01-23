import React, { useState, useEffect } from 'react';
import './OrderTracking.css';

const OrderTracking = ({ bookingId }) => {
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (bookingId) {
      fetchTrackingData();
      const interval = setInterval(fetchTrackingData, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [bookingId]);

  const fetchTrackingData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/tracking/${bookingId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setTrackingData(data.data);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Tracking error:', error);
      setError('Failed to fetch tracking data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      order_placed: '📝',
      order_confirmed: '✅',
      payment_processing: '💳',
      payment_completed: '💰',
      booking_confirmed: '🎫',
      preparing_tour: '🚌',
      tour_assigned: '👨‍✈️',
      guide_assigned: '🧑‍🏫',
      tour_started: '🚀',
      tour_in_progress: '🌍',
      tour_completed: '🏁',
      feedback_requested: '⭐',
      completed: '✨',
      cancelled: '❌',
      refunded: '💸'
    };
    return icons[status] || '📦';
  };

  const getStatusColor = (status) => {
    const colors = {
      order_placed: '#6c757d',
      order_confirmed: '#17a2b8',
      payment_processing: '#ffc107',
      payment_completed: '#28a745',
      booking_confirmed: '#28a745',
      preparing_tour: '#17a2b8',
      tour_assigned: '#17a2b8',
      guide_assigned: '#17a2b8',
      tour_started: '#007bff',
      tour_in_progress: '#007bff',
      tour_completed: '#28a745',
      feedback_requested: '#ffc107',
      completed: '#28a745',
      cancelled: '#dc3545',
      refunded: '#6c757d'
    };
    return colors[status] || '#6c757d';
  };

  const getStatusText = (status) => {
    const texts = {
      order_placed: 'Order Placed',
      order_confirmed: 'Order Confirmed',
      payment_processing: 'Payment Processing',
      payment_completed: 'Payment Completed',
      booking_confirmed: 'Booking Confirmed',
      preparing_tour: 'Preparing Tour',
      tour_assigned: 'Tour Assigned',
      guide_assigned: 'Guide Assigned',
      tour_started: 'Tour Started',
      tour_in_progress: 'Tour In Progress',
      tour_completed: 'Tour Completed',
      feedback_requested: 'Feedback Requested',
      completed: 'Completed',
      cancelled: 'Cancelled',
      refunded: 'Refunded'
    };
    return texts[status] || status;
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="order-tracking">
        <div className="loading">Loading tracking information...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-tracking">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  if (!trackingData) {
    return (
      <div className="order-tracking">
        <div className="no-tracking">No tracking information available</div>
      </div>
    );
  }

  return (
    <div className="order-tracking">
      <div className="tracking-header">
        <h2>Order Tracking</h2>
        <div className="tracking-info">
          <span className="tracking-id">Tracking ID: {trackingData.trackingLink?.split('/').pop()}</span>
          <span className="current-status" style={{ color: getStatusColor(trackingData.currentStatus) }}>
            {getStatusText(trackingData.currentStatus)}
          </span>
        </div>
      </div>

      <div className="tracking-timeline">
        <div className="timeline">
          {trackingData.statusHistory.map((status, index) => (
            <div key={index} className="timeline-item">
              <div 
                className="timeline-marker"
                style={{ 
                  backgroundColor: getStatusColor(status.status),
                  borderColor: getStatusColor(status.status)
                }}
              >
                <span className="timeline-icon">{getStatusIcon(status.status)}</span>
              </div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <h4>{getStatusText(status.status)}</h4>
                  <span className="timeline-time">{formatTime(status.timestamp)}</span>
                </div>
                <p className="timeline-description">{status.description}</p>
                {status.notes && (
                  <div className="timeline-notes">
                    <strong>Note:</strong> {status.notes}
                  </div>
                )}
                {status.estimatedTime && (
                  <div className="timeline-eta">
                    <strong>ETA:</strong> {formatTime(status.estimatedTime)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {trackingData.realTimeTracking?.isEnabled && (
        <div className="real-time-tracking">
          <h3>Real-Time Tracking</h3>
          <div className="tracking-map">
            <div className="map-placeholder">
              <span className="map-icon">🗺️</span>
              <p>Live tracking map would be displayed here</p>
              <small>Last updated: {formatTime(trackingData.realTimeTracking.lastUpdated)}</small>
            </div>
          </div>
          <div className="tracking-details">
            <div className="detail-item">
              <span className="detail-label">Speed:</span>
              <span className="detail-value">{trackingData.realTimeTracking.speed} km/h</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Heading:</span>
              <span className="detail-value">{trackingData.realTimeTracking.heading}°</span>
            </div>
          </div>
        </div>
      )}

      {trackingData.assignedGuide && (
        <div className="assigned-personnel">
          <h3>Tour Personnel</h3>
          <div className="personnel-info">
            <div className="personnel-item">
              <div className="personnel-avatar">👨‍✈️</div>
              <div className="personnel-details">
                <h4>Driver</h4>
                <p>{trackingData.assignedDriver?.name || 'Assigned'}</p>
                <small>Contact: {trackingData.assignedDriver?.phone || 'Available'}</small>
              </div>
            </div>
            <div className="personnel-item">
              <div className="personnel-avatar">🧑‍🏫</div>
              <div className="personnel-details">
                <h4>Guide</h4>
                <p>{trackingData.assignedGuide?.name || 'Assigned'}</p>
                <small>Contact: {trackingData.assignedGuide?.phone || 'Available'}</small>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="tracking-actions">
        <button className="refresh-btn" onClick={fetchTrackingData}>
          🔄 Refresh
        </button>
        <button className="share-btn" onClick={() => {
          navigator.clipboard.writeText(trackingData.trackingLink);
          alert('Tracking link copied to clipboard!');
        }}>
          📤 Share Tracking
        </button>
        <button className="contact-btn">
          📞 Contact Support
        </button>
      </div>
    </div>
  );
};

export default OrderTracking;
