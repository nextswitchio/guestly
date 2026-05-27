"use client";
import { ArrowLeft } from 'lucide-react';
import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import QRDisplay from "@/components/tickets/QRDisplay";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Confetti animation component using framer-motion
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

interface ConfirmationContentProps {
  order: {
    id: string;
    status: string;
    items: Array<{ type: string; quantity: number; price: number; attendanceType?: "physical" | "virtual" }>;
    total: number;
  };
}

function ConfirmationContent({ order }: ConfirmationContentProps) {
  const [showConfetti, setShowConfetti] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {showConfetti && <Confetti />}
      
      {/* Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-success-500/10 blur-[100px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ 
          duration: 0.6, 
          ease: [0.34, 1.56, 0.64, 1] // Spring easing
        }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-navy-900/50 backdrop-blur-2xl p-8 sm:p-12 shadow-3xl text-center">
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
            className="relative flex h-24 w-24 items-center justify-center rounded-full bg-success-500/20 mx-auto mb-8"
          >
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: [0.68, -0.55, 0.265, 1.55] // Bounce easing
              }}
              className="absolute inset-0 rounded-full bg-success-500/10" 
            />
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-500 shadow-xl shadow-success-500/40">
              <Icon name="check" size={32} className="text-white" />
            </div>
          </motion.div>

          <div className="space-y-4 mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.4,
                type: "spring",
                damping: 20,
                stiffness: 300
              }}
              className="text-3xl font-black text-white"
            >
              Order Confirmed!
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.5,
                type: "spring",
                damping: 20,
                stiffness: 300
              }}
              className="text-navy-300 font-medium leading-relaxed max-w-sm mx-auto"
            >
              Your experience is ready. We&apos;ve sent your tickets and receipt to your email.
            </motion.p>
          </div>

          {/* Order Summary Glass Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/5 rounded-3xl border border-white/5 p-6 mb-8 text-left"
          >
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
              <span className="text-[10px] font-black uppercase tracking-widest text-navy-400">Order Reference</span>
              <span className="font-mono text-xs text-primary-400 font-bold">{order.id.split('_')[1]?.toUpperCase() || order.id.slice(0, 8).toUpperCase()}</span>
            </div>
            
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-white">{item.type} Ticket</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-navy-400">
                      {item.attendanceType || 'Physical'} • {item.quantity} Unit{item.quantity > 1 ? 's' : ''}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-white">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
              <span className="text-sm font-black text-white">Total Amount</span>
              <span className="text-xl font-black text-primary-400">${order.total.toFixed(2)}</span>
            </div>
          </motion.div>

          {/* QR Code Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-[2rem] p-8 mb-8 shadow-2xl shadow-black/20"
          >
            <div className="mx-auto w-full max-w-[200px]">
              <QRDisplay value={order.id} />
            </div>
            <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-navy-400">
              Scan at the venue entrance
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col gap-3"
          >
            <Button href="/attendee" size="xl" className="w-full">
              Go to My Tickets
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" size="lg" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                <Icon name="share" size={16} className="mr-2" /> Share
              </Button>
              <Button href={`/receipt/${order.id}`} variant="outline" size="lg" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                <Icon name="download" size={16} className="mr-2" /> Receipt
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          <Link href="/explore" className="text-navy-400 hover:text-white text-sm font-bold transition-colors">
           <ArrowLeft className="h-4 w-4 inline" /> Continue Exploring Events
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function ConfirmationPage({ params }: { params: Promise<{ orderId: string }> }) {
  const [order, setOrder] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [orderId, setOrderId] = React.useState<string>("");

  React.useEffect(() => {
    params.then(({ orderId }) => setOrderId(orderId));
  }, [params]);

  React.useEffect(() => {
    if (!orderId) return;
    async function load() {
      try {
        const res = await fetch(`/api/orders?id=${orderId}`);
        const data = await res.json();
        if (res.ok && data.order?.status === "paid") {
          setOrder(data.order);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [orderId]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-navy-950 flex items-center justify-center">
          <div className="flex gap-1">
            <span className="h-3 w-3 rounded-full bg-primary-500 animate-bounce" />
            <span className="h-3 w-3 rounded-full bg-primary-500 animate-bounce [animation-delay:0.2s]" />
            <span className="h-3 w-3 rounded-full bg-primary-500 animate-bounce [animation-delay:0.4s]" />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!order) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-4 text-center">
          <Icon name="x-circle" className="text-white w-16 h-16 mb-6" />
          <h1 className="text-2xl font-black text-white mb-2">Order not found</h1>
          <p className="text-navy-400 mb-8 max-w-xs">We couldn&apos;t find this order or it hasn&apos;t been paid yet.</p>
          <Button href="/explore" variant="outline">Browse Events</Button>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <ConfirmationContent order={order} />
    </ProtectedRoute>
  );
}
