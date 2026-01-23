const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed', 'buy_one_get_one', 'free_delivery'],
    required: true
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  minimumOrderAmount: {
    type: Number,
    default: 0
  },
  maximumDiscountAmount: {
    type: Number,
    default: null
  },
  usageLimit: {
    type: Number,
    default: null
  },
  usageCount: {
    type: Number,
    default: 0
  },
  userUsageLimit: {
    type: Number,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicableTours: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour'
  }],
  applicableCategories: [{
    type: String,
    enum: ['beach', 'mountain', 'city', 'adventure', 'cultural', 'wildlife', 'luxury']
  }],
  validFrom: {
    type: Date,
    default: Date.now
  },
  validUntil: {
    type: Date,
    required: true
  },
  usedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    usedAt: {
      type: Date,
      default: Date.now
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

couponSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to check if coupon is valid
couponSchema.methods.isValid = function(userId = null) {
  const now = new Date();
  
  // Check if coupon is active
  if (!this.isActive) {
    return { valid: false, reason: 'Coupon is not active' };
  }
  
  // Check if coupon is within valid date range
  if (now < this.validFrom || now > this.validUntil) {
    return { valid: false, reason: 'Coupon is expired or not yet active' };
  }
  
  // Check if usage limit is reached
  if (this.usageLimit && this.usageCount >= this.usageLimit) {
    return { valid: false, reason: 'Coupon usage limit reached' };
  }
  
  // Check if user has already used the coupon
  if (userId && this.userUsageLimit > 0) {
    const userUsageCount = this.usedBy.filter(usage => 
      usage.user.toString() === userId.toString()
    ).length;
    
    if (userUsageCount >= this.userUsageLimit) {
      return { valid: false, reason: 'You have already used this coupon' };
    }
  }
  
  return { valid: true };
};

// Method to calculate discount
couponSchema.methods.calculateDiscount = function(orderAmount, tourId = null, category = null) {
  let discount = 0;
  
  // Check if coupon applies to specific tours or categories
  if (this.applicableTours.length > 0 && tourId) {
    if (!this.applicableTours.includes(tourId)) {
      return { discount: 0, reason: 'Coupon not applicable to this tour' };
    }
  }
  
  if (this.applicableCategories.length > 0 && category) {
    if (!this.applicableCategories.includes(category)) {
      return { discount: 0, reason: 'Coupon not applicable to this category' };
    }
  }
  
  // Check minimum order amount
  if (orderAmount < this.minimumOrderAmount) {
    return { 
      discount: 0, 
      reason: `Minimum order amount of ${this.minimumOrderAmount} required` 
    };
  }
  
  // Calculate discount based on type
  switch (this.discountType) {
    case 'percentage':
      discount = (orderAmount * this.discountValue) / 100;
      if (this.maximumDiscountAmount && discount > this.maximumDiscountAmount) {
        discount = this.maximumDiscountAmount;
      }
      break;
    case 'fixed':
      discount = Math.min(this.discountValue, orderAmount);
      break;
    case 'buy_one_get_one':
      discount = orderAmount / 2; // 50% discount for BOGO
      break;
    case 'free_delivery':
      discount = 50; // Fixed delivery fee amount
      break;
  }
  
  return { discount, finalAmount: orderAmount - discount };
};

// Method to mark coupon as used
couponSchema.methods.markAsUsed = function(userId, bookingId) {
  this.usedBy.push({
    user: userId,
    bookingId: bookingId,
    usedAt: new Date()
  });
  this.usageCount += 1;
  
  // Deactivate coupon if usage limit is reached
  if (this.usageLimit && this.usageCount >= this.usageLimit) {
    this.isActive = false;
  }
  
  return this.save();
};

// Static method to find valid coupons
couponSchema.statics.findValidCoupons = function(userId = null) {
  const now = new Date();
  const query = {
    isActive: true,
    validFrom: { $lte: now },
    validUntil: { $gte: now }
  };
  
  if (this.usageLimit) {
    query.$expr = { $lt: ['$usageCount', '$usageLimit'] };
  }
  
  return this.find(query).populate('applicableTours');
};

module.exports = mongoose.model('Coupon', couponSchema);
