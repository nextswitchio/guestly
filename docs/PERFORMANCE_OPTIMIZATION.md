# Guestly Performance Optimization

## Current Optimizations

### Next.js Config
- Bundle analysis with `@next/bundle-analyzer`
- Package import optimization for framer-motion, leaflet, socket.io-client
- Console removal in production
- Image optimization (WebP, AVIF)
- Webpack code splitting and chunk optimization

### Caching
- API response caching with stale-while-revalidate
- Static asset caching (30 days for images, immutable for _next/static)
- Cache invalidation hooks on data mutations

### Code Splitting
- Vendor chunk separation
- Framer-motion isolated chunk
- Leaflet isolated chunk
- Socket.IO isolated chunk
- React/ReactDOM isolated chunk

## Performance Scripts

```bash
npm run build:analyze    # Analyze bundle size
npm run build:size       # Bundle size report
npm run analyze          # Detailed bundle analysis
npm run lighthouse       # Lighthouse audit
npm run performance      # Performance optimization report
```

## Best Practices

1. Use `next/image` for all images
2. Lazy load heavy components (maps, charts)
3. Use React Suspense for data fetching
4. Minimize client components
5. Use `useMemo` and `useCallback` for expensive operations
6. Debounce search inputs
7. Virtualize long lists

## Lighthouse Targets

- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+
