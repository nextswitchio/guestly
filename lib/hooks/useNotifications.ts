import { useEffect, useCallback, useRef } from "react";
import {
  subscribeNotifications,
  unsubscribeNotifications,
  onNewNotification,
  type NewNotificationEvent,
} from "@/lib/websocket";

interface UseNotificationsOptions {
  userId?: string;
  enabled?: boolean;
  onNotification?: (notification: NewNotificationEvent) => void;
}

export function useNotifications({
  userId,
  enabled = true,
  onNotification,
}: UseNotificationsOptions = {}) {
  const onNotificationRef = useRef(onNotification);
  onNotificationRef.current = onNotification;

  const handleNotification = useCallback((notification: NewNotificationEvent) => {
    // Show browser notification if supported
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(notification.title, {
        body: notification.message,
        icon: "/icons/icon-192.png",
        tag: notification.id,
      });
    }

    // Call custom handler
    onNotificationRef.current?.(notification);
  }, []);

  useEffect(() => {
    if (!enabled || !userId) return;

    subscribeNotifications(userId);
    const cleanup = onNewNotification(handleNotification);

    return () => {
      cleanup();
      unsubscribeNotifications();
    };
  }, [userId, enabled, handleNotification]);

  return {
    subscribe: () => {
      if (userId) subscribeNotifications(userId);
    },
    unsubscribe: () => {
      unsubscribeNotifications();
    },
  };
}

export async function requestPushPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === "granted";
}

export async function registerServiceWorker(vapidPublicKey: string) {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    throw new Error("Push notifications not supported");
  }

  const registration = await navigator.serviceWorker.register("/sw.js");
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
  });

  return subscription;
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
