/**
 * Cache Invalidation Utilities
 * 
 * Provides functions to invalidate caches when data is mutated.
 * This module should be imported by store functions that modify data.
 */

import { CacheHelpers, CacheTags, apiCache } from './cache';

/**
 * Invalidate event-related caches
 */
export function invalidateEventCaches(eventId: string, city?: string): void {
  const tags = [
    CacheTags.EVENTS,
    CacheTags.EVENT(eventId),
  ];
  
  if (city) {
    tags.push(CacheTags.CITY_EVENTS(city));
    tags.push(CacheTags.CITY(city));
  }
  
  apiCache.invalidateByTags(tags);
}

/**
 * Invalidate user-related caches
 */
export function invalidateUserCaches(userId: string): void {
  const tags = [
    CacheTags.USER(userId),
    CacheTags.USER_PROFILE(userId),
    CacheTags.USER_ORDERS(userId),
    CacheTags.WALLET(userId),
  ];
  
  apiCache.invalidateByTags(tags);
}

/**
 * Invalidate order-related caches
 */
export function invalidateOrderCaches(userId: string, eventId: string): void {
  const tags = [
    CacheTags.USER_ORDERS(userId),
    CacheTags.EVENT_ORDERS(eventId),
    CacheTags.WALLET(userId),
  ];
  
  apiCache.invalidateByTags(tags);
}

/**
 * Invalidate wallet-related caches
 */
export function invalidateWalletCaches(userId: string): void {
  const tags = [
    CacheTags.WALLET(userId),
    CacheTags.USER(userId),
  ];
  
  apiCache.invalidateByTags(tags);
}

/**
 * Invalidate vendor-related caches
 */
export function invalidateVendorCaches(vendorId?: string): void {
  const tags = [CacheTags.VENDORS];
  
  if (vendorId) {
    tags.push(CacheTags.VENDOR(vendorId));
  }
  
  apiCache.invalidateByTags(tags);
}

/**
 * Invalidate city-related caches
 */
export function invalidateCityCaches(city: string): void {
  const tags = [
    CacheTags.CITY(city),
    CacheTags.CITY_EVENTS(city),
  ];
  
  apiCache.invalidateByTags(tags);
}

/**
 * Invalidate all caches (use sparingly)
 */
export function invalidateAllCaches(): void {
  apiCache.clear();
}

/**
 * Cache invalidation hooks for common operations
 */
export const CacheInvalidationHooks = {
  /**
   * Called when an event is created or updated
   */
  onEventMutation: (eventId: string, city?: string) => {
    invalidateEventCaches(eventId, city);
  },
  
  /**
   * Called when a user profile is updated
   */
  onUserProfileMutation: (userId: string) => {
    invalidateUserCaches(userId);
  },
  
  /**
   * Called when an order is created, updated, or paid
   */
  onOrderMutation: (userId: string, eventId: string) => {
    invalidateOrderCaches(userId, eventId);
    // Also invalidate event caches as ticket availability changes
    invalidateEventCaches(eventId);
  },
  
  /**
   * Called when wallet balance changes
   */
  onWalletMutation: (userId: string) => {
    invalidateWalletCaches(userId);
  },
  
  /**
   * Called when vendor data changes
   */
  onVendorMutation: (vendorId?: string) => {
    invalidateVendorCaches(vendorId);
  },
  
  /**
   * Called when city-related data changes
   */
  onCityMutation: (city: string) => {
    invalidateCityCaches(city);
  },
  
  /**
   * Called when merchandise is purchased (affects event and user caches)
   */
  onMerchOrderMutation: (userId: string, eventId: string) => {
    invalidateOrderCaches(userId, eventId);
    invalidateEventCaches(eventId);
  },
  
  /**
   * Called when savings targets are modified
   */
  onSavingsMutation: (userId: string) => {
    invalidateWalletCaches(userId);
  },
  
  /**
   * Called when group wallet data changes
   */
  onGroupWalletMutation: (memberUserIds: string[]) => {
    memberUserIds.forEach(userId => {
      invalidateWalletCaches(userId);
    });
  },
  
  /**
   * Called when virtual event data changes (polls, Q&A, etc.)
   */
  onVirtualEventMutation: (eventId: string) => {
    invalidateEventCaches(eventId);
  },
  
  /**
   * Called when discussion/community data changes
   */
  onCommunityMutation: (eventId: string) => {
    invalidateEventCaches(eventId);
  },
};

/**
 * Batch cache invalidation for multiple operations
 */
export class CacheInvalidationBatch {
  private tags = new Set<string>();
  
  addEventInvalidation(eventId: string, city?: string): this {
    this.tags.add(CacheTags.EVENTS);
    this.tags.add(CacheTags.EVENT(eventId));
    
    if (city) {
      this.tags.add(CacheTags.CITY_EVENTS(city));
      this.tags.add(CacheTags.CITY(city));
    }
    
    return this;
  }
  
  addUserInvalidation(userId: string): this {
    this.tags.add(CacheTags.USER(userId));
    this.tags.add(CacheTags.USER_PROFILE(userId));
    this.tags.add(CacheTags.USER_ORDERS(userId));
    this.tags.add(CacheTags.WALLET(userId));
    
    return this;
  }
  
  addVendorInvalidation(vendorId?: string): this {
    this.tags.add(CacheTags.VENDORS);
    
    if (vendorId) {
      this.tags.add(CacheTags.VENDOR(vendorId));
    }
    
    return this;
  }
  
  addCityInvalidation(city: string): this {
    this.tags.add(CacheTags.CITY(city));
    this.tags.add(CacheTags.CITY_EVENTS(city));
    
    return this;
  }
  
  /**
   * Execute all invalidations in the batch
   */
  execute(): number {
    const tagsArray = Array.from(this.tags);
    const count = apiCache.invalidateByTags(tagsArray);
    this.tags.clear();
    return count;
  }
}

/**
 * Create a new cache invalidation batch
 */
export function createInvalidationBatch(): CacheInvalidationBatch {
  return new CacheInvalidationBatch();
}

/**
 * Utility to wrap store functions with automatic cache invalidation
 */
export function withCacheInvalidation<T extends (...args: any[]) => any>(
  fn: T,
  invalidationFn: (...args: Parameters<T>) => void
): T {
  return ((...args: Parameters<T>) => {
    const result = fn(...args);
    try {
      invalidationFn(...args);
    } catch (error) {
      console.warn('Cache invalidation failed:', error);
    }
    return result;
  }) as T;
}