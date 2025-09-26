import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-12 py-6 bg-light dark:bg-dark border-t border-secondary/20 dark:border-primary/20 transition-colors duration-300">
      <div className="container mx-auto text-center">
        <p className="text-sm text-muted">
          App developed by Kumar. Powered by Gemini.
        </p>
      </div>
    </footer>
  );
};