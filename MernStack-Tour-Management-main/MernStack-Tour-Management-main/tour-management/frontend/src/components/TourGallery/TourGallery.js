import React, { useState, useEffect } from 'react';
import TourCard from '../TourCard/TourCard';
import { tourService } from '../../services/tourService';
import './TourGallery.css';

const TourGallery = ({ searchQuery, selectedCity, selectedPriceRange }) => {
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetchTours();
  }, []);

  useEffect(() => {
    filterTours();
  }, [tours, searchQuery, selectedCity, selectedPriceRange]);

  const fetchTours = async () => {
    try {
      const response = await tourService.getAllTours();
      if (response.success) {
        setTours(response.data);
        extractCities(response.data);
      }
    } catch (error) {
      console.error('Error fetching tours:', error);
    } finally {
      setLoading(false);
    }
  };

  const extractCities = (tours) => {
    const uniqueCities = [...new Set(tours.map(tour => tour.city))];
    setCities(uniqueCities);
  };

  const filterTours = () => {
    let filtered = tours;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(tour =>
        tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.desc.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by city
    if (selectedCity && selectedCity !== 'all') {
      filtered = filtered.filter(tour => tour.city === selectedCity);
    }

    // Filter by price range
    if (selectedPriceRange && selectedPriceRange !== 'all') {
      const [min, max] = selectedPriceRange.split('-').map(Number);
      filtered = filtered.filter(tour => tour.price >= min && tour.price <= max);
    }

    setFilteredTours(filtered);
  };

  if (loading) {
    return (
      <div className="tour-gallery">
        <div className="tour-gallery__loading">
          <div className="tour-gallery__spinner"></div>
          <p>Loading amazing tours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tour-gallery">
      <div className="tour-gallery__header">
        <h2 className="tour-gallery__title">
          {filteredTours.length} Amazing Tours Available
        </h2>
        <p className="tour-gallery__subtitle">
          Discover your perfect adventure from our curated collection
        </p>
      </div>

      {filteredTours.length === 0 ? (
        <div className="tour-gallery__empty">
          <div className="tour-gallery__empty-icon">🔍</div>
          <h3>No tours found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="tour-gallery__grid">
          {filteredTours.map((tour) => (
            <TourCard key={tour._id} tour={tour} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TourGallery;
