"use client";

import React from "react";
import Switch from "@/components/ui/Switch";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useNotifications } from "@/lib/hooks/useNotifications";
import PushNotificationRegistration from "./PushNotificationRegistration";
import { DEFAULT_PLATFORM_CATALOG, PlatformCategory, normalizeCatalog } from "@/lib/platformCatalog";

interface NotificationPreferencesProps {
  userId: string;
}

export default function NotificationPreferences({ userId }: NotificationPreferencesProps) {
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [generating, setGenerating] = React.useState(false);
  const [preferences, setPreferences] = React.useState({
    geoNotificationsEnabled: true,
    notificationRadius: 10,
    categories: [] as string[],
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
  });
  const [availableCategories, setAvailableCategories] = React.useState<PlatformCategory[]>(DEFAULT_PLATFORM_CATALOG.eventCategories);

  // Subscribe to real-time notifications
  useNotifications({
    userId,
    enabled: preferences.geoNotificationsEnabled,
    onNotification: (notification) => {
      console.log("New notification:", notification);
    },
  });

  React.useEffect(() => {
    fetchPreferences();
    fetch("/api/platform/catalog")
      .then((res) => res.json())
      .then((data) => setAvailableCategories(normalizeCatalog(data).eventCategories))
      .catch(() => setAvailableCategories(DEFAULT_PLATFORM_CATALOG.eventCategories));
  }, []);

  async function fetchPreferences() {
    try {
      const response = await fetch("/api/notifications/preferences");
      const data = await response.json();

      if (data.success) {
        setPreferences({
          geoNotificationsEnabled: data.data.geoNotificationsEnabled,
          notificationRadius: data.data.notificationRadius,
          categories: data.data.categories || [],
          minPrice: data.data.minPrice,
          maxPrice: data.data.maxPrice,
        });
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
    } finally {
      setLoading(false);
    }
  }

  async function savePreferences() {
    setSaving(true);
    try {
      const response = await fetch("/api/notifications/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });

      const data = await response.json();

      if (data.success) {
        // Show success feedback
        alert("Notification preferences saved successfully!");
      } else {
        alert("Failed to save preferences: " + (data.error?.message || data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  }

  async function generateNotifications() {
    setGenerating(true);
    try {
      const response = await fetch("/api/community/notifications/geo", {
        method: "POST",
      });
      const data = await response.json();
      if (data.success) {
        alert(`Found ${data.notifications_created || 0} events you might love! Check your notifications.`);
      } else {
        alert("Failed to generate notifications: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error generating notifications:", error);
      alert("Failed to generate notifications");
    } finally {
      setGenerating(false);
    }
  }

  function toggleCategory(category: string) {
    setPreferences((prev) => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories };
    });
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-12 bg-[var(--surface-card)] rounded-lg"></div>
        <div className="h-12 bg-[var(--surface-card)] rounded-lg"></div>
        <div className="h-12 bg-[var(--surface-card)] rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Push Notification Registration */}
      <div className="p-4 bg-[var(--surface-card)] rounded-lg border border-[var(--surface-border)]">
        <h3 className="font-semibold text-[var(--foreground)] mb-3">
          Push Notifications
        </h3>
        <PushNotificationRegistration />
      </div>

      {/* Enable/Disable Geo Notifications */}
      <div className="flex items-center justify-between p-4 bg-[var(--surface-card)] rounded-lg border border-[var(--surface-border)]">
        <div>
          <h3 className="font-semibold text-[var(--foreground)]">
            Geo-targeted Notifications
          </h3>
          <p className="text-sm text-[var(--foreground-muted)] mt-1">
            Get notified about events happening near you
          </p>
        </div>
        <Switch
          checked={preferences.geoNotificationsEnabled}
          onChange={(checked) =>
            setPreferences((prev) => ({ ...prev, geoNotificationsEnabled: checked }))
          }
        />
      </div>

      {preferences.geoNotificationsEnabled && (
        <>
          {/* Notification Radius */}
          <div className="p-4 bg-[var(--surface-card)] rounded-lg border border-[var(--surface-border)]">
            <label className="block font-semibold text-[var(--foreground)] mb-2">
              Notification Radius
            </label>
            <p className="text-sm text-[var(--foreground-muted)] mb-3">
              How far away should events be to receive notifications?
            </p>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                value={preferences.notificationRadius.toString()}
                onChange={(e) =>
                  setPreferences((prev) => ({
                    ...prev,
                    notificationRadius: parseInt(e.target.value) || 10,
                  }))
                }
                min={1}
                max={100}
              />
              <span className="text-sm text-[var(--foreground-muted)]">km</span>
            </div>
          </div>

          {/* Category Filters */}
          <div className="p-4 bg-[var(--surface-card)] rounded-lg border border-[var(--surface-border)]">
            <label className="block font-semibold text-[var(--foreground)] mb-2">
              Event Categories
            </label>
            <p className="text-sm text-[var(--foreground-muted)] mb-3">
              Select categories to receive notifications for (leave empty for all)
            </p>
            <div className="flex flex-wrap gap-2">
              {availableCategories.filter(category => category.isActive).map((category) => (
                <button
                  key={category.slug}
                  onClick={() => toggleCategory(category.name)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    preferences.categories.includes(category.name)
                      ? "bg-primary-600 text-white"
                      : "bg-[var(--surface-hover)] text-[var(--foreground-muted)] hover:bg-[var(--surface-border)]"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="p-4 bg-[var(--surface-card)] rounded-lg border border-[var(--surface-border)]">
            <label className="block font-semibold text-[var(--foreground)] mb-2">
              Price Range (Optional)
            </label>
            <p className="text-sm text-[var(--foreground-muted)] mb-3">
              Filter notifications by ticket price
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[var(--foreground-muted)] mb-1">
                  Min Price
                </label>
                <Input
                  type="number"
                  placeholder="No minimum"
                  value={preferences.minPrice?.toString() || ""}
                  onChange={(e) =>
                    setPreferences((prev) => ({
                      ...prev,
                      minPrice: e.target.value ? parseInt(e.target.value) : undefined,
                    }))
                  }
                  min={0}
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--foreground-muted)] mb-1">
                  Max Price
                </label>
                <Input
                  type="number"
                  placeholder="No maximum"
                  value={preferences.maxPrice?.toString() || ""}
                  onChange={(e) =>
                    setPreferences((prev) => ({
                      ...prev,
                      maxPrice: e.target.value ? parseInt(e.target.value) : undefined,
                    }))
                  }
                  min={0}
                />
              </div>
            </div>
          </div>

          {/* Generate Notifications Now */}
          <div className="flex justify-end gap-3">
            <Button
              onClick={generateNotifications}
              loading={generating}
              disabled={generating}
              variant="secondary"
            >
              Find Events Near Me
            </Button>
          </div>
        </>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={savePreferences}
          loading={saving}
          disabled={saving}
        >
          Save Preferences
        </Button>
      </div>
    </div>
  );
}
