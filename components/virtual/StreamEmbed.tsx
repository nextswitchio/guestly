"use client";

import { StreamingProvider } from "@/lib/events";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";

interface StreamEmbedProps {
  provider: StreamingProvider;
  streamUrl: string;
  eventTitle: string;
}

/**
 * Detect browser capabilities for video streaming
 */
function detectBrowserCapabilities() {
  if (typeof window === "undefined") return { supported: true, message: "" };

  const ua = navigator.userAgent.toLowerCase();
  const isIE = ua.indexOf("msie") !== -1 || ua.indexOf("trident") !== -1;
  const isOldEdge = ua.indexOf("edge/") !== -1;

  if (isIE || isOldEdge) {
    return {
      supported: false,
      message: "Your browser is not supported. Please use Chrome, Firefox, Safari, or modern Edge.",
    };
  }

  // Check for iframe support
  const supportsIframe = "HTMLIFrameElement" in window;
  if (!supportsIframe) {
    return {
      supported: false,
      message: "Your browser does not support embedded video. Please update your browser.",
    };
  }

  return { supported: true, message: "" };
}

/**
 * Extract video ID from various streaming URLs
 */
function extractVideoId(provider: StreamingProvider, url: string): string | null {
  try {
    const urlObj = new URL(url);

    switch (provider) {
      case "YouTube Live": {
        // Handle youtube.com/live/VIDEO_ID or youtube.com/watch?v=VIDEO_ID
        if (urlObj.pathname.startsWith("/live/")) {
          return urlObj.pathname.replace("/live/", "");
        }
        if (urlObj.pathname === "/watch") {
          return urlObj.searchParams.get("v");
        }
        // Handle youtu.be/VIDEO_ID
        if (urlObj.hostname === "youtu.be") {
          return urlObj.pathname.slice(1);
        }
        return null;
      }

      case "Vimeo": {
        // Handle vimeo.com/VIDEO_ID or vimeo.com/event/VIDEO_ID
        const match = urlObj.pathname.match(/\/(?:event\/)?(\d+)/);
        return match ? match[1] : null;
      }

      case "Zoom": {
        // Handle zoom.us/j/MEETING_ID
        const match = urlObj.pathname.match(/\/j\/(\d+)/);
        return match ? match[1] : null;
      }

      case "Google Meet": {
        // Handle meet.google.com/MEETING_CODE
        const match = urlObj.pathname.match(/\/([a-z]{3}-[a-z]{4}-[a-z]{3})/);
        return match ? match[1] : null;
      }

      case "RTMP": {
        // RTMP URLs are used directly
        return url;
      }

      default:
        return null;
    }
  } catch {
    return null;
  }
}

/**
 * Generate embed URL for different streaming providers
 */
function getEmbedUrl(provider: StreamingProvider, streamUrl: string): string | null {
  const videoId = extractVideoId(provider, streamUrl);
  if (!videoId) return null;

  switch (provider) {
    case "YouTube Live":
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1`;

    case "Vimeo":
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`;

    case "Zoom":
      // Zoom doesn't support iframe embedding, return join URL
      return streamUrl;

    case "Google Meet":
      // Google Meet doesn't support iframe embedding, return join URL
      return streamUrl;

    case "RTMP":
      // RTMP requires a video player, not iframe
      return videoId;

    default:
      return null;
  }
}

export default function StreamEmbed({ provider, streamUrl, eventTitle }: StreamEmbedProps) {
  const [browserCheck, setBrowserCheck] = useState({ supported: true, message: "" });
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);

  useEffect(() => {
    // Check browser capabilities
    const check = detectBrowserCapabilities();
    setBrowserCheck(check);

    // Generate embed URL
    const url = getEmbedUrl(provider, streamUrl);
    setEmbedUrl(url);
  }, [provider, streamUrl]);

  // Browser not supported
  if (!browserCheck.supported) {
    return (
      <div className="flex items-center justify-center min-h-[500px] bg-surface-card rounded-lg border border-surface-border p-8">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold mb-2">Browser Not Supported</h3>
          <p className="text-foreground-muted mb-6">{browserCheck.message}</p>
          <div className="space-y-2 text-sm text-foreground-muted">
            <p>Recommended browsers:</p>
            <ul className="list-disc list-inside">
              <li>Google Chrome (latest)</li>
              <li>Mozilla Firefox (latest)</li>
              <li>Safari (latest)</li>
              <li>Microsoft Edge (latest)</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Invalid stream URL
  if (!embedUrl) {
    return (
      <div className="flex items-center justify-center min-h-[500px] bg-surface-card rounded-lg border border-surface-border p-8">
        <div className="text-center max-w-md">
          <Icon name="link" className="w-16 h-16 mx-auto mb-4 text-warning-500" />
          <h3 className="text-xl font-semibold mb-2">Invalid Stream URL</h3>
          <p className="text-foreground-muted mb-4">
            The streaming URL for this event is not configured correctly.
          </p>
          <p className="text-sm text-foreground-subtle">
            Please contact the event organizer for assistance.
          </p>
        </div>
      </div>
    );
  }

  // Zoom - requires external link
  if (provider === "Zoom") {
    return (
      <div className="flex items-center justify-center min-h-[500px] bg-surface-card rounded-lg border border-surface-border p-8">
        <div className="text-center max-w-md">
          <Icon name="video" className="w-16 h-16 mx-auto mb-4 text-primary-500" />
          <h3 className="text-xl font-semibold mb-2">Join via Zoom</h3>
          <p className="text-foreground-muted mb-6">
            This event uses Zoom for streaming. Click the button below to join the meeting.
          </p>
          <a
            href={embedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <span>Join Zoom Meeting</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <p className="text-xs text-foreground-subtle mt-4">
            Make sure you have the Zoom app installed for the best experience.
          </p>
        </div>
      </div>
    );
  }

  // Google Meet - requires external link
  if (provider === "Google Meet") {
    return (
      <div className="flex items-center justify-center min-h-[500px] bg-surface-card rounded-lg border border-surface-border p-8">
        <div className="text-center max-w-md">
          <Icon name="video" className="w-16 h-16 mx-auto mb-4 text-primary-500" />
          <h3 className="text-xl font-semibold mb-2">Join via Google Meet</h3>
          <p className="text-foreground-muted mb-6">
            This event uses Google Meet for streaming. Click the button below to join the meeting.
          </p>
          <a
            href={embedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <span>Join Google Meet</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <p className="text-xs text-foreground-subtle mt-4">
            You may need to sign in with your Google account.
          </p>
        </div>
      </div>
    );
  }

  // RTMP - requires video.js or similar player
  if (provider === "RTMP") {
    return (
      <div className="flex items-center justify-center min-h-[500px] bg-surface-card rounded-lg border border-surface-border p-8">
        <div className="text-center max-w-md">
          <Icon name="video" className="w-16 h-16 mx-auto mb-4 text-primary-500" />
          <h3 className="text-xl font-semibold mb-2">RTMP Stream</h3>
          <p className="text-foreground-muted mb-4">
            This event uses RTMP streaming. A video player will be available when the stream goes live.
          </p>
          <p className="text-sm text-foreground-subtle">
            RTMP player integration coming soon. Please check back closer to the event time.
          </p>
        </div>
      </div>
    );
  }

  // YouTube Live or Vimeo - iframe embed
  return (
    <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
      <iframe
        src={embedUrl}
        title={`${eventTitle} - Live Stream`}
        className="absolute top-0 left-0 w-full h-full rounded-lg border border-surface-border"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{ minHeight: "500px" }}
      />
    </div>
  );
}
