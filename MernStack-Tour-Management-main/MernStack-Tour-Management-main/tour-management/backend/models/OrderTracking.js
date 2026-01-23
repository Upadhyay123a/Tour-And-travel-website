const mongoose = require('mongoose');

const orderTrackingSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  currentStatus: {
    type: String,
    enum: [
      'order_placed',
      'order_confirmed',
      'payment_processing',
      'payment_completed',
      'booking_confirmed',
      'preparing_tour',
      'tour_assigned',
      'guide_assigned',
      'tour_started',
      'tour_in_progress',
      'tour_completed',
      'feedback_requested',
      'completed',
      'cancelled',
      'refunded'
    ],
    default: 'order_placed'
  },
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    description: {
      type: String,
      required: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      }
    },
    estimatedTime: Date,
    notes: String
  }],
  estimatedDeliveryTime: Date,
  actualDeliveryTime: Date,
  assignedGuide: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  trackingLink: {
    type: String,
    unique: true,
    sparse: true
  },
  realTimeTracking: {
    isEnabled: {
      type: Boolean,
      default: false
    },
    currentLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      }
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    speed: {
      type: Number,
      default: 0
    },
    heading: {
      type: Number,
      default: 0
    }
  },
  notifications: [{
    type: {
      type: String,
      enum: ['sms', 'email', 'push', 'whatsapp'],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    sentAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'sent', 'delivered', 'failed'],
      default: 'pending'
    }
  }],
  customerNotes: {
    type: String,
    default: ''
  },
  internalNotes: {
    type: String,
    default: ''
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  specialInstructions: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

orderTrackingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Generate unique tracking link
orderTrackingSchema.pre('save', async function(next) {
  if (this.isNew && !this.trackingLink) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    this.trackingLink = `https://tourapp.com/track/${timestamp}${random}`;
  }
  next();
});

// Method to update status
orderTrackingSchema.methods.updateStatus = function(newStatus, description, updatedBy = null, location = null, estimatedTime = null, notes = '') {
  this.currentStatus = newStatus;
  
  this.statusHistory.push({
    status: newStatus,
    description,
    updatedBy,
    location,
    estimatedTime,
    notes,
    timestamp: new Date()
  });
  
  // Update actual delivery time if completed
  if (newStatus === 'tour_completed') {
    this.actualDeliveryTime = new Date();
  }
  
  return this.save();
};

// Method to get current status with ETA
orderTrackingSchema.methods.getCurrentStatus = function() {
  const currentStatus = this.statusHistory[this.statusHistory.length - 1];
  return {
    status: this.currentStatus,
    description: currentStatus.description,
    timestamp: currentStatus.timestamp,
    estimatedTime: currentStatus.estimatedTime || this.estimatedDeliveryTime,
    location: currentStatus.location,
    notes: currentStatus.notes
  };
};

// Method to get status timeline
orderTrackingSchema.methods.getStatusTimeline = function() {
  return this.statusHistory.sort((a, b) => b.timestamp - a.timestamp);
};

// Method to enable real-time tracking
orderTrackingSchema.methods.enableRealTimeTracking = function() {
  this.realTimeTracking.isEnabled = true;
  this.realTimeTracking.lastUpdated = new Date();
  return this.save();
};

// Method to update real-time location
orderTrackingSchema.methods.updateLocation = function(coordinates, speed = 0, heading = 0) {
  this.realTimeTracking.currentLocation.coordinates = coordinates;
  this.realTimeTracking.speed = speed;
  this.realTimeTracking.heading = heading;
  this.realTimeTracking.lastUpdated = new Date();
  return this.save();
};

// Static method to get tracking by booking
orderTrackingSchema.statics.findByBooking = function(bookingId) {
  return this.findOne({ booking: bookingId }).populate('user assignedGuide assignedDriver');
};

// Static method to get active tracking for user
orderTrackingSchema.statics.findActiveTrackingForUser = function(userId) {
  return this.find({ 
    user: userId,
    currentStatus: { $nin: ['completed', 'cancelled', 'refunded'] }
  }).populate('booking');
};

module.exports = mongoose.model('OrderTracking', orderTrackingSchema);
