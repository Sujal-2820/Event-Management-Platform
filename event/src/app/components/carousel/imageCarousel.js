import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import axios from 'axios'; // Import axios for making HTTP requests
import './imageCarousel.css';

function ImageCarousel() {
  const [carouselData, setCarouselData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make a GET request to fetch carousel data from your backend
        const response = await axios.get('http://localhost:5000/public');
        setCarouselData(response.data);
      } catch (error) {
        console.error('Error fetching carousel data:', error);
      }
    };
 
    fetchData();
  }, []);

  const imageStyle = {
    width: '100%',
    height: '50vh',
    objectFit: 'cover',
  };

  return (
    <Carousel className='carousel-body'>
      {carouselData.map((item, index) => (
        <Carousel.Item key={index} interval={3000}>
          <img
            className='d-block w-75'
            
            src={item.imageUrl}
            alt={`Slide ${index + 1}`}
            style={imageStyle}
          />
          <Carousel.Caption>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <button className='view-details-button'>View Details</button>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default ImageCarousel;
