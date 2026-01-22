const express = require('express');
const Review = require('../models/Review');
const Tour = require('../models/Tour');

const router = express.Router();

// Get all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().populate('productId');
    res.status(200).json({
      success: true,
      message: 'Successful',
      data: reviews
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: 'Not found'
    });
  }
});

// Get reviews for a specific tour
router.get('/tour/:tourId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.tourId });
    res.status(200).json({
      success: true,
      message: 'Successful',
      data: reviews
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: 'Not found'
    });
  }
});

// Create new review
router.post('/', async (req, res) => {
  try {
    const newReview = new Review(req.body);
    const savedReview = await newReview.save();
    
    // Update tour's reviews array
    await Tour.findByIdAndUpdate(
      req.body.productId,
      { $push: { reviews: savedReview._id } }
    );
    
    res.status(200).json({
      success: true,
      message: 'Review submitted successfully',
      data: savedReview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit review'
    });
  }
});

// Update review
router.put('/:id', async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: updatedReview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update'
    });
  }
});

// Delete review
router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    
    // Remove review from tour's reviews array
    await Tour.findByIdAndUpdate(
      review.productId,
      { $pull: { reviews: review._id } }
    );
    
    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete'
    });
  }
});

// Get reviews by rating
router.get('/rating/:rating', async (req, res) => {
  try {
    const rating = parseInt(req.params.rating);
    const reviews = await Review.find({ rating: rating }).populate('productId');
    
    res.status(200).json({
      success: true,
      message: 'Successful',
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
});

// Get reviews by user
router.get('/user/:userId', async (req, res) => {
  try {
    const reviews = await Review.find({ username: req.params.userId }).populate('productId');
    
    res.status(200).json({
      success: true,
      message: 'Successful',
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
});

module.exports = router;
