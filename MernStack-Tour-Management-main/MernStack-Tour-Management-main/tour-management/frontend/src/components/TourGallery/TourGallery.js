import React, { useState, useEffect } from 'react';
import TourCard from '../TourCard/TourCard';
import { tourService } from '../../services/tourService';
import './TourGallery.css';

const TourGallery = ({ searchQuery, selectedCity, selectedPriceRange, selectedCategory }) => {
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState([]);
  const [categories] = useState(['all', 'beach', 'mountain', 'city', 'adventure', 'cultural', 'wildlife', 'luxury']);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [toursPerPage] = 12;

  useEffect(() => {
    fetchTours();
  }, []);

  useEffect(() => {
    filterTours();
  }, [tours, searchQuery, selectedCity, selectedPriceRange, selectedCategory, sortBy]);

  const fetchTours = async () => {
    try {
      setLoading(true);
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
    let filtered = [...tours];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(tour =>
        tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.category?.toLowerCase().includes(searchQuery.toLowerCase())
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

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(tour => tour.category === selectedCategory);
    }

    // Sort tours
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
        break;
      case 'bookings':
        filtered.sort((a, b) => (b.bookings || 0) - (a.bookings || 0));
        break;
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // Keep original order (featured)
        break;
    }

    setFilteredTours(filtered);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const indexOfLastTour = currentPage * toursPerPage;
  const indexOfFirstTour = indexOfLastTour - toursPerPage;
  const currentTours = filteredTours.slice(indexOfFirstTour, indexOfLastTour);
  const totalPages = Math.ceil(filteredTours.length / toursPerPage);

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
        <div className="tour-gallery__header-content">
          <div className="tour-gallery__title-section">
            <h2 className="tour-gallery__title">
              {filteredTours.length} Amazing Tours Available
            </h2>
            <p className="tour-gallery__subtitle">
              Discover your perfect adventure from our curated collection
            </p>
          </div>
          
          <div className="tour-gallery__controls">
            <div className="tour-gallery__sort">
              <label htmlFor="sort-select">Sort by:</label>
              <select 
                id="sort-select" 
                value={sortBy} 
                onChange={handleSortChange}
                className="tour-gallery__sort-select"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="bookings">Most Booked</option>
                <option value="name">Name</option>
              </select>
            </div>
            
            <div className="tour-gallery__view-modes">
              <button
                className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => handleViewModeChange('grid')}
                title="Grid View"
              >
                <i className="fas fa-th"></i>
              </button>
              <button
                className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => handleViewModeChange('list')}
                title="List View"
              >
                <i className="fas fa-list"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {filteredTours.length === 0 ? (
        <div className="tour-gallery__empty">
          <div className="tour-gallery__empty-icon">🔍</div>
          <h3>No tours found</h3>
          <p>Try adjusting your search or filters</p>
          <button 
            className="tour-gallery__reset-btn"
            onClick={() => {
              setSortBy('featured');
              window.location.href = '/tours';
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div className={`tour-gallery__${viewMode}`}>
            {currentTours.map((tour) => (
              <TourCard key={tour._id} tour={tour} viewMode={viewMode} />
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="tour-gallery__pagination">
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <i className="fas fa-chevron-left"></i>
                Previous
              </button>
              
              <div className="pagination-info">
                Page {currentPage} of {totalPages}
              </div>
              
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TourGallery;
