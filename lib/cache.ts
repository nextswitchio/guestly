/**
 * API Response Caching System
 * 
 * Implements stale-while-revalidate caching strategy for API responses.
 * Caches event listings, user profile data, and other frequently accessed data.
 * 
 * Features:
 * - Stale-while-revalidate strategy
 * - Automatic cache invalidation on mutations
 * - TTL-based expiration
 * - Memory-efficient storage
 * - Cache statistics and monitoring
 */

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
  staleTime: number; // Time after which data is considered stale
  key: string;
  tags: string[]; // For cache invalidation by tags
}

export interface CacheOptions {
  ttl?: number; // Default: 5 minutes
  staleTime?: number; // Default: 1 minute
  tags?: string[]; // For invalidation
}

export interface CacheStats {
  hits: number;
  misses: number;
  staleHits: number;
  evictions: number;
  size: number;
  hitRate: number;
}

class APICache {
  private cache = new Map<string, CacheEntry>();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    staleHits: 0,
    evictions: 0,
    size: 0,
    hitRate: 0,
  };
  
  // Default cache settings
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly DEFAULT_STALE_TIME = 1 * 60 * 1000; // 1 minute
  private readonly MAX_CACHE_SIZE = 1000; // Maximum number of entries
  
  /**
   * Get data from cache with stale-while-revalidate logic
   */
  async get<T>(
    key: string,
    fetcher: () => Promise<T> | T,
    options: CacheOptions = {}
  ): Promise<T> {
    const now = Date.now();
    const entry = this.cache.get(key);
    
    const ttl = options.ttl || this.DEFAULT_TTL;
    const staleTime = options.staleTime || this.DEFAULT_STALE_TIME;
    
    // Cache miss - fetch and cache
    if (!entry) {
      this.stats.misses++;
      const data = await fetcher();
      this.set(key, data, options);
      return data;
    }
    
    // Check if data is expired (beyond TTL)
    if (now - entry.timestamp > entry.ttl) {
      this.stats.misses++;
      this.cache.delete(key);
      this.stats.size--;
      const data = await fetcher();
      this.set(key, data, options);
      return data;
    }
    
    // Check if data is stale but not expired
    if (now - entry.timestamp > entry.staleTime) {
      this.stats.staleHits++;
      
      // Return stale data immediately, but revalidate in background
      this.revalidateInBackground(key, fetcher, options);
      return entry.data;
    }
    
    // Fresh cache hit
    this.stats.hits++;
    return entry.data;
  }
  
  /**
   * Set data in cache
   */
  set<T>(key: string, data: T, options: CacheOptions = {}): void {
    const now = Date.now();
    const ttl = options.ttl || this.DEFAULT_TTL;
    const staleTime = options.staleTime || this.DEFAULT_STALE_TIME;
    
    // Evict oldest entries if cache is full
    if (this.cache.size >= this.MAX_CACHE_SIZE && !this.cache.has(key)) {
      this.evictOldest();
    }
    
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      ttl,
      staleTime,
      key,
      tags: options.tags || [],
    };
    
    const wasNew = !this.cache.has(key);
    this.cache.set(key, entry);
    
    if (wasNew) {
      this.stats.size++;
    }
    
    this.updateHitRate();
  }
  
  /**
   * Invalidate cache entries by key
   */
  invalidate(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.stats.size--;
      this.stats.evictions++;
    }
    return deleted;
  }
  
  /**
   * Invalidate cache entries by tag
   */
  invalidateByTag(tag: string): number {
    let count = 0;
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags.includes(tag)) {
        this.cache.delete(key);
        count++;
        this.stats.size--;
        this.stats.evictions++;
      }
    }
    this.updateHitRate();
    return count;
  }
  
  /**
   * Invalidate cache entries by multiple tags
   */
  invalidateByTags(tags: string[]): number {
    let count = 0;
    for (const tag of tags) {
      count += this.invalidateByTag(tag);
    }
    return count;
  }
  
  /**
   * Clear all cache entries
   */
  clear(): void {
    const size = this.cache.size;
    this.cache.clear();
    this.stats.size = 0;
    this.stats.evictions += size;
    this.updateHitRate();
  }
  
  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }
  
  /**
   * Get all cache keys
   */
  getKeys(): string[] {
    return Array.from(this.cache.keys());
  }
  
  /**
   * Check if key exists in cache
   */
  has(key: string): boolean {
    return this.cache.has(key);
  }
  
  /**
   * Get cache entry info without accessing data
   */
  getEntryInfo(key: string): Omit<CacheEntry, 'data'> | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    const { data, ...info } = entry;
    return info;
  }
  
  /**
   * Cleanup expired entries
   */
  cleanup(): number {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        cleaned++;
        this.stats.size--;
        this.stats.evictions++;
      }
    }
    
    this.updateHitRate();
    return cleaned;
  }
  
  /**
   * Revalidate data in background (fire and forget)
   */
  private async revalidateInBackground<T>(
    key: string,
    fetcher: () => Promise<T> | T,
    options: CacheOptions
  ): Promise<void> {
    try {
      const data = await fetcher();
      this.set(key, data, options);
    } catch (error) {
      // Silently fail background revalidation
      console.warn(`Background revalidation failed for key: ${key}`, error);
    }
  }
  
  /**
   * Evict oldest cache entry
   */
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTimestamp = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.stats.size--;
      this.stats.evictions++;
    }
  }
  
  /**
   * Update hit rate calculation
   */
  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses + this.stats.staleHits;
    this.stats.hitRate = total > 0 ? (this.stats.hits + this.stats.staleHits) / total : 0;
  }
}

