export function UserCardSkeleton() {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-6 space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-20 h-20 rounded-xl skeleton-shimmer shrink-0" />
        <div className="space-y-2 flex-1 w-full">
          <div className="h-5 w-48 skeleton-shimmer rounded" />
          <div className="h-4 w-32 skeleton-shimmer rounded" />
          <div className="h-3 w-64 skeleton-shimmer rounded" />
        </div>
      </div>

      <div className="space-y-2 pt-4 border-t border-[var(--border)]">
        <div className="h-3 w-full skeleton-shimmer rounded" />
        <div className="h-3 w-3/4 skeleton-shimmer rounded" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-14 rounded-lg skeleton-shimmer" />
        ))}
      </div>
    </div>
  );
}

export function RepoCardSkeleton() {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5 space-y-3">
      <div className="h-4 w-44 skeleton-shimmer rounded" />
      <div className="space-y-1.5">
        <div className="h-3.5 w-full skeleton-shimmer rounded" />
        <div className="h-3.5 w-2/3 skeleton-shimmer rounded" />
      </div>
      <div className="flex items-center gap-4 pt-3 border-t border-[var(--border)]">
        <div className="h-3 w-16 skeleton-shimmer rounded" />
        <div className="h-3 w-12 skeleton-shimmer rounded" />
        <div className="h-3 w-12 skeleton-shimmer rounded" />
        <div className="h-3 w-24 skeleton-shimmer rounded ml-auto" />
      </div>
    </div>
  );
}

export function ReadmeSkeleton() {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-6 sm:p-8 space-y-4">
      <div className="h-7 w-64 skeleton-shimmer rounded" />
      <div className="h-4 w-full skeleton-shimmer rounded" />
      <div className="h-4 w-5/6 skeleton-shimmer rounded" />
      <div className="h-32 w-full skeleton-shimmer rounded-lg my-4" />
      <div className="h-5 w-40 skeleton-shimmer rounded mt-6" />
      <div className="h-4 w-full skeleton-shimmer rounded" />
      <div className="h-4 w-4/5 skeleton-shimmer rounded" />
    </div>
  );
}