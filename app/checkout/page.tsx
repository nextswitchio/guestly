"use client";
import { Banknote, ShoppingCart, Ticket } from 'lucide-react';
import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ProtectedRoute from "@/components/ProtectedRoute";
import OrderSummary from "@/components/tickets/OrderSummary";
import PaymentMethodSelector from "@/components/tickets/PaymentMethodSelector";
import Button from "@/components/ui/Button";
import Stepper from "@/components/ui/Stepper";
import { useCart } from "@/features/merchandise/CartProvider";
import { useToast } from "@/components/ui/ToastProvider";
import ShippingAddressForm from "@/components/merchandise/ShippingAddressForm";
import { PromoCodeInput } from "@/components/tickets/PromoCodeInput";
import Icon from "@/components/ui/Icon";
import QRDisplay from "@/components/tickets/QRDisplay";
import type { ShippingAddress } from "@/types/merchandise";
import { formatCurrency } from "@/lib/utils";

type Order = {
  id: string;
  eventId: string;
  items: Array<{ type: "General" | "VIP"; quantity: number; price: number }>;
  total: number;
  status: "pending" | "paid";
};

// ── Confetti ────────────────────────────────────────────────────────────────

function Confetti() {
  const pieces = Array.from({ length: 40 });
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            top: -20, 
            left: `${Math.random() * 100}%`,
            rotate: 0,
            opacity: 1
          }}
          animate={{ 
            top: "110%",
            left: `${(Math.random() * 100) + (Math.random() * 20 - 10)}%`,
            rotate: 720,
            opacity: 0
          }}
          transition={{ 
            duration: 2 + Math.random() * 3, 
            delay: Math.random() * 2,
            ease: [0.34, 1.56, 0.64, 1] // Spring easing
          }}
          className="absolute w-2 h-2 rounded-sm"
          style={{ 
            backgroundColor: ['#4392F1', '#248232', '#DF2935', '#F59E0B', '#8B5CF6'][Math.floor(Math.random() * 5)] 
          }}
        />
      ))}
    </div>
  );
}

// ── Summary Components ──────────────────────────────────────────────────────

function SummaryCard({ title, children, total }: { title: string; children: React.ReactNode; total: number }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-dark/50 p-6 backdrop-blur-xl shadow-2xl">
      <h3 className="text-sm font-black uppercase tracking-widest text-white mb-4">{title}</h3>
      <div className="space-y-4">
        {children}
      </div>
      <div className="mt-6 flex justify-between border-t border-white/10 pt-4">
        <span className="text-sm font-bold text-navy-400">Total Amount</span>
        <span className="text-lg font-black text-lime tabular-nums">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}

// ── Checkout content ────────────────────────────────────────────────────────

