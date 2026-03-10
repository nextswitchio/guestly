"use client";
import React from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Icon } from "@/components/ui/Icon";
import type { WithdrawalMethod, BankDetails, CryptoWithdrawalDetails } from "@/lib/store";

interface WithdrawalModalProps {
  open: boolean;
  onClose: () => void;
  availableBalance: number;
  onSuccess: () => void;
}

export default function WithdrawalModal({
  open,
  onClose,
  availableBalance,
  onSuccess,
}: WithdrawalModalProps) {
  const [step, setStep] = React.useState<"method" | "details" | "confirm">("method");
  const [method, setMethod] = React.useState<WithdrawalMethod | null>(null);
  const [amount, setAmount] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  // Bank details
  const [accountName, setAccountName] = React.useState("");
  const [accountNumber, setAccountNumber] = React.useState("");
  const [bankName, setBankName] = React.useState("");
  const [swiftCode, setSwiftCode] = React.useState("");

  // Crypto details
  const [cryptoType, setCryptoType] = React.useState<"usdt_trc20" | "usdt_erc20" | "bitcoin">("usdt_trc20");
  const [cryptoAddress, setCryptoAddress] = React.useState("");

  const [notes, setNotes] = React.useState("");

  const handleClose = () => {
    setStep("method");
    setMethod(null);
    setAmount("");
    setError("");
    setAccountName("");
    setAccountNumber("");
    setBankName("");
    setSwiftCode("");
    setCryptoType("usdt_trc20");
    setCryptoAddress("");
    setNotes("");
    onClose();
  };

  const handleMethodSelect = (selectedMethod: WithdrawalMethod) => {
    setMethod(selectedMethod);
    setStep("details");
  };

  const handleDetailsSubmit = () => {
    setError("");

    // Validate amount
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (amountNum < 10) {
      setError("Minimum withdrawal amount is $10");
      return;
    }

    if (amountNum > availableBalance) {
      setError("Insufficient balance");
      return;
    }

    // Validate method-specific details
    if (method === "bank") {
      if (!accountName || !accountNumber || !bankName) {
        setError("Please fill in all bank details");
        return;
      }
    } else if (method === "crypto") {
      if (!cryptoAddress) {
        setError("Please enter crypto address");
        return;
      }
    }

    setStep("confirm");
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError("");

    try {
      const bankDetails: BankDetails | undefined =
        method === "bank"
          ? {
              accountName,
              accountNumber,
              bankName,
              swiftCode: swiftCode || undefined,
            }
          : undefined;

      const cryptoDetails: CryptoWithdrawalDetails | undefined =
        method === "crypto"
          ? {
              cryptoType,
              address: cryptoAddress,
            }
          : undefined;

      const res = await fetch("/api/organizer/wallet/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          method,
          bankDetails,
          cryptoDetails,
          notes: notes || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create withdrawal request");
      }

      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(err.message || "Failed to create withdrawal request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Withdraw Funds" size="md">
      <div className="space-y-6">
        {/* Step 1: Select Method */}
        {step === "method" && (
          <div className="space-y-4">
            <p className="text-sm text-neutral-600">
              Choose your preferred withdrawal method
            </p>

            <div className="grid gap-3">
              <button
                onClick={() => handleMethodSelect("bank")}
                className="flex items-center gap-4 rounded-xl border-2 border-neutral-200 p-4 text-left transition hover:border-primary-500 hover:bg-primary-50"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
                  <Icon name="credit-card" className="w-6 h-6 text-primary-600" />
                </span>
                <div>
                  <p className="font-semibold text-neutral-900">Bank Account</p>
                  <p className="text-sm text-neutral-500">
                    Withdraw to your bank account
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleMethodSelect("crypto")}
                className="flex items-center gap-4 rounded-xl border-2 border-neutral-200 p-4 text-left transition hover:border-primary-500 hover:bg-primary-50"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-2xl">
                  ₿
                </span>
                <div>
                  <p className="font-semibold text-neutral-900">
                    Cryptocurrency
                  </p>
                  <p className="text-sm text-neutral-500">
                    Withdraw to crypto wallet (USDT, BTC)
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Enter Details */}
        {step === "details" && (
          <div className="space-y-4">
            <button
              onClick={() => setStep("method")}
              className="flex items-center gap-2 text-sm text-primary-600 hover:underline"
            >
              ← Back to methods
            </button>

            <Input
              label="Withdrawal Amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              hint={`Available: $${availableBalance.toFixed(2)}`}
            />

            {method === "bank" && (
              <>
                <Input
                  label="Account Name"
                  placeholder="John Doe"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  required
                />
                <Input
                  label="Account Number"
                  placeholder="1234567890"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                />
                <Input
                  label="Bank Name"
                  placeholder="First Bank"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  required
                />
                <Input
                  label="SWIFT Code (Optional)"
                  placeholder="FBNINGLA"
                  value={swiftCode}
                  onChange={(e) => setSwiftCode(e.target.value)}
                />
              </>
            )}

            {method === "crypto" && (
              <>
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">
                    Cryptocurrency
                  </label>
                  <select
                    value={cryptoType}
                    onChange={(e) =>
                      setCryptoType(
                        e.target.value as "usdt_trc20" | "usdt_erc20" | "bitcoin"
                      )
                    }
                    className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  >
                    <option value="usdt_trc20">USDT (TRC20)</option>
                    <option value="usdt_erc20">USDT (ERC20)</option>
                    <option value="bitcoin">Bitcoin</option>
                  </select>
                </div>

                <Input
                  label="Wallet Address"
                  placeholder="Enter your crypto wallet address"
                  value={cryptoAddress}
                  onChange={(e) => setCryptoAddress(e.target.value)}
                  required
                />
              </>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes..."
                rows={3}
                className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-danger-50 p-3 text-sm text-danger-700">
                {error}
              </div>
            )}

            <Button onClick={handleDetailsSubmit} fullWidth>
              Continue
            </Button>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === "confirm" && (
          <div className="space-y-4">
            <button
              onClick={() => setStep("details")}
              className="flex items-center gap-2 text-sm text-primary-600 hover:underline"
            >
              ← Back to details
            </button>

            <div className="rounded-xl bg-neutral-50 p-4 space-y-3">
              <h3 className="font-semibold text-neutral-900">
                Confirm Withdrawal
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Amount:</span>
                  <span className="font-semibold text-neutral-900">
                    ${parseFloat(amount).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-neutral-600">Method:</span>
                  <span className="font-medium text-neutral-900">
                    {method === "bank" ? "Bank Account" : "Cryptocurrency"}
                  </span>
                </div>

                {method === "bank" && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Account:</span>
                      <span className="font-medium text-neutral-900">
                        {accountNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Bank:</span>
                      <span className="font-medium text-neutral-900">
                        {bankName}
                      </span>
                    </div>
                  </>
                )}

                {method === "crypto" && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Crypto:</span>
                      <span className="font-medium text-neutral-900">
                        {cryptoType === "usdt_trc20"
                          ? "USDT (TRC20)"
                          : cryptoType === "usdt_erc20"
                          ? "USDT (ERC20)"
                          : "Bitcoin"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Address:</span>
                      <span className="font-mono text-xs text-neutral-900">
                        {cryptoAddress.slice(0, 10)}...
                        {cryptoAddress.slice(-8)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="rounded-lg bg-warning-50 p-3 text-sm text-warning-800">
              ⚠️ Withdrawal requests are typically processed within 1-3 business
              days. You'll receive a notification once processed.
            </div>

            {error && (
              <div className="rounded-lg bg-danger-50 p-3 text-sm text-danger-700">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setStep("details")}
                fullWidth
              >
                Back
              </Button>
              <Button onClick={handleConfirm} loading={loading} fullWidth>
                Confirm Withdrawal
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
