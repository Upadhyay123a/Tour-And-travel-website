const Notification = require('../models/Notification');

class NotificationService {
  constructor(io) {
    this.io = io;
  }

  // Send real-time notification
  async sendNotification(userId, type, title, message, data = {}) {
    try {
      // Create notification in database
      const notification = new Notification({
        user: userId,
        type,
        title,
        message,
        data,
        isRead: false
      });

      await notification.save();

      // Send real-time notification via Socket.io
      this.io.to(userId).emit('notification', {
        _id: notification._id,
        type,
        title,
        message,
        data,
        isRead: false,
        createdAt: notification.createdAt
      });

      return notification;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  // Send booking confirmation
  async sendBookingConfirmation(userId, booking) {
    await this.sendNotification(
      userId,
      'booking',
      'Booking Confirmed',
      `Your tour "${booking.tour.title}" has been confirmed for ${new Date(booking.tourDate).toLocaleDateString()}`,
      { bookingId: booking._id }
    );
  }

  // Send payment confirmation
  async sendPaymentConfirmation(userId, payment) {
    await this.sendNotification(
      userId,
      'payment',
      'Payment Successful',
      `Payment of $${payment.amount} has been processed successfully`,
      { paymentId: payment._id }
    );
  }

  // Send booking reminder
  async sendBookingReminder(userId, booking) {
    await this.sendNotification(
      userId,
      'reminder',
      'Tour Reminder',
      `Your tour "${booking.tour.title}" is scheduled for tomorrow at ${new Date(booking.tourDate).toLocaleTimeString()}`,
      { bookingId: booking._id }
    );
  }

  // Send tour update
  async sendTourUpdate(userId, booking, status) {
    const statusMessages = {
      'tour_started': 'Your tour has started!',
      'tour_completed': 'Your tour has been completed. Thank you for choosing us!',
      'cancelled': 'Your tour has been cancelled.'
    };

    await this.sendNotification(
      userId,
      'booking',
      'Tour Update',
      statusMessages[status] || `Your tour status has been updated to: ${status}`,
      { bookingId: booking._id, status }
    );
  }

  // Send wallet update
  async sendWalletUpdate(userId, amount, type, description) {
    const typeMessages = {
      'credit': `$${amount} has been added to your wallet`,
      'debit': `$${amount} has been deducted from your wallet`,
      'refund': `$${amount} has been refunded to your wallet`
    };

    await this.sendNotification(
      userId,
      'wallet',
      'Wallet Update',
      typeMessages[type] || description,
      { amount, type }
    );
  }

  // Send promotional notification
  async sendPromotionalNotification(userId, title, message, couponCode = null) {
    await this.sendNotification(
      userId,
      'promotion',
      title,
      message,
      { couponCode }
    );
  }

  // Send system notification
  async sendSystemNotification(userId, title, message) {
    await this.sendNotification(
      userId,
      'system',
      title,
      message
    );
  }

  // Broadcast notification to all users
  async broadcastNotification(type, title, message, data = {}) {
    try {
      this.io.emit('broadcast', {
        type,
        title,
        message,
        data,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error broadcasting notification:', error);
      throw error;
    }
  }
}

module.exports = NotificationService;
