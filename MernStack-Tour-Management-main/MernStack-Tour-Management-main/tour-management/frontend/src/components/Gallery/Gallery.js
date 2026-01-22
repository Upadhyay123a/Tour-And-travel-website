import React, { useState } from 'react';
import './Gallery.css';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryImages = [
    { id: 1, src: '/images/gallery-01.jpg', title: 'Santorini Sunset', category: 'destinations' },
    { id: 2, src: '/images/gallery-02.jpg', title: 'Swiss Alps', category: 'destinations' },
    { id: 3, src: '/images/gallery-03.jpg', title: 'Maldives Paradise', category: 'beaches' },
    { id: 4, src: '/images/gallery-04.jpg', title: 'Dubai Luxury', category: 'cities' },
    { id: 5, src: '/images/gallery-05.jpg', title: 'Northern Lights', category: 'nature' },
    { id: 6, src: '/images/gallery-06.jpg', title: 'African Safari', category: 'wildlife' },
    { id: 7, src: '/images/gallery-07.jpg', title: 'Amazon Rainforest', category: 'nature' },
    { id: 8, src: '/images/hero-img01.jpg', title: 'Adventure Awaits', category: 'adventure' },
    { id: 9, src: '/images/hero-img02.jpg', title: 'Mountain Escape', category: 'adventure' },
    { id: 10, src: '/images/pexels-david-bartus-586687.jpg', title: 'City Lights', category: 'cities' },
    { id: 11, src: '/images/tour-img01.jpg', title: 'London Bridge', category: 'landmarks' },
    { id: 12, src: '/images/tour-img02.jpg', title: 'Bali Temple', category: 'culture' },
    { id: 13, src: '/images/tour-img03.jpg', title: 'Snow Mountains', category: 'nature' },
    { id: 14, src: '/images/tour-img04.jpg', title: 'Tropical Beach', category: 'beaches' },
    { id: 15, src: '/images/tour-img05.jpg', title: 'Island Paradise', category: 'islands' },
    { id: 16, src: '/images/tour-img06.jpg', title: 'Cherry Blossoms', category: 'nature' },
    { id: 17, src: '/images/tour-img07.jpg', title: 'Coastal Beauty', category: 'beaches' },
  ];

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="gallery">
      <div className="gallery__header">
        <h1 className="gallery__title">Travel Gallery</h1>
        <p className="gallery__subtitle">Explore our collection of breathtaking destinations</p>
      </div>

      <div className="gallery__grid">
        {galleryImages.map((image) => (
          <div 
            key={image.id} 
            className="gallery__item"
            onClick={() => openModal(image)}
          >
            <img 
              src={image.src} 
              alt={image.title}
              className="gallery__image"
            />
            <div className="gallery__overlay">
              <h3 className="gallery__image-title">{image.title}</h3>
              <span className="gallery__category">{image.category}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="gallery__modal" onClick={closeModal}>
          <div className="gallery__modal-content">
            <img 
              src={selectedImage.src} 
              alt={selectedImage.title}
              className="gallery__modal-image"
            />
            <div className="gallery__modal-info">
              <h3>{selectedImage.title}</h3>
              <p>{selectedImage.category}</p>
              <button className="gallery__modal-close" onClick={closeModal}>
                ×
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
