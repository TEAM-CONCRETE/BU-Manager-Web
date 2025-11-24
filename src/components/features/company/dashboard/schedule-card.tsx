"use client";

import { Button } from "@/components/ui/Button/button";

type ScheduleItem = {
  id: string;
  title: string;
  date: string;
  owner: string;
};

type ScheduleCardProps = {
  items: ScheduleItem[];
};

export function ScheduleCard({ items }: ScheduleCardProps) {
  return (
    <div className="rounded-3xl border border-border bg-bg-surface p-6 dark:border-dark-border dark:bg-dark-bg-surface">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-secondary">
            일정 요약
          </p>
          <h2 className="text-xl font-semibold text-text-strong dark:text-dark-text-strong">
            주요 일정
          </h2>
        </div>
        <Button variant="ghost" size="sm">
          전체 보기
        </Button>
      </div>
      <ul className="mt-6 space-y-4">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-2xl border border-border px-4 py-3 text-sm dark:border-dark-border"
          >
            <p className="font-semibold text-text-strong dark:text-dark-text-strong">
              {item.title}
            </p>
            <p className="text-text-subtle">{item.date}</p>
            <p className="text-xs text-text-subtle">{item.owner}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
