// ── Wallet & Savings Types ───────────────────────────────────────────────────

export type CryptoSymbol = "USDT" | "BTC";

export type CryptoBalance = {
  symbol: CryptoSymbol;
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

export type SavingsTarget = {
  id: string;
  userId: string;
  eventId?: string;
  goalAmount: number;
  currentAmount: number;
  targetDate?: string;
  recurringAmount?: number;
  recurringFrequency?: "weekly" | "biweekly" | "monthly";
  nextContribution?: number;
  autoApply?: boolean;
  createdAt: number;
  updatedAt: number;
};

export type ReminderType = "milestone" | "deadline" | "suggestion";

export type Reminder = {
  id: string;
  userId: string;
  savingsTargetId: string;
  type: ReminderType;
  message: string;
  scheduledDate: number;
  sent: boolean;
  createdAt: number;
};

export type GroupType = "friends" | "family" | "corporate";

export type GroupPermissions = {
  allowMemberInvites: boolean;
  requireApproval: boolean;
  allowTargetChanges: boolean;
  allowMemberRemoval: boolean;
};

export type GroupWalletMember = {
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  joinedAt: number;
  status?: "active" | "pending" | "removed";
};

export type GroupWalletStatus = "active" | "completed" | "cancelled";

export type GroupWallet = {
  id: string;
  name: string;
  eventId?: string;
  createdBy: string;
  groupType: GroupType;
  adminUserIds: string[];
  permissions: GroupPermissions;
  members: GroupWalletMember[];
  totalGoal: number;
  currentTotal: number;
  status: GroupWalletStatus;
  createdAt: number;
  updatedAt: number;
};

export type GroupContribution = {
  id: string;
  groupWalletId: string;
  userId: string;
  userName: string;
  amount: number;
  timestamp: number;
  note?: string;
};

export type GroupNotificationType =
  | "contribution"
  | "reminder"
  | "milestone"
  | "goal_reached";

export type GroupNotification = {
  id: string;
  groupWalletId: string;
  userId: string;
  type: GroupNotificationType;
  message: string;
  metadata?: {
    contributorName?: string;
    amount?: number;
    progress?: number;
    milestone?: number;
  };
  read: boolean;
  createdAt: number;
};

export type CryptoDepositStatus = "pending" | "confirmed" | "expired";

export type CryptoDeposit = {
  id: string;
  userId: string;
  symbol: CryptoSymbol;
  amount: number;
  address: string;
  txHash?: string;
  status: CryptoDepositStatus;
  createdAt: number;
  confirmedAt?: number;
};

export type WithdrawalStatus = "pending" | "processing" | "completed" | "rejected";

export type WithdrawalRequest = {
  id: string;
  userId: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  status: WithdrawalStatus;
  createdAt: number;
  processedAt?: number;
};
