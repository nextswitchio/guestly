"use client";

import React, { useEffect, useState } from "react";
import { requestPushPermission, registerServiceWorker } from "@/lib/hooks/useNotifications";
import Icon from "@/components/ui/Icon";

interface PushNotificationRegistrationProps {
  vapidPublicKey?: string;
}

export default function PushNotificationRegistration({
  vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
}: PushNotificationRegistrationProps) {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    if (permission === "granted" && "serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration("/sw.js").then((reg) => {
        if (reg) {
          reg.pushManager.getSubscription().then((sub) => {
            setIsSubscribed(!!sub);
          });
        }
      });
    }
  }, [permission]);

  async function handleSubscribe() {
    setLoading(true);
    setError(null);

    try {
      const granted = await requestPushPermission();
      if (!granted) {
        setError("Permission denied. Please enable notifications in your browser settings.");
        return;
      }

      setPermission("granted");

      if (vapidPublicKey) {
        const subscription = await registerServiceWorker(vapidPublicKey);

        const response = await fetch("/api/community/push/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            endpoint: subscription.endpoint,
            keys: {
              p256dh: arrayBufferToBase64(subscription.getKey("p256dh")),
              auth: arrayBufferToBase64(subscription.getKey("auth")),
            },
          }),
        });

        if (response.ok) {
          setIsSubscribed(true);
        } else {
          setError("Failed to register device for push notifications.");
        }
      } else {
        // No VAPID key, just enable in-app notifications
        setIsSubscribed(true);
      }
    } catch (err) {
      console.error("Push subscription error:", err);
      setError("Failed to enable push notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function arrayBufferToBase64(buffer: ArrayBuffer | null): string {
    if (!buffer) return "";
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  if (permission === "granted" && isSubscribed) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
        <Icon name="check-circle" size={16} className="text-green-500" />
        <span className="font-medium">Push notifications enabled</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3 rounded-xl bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-700">
        <Icon name="bell" size={16} className="text-blue-500 mt-0.5 shrink-0" />
        <div>
          <p className="font-medium">Stay updated with events near you</p>
          <p className="text-xs text-blue-600 mt-1">
            Get notified about events happening in your city that match your interests.
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <Icon name="alert-circle" size={16} className="text-red-500" />
          <span>{error}</span>
        </div>
      )}

      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Icon name="loader" size={16} className="animate-spin" />
            Enabling...
          </>
        ) : (
          <>
            <Icon name="bell" size={16} />
            Enable Push Notifications
          </>
        )}
      </button>
    </div>
  );
}
