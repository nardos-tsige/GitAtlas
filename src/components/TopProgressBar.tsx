interface TopProgressBarProps {
  isLoading: boolean;
}

export function TopProgressBar({ isLoading }: TopProgressBarProps) {
  if (!isLoading) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 h-px z-50 overflow-hidden"
      role="progressbar"
      aria-busy="true"
    >
      <div className="h-full w-full bg-[var(--text-primary)] animate-shimmer-slide" />
    </div>
  );
}