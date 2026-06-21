# Guestly Caching Strategy

## API Response Caching

Located in `lib/cache.ts`:

- In-memory cache with TTL
- Stale-while-revalidate strategy
- Cache invalidation hooks

## Cache Configuration

### API Routes
```typescript
// Cache-Control header
'Cache-Control': 'public, max-age=300, stale-while-revalidate=60'
```

### Static Assets
```typescript
// _next/static files
'Cache-Control': 'public, max-age=31536000, immutable'
```

### Images
```typescript
// Next.js image optimization
minimumCacheTTL: 60 * 60 * 24 * 30 // 30 days
```

## Cache Invalidation

Cache is invalidated on:
- Event creation/update/deletion
- Order status changes
- User profile updates

See `lib/cache-invalidation.ts` for hook implementations.

## Best Practices

1. Cache GET requests, not POST/PUT/DELETE
2. Use short TTLs for frequently changing data
3. Invalidate related caches on mutations
4. Use ETags for conditional requests
