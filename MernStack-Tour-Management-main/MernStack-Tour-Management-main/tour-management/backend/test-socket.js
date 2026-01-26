const io = require('socket.io-client');

// Connect to the server
const socket = io('http://localhost:8000');

socket.on('connect', () => {
  console.log('Connected to server with ID:', socket.id);
  
  // Join a user room (using a test user ID)
  const testUserId = '64a7b8c9d1e2f3g4h5i6j7k8';
  socket.emit('join', testUserId);
  console.log('Joined room for user:', testUserId);
});

// Listen for notifications
socket.on('notification', (data) => {
  console.log('Received notification:', data);
});

// Listen for booking updates
socket.on('bookingUpdate', (data) => {
  console.log('Received booking update:', data);
});

// Listen for payment updates
socket.on('paymentUpdate', (data) => {
  console.log('Received payment update:', data);
});

// Listen for tracking updates
socket.on('trackingUpdate', (data) => {
  console.log('Received tracking update:', data);
});

// Listen for broadcasts
socket.on('broadcast', (data) => {
  console.log('Received broadcast:', data);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

// Test sending a notification after 2 seconds
setTimeout(() => {
  console.log('Testing notification...');
  socket.emit('sendNotification', {
    userId: '64a7b8c9d1e2f3g4h5i6j7k8',
    notification: {
      type: 'test',
      title: 'Test Notification',
      message: 'This is a test notification from Socket.io',
      data: { test: true }
    }
  });
}, 2000);

// Keep the connection alive
setInterval(() => {
  socket.emit('ping');
}, 30000);
