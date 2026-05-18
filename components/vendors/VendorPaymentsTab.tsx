"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

type VendorPayment = {
  id: string;
  vendorUserId: string;
  vendorId: string;
  eventId: string;
  eventName: string;
  organizerUserId: string;
  amount: number;
  status: "pending" | "processing" | "paid" | "cancelled";
  paymentMethod?: "bank_transfer" | "mobile_money" | "crypto";
  requestedAt: number;
  processedAt?: number;
  paidAt?: number;
  notes?: string;
  transactionReference?: string;
};

type PaymentSummary = {
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  totalPayments: number;
  paidPayments: number;
  pendingPayments: number;
};

type VendorPaymentsTabProps = {
  eventId: string;
};

export function VendorPaymentsTab({ eventId }: VendorPaymentsTabProps) {
  const [payments, setPayments] = useState<VendorPayment[]>([]);
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<VendorPayment | null>(null);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"bank_transfer" | "mobile_money" | "crypto">("bank_transfer");
  const [transactionRef, setTransactionRef] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, [eventId]);

  const fetchPayments = async () => {
    try {
      const res = await fetch(`/api/events/${eventId}/vendor-payments`);
      const data = await res.json();
      
      if (data.success) {
        setPayments(data.data.payments);
        setSummary(data.data.summary);
      }
    } catch (error) {
      console.error("Failed to fetch vendor payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (
    paymentId: string,
    status: VendorPayment["status"]
  ) => {
    setProcessing(true);
    try {
      const res = await fetch(`/api/vendor/payments/${paymentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          paymentMethod: status === "paid" ? paymentMethod : undefined,
          transactionReference: status === "paid" ? transactionRef : undefined,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setShowProcessModal(false);
        setSelectedPayment(null);
        setTransactionRef("");
        fetchPayments();
      } else {
        alert(data.error?.message || "Failed to update payment status");
      }
    } catch (error) {
      console.error("Failed to update payment:", error);
      alert("Failed to update payment status");
    } finally {
      setProcessing(false);
    }
  };

  const openProcessModal = (payment: VendorPayment) => {
    setSelectedPayment(payment);
    setShowProcessModal(true);
  };

  const getStatusBadge = (status: VendorPayment["status"]) => {
    const styles = {
      pending: "bg-warning-100 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400",
      processing: "bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400",
      paid: "bg-success-100 text-success-700 dark:bg-success-900/20 dark:text-success-400",
      cancelled: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400",
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
          ))}
        </div>
        <div className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="text-sm text-foreground-muted mb-1">Total Vendor Payments</div>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(summary.totalAmount)}
            </div>
            <div className="text-xs text-foreground-subtle mt-1">
              {summary.totalPayments} request{summary.totalPayments !== 1 ? "s" : ""}
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-sm text-foreground-muted mb-1">Paid</div>
            <div className="text-2xl font-bold text-success-600 dark:text-success-400">
              {formatCurrency(summary.paidAmount)}
            </div>
            <div className="text-xs text-foreground-subtle mt-1">
              {summary.paidPayments} completed
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-sm text-foreground-muted mb-1">Pending</div>
            <div className="text-2xl font-bold text-warning-600 dark:text-warning-400">
              {formatCurrency(summary.pendingAmount)}
            </div>
            <div className="text-xs text-foreground-subtle mt-1">
              {summary.pendingPayments} awaiting payment
            </div>
          </Card>
        </div>
      )}

      {/* Payments List */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Payment Requests</h3>
        
        {payments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-foreground-muted">No vendor payment requests yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="border border-surface-border rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-foreground">
                        Vendor Payment Request
                      </h4>
                      {getStatusBadge(payment.status)}
                    </div>
                    
                    <div className="text-xl font-bold text-foreground mb-3">
                      {formatCurrency(payment.amount)}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-foreground-muted">Requested:</span>
                        <span className="ml-2 text-foreground">
                          {formatDate(payment.requestedAt)}
                        </span>
                      </div>
                      
                      {payment.paidAt && (
                        <div>
                          <span className="text-foreground-muted">Paid:</span>
                          <span className="ml-2 text-foreground">
                            {formatDate(payment.paidAt)}
                          </span>
                        </div>
                      )}

                      {payment.paymentMethod && (
                        <div>
                          <span className="text-foreground-muted">Method:</span>
                          <span className="ml-2 text-foreground capitalize">
                            {payment.paymentMethod.replace("_", " ")}
                          </span>
                        </div>
                      )}

                      {payment.transactionReference && (
                        <div>
                          <span className="text-foreground-muted">Reference:</span>
                          <span className="ml-2 text-foreground font-mono text-xs">
                            {payment.transactionReference}
                          </span>
                        </div>
                      )}
                    </div>

                    {payment.notes && (
                      <div className="text-sm mb-3">
                        <span className="text-foreground-muted">Notes:</span>
                        <p className="text-foreground mt-1">{payment.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    {payment.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => openProcessModal(payment)}
                        >
                          Mark as Paid
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleUpdateStatus(payment.id, "processing")}
                        >
                          Processing
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleUpdateStatus(payment.id, "cancelled")}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                    
                    {payment.status === "processing" && (
                      <Button
                        size="sm"
                        onClick={() => openProcessModal(payment)}
                      >
                        Mark as Paid
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Process Payment Modal */}
      <Modal
        open={showProcessModal}
        onClose={() => setShowProcessModal(false)}
        title="Mark Payment as Paid"
        description="Confirm payment details"
      >
        {selectedPayment && (
          <div className="space-y-4">
            <div className="bg-surface-card border border-surface-border rounded-lg p-4">
              <div className="text-sm text-foreground-muted mb-1">Amount</div>
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(selectedPayment.amount)}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2 border border-surface-border rounded-lg bg-surface-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="bank_transfer">Bank Transfer</option>
                <option value="mobile_money">Mobile Money</option>
                <option value="crypto">Cryptocurrency</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Transaction Reference (Optional)
              </label>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="Enter transaction reference"
                className="w-full px-3 py-2 border border-surface-border rounded-lg bg-surface-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button
                variant="secondary"
                onClick={() => setShowProcessModal(false)}
                disabled={processing}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleUpdateStatus(selectedPayment.id, "paid")}
                loading={processing}
              >
                Confirm Payment
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
