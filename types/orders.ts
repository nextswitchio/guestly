// ── Order & Payment Types ────────────────────────────────────────────────────

export type TicketType = "General" | "VIP";

export type AttendanceType = "physical" | "virtual";

export type OrderStatus = "pending" | "paid" | "refunded";

export type OrderItem = {
  type: TicketType;
  quantity: number;
  price: number;
  attendanceType?: AttendanceType;
};

export type Order = {
  id: string;
  eventId: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: number;
};

export type PaymentMethod = "wallet" | "card" | "crypto" | "bank_transfer";

export type PaymentRequest = {
  orderId: string;
  method: PaymentMethod;
};

export type PaymentResponse = {
  ok: boolean;
  orderId?: string;
  paymentUrl?: string;
  error?: string;
};

export type RefundRequest = {
  orderId: string;
  reason: string;
};

export type RefundStatus = "pending" | "processing" | "completed" | "rejected";

export type Refund = {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  createdAt: number;
  processedAt?: number;
};

export type VirtualAccess = {
  id: string;
  eventId: string;
  userId: string;
  ticketOrderId: string;
  joinLink: string;
  expiresAt: number;
  createdAt: number;
};

export type CryptoBalance = {
  symbol: "USDT" | "BTC";
  amount: number;
};

export type Wallet = {
  userId: string;
  balance: number;
  promoBalance: number;
  cryptoBalances?: CryptoBalance[];
};

export type TransactionType = "credit" | "debit";

export type Transaction = {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  description: string;
  createdAt: number;
};

export type PromoCreditType =
  | "first_deposit_bonus"
  | "campaign"
  | "referral"
  | "event_promo";

export type PromoCredit = {
  id: string;
  userId: string;
  amount: number;
  type: PromoCreditType;
  description: string;
  expiresAt?: number;
  createdAt: number;
};
