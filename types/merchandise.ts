// ── Merchandise types ────────────────────────────────────────────────────────

export type ProductCategory = "Apparel" | "Accessories" | "Prints" | "Collectibles";

export type FulfillmentType = "pickup" | "delivery" | "digital";

export interface Product {
  id: string;
  eventId: string;
  name: string;
  description: string;
  price: number;
  image: string; // emoji or URL
  category: ProductCategory;
  stock: number;
  sold: number;
  sizes?: string[]; // e.g. ["S","M","L","XL"]
  active: boolean;
  fulfillmentType: FulfillmentType;
  pickupInstructions?: string; // For pickup at event
  digitalDownloadUrl?: string; // For digital products
}

export interface ProductBundle {
  id: string;
  eventId: string;
  name: string;
  description: string;
  productIds: string[]; // Products included in bundle
  originalPrice: number; // Sum of individual product prices
  bundlePrice: number; // Discounted price
  discount: number; // Percentage discount
  active: boolean;
  createdAt: number;
}

export interface CartItem {
  productId: string;
  eventId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  bundleId?: string; // If this item is part of a bundle
  bundleDiscount?: number; // Discount applied from bundle
}

export interface MerchOrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  size?: string;
  fulfillmentType: FulfillmentType;
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface MerchOrder {
  id: string;
  userId: string;
  eventId: string;
  items: MerchOrderItem[];
  total: number;
  status: "pending" | "paid";
  shippingAddress?: ShippingAddress; // For delivery items
  createdAt: number;
}
