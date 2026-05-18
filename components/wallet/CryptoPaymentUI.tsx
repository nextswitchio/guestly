"use client";
import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

type CryptoType = "usdt_trc20" | "usdt_erc20" | "bitcoin";

interface CryptoOption {
  id: CryptoType;
  name: string;
  network: string;
  address: string;
  icon: string;
  color: string;
}

const cryptoOptions: CryptoOption[] = [
  {
    id: "usdt_trc20",
    name: "USDT",
    network: "TRC20 (Tron)",
    address: "TXYZabcdefghijklmnopqrstuvwxyz123456",
    icon: "₮",
    color: "bg-success-500",
  },
  {
    id: "usdt_erc20",
    name: "USDT",
    network: "ERC20 (Ethereum)",
    address: "0x1234567890abcdef1234567890abcdef12345678",
    icon: "₮",
    color: "bg-success-500",
  },
  {
    id: "bitcoin",
    name: "Bitcoin",
    network: "BTC",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    icon: "₿",
    color: "bg-warning-500",
  },
];

interface PendingDeposit {
  id: string;
  cryptoType: CryptoType;
  amount: number;
  amountUSD: number;
  status: "pending" | "confirming" | "confirmed" | "failed";
  confirmations: number;
  requiredConfirmations: number;
  txHash?: string;
  createdAt: number;
  updatedAt: number;
}

