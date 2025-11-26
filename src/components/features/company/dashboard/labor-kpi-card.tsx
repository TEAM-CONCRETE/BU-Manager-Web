"use client";

import { KPICard } from "@/components/features/company/dashboard/kpi-card";
import type { PendingContract } from "@/types/dashboard";

type LaborKpiCardProps = {
  totalPendingContracts: number;
  pendingContracts: PendingContract[];
};

export function LaborKpiCard({ totalPendingContracts, pendingContracts }: LaborKpiCardProps) {
  const items =
    pendingContracts.length > 0
      ? pendingContracts.map((contract) => ({
          label: `[ ${contract.contractType} ] ${contract.targetName}`,
        }))
      : [{ label: "미결 전자계약이 없습니다." }];

  return (
    <KPICard
      title="노무 현황 (KPI)"
      icon="contract"
      highlight={{
        label: "미결 전자계약",
        description: "처리 필요",
        value: `${totalPendingContracts}건`,
        variant: totalPendingContracts > 0 ? "danger" : "success",
      }}
      items={items}
    />
  );
}
