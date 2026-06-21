/**
 * Cache Middleware for API Routes
 * 
 * Provides utilities for adding appropriate cache headers to API responses
 * and integrating with the caching system.
 */

import { NextResponse } from 'next/server';

export interface CacheHeaderOptions {
  maxAge?: number; // Cache-Control max-age in seconds
  sMaxAge?: number; // Cache-Control s-maxage in seconds (CDN cache)
  staleWhileRevalidate?: number; // stale-while-revalidate in seconds
  mustRevalidate?: boolean; // Add must-revalidate directive
  noCache?: boolean; // Add no-cache directive
  noStore?: boolean; // Add no-store directive
  private?: boolean; // Mark as private cache
  etag?: string; // ETag header value
  lastModified?: Date; // Last-Modified header
}

/**
 * Add cache headers to a NextResponse
 */
export function addCacheHeaders(
  response: NextResponse,
  options: CacheHeaderOptions = {}
): NextResponse {
  const {
    maxAge = 300, // 5 minutes default
    sMaxAge,
    staleWhileRevalidate = 60, // 1 minute default
    mustRevalidate = false,
    noCache = false,
    noStore = false,
    private: isPrivate = false,
    etag,
    lastModified,
  } = options;

  // Build Cache-Control header
  const cacheControlParts: string[] = [];

  if (noStore) {
    cacheControlParts.push('no-store');
  } else if (noCache) {
    cacheControlParts.push('no-cache');
  } else {
    if (isPrivate) {
      cacheControlParts.push('private');
    } else {
      cacheControlParts.push('public');
    }

    cacheControlParts.push(`max-age=${maxAge}`);

    if (sMaxAge !== undefined) {
      cacheControlParts.push(`s-maxage=${sMaxAge}`);
    }

    if (staleWhileRevalidate > 0) {
      cacheControlParts.push(`stale-while-revalidate=${staleWhileRevalidate}`);
    }

    if (mustRevalidate) {
      cacheControlParts.push('must-revalidate');
    }
  }

  response.headers.set('Cache-Control', cacheControlParts.join(', '));

  // Add ETag if provided
  if (etag) {
    response.headers.set('ETag', etag);
  }

  // Add Last-Modified if provided
  if (lastModified) {
    response.headers.set('Last-Modified', lastModified.toUTCString());
  }

  // Add Vary header for better caching
  response.headers.set('Vary', 'Accept, Authorization, Cookie');

  return response;
}

/**
 * Create a cached JSON response
 */
export function createCachedResponse(
  data: any,
  options: CacheHeaderOptions = {}
): NextResponse {
  const response = NextResponse.json(data);
  return addCacheHeaders(response, options);
}

/**
 * Create a response for frequently changing data (short cache)
 */
export function createShortCachedResponse(
  data: any,
  maxAge: number = 60 // 1 minute
): NextResponse {
  return createCachedResponse(data, {
    maxAge,
    staleWhileRevalidate: 30,
  });
}

/**
 * Create a response for moderately changing data (medium cache)
 */
export function createMediumCachedResponse(
  data: any,
  maxAge: number = 300 // 5 minutes
): NextResponse {
  return createCachedResponse(data, {
    maxAge,
    staleWhileRevalidate: 60,
  });
}

/**
 * Create a response for rarely changing data (long cache)
 */
export function createLongCachedResponse(
  data: any,
  maxAge: number = 3600 // 1 hour
): NextResponse {
  return createCachedResponse(data, {
    maxAge,
    sMaxAge: 7200, // 2 hours for CDN
    staleWhileRevalidate: 300, // 5 minutes
  });
}

/**
 * Create a response for private user data
 */
export function createPrivateCachedResponse(
  data: any,
  maxAge: number = 300 // 5 minutes
): NextResponse {
  return createCachedResponse(data, {
    maxAge,
    staleWhileRevalidate: 60,
    private: true,
  });
}

/**
 * Create a response that should not be cached
 */
export function createNoCacheResponse(data: any): NextResponse {
  return createCachedResponse(data, {
    noCache: true,
    mustRevalidate: true,
  });
}

