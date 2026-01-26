const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();
const { connectDB } = require('./config/database');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 8000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user to their personal room
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room ${socket.id}`);
  });

  // Handle real-time notifications
  socket.on('sendNotification', (data) => {
    const { userId, notification } = data;
    io.to(userId).emit('notification', notification);
  });

  // Handle booking updates
  socket.on('bookingUpdate', (data) => {
    const { userId, booking } = data;
    io.to(userId).emit('bookingUpdate', booking);
  });

  // Handle payment updates
  socket.on('paymentUpdate', (data) => {
    const { userId, payment } = data;
    io.to(userId).emit('paymentUpdate', payment);
  });

  // Handle order tracking updates
  socket.on('trackingUpdate', (data) => {
    const { userId, tracking } = data;
    io.to(userId).emit('trackingUpdate', tracking);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io available to routes
app.set('io', io);

// Routes
app.get('/', (req, res) => {
  res.send('Tour Management API is running...');
});

// API Routes
app.use('/api/v1/tours', require('./routes/tourRoutes'));
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/reviews', require('./routes/reviewRoutes'));
app.use('/api/v1/bookings', require('./routes/bookingRoutes'));
app.use('/api/v1/notifications', require('./routes/notificationRoutes'));
app.use('/api/v1/analytics', require('./routes/analyticsRoutes'));
app.use('/api/v1/payments', require('./routes/paymentRoutes'));

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
