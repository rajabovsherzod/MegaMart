// components/Toast.jsx
import { useEffect } from 'react';

const Toast = ({ 
  message, 
  bgColor = 'bg-red-500',
  duration = 2000,
  onClose 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed top-4 right-4 z-[9999]">
      <div className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg min-w-[280px] max-w-[320px] flex items-center justify-between transform transition-all duration-300 animate-slide-in`}>
        <div className="flex items-center">
          {/* Icon */}
          <div className="mr-3">
            {bgColor === 'bg-green-500' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          
          {/* Message */}
          <span className="text-sm font-medium">{message}</span>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="ml-3 text-white/70 hover:text-white focus:outline-none transition-colors duration-200"
          aria-label="Close notification"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 h-0.5 bg-white/30 animate-progress-bar w-full rounded-b-lg" />
      </div>
    </div>
  );
};

export default Toast;