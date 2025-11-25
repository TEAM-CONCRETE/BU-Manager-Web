type ProgressBarProps = {
  value: number;
};

export function ProgressBar({ value }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="h-2 rounded-full bg-bg-subtle dark:bg-dark-bg-surface">
      <div
        className="h-2 rounded-full bg-brand-primary transition-[width]"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
