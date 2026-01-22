import React, { useState, useEffect, useRef } from 'react';
import './SearchSuggestions.css';

const SearchSuggestions = ({ onTourSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (query.length >= 2) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      // Mock suggestions - in real app, this would be an API call
      const mockSuggestions = [
        { id: 1, title: 'Bali Paradise Tour', city: 'Bali', category: 'Beach', price: 299 },
        { id: 2, title: 'Swiss Alps Adventure', city: 'Switzerland', category: 'Mountain', price: 599 },
        { id: 3, title: 'Santorini Sunset', city: 'Greece', category: 'Island', price: 459 },
        { id: 4, title: 'London Bridge Experience', city: 'London', category: 'Landmark', price: 99 },
        { id: 5, title: 'Dubai Luxury Tour', city: 'Dubai', category: 'City', price: 799 },
        { id: 6, title: 'African Safari', city: 'Kenya', category: 'Wildlife', price: 1299 },
        { id: 7, title: 'Amazon Rainforest', city: 'Brazil', category: 'Nature', price: 899 },
        { id: 8, title: 'Northern Lights', city: 'Iceland', category: 'Nature', price: 699 },
      ];

      const filtered = mockSuggestions.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.city.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );

      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(filtered.length > 0);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.title);
    setShowSuggestions(false);
    if (onTourSelect) {
      onTourSelect(suggestion);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      // Handle search logic here
    }
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  return (
    <div className="search-suggestions" ref={searchRef}>
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(suggestions.length > 0)}
            placeholder="Search tours, destinations, or activities..."
            className="search-input"
          />
          <button type="submit" className="search-btn">
            🔍
          </button>
        </div>
      </form>

      {showSuggestions && (
        <div className="suggestions-dropdown">
          {loading ? (
            <div className="suggestions-loading">
              <div className="loading-spinner"></div>
              <span>Loading suggestions...</span>
            </div>
          ) : (
            <>
              {suggestions.length === 0 ? (
                <div className="no-suggestions">
                  <p>No suggestions found</p>
                </div>
              ) : (
                suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="suggestion-content">
                      <div className="suggestion-title">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: highlightMatch(suggestion.title, query)
                          }}
                        />
                      </div>
                      <div className="suggestion-details">
                        <span className="suggestion-city">📍 {suggestion.city}</span>
                        <span className="suggestion-category">{suggestion.category}</span>
                        <span className="suggestion-price">${suggestion.price}</span>
                      </div>
                    </div>
                    <div className="suggestion-arrow">→</div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchSuggestions;
