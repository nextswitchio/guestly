# Guestly Bundle Optimization

## Bundle Analysis

Run the bundle analyzer:

```bash
npm run build:analyze
```

## Current Bundle Splitting

| Chunk | Contents |
|-------|----------|
| `vendors` | Node_modules dependencies |
| `framer-motion` | Animation library |
| `leaflet` | Map library |
| `socketio` | WebSocket client |
| `react` | React and ReactDOM |
| `common` | Shared application code |

## Optimization Strategies

1. **Dynamic Imports**: Lazy load route components
2. **Tree Shaking**: Remove unused exports
3. **Code Splitting**: Split by route and feature
4. **Image Optimization**: Use WebP/AVIF formats
5. **Font Optimization**: Subset fonts, use `font-display: swap`

## Package Imports

Optimized packages in `next.config.ts`:
- `framer-motion`
- `leaflet`
- `react-leaflet`
- `socket.io-client`

## Size Targets

- Initial JS bundle: < 200KB
- Total page weight: < 2MB
- Largest contentful paint: < 2.5s
