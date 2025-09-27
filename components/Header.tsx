
import React, { useState, useRef, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';

const CookingIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Steam Lines */}
      <path d="M9 7C9 5.5 8 5.5 8 4" />
      <path d="M12 8C12 6.5 11 6.5 11 5" />
      <path d="M15 7C15 5.5 14 5.5 14 4" />

      {/* Chef's Hat */}
      <path d="M4 15c0-4.42 3.58-8 8-8s8 3.58 8 8" />
      <path d="M4 15v6h16v-6" />
    </svg>
  );

const BookmarkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
    </svg>
);

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

interface HeaderProps {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    onShowSaved: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, onShowSaved }) => {
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
    <header className="bg-light/80 dark:bg-dark/80 backdrop-blur-sm shadow-md w-full sticky top-0 z-10 border-b border-secondary/20 dark:border-primary/20 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between max-w-6xl">
        <div className="flex items-center">
            <CookingIcon className="w-8 h-8 text-primary dark:text-secondary mr-3" />
            <h1 className="font-script text-4xl text-dark dark:text-light">
            What2Cook
            </h1>
        </div>
        <div className="flex items-center gap-2">
            <button
              onClick={onShowSaved}
              className="flex items-center gap-2 p-2 rounded-md text-primary dark:text-secondary/80 hover:bg-secondary/20 dark:hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-dark transition-colors duration-200 font-medium"
              aria-label="View saved recipes"
            >
              <BookmarkIcon className="w-5 h-5" />
              <span className="hidden sm:inline">My Recipes</span>
            </button>
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <div className="relative">
                <button
                onMouseEnter={showTooltip}
                onMouseLeave={hideTooltip}
                onClick={handleClick}
                onFocus={showTooltip}
                onBlur={hideTooltip}
                className="p-2 rounded-full text-primary dark:text-secondary/80 hover:bg-secondary/20 dark:hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-dark transition-colors duration-200"
                aria-label="Show developer credit"
                >
                    <HumanIcon className="w-6 h-6" />
                </button>
                <div
                    className={`absolute top-full right-0 mt-2 w-max px-4 py-2 bg-light dark:bg-dark text-dark dark:text-light border border-secondary/20 dark:border-primary/20 rounded-lg shadow-lg transition-all duration-300 ease-in-out pointer-events-none transform ${isTooltipVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 invisible'}`}
                    role="tooltip"
                >
                    <span className="font-script text-lg">App designed by Kumar</span>
                </div>
            </div>
        </div>
      </div>
    </header>
  );
};
