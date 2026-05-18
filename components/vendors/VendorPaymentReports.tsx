"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

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

type VendorPaymentReportsProps = {
  payments: VendorPayment[];
  title?: string;
};

export function VendorPaymentReports({ payments, title = "Payment Reports" }: VendorPaymentReportsProps) {
  const [generating, setGenerating] = useState(false);

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

  const generateCSVReport = () => {
    setGenerating(true);
    
    try {
      // CSV headers
      const headers = [
        "Payment ID",
        "Event Name",
        "Amount",
        "Status",
        "Payment Method",
        "Requested Date",
        "Paid Date",
        "Transaction Reference",
        "Notes",
      ];

      // CSV rows
      const rows = payments.map((payment) => [
        payment.id,
        payment.eventName,
        payment.amount.toString(),
        payment.status,
        payment.paymentMethod || "",
        formatDate(payment.requestedAt),
        payment.paidAt ? formatDate(payment.paidAt) : "",
        payment.transactionReference || "",
        payment.notes || "",
      ]);

      // Combine headers and rows
      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      link.setAttribute("href", url);
      link.setAttribute("download", `vendor-payments-${Date.now()}.csv`);
      link.style.visibility = "hidden";
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to generate CSV report:", error);
      alert("Failed to generate report");
    } finally {
      setGenerating(false);
    }
  };

  const generatePDFReport = () => {
    setGenerating(true);
    
    try {
      // Create HTML content for PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Vendor Payment Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #333;
            }
            h1 {
              color: #1a1a1a;
              border-bottom: 2px solid #4392f1;
              padding-bottom: 10px;
            }
            .summary {
              background: #f5f5f5;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .summary-item {
              display: inline-block;
              margin-right: 30px;
              margin-bottom: 10px;
            }
            .summary-label {
              font-size: 12px;
              color: #666;
            }
            .summary-value {
              font-size: 20px;
              font-weight: bold;
              color: #1a1a1a;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th {
              background: #4392f1;
              color: white;
              padding: 12px;
              text-align: left;
              font-weight: 600;
            }
            td {
              padding: 10px 12px;
              border-bottom: 1px solid #e0e0e0;
            }
            tr:hover {
              background: #f9f9f9;
            }
            .status {
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: 500;
            }
            .status-paid {
              background: #d4edda;
              color: #155724;
            }
            .status-pending {
              background: #fff3cd;
              color: #856404;
            }
            .status-processing {
              background: #d1ecf1;
              color: #0c5460;
            }
            .status-cancelled {
              background: #f8d7da;
              color: #721c24;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e0e0e0;
              font-size: 12px;
              color: #666;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <h1>Vendor Payment Report</h1>
          <p>Generated on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
          
          <div class="summary">
            <div class="summary-item">
              <div class="summary-label">Total Payments</div>
              <div class="summary-value">${payments.length}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Total Amount</div>
              <div class="summary-value">${formatCurrency(payments.reduce((sum, p) => sum + p.amount, 0))}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Paid</div>
              <div class="summary-value">${formatCurrency(payments.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0))}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Pending</div>
              <div class="summary-value">${formatCurrency(payments.filter(p => p.status === "pending" || p.status === "processing").reduce((sum, p) => sum + p.amount, 0))}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Requested</th>
                <th>Paid</th>
                <th>Reference</th>
              </tr>
            </thead>
            <tbody>
              ${payments.map((payment) => `
                <tr>
                  <td>${payment.eventName}</td>
                  <td>${formatCurrency(payment.amount)}</td>
                  <td><span class="status status-${payment.status}">${payment.status.toUpperCase()}</span></td>
                  <td>${formatDate(payment.requestedAt)}</td>
                  <td>${payment.paidAt ? formatDate(payment.paidAt) : "-"}</td>
                  <td>${payment.transactionReference || "-"}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <div class="footer">
            <p>Guestly Vendor Payment Report - Confidential</p>
          </div>
        </body>
        </html>
      `;

      // Open print dialog with the HTML content
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        
        // Wait for content to load then print
        setTimeout(() => {
          printWindow.print();
        }, 250);
      }
    } catch (error) {
      console.error("Failed to generate PDF report:", error);
      alert("Failed to generate report");
    } finally {
      setGenerating(false);
    }
  };

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = payments.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments.filter(p => p.status === "pending" || p.status === "processing").reduce((sum, p) => sum + p.amount, 0);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-foreground-muted mt-1">
            Export payment data for your records
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={generateCSVReport}
            loading={generating}
            disabled={payments.length === 0}
          >
            Export CSV
          </Button>
          <Button
            onClick={generatePDFReport}
            loading={generating}
            disabled={payments.length === 0}
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* Quick Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface-hover rounded-lg p-4">
          <div className="text-xs text-foreground-muted mb-1">Total Payments</div>
          <div className="text-xl font-bold text-foreground">{payments.length}</div>
        </div>
        
        <div className="bg-surface-hover rounded-lg p-4">
          <div className="text-xs text-foreground-muted mb-1">Total Amount</div>
          <div className="text-xl font-bold text-foreground">{formatCurrency(totalAmount)}</div>
        </div>
        
        <div className="bg-surface-hover rounded-lg p-4">
          <div className="text-xs text-foreground-muted mb-1">Paid</div>
          <div className="text-xl font-bold text-success-600 dark:text-success-400">
            {formatCurrency(paidAmount)}
          </div>
        </div>
        
        <div className="bg-surface-hover rounded-lg p-4">
          <div className="text-xs text-foreground-muted mb-1">Pending</div>
          <div className="text-xl font-bold text-warning-600 dark:text-warning-400">
            {formatCurrency(pendingAmount)}
          </div>
        </div>
      </div>
    </Card>
  );
}
