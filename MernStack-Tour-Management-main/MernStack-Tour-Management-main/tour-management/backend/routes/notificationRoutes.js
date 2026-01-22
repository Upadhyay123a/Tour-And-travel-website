const express = require('express');
const Notification = require('../models/Notification');

const router = express.Router();

// Get notifications for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.status(200).json({
      success: true,
      message: 'Successful',
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
});

// Get unread notifications count
router.get('/user/:userId/unread', async (req, res) => {
  try {
    const count = await Notification.countDocuments({ 
      user: req.params.userId, 
      read: false 
    });
    
    res.status(200).json({
      success: true,
      message: 'Successful',
      data: { unreadCount: count }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch unread count'
    });
  }
});

// Mark notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const updatedNotification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: updatedNotification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read'
    });
  }
});

// Mark all notifications as read for a user
router.put('/user/:userId/read-all', async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.params.userId, read: false },
      { read: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read'
    });
  }
});

// Create notification
router.post('/', async (req, res) => {
  try {
    const newNotification = new Notification(req.body);
    const savedNotification = await newNotification.save();
    
    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: savedNotification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create notification'
    });
  }
});

// Delete notification
router.delete('/:id', async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification'
    });
  }
});

module.exports = router;
