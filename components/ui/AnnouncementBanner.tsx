"use client";
import React from "react";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";

type Announcement = {
  id: string;
  title: string;
  content: string;
  targetType: 'all' | 'attendee' | 'organiser' | 'vendor';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'scheduled' | 'published' | 'expired';
  scheduledAt?: number;
  publishedAt?: number;
  expiresAt?: number;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
};

interface AnnouncementBannerProps {
  announcements: Announcement[];
  onDismiss: (announcementId: string) => void;
}

export function AnnouncementBanner({ announcements, onDismiss }: AnnouncementBannerProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(true);

  // Auto-rotate through announcements every 10 seconds
  React.useEffect(() => {
    if (announcements.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [announcements.length]);

  if (!isVisible || announcements.length === 0) {
    return null;
  }

  const currentAnnouncement = announcements[currentIndex];

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return {
          bg: 'bg-red-50 border-red-200',
          text: 'text-red-800',
          icon: 'text-red-600',
        };
      case 'high':
        return {
          bg: 'bg-amber-50 border-amber-200',
          text: 'text-amber-800',
          icon: 'text-amber-600',
        };
      case 'medium':
        return {
          bg: 'bg-lime/5 border-lime',
          text: 'text-lime',
          icon: 'text-lime',
        };
      case 'low':
        return {
          bg: 'bg-neutral-50 border-neutral-200',
          text: 'text-neutral-800',
          icon: 'text-neutral-600',
        };
      default:
        return {
          bg: 'bg-lime/5 border-lime',
          text: 'text-lime',
          icon: 'text-lime',
        };
    }
  };

  const styles = getPriorityStyles(currentAnnouncement.priority);

  const handleDismiss = async () => {
    try {
      await fetch(`/api/announcements/${currentAnnouncement.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'dismiss' }),
      });
      
      onDismiss(currentAnnouncement.id);
      
      // If this was the last announcement, hide the banner
      if (announcements.length === 1) {
        setIsVisible(false);
      } else {
        // Move to next announcement
        setCurrentIndex((prev) => prev % (announcements.length - 1));
      }
    } catch (error) {
      console.error('Error dismissing announcement:', error);
    }
  };

  const handleView = async () => {
    try {
      await fetch(`/api/announcements/${currentAnnouncement.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'view' }),
      });
    } catch (error) {
      console.error('Error recording view:', error);
    }
  };

  React.useEffect(() => {
    handleView();
  }, [currentAnnouncement.id]);

  return (
    <div className={`border rounded-2xl p-4 mb-6 ${styles.bg}`}>
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 ${styles.icon}`}>
          <Icon 
            name={currentAnnouncement.priority === 'urgent' ? 'alert-circle' : 'megaphone'} 
            size={20} 
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`text-sm font-semibold ${styles.text}`}>
              {currentAnnouncement.title}
            </h3>
            {currentAnnouncement.priority === 'urgent' && (
              <span className="px-2 py-0.5 text-xs font-bold bg-red-100 text-red-700 rounded-full">
                URGENT
              </span>
            )}
          </div>
          
          <p className={`text-sm ${styles.text} opacity-90`}>
            {currentAnnouncement.content}
          </p>
          
          {announcements.length > 1 && (
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-xs ${styles.text} opacity-70`}>
                {currentIndex + 1} of {announcements.length}
              </span>
              <div className="flex gap-1">
                {announcements.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex 
                        ? styles.icon.replace('text-', 'bg-')
                        : 'bg-neutral-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className={`${styles.text} hover:bg-black/5`}
          >
            <Icon name="x" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}