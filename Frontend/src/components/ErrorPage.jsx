import { useNavigate } from 'react-router-dom';
import './ErrorPage.css';

const ErrorPage = ({
  errorCode = '500',
  title = 'Something went wrong!',
  message = 'We encountered an unexpected error. Please try again.',
  showHomeButton = true,
  showBackButton = false
}) => {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <div className="error-page-content">
        <div className="error-code">{errorCode}</div>
        <h1 className="error-title">{title}</h1>
        <p className="error-description">{message}</p>

        <div className="error-page-actions">
          {showBackButton && (
            <button onClick={() => navigate(-1)} className="btn-back">
              Go Back
            </button>
          )}
          {showHomeButton && (
            <button onClick={() => navigate('/')} className="btn-home">
              Go to Home
            </button>
          )}
        </div>

        <div className="error-illustration">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="80" fill="#f3f4f6" />
            <path d="M70 80 Q 70 60, 85 60 Q 100 60, 100 75 Q 100 60, 115 60 Q 130 60, 130 80"
                  stroke="#667eea" strokeWidth="6" fill="none" strokeLinecap="round"/>
            <circle cx="80" cy="90" r="5" fill="#667eea"/>
            <circle cx="120" cy="90" r="5" fill="#667eea"/>
            <path d="M 75 120 Q 100 110, 125 120"
                  stroke="#667eea" strokeWidth="6" fill="none" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
