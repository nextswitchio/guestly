import React from "react";

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export default function QRDisplay({ value }: { value: string }) {
  const size = 21;
  const h = hash(value);
  const cells: boolean[] = [];
  for (let i = 0; i < size * size; i++) {
    const bit = (h >> (i % 32)) & 1;
    cells.push(!!bit);
  }
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${size}, 8px)`,
            gridTemplateRows: `repeat(${size}, 8px)`,
          }}
        >
          {cells.map((on, i) => (
            <div
              key={i}
              className={on ? "bg-neutral-900" : "bg-white"}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-xs font-medium text-neutral-600">Ticket ID</span>
        <code className="rounded bg-neutral-100 px-2 py-0.5 text-xs tabular-nums text-neutral-900">
          {value}
        </code>
      </div>
    </div>
  );
}