/**
 * Create a response that should not be stored
 */
export function createNoStoreResponse(data: any): NextResponse {
  return createCachedResponse(data, {
    noStore: true,
  });
}

/**
 * Generate ETag from data
 */
export function generateETag(data: any): string {
  const content = typeof data === 'string' ? data : JSON.stringify(data);
  
  // Simple hash function for ETag generation
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return `"${Math.abs(hash).toString(36)}"`;
}

/**
 * Check if request has matching ETag
 */
export function hasMatchingETag(request: Request, etag: string): boolean {
  const ifNoneMatch = request.headers.get('If-None-Match');
  return ifNoneMatch === etag;
}

/**
 * Check if request has matching Last-Modified
 */
export function hasMatchingLastModified(request: Request, lastModified: Date): boolean {
  const ifModifiedSince = request.headers.get('If-Modified-Since');
  if (!ifModifiedSince) return false;
  
  const requestDate = new Date(ifModifiedSince);
  return requestDate >= lastModified;
}

/**
 * Create a 304 Not Modified response
 */
export function createNotModifiedResponse(): NextResponse {
  return new NextResponse(null, { status: 304 });
}

/**
 * Cache response factory with conditional requests support
 */
export function createConditionalResponse(
  request: Request,
  data: any,
  options: CacheHeaderOptions & {
    lastModified?: Date;
    generateETag?: boolean;
  } = {}
): NextResponse {
  const { generateETag: shouldGenerateETag = true, lastModified, ...cacheOptions } = options;
  
  // Generate ETag if requested
  let etag: string | undefined;
  if (shouldGenerateETag) {
    etag = generateETag(data);
  }
  
  // Check conditional requests
  if (etag && hasMatchingETag(request, etag)) {
    return createNotModifiedResponse();
  }
  
  if (lastModified && hasMatchingLastModified(request, lastModified)) {
    return createNotModifiedResponse();
  }
  
  // Create response with cache headers
  return createCachedResponse(data, {
    ...cacheOptions,
    etag,
    lastModified,
  });
}

/**
 * Predefined cache configurations for different data types
 */
export const CacheConfigs = {
  // Event listings - medium cache with stale-while-revalidate
  eventListings: {
    maxAge: 180, // 3 minutes
    staleWhileRevalidate: 60, // 1 minute
  },
  
  // Single event - longer cache as events don't change frequently
  singleEvent: {
    maxAge: 600, // 10 minutes
    staleWhileRevalidate: 120, // 2 minutes
  },
  
  // User profile - private cache with medium duration
  userProfile: {
    maxAge: 300, // 5 minutes
    staleWhileRevalidate: 60, // 1 minute
    private: true,
  },
  
  // Wallet data - short cache as it changes frequently
  walletData: {
    maxAge: 60, // 1 minute
    staleWhileRevalidate: 30, // 30 seconds
    private: true,
  },
  
  // Vendor listings - longer cache as vendors don't change often
  vendorListings: {
    maxAge: 900, // 15 minutes
    staleWhileRevalidate: 180, // 3 minutes
  },
  
  // City stats - medium cache with good stale-while-revalidate
  cityStats: {
    maxAge: 300, // 5 minutes
    staleWhileRevalidate: 120, // 2 minutes
  },
  
  // Analytics data - longer cache as it's computed data
  analytics: {
    maxAge: 1800, // 30 minutes
    staleWhileRevalidate: 300, // 5 minutes
    private: true,
  },
  
  // Static data - very long cache
  staticData: {
    maxAge: 86400, // 24 hours
    sMaxAge: 604800, // 1 week for CDN
    staleWhileRevalidate: 3600, // 1 hour
  },
  
  // Real-time data - no cache
  realTimeData: {
    noCache: true,
    mustRevalidate: true,
  },
  
  // Sensitive data - no store
  sensitiveData: {
    noStore: true,
  },
} as const;

export type CacheConfigKey = keyof typeof CacheConfigs;