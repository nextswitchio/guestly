# Guestly Accessibility Guide

## WCAG AA Compliance

Guestly is designed to meet WCAG AA standards.

## Implementation

### Color Contrast
- All text meets 4.5:1 contrast ratio
- Interactive elements meet 3:1 contrast ratio
- Dark mode maintains contrast requirements

### Keyboard Navigation
- All interactive elements are focusable
- Focus order is logical and sequential
- Focus indicators are visible
- Skip navigation links provided

### Screen Readers
- Semantic HTML elements used throughout
- ARIA labels on interactive elements
- Alt text on images
- Live regions for dynamic content

### Motion
- Reduced motion preference respected
- `useReducedMotion` hook available
- Framer Motion respects `prefers-reduced-motion`

## Testing

```bash
npm run test
```

Automated accessibility testing with axe-core and Playwright.

## Components

All UI components include:
- Proper `role` attributes
- `aria-label` or `aria-labelledby`
- `aria-describedby` for complex widgets
- Keyboard event handlers
