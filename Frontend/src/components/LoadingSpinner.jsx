import React from 'react';
import { Loader2 } from 'lucide-react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = 'Loading...', fullScreen = false }) => {
  return (
    <div className={`loading-spinner ${fullScreen ? 'loading-spinner--fullscreen' : ''}`}>
      <div className="loading-spinner__inner">
        <div className="loading-spinner__ring">
          <Loader2 size={40} className="loading-spinner__icon" />
        </div>
        <p className="loading-spinner__message">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
