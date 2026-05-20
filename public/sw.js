/* eslint-env serviceworker */
const CACHE_NAME = "guestly-v1";
const NOTIFICATION_ICON = "/icons/icon-192.png";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
});

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "Guestly", body: event.data.text() };
  }

  const options = {
    body: payload.body || "",
    icon: payload.icon || NOTIFICATION_ICON,
    badge: payload.badge || "/icons/badge-72.png",
    image: payload.image || null,
    data: {
      url: payload.url || "/",
      eventId: payload.eventId || null,
      notificationId: payload.notificationId || null,
      type: payload.type || "general",
    },
    actions: payload.actions || [
      { action: "view", title: "View" },
      { action: "dismiss", title: "Dismiss" },
    ],
    tag: payload.tag || "guestly-notification",
    renotify: true,
    requireInteraction: payload.requireInteraction || false,
    silent: false,
  };

  event.waitUntil(self.registration.showNotification(payload.title || "Guestly", options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") return;

  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      // Check if there's already a window open
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes(self.location.origin) && "focus" in client) {
          // Navigate to the notification URL
          if (client.url !== urlToOpen) {
            client.navigate(urlToOpen);
          }
          return client.focus();
        }
      }
      // No window open, open a new one
      return clients.openWindow(urlToOpen);
    })
  );
});

self.addEventListener("notificationclose", (event) => {
  // Optionally track when users dismiss notifications
  const notificationId = event.notification.data?.notificationId;
  if (notificationId) {
    // Could send analytics back to server
    console.log("Notification dismissed:", notificationId);
  }
});
