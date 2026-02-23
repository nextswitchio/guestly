import type { Event } from "./events";
import { addEvent } from "./events";
import type { Product, MerchOrder, MerchOrderItem } from "@/types/merchandise";

export type TicketType = "General" | "VIP";

export type TicketAvailability = {
  eventId: string;
  tickets: Array<{ type: TicketType; price: number; available: number }>;
};

export type OrderItem = { type: TicketType; quantity: number; price: number };
export type Order = {
  id: string;
  eventId: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "paid";
  createdAt: number;
};

export type Wallet = {
  userId: string;
  balance: number;
};

export type Transaction = {
  id: string;
  userId: string;
  amount: number;
  type: "credit" | "debit";
  description: string;
  createdAt: number;
};

function id(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
}

const availability: Record<string, TicketAvailability> = {};
const orders: Record<string, Order> = {};
const wallets: Record<string, Wallet> = {};
const transactions: Transaction[] = [];
const savedEvents: Record<string, Set<string>> = {};
const savingsTargets: Record<string, { goal: number; progress: number }> = {};
type EventDraft = {
  type?: "Physical" | "Virtual" | "Hybrid";
  title?: string;
  description?: string;
  date?: string;
  category?: Event["category"];
  city?: Event["city"];
  image?: string;
  ticketSetup?: { generalPrice?: number; vipPrice?: number; generalQty?: number; vipQty?: number };
  virtual?: { url?: string };
  merch?: { enabled?: boolean };
  status?: "draft" | "published";
};
const eventDrafts: Record<string, EventDraft> = {};

export function seedEventTickets(event: Event) {
  if (availability[event.id]) return;
  availability[event.id] = {
    eventId: event.id,
    tickets: [
      { type: "General", price: 50, available: 200 },
      { type: "VIP", price: 120, available: 50 },
    ],
  };
}

export function getAvailability(eventId: string): TicketAvailability | null {
  return availability[eventId] || null;
}

export function ensureWallet(userId: string) {
  if (!wallets[userId]) wallets[userId] = { userId, balance: 0 };
  return wallets[userId];
}

export function addMoney(userId: string, amount: number, description = "Top up") {
  const w = ensureWallet(userId);
  w.balance += amount;
  transactions.push({
    id: id("txn"),
    userId,
    amount,
    type: "credit",
    description,
    createdAt: Date.now(),
  });
  return w.balance;
}

export function debitMoney(userId: string, amount: number, description = "Payment") {
  const w = ensureWallet(userId);
  w.balance -= amount;
  transactions.push({
    id: id("txn"),
    userId,
    amount,
    type: "debit",
    description,
    createdAt: Date.now(),
  });
  return w.balance;
}

export function listTransactions(userId: string) {
  return transactions.filter((t) => t.userId === userId).sort((a, b) => b.createdAt - a.createdAt);
}

export function createOrder(userId: string, eventId: string, items: Array<{ type: TicketType; quantity: number }>) {
  const avail = getAvailability(eventId);
  if (!avail) throw new Error("No availability");
  // Validate and reserve
  let total = 0;
  const orderItems: OrderItem[] = items.map((it) => {
    const slot = avail.tickets.find((t) => t.type === it.type);
    if (!slot) throw new Error("Invalid ticket type");
    if (slot.available < it.quantity) throw new Error("Insufficient availability");
    slot.available -= it.quantity; // reserve
    total += it.quantity * slot.price;
    return { type: slot.type, quantity: it.quantity, price: slot.price };
  });
  const orderId = id("ord");
  const order: Order = {
    id: orderId,
    eventId,
    userId,
    items: orderItems,
    total,
    status: "pending",
    createdAt: Date.now(),
  };
  orders[orderId] = order;
  return order;
}

export function getOrder(orderId: string) {
  return orders[orderId] || null;
}

export function markOrderPaid(orderId: string) {
  const order = orders[orderId];
  if (!order) throw new Error("Order not found");
  order.status = "paid";
  return order;
}

export function saveEvent(userId: string, eventId: string) {
  savedEvents[userId] = savedEvents[userId] || new Set();
  savedEvents[userId].add(eventId);
}

export function listSavedEvents(userId: string) {
  return Array.from(savedEvents[userId] || []);
}

export function setSavingsGoal(userId: string, goal: number) {
  savingsTargets[userId] = savingsTargets[userId] || { goal: 0, progress: 0 };
  savingsTargets[userId].goal = goal;
}

export function addSavings(userId: string, amount: number) {
  savingsTargets[userId] = savingsTargets[userId] || { goal: 0, progress: 0 };
  savingsTargets[userId].progress += amount;
}

export function getSavings(userId: string) {
  return savingsTargets[userId] || { goal: 0, progress: 0 };
}

export function getEventDraft(userId: string) {
  eventDrafts[userId] = eventDrafts[userId] || { status: "draft" };
  return eventDrafts[userId];
}

