/**
 * Seed organizer wallet data for testing
 * This file provides helper functions to populate organizer wallets with test data
 */

import { getOrganizerWallet, addOrganizerEarnings, settlePendingBalance } from "./store";

/**
 * Seed a test organizer wallet with sample earnings
 */
export function seedOrganizerWallet(userId: string) {
  const wallet = getOrganizerWallet(userId);
  
  // Add some earnings
  addOrganizerEarnings(userId, 500, "Ticket sales - Tech Summit");
  addOrganizerEarnings(userId, 300, "Ticket sales - Music Festival");
  addOrganizerEarnings(userId, 150, "Merchandise sales");
  
  // Settle some of the pending balance to make it available for withdrawal
  settlePendingBalance(userId);
  
  // Add more recent earnings that are still pending
  addOrganizerEarnings(userId, 200, "Recent ticket sales");
  
  return wallet;
}
