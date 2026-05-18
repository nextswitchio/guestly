/**
 * Get the correct image source path
 * Handles both public and assets folder images
 */
export const getImageSrc = (imageName: string): string => {
  // Check if it's an asset image (from src/assets originally)
  const assetImages = [
    'abuja.jpg',
    'accra.jpg',
    'action.jpg',
    'apple.svg',
    'circuit_board.svg',
    'devcon.jpg',
    'festival.jpg',
    'fiesta.jpg',
    'google.svg',
    'hero.png',
    'jazz.jpg',
    'lagos.jpg',
    'logo-dark.svg',
    'logo.svg',
    'marathon.jpg',
    'nairobi.jpg',
    'pay.jpg',
    'rb1.png',
    'rb2.png',
    'rb3.png',
    'rb4.png',
    'rb6.png',
    'react.svg',
    'rt1.png',
    'rt2.png',
    'rt3.png',
    'rt4.png',
    'rt5.png',
    'summit.jpg',
    'tool.jpg',
    'vite.svg',
  ];

  // If it's an asset image, return from assets folder
  if (assetImages.includes(imageName)) {
    return `/assets/${imageName}`;
  }

  // Otherwise, return from public folder
  return `/${imageName}`;
};