export default function CryptoPaymentUI() {
  const [selectedCrypto, setSelectedCrypto] = React.useState<CryptoType>("usdt_trc20");
  const [copied, setCopied] = React.useState(false);
  const [pendingDeposits, setPendingDeposits] = React.useState<PendingDeposit[]>([]);
  const [isTracking, setIsTracking] = React.useState(false);
  const [amount, setAmount] = React.useState("");
  const [showNotification, setShowNotification] = React.useState(false);
  const [notificationMessage, setNotificationMessage] = React.useState("");

  const selected = cryptoOptions.find((c) => c.id === selectedCrypto)!;

  // Fetch pending deposits on mount
  React.useEffect(() => {
    fetchPendingDeposits();
  }, []);

  // Poll for updates on pending deposits
  React.useEffect(() => {
    if (pendingDeposits.length === 0) return;

    const interval = setInterval(() => {
      pendingDeposits.forEach((deposit) => {
        if (deposit.status !== "confirmed" && deposit.status !== "failed") {
          pollDepositStatus(deposit.id);
        }
      });
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [pendingDeposits]);

  async function fetchPendingDeposits() {
    try {
      const res = await fetch("/api/wallet/crypto-deposit/pending");
      const data = await res.json();
      if (data.success) {
        setPendingDeposits(data.deposits);
      }
    } catch (err) {
      console.error("Failed to fetch pending deposits:", err);
    }
  }

  async function pollDepositStatus(depositId: string) {
    try {
      const res = await fetch(`/api/wallet/crypto-deposit/${depositId}/status`);
      const data = await res.json();
      if (data.success) {
        setPendingDeposits((prev) =>
          prev.map((d) => (d.id === depositId ? data.deposit : d))
        );

        // Show notification when confirmed
        if (data.deposit.status === "confirmed") {
          const deposit = data.deposit;
          const cryptoName = cryptoOptions.find((c) => c.id === deposit.cryptoType)?.name || "Crypto";
          showSuccessNotification(
            `${deposit.amount} ${cryptoName} confirmed! $${deposit.amountUSD.toFixed(2)} added to your wallet.`
          );
          
          // Remove from pending list after a delay
          setTimeout(() => {
            setPendingDeposits((prev) => prev.filter((d) => d.id !== depositId));
          }, 3000);
        }
      }
    } catch (err) {
      console.error("Failed to poll deposit status:", err);
    }
  }

  async function trackDeposit() {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setIsTracking(true);

    try {
      // Simulate conversion rate (in production, fetch real rates)
      const conversionRate = selected.id === "bitcoin" ? 45000 : 1;
      const amountNum = parseFloat(amount);
      const amountUSD = amountNum * conversionRate;

      const res = await fetch("/api/wallet/crypto-deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cryptoType: selected.id,
          address: selected.address,
          amount: amountNum,
          amountUSD,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPendingDeposits((prev) => [...prev, data.deposit]);
        setAmount("");
        showSuccessNotification("Deposit tracking started! We'll notify you when confirmed.");
      } else {
        alert(data.error || "Failed to track deposit");
      }
    } catch (err) {
      console.error("Failed to track deposit:", err);
      alert("Failed to track deposit");
    } finally {
      setIsTracking(false);
    }
  }

  function showSuccessNotification(message: string) {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  }

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(selected.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }

  // Generate QR code URL using a free QR code API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    selected.address
  )}`;

  return (
    <div className="space-y-6">
      {/* Success Notification */}
      {showNotification && (
        <div className="fixed right-4 top-4 z-50 animate-slide-in-right">
          <div className="flex items-center gap-3 rounded-xl border border-success-200 bg-success-50 p-4 shadow-lg dark:border-success-800 dark:bg-success-900/20">
            <svg
              className="h-5 w-5 text-success-600 dark:text-success-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm font-medium text-success-900 dark:text-success-100">
              {notificationMessage}
            </p>
          </div>
        </div>
      )}

      {/* Pending Deposits */}
      {pendingDeposits.length > 0 && (
        <Card className="border-primary-200 bg-primary-50 dark:border-primary-800 dark:bg-primary-900/20">
          <div className="p-4">
            <div className="mb-3 flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary-600"></div>
              <h3 className="text-sm font-semibold text-primary-900 dark:text-primary-100">
                Pending Deposits
              </h3>
            </div>
            <div className="space-y-3">
              {pendingDeposits.map((deposit) => {
                const crypto = cryptoOptions.find((c) => c.id === deposit.cryptoType)!;
                const progress = (deposit.confirmations / deposit.requiredConfirmations) * 100;
                
                return (
                  <div
                    key={deposit.id}
                    className="rounded-lg border border-primary-200 bg-white p-3 dark:border-primary-700 dark:bg-neutral-800"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white ${crypto.color}`}
                        >
                          {crypto.icon}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                            {deposit.amount} {crypto.name}
                          </div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">
                            ${deposit.amountUSD.toFixed(2)} USD
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-medium text-primary-700 dark:text-primary-300">
                          {deposit.status === "pending" && "Waiting for transaction..."}
                          {deposit.status === "confirming" && `${deposit.confirmations}/${deposit.requiredConfirmations} confirmations`}
                          {deposit.status === "confirmed" && "Confirmed!"}
                          {deposit.status === "failed" && "Failed"}
                        </div>
                        {deposit.txHash && (
                          <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                            TX: {deposit.txHash.substring(0, 10)}...
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    {deposit.status === "confirming" && (
                      <div className="mt-2">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                          <div
                            className="h-full rounded-full bg-primary-600 transition-all duration-500 dark:bg-primary-400"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {/* Spinner for pending */}
                    {deposit.status === "pending" && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600"></div>
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">
                          Scanning blockchain...
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Crypto Selection */}
      <div>
        <label className="mb-3 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Select Cryptocurrency
        </label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {cryptoOptions.map((crypto) => (
            <button
              key={crypto.id}
              type="button"
              onClick={() => setSelectedCrypto(crypto.id)}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                selectedCrypto === crypto.id
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                  : "border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-xl font-bold text-white ${crypto.color}`}
              >
                {crypto.icon}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {crypto.name}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  {crypto.network}
                </div>
              </div>
              {selectedCrypto === crypto.id && (
                <svg
                  className="h-5 w-5 text-primary-600 dark:text-primary-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Deposit Details */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-6 text-white">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-lg font-bold ${selected.color}`}
            >
              {selected.icon}
            </div>
            <div>
              <div className="text-sm font-medium opacity-90">Deposit {selected.name}</div>
              <div className="text-xs opacity-75">{selected.network}</div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* QR Code */}
          <div className="mb-6 flex justify-center">
            <div className="rounded-2xl border-4 border-neutral-100 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
              <img
                src={qrCodeUrl}
                alt="Wallet QR Code"
                className="h-48 w-48"
                width={200}
                height={200}
              />
            </div>
          </div>

          {/* Wallet Address */}
          <div className="mb-6">
            <label className="mb-2 block text-xs font-medium text-neutral-600 dark:text-neutral-400">
              Wallet Address
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800">
                <code className="block overflow-x-auto text-xs font-mono text-neutral-900 dark:text-neutral-100">
                  {selected.address}
                </code>
              </div>
              <Button
                variant="secondary"
                size="md"
                onClick={copyAddress}
                className="shrink-0"
              >
                {copied ? (
                  <>
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Important Instructions */}
          <div className="space-y-4">
            <div className="rounded-xl border border-warning-200 bg-warning-50 p-4 dark:border-warning-800 dark:bg-warning-900/20">
              <div className="flex gap-3">
                <svg
                  className="h-5 w-5 shrink-0 text-warning-600 dark:text-warning-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-warning-900 dark:text-warning-100">
                    Important Notice
                  </div>
                  <div className="mt-1 text-xs leading-relaxed text-warning-800 dark:text-warning-200">
                    Only send {selected.name} on the {selected.network} network to this address.
                    Sending any other cryptocurrency or using a different network will result in
                    permanent loss of funds.
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-3">
              <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Deposit Instructions
              </div>
              <ol className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
                <li className="flex gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                    1
                  </span>
                  <span>
                    Copy the wallet address above or scan the QR code with your crypto wallet app
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                    2
                  </span>
                  <span>
                    Send {selected.name} from your wallet to this address on the {selected.network}{" "}
                    network
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                    3
                  </span>
                  <span>
                    Wait for blockchain confirmation (typically 1-10 minutes depending on network
                    congestion)
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                    4
                  </span>
                  <span>
                    Your wallet balance will be updated automatically once the transaction is
                    confirmed
                  </span>
                </li>
              </ol>
            </div>

            {/* Network Fees Info */}
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex items-start gap-2">
                <svg
                  className="h-4 w-4 shrink-0 text-neutral-500 dark:text-neutral-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="flex-1 text-xs text-neutral-600 dark:text-neutral-400">
                  <strong className="font-semibold text-neutral-900 dark:text-neutral-100">
                    Network Fees:
                  </strong>{" "}
                  You are responsible for any blockchain network fees charged by your wallet or
                  exchange. Guestly does not charge any deposit fees.
                </div>
              </div>
            </div>

            {/* Minimum Deposit */}
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex items-start gap-2">
                <svg
                  className="h-4 w-4 shrink-0 text-neutral-500 dark:text-neutral-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="flex-1 text-xs text-neutral-600 dark:text-neutral-400">
                  <strong className="font-semibold text-neutral-900 dark:text-neutral-100">
                    Minimum Deposit:
                  </strong>{" "}
                  {selected.id === "bitcoin" ? "0.0001 BTC (~$5)" : "10 USDT"}. Deposits below this
                  amount may not be credited.
                </div>
              </div>
            </div>
          </div>

          {/* Track Deposit Form */}
          <div className="border-t border-neutral-200 p-6 dark:border-neutral-700">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Track Your Deposit
              </h3>
              <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                After sending {selected.name}, enter the amount below to track confirmation status
              </p>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`Amount in ${selected.name}`}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-400"
                />
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={trackDeposit}
                disabled={isTracking || !amount}
                className="shrink-0"
              >
                {isTracking ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Tracking...
                  </>
                ) : (
                  "Track Deposit"
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Support Link */}
      <div className="text-center">
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Need help?{" "}
          <a
            href="/support"
            className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}
