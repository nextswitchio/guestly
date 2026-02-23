import React from "react";

// ── Icons ────────────────────────────────────────────────────────────────────

function PlayIcon() {
  return (
    <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function SignalIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );
}

interface StreamEmbedProps {
  streamUrl?: string;
  poster?: string;
  title?: string;
}

export default function StreamEmbed({ streamUrl, poster, title }: StreamEmbedProps) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-neutral-900 shadow-xl">
      {streamUrl ? (
        <>
          <iframe
            src={streamUrl}
            className="absolute inset-0 h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          {/* Live indicator */}
          <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-lg bg-red-600/90 px-2.5 py-1 text-xs font-bold text-white shadow-lg backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            LIVE
          </div>
          {title && (
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent px-4 pb-4 pt-8">
              <p className="text-sm font-medium text-white/90">{title}</p>
            </div>
          )}
        </>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4">
          {/* Animated waiting state */}
          <div className="relative">
            {/* Pulsing rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-24 w-24 animate-ping rounded-full bg-white/5" />
            </div>
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/10 bg-white/5">
              <PlayIcon />
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-white/80">
              <SignalIcon />
              <p className="text-base font-semibold">Stream Starting Soon</p>
            </div>
            <p className="mt-1.5 text-sm text-white/40">
              Please wait for the host to begin the broadcast
            </p>
          </div>

          {/* Subtle animated dots */}
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 animate-bounce rounded-full bg-white/20" style={{ animationDelay: "0ms" }} />
            <span className="h-2 w-2 animate-bounce rounded-full bg-white/20" style={{ animationDelay: "150ms" }} />
            <span className="h-2 w-2 animate-bounce rounded-full bg-white/20" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      )}
    </div>
  );
}
