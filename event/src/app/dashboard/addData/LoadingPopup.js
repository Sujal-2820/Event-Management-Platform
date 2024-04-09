// src/app/dashboard/addData/LoadingPopup.js

import React from 'react';
import './LoadingPopup.css';

const LoadingPopup = () => {
  return (
    <div className="loading-popup">
      <div className="loading-content">
        <p className="loading-text">Hold On! We are submitting your data</p>
        <div className="loading-spinner"></div>
      </div>
    </div>
  );
};

export default LoadingPopup;
