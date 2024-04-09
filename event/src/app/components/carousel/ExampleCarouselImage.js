import React from 'react';

function ExampleCarouselImage({ text }) {
  const imageStyle = {
    width: '100%', // Set width to 100% of the container
    height: '50vh', // Set height to 100% of the viewport height
    objectFit: 'cover', // Maintain aspect ratio and cover the container
  };

  return <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNWZZEtSli3K3SYZN-Mhsl0WPo_1o6qYQ5ag&usqp=CAU" alt={text} style={imageStyle} />;
}

export default ExampleCarouselImage;
