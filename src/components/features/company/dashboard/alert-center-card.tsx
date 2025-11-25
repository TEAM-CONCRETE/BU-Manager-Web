"use client";

import { Button } from "@/components/ui/Button/button";
import { StatusPill, type StatusPillProps } from "@/components/ui/StatusPill/status-pill";

type AlertItem = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  variant: StatusPillProps["variant"];
};

type AlertCenterCardProps = {
  items: AlertItem[];
};

export function AlertCenterCard({ items }: AlertCenterCardProps) {
  return (
    <div className="rounded-3xl border border-border bg-bg-surface p-6 dark:border-dark-border dark:bg-dark-bg-surface">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-secondary">
            Alert center
          </p>
          <h2 className="text-xl font-semibold text-text-strong dark:text-dark-text-strong">
            긴급 알림
          </h2>
        </div>
        <Button variant="ghost" size="sm">
          알림 관리
        </Button>
      </div>
      <div className="mt-6 space-y-4">
        {items.map((alert) => (
          <div
            key={alert.id}
            className="rounded-2xl border border-border p-4 dark:border-dark-border"
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold text-text-strong dark:text-dark-text-strong">
                {alert.title}
              </p>
              <StatusPill size="sm" variant={alert.variant}>
                {alert.timestamp}
              </StatusPill>
            </div>
            <p className="mt-2 text-sm text-text-subtle">{alert.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
