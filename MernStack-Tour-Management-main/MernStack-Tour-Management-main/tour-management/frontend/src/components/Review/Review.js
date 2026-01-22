import React, { useState, useEffect } from 'react';
import './Review.css';

const Review = ({ tourId, user }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    reviewText: '',
    username: user?.username || 'Anonymous'
  });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [tourId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/reviews/tour/${tourId}`);
      const data = await response.json();
      if (data.success) {
        setReviews(data.data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/v1/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newReview,
          productId: tourId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setReviews([data.data, ...reviews]);
        setNewReview({ rating: 5, reviewText: '', username: user?.username || 'Anonymous' });
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating, interactive = false, onRatingChange) => {
    return (
      <div className="review-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? 'star--filled' : 'star--empty'} ${interactive ? 'star--interactive' : ''}`}
            onClick={() => interactive && onRatingChange(star)}
          >
            ⭐
          </span>
        ))}
      </div>
    );
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="review-section">
      <div className="review-header">
        <h2>Reviews & Ratings</h2>
        <div className="review-summary">
          <div className="rating-display">
            <span className="rating-number">{averageRating}</span>
            {renderStars(Math.round(averageRating))}
            <span className="rating-count">({reviews.length} reviews)</span>
          </div>
        </div>
      </div>

      {user && (
        <div className="review-form-container">
          <button 
            className="review-form-toggle"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Write a Review'}
          </button>
          
          {showForm && (
            <form className="review-form" onSubmit={handleSubmitReview}>
              <div className="form-group">
                <label>Your Rating</label>
                {renderStars(newReview.rating, true, (rating) => 
                  setNewReview({ ...newReview, rating })
                )}
              </div>
              
              <div className="form-group">
                <label>Your Review</label>
                <textarea
                  value={newReview.reviewText}
                  onChange={(e) => setNewReview({ ...newReview, reviewText: e.target.value })}
                  placeholder="Share your experience with this tour..."
                  rows={4}
                  required
                />
              </div>
              
              <button type="submit" className="submit-review-btn" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}
        </div>
      )}

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <div className="no-reviews">
            <p>No reviews yet. Be the first to review this tour!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="review-item">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">
                    {review.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="reviewer-details">
                    <h4>{review.username}</h4>
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="review-rating">
                  {renderStars(review.rating)}
                </div>
              </div>
              
              <div className="review-content">
                <p>{review.reviewText}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Review;
