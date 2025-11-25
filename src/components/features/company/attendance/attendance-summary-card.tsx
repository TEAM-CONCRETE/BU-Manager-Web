import { cn } from "@/utils/cn";

type AttendanceSummaryCardProps = {
  label: string;
  value: string;
  dotColor: string;
  textColor: string;
};

export function AttendanceSummaryCard({
  label,
  value,
  dotColor,
  textColor,
}: AttendanceSummaryCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-4 dark:border-dark-border dark:bg-dark-bg-surface">
      <div className="flex items-center gap-2 text-sm">
        <span className={cn("h-2 w-2 rounded-full", dotColor)} />
        <span className="text-text-subtle dark:text-dark-text-base">{label}</span>
      </div>
      <p className={cn("mt-1 text-2xl font-semibold", textColor)}>{value}</p>
    </div>
  );
}
