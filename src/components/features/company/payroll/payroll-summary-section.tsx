import type { PayrollSummary } from "@/lib/api/get-payroll-records";
import { cn } from "@/utils/cn";

const currencyFormatter = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "KRW",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("ko-KR");

const formatAmount = (value?: number) => currencyFormatter.format(value ?? 0);

type PayrollSummarySectionProps = {
  summary?: PayrollSummary;
  headcount: number;
  unpaidCount: number;
};

type SummaryCardProps = {
  label: string;
  value: string;
  iconSrc: string;
  iconBgClass: string;
  valueColorClass: string;
  iconColorClass: string;
};

function SummaryCard({
  label,
  value,
  iconSrc,
  iconBgClass,
  valueColorClass,
  iconColorClass,
}: SummaryCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-border bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-bg-surface">
      <div className="flex items-center gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBgClass}`}>
          <span
            className={cn("h-6 w-6", iconColorClass)}
            style={{
              mask: `url(${iconSrc}) center / contain no-repeat`,
              WebkitMask: `url(${iconSrc}) center / contain no-repeat`,
              display: "inline-block",
            }}
          />
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-text-subtle dark:text-dark-text-base">{label}</span>
          <span className={`text-2xl font-semibold ${valueColorClass}`}>{value}</span>
        </div>
      </div>
    </div>
  );
}

export function PayrollSummarySection({
  summary,
  headcount,
  unpaidCount,
}: PayrollSummarySectionProps) {
  const cards: SummaryCardProps[] = [
    {
      label: "총 인원",
      value: `${numberFormatter.format(summary?.headcount ?? headcount)}명`,
      iconSrc: "/assets/icons/people.svg",
      iconBgClass: "bg-brand-primary/10",
      valueColorClass: "text-brand-primary-strong",
      iconColorClass: "bg-brand-primary-strong",
    },
    {
      label: "총 지급액",
      value: formatAmount(summary?.totalPayrollAmount),
      iconSrc: "/assets/icons/money.svg",
      iconBgClass: "bg-green-100",
      valueColorClass: "text-green-600",
      iconColorClass: "bg-green-600",
    },
    {
      label: "미지급 인원",
      value: `${numberFormatter.format(summary?.unpaidCount ?? unpaidCount)}명`,
      iconSrc: "/assets/icons/clock.svg",
      iconBgClass: "bg-red-100",
      valueColorClass: "text-red-600",
      iconColorClass: "bg-red-500",
    },
  ];

  return (
    <div className="mt-6 grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <SummaryCard key={card.label} {...card} />
      ))}
    </div>
  );
}
