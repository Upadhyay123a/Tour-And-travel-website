const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

wishlistSchema.index({ user: 1, tour: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
