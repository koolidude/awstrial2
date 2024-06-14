// src/components/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingSpinner;