// Global cache instance
export const apiCache = new APICache();

// Cache key generators
export const CacheKeys = {
  // Event listings
  events: (filters?: Record<string, any>) => {
    const params = filters ? new URLSearchParams(filters).toString() : '';
    return `events:${params}`;
  },
  
  // Single event
  event: (eventId: string) => `event:${eventId}`,
  
  // User profile
  userProfile: (userId: string) => `user-profile:${userId}`,
  
  // User orders
  userOrders: (userId: string) => `user-orders:${userId}`,
  
  // Event orders
  eventOrders: (eventId: string) => `event-orders:${eventId}`,
  
  // Wallet data
  wallet: (userId: string) => `wallet:${userId}`,
  
  // Transactions
  transactions: (userId: string) => `transactions:${userId}`,
  
  // Vendor profiles
  vendors: (filters?: Record<string, any>) => {
    const params = filters ? new URLSearchParams(filters).toString() : '';
    return `vendors:${params}`;
  },
  
  // City stats
  cityStats: (city: string) => `city-stats:${city}`,
  
  // Analytics
  analytics: (eventId: string, type: string) => `analytics:${eventId}:${type}`,
};

// Cache tags for invalidation
export const CacheTags = {
  // Event-related tags
  EVENTS: 'events',
  EVENT: (eventId: string) => `event:${eventId}`,
  USER_EVENTS: (userId: string) => `user-events:${userId}`,
  CITY_EVENTS: (city: string) => `city-events:${city}`,
  
  // User-related tags
  USERS: 'users',
  USER: (userId: string) => `user:${userId}`,
  USER_PROFILE: (userId: string) => `user-profile:${userId}`,
  
  // Order-related tags
  ORDERS: 'orders',
  USER_ORDERS: (userId: string) => `user-orders:${userId}`,
  EVENT_ORDERS: (eventId: string) => `event-orders:${eventId}`,
  
  // Wallet-related tags
  WALLETS: 'wallets',
  WALLET: (userId: string) => `wallet:${userId}`,
  
  // Vendor-related tags
  VENDORS: 'vendors',
  VENDOR: (vendorId: string) => `vendor:${vendorId}`,
  
  // City-related tags
  CITIES: 'cities',
  CITY: (city: string) => `city:${city}`,
};

// Helper functions for common caching patterns
export const CacheHelpers = {
  /**
   * Cache event listings with automatic invalidation tags
   */
  async cacheEventListings<T>(
    filters: Record<string, any>,
    fetcher: () => Promise<T> | T,
    options: CacheOptions = {}
  ): Promise<T> {
    const key = CacheKeys.events(filters);
    const tags = [CacheTags.EVENTS];
    
    // Add city-specific tag if filtering by city
    if (filters.city) {
      tags.push(CacheTags.CITY_EVENTS(filters.city));
    }
    
    return apiCache.get(key, fetcher, {
      ttl: 3 * 60 * 1000, // 3 minutes for event listings
      staleTime: 30 * 1000, // 30 seconds stale time
      tags,
      ...options,
    });
  },
  
  /**
   * Cache user profile data
   */
  async cacheUserProfile<T>(
    userId: string,
    fetcher: () => Promise<T> | T,
    options: CacheOptions = {}
  ): Promise<T> {
    const key = CacheKeys.userProfile(userId);
    const tags = [CacheTags.USER_PROFILE(userId), CacheTags.USERS];
    
    return apiCache.get(key, fetcher, {
      ttl: 10 * 60 * 1000, // 10 minutes for user profiles
      staleTime: 2 * 60 * 1000, // 2 minutes stale time
      tags,
      ...options,
    });
  },
  
  /**
   * Cache wallet data
   */
  async cacheWalletData<T>(
    userId: string,
    fetcher: () => Promise<T> | T,
    options: CacheOptions = {}
  ): Promise<T> {
    const key = CacheKeys.wallet(userId);
    const tags = [CacheTags.WALLET(userId), CacheTags.WALLETS];
    
    return apiCache.get(key, fetcher, {
      ttl: 2 * 60 * 1000, // 2 minutes for wallet data
      staleTime: 30 * 1000, // 30 seconds stale time
      tags,
      ...options,
    });
  },
  
  /**
   * Invalidate caches after event mutations
   */
  invalidateEventCaches(eventId: string, city?: string): void {
    const tags = [
      CacheTags.EVENTS,
      CacheTags.EVENT(eventId),
    ];
    
    if (city) {
      tags.push(CacheTags.CITY_EVENTS(city));
      tags.push(CacheTags.CITY(city));
    }
    
    apiCache.invalidateByTags(tags);
  },
  
  /**
   * Invalidate caches after user mutations
   */
  invalidateUserCaches(userId: string): void {
    const tags = [
      CacheTags.USER(userId),
      CacheTags.USER_PROFILE(userId),
      CacheTags.USER_ORDERS(userId),
      CacheTags.WALLET(userId),
    ];
    
    apiCache.invalidateByTags(tags);
  },
  
  /**
   * Invalidate caches after order mutations
   */
  invalidateOrderCaches(userId: string, eventId: string): void {
    const tags = [
      CacheTags.USER_ORDERS(userId),
      CacheTags.EVENT_ORDERS(eventId),
      CacheTags.WALLET(userId),
    ];
    
    apiCache.invalidateByTags(tags);
  },
};

// Automatic cleanup interval (runs every 5 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const cleaned = apiCache.cleanup();
    if (cleaned > 0) {
      console.log(`Cache cleanup: removed ${cleaned} expired entries`);
    }
  }, 5 * 60 * 1000);
}

export default apiCache;