export function saveEventDraft(userId: string, patch: Partial<EventDraft>) {
  eventDrafts[userId] = { ...getEventDraft(userId), ...patch, status: "draft" };
  return eventDrafts[userId];
}

export function publishEventFromDraft(userId: string) {
  const draft = getEventDraft(userId);
  if (!draft.title || !draft.description || !draft.date || !draft.category || !draft.city || !draft.image) {
    throw new Error("Incomplete draft");
  }
  const created = addEvent({
    title: draft.title,
    description: draft.description,
    date: draft.date,
    category: draft.category,
    city: draft.city,
    image: draft.image,
  });
  eventDrafts[userId] = { status: "published" };
  return created;
}

export function createVendorProfile(userId: string, data: Omit<VendorProfile, "id" | "userId" | "status">) {
  const profileId = id("vnd");
  const profile: VendorProfile = {
    id: profileId,
    userId,
    ...data,
    status: "pending",
  };
  vendors[userId] = profile;
  return profile;
}

export function getVendorProfile(userId: string) {
  return vendors[userId] || null;
}

// ── Merchandise ──────────────────────────────────────────────────────────────

const products: Product[] = [
  { id: "prod-1", eventId: "evt-1", name: "Tech Summit Tee", description: "Premium cotton crew-neck t-shirt with the Tech Summit 2026 logo.", price: 25, image: "👕", category: "Apparel", stock: 120, sold: 84, sizes: ["S", "M", "L", "XL"], active: true },
  { id: "prod-2", eventId: "evt-1", name: "Developer Cap", description: "Embroidered snapback cap. One size fits all.", price: 15, image: "🧢", category: "Accessories", stock: 60, sold: 42, active: true },
  { id: "prod-3", eventId: "evt-1", name: "Conference Tote Bag", description: "Eco-friendly canvas tote with inner pocket.", price: 12, image: "👜", category: "Accessories", stock: 40, sold: 67, active: true },
  { id: "prod-4", eventId: "evt-1", name: "Event Poster", description: "A3 high-quality print of the official event artwork.", price: 8, image: "🖼️", category: "Prints", stock: 80, sold: 120, active: true },
  { id: "prod-5", eventId: "evt-2", name: "Music Fiesta Hoodie", description: "Heavyweight zip-up hoodie with back print.", price: 45, image: "🧥", category: "Apparel", stock: 50, sold: 28, sizes: ["S", "M", "L", "XL", "XXL"], active: true },
  { id: "prod-6", eventId: "evt-2", name: "Artist Pin Set", description: "Collectible enamel pin set featuring headlining artists.", price: 10, image: "📌", category: "Collectibles", stock: 200, sold: 95, active: true },
  { id: "prod-7", eventId: "evt-3", name: "Art Expo Catalogue", description: "Full-colour 80-page exhibition catalogue.", price: 20, image: "📖", category: "Prints", stock: 100, sold: 35, active: true },
  { id: "prod-8", eventId: "evt-4", name: "Carnival Apron", description: "Waterproof apron with fun food pattern.", price: 18, image: "🧑‍🍳", category: "Apparel", stock: 70, sold: 22, sizes: ["M", "L"], active: true },
];

const merchOrders: MerchOrder[] = [];

export function getProductsByEvent(eventId: string): Product[] {
  return products.filter((p) => p.eventId === eventId && p.active);
}

export function getProductById(productId: string): Product | null {
  return products.find((p) => p.id === productId) || null;
}

export function getAllProducts(): Product[] {
  return products.filter((p) => p.active);
}

export function createMerchOrder(
  userId: string,
  eventId: string,
  items: Array<{ productId: string; quantity: number; size?: string }>
): MerchOrder {
  let total = 0;
  const orderItems: MerchOrderItem[] = items.map((it) => {
    const product = products.find((p) => p.id === it.productId);
    if (!product) throw new Error(`Product ${it.productId} not found`);
    if (product.stock < it.quantity) throw new Error(`Insufficient stock for ${product.name}`);
    product.stock -= it.quantity;
    product.sold += it.quantity;
    total += it.quantity * product.price;
    return { productId: product.id, name: product.name, quantity: it.quantity, price: product.price, size: it.size };
  });

  const order: MerchOrder = {
    id: id("mord"),
    userId,
    eventId,
    items: orderItems,
    total,
    status: "pending",
    createdAt: Date.now(),
  };
  merchOrders.push(order);
  return order;
}

export function getMerchOrder(orderId: string): MerchOrder | null {
  return merchOrders.find((o) => o.id === orderId) || null;
}

export function markMerchOrderPaid(orderId: string): MerchOrder {
  const order = merchOrders.find((o) => o.id === orderId);
  if (!order) throw new Error("Merch order not found");
  order.status = "paid";
  return order;
}

export function getMerchStats() {
  const totalProducts = products.filter((p) => p.active).length;
  const unitsSold = products.reduce((s, p) => s + p.sold, 0);
  const revenue = products.reduce((s, p) => s + p.sold * p.price, 0);
  return { totalProducts, unitsSold, revenue };
}
