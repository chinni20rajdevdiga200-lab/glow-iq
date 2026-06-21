import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} />;
}

export function SkeletonCard({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-3xl", className)} />;
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={cn("skeleton h-4 rounded-xl", i === lines - 1 && "w-2/3")} />
      ))}
    </div>
  );
}
