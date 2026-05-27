import React from "react";
import { QRCodeSVG } from "qrcode.react";

export default function QRDisplay({ value }: { value: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="rounded-2xl border border-neutral-100 bg-white p-3 shadow-sm">
        <QRCodeSVG value={value} size={160} level="M" />
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-[10px] font-black uppercase tracking-widest text-navy-400">Pass Code</span>
        <code className="rounded bg-white/10 px-3 py-1 text-xs font-bold tabular-nums tracking-wider text-white">
          {value}
        </code>
      </div>
    </div>
  );
}
