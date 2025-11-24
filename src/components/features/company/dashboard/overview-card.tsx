"use client";

import { ProgressBar } from "@/components/features/company/dashboard/progress-bar";

const IconBuilding = ({ className }: { className?: string }) => (
  <svg
    width="16"
    height="24"
    viewBox="0 0 16 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g clipPath="url(#clip0_657_26242)">
      <path
        d="M2.9375 3C2.00586 3 1.25 3.75586 1.25 4.6875V19.3125C1.25 20.2441 2.00586 21 2.9375 21H6.3125V18.1875C6.3125 17.2559 7.06836 16.5 8 16.5C8.93164 16.5 9.6875 17.2559 9.6875 18.1875V21H13.0625C13.9941 21 14.75 20.2441 14.75 19.3125V4.6875C14.75 3.75586 13.9941 3 13.0625 3H2.9375ZM3.5 11.4375C3.5 11.1281 3.75312 10.875 4.0625 10.875H5.1875C5.49687 10.875 5.75 11.1281 5.75 11.4375V12.5625C5.75 12.8719 5.49687 13.125 5.1875 13.125H4.0625C3.75312 13.125 3.5 12.8719 3.5 12.5625V11.4375ZM7.4375 10.875H8.5625C8.87187 10.875 9.125 11.1281 9.125 11.4375V12.5625C9.125 12.8719 8.87187 13.125 8.5625 13.125H7.4375C7.12813 13.125 6.875 12.8719 6.875 12.5625V11.4375C6.875 11.1281 7.12813 10.875 7.4375 10.875ZM10.25 11.4375C10.25 11.1281 10.5031 10.875 10.8125 10.875H11.9375C12.2469 10.875 12.5 11.1281 12.5 11.4375V12.5625C12.5 12.8719 12.2469 13.125 11.9375 13.125H10.8125C10.5031 13.125 10.25 12.8719 10.25 12.5625V11.4375ZM4.0625 6.375H5.1875C5.49687 6.375 5.75 6.62812 5.75 6.9375V8.0625C5.75 8.37187 5.49687 8.625 5.1875 8.625H4.0625C3.75312 8.625 3.5 8.37187 3.5 8.0625V6.9375C3.5 6.62812 3.75312 6.375 4.0625 6.375ZM6.875 6.9375C6.875 6.62812 7.12813 6.375 7.4375 6.375H8.5625C8.87187 6.375 9.125 6.62812 9.125 6.9375V8.0625C9.125 8.37187 8.87187 8.625 8.5625 8.625H7.4375C7.12813 8.625 6.875 8.37187 6.875 8.0625V6.9375ZM10.8125 6.375H11.9375C12.2469 6.375 12.5 6.62812 12.5 6.9375V8.0625C12.5 8.37187 12.2469 8.625 11.9375 8.625H10.8125C10.5031 8.625 10.25 8.37187 10.25 8.0625V6.9375C10.25 6.62812 10.5031 6.375 10.8125 6.375Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_657_26242">
        <path d="M1.25 3H14.75V21H1.25V3Z" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

type OverviewCardProps = {
  client: string;
  startDate: string;
  endDate: string;
  progress: number;
};

const rows = [
  { key: "client", label: "발주처" },
  { key: "startDate", label: "시작일" },
  { key: "endDate", label: "종료일" },
] as const;

export function OverviewCard({ client, startDate, endDate, progress }: OverviewCardProps) {
  const rowValues: Record<(typeof rows)[number]["key"], string> = {
    client,
    startDate,
    endDate,
  };

  return (
    <div className="rounded-3xl border border-border bg-bg-surface p-6 dark:border-dark-border dark:bg-dark-bg-surface">
      <header className="flex items-center gap-3">
        <div className="flex h-6 w-6 items-center justify-center text-brand-primary dark:text-blue-400">
          <IconBuilding className="h-6 w-6" />
        </div>
        <div>
          <p className="!mb-0 text-xs font-semibold uppercase tracking-wide text-brand-secondary">
            기본 정보
          </p>
          <h2 className="!mb-0 text-xl font-semibold text-text-strong dark:text-dark-text-strong">
            현장 개요
          </h2>
        </div>
      </header>

      <div className="mt-6 space-y-4 text-sm text-text-strong dark:text-dark-text-strong">
        {rows.map((row) => (
          <div key={row.key} className="flex items-center justify-between">
            <span className="text-text-subtle">{row.label}</span>
            <span className="font-semibold">{rowValues[row.key]}</span>
          </div>
        ))}
        <div>
          <div className="mb-2 flex items-center justify-between text-sm text-text-subtle">
            <span>진행률</span>
            <span className="font-semibold text-brand-primary">{progress}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>
      </div>
    </div>
  );
}
