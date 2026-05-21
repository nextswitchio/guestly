/**
 * UUID guard for API routes.
 *
 * The frontend in-memory store uses non-UUID IDs like "evt-1", "evt-2".
 * The backend only accepts valid UUIDs. This utility detects non-UUID IDs
 * so routes can fall back to store data instead of hitting the backend.
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUUID(id: string): boolean {
  return UUID_REGEX.test(id);
}

/** Returns true if the ID is a store ID (non-UUID like "evt-1") */
export function isStoreId(id: string): boolean {
  return !UUID_REGEX.test(id);
}