function CheckoutContent() {
  const { addToast } = useToast();
  const params = useSearchParams();
  const router = useRouter();
  const checkoutType = params.get("type") || "ticket";
  const orderId = params.get("orderId") || "";

  const { 
    items: cartItems, 
    total: cartTotal, 
    clearCart,
    ticketItems,
    ticketTotal,
    clearTicketCart,
    combinedTotal,
    clearAll
  } = useCart();

  const [order, setOrder] = React.useState<Order | null>(null);
  const [method, setMethod] = React.useState<"wallet" | "paystack" | "mobile_money">("wallet");
  const [mobileProvider, setMobileProvider] = React.useState<string>("mpesa");
  const [mobilePhone, setMobilePhone] = React.useState<string>("");
  const [loading, setLoading] = React.useState(checkoutType === "ticket");
  const [processing, setProcessing] = React.useState(false);
  const [showConfetti, setShowConfetti] = React.useState(false);
  const [orderComplete, setOrderComplete] = React.useState(false);
  const [completedOrder, setCompletedOrder] = React.useState<Order | null>(null);
  const [passCodes, setPassCodes] = React.useState<Array<{ id: string; code: string; ticket_type?: string }>>([]);
  const [paystackReturn, setPaystackReturn] = React.useState(false);

  const fetchPassCodes = React.useCallback(async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/pass-codes`);
      const data = await res.json();
      if (data && data.pass_codes) {
        setPassCodes(data.pass_codes);
      }
    } catch {}
  }, []);

  // Paystack callback — poll order status, fall back to direct verification
  React.useEffect(() => {
    const trxref = params.get("trxref");
    const reference = params.get("reference");
    const ref = reference || trxref;
    if (!orderId || !ref) return;
    setPaystackReturn(true);
    let attempts = 0;
    const maxAttempts = 30;
    const poll = setInterval(async () => {
      attempts++;
      try {
        // First check if webhook already updated the order
        const orderRes = await fetch(`/api/orders?id=${orderId}`);
        const orderData = await orderRes.json();
        if (orderData.order && orderData.order.status === "paid") {
          clearInterval(poll);
          setShowConfetti(true);
          setOrderComplete(true);
          setCompletedOrder(orderData.order);
          fetchPassCodes(orderId);
          return;
        }
        // After 5 attempts (~10s), try direct verification with Paystack
        if (attempts >= 5) {
          const verifyRes = await fetch("/api/orders/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId, reference: ref }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            clearInterval(poll);
            setShowConfetti(true);
            setOrderComplete(true);
            const updated = await (await fetch(`/api/orders?id=${orderId}`)).json();
            if (updated.order) setCompletedOrder(updated.order);
            fetchPassCodes(orderId);
            return;
          }
        }
      } catch {}
      if (attempts >= maxAttempts) {
        clearInterval(poll);
        setPaystackReturn(false);
        addToast("Payment is taking longer than expected. Check your orders page.", { type: "warning" });
      }
    }, 2000);
    return () => clearInterval(poll);
  }, [orderId]);
  const [shippingAddress, setShippingAddress] = React.useState<ShippingAddress>({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
  });
  const [shippingErrors, setShippingErrors] = React.useState<Partial<Record<keyof ShippingAddress, string>>>({});
  
  const [promoCode, setPromoCode] = React.useState<string>('');
  const [promoDiscount, setPromoDiscount] = React.useState<number>(0);
  const [savingsTarget, setSavingsTarget] = React.useState<any>(null);
  const [savingsApplied, setSavingsApplied] = React.useState(0);
  const [needsShipping, setNeedsShipping] = React.useState(false);

  const isMerch = checkoutType === "merch";
  const isCombined = checkoutType === "combined";
  const hasTickets = ticketItems.length > 0;
  const hasMerch = cartItems.length > 0;
  const isEmpty = isCombined ? (!hasTickets && !hasMerch) : isMerch ? !hasMerch : (!orderId && !order && !loading);

  React.useEffect(() => {
    if ((isCombined || isMerch) && hasMerch) {
      fetch(`/api/merch/products?ids=${cartItems.map(i => i.productId).join(",")}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.products) {
            setNeedsShipping(data.products.some((p: any) => p.fulfillmentType === "delivery"));
          }
        });
    }
  }, [isMerch, isCombined, cartItems, hasMerch]);

  React.useEffect(() => {
    if (!isMerch && orderId) {
      fetch(`/api/orders?id=${orderId}`)
        .then(res => res.json())
        .then(data => {
          if (data.order) setOrder(data.order);
          setLoading(false);
        });
    }
  }, [orderId, isMerch]);
  
  React.useEffect(() => {
    async function fetchSavings() {
      if (isMerch) return;
      const eventId = isCombined ? ticketItems[0]?.eventId : order?.eventId;
      if (!eventId) return;
      
      try {
        const res = await fetch(`/api/wallet/savings/by-event?eventId=${eventId}`);
        const data = await res.json();
        if (data.success && data.target && data.target.currentAmount > 0) {
          setSavingsTarget(data.target);
          const orderTotalValue = isCombined ? combinedTotal : order?.total || 0;
          setSavingsApplied(Math.min(data.target.currentAmount, orderTotalValue));
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchSavings();
  }, [order, isMerch, isCombined, hasTickets, ticketItems, combinedTotal]);

  function proceed(overrideMethod?: string) {
    if (isCombined || isMerch) {
      if (needsShipping) {
        const errors: any = {};
        ["fullName", "addressLine1", "city", "state", "postalCode", "country", "phone"].forEach(f => {
          if (!shippingAddress[f as keyof ShippingAddress]) errors[f] = "Required";
        });
        if (Object.keys(errors).length > 0) return setShippingErrors(errors);
      }
      setProcessing(true);
      const promises: Promise<any>[] = [];
      if (isCombined && hasTickets) {
        ticketItems.forEach(it => {
          promises.push(fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              eventId: it.eventId,
              items: [{ type: it.type, quantity: it.quantity, price: it.price, attendanceType: it.attendanceType }],
              savingsApplied,
              savingsTargetId: savingsTarget?.id,
            }),
          }).then(r => r.json()));
        });
      }
      if (hasMerch) {
        promises.push(fetch("/api/merch/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventId: cartItems[0].eventId,
            items: cartItems.map(i => ({ productId: i.productId, quantity: i.quantity, size: i.size })),
            shippingAddress: needsShipping ? shippingAddress : undefined,
          }),
        }).then(r => r.json()));
      }
      Promise.all(promises).then(async results => {
        if (results.every(r => r.success)) {
          const firstOrderId = results[0].order?.id || results[0].orderId;
          await payOrder(firstOrderId, results, overrideMethod);
        } else {
          setProcessing(false);
          addToast("Checkout failed", { type: "error" });
        }
      });
      return;
    }
    if (!order) return;
    setProcessing(true);
    payOrder(order.id, undefined, overrideMethod);
  }

  async function payOrder(orderId: string, results?: any[], overrideMethod?: string) {
    const activeMethod = overrideMethod || method;
    const body: any = { orderId, method: activeMethod };
    if (activeMethod === "paystack") {
      body.payment_details = {
        callback_url: `${window.location.origin}/checkout?orderId=${orderId}`,
      };
    }
    if (activeMethod === "mobile_money") {
      body.payment_details = {
        mobile_provider: mobileProvider,
        phone_number: mobilePhone,
      };
    }
    const payRes = await fetch("/api/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const payData = await payRes.json();

    if (!payData.ok) {
      setProcessing(false);
      addToast(payData.error || "Payment failed", { type: "error" });
      return;
    }

    if (activeMethod === "paystack") {
      if (payData.payment_url) {
        window.location.href = payData.payment_url;
      } else {
        setProcessing(false);
        addToast("Failed to initiate Paystack payment. Please try again.", { type: "error" });
      }
      return;
    }

    if (activeMethod === "mobile_money") {
      setProcessing(false);
      setPaystackReturn(true);
      addToast("Check your phone to complete payment", { type: "info" });
      let attempts = 0;
      const poll = setInterval(async () => {
        attempts++;
        try {
          const res = await fetch(`/api/orders?id=${orderId}`);
          const d = await res.json();
          if (d.order && d.order.status === "paid") {
            clearInterval(poll);
            setShowConfetti(true);
            setOrderComplete(true);
            setCompletedOrder(d.order);
            fetchPassCodes(orderId);
            if (results) clearAll();
            return;
          }
          // After 15 attempts (~30s), try verifying via reference if available
          if (attempts >= 15 && d.order?.payment_reference) {
            const verifyRes = await fetch("/api/orders/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId, reference: d.order.payment_reference }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              clearInterval(poll);
              setShowConfetti(true);
              setOrderComplete(true);
              const updated = await (await fetch(`/api/orders?id=${orderId}`)).json();
              if (updated.order) setCompletedOrder(updated.order);
              fetchPassCodes(orderId);
              if (results) clearAll();
              return;
            }
          }
        } catch {}
        if (attempts >= 30) {
          clearInterval(poll);
          setPaystackReturn(false);
          addToast("Payment is taking longer than expected. Your order will be updated once confirmed.", { type: "warning" });
        }
      }, 2000);
      return;
    }

    setShowConfetti(true);
    setProcessing(false);
    setOrderComplete(true);

    const orderRes = await fetch(`/api/orders?id=${orderId}`);
    const orderData = await orderRes.json();
    if (orderData.order) setCompletedOrder(orderData.order);
    fetchPassCodes(orderId);

    if (results) clearAll();
    const targetId = orderId;
  }

  const stepLabels = [
    { label: "Select", description: "Your items" },
    { label: "Details", description: "Shipping & Info" },
    { label: "Payment", description: "Secure checkout" }
  ];

  return (
    <ProtectedRoute allowRoles={["attendee", "organiser", "organizer"]}>
      <div className="min-h-screen bg-navy-950 py-12 relative overflow-hidden">
        {showConfetti && <Confetti />}
        
        {/* Background Glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lime/10 blur-[120px] rounded-full" />
          <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-green-600/10 blur-[100px] rounded-full" />
        </div>

        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatePresence mode="wait">
            {paystackReturn && !orderComplete ? (
              <motion.div
                key="awaiting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-full max-w-md mx-auto space-y-8">
                  <div className="relative flex h-24 w-24 items-center justify-center mx-auto">
                    <div className="absolute inset-0 rounded-full bg-lime/10 animate-ping" />
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-lime/20">
                      <svg className="h-10 w-10 text-lime animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Awaiting Payment Confirmation</h2>
                    <p className="text-navy-300 mt-2 text-sm">
                      {method === "mobile_money"
                        ? "Check your phone to complete the payment via Mobile Money."
                        : "Complete the payment in the Paystack popup that opened."}
                    </p>
                  </div>
                  <div className="flex justify-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-lime animate-bounce" />
                    <span className="h-2 w-2 rounded-full bg-lime animate-bounce [animation-delay:0.15s]" />
                    <span className="h-2 w-2 rounded-full bg-lime animate-bounce [animation-delay:0.3s]" />
                  </div>
                </div>
              </motion.div>
            ) : orderComplete && completedOrder ? (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ 
                  type: "spring", 
                  damping: 20, 
                  stiffness: 300 
                }}
                className="flex flex-col items-center justify-center py-12"
              >
                <div className="w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-white/10 bg-dark/50 backdrop-blur-2xl p-8 sm:p-12 shadow-3xl text-center">
                  {/* Animated Success Icon */}
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring", 
                      damping: 10, 
                      stiffness: 300, 
                      delay: 0.2 
                    }}
                    className="relative flex h-24 w-24 items-center justify-center rounded-full bg-green-600/20 mx-auto mb-8"
                  >
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        ease: [0.68, -0.55, 0.265, 1.55] // Bounce easing
                      }}
                      className="absolute inset-0 rounded-full bg-green-600/10" 
                    />
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-600 shadow-xl shadow-green-600/40">
                      <Icon name="check" size={32} className="text-white" />
                    </div>
                  </motion.div>

                  <div className="space-y-4 mb-8">
                    <h1 className="text-3xl font-black text-white">Order Confirmed!</h1>
                    <p className="text-navy-300 font-medium leading-relaxed max-w-sm mx-auto">
                      Your experience is ready. Show this QR code at the venue.
                    </p>
                  </div>

                  {/* Order Summary Glass Card */}
                  <div className="bg-white/5 rounded-3xl border border-white/5 p-6 mb-8 text-left">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-navy-400">Order Reference</span>
                      <span className="font-mono text-xs text-lime font-bold">{completedOrder.id.split('_')[1]?.toUpperCase() || completedOrder.id.slice(0, 8).toUpperCase()}</span>
                    </div>
                    
                    <div className="space-y-3">
                      {completedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-bold text-white">{item.type} Ticket</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-navy-400">
                              {item.quantity} Unit{item.quantity > 1 ? 's' : ''}
                            </p>
                          </div>
                          <span className="text-sm font-bold text-white">{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                      <span className="text-sm font-black text-white">Total Paid</span>
                      <span className="text-xl font-black text-lime">{formatCurrency(completedOrder.total)}</span>
                    </div>
                  </div>

                  {/* Pass Codes Section */}
                  {passCodes.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-sm font-black uppercase tracking-widest text-navy-400 mb-4 text-center">
                        Your Pass Codes
                      </h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {passCodes.map((pc, idx) => (
                          <motion.div
                            key={pc.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + idx * 0.1 }}
                            className="bg-white rounded-2xl p-4 shadow-2xl shadow-black/20"
                          >
                            <QRDisplay value={pc.code} />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button href="/attendee" size="xl" className="w-full">
                    Go to My Tickets Now
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="checkout"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Header */}
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-12 text-center"
                >
                  <Link href="/" className="inline-flex items-center gap-2 text-navy-400 hover:text-white mb-6 transition-colors font-bold text-sm">
                    <Icon name="chevron-left" size={16} /> Back to Events
                  </Link>
                  <h1 className="text-4xl font-black text-white">Checkout</h1>
                </motion.div>

                {/* Stepper */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-16 mx-auto max-w-3xl"
                >
                  <Stepper steps={stepLabels} currentStep={1} orientation="horizontal" />
                </motion.div>

                {loading ? (
                  <div className="flex justify-center py-24">
                    <div className="flex gap-1">
                      <span className="h-3 w-3 rounded-full bg-lime animate-bounce" />
                      <span className="h-3 w-3 rounded-full bg-lime animate-bounce [animation-delay:0.2s]" />
                      <span className="h-3 w-3 rounded-full bg-lime animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                ) : isEmpty ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-6 py-20 text-center"
                  >
                    <span className="text-7xl"><ShoppingCart className="h-4 w-4 inline-block" /></span>
                    <p className="text-xl font-bold text-navy-200">Your cart is empty.</p>
                    <Button href="/explore" size="lg">Discover Experiences</Button>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
                    {/* Left Column: Forms */}
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: 0.3,
                        type: "spring",
                        damping: 20,
                        stiffness: 300
                      }}
                      className="lg:col-span-7 space-y-8"
                    >
                      {/* Shipping */}
                      {needsShipping && (
                        <div className="rounded-[2rem] border border-white/10 bg-dark/50 p-8 backdrop-blur-xl shadow-2xl">
                          <h2 className="text-xl font-black text-white mb-6">Shipping Address</h2>
                          <ShippingAddressForm value={shippingAddress} onChange={setShippingAddress} errors={shippingErrors} />
                        </div>
                      )}

                      {/* Payment Method */}
                      <div className="rounded-[2rem] border border-white/10 bg-dark/50 p-8 backdrop-blur-xl shadow-2xl">
                        <h2 className="text-xl font-black text-white mb-6">Payment Method</h2>
                        
                        {/* Trust Signals */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                          {[
                            { icon: "shield", text: "Secure SSL" },
                            { icon: "check", text: "Verified" },
                            { icon: "refresh-cw", text: "Refundable" }
                          ].map((t, i) => (
                            <div key={i} className="flex items-center gap-2 rounded-2xl bg-green-600/10 border border-success-500/20 px-4 py-3 text-green-600">
                              <Icon name={t.icon as any} size={16} />
                              <span className="text-[10px] font-black uppercase tracking-widest">{t.text}</span>
                            </div>
                          ))}
                        </div>

                        <PaymentMethodSelector 
                          value={method} 
                          onChange={(m) => {
                            setMethod(m);
                            if (m === "mobile_money") {
                              setMobileProvider("mpesa");
                              setMobilePhone("");
                            } else if (order) {
                              proceed(m);
                            }
                          }}
                          orderTotal={isCombined ? combinedTotal : isMerch ? cartTotal : order?.total}
                          savingsApplied={savingsApplied}
                          onFundWallet={() => router.push("/wallet")}
                        />

                        {!isMerch && order && (
                          <div className="mt-8 pt-8 border-t border-white/5">
                            <PromoCodeInput
                              eventId={order.eventId}
                              onApply={(c, d) => { setPromoCode(c); setPromoDiscount(d); }}
                              onRemove={() => { setPromoCode(''); setPromoDiscount(0); }}
                              appliedCode={promoCode}
                              appliedDiscount={promoDiscount}
                            />
                          </div>
                        )}
                      </div>

                      {/* Desktop Proceed Button */}
                      <div className="hidden lg:block">
                        <Button onClick={() => proceed()} className="w-full h-16 text-lg font-black shadow-2xl shadow-primary-500/20" size="xl" disabled={processing}>
                          {processing ? "Processing Experience..." : "Confirm & Pay"}
                        </Button>
                        <p className="mt-4 text-center text-xs text-navy-400 font-medium">
                          Secure payment powered by <span className="text-white font-bold">Guestly Pay</span>
                        </p>
                      </div>
                    </motion.div>

                    {/* Right Column: Summary */}
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: 0.4,
                        type: "spring",
                        damping: 20,
                        stiffness: 300
                      }}
                      className="lg:col-span-5 space-y-6"
                    >
                      {/* Savings Banner */}
                      {savingsApplied > 0 && (
                        <motion.div 
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{
                            type: "spring",
                            damping: 15,
                            stiffness: 300
                          }}
                          className="rounded-3xl bg-green-600/10 border border-success-500/20 p-6 flex gap-4"
                        >
                          <div className="h-12 w-12 shrink-0 rounded-2xl bg-green-600 flex items-center justify-center text-2xl"><Banknote className="h-4 w-4 inline-block" /></div>
                          <div>
                            <p className="text-sm font-black text-white uppercase tracking-wider">Savings Applied!</p>
                            <p className="text-xs text-green-600 font-medium mt-1">
                              We&apos;ve used {formatCurrency(savingsApplied)} from your savings target for this event.
                            </p>
                          </div>
                        </motion.div>
                      )}

                      <SummaryCard title="Order Summary" total={isCombined ? combinedTotal : isMerch ? cartTotal : (order?.total || 0)}>
                        <AnimatePresence mode="popLayout">
                          {isCombined && (
                            <div className="space-y-6">
                              {ticketItems.map((it, i) => (
                                <div key={i} className="flex justify-between items-center group">
                                  <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-lime/20 flex items-center justify-center text-xl"><Ticket className="h-4 w-4 inline-block" /></div>
                                    <div>
                                      <p className="text-sm font-black text-white">{it.eventTitle}</p>
                                      <p className="text-[10px] font-black uppercase tracking-widest text-navy-400">{it.type} Ticket • ×{it.quantity}</p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-white">{formatCurrency(it.price * it.quantity)}</span>
                              </div>
                            ))}
                            {cartItems.map((it, i) => (
                                <div key={i} className="flex justify-between items-center">
                                  <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-xl">{it.image}</div>
                                    <div>
                                      <p className="text-sm font-black text-white">{it.name}</p>
                                      <p className="text-[10px] font-black uppercase tracking-widest text-navy-400">{it.size || 'One Size'} • ×{it.quantity}</p>
                                    </div>
                                  </div>
                                  <span className="text-sm font-bold text-white">{formatCurrency(it.price * it.quantity)}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          {!isCombined && isMerch && cartItems.map((it, i) => (
                            <div key={i} className="flex justify-between items-center">
                              <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-xl">{it.image}</div>
                                <div>
                                  <p className="text-sm font-black text-white">{it.name}</p>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-navy-400">{it.size || 'One Size'} • ×{it.quantity}</p>
                                </div>
                              </div>
                              <span className="text-sm font-bold text-white">{formatCurrency(it.price * it.quantity)}</span>
                            </div>
                          ))}
                          {!isCombined && !isMerch && order?.items.map((it, i) => (
                            <div key={i} className="flex justify-between items-center">
                              <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-lime/20 flex items-center justify-center text-xl"><Ticket className="h-4 w-4 inline-block" /></div>
                                <div>
                                  <p className="text-sm font-black text-white">{it.type} Ticket</p>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-navy-400">×{it.quantity}</p>
                                </div>
                              </div>
                              <span className="text-sm font-bold text-white">{formatCurrency(it.price * it.quantity)}</span>
                            </div>
                          ))}
                        </AnimatePresence>
                      </SummaryCard>

                      {/* Mobile Sticky Button */}
                      <div className="lg:hidden sticky bottom-4 z-50">
                        <Button onClick={() => proceed()} className="w-full h-16 text-lg font-black shadow-3xl shadow-primary-500/40" size="xl" disabled={processing}>
                          {processing ? "Processing..." : `Pay ${formatCurrency(isCombined ? combinedTotal : isMerch ? cartTotal : (order?.total || 0))}`}
                        </Button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-navy-950" />}>
      <CheckoutContent />
    </Suspense>
  );
}
