const mongoose = require('mongoose');
require('dotenv').config();
const Tour = require('./models/Tour');

const seedEnhancedTours = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Clear existing tours
    await Tour.deleteMany({});
    
    // Enhanced tour data with all available images
    const tours = [
      {
        title: "Westminster Bridge",
        city: "London",
        address: "Westminster Bridge, London SW1A 2JR",
        distance: 300,
        price: 99,
        maxGroupSize: 10,
        desc: "Experience the iconic Westminster Bridge with stunning views of the Houses of Parliament and Big Ben. Perfect for photography enthusiasts and history lovers.",
        photo: "tour-img01.jpg",
        featured: true
      },
      {
        title: "Bali Paradise",
        city: "Bali",
        address: "Ubud, Bali, Indonesia",
        distance: 400,
        price: 149,
        maxGroupSize: 8,
        desc: "Discover the tropical paradise of Bali with ancient temples, rice terraces, and pristine beaches. A perfect blend of culture and relaxation.",
        photo: "tour-img02.jpg",
        featured: true
      },
      {
        title: "Snowy Mountains Adventure",
        city: "Bangkok",
        address: "Northern Thailand",
        distance: 500,
        price: 199,
        maxGroupSize: 8,
        desc: "Embark on an adventure through Thailand's stunning mountain regions with trekking, local villages, and breathtaking scenery.",
        photo: "tour-img03.jpg",
        featured: true
      },
      {
        title: "Beautiful Sunrise Tour",
        city: "Phuket",
        address: "Phuket, Thailand",
        distance: 500,
        price: 179,
        maxGroupSize: 12,
        desc: "Witness spectacular sunsets over the Andaman Sea. Includes island hopping, snorkeling, and beach relaxation.",
        photo: "tour-img04.jpg",
        featured: true
      },
      {
        title: "Nusa Penida Explorer",
        city: "Bali",
        address: "Nusa Penida Island, Bali",
        distance: 500,
        price: 189,
        maxGroupSize: 8,
        desc: "Explore the pristine beauty of Nusa Penida with its famous Kelingking Beach and dramatic coastal cliffs.",
        photo: "tour-img05.jpg",
        featured: false
      },
      {
        title: "Cherry Blossoms Spring",
        city: "Tokyo",
        address: "Tokyo, Japan",
        distance: 500,
        price: 299,
        maxGroupSize: 8,
        desc: "Experience the magical cherry blossom season in Tokyo with temple visits, traditional gardens, and city tours.",
        photo: "tour-img06.jpg",
        featured: false
      },
      {
        title: "Holmen Lofoten Experience",
        city: "Paris",
        address: "Lofoten Islands, Norway",
        distance: 500,
        price: 399,
        maxGroupSize: 8,
        desc: "Discover the dramatic landscapes of Lofoten with midnight sun, fishing villages, and Arctic wildlife.",
        photo: "tour-img07.jpg",
        featured: false
      },
      {
        title: "Santorini Sunset Dreams",
        city: "Paris",
        address: "Santorini, Greece",
        distance: 600,
        price: 459,
        maxGroupSize: 6,
        desc: "Romantic getaway to the stunning island of Santorini with white-washed villages and spectacular sunsets.",
        photo: "gallery-01.jpg",
        featured: true
      },
      {
        title: "Swiss Alps Adventure",
        city: "Paris",
        address: "Interlaken, Switzerland",
        distance: 800,
        price: 599,
        maxGroupSize: 10,
        desc: "Alpine adventure with hiking, cable cars, and breathtaking mountain views in the heart of Switzerland.",
        photo: "gallery-02.jpg",
        featured: false
      },
      {
        title: "Maldives Paradise",
        city: "Tokyo",
        address: "Male, Maldives",
        distance: 1000,
        price: 899,
        maxGroupSize: 4,
        desc: "Luxury escape to overwater bungalows, pristine coral reefs, and turquoise waters of the Maldives.",
        photo: "gallery-03.jpg",
        featured: true
      },
      {
        title: "Dubai Luxury Experience",
        city: "Tokyo",
        address: "Dubai, UAE",
        distance: 900,
        price: 799,
        maxGroupSize: 8,
        desc: "Experience the ultimate luxury in Dubai with desert safaris, city tours, and world-class shopping.",
        photo: "gallery-04.jpg",
        featured: false
      },
      {
        title: "Iceland Northern Lights",
        city: "Paris",
        address: "Reykjavik, Iceland",
        distance: 1200,
        price: 699,
        maxGroupSize: 12,
        desc: "Chase the magical Northern Lights with geothermal spas, glaciers, and volcanic landscapes.",
        photo: "gallery-05.jpg",
        featured: true
      },
      {
        title: "African Safari Adventure",
        city: "Paris",
        address: "Serengeti, Tanzania",
        distance: 1500,
        price: 1299,
        maxGroupSize: 6,
        desc: "Ultimate wildlife safari with the Big Five, luxury lodges, and expert guides in the Serengeti.",
        photo: "gallery-06.jpg",
        featured: false
      },
      {
        title: "Amazon Rainforest Expedition",
        city: "Paris",
        address: "Amazon Basin, Brazil",
        distance: 1800,
        price: 999,
        maxGroupSize: 8,
        desc: "Deep jungle adventure with wildlife spotting, indigenous communities, and river cruises in the Amazon.",
        photo: "gallery-07.jpg",
        featured: true
      },
      {
        title: "New York City Explorer",
        city: "New York",
        address: "Manhattan, New York",
        distance: 200,
        price: 249,
        maxGroupSize: 15,
        desc: "Experience the Big Apple with Broadway shows, iconic landmarks, and diverse neighborhoods.",
        photo: "pexels-david-bartus-586687.jpg",
        featured: true
      }
    ];

    await Tour.insertMany(tours);
    console.log(`${tours.length} enhanced tours added successfully!`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding enhanced data:', error);
  }
};

seedEnhancedTours();
