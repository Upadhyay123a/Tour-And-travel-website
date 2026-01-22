const mongoose = require('mongoose');
require('dotenv').config();
const Tour = require('./models/Tour');

const seedTours = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Clear existing tours
    await Tour.deleteMany({});
    
    // Add sample tours
    const tours = [
      {
        title: "Westminister Bridge",
        city: "London",
        address: "Somewhere in London",
        distance: 300,
        price: 99,
        maxGroupSize: 10,
        desc: "Beautiful historic bridge in London with stunning views",
        photo: "tour-img01.jpg",
        featured: true
      },
      {
        title: "Bali, Indonesia",
        city: "Bali",
        address: "Somewhere in Indonesia",
        distance: 400,
        price: 99,
        maxGroupSize: 8,
        desc: "Tropical paradise with beautiful beaches and temples",
        photo: "tour-img02.jpg",
        featured: true
      },
      {
        title: "Snowy Mountains, Thailand",
        city: "Bangkok",
        address: "Somewhere in Thailand",
        distance: 500,
        price: 99,
        maxGroupSize: 8,
        desc: "Mountain adventure with snow activities",
        photo: "tour-img03.jpg",
        featured: true
      }
    ];

    await Tour.insertMany(tours);
    console.log('Sample tours added successfully');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

seedTours();
