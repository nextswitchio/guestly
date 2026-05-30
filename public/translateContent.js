// Stub file to prevent 404 errors from browser extensions
// This file is not part of the project but prevents console errors
if (typeof window !== 'undefined' && window.jQuery) {
  // If jQuery exists, make sure it doesn't cause SVG path errors
  console.debug('translateContent.js stub loaded');
}