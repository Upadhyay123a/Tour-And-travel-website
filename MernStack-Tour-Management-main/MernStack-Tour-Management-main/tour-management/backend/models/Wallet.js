const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  blockReason: {
    type: String,
    default: ''
  },
  transactions: [{
    type: {
      type: String,
      enum: ['credit', 'debit', 'refund', 'bonus', 'penalty'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    referenceId: {
      type: String,
      sparse: true
    },
    referenceType: {
      type: String,
      enum: ['booking', 'refund', 'bonus', 'penalty'],
      default: 'booking'
    },
    balanceBefore: {
      type: Number,
      required: true
    },
    balanceAfter: {
      type: Number,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastTransactionDate: {
    type: Date,
    default: Date.now
  },
  totalCredits: {
    type: Number,
    default: 0
  },
  totalDebits: {
    type: Number,
    default: 0
  },
  bonusEarned: {
    type: Number,
    default: 0
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

walletSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to add money to wallet
walletSchema.methods.credit = function(amount, description, referenceId = null, referenceType = 'booking') {
  if (amount <= 0) {
    throw new Error('Credit amount must be positive');
  }
  
  this.balanceBefore = this.balance;
  this.balance += amount;
  this.balanceAfter = this.balance;
  
  this.transactions.push({
    type: 'credit',
    amount,
    description,
    referenceId,
    referenceType,
    balanceBefore: this.balanceBefore,
    balanceAfter: this.balanceAfter
  });
  
  this.totalCredits += amount;
  this.lastTransactionDate = new Date();
  
  return this.save();
};

// Method to deduct money from wallet
walletSchema.methods.debit = function(amount, description, referenceId = null, referenceType = 'booking') {
  if (amount <= 0) {
    throw new Error('Debit amount must be positive');
  }
  
  if (this.balance < amount) {
    throw new Error('Insufficient wallet balance');
  }
  
  this.balanceBefore = this.balance;
  this.balance -= amount;
  this.balanceAfter = this.balance;
  
  this.transactions.push({
    type: 'debit',
    amount,
    description,
    referenceId,
    referenceType,
    balanceBefore: this.balanceBefore,
    balanceAfter: this.balanceAfter
  });
  
  this.totalDebits += amount;
  this.lastTransactionDate = new Date();
  
  return this.save();
};

// Method to add bonus
walletSchema.methods.addBonus = function(amount, description) {
  return this.credit(amount, description, null, 'bonus').then(() => {
    this.bonusEarned += amount;
    return this.save();
  });
};

// Method to get transaction history
walletSchema.methods.getTransactionHistory = function(limit = 50, skip = 0) {
  return this.transactions
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Static method to create or get user wallet
walletSchema.statics.getOrCreateWallet = async function(userId) {
  let wallet = await this.findOne({ user: userId });
  if (!wallet) {
    wallet = new this({ user: userId });
    await wallet.save();
  }
  return wallet;
};

module.exports = mongoose.model('Wallet', walletSchema);
