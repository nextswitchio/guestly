export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="animate-pulse space-y-8">
        <div className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-xl bg-slate-200 dark:bg-slate-800" />
          ))}
        </div>
      </div>
    </div>
  );
}
