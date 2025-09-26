import React from 'react';
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

interface HeaderProps {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    onShowSaved: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, onShowSaved }) => {
  return (
    <header className="bg-light/80 dark:bg-dark/80 backdrop-blur-sm shadow-md w-full sticky top-0 z-10 border-b border-secondary/20 dark:border-primary/20 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
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
        </div>
      </div>
    </header>
  );
};