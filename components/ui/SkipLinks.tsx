'use client';

import { useEffect, useState } from 'react';

/**
 * Skip links component for keyboard navigation accessibility
 * Provides quick navigation to main content areas
 */
export default function SkipLinks() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show skip links on Tab key press
      if (e.key === 'Tab') {
        setIsVisible(true);
      }
    };

    const handleClick = () => {
      // Hide skip links on mouse interaction
      setIsVisible(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const skipToMain = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const skipToNavigation = () => {
    const navigation = document.getElementById('main-navigation');
    if (navigation) {
      navigation.focus();
      navigation.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const skipToSearch = () => {
    const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
      searchInput.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 z-[9999] transition-transform duration-200 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
      role="navigation"
      aria-label="Skip links"
    >
      <div className="flex gap-2 p-2 bg-lime text-dark shadow-lg">
        <button
          onClick={skipToMain}
          className="px-4 py-2 bg-lime-hover hover:bg-lime-hover focus:bg-lime-hover rounded text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-lime focus:ring-offset-2 focus:ring-offset-lime"
          onFocus={() => setIsVisible(true)}
        >
          Skip to main content
        </button>
        
        <button
          onClick={skipToNavigation}
          className="px-4 py-2 bg-lime-hover hover:bg-lime-hover focus:bg-lime-hover rounded text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-lime focus:ring-offset-2 focus:ring-offset-lime"
          onFocus={() => setIsVisible(true)}
        >
          Skip to navigation
        </button>
        
        <button
          onClick={skipToSearch}
          className="px-4 py-2 bg-lime-hover hover:bg-lime-hover focus:bg-lime-hover rounded text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-lime focus:ring-offset-2 focus:ring-offset-lime"
          onFocus={() => setIsVisible(true)}
        >
          Skip to search
        </button>
      </div>
    </div>
  );
}