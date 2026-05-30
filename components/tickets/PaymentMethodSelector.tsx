"use client";
import React from "react";
import { useCurrency } from "@/lib/currency";

type Method = "wallet" | "paystack" | "mobile_money";

type MobileMoneyProvider = "mpesa" | "mtn" | "airtel";

export default function PaymentMethodSelector({
  value,
  onChange,
  orderTotal,
  savingsApplied = 0,
  onFundWallet,
}: {
  value: Method;
  onChange: (m: Method) => void;
  orderTotal?: number;
  savingsApplied?: number;
  onFundWallet?: () => void;
}) {
  const [walletBalance, setWalletBalance] = React.useState<number | null>(null);
  const [promoBalance, setPromoBalance] = React.useState<number>(0);
  const [loadingBalance, setLoadingBalance] = React.useState(true);
  const [mobileProvider, setMobileProvider] = React.useState<MobileMoneyProvider>("mpesa");
  const [phoneNumber, setPhoneNumber] = React.useState("");

  const { formatAmount } = useCurrency();

  React.useEffect(() => {
    async function fetchBalance() {
      try {
        const res = await fetch("/api/wallet/balance");
        const data = await res.json();
        if (data.ok) {
          setWalletBalance(data.balance);
          setPromoBalance(data.promoBalance || 0);
        }
      } catch (error) {
        console.error("Failed to fetch wallet balance:", error);
      } finally {
        setLoadingBalance(false);
      }
    }
    fetchBalance();
  }, []);

  const totalAvailable = (walletBalance || 0) + promoBalance;
  const finalOrderTotal = orderTotal !== undefined ? Math.max(0, orderTotal - savingsApplied) : undefined;
  const hasSufficientBalance = walletBalance !== null && finalOrderTotal !== undefined && totalAvailable >= finalOrderTotal;
  const balanceShortfall = walletBalance !== null && finalOrderTotal !== undefined && totalAvailable < finalOrderTotal
    ? finalOrderTotal - totalAvailable
    : 0;

  const mobileProviders: { value: MobileMoneyProvider; label: string; countries: string }[] = [
    { value: "mpesa", label: "M-Pesa", countries: "Kenya, Tanzania, Ghana" },
    { value: "mtn", label: "MTN Mobile Money", countries: "Nigeria, Ghana, Uganda" },
    { value: "airtel", label: "Airtel Money", countries: "Nigeria, Kenya, Uganda" },
  ];

  return (
    <div className="space-y-4">
      {!loadingBalance && promoBalance > 0 && (
        <div className="rounded-xl bg-lime/10 border border-lime/20 p-4 flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-lime text-dark">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-dark">Promo credits available!</p>
            <p className="text-xs text-neutral-600 mt-0.5">
              {formatAmount(promoBalance)} in promo credits will be automatically applied
            </p>
          </div>
        </div>
      )}

      {/* Quick wallet prompt */}
      {!loadingBalance && hasSufficientBalance && value !== "wallet" && (
        <div className="rounded-xl bg-dark p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-lime text-dark">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Pay instantly with your wallet</p>
              <p className="text-xs text-white/60">No redirects • Instant confirmation</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange("wallet")}
            className="shrink-0 px-4 py-2 bg-lime hover:bg-lime-hover text-dark text-sm font-semibold rounded-lg transition-colors"
          >
            Use Wallet
          </button>
        </div>
      )}

      {/* Insufficient balance banner */}
      {!loadingBalance && !hasSufficientBalance && finalOrderTotal !== undefined && walletBalance !== null && (
        <div className="rounded-xl bg-warning-50 border border-warning-200 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-warning-900">Low wallet balance</p>
              <p className="text-xs text-warning-700 mt-0.5">
                You need {formatAmount(balanceShortfall)} more. Fund your wallet or use another method.
              </p>
            </div>
            <button
              type="button"
              onClick={onFundWallet}
              className="shrink-0 px-4 py-2 bg-warning-600 hover:bg-warning-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Fund Wallet
            </button>
          </div>
        </div>
      )}

      {/* Payment methods */}
      <div className="flex flex-col gap-3">
        {/* Wallet */}
        <PaymentOption
          value="wallet"
          current={value}
          onChange={onChange}
          label="Guestly Wallet"
          description={
            loadingBalance
              ? "Loading balance..."
              : walletBalance !== null
                ? `Balance: ${formatAmount(walletBalance)}${!hasSufficientBalance && finalOrderTotal ? ` • Need ${formatAmount(balanceShortfall)} more` : ""}`
                : "Pay from your wallet balance"
          }
          badge={hasSufficientBalance ? "Fastest" : undefined}
          disabled={!loadingBalance && !hasSufficientBalance && finalOrderTotal !== undefined}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1 0-6h.75A2.25 2.25 0 0 1 18 6v0a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 6v0a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 6v12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18V6" />
            </svg>
          }
        />

        {/* Paystack Card */}
        <PaymentOption
          value="paystack"
          current={value}
          onChange={onChange}
          label="Debit / Credit Card"
          description="Visa, Mastercard, Verve via Paystack"
          badge="Secure"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M2 10h20" />
            </svg>
          }
        />

        {/* Mobile Money */}
        <PaymentOption
          value="mobile_money"
          current={value}
          onChange={onChange}
          label="Mobile Money"
          description="M-Pesa, MTN, Airtel Money"
          badge="Paystack"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          }
        />
      </div>

      {/* Mobile Money form */}
      {value === "mobile_money" && (
        <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-4 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Mobile Money Details</p>
          <div>
            <label className="text-xs font-medium text-neutral-600 mb-1.5 block">Provider</label>
            <div className="grid grid-cols-3 gap-2">
              {mobileProviders.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setMobileProvider(p.value)}
                  className={`rounded-lg border-2 px-3 py-2.5 text-left transition-all ${
                    mobileProvider === p.value
                      ? "border-dark bg-dark text-white"
                      : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                  }`}
                >
                  <p className="text-sm font-semibold">{p.label}</p>
                  <p className="text-[10px] opacity-70 mt-0.5">{p.countries}</p>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-600 mb-1.5 block">Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g. 254712345678"
              className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 focus:border-dark focus:ring-1 focus:ring-dark outline-none transition-all"
            />
            <p className="text-[10px] text-neutral-400 mt-1">Include country code (e.g. 254 for Kenya)</p>
          </div>
        </div>
      )}
    </div>
  );
}

