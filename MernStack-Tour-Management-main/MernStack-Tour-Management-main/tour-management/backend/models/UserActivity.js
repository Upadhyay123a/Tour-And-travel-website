const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  activity: {
    type: String,
    enum: ['login', 'logout', 'view_tour', 'add_to_cart', 'remove_from_cart', 'add_to_wishlist', 'remove_from_wishlist', 'booking', 'review', 'search', 'filter'],
    required: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ipAddress: {
    type: String,
    default: ''
  },
  userAgent: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

userActivitySchema.index({ user: 1, timestamp: -1 });
userActivitySchema.index({ activity: 1, timestamp: -1 });

module.exports = mongoose.model('UserActivity', userActivitySchema);
