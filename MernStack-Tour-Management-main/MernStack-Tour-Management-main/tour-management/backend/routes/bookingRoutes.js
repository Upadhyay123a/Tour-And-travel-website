const express = require('express');
const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const User = require('../models/User');

const router = express.Router();

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user')
      .populate('tour')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      message: 'Successful',
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings'
    });
  }
});

// Get bookings by user
router.get('/user/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId })
      .populate('tour')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      message: 'Successful',
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user bookings'
    });
  }
});

// Create new booking
router.post('/', async (req, res) => {
  try {
    const { user, tour, tourDate, numberOfPeople, contactInfo, specialRequests } = req.body;
    
    // Validate required fields
    if (!user || !tour || !tourDate || !numberOfPeople || !contactInfo) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: user, tour, tourDate, numberOfPeople, contactInfo'
      });
    }
    
    // Get tour details
    const tourDetails = await Tour.findById(tour);
    if (!tourDetails) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found'
      });
    }
    
    // Calculate total price
    const totalPrice = tourDetails.price * numberOfPeople;
    
    const newBooking = new Booking({
      user,
      tour,
      tourDate,
      numberOfPeople,
      totalPrice,
      contactInfo,
      specialRequests: specialRequests || ''
    });
    
    const savedBooking = await newBooking.save();
    
    // Update tour bookings count
    await Tour.findByIdAndUpdate(tour, {
      $inc: { bookings: 1 }
    });
    
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: savedBooking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message
    });
  }
});

// Update booking status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user').populate('tour');
    
    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: updatedBooking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status'
    });
  }
});

// Cancel booking
router.put('/:id/cancel', async (req, res) => {
  try {
    const cancelledBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    ).populate('tour');
    
    if (!cancelledBooking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Update tour bookings count
    await Tour.findByIdAndUpdate(cancelledBooking.tour._id, {
      $inc: { bookings: -1 }
    });
    
    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: cancelledBooking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
      error: error.message
    });
  }
});

// Get booking statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      message: 'Successful',
      data: stats
    });
  } catch (error) {
    console.error('Booking stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking statistics',
      error: error.message
    });
  }
});

module.exports = router;