function PaymentOption({
  value,
  current,
  onChange,
  label,
  description,
  badge,
  disabled,
  icon,
}: {
  value: Method;
  current: Method;
  onChange: (m: Method) => void;
  label: string;
  description: string;
  badge?: string;
  disabled?: boolean;
  icon: React.ReactNode;
}) {
  const active = current === value;
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      disabled={disabled}
      className={`flex items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all duration-200 min-h-[72px] relative ${
        disabled
          ? "border-neutral-200 bg-neutral-50 opacity-60 cursor-not-allowed"
          : active
            ? "border-lime bg-lime/5 shadow-sm ring-1 ring-lime/30"
            : "border-neutral-200 bg-white hover:border-neutral-300 active:scale-[0.98]"
      }`}
      aria-pressed={active}
    >
      {badge && !disabled && (
        <div className={`absolute -top-2.5 left-4 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full shadow-sm ${
          active ? "bg-lime text-dark" : "bg-dark text-white"
        }`}>
          {badge}
        </div>
      )}
      {disabled && (
        <div className="absolute -top-2.5 left-4 px-2.5 py-0.5 bg-warning-500 text-white text-[10px] font-bold uppercase tracking-wide rounded-full shadow-sm">
          Low Balance
        </div>
      )}
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${
        disabled
          ? "bg-neutral-200 text-neutral-400"
          : active
            ? "bg-lime text-dark"
            : "bg-neutral-100 text-neutral-600"
      }`}>
        {icon}
      </div>
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${
            disabled ? "text-neutral-500" : active ? "text-lime" : "text-neutral-900"
          }`}>
            {label}
          </span>
        </div>
        <span className={`text-xs ${disabled ? "text-neutral-400" : "text-neutral-500"}`}>
          {description}
        </span>
      </div>
      <div className="ml-auto pl-2">
        <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${
          disabled
            ? "border-neutral-300"
            : active
              ? "border-lime bg-lime"
              : "border-neutral-300"
        }`}>
          {active && !disabled && (
            <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}
