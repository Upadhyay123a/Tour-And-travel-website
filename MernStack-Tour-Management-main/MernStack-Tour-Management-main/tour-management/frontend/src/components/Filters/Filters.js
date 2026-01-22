import React, { useState, useEffect } from 'react';
import './Filters.css';

const Filters = ({ onFilterChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [cities, setCities] = useState([]);

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-100', label: 'Under $100' },
    { value: '100-200', label: '$100 - $200' },
    { value: '200-500', label: '$200 - $500' },
    { value: '500+', label: 'Over $500' }
  ];

  useEffect(() => {
    // This would normally fetch cities from API
    setCities(['London', 'Bali', 'Bangkok', 'Paris', 'Tokyo', 'New York']);
  }, []);

  useEffect(() => {
    onFilterChange({
      searchQuery,
      selectedCity,
      selectedPriceRange
    });
  }, [searchQuery, selectedCity, selectedPriceRange]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const handlePriceChange = (e) => {
    setSelectedPriceRange(e.target.value);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCity('all');
    setSelectedPriceRange('all');
  };

  return (
    <div className="filters">
      <div className="filters__container">
        <div className="filters__search">
          <input
            type="text"
            placeholder="Search destinations, tours..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="filters__search-input"
          />
          <button className="filters__search-btn">🔍</button>
        </div>

        <div className="filters__controls">
          <div className="filters__group">
            <label className="filters__label">City</label>
            <select 
              value={selectedCity} 
              onChange={handleCityChange}
              className="filters__select"
            >
              <option value="all">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="filters__group">
            <label className="filters__label">Price Range</label>
            <select 
              value={selectedPriceRange} 
              onChange={handlePriceChange}
              className="filters__select"
            >
              {priceRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          <button 
            onClick={clearFilters}
            className="filters__clear-btn"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
