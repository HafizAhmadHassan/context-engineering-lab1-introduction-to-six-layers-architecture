'use client';

export function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-secondary rounded-lg w-1/3" />
      <div className="h-32 bg-secondary rounded-xl" />
      <div className="grid grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-secondary rounded-xl" />
        ))}
      </div>
      <div className="h-64 bg-secondary rounded-xl" />
    </div>
  );
}
