const express = require('express');
const Tour = require('../models/Tour');

const router = express.Router();

// Get all tours
router.get('/', async (req, res) => {
  try {
    const tours = await Tour.find().populate('reviews');
    res.status(200).json({
      success: true,
      message: 'Successful',
      data: tours
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: 'Not found'
    });
  }
});

// Get featured tours
router.get('/featured', async (req, res) => {
  try {
    const tours = await Tour.find({ featured: true }).populate('reviews').limit(4);
    res.status(200).json({
      success: true,
      message: 'Successful',
      data: tours
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: 'Not found'
    });
  }
});

// Get tour count
router.get('/count', async (req, res) => {
  try {
    const tourCount = await Tour.estimatedDocumentCount();
    res.status(200).json({
      success: true,
      data: tourCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch'
    });
  }
});

// Get single tour
router.get('/:id', async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id).populate('reviews');
    res.status(200).json({
      success: true,
      message: 'Successful',
      data: tour
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: 'Not found'
    });
  }
});

// Create new tour
router.post('/', async (req, res) => {
  try {
    const newTour = new Tour(req.body);
    const savedTour = await newTour.save();
    res.status(200).json({
      success: true,
      message: 'Tour created successfully',
      data: savedTour
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create'
    });
  }
});

// Update tour
router.put('/:id', async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: 'Tour updated successfully',
      data: updatedTour
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update'
    });
  }
});

// Delete tour
router.delete('/:id', async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Tour deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete'
    });
  }
});

module.exports = router;
