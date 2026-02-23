// ── Merchandise types ────────────────────────────────────────────────────────

export type ProductCategory = "Apparel" | "Accessories" | "Prints" | "Collectibles";

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
}

export interface CartItem {
  productId: string;
  eventId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
}

export interface MerchOrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  size?: string;
}

export interface MerchOrder {
  id: string;
  userId: string;
  eventId: string;
  items: MerchOrderItem[];
  total: number;
  status: "pending" | "paid";
  createdAt: number;
}
