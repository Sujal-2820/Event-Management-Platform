// components/NewLayout.js
import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './makers.css'; // Import the CSS file

function NewLayout() {
  // Developers data
    const developers = [
      {
        name: 'Tanishq Sharma',
        description: 'Frontend Developer',
        image: '/static/images/tanishq.jpg',
        linkedin: 'https://www.linkedin.com/in/tanishq-sharma-580bb0245/',
        twitter: 'https://x.com/',
      },
      {
        name: 'Tanmay Porwal',
        description: 'UI/UX Designer',
        image: '/static/images/tanmay.jpg',
        linkedin: 'https://www.linkedin.com/in/tanmay-porwal-a5a8b61a8/',
        twitter: 'https://x.com/',
      },
      {
        name: 'Somitra Soni',
        description: 'Backend Developer',
        image: '/static/images/Somitra.png',
        linkedin: 'https://www.linkedin.com/in/somitra-soni-01471a330/',
        twitter: 'https://twitter.com/',
      },
    ];

  return (
    <div className='new-layout'>
      <Container className="container-box">
        <Row>
          <Col className="text-center">
            <h2 className="developer-heading">
              <i className="fas fa-users"></i> Meet the Developers
            </h2>
          </Col>
        </Row>
        <br />
        <Row xs={1} md={3} className="g-4">
          {developers.map((developer, index) => (
            <Col key={index} className="text-center">
              <div className="developer-section">
                <img src={developer.image} alt={developer.name} className="developer-image" />
                <h3 className="developer-name">{developer.name}</h3>
                <p className="developer-description">{developer.description}</p>
                <div className="social-handles">
                  <a href={developer.linkedin} target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-linkedin"></i>
                  </a>
                  <a href={developer.twitter} target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-twitter"></i>
                  </a>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default NewLayout;
