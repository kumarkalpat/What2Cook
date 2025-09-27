import React, { useState, useRef, useEffect } from 'react';

// A simple human/user icon
const HumanIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

export const Footer: React.FC = () => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsTooltipVisible(true);
  };

  const hideTooltip = () => {
    setIsTooltipVisible(false);
  };
  
  const handleClick = () => {
    // This allows toggling on mobile
    if (isTooltipVisible) {
      hideTooltip();
      return;
    }
    
    showTooltip();
    timeoutRef.current = window.setTimeout(() => {
      hideTooltip();
    }, 2500); // Hide after 2.5 seconds
  };
  
  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <footer className="fixed bottom-4 right-4 z-20">
      <div className="relative">
        <div
          className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-4 py-2 bg-dark/80 dark:bg-light/90 text-light dark:text-dark rounded-lg shadow-lg transition-all duration-300 ease-in-out pointer-events-none transform ${isTooltipVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 invisible'}`}
          role="tooltip"
        >
          <span className="font-script text-lg">App designed by Kumar</span>
        </div>
        <button
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
          onClick={handleClick}
          onFocus={showTooltip}
          onBlur={hideTooltip}
          className="p-3 rounded-full bg-secondary/20 hover:bg-secondary/40 text-dark/80 dark:bg-primary/20 dark:hover:bg-primary/40 dark:text-light/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-dark transition-colors duration-200"
          aria-label="Show developer credit"
        >
          <HumanIcon className="w-6 h-6" />
        </button>
      </div>
    </footer>
  );
};