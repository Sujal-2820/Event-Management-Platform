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
        name: 'Sujal Soni',
        description: 'Full Stack Web Developer Developer',
        image: '/static/images/Sujal-Soni1.jpg',
        linkedin: 'https://www.linkedin.com/in/sujal-soni/',
        twitter: 'https://x.com/SujalSoni123',
      },
      {
        name: 'Silky Modi',
        description: 'Frontend Designer',
        image: '/static/images/Silky.jpg',
        linkedin: 'https://www.linkedin.com/',
        twitter: 'https://x.com/',
      },
      {
        name: 'Suhani Soni',
        description: 'UI/UX designer',
        image: '/static/images/Suhani.png',
        linkedin: 'https://www.linkedin.com/',
        twitter: 'https://x.com/',
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
