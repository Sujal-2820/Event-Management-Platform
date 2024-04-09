// src/app/dashboard/addData/LoadingPopup.js

import React from 'react';
import './contentLoading.css';

const LoadingPopup = () => {
  return (
    <div className="loading-popup">
      <div className="loading-content">
        <p className="loading-text">Please wait for a while till we fetch your data</p>
        <div className="loading-spinner"></div>
      </div>
    </div>
  );
};

export default LoadingPopup;
